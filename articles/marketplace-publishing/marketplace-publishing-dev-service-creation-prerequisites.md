<properties
   pageTitle="Requirements for creating a Developer Service for the Azure Marketplace | Microsoft Azure"
   description="Learn about the requirements for creating, deploying and selling a developer service on the Azure Marketplace."
   services="Azure Marketplace"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

<tags
   ms.service="marketplace-publishing"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="Azure"
   ms.workload="na"
   ms.date="10/01/2015"
   ms.author="hascipio; v-shresh"/>

# Pre-requisites to creating a developer service Onboarding Guide

This article outlines the necessary pre-requisites e.g. accounts, tools, etc. to move forward with publishing a Developer Service offer on the Azure Marketplace.

> [AZURE.WARNING] You must be an approved seller to complete the publishing process of an offering into the Azure Marketplace and receive payout. If you have already released an app you may already be an approved seller. You only need one approved seller account to sell apps and services in Microsoft Marketplaces. [Learn more about creating a seller account with Microsoft][link-acct-creation]

## 1. Get Access to an active Azure ‘Pay-As-You-Go’ Subscription (non-Microsoft subscription)

Navigate to [Azure Accounts Portal][link-acctportal] (and sign in with MSA from above).

> [AZURE.NOTE] This will be used for testing your offer scenarios in Staging and Production. [Learn more Pay-as-you-Go (PAYG) Azure Subscriptions][link-payg]

## 2. Install IDE that supports C#, .VSIX packages, .Net4.5 or greater, publishing to Microsoft Azure Cloud Service

1. Need to have Visual Studio 2013 Ultimate or higher
1. Need to have service PatchVS2013.4 or higher
1. Azure SDK 2.3 or higher


## 3. Install VSIX

Please contact the Azure Certified team for downloading VSIX.

> [AZURE.IMPORTANT] If already installed, then uninstall and reinstall (to make sure you have latest version):
VS Menu Bar --> Tools --> Extensions and Updates… --> Remove “Application Services Resource Provider”

## 4. Review the Publisher portal Offer marketing Data

You need to feel certain marketing details about your offering in Marketplace such as description of your product, cpmpany logo's, price plans, details of plans etc. This information is used as marketing content in our azure portal. Please find some of the marketing data mappings [here](marketplace-publishing-dev-services-pre-requisites-marketing-content-guide.md).

## 5. Define Pricing Model for your Offering (section: Pricing & Billing)

Your customers will subscribe to the plans you define. Decide how many options you want to offer and create a Plan for each. Configure trials, availability, migration options, etc.  
Money talks, and the Azure Marketplace gives you the control you need to send the right message! You control the Markets where the Offer is available. You control the price. You even control setting foreign prices automatically or manually defining nice round numbers in each Market.[Example](marketplace-publishing-dev-services-pre-requisites-pricing-model-sample.md)

## 6. Define Offer Profile Metadata

 The Azure Management Portal gives subscribers a plethora of opportunities to learn about your service. Eye catching logos, engaging descriptions, and distinctive plans are only some of the tools that will help you stand out.  Before going to the Publisher Portal, pre-defined your offer metadata and then in the next step input these values.

## 7. Onboard Offer Profile (Marketing, Pricing, other metadata).

Using the information from Offer Profile Metadata (.xlsx) above navigate to Publisher Portal: https://publish.windowsazure.com/

## Next Steps
Now that you reviewed the pre-requisites and completed the necessary tasks, you can move forward with the creating your Developer Service offer as detailed in the guide [Developer Service Publishing Guide](marketplace-publishing-dev-service-creation.md)


[link-acct-creation]:marketplace-publishing-accounts-creation-registration.md
[link-sd-msdn]:https://msdn.microsoft.com/en-us/library/dn188471.aspx
[link-acctportal]:https://account.windowsazure.com/signup?offer=ms-azr-0003p
[link-payg]:https://azure.microsoft.com/en-us/offers/MS-AZR-0003P/
[link-devsvc-guide-mktg]:marketplace-publishing-dev-services-marketing-content-guide.md
[link-devsvc-guide-pricing]:marketplace-publishing-dev-services-pricing-model-sample.md
[link-devsvc-guide-create-rp]:marketplace-publishing-dev-services-create-resource-provider.md
