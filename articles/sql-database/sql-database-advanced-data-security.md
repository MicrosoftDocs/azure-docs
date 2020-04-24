---
title: Advanced data security
description: Learn about functionality for discovering and classifying sensitive data, managing your database vulnerabilities, and detecting anomalous activities that could indicate a threat to your Azure SQL Database, Azure SQL Managed Instance, or Azure Synapse Analytics.
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.devlang: 
ms.custom: sqldbrb=2
ms.topic: conceptual
ms.author: memildin
author: memildin
manager: rkarlin
ms.reviewer: vanto
ms.date: 04/23/2020
---
# Advanced data security

Advanced data security (ADS) is a unified package for advanced SQL security capabilities. ADS is available for for Azure SQL Database, Azure SQL Managed Instance, and Azure Synapse Analytics. It includes functionality for discovering and classifying sensitive data, surfacing and mitigating potential database vulnerabilities, and detecting anomalous activities that could indicate a threat to your database. It provides a single go-to location for enabling and managing these capabilities.

## Overview

Advanced data security (ADS) provides a set of advanced SQL security capabilities, including data discovery & classification, vulnerability assessment, and Advanced Threat Protection.

- [Data Discovery & Classification](sql-database-data-discovery-and-classification.md) provides capabilities built into Azure SQL Database, Azure SQL Managed Instance, and Azure Synapse for discovering, classifying, labeling & reporting the sensitive data in your databases. It can be used to provide visibility into your database classification state, and to track the access to sensitive data within the database and beyond its borders.
- [Vulnerability Assessment](sql-vulnerability-assessment.md) is an easy to configure service that can discover, track, and help you remediate potential database vulnerabilities. It provides visibility into your security state, and includes actionable steps to resolve security issues, and enhance your database fortifications.
- [Advanced Threat Protection](sql-database-threat-detection-overview.md) detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit your database. It continuously monitors your database for suspicious activities, and provides immediate security alerts on potential vulnerabilities, SQL injection attacks, and anomalous database access patterns. Advanced Threat Protection alerts provide details of the suspicious activity and recommend action on how to investigate and mitigate the threat.

Enable SQL ADS once to enable all of these included features. With one click, you can enable ADS for all databases on your logical SQL [server](sql-database-servers.md) in Azure (which hosts SQL Database or Azure Synapse Analytics) or Azure SQL Managed Instance. Enabling or managing ADS settings requires belonging to the [SQL security manager](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#sql-security-manager) role, SQL database admin role or SQL server admin role. 

ADS pricing aligns with Azure Security Center standard tier, where each protected Azure SQL Database server, SQL Managed Instance, or Azure Synapse server is counted as one node. Newly protected resources qualify for a free trial of Security Center standard tier. For more information, see the [Azure Security Center pricing page](https://azure.microsoft.com/pricing/details/security-center/).

## Getting Started with ADS

The following steps get you started with ADS.

## 1. Enable ADS

Enable ADS by navigating to **Advanced Data Security** under the **Security** heading for your Azure SQL Database, Azure SQL Managed Instance, or Azure Synapse. To enable ADS for all databases on the Azure SQL Database server or Azure Synapse server, click **Enable Advanced Data Security on the server**.

> [!NOTE]
> A storage account is automatically created and configured to store your **Vulnerability Assessment** scan results. If you've already enabled ADS for another server in the same resource group and region, then the existing storage account is used.

![Enable ADS](./media/sql-advanced-protection/enable_ads.png) 

> [!NOTE]
> The cost of ADS is aligned with Azure Security Center standard tier pricing per node, where a node is the entire Azure SQL Database server, Azure SQL Managed Instance, or Azure Synapse server. You are thus paying only once for protecting all databases on the database server or managed instance with ADS. You can try ADS out initially with a free trial.

## 2. Start classifying data, tracking vulnerabilities, and investigating threat alerts

Click the **Data Discovery & Classification** card to see recommended sensitive columns to classify and to classify your data with persistent sensitivity labels. Click the **Vulnerability Assessment** card to view and manage vulnerability scans and reports, and to track your security stature. If security alerts have been received, click the **Advanced Threat Protection** card to view details of the alerts and to see a consolidated report on all alerts in your Azure subscription via the Azure Security Center security alerts page.

## 3. Manage ADS settings

To view and manage ADS settings, navigate to **Advanced Data Security** under the **Security** heading for your Azure SQL logical server or Azure SQL Managed Instance. On this page, you can enable or disable ADS, and modify vulnerability assessment and Advanced Threat Protection settings for your entire Azure SQL Database server, Azure SQL Managed Instance, or Azure Synapse server.

![Server settings](./media/sql-advanced-protection/server_settings.png) 

## 4. Manage ADS settings for a SQL database

To override ADS settings for a particular database, check the **Enable Advanced Data Security at the database level** checkbox. Use this option only if you have a particular requirement to receive separate Advanced Threat Protection alerts or vulnerability assessment results for the individual database, in place of or in addition to the alerts and results received for all databases on the logical server or managed instance.

Once the checkbox is selected, you can then configure the relevant settings for this database.
 
![Database and Advanced Threat Protection settings](./media/sql-advanced-protection/database_threat_detection_settings.png) 

Advanced data security settings for your logical server or managed instance can also be reached from the ADS database pane. Click **Settings** in the main ADS pane, and then click **View Advanced Data Security server settings**. 

![Database settings](./media/sql-advanced-protection/database_settings.png) 

## Next steps 

- Learn more about [Data Discovery & Classification](sql-database-data-discovery-and-classification.md) 
- Learn more about [vulnerability Assessment](sql-vulnerability-assessment.md) 
- Learn more about [Advanced Threat Protection](sql-database-threat-detection.md)
- Learn more about [Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-intro)
