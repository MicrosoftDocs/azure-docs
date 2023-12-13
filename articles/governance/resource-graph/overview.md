---
title: Overview of Azure Resource Graph
description: Understand how the Azure Resource Graph service enables complex querying of resources at scale across subscriptions and tenants.
ms.date: 10/31/2023
ms.topic: overview
ms.custom: devx-track-arm-template
ms.author: davidsmatlak
author: davidsmatlak
---

# What is Azure Resource Graph?

Azure Resource Graph is an Azure service designed to extend Azure Resource Management by
providing efficient and performant resource exploration with the ability to query at scale across a
given set of subscriptions so that you can effectively govern your environment. These queries
provide the following abilities:

- Query resources with complex filtering, grouping, and sorting by resource properties.
- Explore resources iteratively based on governance requirements.
- Assess the effect of applying policies in a vast cloud environment.
- [Query changes made to resource properties](./how-to/get-resource-changes.md).

In this documentation, you review each feature in detail.

> [!NOTE]
> Azure Resource Graph powers Azure portal's search bar, the new browse **All resources** experience,
> and Azure Policy's [Change history](../policy/how-to/determine-non-compliance.md#change-history-preview)
> _visual diff_. It's designed to help customers manage large-scale environments.

[!INCLUDE [azure-lighthouse-supported-service](../../../includes/azure-lighthouse-supported-service.md)]

## How Resource Graph complements Azure Resource Manager

Azure Resource Manager currently supports queries over basic resource fields, specifically:

- Resource name
- ID
- Type
- Resource Group
- Subscription
- Location

Azure Resource Manager also provides
facilities for calling individual resource providers for detailed properties one resource at a time.

With Azure Resource Graph, you can access these properties the resource providers return without
needing to make individual calls to each resource provider. For a list of supported resource types,
review the [table and resource type reference](./reference/supported-tables-resources.md). An
alternative way to see supported resource types is through the
[Azure Resource Graph Explorer Schema browser](./first-query-portal.md#schema-browser).

With Azure Resource Graph, you can:

- Access the properties returned by resource providers without needing to make individual calls to
  each resource provider.
- View the last 14 days of resource configuration changes to see which properties changed and
  when.

> [!NOTE]
> As a _preview_ feature, some `type` objects have additional non-Resource Manager properties
> available. For more information, see
> [Extended properties](./concepts/query-language.md#extended-properties).

## How Resource Graph is kept current

When an Azure resource is updated, Azure Resource Manager notifies Azure Resource Graph about the change. Azure Resource Graph then updates its database. Azure Resource Graph also does a regular _full scan_. This scan ensures that Azure Resource Graph data is current if there are missed notifications or when a resource is updated outside of Azure Resource Manager.

> [!NOTE]
> Resource Graph uses a `GET` to the latest non-preview application programming interface (API) of each resource provider to gather
> properties and values. As a result, the property expected may not be available. In some cases, the
> API version used has been overridden to provide more current or widely used properties in the
> results. See the [Show API version for each resource type](./samples/advanced.md#apiversion)
> sample for a complete list in your environment.

## The query language

Now that you have a better understanding of what Azure Resource Graph is, let's dive into how to
construct queries.

It's important to understand that Azure Resource Graph's query language is based on the
[Kusto Query Language (KQL)](/azure/data-explorer/data-explorer-overview) used by Azure Data Explorer.

First, for details on operations and functions that can be used with Azure Resource Graph, see
[Resource Graph query language](./concepts/query-language.md). To browse resources, see
[explore resources](./concepts/explore-resources.md).

## Permissions in Azure Resource Graph

To use Resource Graph, you must have appropriate rights in [Azure role-based access control (Azure
RBAC)](../../role-based-access-control/overview.md) with at least `read` access to the resources you
want to query. No results are returned if you don't have at least `read` permissions to the Azure
object or object group.

> [!NOTE]
> Resource Graph uses the subscriptions available to a principal during login. To see resources of a
> new subscription added during an active session, the principal must refresh the context. This
> action happens automatically when logging out and back in.

Azure CLI and Azure PowerShell use subscriptions that the user has access to. When you use a REST
API, the subscription list is provided by the user. If the user has access to any of the
subscriptions in the list, the query results are returned for the subscriptions the user has access
to. This behavior is the same as when calling [Resource Groups - List](/rest/api/resources/resourcegroups/list)
because you get resource groups that you can access, without any indication that the result might be
partial. If there are no subscriptions in the subscription list that the user has appropriate rights
to, the response is a _403_ (Forbidden).

> [!NOTE]
> In the **preview** REST API version `2020-04-01-preview`, the subscription list may be omitted.
> When both the `subscriptions` and `managementGroupId` properties aren't defined in the request,
> the _scope_ is set to the tenant. For more information, see
> [Scope of the query](./concepts/query-language.md#query-scope).

## Throttling

As a free service, queries to Resource Graph are throttled to provide the best experience and
response time for all customers. If your organization wants to use the Resource Graph API for
large-scale and frequent queries, use portal **Feedback** from the
[Resource Graph portal page](https://portal.azure.com/#blade/HubsExtension/ArgQueryBlade).
Provide your business case and select the **Microsoft can email you about your feedback** checkbox in
order for the team to contact you.

Resource Graph throttles queries at the user level. The service response contains the following HTTP
headers:

- `x-ms-user-quota-remaining` (int): The remaining resource quota for the user. This value maps to
  query count.
- `x-ms-user-quota-resets-after` (hh:mm:ss): The time duration until a user's quota consumption is
  reset

For more information, see
[Guidance for throttled requests](./concepts/guidance-for-throttled-requests.md).

## Running your first query

Azure Resource Graph Explorer, part of Azure portal, enables running Resource Graph queries directly
in the Azure portal. Pin the results as dynamic charts to provide real-time dynamic information to
your portal workflow. For more information, see
[First query with Azure Resource Graph Explorer](./first-query-portal.md).

Resource Graph supports Azure CLI, Azure PowerShell, Azure SDK for Python, and more. The query is
structured the same for each language. Learn how to enable Resource Graph with:

- [Azure portal and Resource Graph Explorer](./first-query-portal.md)
- [Azure CLI](./first-query-azurecli.md#add-the-resource-graph-extension)
- [Azure PowerShell](./first-query-powershell.md#add-the-resource-graph-module)
- [Python](./first-query-python.md#add-the-resource-graph-library)

## Alerts integration with Log Analytics

> [!NOTE]
> Azure Resource Graph alerts integration with Log Analytics is in public preview.

You can create alert rules by using either Azure Resources Graph queries or integrating Log Analytics with Azure Resources Graph queries through Azure Monitor. Both methods can be used to create alerts for Azure resources. For examples, go to [Quickstart: Create alerts with Azure Resource Graph and Log Analytics](./alerts-query-quickstart.md).

## Next steps

- Learn more about the [query language](./concepts/query-language.md).
- See the language in use in [Starter queries](./samples/starter.md).
- See advanced uses in [Advanced queries](./samples/advanced.md).
