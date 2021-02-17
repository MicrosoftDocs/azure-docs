---
title: Azure Defender for SQL
description: Learn about functionality for managing your database vulnerabilities and detecting anomalous activities that could indicate a threat to your database in Azure SQL Database, Azure SQL Managed Instance, or Azure Synapse.
services: sql-database
ms.service: sql-db-mi
ms.subservice: security
ms.devlang: 
ms.custom: sqldbrb=2
ms.topic: conceptual
ms.author: memildin
manager: rkarlin
author: memildin
ms.date: 02/02/2021
---
# Azure Defender for SQL
[!INCLUDE[appliesto-sqldb-sqlmi-asa](../includes/appliesto-sqldb-sqlmi-asa.md)]

Azure Defender for SQL is a unified package for advanced SQL security capabilities. Azure Defender is available for Azure SQL Database, Azure SQL Managed Instance, and Azure Synapse Analytics. It includes functionality for discovering and classifying sensitive data, surfacing and mitigating potential database vulnerabilities, and detecting anomalous activities that could indicate a threat to your database. It provides a single go-to location for enabling and managing these capabilities.

## What are the benefits of Azure Defender for SQL?

Azure Defender provides a set of advanced SQL security capabilities, including SQL Vulnerability Assessment and Advanced Threat Protection.
- [Vulnerability Assessment](sql-vulnerability-assessment.md) is an easy-to-configure service that can discover, track, and help you remediate potential database vulnerabilities. It provides visibility into your security state, and it includes actionable steps to resolve security issues and enhance your database fortifications.
- [Advanced Threat Protection](threat-detection-overview.md) detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit your database. It continuously monitors your database for suspicious activities, and it provides immediate security alerts on potential vulnerabilities, Azure SQL injection attacks, and anomalous database access patterns. Advanced Threat Protection alerts provide details of the suspicious activity and recommend action on how to investigate and mitigate the threat.

Enable Azure Defender for SQL once to enable all these included features. With one click, you can enable Azure Defender for all databases on your [server](logical-servers.md) in Azure or in your SQL Managed Instance. Enabling or managing Azure Defender settings requires belonging to the [SQL security manager](../../role-based-access-control/built-in-roles.md#sql-security-manager) role, or one of the database or server admin roles.

For more information about Azure Defender for SQL pricing, see the [Azure Security Center pricing page](https://azure.microsoft.com/pricing/details/security-center/).

## Enable Azure Defender

Azure Defender can be accessed through the [Azure portal](https://portal.azure.com). Enable Azure Defender by navigating to **Security Center** under the **Security** heading for your server or managed instance.

> [!NOTE]
> A storage account is automatically created and configured to store your **Vulnerability Assessment** scan results. If you've already enabled Azure Defender for another server in the same resource group and region, then the existing storage account is used.
>
> The cost of Azure Defender is aligned with Azure Security Center standard tier pricing per node, where a node is the entire server or managed instance. You are thus paying only once for protecting all databases on the server or managed instance with Azure Defender. You can try Azure Defender out initially with a free trial.

:::image type="content" source="media/azure-defender-for-sql/enable-azure-defender.png" alt-text="Enable Azure Defender for SQL from within Azure SQL databases":::

## Track vulnerabilities and investigate threat alerts

Click the **Vulnerability Assessment** card to view and manage vulnerability scans and reports, and to track your security stature. If security alerts have been received, click the **Advanced Threat Protection** card to view details of the alerts and to see a consolidated report on all alerts in your Azure subscription via the Azure Security Center security alerts page.

## Manage Azure Defender settings

To view and manage Azure Defender settings:

1. From the **Security** area of your server or managed instance, select **Security Center**.

    On this page, you'll see the status of Azure Defender for SQL:

    :::image type="content" source="media/azure-defender-for-sql/status-of-defender-for-sql.png" alt-text="Checking the status of Azure Defender for SQL inside Azure SQL databases":::

1. If Azure Defender for SQL is enabled, you'll see a **Configure** link as shown in the previous graphic. To edit the settings for Azure Defender for SQL, select **Configure**.

    :::image type="content" source="media/azure-defender-for-sql/security-server-settings.png" alt-text="security server settings":::

1. Make the necessary changes and select **Save**.


## Next steps

- Learn more about [Vulnerability Assessment](sql-vulnerability-assessment.md)
- Learn more about [Advanced Threat Protection](threat-detection-configure.md)
- Learn more about [Azure Security Center](../../security-center/security-center-introduction.md)