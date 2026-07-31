---
title: Access resource logs for Microsoft Discovery resources
description: Learn how to navigate to the Log Analytics workspace in the Managed Resource Group for Microsoft Discovery workspaces, supercomputers, and bookshelves to query application logs.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: how-to
ms.date: 04/15/2026

#CustomerIntent: As a Discovery platform administrator or developer, I want to navigate to the Log Analytics workspace in the Managed Resource Group so that I can query application logs for troubleshooting.
---

# Access resource logs for Microsoft Discovery resources

Microsoft Discovery application logs are stored in a dedicated Log Analytics workspace inside the **Managed Resource Group (MRG)** that Azure provisions for each Discovery resource. This article explains how to navigate to the MRG and open the Log Analytics workspace for a workspace, supercomputer, or bookshelf.

> [!NOTE]
> This article covers access to application logs in MRG-based Log Analytics workspaces. For control plane audit logs, see [View activity logs for Microsoft Discovery resources](how-to-view-activity-logs.md). For configuring log export to a storage account, see [Enable audit logging for Microsoft Discovery resources](how-to-enable-audit-logging.md).

## Prerequisites

- An Azure account with access to an active subscription containing Microsoft Discovery resources.
- **Reader** role (or higher) on the Discovery resource and its associated Managed Resource Group.

## Navigate to the Managed Resource Group

Each Microsoft Discovery resource—workspace, supercomputer, or bookshelf—has an associated MRG that contains its managed infrastructure, including the Log Analytics workspace. Use the steps below to locate the MRG for the resource you want to investigate.

### [Workspace](#tab/workspace)

1. In the [Azure portal](https://portal.azure.com), search for **Microsoft Discovery** or navigate to **All resources**.
2. Select the workspace you want to troubleshoot.
3. On the workspace overview page, locate the **Managed Resource Group** field. It appears under the **Essentials** section.
4. Select the link to open the Managed Resource Group.

### [Supercomputer](#tab/supercomputer)

1. In the [Azure portal](https://portal.azure.com), search for **Microsoft Discovery** or navigate to **All resources**.
2. Select the supercomputer you want to troubleshoot.
3. On the supercomputer overview page, locate the **Managed Resource Group** field. It appears under the **Essentials** section.
4. Select the link to open the Managed Resource Group.

### [Bookshelf](#tab/bookshelf)

1. In the [Azure portal](https://portal.azure.com), search for **Microsoft Discovery** or navigate to **All resources**.
2. Select the bookshelf you want to troubleshoot.
3. On the bookshelf overview page, locate the **Managed Resource Group** field. It appears under the **Essentials** section.
4. Select the link to open the Managed Resource Group.

---

## Open the Log Analytics workspace

After you navigate to the MRG:

1. In the MRG resource list, locate the resource of type **Log Analytics workspace**.
2. Select it to open the workspace.
3. In the left navigation pane, select **Logs**.
4. If a query dialog appears, close it to access the full Logs query editor.

You're now in the Log Analytics Logs interface for that Discovery resource.

## Explore available tables

To see the log tables available for the resource:

1. In the left panel of the Logs interface, select the **Tables** tab.
2. Expand the **Custom Logs** section.
3. The custom log tables for Microsoft Discovery appear here, for example `DiscoveryLogs_CL`, `KubeEvents_CL`, or `DiscoveryBookshelfLogs_CL`.

> [!TIP]
> You can select any table name to run a default query that fetches the most recent entries, which is useful for quickly confirming that logs are being ingested.

## Adjust the time range

By default, the Logs interface queries the last 24 hours. You can change the time range using the selector at the top of the query editor, or by adding a `where TimeGenerated` filter directly in your KQL query:

```kql
| where TimeGenerated > ago(1h)   // Last 1 hour
| where TimeGenerated > ago(7d)   // Last 7 days
```

## Next steps

Now that you can access the Log Analytics workspace, query logs for your specific resource:

- [Query workspace logs](how-to-query-workspace-logs.md)
- [Query CogLoop logs](how-to-query-cognitive-loop-logs.md)
- [Query supercomputer logs](how-to-query-supercomputer-logs.md)
- [Query bookshelf knowledgebase query logs](how-to-query-bookshelf-logs.md)
- [Query bookshelf indexing logs](how-to-query-bookshelf-indexing-logs.md)
