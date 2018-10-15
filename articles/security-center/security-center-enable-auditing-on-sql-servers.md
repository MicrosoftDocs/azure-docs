---
title: Enable auditing and threat detection on SQL servers in Azure Security Center | Microsoft Docs
description: This document shows you how to implement the Azure Security Center recommendation **Enable Auditing & Threat detection on SQL servers**.
services: security-center
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: ''

ms.assetid: 042fca4d-7dab-4172-8614-e8c21ccb4960
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/30/2017
ms.author: terrylan

---
# Enable auditing and threat detection on SQL servers in Azure Security Center
Azure Security Center will recommend that you turn on auditing and threat detection for all databases on your Azure SQL servers if auditing is not already enabled. Auditing and threat detection can help you maintain regulatory compliance, understand database activity, and gain insight into discrepancies and anomalies that could indicate business concerns or suspected security violations.

Once you’ve turned on auditing you can configure Threat Detection settings and emails to receive security alerts. Threat Detection detects anomalous database activities indicating potential security threats to the database. This enables you to detect and respond to potential threats as they occur.

This recommendation applies to the Azure SQL service only; it doesn’t include SQL Server running on your virtual machines in Azure Infrastructure Services (Azure IaaS).

> [!NOTE]
> This document introduces the service by using an example deployment.  This is not a step-by-step guide.
>
>

## Implement the recommendation
1. In the **Recommendations** blade, select **Enable Auditing & Threat detection on SQL servers**.  This opens the **Enable Auditing & Threat detection on SQL servers** blade.

   ![Enable auditing on SQL servers][1]
2. Select a SQL server to enable auditing and threat detection on. This opens the **Auditing & Threat Detection** blade.

3. On the **Auditing & Threat Detection** blade, select **ON** under **Auditing**.

   ![Turn on auditing settings][2]
4. Follow the steps in [SQL database auditing in the Azure portal](../sql-database/sql-database-auditing-portal.md) to configure storage where your audit logs will be stored. The subscription's storage account for data collection is the default storage account.
5. Follow the steps in [Get started with SQL Database Threat Detection](../sql-database/sql-database-threat-detection.md) to turn on and configure Threat Detection and to configure the list of emails that will receive security alerts upon detection of anomalous activities.

## See also
This article showed you how to implement the Security Center recommendation "Enable auditing and threat detection on SQL servers." To learn more about securing your SQL database, see the following:

* [Securing your SQL Database](../sql-database/sql-database-security-overview.md)

To learn more about Security Center, see the following:

* [Setting security policies in Azure Security Center](security-center-policies.md) -- Learn how to configure security policies for your Azure subscriptions and resource groups.
* [Managing security recommendations in Azure Security Center](security-center-recommendations.md) -- Learn how recommendations help you protect your Azure resources.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md) -- Learn how to monitor the health of your Azure resources.
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) -- Learn how to manage and respond to security alerts.
* [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md) -- Learn how to monitor the health status of your partner solutions.
* [Azure Security Center FAQ](security-center-faq.md) -- Find frequently asked questions about using the service.
* [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/) -- Get the latest Azure security news and information.

<!--Image references-->
[1]: ./media/security-center-enable-auditing-on-sql-server/enable-auditing-on-sql-servers.png
[2]: ./media/security-center-enable-auditing-on-sql-server/auditing-settings-blade.png
