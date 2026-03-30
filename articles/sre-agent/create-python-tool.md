---
title: "Tutorial: Create a Python Tool in Azure SRE Agent"
description: Build an SLA calculator tool for your Azure SRE Agent using AI-generated Python code.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/18/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: python, custom-tool, AI-generated
#customer intent: As an SRE, I want to create a Python tool for my agent so that it can perform custom calculations during investigations.
---

# Tutorial: Create a Python tool in Azure SRE Agent
In this tutorial, you build a working Python tool that calculates SLA compliance for your Azure SRE Agent. You describe the tool's purpose in plain English, let AI generate the code, test the result, and deploy the tool for your agent to use.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Describe tool functionality in plain English
> - Generate Python code using AI
> - Test the tool with real inputs before deploying
> - Save the tool for your agent to use

**Estimated time**: 10 minutes

## Prerequisites

Before you begin, make sure you have the following resources and permissions:

- An Azure SRE Agent. For more information, see [Create an agent](create-agent.md).
- Builder permissions on the agent.
- Access to the [SRE Agent portal](https://sre.azure.com).

## Open the Python tool dialog

Go to the Agent Canvas and start creating a Python tool.

1. Open the [SRE Agent portal](https://sre.azure.com) and select your agent.
1. Select **Builder** in the left navigation.
1. Expand **Builder** and select **Agent Canvas**.
1. Select **Create** > **Tool** > **Python tool**.

:::image type="content" source="media/create-python-tool/python-tool-create-menu.png" alt-text="Screenshot of Create menu showing Tool and Python tool options.":::

The Python tool dialog opens with three tabs: **Code**, **Test playground**, and **Identity**.

## Describe what the tool should do

In the description field, write what you want the tool to do in plain English. Be specific about inputs, outputs, and logic.

Enter the following description:

```text
Calculate SLA compliance percentage from total uptime minutes and downtime
minutes. Return whether the SLA meets a target threshold (default 99.9%).
Include the calculated percentage and a status message.
```

:::image type="content" source="media/common/python-tool-generate.png" alt-text="Screenshot of Python tool dialog with description entered.":::

> [!TIP]
> For best results, specify input parameters and their types, describe the calculation or logic, state what the output should include, and mention default values when applicable.

## Generate the code

Select **Generate** to have AI create the Python function from your description.

The AI analyzes your description and creates a Python function with:

- Typed parameters matching your inputs
- A docstring explaining the logic
- Error handling for edge cases
- A JSON-serializable return value

The following example shows the generated code:

```python
def main(total_uptime_minutes: int, total_downtime_minutes: int,
         target_sla_percent: float = 99.9) -> dict:
    """Calculate SLA compliance from uptime and downtime minutes.

    Computes SLA as (uptime / (uptime + downtime)) * 100.
    Returns the SLA percentage, whether it meets the target,
    and a status message.
    """
    total_minutes = total_uptime_minutes + total_downtime_minutes

    if total_minutes == 0:
        sla_percent = 100.0
    else:
        sla_percent = (total_uptime_minutes / total_minutes) * 100

    meets_target = sla_percent >= target_sla_percent

    return {
        "sla_percent": round(sla_percent, 4),
        "target_sla_percent": target_sla_percent,
        "meets_target": meets_target,
        "status": "Meets SLA" if meets_target else "Below SLA"
    }
```

:::image type="content" source="media/create-python-tool/python-tool-code.png" alt-text="Screenshot of Code tab showing generated Python function.":::

The Code tab shows a `main()` function with typed parameters. The tool name comes from your description.

## Test with real inputs

Before you create the tool, test it by using actual values.

1. Select the **Test playground** tab.
1. Enter the following test values:
   - **total_uptime_minutes**: `43185`
   - **total_downtime_minutes**: `15`
   - **target_sla_percent**: `99.9`
1. Select **Test**.

:::image type="content" source="media/common/python-tool-test-result.png" alt-text="Screenshot of test playground showing successful execution.":::

The following example shows the expected result:

```json
{
  "sla_percent": 99.9653,
  "target_sla_percent": 99.9,
  "meets_target": true,
  "status": "Meets SLA"
}
```

The test shows a green success indicator, and the JSON output matches the expected values.

## Create the tool

After the tests pass, select **Create tool**.

Your tool is now available. The agent can call it automatically when a task matches the tool's description.

## Verify the tool

In a new chat thread, ask your agent a question that triggers the tool:

```text
What's my SLA for last month? We had 43185 minutes of uptime and 15 minutes of downtime.
```

The agent recognizes this question matches your tool and calls it to calculate the result.

## Troubleshooting

Use the following information to resolve common problems.

### Test button is disabled

The Test button requires:

- Valid Python code with a `main()` function
- All required parameter fields filled in

Check that your code has no syntax errors and all parameters have values.

### Code doesn't match your intent

Select the description field, refine your text, and select **Generate** again. Be more specific about:

- Parameter names and types
- Calculation logic
- Expected output format

### Test returns an error

Check the error message in the results panel. Common problems include:

- Division by zero (add handling for edge cases)
- Incorrect parameter types (ensure inputs match expected types)
- Import errors (check that libraries are available)

## Edit or delete a tool

You can modify or remove tools directly from the Agent Canvas.

### Edit

1. On the **Agent Canvas**, select the tool node to open the info panel.
1. Select the **edit** (pencil) icon in the panel header.
1. The edit dialog opens. Modify the description, code, or parameters.
1. Select **Save**.

### Delete

1. Select the tool node to open the info panel.
1. Select the **⋯** (more actions) menu in the panel header.
1. Select **Delete tool**.
1. Confirm the deletion in the dialog.

## Next step

> [!div class="nextstepaction"]
> [Test your tool in the playground](./test-tool-playground.md)

## Related content

- [Python Tools](python-code-execution.md)
- [Create a Kusto Tool](create-kusto-tool.md)
- [Tools overview](tools.md)
