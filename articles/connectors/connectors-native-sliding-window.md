---
title: Handle Consecutive Data Chunks
description: Learn how to start a workflow that can handle consecutive or contiguous data chunks in Azure Logic Apps by using the Sliding Window trigger.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 08/15/2025
#Customer intent: As an integration developer using Azure Logic Apps, I want to create a recurring workflow that can handle consecutive or contiguous data chunks.
---

# Set up a workflow that handles consecutive or contiguous data chunks in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

To set up a workflow that can handle data in consecutive or contiguous chunks, start your workflow with the **Sliding Window** trigger. To start the workflow, you can set a date and time and a time zone. To repeat the workflow, set up the recurrence. If recurrences are missed for any reason, such as disruptions or disabled workflows, this trigger processes those missed recurrences.

For example, to keep data synchronized between your database and backup storage, use the **Sliding Window** trigger so that the data gets synchronized without incurring gaps.

Here are some patterns that this trigger supports:

- Run immediately and repeat every *n* number of seconds, minutes, hours, days, weeks, or months.
- Start at a specific date and time, then run and repeat every *n* number of seconds, minutes, hours, days, weeks, or months. With this trigger, you can specify a start time in the past, which runs all past recurrences.
- Delay each recurrence for a specific duration before running.

For more information about the **Schedule** built-in triggers and actions, including differences between this trigger and the **Recurrence** trigger, and about ways to schedule recurring workflows, see [Schedules for recurring triggers in Azure Logic Apps workflows](../logic-apps/concepts-schedule-automated-recurring-tasks-workflows.md).

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A logic app resource with a blank workflow.

  If you don't have this resource, see the following articles:
  
  - [Create an example Consumption logic app workflow in Azure Logic Apps](../logic-apps/quickstart-create-example-consumption-workflow.md)
  - [Create an example Standard logic app workflow in Azure Logic Apps](../logic-apps/create-single-tenant-workflows-azure-portal.md)

## Add Sliding Window trigger

1. In the [Azure portal](https://portal.azure.com), open your logic app resource, which requires a blank workflow so you can add a trigger.

1. Based on whether you have a Consumption or Standard logic app, follow the corresponding steps:

    - Consumption
    
      1. On the resource sidebar, under **Development Tools**, select the designer to open the workflow.

      1. On the designer, select **Add a trigger**.
    
    - Standard

      1. On the resource sidebar, under **Workflows**, select **Workflows**.

      1. On the **Workflows** page, select the blank workflow.

      1. On the workflow sidebar, under **Tools**, select the designer to open the workflow.

      1. On the designer, select **Add a trigger**.

1. Follow the [general steps](../logic-apps/add-trigger-action-workflow.md#add-trigger) to add the **Schedule** trigger named **Sliding Window** to your workflow.

   :::image type="content" source="./media/connectors-native-sliding-window/add-sliding-window-trigger.png" alt-text="Screenshot shows designer with unconfigured trigger named Sliding Window.":::

1. In the **How often do you want to check for items?** section, enter the interval and frequency for the recurrence. For this example, set these parameters to run your workflow every week.

   :::image type="content" source="./media/connectors-native-sliding-window/sliding-window-trigger-details.png" alt-text="Screenshot shows trigger parameters where you set the interval and frequency.":::

   | Parameter | JSON name | Required | Type | Description |
   |-----------|----------|-----------|------|-------------|
   | **Interval** | `interval` | Yes | Integer | An integer that describes how often the workflow runs based on the frequency. Here are the minimum and maximum intervals: <br><br>- Month: 1-16 months <br>- Week: 1-71 weeks <br>- Day: 1-500 days <br>- Hour: 1-12,000 hours <br>- Minute: 1-72,000 minutes <br>- Second: 1-9,999,999 seconds <br>For example, if the interval is **6**, and the frequency is **Month**, the recurrence is every six months. |
   | **Frequency** | `frequency` | Yes | String | The unit of time for the recurrence: **Second**, **Minute**, **Hour**, **Day**, **Week**, or **Month** |

   Next to **Advanced parameters**, select **Show all** to see available parameters.

   :::image type="content" source="./media/connectors-native-sliding-window/sliding-window-trigger-more-options-details.png" alt-text="Screenshot shows all the parameters that you can set for this trigger.":::

   Besides **Interval** and **Frequency**, this trigger has the following options:

   | Parameter | Required | JSON name | Type | Description |
   |-----------|----------|-----------|------|-------------|
   | **Delay** | No | `delay` | String | The duration to delay each recurrence using the [ISO 8601 date time specification](https://en.wikipedia.org/wiki/ISO_8601#Durations) |
   | **Time zone** | No | `timeZone` | String | Applies only when you specify a start time because this trigger doesn't accept [UTC offset](https://en.wikipedia.org/wiki/UTC_offset). Select the time zone that you want to apply. |
   | **Start time** | No | `startTime` | String | Provide a start date and time in this format: <br><br>YYYY-MM-DDThh:mm:ss if you select a time zone <br><br>-or- <br><br>YYYY-MM-DDThh:mm:ssZ if you don't select a time zone <br><br>For example, if you want September 18, 2025 at 2:00 PM, specify "2025-09-18T14:00:00", and select a time zone such as Pacific Standard Time. Or, specify "2025-09-18T14:00:00Z" without a time zone.<br><br>**Note:** This start time must follow the [ISO 8601 date time specification](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations) in [UTC date time format](https://en.wikipedia.org/wiki/Coordinated_Universal_Time), but without a [UTC offset](https://en.wikipedia.org/wiki/UTC_offset). If you don't select a time zone, add the letter "Z" at the end without any spaces. This "Z" refers to the equivalent [nautical time](https://en.wikipedia.org/wiki/Nautical_time). <br><br>For simple schedules, the start time is the first occurrence, while for advanced recurrences, the trigger doesn't fire any sooner than the start time. See [What are the ways that I can use the start date and time?](../logic-apps/concepts-schedule-automated-recurring-tasks-workflows.md#start-time) |

1. Now build your remaining workflow with other actions.

## View workflow definition - Sliding Window

Your logic app's underlying workflow definition uses JSON. To view the Sliding Window trigger definition with the values that you set up, on the designer toolbar, select **Code view**. To return to the designer, on the code view toolbar, select **Designer**.

This example shows how a Sliding Window trigger definition might look in an underlying workflow definition if the delay is five seconds for an hourly recurrence:

``` json
"triggers": {
   "Recurrence": {
      "type": "SlidingWindow",
      "Sliding_Window": {
         "inputs": {
            "delay": "PT5S"
         },
         "recurrence": {
            "frequency": "Hour",
            "interval": 1,
            "startTime": "2019-05-13T14:00:00Z",
            "timeZone": "Pacific Standard Time"
         }
      }
   }
}
```

## Related content

- [Delay the next action in workflows](../connectors/connectors-native-delay.md)
- [Managed connectors for Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
- [Built-in connectors for Azure Logic Apps](built-in.md)
