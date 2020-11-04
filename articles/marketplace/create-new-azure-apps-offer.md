---
title: How to create an Azure application offer in the commercial marketplace
description: Learn how to create a new Azure application offer for listing or selling in Azure Marketplace, or through the Cloud Solution Provider (CSP) program using the commercial marketplace portal in Microsoft Partner Center.
author: aarathin
ms.author: aarathin
ms.reviewer: dannyevers
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 11/09/2020
---

# How to create an Azure application offer in the commercial marketplace

As a commercial marketplace publisher, you can create an Azure application offer so potential customers can buy your solution. This article explains the process to create an Azure application offer for the Microsoft commercial marketplace.

If you haven’t already done so, read [Plan an Azure application offer for the commercial marketplace](plan-azure-application-offer.md). It will provide the resources and help you gather the information and assets you’ll need when you create your offer.

## Create a new offer

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/home).

1. In the left-navigation menu, select **Commercial Marketplace** > **Overview**.

1. On the Overview page, select **+ New offer** > **Azure Application**.

    ![Illustrates the left-navigation menu.](./media/create-new-azure-app-offer/new-offer-azure-app.png)

1. In the **New offer** dialog box, enter an **Offer ID**. This is a unique identifier for each offer in your account. This ID is visible in the URL of the commercial marketplace listing and Azure Resource Manager templates, if applicable. For example, if you enter test-offer-1 in this box, the offer web address will be `https://azuremarketplace.microsoft.com/marketplace/../test-offer-1`.

     * Each offer in your account must have a unique offer ID.
     * Use only lowercase letters and numbers. It can include hyphens and underscores, but no spaces, and is limited to 50 characters.
     * The Offer ID can't be changed after you select **Create**.

1. Enter an **Offer alias**. This is the name used for the offer in Partner Center.

     * This name is only visible in Partner Center and it’s different from the offer name and other values shown to customers.
     * The Offer alias can't be changed after you select **Create**.

1. To generate the offer and continue, select  **Create**.

## Configure your Azure application offer setup details

On the **Offer setup** tab, under **Setup details**, you’ll choose whether to configure a test drive. You’ll also connect your customer relationship management (CRM) system with your commercial marketplace offer.

### Enable a test drive (optional)

A test drive is a great way to showcase your offer to potential customers by giving them access to a preconfigured environment for a fixed number of hours. Offering a test drive results in an increased conversion rate and generates highly qualified leads. To Learn more about test drives, see [Test drive](plan-azure-application-offer.md#test-drive).

#### To enable a test drive

- Under **Test drive**, select the **Enable a test drive** check box.

### Customer lead management

Connect your customer relationship management (CRM) system with your commercial marketplace offer so you can receive customer contact information when a customer expresses interest or deploys your product.

#### To configure the connection details in Partner Center

1. Under **Customer leads**, select the **Connect** link.
1. In the **Connection details** dialog box, select a lead destination from the list.
1. Complete the fields that appear. For detailed steps, see the following articles:

   - [Configure your offer to send leads to the Azure table](partner-center-portal/commercial-marketplace-lead-management-instructions-azure-table.md#configure-your-offer-to-send-leads-to-the-azure-table)
   - [Configure your offer to send leads to Dynamics 365 Customer Engagement](partner-center-portal/commercial-marketplace-lead-management-instructions-dynamics.md#configure-your-offer-to-send-leads-to-dynamics-365-customer-engagement) (formerly Dynamics CRM Online)
   - [Configure your offer to send leads to HTTPS endpoint](partner-center-portal/commercial-marketplace-lead-management-instructions-https.md#configure-your-offer-to-send-leads-to-the-https-endpoint)
   - [Configure your offer to send leads to Marketo](partner-center-portal/commercial-marketplace-lead-management-instructions-marketo.md#configure-your-offer-to-send-leads-to-marketo)
   - [Configure your offer to send leads to Salesforce](partner-center-portal/commercial-marketplace-lead-management-instructions-salesforce.md#configure-your-offer-to-send-leads-to-salesforce)

1. To validate the configuration you provided, select the **Validate** link, if applicable.
1. To close the dialog box, select **Connect**.
1. Select **Save draft** before continuing to the next tab: Properties.

> [!NOTE]
> Make sure the connection to the lead destination stays up to date so you don't lose any leads. Make sure you update these connections whenever something has changed.

## Next steps

- [How to configure your Azure Application offer properties](create-new-azure-apps-offer-properties.md)
