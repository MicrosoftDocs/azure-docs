---
title: Get started with OT monitoring - Microsoft Defender for IoT
description: Use this quickstart to set up a trial OT plan with Microsoft Defender for IoT and understand the next steps required to configure your network sensors.
ms.topic: get-started
ms.date: 11/17/2024
#CustomerIntent: As a prospective Defender for IoT customer with OT networks, I want to understand how I can set up a trial and evaluate Defender for IoT.
---

# Start a Microsoft Defender for IoT trial

This article describes how to set up a trial license and create an initial OT plan for Microsoft Defender for IoT, for customers who don't have any Microsoft tenant or Azure subscription at all. Use Defender for IoT to monitor network traffic across your OT networks.

A trial supports a **Large** site size with up to 1,000 devices. You might want to use this trial with a [virtual sensor](tutorial-onboarding.md) or on-premises sensors to monitor traffic, analyze data, generate alerts, understand network risks and vulnerabilities, and more.

There are two stages to starting a trial for Defender for IoT.

1. Stage 1: [Add a trial license](#add-a-trial-license).
1. Stage 2: [Add an OT plan](#add-an-ot-plan).

Once you set up the trial license and OT plan, you can onboard OT sensors and associate them with this license and plan.

For more information, see [Free trial](billing.md#free-trial).

A trial license can be extended up to 15 days before the trail expires. For more information, see [extend your trial license](license-and-trial-license-extention.md#trial-license-extension).

## Prerequisites

Before you start, you need:

1. An email address to be used as the contact for your new Microsoft tenant.
1. A Microsoft tenant, with Global or Billing admin access to the tenant.

    For more information, see [Buy or remove licenses for a Microsoft business subscription](/microsoft-365/commerce/licenses/buy-licenses) and [About admin roles in the Microsoft 365 admin center](/microsoft-365/admin/add-users/about-admin-roles).

1. Credit card details for your new Azure subscription, although you aren't charged until you switch from the **Free Trial** to the **Pay-As-You-Go** plan.

## Add a trial license

This procedure describes how to add a trial license for Defender for IoT to your Azure subscription. One trial license is available per tenant.

To add a trial license with a new tenant, we recommend that you use the Trial wizard. If you already have a tenant, use the Microsoft 365 Marketplace to add a trial license to your tenant.

# [Add a trial with the Trial wizard](#tab/wizard)

**To add a trial license with a new tenant**:

1. In a browser, open the [Microsoft Defender for IoT - OT Site License (1000 max devices per site) Trial wizard](https://signup.microsoft.com/get-started/signup?products=d2bdd05f-4856-4569-8474-2f9ec298923b).

1. In the **Email** box, enter the email address you want to associate with the trial license, and select **Next**.

1. Confirm that the email address is correct by selecting **Set up account**.

1. In the **Tell us about yourself** page, enter your details, and then select **Next**.

1. Select whether you want the confirmation message to be sent to you via SMS or a phone call. Verify your phone number, and then select **Send verification code**.

1. After receiving the code, enter it in the **Enter your verification code** box.

1. In the **How you'll sign in** page, enter a username and password and select **Next**.

1. In the **Confirmation details** page, note your order number and username, and then select **Start using Microsoft Defender for IoT - OT Site License (1000 max devices per site) Trial** button to continue. We recommend that you copy your full username to the clipboard as you need it to access the Azure portal.

# [Add a trial from the Microsoft 365 Marketplace](#tab/marketplace)

**To add a trial license with an existing tenant**:

1. Go to the [Microsoft 365 admin center](https://portal.office.com/AdminPortal/Home#/catalog) **Billing > Purchase services**. If you don't have this option, select **Marketplace** instead.

1. Search for **Microsoft Defender for IoT** and locate the **Microsoft Defender for IoT - OT site license - Trial Trial** item.

1. Select **Details** > **Start free trial** > **Try now** to start the trial.

For more information, see the [Microsoft 365 admin center help](/microsoft-365/admin/).

---

Use the Microsoft 365 admin center manage your users, billing details, and more. For more information, see the [Microsoft 365 admin center help](/microsoft-365/admin/).

## Add an OT plan

This procedure describes how to add an OT plan for Defender for IoT in the Azure portal, based on your [new trial license](#add-a-trial-license).

**To add an OT plan in Defender for IoT**:

1. Open [Defender for IoT](https://portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) in the Azure portal, select **Plans and pricing**, where you're prompted to create a new subscription.

    :::image type="content" source="media/getting-started/subscriptions.png" alt-text="Screenshot of the Go to subscriptions message for creating a Defender for IoT subscription after starting a trial license." lightbox="media/getting-started/subscriptions.png":::

1. Select **Go to subscriptions** to create a new subscription on the [Azure **Subscriptions** page](https://portal.azure.com/?quickstart=True#view/Microsoft_Azure_Billing/SubscriptionsBlade). Make sure to select the **Free Trial** option.

1. Back in the Defender for IoT's **Plans and pricing** page, select **Add plan**. In the **Plan settings** pane, select your new subscription.

   The **Price plan** value is updated automatically to read **Microsoft 365**, reflecting your Microsoft 365 license.

    :::image type="content" source="media/getting-started/plan-set-up.png" alt-text="Screenshot of the Plan settings pane for completing the set up of a license and site for Defender for IoT in the Azure portal." lightbox="media/getting-started/plan-set-up.png":::

1. Select **Next** and review the details for your licensed site. The details listed on the **Review and purchase** pane reflect your trial license.

1. Select the terms and conditions, and then select **Save**.

Your new plan is listed under the relevant subscription on the **Plans and pricing** > **Plans** page. For more information, see [Manage your subscriptions](how-to-manage-subscriptions.md).

## Government customers trial license

### Azure Commercial portal trial license for GCC customers

Government Community Cloud (GCC) customers using the Azure Commercial portal should contact the sales team to activate the Defender for IoT trial license.  

### Azure Government portal trial license for GCC-H or DoD customers

Government Community Cloud High (GCC-H) and U.S. Department of Defense (DoD) customers using the Azure Government portal have the Defender for IoT trial license available as part of their plan.

To activate the trial:

1. In the Defender for IoT menu, select **Management > Plans and pricing**.
1. Select **Add plan**.
1. Select **Trial – 30 days**.

## Onboard an OT sensor

If you already have a network plan ready, you can onboard the OT sensor and associate it with a plan and the assign the relevant site and zone settings. For more information, see [onboard an OT sensor to the Azure portal](onboard-sensors.md).

## Next steps

> [!div class="step-by-step"]
> [Defender for IoT OT deployment path »](ot-deploy/ot-deploy-path.md)
> [!div class="step-by-step"]
> [Defender for IoT onboard an OT sensor »](onboard-sensors.md)
