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

It should take you less than five minutes to complete all the steps in this topic.

## Before you begin

[!INCLUDE [Next steps note](../../includes/functions-quickstart-previous-topics.md)]

In this topic, you create a timer triggered function in your existing function app. 

[!INCLUDE [functions-portal-favorite-function-apps](../../includes/functions-portal-favorite-function-apps.md)] 

## <a name="create-function"></a>Create a timer triggered function

1. Expand your function app, click the **+** button next to **Functions** and click the **TimerTrigger** template for your desired language. Use the following settings and then click **Create**:

    | Setting      |  Suggested value   | Description                              |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Name your function** | `TimerTriggerCSharp1` | Defines the name of your timer triggered function.
    | **Schedule** | `0 */1 * * * *` | Timer runs your function every minute. |

    A function is created in your chosen language that runs every minute. 

4. Verify execution by viewing trace information written to the logs. 

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

[!INCLUDE [Getting Started Note](../../includes/functions-get-help.md)]

