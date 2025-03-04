---
title: Transition to OpenAI Service provisioned deployment reservations
description: Learn about how to transition to Azure OpenAI Service provisioned deployment reservations, including new Global and data zone options.
author: bandersmsft
ms.reviewer: kvuyyuru
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: how-to
ms.date: 12/06/2024
ms.author: banders
#customer intent: As a reservation admin, I want to understand how to transition to Azure OpenAI Service provisioned deployment reservations so that I can manage my resources effectively.
---

# Transition to Azure OpenAI Service provisioned deployment reservations

Azure introduced new Global and Data Zone provisioned deployment reservations for Azure OpenAI Service. These new options provide more flexibility and scalability, allowing you to access the models you need and scale Provisioned Throughput Units (PTUs) to support usage growth. Additionally, Microsoft announced lower hourly prices and smaller deployment minimums for the new deployment types, although the prices for monthly and yearly reservations remain unchanged.

With these changes, Azure expects to better serve your evolving needs. If you're currently using Regional provisioned deployments, you might find that transitioning to Global or Data Zone provisioned deployments offers significant benefits. This guide helps you understand the transition process, including how to migrate your applications and deployments and how to transition any existing reservations that cover the deployments.

## Changes to Azure OpenAI Service provisioned deployments

- In September 2024, Azure launched Global provisioned deployment reservations.
- In December 2024, Azure launched Data Zone provisioned deployment reservations.
- Although most customers are currently on Regional provisioned deployments, the Global and Data Zone provisioned deployments might better suit your needs if you want to:
  - Access the model that you need.
  - Scale PTUs to support your usage growth.
- For Global and Data Zone provisioned deployments, Microsoft [announced](https://azure.microsoft.com/blog/accelerate-scale-with-azure-openai-service-provisioned-offering/) lower hourly prices and smaller deployment minimums. There's no change to the price for monthly and yearly reservations with that announcement.
- With the launch of the Global and Data Zone provisioned deployments, Azure now offers services that better serve your evolving needs.
<!-- - For pricing information, see the [Azure OpenAI Service pricing](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/) page. -->

## Transition from Regional to Global or Data Zone provisioned deployments

If you want to move from Regional provisioned deployment to Global or Data Zone deployments, you need to migrate your application or deployments on the service side. And you need to transition reservations, if any, that cover those deployments.

### Transition Azure OpenAI Service deployments from Regional to Global or Data Zone

If you use existing Azure OpenAI Service Regional Provisioned deployments, there are two options to transition to the Data Zone or Global Provisioned deployment types:

### Option 1 - No downtime

1. Create a new deployment using the Azure OpenAI Service Global Provisioned or Data Zone Provisioned deployment type in the desired Azure OpenAI Service resource.
2. Transition traffic from the existing Azure OpenAI Service Regional Provisioned deployment to the newly created Azure OpenAI Service Global or Data Zone provisioned deployment until all traffic is offloaded from the Regional Provisioned deployment.
3. Delete the existing Regional Provisioned deployment.

### Option 2 – Has downtime

1. Ensure all Azure OpenAI Service API requests are stopped on the Azure OpenAI Service Regional Provisioned deployment.
2. Delete the existing Regional Provisioned deployment.
3. Create a new deployment using the Azure OpenAI Service Global Provisioned or Data Zone Provisioned deployment type in the desired Azure OpenAI Service resource.

## Transition Azure OpenAI Service provisioned reservations from Regional to Global or Data Zone

- First, you must decide how many PTUs you want to retain on the Provisioned Regional deployment. Then decide how many PTUs to move to the provisioned Global or Data Zone deployments.
- Of these deployments, you need to decide how many need to get covered by reservations to get the discounted price.
- Reservations for Global, Data Zone, and Regional deployments aren't inter-changeable. You need to purchase a separate reservation for each deployment type.
- When you have existing Regional provisioned deployments and want to transition to Global or Data Zone provisioned deployments, both types of deployments might need to exist for a brief time period to migrate your applications. It results in you right-sizing your Regional provisioned deployments.
- Based on your desired end state (deployments across Regional, Data Zone, and Global), you need to cancel your existing reservations and purchase new reservations that cover your deployments.
- It could result in one of two scenarios:
  - Overlap of existing and newly purchased reservations, resulting in getting charged for both.
  - Time period between cancellation of existing reservations and purchasing new reservations, resulting in deployments being charged at the hourly rate (instead of a reservation price, because there wouldn’t be any reservations covering those deployments).
  - In either case, it isn't considered double billing but essential to transition from one deployment to another.
- Careful planning for transitioning deployments and transitioning reservations minimize charges.
  - When you transition deployments, ensure that the reservation administrator understands the desired end state. Then you can cancel and purchase the right number of reservation units for the respective deployment types.
  - Avoid hourly charges for deployments by ensuring that all deployments have a matching reservation.
  - Avoid purchasing reservations ahead of time to prevent charges for deployments that aren’t active yet.
  - Cancel reservations that don’t cover any deployments.
- Existing Provisioned Regional reservation cancellation is approved when you buy new Global or Data Zone reservations to replace or exchange your existing reservations.  
    >[!NOTE]
    >Cancellations are supported for a limited time. You should stop auto renewals for your Provisioned Regional Reservations if want to transition to Global or Data Zone reservations.


### Scenario 1 - Annual reservations

1. Cancel your existing Provisioned Regional reservations for the number of PTUs that you want to transition to Global or Data Zone.
2. To cover the deployments that you want to transition, purchase corresponding Global or Data Zone reservations.  

    For example, assume you have 300 PTUs on the Regional deployment. You decide to transition 200 PTUs to Data Zone deployment and keep the remaining 100 on Regional deployment. Also, assume that you have one or more reservations to cover all of the 300 existing Regional deployments.
    1. To consolidate and realign reservations, your need to cancel your existing reservations for 300 PTUs.
    2. To cover the 200 Data Zone deployments, purchase a Data Zone reservation.
    3. Purchase a Regional reservation to cover the 100 Regional deployments.
3. If you think there’s an error or a credit due, you can [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

### Scenario 2 - Monthly reservations

In this scenario, you have two options:

**Option 1** - Recommended for a single monthly reservation

1. Let your current monthly reservations expire on their own. For example, stop auto renewal of your existing reservations.
2. To consolidate and realign reservations, purchase corresponding Global, Data Zone, or Regional reservations. They cover the deployments that you want to transition to.  

    For example, assume you have 300 PTUs on the Regional deployment. You decide to transition 200 PTUs to Data Zone deployment and keep the remaining 100 on Regional deployment. Also, assume that you have a single reservation to cover all of the 300 existing Regional deployments.  
    1. To realign reservations, you need to stop auto renewal of the existing reservation that covers the 300 PTUs.
    2. On the same or following day that a reservation expires, buy a Data Zone reservation to cover the 200 Data Zone deployments. Purchase a Regional reservation to cover the 100 Regional deployments.
    3. Timing the new purchases correctly helps avoid overlap in reservations or being charged at the hourly pay-as-you-go rates.
3. If you think there’s an error or a credit due, you can [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

**Option 2** - Recommended for multiple monthly reservations

- Follow the steps in [Scenario 1 - Annual reservations](#scenario-1---annual-reservations).

## Important information

>[!WARNING]
>If you cancel your current PTU reservations but don't purchase the new Global or Data Zone PTU reservations, then all of your PTU deployments get charged at the hourly price.

You can cancel reservations yourself if the amount is less than or equal to $50,000. Otherwise, you must contact Azure support to request cancellation. To contact support for cancellations, see [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

Cancellations are supported for a limited time. You should stop auto renewals for your Provisioned Regional Reservations if you want to transition to Global or Data Zone reservations.

## Related content

- [Provisioned throughput units onboarding](/azure/ai-services/openai/how-to/provisioned-throughput-onboarding)
- [Save costs with Microsoft Azure OpenAI Service Provisioned Reservations](azure-openai.md)
