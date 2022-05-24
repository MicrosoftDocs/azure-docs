---
title: Resource group and subscription access provisioning by data owner
description: Step-by-step guide showing how a data owner can create access policies to resource groups or subscriptions.
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: how-to
ms.date: 4/15/2022
ms.custom:
---

# Resource group and subscription access provisioning by data owner (preview)
[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

[Policies](concept-data-owner-policies.md) allow you to enable access to data sources that have been registered for *Data Use Management* in Microsoft Purview.

You can also [register an entire resource group or subscription](register-scan-azure-multiple-sources.md), and create a single policy that will manage access to **all** data sources in that resource group or subscription. That single policy will cover all existing data sources and any data sources that are created afterwards.
This article describes how this is done. 

> [!IMPORTANT] 
> Currently, these are the available data sources for access policies in Public Preview:
> - Blob storage
> - Azure Data Lake Storage (ADLS) Gen2

## Prerequisites
[!INCLUDE [Access policies generic pre-requisites](./includes/access-policies-prerequisites-generic.md)]

[!INCLUDE [Azure Storage specific pre-requisites](./includes/access-policies-prerequisites-storage.md)]

## Configuration
[!INCLUDE [Access policies generic configuration](./includes/access-policies-configuration-generic.md)]

### Register the subscription or resource group for Data Use Management
The subscription or resource group needs to be registered with Microsoft Purview to later define access policies.

To register your resource, follow the **Prerequisites** and **Register** sections of this guide:

- [Register multiple sources in Microsoft Purview](register-scan-azure-multiple-sources.md#prerequisites)

After you've registered your resources, you'll need to enable Data Use Management. Data Use Management affects the security of your data, as it delegates to certain users to manage access to data resources from within Microsoft Purview.

To ensure you securely enable Data Use Management, and follow best practices, follow this guide to enable Data Use Management for your resource group or subscription:

- [How to enable Data Use Management](./how-to-enable-data-use-management.md) 

In the end, your resource will have the  **Data Use Management** toggle to **Enabled**, as shown in the picture:

:::image type="content" source="./media/how-to-data-owner-policies-resource-group/register-resource-group-for-policy.png" alt-text="Screenshot that shows how to register a resource group or subscription for policy by toggling the enable tab in the resource editor.":::

## Create and publish a data owner policy
Execute the steps in the [data-owner policy authoring tutorial](how-to-data-owner-policy-authoring-generic.md) to create and publish a policy similar to the example shown in the image: a policy that provides security group *sg-Finance* *modify* access to resource group *finance-rg*:

:::image type="content" source="./media/how-to-data-owner-policies-resource-group/data-owner-policy-example-resource-group.png" alt-text="Screenshot that shows a sample data owner policy giving access to a resource group.":::

>[!Important]
> - Publish is a background operation. It can take up to **2 hours** for the changes to be reflected in Storage account(s).

## Additional information
- Creating a policy at subscription or resource group level will enable the Subjects to access Azure Storage system containers,  for example, *$logs*. If this is undesired, first scan the data source and then create finer-grained policies for each (that is, at container or subcontainer level).

### Limits
The limit for Microsoft Purview policies that can be enforced by Storage accounts is 100 MB per subscription, which roughly equates to 5000 policies.

## Next steps
Check blog, demo and related tutorials:

* [Concepts for Microsoft Purview data owner policies](./concept-data-owner-policies.md)
* [Data owner policies on an Azure Storage account](./how-to-data-owner-policies-storage.md)
* [Blog: resource group-level governance can significantly reduce effort](https://techcommunity.microsoft.com/t5/azure-purview-blog/data-policy-features-resource-group-level-governance-can/ba-p/3096314)
* [Video: Demo of data owner access policies for Azure Storage](https://www.youtube.com/watch?v=CFE8ltT19Ss)
