---
title: Advanced data security - Azure SQL Database | Microsoft Docs
description: Learn about functionality for discovering and classifying sensitive data, managing your database vulnerabilities, and detecting anomalous activities that could indicate a threat to your Azure SQL database.
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.devlang: 
ms.topic: conceptual
author: ronitr
ms.author: ronitr
ms.reviewer: vanto
manager: craigg
ms.date: 02/04/2019
---
# Advanced data security for Azure SQL Database

Advanced data security is a unified package for advanced SQL security capabilities. It includes functionality for discovering and classifying sensitive data, surfacing and mitigating potential database vulnerabilities, and detecting anomalous activities that could indicate a threat to your database. It provides a single go-to location for enabling and managing these capabilities.

## Overview

Advanced data security (ADS) provides a set of advanced SQL security capabilities, including data discovery & classification, vulnerability assessment, and threat detection.

- [Data discovery & classification](sql-database-data-discovery-and-classification.md) (currently in preview) provides capabilities built into Azure SQL Database for discovering, classifying, labeling & protecting the sensitive data in your databases. It can be used to provide visibility into your database classification state, and to track the access to sensitive data within the database and beyond its borders.
- [Vulnerability assessment](sql-vulnerability-assessment.md) is an easy to configure service that can discover, track, and help you remediate potential database vulnerabilities. It provides visibility into your security state, and includes actionable steps to resolve security issues, and enhance your database fortifications.
- [Threat detection](sql-database-threat-detection-overview.md) detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit your database. It continuously monitors your database for suspicious activities, and provides immediate security alerts on potential vulnerabilities, SQL injection attacks, and anomalous database access patterns. Threat detection alerts provide details of the suspicious activity and recommend action on how to investigate and mitigate the threat.

Enable SQL ADS once to enable all of these included features. With one click, you can enable ADS for all databases on your SQL Database server or managed instance. Enabling or managing ADS settings requires belonging to the [SQL security manager](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#sql-security-manager) role, SQL database admin role or SQL server admin role. 

ADS pricing aligns with Azure Security Center standard tier, where each protected SQL Database server or managed instance is counted as one node. Newly protected resources qualify for a free trial of Security Center standard tier. For more information, see the [Azure Security Center pricing page](https://azure.microsoft.com/pricing/details/security-center/).

## Getting Started with ADS

The following steps get you started with ADS.

## 1. Enable ADS

Enable ADS by navigating to **Advanced Data Security** under the **Security** heading for your SQL Database server or manged instance. To enable ADS for all databases on the database server or managed instance, click **Enable Advanced Data Security on the server**.

![Enable ADS](./media/sql-advanced-protection/enable_atp.png) 

> [!NOTE]
> The cost of ADS is aligned with Azure Security Center standard tier pricing per node, where a node is the entire SQL Database server or managed instance. You are thus paying only once for protecting all databases on the database server or managed instance with ADS. You can try ADS out initially with a free trial.

## 2. Configure vulnerability assessment

To start using vulnerability assessment, you need to configure a storage account where scan results are saved. To do so, click on the vulnerability assessment card.

![Configure VA](./media/sql-advanced-protection/configure_va.png) 

Select or create a storage account for saving scan results. You can also turn on periodic recurring scans to configure vulnerability assessment to run automatic scans once per week. A scan result summary is sent to the email address(es) you provide.

![VA settings](./media/sql-advanced-protection/va_settings.png) 

## 3. Start classifying data, tracking vulnerabilities, and investigating threat alerts

Click the **Data Discovery & Classification** card to see recommended sensitive columns to classify and to classify your data with persistent sensitivity labels. Click the **Vulnerability Assessment** card to view and manage vulnerability scans and reports, and to track your security stature. If security alerts have been received, click the **Threat Detection** card to view details of the alerts and to see a consolidated report on all alerts in your Azure subscription via the Azure Security Center security alerts page.

## 4. Manage ADS settings on your SQL Database server or managed instance

To view and manage ADS settings, navigate to **Advanced Data Security** under the **Security** heading for your SQL Database server or managed instance. On this page, you can enable or disable ADS, and modify threat detection settings for your entire SQL Database server or managed instance.

![Server settings](./media/sql-advanced-protection/server_settings.png) 

## 5. Manage ADS settings for a SQL database

To override ADS settings for a particular database, check the **Enable Advanced Data Security at the database level** checkbox. Use this option only if you have a particular requirement to receive separate threat detection alerts for the individual database, in place of or in addition to the alerts received for all databases on the database server or managed instance. 

Once the checkbox is selected, click **Threat Detection settings for this database** and then configure the relevant settings for this database.

![Database and threat detection settings](./media/sql-advanced-protection/database_threat_detection_settings.png) 

Advanced data security settings for your database server or managed instance can also be reached from the ADS database pane. Click **Settings** in the main ADS pane, and then click **View Advanced Data Security server settings**. 

![Database settings](./media/sql-advanced-protection/database_settings.png) 

## Next steps 

- Learn more about [data discovery & classification](sql-database-data-discovery-and-classification.md) 
- Learn more about [vulnerability assessment](sql-vulnerability-assessment.md) 
- Learn more about [threat detection](sql-database-threat-detection.md)
- Learn more about [Azure security center](https://docs.microsoft.com/azure/security-center/security-center-intro)
