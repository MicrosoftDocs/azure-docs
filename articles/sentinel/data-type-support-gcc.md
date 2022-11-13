---
title: Support for Microsoft Sentinel connector data types in Microsoft Sentinel across different GCC environments
description: This article describes the types of clouds that affect data streaming from the different connectors that Microsoft Sentinel supports.  
author: limwainstein
ms.topic: conceptual
ms.date: 11/14/2022
ms.author: lwainstein
---

# Support for data types in Microsoft Sentinel across different GCC environments

Microsoft Sentinel data connectors use data stored in various cloud environments, like the Microsoft 365 Commercial cloud or the Government Community Cloud (GCC). 

This article describes the types of clouds that affect the supported data types for the different connectors that Microsoft Sentinel supports. Specifically, support varies for different Microsoft 365 Defender connector data types in different GCC environments.  

## Microsoft cloud types

|Name  |Also named|Description |Learn more  |
|---------|---------|---------|
|Azure Commercial   |Azure, Azure Public, Microsoft 365 Commercial        |The standard Microsoft cloud. Most of the enterprises in the private market, academic institutions and home Office 365 tenants reside in a Commercial environment.<br><br>Different tools help meet the Microsoft 365 Commercial compliance and security needs. For example: Intune, compliance portal, Azure Information Protection, etc. |[Microsoft 365 integration](../security/fundamentals/feature-availability.md#microsoft-365-integration)    |
|Government Community Cloud (GCC)  |GCC-M, GCC Moderate  |A government-focused copy of Microsoft 365 Commercial environment. While GCC contains similar features to the Microsoft 365 Commercial environment, GCC is subject to the FedRAMP Moderate policy.     |[Government Community Cloud](/office365/servicedescriptions/office-365-platform-service-description/office-365-us-government/gcc) |
|Department of Defense (DoD)     |         |Originally created for internal use by the Department of Defense. DoD is the only environment that meets DoD SRG levels 5 and 6. Other clouds described in this article don't support these SRG levels.         |[GCC High and DoD](/office365/servicedescriptions/office-365-platform-service-description/office-365-us-government/gcc-high-and-dod) |
|GCC-High     |GCC High         |Technically, GCC High is a copy of a DoD environment, but GCC High exists in its own sovereign environment.<br><br>GCC High (and above) stores the data in Azure Government, so it is physically segregated from the commercial services. |[GCC High and DoD](/office365/servicedescriptions/office-365-platform-service-description/office-365-us-government/gcc-high-and-dod) |  

## Microsoft clouds and Microsoft Sentinel 

Azure Commercial and Azure Government clouds work with different Office 365 clouds. The data that Microsoft Sentinel can ingest is based on whether the workspace is on Azure Commercial or Azure Government.

:::image type="content" source="./media/data-type-support-gcc/cloud-architecture-microsoft-sentinel.png" alt-text="Diagram showing how the Microsoft cloud architecture relates to Microsoft Sentinel data." border="false" lightbox="./media/data-type-support-gcc/cloud-architecture-microsoft-sentinel.png":::

Because of this complexity, different types of data streaming into Microsoft Sentinel may or may not be fully supported.

## How cloud support affects data from Microsoft 365 Defender connectors

Your environment ingests data from multiple connectors. The type of cloud you use affects Microsoft Sentinel's ability to ingest and display data from these connectors, like logs, alerts, device events, and more.

We have identified support discrepancies between the different clouds for the data streaming from these connectors:

- Microsoft Defender for Endpoint
- Microsoft Defender for Office 365
- Microsoft Defender for Identity
- Microsoft Defender for Cloud Apps
- Azure Active Directory Identity Protection

Read more about [support for Microsoft Defender 365 connector data types across different GCC environments](microsoft-365-defender-support-gcc-reference.md).

## Next steps

In this article, you learned about the types of clouds that affect the supported data types for the different connectors that Microsoft Sentinel supports.

- To get started with Microsoft Sentinel, you need a subscription to Microsoft Azure. If you don't have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/free/).
- Learn how to [onboard your data to Microsoft Sentinel](quickstart-onboard.md) and [get visibility into your data and potential threats](get-visibility.md).