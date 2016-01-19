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
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="12/10/2015"
   ms.author="terrylan"/>

# Getting started with Azure Security Center

This document helps you get started quickly with Azure Security Center by guiding you through the security monitoring and policy management components and linking you to next steps.

> [AZURE.NOTE] The information in this document applies to the preview release of Azure Security Center. This is an introduction to the service using an example deployment.  This is not a step-by-step guide.

## What is Azure Security Center?
Azure Security Center helps you prevent, detect, and respond to threats with increased visibility into and control over the security of your Azure resources. It provides integrated security monitoring and policy management across your subscriptions, helps detect threats that might otherwise go unnoticed, and works with a broad ecosystem of security solutions.

## Prerequisites

To get started with Azure Security Center, you must have a subscription to Microsoft Azure. Azure Security Center is enabled with your subscription. If you do not have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/pricing/free-trial).

Azure Security Center is accessed from the [Azure portal](http://azure.microsoft.com/features/azure-portal/). See [portal documentation](https://azure.microsoft.com/documentation/services/azure-portal/) to learn more.


## Accessing Azure Security Center

In the portal, follow these steps to access Azure Security Center:

1. Select **Browse** and scroll to the **Security Center** option.
![][1]

2. Select **Security Center**. This opens the **Security Center** blade.
3. For easy access to the **Security Center** blade in the future, select the **Pin blade to dashboard** option (top right).
![][2]

## Using Azure Security Center

Configure a security **Policy** for your subscription(s):

4. Click the **Security policy** tile on the **Security Center** blade.
5. On the **Security policy – Define policy per subscription** blade, select a subscription.
6. On the **Security policy** blade, turn on **Data collection** to automatically collect logs. Turning on **Data collection** will also provision the monitoring extension on all current and new VMs in the subscription.
7. Click **Choose storage accounts**. For each region in which you have virtual machines running, you choose the storage account where data collected from those virtual machines is stored. If you do not choose a storage account for each region, one will be created for you. Data collected is logically isolated from other customers’ data for security reasons.
8. Turn on the **Recommendations** you’d like to see as part of your security policy. Examples:

  - Turning on **System updates** will scan all supported Virtual Machines for missing OS updates.
  - Turning on **Baseline rules** will scan supported Virtual Machines to identify any OS configurations that could make the Virtual Machine more vulnerable to attack.

![][3]

Address **Recommendations**:

9. Return to the **Security Center** blade and click the **Recommendations** tile.
10.	Azure Security Center periodically analyzes the security state of your Azure resources. When potential security vulnerabilities are identified, a recommendation is shown here.
11.	Click each recommendation to view more information and/or take action to resolve it.

![][4]

View the health and security state of your resources via **Resources health**:

12.	Return to the **Security Center** blade.
13.	The **Resources health** tile contains indicators of the security state for **Virtual machines**, **Networking**, **SQL**, and **Applications**.
14.	Select **Virtual machines** to view more information.
15.	**Virtual machines** blade displays a status summary, including antimalware, system updates, restart, and baseline rules, of your virtual machines.
16.	Select an item under **PREVENTION STEPS** to view more information and/or take action to configure needed controls.
17.	Drill down to view additional information for specific virtual machines.

![][5]

Address **Security Alerts**:

19.	Return to the **Security Center** blade and click the **Security alerts** tile.
20.	On the **Security alerts** blade, a list of alerts is displayed. The alerts were detected by Azure Security Center analysis of your security logs and network activity. Alerts from integrated partner solutions are also included.
  ![][6]

21.	Click an alert to view additional information.

  ![][7]

## Next steps
In this document, you were introduced to the security monitoring and policy management components in Azure Security Center. To learn more, see the following:

- [Setting security policies in Azure Security Center](security-center-policies.md) – Learn how to configure security policies
- [Managing security recommendations in Azure Security Center](security-center-recommendations.md) – Learn how recommendations help you protect your Azure resources
- [Security health monitoring in Azure Security Center](security-center-monitoring.md) – Learn how to monitor the health of your Azure resources
- [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) - Learn how to manage and respond to security alerts
- [Azure Security Center FAQ](security-center-faq.md) – Find frequently asked questions about using the service
- [Azure Security Blog](http://blogs.msdn.com/b/azuresecurity/) – Get the latest Azure security news and information

<!--Image references-->
[1]: ./media/security-center-get-started/security-tile.png
[2]: ./media/security-center-get-started/pin-blade.png
[3]: ./media/security-center-get-started/security-policy.png
[4]: ./media/security-center-get-started/recommendations.png
[5]: ./media/security-center-get-started/resources-health.png
[6]: ./media/security-center-get-started/security-alert.png
[7]: ./media/security-center-get-started/security-alert-detail.png
