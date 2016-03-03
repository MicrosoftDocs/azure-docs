<properties
   pageTitle="Getting started with Azure Security Center | Microsoft Azure"
   description="This document helps you get started quickly with Azure Security Center by guiding you through the security monitoring and policy management components and linking you to next steps."
   services="security-center"
   documentationCenter="na"
   authors="TerryLanfear"
   manager="StevenPo"
   editor=""/>

<tags
   ms.service="security-center"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="03/02/2016"
   ms.author="terrylan"/>

# Getting started with Azure Security Center

This document helps you get started quickly with Azure Security Center by guiding you through the security monitoring and policy management components and linking you to next steps.

> [AZURE.NOTE] The information in this document applies to the preview release of Azure Security Center. This document introduces the service by using an example deployment. This is not a step-by-step guide.

## What is Azure Security Center?
 Security Center helps you prevent, detect, and respond to threats with increased visibility into and control over the security of your Azure resources. It provides integrated security monitoring and policy management across your subscriptions, helps detect threats that might otherwise go unnoticed, and works with a broad ecosystem of security solutions.

## Prerequisites

To get started with Security Center, you must have a subscription to Microsoft Azure. Security Center is enabled with your subscription. If you do not have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/pricing/free-trial/).

 Security Center is accessed from the [Azure portal](https://azure.microsoft.com/features/azure-portal/). See the [portal documentation](https://azure.microsoft.com/documentation/services/azure-portal/) to learn more.


## Access Security Center

In the portal, follow these steps to access Security Center:

1. Select **Browse**, and then scroll to the **Security Center** option.
![Access Azure Security Center in the portal][1]

2. Select **Security Center**. This opens the **Security Center** blade.
3. For easy access to the **Security Center** blade in the future, select the **Pin blade to dashboard** option (top right).
![Pin blade to dashboard option][2]

## Use Security Center

You can configure security policies for your Azure subscriptions and resource groups. Let's configure a security **policy** for your subscription:

1. Select the **Security policy** tile on the **Security Center** blade.
![Security Center][3]

2. On the **Security policy-Define policy per subscription or resource group** blade, select a subscription.
![The security policy blade in Azure Security Center][4]

3. On the **Security policy** blade, turn on **Data collection** to automatically collect logs. Turning on **Data collection** will also provision the monitoring extension on all current and new VMs in the subscription.
4. Select **Choose a storage account per region**. For each region in which you have virtual machines running, you choose the storage account where data collected from those virtual machines is stored. If you do not choose a storage account for each region, it will be created for you. The data that's collected is logically isolated from other customers’ data for security reasons.

     > [AZURE.NOTE] We recommend that you turn on data collection and choose a storage account at the subscription level first.  Security policies can be set at the Azure subscription level and resource group level but configuration of data collection and storage account occurs at the subscription level only.

5. Turn on the **Recommendations** you’d like to see as part of your security policy. Examples:

 - Turning on **System updates** will scan all supported virtual machines for missing OS updates.
 - Turning on **Baseline rules** will scan all supported virtual machines to identify any OS configurations that could make the virtual machine more vulnerable to attack.

Address **Recommendations**:

1. Return to the **Security Center** blade and select the **Recommendations** tile. Security Center periodically analyzes the security state of your Azure resources. When potential security vulnerabilities are identified, a recommendation is shown here.
2.	Select each recommendation to view more information and/or to take action to resolve the issue.
![Recommendations in Azure Security Center][5]

View the health and security state of your resources via **Resources health**:

1.	Return to the **Security Center** blade.
2.	The **Resources health** tile contains indicators of the security state for **Virtual machines**, **Networking**, **SQL**, and **Applications**.
3.	Select **Virtual machines** to view more information.
4.	The **Virtual machines** blade displays a status summary that shows the status of antimalware programs, system updates, restarts, and the baseline rules of your virtual machines.
5.	Select an item under **PREVENTION STEPS** to view more information and/or to take action to configure necessary controls.
6.	Drill down to view additional information for specific virtual machines.
![The Resources health tile in Azure Security Center][6]

Address **Security Alerts**:

1.	Return to the **Security Center** blade and select the **Security alerts** tile. On the **Security alerts** blade, a list of alerts is displayed. The alerts are generated by the Security Center analysis of your security logs and network activity. Alerts from integrated partner solutions are also included.
![Security alerts in Azure Security Center][7]

2.	Select an alert to view additional information.
![Security alert details in Azure Security Center][8]

## Next steps
In this document, you were introduced to the security monitoring and policy management components in Security Center. To learn more, see the following:

- [Setting security policies in Azure Security Center](security-center-policies.md)--Learn how to configure security policies for your Azure subscriptions and resource groups.
- [Managing security recommendations in Azure Security Center](security-center-recommendations.md)--Learn how recommendations help you protect your Azure resources.
- [Security health monitoring in Azure Security Center](security-center-monitoring.md)--Learn how to monitor the health of your Azure resources.
- [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md)--Learn how to manage and respond to security alerts.
- [Azure Security Center FAQ](security-center-faq.md)--Find frequently asked questions about using the service.
- [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/)--Get the latest Azure security news and information.

<!--Image references-->
[1]: ./media/security-center-get-started/security-tile.png
[2]: ./media/security-center-get-started/pin-blade.png
[3]: ./media/security-center-get-started/security-center.png
[4]: ./media/security-center-get-started/security-policy.png
[5]: ./media/security-center-get-started/recommendations.png
[6]: ./media/security-center-get-started/resources-health.png
[7]: ./media/security-center-get-started/security-alert.png
[8]: ./media/security-center-get-started/security-alert-detail.png
