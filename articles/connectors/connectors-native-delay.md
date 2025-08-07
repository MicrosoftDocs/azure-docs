---
title: Delay the Next Action in Workflows
description: Wait to run the next action in logic app workflows by using the Delay or Delay Until actions in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: deli, azla
ms.topic: how-to
ms.date: 08/08/2025
#custom intent: As an integration developer working with Azure Logic Apps, I need to know how to delay an action in a workflow to manage when actions, for instance, to send status emails during certain times.
---

# Delay running the next action in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption](~/reusable-content/ce-skilling/azure/includes/logic-apps-sku-consumption.md)]

You can configure your logic app to wait an amount of time before it runs the next action. In your logic app's workflow, use the built-in **Delay** action. To wait until a specific date and time before it runs the next action, add the built-in **Delay until** action. For more information about the built-in Schedule actions and triggers, see [Schedules for recurring triggers in Azure Logic Apps workflows](../logic-apps/concepts-schedule-automated-recurring-tasks-workflows.md).

- **Delay**: Wait for the specified number of time units, such as seconds, minutes, hours, days, weeks, or months, before the next action runs.
- **Delay until**: Wait until the specified date and time before the next action runs.

Here are some example ways to use these actions:

- Wait until a weekday to send a status update over email.
- Delay your workflow until an HTTP call finishes before resuming and retrieving data.

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, you can [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Basic knowledge about [logic apps](../logic-apps/logic-apps-overview.md). Before you can use an action, your logic app must first start with a trigger. You can use any trigger you want and add other actions before you add a delay action.

<a name="add-delay"></a>

## Add the Delay action

To add a Delay action between two steps:

1. Select the plus sign (+) between the steps and then select **Add an action**.

1. In the search box, enter *delay*. From the actions list, select **Delay**

   :::image type="content" source="./media/connectors-native-delay/add-delay-action.png" alt-text="Screenshot shows the Logic app designer, searching for a delay action.":::

1. Specify the amount of time to wait before the next action runs.

   :::image type="content" source="./media/connectors-native-delay/delay-time-intervals.png" alt-text="Screenshot shows the Delay action where you can set the count and unit for the delay.":::

   | Property | JSON name | Required | Type | Description |
   |----------|-----------|----------|------|-------------|
   | Count | count | Yes | Integer | The number of time units to delay |
   | Unit | unit | Yes | String | The unit of time, for example: `Second`, `Minute`, `Hour`, `Day`, `Week`, or `Month` |

1. Add any other actions that you want to run in your workflow.

1. When you're done, save your logic app.

<a name="add-delay-until"></a>

## Add the Delay until action

You can add a Delay until action:

1. Select the plus sign (+) after a step and then select **Add an action**.

1. In the search box, enter *delay until*. From the actions list, select **Delay until**.

   :::image type="content" source="./media/connectors-native-delay/add-delay-until-action.png" alt-text="Screenshot shows the Logic app designer, searching for a delay until action.":::

1. Provide the date and time for when you want to resume the workflow.

   :::image type="content" source="./media/connectors-native-delay/delay-until-timestamp.png" alt-text="Screenshot shows the Delay action where you can set the timestamp for the delay.":::

   | Property | JSON name | Required | Type | Description |
   |----------|-----------|----------|------|-------------|
   | Timestamp | timestamp | Yes | String | The date and time for resuming the workflow using this format: <p>YYYY-MM-DDThh:mm:ssZ <p>So for example, if you want September 18, 2025 at 2:00 PM, specify "2025-09-18T14:00:00Z". <p>**Note:** This time format must follow the [ISO 8601 date time specification](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations) in [UTC date time format](https://en.wikipedia.org/wiki/Coordinated_Universal_Time), but without a [UTC offset](https://en.wikipedia.org/wiki/UTC_offset). Without a time zone, you must add the letter "Z" at the end without any spaces. This "Z" refers to the equivalent [nautical time](https://en.wikipedia.org/wiki/Nautical_time). |

1. Add any other actions that you want to run in your workflow.

1. When you're done, save your logic app.

## Related content

- [Managed connectors for Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
- [Built-in connectors for Azure Logic Apps](built-in.md)
