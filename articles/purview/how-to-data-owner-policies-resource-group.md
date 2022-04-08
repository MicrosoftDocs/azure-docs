---
title: Resource group and subscription access provisioning by data owner
description: Step-by-step guide showing how a data owner can create access policies to resource groups or subscriptions.
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: how-to
ms.date: 4/08/2022
ms.custom:
---

# Resource group and subscription access provisioning by data owner (preview)
[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

[Policies](concept-data-owner-policies.md) in Azure Purview allow you to enable access to data sources that have been registered to a collection. You can also [register an entire Azure resource group or subscription to a collection](register-scan-azure-multiple-sources.md), which will allow you to scan all available data sources in that resource group or subscription. If you create a single access policy against a registered resource group or subscription, a data owner can enable access to **all** available data sources in that resource group or subscription. That single policy will cover all existing data sources and any data sources that are created afterwards.

This article describes how a data owner can create a single access policy for **all available** data sources in a subscription or a resource group. 

> [!IMPORTANT] 
> Currently, these are the available data sources for access policies:
> - Blob storage
> - Azure Data Lake Storage (ADLS) Gen2

## Prerequisites
[!INCLUDE [Access policies generic pre-requisites](./includes/access-policies-prerequisites-generic.md)]

[!INCLUDE [Azure Storage specific pre-requisites](./includes/access-policies-prerequisites-storage.md)]

## Configuration
[!INCLUDE [Access policies generic configuration](./includes/access-policies-configuration-generic.md)]

### Register the subscription or resource group for data use governance
The subscription or resource group needs to be registered with Azure Purview to later define access policies.

To register your resource, follow the **Prerequisites** and **Register** sections of this guide:

- [Register multiple sources in Azure Purview](register-scan-azure-multiple-sources.md#prerequisites)

After you've registered your resources, you'll need to enable data use governance. Data use governance affects the security of your data, as it allows your users to manage access to resources from within Azure Purview.

To ensure you securely enable data use governance, and follow best practices, follow this guide to enable data use governance for your resource group or subscription:

- [How to enable data use governance](./how-to-enable-data-use-governance.md) 

In the end, your resource will have the  **Data use governance** toggle to **Enabled**, as shown in the picture:

:::image type="content" source="./media/how-to-data-owner-policies-resource-group/register-resource-group-for-policy.png" alt-text="Screenshot that shows how to register a resource group or subscription for policy by toggling the enable tab in the resource editor.":::

## Create and publish a data owner policy
Execute the steps in the [data-owner policy authoring tutorial](how-to-data-owner-policy-authoring-generic.md) to create and publish a policy similar to the example shown in the image: a policy that provides security group *sg-Finance* *modify* access to resource group *finance-rg*:

:::image type="content" source="./media/tutorial-data-owner-policies-resource-group/data-owner-policy-example-resource-group.png" alt-text="Screenshot that shows a sample data owner policy giving access to a resource group.":::

>[!Important]
> - Publish is a background operation. It can take up to **2 hours** for the changes to be reflected in Storage account(s).

## Additional information
- Creating a policy at subscription or resource group level will enable the Subjects to access Azure Storage system containers,  for example, *$logs*. If this is undesired, first scan the data source and then create finer-grained policies for each (that is, at container or subcontainer level).

### Limits
The limit for Azure Purview policies that can be enforced by Storage accounts is 100 MB per subscription, which roughly equates to 5000 policies.

## Next steps
Check blog, demo and related tutorials:

* [Concepts for Azure Purview data owner policies](./concept-data-owner-policies.md)
* [Data owner policies on an Azure Storage account](./how-to-data-owner-policies-storage.md)
* [Blog: resource group-level governance can significantly reduce effort](https://techcommunity.microsoft.com/t5/azure-purview-blog/data-policy-features-resource-group-level-governance-can/ba-p/3096314)
* [Demo of data owner access policies for Azure Storage](/video/media/8ce7c554-0d48-430f-8f63-edf94946947c/purview-policy-storage-dataowner-scenario_mid.mp4)
