<properties
   pageTitle="Enable data collection in Azure Security Center | Microsoft Azure"
   description=" Learn how to enable data collection in Azure Security Center. "
   services="security-center"
   documentationCenter="na"
   authors="TerryLanfear"
   manager="MBaldwin"
   editor=""/>

<tags
   ms.service="security-center"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/21/2016"
   ms.author="terrylan"/>

# Enable data collection in Azure Security Center

To help customers prevent, detect, and respond to threats, Azure Security Center collects and processes data about your Azure virtual machines, including configuration information, metadata, event logs, and more. When you first access Security Center, data collection is enabled on all virtual machines in your subscription. Data collection is recommended but you can opt-out by turning data collection off in the Security Center policy (see [Disabling data collection](#disabling-data-collection)). If you turn data collection off, Security Center will recommend that you turn on data collection in the security policy for that subscription.

> [AZURE.NOTE] This document introduces the service by using an example deployment. This is not a step-by-step guide.

## Implement the recommendation

1. Select the **Recommendations** tile on the **Security Center** blade.  This opens the **Recommendations** blade.
![Security Center blade][1]

2. On the **Recommendations** blade, select **Enable data collection for subscriptions**.  This will open the **Turn on data collection** blade.
![Recommendations blade][2]

3. On the **Turn on data collection** blade, select your subscription. The **Security policy** blade for that subscription opens.

4. On the **Security policy** blade, select **On** under **Data collection** to automatically collect logs. Turning on data collection will also provision the monitoring extension on all current and new supported VMs in the subscription.
![Security policy blade][3]

5.	Select **Save**.

6.	Select **Choose a storage account per region**. For each region in which you have virtual machines running, you choose the storage account where data collected from those virtual machines is stored. If you do not choose a storage account for each region, it will be automatically created for you. In this example, we’ll choose **newstoracct**. You can change the storage account later by returning to the security policy for your subscription and choosing a different storage account.
![Choose a storage account][4]

7.	Select **OK**.

> [AZURE.NOTE] We recommend that you turn on data collection and choose a storage account at the subscription level first. Security policies can be set at the Azure subscription level and resource group level but configuration of data collection and storage account occurs at the subscription level only.

## After data collection is enabled

Data collection is enabled via the Azure Monitoring Agent and the Azure Security Monitoring extension. The Azure Security Monitoring extension scans for various security relevant configuration and sends it into [Event Tracing for Windows](https://msdn.microsoft.com/library/windows/desktop/bb968803.aspx) (ETW) traces. In addition, the operating system creates event log entries. The Azure Monitoring Agent reads event log entries and ETW traces and copies them to your storage account for analysis. The Monitoring Agent also copies crash dump files to your storage account. This is the storage account you configured in the security policy.

## Disabling data collection

You can disable data collection at any time, which will remove any Monitoring Agents previous installed by Security Center.  You must select a subscription to turn data collection off.

> [AZURE.NOTE] Security policies can be set at the Azure subscription level and resource group level but you must select a subscription to turn data collection off.

1.	Return to the **Security Center** blade and select the **Policy** tile. This opens the **Security policy-Define policy per subscription or resource group** blade.
![Select the policy tile][5]

2.	On the **Security policy-Define policy per subscription or resource group** blade, select the subscription that you wish to disable data collection.
![Select subscription to disable data collection][6]

3.	The **Security policy** blade for that subscription opens.  Select **Off** under Data collection.

4.	Select **Save** in the top ribbon.

5.	Select **Delete agents** in the top ribbon to remove agents from existing virtual machines.

## See also

This article showed you how to implement the Security Center recommendation "Enable data collection.” To learn more about Security Center, see the following:

- [Setting security policies in Azure Security Center](security-center-policies.md) -- Learn how to configure security policies for your Azure subscriptions and resource groups.
- [Managing security recommendations in Azure Security Center](security-center-recommendations.md) -- Learn how recommendations help you protect your Azure resources.
- [Security health monitoring in Azure Security Center](security-center-monitoring.md)--Learn how to monitor the health of your Azure resources.
- [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md)--Learn how to manage and respond to security alerts.
- [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md) -- Learn how to monitor the health status of your partner solutions.
- [Azure Security Center FAQ](security-center-faq.md)--Find frequently asked questions about using the service.
- [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/)--Get the latest Azure security news and information.

<!--Image references-->
[1]: ./media/security-center-enable-data-collection/security-center-blade.png
[2]: ./media/security-center-enable-data-collection/recommendations.png
[3]: ./media/security-center-enable-data-collection/data-collection.png
[4]: ./media/security-center-enable-data-collection/storage-account.png
[5]: ./media/security-center-enable-data-collection/policy.png
[6]: ./media/security-center-enable-data-collection/disable-data-collection.png
