import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'

const MONGO_URL = process.env.MONGO_URL
const DB_NAME = process.env.DB_NAME || 'wedding'

let cachedClient = null
async function getDb() {
  if (!cachedClient) {
    cachedClient = new MongoClient(MONGO_URL)
    await cachedClient.connect()
  }
  return cachedClient.db(DB_NAME)
}

function json(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    },
  })
}

export async function OPTIONS() { return json({}, 200) }

export async function GET(request, { params }) {
  const path = (params?.path || []).join('/')
  try {
    if (path === '' || path === 'health') return json({ ok: true, service: 'wedding-api' })
    if (path === 'rsvps') {
      const db = await getDb()
      const rsvps = await db.collection('rsvps').find({}).sort({ createdAt: -1 }).toArray()
      return json({ rsvps })
    }
    return json({ error: 'Not found' }, 404)
  } catch (e) {
    return json({ error: e.message }, 500)
  }
}

export async function POST(request, { params }) {
  const path = (params?.path || []).join('/')
  try {
    const body = await request.json()
    if (path === 'rsvp') {
      const db = await getDb()
      const doc = {
        id: uuidv4(),
        invitationId: body.invitationId || 'default',
        guests: body.guests || [],
        message: body.message || '',
        createdAt: new Date().toISOString(),
      }
      await db.collection('rsvps').insertOne(doc)
      return json({ ok: true, rsvp: doc })
    }
    return json({ error: 'Not found' }, 404)
  } catch (e) {
    return json({ error: e.message }, 500)
  }
}
