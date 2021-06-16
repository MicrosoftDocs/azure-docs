---
title: 'About Azure Bastion configuration settings'
description: Learn about the available configuration settings for Azure Bastion.
services: bastion
author: cherylmc

ms.service: bastion
ms.topic: conceptual
ms.date: 06/16/2021
ms.author: cherylmc

---

# About Bastion configuration settings

The sections in this article discuss the resources and settings for Azure Bastion.

## <a name="sku"></a>SKUs

A SKU is also known as a Tier. Azure Bastion supports two SKU types: Basic and Standard. The Basic SKU provides base functionality, enabling Azure Bastion to manage RDP/SSH connectivity to virtual machines without exposing public IP addresses on the target VMs. The Standard SKU enables premium features which allow Azure Bastion to manage remote connectivity at a larger scale. The SKU is configured during the workflow when you create the bastion host. However, you can later upgrade the Basic SKU to the Standard SKU.

The following table shows features and corresponding SKUs.

[!INCLUDE [Azure Bastion SKUs](../../includes/bastion-sku.md)]

### Configuration methods

You can configure this setting using the following methods:

| Method | Value | Link |
| --- | --- | --- |
| Azure portal | Tier | [Configuration article](https://portal.azure.com) |
| Azure PowerShell | -Sku  | [cmdlet](/powershell/module/az.network/new-azbastion#parameters) |
| Azure CLI | --sku|[command](/cli/azure/network/bastion)|

### Upgrade a SKU

If you create a bastion host using the Basic SKU, you can upgrade it to the Standard SKU. However, you can't convert a Standard SKU back to a Basic SKU. If you have a Standard SKU and want to use a Basic SKU, you have to delete the bastion host and recreate it.

[//]: # (Add link to How-to when available)

## <a name="instance"></a>Instance count - host scaling

[!INCLUDE [instance count](../../includes/bastion-instance-count.md)]

[//]: # (Add link to How-to when it is available.)

### Configuration methods

You can configure this setting using the following methods:

| Method | Value | Link |
| --- | --- | --- |
| Azure portal |Instance count  | [Configuration article](https://portal.azure.com)|
| Azure PowerShell | -InstanceCount|[cmdlet](/powershell/module/az.network/new-azbastion#parameters)|
| Azure CLI | --instancecount |[command](/cli/azure/network/bastion)|

## <a name="subnet"></a>Azure Bastion subnet

Azure Bastion requires the subnet **AzureBastionSubnet** to be created within the virtual network for which you are creating the bastion host. You cannot use a subnet with a different name.

The subnet must have the following configuration:

* Subnet name must be *AzureBastionSubnet*.
* Subnet size must be /27 or larger (/26, /25 etc.).
* The subnet must be in the same VNet and resource group as the bastion host.
* The subnet cannot contain additional resources.

### Configuration methods

You can configure this setting using the following methods:

| Method | Value | Link |
| --- | --- |--- |
| Azure portal | Subnet  |[Configuration article](https://portal.azure.com)|
| Azure PowerShell | -subnetName|[cmdlet](/powershell/module/az.network/new-azbastion#parameters) |
| Azure CLI |  --subnet-name | [command](/cli/azure/network/vnet#az_network_vnet_create)
|

## <a name="public-ip"></a>Public IP address

The public IP address settings are the settings that configure the public IP address for your bastion host. You create a public IP address resource with specific values. An IP address is assigned to this resource.

* The Public IP address SKU must be **Standard**.
* The Public IP address assignment/allocation method must be **Static**.
* The Public IP address name is the resource name by which you want to refer to this public IP address.
* You can choose to use a public IP address that you already created, as long as it meets the criteria required by Azure Bastion and is not already in use.

### Configuration methods

You can configure this setting using the following methods:

| Method | Value | Link |
| --- | --- |--- |
| Azure portal | Public IP address |[Azure portal](https://portal.azure.com)|
| Azure PowerShell | -PublicIpAddress| [cmdlet](/powershell/module/az.network/new-azbastion#parameters)  |
| Azure CLI | --public-ip create |[command](/cli/azure/network/public-ip)
|

## Next steps

For frequently asked questions, see the [Azure Bastion FAQ](bastion-faq.md).
