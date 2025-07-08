---  
title: Onboarding to Microsoft Sentinel data lake (preview)
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


# Onboarding to Microsoft Sentinel data lake (preview)


The Microsoft Sentinel data lake (Preview), available in the Microsoft Defender portal, is a tenant-wide, centralized repository designed to store and manage vast amounts of security-related data from various sources. It enables your organization to collect, ingest, and analyze security data in a unified manner, providing a comprehensive view of your security landscape. Leveraging advanced analytics, machine learning, and artificial intelligence, the Microsoft Sentinel data lake helps in detecting threats, investigate and responding to incidents, and improving overall security posture.

For more information, see [Microsoft Sentinel data lake (Preview)](sentinel-lake-overview.md).

The onboarding process makes the following changes once onboarding is complete:

+ Your Microsoft Sentinel data lake is provisioned for your selected subscription and resource group.
+ All of your Microsoft Defender connected workspaces that are in the same region as your Entra tenant home region are attached to your Microsoft Sentinel data lake. Unconnected workspaces won't be attached to the data lake.
+ Once Microsoft Sentinel data lake is enabled, data in the Microsoft Sentinel analytics tier is also available in the Microsoft Sentinel data lake tier from that point forward without extra charge. You can use existing Microsoft Sentinel workspace connectors to ingest new data to both the analytics and the lake tiers, or just the lake tier. 
+ When you enable ingestion for the first time or switch ingestion between tiers, it takes 90-120 minutes to take effect. Once the ingestion is enabled for the lake tier, the data in lake appears at the same time as it appears in your analytics tier.
+ Entitled data pertaining to your Microsoft related assets are ingested into the Microsoft Sentinel data lake. The asset data includes 
    + Microsoft Entra
    + Microsoft 365 
    + Azure. 
+ If your organization currently uses Microsoft Sentinel SIEM (Security Information and Event Management), the billing and pricing for features like search jobs and queries, auxiliary logs, and long-term retention also known as "archive", switch to Microsoft Sentinel data lake based billing, potentially increasing your costs.
+ Auxiliary log tables become integrated with the Microsoft Sentinel data lake. Auxiliary tables in Microsoft Defender connected workspaces that are onboarded to the Microsoft Sentinel data lake become an integrated part of the lake and are available for use in data lake query and job experiences.

> [!NOTE]
> Auxiliary log tables for Microsoft Defender connected workspaces are no longer accessible from Microsoft Defender Advanced hunting once the data lake is enabled.

Once you're onboarded to the Microsoft Sentinel data lake, you can use the following features in the Defender portal:

+ [Data lake exploration KQL queries](kql-overview.md) 
+ [Microsoft Sentinel lake notebooks](notebooks-overview.md)
+ [Microsoft Sentinel lake jobs](kql-jobs.md)
+ Workspace and lake data [management and retention](/unified-secops-platform/manage-data-defender-portal-overview)
+ Microsoft Sentinel Cost Management
  
This article describes how to onboard to the Microsoft Sentinel data lake for customers who are currently using Microsoft Defender and Microsoft Sentinel. New Microsoft Sentinel customers can follow this procedure after their initial onboarding to the Microsoft Defender portal.

## Prerequisites

To onboard to the Microsoft Sentinel data lake Public Preview, you must be an existing Microsoft Defender and Microsoft Sentinel customer with the following prerequisites:

+ You must have Microsoft Defender (security.microsoft.com) and Microsoft Sentinel to onboard to the data lake. You can be licensed for both Microsoft Defender and Microsoft Sentinel SIEM or be licensed for Microsoft Sentinel SIEM, using it in the Microsoft Defender portal.
+ You must have existing Azure subscription and resource group to set up billing for the data lake. You can use your existing Azure subscription and resource group that you use for Microsoft Sentinel SIEM, or create a new one.
+ You must have a Microsoft Sentinel primary workspace connected to Microsoft Defender portal.
+ You must have a Microsoft Sentinel primary workspace and other workspaces in the same region as your tenant’s home region.
+ You must have read privileges to the primary and other workspaces so they can be attached to the data lake. For public preview, attaching a primary and all workspaces to the data lake is only supported if they're in the same region as your tenant home region.

The following roles that are required to set up billing and authorize ingestion of asset data into the data lake:

+ Azure Subscription owner or Billing Administrator, for billing setup
+ Microsoft Entra Global Administrator, or Security Administrator for data ingestion authorization from Microsoft Entra, Microsoft 365, and Azure.
+ Read access to all workspaces so they can be attached to the data lake. 

> [!NOTE]
> During public preview, Your primary and other workspaces must be in the same region as your tenant’s home region. Only workspaces in the same region as your tenant home region can be attached to the data lake.


## Existing Microsoft Sentinel workspaces

The Microsoft Sentinel data lake mirrors data from Microsoft Sentinel workspaces that are connected to the Defender portal. You must connect your Sentinel workspaces to the Defender portal to include them in the data lake.  If you have connected Sentinel to the Defender portal, to onboard to the data lake, the primary workspace must be in the tenant's home geographic region. If you haven't connected Microsoft Sentinel to the Defender portal, you can connect your Microsoft Sentinel workspaces to the Defender portal after onboarding and the data will be mirrored to the data lake. For more information, see [Connect Microsoft Sentinel to the Microsoft Defender portal](/unified-secops-platform/microsoft-sentinel-onboard).


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


1. If you don't have the correct roles to set up the data lake, a side panel appears indicating that you don't have the required permissions. Request that your administrator completes the onboarding process.

    :::image type="content" source="./media/sentinel-lake-onboarding/permissions-required.png" lightbox="./media/sentinel-lake-onboarding/permissions-required.png" alt-text="A screenshot showing the permissions required page in the Defender portal."::: 

1. If you have the required permissions, a setup side panel appears. Select the **Subscription**  and **Resource group** to enable billing for the Microsoft Sentinel data lake.

1. Select **Set up data lake**.  

    :::image type="content" source="./media/sentinel-lake-onboarding/set-up-data-lake.png" lightbox="./media/sentinel-lake-onboarding/set-up-data-lake.png" alt-text="A screenshot showing the setup page for the Microsoft Sentinel data lake.":::

1. The setup process begins and the following side panel is displayed. You can close the setup panel while the process is running. Check the progress of the setup process by returning to the Defender portal's home page.

    :::image type="content" source="./media/sentinel-lake-onboarding/setup-started.png" lightbox="./media/sentinel-lake-onboarding/setup-started.png" alt-text="A screenshot showing the progress of the onboarding process.":::


1. While the setup process is running, the following banner is displayed on the Defender portal home page. 
 
    :::image type="content" source="./media/sentinel-lake-onboarding/onboarding-in-progress.png" lightbox="./media/sentinel-lake-onboarding/onboarding-in-progress.png" alt-text="A screenshot showing the onboarding in progress banner.":::

1. Once the onboarding process is complete, a new banner is shown containing information cards on how to start using the new data lake experiences. For example, select **Query data lake** to open the Data lake exploration KQL queries editor. KQL queries are a new feature in the Defender portal that allows you to explore and analyze data in the Microsoft Sentinel data lake using KQL. For more information, see [Data lake exploration, KQL queries](kql-queries.md).

    :::image type="content" source="./media/sentinel-lake-onboarding/onboarding-complete.png" lightbox="./media/sentinel-lake-onboarding/onboarding-complete.png" alt-text="A screenshot showing the onboarding process complete banner.":::

## Troubleshooting

If you encounter any issues during the setup process, see the following troubleshooting tips:

+ Ensure that you have the required role to onboard to the Microsoft Sentinel data lake.
+ Verify that your selected subscription and resource group are valid and accessible.
+ Verify your Azure policies allow for creating new resources to enable your Microsoft Sentinel data lake.
+ Data for newly enabled tables, or tables that have moved between tiers are, available 90 to 120 minutes after the onboarding process is complete.

The table below lists errors that you might encounter during the onboarding process.

| Error Code | Error                 | Description             | Resolution                  |
|------------|-----------------------|-------------------------|-----------------------------|
| DL101      | Can’t complete setup. | Your primary Microsoft Sentinel workspace region and your Microsoft Entra tenant home geographic are different. | For public preview, the geographic regions must be the same. Ensure that you have a primary workspace in the same geographic region as your Microsoft Entra tenant. |
| DL102      | Can’t complete setup. | There's a lack of Azure resources in the region at the time of provisioning. |  Select the retry button to start the setup again. |
| DL103      | Can’t complete setup. | There are policies enabled that prevent the creation of the Azure managed resources needed to enable the data lake.  | Check your Azure policies to allow for creation of Azure managed resources. |



## Related content

- [Microsoft Sentinel data lake overview (Preview)](sentinel-lake-overview.md)
- [Microsoft Sentinel data lake roles and permissions](../roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake-preview)
- [Microsoft Sentinel data lake billing](../billing.md)
- [Create custom roles with Microsoft Defender XDR Unified role-based access control (RBAC)](/defender-xdr/create-custom-rbac-roles)