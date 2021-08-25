---
title: Upgrade to Azure Defender - Azure Security Center
description: This quickstart shows you how to upgrade to Security Center's Azure Defender for additional security.
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: quickstart
ms.date: 02/17/2021
ms.author: memildin

---

# Quickstart: Set up Azure Security Center

Azure Security Center provides unified security management and threat protection across your hybrid and multi-cloud workloads. While the free features offer limited security for your Azure resources only, enabling Azure Defender extends these capabilities to on-premises and other clouds. Azure Defender helps you find and fix security vulnerabilities, apply access and application controls to block malicious activity, detect threats using analytics and intelligence, and respond quickly when under attack. You can try Azure Defender at no cost. To learn more, see the [pricing page](https://azure.microsoft.com/pricing/details/security-center/).

This quickstart section will walk you through all the recommended steps to enable Azure Security Center and Azure Defender. When you've completed all the quickstart steps, you'll have:

> [!div class="checklist"]
> * Security Center enabled on your Azure subscriptions
> * Azure Defender enabled on your Azure subscriptions
> * Automatic data collection set up
> * Email notifications set up for security alerts
> * Your hybrid and multi-cloud machines connected to Azure

## Prerequisites
To get started with Security Center, you must have a subscription to Microsoft Azure. If you do not have a subscription, you can sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).

To enable Azure Defender on a subscription, you must be assigned the role of Subscription Owner, Subscription Contributor, or Security Admin.

## Enable Security Center on your Azure subscription

> [!TIP]
> To enable Security Center on all subscriptions within a management group, see [Enable Security Center on multiple Azure subscriptions](onboard-management-group.md).

1. Sign into the [Azure portal](https://azure.microsoft.com/features/azure-portal/).

1. From the portal's menu, select **Security Center**. 

    Security Center's overview page opens.

    :::image type="content" source="./media/security-center-get-started/overview.png" alt-text="Security Center's overview dashboard" lightbox="./media/security-center-get-started/overview.png":::

    **Security Center – Overview** provides a unified view into the security posture of your hybrid cloud workloads, enabling you to discover and assess the security of your workloads and to identify and mitigate risk. Security Center automatically, at no cost, enables any of your Azure subscriptions not previously onboarded by you or another subscription user.

You can view and filter the list of subscriptions by selecting the **Subscriptions** menu item. Security Center will adjust the display to reflect the security posture of the selected subscriptions. 

Within minutes of launching Security Center the first time, you might see:

- **Recommendations** for ways to improve the security of your connected resources.
- An inventory of your resources that are now being assessed by Security Center, along with the security posture of each.

To take full advantage of Security Center, continue with the next steps of the quickstart section.



## Next steps
In this quickstart you enabled Azure Security Center. The next step is to enable Azure Defender for unified security management and threat protection across your hybrid cloud workloads.

> [!div class="nextstepaction"]
> [Quickstart: Enable Azure Defender](enable-azure-defender.md)