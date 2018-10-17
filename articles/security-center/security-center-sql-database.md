---
title: Azure Security Center and Azure SQL Database service | Microsoft Docs
description: This article shows how Security Center can help you secure your databases in Azure SQL Database.
services: sql-database
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: ''

ms.assetid: f109adfd-daed-4257-9692-2042a1399480
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/02/2017
ms.author: terrylan

---
# Azure Security Center and Azure SQL Database service
[Azure Security Center](https://azure.microsoft.com/documentation/services/security-center/) helps you prevent, detect, and respond to threats. It provides integrated security monitoring and policy management across your Azure subscriptions, helps detect threats that might otherwise go unnoticed, and works with a broad ecosystem of security solutions.

This article shows how Security Center can help you secure your databases in Azure SQL Database.

## Why use Security Center?
Security Center helps you safeguard data in SQL Database by providing visibility into the security of all your servers and databases. With Security Center, you can:

* Define policies for SQL Database encryption and auditing.
* Monitor the security of SQL Database resources across all your subscriptions.
* Quickly identify and remediate security issues.
* Integrate alerts from [Azure SQL Database threat detection](../sql-database/sql-database-threat-detection.md).

In addition to helping protect your SQL Database resources, Security Center also provides security monitoring and management for Azure virtual machines, Cloud Services, App Services, virtual networks, and more. Learn more about Security Center [here](security-center-intro.md).

## Prerequisites
To get started with Security Center, you must have a subscription to Microsoft Azure. The Free tier of Security Center is enabled with your subscription. For more information on Security Center’s Free and Standard tiers, see [Security Center Pricing](https://azure.microsoft.com/pricing/details/security-center/).

Security Center supports role-based access. To learn more about role-based access control (RBAC) in Azure, see [Azure Active Directory Role-based Access Control](../role-based-access-control/role-assignments-portal.md). The Security Center FAQ provides information on [how permissions are handled in Security Center](security-center-faq.md#permissions).

## Access Security Center
You access Security Center from the [Azure portal](https://azure.microsoft.com/features/azure-portal/). [Sign in to the portal](https://portal.azure.com/) and select the **Security Center option**.

![Security Center option][1]

The **Security Center** blade opens.
![Security Center blade][2]

## Set security policy
A security policy defines the set of controls that are recommended for resources within the specified subscription or resource group. In Security Center, you define policies for your subscriptions or resource groups according to your company’s security needs and the type of applications or sensitivity of the data in each subscription.

You can set a policy to show recommendations for SQL auditing and SQL transparent data encryption (TDE).

* When you turn on **SQL Auditing and Threat detection**, Security Center recommends that auditing of access to Azure Database be enabled for compliance, advanced detection, and investigation purposes.
* When you turn on **SQL transparent data encryption**, Security Center recommends that encryption at rest be enabled for your Azure SQL Database, associated backups, and transaction log files.

To set a security policy, select the **Policy** tile on the Security Center blade. On the **Security policy** blade, select the subscription on which you want to enable the security policy. Select **Prevention policy** and turn **On** the security recommendations that you want to use on this subscription.
![Security policy][3]

To learn more, see [Set security policies](security-center-policies.md).

## Manage security recommendation
Security Center periodically analyzes the security state of your Azure resources. When Security Center identifies potential security vulnerabilities, it creates recommendations. The recommendations guide you through the process of configuring the needed controls.

After you set a security policy, Security Center analyzes the security state of your resources to identify potential vulnerabilities. The recommendations are displayed in a table format where each line represents one particular recommendation. Use the following table as a reference to help you understand the available recommendations for Azure SQL Database, and what each recommendation does if you apply it. Selecting a recommendation takes you to an article that explains how to implement the recommendation in Security Center.

| Recommendation | Description |
| --- | --- |
| [Enable Auditing and Threat detection on SQL servers](security-center-enable-auditing-on-sql-servers.md) |Recommends that you turn on auditing and threat detection for SQL Database servers. (SQL Database service only. Doesn't include Microsoft SQL Server running on your virtual machines.) |
| [Enable Auditing and Threat detection on SQL databases](security-center-enable-auditing-on-sql-databases.md) |Recommends that you turn on auditing and threat detection for SQL Database databases. (SQL Database service only. Doesn't include Microsoft SQL Server running on your virtual machines.) |
| [Enable Transparent Data Encryption](security-center-enable-transparent-data-encryption.md) |Recommends that you enable encryption for SQL databases. (SQL Database service only.) |

To see recommendations for your Azure resources, select the **Recommendations** tile on the Security Center blade. On the **Recommendations** blade, select a recommendation to see details. In this example, let’s select **Enable Auditing & Threat detection on SQL servers**.

![Recommendations][4]

As shown below, Security Center shows you the SQL servers where auditing and threat detection are not enabled. After you turn on auditing, you can configure Threat Detection settings and email settings to receive security alerts. Threat Detection alerts you when it detects anomalous database activities that indicate potential security threats to the database. The alerts are displayed in the Security Center dashboard.
![Auditing and threat detection][5]

Follow the steps in [SQL Database threat detection in the Azure portal](../sql-database/sql-database-threat-detection-portal.md) to turn on and configure Threat detection, and to configure the list of emails that will receive security alerts upon detection of anomalous activities.

To learn more about recommendations, see [Managing security recommendations](security-center-recommendations.md).

## Monitor security health
After you enable [security policies](security-center-policies.md) for a subscription’s resources, Security Center will analyze the security of your resources to identify potential vulnerabilities.  You can view the security state of your resources in the **Resource security health** tile. When you click **Data** in the **Resource security health** tile, the **Data Resources** blade opens with SQL recommendations for issues such as auditing and transparent data encryption not being enabled. It also has recommendations for the general health state of the database.
![Resource security health][6]

To learn more, see [Security health monitoring](security-center-monitoring.md).

## Manage and respond to security alerts
Security Center automatically collects, analyzes, and integrates log data from [Azure SQL Threat Detection](../sql-database/sql-database-threat-detection.md), as well as other Azure resources, to detect real threats and reduce false positives. A list of prioritized security alerts is shown in Security Center along with the information you need to quickly investigate the problem and recommendations for how to remediate an attack.

To see alerts, select the **Security alerts** tile on the Security Center blade. On the **Security alerts** blade, select an alert to learn more about the events that triggered the alert and what, if any, steps you need to take to remediate an attack. In this example, let’s select **Potential SQL injection**.
![Security alerts][7]

As shown below, Security Center provides additional details that offer insight into what triggered the alert, the target resource, when applicable the source IP address, and recommendations about how to remediate.
![Potential SQL injection][8]

To learn more, see [Managing and responding to security alerts](security-center-managing-and-responding-alerts.md).

## Next steps
* [Security Center FAQ](security-center-faq.md) — Find frequently asked questions about using the service.
* [Security Center planning and operations guide](security-center-planning-and-operations-guide.md) - Follow a set of steps and tasks to optimize your use of Security Center based on your organization’s security requirements and cloud management model.
* [Security Center Data Security](security-center-data-security.md) – Learn how Security Center collects and processes data about your Azure resources, including configuration information, metadata, event logs, crash dump files, and more.
* [Handling security incidents](security-center-incident.md) - Learn how to use the security alert capability in Security Center to assist you in handling security incidents.

<!--Image references-->
[1]: ./media/security-center-sql-database/security-center.png
[2]: ./media/security-center-sql-database/security-center-blade.png
[3]: ./media/security-center-sql-database/security-policy.png
[4]: ./media/security-center-sql-database/recommendation.png
[5]: ./media/security-center-sql-database/turn-on-auditing.png
[6]: ./media/security-center-sql-database/monitor-health.png
[7]: ./media/security-center-sql-database/alert.png
[8]: ./media/security-center-sql-database/sql-injection.png
