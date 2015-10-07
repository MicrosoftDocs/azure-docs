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
      ms.date="10/07/2015"
      ms.author="hascipio; v-divte" />

# Guide to creating a Solution Template for Azure Marketplace
After completing the step 1, [Account Creation and Registration][link-acct-creation], we guided you on the creation of an Azure compatible Solution Template under the [Technical Pre-requisites for creating a Solution Template](marketplace-publishing-solution-template-creation-prerequisites.md). Now we will walk you through the steps for creating a multi-VM Solution Template on the [Publishing Portal][link-pubportal] for the Azure Marketplace.

<!--
## 1. Create an Azure compatible solution
1.	Identifying Topology and Platform Evaluation

  For each type of deployment – Evaluation, Proof of Concept, Dev/Test, and Production – think through the exact layout and topology needed for your application.  
  Question to ask:
  -	What are the different tiers?  
  -	What resources are needed for each tier and of what size?  
  -	What are the building blocks needed to create these resources?  
  A production deployment, or even a dev/test environment, can vary significantly in size depending on the customer and their needs.  Decide upon what a small, medium, large, and extra-large topology would look like for your workload and think through availability, scalability, and performance requirements needed to be successful.

2.	Developing and testing the identified topology
  After identifying the topology, you need to work on the following

  -	Work on the configuration (VM sizes, Storage accounts, VNet, Subnet, Network interface card, public IP etc.)
  -	Set up dev and test environment
  -	Build and iterate on the template
  -	Perform rigorous stress testing and performance testing

3.	Familiarize yourself with Azure ARM Template
  The Azure Resource Manager deploys and manages the lifecycle of a collection of resources through declarative, model-based template language.  This ARM template is simply a parameterized JSON file which expresses the set of resources and their relationship to be used for deployments.  Each resource is placed in a resource group, which is simply a container for resources.  ARM provides centralized auditing, tagging, Resource Based Access Control, and most importantly, its operations are idempotent.

  With ARM and ARM templates, you can express more complex deployments of Azure resources, such as Virtual Machines, Storage Accounts, and Virtual Networks, which build upon Marketplace content such as VM Images and VM Extensions.
-->

<!--
4.	Create your Multi VM template solution
  For detailed information on the guidance, review the [Creating a Solution Template Best Practices](marketplace-publishing-solution-creation-best-practices.md) for best practices and requirements for Multi-VM solutions.
-->

> [AZURE.NOTE] For first time login to [Publishing Portal] (https://publish.windowsazure.com/), use the same account with which your company’s Seller Profile was registered. Later you can add any employee of your company as a co-admin in the Publishing portal by following the steps below.

## Create your Solution Template offer in the Publishing Portal
Go to the [https://publish.windowsazure.com](http://publish.windowsazure.com). For first time login to [Publishing Portal](https://publish.windowsazure.com/), use the same account with which your company’s Seller Profile was registered. Later you can add any employee of your company as a co-admin in the Publishing Portal.

### 1. Select 'Solution Templates'

  ![drawing][img-pubportal-menu-sol-templ]

### 2. Create a new Solution Template

  ![drawing][img-pubportal-sol-templ-new]

### 3. Start with Topologies
A solution template is a 'parent' to all of its topologies. You can define multiple topologies in one offer/solution template. When an offer is pushed to staging, it is pushed with all of its topologies. Given below are the steps to define your offer.     
- Create a Topology – **“Topology Identifier”** is typically the name of the Topology for the solution template. The Topology Identifier will be used in the URL as shown below:

  Azure Marketplace :
http://azure.microsoft.com/en-us/marketplace/partners/{PublisherNamespace}/{OfferIdentifier}{TopologyIdentifier}

  Azure Preview Portal :
https://ms.portal.azure.com/#gallery/{PublisherNamespace}.{OfferIdentifier}{TopologyIdentifier}

- Add a new version  

### 4. Get your topology versions certified
Upload a zip file containing all required files to provision that particular version of the topology. This zip file must contain the following:
- *mainTemplate.json* and *createUiDefinition.json* file at its root
- Any linked templates and all required scripts.
<!--
Please refer to the document [Guidance_createuidefinition.pdf](https://microsoft.sharepoint.com/teams/AzureMarketplaceOnboarding/_layouts/15/start.aspx#/Onboarding%20Resources/Forms/AllItems.aspx?RootFolder=%2Fteams%2FAzureMarketplaceOnboarding%2FOnboarding%20Resources%2FMulti%20VM&FolderCTID=0x01200022453DD82E509544B11C9F5367F6105B&View=%7BEC6E631C%2DEFA1%2D4E67%2D87C6%2D4FCA489A2F92%7D&InitialTabId=Rib) for more details on *createUiDefinition.json*.
-->
After uploading the zip file, click on **Request Certification**. The Microsoft certification team will review the files and certify the topology.

You can also validate the create experience without the actual deployment for the end user using the below steps.

1. Save the *createUiDefinition.json* and generate the absolute URL. The url MUST be publicly accessible.
2. Encode the URL [[http://www.url-encode-decode.com/](http://www.url-encode-decode.com/)].
3. Replace the highlighted text with the location (encoded URL) of the *createUiDefinition.json* which needs validation.

  https://portal.azure.com/?clientOptimizations=false#blade/Microsoft_Azure_Compute/CreateMultiVmWizardBlade/internal_bladeCallId/anything/internal_bladeCallerParams/{"initialData":{},"providerConfig":{"createUiDefinition":"http%3A%2F%2Fyoururltocreateuidefinition.jsonURLencoded"}}
4. Copy and paste the URL in any browser and view the end user experience of your createUiDefinition.json file.

> [AZURE.TIP] While your developers work on creating the Solution Template topologies and getting them certified, the Business/Marketing/Legal department of your company can work on the marketing and legal content.

## Next Steps
Now that you created your Solution Template and submitted the zip file with the required files for certification, you can can continue to and follow the instructions in [Marketplace Marketing Content Guide](marketplace-publishing-push-to-staging.md) before preparing your offer for testing in Staging.

## See Also
- [Getting Started: How to publish an offer to the Azure Marketplace](marketplace-publishing-getting-started.md)

**VM Images**
- [About Virtual Machine Images in Azure](https://msdn.microsoft.com/en-us/library/azure/dn790290.aspx)

**VM Extensions**
- [VM Agent and VM Extensions Overview](https://msdn.microsoft.com/en-us/library/azure/dn832621.aspx)
- [Azure VM Extensions and Features](https://msdn.microsoft.com/en-us/library/azure/dn606311.aspx)

**ARM**
- [Authoring Azure ARM Templates](https://azure.microsoft.com/en-us/documentation/articles/resource-group-authoring-templates/)
- [Simple ARM Template Examples](https://github.com/rjmax/ArmExamples)

**Storage Account Throttles**
- [How to Monitor for Storage Account Throttling](http://blogs.msdn.com/b/mast/archive/2014/08/02/how-to-monitor-for-storage-account-throttling.aspx)
- [Premium Storage](https://azure.microsoft.com/en-us/documentation/articles/storage-premium-storage-preview-portal/#scalability-and-performance-targets-when-using-premium-storage)

[img-pubportal-menu-sol-templ]:media/marketplace-publishing-solution-template-creation/pubportal-menu-solution-templates.png
[img-pubportal-sol-templ-new]:media/marketplace-publishing-solution-template-creation/pubportal-solution-template-new.png
[link-acct-creation]:marketplace-publishing-microsoft-accounts-creation-registration.md
[link-pubportal]:https://publish.windowsazure.com
