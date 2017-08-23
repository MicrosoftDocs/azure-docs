---
title: Enable data collection in Azure Security Center | Microsoft Docs
description: " Learn how to enable data collection in Azure Security Center. "
services: security-center
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: ''

ms.assetid: 411d7bae-c9d4-4e83-be63-9f2f2312b075
ms.service: security-center
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/16/2017
ms.author: terrylan

---
# Enable data collection in Azure Security Center

> [!NOTE]
> Beginning in early June 2017, Security Center will use the Microsoft Monitoring Agent to collect and store data. To learn more, see [Azure Security Center Platform Migration](security-center-platform-migration.md). The information in this article represents Security Center functionality after transition to the Microsoft Monitoring Agent.
>
>

Security Center collects data from your virtual machines (VMs) to assess their security state, provide security recommendations, and alert you to threats. When you first access Security Center, you have the option to enable data collection for all VMs in your subscription. If data collection is not enabled, Security Center recommends that you turn on data collection in the security policy for that subscription.

When data collection is enabled, Security Center provisions the Microsoft Monitoring Agent on all existing supported Azure virtual machines and any new ones that are created. The Microsoft Monitoring Agent scans for various security-related configurations. In addition, the operating system raises event log events. Examples of such data are: operating system type and version, operating system logs (Windows event logs), running processes, machine name, IP addresses, logged in user, and tenant ID. The Microsoft Monitoring Agent reads event log entries and configurations and copies the data to your workspace for analysis. The Microsoft Monitoring Agent also copies crash dump files to your workspace.

If you are using the Free tier of Security Center, you can disable data collection from virtual machines by turning off data collection in the security policy. Disabling data collection limits security assessments for your VMs. To learn more, see [Disabling data collection](#disabling-data-collection). VM disk snapshots and artifact collection are enabled even if data collection has been disabled. Data collection is required for subscriptions on the Standard tier of Security Center.

> [!NOTE]
> Learn more about Security Center's Free and Standard [pricing tiers](security-center-pricing.md).
>
>

## Implement the recommendation

> [!NOTE]
> This document introduces the service by using an example deployment. This document is not a step-by-step guide.
>
>

1. In the **Recommendations** blade, select **Enable data collection for subscriptions**.  This opens the **Turn on data collection** blade.
   ![Recommendations blade][2]
2. On the **Turn on data collection** blade, select your subscription. The **Security policy** blade for that subscription opens.
3. On the **Security policy** blade, select **On** under **Data collection** to automatically collect logs. Turning on data collection provisions the monitoring extension on all current and new supported VMs in the subscription.
4. Select **Save**.
5. Select **OK**.

## Disabling data collection
If you are using the Free tier of Security Center, you can disable data collection from virtual machines at any time by turning off data collection in the security policy. Data collection is required for subscriptions on the Standard tier of Security Center.

1. Return to the **Security Center** blade and select the **Policy** tile. This opens the **Security policy-Define policy per subscription** blade.
   ![Select the policy tile][5]
2. On the **Security policy-Define policy per subscription** blade, select the subscription that you wish to disable data collection.
3. The **Security policy** blade for that subscription opens.  Select **Off** under Data collection.
4. Select **Save** in the top ribbon.

## Next steps
This article showed you how to implement the Security Center recommendation "Enable data collection.” To learn more about Security Center, see the following:

* [Setting security policies in Azure Security Center](security-center-policies.md) -- Learn how to configure security policies for your Azure subscriptions and resource groups.
* [Managing security recommendations in Azure Security Center](security-center-recommendations.md) -- Learn how recommendations help you protect your Azure resources.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md)--Learn how to monitor the health of your Azure resources.
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md)--Learn how to manage and respond to security alerts.
* [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md) -- Learn how to monitor the health status of your partner solutions.
- [Azure Security Center data security](security-center-data-security.md) - Learn how data is managed and safeguarded in Security Center.
* [Azure Security Center FAQ](security-center-faq.md)--Find frequently asked questions about using the service.
* [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/)--Get the latest Azure security news and information.

<!--Image references-->
[2]: ./media/security-center-enable-data-collection/recommendations.png
[3]: ./media/security-center-enable-data-collection/data-collection.png
[4]: ./media/security-center-enable-data-collection/storage-account.png
[5]: ./media/security-center-enable-data-collection/policy.png
[6]: ./media/security-center-enable-data-collection/disable-data-collection.png
