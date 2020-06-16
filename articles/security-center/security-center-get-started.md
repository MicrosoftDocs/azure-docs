---
title: Upgrade to Standard tier - Azure Security Center
description: This quickstart shows you how to upgrade to Security Center's Standard pricing tier for additional security.
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
ms.date: 12/3/2018
ms.author: memildin

---
# Quickstart: Onboard your Azure subscription to Security Center Standard
Azure Security Center provides unified security management and threat protection across your hybrid cloud workloads. While the Free tier offers limited security for your Azure resources only, the Standard tier extends these capabilities to on-premises and other clouds. Security Center Standard helps you find and fix security vulnerabilities, apply access and application controls to block malicious activity, detect threats using analytics and intelligence, and respond quickly when under attack. You can try Security Center Standard at no cost. To learn more, see the [pricing page](https://azure.microsoft.com/pricing/details/security-center/).

In this article, you upgrade to the Standard tier for added security and install the Log Analytics agent on your virtual machines to monitor for security vulnerabilities and threats.

## Prerequisites
To get started with Security Center, you must have a subscription to Microsoft Azure. If you do not have a subscription, you can sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).

To upgrade a subscription to the Standard tier, you must be assigned the role of Subscription Owner, Subscription Contributor, or Security Admin.

## Enable your Azure subscription

1. Sign into the [Azure portal](https://azure.microsoft.com/features/azure-portal/).
2. On the **Microsoft Azure** menu, select **Security Center**. **Security Center - Overview** opens.

   ![Security Center overview][2]

**Security Center – Overview** provides a unified view into the security posture of your hybrid cloud workloads, enabling you to discover and assess the security of your workloads and to identify and mitigate risk. Security Center automatically enables any of your Azure subscriptions not previously onboarded by you or another subscription user to the Free tier.

You can view and filter the list of subscriptions by clicking the **Subscriptions** menu item. Security Center will now begin assessing the security of these subscriptions to identify security vulnerabilities. To customize the types of assessments, you can modify the security policy. A security policy defines the desired configuration of your workloads and helps ensure compliance with company or regulatory security requirements.

Within minutes of launching Security Center the first time, you may see:

- **Recommendations** for ways to improve the security of your Azure subscriptions. Clicking the **Recommendations** tile will launch a prioritized list.
- An inventory of **Compute & apps**, **Networking**, **Data security**, and **Identity & access** resources that are now being assessed by Security Center along with the security posture of each.

To take full advantage of Security Center, you need to complete the steps below to upgrade to the Standard tier and install the Log Analytics agent.

## Upgrade to the Standard tier
For the purpose of the Security Center quickstarts and tutorials you must upgrade to the Standard tier. There's a free trial of Security Center Standard. To learn more, see the [pricing page](https://azure.microsoft.com/pricing/details/security-center/). 

1. Under the Security Center main menu, select **Getting started**.
 
   ![Get started][4]

2. Under **Upgrade**, Security Center lists subscriptions and workspaces eligible for onboarding. 
   - You can click on the expandable **Apply your trial** to see a list of all subscriptions and workspaces with their trial eligibility status.
   -	You can upgrade subscriptions and workspaces that are not eligible for trial.
   -	You can select eligible workspaces and subscriptions to start your trial.
3. Click **Start trial** to start your trial on the selected subscriptions.


  ![Security alerts][9]

## Automate data collection
Security Center collects data from your Azure VMs and non-Azure computers to monitor for security vulnerabilities and threats. Data is collected using the Log Analytics agent, which reads various security-related configurations and event logs from the machine and copies the data to your workspace for analysis. By default, Security Center will create a new workspace for you.

When automatic provisioning is enabled, Security Center installs the Log Analytics agent on all supported Azure VMs and any new ones that are created. Automatic provisioning is strongly recommended.

To enable automatic provisioning of the Log Analytics agent:

1. Under the Security Center main menu, select **Pricing & settings**.
2. On the row of the subscription, click on the subscription on which you'd like to change the settings.
3. In the **Data Collection** tab, set **Auto provisioning** to **On**.
4. Select **Save**.
---
  ![Enable automatic provisioning][6]

With this new insight into your Azure VMs, Security Center can provide additional Recommendations related to system update status, OS security configurations, endpoint protection, as well as generate additional Security alerts.

  ![Recommendations][8]

## Clean up resources
Other quickstarts and tutorials in this collection build upon this quickstart. If you plan to continue on to work with subsequent quickstarts and tutorials, continue running the Standard tier and keep automatic provisioning enabled. If you do not plan to continue or wish to return to the Free tier:

1. Return to the Security Center main menu and select **Pricing & settings**.
2. Click on the subscription that you want to change to the free tier.
3. Select **Pricing tier** and select **Free** to change subscription from Standard tier to Free tier.
5. Select **Save**.

If you wish to disable automatic provisioning:

1. Return to the Security Center main menu and select **Pricing & settings**.
2. Clean on the subscription that you want to disable automatic provisioning on.
3. In the **Data Collection** tab, set **Auto provisioning** to **Off**.
4. Select **Save**.

>[!NOTE]
> Disabling automatic provisioning does not remove the Log Analytics agent from Azure VMs where the agent has been provisioned. Disabling automatic provisioning limits security monitoring for your resources.
>

## Next steps
In this quickstart you upgraded to Standard tier and provisioned the Log Analytics agent for unified security management and threat protection across your hybrid cloud workloads. To learn more about how to use Security Center, continue to the quickstart for onboarding Windows computers that are on-premises and in other clouds.

> [!div class="nextstepaction"]
> [Quickstart: Onboard Windows computers to Azure Security Center](quick-onboard-windows-computer.md)

<!--Image references-->
[2]: ./media/security-center-get-started/overview.png
[4]: ./media/security-center-get-started/get-started.png
[5]: ./media/security-center-get-started/pricing.png
[6]: ./media/security-center-get-started/enable-automatic-provisioning.png
[7]: ./media/security-center-get-started/security-alerts.png
[8]: ./media/security-center-get-started/recommendations.png
[9]: ./media/security-center-get-started/select-subscription.png
