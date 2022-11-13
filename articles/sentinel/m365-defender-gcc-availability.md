---
title: Cloud data in Microsoft Sentinel - M365 Commercial, GCC, and more 
description: This article describes the types of clouds that affect data streaming from the different connectors that Microsoft Sentinel supports.  
author: limwainstein
ms.topic: conceptual
ms.date: 11/14/2022
ms.author: lwainstein
---

# Cloud data in Microsoft Sentinel - Microsoft 365 Commercial, Government Community Cloud, and more

Microsoft Sentinel data connectors use data stored in various cloud environments, like the Microsoft 365 Commercial cloud or the Government Community Cloud (GCC). This article describes the types of clouds that affect data streaming from the different connectors that Microsoft Sentinel supports.  

## Microsoft cloud types

|Name  |Also named|Description |Learn more  |
|---------|---------|---------|
|Microsoft 365 Commercial   |Office 365?, Azure Commercial?        |The standard Microsoft cloud. Most of the enterprises in the private market, academic institutions and home Office 365 tenants reside in a Commercial environment.<br><br>Different tools help meet the Microsoft 365 Commercial compliance and security needs. For example: Intune, Microsoft Compliance Center, Azure Information Protection, etc. |[Microsoft 365 integration](../security/fundamentals/feature-availability.md#microsoft-365-integration)    |
|Government Community Cloud (GCC)  |GCC-M, GCC Moderate  |A government-focused copy of Microsoft 365 Commercial environment. While GCC contains similar features to the Microsoft 365 Commercial environment, GCC is subject to the FedRAMP Moderate policy.     |[Government Community Cloud](/office365/servicedescriptions/office-365-platform-service-description/office-365-us-government/gcc) |
|Department of Defense (DoD)     |         |Originally created for internal use by the Department of Defense. DoD is the only environment that meets DoD SRG levels 5 and 6. Other clouds described in this article don't support these SRG levels.         |[GCC High and DoD](/office365/servicedescriptions/office-365-platform-service-description/office-365-us-government/gcc-high-and-dod) |
|GCC-High     |GCC High         |Technically, GCC High is a copy of a DoD environment, but GCC High exists in its own sovereign environment.<br><br>GCC High (and above) stores the data in Azure Government, so it is physically segregated from the commercial services. |[GCC High and DoD](/office365/servicedescriptions/office-365-platform-service-description/office-365-us-government/gcc-high-and-dod) |  

## Microsoft clouds and Microsoft Sentinel 

Microsoft Sentinel can store data in these layers or groups of clouds:

- Office 365 and GCC data is stored the Azure commercial environment. The Azure commercial environment stores the specific Microsoft Sentinel data that was built to support this environment.
- Office 365 GCC High and DoD data is stored in the Azure Government environment. The Azure Government environment stores the specific Microsoft Sentinel data that was built to support this environment.

Because of this complexity, different types of data streaming into Microsoft Sentinel may or may not be fully supported based on the type of cloud your environment uses.

This diagram outlines the architecture discussed above. 

:::image type="content" source="./media/m365-defender-gcc-availability/cloud-architecture-microsoft-sentinel.png" alt-text="Diagram showing how the Microsoft cloud architecture relates to Microsoft Sentinel data. border="false" lightbox="./media/m365-defender-gcc-availability/cloud-architecture-microsoft-sentinel.png":::

## How cloud support affects data from specific connectors

Your environment ingests data from multiple connectors. The type of cloud your environment uses affects Microsoft Sentinel's ability to ingest and display data from these connectors, like logs, alerts, device events, and more.

We have identified support discrepancies between the different clouds for the data streaming from these connectors:

- Microsoft Defender for Endpoint
- Microsoft Defender for Office 365
- Microsoft Defender for Identity
- Microsoft Defender for Cloud Apps
- Azure Active Directory Identity Protection

Read more about support for different data tables across the different clouds.