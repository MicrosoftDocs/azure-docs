---
title: Azure Database for MySQL - resource not found errors
description: Describes how to resolve errors for resource not found , Parent resource not found errors
author: mksuni
ms.author: sumuth
ms.service: mysql
ms.custom: mvc, devcenter, devx-track-azurecli
ms.topic: troubleshooting
ms.date: 01/16/2021
---
# Resolve resource not found errors

This article describes the error you see when a resource can't be found during the following operations:
- a creating a MySQL Single Server
- creating , updating or deleting a Firewall rule
- creating , updating or deleting a service endpoint
- creating , updating or deleting a private link

Typically, you see this error when deploying resources using ARM templates , or using CLI or using REST APIs.

## Symptom

There are two error codes that indicate the resource can't be found. The **NotFound** error returns a result similar to:

```
Code=NotFound;
Message=Cannot find ServerFarm with name exampleplan.
```

The **ResourceNotFound** error returns a result similar to:

```
Code=ResourceNotFound;
Message=The Resource 'Microsoft.Storage/storageAccounts/{storage name}' under resource
group {resource group name} was not found.
```

The **ParentResourceNotFound** error returns a result similar to:

```
Code=ResourceNotFound;
Message=The Resource 'Microsoft.Storage/storageAccounts/{storage name}' under resource
group {resource group name} was not found.
```

## Cause

Resource Manager needs to retrieve the properties for a resource, but can't find the resource in your subscriptions.

## Solution 1 - check resource properties

When you receive this error while doing a management task, check the values you provide for the resource. The three values to check are:

* Resource name
* Resource group name
* Subscription

You can run [**az postgres server list**](/cli/azure/postgres/server?view=azure-cli-latest#az_postgres_server_list) to see all your servers in the subscription.

If you do not see the  resource listed here , you can run [**az resource list**](/cli/azure/resource?view=azure-cli-latest#az_resource_list) to see all the resources if they are in the right subscription and resource group .

## Solution 2 - Check the Sku of your server

If you are using Basic tier and try to enable service endpoints or Private link , you might see this error. The reason you see this error is because Basic tier does not support private link and service endpoints.

Upgrade to General Purpose tier and then set up private link or service endpoints. You cannot upgrade from Basic to General Purpose usingAzure Portal, hence follow these [steps to upgrade to General purpose](https://techcommunity.microsoft.com/t5/azure-database-for-MySQL/upgrade-from-basic-to-general-purpose-or-memory-optimized-tiers/ba-p/690976).


## Solution 3 - Automated deployment using ARM templates

If you are using a custom ARM template to deploy and configure MySQL Single server, checkout [other possible solutions to resolve](../azure-resource-manager/templates/error-not-found.md) this error.