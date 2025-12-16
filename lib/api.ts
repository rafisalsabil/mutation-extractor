import { ExtractionResult } from "@/types";

const API_BASE = ''; // Relative path for internal API

/**
 * Upload file and extract transactions via Next.js API Route
 */
export async function uploadAndExtract(file: File): Promise<ExtractionResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'failed') {
        throw new Error(data.error || 'Extraction failed');
    }

    return data.result;
}
