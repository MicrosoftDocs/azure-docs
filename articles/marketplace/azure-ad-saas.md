---
title: Azure Active Directory and transactable SaaS offers in the commercial marketplace
description: Learn how Azure Active Directory works with transactable SaaS offers in the Microsoft commercial marketplace.
author: mingshen-ms 
ms.author: mingshen
ms.reviewer: dannyevers 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 09/04/2020
---

# Azure AD and transactable SaaS offers in the commercial marketplace

The Microsoft cloud-based identity and access management service, [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md) (Azure AD) helps users sign in and access internal and external resources. In the Microsoft commercial marketplace, Azure AD makes transactable SaaS offers easier and more secure for everyone, including publishers, buyers, and users. With Azure AD, publishers can automate the provisioning of users to their software as a service (SaaS) apps, and buyers themselves can manage these provisioned users. 

Further, [Azure AD single sign-on](../active-directory/manage-apps/what-is-single-sign-on.md) (SSO) provides security and convenience when users sign in to apps in Azure AD. Faster engagement and optimized experiences also inspire buyer and user confidence from the very first interaction with a publisher’s SaaS app. This gives a positive impression that builds visibility and encourages repeat business.

By following the guidance in this article, you’ll help to certify your SaaS offer in the commercial marketplace. For more details about certification, read the detailed [commercial marketplace certification policies](/legal/marketplace/certification-policies#100-general), including those [specific to SaaS](/legal/marketplace/certification-policies#1000-software-as-a-service-saas).

## Before you begin

When you [create your SaaS offer](./create-new-saas-offer.md) in Partner Center, you choose from a set of specific listing options that will be displayed on the offer listing. Your choice determines how your offer is transacted in the commercial marketplace. Offers sold through Microsoft are called transactable offers. We bill the customer on your behalf for all transactable offers. If you choose to sell through Microsoft and have us host transactions on your behalf (the **Yes** option), then you’ve chosen to create a transactable offer and this article is for you. We recommend that you read it in its entirety.

If you choose to only list your offer through the commercial marketplace and process transactions independently (the **No** option), you have three options for how potential customers will access your offer: Get it now (free), Free trial, and Contact me. If you select **Get it now (free)** or **Free trial**, this article is not for you. Instead, see [Build the landing page for your free or trial SaaS offer in the commercial marketplace](./azure-ad-free-or-trial-landing-page.md) for more information. If you select **Contact me**, there are no direct publisher responsibilities. Continue creating your offer in the Partner Center.

## How Azure AD works with the commercial marketplace for SaaS offers

Azure AD enables seamless purchasing, fulfillment, and management of commercial marketplace solutions. Figure 1 shows how the publisher, buyer, and user interact to purchase and activate a subscription. It also shows how customers use and manage SaaS applications they get from the commercial marketplace. For the purposes of this illustration, the buyer is the SaaS application user who initiates a purchase from the commercial marketplace.

As shown in Figure 1, when a buyer selects your offer, they kick off a chain of workflows that includes purchase, subscription, and user management. Within this chain, you as the publisher are responsible for certain requirements, with Microsoft providing support at key points.

***Figure 1: Using Azure AD for SaaS offers in the commercial marketplace***

:::image type="content" source="./media/azure-ad-saas/azure-ad-saas-flow.png" alt-text="Illustrates the purchase management, subscription management, and optional user management process steps.":::

The following sections provide details about the requirements for each process step.

## Process steps for purchase management

This figure shows the four process steps for purchase management.

:::image type="content" source="./media/azure-ad-saas/azure-ad-saas-flow-1-4.png" alt-text="Illustrates the four process steps for purchase management.":::

This table provides details for the purchase management process steps.

| Process step | Publisher action | Recommended or required for publishers |
| ------------ | ------------- | ------------- |
| 1. The buyer signs in to the commercial marketplace with their Azure ID identity and selects a SaaS offer. | No publisher action required. | Not applicable |
| 2. After purchasing, the buyer selects **Configure account** in Azure Marketplace or **Configure now** in AppSource, which directs the buyer to the publisher’s landing page for this offer. The buyer must be able to sign in to the publisher’s SaaS application with Azure AD SSO and must only be asked for minimal consent that does not require Azure AD administrator approval. | Design a [landing page](azure-ad-transactable-saas-landing-page.md) for the offer so that it receives a user with their Azure AD or Microsoft account (MSA) identity and facilitates any additional provisioning or setup that’s required. | Required |
| 3. The publisher requests purchase details from the SaaS fulfillment API. | Using an [access token](./partner-center-portal/pc-saas-registration.md) generated from the landing page’s Application ID, [call the resolve endpoint](./partner-center-portal/pc-saas-fulfillment-api-v2.md#resolve-a-purchased-subscription) to retrieve specifics about the purchase. | Required |
| 4. Through Azure AD and the Microsoft Graph API, the publisher gathers the company and user details required to provision the buyer in the publisher’s SaaS application.  | Decompose the Azure AD user token to find name and email, or [call the Microsoft Graph API](/graph/use-the-api) and use delegated permissions to [retrieve information](/graph/api/user-get) about the user who is logged in. | Required |
||||

## Process steps for subscription management

This figure shows the two process steps for subscription management.

:::image type="content" source="./media/azure-ad-saas/azure-ad-saas-flow-5-6.png" alt-text="Illustrates the two process steps for subscription management.":::

This table describes the details about the subscription management process steps.

| Process step | Publisher action | Recommended or required for publishers |
| ------------ | ------------- | ------------- |
| 5. The publisher manages the subscription to the SaaS application through the SaaS fulfillment API. | Handle subscription changes and other management tasks through the [SaaS fulfillment APIs](./partner-center-portal/pc-saas-fulfillment-api-v2.md).<br><br>This step requires an access token as described in process step 3. | Required |
| 6. When using metered pricing, the publisher emits usage events to the metering service API. | If your SaaS app features usage-based billing, make usage notifications through the [Marketplace metering service APIs](marketplace-metering-service-apis.md).<br><br>This step requires an access token as described in Step 3. | Required for metering |
||||

## Process steps for user management

This figure shows the three process steps for user management.

:::image type="content" source="./media/azure-ad-saas/azure-ad-saas-flow-7-9.png" alt-text="Illustrates the three optional process steps for user management.":::

Process steps 7 through 9 are optional user management process steps. They provide additional benefits for publishers who support Azure AD single sign-on (SSO). This table describes the details about the user management process steps.

| Process step | Publisher action | Recommended or required for publishers |
| ------------ | ------------- | ------------- |
| 7. Azure AD administrators at the buyer’s company can optionally manage access for users and groups through Azure AD. | No publisher action is required to enable this if Azure AD SSO is set up for users (Step 9). | Not applicable |
| 8. The Azure AD Provisioning Service communicates changes between Azure AD and the publisher’s SaaS application. | [Implement a SCIM endpoint](../active-directory/app-provisioning/use-scim-to-provision-users-and-groups.md) to receive updates from Azure AD as users are added and removed. | Recommended |
| 9. After the app is permissioned and provisioned, users from the buyer’s company can use Azure AD SSO to log in to the publisher’s SaaS application. | [Use Azure AD SSO](../active-directory/manage-apps/what-is-single-sign-on.md) to enable users to sign in once with one account to the publisher’s SaaS application. | Recommended |
||||

## Next steps

- [Build the landing page for your transactable SaaS offer in the commercial marketplace](azure-ad-transactable-saas-landing-page.md)
- [Build the landing page for your free or trial SaaS offer in the commercial marketplace](azure-ad-free-or-trial-landing-page.md)
- [How to create a SaaS offer in the commercial marketplace](create-new-saas-offer.md)