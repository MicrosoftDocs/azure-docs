---
title: Create an Azure File Share
description: Learn to use the Azure portal to deploy an NFS Azure file share with Microsoft.FileShares resource provider (preview).
author: khdownie
ms.service: azure-file-storage
ms.custom: linux-related-content
ms.topic: tutorial
ms.date: 08/20/2025
ms.author: kendownie
# Customer intent: "As an IT admin, I want to learn how to create, manage, and delete an Azure file share."
---

# Create an Azure file share with Microsoft.FileShares (preview)

Before you create an Azure file share with Microsoft.FileShares, you need to answer two questions about how you want to use it:

- **Is Azure file share the right fit for me?**  
  **Microsoft.FileShares is currently in preview.** The new management model is current only available for NFS Azure file shares, which require SSD (premium) storage. SSD Azure file shares provide consistent high performance and low latency, within single-digit milliseconds for most IO operations. The Microsoft.FileShares preview doesn't require you to create an Azure storage account in order to deploy a file share. It currently only supports the provisioned v2 billing model, which allows you to specify how much storage, IOPS, and throughput your Azure file share needs. The amount of each quantity that you provision determines your total bill. By default, when you create a new Azure file share using the provisioned v2 model, we provide a recommendation for how many IOPS and how much throughput you need based on the amount of provisioned storage you specify. Depending on your requirements, you might find that you require more or less IOPS or throughput than our recommendations, and can optionally override these recommendations with your own values as desired. To learn more, see [Understanding the provisioned v2 billing model](./understanding-billing.md#provisioned-v2-model). If you need all the features that Azure Files offers, or you need to use the SMB protocol, or want HDD (standard) performance, use a [classic Azure file share](create-classic-file-share.md) instead.

- **What are the redundancy requirements for your Azure file share?**  
   Azure file shares are only available for LRS and ZRS redundancy types. See [Azure Files redundancy](./files-redundancy.md) for more information.

For more information on Azure file share options, see [Planning for an Azure Files deployment](storage-files-planning.md).

## Applies to

| Management model     | Object                   | Applies to                           |
| -------------------- | ------------------------ | ----------------------------------- |
| Microsoft.FileShares | Azure file share         | ![Yes](../media/icons/yes-icon.png) |
| Microsoft.Storage    | Classic Azure file share | ![No](../media/icons/no-icon.png)   |

## Prerequisites

This article assumes that you have an Azure subscription. If you don't have an Azure subscription, then create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create an Azure file share

To create an Azure file share via the Azure portal, use the search box at the top of the Azure portal to search for **Azure file share** and select the matching result.

![A screenshot of the Azure portal search box with results for "Azure file share".](./media/storage-how-to-create-microsoft-fileshares/search.png)

Click **+ Create** to create a new Azure file share.

![A screenshot of the Azure portal for create button for Azure file share".](./media/storage-how-to-create-microsoft-fileshares/create.png)

### Basics

The first tab to complete creating an Azure file share is labeled **Basics**, which contains the required fields to create an Azure file share.

![A screenshot of the Azure portal for create flow 1 for Azure file share".](./media/storage-how-to-create-microsoft-fileshares/createflow1.png)

| Field name                      | Input type         | Values                                                                                                                                                                        | Applicable to Azure file share Meaning                                                                                                                                                                                                                                                              |
| ------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Subscription                    | Drop-down list     | _Available Azure subscriptions_                                                                                                                                               | Yes                            | The selected subscription in which to deploy the storage account.                                                                                                                                                                                                    |
| Resource group                  | Drop-down list     | _Available resource groups in selected subscription_                                                                                                                          | Yes                            | The resource group in which to deploy the Azure file share. A resource group is a logical container for organizing for Azure resources, including Azure file share.                                                                                                  |
| Azure file share name           | Text box           | --                                                                                                                                                                            | Yes                            | The name of the Azure file share must be unique across all existing Azure file share names in Microsoft Azure. It must be 3 to 63 characters long and can contain only lowercase letters, numbers, and hyphens. The name must start and end with a letter or number. |
| Tier                            | N/A                | --                                                                                                                                                                            | Yes                            | Premium Azure file shares are backed by solid-state drives (SSD) for better performance. Currently the Microsoft.FileShares preview only supports SSD.                                                                                                                           |
| Protocol                        | N/A                | --                                                                                                                                                                            | Yes                            | Azure Azure file shares support a multitude of access protocols. If you need the SMB protocol, deploy your Azure file share within a storage account. Currently the Microsoft.FileShares preview only supports NFS protocol.                                                          |
| Region                          | Drop-down list     | _Available Azure regions_                                                                                                                                                     | Yes                            | The region for the Azure file share to be deployed into. This can be the region associated with the resource group, or any other available region.                                                                                                                   |
| Provisioned capacity (GiB)      | Drop-down list     | Integer                                                                                                                                                                       | Yes                            | Provisioned capacity for the Azure file share, range from 32 GiB to 262144 GiB.                                                                                                                                                                                      |
| Redundancy                      | Drop-down list     | <ul><li>Locally redundant storage (LRS)</li><li>Geo-redundant storage (GRS)</li></ul>                                                                                          | Yes                            | The redundancy choice for the Azure file share. See [Azure Files redundancy](./files-redundancy.md) for more information.                                                                                                                                            |
| Provisioned IOPS and throughput | Radio button group | <ul><li>Recommended provisioning</li><li>Manually specify IOPS and throughput<ul><li>Provisioned IOPS</li><li>Provisioned throughput (MiB/sec)</li></ul></li></ul>             | Yes                            | Azure file share only uses provisioned v2 SSD billing model. See [Understanding billing](./understanding-billing.md) for more information.                                                                                                                            |

### Advanced

The **Advanced** tab is optional, but provides more granular settings for the Azure file share. Currently you can choose to set up root squash options or specify a mount name for the Azure file share. Mount name allows you to choose a different name to use to mount the Azure file share. By default, it's the same as the Azure file share name. Customize it if you want a unique mount name. The same rules still apply to the naming policy. See [Naming rules and restrictions for Azure resources](../../azure-resource-manager/management/resource-name-rules.md) to learn more.

![A screenshot of the  of the advanced tab.](./media/storage-how-to-create-microsoft-fileshares/createflow2.png)

### Networking

Using the NFS protocol for an Azure file share requires network-level security configurations. Currently there are two options for establishing networking-level security configurations: Private endpoint and service endpoint. Private endpoint gives your Azure file share a private, static IP address within your virtual network, preventing connectivity interruptions from dynamic IP address changes. Traffic to your Azure file share stays within peered virtual networks, including those in other regions and on premises. See [What is a private endpoint](../../private-link/private-endpoint-overview.md) to learn more.

If you don't require a static IP address, you can enable a service endpoint for Azure Files within the virtual network. A service endpoint configures Azure file share to allow access only from specific subnets. The allowed subnets can belong to a virtual network in the same subscription or a different subscription, including those that belong to a different Microsoft Entra tenant. There's no extra charge for using service endpoints. See [Azure virtual network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md) to learn more.

The **Networking** tab is optional, and allows you to set up both service and private endpoint. With public endpoints access enabled, you can create or choose an existing virtual network for the service endpoint connection to this Azure file share. If you decide to disable public endpoint access, service endpoint will be disabled for this specific Azure file share.

A virtual network is required if you intend to set up networking while creating the Azure file share. You may also set up networking configurations after the Azure file share is created.

![A screenshot of the  of service endpoint tab.](./media/storage-how-to-create-microsoft-fileshares/createflow31.png)

For private endpoint configurations, each Azure file share will have its own private endpoint. To get started, follow these steps.

1. Select **+ Create private endpoint**. Leave **Subscription** and **Resource group** the same. Choose the same location as the virtual network and desired name for the private endpoint. Choose FileShare for storage sub-resource.

1. Under configure virtual network section, choose the desired virtual network and subnet setting. Select **Yes** for **Enable Private DNS zone**.

1. Select **Add**.

![A screenshot of the  of the private endpoint tab.](./media/storage-how-to-create-microsoft-fileshares/createflow32.png)

### Tags

Tags are name/value pairs that enable you to categorize resources and view consolidated billing by applying the same tag to multiple resources and resource groups. These are optional, and you can apply them after you create the file share.

### Review + create

The final step to create the Azure file share is to select the **Create** button on the **Review + create** tab. This button isn't available until you complete all the required fields.