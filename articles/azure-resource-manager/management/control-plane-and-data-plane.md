---
title: Control plane and data plane operations
description: Describes the difference between control plane and data plane operations. Control plane operations are handled by Azure Resource Manager. Data plane operations are handled by a service.
ms.topic: conceptual
ms.date: 09/09/2020
---
# Azure control plane and data plane

Azure operations can be divided into two categories - control plane and data plane. This article describes the differences between those two types of operations.

You use the control plane to manage resources in your subscription. You use the data plane to use capabilities exposed by your instance of a resource type.

For example:

* You create a virtual machine through the control plane. After the virtual machine is created, you interact with it through data plane operations, such as Remote Desktop Protocol (RDP).

* You create a storage account through the control plane. You use the data plane to read and write data in the storage account.

* You create a Cosmos database through the control plane. To query data in the Cosmos database, you use the data plane.

## Control plane

All requests for control plane operations are sent to `https://management.azure.com`. To discover which operations use `https://management.azure.com`, see the [Azure REST API](/rest/api/azure/). For example, the [create or update operation](/rest/api/mysql/databases/createorupdate) for MySql is a control plane operation because the request URL is:

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforMySQL/servers/{serverName}/databases/{databaseName}?api-version=2017-12-01
```

Azure Resource Manager handles all control plane requests. It automatically applies the Azure features you've implemented to manage your resources, such as:

* [Azure Role-based Access Control (RBAC)](../../role-based-access-control/overview.md)
* [Azure Policies](../../governance/policy/overview.md)
* [Management Locks](lock-resources.md)
* [Activity Logs](view-activity-logs.md)

After authenticating the request, Azure Resource Manager sends it to the resource provider, which completes the operation.

The control plane includes two scenarios for handling requests - "green field" and "brown field". Green field refers to new resources. Brown field refers to existing resources. As you deploy resources, Azure Resource Manager understands when to create new resources and when to update existing resources. You don't have to worry that identical resources will be created.

As you apply Azure policies, you need to evaluate the effect of the policy on new resources and existing resources. For more information, see [Evaluate the impact of a new Azure Policy definition](../../governance/policy/concepts/evaluate-impact.md).

## Data plane

Requests for data plane operations are sent to an endpoint that is specific to your instance. For example, the [Detect Language operation](/rest/api/cognitiveservices/textanalytics/detect%20language/detect%20language) in Cognitive Services is a data plane operation because the request URL is:

```http
POST {Endpoint}/text/analytics/v2.0/languages
```

Data plane operations aren't limited to REST API. They may require additional credentials such as logging in to a virtual machine or database server.

Features that enforce management and governance aren't applied to data plane operations. You need to consider the different ways users might interact with your solutions. For example, a lock that prevents users from deleting a database doesn't prevent users from deleting data through queries.

## Next steps

* For an overview of Azure Resource Manager, see [What is Azure Resource Manager?](overview.md)
