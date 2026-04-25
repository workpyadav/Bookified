import { auth } from '@clerk/nextjs/server';
import { PlanType } from '@/types';
import { PLAN_LIMITS } from './subscription-constants';

export const getUserPlan = async (): Promise<PlanType> => {
    const { has } = await auth();

    if (has({ plan: 'pro' })) return 'pro';
    if (has({ plan: 'standard' })) return 'standard';
    return 'free';
}

export const getPlanLimits = async () => {
    const plan = await getUserPlan();
    return PLAN_LIMITS[plan];
}
