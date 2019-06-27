---
title: Overview of Azure Resource Graph
description: Understand how the Azure Resource Graph service enables complex querying of resources at scale.
author: DCtheGeek
ms.author: dacoulte
ms.date: 05/06/2019
ms.topic: overview
ms.service: resource-graph
manager: carmonm
---
# Overview of the Azure Resource Graph service

Azure Resource Graph is a service in Azure that is designed to extend Azure Resource Management by
providing efficient and performant resource exploration with the ability to query at scale across a
given set of subscriptions so that you can effectively govern your environment. These queries
provide the following features:

- Ability to query resources with complex filtering, grouping, and sorting by resource properties.
- Ability to iteratively explore resources based on governance requirements.
- Ability to assess the impact of applying policies in a vast cloud environment.
- Ability to [detail changes made to resource properties](./how-to/get-resource-changes.md) (preview).

In this documentation, you'll go over each feature in detail.

> [!NOTE]
> Azure Resource Graph powers Azure portal's search bar, the new browse 'All resources' experience,
> and Azure Policy's [Change history](../policy/how-to/determine-non-compliance.md#change-history-preview)
> _visual diff_. It's designed to help customers manage large-scale environments.

[!INCLUDE [service-provider-management-toolkit](../../../includes/azure-lighthouse-supported-service.md)]

## How does Resource Graph complement Azure Resource Manager

Azure Resource Manager currently supports queries over basic resource fields, specifically -
Resource name, ID, Type, Resource Group, Subscription, and Location. Resource Manager also provides
facilities for calling individual resource providers for detailed properties one resource at a time.

With Azure Resource Graph, you can access these properties the resource providers return without
needing to make individual calls to each resource provider. For a list of supported resource types,
look for a **Yes** in the [Resources for complete mode deployments](../../azure-resource-manager/complete-mode-deletion.md)
table.

With Azure Resource Graph, you can:

- Access the properties returned by resource providers without needing to make individual calls to
  each resource provider.
- View the last 14 days of change history made to the resource to see what properties changed and
  when. (preview)

## How Resource Graph is kept current

When an Azure resource is updated, Resource Graph is notified by Resource Manager of the change.
Resource Graph then updates its database. Resource Graph also does a regular _full scan_. This scan
ensures that Resource Graph data is current if there are missed notifications or when a resource is
updated outside of Resource Manager.

## The query language

Now that you have a better understanding of what Azure Resource Graph is, let’s dive into how to
construct queries.

It's important to understand that Azure Resource Graph's query language is based on the [Kusto query language](../../data-explorer/data-explorer-overview.md)
used by Azure Data Explorer.

First, for details on operations and functions that can be used with Azure Resource Graph, see [Resource Graph query language](./concepts/query-language.md).
To browse resources, see [explore resources](./concepts/explore-resources.md).

## Permissions in Azure Resource Graph

To use Resource Graph, you must have appropriate rights in [Role-based access
control](../../role-based-access-control/overview.md) (RBAC) with at least read access to the
resources you want to query. Without at least `read` permissions to the Azure object or object
group, results won't be returned.

> [!NOTE]
> Resource Graph uses the subscriptions available to a principal during login. To see resources of a
> new subscription added during an active session, the principal must refresh the context. This
> action happens automatically when logging out and back in.

## Throttling

As a free service, queries to Resource Graph are throttled to provide the best experience and
response time for all customers. If your organization wants to use the Resource Graph API for
large-scale and frequent queries, use portal 'Feedback' from the
[Resource Graph portal page](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyMenuBlade/ResourceGraph).
Provide your business case and select the 'Microsoft can email you about your feedback' checkbox in
order for the team to contact you.

Resource Graph throttles queries at the user level. The service response contains the following HTTP
headers:

- `x-ms-user-quota-remaining` (int): The remaining resource quota for the user. This value maps to
  query count.
- `x-ms-user-quota-resets-after` (hh:mm:ss): The time duration until a user's quota consumption is reset

For more information, see
[Guidance for throttled requests](./concepts/guidance-for-throttled-requests.md).

## Running your first query

Resource Graph supports Azure CLI, Azure PowerShell, and Azure SDK for .NET. The query is structured
the same for each language. Learn how to enable Resource Graph in [Azure
CLI](first-query-azurecli.md#add-the-resource-graph-extension) and [Azure
PowerShell](first-query-powershell.md#add-the-resource-graph-module).

## Next steps

- Run your first query with [Azure CLI](first-query-azurecli.md).
- Run your first query with [Azure PowerShell](first-query-powershell.md).
- Start with [Starter Queries](./samples/starter.md).
- Enhance your understanding with [Advanced Queries](./samples/advanced.md).