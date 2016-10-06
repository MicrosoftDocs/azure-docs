There are two types of storage accounts:

### General-purpose Storage Accounts

A general-purpose storage account gives you access to Azure Storage services such as Tables, Queues, Files, Blobs and Azure virtual machine disks under a single account. This type of storage account has two performance tiers:

- A standard storage performance tier which allows you to store Tables, Queues, Files, Blobs and Azure virtual machine disks.
- A premium storage performance tier which currently only supports Azure virtual machine disks. See [Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads](../articles/storage/storage-premium-storage.md) for an in-depth overview of Premium storage.

### Blob Storage Accounts

A Blob storage account is a specialized storage account for storing your unstructured data as blobs (objects) in Azure Storage. Blob storage accounts are similar to your existing general-purpose storage accounts and share all the great durability, availability, scalability, and performance features that you use today including 100% API consistency for block blobs and append blobs. For applications requiring only block or append blob storage, we recommend using Blob storage accounts.

> [AZURE.NOTE] Blob storage accounts support only block and append blobs, and not page blobs.

Blob storage accounts expose the **Access Tier** attribute which can be specified during account creation and modified later as needed. There are two types of access tiers that can be specified based on your data access pattern:

- A **Hot** access tier which indicates that the objects in the storage account will be more frequently accessed. This allows you to store data at a lower access cost.
- A **Cool** access tier which indicates that the objects in the storage account will be less frequently accessed. This allows you to store data at a lower data storage cost.

If there is a change in the usage pattern of your data, you can also switch between these access tiers at any time. Changing the access tier may result in additional charges. Please see [Pricing and billing for Blob storage accounts](../articles/storage/storage-blob-storage-tiers.md#pricing-and-billing) for more details.

For more details on Blob storage accounts, see [Azure Blob Storage: Cool and Hot tiers](../articles/storage/storage-blob-storage-tiers.md).

Before you can create a storage account, you must have an Azure subscription, which is a plan that gives you access to a variety of Azure services. You can get started with Azure with a [free account](https://azure.microsoft.com/pricing/free-trial/). Once you decide to purchase a subscription plan, you can choose from a variety of [purchase options](https://azure.microsoft.com/pricing/purchase-options/). If you’re an [MSDN subscriber](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/), you get free monthly credits that you can use with Azure services, including Azure Storage. See [Azure Storage Pricing ](https://azure.microsoft.com/pricing/details/storage/) for information on volume pricing.

To learn how to create a storage account, see [Create a storage account](../articles/storage/storage-create-storage-account.md#create-a-storage-account) for more details. You can create up to 100 uniquely named storage accounts with a single subscription. See [Azure Storage Scalability and Performance Targets](../articles/storage/storage-scalability-targets.md) for details about storage account limits.
