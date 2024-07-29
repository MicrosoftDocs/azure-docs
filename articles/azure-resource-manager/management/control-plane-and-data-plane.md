---
title: Control plane and data plane operations
description: Describes the difference between control plane and data plane operations. Control plane operations are handled by Azure Resource Manager. Data plane operations are handled by a service.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 03/19/2024
---

# Azure control plane and data plane

Azure operations can be divided into two categories - control plane and data plane. This article describes the differences between those two types of operations.

You use the control plane to manage resources in your subscription. You use the data plane to use capabilities exposed by your instance of a resource type.

For example:

* You create a virtual machine through the control plane. After the virtual machine is created, you interact with it through data plane operations, such as Remote Desktop Protocol (RDP).

* You create a storage account through the control plane. You use the data plane to read and write data in the storage account.

* You create an Azure Cosmos DB database through the control plane. To query data in the Azure Cosmos DB database, you use the data plane.

## Control plane

All requests for control plane operations are sent to the Azure Resource Manager URL. That URL varies by the Azure environment.

* For Azure global, the URL is `https://management.azure.com`.
* For Azure Government, the URL is `https://management.usgovcloudapi.net/`.
* For Azure Germany, the URL is `https://management.microsoftazure.de/`.
* For Microsoft Azure operated by 21Vianet, the URL is `https://management.chinacloudapi.cn`.

To discover which operations use the Azure Resource Manager URL, see the [Azure REST API](/rest/api/azure/). For example, the [create or update operation](/rest/api/mysql/singleserver/databases/create-or-update) for MySQL is a control plane operation because the request URL is:

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforMySQL/servers/{serverName}/databases/{databaseName}?api-version=2017-12-01
```

Azure Resource Manager handles all control plane requests. It automatically applies the Azure features you've implemented to manage your resources, such as:

* [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md)
* [Azure Policy](../../governance/policy/overview.md)
* [Management Locks](lock-resources.md)
* [Activity Logs](../../azure-monitor/essentials/activity-log.md)

After authenticating the request, Azure Resource Manager sends it to the resource provider, which completes the operation. Even during periods of unavailability for the control plane, you can still access the data plane of your Azure resources. For instance, you can continue to access and operate on data in your storage account resource via its separate storage URI `https://myaccount.blob.core.windows.net` even when `https://management.azure.com` is not available.

The control plane includes two scenarios for handling requests - "green field" and "brown field". Green field refers to new resources. Brown field refers to existing resources. As you deploy resources, Azure Resource Manager understands when to create new resources and when to update existing resources. You don't have to worry that identical resources will be created.

## Data plane

Requests for data plane operations are sent to an endpoint that's specific to your instance. For example, the [Detect Language operation](../../ai-services/language-service/language-detection/overview.md) in Azure AI services is a data plane operation because the request URL is:

```http
POST {Endpoint}/text/analytics/v2.0/languages
```

Data plane operations aren't limited to REST API. They may require other credentials such as logging in to a virtual machine or database server.

Features that enforce management and governance might not apply to data plane operations. You need to consider the different ways users interact with your solutions. For example, a lock that prevents users from deleting a database doesn't prevent users from deleting data through queries.

You can use some policies to govern data plane operations. For more information, see [Resource Provider modes (preview) in Azure Policy](../../governance/policy/concepts/definition-structure.md#resource-provider-modes).

## Next steps

* For an overview of Azure Resource Manager, see [What is Azure Resource Manager?](overview.md)

* To learn more about the effect of policy definitions on new resources and existing resources, see [Evaluate the impact of a new Azure Policy definition](../../governance/policy/concepts/evaluate-impact.md).
