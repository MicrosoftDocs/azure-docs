---
title: Quickstart - Get a phone number from Azure Communication Services
description: Learn how to buy a Communication Services phone number using the Azure portal.
author: ddematheu2
manager: nimag
services: azure-communication-services

ms.author: dademath
ms.date: 07/09/2020
ms.topic: quickstart
ms.service: azure-communication-services
ms.custom: references_regions

---
# Quickstart: Get a phone number using the Azure portal

[!INCLUDE [Private Preview Notice](../../includes/private-preview-include.md)]

Get started with Azure Communication Services by using the Azure portal to purchase a telephone number.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [An active Communication Services resource.](../create-communication-resource.md)

## Get a phone number

To begin provisioning numbers, go to your Communication Services resource on the [Azure portal](https://portal.azure.com).

:::image type="content" source="../media/manage-phone-azure-portal-start.png" alt-text="Screenshot showing a Communication Services resource's main page.":::

### Getting new phone numbers

Navigate to the Phone Numbers blade in the resource menu.

:::image type="content" source="../media/manage-phone-azure-portal-phone-page.png" alt-text="Screenshot showing a Communication Services resource's phone page.":::

Press the `Get` button to launch the wizard. The wizard on the `Phone numbers` blade will walk you through a series of questions that helps you choose the phone number that best fits your scenario. 

You will first need to choose the `Country/region` where you would like to provision the phone number. After selecting the Country/region, you will then need to select the `phone plan` which best suites your needs. 

:::image type="content" source="../media/manage-phone-azure-portal-get-numbers.png" alt-text="Screenshot showing the Get phone numbers view.":::

### Select a Phone plan

Selecting a phone plan is broken down into two steps: 

1. The selection of the [Number type](../../concepts/telephony-sms/plan-solution.md#phone-number-types-in-azure-communication-services)
2. The selection of the [Plan](../../concepts/telephony-sms/plan-solution.md#plans)

We offer two Number types currently: `Geographic`, and `Toll-free`. When you've selected a Number type, you will then be offered several Plans from which you can choose.

> [!NOTE]
> We currently only support selecting phone numbers with Inbound OR Outbound calling. You may, however, purchase a phone number with inbound calling enabled, and then configure the outbound caller ID to match the number of the inbound-calling-enabled phone number (what users see when you call them from your Communication Services application).
> This only applies to two-way calling. Two-way SMS is natively supported.

In our example, we have chosen a `Toll-free` Number type with the `Outbound calling` Plan.

:::image type="content" source="../media/manage-phone-azure-portal-select-plans.png" alt-text="Screenshot showing the Select plans view.":::

### Declare purpose

Next, the wizard will ask you for the purpose of using the number. We collect this information to apply the correct tax and emergency calling regulations.

:::image type="content" source="../media/quickstart-search-and-acquire-bot-or-human.png" alt-text="Screenshot showing selecting a bot or human within the phone number acquisition process.":::

From here, click the `Next: Numbers` button at the bottom of the page to customize the phone number(s) you would like to provision.

### Customizing phone numbers

On the `Numbers` page, you will customize the phone number(s) which you'd like to provision.

:::image type="content" source="../media/manage-phone-azure-portal-select-numbers-start.png" alt-text="Screenshot showing the Numbers selection page.":::

> [!NOTE]
> This quickstart is showing the `Toll-free` Number type customization flow. The experience may be slightly different if you have chosen the `Geographic` Number type, but the end-result will be the same.

Choose the `Area code` from the list of available Area codes and enter the quantity which you'd like to provision, then click `Search` to find numbers which meet your selected requirements. The phone numbers which meet your needs will be shown along with their monthly cost.

:::image type="content" source="../media/manage-phone-azure-portal-found-numbers.png" alt-text="Screenshot showing the Numbers selection page with reserved numbers.":::

> [!NOTE]
> Availability depends on the Number type, location, and the plan that you have selected.
> Numbers are reserved for a short time before the transaction expires. If the transaction expires, you will need to re-select the numbers.

To view the purchase summary and place your order, click the `Next: Summary` button at the bottom of the page.

### Place order

The summary page will review the Number type, Features, Phone Numbers, and Total monthly cost to provision the phone numbers.

> [!NOTE]
> The prices shown are the **monthly recurring charges** which cover the cost of leasing the selected phone number to you. Not included in this view is the **Pay-as-you-go costs** which are incurred when you make or receive calls. The price lists are [available here](../../concepts/pricing.md). These costs depend on number type and destinations called. For example, price-per-minute for a call from a Seattle regional number to a regional number in New York and a call from the same number to a UK mobile number may be different.

Finally, click `Place order` at the bottom of the page to confirm.

:::image type="content" source="../media/manage-phone-azure-portal-get-numbers-summary.png" alt-text="Screenshot showing the Summary page with the Number type, Features, Phone Numbers, and Total monthly cost shown.":::

## Find your phone numbers on the Azure portal

Navigate to your Azure Communication Resource on the [Azure portal](https://portal.azure.com):

:::image type="content" source="../media/manage-phone-azure-portal-start.png" alt-text="Screenshot showing a Communication Services Resource's main page.":::

Select the Phone Numbers tab in the menu to manage your phone numbers.

:::image type="content" source="../media/manage-phone-azure-portal-phones.png" alt-text="Screenshot showing a Communication Services Resource's phone number page.":::

> [!NOTE]
> It may take a few minutes for the provisioned numbers to be shown on this page.

## Troubleshooting

Common questions and issues:

- Only US is supported for purchasing phone numbers at this time. This is based on the billing address of the subscription that the resource is associated with. At this time, you cannot move a resource to another subscription.

- When a phone number is deleted, the phone number will not be released or able to be repurchased until the end of the billing cycle.

- When a Communication Services resource is deleted, the phone numbers associated with that resource will be automatically released at the same time.

## Next steps

In this quickstart you learned how to:

> [!div class="checklist"]
> * Purchase a phone number
> * Manage your phone number
> * Release a phone number

> [!div class="nextstepaction"]
> [Send an SMS](../telephony-sms/send.md)
> [Get started with calling](../voice-video-calling/getting-started-with-calling.md)
