---
title: Access provisioning by data owner to Azure Storage datasets
description: Step-by-step guide showing how data owners can create access policies to datasets in Azure Storage
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: how-to
ms.date: 04/08/2022
ms.custom:
---

# Access provisioning by data owner to Azure Storage datasets (preview)

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

[Policies](concept-data-owner-policies.md) in Azure Purview allow you to enable access to data sources that have been registered to a collection. 

This article describes how a data owner can use Azure Purview to enable access to datasets in Azure Storage. Currently, these Azure Storage sources are supported:
- Blob storage
- Azure Data Lake Storage (ADLS) Gen2

## Prerequisites
[!INCLUDE [Access policies generic pre-requisites](./includes/access-policies-prerequisites-generic.md)]

[!INCLUDE [Azure Storage specific pre-requisites](./includes/access-policies-prerequisites-storage.md)]

## Configuration
[!INCLUDE [Access policies generic configuration](./includes/access-policies-configuration-generic.md)]

### Register the data sources in Azure Purview for Data use governance
The Azure Storage resources need to be registered with Azure Purview to later define access policies.

To register your resources, follow the **Prerequisites** and **Register** sections of these guides:

-   [Register and scan Azure Storage Blob - Azure Purview](register-scan-azure-blob-storage-source.md#prerequisites)

-   [Register and scan Azure Data Lake Storage (ADLS) Gen2 - Azure Purview](register-scan-adls-gen2.md#prerequisites)

After you've registered your resources, you'll need to enable data use governance. Data use governance affects the security of your data, as it allows your users to manage access to resources from within Azure Purview.

To ensure you securely enable data use governance, and follow best practices, follow this guide to enable data use governance for your resource group or subscription:

- [How to enable data use governance](./how-to-enable-data-use-governance.md) 

In the end, your resource will have the  **Data use governance** toggle to **Enabled**, as shown in the picture:

:::image type="content" source="./media/how-to-data-owner-policies-storage/register-data-source-for-policy-storage.png" alt-text="Screenshot that shows how to register a data source for policy by toggling the enable tab in the resource editor.":::

## Create and publish a data owner policy
Execute the steps in the [data-owner policy authoring tutorial](how-to-data-owner-policy-authoring-generic.md) to create and publish a policy similar to the example shown in the image: a policy that provides group *Contoso Team* *read* access to Storage account *marketinglake1*:

:::image type="content" source="./media/how-to-data-owner-policies-storage/data-owner-policy-example-storage.png" alt-text="Screenshot that shows a sample data owner policy giving access to an Azure Storage account.":::


>[!Important]
> - Publish is a background operation. It can take up to **2 hours** for the changes to be reflected in Storage account(s).


## Additional information
- Policy statements set below container level on a Storage account are supported. If no access has been provided at Storage account level or container level, then the App that requests the data must execute a direct access by providing a fully qualified name to the data object. If the App attempts to crawl down the hierarchy starting from the Storage account or Container, and there's no access at that level, the request will fail. The following documents show examples of how to do perform a direct access. See also blogs in the *Next steps* section of this tutorial.
  - [*abfs* for ADLS Gen2](../hdinsight/hdinsight-hadoop-use-data-lake-storage-gen2.md#access-files-from-the-cluster)
  - [*az storage blob download* for Blob Storage](../storage/blobs/storage-quickstart-blobs-cli.md#download-a-blob)
- Creating a policy at Storage account level will enable the Subjects to access system containers, for example *$logs*.  If this is undesired, first scan the data source(s) and then create finer-grained policies for each (that is, at container or subcontainer level).


### Limits
- The limit for Azure Purview policies that can be enforced by Storage accounts is 100 MB per subscription, which roughly equates to 5000 policies.

### Known issues

> [!Warning]
> **Known issues** related to Policy creation
> - Do not create policy statements based on Azure Purview resource sets. Even if displayed in Azure Purview policy authoring UI, they are not yet enforced. Learn more about [resource sets](concept-resource-sets.md).

### Policy action mapping

This section contains a reference of how actions in Azure Purview data policies map to specific actions in Azure Storage.

| **Azure Purview policy action** | **Data source specific actions**                                                        |
|---------------------------|-----------------------------------------------------------------------------------------|
|||
| *Read*                    |<sub>Microsoft.Storage/storageAccounts/blobServices/containers/read                      |
|                           |<sub>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read                |
|||
| *Modify*                  |<sub>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read                |
|                           |<sub>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write               |
|                           |<sub>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action          |
|                           |<sub>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/move/action         |
|                           |<sub>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete              |
|                           |<sub>Microsoft.Storage/storageAccounts/blobServices/containers/read                      |
|                           |<sub>Microsoft.Storage/storageAccounts/blobServices/containers/write                     |
|                           |<sub>Microsoft.Storage/storageAccounts/blobServices/containers/delete                    |
|||


## Next steps
Check blog, demo and related tutorials:

* [Demo of access policy for Azure Storage](/video/media/8ce7c554-0d48-430f-8f63-edf94946947c/purview-policy-storage-dataowner-scenario_mid.mp4)
* [Concepts for Azure Purview data owner policies](./concept-data-owner-policies.md)
* [Enable Azure Purview data owner policies on all data sources in a subscription or a resource group](./how-to-data-owner-policies-resource-group.md)
* [Blog: What's New in Azure Purview at Microsoft Ignite 2021](https://techcommunity.microsoft.com/t5/azure-purview/what-s-new-in-azure-purview-at-microsoft-ignite-2021/ba-p/2915954)
* [Blog: Accessing data when folder level permission is granted](https://techcommunity.microsoft.com/t5/azure-purview-blog/data-policy-features-accessing-data-when-folder-level-permission/ba-p/3109583)
* [Blog: Accessing data when file level permission is granted](https://techcommunity.microsoft.com/t5/azure-purview-blog/data-policy-features-accessing-data-when-file-level-permission/ba-p/3102166)
