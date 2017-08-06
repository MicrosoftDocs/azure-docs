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
ms.date: 08/06/2017
ms.author: glenga

---
# Create a function triggered by a generic webhook

Learn how to execute code when a resource group is created     in your subscription. In this topic, you create a function that is triggered by an HTTP webhook request from an alert in Azure Monitor. The request contains a JSON payload with data about the activity that triggered the alert.  

![Generic webhook triggered function in the Azure portal](./media/functions-create-generic-webhook-triggered-function/function-completed.png)

## Prerequisites 

To complete this tutorial:

+ If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [functions-portal-favorite-function-apps](../../includes/functions-portal-favorite-function-apps.md)]

## Create an Azure Function app

[!INCLUDE [Create function app Azure portal](../../includes/functions-create-function-app-portal.md)]

![Function app successfully created.](./media/functions-create-first-azure-function/function-app-create-success.png)

Next, you create a function in the new function app.

## <a name="create-function"></a>Create a generic webhook triggered function

1. Expand your function app and click the **+** button next to **Functions**. If this function is the first one in your function app, select **Custom function**. This displays the complete set of function templates.

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

    ![Create an activity log alert](./media/functions-create-generic-webhook-triggered-function/functions-monitor-add-alert-settings.png)

    
| Setting      |  Suggested value   | Description                              |
| ------------ |  ------- | -------------------------------------------------- |
| **Activity log alert name** | resource-group-create-alert | Name of the activity log alert. |
| **Subscription** | Your subscription | The subscription you are using for this tutorial. | 
|  **Resource Group** | myResourceGroup | The resource group the alert and action group is deployed to. Using the same resource group as your function app makes it easier to clean up after you complete the tutorial. |
| **Event category** | Administrative | This category includes changes made to Azure resources.  |
|  **Resource type** | Resource groups | Filters alerts to only resource groups activities. |
|  **Resource Group** | All | Monitor all resource groups. |
|  **Resource**  | All | Monitor all resources. |
|  **Operation name** | Create Resource Group | Filters alerts to only create operations. |
| **Level** | Informational | Include informational level alerts. | 
| **Status** | Succeeded | Filters alerts to only actions that have completed successfully. |
| **Action group** | New | Create a new action group, which defines the action takes when an alert is raised. |
| **Action group name** | function-webhook | A name to identify the action group.  | 
| **Short name** | funcwebhook | A short name for the action group. |  

3. In **Actions**, add an action using the settings as specified in the table: 

    ![Add an action group](./media/functions-create-generic-webhook-triggered-function/functions-monitor-add-alert-settings-2.png)

    | Setting      |  Suggested value   | Description                              |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Name** | CallFunctionWebhook | A name for the action. |
    | **Action type** | Webhook | The response to the alert is that a Webhook URL is called. |
    | **Details** | Webhook URL | Paste in the webhook URL that you copied earlier. |

4. Click **OK** to create the alert and action group.  

The webhook is now called when a resource group is created in your subscription. Next, you update the code to handle the JSON log data in the body of the request.   

## Update the function code

Replace the C# script code in the function in the portal with the following code:

```csharp
#r "Newtonsoft.Json"

using System;
using System.Net;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public static async Task<object> Run(HttpRequestMessage req, TraceWriter log)
{
    log.Info($"Webhook was triggered!");

    // Get the activityLog object from the JSON in the message body.
    string jsonContent = await req.Content.ReadAsStringAsync();
    JToken activityLog = JObject.Parse(jsonContent.ToString())
        .SelectToken("data.context.activityLog");

    // Return an error if the resource in the activity log isn't a resource group. 
    if (activityLog == null || !string.Equals((string)activityLog["resourceType"], 
        "Microsoft.Resources/subscriptions/resourcegroups"))
    {
        log.Error("An error occured");
        return req.CreateResponse(HttpStatusCode.BadRequest, new
        {
            error = "Unexpected message payload or wrong alert received."
        });
    }

    // Write information about the created resource group to the streaming log.
    log.Info(string.Format("Resource group '{0}' was {1} on {2}.",
        (string)activityLog["resourceGroupName"],
        ((string)activityLog["subStatus"]).ToLower(), 
        (DateTime)activityLog["submissionTimestamp"]));

    return req.CreateResponse(HttpStatusCode.OK);    
}
```

Now you can test the function by creating a new resource group in your subscription.

## Test the function

1. Click the resource group icon in the left of the Azure portal, select **+ Add**, type a **Resource group name**, and select **Create** to create an empty resource group.
    
    ![Create a resource group.](./media/functions-create-generic-webhook-triggered-function/functions-create-resource-group.png)

2. Go back to your function and expand the **Logs** window. After the resource group is created, the alert is raised, and the function executes. The name of the new resource group is written to the logs.  

    ![Add a test application setting.](./media/functions-create-generic-webhook-triggered-function/function-view-logs.png)

3. (Optional) Go back and delete the resource group that you created. Because of the filtering in the alert, the delete operation does not trigger the function. 

## Clean up resources

[!INCLUDE [Next steps note](../../includes/functions-quickstart-cleanup.md)]

## Next steps

You have created a function that runs when a request is received from a GitHub webhook. 

[!INCLUDE [Next steps note](../../includes/functions-quickstart-next-steps.md)]

For more information about webhook triggers, see [Azure Functions HTTP and webhook bindings](functions-bindings-http-webhook.md). 

