---
title: 'Quickstart: Send custom events to an Azure function - Event Grid'
description: Learn how to use Azure Event Grid and the Azure CLI or portal to publish a topic and subscribe to that event, by using an Azure function for the endpoint.
ms.date: 04/24/2024
ms.topic: quickstart
ms.custom: mode-other, devx-track-azurecli 
ms.devlang: azurecli
---

# Quickstart: Route custom events to an Azure function by using Event Grid

[Azure Event Grid](overview.md) is an event-routing service for the cloud. Azure Functions is one of the [supported event handlers](event-handlers.md).

In this quickstart, you use the Azure portal to create a custom topic, subscribe to the custom topic, and trigger the event to view the result. You send the events to an Azure function.

[!INCLUDE [quickstarts-free-trial-note.md](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## Create a function with an Event Grid trigger by using Visual Studio Code

In this section, you use Visual Studio Code to create a function with an Event Grid trigger.

### Prerequisites

* [Visual Studio Code](https://code.visualstudio.com/) installed on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms)
* [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)

### Create a function

1. Open Visual Studio Code.

1. On the left bar, select **Azure**.

1. On the left pane, in the **WORKSPACE** section, select the **Azure Functions** button on the command bar, and then select **Create Function**.

    :::image type="content" source="./media/custom-event-to-function/visual-studio-code-new-function-menu.png" alt-text="Screenshot that shows the Azure tab of Visual Studio Code with the menu command for creating a function.":::

1. Select a folder where you want to save the function code.

1. For the **Create new project** command, for **Language**, select **C#**, and then select the Enter key.

    :::image type="content" source="./media/custom-event-to-function/select-function-language.png" alt-text="Screenshot that shows the selection of C Sharp as the language for developing an Azure function."  lightbox="./media/custom-event-to-function/select-function-language.png":::
1. For **.NET runtime**, select **.NET 8.0 Isolated LTS**, and then select the Enter key.

1. For **Template for the function**, select **Azure Event Grid trigger**, and then select the Enter key.

1. For **Function name**, enter a name for your function, and then select the Enter key.  

1. For **Namespace**, enter a name for the function's namespace, and then select the Enter key.

1. Open the project in the current window or a new window, or add it to a workspace.

1. Wait for the function to be created. The status of the function creation appears in the lower-right corner.

    :::image type="content" source="./media/custom-event-to-function/function-creation-status.png" alt-text="Screenshot that shows the status of function creation."  lightbox="./media/custom-event-to-function/function-creation-status.png":::
1. View the code in the *YourFunctionName.cs* file, specifically the `Run` method. It prints the information by using a logger.

    ```csharp
    [Function(nameof(MyEventGridTriggerFunc))]
    public void Run([EventGridTrigger] CloudEvent cloudEvent)
    {
        _logger.LogInformation("Event type: {type}, Event subject: {subject}", cloudEvent.Type, cloudEvent.Subject);
    }
    ```

### Deploy the function to Azure

1. Select the **Azure** button on the left bar if the **Azure** pane isn't already open.

1. Hover over your project and select the **Deploy to Azure** button.

    :::image type="content" source="./media/custom-event-to-function/deploy-to-azure-button.png" alt-text="Screenshot that shows the button for deploying to Azure."  lightbox="./media/custom-event-to-function/deploy-to-azure-button.png":::
1. In the dropdown list of the command palette, select **+ Create new function app**, and then select the Enter key.

1. For **Name**, enter a globally unique name for the new function app, and then select the Enter key.

1. For **Runtime stack**, select **.NET 8 Isolated**.

1. For **Location** for your Azure resources, select a region that's close to you.

1. The status of function app creation appears on the **AZURE** tab of the bottom pane. After the function app is created, you see the status of deploying the function that you created locally to the function app.

1. After the deployment succeeds, expand the **Create Function App succeeded** message and select **Click to view resource**. Confirm that your function is selected in the **RESOURCES** section on the left pane.

1. Right-click your function, and then select **Open in Portal**.

    :::image type="content" source="./media/custom-event-to-function/click-to-view-functions-app.png" alt-text="Screenshot that shows selections for opening a function in the portal."  lightbox="./media/custom-event-to-function/click-to-view-functions-app.png":::
1. Sign in to Azure if necessary, and confirm that the **Function App** page appears for your function.

1. On the bottom pane, select your function.

    :::image type="content" source="./media/custom-event-to-function/select-function.png" alt-text="Screenshot that shows the selection of an Azure function on the Function App page."  lightbox="./media/custom-event-to-function/select-function.png":::
1. Switch to the **Logs** tab. Keep this tab open so that you can see logged messages when you send an event to an Event Grid topic later in this tutorial.

    :::image type="content" source="./media/custom-event-to-function/function-logs-window.png" alt-text="Screenshot that shows the Logs tab for a function in the Azure portal."  lightbox="./media/custom-event-to-function/function-logs-window.png":::

## Create a custom topic

An Event Grid topic provides a user-defined endpoint that you post your events to.

1. On a new tab of the web browser window, sign in to the [Azure portal](https://portal.azure.com/).

1. On the search bar at the topic, search for **Event Grid Topics**, and then select **Event Grid Topics**.

    :::image type="content" source="./media/custom-event-to-function/select-topics.png" alt-text="Screenshot that shows the selection of Event Grid topics." lightbox="./media/custom-event-to-function/select-topics.png" :::
1. On the **Topics** page, select **+ Create** on the command bar.

    :::image type="content" source="./media/custom-event-to-function/add-topic-button.png" alt-text="Screenshot that shows the button for creating an Event Grid topic." lightbox="./media/custom-event-to-function/add-topic-button.png":::
1. On the **Create Topic** pane, follow these steps:

    1. For **Subscription**, select your Azure subscription.
    1. For **Resource group**, select the same resource group from the previous steps.
    1. For **Name**, provide a unique name for the custom topic. The topic name must be unique because a Domain Name System (DNS) entry represents it.

       Don't use the name shown in the example image. Instead, create your own name. It must be 3-50 characters and contain only the values a-z, A-Z, 0-9, and a hyphen (`-`).
    1. For **Region**, select a location for the Event Grid topic.
    1. Select **Review + create**.

        :::image type="content" source="./media/custom-event-to-function/create-custom-topic.png" alt-text="Screenshot that shows the pane for creating a topic.":::
    1. On the **Review + create** tab, review settings and then select **Create**.
1. After the custom topic is created, select the **Go to resource** link to open the **Event Grid Topic** page for that topic.

    :::image type="content" source="./media/custom-event-to-function/topic-home-page.png" lightbox="./media/custom-event-to-function/topic-home-page.png" alt-text="Screenshot that shows the page for an Event Grid custom topic.":::

## Subscribe to a custom topic

You subscribe to an Event Grid topic to tell Event Grid which events you want to track, and where to send the events.

1. On the **Event Grid Topic** page for your custom topic, select **+ Event Subscription** on the toolbar.

    :::image type="content" source="./media/custom-event-to-function/new-event-subscription.png" alt-text="Screenshot that shows the button for adding an event subscription on the toolbar." lightbox="./media/custom-event-to-function/new-event-subscription.png":::
1. On the **Create Event Subscription** pane, follow these steps:

    1. For **Name**, enter a name for the event subscription.
    1. For **Event Schema**, select **Cloud Event Schema v1.0**.
    1. For **Endpoint Type**, select **Azure Function**.
    1. Select **Configure an endpoint**.

        :::image type="content" source="./media/custom-event-to-function/provide-subscription-values.png" alt-text="Screenshot that shows event subscription values.":::
    1. On the **Select Azure Function** pane, follow these steps:
        1. For **Subscription**, select the Azure subscription that has the function.
        1. For **Resource group**, select the resource group that has the function.
        1. For **Function app**, select your function app.
        1. For **Function**, select the function in the function app.
        1. Select **Confirm Selection**.

            :::image type="content" source="./media/custom-event-to-function/provide-endpoint.png" alt-text="Screenshot that shows the pane for selecting a previously created Azure function.":::
    1. This step is optional, but we recommend it for production scenarios. On the **Create Event Subscription** pane, go to the **Additional Features** tab and set values for **Max events per batch** and **Preferred batch size in kilobytes**.

        Batching can give you high throughput. For **Max events per batch**, set the maximum number of events that a subscription will include in a batch. **Preferred batch size in kilobytes** sets the preferred upper bound of batch size, but it can be exceeded if a single event is larger than this threshold.

        :::image type="content" source="./media/custom-event-to-function/enable-batching.png" alt-text="Screenshot that shows batching settings for an event subscription.":::
    1. On the **Create Event Subscription** pane, select **Create**.

## Send an event to your topic

Now, trigger an event to see how Event Grid distributes the message to your endpoint. Use either the Azure CLI or Azure PowerShell to send a test event to your custom topic. Typically, an application or an Azure service would send the event data.

The first example uses the Azure CLI. It gets the URL and key for the custom topic and sample event data. Use your custom topic name for `topicname`. It creates sample event data.

The `data` element of the JSON is the payload of your event. Any well-formed JSON can go in this field. You can also use the subject field for advanced routing and filtering.

The cURL tool sends HTTP requests. In this article, you use cURL to send the event to the custom topic.

### Azure CLI

1. In the Azure portal, select **Cloud Shell**. If you're in Azure PowerShell mode, select **Switch to Bash**.

    :::image type="content" source="./media/custom-event-quickstart-portal/cloud-shell-bash.png" alt-text="Screenshot that shows the Bash window in Azure Cloud Shell.":::
1. Set the `topicname` and `resourcegroupname` variables that are used in the commands.

    Replace `TOPICNAME` with the name of your Event Grid topic.

    ```azurecli
    topicname="TOPICNAME"
    ```

    Replace `RESOURCEGROUPNAME` with the name of the Azure resource group that contains the Event Grid topic.

    ```azurecli
    resourcegroupname="RESOURCEGROUPNAME"
    ```

1. Use the following command to get the endpoint for the topic. After you copy and paste the command, update the topic name and resource group name before you run it.

    ```azurecli
    endpoint=$(az eventgrid topic show --name $topicname -g $resourcegroupname --query "endpoint" --output tsv)
    ```

1. Use the following command to get the key for the custom topic. After you copy and paste the command, update the topic name and resource group name before you run it.

    ```azurecli
    key=$(az eventgrid topic key list --name $topicname -g $resourcegroupname --query "key1" --output tsv)
    ```

1. Copy the following statement with the event definition, and then select the Enter key.

    ```json
    event='[ {"id": "'"$RANDOM"'", "eventType": "recordInserted", "subject": "myapp/vehicles/motorcycles", "eventTime": "'`date +%Y-%m-%dT%H:%M:%S%z`'", "data":{ "make": "Ducati", "model": "Monster"},"dataVersion": "1.0"} ]'
    ```

1. Run the following cURL command to post the event:

    ```
    curl -X POST -H "aeg-sas-key: $key" -d "$event" $endpoint
    ```

1. Confirm that the message from the function appears on the **Logs** tab for your function in the Azure portal.

    :::image type="content" source="./media/custom-event-quickstart-portal/function-log-output.png" alt-text="Screenshot that shows the Logs tab for an Azure function." lightbox="./media/custom-event-quickstart-portal/function-log-output.png":::

### Azure PowerShell

The second example uses Azure PowerShell to perform similar steps.

1. In the Azure portal, select **Cloud Shell** (or go to the [Azure Cloud Shell page](https://shell.azure.com/)). In the upper-left corner of the Cloud Shell window, select **Switch to PowerShell**.

1. Set the following variables. After you copy and paste each command, update the topic name and resource group name before you run it.

    ```powershell
    $resourceGroupName = "RESOURCEGROUPNAME"
    ```

    ```powershell
    $topicName = "TOPICNAME"
    ```

1. Run the following commands to get the endpoint and the keys for the topic:

    ```powershell
    $endpoint = (Get-AzEventGridTopic -ResourceGroupName $resourceGroupName -Name $topicName).Endpoint
    $keys = Get-AzEventGridTopicKey -ResourceGroupName $resourceGroupName -Name $topicName
    ```

1. Prepare the event. Copy and run these statements in the Cloud Shell window:

    ```powershell
    $eventID = Get-Random 99999

    #Date format should be SortableDateTimePattern (ISO 8601)
    $eventDate = Get-Date -Format s

    #Construct the body by using a hash table
    $htbody = @{
        id= $eventID
        eventType="recordInserted"
        subject="myapp/vehicles/motorcycles"
        eventTime= $eventDate   
        data= @{
            make="Ducati"
            model="Monster"
        }
        dataVersion="1.0"
    }
    
    #Use ConvertTo-Json to convert the event body from a hash table to a JSON object
    #Append square brackets to the converted JSON payload because they're expected in the event's JSON payload syntax
    $body = "["+(ConvertTo-Json $htbody)+"]"
    ```

1. Use the `Invoke-WebRequest` cmdlet to send the event:

    ```powershell
    Invoke-WebRequest -Uri $endpoint -Method POST -Body $body -Headers @{"aeg-sas-key" = $keys.Key1}
    ```

1. Confirm that the message from the function appears on the **Logs** tab for your function in the Azure portal.

    :::image type="content" source="./media/custom-event-quickstart-portal/function-log-output.png" alt-text="Screenshot that shows the Logs tab for a function." lightbox="./media/custom-event-quickstart-portal/function-log-output.png":::

### Verify that the function received the event

You triggered the event, and Event Grid sent the message to the endpoint that you configured when subscribing. Now you can check whether the function received it.

1. On the **Monitor** page for your function, find an invocation.

    :::image type="content" source="./media/custom-event-to-function/monitor-page-invocations.png" alt-text="Screenshot that shows the Invocations tab of the Monitor page.":::
1. Select the invocation to display the details.

    :::image type="content" source="./media/custom-event-to-function/invocation-details-page.png" alt-text="Screenshot that shows invocation details.":::

   You can also use the **Logs** tab on the right pane to see the logged messages when you post events to the topic's endpoint.

    :::image type="content" source="./media/custom-event-to-function/successful-function.png" lightbox="./media/custom-event-to-function/successful-function.png" alt-text="Screenshot that shows the Monitor view of a function with a log.":::

## Clean up resources

If you plan to continue working with this event, don't clean up the resources that you created in this article. Otherwise, delete the resources that you created in this article.

1. On the left menu, select **Resource groups**.

    ![Screenshot that shows the page for resource groups](./media/custom-event-to-function/delete-resource-groups.png)

    An alternative is to select **All Services** on the left menu, and then select **Resource groups**.
1. Select the resource group to open the pane for its details.

1. On the toolbar, select **Delete resource group**.

1. Confirm the deletion by entering the name of the resource group, and then select **Delete**.

The Cloud Shell window created and used the other resource group that appears on the **Resource groups** page. Delete this resource group if you don't plan to use the Cloud Shell window later.

## Related content

Now that you know how to create topics and event subscriptions, learn more about what Event Grid can help you do:

* [About Event Grid](overview.md)
* [Route Azure Blob Storage events to a custom web endpoint](../storage/blobs/storage-blob-event-quickstart.md?toc=%2fazure%2fevent-grid%2ftoc.json)
* [Monitor virtual machine changes with Azure Event Grid and Logic Apps](monitor-virtual-machine-changes-logic-app.md)
* [Stream big data into a data warehouse](event-hubs-integration.md)

To learn about publishing events to, and consuming events from, Event Grid by using various programming languages, see the following samples:

* [Azure Event Grid samples for .NET](/samples/azure/azure-sdk-for-net/azure-event-grid-sdk-samples/)
* [Azure Event Grid samples for Java](/samples/azure/azure-sdk-for-java/eventgrid-samples/)
* [Azure Event Grid samples for Python](/samples/azure/azure-sdk-for-python/eventgrid-samples/)
* [Azure Event Grid samples for JavaScript](/samples/azure/azure-sdk-for-js/eventgrid-javascript/)
* [Azure Event Grid samples for TypeScript](/samples/azure/azure-sdk-for-js/eventgrid-typescript/)
