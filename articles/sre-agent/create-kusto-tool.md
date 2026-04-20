---
title: "Tutorial: Create a Kusto Tool in Azure SRE Agent"
description: Build a reusable Kusto query tool for your Azure SRE Agent using the portal UI to run deterministic KQL queries.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/18/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
#customer intent: As an SRE, I want to create a Kusto tool for my agent so that it can run deterministic KQL queries during investigations.
---

# Tutorial: Create a Kusto tool in Azure SRE Agent

In this tutorial, you create a parameterized Kusto tool that runs exact KQL queries with deterministic, repeatable results. When users ask questions like "show me errors from the last seven days," the agent substitutes the parameter and runs your exact query against your Azure Data Explorer database.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Create a Kusto tool in the Agent Canvas
> - Define a parameterized KQL query
> - Test the query in the portal
> - Attach the tool to a custom agent and verify it in the playground

**Estimated time**: 15 minutes

## Prerequisites

Before you begin, make sure you have the following prerequisites:

- An Azure Data Explorer cluster with the **AllDatabasesViewer** role granted to the agent's managed identity. For more information, see [Kusto tools prerequisites](kusto-tools.md#azure-data-explorer-permissions).
- A Kusto connector configured. For more information, see [Set up a Kusto connector](kusto-connector.md).
- Access to Builder in the Azure SRE Agent portal.

## Navigate to the Agent Canvas

Open the Agent Canvas where you create and manage tools.

1. Open the [SRE Agent portal](https://sre.azure.com).
1. Select your agent.
1. Select **Builder** in the left navigation.
1. Select **Agent Canvas**.

:::image type="content" source="media/create-kusto-tool/step-02-sub-agent-builder-view.png" alt-text="Screenshot of Agent Canvas showing canvas view with custom agent cards." lightbox="media/create-kusto-tool/step-02-sub-agent-builder-view.png" :::

## Open the tool creation form

Start the tool creation process from the toolbar.

1. Select the **Create** dropdown in the top toolbar.
1. Select **Tool** > **Kusto tool**.

:::image type="content" source="media/create-kusto-tool/step-01-create-menu-tool-option.png" alt-text="Screenshot of Create menu showing Tool submenu with Kusto tool option." lightbox="media/create-kusto-tool/step-01-create-menu-tool-option.png":::

## Fill in the tool details

Complete the form with your tool configuration.

| Field | Value | Description |
|---|---|---|
| **Tool name** | `QueryAppLogs` | How the agent references this tool. |
| **Description** | "Query AppLogs table for errors in the specified time range" | When the agent should use this tool. |
| **Connector** | (select your Kusto connector) | The Azure Data Explorer connection to use. |
| **Database** | (autopopulated from connector URL) | Your database name. |
| **Query** | See the following example. | Your KQL query with parameters. |

Enter the following example query:

```kql
AppLogs
| where Timestamp > ago(##timeRange##)
| where Level == "Error"
| order by Timestamp desc
| take 10
```

The `##timeRange##` syntax creates a parameter. When someone asks "show errors from the last 24 hours," the agent fills in `timeRange = 24h`.

:::image type="content" source="media/create-kusto-tool/step-02-kusto-tool-filled.png" alt-text="Screenshot of Kusto tool form with query and parameter filled in." lightbox="media/create-kusto-tool/step-02-kusto-tool-filled.png":::

## Add the parameter

Define the parameter that your query uses.

1. Scroll to the **Parameters** section.
1. Select **Add parameter**.
1. Enter the following values:
   - **Name**: `timeRange`
   - **Type**: String
   - **Description**: "How far back to look (for example, 1h, 24h, 7d)"

The parameter appears in the **Parameters** table below your query.

## Test the query

Validate that the query runs successfully before saving.

1. Select **Test** at the bottom of the form.
1. Enter a test value for `timeRange` (for example, `7d`).
1. Verify the query executes successfully.

:::image type="content" source="media/create-kusto-tool/step-03-kusto-tool-test-passed.png" alt-text="Screenshot of tool test showing execution time and success status." lightbox="media/create-kusto-tool/step-03-kusto-tool-test-passed.png":::

You see execution time and a green checkmark confirming the query runs. Even if the query returns zero rows, the checkmark means the query syntax is valid.

## Create the tool

Select **Create** to save your Kusto tool.

:::image type="content" source="media/create-kusto-tool/step-04-kusto-tool-created.png" alt-text="Screenshot of tool successfully created confirmation." lightbox="media/create-kusto-tool/step-04-kusto-tool-created.png":::

## Add the tool to a custom agent

You created your tool but didn't attach it to a custom agent. Attach the tool so the agent can use it.

1. In **Canvas view**, find your custom agent.
1. Select the **+** button on the right side of the custom agent card.
1. Select **Add existing tools**.
1. Check your Kusto tool from the list.
1. Select **Add tools**.

:::image type="content" source="media/create-kusto-tool/step-02-sub-agent-builder-canvas.png" alt-text="Screenshot of canvas view showing custom agent card with the add button on the right side." lightbox="media/create-kusto-tool/step-02-sub-agent-builder-canvas.png":::

The tool count on your custom agent card increases after adding.

## Verify the tool in the playground

Test that the agent invokes your Kusto tool correctly.

1. Select **Test Playground** in the left navigation.
1. Select your custom agent from the dropdown list.
1. Ask: "Show me errors from the last seven days"
1. The agent invokes your tool with `timeRange = 7d`.

:::image type="content" source="media/create-kusto-tool/kusto-playground-result.png" alt-text="Screenshot of test playground showing Kusto query results with error entries from AppLogs table." lightbox="media/create-kusto-tool/kusto-playground-result.png":::

You should see the agent call your Kusto tool and return query results. The exact query you wrote runs against your cluster.

## Parameter syntax

Use `##parameterName##` or `$parameterName` to mark parameter placeholders in your queries:

```yaml
query: |-
  AppExceptions
  | where TimeGenerated > ago(##timeRange##)
  | where ServiceName == "$serviceName"
```

Both syntaxes work identically. The agent substitutes values at runtime.

## Execution modes

The following table describes the available execution modes for Kusto tools.

| Mode | Use when |
|---|---|
| `Query` | Define the query inline in YAML (most common). |
| `Function` | Store the query logic as a function on the Azure Data Explorer cluster. |
| `Script` | Place the query in an external `.kql` file. |

```yaml
# Function mode example
spec:
  type: KustoTool
  mode: Function
  function: GetRecentErrors

# Script mode example
spec:
  type: KustoTool
  mode: Script
  file: queries/complex-analysis.kql
```

## Example: Deployment correlation tool

The following YAML definition creates a Kusto tool that correlates deployments with a specified service and time range.

```yaml
api_version: azuresre.ai/v2
kind: ExtendedAgentTool
metadata:
  name: get-recent-deployments
spec:
  type: KustoTool
  connector: devops-logs
  mode: Query
  database: deployments
  description: "Get deployments in a time range for a service"
  toolMode: Auto
  query: |-
    Deployments
    | where TimeGenerated > ago(##timeRange##)
    | where ServiceName == "##serviceName##"
    | project TimeGenerated, Version, DeployedBy, Environment
    | order by TimeGenerated desc
  parameters:
    - name: serviceName
      type: string
      description: "Name of the service"
    - name: timeRange
      type: string
      description: "How far back to look (e.g., 1h, 24h)"
```

## Edit or delete a tool

You can modify or remove tools after creation.

### Edit

1. On the **Agent Canvas**, select the tool node to open the info panel.
1. Select the **edit** (pencil) icon in the panel header.
1. The edit dialog opens with your current settings. Modify the query, parameters, or connector.
1. Select **Save**.

### Delete

1. Select the tool node to open the info panel.
1. Select the **&#8943;** (more actions) menu in the panel header.
1. Select **Delete tool**.
1. Confirm the deletion in the dialog.

> [!NOTE]
> When you delete a tool, you immediately remove it from any custom agents that use the tool.

## Next step

> [!div class="nextstepaction"]
> [Test your tool in the playground](./test-tool-playground.md)

## Related content

- [Kusto tools](kusto-tools.md)
- [Create a Python tool](create-python-tool.md)
- [Custom agents](sub-agents.md)
