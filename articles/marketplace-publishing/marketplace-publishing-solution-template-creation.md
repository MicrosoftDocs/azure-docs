---
title: Guide to creating a solution template for the  Marketplace | Microsoft Docs
description: Detailed instructions of how to create, certify and deploy a Multi-VM Image Solution Template for purchase on the Azure Marketplace.
services: marketplace-publishing
documentationcenter: ''
author: HannibalSII
manager: hascipio
editor: ''

ms.assetid: e14e05f2-2385-4ce0-b351-0747cb74ba19
ms.service: marketplace
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/27/2016
ms.author: hascipio; v-divte

---
# Guide to create a solution template for Azure Marketplace
After completing step 1, [Account creation and registration][link-acct-creation], we guided you on the creation of an Azure-compatible solution template at [Technical prerequisites for creating a solution template](marketplace-publishing-solution-template-creation-prerequisites.md). Now we will walk you through the steps for creating a solution template for multiple VMs on the [Publishing Portal][link-pubportal] for the Azure Marketplace.

## Create your solution template offer in the Publishing Portal
Go to  [https://publish.windowsazure.com](http://publish.windowsazure.com). When signing in for the first time to the [Publishing Portal](https://publish.windowsazure.com/), use the same account with which your company’s seller profile was registered. Later, you can add any employee of your company as a co-admin in the Publishing Portal.

### 1. Select "Solution templates"
  ![drawing][img-pubportal-menu-sol-templ]

### 2. Create a new solution template
  ![drawing][img-pubportal-sol-templ-new]

### 3. Start with topologies
A solution template is a "parent" to all of its topologies. You can define multiple topologies in one offer/solution template. When an offer is pushed to staging, it is pushed with all of its topologies. Follow the steps below to define your offer:     

* Create a Topology: “Topology Identifier” is typically the name of the topology for the solution template. The topology identifier is used in the URL as shown below:

  Azure Marketplace:
  http://azure.microsoft.com/marketplace/partners/{PublisherNamespace}/{OfferIdentifier}{TopologyIdentifier}

  Azure Portal:
  https://portal.azure.com/#gallery/{PublisherNamespace}.{OfferIdentifier}{TopologyIdentifier}
* Add a new version.

### 4. Get your topology versions certified
Upload a zip file that contains all required files to provision that particular version of the topology. This zip file must contain the following:

* *mainTemplate.json* and *createUiDefinition.json* file at its root directory.
* Any linked templates and all required scripts.

  > [!TIP]
  > While your developers work on creating the solution template topologies and getting them certified, the business, marketing, and/or legal departments of your company can work on the marketing and legal content.
  >
  >

## Next steps
Now that you created your solution template and uploaded the zip file, please follow the instructions in the [Marketplace marketing content guide](marketplace-publishing-push-to-staging.md) before pushing the offer to staging. To see the full set of marketplace publishing articles, visit [Getting started: How to publish an offer to the Azure Marketplace](marketplace-publishing-getting-started.md).

You might also be interested in these related articles:

* VM images: [About Virtual Machine Images in Azure](https://msdn.microsoft.com/library/azure/dn790290.aspx)
* VM extensions: [Azure VM Extensions and Features](../virtual-machines/extensions/features-windows.md)
* Azure Resource Manager: [Authoring Azure Resource Manager Templates](../azure-resource-manager/resource-group-authoring-templates.md) and [Simple Template Examples](https://github.com/rjmax/ArmExamples)
* Storage account throttles: [How to Monitor for Storage Account Throttling](http://blogs.msdn.com/b/mast/archive/2014/08/02/how-to-monitor-for-storage-account-throttling.aspx) and [Premium storage](../virtual-machines/windows/premium-storage.md#scalability-and-performance-targets)

[img-pubportal-menu-sol-templ]:media/marketplace-publishing-solution-template-creation/pubportal-menu-solution-templates.png
[img-pubportal-sol-templ-new]:media/marketplace-publishing-solution-template-creation/pubportal-solution-template-new.png
[link-acct-creation]:marketplace-publishing-accounts-creation-registration.md
[link-pubportal]:https://publish.windowsazure.com
