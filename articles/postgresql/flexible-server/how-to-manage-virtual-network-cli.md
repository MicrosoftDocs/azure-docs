---
title: Manage virtual networks - Azure CLI
description: Create and manage virtual networks for Azure Database for PostgreSQL - Flexible Server using the Azure CLI.
author: GennadNY
ms.author: gennadyk
ms.reviewer: maghan
ms.date: 04/27/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.custom:
  - devx-track-azurecli
  - ignite-2023
---

# Create and manage virtual networks (VNET Integration) for Azure Database for PostgreSQL - Flexible Server using the Azure CLI

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Azure Database for PostgreSQL flexible server supports two types of mutually exclusive network connectivity methods to connect to your flexible server. The two options are:
* Public access (allowed IP addresses). That method can be further secured by using [Private Link](./concepts-networking-private-link.md) based networking with Azure Database for PostgreSQL flexible server in Preview. 
* Private access (VNET Integration)

In this article, we focus on creation of an Azure Database for PostgreSQL flexible server instance with **Private access (VNet Integration)** using Azure CLI. With *Private access (VNET Integration)*, you can deploy your Azure Database for PostgreSQL flexible server instance into your own [Azure Virtual Network](../../virtual-network/virtual-networks-overview.md). Azure Virtual Networks provide private and secure network communication. In Private access, the connections to the Azure Database for PostgreSQL flexible server instance are restricted to only within your virtual network. To learn more about it, refer to [Private access (VNet Integration)](./concepts-networking.md#private-access-vnet-integration).

In Azure Database for PostgreSQL flexible server, you can only deploy the server to a virtual network and subnet during creation of the server. After the Azure Database for PostgreSQL flexible server instance is deployed to a virtual network and subnet, you can't move it to another virtual network, subnet or to *Public access (allowed IP addresses)*.

## Launch Azure Cloud Shell

The [Azure Cloud Shell](../../cloud-shell/overview.md) is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also open Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and select **Enter** to run it.

If you prefer to install and use the CLI locally, this quickstart requires Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Prerequisites

You need to sign in to your account using the [az login](/cli/azure/reference-index#az-login) command. Note the **ID** property, which refers to **Subscription ID** for your Azure account.

```azurecli-interactive
az login
```

Select the specific subscription under your account using [az account set](/cli/azure/account#az-account-set) command. Make a note of the **ID** value from the **az login** output to use as the value for **subscription** argument in the command. If you have multiple subscriptions, choose the appropriate subscription in which the resource should be billed. To get all your subscription, use [az account list](/cli/azure/account#az-account-list).

```azurecli
az account set --subscription <subscription id>
```

## Create an Azure Database for PostgreSQL flexible server instance using Azure CLI
You can use the `az postgres flexible-server` command to create the Azure Database for PostgreSQL flexible server instance with *Private access (VNet Integration)*. This command uses Private access (VNet Integration) as the default connectivity method. A virtual network and subnet will be created for you if none is provided. You can also provide the already existing virtual network and subnet using the subnet ID. <!-- You can provide the **vnet**,**subnet**,**vnet-address-prefix** or**subnet-address-prefix** to customize the virtual network and subnet.--> There are various options to create an Azure Database for PostgreSQL flexible server instance using CLI as shown in the examples below.

>[!Important]
> Using this command will delegate the subnet to **Microsoft.DBforPostgreSQL/flexibleServers**. This delegation means that only Azure Database for PostgreSQL flexible server instances can use that subnet. No other Azure resource types can be in the delegated subnet.
>
Refer to the Azure CLI reference documentation <!--FIXME --> for the complete list of configurable CLI parameters. For example, in the below commands you can optionally specify the resource group.

- Create an Azure Database for PostgreSQL flexible server instance using default virtual network, subnet with default address prefix
    ```azurecli-interactive
    az postgres flexible-server create
    ```
- Create an Azure Database for PostgreSQL flexible server instance using already existing virtual network and subnet. If provided virtual network and subnet do not exist, then virtual network and subnet with default address prefix will be created.
    ```azurecli-interactive
    az postgres flexible-server create --vnet myVnet --subnet mySubnet
    ```
- Create an Azure Database for PostgreSQL flexible server instance using already existing virtual network, subnet, and using the subnet ID. The provided subnet shouldn't have any other resource deployed in it and this subnet will be delegated to **Microsoft.DBforPostgreSQL/flexibleServers**, if not already delegated.
    ```azurecli-interactive
    az postgres flexible-server create --subnet /subscriptions/{SubID}/resourceGroups/{ResourceGroup}/providers/Microsoft.Network/virtualNetworks/{VNetName}/subnets/{SubnetName}
    ```
    > [!Note]
    > - The virtual network and subnet should be in the same region and subscription as your Azure Database for PostgreSQL flexible server instance.
    > - The virtual network should not have any resource lock set at the VNET or subnet level. Make sure to remove any lock (**Delete** or **Read only**) from your VNET and all subnets before creating the server in a virtual network, and you can set it back after server creation.

    > [!IMPORTANT]
    > The names including `AzureFirewallSubnet`, `AzureFirewallManagementSubnet`, `AzureBastionSubnet` and `GatewaySubnet` are reserved names within Azure. Please do not use these as your subnet name.

- Create an Azure Database for PostgreSQL flexible server instance using new virtual network, subnet with nondefault address prefix.
    ```azurecli-interactive
    az postgres flexible-server create --vnet myVnet --address-prefixes 10.0.0.0/24 --subnet mySubnet --subnet-prefixes 10.0.0.0/24
    ```
Refer to the Azure CLI [reference documentation](/cli/azure/postgres/flexible-server) for the complete list of configurable CLI parameters.

>[!Important]
> If you get an error `The parameter PrivateDnsZoneArguments is required, and must be provided by customer`, this means you may be running an older version of Azure CLI. Please [upgrade Azure CLI](/cli/azure/update-azure-cli) and retry the operation.

## Next steps
- Learn more about [private networking in Azure Database for PostgreSQL - Flexible Server](./concepts-networking-private.md).
- [Create and manage Azure Database for PostgreSQL - Flexible Server virtual network using Azure portal](./how-to-manage-virtual-network-portal.md).
