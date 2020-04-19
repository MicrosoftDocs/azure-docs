---
title: Create a function that runs on a schedule in Azure 
description: Learn how to create a function in Azure that runs based on a schedule that you define.

ms.assetid: ba50ee47-58e0-4972-b67b-828f2dc48701
ms.topic: how-to
ms.date: 04/16/2020
ms.custom: mvc, cc996988-fb4f-47
---
# Create a function in Azure that is triggered by a timer

Learn how to use Azure Functions to create a [serverless](https://azure.microsoft.com/solutions/serverless/) function that runs based on a schedule that you define.

## Prerequisites

To complete this tutorial:

+ If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create an Azure Function app

[!INCLUDE [Create function app Azure portal](../../includes/functions-create-function-app-portal.md)]

Your new function app is ready to use. Next, you'll create a function in the new function app.

:::image type="content" source="./media/functions-create-scheduled-function/function-app-create-success.png" alt-text="Function app successfully created." border="true":::

<a name="create-function"></a>

## Create a timer triggered function

1. In your function app, select **Functions**, and then select **+ Add** 

   :::image type="content" source="./media/functions-create-scheduled-function/function-add-function.png" alt-text="Add a function in the Azure portal." border="true":::

1. Select the **Timer trigger** template. 

    :::image type="content" source="./media/functions-create-scheduled-function/function-select-timer-trigger.png" alt-text="Select the timer trigger in the Azure portal." border="true":::

1. Configure the new trigger with the settings as specified in the table below the image, and then select **Create Function**.

    :::image type="content" source="./media/functions-create-scheduled-function/function-configure-timer-trigger.png" alt-text="Select the timer trigger in the Azure portal." border="true":::
    
    | Setting | Suggested value | Description |
    |---|---|---|
    | **Name** | Default | Defines the name of your timer triggered function. |
    | **Schedule** | 0 \*/1 \* \* \* \* | A six field [CRON expression](functions-bindings-timer.md#ncrontab-expressions) that schedules your function to run every minute. |

## Test the function

1. In your function, select **Code + Test** and expand the logs.

    :::image type="content" source="./media/functions-create-scheduled-function/function-test-timer-trigger.png" alt-text="Test the timer trigger in the Azure portal." border="true":::

1. Verify execution by viewing the information written to the logs.

    :::image type="content" source="./media/functions-create-scheduled-function/function-view-timer-logs.png" alt-text="View the timer trigger in the Azure portal." border="true":::

Now, you change the function's schedule so that it runs once every hour instead of every minute.

## Update the timer schedule

1. In your function, select **Integration**. Here, you define input and output bindings for your function and also set the schedule. 

1. Select **Timer (myTimer)**.

    :::image type="content" source="./media/functions-create-scheduled-function/function-update-timer-schedule.png" alt-text="Update the timer schedule in the Azure portal." border="true":::

1. Update the **Schedule** value to `0 0 */1 * * *`, and then select **Save**.  

    :::image type="content" source="./media/functions-create-scheduled-function/function-edit-timer-schedule.png" alt-text="Functions update timer schedule in the Azure portal." border="true":::

You now have a function that runs once every hour, on the hour.

## Clean up resources

[!INCLUDE [Next steps note](../../includes/functions-quickstart-cleanup.md)]

## Next steps

You've created a function that runs based on a schedule. For more information about timer triggers, see [Schedule code execution with Azure Functions](functions-bindings-timer.md).

[!INCLUDE [Next steps note](../../includes/functions-quickstart-next-steps.md)]
