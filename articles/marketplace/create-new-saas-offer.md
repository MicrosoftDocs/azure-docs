---
title: Create a SaaS offer in the commercial marketplace 
description: Create a new software as a service (SaaS) offer for listing or selling in Microsoft AppSource, Azure Marketplace, or through the Cloud Solution Provider (CSP) program in Azure Marketplace. 
author: mingshen-ms
ms.author: mingshen
ms.reviewer: dannyevers
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 07/30/2021
---

# Create a SaaS offer

As a commercial marketplace publisher, you can create a software as a service (SaaS) offer so potential customers can buy your SaaS-based technical solution. This article explains the process to create a SaaS offer for the Microsoft commercial marketplace.

## Before you begin

If you haven’t already done so, read [Plan a SaaS offer](plan-saas-offer.md). It will explain the technical requirements for your SaaS app, and the information and assets you’ll need when you create your offer. Unless you plan to publish a simple listing (**Contact me** listing option) in the commercial marketplace, your SaaS application must meet technical requirements around authentication.

> [!IMPORTANT]
> We recommend that you create a separate development/test (DEV) offer and a separate production (PROD) offer. This article describes how to create a PROD offer. For details about creating a DEV offer, see [Create a test SaaS offer](create-saas-dev-test-offer.md).

## Create a SaaS offer

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

    > [!NOTE]
    > You can convert a published listing-only offer to a sell through the commercial marketplace offer if your circumstances change, but you cannot convert a published transactable offer to a listing-only offer. Instead, you must create a new listing-only offer and stop distribution of the published transactable offer.

## Enable a test drive (optional)

A test drive is a great way to showcase your offer to potential customers by giving them access to a preconfigured environment for a fixed number of hours. Offering a test drive results in an increased conversion rate and generates highly qualified leads. To Learn more about test drives, see [What is a test drive?](./what-is-test-drive.md).

> [!TIP]
> A test drive is different from a free trial. You can offer either a test drive, free trial, or both. They both provide customers with your solution for a fixed period-of-time. But, a test drive also includes a hands-on, self-guided tour of your product’s key features and benefits being demonstrated in a real-world implementation scenario.

### To enable a test drive

1.	Under **Test drive**, select the **Enable a test drive** check box.
1.	Select the test drive type from the list that appears.

## Configure lead management

Connect your customer relationship management (CRM) system with your commercial marketplace offer so you can receive customer contact information when a customer expresses interest or deploys your product. You can modify this connection at any time during or after you create the offer.

> [!NOTE]
> You must configure lead management if you’re selling your offer through Microsoft or you selected the **Contact Me** listing option. For detailed guidance, see [Customer leads from your commercial marketplace offer](partner-center-portal/commercial-marketplace-get-customer-leads.md).

### Configure the connection details in Partner Center

[!INCLUDE [Customer leads](includes/customer-leads.md)]

## Configure Microsoft 365 App integration

You can light up [unified discovery and delivery](plan-SaaS-offer.md) of your SaaS offer and any related Microsoft 365 App consumption by linking them.

### Integrate with Microsoft API

1. If your SaaS offer does not integrate with Microsoft Graph API, select **No**. Continue to Link published Microsoft 365 App consumption clients.  
1. If your SaaS offer integrates with Microsoft Graph API, select **Yes**, and then provide the Azure Active Directory App ID you have created and registered to integrate with Microsoft Graph API. 

### Link published Microsoft 365 App consumption clients

1. If you do not have published Office add-in, Teams app, or SharePoint Framework solutions that works with your SaaS offer, select **No**.
1. If you have published Office add-in, Teams app, or SharePoint Framework solutions that works with your SaaS offer, select **Yes**, then select **+Add another AppSource link** to add new links.  
1. Provide a valid AppSource link.
1. Continue adding all the links by select **+Add another AppSource link** and provide valid AppSource links.  
1. The order the linked products are shown on the listing page of the SaaS offer is indicated by the Rank value, you can change it by select, hold, and move the = icon up and down the list. 
1. You can delete a linked product by select **Delete** in the product row.  

> [!IMPORTANT]
> If you stop-sell a linked product, it won’t be automatically unlinked on the SaaS offer, you must delete it from the list of linked products and resubmit the SaaS offer.  

## Next steps

- [Configure SaaS offer properties](create-new-saas-offer-properties.md)