---
title: Access provisioning by data owner to Azure Storage datasets
description: Step-by-step guide showing how data owners can create access policies to datasets in Azure Storage
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: tutorial
ms.date: 03/14/2022
ms.custom:
---

# Tutorial: Access provisioning by data owner to Azure Storage datasets (preview)

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

This tutorial describes how a data owner can leverage Azure Purview to enable access to datasets in Azure Storage. At this point, only the following data sources are supported:
- Blob storage
- Azure Data Lake Storage (ADLS) Gen2

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Prerequisites
> * Configure permissions
> * Register a data asset for Data use governance
> * Create and publish a policy

## Prerequisites
[!INCLUDE [Access policies generic pre-requisites](./includes/access-policies-prerequisites-generic.md)]

[!INCLUDE [Azure Storage specific pre-requisites](./includes/access-policies-prerequisites-storage.md)]

## Configuration
[!INCLUDE [Access policies generic configuration](./includes/access-policies-configuration-generic.md)]

### Register the data sources in Azure Purview for Data use governance
Register and scan each Storage account with Azure Purview to later define access policies. You can follow these guides:

-   [Register and scan Azure Storage Blob - Azure Purview](register-scan-azure-blob-storage-source.md)

-   [Register and scan Azure Data Lake Storage (ADLS) Gen2 - Azure Purview](register-scan-adls-gen2.md)

Follow this link to [Enable the data source for access policies](./how-to-enable-data-use-governance.md) in Azure Purview by setting the **Data use governance** toggle to **Enabled**, as shown in the picture.

![Image shows how to register a data source for policy.](./media/tutorial-data-owner-policies-storage/register-data-source-for-policy-storage.png)

## Create and publish a data owner policy
Execute the steps in the [data-owner policy authoring tutorial](how-to-data-owner-policy-authoring-generic.md) to create and publish a policy similar to the example shown in the image: a policy that provides group *Contoso Team* *read* access to Storage account *marketinglake1*:

![Image shows a sample data owner policy giving access to an Azure Storage account.](./media/tutorial-data-owner-policies-storage/data-owner-policy-example-storage.png)


>[!Important]
> - Publish is a background operation. It can take up to **2 hours** for the changes to be reflected in Storage account(s).


## Additional information
- Policy statements set below container level on a Storage account are supported. If no access has been provided at Storage account level or container level, then the App that requests the data must execute a direct access by providing a fully qualified name to the data object. If the App attempts to crawl down the hierarchy starting from the Storage account or Container, and there is no access at that level, the request will fail. The following documents show examples of how to do perform a direct access. See also blogs in the *Next steps* section of this tutorial.
  - [*abfs* for ADLS Gen2](../hdinsight/hdinsight-hadoop-use-data-lake-storage-gen2.md#access-files-from-the-cluster)
  - [*az storage blob download* for Blob Storage](../storage/blobs/storage-quickstart-blobs-cli.md#download-a-blob)
- Creating a policy at Storage account level will enable the Subjects to access system containers e.g., *$logs*.  If this is undesired, first scan the data source(s) and then create finer-grained policies for each (i.e., at container or sub-container level).


### Limits
- The limit for Azure Purview policies that can be enforced by Storage accounts is 100MB per subscription, which roughly equates to 5000 policies.

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
Check blog, demo and related tutorials

* [Demo of access policy for Azure Storage](/video/media/8ce7c554-0d48-430f-8f63-edf94946947c/purview-policy-storage-dataowner-scenario_mid.mp4)
* [Concepts for Azure Purview data owner policies](./concept-data-owner-policies.md)
* [Enable Azure Purview data owner policies on all data sources in a subscription or a resource group](./tutorial-data-owner-policies-resource-group.md)
* [Blog: What's New in Azure Purview at Microsoft Ignite 2021](https://techcommunity.microsoft.com/t5/azure-purview/what-s-new-in-azure-purview-at-microsoft-ignite-2021/ba-p/2915954)
* [Blog: Accessing data when folder level permission is granted](https://techcommunity.microsoft.com/t5/azure-purview-blog/data-policy-features-accessing-data-when-folder-level-permission/ba-p/3109583)
* [Blog: Accessing data when file level permission is granted](https://techcommunity.microsoft.com/t5/azure-purview-blog/data-policy-features-accessing-data-when-file-level-permission/ba-p/3102166)
