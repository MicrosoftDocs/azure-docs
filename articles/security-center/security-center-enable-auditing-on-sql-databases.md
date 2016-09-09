<properties
   pageTitle="Enable auditing on SQL databases in Azure Security Center | Microsoft Azure"
   description="This document shows you how to implement the Azure Security Center recommendation **Enable auditing on SQL databases**."
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
   ms.date="07/29/2016"
   ms.author="terrylan"/>

# Enable auditing on SQL databases in Azure Security Center

Azure Security Center will recommend that you turn on auditing for all SQL databases if auditing is not already enabled. Auditing can help you maintain regulatory compliance, understand database activity, and gain insight into discrepancies and anomalies that could indicate business concerns or suspected security violations.

Once you’ve turned on auditing you can configure Threat Detection settings and emails to receive security alerts. Threat Detection detects anomalous database activities indicating potential security threats to the database. This enables you to detect and respond to potential threats as they occur.

This recommendation applies to the Azure SQL service only; doesn't include SQL running on your virtual machines.

> [AZURE.NOTE] This document introduces the service by using an example deployment.  This is not a step-by-step guide.

## Implement the recommendation

1. In the **Recommendations** blade, select **Enable Auditing on SQL databases**.  This opens the **Enable Auditing on SQL databases** blade.
![Enable auditing on SQL databases][1]

2. Select a SQL database to enable auditing on. This opens the **Auditing & Threat detection** blade.
![Auditing and threat detection][2]
3. On the **Auditing & Threat detection** blade, select **ON** under **Auditing**.
![Turn on auditing and threat detection][3]


5. Follow the steps in [Get started with SQL Database Threat Detection](../sql-database/sql-database-threat-detection-get-started.md) to turn on and configure Threat Detection and to configure the list of emails that will receive security alerts upon detection of anomalous activities.

## See also

This article showed you how to implement the Security Center recommendation "Enable auditing on SQL databases." To learn more about securing your SQL database, see the following:

- [Securing your SQL Database](../sql-database/sql-database-security.md)

To learn more about Security Center, see the following:

- [Setting security policies in Azure Security Center](security-center-policies.md) -- Learn how to configure security policies for your Azure subscriptions and resource groups.
- [Managing security recommendations in Azure Security Center](security-center-recommendations.md) -- Learn how recommendations help you protect your Azure resources.
- [Security health monitoring in Azure Security Center](security-center-monitoring.md) -- Learn how to monitor the health of your Azure resources.
- [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) -- Learn how to manage and respond to security alerts.
- [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md) -- Learn how to monitor the health status of your partner solutions.
- [Azure Security Center FAQ](security-center-faq.md) -- Find frequently asked questions about using the service.
- [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/) -- Get the latest Azure security news and information.

<!--Image references-->
[1]: ./media/security-center-enable-auditing-on-sql-databases/enable-auditing-on-sql-databases.png
[2]:./media/security-center-enable-auditing-on-sql-databases/auditing-threat-detection.png
[3]: ./media/security-center-enable-auditing-on-sql-databases/auditing-threat-detection-blade.png
