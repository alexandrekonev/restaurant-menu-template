/**
 * DeepL translation proxy.
 * Called from the Sanity Studio plugin when the manager clicks "Translate BG → EN".
 */
import { NextRequest, NextResponse } from 'next/server'

interface DeepLResponse {
  translations: { detected_source_language: string; text: string }[]
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.DEEPL_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'DEEPL_API_KEY not configured' }, { status: 500 })
  }

  const body = await req.json() as { texts: string[] }
  const { texts } = body

  if (!texts?.length) {
    return NextResponse.json({ error: 'No texts provided' }, { status: 400 })
  }

  // DeepL Free tier uses api-free.deepl.com, Paid uses api.deepl.com
  const isFree = apiKey.endsWith(':fx')
  const endpoint = isFree
    ? 'https://api-free.deepl.com/v2/translate'
    : 'https://api.deepl.com/v2/translate'

  const params = new URLSearchParams()
  params.set('target_lang', 'EN')
  params.set('source_lang', 'BG')
  texts.forEach((t) => params.append('text', t))

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: `DeepL error: ${err}` }, { status: res.status })
  }

  const data = await res.json() as DeepLResponse
  return NextResponse.json({
    translations: data.translations.map((t) => t.text),
  })
}