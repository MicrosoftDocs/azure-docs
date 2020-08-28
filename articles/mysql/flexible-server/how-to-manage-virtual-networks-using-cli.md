---
title: Manage Virtual Networks - Azure CLI - Azure Database for MySQL - Flexible Server
description: Create and manage Virtual Networks for Azure Database for MySQL - Flexible Server using the Azure CLI
author: ambhatna
ms.author: ambhatna
ms.service: mysql
ms.topic: how-to
ms.date: 9/21/2020
---

# Create and manage Virtual Networks for Azure Database for MySQL - Flexible Server using the Azure CLI

> [!IMPORTANT]
> Azure Database for MySQL Flexible Server is currently in public preview

Azure Database for MySQL Flexible Server supports two types of mutually exclusive network connectivity methods to connect to your flexible server. The two options are:

1. Public access (allowed IP addresses)
2. Private access (VNet Integration)

In this article, we will focus on creation of MySQL server with **Private access (VNet Integration)** using Azure CLI. With *Private access (VNet Integration)*, you can deploy your flexible server into your own [Azure Virtual Network](../../virtual-network/virtual-networks-overview.md). Azure Virtual Networks provide private and secure network communication. In Private access, the connections to the MySQL server are restricted to only within your virtual network. To learn more about it, refer to [Private access (VNet Integration)](./concepts-networking-virtual-network.md)

In Azure Database for MySQL Flexible Server, you can only deploy the server to a virtual network and subnet during creation of the server. After the flexible server is deployed to a virtual network and subnet, you cannot move it to another virtual network, subnet or to *Public access (allowed IP addresses)*. You cannot move that virtual network into another resource group or subscription also.

## Launch Azure Cloud Shell

The [Azure Cloud Shell](../../cloud-shell/overview.md) is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also open Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and select **Enter** to run it.

If you prefer to install and use the CLI locally, this quickstart requires Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Prerequisites

You'll need to log in to your account using the [az login](https://docs.microsoft.com/cli/azure/reference-index?view=azure-cli-latest#az-login) command. Note the **id** property, which refers to **Subscription ID** for your Azure account.

```azurecli-interactive
az login
```

Select the specific subscription under your account using [az account set](/cli/azure/account) command. Make a note of the **id** value from the **az login** output to use as the value for **subscription** argument in the command. If you have multiple subscriptions, choose the appropriate subscription in which the resource should be billed. To get all your subscription, use [az account list](https://docs.microsoft.com/cli/azure/account?view=azure-cli-latest#az-account-list).

```azurecli
az account set --subscription <subscription id>
```

## Create Azure Database for MySQL Flexible Server using CLI
You can use the `az mysql flexible-server` command to create the flexible server with *Private access (VNet Integration)*. This command uses the default connectivity method as Private access (VNet Integration) with an auto-generated virtual network and subnet. You can provide the **--vnet**, **--subnet**, **--vnet-address-prefix** or **--subnet-address-prefix** to customize the Virtual Network and Subnet, as shown in the example below.

>[!Important]
> Using this command will delegate the subnet to **Microsoft.DBforMySQL/flexibleServers**. This delegation means that only Azure Database for MySQL Flexible Servers can use that subnet. No other Azure resource types can be in the delegated subnet.
>

1. Create a flexible server using default virtual network, subnet with default address prefix
```azurecli-interactive
az mysql flexible-server create
```
2. Create a flexible server using already existing virtual network and subnet
```azurecli-interactive
az mysql flexible-server create --vnet myVnet --subnet mySubnet
```
3. Create a flexible server using already existing virtual network, subnet and using the subnet id
```azurecli-interactive
az mysql flexible-server create --vnet myVnet --subnet /subscriptions/{SubID}/resourceGroups/{ResourceGroup}/providers/Microsoft.Network/virtualNetworks/{VNetName}/subnets/{SubnetName}
```
4. Create a flexible server using new virtual network, subnet with non-default address prefix
```azurecli-interactive
az mysql flexible-server create --vnet myVnet --vnet-address-prefix 10.0.0.0/24 --subnet mySubnet --subnet-address-prefix 10.0.0.0/24
```
Refer to the Azure CLI reference documentation <!--FIXME --> for the complete list of configurable CLI parameters.
>[!Note]
> After the flexible server is deployed to a virtual network and subnet, you cannot move it to Public access (allowed IP addresses).


## Next steps
- Learn more about [networking in Azure Database for MySQL Flexible Server](./concepts-networking-overview.md).
- [Create and manage Azure Database for MySQL Flexible Server Virtual Network using Azure Portal](./how-to-manage-virtual-networks-using-portal.md).
- Understand more about [Azure Database for MySQL Flexible Server Virtual Network](./concepts-virtual-network.md).
