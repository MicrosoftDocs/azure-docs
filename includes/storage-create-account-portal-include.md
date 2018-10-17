---
 title: include file
 description: include file
 services: storage
 author: tamram
 ms.service: storage
 ms.topic: include
 ms.date: 09/18/2018
 ms.author: tamram
 ms.custom: include file
---

To create a general-purpose v2 storage account in the Azure portal, follow these steps:

1. In the Azure portal, expand the menu on the left side to open the menu of services, and choose **All services**. Then, scroll down to **Storage**, and choose **Storage accounts**. On the **Storage Accounts** window that appears, choose **Add**.
1. Select the subscription in which to create the storage account.
1. Under the **Resource group** field, click **Create new**. Enter a name for your new resource group, as shown in the following image.

    ![Screen shot showing how to create a resource group in the portal](./media/storage-create-account-portal-include/create-resource-group.png)

1. Next, enter a name for your storage account. The name you choose must be unique across Azure, must be between 3 and 24 characters in length, and may contain numbers and lowercase letters only.
1. Select a location for your storage account, or use the default location.
1. Leave these fields set to their default values:
    - The **Deployment model** field is set to **Resource manager** by default.
    - The **Performance** field is set to **Standard** by default.
    - The **Account kind** field is set to **StorageV2 (general-purpose v2)** by default.
    - The **Replication** field is set to **Locally-redundant storage (LRS)** by default.
    - The **Access tier** is set to **Hot** by default.

1. Click **Review + Create** to review your storage account settings and create the account.

For more information about types of storage accounts and other storage account settings, see [Azure storage account overview](https://docs.microsoft.com/azure/storage/common/storage-account-overview). For more information on resource groups, see [Azure Resource Manager overview](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview). 
