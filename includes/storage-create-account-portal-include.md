---
 title: include file
 description: include file
 services: storage
 author: tamram
 ms.service: storage
 ms.topic: include
 ms.date: 09/24/2020
 ms.author: tamram
 ms.custom: include file
---

To create a general-purpose v2 storage account in the Azure portal, follow these steps:

1. On the Azure portal menu, select **All services**. In the list of resources, type **Storage Accounts**. As you begin typing, the list filters based on your input. Select **Storage Accounts**.
1. On the **Storage Accounts** window that appears, choose **Add**.
1. On the **Basics** tab, select the subscription in which to create the storage account.
1. Under the **Resource group** field, select your desired resource group, or create a new resource group.
1. Next, enter a name for your storage account. The name you choose must be unique across Azure. The name also must be between 3 and 24 characters in length, and may include only numbers and lowercase letters.
1. Select a location for your storage account, or use the default location.
1. Select a performance tier. The default tier is *Standard*.
1. Set the **Account kind** field to *Storage V2 (general-purpose v2)*.
1. Specify how the storage account will be replicated. The default replication option is *Read-access geo-redundant storage (RA-GRS)*.
1. Specify the access tier for blobs in the storage account. The default tier is *hot*.

    The following image shows the **Basics** tab for a new storage account:

    :::image type="content" source="media/storage-create-account-portal-include/account-create-portal.png" alt-text="Screenshot showing how to create a storage account in the Azure portal":::

1. To use [Azure Data Lake Storage](/services/storage/data-lake-storage/), choose the **Advanced** tab, and then set **Hierarchical namespace** to **Enabled**.
1. Select **Review + Create** to review your storage account settings and create the account.
1. Select **Create**.

For more information about types of storage accounts and other storage account settings, see [Azure storage account overview](../articles/storage/common/storage-account-overview.md). For more information on resource groups, see [Azure Resource Manager overview](../articles/azure-resource-manager/resource-group-overview.md).
