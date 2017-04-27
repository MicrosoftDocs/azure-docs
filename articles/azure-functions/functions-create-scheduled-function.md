---
title: Create a function that runs on a schedule | Microsoft Docs
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
ms.date: 04/18/2017
ms.author: glenga

---
#  Create a function in Azure that is triggered by a timer

Learn how to use Azure Functions to create a function that runs based a schedule that you define. 

![Create function app in the Azure portal](./media/functions-create-scheduled-function/function-app-in-portal-editor.png)

[!INCLUDE [Next steps note](../../includes/functions-quickstart-previous-topics.md)]

In this topic, you create a timer triggered function in your existing function app.  It should take you less than five minutes to complete all the steps in this topic.

## <a name="create-function"></a>Create a timer triggered function

1. Log in to the [Azure portal](https://portal.azure.com/). 

2. In the search bar at the top of the portal, type the name of your function app and select it from the list.

3. Expand your function app, click the **+** button next to **Functions** and click the **TimerTrigger** template for your desired language. USe the following settings and then click **Create**.

    | Setting      |  Suggested value   | Description                              |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Name your function** | `TimerTriggerCSharp1` | Defines the name of your timer triggered function.
    | **Schedule** | `0 */1 * * * *` | Timer will run your function every minute. |

    A function is created in your chosen language that runs every minute. 

4. Verify execution by viewing trace information written to the logs. 

    ![Functions log viewer in the Azure portal.](./media/functions-create-scheduled-function/functions-timer-trigger-view-logs2.png)

Now, you can change the function run run less often, such as once every hour. 

## Update the timer schedule

To modify the schedule used by the timer trigger, expand your function and click **Integrate**. This is where you define input and output bindings for your timer trigger, and also set the schedule. Enter a new **Schedule** value of `0 0 */1 * * *`, and then click **Save**.  

![Functions update timer schedule in the Azure portal.](./media/functions-create-scheduled-function/functions-timer-trigger-change-schedule.png)

You now have a function that runs once every hour. 

## Clean up resources

[!INCLUDE [Next steps note](../../includes/functions-quickstart-cleanup.md)]

## Next steps
You have created a function that runs based on a schedule. For more information, see [Schedule code execution with Azure Functions](functions-bindings-timer.md). 

[!INCLUDE [Next steps note](../../includes/functions-quickstart-next-steps.md)]

[!INCLUDE [Getting Started Note](../../includes/functions-get-help.md)]

