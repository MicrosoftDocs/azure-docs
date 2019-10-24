---
title: Configure Advanced Threat Protection - Azure SQL Database managed instance | Microsoft Docs
description: Advanced Threat Protection detects anomalous database activities indicating potential security threats to the database in a managed instance. 
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: rmatchoro
ms.author: ronmat
ms.reviewer: vanto
ms.date: 08/05/2019
---
# Configure Advanced Threat Protection in Azure SQL Database managed instance

[Advanced Threat Protection](sql-database-threat-detection-overview.md) for a [managed instance](sql-database-managed-instance-index.yml) detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases. Advanced Threat Protection can identify **Potential SQL injection**, **Access from unusual location or data center**, **Access from unfamiliar principal or potentially harmful application**, and **Brute force SQL credentials** - see more details in [Advanced Threat Protection alerts](sql-database-threat-detection-overview.md#advanced-threat-protection-alerts).

You can receive notifications about the detected threats via [email notifications](sql-database-threat-detection-overview.md#explore-anomalous-database-activities-upon-detection-of-a-suspicious-event) or [Azure portal](sql-database-threat-detection-overview.md#explore-advanced-threat-protection-alerts-for-your-database-in-the-azure-portal)

[Advanced Threat Protection](sql-database-threat-detection-overview.md) is part of the [advanced data security](sql-database-advanced-data-security.md) (ADS) offering, which is a unified package for advanced SQL security capabilities. Advanced Threat Protection can be accessed and managed via the central SQL ADS portal.

## Set up Advanced Threat Protection in the Azure portal

1. Launch the Azure portal at [https://portal.azure.com](https://portal.azure.com).
2. Navigate to the configuration page of the managed instance you want to protect. In the **Settings** page, select **Advanced Data Security**.
3. In the Advanced Data Security configuration page
   - Turn **ON** Advanced Data Security.
   - Configure the **list of emails** to receive security alerts upon detection of anomalous database activities.
   - Select the **Azure storage account** where anomalous threat audit records are saved.
   - Select the **Advanced Threat Protection types** that you would like configured. Learn more about [Advanced Threat Protection alerts](sql-database-threat-detection-overview.md).
4. Click **Save** to save the new or updated Advanced Data Security policy.

   ![Advanced Threat Protection](./media/sql-database-managed-instance-threat-detection/threat-detection.png)

   > [!NOTE]
   > Prices in screenshots does not always reflect the current price, and are an example.

## Next steps

- Learn more about [Advanced Threat Protection](sql-database-threat-detection-overview.md).
- Learn about managed instances, see [What is a managed instance](sql-database-managed-instance.md).
- Learn more about [Advanced Threat Protection for single database](sql-database-threat-detection.md).
- Learn more about [managed instance auditing](https://go.microsoft.com/fwlink/?linkid=869430).
- Learn more about [Azure security center](https://docs.microsoft.com/azure/security-center/security-center-intro).
