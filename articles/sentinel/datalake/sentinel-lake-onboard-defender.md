---
title: Onboarding to Microsoft Sentinel data lake from the Defender portal
titleSuffix: Microsoft Security  
description: This article describes how to onboard to the Microsoft Sentinel data lake for customers who are currently using Microsoft Defender.
author: mberdugo
ms.topic: how-to  
ms.date: 11/13/2025
ms.author: monaberdugo
ms.service: microsoft-sentinel
ms.subservice: sentinel-graph
  
# Customer intent: As an administrator I want to onboard to the Microsoft Sentinel data lake from my Defender portal so that I can benefit from the storage and analysis capabilities of the data lake.
---
  
# Onboard to Microsoft Sentinel data lake from the Defender portal

Onboarding your tenant to the Microsoft Sentinel data lake occurs once and starts from the Microsoft Defender portal. The onboarding process creates a new Microsoft Sentinel data lake for your tenant in the subscription specified during the onboarding process. Graph enablement is included as part of onboarding. If you had onboarded to the data lake during public preview, you're automatically upgraded to the generally available data lake and graph.

> [!NOTE]
> You'll always have one data lake that you can use with multiple Microsoft Security products. During onboarding, we check for and automatically use your existing data lake. When you ingest and store security data in your data lake, this data can be used with multiple Microsoft Security products.

Use the following steps to onboard to the Microsoft Sentinel data lake from the Defender portal:

1. Sign in to your Defender portal at [https://security.microsoft.com](https://security.microsoft.com).

1. A banner appears at the top of the page, indicating that you can onboard to the Microsoft Sentinel data lake. Select **Get started**.

    :::image type="content" source="./media/sentinel-lake-onboard-defender/setup-banner.png" lightbox="./media/sentinel-lake-onboard-defender/setup-banner.png" alt-text="A screenshot showing the Defender portal home page with the onboarding banner for Microsoft Sentinel data lake.":::

    > [!NOTE]
    > If you accidentally close the banner, you can initiate onboarding by navigating to the data lake settings page under **System** >  **Settings** > **Microsoft Sentinel** > **Data lake**.

1. If you don't have the correct roles to set up the data lake, a side panel appears indicating that you don't have the required permissions. Request that your administrator completes the onboarding process.

    :::image type="content" source="./media/sentinel-lake-onboard-defender/permissions-required.png" lightbox="./media/sentinel-lake-onboard-defender/permissions-required.png" alt-text="A screenshot showing the permissions required page in the Defender portal.":::

1. If you have the required permissions, a setup side panel appears. Select the **Subscription**  and **Resource group** to enable billing for the Microsoft Sentinel data lake. Select **Set up data lake**.  

    :::image type="content" source="./media/sentinel-lake-onboard-defender/set-up-data-lake.png" lightbox="./media/sentinel-lake-onboard-defender/set-up-data-lake.png" alt-text="A screenshot showing the setup page for the Microsoft Sentinel data lake.":::

    > [!NOTE]
    > After the data lake is provisioned for a specific Azure subscription and resource group, it can't be migrated to a different subscription or resource group.
    
1. The setup process begins and the following side panel is displayed. The onboarding process can take up to 60 minutes to complete. You can close the setup panel while the process is running.

    :::image type="content" source="./media/sentinel-lake-onboard-defender/setup-started.png" lightbox="./media/sentinel-lake-onboard-defender/setup-started.png" alt-text="A screenshot showing the progress of the onboarding process.":::

1. While the setup process is running, the following banner is displayed on the Defender portal home page. You can select **View setup details** to reopen the panel to check progress.

    :::image type="content" source="./media/sentinel-lake-onboard-defender/setup-in-progress.png" lightbox="./media/sentinel-lake-onboard-defender/setup-in-progress.png" alt-text="A screenshot showing the setup in progress banner.":::

1. Once the onboarding process is complete, a new banner is shown containing information cards on how to start using the new data lake experiences. For example, select **Hunt for latent threats with graphs** to open a threat hunting experience that employs interactive graphs to proactively find threats and sources of risk. Select **Query data lake** to open the data lake exploration KQL queries editor. KQL queries are a new feature in the Defender portal that allows you to explore and analyze data in the Microsoft Sentinel data lake using KQL. For more information, see [Data lake exploration, KQL queries](kql-queries.md).

    :::image type="content" source="./media/sentinel-lake-onboard-defender/setup-complete.png" lightbox="./media/sentinel-lake-onboard-defender/setup-complete.png" alt-text="A screenshot showing the onboarding process complete banner.":::

## Troubleshooting

If you encounter any issues during the setup process, see the following troubleshooting tips:

+ Ensure that you have the required role to onboard to the Microsoft Sentinel data lake.
+ Verify that your selected subscription and resource group are valid and accessible.
+ Verify your Azure policies allow for creating new resources to enable your Microsoft Sentinel data lake.
+ Data for newly enabled tables, or tables that have moved between tiers, are available 90 to 120 minutes after the onboarding process is complete.

The following are errors that you might encounter during the onboarding process.

### DL102

- **Error**: Can’t complete setup.
- **Description**: There’s a lack of Azure resources in the region at the time of provisioning.
- **Resolution**: Select the retry button to start the setup again.

### DL103

- **Error**: Can’t complete setup.
- **Description**: There are policies enabled that prevent the creation of the Azure managed resources needed to enable the data lake.
- **Resolution**: Check your Azure [policies](./sentinel-lake-onboarding.md#policy-exemption-for-microsoft-sentinel-data-lake-onboarding) to allow for creation of Azure managed resources.

## Related content

+ [Microsoft Sentinel data lake overview](sentinel-lake-overview.md)
+ [What is Microsoft Sentinel graph?](sentinel-graph-overview.md)
+ [Microsoft Sentinel data lake roles and permissions](../roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake)
+ [Microsoft Sentinel data lake billing](../billing.md)
+ [Create custom roles with Microsoft Defender XDR Unified role-based access control (RBAC)](/defender-xdr/create-custom-rbac-roles)
