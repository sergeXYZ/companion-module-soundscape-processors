import { readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// Packaged: next to main.js → companion/images/enspace
// Dev (unbundled): from src/ → ../companion/images/enspace
const moduleRoot = dirname(fileURLToPath(import.meta.url))
const imagesDirCandidates = [
	join(moduleRoot, 'companion', 'images', 'enspace'),
	join(moduleRoot, '..', 'companion', 'images', 'enspace'),
]

function resolveImagesDir() {
	for (const dir of imagesDirCandidates) {
		if (existsSync(join(dir, 'room-1.png'))) return dir
	}
	return imagesDirCandidates[0]
}

const imagesDir = resolveImagesDir()

/** @type {Map<number, string | undefined>} */
const png64Cache = new Map()

/**
 * Base64 PNG for En-Space room button backgrounds.
 * Room 0 / unknown / custom → undefined (no image).
 */
export function getEnSpaceRoomPng64(roomId) {
	const id = Number(roomId)
	if (!Number.isFinite(id) || id < 1 || id > 9) return undefined

	if (png64Cache.has(id)) return png64Cache.get(id)

	const path = join(imagesDir, `room-${id}.png`)
	if (!existsSync(path)) {
		png64Cache.set(id, undefined)
		return undefined
	}

	const png64 = readFileSync(path).toString('base64')
	png64Cache.set(id, png64)
	return png64
}
