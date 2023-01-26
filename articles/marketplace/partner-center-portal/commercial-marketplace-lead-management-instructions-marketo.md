---
title: Lead management in Marketo - Microsoft commercial marketplace
description: Learn how to use a Marketo CRM system to manage leads from Microsoft AppSource and Azure Marketplace.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
author: urimsft
ms.author: uridor
ms.date: 01/26/2023
---

# Use Marketo to manage commercial marketplace leads

> [!IMPORTANT]
> The marketo connector is not currently working due to a change in the Marketo platform. Use Leads from the Referrals workspace.

This article describes how to set up your Marketo CRM system to process sales leads from your offers in Microsoft AppSource and Azure Marketplace.

## Set up your Marketo CRM system

1. Sign in to Marketo.

1. Select **Design Studio**.

   :::image type="content" source="./media/commercial-marketplace-lead-management-instructions-marketo/marketo-1.png" alt-text="Screenshot showing Marketo Design Studio.":::

1. Select **New Form**.

   :::image type="content" source="./media/commercial-marketplace-lead-management-instructions-marketo/marketo-2.png" alt-text="Screenshot showing a new Marketo form.":::

1. Fill in the required fields in the **New Form** dialog box, and then select **Create**.

   :::image type="content" source="./media/commercial-marketplace-lead-management-instructions-marketo/marketo-3.png" alt-text="Screenshot showing a new Marketo form filled in.":::

1. On the **Field Details** page, select **Finish**.

   :::image type="content" source="./media/commercial-marketplace-lead-management-instructions-marketo/marketo-4.png" alt-text="Screenshot showing a completed Marketo form.":::

1. Approve and close.

1. On the **MarketplaceLeadBackend** tab, select **Embed Code**. 

   :::image type="content" source="./media/commercial-marketplace-lead-management-instructions-marketo/marketo-6.png" alt-text="Screenshot showing the Marketo Embed Code screen.":::

1. Marketo Embed Code displays code similar to the following example.

   ```html
   <form id="mktoForm_1179"></form>
   <script>MktoForms2.loadForm("("//app-ys12.marketo.com", "123-PQR-789", 1179);</script>
   ```

1. Copy the values for the following fields shown in the Embed Code form. You'll use these values to configure your offer to receive leads in the next step. Use the next example as a guide for getting the IDs you need from the Marketo Embed Code example.

   - Munchkin ID = **123-PQR-789**
   - Form ID = **1179**

   Another way to figure out these values:

   - Get your subscription's Munchkin ID by going to your **Admin** > **Munchkin** menu in the **Munchkin Account ID** field, or from the first part of your Marketo REST API host subdomain: `https://{Munchkin ID}.mktorest.com`.
   - Form ID is the ID of the Embed Code form you created in step 7 to route leads from the marketplace.

## Obtain API access from your Marketo admin

1. This [Marketo guide to REST API](https://aka.ms/marketo-api) shows how to get API access, specifically a **ClientID** and **Client Secret** needed for the new Marketo configuration. Follow the step-by-step guide listed in the above link to create an API-only user and a Launchpoint connection for the Partner center lead management service.

1. Make sure that the custom service created indicates Partner Center as shown below.

   :::image type="content" source="./media/commercial-marketplace-lead-management-instructions-marketo/marketo-connection-details.png" alt-text="Screenshot showing the Marketo connection details page.":::

1. Once you click **View details** for the new service created, you can copy the **Client ID** and **Client secret** for use in the Partner center connector configuration.

## Configure your offer to send leads to Marketo

When you're ready to configure the lead management information for your offer in the publishing portal, follow these steps. 

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/home) and select **Marketplace offers**.

1. Select your offer, and go to the **Offer setup** tab.

1. Under the **Customer leads** section, select **Connect**.

   :::image type="content" source="./media/commercial-marketplace-lead-management-instructions-marketo/customer-leads.png" alt-text="Customer leads":::

1. On the **Connection details** pop-up window, select **Marketo** for the **Lead destination**.

   :::image type="content" source="./media/commercial-marketplace-lead-management-instructions-marketo/choose-lead-destination.png" alt-text="Screenshot showing the lead destination page.":::

1. Provide the **Munchkin ID**, **Form ID**, **Client ID** and **Client Secret** fields.

   > [!NOTE]
   > You must finish configuring the rest of the offer and publish it before you can receive leads for the offer. 

1. Select **OK**.

   To make sure you've successfully connected to a lead destination, select **Validate**. If successful, you'll have a test lead in the lead destination.
