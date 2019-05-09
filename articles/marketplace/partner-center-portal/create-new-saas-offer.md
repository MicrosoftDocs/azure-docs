---
title: 
description: 
author: mattwojo 
manager: evansma
ms.author: mattwoj 
ms.service: marketplace 
ms.topic: conceptual
ms.date: 05/30/2019
---

# Create a new SaaS offer

To begin creating Software as a Service (SaaS) offers, ensure that you have your [Partner Center account set up](./create-account.md) and the [Commercial Marketplace dashboard](https://partner.microsoft.com/dashboard/commercial-marketplace/offers) open in Partner Center, with the **Offers** tab selected. 

![Commercial Marketplace dashboard on Partner Center](./media/commercial-marketplace-offers.png)

Select the + **Create a new…** button, then select the **Software as a Service** menu item. Note: If you select one of the other offer types, you will be redirected to the older [Cloud Partner Portal](https://cloudpartner.azure.com/).  Only SaaS offers are available in the Commercial Marketplace portal on Partner Center at this time. 

![Create offer window on Partner Center](https://azurecomcdn.azureedge.net/mediahandler/acomblog/media/Default/blog/91249b39-5ec5-4cc4-9360-c4306c0368d3.png)


The **New offer** dialog box is displayed. ![New offer dialog box](https://azurecomcdn.azureedge.net/mediahandler/acomblog/media/Default/blog/91249b39-5ec5-4cc4-9360-c4306c0368d3.png)


## Offer ID and name

- **Offer ID**: Create a unique identifier for each offer in your account. This ID will be visible to customers in the URL address for the marketplace offer and Azure Resource Manager (ARM) templates (if applicable). This must be lowercase, alphanumeric (including hyphens and underscores, but no whitespace). This is limited to 50 characters and can’t be updated after you select create.  
<br>Example: test-offer-1 
<br>Resulting in the URL: `https://azuremarketplace.microsoft.com/marketplace/../test-offer-1`

- **Offer name**: The official name of your SaaS application offer, consistent across publications, advertisements, and web sites.  This name may be trademarked.  This name must not contain whitespace, emojis (unless they are the trademark or copyright symbol) and must be limited to 50 characters.
<br>Example: Test Offer 1&#8482;

Select **Create**.  An **Offer overview** page is created for this offer.  

![Offer overview on Partner Center](/media/commercial-marketplace-offer-overview.png)

## Offer overview

The **Offer overview** page includes: 

- The **Publishing status** displays a visual representation of the steps required to publish this offer and how long each step will take to complete. Incomplete publishing step icons will be greyed out. 

- The **Offer overview** menu contains a list of links for performing operations on this offer. This list of operations will change based on the selection you make for your offer.  
    - If the offer is a draft – Delete draft 
    - If the offer is live – Stop sell offer 
    - If the offer is in preview – Go-live 
    - If you haven’t completed publisher signoff – Cancel publish

## Offer setup

The **Offer setup** tab asks for the following information. Select **Save** after completing these fields.

- **Would you like to sell through Microsoft?** (Yes/No)
    - **Yes**, you would like to sell your offer through Microsoft, with Microsoft hosting marketplace transactions on your behalf; or 
    - **No**, you would prefer to just list your offer through the marketplaces, processing any monetary transactions independently of Microsoft.    

### Sell through Microsoft

Selling through Microsoft provides better customer discovery and acquisition, allows Microsoft to host marketplace transactions on your behalf, and takes advantage of Microsoft’s globally available commerce capabilities.

#### SaaS Offer Requirements

In order to list Software as a Service (SaaS) offers with Commercial Marketplace on Partner Center, the following criteria must be met:

- Your offer must be compatible with Azure clients. (Often SaaS apps are also hosted on Azure for best performance and compatibility, but this is not a requirement.) 
- Your offer must use [Azure Active Directory (Azure AD)](https://azure.microsoft.com/services/active-directory/) for identity management and authentication.
- Your offer must use [SaaS Fulfillment APIs](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/saas-app/cpp-saas-fulfillment-api-v2) to integrate with the Azure Marketplace.

#### Billing infrastructure costs
For SaaS offers, you, as the publisher, must account for Azure infrastructure usage fees, and software licensing fees as a single cost item. This cost is represented as a flat monthly fee to the customer. Azure infrastructure usage is managed and billed to you, the partner, directly. Actual infrastructure usage fees are not seen by the customer. Publishers typically opt to bundle Azure infrastructure usage fees into their software license pricing. 

Software licensing fees are presented as a monthly, recurring site-based subscription fee and are not metered or consumption based.

|**Your license cost**|**$100 per month**|
|:---|:---|
|Azure usage cost (D1/1-Core)|Billed directly to the publisher, not the customer|
|Customer is billed by Microsoft|$100.00 per month (note: publisher must account for any incurred or pass-through infrastructure costs in the license fee)|

- In this scenario, Microsoft bills $100.00 for your software license and pays out $80.00 to the publisher.
- Partners who have qualified for the **Reduced Marketplace Service Fee** will see a reduced transaction fee on the SaaS offers from May 2019 until June 2020. In this scenario, Microsoft bills $100.00 for your software license and pays out $90.00 to the publisher.

|**Microsoft bills**|**$100 per month**|
|:---|:---|
|Microsoft pays you 80% of your license cost <br>**For qualified SaaS apps, Microsoft pays 90% of your license cost*|$80.00 per month <br>*$*90.00 per month*|

#### CSP Program Opt-in
The [Cloud Solution Provider (CSP)](https://docs.microsoft.com/azure/marketplace/cloud-solution-providers) program enables software offers to reach millions of qualified Microsoft customers with minimal marketing and sales investment.

- **Channels: Make my offer available in the CSP program** (check box)

Electing to make your offer available in the CSP program enables cloud solution providers to sell your product as part of a bundled solution to their customers. 

### List through Microsoft

Promote your business with Microsoft by creating a marketplace listing. Selecting to list your offer only and not transact through Microsoft means that Microsoft doesn't participate directly in software license transactions. There is no associated transaction fee and the publisher keeps 100% of any software licensing fees collected from the customer. However, the publisher is responsible for supporting all aspects of the software license transaction, including but not limited to: order fulfillment, metering, billing, invoicing, payment, and collection. 

- **How do you want potential customers to interact with this listing offer?**

##### Get it now (Free)
List your offer to customers for free by providing a valid URL (beginning with http or https) where they can access your app.  For example: `https://contoso.com/saas-app`

##### Free trial
List your offer to customers on a free trial basis by providing a valid URL (beginning with http or https) where they can access your app.  For example: `https://contoso.com/trial/saas-app`

##### Contact me
Collect customer contact information by connecting your Customer Relationship Management (CRM) system. The customer will be asked for permission to share their information. These customer details, along with the offer name, id, and marketplace source where they found your offer, will be sent to the CRM system that you’ve configured. (See [Lead management](#lead-management) for more information on configuring your CRM). 

