---
title: Create a function in Azure triggered by a generic webhook | Microsoft Docs
description: Use Azure Functions to create a serverless function that is invoked by a webhook in Azure.
services: azure-functions
documentationcenter: na
author: ggailey777
manager: erikre
editor: ''
tags: ''

ms.assetid: fafc10c0-84da-4404-b4fa-eea03c7bf2b1
ms.service: functions
ms.devlang: multiple
ms.topic: get-started-article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 05/05/2017
ms.author: glenga

---
# Create a function triggered by a generic webhook

Learn how to create a function that is triggered by an HTTP webhook request with a generic JSON payload.  

![Generic webhook triggered function in the Azure portal](./media/functions-create-generic-webhook-triggered-function/function-app-in-portal-editor.png)

It should take you less than five minutes to complete all the steps in this topic.

## Prerequisites 

[!INCLUDE [Previous quickstart note](../../includes/functions-quickstart-previous-topics.md)]


[!INCLUDE [functions-portal-favorite-function-apps](../../includes/functions-portal-favorite-function-apps.md)] 

## <a name="create-function"></a>Create a generic webhook triggered function

1. Expand your function app, click the **+** button next to **Functions**, click the **GenericWebHook** template for your desired language. **Name your function**, then click **Create**. 

2. In your new function, click **</> Get function URL**, then copy and save the values. You use this value to configure the webhook. 

    ![Review the function code](./media/functions-create-generic-webhook-triggered-function/functions-copy-function-url-generic-secret.png) 
         
Next, you create a webhook endpoint in an activity log alert in Azure Monitor. 

## Create an activity log alert

1. In the Azure portal, navigate to the **Monitor** service

    ![Monitor](../monitoring-and-diagnostics/media/monitoring-activity-log-alerts/home-monitor.png)
2.	Click the **Monitor** option to open the Monitor blade. It first opens to the **Activity log** section.

3.	Now click on the **Alerts** section.

    ![Alerts](../monitoring-and-diagnostics/media/monitoring-activity-log-alerts/alerts-blades.png)
4.	Select the **Add activity log alert** and use the settings as specified in the table, and click **OK**:

    | Setting      |  Suggested value   | Description                              |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Activity log alert name** | FunctionAppError | Name of the activity log alert.
    | **Description** | Some description | Description that is shown in the alert payload. |
    | **Subscription** | Auto-filled | The subscription you are using. | 
    |  **Resource Group** | myResourceGroup | The resource group the alert is deployed to and that is being monitored. Use for both **Resource group** fields.|
    |  **Event Category** | | |
    |  **Event Category** | | |
    |  **Event Category** | | |


    ![Add-Alert-New-Action-Group](../monitoring-and-diagnostics/media/monitoring-activity-log-alerts/activity-log-alert-new-action-group.png)

7.	Choose the this alert will be associated with in the **Subscription**.

8.	Provide the , **Resource Group**, **Resource**, **Resource Type**, **Operation Name**, **Level**, **Status** and **Event intiated by** values to identify which events this alert should monitor.

9.	Create a **New** Action Group by giving it **Name** and **Short Name**; the Short Name will be referenced in the notifications sent when this alert is activated.

10.	Then, define a list of receivers by providing the receiver’s

    a. **Name:** Receiver’s name, alias or identifier.

    b. **Action Type:** Choose to contact the receiver via SMS, Email, or Webhook

    c. **Details:** Based on the action type chosen, provide a phone number, email address or webhook URI.

11.	Select **OK** when done to create the alert.
2. 
3. 
4. 
5. 
6. navigate to a repository that you own. You can also use any repository that you have forked. If you need to fork a repository, use <https://github.com/Azure-Samples/functions-quickstart>. 
 
2. Click **Settings**, then click **Webhooks**, and  **Add webhook**.
   
    ![Add a GitHub webhook](./media/functions-create-generic-webhook-triggered-function/functions-create-new-generic-webhook-2.png)

3. Use settings as specified in the table, then click **Add webhook**.
 
    ![Set the webhook URL and secret](./media/functions-create-generic-webhook-triggered-function/functions-create-new-generic-webhook-3.png)

    | Setting      |  Suggested value   | Description                              |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Payload URL** | Copied value | Use the value returned by  **</> Get function URL**. |
    | **Secret**   | Copied value | Use the value returned by  **</> Get GitHub secret**. |
    | **Content type** | application/json | The function expects a JSON payload. |
    | Event triggers | Let me select individual events | We only want to trigger on issue comment events.  |
    |                | Issue comment                    |  |

Now, the webhook is configured to trigger your function when a new issue comment is added. 

## Test the function
1. In your GitHub repository, open the **Issues** tab in a new browser window.

2. In the new window, click **New Issue**, type a title, and then click **Submit new issue**. 

2. In the issue, type a comment and click **Comment**. 

    ![Add a GitHub issue comment.](./media/functions-create-generic-webhook-triggered-function/functions-generic-webhook-add-comment.png) 

3. Go back to the portal and view the logs. You should see a trace entry with the new comment text. 
    
     ![View the comment text in the logs.](./media/functions-create-generic-webhook-triggered-function/function-app-view-logs.png)
 

## Clean up resources

[!INCLUDE [Next steps note](../../includes/functions-quickstart-cleanup.md)]

## Next steps

You have created a function that runs when a request is received from a GitHub webhook. 
[!INCLUDE [Next steps note](../../includes/functions-quickstart-next-steps.md)]
For more information about webhook triggers, see [Azure Functions HTTP and webhook bindings](functions-bindings-http-webhook.md). 

[!INCLUDE [Getting Started Note](../../includes/functions-get-help.md)]

