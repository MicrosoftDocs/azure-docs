---
title: Configure Advanced Threat Protection
description: Advanced Threat Protection detects anomalous database activities indicating potential security threats to the database in Azure SQL Database
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom: seo-dt-2019, sqldbrb=1
ms.topic: how-to
author: rmatchoro
ms.author: ronmat
ms.reviewer: kendralittle, vanto, mathoma
ms.date: 02/16/2022
---
# Configure Advanced Threat Protection for Azure SQL Database
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

[Advanced Threat Protection](threat-detection-overview.md) for Azure SQL Database detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases. Advanced Threat Protection can identify **Potential SQL injection**, **Access from unusual location or data center**, **Access from unfamiliar principal or potentially harmful application**, and **Brute force SQL credentials** - see more details in [Advanced Threat Protection alerts](threat-detection-overview.md#alerts).

You can receive notifications about the detected threats via [email notifications](threat-detection-overview.md#explore-detection-of-a-suspicious-event) or [Azure portal](threat-detection-overview.md#explore-alerts-in-the-azure-portal)

[Advanced Threat Protection](threat-detection-overview.md) is part of the [Microsoft Defender for SQL](azure-defender-for-sql.md) offering, which is a unified package for advanced SQL security capabilities. Advanced Threat Protection can be accessed and managed via the central Microsoft Defender for SQL portal.

## Set up Advanced Threat Protection in the Azure portal

1. Sign into the [Azure portal](https://portal.azure.com).
2. Navigate to the configuration page of the [server](logical-servers.md) you want to protect. In the security settings, select **Microsoft Defender for Cloud**.
3. On the **Microsoft Defender for Cloud** configuration page:

   1. If Microsoft Defender for SQL hasn't yet been enabled, select **Enable Microsoft Defender for SQL**.
   
   1. Select **Configure**.
   
       :::image type="content" source="media/azure-defender-for-sql/enable-microsoft-defender-sql.png" alt-text="Enable Microsoft Defender for SQL." lightbox="media/azure-defender-for-sql/enable-microsoft-defender-sql.png":::
    
   1. Under **ADVANCED THREAT PROTECTION SETTINGS**, select **Add your contact details to the subscription's email settings in Defender for Cloud**.

       :::image type="content" source="media/azure-defender-for-sql/advanced-threat-protection-add-contact-details.png" alt-text="Select link to proceed to advanced threat protection settings." lightbox="media/azure-defender-for-sql/advanced-threat-protection-add-contact-details.png":::
    
   1. Provide the list of emails to receive notifications upon detection of anomalous database activities in the **Additional email addresses (separated by commas)** text box.
   1. Optionally customize the severity of alerts that will trigger notifications to be sent under **Notification types**.
   1. Select **Save**.

       :::image type="content" source="media/azure-defender-for-sql/advanced-threat-protection-configure-emails.png" alt-text="Enter emails for Advanced Threat Protection notifications." lightbox="media/azure-defender-for-sql/advanced-threat-protection-configure-emails.png":::
    
## Set up Advanced Threat Protection using PowerShell

For a script example, see [Configure auditing and Advanced Threat Protection using PowerShell](scripts/auditing-threat-detection-powershell-configure.md).

## Next steps

Learn more about Advanced Threat Protection and Microsoft Defender for SQL in the following articles:

- [Advanced Threat Protection](threat-detection-overview.md)
- [Advanced Threat Protection in SQL Managed Instance](../managed-instance/threat-detection-configure.md)
- [Microsoft Defender for SQL](azure-defender-for-sql.md)
- [Auditing for Azure SQL Database and Azure Synapse Analytics](auditing-overview.md)
- [Microsoft Defender for Cloud](../../security-center/security-center-introduction.md)
- For more information on pricing, see the [SQL Database pricing page](https://azure.microsoft.com/pricing/details/sql-database/)
