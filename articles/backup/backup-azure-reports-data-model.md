---
title: Data model for Azure Backup
description: This article talks about Power BI data model details for Azure Backup reports.
services: backup
documentationcenter: ''
author: JPallavi
manager: vijayts
editor: ''

ms.assetid: 0767c330-690d-474d-85a6-aa8ddc410bb2
ms.service: backup
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 03/30/2017
ms.author: pajosh
ms.custom: H1Hack27Feb2017

---
# Data model for Azure Backup reports
This article describes Power BI data model used for creating Azure Backup reports. Using this data model, you can filter existing reports based on relevant fields and more importantly, create your own reports by using tables and fields in the model. 

## Creating new reports in Power BI
Power BI provides customization features using which you can [create reports using data model](https://powerbi.microsoft.com/documentation/powerbi-service-create-a-new-report/).

## Using data model for Azure Backup
You can use the following fields provided as part of data model to create new reports and customize existing reports.

### Alert Table
This table provides basic fields and aggregations over various alert related fields.

| Field | Data Type | Value/Example | Description |
| --- | --- | --- | --- |
| #AlertsCreatedInPeriod |Number |10 |Number of alerts created in selected time period |
| %ActiveAlertsCreatedInPeriod |Percentage |100 |Percentage of active alerts in selected time period |
| %CriticalAlertsCreatedInPeriod |Percentage |100 |Percentage of critical alerts in selected time period |
| AlertOccurenceDate |Date |Friday, March 17, 2017 |Date when alert was created |
| AlertSeverity |String |Critical, Warning, Informational |Severity of the alert |
| AlertStatus |String |Active, Inactive |Current status of the alert |
| AlertType |String |Security, Backup |Type of the generated alert |
| AlertUniqueId |String |2519125716922179999_0_0736664c-d142-4e6d-a696-df7a8f469014 |Unique Id of the generated alert |
| AsOnDateTime |Date |Friday, March 17, 2017 |Time period to filter alerts related fields |
| AvgResolutionTimeInMinsForAlertsCreatedInPeriod |Time |7 |Average time it takes to resolve an alert in minutes for selected time period |
| State |String |Active |Current state of the alert object |
| VaultUniqueId |String |2519125716922179999_0_0736664c-d142-4e6d-a696-df7a8f469014 |Unique Id of the vault for which alert is generated |
