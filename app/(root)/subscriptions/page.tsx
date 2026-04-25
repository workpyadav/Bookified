'use client';

import { PricingTable } from '@clerk/nextjs';
import React from 'react';

const SubscriptionsPage = () => {
    return (
        <main className="clerk-subscriptions">
            <div className="max-w-5xl mx-auto flex flex-col items-center gap-6 pt-10">
                <h1 className="page-title-xl text-center">Pricing & Plans</h1>
                <p className="subtitle text-center mb-8 max-w-2xl">
                    Choose the plan that fits your reading habits. Upgrade to Standard or Pro to unlock more books, unlimited sessions, and longer conversations with your favorite characters.
                </p>
                <div className="clerk-pricing-table-wrapper w-full mt-4 flex justify-center">
                    <PricingTable />
                </div>
            </div>
        </main>
    );
};

export default SubscriptionsPage;
