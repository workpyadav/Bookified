'use server';
import VoiceSession from "@/database/models/voice-session.model";
import { connectToDatabase } from "@/database/mongoose";
import {StartSessionResult} from "@/types";
import { getCurrentBillingPeriodStart, PLAN_LIMITS } from "../subscription-constants";
import { getUserPlan } from "../subscription";



export const startVoiceSession = async (clerkId: string, bookId: string): Promise<StartSessionResult> => {
    try {
        await connectToDatabase();
        
        const plan = await getUserPlan();
        const limits = PLAN_LIMITS[plan];
        const billingPeriodStart = getCurrentBillingPeriodStart();

        const sessionCount = await VoiceSession.countDocuments({
            clerkId,
            billingPeriodStart: { $gte: billingPeriodStart },
        });

        if (sessionCount >= limits.maxSessionsPerMonth) {
            return {
                success: false,
                error: `You have reached the limit of ${limits.maxSessionsPerMonth} sessions for this month on your ${plan} plan. Please upgrade to continue.`,
            }
        }

        const session = await VoiceSession.create({
            clerkId,
            bookId,
            startedAt: new Date(),
            billingPeriodStart,
            durationSeconds: 0,
        });

        return {
            success: true,
            sessionId: session._id.toString(),
            maxDurationMinutes: limits.maxDurationMinutes,
        }
    } catch (e) {
        console.error('Error starting voice session', e);
        return {success: false, error: 'failed to start voice session, Please try again later.'}
    }
}

export const endVoiceSession = async (sessionId: string, durationSeconds: number): Promise<{ success: boolean; error?: string }> => {
    try {
        await connectToDatabase();
        
        const result = await VoiceSession.findByIdAndUpdate(sessionId, {
            endedAt: new Date(),
            durationSeconds
        });

        if(!result) return {success: false, error: 'Voice session not found.'}

        return { success: true };
    } catch (error) {
        console.error('Error ending voice session', error);
        return { success: false };
    }
}