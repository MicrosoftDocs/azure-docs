---
title: Advanced Threat Protection - Azure SQL Database | Microsoft Docs
description: Advanced Threat Protection detects anomalous database activities indicating potential security threats to the database in a single database or elastic pool. 
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.topic: conceptual
author: rmatchoro
ms.author: ronmat
ms.reviewer: vanto, carlrab
ms.date: 08/05/2019
---
# Azure SQL Database Advanced Threat Protection for single or pooled databases

[Advanced Threat Protection](sql-database-threat-detection-overview.md) for single and pooled databases detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases. Advanced Threat Protection can identify **Potential SQL injection**, **Access from unusual location or data center**, **Access from unfamiliar principal or potentially harmful application**, and **Brute force SQL credentials** - see more details in [Advanced Threat Protection alerts](sql-database-threat-detection-overview.md#advanced-threat-protection-alerts).

You can receive notifications about the detected threats via [email notifications](sql-database-threat-detection-overview.md#explore-anomalous-database-activities-upon-detection-of-a-suspicious-event) or [Azure portal](sql-database-threat-detection-overview.md#explore-advanced-threat-protection-alerts-for-your-database-in-the-azure-portal)

[Advanced Threat Protection](sql-database-threat-detection-overview.md) is part of the [advanced data security](sql-database-advanced-data-security.md) (ADS) offering, which is a unified package for advanced SQL security capabilities. Advanced Threat Protection can be accessed and managed via the central SQL ADS portal.

## Set up Advanced Threat Protection in the Azure portal

1. Launch the Azure portal at [https://portal.azure.com](https://portal.azure.com).
2. Navigate to the configuration page of the Azure SQL Database server you want to protect. In the security settings, select **Advanced Data Security**.
3. On the **Advanced Data Security** configuration page:

   - Enable Advanced Data Security on the server.
   - In **Advanced Threat Protection Settings**, in the **Send alerts to** text box, provide the list of emails to receive security alerts upon detection of anomalous database activities.
  
   ![Set up Advanced Threat Protection](./media/sql-database-threat-detection/set_up_threat_detection.png)

   > [!NOTE]
   > Prices in screenshots does not always reflect the current price, and are an example.

## Set up Advanced Threat Protection using PowerShell

For a script example, see [Configure auditing and Advanced Threat Protection using PowerShell](scripts/sql-database-auditing-and-threat-detection-powershell.md).

## Next steps

- Learn more about [Advanced Threat Protection](sql-database-threat-detection-overview.md).
- Learn more about [Advanced Threat Protection in managed instance](sql-database-managed-instance-threat-detection.md).  
- Learn more about [advanced data security](sql-database-advanced-data-security.md).
- Learn more about [auditing](sql-database-auditing.md)
- Learn more about [Azure security center](https://docs.microsoft.com/azure/security-center/security-center-intro)
- For more information on pricing, see the [SQL Database pricing page](https://azure.microsoft.com/pricing/details/sql-database/)  
