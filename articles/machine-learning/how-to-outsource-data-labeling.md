---
title: Work with Microsoft partnered data labeling companies
titleSuffix: Azure Machine Learning
description: Use a Microsoft partnered labeling company to help label the data in your data labeling project
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.reviewer: sgilley
author: vkann
ms.author: sdgilley
ms.date: 07/21/2021
ms.topic: how-to
# As a project manager, I want to hire a company to label the data in my data labeling project
# Keywords: data labeling companies, volume 170.  No other keywords found. 
---

# Work with a Microsoft partnered data labeling companies (preview)

Learn how to engage a data labeling company to help you label your data. Azure Machine Learning data labeling projects support both in-house and outsourced (vendor) labeling workforces.  

* In-house workforces: Human (labor) resources who are part of the company who annotates the labeling assets. This workforce includes any vendor company resources hired by your company directly.

* Outsourced workforce: Externally managed labeling vendor resources from Microsoft curated vendor companies.

> [!IMPORTANT]
> Features described in this article are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Engage an outsourced workforce

Before you create your data labeling project:

1. Review the [listing details of the curated outsourcing companies](#review).
1. If the outsourcing company meets your requirements, choose the **Contact Me** option in Azure Marketplace. Azure Marketplace will route your inquiry to the outsourcing company. You can reach to multiple outsourcing companies before choosing the final company.
1. Sign a contract (statement of work) with the external outsourcing  company.

After the contract has been agreed and signed between you and the Outsourcing labeling company:

1. Create the labeling project in [Azure Machine Learning studio](https://ml.azure.com). For more details on creating a project, see [Create a data labeling project and export labels](how-to-create-labeling-projects.md).
2. Choose the **Outsource** option in the workforce step.
3.Choose the appropriate outsourcing (vendor) company in the project creation step.

    > [!NOTE]
    > The outsourcing (vendor) company name cannot be changed after creating the labeling project.

1. Enable access (`labeler` role, `techlead` role)  to the outsourcing labeling company using Azure Role Based Access (RBAC). This access will allow the outsourcing company resources to annotate your labeling assets.


## <a name="review"></a> Review outsourced workforces

Before you create your data-labeling project, review our list of outsourced vendors and select the one you wish to engage.

Microsoft has partnered with some data labeling companies (curated) who have extensive knowledge and experience in annotating images and text documents. These companies will use Azure Machine Learning data labeling services in labeling the assets.  

> [!NOTE]
> The services of these companies are made available via [Azure Marketplace](https://azure.microsoft.com/). The details of these labeling companies are in their listing page in Azure Marketplace. Use this information to determine if the outsourcing company meets your project requirements. Once you've identified the outsourcing company, contact them using the **Contact me** option in Azure Marketplace. The contacted outsourcing company will contact you within three days. Azure Machine Learning data labeling services and Azure Marketplace act only as a routing platform in connecting you with the outsourcing company.

Microsoft periodically reviews the partnership with these outsourcing companies. Microsoft may add or remove curated outsourcing companies at any time without any prior notification sent to the labeling project owners. 

You can engage multiple outsourcing companies for various labeling project needs. Each project will be linked to one outsourcing company. 

Below are the curated outsourcing (vendor) labeling companies who might help in getting your data labeled using AzureML Data Labeling services. View the [listing of curated vendor companies]().

* [iSoftStone]() 

* [Quadrant Resource]()

* [KarmaHub]()

## Engage a vendor

You'll have a separate contract (statement of work) established with an outsourced labeling company. The contract will include details of the agreement, scope, cost, schedule, quality, payment terms, security and policy requirements, and so on.

You'll be charged directly by the outsourcing (vendor) company for the labor provided for manual labeling. If you enable ML Assisted labeling in an outsourced labeling project, Microsoft will charge you separately for the compute consumed. Microsoft will charge you for the storage based on the amount of data stored in Azure.

## Enable access

In order for the outsourcing company to have access into your projects, you'll enable access to them via Azure Role Based Access (RBAC) at the workspace level. The outsourcing company will have access to all the projects within the workspace. If you are planning to use multiple outsourcing companies for different labeling projects, we recommend you create separate workspaces for each company. 

> [!NOTE]
> You'll work directly with the outsourcing company (vendor) if there are any issues with your labeling project. Microsoft will not be responsible for the scope, cost, quality, schedule, payment terms, security, and policy requirements for the outsourced labeling company.  

## Next steps

[Create a data labeling project and export labels](how-to-create-labeling-projects.md)