---
title: Configure Microsoft Purview firewall
description: This article describes how to configure firewall settings for your Microsoft Purview account
author: zeinab-mk
ms.author: zeinam
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 01/13/2023
# Customer intent: As a Microsoft Purview admin, I want to set firewall settings for my Microsoft Purview account.
---

# Configure firewall settings for your Microsoft Purview account

This article describes how to configure firewall settings for Microsoft Purview.

## Prerequisites

To configure Microsoft Purview account firewall settings, ensure you meet the following prerequisites:

1. An Azure account with an active subscription. [Create an account for free.](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
<br>
2. An existing Microsoft Purview account.
<br>

## Microsoft Purview firewall deployment scenarios

To configure Microsoft Purview firewall follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Navigate to your Microsoft Purview account in the portal.

3. Under **Settings*, choose **Networking**.

4. In the **Firewall** tab, under **Public network access**, change the firewall settings to the option that suits your scenario:

- **Enabled from all networks**

  :::image type="content" source="media/catalog-private-link/purview-firewall-public.png" alt-text="Screenshot showing the purview account firewall page, selecting public network in the Azure portal.":::

  By choosing this option:

  - All public network access into your Microsoft Purview account is allowed. 
  - Public network access is set to _Enabled from all networks_ on your Microsoft Purview account's Managed storage account. 
  - Public network access is set to _All networks_ on your Microsoft Purview account's Managed Event Hubs, if it's used. 

  > [!NOTE]
  > Even though the network access is enabled through public internet, to gain access to Microsoft Purview governance portal, [users must be first authenticated and authorized](catalog-permissions.md). 

- **Disabled for ingestion only (Preview)**

  :::image type="content" source="media/catalog-private-link/purview-firewall-ingestion.png" alt-text="Screenshot showing the purview account firewall page, selecting ingestion only in the Azure portal.":::

  > [!NOTE]
  > Currently, this option is available in public preview.
  
  By choosing this option:
  - Public network access to your Microsoft Purview account through API and Microsoft Purview governance portal is allowed.
  - All public network traffic for ingestion is disabled. In this case, you must configure a private endpoint for ingestion before setting up any scans. For more information, see [Use private endpoints for your Microsoft Purview account](catalog-private-link.md).
  - Public network access is set to _Disabled_ on your Microsoft Purview account's Managed storage account. 
  - Public network access is set to _Disabled_ on your Microsoft Purview account's Managed Event Hubs, if it's used. 
  
- **Disabled from all networks**

  :::image type="content" source="media/catalog-private-link/purview-firewall-private.png" alt-text="Screenshot showing the purview account firewall page, selecting private network in the Azure portal.":::

  By choosing this option:
  
  - All public network access into your Microsoft Purview account is disabled. 
  - All network access to your Microsoft Purview account through APIs or Microsoft Purview governance portal including traffic to run scans is allowed only through private network using private endpoints. For more information, see [Connect to your Microsoft Purview and scan data sources privately and securely](catalog-private-link-end-to-end.md).
  - Public network access is set to _Disabled_ on your Microsoft Purview account's Managed storage account. 
  - Public network access is set to _Disabled_ on your Microsoft Purview account's Managed Event Hubs, if it's used. 

5. Select **Save**.

    :::image type="content" source="media/catalog-private-link/purview-firewall-save.png" alt-text="Screenshot showing the purview account firewall page, selecting save in the Azure portal.":::

## Next steps

- [Deploy end to end private networking](./catalog-private-link-end-to-end.md)
- [Deploy private networking for the Microsoft Purview governance portal](./catalog-private-link-account-portal.md)
