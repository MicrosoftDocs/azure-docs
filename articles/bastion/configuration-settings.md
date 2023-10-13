---
title: 'About Azure Bastion configuration settings'
description: Learn about the available configuration settings for Azure Bastion.
author: cherylmc
ms.author: cherylmc
ms.service: bastion
ms.topic: conceptual
ms.date: 10/13/2023
---

# About Bastion configuration settings

The sections in this article discuss the resources and settings for Azure Bastion.

## <a name="skus"></a>SKUs

A SKU is also known as a Tier. Azure Bastion supports multiple SKU tiers. When you configure Bastion, you select the SKU tier. You decide the SKU tier based on the features that you want to use. The following table shows the availability of features per corresponding SKU.

[!INCLUDE [Azure Bastion SKUs](../../includes/bastion-sku.md)]

### Developer SKU (Preview)

The Bastion Developer SKU is a new, lower-cost, lightweight SKU. This SKU is ideal for Dev/Test users who want to securely connect to their VMs and that don't need additional features or scaling. You can connect to one Azure VM at a time directly through the VM connect page.

The Developer SKU has different requirements and limitations than the other SKU tiers. See [Deploy Bastion automatically - Developer SKU](quickstart-developer-sku.md) for more information and deployment steps.

### Specify SKU

| Method | SKU Value | Links |
| --- | --- | --- |
| Azure portal | Tier - Developer | [Quickstart](deploy-host-developer-sku.md)|
| Azure portal | Tier - Basic| [Quickstart](quickstart-host-portal.md) |
| Azure portal | Tier - Basic or Standard | [Tutorial](tutorial-create-host-portal.md) |
| Azure PowerShell | Tier - Basic or Standard |[How-to](bastion-create-host-powershell.md) |
| Azure CLI | Tier - Basic or Standard | [How-to](create-host-cli.md) |

### <a name="upgradesku"></a>Upgrade a SKU

You can always [upgrade a SKU](upgrade-sku.md) to add more features.

> [!NOTE]
> Downgrading a SKU is not supported. To downgrade, you must delete and recreate Azure Bastion.
>

You can configure this setting using the following method:

| Method | Value | Links |
| --- | --- | --- |
| Azure portal |Tier  | [How-to](upgrade-sku.md)|

## <a name="subnet"></a>Azure Bastion subnet

>[!IMPORTANT]
>For Azure Bastion resources deployed on or after November 2, 2021, the minimum AzureBastionSubnet size is /26 or larger (/25, /24, etc.). All Azure Bastion resources deployed in subnets of size /27 prior to this date are unaffected by this change and will continue to work, but we highly recommend increasing the size of any existing AzureBastionSubnet to /26 in case you choose to take advantage of [host scaling](./configure-host-scaling.md) in the future.
>

When you deploy Azure Bastion using any SKU except the Developer SKU, Bastion requires a dedicated subnet named **AzureBastionSubnet**. You must create this subnet in the same virtual network that you want to deploy Azure Bastion to. The subnet must have the following configuration:

* Subnet name must be *AzureBastionSubnet*.
* Subnet size must be /26 or larger (/25, /24 etc.).
* For host scaling, a /26 or larger subnet is recommended. Using a smaller subnet space limits the number of scale units. For more information, see the [Host scaling](#instance) section of this article.
* The subnet must be in the same virtual network and resource group as the bastion host.
* The subnet can't contain other resources.

You can configure this setting using the following methods:

| Method | Value | Links |
| --- | --- |--- |
| Azure portal | Subnet  |[Quickstart](quickstart-host-portal.md)<br>[Tutorial](tutorial-create-host-portal.md)|
| Azure PowerShell | -subnetName|[cmdlet](/powershell/module/az.network/new-azbastion#parameters) |
| Azure CLI |  --subnet-name | [command](/cli/azure/network/vnet#az-network-vnet-create) |

## <a name="public-ip"></a>Public IP address

Azure Bastion deployments require a Public IP address, except Developer SKU deployments. The Public IP must have the following configuration:

* The Public IP address SKU must be **Standard**.
* The Public IP address assignment/allocation method must be **Static**.
* The Public IP address name is the resource name by which you want to refer to this public IP address.
* You can choose to use a public IP address that you already created, as long as it meets the criteria required by Azure Bastion and isn't already in use.

You can configure this setting using the following methods:

| Method | Value | Links |
| --- | --- |--- |
| Azure portal | Public IP address |[Azure portal](https://portal.azure.com)|
| Azure PowerShell | -PublicIpAddress| [cmdlet](/powershell/module/az.network/new-azbastion#parameters)  |
| Azure CLI | --public-ip create |[command](/cli/azure/network/public-ip) |

## <a name="instance"></a>Instances and host scaling

An instance is an optimized Azure VM that is created when you configure Azure Bastion. It's fully managed by Azure and runs all of the processes needed for Azure Bastion. An instance is also referred to as a scale unit. You connect to client VMs via an Azure Bastion instance. When you configure Azure Bastion using the Basic SKU, two instances are created. If you use the Bastion Standard SKU, you can specify the number of instances. This is called **host scaling**.

Each instance can support 20 concurrent RDP connections and 40 concurrent SSH connections for medium workloads (see [Azure subscription limits and quotas](../azure-resource-manager/management/azure-subscription-service-limits.md) for more information). The number of connections per instances depends on what actions you're taking when connected to the client VM. For example, if you're doing something data intensive, it creates a larger load for the instance to process. Once the concurrent sessions are exceeded, another scale unit (instance) is required.

Instances are created in the AzureBastionSubnet. To allow for host scaling, the AzureBastionSubnet should be /26 or larger. Using a smaller subnet limits the number of instances you can create. For more information about the AzureBastionSubnet, see the [subnets](#subnet) section in this article.

You can configure this setting using the following methods:

| Method | Value | Links | Requires Standard SKU |
| --- | --- | --- | ---|
| Azure portal |Instance count  | [How-to](configure-host-scaling.md)| Yes
| Azure PowerShell | ScaleUnit | [How-to](configure-host-scaling-powershell.md) | Yes |

## <a name="ports"></a>Custom ports

You can specify the port that you want to use to connect to your VMs. By default, the inbound ports used to connect are 3389 for RDP and 22 for SSH. If you configure a custom port value, specify that value when you connect to the VM.

Custom port values are supported for the Standard SKU only.

## Shareable link

The Bastion **Shareable Link** feature lets users connect to a target resource using Azure Bastion without accessing the Azure portal.

When a user without Azure credentials clicks a shareable link, a webpage opens that prompts the user to sign in to the target resource via RDP or SSH. Users authenticate using username and password or private key, depending on what you have configured in the Azure portal for that target resource. Users can connect to the same resources that you can currently connect to with Azure Bastion: VMs or virtual machine scale set.

| Method | Value | Links | Requires Standard SKU |
| --- | --- | --- | --- |
| Azure portal |Shareable Link  | [Configure](shareable-link.md)| Yes |

## Next steps

For frequently asked questions, see the [Azure Bastion FAQ](bastion-faq.md).
