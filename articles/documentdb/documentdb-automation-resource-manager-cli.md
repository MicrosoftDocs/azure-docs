---
title: DocumentDB Automation - Azure CLI | Microsoft Docs
description: Use Azure CLI to manage DocumentDB database accounts. DocumentDB is a cloud-based NoSQL database for JSON data.
services: documentdb
author: dmakwana
manager: jhubbard
editor: ''
tags: azure-resource-manager
documentationcenter: ''

ms.assetid: 6158c27f-6b9a-404e-a234-b5d48c4a5b29
ms.service: documentdb
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 2/15/2017
ms.author: dimakwan

---
# Automate Azure DocumentDB account management using Azure CLI
> [!div class="op_single_selector"]
> * [Azure portal](documentdb-create-account.md)
> * [Azure CLI 1.0](documentdb-automation-resource-manager-cli-nodejs.md)
> * [Azure CLI 2.0](documentdb-automation-resource-manager-cli.md)
> * [Azure Powershell](documentdb-manage-account-with-powershell.md)

The following guide describes commands to automate management of your DocumentDB database accounts using Azure CLI. It also includes commands to manage account keys and failover priorities in [multi-region database accounts][scaling-globally]. Updating your database account allows you to modify consistency policies and add/remove regions. For cross-platform management of your DocumentDB database account, you can use either [Azure Powershell](documentdb-manage-account-with-powershell.md), the [Resource Provider REST API][rp-rest-api], or the [Azure portal](documentdb-create-account.md).

## Getting Started

Follow the instructions in [How to install and configure Azure CLI][install-az-cli2] to set up your development environment with Azure CLI 2.0.

Log in to your Azure account by executing the following command and following the on-screen steps.

    az login

### Notes

* Execute 'az documentdb -h' to get a full list of available commands or visit the [reference page][az-documentdb-ref]
* Execute 'az documentdb <command> -h' to get a list of details of the required and optional parameters per command

## <a id="create-documentdb-account-cli"></a> Create a DocumentDB Database Account

This command allows you to create a DocumentDB database account. Configure your new database account as either single-region or [multi-region][scaling-globally] with a certain [consistency policy](documentdb-consistency-levels.md). 

```
Arguments
    --name -n           [Required]: Name of the DocumentDB database account.
    --resource-group -g [Required]: Name of the resource group.
    --default-consistency-level   : Default consistency level of the DocumentDB database account.
                                    Allowed values: BoundedStaleness, Eventual, Session, Strong.
    --ip-range-filter             : Firewall support. Specifies the set of IP addresses or IP
                                    address ranges in CIDR form to be included as the allowed list
                                    of client IPs for a given database account. IP addresses/ranges
                                    must be comma separated and must not contain any spaces.
    --kind                        : The type of DocumentDB database account to create.  Allowed
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

Examples: 

    az documentdb create -g rg-test -n docdb-test
    az documentdb create -g rg-test -n docdb-test --kind MongoDB
    az documentdb create -g rg-test -n docdb-test --locations "East US"=0 "West US"=1 "South Central US"=2
    az documentdb create -g rg-test -n docdb-test --ip-range-filter "13.91.6.132,13.91.6.1/24"
    az documentdb create -g rg-test -n docdb-test --locations "East US"=0 "West US"=1 --default-consistency-level BoundedStaleness --max-interval 10 --max-staleness-prefix 200

### Notes
* The locations must be regions in which DocumentDB is generally available. The current list of regions is provided on the [Azure Regions page](https://azure.microsoft.com/regions/#services).

## <a id="update-documentdb-account-cli"></a> Update a DocumentDB Database Account

This command allows you to update your DocumentDB database account properties. This includes the consistency policy and the locations which the database account exists in.

> [!NOTE]
> This command allows you to add and remove regions but does not allow you to modify failover priorities. To modify failover priorities, see [below](#modify-failover-priority-powershell).

```
Arguments
    --name -n           [Required]: Name of the DocumentDB database account.
    --resource-group -g [Required]: Name of the resource group.
    --default-consistency-level   : Default consistency level of the DocumentDB database account.
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

    az documentdb update -g rg-test -n docdb-test --locations "East US"=0 "West US"=1 "South Central US"=2
    az documentdb update -g rg-test -n docdb-test --ip-range-filter "13.91.6.132,13.91.6.1/24"
    az documentdb update -g rg-test -n docdb-test --default-consistency-level BoundedStaleness --max-interval 10 --max-staleness-prefix 200

## <a id="delete-documentdb-account-cli"></a> Delete a DocumentDB Database Account

This command allows you to delete an existing DocumentDB database account.

```
Arguments
    --name -n           [Required]: Name of the DocumentDB database account.
    --resource-group -g [Required]: Name of the resource group.
```

Example:

    az documentdb delete -g rg-test -n docdb-test

## <a id="get-documentdb-properties-cli"></a> Get Properties of a DocumentDB Database Account

This command allows you to get the properties of an existing DocumentDB database account.

```
Arguments
    --name -n           [Required]: Name of the DocumentDB database account.
    --resource-group -g [Required]: Name of the resource group.
```

Example:

    az documentdb show -g rg-test -n docdb-test

## <a id="list-account-keys-cli"></a> List Account Keys

When you create a DocumentDB account, the service generates two master access keys that can be used for authentication when the DocumentDB account is accessed. By providing two access keys, DocumentDB enables you to regenerate the keys with no interruption to your DocumentDB account. Read-only keys for authenticating read-only operations are also available. There are two read-write keys (primary and secondary) and two read-only keys (primary and secondary).

```
Arguments
    --name -n           [Required]: Name of the DocumentDB database account.
    --resource-group -g [Required]: Name of the resource group.
```

Example:

    az documentdb list-keys -g rg-test -n docdb-test

## <a id="regenerate-account-key-cli"></a> Regenerate Account Key

You should change the access keys to your DocumentDB account periodically to help keep your connections more secure. Two access keys are assigned to enable you to maintain connections to the DocumentDB account using one access key while you regenerate the other access key.

```
Arguments
    --name -n           [Required]: Name of the DocumentDB database account.
    --resource-group -g [Required]: Name of the resource group.
    --key-kind          [Required]: The access key to regenerate.  Allowed values: primary, primaryReadonly,
                                    secondary, secondaryReadonly.
```

Example:

    az documentdb regenerate-key -g rg-test -n docdb-test --key-kind secondary

## <a id="modify-failover-priority-cli"></a> Modify Failover Priority of a DocumentDB Database Account

For multi-region database accounts, you can change the failover priority of the various regions which the DocumentDB database account exists in. For more information on failover in your DocumentDB database account, see [Distribute data globally with DocumentDB][distribute-data-globally].

```
Arguments
    --name -n           [Required]: Name of the DocumentDB database account.
    --resource-group -g [Required]: Name of the resource group.
    --failover-policies [Required]: Space separated failover policies in 'regionName=failoverPriority' format.
                                    E.g "East US"=0 "West US"=1.
```

Example:

    az documentdb failover-priority-change "East US"=1 "West US"=0 "South Central US"=2

<!--Reference style links - using these makes the source content way more readable than using inline links-->
[scaling-globally]: https://azure.microsoft.com/en-us/documentation/articles/documentdb-distribute-data-globally/#scaling-across-the-planet
[install-az-cli2]: https://docs.microsoft.com/en-us/cli/azure/install-az-cli2
[az-documentdb-ref]: https://docs.microsoft.com/en-us/cli/azure/documentdb
[az-documentdb-create-ref]: https://docs.microsoft.com/en-us/cli/azure/documentdb#create
[rp-rest-api]: https://docs.microsoft.com/en-us/rest/api/documentdbresourceprovider/
