<properties
   pageTitle="Overview of the various Portals needed to create an offer for the Marketplace | Microsoft Azure"
   description="Overview of the various Portals needed to create an offer for the Marketplace"
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
Before you start with the process, let’s get you introduced to the various portals that you will need to get offer the published. Below is the short summary about the Portals - **Seller Dashboard, Publishing Portal** and **Azure Preview Portal** in the order you will interact with them.                                                                            
## Seller Dashboard
[https://sellerdashboard.microsoft.com](https://sellerdashboard.microsoft.com)
### Description
Creating your Seller Dashboard account is a one-time task. The partner should check to make sure the company does not already have a Seller Dashboard account before attempting to create one. During the process, we collect bank account information, tax information, and company address information.

> [AZURE.NOTE] If you are publishing only free offers (or bring-your-own-license) we do not require tax and bank information.

### Identity/Account Used
Ideally a Distribution List or a Security Group (e.g. azurepublishing@partnercompany.com). This Distribution List or a Security Group **MUST** be registered as a Microsoft Account.

> [AZURE.TIP] We recommend using a Distribution List or a Security Group as it removes the dependency on any individual; although an individual account be used as well.

## Publishing Portal
[https://publish.windowsazure.com](https://publish.windowsazure.com)

### Description
Portal for the partner to work on their offer and to publish it (marketing, pricing, publishing, certification if applicable, etc.).

### Identity/Account Used
Above **Distribution List** or a **Security Group** must be used for the first time to login on Publishing portal and later other users can be added as co-admin. This is how it gets mapped to the Seller Dashboard registration data.

## Azure Preview Portal
[https://ms.portal.azure.com](https://ms.portal.azure.com)
### Description
This is the portal where the partners can view their Staged and Published offers in the Marketplace (applicable for VMs, solution templates and ARM-based Developer Services)
### Identity/Account Used
While staging the offer from publishing portal a subscription ID needs to be whitelisted. The same subscription[there is a username and password associated] needs to be used while logging in to this portal to test the staged offer.

## See Also
- [Getting Started: How to publish an offer for the Azure Marketplace](marketplace-publishing-getting-started.md)
