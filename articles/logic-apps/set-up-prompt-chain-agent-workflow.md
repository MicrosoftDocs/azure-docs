---
title: Call AI Agents Sequentially
description: Learn how to break a complex workflow into sequential subtasks so that different AI agents and models handle each subtask in Azure Logic Apps. In this "prompt chaining" pattern, each agent use output from the previous agent.
services: logic-apps
ms.suite: integration
ms.reviewers: estfan, divswa, krmitta, azla
ms.topic: how-to
ms.collection: ce-skilling-ai-copilot
ms.date: 09/17/2025
ms.update-cycle: 180-days
# Customer intent: As an AI developer, I want to break down a complex workflow into sequential subtasks for AI agents to complete by using a large language model (LLM) and Azure Logic Apps.
---

# Call AI agents sequentially to complete subtasks in Azure Logic Apps (preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!IMPORTANT]
>
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

When your workflow needs to handle a complex business process or integration scenario, consider whether you can break the workload into smaller sequential tasks, especially when the output from one task flows to the next task. To improve performance, management, scalability, you can set up multiple AI agents that use large language model (LLM) capabilities to complete each subtask. Each agent or model uses outputs from the previous agent or model. This behavior is known as the [*prompt chaining* pattern](single-versus-multiple-agents.md#prompt-chaining-pattern).

This guide describes how to set up sequential AI agents that follow the prompt chaining pattern in your workflow. The example sets up a business report processing chain that transforms raw performance data into a formatted executive summary.

The following table lists the inputs, tasks, and outputs:

| Element or task | Description |
|-----------------|-------------|
| Input | Raw quarterly performance text |
| Extract | Identify the numerical values and metrics. |
| Format | Convert to input to a structured format. |
| Sort | Sort the data in descending order. |
| Output | Sorted extracted data in descending order |

## Prerequisites

Same requirements as [Create autonomous agent workflows](create-autonomous-agent-workflows.md#prerequisites).

The autonomous agent workflow with an empty agent requires that you add a trigger that best matches your scenario. The example in this guide uses the **Request** trigger named **When an HTTP request is received**.

If you use the same trigger for this example, in the **Request Body JSON Schema** parameter, enter the following schema:

```json
{
   "type": "object",
   "properties": {
      "report": {
         "type": "string"
      }
   }
}
```

## Best practices

The following table describes best practices for the prompt chaining pattern:

| Practice | Description |
|----------|-------------|
| Keep steps focused | Each agent has a single, clear responsibility. |
| Add validation gates | Implement checks between steps to catch errors early. |
| Design for recovery | Plan how to handle failures at each step. |
| Monitor performance | Track execution time and success rates. |
| Optimize prompts | Refine agent instructions based on results. |
| Test edge cases | Validate behavior with unusual or malformed inputs. |

## Set up the data extraction agent

Follow these steps to set up the default empty agent:

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. Open your autonomous agent workflow in the designer.

1. On the designer, select the empty **Agent** action.

1. On the information pane that opens, select the default action name, and rename the action to **Data extraction agent**.

1. On the **Parameters** tab, provide the following information:

   | Parameter | Value |
   |-----------|-------|
   | **System instructions** | `Extract only the numerical values and their associated metrics from the text.`<br>`On a new line, format each as 'value: metric'.` <br><br>`Example format:` <br>`92%: customer satisfaction`<br>`45%: revenue growth` |
   | **User instructions** | `Data to use for extraction: @{triggerBody()?['report']}` <br><br>In this example, **`report`** is an output from the trigger named **When an HTTP request is received**. The expression, **triggerBody()?['report']**, returns the **'report'** trigger output. |

   The completed **Data extraction agent** looks like the following example:

   :::image type="content" source="media/set-up-prompt-chain-agent-workflow/data-extraction-agent.png" alt-text="Screenshot shows the finished data extraction agent." lightbox="media/set-up-prompt-chain-agent-workflow/data-extraction-agent.png":::

   Optionally, you can select the output from the **When an HTTP request is received** trigger in the dynamic content list, which creates the correct expression and includes the **`report`** trigger output.

   1. In the **User instructions** box, enter the following text, including a trailing space and keep the cursor in the position after the space:

      **`Data to use for extraction: `**

   1. From the options that appear when the cursor appears in an edit box, select the dynamic content list (lightning icon).

      :::image type="content" source="media/set-up-prompt-chain-agent-workflow/open-dynamic-content.png" alt-text="Screenshot shows data extraction agent, user instructions, example text, and selected lightning icon to open dynamic content list." lightbox="media/set-up-prompt-chain-agent-workflow/open-dynamic-content.png":::

   1. From the dynamic content list, under **When an HTTP request is received**, select **report**.

      :::image type="content" source="media/set-up-prompt-chain-agent-workflow/select-report.png" alt-text="Screenshot shows data extraction agent, user instructions, and dynamic content list with selected trigger output." lightbox="media/set-up-prompt-chain-agent-workflow/select-report.png":::

      When you're done, the **User instructions** box looks like the following example:

      :::image type="content" source="media/set-up-prompt-chain-agent-workflow/data-extraction-user-instructions.png" alt-text="Screenshot shows data extraction agent, user instructions, and resolved trigger output." lightbox="media/set-up-prompt-chain-agent-workflow/data-extraction-user-instructions.png":::

## Set up the data conversion agent

Follow these steps to set up the next agent, which receives output from the data extraction agent.

1. Under **Data extraction agent**, select the plus sign (**+**), and then select **Add an agent**.

1. On the designer, select the new empty **Agent** action.

1. On the information pane that opens, select the default action name, and rename the action to **Data conversion agent**.

1. On the **Parameters** tab, provide the following information:

   | Parameter | Value |
   |-----------|-------|
   | **System instructions** | `Convert all numerical values to percentages where possible.`<br>`If not a percentage or points, convert to decimal, for example, 92 points -> 92%.` <br>`Keep one number per line.` <br><br>`Example format:` <br>`92%: customer satisfaction`<br>`45%: revenue growth` |
   | **User instructions** | `Data to use for conversion: @{outputs('Data_extraction_agent')?['lastAssistantMessage']}` <br><br>**Note**: The expression, **outputs('Data_extraction_agent')?['lastAssistantMessage']**, inserts the last assistant message from **Data extraction agent** into the user instructions for **Data conversion agent**. |

   The completed **Data conversion agent** looks like the following example:

   :::image type="content" source="media/set-up-prompt-chain-agent-workflow/data-conversion-agent.png" alt-text="Screenshot shows the finished data conversion agent." lightbox="media/set-up-prompt-chain-agent-workflow/data-conversion-agent.png":::

   Optionally, you can select the output from the **Data extraction agent** in the dynamic content list, which creates the correct expression and includes the **`lastAssistantMessage`** output from the **Data extraction agent**.

   1. In the **User instructions** box, enter the following text, including a trailing space and keep the cursor in the position after the space:

      **`Data to use for conversion: `**

   1. From the options that appear when the cursor appears in an edit box, select the expression editor this time (function icon).

      :::image type="content" source="media/set-up-prompt-chain-agent-workflow/open-expression-editor.png" alt-text="Screenshot shows data extraction agent, user instructions, example text, and selected function icon to open expression editor." lightbox="media/set-up-prompt-chain-agent-workflow/open-expression-editor.png":::

   1. In the expression list, select **Dynamic content**.

   1. From the dynamic content list, under **Data extraction agent**, select **Last Assistant Message**, and then select **Add**.

      :::image type="content" source="media/set-up-prompt-chain-agent-workflow/select-last-assistant-message-extraction.png" alt-text="Screenshot shows data conversion agent, user instructions, and dynamic content list with selected extraction agent output." lightbox="media/set-up-prompt-chain-agent-workflow/select-last-assistant-message-extraction.png":::

      When you're done, the **User instructions** box looks like the following example:

      :::image type="content" source="media/set-up-prompt-chain-agent-workflow/data-conversion-user-instructions.png" alt-text="Screenshot shows data conversion agent, user instructions, and resolved extraction agent output." lightbox="media/set-up-prompt-chain-agent-workflow/data-conversion-user-instructions.png":::

## Set up the data sorting agent

Follow these steps to set up the next agent, which receives the formatted table from the data conversion agent.

1. Under **Data conversion agent**, add a new agent.

1. On the designer, select the new empty **Agent** action.

1. On the information pane that opens, select the default action name, and rename the action to **Data sorting agent**.

1. On the **Parameters** tab, provide the following information:

   | Parameter | Value |
   |-----------|-------|
   | **System instructions** | `Sort all lines in descending order by numerical value.`<br>`On each line, keep the format 'value: metric'.` <br><br>`Example format:` <br>`92%: customer satisfaction`<br>`87%: employee satisfaction` |
   | **User instructions** | `Data to use for sorting: @{outputs('Data_conversion_agent')?['lastAssistantMessage']}` <br><br>**Note**: The expression, **outputs('Data_conversion_agent')?['lastAssistantMessage']**, inserts the last assistant message from **Data conversion agent** into the user instructions for **Data sorting agent**. |

   The completed **Data sorting agent** looks like the following example:

   :::image type="content" source="media/set-up-prompt-chain-agent-workflow/data-sorting-agent.png" alt-text="Screenshot shows the finished data sorting agent." lightbox="media/set-up-prompt-chain-agent-workflow/data-sorting-agent.png":::

   Optionally, you can select the output from the **Data conversion agent** in the dynamic content list, which creates the correct expression and includes the **`lastAssistantMessage`** output from the **Data conversion agent**.

   1. In the **User instructions** box, enter the following text, including a trailing space and keep the cursor in the position after the space:

      **`Data to use for sorting: `**

   1. From the options that appear when the cursor appears in an edit box, select the expression editor this time (function icon).

   1. In the expression list, select **Dynamic content**.

   1. From the dynamic content list, under **Data conversion agent**, select **Last Assistant Message**, and then select **Add**.

      :::image type="content" source="media/set-up-prompt-chain-agent-workflow/select-last-assistant-message-conversion.png" alt-text="Screenshot shows data sorting agent, user instructions, and dynamic content list with selected conversion agent output." lightbox="media/set-up-prompt-chain-agent-workflow/select-last-assistant-message-conversion.png":::

      When you're done, the **User instructions** box looks like the following example:

      :::image type="content" source="media/set-up-prompt-chain-agent-workflow/data-sorting-user-instructions.png" alt-text="Screenshot shows data sorting agent, user instructions, and resolved conversion agent output." lightbox="media/set-up-prompt-chain-agent-workflow/data-sorting-user-instructions.png":::

## Set up the Response action

This example started the workflow with the **When an HTTP request is received** trigger. For workflows that start with this trigger, make sure the workflow returns the result to the caller by adding the **Response** action at the end of the workflow.

1. Follow the [general steps to add the action named **Response**](add-trigger-action-workflow.md?tabs=standard#add-action) to your workflow.

1. On the designer, select the **Response** action.

1. On the information pane, under **Parameters**, in the **Body** parameter, specify the results to return to the caller.

   For this example, the **Body** parameter specifies that the result is the **Last Assistant Message** output from the **Data sorting agent** and returns this data to the caller:

   ```json
   {
      "type": "Response",
      "kind": "Http",
      "inputs": {
         "statusCode": 200,
         "body": {
            "result": "@outputs('Data_sorting_agent')?['lastAssistantMessage']"
         }
      },
   }
   ```

   :::image type="content" source="media/set-up-prompt-chain-agent-workflow/response-action.png" alt-text="Screenshot shows Response action, which returns output from the data sorting agent to the workflow caller." lightbox="media/set-up-prompt-chain-agent-workflow/response-action.png":::

## Test your agent workflow

1. On the designer toolbar, select **Run** **>** **Run with payload**, and provide the following sample input as the "report":

   ```json
   {
      "report": "Q3 Performance Summary:
         Our customer satisfaction score rose to 92 points this quarter.
         Revenue grew by 45% compared to last year.
         Market share in our primary market is 23% .
         Customer churn decreased to 5% from 8%.
         New user acquisition cost is $43 per user.
         Product adoption rate increased to 78%.
         Employee satisfaction is at 87 points.
         Operating margin improved to 34%."
   }
   ```

   The following list shows the expected progression for the output:

   1. Extract values and metrics from raw data.
   1. Convert the extracted information to the target format.
   1. Sort the data in the formatted data.

1. To view the results, on the workflow sidebar, under **Tools**, select **Run history**.

1. On the **Run history** tab, select the most recent workflow run.

   1. In the **Agent log**, review the responses from each agent for the system instructions that you specified.

   1. To review the status, inputs, and outputs for each operation, select that operation in the monitoring view window.

[!INCLUDE [clean-up-resources](includes/clean-up-resources.md)]

## Related content

- [Single agent versus multiple agents](single-versus-multiple-agents.md)
- [Create autonomous agent workflows](create-autonomous-agent-workflows.md)
