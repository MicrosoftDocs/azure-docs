---
title: Upgrade to Azure Defender - Azure Security Center
description: This quickstart shows you how to upgrade to Security Center's Azure Defender for additional security.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: 61e95a87-39c5-48f5-aee6-6f90ddcd336e
ms.service: security-center
ms.devlang: na
ms.topic: quickstart
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/22/2020
ms.author: memildin

---

# Quickstart: Setting up Azure Security Center

Azure Security Center provides unified security management and threat protection across your hybrid cloud workloads. While the free features offer limited security for your Azure resources only, enabling Azure Defender extends these capabilities to on-premises and other clouds. Azure Defender helps you find and fix security vulnerabilities, apply access and application controls to block malicious activity, detect threats using analytics and intelligence, and respond quickly when under attack. You can try Azure Defender at no cost. To learn more, see the [pricing page](https://azure.microsoft.com/pricing/details/security-center/).

In this article, you upgrade to Azure Defender for added security and install the Log Analytics agent on your  machines to monitor for security vulnerabilities and threats.

## Prerequisites
To get started with Security Center, you must have a subscription to Microsoft Azure. If you do not have a subscription, you can sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).

To enable Azure Defender on a subscription, you must be assigned the role of Subscription Owner, Subscription Contributor, or Security Admin.


## Enable Security Center on your Azure subscription

1. Sign into the [Azure portal](https://azure.microsoft.com/features/azure-portal/).

1. From the portal's menu, select **Security Center**. 

    Security Center's overview page opens.

    :::image type="content" source="./media/security-center-get-started/overview.png" alt-text="Security Center's overview dashboard" lightbox="./media/security-center-get-started/overview.png":::

**Security Center – Overview** provides a unified view into the security posture of your hybrid cloud workloads, enabling you to discover and assess the security of your workloads and to identify and mitigate risk. Security Center automatically, at no cost, enables any of your Azure subscriptions not previously onboarded by you or another subscription user.

You can view and filter the list of subscriptions by selecting the **Subscriptions** menu item. Security Center will adjust the display to reflect the security posture of the selected subscriptions. 

Within minutes of launching Security Center the first time, you may see:

- **Recommendations** for ways to improve the security of your connected resources.
- An inventory of your resources that are now being assessed by Security Center, along with the security posture of each.

To take full advantage of Security Center, you need to complete the steps below to enable Azure Defender and install the Log Analytics agent.

> [!TIP]
> To enable Security Center on all subscriptions within a management group, see [Enable Security Center on multiple Azure subscriptions](onboard-management-group.md).

## Enable Azure Defender

For the purpose of the Security Center quickstarts and tutorials you must enable Azure Defender. A free 30-day trial is available. To learn more, see the [pricing page](https://azure.microsoft.com/pricing/details/security-center/). 

1. From Security Center's sidebar, select **Getting started**.

    :::image type="content" source="./media/security-center-get-started/get-started-upgrade-tab.png" alt-text="Upgrade tab of the getting started page"::: 

    The **Upgrade** tab lists subscriptions and workspaces eligible for onboarding.

1. From the **Select workspaces to enable Azure Defender on** list, select the workspaces to upgrade.
   - If you select subscriptions and workspaces that aren't eligible for trial, the next step will upgrade them and charges will begin.
   - If you select a workspace that's eligible for a free trial, the next step will begin a trial.
1. Select **Upgrade** to enable Azure Defender.

## Enable automatic data collection
Security Center collects data from your machines to monitor for security vulnerabilities and threats. Data is collected using the Log Analytics agent, which reads various security-related configurations and event logs from the machine and copies the data to your workspace for analysis. By default, Security Center will create a new workspace for you.

When automatic provisioning is enabled, Security Center installs the Log Analytics agent on all supported machines and any new ones that are created. Automatic provisioning is strongly recommended.

To enable automatic provisioning of the Log Analytics agent:

1. From Security Center's menu, select **Pricing & settings**.
1. Select the relevant subscription.
1. In the **Data collection** page, set **Auto provisioning** to **On**.
1. Select **Save**.

    :::image type="content" source="./media/security-center-enable-data-collection/enable-automatic-provisioning.png" alt-text="Enabling auto-provisioning of the Log Analytics agent":::

>[!TIP]
> If a workspace needs to be provisioned, agent installation might take up to 25 minutes.

With the agent deployed to your machines, Security Center can provide additional recommendations related to system update status, OS security configurations, endpoint protection, as well as generate additional security alerts.

>[!NOTE]
> Setting auto provisioning to **Off** doesn't remove the Log Analytics agent from Azure VMs where the agent has already been provisioned. Disabling automatic provisioning limits security monitoring for your resources.



## Next steps
In this quickstart you enabled Azure Defender and provisioned the Log Analytics agent for unified security management and threat protection across your hybrid cloud workloads. To learn more about how to use Security Center, continue to the quickstart for onboarding Windows computers that are on-premises and in other clouds.

> [!div class="nextstepaction"]
> [Quickstart: Onboard non-Azure machines](quickstart-onboard-machines.md)

Want to optimize and save on your cloud spending?

> [!div class="nextstepaction"]
> [Start analyzing costs with Cost Management](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn)

<!--Image references-->
[2]: ./media/security-center-get-started/overview.png
[4]: ./media/security-center-get-started/get-started.png
[5]: ./media/security-center-get-started/pricing.png
[7]: ./media/security-center-get-started/security-alerts.png
[8]: ./media/security-center-get-started/recommendations.png
[9]: ./media/security-center-get-started/select-subscription.png