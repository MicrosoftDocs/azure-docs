---
title: "Tutorial: Use Code Interpreter in Azure SRE Agent"
description: Enable Code Interpreter for your Azure SRE Agent and use it to analyze data, generate charts, and create reports from chat.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: code-interpreter, data-analysis, python, reports, sandbox
#customer intent: As an SRE, I want to enable Code Interpreter for my agent so that I can analyze data, generate visualizations, and create reports from chat.
---

# Tutorial: Use Code Interpreter in Azure SRE Agent
In this tutorial, you enable Code Interpreter for your Azure SRE Agent and use it to analyze Azure data, generate visualizations, and create downloadable files directly from chat prompts.

> [!NOTE]
> To learn more about Code Interpreter and the problems it solves, see [Code Interpreter](code-interpreter.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Enable Code Interpreter through the agent settings
> - Analyze Azure resource data using natural language prompts
> - Download generated files from the conversation
> - Create visualizations and PDF reports

**Estimated time**: 10 minutes

## Prerequisites

Before you begin, make sure you have the following:

- An Azure SRE Agent. For more information, see [Create an agent](create-agent.md).
- Access to the [SRE Agent portal](https://sre.azure.com).

## Enable Code Interpreter

Turn on Code Interpreter through the Early access settings.

1. Open the [SRE Agent portal](https://sre.azure.com) and select your agent.
1. Select **Settings** in the left navigation.
1. Select **Basics**.
1. Find **Early access to features** and set the toggle to **On**.

> [!TIP]
> The Early access toggle should display as enabled (blue). Your agent now has access to Code Interpreter.

## Ask a question that needs computation

Submit a data analysis query to trigger Code Interpreter.

1. Select **New chat thread** in the top left.
1. In the chat input, type a question that requires data analysis:

    ```text
    Analyze the Azure resource groups in my subscription and create a summary
    table showing each resource group name and its region.
    ```

1. Select **Send** and observe your agent's process.

Your agent:

- Queries Azure for resource group data
- Writes Python code to process the results
- Executes the code in a secure sandbox
- Returns a formatted table

:::image type="content" source="media/common/code-interpreter-result-table.png" alt-text="Screenshot of Code Interpreter analyzing resource groups and displaying a formatted table.":::

You should see your agent's reasoning steps (for example, "Clarifying Azure access needs," "Analyzing resource groups," "Building code for markdown table") followed by a formatted table of your resource groups.

## Download a generated file

Scroll to the bottom of your agent's response to find a download link for a CSV file.

:::image type="content" source="media/common/code-interpreter-table-and-download.png" alt-text="Screenshot of table results with downloadable CSV file link at the bottom.":::

Select the link to download the CSV file and verify it contains the resource group data. This confirms that Code Interpreter can generate files you can use outside the conversation.

## Generate a visualization

Ask your agent for a chart:

```text
Create a bar chart showing how many resource groups I have in each Azure region.
Include a title and axis labels.
```

Your agent writes matplotlib code, executes it, and displays the chart inline in the conversation. An image should appear inline in the chat showing a bar chart of resource groups by region.

## Create a PDF report

Ask your agent to create a formatted report:

```text
Create a PDF report titled "Azure Resource Group Summary" that includes:
- A summary of total resource groups and regions used
- The table of all resource groups and regions
- The bar chart from the previous step
Save it as resource-group-report.pdf
```

Your agent combines the data, table, and chart into a formatted PDF and returns a download link. Download the file to verify it contains the summary, table, and chart. This demonstrates the full pipeline: Azure data to analysis to formatted report.

## Troubleshooting

Use the following information to resolve common issues.

### Agent says "I can only assist with Microsoft Azure topics"

Code Interpreter works within the context of Azure SRE tasks. Frame your prompts around your Azure environment. For example, instead of "Calculate the Fibonacci sequence," try "Analyze the deployment frequency across my Azure resource groups."

### Code execution seems slow

Code execution typically takes 15 to 30 seconds depending on complexity. The agent needs time to write code, provision a sandbox session, execute, and return results. Wait for the full response before retrying.

### Early access toggle doesn't appear

Verify you have the correct permissions on the agent. You need at least **Contributor** access to the agent resource to modify settings.

### Code execution returns an error

Your agent handles most errors automatically by retrying with corrected code. If errors persist, try the following:

- Simplify your request into smaller steps.
- Be more specific about the desired output format.
- Start a new chat thread to reset the sandbox session.

## Next step

> [!div class="nextstepaction"]
> [Learn about the code interpreter](./code-interpreter.md)

## Related content

- [Code Interpreter](code-interpreter.md)
- [Python code execution](python-code-execution.md)
- [Create a Kusto tool](create-kusto-tool.md)
- [Subagents](sub-agents.md)
