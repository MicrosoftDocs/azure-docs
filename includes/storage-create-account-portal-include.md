---
 title: include file
 description: include file
 services: storage
 author: tamram
 ms.service: storage
 ms.topic: include
 ms.date: 04/15/2021
 ms.author: tamram
 ms.custom: include file
---

To create a general-purpose v2 storage account in the Azure portal, follow these steps:

1. On the Azure portal menu, select **All services**. In the list of resources, type **Storage Accounts**. As you begin typing, the list filters based on your input. Select **Storage Accounts**.
1. On the **Storage Accounts** window that appears, choose **+ New**.
1. On the **Basics** blade, select the subscription in which to create the storage account.
1. Under the **Resource group** field, select your desired resource group, or create a new resource group.  For more information on Azure resource groups, see [Azure Resource Manager overview](../articles/azure-resource-manager/management/overview.md).
1. Next, enter a name for your storage account. The name you choose must be unique across Azure. The name also must be between 3 and 24 characters in length, and may include only numbers and lowercase letters.
1. Select a region for your storage account, or use the default region.
1. Select a performance tier. The default tier is *Standard*.
1. Specify how the storage account will be replicated. The default redundancy option is *Geo-redundant storage (GRS)*. For more information about available replication options, see [Azure Storage redundancy](../articles/storage/common/storage-redundancy.md).
1. Additional options are available on the **Advanced**, **Networking**, **Data protection**, and **Tags** blades. To use Azure Data Lake Storage, choose the **Advanced** blade, and then set **Hierarchical namespace** to **Enabled**. For more information, see [Azure Data Lake Storage Gen2 Introduction](../articles/storage/blobs/data-lake-storage-introduction.md)
1. Select **Review + Create** to review your storage account settings and create the account.
1. Select **Create**.

The following image shows the settings on the **Basics** blade for a new storage account:

:::image type="content" source="media/storage-create-account-portal-include/account-create-portal.png" alt-text="Screenshot showing how to create a storage account in the Azure portal." lightbox="media/storage-create-account-portal-include/account-create-portal.png":::
