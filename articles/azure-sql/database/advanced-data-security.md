---
title: Advanced data security
description: Learn about functionality for discovering and classifying sensitive data, managing your database vulnerabilities, and detecting anomalous activities that could indicate a threat to your database in Azure SQL Database, Azure SQL Managed Instance, or Azure Synapse.
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.devlang: 
ms.custom: sqldbrb=2
ms.topic: conceptual
ms.author: memildin
manager: rkarlin
author: memildin
ms.reviewer: vanto
ms.date: 04/23/2020
---
# Advanced data security
[!INCLUDE[appliesto-sqldb-sqlmi-asa](../includes/appliesto-sqldb-sqlmi-asa.md)]


Advanced Data Security (ADS) is a unified package for advanced SQL security capabilities. ADS is available for Azure SQL Database, Azure SQL Managed Instance, and Azure Synapse Analytics. It includes functionality for discovering and classifying sensitive data, surfacing and mitigating potential database vulnerabilities, and detecting anomalous activities that could indicate a threat to your database. It provides a single go-to location for enabling and managing these capabilities.

## Overview

ADS provides a set of advanced SQL security capabilities, including Data Discovery & Classification, SQL Vulnerability Assessment, and Advanced Threat Protection.
- [Data Discovery & Classification](data-discovery-and-classification-overview.md) provides capabilities built into Azure SQL Database, Azure SQL Managed Instance, and Azure Synapse for discovering, classifying, labeling, and reporting the sensitive data in your databases. It can be used to provide visibility into your database classification state, and to track the access to sensitive data within the database and beyond its borders.
- [Vulnerability Assessment](sql-vulnerability-assessment.md) is an easy-to-configure service that can discover, track, and help you remediate potential database vulnerabilities. It provides visibility into your security state, and it includes actionable steps to resolve security issues and enhance your database fortifications.
- [Advanced Threat Protection](threat-detection-overview.md) detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit your database. It continuously monitors your database for suspicious activities, and it provides immediate security alerts on potential vulnerabilities, Azure SQL injection attacks, and anomalous database access patterns. Advanced Threat Protection alerts provide details of the suspicious activity and recommend action on how to investigate and mitigate the threat.

Enable Advanced Data Security once to enable all these included features. With one click, you can enable ADS for all databases on your [server](logical-servers.md) in Azure or in your SQL Managed Instance. Enabling or managing ADS settings requires belonging to the [SQL security manager](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#sql-security-manager) role, or one of the database or server admin roles.

ADS pricing aligns with Azure Security Center standard tier, where each protected server or managed instance is counted as one node. Newly protected resources qualify for a free trial of Security Center standard tier. For more information, see the [Azure Security Center pricing page](https://azure.microsoft.com/pricing/details/security-center/).

## Getting started with ADS

The following steps get you started with ADS.

## 1. Enable ADS

Enable ADS by navigating to **Advanced Data Security** under the **Security** heading for your server or managed instance.

> [!NOTE]
> A storage account is automatically created and configured to store your **Vulnerability Assessment** scan results. If you've already enabled ADS for another server in the same resource group and region, then the existing storage account is used.

![Enable ADS](./media/advanced-data-security/enable_ads.png)

> [!NOTE]
> The cost of ADS is aligned with Azure Security Center standard tier pricing per node, where a node is the entire server or managed instance. You are thus paying only once for protecting all databases on the server or managed instance with ADS. You can try ADS out initially with a free trial.

## 2. Start classifying data, tracking vulnerabilities, and investigating threat alerts

Click the **Data Discovery & Classification** card to see recommended sensitive columns to classify and to classify your data with persistent sensitivity labels. Click the **Vulnerability Assessment** card to view and manage vulnerability scans and reports, and to track your security stature. If security alerts have been received, click the **Advanced Threat Protection** card to view details of the alerts and to see a consolidated report on all alerts in your Azure subscription via the Azure Security Center security alerts page.

## 3. Manage ADS settings

To view and manage ADS settings, navigate to **Advanced Data Security** under the **Security** heading for your server or managed instance. On this page, you can enable or disable ADS, and modify vulnerability assessment and Advanced Threat Protection settings for your entire server or managed instance.

![Server settings](./media/advanced-data-security/server_settings.png)

## 4. Manage ADS settings for a SQL database

To override ADS settings for a particular database, check the **Enable Advanced Data Security at the database level** checkbox. Use this option only if you have a particular requirement to receive separate Advanced Threat Protection alerts or vulnerability assessment results for the individual database, in place of or in addition to the alerts and results received for all databases on the server or managed instance.

Once the checkbox is selected, you can then configure the relevant settings for this database.

![Database and Advanced Threat Protection settings](./media/advanced-data-security/database_threat_detection_settings.png)

Advanced data security settings for your server or managed instance can also be reached from the ADS database pane. Click **Settings** in the main ADS pane, and then click **View Advanced Data Security server settings**.

![Database settings](./media/advanced-data-security/database_settings.png)

## Next steps

- Learn more about [Data Discovery & Classification](data-discovery-and-classification-overview.md)
- Learn more about [vulnerability Assessment](sql-vulnerability-assessment.md)
- Learn more about [Advanced Threat Protection](threat-detection-configure.md)
- Learn more about [Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-intro)
