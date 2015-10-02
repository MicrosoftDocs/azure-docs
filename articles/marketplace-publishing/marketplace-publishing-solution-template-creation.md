<properties
   pageTitle="Guide to creating a Multi-Virtual Machine Image Solution Template for the  Marketplace | Microsoft Azure"
   description="Detailed instructions of how to create, certify and deploy a Multi-VM Image Solution Template for purchase on the Azure Marketplace."
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
      ms.date="10/02/2015"
      ms.author="hascipio; v-divte" />

# Guide to creating a multi-VM image solution template for the Azure Marketplace
After completing the step 2, [Account Creation and Registration][link-acct-creation], go to the [Publishing Portal][link-pubportal] where we will walkthrough the steps for creating a multi-VM Image Solution Template for the Azure Marketplace.

## 3.1 Select 'Solution Templates'

  ![drawing][img-pubportal-menu-sol-templ]

## 3.2 Create a new Solution Template

  ![drawing][img-pubportal-sol-templ-new]

## 3.3 Start with Topologies
A solution template is treated as an offer. This template offer will be a collection of single VM images published by you in "Developing and testing the identified topology" section in the [Solution Template Publishing Guide Pre-requisites](marketplace-publishing-solution-template-publication-prerequisites.md). An offer/solution template is a 'parent' to all of its topologies. You can define multiple topologies in one offer/solution template. When an offer is pushed to staging, it is pushed with all of its topologies. Given below are the steps to define your offer.   
1.	Create a Topology – **“Topology Identifier”** is typically the name of the Topology for the solution template. The Topology Identifier will be used in the URL as shown below:
Azure Marketplace :
http://azure.microsoft.com/en-us/marketplace/partners/{PublisherNamespace}/{OfferIdentifier}{TopologyIdentifier}
Ibiza Portal :
https://ms.portal.azure.com/#gallery/{PublisherNamespace}.{OfferIdentifier}{TopologyIdentifier}

2.	Add a new version  

## 3.4 Get your topology versions certified
Upload a zip file containing all required files to provision that particular version of the topology. This zip file must contain the following:
- *mainTemplate.json* and *createUiDefinition.json* file at its root
- Any linked templates and all required scripts.

Please refer to the document [Guidance_createuidefinition.pdf](https://microsoft.sharepoint.com/teams/AzureMarketplaceOnboarding/_layouts/15/start.aspx#/Onboarding%20Resources/Forms/AllItems.aspx?RootFolder=%2Fteams%2FAzureMarketplaceOnboarding%2FOnboarding%20Resources%2FMulti%20VM&FolderCTID=0x01200022453DD82E509544B11C9F5367F6105B&View=%7BEC6E631C%2DEFA1%2D4E67%2D87C6%2D4FCA489A2F92%7D&InitialTabId=Rib) for more details on *createUiDefinition.json*.

After uploading the zip file, click on **Request Certification**. The Microsoft certification team will review the files and certify the topology.

## Next Steps
Now that you created your Solution Template and submitted the zip file with the required files for certification, you can can continue with [Step 4: Getting to Staging](marketplace-publishing-push-to-staging.md) in parallel.

[img-pubportal-menu-sol-templ]:media/marketplace-publishing-solution-template-creation/pubportal-menu-solution-templates.png
[img-pubportal-sol-templ-new]:media/marketplace-publishing-solution-template-creation/pubportal-solution-template-new.png
[link-acct-creation]:marketplace-publishing-microsoft-accounts-creation-registration.md
[link-pubportal]:https://publish.windowsazure.com
