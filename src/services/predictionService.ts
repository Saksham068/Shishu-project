/**
 * ML Risk Prediction Service
 *
 * Sends the exact JSON payload the ML model expects.
 * Falls back to a heuristic when the API is unavailable.
 */

import { ML_API_URL, ML_API_KEY } from "@/config/apiConfig";

const isApiConfigured =
  !!ML_API_URL &&
  (ML_API_URL as string) !== "PASTE_MODEL_ENDPOINT_HERE";

/** Exact payload shape the ML model expects */
export interface MLPayload {
  age: number;
  systolic_bp: number;
  diastolic_bp: number;
  blood_sugar: number;
  body_temp: number;
  heart_rate: number;
  bmi: number;
  prev_complications: 0 | 1;
  preexisting_diabetes: 0 | 1;
  gestational_diabetes: 0 | 1;
  mental_health: 0 | 1;
  vaginal_bleeding: 0 | 1;
  abdominal_pain: 0 | 1;
  fever_symptom: 0 | 1;
  dizziness: 0 | 1;
  back_pain: 0 | 1;
  pelvic_cramps: 0 | 1;
  weakness: 0 | 1;
}

export interface PredictionResult {
  risk_score: number;          // high_risk_percent from API
  risk_category: string;       // final_risk_level from API
  usedFallback: boolean;
}

/**
 * Main prediction function.
 * Tries ML API first; falls back to local heuristic on failure.
 */
export async function predictRisk(input: MLPayload): Promise<PredictionResult> {
  if (isApiConfigured) {
    try {
      const response = await fetch(ML_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": ML_API_KEY,
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) throw new Error(`ML API returned status ${response.status}`);

      const data = await response.json();

      // API returns: { final_risk_level, high_risk_percent, ... }
      if (
        typeof data.final_risk_level === "string" &&
        typeof data.high_risk_percent === "number"
      ) {
        return {
          risk_score: data.high_risk_percent,
          risk_category: data.final_risk_level,
          usedFallback: false,
        };
      }

      throw new Error("Unexpected API response format");
    } catch (err) {
      console.warn("[PredictionService] ML API call failed, using fallback:", err);
      // Return a special error result so the UI can show an error state
      throw err;
    }
  }

  console.info("[PredictionService] No ML API configured, using fallback.");
  return fallbackPredict(input);
}

/** Fallback heuristic when ML API is unavailable */
function fallbackPredict(input: MLPayload): PredictionResult {
  const toggleKeys: (keyof MLPayload)[] = [
    "prev_complications", "preexisting_diabetes", "gestational_diabetes",
    "mental_health", "vaginal_bleeding", "abdominal_pain", "fever_symptom",
    "dizziness", "back_pain", "pelvic_cramps", "weakness",
  ];
  const symptomCount = toggleKeys.filter((k) => input[k] === 1).length;

  let score = (symptomCount / toggleKeys.length) * 60;

  if (input.vaginal_bleeding) score += 10;
  if (input.abdominal_pain) score += 6;
  if (input.prev_complications) score += 8;
  if (input.systolic_bp > 140 || input.systolic_bp < 90) score += 6;
  if (input.diastolic_bp > 90 || input.diastolic_bp < 60) score += 4;
  if (input.body_temp > 100.4) score += 6;
  if (input.heart_rate > 100 || input.heart_rate < 60) score += 4;
  if (input.blood_sugar > 140) score += 4;
  if (input.bmi > 30 || input.bmi < 18.5) score += 4;
  if (input.age < 20 || input.age > 35) score += 6;

  score = Math.max(0, Math.min(100, Math.round(score)));

  let category: string;
  if (score <= 20) category = "Low";
  else if (score <= 45) category = "Moderate";
  else if (score <= 70) category = "High";
  else category = "Critical";

  return { risk_score: score, risk_category: category, usedFallback: true };
}

// Legacy exports for backward compatibility
export function mapSymptomKeys(keys: string[]): string[] { return keys; }
export function parseBP(bp: string): number { return 120; }
export function parseTemp(temp: string): number { return 98.6; }
export type PredictionInput = MLPayload;
