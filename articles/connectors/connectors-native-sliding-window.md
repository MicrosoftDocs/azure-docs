---
title: Schedule Tasks to Handle Contiguous Data
description: Create and run recurring tasks that handle contiguous data by using sliding windows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: deli, azla
ms.topic: how-to
ms.date: 08/07/2025
#customer intent: As an app developer using Azure Logic Apps, I want to create recurring task to handle contiguous data.
---

# Schedule and run tasks for contiguous data by using the Sliding Window trigger in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption](~/reusable-content/ce-skilling/azure/includes/logic-apps-sku-consumption.md)]

To run regular tasks, processes, or jobs that must handle data in contiguous chunks, you can start your logic app workflow with the *Sliding Window* trigger. You can set a date and time and a time zone for starting the workflow and a recurrence for repeating that workflow. If recurrences are missed for any reason, such as disruptions or disabled workflows, this trigger processes those missed recurrences. For example, when synchronizing data between your database and backup storage, use the Sliding Window trigger so that the data gets synchronized without incurring gaps. 

Here are some patterns that this trigger supports:

- Run immediately and repeat every *n* number of seconds, minutes, hours, days, weeks, or months.
- Start at a specific date and time, then run and repeat every *n* number of seconds, minutes, hours, days, weeks, or months. With this trigger, you can specify a start time in the past, which runs all past recurrences.
- Delay each recurrence for a specific duration before running.

For more information about the built-in Schedule triggers and actions, including differences between this trigger and the Recurrence trigger and scheduling recurring workflows, see [Schedules for recurring triggers in Azure Logic Apps workflows](../logic-apps/concepts-schedule-automated-recurring-tasks-workflows.md).

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, you can [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Basic knowledge about [logic apps](../logic-apps/logic-apps-overview.md).

## Add Sliding Window trigger

1. Sign in to the [Azure portal](https://portal.azure.com). Create a blank logic app.

1. Under **Development Tools**, select **Logic app developer**. In the design canvas, select **Add a trigger**.

1. In the search box, enter *sliding window* as your filter. From the triggers list, select **Sliding Window** trigger.

   :::image type="content" source="./media/connectors-native-sliding-window/add-sliding-window-trigger.png" alt-text="Screenshot shows the Logic app designer with adding a trigger called Sliding Window.":::

1. Under **How often do you want to check for items?** enter the interval and frequency for the recurrence. In this example, set these properties to run your workflow every week.

   :::image type="content" source="./media/connectors-native-sliding-window/sliding-window-trigger-details.png" alt-text="Screenshot shows the parameters for a trigger where you can set the interval and frequency.":::

   | Property | JSON name | Required | Type | Description |
   |----------|----------|-----------|------|-------------|
   | **Interval** | `interval` | Yes | Integer | An integer that describes how often the workflow runs based on the frequency. Here are the minimum and maximum intervals: <p>- Month: 1-16 months <br>- Week: 1-71 weeks <br>- Day: 1-500 days <br>- Hour: 1-12,000 hours <br>- Minute: 1-72,000 minutes <br>- Second: 1-9,999,999 seconds <p>For example, if the interval is 6, and the frequency is *Month*, then the recurrence is every six months. |
   | **Frequency** | `frequency` | Yes | String | The unit of time for the recurrence: **Second**, **Minute**, **Hour**, **Day**, **Week**, or **Month** |

   Next to **Advanced parameters**, select **Show all** to see available parameters.

   :::image type="content" source="./media/connectors-native-sliding-window/sliding-window-trigger-more-options-details.png" alt-text="Screenshot shows all the parameters that you can set for this trigger.":::

   Besides **Interval** and **Frequency**, this trigger has the following options:

   | Property | Required | JSON name | Type | Description |
   |----------|----------|-----------|------|-------------|
   | **Delay** | No | delay | String | The duration to delay each recurrence using the [ISO 8601 date time specification](https://en.wikipedia.org/wiki/ISO_8601#Durations) |
   | **Time zone** | No | timeZone | String | Applies only when you specify a start time because this trigger doesn't accept [UTC offset](https://en.wikipedia.org/wiki/UTC_offset). Select the time zone that you want to apply. |
   | **Start time** | No | startTime | String | Provide a start date and time in this format: <p>YYYY-MM-DDThh:mm:ss if you select a time zone <p>-or- <p>YYYY-MM-DDThh:mm:ssZ if you don't select a time zone <p>So for example, if you want September 18, 2025 at 2:00 PM, then specify "2025-09-18T14:00:00" and select a time zone such as Pacific Standard Time. Or, specify "2025-09-18T14:00:00Z" without a time zone. <p>**Note:** This start time must follow the [ISO 8601 date time specification](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations) in [UTC date time format](https://en.wikipedia.org/wiki/Coordinated_Universal_Time), but without a [UTC offset](https://en.wikipedia.org/wiki/UTC_offset). If you don't select a time zone, add the letter "Z" at the end without any spaces. This "Z" refers to the equivalent [nautical time](https://en.wikipedia.org/wiki/Nautical_time). <p>For simple schedules, the start time is the first occurrence, while for advanced recurrences, the trigger doesn't fire any sooner than the start time. See [What are the ways that I can use the start date and time?](../logic-apps/concepts-schedule-automated-recurring-tasks-workflows.md#start-time) |

1. Now build your remaining workflow with other actions.

## View workflow definition - Sliding Window

Your logic app's underlying workflow definition uses JSON. You can view the Sliding Window trigger definition with the options that you chose. To view this definition, on the designer toolbar, choose **Code view**. To return to the designer, choose on the designer toolbar, **Designer**.

This example shows how a Sliding Window trigger definition might look in an underlying workflow definition where the delay for each recurrence is five seconds for an hourly recurrence:

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
