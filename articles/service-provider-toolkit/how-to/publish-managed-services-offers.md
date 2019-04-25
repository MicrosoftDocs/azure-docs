---
title: Publish a managed services offer to Azure Marketplace
description: Azure Service Provider Management Toolkit lets service providers manage customer resources at scale.
author: JnHs
ms.author: jenhayes
ms.service: service-provider-toolkit
ms.date: 04/03/2019
ms.topic: overview
manager: carmonm
---
# Publish a managed services offer to Azure Marketplace

> [!IMPORTANT]
> Azure Delegated Resource Management is currently in limited public preview. The info in this topic may change before general availability.

In this article, you'll learn how to publish a managed services offer to [Azure Marketplace](https://azuremarketplace.microsoft.com) using the [Cloud Partner Portal](https://cloudpartner.azure.com/), enabling a customer who purchases the offer to be onboarded for Azure Delegated Resource Management. 

> [!NOTE]
> You will need to have a valid [publisher account in Cloud Partner Portal](https://docs.microsoft.com/azure/marketplace/become-publisher) in order to create and publish these offers. Your Microsoft Partner Network (MPN) ID will be [automatically associated](https://docs.microsoft.com/azure/billing/billing-partner-admin-link-started) with the offers you publish to track your impact across customer engagements.
>
> If you don't want to publish an offer to Azure Marketplace, you can onboard customers manually by using Azure Resource Manager templates. For more info, see [Onboard a customer to Azure Delegated Resource Management](onboard-customer.md).

Publishing a Managed Services offer is similar to publishing any other type of offer to Azure Marketplace. To learn about that process, see [Azure Marketplace and AppSource Publishing Guide](https://docs.microsoft.com/azure/marketplace/marketplace-publishers-guide) and [Manage Azure and AppSource Marketplace offers](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/manage-offers/cpp-manage-offers).

## Create your offer in the Cloud Partner Portal

1. Sign in to the [Cloud Partner Portal](https://cloudpartner.azure.com/).
1. From the left navigation menu, select **New offer**, then select **Managed services**.
1. You'll see an **Editor** section for your offer with four parts to fill in: **Offer Settings**, **Plans**, **Marketplace**, and **Support**. Read on for guidance on how to complete these sections.

## Enter offer settings

In the **Offer settings** section, provide the following:

|Field  |Description  |
|---------|---------|
|**Offer ID**     | A unique identifier for your offer (within your publisher profile). This ID can only contain lowercase alphanumeric characters, dashes, and underscores, with a maximum of 50 characters. Keep in mind that the Offer ID may be visible to customers in places like in product URLs and billing reports. Once you publish the offer, you can't change this value.        |
|**Publisher ID**     | A unique identifier for your offer (within your publisher profile). This ID can only contain lowercase alphanumeric characters, dashes, and underscores, with a maximum of 50 characters. Keep in mind that the Offer ID may be visible to customers in places like in product URLs and billing reports. Once you publish the offer, you can't change this value.        |
|**Name**     | The name (up to 50 characters) that customers will see for your offer in Azure Marketplace and in the Azure portal. Use a recognizable brand name that customers will understand—if you're promoting this offer through your own website, be sure to use the exact same name here.        |

When you've finished, select **Save**. Now you're ready to move on to the **Plans** section.

## Create plans

Each offer must have one or more plans (sometimes referred to as SKUs). You might add multiple plans to support different feature sets at different prices, to support different billing models, or to customize a specific plan for a limited audience of specific customers. In Azure Marketplace, customers can view plans under the parent offer; however, plans appear as their own purchasable entity in the Azure portal.

In the Plans section, for each plan you want to create, select **New Plan**. Then enter a **Plan ID**. This ID can only contain lowercase alphanumeric characters, dashes, and underscores, with a maximum of 50 characters. The plan ID may be visible to customers in places like in product URLs and billing reports. Once you publish the offer, you can't change this value.

Next, complete the following sections in the **Plan Details** section:

|Field  |Description  |
|---------|---------|
|**Title**     | Friendly name for the plan for display. Maximum length of 50 characters.        |
|**Summary**     | Succinct description of the plan for display under the title. Maximum length of 100 characters.        |
|**Description**     | Description text that provides a more detailed explanation of the plan.         |
|**Billing model**     | There are 2 billing models supported for managed services offers. Choose **Bring your own license** if you don't want to use the Microsoft commerce platform and will bill your customers directly. Choose **% of Azure consumption** if you want to charge your customers a percentage of their monthly Azure consumption.   |
|**Is this a private Plan?**     | Indicates whether the SKU is private or public. The default is No (public). If you leave this selection, your plan will not be restricted to specific customers; after you publish a public plan, you can't later change it to private. If you want this plan to be available only to specific customers, select Yes. When you do so, you'll need to identify the customers by providing their subscription IDs. These can be entered one by one (for up to 10 subscriptions) or by uploading a .csv file (for up to 20,000 subscriptions). Be sure to include your own subscriptions here so you can test and validate the offer. For more information, see [Private SKUs and Plans](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal-orig/cloud-partner-portal-azure-private-skus).  |

Finally, complete the **Manifest Details** section. This creates a manifest with authorization information for managing customer resources. The info you provide here is necessary to onboard your customers for Azure Delegated Resource Management.

- First, provide a **Version** for the manifest. Use the format *n.n.n* (for example, 1.2.5).
- Next, enter your **Tenant ID**. This is a GUID associated with the Azure Active Directory tenant ID of your organization (i.e., the tenant which you will be working in to manage your customers' resources). If you don't have this handy, you can find it by hovering over your account name on the upper right-hand side of the Azure portal, or by selecting **Switch directory**. 
- Finally, add one or more **Authorization** entries to your plan. Authorizations define the entities who can access resources and subscriptions for customers who purchase the plan. You must provide this info in order to access resources on behalf of the customer using Azure Delegated Resource Management.
  For each authorization, provide the following. You can then select **New authorization** as many times as needed to add more users/role definitions.
  - **AAD Object Id**: The Azure AD identifier of a user, user group, or application which will be granted certain permissions (as described by the Role Definition) to your customers' resources.
  - **Role Definition**: Select one of the Azure AD built-in roles from the list. This role will determine the permissions that the user in the **AAD Object ID** field will have on your customers' resources. For info about these roles, see [Built-in roles](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles).

> [!TIP]
> In most cases, you'll want to assign permissions to an Azure AD user group or service principal, rather than to a series of individual user accounts. This lets you add or remove access for individual users without having to update and republish the plan when your access requirements change.

When you're done adding plans, select **Save**, then continue to the **Marketplace** section.

## Provide Marketplace text and images

The **Marketplace** section is where you provide the text and images which customers will see in Azure Marketplace and the Azure portal.

Provide info for the following fields in the **Overview** section:

|Field  |Description  |
|---------|---------|
|**Title**     |  Title of the offer, often the long, formal name. This title will be displayed prominently in the marketplace. Maximum length of 50 characters. In most cases, this should be the same as the **Name** you entered in the **Offer Settings** section.       |
|**Summary**     | Brief purpose or function of your offer. This is usually displayed under the title. Maximum length of 100 characters.        |
|**Long Summary**     | A longer summary of the purpose or function of your offer. Maximum length of 256 characters.        |
|**Description**     | More info about your offer. This field has a maximum length of 3000 characters and supports simple HTML formatting.        |
|**Marketing Identifier**     | A unique URL-friendly identifier. it will be used in Marketplace URLs for this offer. For example, if your publisher ID is *contoso* and your marketing identifier is *sampleApp*, the URL for your offer in Azure Marketplace will be *https://azuremarketplace.microsoft.com/marketplace/apps/contoso.sampleApp*.        |
|**Preview Subscription IDs**     | Add one to 100 subscription identifiers. The customers associated with these subscriptions will be able to view the offer in Azure Marketplace before it goes live. We suggest including your own subscriptions here so you can preview how your offer appears in the Azure Marketplace before making it available to customers.  (Microsoft support and engineering teams will also be able to view your offer during this preview period.)   |
|**Useful Links**     | URLs related to your offer, such as documentation, release notes, FAQs, etc.        |
|**Suggested Categories (Max 5)**     | One or more categories (up to five) which apply to your offer. These categories help customers discover your offer in Azure Marketplace and the Azure portal.        |

In the **Marketing Artifacts** section, you can upload logos and other assets to be shown with your offer. You can optionally upload screenshots or links to videos that can help customers understand your offer.

Four logo sizes are required: **Small (40x40)**, **Medium (90x90)**, **Large (115x115)**, and **Wide (255x155)**. Follow these guidelines for your logos:

- The Azure design has a simple color palette. Limit the number of primary and secondary colors on your logo.
- The theme colors of the portal are white and black. Don't use these colors as the background color for your logo. Use a color that makes your logo prominent in the portal. We recommend simple primary colors.
- If you use a transparent background, make sure that the logo and text aren't white, black, or blue.
- The look and feel of your logo should be flat and avoid gradients. Don't use a gradient background on the logo.
- Don't place text on the logo, not even your company or brand name.
- Make sure the logo isn't stretched.

The **Hero (815x290)** logo is optional but recommended. If you include a hero logo, follow these guidelines:

- Don't include any text in the hero logo, and be sure to leave 415 pixels of empty space on the right side of the logo. This is required to leave room for text elements that will be embedded programmatically: your publisher display name, plan title, offer long summary.
- Your hero logo's background may not be black, white, or transparent. Make sure your background color isn't too light, because the embedded text will be displayed in white. 
- Once you publish your offer with a hero icon, you can't remove it (although you can update it with a different version if desired).

Be sure to save your changes before moving on to the **Support** section.

## Add support info

In the **Support** section, provide the name, email, and phone number for an engineering contact and a customer support contact. You'll also need to provide support URLs. Microsoft may use this info when we need to contact you about business and support issues.

Once you've added this info, select **Save.**

## Publish your offer

Once you're happy with all of the info you've provided, your next step is to publish the offer to Azure Marketplace. Select the **Publish** button to initiate the process of making your offer live. For more info about this process, see [Publish Azure Marketplace and AppSource offers](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/manage-offers/cpp-publish-offer).

## Next steps

- Learn about the [cross-tenant management experience](../concepts/cross-tenant-management-experience.md).
- [View and manage customers](view-manage-customers.md) by going to **My customers** in the Azure portal.