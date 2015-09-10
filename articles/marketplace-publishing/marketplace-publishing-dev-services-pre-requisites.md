<properties
   pageTitle="Pre-requisites of Publishing a Developer Service"
   description="Detailed pre-requisites for publishing a developer service."
   services="Azure Marketplace"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

<tags
   ms.service="AzureStore"
   ms.devlang="en-us"
   ms.topic="Pre-requisites for Publishing a Developer Service"
   ms.tgt_pltfrm="Azure"
   ms.workload=""
   ms.date="09/10/2015"
   ms.author="hascipio"/>

# Pre-requisites for Publishing a Developer Service

## Create Organizational Microsoft Account (MSA) and Submit Microsoft Seller Application

* Create a MSA account using steps outlined [here](marketplace-publishing-accounts-creation-registration.md)
* Create a Seller Profile using steps outlined [here](marketplace-publishing-accounts-creation-registration.md)

  You must be an approved seller in order to publish offering in the Azure Marketplace and receive payout.
>Note that if you have already released an app you may already be an approved seller. You only need one approved seller account to sell apps and services in Microsoft Marketplaces. [Learn more about Microsoft Seller Dashboard](https://msdn.microsoft.com/en-us/library/dn188471.aspx)

* Add Tax and Payout Information.
* Navigate to the [Publishing Portal](https://publish.windowsazure.com) (sign in using MSA from above and add co-admins as necessary). Read and Accept Publisher Agreement (1st time logging into Publisher Portal).

  > **Note**: The participation policies are mentioned [here](http://azure.microsoft.com/en-us/support/legal/marketplace/participation-policies/).

  > The Publisher Portal is how you will manage the details of your Add-on, including marketing copy, pricing and endpoints for your Resource Provider. Read the Publisher Portal Guide to get started. This step can be done in parallel with Steps 1, 3 and 4.

## Get Access to an active Azure ‘Pay-As-You-Go’ Subscription (non-Microsoft subscription)

Navigate to [Azure Accounts Portal](https://account.windowsazure.com/signup?offer=ms-azr-0003p) (and sign in with MSA from above).

> **Note**: This will be used for testing your offer scenarios in Staging and Production.[Learn more Pay-as-you-Go (PAYG) Azure Subscriptions](https://azure.microsoft.com/en-us/offers/MS-AZR-0003P/)


## Install IDE that supports C#, .VSIX packages, .Net4.5 or greater, publishing to Microsoft Azure Cloud Service

1. Need to have Visual Studio 2013 Ultimate or higher
1. Need to have service PatchVS2013.4 or higher
1. Azure SDK 2.3 or higher

<!--
## Review the Publisher portal Offer marketing Data

You need to feel certain marketing details about your offering in Markeplace such as description of your product, cpmpany logo's, price plans, details of plans etc. This information is used as marketing content in our azure portal. Please find some of the marketing data mappings [here](marketplace-publishing-dev-services-pre-requisites-marketing-content-guide.md).

## Define Pricing Model for your Offering (section: Pricing & Billing)

Your customers will subscribe to the plans you define. Decide how many options you want to offer and create a Plan for each. Configure trials, availability, migration options, etc.  
Money talks, and the Azure Marketplace gives you the control you need to send the right message! You control the Markets where the Offer is available. You control the price. You even control setting foreign prices automatically or manually defining nice round numbers in each Market.[Example](marketplace-publishing-dev-services-pre-requisites-pricing-model-sample.md)

## Define Offer Profile Metadata

 The Azure Management Portal gives subscribers a plethora of opportunities to learn about your service. Eye catching logos, engaging descriptions, and distinctive plans are only some of the tools that will help you stand out.  Before going to the Publisher Portal, pre-defined your offer metadata and then in the next step input these values.
-->
<!--
## Onboard Offer Profile (Marketing, Pricing, other metadata).

Using the information from Offer Profile Metadata (.xlsx) above navigate to Publisher Portal: https://publish.windowsazure.com/
-->
