<properties
   pageTitle="Getting started with Azure Security Center | Microsoft Azure"
   description="This document helps you get started quickly with Azure Security Center by guiding you through the security monitoring and policy management components and linking you to next steps."
   services="security-center"
   documentationCenter="na"
   authors="TerryLanfear"
   manager="stevenpo"
   editor=""/>

<tags
   ms.service="security-center"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="11/30/2015"
   ms.author="terrylan"/>

# Getting started with Azure Security Center

This document helps you get started quickly with Azure Security Center by guiding you through the security monitoring and policy management components and linking you to next steps.

> [AZURE.NOTE] The information in this document applies to the preview release of Azure Security Center. This is an introduction to the service using an example deployment.  This is not a step-by-step guide.

## What is Azure Security Center?
Azure Security Center helps you prevent, detect, and respond to threats with increased visibility into and control over the security of your Azure resources. It provides integrated security monitoring and policy management across your subscriptions, helps detect threats that might otherwise go unnoticed, and works with a broad ecosystem of security solutions.

## Prerequisites

To get started with Azure Security Center you must have a subscription to Microsoft Azure.  Azure Security Center is enabled with your subscription. If you do not have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/pricing/free-trial).

Azure Security Center is accessed from the [Microsoft Azure portal](http://azure.microsoft.com/en-us/features/azure-portal/). See [Azure portal documentation](https://azure.microsoft.com/en-us/documentation/services/azure-portal/) to learn more.

## Accessing Azure Security Center

In the Azure portal, follow these steps to access Azure Security Center:
1. Select **Browse** and scroll to the **Security** option.

Insert pic

2. Select **Security**. This opens the **Security** blade.
3. For easy access to the **Security** blade in the future, select the **Pin blade to dashboard** option (top right).

## Using Azure Security Center

Configure a security **Policy** for your subscription(s):
4. Click the **Security policy** tile on the **Security** blade.
5. On the **Security policy** blade, select a subscription from the drop down list of all of your subscriptions.
6. On the **Security policy – SUBSCRIPTION** blade, turn on **Data Collection** to automatically collect logs. This will include Microsoft Antimalware logs as well as Microsoft integrated partners.
7. Click **CHOOSE STORAGE ACCOUNTS**.  For each region in which you have virtual machines running, you choose the storage account where data collected from those virtual machines is stored. Data collected is logically isolated from other customers’ data for security reasons.
8. Turn on the **Recommendations** you’d like to see as part of your security policy.  Examples:
  - Turning on **Security updates** will scan all supported Virtual Machines for missing OS patches.
  - Turning on **Baseline Rules** will scan supported Virtual Machines to identify any OS configurations that could make the Virtual Machine more vulnerable to attack.

Insert pic

Address **Recommendations**:
9. Return to the **Security** blade and click the **Recommendations** tile.
10. On the **Recommendations** blade you see a list of items that need to be completed to comply with the security policy.
11. Click each recommendation to view more information and/or configure the recommended security control.

Insert pic

View the health and security state of your resources via **Resources health**:
12.	Return to the **Security** blade and click the **Resources health** tile.
13.	The **Resources health* blade opens and tiles containing an indicator of the security state (as compared to the security policy) are displayed for Virtual machines, Networking, SQL, Applications, and Identity.
14.	The **Resources hierarchy** for your subscription is displayed with a list of resources and an indicator of the security state of each resource (as compared to the security policy).
15.	Click the **Virtual machines** tile to view more information and/or configure security controls.
16.	**Virtual machines** blade displays a status summary, including Antimalware, Patch, Reboot, and Baseline, of your Virtual Machines.
17.	Select an item under **PREVENTION STEPS** to view a more detailed summary.
18.	Drill down to view additional information for specific Virtual Machines.

Insert pic

Address **Security Alerts**:
19.	Return to the **Security** blade and click the **Security alerts** tile.
20.	On the **Security alerts** blade a list of alerts are displayed.  The alerts were detected by Azure Security Center analysis of your security logs.
21.	Click an alert to view additional information.

Insert pic

## Next steps
In this document, you were introduced to the security monitoring and policy management components in Azure Security Center.  To learn more, see the following:
- Setting security policies in Azure Security Center – Learn how to configure security policies
- Implementing security recommendations in Azure Security Center – Learn how recommendations help you protect your Azure resources and stay in compliance with security policies
- Security monitoring in Azure Security Center – Learn how to monitor the health of your Azure resources
- Managing and responding to security alerts in Azure Security Center - Learn how to manage and respond to security alerts
- Azure Security Center FAQ – Find frequently asked questions about using the service
- [Azure Security Blog](http://blogs.msdn.com/b/azuresecurity/) – Find blog posts about Azure security and compliance
