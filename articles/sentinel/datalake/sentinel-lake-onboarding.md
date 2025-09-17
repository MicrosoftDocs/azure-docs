---
title: Onboarding to Microsoft Sentinel data lake and graph (preview)
titleSuffix: Microsoft Security  
description: This article describes how to onboard to the Microsoft Sentinel data lake and graph
author: EdB-MSFT
ms.topic: how-to  
ms.date: 09/10/2025
ms.author: edbaynash
ms.service: microsoft-sentinel
ms.subservice: sentinel-graph
  
# Customer intent: As an administrator I want to onboard to the Microsoft Sentinel data lake so that I can benefit from the storage and analysis capabilities of the data lake.
---
  
# Onboard to Microsoft Sentinel data lake and Microsoft Sentinel graph (preview)

The Microsoft Sentinel data lake, available in the Microsoft Defender portal, is a tenant-wide, repository for collecting, storing, and managing large volumes of security-related data from various sources. It enables comprehensive, unified analysis and visibility across your security landscape. The data lake uses advanced analytics, machine learning, graphs, and artificial intelligence, to help detect threats, investigate and respond to incidents, and improve overall security posture.

For more information, see:
- [What is Microsoft Sentinel data lake?](sentinel-lake-overview.md) 
-	[What is Microsoft Sentinel graph? (preview)](sentinel-graph-overview.md)

Onboarding makes the following changes:

+ Your data lake is provisioned for your selected subscription and resource group.

+ Your data lake is provisioned in the same region as your primary Sentinel workspace.

+ All workspaces connected to Defender that are located in the same region as your primary Sentinel workspace region are attached to your Microsoft Sentinel data lake. Workspaces that aren't connected to Defender won't be attached to the data lake.

+ Once Microsoft Sentinel data lake is enabled, data in the Microsoft Sentinel analytics tier will also be available in the Microsoft Sentinel data lake tier from that point forward without extra charge. You can use existing Microsoft Sentinel workspace connectors to ingest new data to both the analytics and the data lake tiers, or just the data lake tier.

+ When you enable ingestion of data for the first time or switch ingestion between tiers, it takes 90 to 120 minutes for data to appear in the tables. Once ingestion is enabled for the data lake tier, the data appears simultaneously in the data lake and in your analytics tier tables.

+ Data pertaining to your Microsoft assets are ingested automatically into System tables, which will appear in the workspace selection UI inside the Lake exploration experiences, including:
  - Microsoft Entra
  - Microsoft 365
  - Azure Resource Graph

+ If your Microsoft 365 data isn't in the same region as the data lake, by onboarding to the data lake, you consent to ingest your Microsoft 365 data into the region where your data lake resides.

+ Your graph capabilities are provisioned and will use the data in your data lake to enhance the graph investigation and hunting experiences in Defender.

+ You'll see new features enabled for Lake exploration, Table management, Data connectors, Settings, Cost management, and Graph.

+ If your organization currently uses Microsoft Sentinel Security Information and Event Management (SIEM), the billing and pricing for features like search jobs and queries, auxiliary logs, and long-term retention (also known as "archive") switch to Microsoft Sentinel data lake-based billing meters, potentially increasing your costs.

+ Auxiliary log tables are integrated into the Microsoft Sentinel data lake. Auxiliary log tables in Microsoft Defender connected workspaces that are onboarded to the Microsoft Sentinel data lake become an integral part of the data lake, making them available for use in data lake experiences like KQL queries and Jobs. After onboarding, auxiliary log tables are no longer available in Microsoft Defender Advanced hunting. Instead, you can access them through data lake exploration KQL queries in the Defender portal.

+ A managed identity is created with the prefix  `msg-resources-` followed by a globally unique identifier (GUID). This managed identity is required for data lake functionality. The identity has the **Azure Reader** role over subscriptions onboarded into the data lake. Don't delete or remove required permissions from this managed identity. To enable custom table creation in the analytics tier, assign the **Log Analytics Contributor** role to this identity for the relevant Log Analytics workspaces. For more information, see [Create KQL jobs in the Microsoft Sentinel data lake (preview)](./kql-jobs.md#permissions).

> [!NOTE]
> Auxiliary log tables for Microsoft Defender connected workspaces aren't accessible from Microsoft Defender Advanced hunting once the data lake is enabled.

Once you're onboarded to the Microsoft Sentinel data lake, you can use the following features in the Defender portal:

+ [Data lake exploration KQL queries](kql-overview.md)
+ [Microsoft Sentinel data lake jobs](kql-jobs.md)
+ [Management of data tiers and retention](../manage-data-overview.md)
+ Microsoft Sentinel cost management
+ Data risk graphs (in Data Security Investigations and Insider Risk Management only)
+ Blast radius analysis in incident investigations
+ Hunting graph in advanced hunting

This article describes how to onboard to the Microsoft Sentinel data lake for customers who are currently using Microsoft Defender and Microsoft Sentinel. New Microsoft Sentinel customers can follow this procedure after their initial onboarding to the Microsoft Defender portal.

## Prerequisites

To onboard to the Microsoft Sentinel data lake public preview, you must be an existing Microsoft Defender and Microsoft Sentinel customer with the following prerequisites:

+ You must have Microsoft Defender (`security.microsoft.com`) and Microsoft Sentinel. A Microsoft Defender XDR license isn't required to use Microsoft Sentinel data lake with Microsoft Sentinel in the Microsoft Defender portal.
+ You must have an existing Azure subscription and resource group to set up billing for the data lake. You must be the subscription owner. You can use your existing Microsoft Sentinel SIEM Azure subscription and resource group or create a new one.
+ You must have a Microsoft Sentinel primary workspace connected to Microsoft Defender portal. Your data lake will be provisioned in the same region as your primary Sentinel workspace region.
+ You must have read privileges to the primary and other workspaces so they can be attached to the data lake. Currently, only workspaces that reside in the same region as your primary Sentinel workspace region can be attached to the data lake.
+ If your Microsoft 365 data isn't in the same region as the data lake, by onboarding to the data lake, you consent to ingest your Microsoft 365 data into the region where your data lake resides.

[!INCLUDE [Customer-managed keys limitation](../includes/customer-managed-keys-limitation.md)]

To configure billing and enable asset data ingestion into the data lake, the following roles must be assigned to the tenant [member](/entra/fundamentals/users-default-permissions) account:

+ Azure Subscription owner for billing setup
+ Microsoft Entra Global Administrator, or Security Administrator for data ingestion authorization from Microsoft Entra, Microsoft 365, and Azure
+ Read access to all workspaces to enable their attachment to the data lake

### Policy exemption for Microsoft Sentinel data lake onboarding

During onboarding of Microsoft Sentinel data lake, existing Azure Policy definitions might [block deployment](./sentinel-lake-onboard-defender.md#dl103) of required resources. To ensure successful onboarding without compromising broader policy enforcement, configure a policy exemption scoped to the resource group you're onboarding.
Specifically, exempt the resource type: `Microsoft.SentinelPlatformServices/sentinelplatformservices`.

This targeted exemption allows Sentinel data lake's components to deploy correctly, while maintaining compliance with overarching Azure governance policies you might have already applied.

### How data is added and where it's stored during onboarding

During onboarding, your data lake is provisioned in the same region as your primary Sentinel workspace. Also, during onboarding, we might automatically enable Microsoft Entra, Microsoft 365, and Azure Resource Graph asset data. If this data isn't in the same region as the data lake, by onboarding to the data lake, you consent to ingest and store this data in the region where your data lake resides so you can use it with Microsoft Sentinel data lake and graph experiences. Your asset data will be available through System tables, which you can select in the workspace selection UI in the lake exploration experiences. 


## Existing Microsoft Sentinel workspaces

You must connect your Microsoft Sentinel primary workspace to the Defender portal to onboard to the data lake. Your data lake will be located in the same region as your primary Sentinel workspace. You can connect other workspaces in the same region as your primary workspace to the Defender portal so they can be used with the data lake. If you’ve onboarded to the data lake, data in Microsoft Sentinel workspaces that are connected to Defender and enabled for use with the data lake. For more information on how to connect Microsoft Sentinel to the Defender portal, see [Connect Microsoft Sentinel to the Microsoft Defender portal](/unified-secops-platform/microsoft-sentinel-onboard).

## Ready to get started?

For step-by-step guidance to onboard and configure Microsoft Sentinel data lake and graph in Microsoft solutions, see the following articles:

+ [Configure Microsoft Sentinel data lake and graph in Microsoft Defender](sentinel-lake-onboard-defender.md)
+ [Configure Microsoft Sentinel data lake and graph in Microsoft Purview Data Security Investigations](/purview/data-security-investigations)
+ [Configure Microsoft Sentinel data lake and graph in Microsoft Purview Insider Risk Management](/purview/insider-risk-management)
