---
title: Advanced Threat Protection
titleSuffix: Azure Synapse Analytics
description: Advanced Threat Protection detects anomalous activities that indicate potential security threats in Azure Synapse Analytics dedicated SQL pools.
author: VanMSFT
ms.author: vanto
ms.reviewer: wiassaf
ms.date: 11/21/2025
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: concept-article
ai-usage: ai-assisted
tags: azure-synapse
---

# SQL Advanced Threat Protection for Azure Synapse Analytics

Advanced Threat Protection for Azure Synapse Analytics dedicated SQL pools detects anomalous activities that indicate unusual and potentially harmful attempts to access or exploit databases.

Advanced Threat Protection is part of the [Microsoft Defender for SQL](/azure/defender-for-cloud/defender-for-sql-introduction) offering, which is a unified package for advanced SQL security capabilities. You can access and manage Advanced Threat Protection through the central Microsoft Defender for SQL portal.

Advanced Threat Protection isn't available for serverless SQL pools in Azure Synapse Analytics.

## Overview

Advanced Threat Protection provides a new layer of security. It enables you to detect and respond to potential threats as they occur by providing security alerts on anomalous activities. You receive an alert upon suspicious database activities, potential vulnerabilities, and SQL injection attacks, as well as anomalous database access and query patterns. Advanced Threat Protection integrates alerts with [Microsoft Defender for Cloud](https://azure.microsoft.com/services/security-center/), which include details of suspicious activity and recommend action on how to investigate and mitigate the threat. Advanced Threat Protection makes it simple to address potential threats to the database without the need to be a security expert or manage advanced security monitoring systems.

For a full investigation experience, enable auditing, which writes database events to an audit log in your Azure storage account. To enable auditing, see [Auditing for Azure Synapse Analytics](auditing-overview.md).

## Alerts

Advanced Threat Protection detects anomalous activities that indicate unusual and potentially harmful attempts to access or exploit databases. For a list of alerts, see [alerts in Microsoft Defender for Cloud](/azure/security-center/alerts-reference#alerts-sql-db-and-warehouse).

## Explore detection of a suspicious event

You receive an email notification when the system detects anomalous database activities. The email provides information on the suspicious security event, including the nature of the anomalous activities, database name, server name, application name, and the event time. In addition, the email provides information on possible causes and recommended actions to investigate and mitigate the potential threat to the database.

1. Select the **View recent SQL alerts** link in the email to launch the Azure portal and show the Microsoft Defender for Cloud alerts page. This page provides an overview of active threats detected on the database.

1. Select a specific alert to get more details and actions for investigating this threat and remediating future threats.

   For example, SQL injection is one of the most common Web application security issues on the Internet that bad actors use to attack data-driven applications. They take advantage of application vulnerabilities to inject malicious SQL statements into application entry fields, breaching or modifying data in the database. For SQL Injection alerts, the alert's details include the vulnerable SQL statement that was exploited.

## Explore alerts in the Azure portal

Advanced Threat Protection integrates its alerts with [Microsoft Defender for Cloud](https://azure.microsoft.com/services/security-center/). Live SQL Advanced Threat Protection tiles for dedicated SQL pools and Microsoft Defender for Cloud panes in the Azure portal track the status of active threats.

Select **Advanced Threat Protection alert** to launch the Microsoft Defender for Cloud alerts page and get an overview of active SQL threats detected on the dedicated SQL pool.

## Related content

- [Microsoft Defender for SQL](/azure/defender-for-cloud/defender-for-sql-introduction)
- [Azure Synapse Analytics auditing](auditing-overview.md)
- [Microsoft Defender for Cloud](/azure/security-center/security-center-introduction)
