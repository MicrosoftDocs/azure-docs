---
title: Access provisioning by data owner to Azure Storage datasets
description: Step-by-step guide showing how data owners can create access policies to datasets in Azure Storage
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: how-to
ms.date: 05/12/2022
ms.custom:
---

# Access provisioning by data owner to Azure Storage datasets (preview)

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

[Access policies](concept-data-owner-policies.md) allow you to enable access to data sources that have been registered for *Data Use Management* in Microsoft Purview.
This article describes how a data owner can delegate in Microsoft Purview management of access to Azure Storage datasets. Currently, these two Azure Storage sources are supported:

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

After you've registered your resources, you'll need to enable *Data Use Management*. Data Use Management can affect the security of your data, as it delegates to certain Microsoft Purview roles to manage access to data sources that have been registered. Secure practices related to *Data Use Management* are described in this guide:

- [How to enable Data Use Management](./how-to-enable-data-use-management.md) 

Once your data source has the  **Data Use Management** toggle **Enabled**, it will look like this picture:

:::image type="content" source="./media/how-to-data-owner-policies-storage/register-data-source-for-policy-storage.png" alt-text="Screenshot that shows how to register a data source for policy by toggling the enable tab in the resource editor.":::

## Create and publish a data owner policy
Execute the steps in the [data-owner policy authoring tutorial](how-to-data-owner-policy-authoring-generic.md) to create and publish an access policy similar to the example shown in the image: a policy that provides group *Contoso Team* *read* access to Storage account *marketinglake1*:

:::image type="content" source="./media/how-to-data-owner-policies-storage/data-owner-policy-example-storage.png" alt-text="Screenshot that shows a sample data owner policy giving access to an Azure Storage account.":::

>[!Important]
> - Publish is a background operation. It can take up to **2 hours** for the changes to be reflected in Storage account(s).

## Additional information
- Policy statements set below container level on a Storage account are supported. If no access has been provided at Storage account level or container level, then the App that requests the data must execute a direct access by providing a fully qualified name to the data object. If the App attempts to crawl down the hierarchy starting from the Storage account or Container (like Storage Explorer does), and there's no access at that level, the request will fail. The following documents show examples of how to perform a direct access. See also the blogs in the *Next steps* section of this how-to-guide.
  - [*abfs* for ADLS Gen2](../hdinsight/hdinsight-hadoop-use-data-lake-storage-gen2.md#access-files-from-the-cluster)
  - [*az storage blob download* for Blob Storage](../storage/blobs/storage-quickstart-blobs-cli.md#download-a-blob)
- Creating a policy at Storage account level will enable the Subjects to access system containers, for example *$logs*.  If this is undesired, first scan the data source(s) and then create finer-grained policies for each (that is, at container or subcontainer level).
- The root blob in a container will be accessible to the Azure AD principals in a Microsoft Purview *allow*-type RBAC policy if the scope of such policy is either subscription, resource group, Storage account or container in Storage account.
- The root container in a Storage account will be accessible to the Azure AD principals in a Microsoft Purview *allow*-type RBAC policy if the scope of such policy is either subscription, resource group, or Storage account.

### Limits
- The limit for Microsoft Purview policies that can be enforced by Storage accounts is 100 MB per subscription, which roughly equates to 5000 policies.

### Known issues

**Known issues** related to Policy creation
- Do not create policy statements based on Microsoft Purview resource sets. Even if displayed in Microsoft Purview policy authoring UI, they are not yet enforced. Learn more about [resource sets](concept-resource-sets.md).

### Policy action mapping

This section contains a reference of how actions in Microsoft Purview data policies map to specific actions in Azure Storage.

| **Microsoft Purview policy action** | **Data source specific actions**                                                        |
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

* [Demo of access policy for Azure Storage](https://www.youtube.com/watch?v=CFE8ltT19Ss)
* [Concepts for Microsoft Purview data owner policies](./concept-data-owner-policies.md)
* [Enable Microsoft Purview data owner policies on all data sources in a subscription or a resource group](./how-to-data-owner-policies-resource-group.md)
* [Blog: What's New in Microsoft Purview at Microsoft Ignite 2021](https://techcommunity.microsoft.com/t5/azure-purview/what-s-new-in-azure-purview-at-microsoft-ignite-2021/ba-p/2915954)
* [Blog: Accessing data when folder level permission is granted](https://techcommunity.microsoft.com/t5/azure-purview-blog/data-policy-features-accessing-data-when-folder-level-permission/ba-p/3109583)
* [Blog: Accessing data when file level permission is granted](https://techcommunity.microsoft.com/t5/azure-purview-blog/data-policy-features-accessing-data-when-file-level-permission/ba-p/3102166)
