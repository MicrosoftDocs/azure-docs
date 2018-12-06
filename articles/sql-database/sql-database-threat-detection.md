---
title: Threat Detection - Azure SQL Database | Microsoft Docs
description: Threat Detection detects anomalous database activities indicating potential security threats to the database in a single database or elastic pool. 
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom:
ms.devlang: 
ms.topic: conceptual
author: rmatchoro
ms.author: ronmat
ms.reviewer: vanto, carlrab
manager: craigg
ms.date: 10/25/2018
---
# Azure SQL Database Threat Detection for Single Database

Azure SQL [Threat Detection](sql-database-threat-detection-overview.md) for [SQL Database](sql-database-technical-overview.md) Single databases detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases. Threat Detection can identify **Potential SQL injection**, **Access from unusual location or data center**, **Access from unfamiliar principal or potentially harmful application**, and **Brute force SQL credentials** - see more details in [Threat Detection alerts](sql-database-threat-detection.md#azure-sql-database-threat-detection-alerts).

You can receive notifications about the detected threats via [email notifications](sql-database-threat-detection.md#explore-anomalous-database-activities-upon-detection-of-a-suspicious-event) or [Azure portal](sql-database-threat-detection.md#explore-threat-detection-alerts-for-your-database-in-the-Azure-portal)

[Threat Detection](sql-database-threat-detection-overview.md) is part of the [SQL Advanced Threat Protection](sql-advanced-threat-protection.md) (ATP) offering, which is a unified package for advanced SQL security capabilities. Threat Detection can be accessed and managed via the central SQL ATP portal. Threat detection service is charged 15$/month per Logical Server, with first 30 days free of charge.

## Set up threat detection for your database in the Azure portal
1. Launch the Azure portal at [https://portal.azure.com](https://portal.azure.com).
2. Navigate to the configuration page of the Azure SQL Database server you want to protect. In the security settings, select **Advanced Threat Protection**.
3. On the **Advanced Threat Protection** configuration page:

   - Enable Advanced Threat Protection on the server.
   - In **Threat Detection Settings**, in the **Send alerts to** text box, provide the list of emails to receive security alerts upon detection of anomalous database activities.
  
   ![Set up threat detection](./media/sql-database-threat-detection/set_up_threat_detection.png)

## Set up threat detection using PowerShell

For a script example, see [Configure auditing and threat detection using PowerShell](scripts/sql-database-auditing-and-threat-detection-powershell.md).

## Next steps

* Learn more about [Threat Detection](sql-database-threat-detection-overview.md). 
* Learn more about [SQL Advanced Threat Protection](sql-advanced-threat-protection.md). 
* Learn more about [Azure SQL Database Auditing](sql-database-auditing.md)
* Learn more about [Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-intro)
* For more information on pricing, see the [SQL Database Pricing page](https://azure.microsoft.com/pricing/details/sql-database/)  
