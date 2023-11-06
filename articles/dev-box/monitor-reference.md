---
title: DevCenter Diagnostic Logs Reference
titleSuffix: Microsoft Dev Box
description: Reference for the schema for Dev Center Diagnostic logs
services: dev-box
ms.service: dev-box
ms.topic: troubleshooting
author: delvissantos
ms.author: delvissantos
ms.date: 04/28/2023
---

# Monitoring Microsoft DevCenter data reference

This article provides a reference for log and metric data collected to analyze the performance and availability of resources within your dev center. See the [How To Monitor DevCenter Diagnostic Logs](how-to-configure-dev-box-azure-diagnostic-logs.md) article for details on collecting and analyzing monitoring data for a dev center.


## Resource logs

The following table lists the properties of resource logs in DevCenter. The resource logs are collected into Azure Monitor Logs or Azure Storage. In Azure Monitor, logs are collected in the **DevCenterDiagnosticLogs** table under the resource provider name of `MICROSOFT.DEVCENTER`.

| Azure Storage field or property | Azure Monitor Logs property | Description |
| --- | --- | --- |
| **time** | **TimeGenerated** | The date and time (UTC) when the operation occurred. |
| **resourceId** | **ResourceId** | The DevCenter resource for which logs are enabled.|
| **operationName** | **OperationName** | Name of the operation. If the event represents an Azure role-based access control (RBAC) operation, specify the Azure RBAC operation name (for example, `Microsoft.DevCenter/projects/users/devboxes/write`). This name is typically modeled in the form of an Azure Resource Manager operation, even if it's not a documented Resource Manager operation: (`Microsoft.<providerName>/<resourceType>/<subtype>/<Write/Read/Delete/Action>`)|
| **identity** | **CallerIdentity** | The OID of the caller of the event. |
| **TargetResourceId** | **ResourceId** | The subresource that pertains to the request. Depending on the operation performed, this value may point to a `devbox` or `environment`.|
| **resultSignature** | **ResponseCode** | The HTTP status code returned for the operation. |
| **resultType** | **OperationResult** | Whether the operation failed or succeeded. |
| **correlationId** | **CorrelationId** | The unique correlation ID for the operation that can be shared with the app team if investigations are necessary.|

For a list of all Azure Monitor log categories and links to associated schemas, see [Azure Monitor Logs categories and schemas](../azure-monitor/essentials/resource-logs-schema.md). 

## Azure Monitor Logs tables

DevCenter uses Kusto tables from Azure Monitor Logs. You can query these tables with Log analytics. For a list of Kusto tables DevCenter uses, see the [Azure Monitor Logs table reference](how-to-configure-dev-box-azure-diagnostic-logs.md) article.

## Next steps

For more information on monitoring DevCenter resources, see the following articles:

- To learn how to configure Azure diagnostic logs for a dev center, see [Configure Azure diagnostic logs for a DevCenter](how-to-configure-dev-box-azure-diagnostic-logs.md).
- For details on monitoring Azure resources, see [Monitoring Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource.md).
