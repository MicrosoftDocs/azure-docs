---
title: Data labeling vendor companies 
titleSuffix: Azure Machine Learning
description: Use a data labeling vendor company to help label the data in your data labeling project
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.reviewer: sgilley
author: kvijaykannan
ms.author: vkann
ms.date: 10/21/2021
ms.topic: how-to
# As a project manager, I want to hire a company to label the data in my data labeling project
# Keywords: data labeling companies, volume 170.  No other keywords found. 
---

# Work with a data labeling vendor company

Learn how to engage a data labeling vendor company to help you label your data. You can learn more about these companies and the labeling services they provide in their listing pages in [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/consulting-services?page=1&search=AzureMLVend).


## Workflow summary

Before you create your data labeling project:

1. Select a labeling service provider.  To find a provider on Azure Marketplace:
    1. Review the [listing details of these vendor labeling companies](https://azuremarketplace.microsoft.com/marketplace/consulting-services?page=1&search=AzureMLVend).
    1. If the vendor labeling company meets your requirements, choose the **Contact Me** option in Azure Marketplace. Azure Marketplace will route your inquiry to the vendor labeling company. You may contact multiple vendor labeling companies before choosing the final company.

1. Contact and enter into a contract with the labeling service provider.

Once the contract with the vendor labeling company is in place:

1. Create the labeling project in [Azure Machine Learning studio](https://ml.azure.com). For more details on creating a project, see how to create an [image labeling project](how-to-create-image-labeling-projects.md) or [text labeling project](how-to-create-text-labeling-projects.md).
1. You're not limited to using a data labeling provider from Azure Marketplace.  But if you do use a provider from Azure Marketplace:
    1. Select **Use a vendor labeling company from Azure Marketplace** in the workforce step.
    1. Select the appropriate data labeling company in the dropdown.

    > [!NOTE]
    > The vendor labeling company name cannot be changed after you create the labeling project.

1. For any provider, whether found through Azure Marketplace or elsewhere, enable access (`labeler` role, `techlead` role) to the vendor labeling company using Azure Role Based Access (RBAC). These roles will allow the company to access resources to annotate your data.

## <a name="review"></a> Select a company

Microsoft has identified some labeling service providers with knowledge and experience who may be able to meet your needs. You can learn about the labeling service providers and choose a provider, taking into account the needs and requirements of your project(s) in their listing pages in [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/consulting-services?page=1&search=AzureMLVend).

> [!IMPORTANT]
> You can learn more about these companies and the labeling services they provide in their listing pages in Azure Marketplace. You are responsible for any decision to use a labeling company that offers services through Azure Marketplace, and you should independently assess whether a labeling company and its experience, services, staffing, terms, etc. will meet your project requirements. You may contact a labeling company that offers services through Azure Marketplace using the **Contact me** option in Azure Marketplace, and you can expect to hear from a contacted company within three business days. You will contract with and make payment to the labeling company directly.

Microsoft periodically reviews the list of potential labeling service providers in Azure Marketplace and may add or remove providers from the list at any time.  

* If a provider is removed, it won't affect any existing projects, or that company's access to those projects.
* If you use a provider who is no longer listed in Azure Marketplace, don't select the **Use a vendor labeling company from Azure Marketplace** option in your new project.
* A removed provider will no longer have a listing in Azure Marketplace.
* A removed provider will no longer be able to be contacted through Azure Marketplace.

You can engage multiple vendor labeling companies for various labeling project needs. Each project will be linked to one vendor labeling company.

Below are vendor labeling companies who might help in getting your data labeled using Azure Machine Learning data labeling services. View the [listing of vendor companies](https://azuremarketplace.microsoft.com/marketplace/consulting-services?page=1&search=AzureMLVend).

* [iSoftStone](https://azuremarketplace.microsoft.com/marketplace/consulting-services/isoftstoneinc1614950352893.20210527) 

* [Quadrant Resource](https://azuremarketplace.microsoft.com/marketplace/consulting-services/quadrantresourcellc1587325810226.quadrant_resource_data_labeling)

## Enter into a contract 

After you have selected the labeling company you want to work with, you need to enter into a contract directly with the labeling company setting forth the terms of your engagement. Microsoft is not a party to this agreement and plays no role in determining or negotiating its terms. Amounts payable under this agreement will be paid directly to the labeling company.

If you enable ML Assisted labeling in a labeling project, Microsoft will charge you separately for the compute resources consumed in connection with this service. All other charges associated with your use of Azure Machine Learning (such as storage of data used in your Azure Machine Learning workspace) are governed by the terms of your agreement with Microsoft.

## Enable access

In order for the vendor labeling company to have access into your projects, you'll next [add them as labelers to your project](how-to-add-users.md).  If you are planning to use multiple vendor labeling companies for different labeling projects, we recommend you create separate workspaces for each company.

> [!IMPORTANT]
> You, and not Microsoft, are responsible for all aspects of your engagement with a labeling company, including but not limited to issues relating to scope, quality, schedule, and pricing.

## Next steps

* [Create an image labeling project and export labels](how-to-create-image-labeling-projects.md)
* [Create a text labeling project and export labels (preview)](how-to-create-text-labeling-projects.md)
* [Add users to your data labeling project](how-to-add-users.md)