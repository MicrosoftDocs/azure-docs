---
title: Publishing to Azure Government Marketplace | Microsoft Docs
description: This article provides guidance on publishing solutions to the Azure Government Marketplace.
services: azure-government
cloud: gov
documentationcenter: ''
author: gsacavdm
manager: pathuff

ms.assetid: 7790d3c5-d0fa-4662-b4f0-a174cb7d6c9f
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 07/13/2018
ms.author: gsacavdm

---
# Publishing to the Azure Government Marketplace
This article is provided to help partners create, deploy, and manage their solutions listed in the Azure Government Marketplace for Azure Government customers and partners to use.

## Why publish to Azure Government
[Azure Government](documentation-government-welcome.md) is a dedicated instance of Azure that employs world-class security and compliance services critical to U.S. government for all systems and applications built on its architecture. This makes the cloud a viable option for thousands of US federal, state, local and tribal governments, and their partners.

Publishing your solution in the Azure Government Marketplace is as simple as publishing to Azure global and checking an extra box. There are no compliance requirements to publish your solution to Azure Government
and making it available in the Azure Government Marketplace makes it easier for these government customers to gain exposure to your solution and get up and running quickly.

## Compliance considerations
There are no initial Microsoft compliance requirements to publish solutions to the Azure Government Marketplace.

Once a solution has been published, customers can deploy it into their own subscription as part of a broader operational environment or business solution. The customer might then opt to certify the overarching environment. As part of that certification process, they might reach out to the publisher with extra requirements, which the publisher can then evaluate and triage with the customer. 

## Marketplace offer support
Currently, the Azure Government Marketplace only supports the following offers:

* Virtual Machines > Bring your Own License
* Virtual Machines > Pay-as-you-Go
* Azure Application > Solution Template

If there are other offer types you'd like to see supported in Azure Government, let us know via the [Azure Government feedback forum](https://feedback.azure.com/forums/558487-azure-government).

## Publishing
> [!NOTE]
> These steps assume you have already published a solution in Azure Global. If you haven't, please check out the [Azure Marketplace Publisher Guide](../marketplace/marketplace-publishers-guide.md) documentation before proceeding.

1. **Sign in to the [Azure Cloud Partner Portal](https://cloudpartner.azure.com)**.
1. **Open the offer** you want to publish to the Azure Government Marketplace.
1. The Editor tab is opened by default, click on the **SKUs** entry in the left menu of the editor.
1. **Click on the sku**. 
1. In the **SKU Details section**, **Cloud Availability option**, check the **Azure Government Cloud** box. Remember that this option [isn't available for all offers](#marketplace-offer-support).
1. ***Optionally***, click the **+ Add Certification** link to add links to any certifications that are relevant for your product and that you want to make available to customers.
1. ***Optionally***, add your Azure Government subscription to preview your marketplace offering before it is broadly available. 
    1. Click on **Marketplace** entry in the left menu
    1. In the **Preview Subscription Ids section**, click on **Add subscription** and add your [Azure Government subscription ID](#testing).
1. **Publish** your solution once again.

## Testing
If you want to confirm that your solution has been published or test it, you need to request an Azure Government account. This is a  separate account from any account in Azure Global that is used to log in to the [Azure Government portal](https://portal.azure.us). 

To obtain an account:

1. Request an [Azure Government trial account](https://azuregov.microsoft.com/trial/azuregovtrial).
    * Indicate that your organization is a *Solution Provider Serving U.S. Federal, State, Local or Tribal Government Entities*.
1. Wait for 3 - 5 business days for your account to be provisioned.
1. Log in to the [Azure Government portal](https://portal.azure.us) with your newly created account.
1. Eventually you can convert your trial account to a [paid account](https://azure.microsoft.com/offers/azure-government/)

## Troubleshooting
Generally, virtual machines and solution templates work across both Azure and Azure Government, however there are a few instances when this is not the case. The following section outlines the most common reasons why a virtual machine or solution template would work in the Azure Marketplace but not the Azure Government Marketplace.

### Not available after publish
If you've completed all the steps outlined above and your virtual machine is still not available in the Azure Government Marketplace, make sure that your Virtual's Machine *Hide this SKU* setting is not set to *Yes*.
If it is set to yes, there's probably also a solution template that you also need to publish to Azure Government. If there is no solution template and you want to make the standalone Virtual Machine available, flip that switch to *No* and republish.

### Hardcoded endpoints
Verify endpoints are not hard-coded into your solution Template for Azure Global as they will not be valid for any other Azure clouds (Azure Government, Azure China, Azure Germany). Instead modify the Solution template to obtain the endpoint from the resource, for example:

* Incorrect VHD uri (hard coded)

    ```json
    "uri": "[concat('https://', variables('storageAccountName'), '.blob.core.windows.net/',  '/osdisk.vhd')]",
    ```

* Correct VHD uri (referenced)

    ```json
    "uri": "[concat(reference(resourceId('Microsoft.Storage/storageAccounts/', variables('storageAccountName'))).primaryEndpoints.blob, 'osdisk.vhd')]",
    ```

### Hardcoded list of locations
Make sure your solution template supports the Azure Government locations. 

### Unavailable resources
Verify that resources, API versions, extensions and VM images used in your solution template are available in Azure Government. 

#### Images
Make sure that the image that your solution template relies on is available in Azure Government. If this is a Virtual Machine you own, need to also publish that to the Azure Government Marketplace.
Check out the [Azure Government Marketplace images](documentation-government-image-gallery.md) documentation to obtain the list of images available.

#### Resource providers and API versions
You can obtain the full list of resource providers and their API versions by logging in to the [Azure Government portal](https://portal.azure.us) using your Azure Government account and following the steps listed in the [Resource providers and types](../azure-resource-manager/resource-manager-supported-services.md#portal) documentation.

#### Extensions
Make sure that your any virtual machine extensions that your solution template relies on is available in Azure Government. Check out the [Azure Government virtual machine extensions](documentation-government-extension.md) documentation to obtain the list of extensions available.
 
## Next steps
* Subscribe to the [Azure Government blog](https://blogs.msdn.microsoft.com/azuregov/)
* Get help on Stack Overflow by using the [azure-gov](https://stackoverflow.com/questions/tagged/azure-gov) tag
* Give us feedback or request new features via the [Azure Government feedback forum](https://feedback.azure.com/forums/558487-azure-government) 
