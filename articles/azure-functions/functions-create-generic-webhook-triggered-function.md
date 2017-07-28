---
title: Create a function in Azure triggered by a generic webhook | Microsoft Docs
description: Use Azure Functions to create a serverless function that is invoked by a webhook in Azure.
services: functions
documentationcenter: na
author: ggailey777
manager: cfowler
editor: ''
tags: ''

ms.assetid: fafc10c0-84da-4404-b4fa-eea03c7bf2b1
ms.service: functions
ms.devlang: multiple
ms.topic: get-started-article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 07/17/2017
ms.author: glenga

---
# Create a function triggered by a generic webhook

Learn how to create a function that is triggered by an HTTP webhook request with a generic JSON payload.  

![Generic webhook triggered function in the Azure portal](./media/functions-create-generic-webhook-triggered-function/function-app-in-portal-editor.png)

## Prerequisites 

To complete this tutorial:

+ If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [functions-portal-favorite-function-apps](../../includes/functions-portal-favorite-function-apps.md)]

## Create an Azure Function app

[!INCLUDE [Create function app Azure portal](../../includes/functions-create-function-app-portal.md)]

![Function app successfully created.](./media/functions-create-first-azure-function/function-app-create-success.png)

Next, you create a function in the new function app.

## <a name="create-function"></a>Create a generic webhook triggered function

1. Expand your function app and click the **+** button next to **Functions**. If this is the first function in your function app, select **Custom function**. This displays the complete set of function templates.

    ![Functions quickstart page in the Azure portal](./media/functions-create-generic-webhook-triggered-function/add-first-function.png)

2. Select the **GitHubWebHook** template for your desired language. **Name your function**, then select **Create**.

     ![Create a GitHub webhook triggered function in the Azure portal](./media/functions-create-generic-webhook-triggered-function/functions-create-generic-webhook-trigger.png) 

2. In your new function, click **</> Get function URL**, then copy and save the values. You use this value to configure the webhook. 

    ![Review the function code](./media/functions-create-generic-webhook-triggered-function/functions-copy-function-url.png)
         
Next, you create a webhook endpoint in an activity log alert in Azure Monitor. 

## Create an activity log alert

1. In the Azure portal, navigate to the **Monitor** service, select **Alerts**, and click **Add activity log alert**.   

    ![Monitor](./media/functions-create-generic-webhook-triggered-function/functions-monitor-add-alert.png)

2. Use the settings as specified in the table:

    ![Add-Alert-New-Action-Group](./media/functions-create-generic-webhook-triggered-function/functions-monitor-add-alert-settings.png)


    | Setting      |  Suggested value   | Description                              |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Activity log alert name** | FunctionAppAlert | Name of the activity log alert that is unique in the resource group. |
    | **Subscription** | Auto-filled | The subscription you are using. | 
    |  **Resource Group** | myResourceGroup | The resource group the alert is deployed to and that is being monitored. Use for both **Resource group** fields.|
    | **Event category** | Administrative | This category includes changes made to Azure resources.  |
    |  **Resource type** | App Services (Microsoft.Web/sites) | Filters alerts only to App Service instances, which includes function apps. |
    |  **Resource** | Your function app | Select the function app you created. |
    |  **Operation name** | Apply Web App Configuration (sites) | Filters alerts to only app configuration changes. |
    | Level | Informational | Include informational level alerts. | 
    | **Action group** | New | Create a new action group, which defines the action takes when an alert is raised. |
    | **Action group name** | function-alerts | A name to identify the action group.  | 
    | **Short name** | FuncAppAlert | A short name for the action group. |  

3. In **Actions**, add an action using the settings as specified in the table: 

    | Setting      |  Suggested value   | Description                              |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Name** | FuncAppWebhook | A name for the action. |
    | **Action type** | Webhook | The response to the alert is that a Webhook URL is called. |
    | **Details** | Webhook URL | Paste in the webhook URL that you copied earlier. |

4. Click **OK** to create the alert and action group.  

## Update the function code




## Test the function

1. Click your function app, then **Application settings**. 
    
    ![Select function app settings.](./media/functions-create-generic-webhook-triggered-function/function-app-settings.png)

2. Scroll down to **App settings** and add a new **Key**-**Value** pair and click **Save**. This write an update to the activity logs that generates an alert. 

    ![Add a test application setting.](./media/functions-create-generic-webhook-triggered-function/function-app-add-test-setting.png)

3. Go back to your function and expand the logs. You should see a trace entry with the new comment text. 
    
     ![View the comment text in the logs.](./media/functions-create-generic-webhook-triggered-function/function-app-view-logs.png)
 

## Clean up resources

[!INCLUDE [Next steps note](../../includes/functions-quickstart-cleanup.md)]

## Next steps

You have created a function that runs when a request is received from a GitHub webhook. 
[!INCLUDE [Next steps note](../../includes/functions-quickstart-next-steps.md)]
For more information about webhook triggers, see [Azure Functions HTTP and webhook bindings](functions-bindings-http-webhook.md). 

