---
title: Control plane and data plane operations
description: Describes the difference between control plane and data plane operations. Control plane operations are handled by Azure Resource Manager. Data plane operations are handled by a service.
ms.topic: conceptual
ms.date: 09/08/2020
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

Azure Resource Manager handles control plane requests. It automatically applies [Azure Role-based Access Control (RBAC)](../../role-based-access-control/overview.md) for the user sending the request.

[Azure Policies](../../governance/policy/overview.md) are applied for control plane operations but not for data plane operations.

## Data plane

Requests for data plane operations are sent to an endpoint that is specific to your instance. For example, the [Detect Language operation](/rest/api/cognitiveservices/textanalytics/detect%20language/detect%20language) in Cognitive Services is a data plane operation because the request URL is:

```http
POST {Endpoint}/text/analytics/v2.0/languages
```

Data plane operations aren't limited to REST API. It may require additional credentials such as logging in to a virtual machine through RDP.

## Next steps

* To see the commands for deploying a template, see [Deploy an application with Azure Resource Manager template](../templates/deploy-powershell.md).
