---
title: Lead management in Marketo - Microsoft commercial marketplace
description: Learn how to use a Marketo CRM system to manage leads from Microsoft AppSource and Azure Marketplace.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
author: urimsft
ms.author: uridor
ms.date: 06/08/2022
---

# Use Marketo to manage commercial marketplace leads

> [!IMPORTANT]
> The marketo connector is not currently working due to a change in the Marketo platform. Use Leads from the Referrals workspace.

This article describes how to set up your Marketo CRM system to process sales leads from your offers in Microsoft AppSource and Azure Marketplace.

## Set up your Marketo CRM system

1. Sign in to Marketo.

1. Select **Design Studio**.

    ![Marketo Design Studio](./media/commercial-marketplace-lead-management-instructions-marketo/marketo-1.png)

1.  Select **New Form**.

    ![Marketo New Form](./media/commercial-marketplace-lead-management-instructions-marketo/marketo-2.png)

1.  Fill in the required fields in the **New Form** dialog box, and then select **Create**.

    ![Marketo create new form](./media/commercial-marketplace-lead-management-instructions-marketo/marketo-3.png)

1.  On the **Field Details** page, select **Finish**.

    ![Marketo finish form](./media/commercial-marketplace-lead-management-instructions-marketo/marketo-4.png)

1.  Approve and close.

1. On the **MarketplaceLeadBackend** tab, select **Embed Code**. 

    ![Marketo Embed Code](./media/commercial-marketplace-lead-management-instructions-marketo/marketo-6.png)

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

## Obtain a API access from your Marketo Admin
1. This [article](https://aka.ms/marketo-api) shows how one can obtain API access, specifically a **ClientID** and **Client Secret** needed for the new Marketo configuration. Please follow the step-by-step guide listed in the above link to create an API-only user and a Launchpoint connection for the Partner center lead management service.
2. Please make sure that the Custom service created indicates Partner center as shown below.

![API1-new](https://user-images.githubusercontent.com/98078741/214808153-a59183d7-12e3-432f-a792-211f4e17e9cc.png)

3. Once you click the View details link for the new service created, you can copy the **Client ID** and **Client secret** for use in the Partner center connector configuration.

![Marketo API2](https://user-images.githubusercontent.com/98078741/214813828-0898f11d-fef6-4de5-938d-d4b2beac4845.png)

![Marketo API3](https://user-images.githubusercontent.com/98078741/214808193-693a599a-9254-4f63-b500-937f634d3769.png)

## Configure your offer to send leads to Marketo

When you're ready to configure the lead management information for your offer in the publishing portal, follow these steps. 

1. Sign in to [Partner Center](https://go.microsoft.com/fwlink/?linkid=2165290).

1. Select your offer, and go to the **Offer setup** tab.

1. Under the **Customer leads** section, select **Connect**.

    :::image type="content" source="./media/commercial-marketplace-lead-management-instructions-marketo/customer-leads.png" alt-text="Customer leads":::

1. On the **Connection details** pop-up window, select **Marketo** for the **Lead destination**.

    ![Choose a lead destination](./media/commercial-marketplace-lead-management-instructions-marketo/choose-lead-destination.png)

1. Provide the **Munchkin ID**, **Form ID**, **Client ID** and **Client Secret** fields.

    > [!NOTE]
    > You must finish configuring the rest of the offer and publish it before you can receive leads for the offer. 

1. Select **OK**.

   To make sure you've successfully connected to a lead destination, select **Validate**. If successful, you'll have a test lead in the lead destination.

   ![Connection details pop-up window](https://user-images.githubusercontent.com/98078741/214812295-b65db33a-39ed-4769-832e-5637bf9bcf7d.png)
   
