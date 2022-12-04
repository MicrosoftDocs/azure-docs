---
title: Resource group and subscription access provisioning by data owner (preview)
description: Step-by-step guide showing how a data owner can create access policies to resource groups or subscriptions.
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: how-to
ms.date: 11/14/2022
ms.custom: event-tier1-build-2022
---

# Resource group and subscription access provisioning by data owner (Preview)
[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

[Data owner policies](concept-policies-data-owner.md) are a type of Microsoft Purview access policies. They allow you to manage access to user data in sources that have been registered for *Data Use Management* in Microsoft Purview. These policies can be authored directly in the Microsoft Purview governance portal, and after publishing, they get enforced by the data source.

In this guide we cover how to register an entire resource group or subscription and then create a single policy that will manage access to **all** data sources in that resource group or subscription. That single policy will cover all existing data sources and any data sources that are created afterwards.

## Prerequisites
[!INCLUDE [Access policies generic pre-requisites](./includes/access-policies-prerequisites-generic.md)]

**Only these data sources are enabled for access policies on resource group or subscription**. Follow the **Prerequisites** section that is specific to the data source(s) in these guides:
* [Data owner policies on an Azure Storage account](./how-to-policies-data-owner-storage.md#prerequisites)
* [Data owner policies on an Azure SQL Database](./how-to-policies-data-owner-azure-sql-db.md#prerequisites)(*)
* [Data owner policies on an Azure Arc-enabled SQL Server](./how-to-policies-data-owner-arc-sql-server.md#prerequisites)(*)

(*) The *Modify* action is not currently supported for SQL-type data sources.

## Microsoft Purview configuration
[!INCLUDE [Access policies generic configuration](./includes/access-policies-configuration-generic.md)]

### Register the subscription or resource group for Data Use Management
The subscription or resource group needs to be registered with Microsoft Purview before you can create access policies. To register your subscription or resource group, follow the **Prerequisites** and **Register** sections of this guide:

- [Register multiple sources in Microsoft Purview](register-scan-azure-multiple-sources.md#prerequisites)

After you've registered your resources, you'll need to enable Data Use Management. Data Use Management needs certain permissions and can affect the security of your data, as it delegates to certain Microsoft Purview roles to manage access to the data sources. **Go through the secure practices related to Data Use Management in this guide**: [How to enable Data Use Management](./how-to-enable-data-use-management.md) 

In the end, your resource will have the  **Data Use Management** toggle **Enabled**, as shown in the screenshot:

![Screenshot shows how to register a resource group or subscription for policy by toggling the enable tab in the resource editor.](./media/how-to-policies-data-owner-resource-group/register-resource-group-for-policy.png)

>[!Important]
> - If you create a policy on a resource group or subscription and want to have it enforced in Azure Arc-enabled SQL Servers, you will need to also register those servers independently and enable *Data use management* which captures their App ID: [See this document](./how-to-policies-devops-arc-sql-server.md#register-data-sources-in-microsoft-purview).


## Create and publish a data owner policy
Execute the steps in the **Create a new policy** and **Publish a policy** sections of the [data-owner policy authoring tutorial](./how-to-policies-data-owner-authoring-generic.md#create-a-new-policy). The result will be a data owner policy similar to the example shown in the image: a policy that provides security group *sg-Finance* *modify* access to resource group *finance-rg*. Use the Data source box in the Policy user experience.

![Screenshot shows a sample data owner policy giving access to a resource group.](./media/how-to-policies-data-owner-resource-group/data-owner-policy-example-resource-group.png)

>[!Important]
> - Publish is a background operation. For example, Azure Storage accounts can take up to **2 hours** to reflect the changes.
> - Changing a policy does not require a new publish operation. The changes will be picked up with the next pull.

## Unpublish a data owner policy
Follow this link for the steps to [unpublish a data owner policy in Microsoft Purview](how-to-policies-data-owner-authoring-generic.md#unpublish-a-policy).

## Update or delete a data owner policy
Follow this link for the steps to [update or delete a data owner policy in Microsoft Purview](how-to-policies-data-owner-authoring-generic.md#update-or-delete-a-policy).

## Additional information
- Creating a policy at subscription or resource group level will enable the Subjects to access Azure Storage system containers,  for example, *$logs*. If this is undesired, first scan the data source and then create finer-grained policies for each (that is, at container or sub-container level).

### Limits
The limit for Microsoft Purview policies that can be enforced by Storage accounts is 100 MB per subscription, which roughly equates to 5000 policies.

## Next steps
Check blog, demo and related tutorials:

* [Concepts for Microsoft Purview data owner policies](./concept-policies-data-owner.md)
* [Blog: resource group-level governance can significantly reduce effort](https://techcommunity.microsoft.com/t5/azure-purview-blog/data-policy-features-resource-group-level-governance-can/ba-p/3096314)
* [Video: Demo of data owner access policies for Azure Storage](https://learn-video.azurefd.net/vod/player?id=caa25ad3-7927-4dcc-88dd-6b74bcae98a2)
