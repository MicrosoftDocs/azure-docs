---
title: Observability in Microsoft Discovery
description: Learn about the observability capabilities available in Microsoft Discovery, including application logs stored in Managed Resource Group Log Analytics workspaces, Azure activity logs for control plane operations, and correlation ID tracing.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: concept-article
ms.date: 04/15/2026
---

# Observability in Microsoft Discovery

Microsoft Discovery integrates with Azure Monitor to provide comprehensive observability across all platform resources. You can monitor and troubleshoot workspaces, supercomputers, and bookshelves by querying application logs in dedicated Log Analytics workspaces and reviewing activity logs for control plane operations.

## Log types

Microsoft Discovery surfaces three categories of logs:

| Log type | Source | Configuration | Purpose |
|---|---|---|---|
| **Application logs** | Log Analytics workspace in Managed Resource Group | Automatic (no setup required) | Trace agent execution, tool runs, indexing jobs, and query operations within the platform |
| **Activity logs** | Azure Monitor | Automatic (available by default in Azure Monitor) | Audit and trace control plane operations on Discovery resources (create, update, delete) |
| **Audit logs** | Azure Storage Account or Log Analytics workspace (customer-owned) | Customer-configurable via diagnostic settings | Archive or query platform and resource-level logs for compliance, security auditing, and long-term retention |

## Managed Resource Group and Log Analytics workspaces

When you create a Microsoft Discovery resource like a workspace, supercomputer, or bookshelf, Microsoft Discovery service provisions a **Managed Resource Group (MRG)** alongside the resource in your subscription. The MRG contains the managed infrastructure required to operate the resource, including a dedicated **Log Analytics workspace** that automatically collects application logs.

Logs flow into the MRG Log Analytics workspace without any other configuration. Each Discovery resource type (a workspace, supercomputer, or bookshelf), has its own MRG and its own Log Analytics workspace, which keeps log data isolated and scoped to the corresponding resource.

> [!NOTE]
> The MRG is managed by Microsoft. You can read data from its Log Analytics workspace, but you shouldn't modify or delete resources within the MRG.

## Application log tables by resource

The following tables describe the log tables available in each resource's MRG Log Analytics workspace.

### Workspace

| Table | Description |
|---|---|
| `DiscoveryLogs_CL` | Execution traces for agent invocations, tool calls, workflow steps, and error diagnostics for investigations run within the workspace |
| `DiscoveryCogLoopLogs` | AI orchestration logs from the CogLoop engine, including Act and Cognition sub-loop activity, investigation progress, decisions, and error diagnostics |

### Supercomputer

| Table | Description |
|---|---|
| `KubePodInventory_CL` | Tracks pod creation, placement, and lifecycle state across the cluster |
| `KubeEvents_CL` | Captures Kubernetes events such as scheduling failures, volume mount errors, and pod state transitions |
| `Syslog_CL` | Records OS-level signals related to node health and underlying infrastructure issues |
| `SystemContainerLogs_CL` | Logs from platform-managed controllers and orchestration services |
| `DiscoveryToolLogs_CL` | Application logs from tool containers, including execution output and failures |
| `DiscoveryBookshelfLogs_CL` | Logs from bookshelf indexing jobs running on the supercomputer |

### Bookshelf

| Table | Description |
|---|---|
| `DiscoveryLogs_CL` | Logs from the knowledgebase query container, including query execution traces and error diagnostics |
| `AzureDiagnostics` | Diagnostic logs from the Azure AI Search service associated with the bookshelf, including indexing operations, query operations, and service-level diagnostics |

> [!NOTE]
> Bookshelf indexing jobs run on the supercomputer, so indexing logs appear in the supercomputer's MRG under `DiscoveryBookshelfLogs_CL`, not the bookshelf's MRG.

The `AzureDiagnostics` table is populated by the Azure AI Search resource provisioned in the bookshelf's MRG.

## Activity logs

Azure Activity Logs record all **control plane operations** performed on Microsoft Discovery resources. These are write and delete operations initiated by users or automated processes through the Azure Resource Manager (ARM) API—for example, creating a workspace, updating a supercomputer configuration, or deleting a bookshelf.

Activity logs are available in Azure Monitor and are retained for **90 days** by default. You can extend retention by exporting activity logs to a Log Analytics workspace or storage account via diagnostic settings.

Common Discovery control plane operations visible in activity logs include:

| Operation | Description |
|---|---|
| `Microsoft.Discovery/workspaces/write` | Create or update a workspace |
| `Microsoft.Discovery/workspaces/delete` | Delete a workspace |
| `Microsoft.Discovery/supercomputers/write` | Create or update a supercomputer |
| `Microsoft.Discovery/supercomputers/delete` | Delete a supercomputer |
| `Microsoft.Discovery/bookshelves/write` | Create or update a bookshelf |
| `Microsoft.Discovery/bookshelves/delete` | Delete a bookshelf |

For instructions on accessing activity logs, see [View activity logs for Microsoft Discovery resources](how-to-view-activity-logs.md).

## Audit logs

Audit logs are customer-configurable logs that you export from Microsoft Discovery resources to an Azure Storage account or a Log Analytics workspace in your own subscription. Unlike application logs (which are automatically collected in the MRG) and activity logs (which are always available in Azure Monitor), audit logs must be explicitly enabled through Azure Monitor **diagnostic settings**.

You can choose to export all available log categories or audit logs only. Audit logs are well suited for:

- **Compliance requirements** - Retain resource-level platform logs for a defined period to satisfy regulatory or organizational policies.
- **Security auditing** - Store logs in a destination you control to support security reviews and incident investigations.
- **Long-term retention** - Extend log retention beyond the 90-day default of Azure Monitor activity logs.

Audit logging is supported on the following Discovery resource types:

| Resource type | Resource provider path |
|---|---|
| Workspace | `Microsoft.Discovery/workspaces` |
| Bookshelf | `Microsoft.Discovery/bookshelves` |
| Supercomputer | `Microsoft.Discovery/supercomputers` |

For step-by-step setup instructions, see [Enable audit logging for Microsoft Discovery resources](how-to-enable-audit-logging.md).

## Correlation IDs

When an operation is performed in Discovery Studio, such as running an investigation, the platform assigns a **correlation ID** that uniquely identifies the request. This ID is propagated across all system components involved in processing that request, and every related log entry in the workspace's `DiscoveryLogs_CL` table includes the correlation ID in the `CorrelationId` field.

Using a correlation ID, you can trace the complete end-to-end flow of a request: when it started, which agents and tools were invoked, any errors that occurred, and when it completed.

Correlation IDs are returned in the **`X-Ms-Correlation-Request-Id`** response header of API calls made by Discovery Studio. You can retrieve them from the browser's developer tools Network tab.

For a step-by-step walkthrough of how to locate and use a correlation ID, see [Query workspace logs](how-to-query-workspace-logs.md).

For control plane issues, check the Activity logs for a correlation ID associated with the failed operation. Include this correlation ID when opening a support request with Microsoft Support to help expedite investigation.

## Log ingestion latency

Logs are typically available in Log Analytics within a few seconds of the event. In rare cases, ingestion can be delayed by up to five minutes. When troubleshooting recent activity, wait a moment and refresh your query if you don't see expected log entries.

## Next steps

- [Access resource logs for Microsoft Discovery resources](how-to-access-resource-logs.md)
- [Query workspace logs](how-to-query-workspace-logs.md)
- [Query CogLoop logs](how-to-query-cognitive-loop-logs.md)
- [Query supercomputer logs](how-to-query-supercomputer-logs.md)
- [Query bookshelf knowledgebase query logs](how-to-query-bookshelf-logs.md)
- [Query bookshelf indexing logs](how-to-query-bookshelf-indexing-logs.md)
- [View activity logs for Microsoft Discovery resources](how-to-view-activity-logs.md)
- [Enable audit logging for Microsoft Discovery resources](how-to-enable-audit-logging.md)
