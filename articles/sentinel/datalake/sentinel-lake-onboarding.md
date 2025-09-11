---
title: Onboarding to Microsoft Sentinel data lake and graph (preview)
titleSuffix: Microsoft Security  
description: This article describes how to onboard to the Microsoft Sentinel data lake  
author: EdB-MSFT
ms.topic: how-to  
ms.date: 09/10/2025
ms.author: edbaynash
ms.service: microsoft-sentinel
ms.subservice: sentinel-graph
  
# Customer intent: As an administrator I want to onboard to the Microsoft Sentinel data lake so that I can benefit from the storage and analysis capabilities of the data lake.
---
  
# Onboard to Microsoft Sentinel data lake and Microsoft Sentinel graph

The [Microsoft Sentinel data lake](sentinel-lake-overview.md) is a tenant-wide repository for collecting, storing, and managing large volumes of security-related data from various sources. It enables comprehensive, unified analysis and visibility across your security landscape. [Microsoft Sentinel graph](./sentinel-graph-overview.md) is a unified graph capability within Microsoft Sentinel platform powering graph-based experiences across security, compliance, identity, and the entire ecosystem. Using advanced analytics, machine learning, graphs, and artificial intelligence, these solutions help in detecting threats, investigating, and responding to incidents, and improving overall security posture.

[!INCLUDE [sentinel-graph-preview](../includes/sentinel-graph-preview.md)]

Microsoft Sentinel data lake and graph are available in the following solutions:

+ [Microsoft Defender XDR](/defender-xdr/microsoft-365-defender)
+ [Microsoft Purview Data Security Investigations](/purview/insider-risk-management)
+ [Microsoft Purview Insider Risk Management](/purview/data-security-investigations)

## Onboard to Sentinel data lake and graph

When you onboard to data lake and graph, the process makes the following changes:

+ It provisions your data lake for your selected subscription and resource group.

+ It attaches your primary and other workspaces connected to Microsoft Defender that are in the same region as your Microsoft Entra tenant home region to your Microsoft Sentinel data lake. Unconnected workspaces aren't attached to the data lake.

+ Once Microsoft Sentinel data lake is enabled, data in the Microsoft Sentinel analytics tier is also available in the Microsoft Sentinel data lake tier from that point forward. You can use existing Microsoft Sentinel workspace connectors to ingest new data to both the analytics and the data lake tiers, or just the data lake tier.

+ When you enable ingestion for the first time or switch ingestion between tiers, it takes 90-120 minutes for data to appear in the tables. Once ingestion is enabled for the data lake tier, the data appears simultaneously in the data lake and in your analytics tier tables.

+ It automatically ingests data pertaining to your Microsoft assets, including: + Microsoft Entra
  + Microsoft 365
  + Azure Resource Graph

+ If your organization currently uses Microsoft Sentinel SIEM (Security Information and Event Management), the billing and pricing for features like search jobs and queries, auxiliary logs, and long-term retention also known as "archive", switch to Microsoft Sentinel data lake-based billing meters, potentially increasing your costs.

+ It integrates auxiliary log tables into the Microsoft Sentinel data lake. Auxiliary tables in Microsoft Defender connected workspaces that are onboarded to the Microsoft Sentinel data lake become an integral part of the data lake, making them available for use in data lake experiences like KQL queries and jobs. After onboarding, auxiliary log tables are no longer available in Microsoft Defender Advanced hunting. Instead, you can access them through data lake exploration KQL queries in the Defender portal.

+ It creates a managed identity with the prefix `msg-resources-` followed by a guid. This managed identity is required for data lake functionality. The identity has the **Azure Reader** role over subscriptions onboarded into the data lake. Don't delete or remove required permissions from this managed identity. To enable custom table creation in the analytics tier, assign the **Log Analytics Contributor** role to this identity for the relevant Log Analytics workspaces. For more information, see [Create KQL jobs in the Microsoft Sentinel data lake (preview)](./kql-jobs.md#permissions).

> [!NOTE]
> Auxiliary log tables for Microsoft Defender connected workspaces aren't accessible from Microsoft Defender Advanced hunting once the data lake is enabled.

Once you're onboarded to the Microsoft Sentinel data lake and graph, you can use the following features in the Defender portal, Data Security Investigations (preview), and Insider Risk Management:

+ [Data lake exploration KQL queries](kql-overview.md)
+ [Microsoft Sentinel data lake jobs](kql-jobs.md)
+ [Management of data tiers and retention](../manage-data-overview.md)
+ Microsoft Sentinel cost management
+ Data risk graphs (in Data Security Investigations and Insider Risk Management only)

This article describes how to onboard to the Microsoft Sentinel data lake and graph for customers who are currently using Microsoft Defender, Data Security Investigations, Insider Risk Management, and Microsoft Sentinel. New Microsoft Sentinel customers can follow this procedure after their initial onboarding to these solutions.

## Prerequisites

To onboard to the Microsoft Sentinel data lake and graph in Microsoft Defender XDR, Data Security Investigations, and Insider Risk Management, you must meet the following prerequisites:

+ Microsoft Defender (security.microsoft.com) and Microsoft Sentinel. A Microsoft Defender XDR license isn't required to use Microsoft Sentinel data lake with Microsoft Sentinel in the Microsoft Defender portal.
+ An existing Azure subscription and resource group to set up billing for the data lake. You must be the subscription owner. You can use your existing Microsoft Sentinel SIEM Azure subscription and resource group or create a new one.
+ A Microsoft Sentinel primary workspace connected to Microsoft Defender portal. Your data lake is provisioned in the same region as your primary Sentinel workspace region.
+ A Microsoft Sentinel primary workspace and other workspaces in the same region as your tenant’s home region.
+ Read privileges to the primary and other workspaces so you can attach them to the data lake.
+ (Data Security Investigations and Insider Risk Management only) Contributor access to the Microsoft Sentinel primary workspace to authorize ingestion of your Microsoft 365 activity data to the primary workspace.  

[!INCLUDE [Customer-managed keys limitation](../includes/customer-managed-keys-limitation.md)]

To configure billing and enable asset and activity data ingestion into the data lake, assign the following roles to the tenant [member](/entra/fundamentals/users-default-permissions) account:

+ Azure Subscription owner for billing setup.
+ Microsoft Entra Global Administrator, or Security Administrator for data ingestion authorization from Microsoft Entra, Microsoft 365, and Azure.
+ Read access to all workspaces to enable their attachment to the data lake.

### Policy exemption for Microsoft Sentinel data lake onboarding

During onboarding of Microsoft Sentinels data lake, existing Azure Policy definitions might [block deployment](./sentinel-lake-onboard-defender.md#dl103) of required resources. To ensure successful onboarding without compromising broader policy enforcement, configure a policy exemption scoped to the resource group you're onboarding.
Specifically, exempt the resource type: `Microsoft.SentinelPlatformServices/sentinelplatformservices`.

This targeted exemption allows Sentinel data lake's components to deploy correctly, while maintaining compliance with overarching Azure governance policies you might have already applied.

## Existing Microsoft Sentinel workspaces

The Microsoft Sentinel data lake mirrors data from Microsoft Sentinel workspaces that you connect to the Defender portal. To include your Microsoft Sentinel workspaces in the data lake, you must connect them to the Defender portal. If you connect Microsoft Sentinel to the Defender portal, the primary workspace must be in the tenant's home geographic region to onboard to the data lake. If you don't connect Microsoft Sentinel to the Defender portal, you can connect your Microsoft Sentinel workspaces to the Defender portal after onboarding, and the data is mirrored to the data lake. For more information, see [Connect Microsoft Sentinel to the Microsoft Defender portal](/unified-secops-platform/microsoft-sentinel-onboard).

## Ready to get started?

For step-by-step guidance to onboard and configure Microsoft Sentinel data lake and graph in Microsoft solutions, see the following articles:

+ [Configure Microsoft Sentinel data lake and graph in Microsoft Defender](sentinel-lake-onboard-defender.md)
+ [Configure Microsoft Sentinel data lake and graph in Microsoft Purview Data Security Investigations](/purview/data-security-investigations)
+ [Configure Microsoft Sentinel data lake and graph in Microsoft Purview Insider Risk Management](/purview/insider-risk-management)

## Limitations

The following considerations and limitations apply to onboarding to the Microsoft Sentinel data lake during preview:

+ You can onboard up to 20 workspaces to the Microsoft Sentinel data lake.
+ Your primary and other workspaces must be in the same region as your tenant’s home region. Only workspaces in the same region as your tenant home region can be attached to the data lake.
