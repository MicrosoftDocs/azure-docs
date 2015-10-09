<properties
   pageTitle="Guide to creating a Solution Template for the  Marketplace | Microsoft Azure"
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
      ms.date="10/09/2015"
      ms.author="hascipio; v-divte" />

# Guide to create a Solution Template for Azure Marketplace
After completing the step 1, [Account Creation and Registration][link-acct-creation], we guided you on the creation of an Azure compatible Solution Template under the [Technical Pre-requisites for creating a Solution Template](marketplace-publishing-solution-template-creation-prerequisites.md). Now we will walk you through the steps for creating a multi-VM Solution Template on the [Publishing Portal][link-pubportal] for the Azure Marketplace.

## Create your Solution Template offer in the Publishing Portal
Go to the [https://publish.windowsazure.com](http://publish.windowsazure.com). **For first time login to [Publishing Portal](https://publish.windowsazure.com/), use the same account with which your company’s Seller Profile was registered.** Later you can add any employee of your company as a co-admin in the Publishing Portal.

### 1. Select 'Solution Templates'

  ![drawing][img-pubportal-menu-sol-templ]

### 2. Create a new Solution Template

  ![drawing][img-pubportal-sol-templ-new]

### 3. Start with Topologies
A solution template is a 'parent' to all of its topologies. You can define multiple topologies in one offer/solution template. When an offer is pushed to staging, it is pushed with all of its topologies. Given below are the steps to define your offer.     
- Create a Topology – **“Topology Identifier”** is typically the name of the Topology for the solution template. The Topology Identifier will be used in the URL as shown below:

  Azure Marketplace :
http://azure.microsoft.com/marketplace/partners/{PublisherNamespace}/{OfferIdentifier}{TopologyIdentifier}

  Azure Preview Portal :
https://ms.portal.azure.com/#gallery/{PublisherNamespace}.{OfferIdentifier}{TopologyIdentifier}

- Add a new version  

### 4. Get your topology versions certified
Upload a zip file containing all required files to provision that particular version of the topology. This zip file must contain the following:
- *mainTemplate.json* and *createUiDefinition.json* file at its root
- Any linked templates and all required scripts.

After uploading the zip file, click on **Request Certification**. The Microsoft certification team will review the files and certify the topology.

You can also validate the create experience without the actual deployment for the end user using the below steps.

1. Save the *createUiDefinition.json* and generate the absolute URL. The url MUST be publicly accessible.
2. Encode the URL [[http://www.url-encode-decode.com/](http://www.url-encode-decode.com/)].
3. Replace the highlighted text with the location (encoded URL) of the *createUiDefinition.json* which needs validation.

  https://portal.azure.com/?clientOptimizations=false#blade/Microsoft_Azure_Compute/CreateMultiVmWizardBlade/internal_bladeCallId/anything/internal_bladeCallerParams/ **{"initialData":{},"providerConfig":{"createUiDefinition":"http://yoururltocreateuidefinition.jsonURLencoded"}}**
4. Copy and paste the URL in any browser and view the end user experience of your createUiDefinition.json file.

> [AZURE.TIP] While your developers work on creating the Solution Template topologies and getting them certified, the Business/Marketing/Legal department of your company can work on the marketing and legal content.

## Next Steps
Now that you created your Solution Template and submitted the zip file with the required files for certification, you can can continue to and follow the instructions in [Marketplace Marketing Content Guide](marketplace-publishing-push-to-staging.md) before preparing your offer for testing in Staging.

## See Also
- [Getting Started: How to publish an offer to the Azure Marketplace](marketplace-publishing-getting-started.md)

**VM Images**
- [About Virtual Machine Images in Azure](https://msdn.microsoft.com/library/azure/dn790290.aspx)

**VM Extensions**
- [VM Agent and VM Extensions Overview](https://msdn.microsoft.com/library/azure/dn832621.aspx)
- [Azure VM Extensions and Features](https://msdn.microsoft.com/library/azure/dn606311.aspx)

**ARM**
- [Authoring Azure ARM Templates](../resource-group-authoring-templates/)
- [Simple ARM Template Examples](https://github.com/rjmax/ArmExamples)

**Storage Account Throttles**
- [How to Monitor for Storage Account Throttling](http://blogs.msdn.com/b/mast/archive/2014/08/02/how-to-monitor-for-storage-account-throttling.aspx)
- [Premium Storage](../storage/storage-premium-storage-preview-portal/#scalability-and-performance-targets-when-using-premium-storage)

[img-pubportal-menu-sol-templ]:media/marketplace-publishing-solution-template-creation/pubportal-menu-solution-templates.png
[img-pubportal-sol-templ-new]:media/marketplace-publishing-solution-template-creation/pubportal-solution-template-new.png
[link-acct-creation]:marketplace-publishing-microsoft-accounts-creation-registration.md
[link-pubportal]:https://publish.windowsazure.com
