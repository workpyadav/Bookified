import { useAuth } from '@clerk/nextjs';
import { PlanType } from '@/types';
import { PLAN_LIMITS } from '@/lib/subscription-constants';

export const useSubscription = () => {
    const { has, isLoaded, userId } = useAuth();

    const plan: PlanType = has?.({ plan: 'pro' }) 
        ? 'pro' 
        : has?.({ plan: 'standard' }) 
            ? 'standard' 
            : 'free';

    const limits = PLAN_LIMITS[plan];

    return {
        isLoaded,
        userId,
        plan,
        limits,
    };
}
