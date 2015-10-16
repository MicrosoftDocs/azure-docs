<properties
   pageTitle="Overview of the various portals needed to create an offer for the Marketplace | Microsoft Azure"
   description="Overview of the various portals needed to create an offer for the Marketplace"
   services="marketplace-publishing"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

<tags
   ms.service="marketplace-publishing"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="10/05/2015"
   ms.author="hascipio" />


# Portals you will need
Before you start the process of publishing an offer, let’s get you introduced to the various portals that you will need. Below is the short summary about the portals--Seller Dashboard, publishing portal, and Azure preview portal--in the order that you will interact with them.                                                                            
## Seller Dashboard
[https://sellerdashboard.microsoft.com](https://sellerdashboard.microsoft.com)
### Description
Creating your Seller Dashboard account is a one-time task. Make sure that the company does not already have a Seller Dashboard account before you attempt to create one. During the process, we collect bank account information, tax information, and company address information.

> [AZURE.NOTE] If you are publishing only free offers (or bring-your-own-license offers), we do not require tax and bank information.

### Identity/account used
Ideally, this is a distribution list or a security group (e.g., azurepublishing@*partnercompany*.com). The distribution list or security group **must** be registered as a Microsoft account.

> [AZURE.TIP] We recommend using a distribution list or a security group because it removes the dependency on any individual, although an individual account can be used as well.

## Publishing portal
[https://publish.windowsazure.com](https://publish.windowsazure.com)

### Description
This is the portal that you use to work on the offer and to publish it (marketing, pricing, publishing, certification if applicable, etc.).

### Identity/account used
The above distribution list or security group must be used for the first time to sign in to the publishing portal. Later, other users can be added as co-admins. This is how it gets mapped to the Seller Dashboard registration data.

## Azure preview portal
[https://ms.portal.azure.com](https://ms.portal.azure.com)
### Description
This is the portal where you can view your staged and published offers in the Azure Marketplace (applicable for VMs, solution templates, and Azure Resource Manager-based developer services).
### Identity/account used
While you're staging an offer from the publishing portal, a subscription ID needs to be whitelisted. The same subscription (there is a user name and password associated with it) needs to be used for signing in to this portal to test the staged offer.

## See also
- [Getting started: How to publish an offer for the Azure Marketplace](marketplace-publishing-getting-started.md)
