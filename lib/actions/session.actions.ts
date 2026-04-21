'use server';
import VoiceSession from "@/database/models/voice-session.model";
import { connectToDatabase } from "@/database/mongoose";
import {StartSessionResult} from "@/types";
import { getCurrentBillingPeriodStart } from "../subscription-constants";



export const startVoiceSession = async (clerkId: string, bookId: string): Promise<StartSessionResult> => {
    try {
        await connectToDatabase();
        //Limits/Plan to see whether a session is allowed.
        const session = await VoiceSession.create({
            clerkId,
            bookId,
            startedAt: new Date(),
            billingPeriodStart: getCurrentBillingPeriodStart(),
            durationSeconds: 0,
        });

        return {
            success: true,
            sessionId: session._id.toString(),
            // maxdurationMinuts: check.maxDurationMinutes,
        }
    } catch (e) {
        console.error('Error starting voice session', e);
        return {success: false, error: 'failed to start voice session, Please try again later.'}
    }
}

export const endVoiceSession = async (sessionId: string, durationSeconds: number): Promise<{ success: boolean }> => {
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