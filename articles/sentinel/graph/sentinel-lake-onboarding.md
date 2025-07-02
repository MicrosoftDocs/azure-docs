---  
title: Onboarding to Microsoft Sentinel data lake (Preview)
titleSuffix: Microsoft Security  
description: This article describes how to onboard to the Microsoft Sentinel data lake  
author: EdB-MSFT
ms.topic: how-to  
ms.date: 06/29/2025
ms.author: edbaynash
ms.service: microsoft-sentinel
ms.subservice: sentinel-graph
  
# Customer intent: As an administrator I want to onboard to the Microsoft Sentinel data lake so that I can benefit from the storage and analysis capabilities of the data lake.
---  


# Onboarding to Microsoft Sentinel data lake (Preview)


The Microsoft Sentinel data lake (Preview), available in the Microsoft Defender portal, is a tenant-wide, centralized repository designed to store and manage vast amounts of security-related data from various sources. It enables your organization to collect, ingest, and analyze security data in a unified manner, providing a comprehensive view of your security landscape. Leveraging advanced analytics, machine learning, and artificial intelligence, the Microsoft Sentinel data lake helps in detecting threats, investigate and responding to incidents, and improving overall security posture.

For more information, see [Microsoft Sentinel data lake (Preview)](https://aka.ms/sentinel-lake-overview).

The onboarding process makes the following changes once onboarding is complete:

+ Your Microsoft Sentinel data lake is provisioned for your selected subscription and resource group.
+ Microsoft Defender connected and unconnected workspaces are attached to your Microsoft Sentinel data lake. Unconnected workspaces have limited functionality, which can be resolved by connecting the workspaces to Microsoft Defender. For more information, see [Existing Microsoft Sentinel workspaces](#existing-microsoft-sentinel-workspaces).
+ Once Microsoft Sentinel data lake is enabled, data in the Microsoft Sentinel analytics tier is also available in the Microsoft Sentinel data lake tier from that point forward without extra charge. You can use existing Microsoft Sentinel workspace connectors to ingest new data to both the analytics and the lake tiers, or just the lake tier. 
+ When you enable ingestion for the first time or switch ingestion between tiers, it takes 90-120 minutes to take effect. Once the ingestion is enabled for the lake tier, the data in lake appears at the same time as it appears in your analytics tier.
+ Entitled data pertaining to your Microsoft related assets are ingested into the Microsoft Sentinel data lake. For more information, see [Asset data ingestion](https://aka.ms/enable-data-connectors). The asset data includes 
    + Microsoft Entra
    + Microsoft 365 
    + Azure. 
+ If your organization currently uses Microsoft Sentinel SIEM (Security Information and Event Management), the billing and pricing for features like search jobs and queries, auxiliary logs, and long-term retention also known as "archive", switch to Microsoft Sentinel data lake based billing, potentially increasing your costs.
+ Auxiliary log tables become integrated with the Microsoft Sentinel data lake. Auxiliary tables in Microsoft Defender connected workspaces that are onboarded to the Microsoft Sentinel data lake become an integrated part of the lake and are available for use in data lake query and job experiences.

> [!NOTE]
> Auxiliary log tables for Microsoft Defender connected workspaces are no longer accessible from Microsoft Defender Advanced hunting once the data lake is enabled.

Once you're onboarded to the Microsoft Sentinel data lake, you can use the following features in the Defender portal:

+ [Lake exploration KQL queries](https://aka.ms/kql-overview) 
+ [Microsoft Sentinel lake notebooks](https://aka.ms/notebooks-overview)
+ [Microsoft Sentinel lake jobs](https://aka.ms/kql-jobs)
+ Workspace and lake data [management and retention](/unified-secops-platform/manage-data-defender-portal-overview)
+ Microsoft Sentinel Cost Management
  
This article describes how to onboard to the Microsoft Sentinel data lake for customers who are currently using Microsoft Defender and Microsoft Sentinel. New Microsoft Sentinel customers can follow this procedure after their initial onboarding to the Microsoft Defender portal.

## Prerequisites

To onboard to the Microsoft Sentinel data lake Public Preview, you must be an existing Microsoft Defender and Microsoft Sentinel customer with the following prerequisites:

+ You must have Microsoft Defender (security.microsoft.com) and Microsoft Sentinel to onboard to the data lake. You can be licensed for both Microsoft Defender and Microsoft Sentinel SIEM or be licensed for Microsoft Sentinel SIEM, using it in the Microsoft Defender portal.
+ You must have existing Azure subscription and resource group to set up billing for the data lake. You can use your existing Azure subscription and resource group that you use for Microsoft Sentinel SIEM, or create a new one.

The following roles that are required to set up billing and authorize ingestion of asset data into the data lake:

+ Azure Subscription owner or Billing Administrator, for billing setup
+ Microsoft Entra Global Administrator, for data ingestion authorization from Microsoft Entra, Microsoft 365, and Azure.
+ Read access to all workspaces so they can be attached to the data lake. 

Your primary workspace and other workspaces must be in the same region as your tenant’s home region. Only workspaces in the same region as your tenant home region can be attached to the data lake.


## Existing Microsoft Sentinel workspaces

The Microsoft Sentinel data lake mirrors data from Microsoft Sentinel workspaces. You can choose to connect your Microsoft Sentinel workspaces to the Microsoft Defender portal. You don't have to have Microsoft Sentinel workspaces connected to the Microsoft Defender portal to set up the data lake, but we recommend connecting your Microsoft Sentinel workspaces to Defender to enable the best experience. 

If you haven't connected Microsoft Sentinel to the Defender portal, the onboarding process includes your unconnected Microsoft Sentinel workspace in your tenant's home geographic region, but doesn't connect them to the Defender portal. You can connect your Microsoft Sentinel workspaces to the Defender portal after onboarding to the Microsoft Sentinel data lake. 

Microsoft Sentinel workspaces that are attached to lake but aren't connected to Defender are subject to the following limitations:

+ You can't manage unconnected workspace's tables in Defender portal.
+ You can't manage connectors for unconnected workspaces in the Defender portal.
+ There's no role-based access control support in Defender portal for the workspace's tables.
+ You can't analyze unconnected workspace tables in Advanced Hunting.
+ Output from data lake notebooks and jobs can't be written to unconnected workspaces.
+ Scheduled jobs can't run on unconnected workspaces

These limitations can be resolved by connecting the workspaces to Defender. For more information, see [Connect Microsoft Sentinel to the Microsoft Defender portal](/unified-secops-platform/microsoft-sentinel-onboard).  

## Onboarding to the Microsoft Sentinel data lake

Onboarding your tenant to the Microsoft Sentinel data lake occurs once, and starts from the Microsoft Defender portal. The onboarding process creates a new Microsoft Sentinel data lake for your tenant in the subscription specified during the onboarding process.

> [!NOTE]
> The onboarding process can take up to 30 minutes to complete. 

Use the following steps to onboard to the Microsoft Sentinel data lake from the Defender portal:

1. Sign in to your Defender portal at [https://security.microsoft.com](https://security.microsoft.com).

1. A banner appears at the top of the page, indicating that you can onboard to the Microsoft Sentinel data lake. Select **Get started**.

    :::image type="content" source="./media/sentinel-lake-onboarding/onboarding-banner.png" lightbox="./media/sentinel-lake-onboarding/onboarding-banner.png" alt-text="A screenshot showing the Defender portal home page with the onboarding banner for Microsoft Sentinel lake.":::

    > [!NOTE]
    > If you accidentally close the banner, you can initiate onboarding by navigating to the data lake settings page under **System Settings**, **Microsoft Sentinel**.


1. If you don't have the correct roles to set up the data lake, a side panel appears indicating that you don't have the required permissions. Request that your administrator complete the onboarding process.

    :::image type="content" source="./media/sentinel-lake-onboarding/permissions-required.png" lightbox="./media/sentinel-lake-onboarding/permissions-required.png" alt-text="A screenshot showing the permissions required page in the Defender portal."::: 

1. If you have the required permissions, a setup side panel appears. Select the **Subscription**  and **Resource group** to enable billing for the Microsoft Sentinel data lake.

1. Select **Set up data lake**.  

    :::image type="content" source="./media/sentinel-lake-onboarding/set-up-data-lake.png" lightbox="./media/sentinel-lake-onboarding/set-up-data-lake.png" alt-text="A screenshot showing the setup page for the Microsoft Sentinel data lake.":::

1. The setup process begins and the following side panel is displayed. You can close the setup panel while the process is running. Check the progress of the setup process by returning to the Defender portal's home page.

    :::image type="content" source="./media/sentinel-lake-onboarding/setup-started.png" lightbox="./media/sentinel-lake-onboarding/setup-started.png" alt-text="A screenshot showing the progress of the onboarding process.":::


1. While the setup process is running, the following banner is displayed on the Defender portal home page. 
 
    :::image type="content" source="./media/sentinel-lake-onboarding/onboarding-in-progress.png" lightbox="./media/sentinel-lake-onboarding/onboarding-in-progress.png" alt-text="A screenshot showing the onboarding in progress banner.":::

1. Once the onboarding process is complete, a new banner is shown containing information cards on how to start using the new data lake experiences. For example, select **Query data lake** to open the Data lake exploration KQL queries editor. KQL queries are a new feature in the Defender portal that allows you to explore and analyze data in the Microsoft Sentinel data lake using KQL. For more information, see [Data lake exploration, KQL queries](https://aka.ms/kql-queries).

    :::image type="content" source="./media/sentinel-lake-onboarding/onboarding-complete.png" lightbox="./media/sentinel-lake-onboarding/onboarding-complete.png" alt-text="A screenshot showing the onboarding process complete banner.":::

## Troubleshooting

If you encounter any issues during the setup process, see the following troubleshooting tips:

+ Ensure that you have the required role to onboard to the Microsoft Sentinel data lake.
+ Verify that your selected subscription and resource group are valid and accessible.
+ Verify that your Microsoft Sentinel workspaces are in the same region as your tenant’s home geographic region.
+ Verify your Azure policies allow for creating new resources to enable your Microsoft Sentinel data lake.
+ Data for newly enabled tables, or tables that have moved between tiers is, available 90 to 120 minutes after the onboarding process is complete.



## Related content

- [Microsoft Sentinel data lake overview (Preview)](https://aka.ms.sentinel-lake-overview)
- [Microsoft Sentinel data lake roles and permissions](../roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake-preview)
- [Microsoft Sentinel data lake billing](../billing.md)
- [Create custom roles with Microsoft Defender XDR Unified role-based access control (RBAC)](/defender-xdr/create-custom-rbac-roles)