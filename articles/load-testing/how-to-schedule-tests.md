---
title: Define schedules on load tests
titleSuffix: Azure Load Testing
description: 'Learn how to schedule load tests with Azure Load Testing. Scheduling tests allows you to run tests at a later time or run at a regular cadence.'
services: load-testing
ms.service: azure-load-testing
ms.author: ninallam
author: ninallam
ms.date: 10/09/2024
ms.topic: how-to
---

# Define schedules on load tests

In this article, you learn how to schedule load tests with Azure Load Testing. Scheduling tests allows you to run tests at a later time or run at a regular cadence. Azure Load Testing supports adding one schedule to a test. You can add a schedule to a test after creating it.

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- An Azure load testing resource and test. If you need to create an Azure Load Testing resource and test, see the quickstart [Create and run a load test](./quickstart-create-and-run-load-test.md).

## Add a schedule to a test

1. In the Azure portal, navigate to your load testing resource.

2. In the left pane, select **Tests**.

3. Select the test you want to schedule.

4. In the Schedule pane, click **Add schedule**.

5. In the Add schedule pane, configure the following settings:

    | Field | Details |
    |-------|---------|
    | **Schedule Name** | Enter a name for the schedule. |
    | **Start date** | Select the date and time when the test should start. |
    | **Time zone** | Select the time zone in which the test should run. |
    | **Recurrence** | Select the frequency at which the test should run. You can choose to run the test once, hourly, daily, weekly, or monthly. Choose cron to specify a custom recurrence pattern. Refer to more settings for each recurrence in the below tables. |
    | **End**| Select how you want the schedule to end. You can choose to end the schedule after a certain number of occurrences or on a specific date. Alternatively, you can choose not to end the schedule. |

    For a hourly recurrence, configure the following settings:

    | Field | Details |
    |-------|---------|
    | **Every** | Enter the number of hours between each test run. For example if you provide 6, the schedule will start at the start date and time provided and will run every 6 hours. |

    For a daily recurrence, configure the following settings:

    | Field | Details |
    |-------|---------|
    | **Every** | Enter the number of days between each test run. For example if you provide 2, the schedule will start at the start date and time provided and will run every 2 days. |

    For a weekly recurrence, configure the following settings:

    | Field | Details |
    |-------|---------|
    | **Every** | Enter the number of weeks between each test run. |
    | **Days** | Select the days of the week when the test should run. If you provided 2 weeks and selcted Monday, the schedule will start on the Monday after the start date and run every 2 weeks. |

    For a monthly recurrence, configure the following settings:

    | Field | Details |
    |-------|---------|
    | **Every** | Enter the number of months between each test run. |
    | **Pattern** | Select the pattern for the test to run. You can choose **Date** to run the test on a specific date of the month, for example, on every 10th of the month. You can choose **Day** to run the test on a specific day of the week, for example, on the last day of the month. |
     on a specific day of the week, or on the first Tuesday of the month. |

    For a cron recurrence, configure the following settings:
    
    | Field | Details |
    |-------|---------|
    | **Cron expression** | Enter a cron expression to specify the recurrence pattern. For example, `0 0 12 1/1 * ? *` runs the test every day at 12:00 PM. |

6. Click **Add** to add the schedule to the test.

> [!NOTE]
> If a scheduled test run is in progress when the next scheduled run is due, the next run is skipped. The next run will be scheduled for the next recurrence time.

## View schedules

You can view the schedule in the Schedule pane of the test. The schedule shows the next run time and the status of the schedule. You can have only one schedule in an active , paused or disabled state. You can add another shedule after the current schedule is completed.

You can view the trigger for a test run in the **Test runs** grid of the test. The trigger shows as Scheduled for a scheduled test run. You can filter the test runs grid to view only the scheduled test runs.


## Modify a schedule

You can modify the schedule of a test after you've added it. You can also pause or resume a schedule. A schedule is disabled if three consecutive test runs of a schedule fail. You can resolve the issues with the test and enable the schedule again  from the Schedule pane of the test.

## Next steps

In this article, you learned how to schedule load tests with Azure Load Testing. To learn more about Azure Load Testing, see the [Azure Load Testing documentation](https://docs.microsoft.com/azure/load-testing/?WT.mc_id=A261C142F).






