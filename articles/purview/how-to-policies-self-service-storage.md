---
title: Self-service policies for Azure Storage (preview)
description: Step-by-step guide on how self-service policy is created for storage through Microsoft Purview access policies.
author: bjspeaks
ms.author: blessonj
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: how-to
ms.date: 10/24/2022
ms.custom: references_regions, event-tier1-build-2022
---

# Self-service access provisioning for Azure Storage datasets (Preview)

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

[Access policies](concept-policies-data-owner.md) allow you to manage access from Microsoft Purview to data sources that have been registered for *Data Use Management*.

This how-to guide describes how self-service policies get created in Microsoft Purview to enable access to Azure storage datasets. Currently, these two Azure Storage sources are supported:

- Blob storage
- Azure Data Lake Storage (ADLS) Gen2

## Prerequisites
[!INCLUDE [Access policies generic pre-requisites](./includes/access-policies-prerequisites-generic.md)]

[!INCLUDE [Azure Storage specific pre-requisites](./includes/access-policies-prerequisites-storage.md)]

## Configuration
[!INCLUDE [Access policies generic configuration](./includes/access-policies-configuration-generic.md)]

### Register the data sources in Microsoft Purview for Data Use Management
The Azure Storage resources need to be registered first with Microsoft Purview to later define access policies.

To register your resources, follow the **Prerequisites** and **Register** sections of these guides:

-   [Register and scan Azure Storage Blob - Microsoft Purview](register-scan-azure-blob-storage-source.md#prerequisites)

-   [Register and scan Azure Data Lake Storage (ADLS) Gen2 - Microsoft Purview](register-scan-adls-gen2.md#prerequisites)

After you've registered your resources, you'll need to enable data use management. Data use management needs certain permissions and can affect the security of your data, as it delegates to certain Microsoft Purview roles to manage access to the data sources. **Go through the secure practices related to Data Use Management in this guide**: [How to enable data use management](./how-to-enable-data-use-management.md) 

Once your data source has the  **Data Use Management** toggle **Enabled**, it will look like this picture:

:::image type="content" source="./media/how-to-policies-self-service-storage/register-data-source-for-policy-storage.png" alt-text="Screenshot that shows how to register a data source for policy by toggling the enable tab in the resource editor.":::

## Create a self-service data access request

[!INCLUDE [request access to datasets](includes/how-to-self-service-request-access.md)]

>[!Important]
> - Publish is a background operation. Azure Storage accounts can take up to **2 hours** to reflect the changes.

## View a self-service policy

To view the policies you've created, follow the article to [view the self-service policies](how-to-view-self-service-data-access-policy.md).

## Data consumption

- Data consumer can access the requested dataset using tools such as Power BI or Azure Synapse Analytics workspace.

>[!NOTE]
> Users will not be able to browse to the asset using the Azure Portal or Storage explorer if the only permission granted is read/modify access at the file or folder level of the storage account.

> [!CAUTION]
> Folder level permission is required to access data in ADLS Gen 2 using PowerBI.
> Additionally, resource sets are not supported by self-service policies. Hence, folder level permission needs to be granted to access resource set files such as CSV or parquet. 


### Known issues

**Known issues** related to Policy creation
- self-service policies aren't supported for Microsoft Purview resource sets. Even if displayed in Microsoft Purview, it isn't yet enforced. Learn more about [resource sets](concept-resource-sets.md).


## Next steps
Check blog, demo and related tutorials:

* [self-service policies concept](./concept-self-service-data-access-policy.md)
* [Demo of self-service policies for storage](https://www.youtube.com/watch?v=AYKZ6_imorE)
* [Blog: Accessing data when folder level permission is granted](https://techcommunity.microsoft.com/t5/azure-purview-blog/data-policy-features-accessing-data-when-folder-level-permission/ba-p/3109583)
* [Blog: Accessing data when file level permission is granted](https://techcommunity.microsoft.com/t5/azure-purview-blog/data-policy-features-accessing-data-when-file-level-permission/ba-p/3102166)
