---
title: Pause Workflow Execution
description: Learn how to pause a workflow run and delay the next action by using the Delay action or Delay Until action in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 08/08/2025
#Customer intent: As an integration developer, I need to know how to pause workflow execution and delay the next action in the same workflow.
---

# Pause workflow execution to delay the next action in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

To pause workflow execution and delay the next action, you can set up your workflow to wait an amount of time before the next action runs by using the built-in action named **Delay**. To pause the workflow until a specific date and time, add the built-in action named **Delay until**.

The following descriptions provide more information about these actions:

- **Delay**: Wait for the specified number of time units, such as seconds, minutes, hours, days, weeks, or months, before the next action runs.
- **Delay until**: Wait until the specified date and time before the next action runs.

Here are some example ways to use these actions:

- Wait until a weekday to send a status update over email.
- Delay your workflow until an HTTP call finishes before resuming and retrieving data.

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, you can [sign up for a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- Basic knowledge about [logic apps](../logic-apps/logic-apps-overview.md). To use an action, your workflow must start with a trigger. You can use any trigger you want and add other actions before you add a delay action.

<a name="add-delay"></a>

## Add the Delay action

To add a **Delay** action to your workflow, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your logic app resource.

1. Based on whether you have a Consumption or Standard logic app resource, follow the corresponding steps:

   - Consumption: On the resource sidebar, under **Development Tools**, select the designer to open your workflow.

   - Standard: On the resource sidebar, under **Workflows**, select **Workflows**, and then select your workflow. On the workflow sidebar, under **Tools**, select the designer to open the workflow.

1. On the designer, follow these [general steps to add the action named **Delay**](../logic-apps/add-trigger-action-workflow.md#add-action) to your workflow.



1. In the **Delay** action, specify the amount of time to wait before the next action runs.

   :::image type="content" source="./media/connectors-native-delay/delay-time-intervals.png" alt-text="Screenshot shows the Delay action where you can set the count and unit for the delay.":::

   | Parameter | JSON name | Required | Type | Description |
   |-----------|-----------|----------|------|-------------|
   | **Count** | `count` | Yes | Integer | The number of time units to delay. |
   | **Unit** | `unit` | Yes | String | The unit of time, for example: **Second**, **Minute**, **Hour**, **Day**, **Week**, or **Month**. |

1. Add any other actions that you want to run in your workflow.

1. When you're done, save your workflow.

<a name="add-delay-until"></a>

## Add the Delay until action

To add a **Delay until** action to your workflow, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your logic app resource.

1. Based on whether you have a Consumption or Standard logic app resource, follow the corresponding steps:

   - Consumption: On the resource sidebar, under **Development Tools**, select the designer to open your workflow.

   - Standard: On the resource sidebar, under **Workflows**, select **Workflows**, and then select your workflow. On the workflow sidebar, under **Tools**, select the designer to open the workflow.

1. On the designer, follow these [general steps to add the action named **Delay until**](../logic-apps/add-trigger-action-workflow.md#add-action) to your workflow.



1. In the **Delay until** action, provide the date and time for when you want to resume the workflow.

   :::image type="content" source="./media/connectors-native-delay/delay-until-timestamp.png" alt-text="Screenshot shows the action named Delay until and the timestamp for when to end the delay.":::

   | Parameter | JSON name | Required | Type | Description |
   |-----------|-----------|----------|------|-------------|
   | **Timestamp** | `timestamp` | Yes | String | The date and time for resuming the workflow using the following format: <br><br>YYYY-MM-DDThh:mm:ssZ <br><br>So for example, if you want September 18, 2025 at 2:00 PM, specify "2025-09-18T14:00:00Z". <br><br>**Note:** This time format must follow the [ISO 8601 date time specification](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations) in [UTC date time format](https://en.wikipedia.org/wiki/Coordinated_Universal_Time), but without a [UTC offset](https://en.wikipedia.org/wiki/UTC_offset). Without a time zone, you must add the letter "Z" at the end without any spaces. This "Z" refers to the equivalent [nautical time](https://en.wikipedia.org/wiki/Nautical_time). |

1. Add any other actions that you want to run in your workflow.

1. When you're done, save your workflow.

## Related content

- [Managed connectors for Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
- [Built-in connectors for Azure Logic Apps](built-in.md)
