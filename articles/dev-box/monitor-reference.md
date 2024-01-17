---
title: Dev center (DevCenter) diagnostic logs reference
titleSuffix: Microsoft Dev Box
description: Schema reference for dev center (DevCenter) diagnostic logs. Review the list of Azure Storage and Azure Monitor Logs properties included in monitoring data.
services: dev-box
ms.service: dev-box
ms.topic: reference
author: delvissantos
ms.author: delvissantos
ms.date: 01/17/2024
---

# Microsoft dev center monitoring data reference

This article provides a reference for log and metric data collected for a Microsoft Dev Box dev center. You can use the collected data to analyze the performance and availability of resources within your dev center. For details about how to collect and analyze monitoring data for your dev center, see [Configure Azure diagnostic logs for a dev center](how-to-configure-dev-box-azure-diagnostic-logs.md).

## Resource logs

The following table lists the properties of resource logs in a dev center. The resource logs are collected into Azure Monitor Logs or Azure Storage. In Azure Monitor, logs are collected in the **DevCenterDiagnosticLogs** table under the resource provider name of `MICROSOFT.DEVCENTER`.

| Azure Storage field or property | Azure Monitor Logs property | Description |
| --- | --- | --- |
| **time** | **TimeGenerated** | The date and time (UTC) when the operation occurred. |
| **resourceId** | **ResourceId** | The dev center resource for which logs are enabled. |
| **operationName** | **OperationName** | Name of the operation. If the event represents an Azure role-based access control (RBAC) operation, specify the Azure RBAC operation name (for example, `Microsoft.DevCenter/projects/users/devboxes/write`). This name is typically modeled in the form of an Azure Resource Manager operation, even if it's not a documented Resource Manager operation: (`Microsoft.<providerName>/<resourceType>/<subtype>/<Write/Read/Delete/Action>`). |
| **identity** | **CallerIdentity** | The OID of the caller of the event. |
| **TargetResourceId** | **ResourceId** | The subresource that pertains to the request. Depending on the operation performed, this value might point to a `devbox` or `environment`. |
| **resultSignature** | **ResponseCode** | The HTTP status code returned for the operation. |
| **resultType** | **OperationResult** | Indicates whether the operation failed or succeeded. |
| **correlationId** | **CorrelationId** | The unique correlation ID for the operation that can be shared with the app team to support further investigation. |

For a list of all Azure Monitor log categories and links to associated schemas, see [Common and service-specific schemas for Azure resource logs](../azure-monitor/essentials/resource-logs-schema.md). 

## Azure Monitor Logs tables

A dev center uses Kusto tables from Azure Monitor Logs. You can query these tables with Log Analytics. For a list of Kusto tables that a dev center uses, see the [Azure Monitor Logs table reference organized by resource type](/azure-monitor/reference/tables/tables-resourcetype#dev-centers).

## Related content

- [Configure Azure diagnostic logs for a dev center](how-to-configure-dev-box-azure-diagnostic-logs.md)
- [Monitor Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource.md)
