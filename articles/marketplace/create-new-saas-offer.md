---
title: How to create a SaaS offer in the Microsoft commercial marketplace 
description: Learn how to create a new software as a service (SaaS) offer for listing or selling in Microsoft AppSource, Azure Marketplace, or through the Cloud Solution Provider (CSP) program using the commercial marketplace portal in Microsoft Partner Center. 
author: mingshen-ms
ms.author: mingshen
ms.reviewer: dannyevers
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 03/19/2021
---

# How to create a SaaS offer in the commercial marketplace

As a commercial marketplace publisher, you can create a software as a service (SaaS) offer so potential customers can buy your SaaS-based technical solution. This article explains the process to create a SaaS offer for the Microsoft commercial marketplace.

## Before you begin

If you haven’t already done so, read [Plan a SaaS offer for the commercial marketplace](plan-saas-offer.md). It will explain the technical requirements for your SaaS app, and the information and assets you’ll need when you create your offer. Unless you plan to publish a simple listing (**Contact me** listing option) in the commercial marketplace, your SaaS application must meet technical requirements around authentication.

> [!IMPORTANT]
> We recommend that you create a separate development/test (DEV) offer and a separate production (PROD) offer. This article describes how to create a PROD offer. For details about creating a DEV offer, see [Create a development and test offer](create-saas-dev-test-offer.md).

## Create a new SaaS offer

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/home).
1. In the left-navigation menu, select **Commercial Marketplace** > **Overview**.
1. On the **Overview** tab, select **+ New offer** > **Software as a Service**.

   :::image type="content" source="media/new-offer-saas.png" alt-text="Illustrates the left-navigation menu and the New offer list.":::

1. In the **New offer** dialog box, enter an **Offer ID**. This ID is visible in the URL of the commercial marketplace listing and Azure Resource Manager templates, if applicable. For example, if you enter **test-offer-1** in this box, the offer web address will be `https://azuremarketplace.microsoft.com/marketplace/../test-offer-1`.
   + Each offer in your account must have a unique offer ID.
   + Use only lowercase letters and numbers. It can include hyphens and underscores, but no spaces, and is limited to 50 characters.
   + The offer ID can't be changed after you select **Create**.

1. Enter an **Offer alias**. This is the name used for the offer in Partner Center.

   + This name isn't visible in the commercial marketplace and it’s different from the offer name and other values shown to customers.
   + The offer alias can't be changed after you select **Create**.
1. To generate the offer and continue, select **Create**.

## Configure your SaaS offer setup details

On the **Offer setup** tab, under **Setup details**, you’ll choose whether to sell your offer through Microsoft or manage your transactions independently. Offers sold through Microsoft are referred to as _transactable offers_, which means that Microsoft facilitates the exchange of money for a software license on the publisher’s behalf. For more information on these options, see [Listing options](plan-saas-offer.md#listing-options) and [Determine your publishing option](determine-your-listing-type.md).

1. To sell through Microsoft and have us facilitate transactions for you, select **Yes**. Continue to [Enable a test drive](#enable-a-test-drive-optional).

1. To list your offer through the commercial marketplace and process transactions independently, select **No**, and then do one of the following:
   + To provide a free subscription for your offer, select **Get it now (Free)**. Then in the **Offer URL** box that appears, enter the URL (beginning with *http* or *https*) where customers can get a trial through [one-click authentication by using Azure Active Directory (Azure AD)](azure-ad-saas.md). For example, `https://contoso.com/saas-app`.
   + To provide a 30-day free trial, select **Free trial**, and then in the **Trial URL** box that appears, enter the URL (beginning with *http* or *https*) where customers can access your free trial through [one-click authentication by using Azure Active Directory (Azure AD)](azure-ad-saas.md). For example, `https://contoso.com/trial/saas-app`.
   + To have potential customers contact you to purchase your offer, select **Contact me**.

### Enable a test drive (optional)

A test drive is a great way to showcase your offer to potential customers by giving them access to a preconfigured environment for a fixed number of hours. Offering a test drive results in an increased conversion rate and generates highly qualified leads. To Learn more about test drives, see [What is a test drive?](./what-is-test-drive.md).

> [!TIP]
> A test drive is different from a free trial. You can offer either a test drive, free trial, or both. They both provide customers with your solution for a fixed period-of-time. But, a test drive also includes a hands-on, self-guided tour of your product’s key features and benefits being demonstrated in a real-world implementation scenario.

**To enable a test drive**
1.	Under **Test drive**, select the **Enable a test drive** check box.
1.	Select the test drive type from the list that appears.

### Configure lead management

Connect your customer relationship management (CRM) system with your commercial marketplace offer so you can receive customer contact information when a customer expresses interest or deploys your product. You can modify this connection at any time during or after you create the offer.

> [!NOTE]
> You must configure lead management if you’re selling your offer through Microsoft or you selected the **Contact Me** listing option. For detailed guidance, see [Customer leads from your commercial marketplace offer](partner-center-portal/commercial-marketplace-get-customer-leads.md).

#### To configure the connection details in Partner Center

1.	Under **Customer leads**, select the **Connect** link.
1. In the **Connection details** dialog box, select a lead destination from the list.
1. Complete the fields that appear. For detailed steps, see the following articles:

   - [Configure your offer to send leads to the Azure table](./partner-center-portal/commercial-marketplace-lead-management-instructions-azure-table.md#configure-your-offer-to-send-leads-to-the-azure-table)
   - [Configure your offer to send leads to Dynamics 365 Customer Engagement](./partner-center-portal/commercial-marketplace-lead-management-instructions-dynamics.md#configure-your-offer-to-send-leads-to-dynamics-365-customer-engagement) (formerly Dynamics CRM Online)
   - [Configure your offer to send leads to HTTPS endpoint](./partner-center-portal/commercial-marketplace-lead-management-instructions-https.md#configure-your-offer-to-send-leads-to-the-https-endpoint)
   - [Configure your offer to send leads to Marketo](./partner-center-portal/commercial-marketplace-lead-management-instructions-marketo.md#configure-your-offer-to-send-leads-to-marketo)
   - [Configure your offer to send leads to Salesforce](./partner-center-portal/commercial-marketplace-lead-management-instructions-salesforce.md#configure-your-offer-to-send-leads-to-salesforce)

1. To validate the configuration you provided, select the **Validate** link.
1. To close the dialog box, select **OK**.

## Next steps

- [How to configure your SaaS offer properties](create-new-saas-offer-properties.md)