---
title: Create a function in Azure that runs on a schedule
description: Learn how to use the Azure portal to create a function that runs based on a schedule that you define.
ms.assetid: ba50ee47-58e0-4972-b67b-828f2dc48701
ms.topic: how-to
ms.date: 06/10/2022
ms.custom: mvc, cc996988-fb4f-47, devdivchpfy22
---
# Create a function in the Azure portal that runs on a schedule

Learn how to use the Azure portal to create a function that runs [serverless](https://azure.microsoft.com/solutions/serverless/) on Azure based on a schedule that you define.

## Prerequisites

To complete this tutorial:

Ensure that you have an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a function app

[!INCLUDE [Create function app Azure portal](../../includes/functions-create-function-app-portal.md)]

Your new function app is ready to use. Next, you'll create a function in the new function app.

:::image type="content" source="./media/functions-create-scheduled-function/function-app-create-success-new.png" alt-text="Screenshot showing successful creation of the function app." border="true":::

<a name="create-function"></a>

## Create a timer triggered function

1. In your function app, select **Functions**, and then select **+ Create**.

   :::image type="content" source="./media/functions-create-scheduled-function/function-create-function.png" alt-text="Screenshot of adding a function in the Azure portal." border="true":::

1. Select the **Timer trigger** template.

    :::image type="content" source="./media/functions-create-scheduled-function/function-select-timer-trigger-template.png" alt-text="Screenshot of select the timer trigger page in the Azure portal." border="true":::

1. Configure the new trigger with the settings as specified in the table below the image, and then select **Create**.

    :::image type="content" source="./media/functions-create-scheduled-function/function-configure-timer-trigger-new.png" alt-text="Screenshot that shows the New Function page with the Timer Trigger template selected." border="true":::

    | Setting | Suggested value | Description |
    |---|---|---|
    | **Name** | Default | Defines the name of your timer triggered function. |
    | **Schedule** | 0 \*/1 \* \* \* \* | A six field [CRON expression](functions-bindings-timer.md#ncrontab-expressions) that schedules your function to run every minute. |

## Test the function

1. In your function, select **Code + Test** and expand the **Logs**.

    :::image type="content" source="./media/functions-create-scheduled-function/function-code-test-timer-trigger.png" alt-text="Screenshot of the Test the timer trigger page in the Azure portal." border="true":::

1. Verify execution by viewing the information written to the logs.

    :::image type="content" source="./media/functions-create-scheduled-function/function-timer-logs-view.png" alt-text="Screenshot showing the View the timer trigger page in the Azure portal." border="true":::

Now, you change the function's schedule so that it runs once every hour instead of every minute.

## Update the timer schedule

1. In your function, select **Integration**. Here, you define the input and output bindings for your function and also set the schedule.

1. Select **Timer (myTimer)**.

    :::image type="content" source="./media/functions-create-scheduled-function/function-update-timer-schedule-new.png" alt-text="Screenshot of Update the timer schedule page in the Azure portal." border="true":::

1. Update the **Schedule** value to `0 0 */1 * * *`, and then select **Save**.  

    :::image type="content" source="./media/functions-create-scheduled-function/function-edit-timer-schedule.png" alt-text="Screenshot of the Update function timer schedule page in the Azure portal." border="true":::

You now have a function that runs once every hour, on the hour.

## Clean up resources

[!INCLUDE [Next steps note](../../includes/functions-quickstart-cleanup.md)]

## Next steps

You've created a function that runs based on a schedule. For more information about timer triggers, see [Schedule code execution with Azure Functions](functions-bindings-timer.md).

[!INCLUDE [Next steps note](../../includes/functions-quickstart-next-steps.md)]
