import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  email: z.string().trim().email('Valid email is required').max(200),
  phone: z.string().trim().max(50).optional().default(''),
  company: z.string().trim().max(120).optional().default(''),
  message: z.string().trim().min(1, 'Message is required').max(5000),
  consent: z.literal(true),
})

let mongoClient

async function getDb() {
  if (!process.env.MONGO_URL || !process.env.DB_NAME) {
    return null
  }

  if (!mongoClient) {
    mongoClient = new MongoClient(process.env.MONGO_URL)
    await mongoClient.connect()
  }

  return mongoClient.db(process.env.DB_NAME)
}

async function saveSubmission(submission) {
  try {
    const db = await getDb()
    if (!db) return

    await db.collection('contact_submissions').insertOne({
      ...submission,
      createdAt: new Date(),
    })
  } catch (error) {
    console.error('Failed to save contact submission:', error)
  }
}

async function sendWithResend({ name, email, phone, company, message }) {
  const resendApiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL || 'hello@zipbolt.com'
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Zipbolt Contact <onboarding@resend.dev>'

  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY is not configured')
  }

  const emailHtml = `
    <h2>New Zipbolt contact request</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
    <p><strong>Company:</strong> ${company || 'Not provided'}</p>
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, '<br />')}</p>
  `

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject: `Zipbolt Contact Request from ${name}`,
      html: emailHtml,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Resend request failed: ${response.status} ${errorText}`)
  }

  return response.json()
}

export async function POST(request) {
  try {
    const body = await request.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message || 'Invalid form submission',
        },
        { status: 400 }
      )
    }

    const submission = parsed.data

    await sendWithResend(submission)
    await saveSubmission(submission)

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully.',
    })
  } catch (error) {
    console.error('Contact form submission failed:', error)

    return NextResponse.json(
      {
        error: 'We could not send your message right now. Please try again shortly.',
      },
      { status: 500 }
    )
  }
}
