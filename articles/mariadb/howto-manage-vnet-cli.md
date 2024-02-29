---
title: Manage VNet endpoints - Azure CLI - Azure Database for MariaDB
description: This article describes how to create and manage Azure Database for MariaDB VNet service endpoints and rules using Azure CLI command line.
ms.service: mariadb
author: SudheeshGH
ms.author: sunaray
ms.devlang: azurecli
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 06/24/2022
---
# Create and manage Azure Database for MariaDB VNet service endpoints using Azure CLI

[!INCLUDE [azure-database-for-mariadb-deprecation](includes/azure-database-for-mariadb-deprecation.md)]

Virtual Network (VNet) services endpoints and rules extend the private address space of a Virtual Network to your Azure Database for MariaDB server. Using convenient Azure CLI commands, you can create, update, delete, list, and show VNet service endpoints and rules to manage your server. For an overview of Azure Database for MariaDB VNet service endpoints, including limitations, see [Azure Database for MariaDB Server VNet service endpoints](concepts-data-access-security-vnet.md). VNet service endpoints are available in all supported regions for Azure Database for MariaDB.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- You need an [Azure Database for MariaDB server and database](quickstart-create-mariadb-server-database-using-azure-cli.md).

> [!NOTE]
> Support for VNet service endpoints is only for General Purpose and Memory Optimized servers.

## Configure VNet service endpoints

The [az network vnet](/cli/azure/network/vnet) commands are used to configure Virtual Networks. Service endpoints can be configured on virtual networks independently, by a user with write access to the virtual network.

To secure Azure service resources to a VNet, the user must have permission to "Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/" for the subnets being added. This permission is included in the built-in service administrator roles, by default and can be modified by creating custom roles.

Learn more about [built-in roles](../role-based-access-control/built-in-roles.md) and assigning specific permissions to [custom roles](../role-based-access-control/custom-roles.md).

VNets and Azure service resources can be in the same or different subscriptions. If the VNet and Azure service resources are in different subscriptions, the resources should be under the same Active Directory (AD) tenant. Ensure that both the subscriptions have the **Microsoft.Sql** resource provider registered. For more information refer [resource-manager-registration][resource-manager-portal]

> [!IMPORTANT]
> It is highly recommended to read this article about service endpoint configurations and considerations before configuring service endpoints. **Virtual Network service endpoint:** A [Virtual Network service endpoint](../virtual-network/virtual-network-service-endpoints-overview.md) is a subnet whose property values include one or more formal Azure service type names. VNet services endpoints use the service type name **Microsoft.Sql**, which refers to the Azure service named SQL Database. This service tag also applies to the Azure SQL Database, Azure Database for MariaDB, PostgreSQL, and MySQL services. It is important to note when applying the **Microsoft.Sql** service tag to a VNet service endpoint it configures service endpoint traffic for all Azure Database services, including Azure SQL Database, Azure Database for PostgreSQL, Azure Database for MariaDB, and Azure Database for MySQL servers on the subnet.

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/mariadb/create-mariadb-server-vnet/create-mariadb-server.sh" id="FullScript":::

## Clean up deployment

[!INCLUDE [cli-clean-up-resources.md](../../includes/cli-clean-up-resources.md)]

   ```azurecli
   echo "Cleaning up resources by removing the resource group..."
   az group delete --name $resourceGroup -y

   ```

<!-- Link references, to text, Within this same GitHub repo. -->
[resource-manager-portal]: ../azure-resource-manager/management/resource-providers-and-types.md
