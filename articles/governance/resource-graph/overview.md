---
title: Overview of Azure Resource Graph
description: Azure Resource Graph is a service in Azure that enables complex querying of resources at scale.
services: resource-graph
author: DCtheGeek
ms.author: dacoulte
ms.date: 09/18/2018
ms.topic: overview
ms.service: resource-graph
manager: carmonm
ms.custom: mvc
---
# What is Azure Resource Graph

Azure Resource Graph is a service in Azure that is designed to extend Azure Resource Management by
providing efficient and performant resource exploration with the ability to query at scale across
all subscriptions and management groups so that you can effectively govern your environment. These
queries provide the following capabilities:

- Ability to query resources with complex filtering, grouping, and sorting by resource properties.
- Ability to iteratively explore resources based on governance requirements and convert the resulting expression into a policy definition.
- Ability to assess the impact of applying policies in a vast cloud environment.

In this documentation, you'll go over each capability in detail.

> [!NOTE]
> Azure Resource Graph is used by Azure portal's new browse 'All resources' experience. It is
> designed to help customers with a need to manage large-scale environments.

## How does Resource Graph complement Azure Resource Manager

Azure Resource Manager currently sends data to a limited resource cache that exposes several
resource fields, specifically – Resource name, ID, Type, Resource Group, Subscriptions, and
Location. Today, if you wanted to work with more resource properties, you would have to make calls
to each individual resource provider and request property details for each resource.

With Azure Resource Graph, you can access these properties the resource providers return without
needing to make individual calls to each resource provider.

## The query language

Now that you have a better understanding of what Azure Resource Graph is, let’s dive into how to
construct queries.

It's important to understand that Azure Resource Graph's query language is based on the
[Azure Data Explorer Query Language](../../data-explorer/data-explorer-overview.md).

First, for details on operations and functions that can be used with Azure Resource Graph, see [Resource
Graph query language](./concepts/query-language.md). To browse resources, see [explore resources](./concepts/explore-resources.md).

## Permissions in Azure Resource Graph

To use Resource Graph, you must be authorized through [Role-based access
control](../../role-based-access-control/overview.md) (RBAC) with at least read access to the
resources you want to query. If you don't have `read` permissions on the management group,
subscription, resource group, or individual resource, it won't be returned in the results of a
Resource Graph query.

## Running your first query

Resource Graph supports both Azure CLI and Azure PowerShell. The query component is structured the
same regardless of which language is used. Support for Azure Resource Graph isn't yet available by
default in either SDK, so an extension or module must be loaded to provide the needed commands.
Learn how to enable Resource Graph in [Azure
CLI](first-query-azurecli.md#add-the-resource-graph-extension) and [Azure
PowerShell](first-query-powershell.md#add-the-resource-graph-module).

## Next steps

- Run your first query with [Azure CLI](first-query-azurecli.md)
- Run your first query with [Azure PowerShell](first-query-powershell.md)
- Start with [Starter Queries](./samples/starter.md)
- Enhance your understanding with [Advanced Queries](./samples/advanced.md)