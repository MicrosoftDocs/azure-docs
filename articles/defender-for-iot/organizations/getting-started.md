---
title: Get started with OT network security monitoring - Microsoft Defender for IoT
description: Use this quickstart to set up a trial OT plan with Microsoft Defender for IoT and understand the next steps required to configure your network sensors.
ms.topic: get-started
ms.date: 06/04/2023
---

# Start a Microsoft Defender for IoT trial

This article describes how to set up a trial license and create an initial OT plan for Microsoft Defender for IoT. Use Defender for IoT to monitor network traffic across your OT networks.

A trial license supports a **Large** site size for 60 days. You might want to use this trial with a [virtual sensor](tutorial-onboarding.md) or on-premises sensors to monitor traffic, analyze data, generate alerts, understand network risks and vulnerabilities, and more.

## Prerequisites

Before you start, make sure that you have:

- A Microsoft 365 tenant, with access to the [Microsoft 365 admin center](https://portal.office.com/AdminPortal/Home#/catalog) as Global or Billing admin.

    For more information, see [Buy or remove Microsoft 365 licenses for a subscription](/microsoft-365/commerce/licenses/buy-licenses) and [About admin roles in the Microsoft 365 admin center](/microsoft-365/admin/add-users/about-admin-roles).

- An Azure account. If you don't already have an Azure account, you can [create your free Azure account today](https://azure.microsoft.com/free/).

- Access to the Azure portal as a [Security Admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner). For more information, see [Azure user roles for OT and Enterprise IoT monitoring with Defender for IoT](roles-azure.md).

## Add a trial license

This procedure describes how to add a trial license for Defender for IoT to your Azure subscription. One trial license is available per tenant.

**To add a trial license**:

1. Go to the [Microsoft 365 admin center](https://portal.office.com/AdminPortal/Home#/catalog) **Billing > Purchase services**. If you don't have this option, select **Marketplace** instead.

1. Search for **Microsoft Defender for IoT** and locate the **Microsoft Defender for IoT - OT Site License - Large Site** item.

1. Select **Details** > **Start free trial** > **Try now** to start the trial.

For more information, see the [Microsoft 365 admin center help](/microsoft-365/admin/).

## Add an OT plan
 
This procedure describes how to add an OT plan for Defender for IoT in the Azure portal, based on the trial license you'd obtained from the [Microsoft 365 admin center](#add-a-trial-license).

**To add an OT plan in Defender for IoT**:

1. In [Defender for IoT](https://portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started), select **Plans and pricing** > **Add plan**.

1. In the **Plan settings** pane, select the Azure subscription where you want to add a plan. 

    You can only add a single subscription, and you'll need a [Security admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner) role for the selected subscription.

   > [!TIP]
   > If your subscription isn't listed, check your account details and confirm your permissions with the subscription owner. Also make sure that you have the right subscriptions selected in your Azure settings > **Directories + subscriptions** page.

   The **Price plan** value is updated automatically to read **Microsoft 365**, reflecting your Microsoft 365 license.

1. Select **Next** and review the details for your licensed site. The details listed on the **Review and purchase** pane reflect any licenses you've obtained from the Microsoft 365 admin center.

1. Select the terms and conditions, and then select **Save**.

Your new plan is listed under the relevant subscription on the **Plans and pricing** > **Plans** page. For more information, see [Manage your subscriptions](how-to-manage-subscriptions.md).

## Next steps

> [!div class="step-by-step"]
> [Defender for IoT OT deployment path »](ot-deploy/ot-deploy-path.md)
