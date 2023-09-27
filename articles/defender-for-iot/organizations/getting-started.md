---
title: Get started with OT monitoring - Microsoft Defender for IoT
description: Use this quickstart to set up a trial OT plan with Microsoft Defender for IoT and understand the next steps required to configure your network sensors.
ms.topic: get-started
ms.date: 09/21/2023
#CustomerIntent: As a prospective Defender for IoT customer with OT networks, I want to understand how I can set up a trial and evaluate Defender for IoT.
---

# Start a Microsoft Defender for IoT trial

This article describes how to set up a trial license and create an initial OT plan for Microsoft Defender for IoT, for customers who don't have any Microsoft tenant or Azure subscription at all. Use Defender for IoT to monitor network traffic across your OT networks.

A trial supports a **Large** site size with up to 1000 devices, and lasts for 60 days. You might want to use this trial with a [virtual sensor](tutorial-onboarding.md) or on-premises sensors to monitor traffic, analyze data, generate alerts, understand network risks and vulnerabilities, and more.

## Prerequisites

Before you start, all you need is an email address that will be used as the contact for your new Microsoft Tenant.

You'll also need to enter credit card details for your new Azure subscription, although you won't be charged until you switch from the **Free Trial** to the **Pay-As-You-Go** plan.

## Add a trial license

This procedure describes how to add a trial license for Defender for IoT to your Azure subscription. One trial license is available per tenant.

**To add a trial license**:

1. In a browser, open the [Microsoft Defender for IoT - OT Site License (1000 max devices per site) Trial wizard](https://signup.microsoft.com/get-started/signup?OfferId=11c457e2-ac0a-430d-8500-88c99927ff9f&ali=1&products=11c457e2-ac0a-430d-8500-88c99927ff9f).

1. In the **Email** box, enter the email address you want to associate with the trial license, and select **Next**.

1. In the **Tell us about yourself** page, enter your details, and then select **Next**.

1. Select whether you want the confirmation message to be sent to you via SMS or a phone call. Verify your phone number, and then select **Send verification code**.

1. After receiving the code, enter it in the **Enter your verification code** box.

1. In the **How you'll sign in** page, enter a username and password and select **Next**.

1. In the **Confirmation details** page, note your order number and username, and then select **Start using Microsoft Defender for IoT - OT Site License (1000 max devices per site) Trial** button to continue. We recommend that you copy your full username to the clipboard as you'll need it to access the Azure portal.

Use the Microsoft 365 admin center manage your users, billing details, and more. For more information, see the [Microsoft 365 admin center help](/microsoft-365/admin/).

## Add an OT plan
 
This procedure describes how to add an OT plan for Defender for IoT in the Azure portal, based on your [new trial license](#add-a-trial-license).

**To add an OT plan in Defender for IoT**:

1. Open [Defender for IoT](https://portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) in the Azure portal, select **Plans and pricing**, where you're prompted to create a new subscription.

1. Select **Go to subscriptions** to create a new subscription on the [Azure **Subscriptions** page](https://portal.azure.com/?quickstart=True#view/Microsoft_Azure_Billing/SubscriptionsBlade). Make sure to select the **Free Trial** option.

1. Back in the Defender for IoT's **Plans and pricing** page, select **Add plan**. In the **Plan settings** pane, select your new subscription.

   The **Price plan** value is updated automatically to read **Microsoft 365**, reflecting your Microsoft 365 license.

1. Select **Next** and review the details for your licensed site. The details listed on the **Review and purchase** pane reflect your trial license.

1. Select the terms and conditions, and then select **Save**.

Your new plan is listed under the relevant subscription on the **Plans and pricing** > **Plans** page. For more information, see [Manage your subscriptions](how-to-manage-subscriptions.md).

## Next steps

> [!div class="step-by-step"]
> [Defender for IoT OT deployment path »](ot-deploy/ot-deploy-path.md)
