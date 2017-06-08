---
title: Create a function that runs on a schedule in Azure | Microsoft Docs
description: Learn how to create a function in Azure that runs based on a schedule that you define.
services: functions
documentationcenter: na
author: ggailey777
manager: erikre
editor: ''
tags: ''

ms.assetid: ba50ee47-58e0-4972-b67b-828f2dc48701
ms.service: functions
ms.devlang: multiple
ms.topic: get-started-article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 05/31/2017
ms.author: glenga
ms.custom: mvc
---
# Create a function in Azure that is triggered by a timer

Learn how to use Azure Functions to create a function that runs based a schedule that you define.

![Create function app in the Azure portal](./media/functions-create-scheduled-function/function-app-in-portal-editor.png)

## Prerequisites

To complete this tutorial:

+ If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [functions-portal-favorite-function-apps](../../includes/functions-portal-favorite-function-apps.md)]

## Create an Azure Function app

[!INCLUDE [Create function app Azure portal](../../includes/functions-create-function-app-portal.md)]

![Function app successfully created.](./media/functions-create-first-azure-function/function-app-create-success.png)

Next, you create a function in the new function app.

<a name="create-function"></a>

## Create a timer triggered function

1. Expand your function app and click the **+** button next to **Functions**. If this is the first function in your function app, select **Custom function**. This displays the complete set of function templates.

    ![Functions quickstart page in the Azure portal](./media/functions-create-scheduled-function/add-first-function.png)

2. Select the **TimerTrigger** template for your desired language. Then use the settings as specified in the table:

    ![Create a timer triggered function in the Azure portal.](./media/functions-create-scheduled-function/functions-create-timer-trigger.png)

    | Setting | Suggested value | Description |
    |---|---|---|
    | **Name your function** | TimerTriggerCSharp1 | Defines the name of your timer triggered function. |
    | **[Schedule](http://en.wikipedia.org/wiki/Cron#CRON_expression)** | 0 \*/1 \* \* \* \* | A six field [CRON expression](http://en.wikipedia.org/wiki/Cron#CRON_expression) that schedules your function to run every minute. |

2. Click **Create**. A function is created in your chosen language that runs every minute.

3. Verify execution by viewing trace information written to the logs.

    ![Functions log viewer in the Azure portal.](./media/functions-create-scheduled-function/functions-timer-trigger-view-logs2.png)

Now, you can change the function's schedule so that it runs less often, such as once every hour. 

## Update the timer schedule

1. Expand your function and click **Integrate**. This is where you define input and output bindings for your function and also set the schedule. 

2. Enter a new **Schedule** value of `0 0 */1 * * *`, and then click **Save**.  

![Functions update timer schedule in the Azure portal.](./media/functions-create-scheduled-function/functions-timer-trigger-change-schedule.png)

You now have a function that runs once every hour. 

## Clean up resources

[!INCLUDE [Next steps note](../../includes/functions-quickstart-cleanup.md)]

## Next steps

You have created a function that runs based on a schedule.

[!INCLUDE [Next steps note](../../includes/functions-quickstart-next-steps.md)]

For more information timer triggers, see [Schedule code execution with Azure Functions](functions-bindings-timer.md).