---
title: Resource group and subscription access provisioning by data owner
description: Step-by-step guide showing how a data owner can create access policies to resource groups or subscriptions.
author: ePpnqeqR
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: tutorial
ms.date: 1/27/2022
ms.custom:
---

# Resource group and subscription access provisioning by data owner (preview)

This tutorial describes how a data owner can leverage Azure Purview to enable access to ALL data sources in a subscription or a resource group. This can be achieved through a single policy statement, and will cover all existing data sources, as well as data sources that are created afterwards. However, at this point, only the following data sources are supported:
- Blob storage
- Azure Data Lake Storage (ADLS) Gen2

> [!Note]
> These capabilities are currently in preview. This preview version is provided without a service level agreement, and should not be used for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure
Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites
[!INCLUDE [Access policies generic pre-requisites](./includes/access-policies-prerequisites-generic.md)]

[!INCLUDE [Azure Storage specific pre-requisites](./includes/access-policies-prerequisites-storage.md)]

## Configuration
[!INCLUDE [Access policies generic configuration](./includes/access-policies-configuration-generic.md)]

### Register the subscription or resource group in Azure Purview
The subscription or resource group needs to be registered with Azure Purview to later define access policies. You can follow this guide:

- [Register multiple sources - Azure Purview](register-scan-azure-multiple-sources.md)

Enable the resource group or the subscription for access policies in Azure Purview by setting the **Data use governance** toggle to enable, as shown in the picture.

![Image shows how to register a resource group or subscription for policy.](./media/tutorial-access-policies-resource-group/register-resource-group-for-policy.png)

[!INCLUDE [Access policies generic registration](./includes/access-policies-registration-generic.md)]

## Policy authoring
Goal of this section: execute the steps in the generic [data owner policy authoring tutorial](tutorial-data-owner-policy-authoring-generic.md) to create and publish a data owner policy similar to the example shown in the image: a policy on resource group *finance-rg*:

![Image shows how to register a resource group or subscription for policy.](./media/tutorial-access-policies-resource-group/data-owner-policy-example-resource-group.png)

## Additional information

### Limits
The limit for Azure Purview policies that can be enforced by Storage accounts is 100MB per subscription, which roughly equates to 5000 policies.

>[!Important]
> - Publish is a background operation. It can take up to **2 hours** for the changes to be reflected in the data source.

## Next steps
Check blog, demo and related tutorials

* [What's New in Azure Purview at Microsoft Ignite 2021](https://techcommunity.microsoft.com/t5/azure-purview/what-s-new-in-azure-purview-at-microsoft-ignite-2021/ba-p/2915954)
* [Demo of data owner access policies for Azure Storage](https://www.youtube.com/watch?v=CFE8ltT19Ss)
* [Enable Azure Purview data owner policies on an Azure Storage account](./tutorial-data-owner-policies-storage.md)
