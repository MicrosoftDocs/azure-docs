---
title: Create and manage Azure Database for PostgreSQL VNet service endpoints and rules using Azure CLI | Microsoft Docs
description: This article describes how to create and manage Azure Database for PostgreSQL VNet service endpoints and rules using Azure CLI command line.
services: postgresql
author: mbolz
ms.author: mbolz
manager: jhubbard
editor: jasonwhowell
ms.service: postgresql
ms.devlang: azure-cli
ms.topic: article
ms.date: 1/11/2018
---
# Create and manage Azure Database for PostgreSQL VNet service endpoints using Azure CLI
Virtual Network (VNet) services endpoints and rules extend the private address space of Virtual Network to your Azure Database for PostgreSQL server. Using convenient Azure CLI commands, you can create, update, delete, list, and show VNet service endpoints and rules to manage your server. For an overview of Azure Database for PostgreSQL VNet service endpoints, see [Azure Database for PostgreSQL Server VNet service endpoints](concepts-data-access-and-security-vnet)

## Prerequisites
To step through this how-to guide, you need:
- Install [Azure CLI 2.0](/cli/azure/install-azure-cli) command-line utility or use the Azure Cloud Shell in the browser.

## Configure Vnet service endpoints for Azure Database for PostgreSQL
The [az network vnet](https://docs.microsoft.com/cli/azure/network/vnet?view=azure-cli-latest) commands are used to configure service endpoints. The examples in this article build off the resource group and database created in this article [Create an Azure Database for PostgreSQL using the Azure CLI](quickstart-create-server-database-azure-cli).

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

[!INCLUDE [cloud-shell-try-it](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. To see the version installed, run the `az --version` command. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

If you are running the CLI locally, you need to log in to your account using the [az login](/cli/azure/authenticate-azure-cli?view=interactive-log-in) command. Note the **id** property from the command output for the corresponding subscription name.
```azurecli-interactive
az login
```

If you have multiple subscriptions, choose the appropriate subscription in which the resource should be billed. Select the specific subscription ID under your account using [az account set](/cli/azure/account#az_account_set) command. Substitute the **id** property from the **az login** output for your subscription into the subscription id placeholder.

- The account must have the necessary to create a virtual network and service endpoint.

Service endpoints can be configured on virtual networks independently, by a user with write access to virtual network.

To secure Azure service resources to a VNet, the user must have permission to "Microsoft.Network/JoinServicetoaSubnet" for the subnets being added. This permission is included in the built-in service administrator roles, by default and can be modified by creating custom roles.

Learn more about [built-in roles](https://docs.microsoft.com/azure/active-directory/role-based-access-built-in-roles) and assigning specific permissions to [custom roles](https://docs.microsoft.com/azure/active-directory/role-based-access-control-custom-roles).

VNets and Azure service resources can be in the same or different subscriptions. If these are in different subscriptions, the resources should be under the same Active Directory (AD) tenant, at the time of this preview.

```azurecli-interactive
az account set --subscription <subscription id>
```

### Sample script to create 
In this sample script, change the highlighted lines to customize the admin username and password. Replace the SubscriptionID used in the az monitor commands with your own subscription identifier.
[!code-azurecli-interactive[main](../../../cli_scripts/postgresql/create-postgresql-server/create-postgresql-server.sh?highlight=15-16 "Create an Azure Database for PostgreSQL.")]

### Get available service endpoints for Azure region

Use the command below to get the list of services supported for endpoints, for an Azure region, say "westus".
```azure-cli
az network vnet list-endpoint-services -l westus
```
Output:
```
    {
    "id": "/subscriptions/xxxx-xxxx-xxxx/providers/Microsoft.Network/virtualNetworkEndpointServices/Microsoft.Storage",
    "name": "Microsoft.Storage",
    "type": "Microsoft.Network/virtualNetworkEndpointServices"
     },
     {
     "id": "/subscriptions/xxxx-xxxx-xxxx/providers/Microsoft.Network/virtualNetworkEndpointServices/Microsoft.Sql",
     "name": "Microsoft.Sql",
     "type":   "Microsoft.Network/virtualNetworkEndpointServices"
     }
```

### Add Azure SQL service endpoint to a subnet *mySubnet* while creating the virtual network *myVNet*

**Virtual Network service endpoint:** A [Virtual Network service endpoint](../virtual-network/virtual-network-service-endpoints-overview) is a subnet whose property values include one or more formal Azure service type names. In this article we are interested in the type name of **Microsoft.Sql**, which refers to the Azure service named SQL Database. This service tag also applies to the Azure Database for PostgreSQL and MySQL services. It is important to note when applying the **Microsoft.Sql** service tag to a VNet service endpoint it will configure service endpoint traffic for all Azure SQL Database, Azure Database for PostgreSQL and Azure Database for MySQL servers on the subnet. 

```azure-cli
az network vnet create -g myRG -n myVNet --address-prefixes 10.0.0.0/16 -l westus

az network vnet subnet create -g myRG -n mySubnet --vnet-name myVNet --address-prefix 10.0.1.0/24 --service-endpoints Microsoft.SQL
```

To add multiple endpoints: 
--service-endpoints Microsoft.Storage Microsoft.Sql

Output:
```
{
  "addressPrefix": "10.0.1.0/24",
  ...
  "name": "mySubnet",
  "networkSecurityGroup": null,
  "provisioningState": "Succeeded",
  "resourceGroup": "myRG",
  "resourceNavigationLinks": null,
  "routeTable": null,
  "serviceEndpoints": [
    {
      "locations": [
        "eastus",
        "westus"
      ],
      "provisioningState": "Succeeded",
      "service": "Microsoft.Storage"
    }
  ]
}
```

### View service endpoints configured on a subnet

```azure-cli
az network vnet subnet show -g myRG -n mySubnet --vnet-name myVNet
```

### Delete service endpoints on a subnet
```azure-cli
az network vnet subnet update -g myRG -n mySubnet --vnet-name myVNet --service-endpoints ""
```

Output: 
```
{
  "addressPrefix": "10.0.1.0/24",
  ...
  "name": "mySubnet",
  "networkSecurityGroup": null,
  "provisioningState": "Succeeded",
  "resourceGroup": "myRG",
  "resourceNavigationLinks": null,
  "routeTable": null,
  "serviceEndpoints": null
}
```

### Deleting service endpoints with resources secured to the subnet
If Azure service resources are secured to the subnet and the service endpoint is deleted, you cannot access the resource from the subnet anymore.
Re-enabling the endpoint alone won't restore access to the resources previously secured to the subnet.

To secure the service resource to this subnet again, you need to:

- enable the endpoint again
- remove the old vnet rule on the resource
- add a new rule securing the resource to the subnet
