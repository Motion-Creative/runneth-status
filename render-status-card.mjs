import { readFile, writeFile } from 'node:fs/promises'

const STATUS_FILE = new URL('./status.json', import.meta.url)
const OUTPUT_FILE = new URL('./status.svg', import.meta.url)

const PRIMITIVES = [
  { id: 'routines', label: 'Routines' },
  { id: 'slack', label: 'Slack' },
  { id: 'notion', label: 'Notion' },
  { id: 'google_drive', label: 'Google Drive' },
  { id: 'web', label: 'Web' },
  { id: 'data_access', label: 'Data access' },
  { id: 'general', label: 'General' },
]

const WIDTH = 960
const PADDING = 32
const CARD_GAP = 12
const PRIMITIVE_CARD_WIDTH = 214
const PRIMITIVE_CARD_HEIGHT = 58

const assertString = (value, name) => {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${name} must be a non-empty string`)
  }

  return value
}

const assertStringArray = (value, name) => {
  if (!Array.isArray(value) || !value.every((item) => typeof item === 'string')) {
    throw new Error(`${name} must be an array of strings`)
  }

  return value
}

const parseStatusFeed = (value) => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('status feed must be an object')
  }

  const feed = value
  const updatedAt = assertString(feed.updatedAt, 'updatedAt')
  if (!Array.isArray(feed.active)) {
    throw new Error('active must be an array')
  }

  return {
    active: feed.active.map((notice, index) => {
      if (typeof notice !== 'object' || notice === null || Array.isArray(notice)) {
        throw new Error(`active[${String(index)}] must be an object`)
      }

      return {
        avoid: assertStringArray(notice.avoid, `active[${String(index)}].avoid`),
        id: assertString(notice.id, `active[${String(index)}].id`),
        impact: assertString(notice.impact, `active[${String(index)}].impact`),
        primitives: assertStringArray(notice.primitives, `active[${String(index)}].primitives`),
        runnethInstructions: assertString(
          notice.runnethInstructions,
          `active[${String(index)}].runnethInstructions`
        ),
        startedAt: assertString(notice.startedAt, `active[${String(index)}].startedAt`),
        summary: assertString(notice.summary, `active[${String(index)}].summary`),
        surfaces: assertStringArray(notice.surfaces, `active[${String(index)}].surfaces`),
        updatedAt: assertString(notice.updatedAt, `active[${String(index)}].updatedAt`),
        workaround: assertString(notice.workaround, `active[${String(index)}].workaround`),
      }
    }),
    updatedAt,
  }
}

const escapeXml = (value) => {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

const formatUtcDate = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${value} is not a valid date`)
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    timeZone: 'UTC',
    timeZoneName: 'short',
    year: 'numeric',
  }).format(date)
}

const wrapText = (value, maxCharacters) => {
  const words = value.split(/\s+/)
  const lines = []
  let currentLine = ''

  for (const word of words) {
    const nextLine = currentLine.length === 0 ? word : `${currentLine} ${word}`
    if (nextLine.length > maxCharacters && currentLine.length > 0) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = nextLine
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine)
  }

  return lines
}

const primitiveLabel = (primitive) => {
  return PRIMITIVES.find((item) => item.id === primitive)?.label ?? primitive
}

const renderTextLines = ({ className, fill, fontSize, fontWeight = 400, lines, x, y }) => {
  return lines
    .map((line, index) => {
      return `<text class="${className}" x="${String(x)}" y="${String(
        y + index * (fontSize + 6)
      )}" fill="${fill}" font-size="${String(fontSize)}" font-weight="${String(
        fontWeight
      )}">${escapeXml(line)}</text>`
    })
    .join('\n')
}

const renderPrimitiveCards = (feed) => {
  const activePrimitiveIds = new Set(feed.active.flatMap((notice) => notice.primitives))

  return PRIMITIVES.map((primitive, index) => {
    const row = Math.floor(index / 4)
    const column = index % 4
    const x = PADDING + column * (PRIMITIVE_CARD_WIDTH + CARD_GAP)
    const y = 164 + row * (PRIMITIVE_CARD_HEIGHT + CARD_GAP)
    const isActive = activePrimitiveIds.has(primitive.id)
    const fill = isActive ? '#FFF7ED' : '#F0FDF4'
    const stroke = isActive ? '#F97316' : '#22C55E'
    const statusText = isActive ? 'Active guidance' : 'Clear'
    const statusFill = isActive ? '#C2410C' : '#15803D'

    return `<g>
  <rect x="${String(x)}" y="${String(y)}" width="${String(
    PRIMITIVE_CARD_WIDTH
  )}" height="${String(PRIMITIVE_CARD_HEIGHT)}" rx="8" fill="${fill}" stroke="${stroke}" />
  <circle cx="${String(x + 20)}" cy="${String(y + 22)}" r="6" fill="${stroke}" />
  <text class="label" x="${String(x + 36)}" y="${String(
    y + 26
  )}" fill="#111827" font-size="15" font-weight="700">${escapeXml(primitive.label)}</text>
  <text class="label" x="${String(x + 36)}" y="${String(
    y + 45
  )}" fill="${statusFill}" font-size="12" font-weight="600">${statusText}</text>
</g>`
  }).join('\n')
}

const renderNoticeCards = (feed) => {
  if (feed.active.length === 0) {
    return {
      height: 96,
      svg: `<g>
  <rect x="${String(PADDING)}" y="332" width="896" height="72" rx="8" fill="#F0FDF4" stroke="#22C55E" />
  <text class="label" x="56" y="363" fill="#14532D" font-size="16" font-weight="700">No active notices</text>
  <text class="label" x="56" y="386" fill="#166534" font-size="13">All listed primitives are clear in the committed status feed.</text>
</g>`,
    }
  }

  let cursorY = 332
  const cards = feed.active.map((notice) => {
    const summaryLines = wrapText(notice.summary, 86)
    const impactLines = wrapText(notice.impact, 96).slice(0, 2)
    const primitiveText = notice.primitives.map(primitiveLabel).join(' + ')
    const summaryY = cursorY + 56
    const impactY = summaryY + summaryLines.length * 24 + 12
    const dateY = impactY + impactLines.length * 19 + 28
    const rowHeight = dateY - cursorY + 26
    const rendered = `<g>
  <rect x="${String(PADDING)}" y="${String(cursorY)}" width="896" height="${String(
    rowHeight
  )}" rx="8" fill="#FFFFFF" stroke="#E5E7EB" />
  <text class="mono" x="56" y="${String(
    cursorY + 28
  )}" fill="#6B7280" font-size="12" font-weight="700">${escapeXml(primitiveText)}</text>
  ${renderTextLines({
    className: 'label',
    fill: '#111827',
    fontSize: 16,
    fontWeight: 700,
    lines: summaryLines,
    x: 56,
    y: summaryY,
  })}
  ${renderTextLines({
    className: 'label',
    fill: '#4B5563',
    fontSize: 13,
    lines: impactLines,
    x: 56,
    y: impactY,
  })}
  <text class="label" x="56" y="${String(
    dateY
  )}" fill="#6B7280" font-size="12">Started ${escapeXml(
    formatUtcDate(notice.startedAt)
  )} | Updated ${escapeXml(formatUtcDate(notice.updatedAt))}</text>
</g>`

    cursorY += rowHeight + CARD_GAP
    return rendered
  })

  return {
    height: cursorY - 332,
    svg: cards.join('\n'),
  }
}

const renderSvg = (feed) => {
  const activeCount = feed.active.length
  const statusText =
    activeCount === 0
      ? 'All primitives clear'
      : `${String(activeCount)} active ${activeCount === 1 ? 'notice' : 'notices'}`
  const statusFill = activeCount === 0 ? '#15803D' : '#C2410C'
  const statusPillFill = activeCount === 0 ? '#DCFCE7' : '#FFEDD5'
  const noticeCards = renderNoticeCards(feed)
  const height = 388 + noticeCards.height
  const description =
    activeCount === 0
      ? 'No active Runneth operational status notices.'
      : `Active Runneth operational status notices: ${feed.active
          .map((notice) => notice.summary)
          .join('; ')}`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${String(WIDTH)}" height="${String(
    height
  )}" viewBox="0 0 ${String(WIDTH)} ${String(height)}" role="img" aria-labelledby="title desc">
<title id="title">Runneth operational status</title>
<desc id="desc">${escapeXml(description)}</desc>
<style>
  .label { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  .mono { font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, monospace; }
</style>
<rect width="${String(WIDTH)}" height="${String(height)}" rx="12" fill="#F8FAFC" />
<rect x="16" y="16" width="928" height="${String(height - 32)}" rx="10" fill="#FFFFFF" stroke="#E5E7EB" />
<text class="label" x="${String(PADDING)}" y="56" fill="#111827" font-size="28" font-weight="800">Runneth operational status</text>
<rect x="707" y="34" width="205" height="34" rx="17" fill="${statusPillFill}" />
<circle cx="730" cy="51" r="6" fill="${statusFill}" />
<text class="label" x="744" y="56" fill="${statusFill}" font-size="14" font-weight="800">${escapeXml(
    statusText
  )}</text>
<text class="label" x="${String(PADDING)}" y="86" fill="#4B5563" font-size="14">Generated from the latest committed status.json. Feed updated ${escapeXml(
    formatUtcDate(feed.updatedAt)
  )}.</text>
<line x1="${String(PADDING)}" y1="116" x2="928" y2="116" stroke="#E5E7EB" />
<text class="label" x="${String(PADDING)}" y="146" fill="#111827" font-size="15" font-weight="800">Primitive coverage</text>
${renderPrimitiveCards(feed)}
<text class="label" x="${String(PADDING)}" y="306" fill="#111827" font-size="15" font-weight="800">Active notices</text>
${noticeCards.svg}
</svg>
`
}

const rawStatus = await readFile(STATUS_FILE, 'utf8')
const feed = parseStatusFeed(JSON.parse(rawStatus))
await writeFile(OUTPUT_FILE, renderSvg(feed))
