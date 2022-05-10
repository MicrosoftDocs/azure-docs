---
title: Resource group and subscription access provisioning by data owner
description: Step-by-step guide showing how a data owner can create access policies to resource groups or subscriptions.
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: how-to
ms.date: 05/09/2022
ms.custom:
---

# Resource group and subscription access provisioning by data owner (preview)
[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

[Access policies](concept-data-owner-policies.md) allow you to manage access from Microsoft Purview to data sources that have been registered for *Data Use Management*.

You can also [register an entire resource group or subscription](register-scan-azure-multiple-sources.md), and create a single policy that will manage access to **all** data sources in that resource group or subscription. That single policy will cover all existing data sources and any data sources that are created afterwards. This article describes how this is done. 

Currently, these data sources support access policies on resource group or subscription:
- Blob storage
- Azure Data Lake Storage (ADLS) Gen2
- Azure SQL Database*
- SQL Server on Azure Arc-enabled servers*

(*) Only the *SQL Performance monitor* and *Security auditor* roles are supported for these data sources. *Data reader* role is not yet supported.

## Prerequisites
[!INCLUDE [Access policies generic pre-requisites](./includes/access-policies-prerequisites-generic.md)]

Then follow the **Prerequisites** section that is specific to the data source(s) in these guides:
* [Data owner policies on an Azure Storage account](./how-to-data-owner-policies-storage.md#prerequisites)
* [Data owner policies on an Azure SQL DB](./how-to-data-owner-policies-azure-sql-db.md#prerequisites)
* [Data owner policies on an Arc-enabled SQL Server](./how-to-data-owner-policies-arc-sql-server.md#prerequisites)


## Configuration
[!INCLUDE [Access policies generic configuration](./includes/access-policies-configuration-generic.md)]

### Register the subscription or resource group for Data Use Management
The subscription or resource group needs to be registered with Microsoft Purview to later define access policies.

To register your subscription or resource group, follow the **Prerequisites** and **Register** sections of this guide:

- [Register multiple sources in Microsoft Purview](register-scan-azure-multiple-sources.md#prerequisites)

After you've registered your resources, you'll need to enable Data Use Management. Data Use Management affects the security of your data, as it delegates to certain users to manage access to data resources from within Microsoft Purview.

To ensure you securely enable Data Use Management, and follow best practices, follow this guide to enable Data Use Management for your resource group or subscription:

- [How to enable Data Use Management](./how-to-enable-data-use-management.md) 

In the end, your resource will have the  **Data Use Management** toggle **Enabled**, as shown in the picture:

:::image type="content" source="./media/how-to-data-owner-policies-resource-group/register-resource-group-for-policy.png" alt-text="Screenshot that shows how to register a resource group or subscription for policy by toggling the enable tab in the resource editor.":::

## Create and publish a data owner policy
Execute the steps in the [data-owner policy authoring tutorial](how-to-data-owner-policy-authoring-generic.md) to create and publish a policy similar to the example shown in the image: a policy that provides security group *sg-Finance* *modify* access to resource group *finance-rg*:

:::image type="content" source="./media/how-to-data-owner-policies-resource-group/data-owner-policy-example-resource-group.png" alt-text="Screenshot that shows a sample data owner policy giving access to a resource group.":::

>[!Important]
> - Publish is a background operation. Azure Storage accounts can take up to **2 hours** to reflect the changes.

>[!Warning]
> **Known Issues**
> - No implicit connect permission is provided to SQL type data sources (e.g.: Azure SQL DB, SQL server on Azure Arc-enabled servers) when creating a read policy on a resource group or subscription. To support this scenario, provide the connect permission to the AAD principals locally, i.e. directly in the SQL-type data sources.


## Additional information
- Creating a policy at subscription or resource group level will enable the Subjects to access Azure Storage system containers,  for example, *$logs*. If this is undesired, first scan the data source and then create finer-grained policies for each (that is, at container or sub-container level).

### Limits
The limit for Microsoft Purview policies that can be enforced by Storage accounts is 100 MB per subscription, which roughly equates to 5000 policies.

## Next steps
Check blog, demo and related tutorials:

* [Concepts for Microsoft Purview data owner policies](./concept-data-owner-policies.md)
* [Blog: resource group-level governance can significantly reduce effort](https://techcommunity.microsoft.com/t5/azure-purview-blog/data-policy-features-resource-group-level-governance-can/ba-p/3096314)
* [Video: Demo of data owner access policies for Azure Storage](/video/media/8ce7c554-0d48-430f-8f63-edf94946947c/purview-policy-storage-dataowner-scenario_mid.mp4)
