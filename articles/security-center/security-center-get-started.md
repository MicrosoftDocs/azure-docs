---
title: Azure Security Center Quickstart - Onboard your Azure subscription to Security Center Standard | Microsoft Docs
description: This quickstart shows you how to upgrade to Security Center's Standard pricing tier for additional security.
services: security-center
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: ''

ms.assetid: 61e95a87-39c5-48f5-aee6-6f90ddcd336e
ms.service: security-center
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/28/2017
ms.author: terrylan

---
# Quickstart: Onboard your Azure subscription to Security Center Standard
Azure Security Center helps you prevent, detect, and respond to threats. Security Center provides you increased visibility into, and control over, the security of your workloads running in Azure, on-premises, and in other clouds. It provides integrated security monitoring and policy management, helps detect threats that might otherwise go unnoticed, and works with a broad ecosystem of security solutions.

The Security Center Standard pricing tier extends Security Center’s capabilities to workloads running in private and other public clouds, providing unified security management and threat protection across your hybrid cloud workloads. The Standard tier also adds advanced threat detection capabilities, which uses built-in behavioral analytics and machine learning to identify attacks and zero-day exploits, access and application controls to reduce exposure to network attacks and malware, and more. You can try Security Center Standard at no cost for the first 60 days.

This quickstart shows you how to:

- Launch Security Center
- Enable Security Center Standard for your Azure subscription
- Upgrade to the Standard tier for additional security
- Install the Microsoft Monitoring Agent on your virtual machines (VMs)

## Prerequisites
To get started with Security Center, you must have a subscription to Microsoft Azure. If you do not have a subscription, you can sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).

To upgrade a subscription to the Standard tier, you must be assigned the role of Subscription Owner, Subscription Contributor, or Security Admin.

You must upgrade to Standard to complete this quickstart. Standard is also required to complete the other Security Center quickstarts and tutorials.

## Launch Security Center

1. Sign into the [Azure portal](https://azure.microsoft.com/features/azure-portal/).
2. On the **Microsoft Azure** menu, select **Security Center**.

  ![Azure menu][1]

  **Security Center - Overview** opens.

 ![Security Center overview][2]

**Security Center – Overview** provides a centralized view into the security posture of your Azure and non-Azure workloads, enabling you to discover and assess the security of your workloads and to identify and mitigate risk.

Under **Overview** you have:

- **Recommendations** - lets you know the total number of recommendations identified by Security Center. When Security Center identifies potential security vulnerabilities, it creates recommendations. The recommendations guide you through the process of configuring the needed controls.
- **Security solutions** - lets you monitor, at a glance, the health status of your partner solutions integrated with your Azure subscription. You can also connect other types of security data sources.
- **Events** - displays the number of events flowing into Security Center from your Azure VMs and non-Azure computers.

Under **Prevention**, you can monitor the security state of your resources. Each resource's tile (Compute, Networking, Storage & data, and Application) has the total number of issues identified by Security Center.

Under **Detection**, you can review your current alerts and identify your most attacked resources. Security Center automatically collects, analyzes, and integrates log data from your Azure resources, the network, and connected partner solutions, like firewall and endpoint protection solutions, to detect real threats and reduce false positives.

## Enable your Azure subscription
Security Center will automatically enable any of your Azure subscriptions not previously onboarded by you or another subscription user to the Free tier. You can view and filter the list of subscriptions by clicking the **Subscriptions** menu item. Security Center will now begin assessing the security of these subscriptions to identify security vulnerabilities. To customize the types of assessments, you can modify the security policy. A security policy defines the desired configuration of your workloads and helps ensure compliance with company or regulatory security requirements.

## Upgrade to the Standard tier
For the purpose of this quickstart you must upgrade to the Standard tier. To complete the Security Center quickstarts and tutorials, you need to run the Standard tier. Once you are done, you can return to the Free tier.

1. Under the Security Center main menu, select **Onboarding to advanced security**.

  ![Onboarding to advanced security][3]

2. Under **Onboarding to advanced security**, Security Center lists subscriptions and workspaces eligible for onboarding. Select a subscription from the list.

  ![Select a subscription][4]

3. **Security policy** provides information on the resource groups contained in the subscription. **Pricing** also opens.  Under **Pricing**, select **Standard** to upgrade from Free to Standard.

  ![Select Standard][5]

4. Select **Save**.

## Install the Microsoft Monitoring Agent
Security Center collects data from your Azure VMs and non-Azure computers to monitor for security vulnerabilities and threats. Data is collected using the Microsoft Monitoring Agent, which reads various security-related configurations and event logs from the machine and copies the data to your workspace for analysis.

When automatic provisioning is enabled, Security Center provisions the Microsoft Monitoring Agent on all supported Azure VMs and any new ones that are created. Automatic provisioning is strongly recommended.

To enable automatic provisioning of the Microsoft Monitoring Agent:

1. Under the Security Center main menu, select **Security Policy**.
2. Select the subscription.
3. Under **Security policy**, select **Data Collection**.
4. Under **Data Collection**, select **On** to enable automatic provisioning.
5. Select **Save**.

  ![Enable automatic provisioning][6]

## Clean up resources
Other quickstarts and tutorials in this collection build upon this quickstart. If you plan to continue on to work with subsequent quickstarts and tutorials, continue running the Standard tier and keep automatic provisioning enabled. If you do not plan to continue or wish to return to the Free tier:

1. Return to the Security Center main menu and select **Security Policy**.
2. Select the subscription or policy that you want to return to Free. **Security policy** opens.
3. Under **POLICY COMPONENTS**, select **Pricing tier**.
4. Select **Free** to change subscription from Standard tier to Free tier.
5. Select **Save**.

If you wish to disable automatic provisioning:

1. Return to the Security Center main menu and select **Security policy**.
2. Select the subscription that you wish to disable automatic provisioning.
3. Under **Security policy – Data Collection**, select **Off** under **Onboarding** to disable automatic provisioning.
4. Select **Save**.

>[!NOTE]
> Disabling automatic provisioning does not remove the Microsoft Monitoring Agent from Azure VMs where the agent has been provisioned. Disabling automatic provisioning limits security monitoring for your resources.
>

## Next steps
In this quick start, you onboarded an Azure subscription, upgraded to Standard tier, and provisioned the Microsoft Monitoring agent. To learn more about how to use Security Center, continue to the tutorial for configuring a security policy and assessing the security of your resources.

> [!div class="nextstepaction"]
> [Quickstart: Onboard Windows computers to Azure Security Center](quickstart-onboard-windows-computer.md)

<!--Image references-->
[1]: ./media/security-center-get-started/portal.png
[2]: ./media/security-center-get-started/overview.png
[3]: ./media/security-center-get-started/onboarding.png
[4]: ./media/security-center-get-started/select-subscription.png
[5]: ./media/security-center-get-started/pricing.png
[6]: ./media/security-center-get-started/enable-automatic-provisioning.png
