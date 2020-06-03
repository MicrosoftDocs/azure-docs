---
title: Lead management in Salesforce - Microsoft commercial marketplace
description: Learn how to use Salesforce to configure leads for Microsoft AppSource and Azure Marketplace
author: qianw211
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 03/30/2020
ms.author: dsindona
---

# Configure lead management for Salesforce

This article describes how to set up your Salesforce system to process sales leads from your offers in Microsoft AppSource and Azure Marketplace.

> [!NOTE]
> Azure Marketplace doesn't support prepopulated lists, such as a list of values for the **Country** field. Make sure there are no lists set up before you continue. Alternatively, you can configure an [HTTPS endpoint](./commercial-marketplace-lead-management-instructions-https.md) or an [Azure table](./commercial-marketplace-lead-management-instructions-azure-table.md) to receive leads.

## Set up your Salesforce system

1. Sign in to Salesforce.
1. Navigate to the **Web-to-Lead** settings. 
    
    If you're using the Salesforce lighting experience
    1. Select **Setup** on the Salesforce home page.

       ![Salesforce setup](./media/commercial-marketplace-lead-management-instructions-salesforce/salesforce-1.png)

    1. On the **Setup** page, go to **Platform Tools** > **Feature Settings** > **Marketing** > **Web-to-Lead**.

        ![Salesforce Web-to-Lead](./media/commercial-marketplace-lead-management-instructions-salesforce/salesforce-2.png)

    If you're using the Salesforce classic experience:

    1. Select **Setup** on the Salesforce home page.

       ![Salesforce classic setup](./media/commercial-marketplace-lead-management-instructions-salesforce/salesforce-classic-setup.png)

    1. On the **Setup** page, select **Build** > **Customize** > **Leads** > **Web-to-Lead**.

        ![Salesforce classic Web-to-Lead](./media/commercial-marketplace-lead-management-instructions-salesforce/salesforce-classic-web-to-lead.png)

   The remaining steps are the same for both Salesforce experiences.

1. On the **Web-to-Lead Setup** page, select the **Create Web-to-Lead Form** button.
1. On **Web-to-Lead Setup**, select **Create a Web-to-Lead Form**.

    ![Salesforce Web-to-Lead Setup](./media/commercial-marketplace-lead-management-instructions-salesforce/salesforce-3.png)

1. On **Create a Web-to-Lead Form**, make sure the `Include reCAPTCHA in HTML` setting is cleared and select **Generate**.

    ![Salesforce Create a Web-to-Lead Form pane](./media/commercial-marketplace-lead-management-instructions-salesforce/salesforce-4.png)

1. You'll be presented with some HTML text. Search for the text "oid" and copy the **"oid" value** from the HTML text (only the text in between quotation marks) and save it. You'll paste this value in the **Organization Identifier** field on the publishing portal.

    ![Salesforce Create a Web-to-Lead Form showing HTML "oid" value](./media/commercial-marketplace-lead-management-instructions-salesforce/salesforce-5.png)

1. Select **Finished**.

## Configure your offer to send leads to Salesforce

When you're ready to configure the lead management information for your offer in the publishing portal, follow these steps.

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/home).

1. Select your offer, and go to the **Offer setup** tab.

1. Under the **Customer leads** section, select **Connect**.

    :::image type="content" source="./media/commercial-marketplace-lead-management-instructions-salesforce/customer-leads.png" alt-text="Customer leads":::

1. On the **Connection details** pop-up window, select **Salesforce** for the **Lead destination** and paste the `oid` value from the Web-to-Lead Form you created into the **Organization identifier** field.

    ![Connection details pop-up window Validate Contact email box](./media/commercial-marketplace-lead-management-instructions-salesforce/salesforce-connection-details.png)

1. Under **Contact email**, enter email addresses for people in your company who should receive email notifications when a new lead is received. You can provide multiple emails by separating them with a semicolon.

1. Select **OK**.

To make sure you've successfully connected to a lead destination, select **Validate**. If successful, you'll have a test lead in the lead destination.

>[!NOTE]
>You must finish configuring the rest of the offer and publish it before you can receive leads for the offer.
