import { PlanType, PlanLimits } from "@/types";

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
    free: {
        maxBooks: 1,
        maxSessionsPerMonth: 5,
        maxDurationMinutes: 5,
        hasSessionHistory: false,
    },
    standard: {
        maxBooks: 10,
        maxSessionsPerMonth: 100,
        maxDurationMinutes: 15,
        hasSessionHistory: true,
    },
    pro: {
        maxBooks: 100,
        maxSessionsPerMonth: Infinity,
        maxDurationMinutes: 60,
        hasSessionHistory: true,
    }
};

export const getCurrentBillingPeriodStart = (): Date => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
}