---
title: How to test a SaaS plan overview in the Microsoft commercial marketplace - Azure Marketplace
description: Use Microsoft Partner Center to test a plan for a SaaS offer in the Microsoft commercial marketplace.
ms.reviewer: dannyevers 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: trkeya 
ms.author: trkeya
ms.date: 03/25/2022
---

# Test a SaaS plan overview

This article provides guidance about how to configure a software as a service (SaaS) offer for testing a plan.

We recommend that you create a test SaaS plan in a separate test and development (DEV) offer. To learn how, see [Plan a test and development (DEV) SaaS offer](plan-saas-dev-test-offer.md). Regardless of whether you choose to create your test plan in a separate test and development (DEV) offer, the following guidelines in this article apply.

## Create a separate private test plan

We recommend that you create a separate private test plan and never publish the private test plan live. You’ll use your private test plan to do your testing in preview. When you’ve completed your testing, you will create a production plan for publishing live. Then, you can then stop the test plan.

## Preview audience

When creating the offer for your test plan, you need to [define a preview audience](create-new-saas-offer-preview.md) who will review and test your offer.

## Pricing and availability

When you purchase the plan, you will be charged the prices defined in the plan. To minimize your testing costs, we recommend that you set the plan prices low, for example, $0.01 (one cent). This applies to flat rate, metered billing, and per user prices.

You’ll then set the prices you want to charge the customer in the separate plan that you’ll publish live.

## Plan visibility

We recommend that you configure your test plan as a private plan, so it’s visible only to targeted people. This provides an extra level of protection from accidently exposing your test plan to customers if you accidently publish the private test plan live.

## General guidelines

- For guidelines about creating a test SaaS offer, see [Plan a test and development (DEV) SaaS offer](plan-saas-dev-test-offer.md).
- To learn more about plans, see [Plan a SaaS offer for the commercial marketplace](plan-saas-offer.md#plans).
- For step-by-step instructions about creating plans, see [Create plans for a SaaS offer](create-new-saas-offer-plans.md).

## Next steps

- After you create your test plan, you’ll then [Preview and subscribe to your offer](test-publish-saas-offer.md). From there, we’ll lead you through the remainder of the process, including how to test the offer, and how to clean up your test environment.
