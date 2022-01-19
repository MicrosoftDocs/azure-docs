---
title: Publishing to Azure Government Marketplace
description: This article provides guidance on publishing solutions to Azure Government Marketplace.
services: azure-government
cloud: gov
documentationcenter: ''

ms.service: azure-government
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 08/31/2021
---

# Publishing to Azure Government Marketplace

This article helps partners create, deploy, and manage their solutions listed in Azure Government Marketplace for public sector customers and partners to use.

[Azure Government](./documentation-government-welcome.md) is a physically isolated instance of Azure that delivers services with world-class security and compliance critical to the US government. These services maintain FedRAMP and DoD authorizations, CJIS state-level agreements, support for IRS 1075, ability to sign a HIPAA Business Associate Agreement, and much more. Azure Government provides an extra layer of protection to customers through contractual commitments regarding storage of customer data in the United States and limiting potential access to systems processing customer data to screened US persons. Most US government agencies and their partners are best aligned with Azure Government.

Publishing your solution in Azure Government Marketplace is as simple as publishing to Azure Marketplace and checking an extra box. There are no extra compliance requirements to publish your solution to Azure Government Marketplace. This process makes it easier for Azure Government customers to discover your solution and be up and running quickly.

## Compliance considerations

There are no initial Microsoft compliance requirements to publish solutions to Azure Government Marketplace.

Once a solution has been published, customers can deploy it into their own subscriptions as part of a broader operational environment or business solution. Customers might then opt to certify the overall environment. As part of that certification process, they might reach out to the publisher with extra requirements, which the publisher can then evaluate and triage with the customer.

## Supported offers

Currently, Azure Government Marketplace supports only the following offer types:

- Virtual Machines > Bring your own license
- Virtual Machines > Pay-as-you-go
- Azure Application > Solution template / Managed app
- Azure containers > Bring your own license
- IoT Edge modules > Bring your own license

## Publishing

> [!NOTE]
> These steps assume you have already published a solution in Azure Marketplace. If you haven't, check out the [Azure Marketplace Publisher Guide](../marketplace/overview.md) before proceeding.

1. **Sign in to the [Partner Center Portal](https://partner.microsoft.com/)**.
1. Navigate to the **Commercial Marketplace** program.
1. **Open the offer** you want to publish to Azure Government Marketplace.
1. Go to the **Plan overview** page using the left menu.  
1. **Click on the plan you want to update** to be available in Azure Government. 
1. In the **Plan setup** page, under **Azure regions**, check the **Azure Government** box. Remember that this option [isn't available for all offers](#supported-offers).
1. ***Optionally***, click the **+ Add Certification** link to add links to any certifications that are relevant for your product and that you want to make available to customers.
1. ***Optionally***, add your Azure Government subscription to preview your marketplace offering before it is broadly available. 
    1. Click on **Preview audience** entry in the offer-level left menu.
    1. Add your [Azure Government subscription ID](#testing).
1. **Publish** your solution once again.

## Testing
If you want to test your solution or confirm that your solution has been published, you need to request an Azure Government account that is used to log in to the [Azure Government portal](https://portal.azure.us). This account is separate from any account in Azure. 

To obtain an account:

1. Request an [Azure Government trial account](https://azure.microsoft.com/global-infrastructure/government/request/?ReqType=Trial).
    - Indicate that your organization is a *Solution Provider Serving US federal, state, local or tribal government entities*.
1. Wait 3 - 5 business days for your account to be provisioned.
1. Log in to the [Azure Government portal](https://portal.azure.us) with your newly created account.
1. Eventually you can convert your trial account to a [paid account](https://azure.microsoft.com/global-infrastructure/government/how-to-buy/)

## Troubleshooting

Generally, virtual machines and solution templates work across both Azure and Azure Government; however, there are a few exceptions. The following section outlines the most common reasons why a virtual machine or solution template would work in Azure Marketplace but not in Azure Government Marketplace.

### Not available after publish

If you've completed all the steps outlined above and your virtual machine (VM) is still not available in Azure Government Marketplace, make sure that your VM's *Hide this SKU* setting is not set to *Yes*. If it is set to yes, there's probably a solution template that you also need to publish to Azure Government Marketplace. If there is no solution template and you want to make the standalone VM available, flip that switch to *No* and republish.

### Hardcoded endpoints

Verify endpoints are not hardcoded into your solution template for Azure as they will not be valid for any other Azure cloud, including Azure Government. Instead modify the solution template to obtain the endpoint from the resource, for example:

- Incorrect VHD URI (hardcoded)

    ```json
    "uri": "[concat('https://', variables('storageAccountName'), '.blob.core.windows.net/',  '/osdisk.vhd')]",
    ```

- Correct VHD URI (referenced)

    ```json
    "uri": "[concat(reference(resourceId('Microsoft.Storage/storageAccounts/', variables('storageAccountName'))).primaryEndpoints.blob, 'osdisk.vhd')]",
    ```

### Hardcoded list of locations

Make sure your solution template supports the Azure Government locations. 

### Unavailable resources

Verify that resources, API versions, VM images, and extensions used in your solution template are available in Azure Government. 

#### Images

Make sure that the image your solution template relies on is available in Azure Government. If you rely on a VM that you own, you need to also publish it to Azure Government Marketplace. Check out the [Azure Government Marketplace images](./documentation-government-image-gallery.md) documentation to obtain the list of available images.

#### Resource providers and API versions

You can obtain the full list of resource providers and their API versions by logging in to the [Azure Government portal](https://portal.azure.us) using your Azure Government account and following the steps listed in the [Resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md#azure-portal) documentation.

#### Extensions

Make sure that any virtual machine extensions your solution template relies on are available in Azure Government. Check out the [Azure Government virtual machine extensions](./documentation-government-extension.md) documentation to obtain the list of extensions available.
 
## Next steps

- Subscribe to the [Azure Government blog](https://blogs.msdn.microsoft.com/azuregov/)
- Get help on Stack Overflow by using the [azure-gov](https://stackoverflow.com/questions/tagged/azure-gov) tag
