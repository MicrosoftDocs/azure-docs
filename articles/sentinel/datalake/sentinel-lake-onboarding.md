---
title: Onboarding to Microsoft Sentinel data lake and graph
titleSuffix: Microsoft Security  
description: This article describes how to onboard to the Microsoft Sentinel data lake and graph
author: EdB-MSFT
ms.topic: how-to  
ms.date: 11/13/2025
ms.author: edbaynash
ms.service: microsoft-sentinel
ms.subservice: sentinel-graph
  
# Customer intent: As an administrator I want to onboard to the Microsoft Sentinel data lake so that I can benefit from the storage and analysis capabilities of the data lake.
---
  
# Onboard to Microsoft Sentinel data lake and Microsoft Sentinel graph 

The [Microsoft Sentinel data lake](sentinel-lake-overview.md)  is a tenant-wide repository for collecting, storing, and managing large volumes of security-related data from various sources. It enables comprehensive, unified analysis and visibility across your security landscape. [Microsoft Sentinel graph](sentinel-graph-overview.md) is a unified graph capability within Microsoft Sentinel platform powering graph-based experiences across security, compliance, identity, and the entire ecosystem. These solutions use advanced analytics, machine learning, graphs, and AI to help detect threats, investigate and respond to incidents, and improve overall security posture.

Microsoft Sentinel data lake and graph are available in the following solutions:
+	[Microsoft Defender XDR](/defender-xdr/microsoft-365-defender)
+	[Microsoft Purview Data Security Investigations](/purview/insider-risk-management)
+	[Microsoft Purview Insider Risk Management](/purview/data-security-investigations)

## Prerequisites

[!INCLUDE [Customer-managed keys limitation](../includes/customer-managed-keys-limitation.md)]

To onboard to the Microsoft Sentinel data lake and graph in Microsoft Defender XDR, Data Security Investigations, and Insider Risk Management, you must meet the following prerequisites:

+ Microsoft Defender (`security.microsoft.com`) and Microsoft Sentinel must be configured. A Microsoft Defender XDR license isn't required to use Microsoft Sentinel data lake with Microsoft Sentinel in the Microsoft Defender portal.
+ An existing Azure [subscription](https://portal.azure.com/#view/Microsoft_Azure_Billing/CatalogBlade/appId/AddSubscriptionButton) and [resource group](https://portal.azure.com/#view/HubsExtension/ResourceGroupCreate.ReactView) to set up billing for the data lake. You must be the direct subscription owner - being the management-group-level subscription owner isn't sufficient. You can use your existing Microsoft Sentinel SIEM Azure subscription and resource group or create a new one. To learn more about billing, see [Plan costs and understand Microsoft Sentinel pricing and billing](../billing.md).
+ A Microsoft Sentinel primary workspace connected to Microsoft Defender portal. Your data lake is provisioned in the same region as your primary Sentinel workspace region.
+ You must have read privileges to the primary and other workspaces so they can be attached to the data lake. Only workspaces that reside in the same region as your primary Sentinel workspace region are attached to the data lake.
+ If your Microsoft 365 data isn't in the same region as the data lake, by onboarding to the data lake, you consent to ingest your Microsoft 365 data into the region where your data lake resides.

> [!NOTE]
> Before onboarding, check the availability of Microsoft Data Lake and Graph in your region by referring to [Geographical availability and data residency in Microsoft Sentinel](../geographical-availability-data-residency.md#supported-regions).


### Other prerequisites for Microsoft Purview

+ Contributor access to the Microsoft Sentinel primary workspace to authorize ingestion of your Microsoft 365 activity data to the primary workspace.
+ Install and configure the following data connectors to send data to a Sentinel workspace attached to Defender:
   - [Microsoft 365](../configure-data-connector.md#enable-a-data-connector). You must collect SharePoint record types for the graph to build.
   - [Microsoft Entra ID](../connect-azure-active-directory.md). You must collect Sign-In Logs and User Risk Events.

  The data risk graph is built from data ingested into Sentinel data lake through connectors for Office activity and Entra sign-in logs. 



### Required roles

To configure billing and enable asset data ingestion into the data lake, the following roles must be assigned to the tenant [member](/entra/fundamentals/users-default-permissions) account:

+ Azure Subscription owner or Subscription contributor for billing setup
+ Microsoft Entra Global Administrator, or Security Administrator for data ingestion authorization from Microsoft Entra, Microsoft 365, and Azure
+ Read access to all workspaces to enable their attachment to the data lake


## Changes that occur when onboarding to Sentinel data lake and graph
When you onboard to data lake and graph, the process makes the following changes:

+ It provisions your data lake for your selected subscription and resource group.

+ It provisions your data lake in the same region as your primary Sentinel workspace.

+ It attaches all workspaces connected to Defender that are located in the same region as your primary Sentinel workspace region to your Microsoft Sentinel data lake. Workspaces that aren't connected to Defender aren't attached to the data lake.

+ Once Microsoft Sentinel data lake is enabled, data in the Microsoft Sentinel analytics tier is also available in the Microsoft Sentinel data lake tier from that point forward without extra charge. You can use existing Microsoft Sentinel workspace connectors to ingest new data to both the analytics and the data lake tiers, or just the data lake tier.

+ When you enable ingestion of data for the first time or switch ingestion between tiers, it takes 90 to 120 minutes for data to appear in the tables. Once ingestion is enabled for the data lake tier, the data appears simultaneously in the data lake and in your analytics tier tables.

+ Asset data for the following Microsoft services are ingested automatically into Sentinel data lake System tables.
  - Microsoft Entra
  - Microsoft 365
  - Azure Resource Graph

  System tables appear in the workspace selection user interface (UI) inside the Lake exploration experiences.

+ If your Microsoft 365 data isn't in the same region as the data lake, by onboarding to the data lake, you consent to ingest your Microsoft 365 data into the region where your data lake resides.

+ It provisions your graph capabilities and uses the data in your data lake to enhance the graph investigation and hunting experiences in Defender.

+ You see new features enabled for Lake exploration, Table management, Data connectors, Settings, Cost management, and Graph.

+ If your organization currently uses Microsoft Sentinel Security Information and Event Management (SIEM), the billing and pricing for features like search jobs and queries, auxiliary logs, and long-term retention (also known as "archive") switch to Microsoft Sentinel data lake-based billing meters, potentially increasing your costs.

+ It integrates auxiliary log tables into the Microsoft Sentinel data lake. Auxiliary log tables in Microsoft Defender connected workspaces that are onboarded to the Microsoft Sentinel data lake become an integral part of the data lake, making them available for use in data lake experiences like KQL queries and Jobs. After onboarding, auxiliary log tables are no longer available in Microsoft Defender Advanced hunting. Instead, you can access them through data lake exploration KQL queries in the Defender portal.

  > [!NOTE]
  > Auxiliary log tables for Microsoft Defender connected workspaces aren't accessible from Microsoft Defender Advanced hunting once the data lake is enabled.

+ It creates a managed identity with the prefix  `msg-resources-` followed by a globally unique identifier (GUID). This managed identity is required for data lake functionality. The identity has the **Azure Reader** role over subscriptions onboarded into the data lake. Don't delete or remove required permissions from this managed identity. To enable custom table creation in the analytics tier, assign the **Log Analytics Contributor** role to this identity for the relevant Log Analytics workspaces. For more information, see [Create KQL jobs in the Microsoft Sentinel data lake](./kql-jobs.md#permissions).

Once you're onboarded to the Microsoft Sentinel data lake, you can use the following features in the Defender portal:

+ [Data lake exploration KQL queries](kql-overview.md)
+ [Microsoft Sentinel data lake jobs](kql-jobs.md)
+ [Management of data tiers and retention](../manage-data-overview.md)
+ [Microsoft Sentinel cost management](../billing-monitor-costs.md#manage-and-monitor-costs-for-the-data-lake-tier)
+ Blast radius analysis in incident investigations
+ Hunting graph in advanced hunting

You can also use the following features in the Microsoft Purview solutions portal once you're onboarded to the data lake:
+ Data risk graphs in Data Security Investigations
+ Data risk graphs in Insider Risk Management

This article describes how customers using Microsoft Defender, Data Security Investigations, Insider Risk Management, and Microsoft Sentinel can onboard to the Microsoft Sentinel data lake. New Microsoft Sentinel customers can follow this procedure after their initial onboarding to these solutions.



## Policy exemption for Microsoft Sentinel data lake onboarding

During onboarding of Microsoft Sentinel data lake, existing Azure Policy definitions might [block deployment](./sentinel-lake-onboard-defender.md#dl103) of required resources. To ensure successful onboarding without compromising broader policy enforcement, configure a policy exemption scoped to the resource group you're onboarding.
Specifically, exempt the resource type: `Microsoft.SentinelPlatformServices/sentinelplatformservices`.

This targeted exemption allows Sentinel data lake's components to deploy correctly, while maintaining compliance with overarching Azure governance policies you might have already applied.

## How data is added and stored during onboarding

During onboarding, your data lake is provisioned in the same [region](/azure/sentinel/geographical-availability-data-residency) as your primary Sentinel workspace. We might also automatically enable Microsoft Entra, Microsoft 365, and Azure Resource Graph asset data. If this data isn't in the same region as the data lake, by onboarding to the data lake, you consent to ingest and store this data in the region where your data lake resides so you can use it with Microsoft Sentinel data lake and graph experiences. Your asset data are available through System tables, which you can select in the workspace selection UI in the Lake exploration experiences. For more information, see [Geographical availability and data residency in Microsoft Sentinel](/azure/sentinel/geographical-availability-data-residency).


## Existing Microsoft Sentinel workspaces

You must connect your Microsoft Sentinel primary workspace to the Defender portal to onboard to the data lake. Your data lake is located in the same region as your primary Sentinel workspace. You can connect other workspaces in the same region as your primary workspace to the Defender portal so you can use them with the data lake. If you onboarded to the data lake, data in Microsoft Sentinel workspaces that are connected to Defender and enabled for use with the data lake. For more information on how to connect Microsoft Sentinel to the Defender portal, see [Connect Microsoft Sentinel to the Microsoft Defender portal](/unified-secops-platform/microsoft-sentinel-onboard).

## Offboard from Microsoft Sentinel data lake and graph

To disable Microsoft Sentinel data lake and graph, [submit a support request](/defender-xdr/contact-defender-support).

## Ready to get started?

For step-by-step guidance to onboard and configure Microsoft Sentinel data lake and graph in Microsoft solutions, see the following articles:

+ [Configure Microsoft Sentinel data lake and graph in Microsoft Defender](sentinel-lake-onboard-defender.md)
+ [Configure Microsoft Sentinel data lake and graph in Microsoft Purview Data Security Investigations](/purview/data-security-investigations-data-risk-graph)
+ [Configure Microsoft Sentinel data lake and graph in Microsoft Purview Insider Risk Management](/purview/insider-risk-management-data-risk-graph)

