---
title: Threat Detection - Azure SQL Database Managed Instance | Microsoft Docs
description: Threat Detection detects anomalous database activities indicating potential security threats to the database in a Managed Instance. 
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: rmatchoro
ms.author: ronmat
ms.reviewer: vanto
manager: craigg
ms.date: 12/06/2018
---
# Azure SQL Database Managed Instance Threat Detection (Preview)

Azure SQL [Threat Detection](sql-database-threat-detection-overview.md) for [SQL Database Managed Instance](sql-database-managed-instance-index.yml) detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases. Threat Detection can identify **Potential SQL injection**, **Access from unusual location or data center**, **Access from unfamiliar principal or potentially harmful application**, and **Brute force SQL credentials** - see more details in [Threat Detection alerts](sql-database-threat-detection-overview.md#azure-sql-database-threat-detection-alerts).

You can receive notifications about the detected threats via [email notifications](sql-database-threat-detection-overview.md#explore-anomalous-database-activities-upon-detection-of-a-suspicious-event) or [Azure portal](sql-database-threat-detection-overview.md#explore-threat-detection-alerts-for-your-database-in-the-azure-portal)

[Threat Detection](sql-database-threat-detection-overview.md) is part of the [SQL Advanced Threat Protection](sql-advanced-threat-protection.md) (ATP) offering, which is a unified package for advanced SQL security capabilities. Threat Detection can be accessed and managed via the central SQL ATP portal. Threat detection service is charged 15$/month per Managed Instance, with first 30 days free of charge.

## Set up Threat Detection for your Managed Instance in the Azure portal
1. Launch the Azure portal at [https://portal.azure.com](https://portal.azure.com).
2. Navigate to the configuration page of the Managed Instance you want to protect. In the **Settings** page, select **Threat Detection**. 
3. In the Threat Detection configuration page 
   - Turn **ON** Threat detection.
   - Configure the **list of emails** to receive security alerts upon detection of anomalous database activities.
   - Select the **Azure storage account** where anomalous threat audit records are saved. 
4.	Click **Save** to save the new or updated threat detection policy.

   ![threat detection](./media/sql-database-managed-instance-threat-detection/threat-detection.png)

## Next steps

- Learn more about [Threat Detection](sql-database-threat-detection-overview.md). 
- Learn about Managed Instance, see [What is a Managed Instance](sql-database-managed-instance.md)
- Learn more about [Managed Instance Auditing](https://go.microsoft.com/fwlink/?linkid=869430) 
- Learn more about [Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-intro)
