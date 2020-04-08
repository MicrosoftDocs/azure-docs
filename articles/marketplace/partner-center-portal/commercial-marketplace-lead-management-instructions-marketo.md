---
title: Configure lead management in Marketo | Azure Marketplace
description: Configure lead management for Marketo for Azure marketplace customers.
author: qianw211    
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 08/01/2019
ms.author: dsindona
---

# Configure lead management in Marketo

This article describes how to set up your Marketo CRM system to process sales leads from your marketplace offer.

## Set up your Marketo CRM system

1. Sign in to Marketo.
2. Select **Design Studio**.
    ![Marketo Design Studio](./media/commercial-marketplace-lead-management-instructions-marketo/marketo-1.png)

3.  Select **New Form**.
    ![Marketo new form](./media/commercial-marketplace-lead-management-instructions-marketo/marketo-2.png)

4.  Fill the required fields in the New Form and then select **Create**.
    ![Marketo create new form](./media/commercial-marketplace-lead-management-instructions-marketo/marketo-3.png)

5.  On Field Details, select **Finish**.
    ![Marketo finish form](./media/commercial-marketplace-lead-management-instructions-marketo/marketo-4.png)

6.  Approve and Close.

7. On the *MarketplaceLeadBacked* tab, select **Embed Code**. 

    ![Embed code](./media/commercial-marketplace-lead-management-instructions-marketo/marketo-6.png)

8. Marketo Embed Code displays code similar to the following example.

    ```
    <form id="mktoForm_1179"></form>
    <script>MktoForms2.loadForm("("//app-ys12.marketo.com", "123-PQR-789", 1179);</script>
    ```

9. Copy the values for the below fields shown in the Embed Code form. You will use these values to configure your offer to receive leads in the next step. Use the next example as a guide for getting the Ids you need from the Marketo Embed Code example.

    - Server ID = **ys12**
    - Munchkin ID = **123-PQR-789**
    - Form ID = **1179**

    **Another way to figure out these values**

    - Server ID is found in the URL of your Marketo instance,  for example, "`serverID.marketo.com`".
    - Get your subscription's Munching ID by going to your Admin>Munchkin menu in the "Munchkin Account ID" field, or from the first part of your Marketo REST API host subdomain: `https://{Munchkin ID}.mktorest.com`.
    - Form ID is the ID of the Embed Code form you created in step 7 to route leads from our marketplace.

## Configure your offer to send leads to Marketo

When you are ready to configure the lead management information for your offer in the publishing portal, follow the below steps: 

1. Navigate to the **Offer setup** page for your offer.
1. Select **Connect** under the Lead Management section. 

    ![Lead management - Connect](./media/commercial-marketplace-lead-management-instructions-marketo/lead-management-connect.png)

1. On the Connection details pop-up window, select **Marketo** for the Lead Destination.

    ![Choose a lead destination](./media/commercial-marketplace-lead-management-instructions-marketo/choose-lead-destination.png)

4. Provide the **Server ID**, **Munching account ID**, and **Form ID**.

    >[!Note]
    >You must finish configuring the rest of the offer and publish it before you can receive leads for the offer. 

