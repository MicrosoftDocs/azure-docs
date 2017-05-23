---
title: Azure Cosmos DB Automation - Azure CLI 2.0 | Microsoft Docs
description: Use Azure CLI 2.0 to create and manage Azure Cosmos DB accounts. Azure Cosmos DB is a highly available globally-distributed database.
services: cosmosdb
author: dmakwana
manager: jhubbard
editor: ''
tags: azure-resource-manager
documentationcenter: ''

ms.assetid: 6158c27f-6b9a-404e-a234-b5d48c4a5b29
ms.custom: quick start create
ms.service: cosmosdb
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: azurecli
ms.topic: article
ms.date: 04/20/2017
ms.author: dimakwan

---
# Create an Azure Cosmos DB account using the Azure CLI

The following guide describes commands to automate management of your Azure Cosmos DB database accounts using the preview commands available in Azure CLI 2.0. It also includes commands to manage account keys and failover priorities in [multi-region database accounts][scaling-globally]. Updating your database account enables you to modify consistency policies and add/remove regions. For cross-platform management of your Azure Cosmos DB database account, you can use either [Azure Powershell](documentdb-manage-account-with-powershell.md), the [Resource Provider REST API][rp-rest-api], or the [Azure portal](documentdb-create-account.md).

## Getting started

Follow the instructions in [How to install and configure Azure CLI 2.0][install-az-cli2] to set up your development environment with Azure CLI 2.0.

Log in to your Azure account by executing the following command and following the on-screen steps.

```azurecli
az login
```

If you do not already have an existing [resource group](../azure-resource-manager/resource-group-overview.md#resource-groups), create one:

```azurecli
az group create --name <resourcegroupname> --location <resourcegrouplocation>
az group list
```

The `<resourcegrouplocation>` must be one of the regions in which Azure Cosmos DB is generally available. The current list of regions is provided on the [Azure Regions page](https://azure.microsoft.com/regions/#services).

### Notes

* Execute 'az cosmosdb -h' to get a full list of available commands or visit the [reference page][az-documentdb-ref].
* Execute 'az cosmosdb &lt;command&gt; -h' to get a list of details of the required and optional parameters per command.

## Register your subscription to use Azure Cosmos DB

This command registers your subscription to use Azure Cosmos DB via CLI.

```azurecli
az provider register -n Microsoft.DocumentDB 
```

## <a id="create-documentdb-account-cli"></a> Create an Azure Cosmos DB database account

This command enables you to create an Azure Cosmos DB database account. Configure your new database account as either single-region or [multi-region][scaling-globally] with a certain [consistency policy](documentdb-consistency-levels.md).

```
Arguments
    --name -n           [Required]: Name of the Azure Cosmos DB database account. The account 
                                    name must be unique.
    --resource-group -g [Required]: Name of the resource group.
    --default-consistency-level   : Default consistency level of the Azure Cosmos DB database account.
                                    Allowed values: BoundedStaleness, Eventual, Session, Strong.
    --ip-range-filter             : Firewall support. Specifies the set of IP addresses or IP
                                    address ranges in CIDR form to be included as the allowed list
                                    of client IPs for a given database account. IP addresses/ranges
                                    must be comma separated and must not contain any spaces.
    --kind                        : The type of Azure Cosmos DB database account to create.  Allowed
                                    values: GlobalDocumentDB, MongoDB, Parse.  Default:
                                    GlobalDocumentDB.
    --locations                   : Space separated locations in 'regionName=failoverPriority'
                                    format. E.g "East US"=0 "West US"=1. Failover priority values
                                    are 0 for write regions and greater than 0 for read regions. A
                                    failover priority value must be unique and less than the total
                                    number of regions. Default: single region account in the
                                    location of the specified resource group.
    --max-interval                : When used with Bounded Staleness consistency, this value
                                    represents the time amount of staleness (in seconds) tolerated.
                                    Accepted range for this value is 1 - 100.  Default: 5.
    --max-staleness-prefix        : When used with Bounded Staleness consistency, this value
                                    represents the number of stale requests tolerated. Accepted
                                    range for this value is 1 - 2,147,483,647.  Default: 100.
```

```azurecli
az cosmosdb create -g <resourcegroupname> -n <uniquedocumentdbaccountname> --kind <typeofdatabaseaccount>
```

Examples: 

    az cosmosdb create -g rg-test -n docdb-test
    az cosmosdb create -g rg-test -n docdb-test --kind MongoDB
    az cosmosdb create -g rg-test -n docdb-test --locations "East US"=0 "West US"=1 "South Central US"=2
    az cosmosdb create -g rg-test -n docdb-test --ip-range-filter "13.91.6.132,13.91.6.1/24"
    az cosmosdb create -g rg-test -n docdb-test --locations "East US"=0 "West US"=1 --default-consistency-level BoundedStaleness --max-interval 10 --max-staleness-prefix 200

### Notes 
* The locations must be regions in which Azure Cosmos DB is generally available. The current list of regions is provided on the [Azure Regions page](https://azure.microsoft.com/regions/#services).
* To enable portal access, include the IP address for the Azure portal for your region in the ip-range-filter, as specified in [Configuring the IP access control policy](documentdb-firewall-support.md#configure-ip-policy).

## <a id="update-documentdb-account-cli"></a> Update an Azure Cosmos DB database account

This command enables you to update your Azure Cosmos DB database account properties. This includes the consistency policy and the locations which the database account exists in.

> [!NOTE]
> This command enables you to add and remove regions but does not allow you to modify failover priorities. To modify failover priorities, see [below](#modify-failover-priority-powershell).

```
Arguments
    --name -n           [Required]: Name of the Azure Cosmos DB database account.
    --resource-group -g [Required]: Name of the resource group.
    --default-consistency-level   : Default consistency level of the Azure Cosmos DB database account.
                                    Allowed values: BoundedStaleness, Eventual, Session, Strong.
    --ip-range-filter             : Firewall support. Specifies the set of IP addresses or IP address
                                    ranges in CIDR form to be included as the allowed list of client
                                    IPs for a given database account. IP addresses/ranges must be comma
                                    separated and must not contain any spaces.
    --locations                   : Space separated locations in 'regionName=failoverPriority' format.
                                    E.g "East US"=0. Failover priority values are 0 for write regions
                                    and greater than 0 for read regions. A failover priority value must
                                    be unique and less than the total number of regions.
    --max-interval                : When used with Bounded Staleness consistency, this value represents
                                    the time amount of staleness (in seconds) tolerated. Accepted range
                                    for this value is 1 - 100.
    --max-staleness-prefix        : When used with Bounded Staleness consistency, this value represents
                                    the number of stale requests tolerated. Accepted range for this
                                    value is 1 - 2,147,483,647.
```

Examples: 

    az cosmosdb update -g rg-test -n docdb-test --locations "East US"=0 "West US"=1 "South Central US"=2
    az cosmosdb update -g rg-test -n docdb-test --ip-range-filter "13.91.6.132,13.91.6.1/24"
    az cosmosdb update -g rg-test -n docdb-test --default-consistency-level BoundedStaleness --max-interval 10 --max-staleness-prefix 200

## <a id="add-remove-region-documentdb-account-cli"></a> Add/remove region from an Azure Cosmos DB database account

To add or remove region(s) from your existing Azure Cosmos DB database account, use the [update](#update-documentdb-account-cli) command with the `--locations` flag. The example below shows how to create a new account and subsequently add and remove regions from that account.

Example:

    az cosmosdb create -g rg-test -n docdb-test --locations "East US"=0 "West US"=1
    az cosmosdb update -g rg-test -n docdb-test --locations "East US"=0 "North Europe"=1 "South Central US"=2


## <a id="delete-documentdb-account-cli"></a> Delete an Azure Cosmos DB database account

This command enables you to delete an existing Azure Cosmos DB database account.

```
Arguments
    --name -n           [Required]: Name of the Azure Cosmos DB database account.
    --resource-group -g [Required]: Name of the resource group.
```

Example:

    az cosmosdb delete -g rg-test -n docdb-test

## <a id="get-documentdb-properties-cli"></a> Get properties of an Azure Cosmos DB database account

This command enables you to get the properties of an existing Azure Cosmos DB database account.

```
Arguments
    --name -n           [Required]: Name of the Azure Cosmos DB database account.
    --resource-group -g [Required]: Name of the resource group.
```

Example:

    az cosmosdb show -g rg-test -n docdb-test

## <a id="list-account-keys-cli"></a> List account keys

When you create an Azure Cosmos DB account, the service generates two master access keys that can be used for authentication when the Azure Cosmos DB account is accessed. By providing two access keys, Azure Cosmos DB enables you to regenerate the keys with no interruption to your Azure Cosmos DB account. Read-only keys for authenticating read-only operations are also available. There are two read-write keys (primary and secondary) and two read-only keys (primary and secondary).

```
Arguments
    --name -n           [Required]: Name of the Azure Cosmos DB database account.
    --resource-group -g [Required]: Name of the resource group.
```

Example:

    az cosmosdb list-keys -g rg-test -n docdb-test

## <a id="list-connection-strings-cli"></a> List connection strings

For MongoDB accounts, the connection string to connect your MongoDB app to the database account can be retrieved using the following command.

```
Arguments
    --name -n           [Required]: Name of the Azure Cosmos DB database account.
    --resource-group -g [Required]: Name of the resource group.
```

Example:

    az cosmosdb list-connection-strings -g rg-test -n docdb-test

## <a id="regenerate-account-key-cli"></a> Regenerate account key

You should change the access keys to your Azure Cosmos DB account periodically to help keep your connections more secure. Two access keys are assigned to enable you to maintain connections to the Azure Cosmos DB account using one access key while you regenerate the other access key.

```
Arguments
    --name -n           [Required]: Name of the Azure Cosmos DB database account.
    --resource-group -g [Required]: Name of the resource group.
    --key-kind          [Required]: The access key to regenerate.  Allowed values: primary, primaryReadonly,
                                    secondary, secondaryReadonly.
```

Example:

    az cosmosdb regenerate-key -g rg-test -n docdb-test --key-kind secondary

## <a id="modify-failover-priority-cli"></a> Modify failover priority of an Azure Cosmos DB database account

For multi-region database accounts, you can change the failover priority of the various regions which the Azure Cosmos DB database account exists in. For more information on failover in your Azure Cosmos DB database account, see [Distribute data globally with Azure Cosmos DB](documentdb-distribute-data-globally.md).

```
Arguments
    --name -n           [Required]: Name of the Azure Cosmos DB database account.
    --resource-group -g [Required]: Name of the resource group.
    --failover-policies [Required]: Space separated failover policies in 'regionName=failoverPriority' format.
                                    E.g "East US"=0 "West US"=1.
```

Example:

    az cosmosdb failover-priority-change "East US"=1 "West US"=0 "South Central US"=2

## Next steps

* To connect using .NET, see [Connect and query with .NET](../cosmos-db/create-documentdb-dotnet.md).
* To connect using .NET Core, see [Connect and query with .NET Core](../cosmos-db/create-documentdb-dotnet-core.md).
* To connect using Node.js, see [Connect and query with Node.js and a MongoDB app](../cosmos-db/create-mongodb-nodejs.md).

<!--Reference style links - using these makes the source content way more readable than using inline links-->
[scaling-globally]: https://azure.microsoft.com/documentation/articles/documentdb-distribute-data-globally/#scaling-across-the-planet
[install-az-cli2]: https://docs.microsoft.com/cli/azure/install-az-cli2
[az-documentdb-ref]: https://docs.microsoft.com/cli/azure/documentdb
[az-documentdb-create-ref]: https://docs.microsoft.com/cli/azure/documentdb#create
[rp-rest-api]: https://docs.microsoft.com/rest/api/documentdbresourceprovider/
