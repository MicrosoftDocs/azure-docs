---
title: "Tutorial: Test a Tool in the Playground in Azure SRE Agent"
description: Debug and verify your tools in the Azure SRE Agent playground before deploying them to production.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: playground, testing, tools, kusto, system-tools, debug
#customer intent: As an SRE, I want to test my tools in the playground so that I can verify they work correctly before deploying them.
---

# Tutorial: Test a tool in the playground in Azure SRE Agent
In this tutorial, you use the test playground in the Azure SRE Agent portal to run and verify your tools before deploying them. The playground lets you execute tools in isolation with custom parameters and review results immediately.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Access the test playground for any tool
> - Test a Kusto tool with live queries
> - Test a system tool with custom parameters
> - Verify results before deploying

**Estimated time**: 5 minutes

## Prerequisites

Before you begin, make sure you have the following:

- At least one tool created (Kusto tool or system tool). For more information, see [Create a Kusto tool](create-kusto-tool.md).
- Access to the [SRE Agent portal](https://sre.azure.com).

## Open the playground

Navigate to the test playground in the subagent builder.

1. Open the [SRE Agent portal](https://sre.azure.com) and select your agent.
1. Select **Builder** > **Subagent builder**.
1. Select **Test playground** in the view toggle (next to **Canvas view** and **Table view**).

:::image type="content" source="media/test-tool-in-playground/playground-empty-state.png" alt-text="Screenshot of test playground view with empty state and Subagent/Tool selector at the top.":::

The playground displays an empty state with a **Subagent/Tool** selector at the top and the message "Select an agent or tool to start a playground session."

## Select your tool

Choose the tool you want to test from the entity selector.

1. Select the **Subagent/Tool** dropdown at the top.
1. Browse or search the list. Each entry shows a sublabel indicating its type (such as **Autonomous** for subagents, **Built-in Tool** for system tools, or **Kusto tool** for Kusto tools).
1. Select the tool you want to test.
1. Select **Apply**.

:::image type="content" source="media/common/playground-entity-selector.png" alt-text="Screenshot of entity selector dropdown showing agents and tools available for testing.":::

The playground loads the selected tool's configuration and test interface.

## Test a Kusto tool

If you selected a Kusto tool, use the following steps to test it.

1. Review the left panel, which shows your query configuration (cluster, database, query text, and parameter definitions).
1. In the right panel, fill in any parameter values required by your query.
1. Select **Run test**.

The test panel shows the following information:

- Success or failure status
- Row count and columns returned
- Query results displayed in a table
- Execution time in milliseconds

A green success indicator confirms your query runs correctly against the connected cluster.

> [!NOTE]
> The **Save** button is disabled until you run a successful test. This ensures you only save queries that actually work against your cluster.

> [!TIP]
> If the query returns unexpected results, adjust your KQL on the left and select **Run test** again. You can iterate without leaving the playground.

## Test a system tool

If you selected a system tool, use the following steps to test it.

1. Review the left panel, which shows the tool information (name, description, plugin, and category).
1. In the right panel, fill in the required parameter values.
1. Select **Execute Tool**.

The tool executes and displays JSON output in an embedded editor. Verify the output matches the expected behavior for your inputs.

## Verify and iterate

After testing, review the results and refine as needed.

- **Kusto tool**: If results are incorrect, adjust your KQL and rerun. Select **Save** when the query is correct. Save is only enabled after a successful test run.
- **System tool**: If output is unexpected, check your parameter values and re-execute.

Changes to Kusto tools are saved when you select **Save**. System tools don't require saving because they execute with the parameters you provide.

## Troubleshooting

Use the following information to resolve common issues.

### No tools appear in the selector

You need at least one tool created. In the Subagent builder toolbar, select **Create** > **Tool** > **Kusto tool** to create one.

### Kusto tool shows "No connectors configured"

The Kusto tool test requires a data connector. Go to **Builder** > **Connectors** and add an Azure Data Explorer connector with the cluster URL and database. Then return to the playground and select your Kusto tool again.

### Kusto test shows authorization error

Your agent needs access to the Kusto cluster. Check the following:

- A data connector is configured for the cluster under **Builder** > **Connectors**.
- The connector credentials have query permissions on the target database.

### System tool returns an error

Verify the following:

- All required parameters are filled in.
- Parameter values match the expected format (strings, numbers, and similar).
- The tool name and plugin are correctly configured.

### Python tools aren't listed

Python tools have their own test interface inside the Python tool editor, not in the unified playground. To test a Python tool, open it from the subagent builder canvas or table view and use the built-in test panel in the editor.

## Next step

> [!div class="nextstepaction"]
> [Create a Python tool](./create-python-tool.md)

## Related content

- [Create a Kusto tool](create-kusto-tool.md)
- [Create a Python tool](create-python-tool.md)
- [Agent playground](agent-playground.md)
