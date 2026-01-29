---
title: Create a File Share (Microsoft.FileShares)
description: Learn to use the Azure portal to deploy an NFS file share with Microsoft.FileShares resource provider (preview).
author: khdownie
ms.service: azure-file-storage
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 10/08/2025
ms.author: kendownie
# Customer intent: "As an IT admin, I want to learn how to deploy an NFS file share with Microsoft.FileShares resource provider (preview)."
---

# Create an Azure file share with Microsoft.FileShares (preview)

:heavy_check_mark: **Applies to:** File shares created with the Microsoft.FileShares resource provider (preview)

:heavy_multiplication_x: **Doesn't apply to:** Classic file shares created with the Microsoft.Storage resource provider

The new Microsoft.FileShares resource provider (preview) and management model allows you to deploy file shares without creating an Azure storage account. Before you create an Azure file share with the Microsoft.FileShares resource provider, review the following to decide if it's the right fit for your needs. If you need all the features that Azure Files offers, or you need to use the SMB protocol, or want HDD (standard) performance, use a [classic file share](create-classic-file-share.md) instead.

- The Microsoft.FileShares resource provider and management model is current only available for NFS file shares, which require SSD (premium) storage. SSD media provides consistent high performance and low latency, within single-digit milliseconds for most IO operations.

- The preview only supports the [provisioned v2 billing model](understanding-billing.md#provisioned-v2-model), which allows you to specify how much storage, IOPS, and throughput your file share needs. The amount that you provision determines your total bill. When you create a new file share using the provisioned v2 model, we provide a recommendation for how many IOPS and how much throughput you need based on the amount of provisioned storage you specify. Depending on your requirements, you can choose to override these recommendations with your own values.

- The Microsoft.FileShares preview only supports locally-redundant storage (LRS) and zone-redundant storage (ZRS). See [Azure Files redundancy](./files-redundancy.md) for more information.

For more information on Azure Files management concepts, see [Plan for an Azure Files deployment](storage-files-planning.md#management-concepts).

## Prerequisites

This article assumes that you have an Azure subscription. If you don't have an Azure subscription, then create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

Make sure both Microsoft.FileShares and Microsoft.Storage resource providers are registered for the subscription. To register a resource provider, follow these steps.

1. Sign in to Azure portal.
1. In the search box, enter *subscriptions*.
1. Select the subscription you want to use to register a resource provider.
1. To see the list of resource providers, under **Settings**, select **Resource providers**.
1. Select the resource provider you intend to add and then select **Register**.

## Create a file share (Microsoft.FileShares)

> [!NOTE]
> File share with Microsoft.FileShares is currently in preview. You may use the Azure portal, or you can use generic PowerShell or Azure CLI commands to work with file shares. If you want to try the CLI private package for Microsoft.FileShares resource provider, fill out this [survey](https://forms.microsoft.com/r/nEGcB0ccaD).

# [Portal](#tab/azure-portal)

To create a file share via the Azure portal, use the search box at the top of the Azure portal to search for **file share** and select the matching result.

![A screenshot of the Azure portal search box with results for file share.](./media/storage-how-to-create-microsoft-fileshares/search-for-file-share.png)

Select **+ Create** to create a new file share.

![A screenshot of the Azure portal for create button for file share.](./media/storage-how-to-create-microsoft-fileshares/file-share-create.png)

### Basics

The first tab to complete creating a file share is labeled **Basics**, which contains the required fields to create a file share.

![A screenshot of the Azure portal for create flow 1 for file share.](./media/storage-how-to-create-microsoft-fileshares/file-share-create-flow-basic.png)


| **Field name**                  | **Input type**         | **Values**                                                                                                                                                                                                                   | **Meaning**                                                                                                                                                                                                                                                                       |
|--------------------------------|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Subscription                   | Drop-down list         | *Available Azure subscriptions*                                                                                                                                                                                              | The selected subscription in which to deploy the storage account.                                                                                                                                                                                                                 |
| Resource group                 | Drop-down list         | *Available resource groups in selected subscription*                                                                                                                                                                         | The resource group in which to deploy the file share. A resource group is a logical container for organizing Azure resources, including file shares.                                                                                                                  |
| file share name          | Text box               | --                                                                                                                                                                                                                            | The name of the file share must be unique across all existing file share names in Microsoft Azure. It must be 3 to 63 characters long and can contain only lowercase letters, numbers, and hyphens. The name must start and end with a letter or number.              |
| Tier                           | N/A                    | --                                                                                                                                                                                                                            | Premium file shares are backed by solid-state drives (SSD) for better performance. Currently, the Microsoft.FileShares preview only supports SSD.                                                                                                                           |
| Protocol                       | N/A                    | --                                                                                                                                                                                                                            | file shares support a multitude of access protocols. If you need the SMB protocol, deploy your file share within a storage account. Currently, the Microsoft.FileShares preview only supports NFS protocol.                                                          |
| Region                         | Drop-down list         | *Available Azure regions*                                                                                                                                                                                                    | The region for the file share to be deployed into. This can be the region associated with the resource group, or any other available region.                                                                                                                               |
| Provisioned capacity (GiB)     | Text box         | Integer                                                                                                                                                                                                                       | Provisioned capacity for the file share, ranging from 32 GiB to 262144 GiB.                                                                                                                                                                                                 |
| Redundancy                     | Drop-down list         | - Locally redundant storage (LRS)  <br> - Geo-redundant storage (GRS)                                                                                                                                                         | The redundancy choice for the file share. See [Azure Files redundancy](files-redundancy.md) for more information.                                                                                                                                                         |
| Provisioned IOPS and throughput| Radio button group     | - Recommended provisioning  <br> - Manually specify IOPS and throughput:  <br> &nbsp;&nbsp;&nbsp;&nbsp;- Provisioned IOPS  <br> &nbsp;&nbsp;&nbsp;&nbsp;- Provisioned throughput (MiB/sec)                                   | The Microsoft.FileShares preview only uses the [provisioned v2 billing model](understanding-billing.md#provisioned-v2-model).  |

### Advanced

The **Advanced** tab is optional and provides more granular settings. You can choose to set up [root squash options](nfs-root-squash.md) or specify a mount name for the file share. Mount name allows you to choose a different name to use to mount the file share. By default, it's the same as the file share name. Customize it if you want a unique mount name. The same rules still apply to the naming policy. See [Naming rules and restrictions for Azure resources](../../azure-resource-manager/management/resource-name-rules.md).

![A screenshot of the  of the advanced tab.](./media/storage-how-to-create-microsoft-fileshares/file-share-create-flow-advanced.png)

### Networking

Using the NFS protocol for a file share requires network-level security configurations. Currently there are two options for establishing networking-level security configurations: Private endpoint and service endpoint. Private endpoint gives your file share a private, static IP address within your virtual network, preventing connectivity interruptions from dynamic IP address changes. Traffic to your file share stays within peered virtual networks, including those in other regions and on premises. See [What is a private endpoint](../../private-link/private-endpoint-overview.md) to learn more.

If you don't require a static IP address, you can enable a service endpoint for Azure Files within the virtual network. A service endpoint configures file share to allow access only from specific subnets. The allowed subnets can belong to a virtual network in the same subscription or a different subscription, including those that belong to a different Microsoft Entra tenant. There's no extra charge for using service endpoints. See [Azure virtual network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md) to learn more.

The **Networking** tab is optional, and allows you to set up both service and private endpoint. A virtual network is required if you intend to set up private endpoint while creating the file share. You may also set up networking configurations after the file share is created. 

With public endpoints access enabled, you can create or choose an existing virtual network for the service endpoint connection to this file share. If you decide to disable public endpoint access, service endpoint will be disabled for this specific file share.

![A screenshot of the  of service endpoint tab.](./media/storage-how-to-create-microsoft-fileshares/file-share-service-endpoint.png)

For private endpoint configurations, each file share will have its own private endpoint. To get started, follow these steps.
1. Select **+ Create private endpoint**. Leave **Subscription** and **Resource group** the same. Choose the same location as the virtual network and desired name for the private endpoint. Choose FileShare for storage sub-resource.
1. Under networking section, choose the desired virtual network and subnet setting. Select **Yes** for **Integrate with private DNS zone**.
1. Select **OK**.

![A screenshot of the  of the private endpoint tab.](./media/storage-how-to-create-microsoft-fileshares/file-share-private-endpoint.png)

### Tags

Tags are name/value pairs that enable you to categorize resources and view consolidated billing by applying the same tag to multiple resources and resource groups. These are optional, and you can apply them after you create the file share.

### Review + create

The final step to create the file share is to select the **Create** button on the **Review + create** tab. This button isn't available until you complete all the required fields.

# [PowerShell](#tab/powershell)

To create a file share via PowerShell, run this command.

```azure-powershell
New-AzResource -ResourceType "Microsoft.FileShares/fileShares" `
               -ResourceName "<your-file-share-name>" `
               -Location "<intended-region-for-deployment>" `
               -ResourceGroupName "<your-resource-group-name>" `
               -Properties @{
                   # redundancy support "Local" and "Zone"
                   redundancy = "Local"
                   protocol = "NFS"
                   provisionedStorageGiB = <intended capacity>
                   ProvisionedIoPerSec = <intended IOPS> 
                   ProvisionedThroughputMiBPerSec = <intended throughput>
                   mediaTier = "SSD"
                   # optional: mountName = "<mount-name-for-file-share>"
                   nfsProtocolProperties = @{
                       rootSquash = "RootSquash"
                   }
               } `
               -Force
```

# [Azure CLI](#tab/azure-cli)

To create a file share via Azure CLI, run this command.

```bash
az resource create \
  --resource-type "Microsoft.FileShares/fileShares" \
  --name <your-file-share-name> \
  --location <intended-region-for-deployment> \
  --resource-group <your-resource-group-name> \
  --properties '{
    # redundancy support "Local" and "Zone"
    "redundancy": "Local",
    "protocol": "NFS",
    "provisionedStorageGiB": <intended capacity>,
    "ProvisionedIoPerSec": <intended IOPS>,
    "ProvisionedThroughputMiBPerSec": <intended throughput,
    "mediaTier": "SSD",
    "nfsProtocolProperties": {
      "rootSquash": "RootSquash"
    }
}'

```

---

## Next steps

- Learn how to [create a Linux virtual machine](/azure/virtual-machines/linux/quick-create-portal?tabs=ubuntu)
- Learn how to [mount an NFS file share on Linux](storage-files-how-to-mount-nfs-shares.md)
- Learn how to [modify a file share](modify-file-share.md)
