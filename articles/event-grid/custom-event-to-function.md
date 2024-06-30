---
title: 'Quickstart: Send custom events to Azure Function - Event Grid'
description: 'Quickstart: Use Azure Event Grid and Azure CLI or portal to publish a topic, and subscribe to that event. An Azure Function is used for the endpoint.'
ms.date: 04/24/2024
ms.topic: quickstart
ms.custom: mode-other, devx-track-azurecli 
ms.devlang: azurecli
---

# Quickstart: Route custom events to an Azure Function with Event Grid

[Azure Event Grid](overview.md) is an eventing service for the cloud. Azure Functions is one of the [supported event handlers](event-handlers.md). In this article, you use the Azure portal to create a custom topic, subscribe to the custom topic, and trigger the event to view the result. You send the events to an Azure Function.

[!INCLUDE [quickstarts-free-trial-note.md](../../includes/quickstarts-free-trial-note.md)]

## Create an Azure function with Azure Event Grid trigger using Visual Studio Code
In this section, you use Visual Studio Code to create an Azure function with an Azure Event Grid trigger.

### Prerequisites

* [Visual Studio Code](https://code.visualstudio.com/) installed on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).
* [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions). 

### Create an Azure function

1. Launch Visual Studio Code. 
1. On the left bar, select **Azure**. 
1. In the left pane, In the **WORKSPACE** section, select Azure Functions button on the command bar, and then select **Create Function**. 

    :::image type="content" source="./media/custom-event-to-function/visual-studio-code-new-function-menu.png" alt-text="Screenshot that shows the Azure tab of Visual Studio Code with New function menu selected.":::
1. Select a folder where you want the Azure function code to be saved. 
1. For the **Create new project** command, for **language**, select **C#**, and press ENTER. 

    :::image type="content" source="./media/custom-event-to-function/select-function-language.png" alt-text="Screenshot that shows the selection of C# for the language used to develop the Azure function."  lightbox="./media/custom-event-to-function/select-function-language.png":::
1. For **.NET runtime**, select **.NET 8.0 Isolated LTS**, and press ENTER. 
1. For the **template for the function**, select **Azure Event Grid trigger**, and press ENTER. 
1. For **function name**, enter a name for your Azure function, and press ENTER.  
1. Enter a name for the **namespace** for the function, and press ENTER.
1. Open the project in the current window or a new window or add to a workspace. 
1. Wait for the function to be created. You see the status of the function creation in the bottom-right corner.
     
    :::image type="content" source="./media/custom-event-to-function/function-creation-status.png" alt-text="Screenshot that shows the status of the function creation."  lightbox="./media/custom-event-to-function/function-creation-status.png":::
1. View the code in the YourFunctionName.cs file, specifically the `Run` method. It prints the information using a logger. 

    ```csharp
    [Function(nameof(MyEventGridTriggerFunc))]
    public void Run([EventGridTrigger] CloudEvent cloudEvent)
    {
        _logger.LogInformation("Event type: {type}, Event subject: {subject}", cloudEvent.Type, cloudEvent.Subject);
    }
    ```

### Deploy the function to Azure

1. Select the Azure button on the left bar if it's not already open. 
1. Hover the mouse over your project, and select the **Deploy to Azure** button.

    :::image type="content" source="./media/custom-event-to-function/deploy-to-azure-button.png" alt-text="Screenshot that shows selection of the Deploy to Azure button."  lightbox="./media/custom-event-to-function/deploy-to-azure-button.png":::
1. In the drop-down of the command palette, select **+ Create new function app**, and press ENTER. 
1. Enter a **globally unique name** for the new function app, and press ENTER.
1. For **runtime stack**, select **.NET 8 Isolated**. 
1. For **location** for your Azure resources, select a region that's close to you.
1. Now, you see the status of Azure Functions app creation in the **AZURE** tab of the bottom pane. After the function app is created, you see the status of deploying the Azure function you created locally to the Functions app you created. 
1. After the deployment succeeds, expand the **Create Function App succeeded** message and select **Click to view resource**. You see that your Azure function is selected in the **RESOURCES** section on the left pane. 
1. Right-click on your Azure function, and select **Open in Portal**. 

    :::image type="content" source="./media/custom-event-to-function/click-to-view-functions-app.png" alt-text="Screenshot that shows the selection of Click to view resource in the AZURE tab in the bottom pane."  lightbox="./media/custom-event-to-function/click-to-view-functions-app.png":::
1. Sign-in to Azure if needed, and you should see the **Function App** page for your Azure function. 
1. Select your **function** in the bottom page as shown in the following image. 

    :::image type="content" source="./media/custom-event-to-function/select-function.png" alt-text="Screenshot that shows the selection of an Azure function on the Function App page."  lightbox="./media/custom-event-to-function/select-function.png":::
1. Switch to the **Logs** tab and keep this tab or window open so that you can see logged messages when you send an event to an Event Grid later in this tutorial. 

    :::image type="content" source="./media/custom-event-to-function/function-logs-window.png" alt-text="Screenshot that shows Logs tab of an Azure function in the Azure portal."  lightbox="./media/custom-event-to-function/function-logs-window.png":::

## Create a custom topic

An Event Grid topic provides a user-defined endpoint that you post your events to. 

1. On a new tab of the web browser window, sign in to [Azure portal](https://portal.azure.com/).
2. In the search bar at the topic, search for **Event Grid Topics**, and select **Event Grid Topics**. 

    :::image type="content" source="./media/custom-event-to-function/select-topics.png" alt-text="Image showing the selection of Event Grid topics." lightbox="./media/custom-event-to-function/select-topics.png" :::
3. On the **Event Grid Topics** page, select **+ Create** on the command bar.

    :::image type="content" source="./media/custom-event-to-function/add-topic-button.png" alt-text="Screenshot showing the Create button to create an Event Grid topic." lightbox="./media/custom-event-to-function/add-topic-button.png":::
4. On the **Create Topic** page, follow these steps:
    1. Select your **Azure subscription**.
    2. Select the same **resource group** from the previous steps.
    3. Provide a unique **name** for the custom topic. The topic name must be unique because it's represented by a DNS entry. Don't use the name shown in the image. Instead, create your own name - it must be between 3-50 characters and contain only values a-z, A-Z, 0-9, and `-`.
    4. Select a **location** for the Event Grid topic.
    5. Select **Review + create**. 
    
        :::image type="content" source="./media/custom-event-to-function/create-custom-topic.png" alt-text="Screenshot showing the Create Topic page.":::      
    1. On the **Review + create** page, review settings and select **Create**. 
5. After the custom topic has been created, select **Go to resource** link to see the following Event Grid topic page for the topic you created. 

    :::image type="content" source="./media/custom-event-to-function/topic-home-page.png" lightbox="./media/custom-event-to-function/topic-home-page.png" alt-text="Image showing the home page for your Event Grid custom topic.":::

## Subscribe to custom topic

You subscribe to an Event Grid topic to tell Event Grid which events you want to track, and where to send the events.

1. Now, on the **Event Grid Topic** page for your custom topic, select **+ Event Subscription** on the toolbar.

    :::image type="content" source="./media/custom-event-to-function/new-event-subscription.png" alt-text="Image showing the selection of Add Event Subscription on the toolbar." lightbox="./media/custom-event-to-function/new-event-subscription.png":::
2. On the **Create Event Subscription** page, follow these steps:
    1. Enter a **name** for the event subscription.
    1. For **Event Schema**, select **Cloud Event Schema v1.0**.
    1. Select **Azure Function** for the **Endpoint type**. 
    1. Choose **Configure an endpoint**. 

        :::image type="content" source="./media/custom-event-to-function/provide-subscription-values.png" alt-text="Image showing event subscription values.":::
    5. On the **Select Azure Function** page, follow these steps:
        1. Select the **Azure Subscription** that has the Azure function.
        1. Select the **resource group** that has the function. 
        1. Select your Azure **Functions app**.
        1. Select the Azure **function** in the Functions app. 
        1. Select **Confirm Selection**.

            :::image type="content" source="./media/custom-event-to-function/provide-endpoint.png" alt-text="Image showing the Select Azure Function page showing the selection of function you created earlier.":::
    6. This step is optional, but recommended for production scenarios. On the **Create Event Subscription** page, switch to the **Advanced Features** tab, and set values for **Max events per batch** and **Preferred batch size in kilobytes**. 
    
        Batching can give you high-throughput. For **Max events per batch**, set the maximum number of events that a subscription will include in a batch. Preferred batch size sets the preferred upper bound of batch size in kilo bytes, but can be exceeded if a single event is larger than this threshold.
    
        :::image type="content" source="./media/custom-event-to-function/enable-batching.png" alt-text="Image showing batching settings for an event subscription.":::
    6. On the **Create Event Subscription** page, select **Create**.

## Send an event to your topic

Now, let's trigger an event to see how Event Grid distributes the message to your endpoint. Use either Azure CLI or PowerShell to send a test event to your custom topic. Typically, an application or Azure service would send the event data.

The first example uses Azure CLI. It gets the URL and key for the custom topic, and sample event data. Use your custom topic name for `<topic name>`. It creates sample event data. The `data` element of the JSON is the payload of your event. Any well-formed JSON can go in this field. You can also use the subject field for advanced routing and filtering. CURL is a utility that sends HTTP requests.


### Azure CLI
1. In the Azure portal, select **Cloud Shell**. If you are in the PowerShell mode, select **Switch to Bash**. 

    :::image type="content" source="./media/custom-event-quickstart-portal/cloud-shell-bash.png" alt-text="Image showing Cloud Shell - Bash window":::
1. Set the `topicname` and `resourcegroupname` variables that are used in the commands. 

    Replace `TOPICNAME` with the name of your Event Grid topic. 

    ```azurecli
    topicname="TOPICNAME"
    ```

    Replace `RESOURCEGROUPNAME` with the name of the Azure resource group that contains the Event Grid topic. 

    ```azurecli
    resourcegroupname="RESOURCEGROUPNAME"
    ```
1. Run the following command to get the **endpoint** for the topic: After you copy and paste the command, update the **topic name** and **resource group name** before you run the command. 

    ```azurecli
    endpoint=$(az eventgrid topic show --name $topicname -g $resourcegroupname --query "endpoint" --output tsv)
    ```
2. Run the following command to get the **key** for the custom topic: After you copy and paste the command, update the **topic name** and **resource group** name before you run the command. 

    ```azurecli
    key=$(az eventgrid topic key list --name $topicname -g $resourcegroupname --query "key1" --output tsv)
    ```
3. Copy the following statement with the event definition, and press **ENTER**. 

    ```json
    event='[ {"id": "'"$RANDOM"'", "eventType": "recordInserted", "subject": "myapp/vehicles/motorcycles", "eventTime": "'`date +%Y-%m-%dT%H:%M:%S%z`'", "data":{ "make": "Ducati", "model": "Monster"},"dataVersion": "1.0"} ]'
    ```
4. Run the following **Curl** command to post the event:

    ```
    curl -X POST -H "aeg-sas-key: $key" -d "$event" $endpoint
    ```
5. Confirm that you see the message from the Azure function in the **Logs** tab of your Azure function in the Azure portal.

    :::image type="content" source="./media/custom-event-quickstart-portal/function-log-output.png" alt-text="Screenshot that shows the Logs tab of an Azure function." lightbox="./media/custom-event-quickstart-portal/function-log-output.png":::

### Azure PowerShell
The second example uses PowerShell to perform similar steps.

1. In the Azure portal, select **Cloud Shell** (alternatively go to `https://shell.azure.com/`). Select **Switch to PowerShell** in the top-left corner of the Cloud Shell window. See the sample **Cloud Shell** window image in the Azure CLI section.
2. Set the following variables. After you copy and paste each command, update the **topic name** and **resource group name** before you run the command:

    ```powershell
    $resourceGroupName = "RESOURCEGROUPNAME"
    ```

    ```powershell
    $topicName = "TOPICNAME"
    ```
3. Run the following commands to get the **endpoint** and the **keys** for the topic:

    ```powershell
    $endpoint = (Get-AzEventGridTopic -ResourceGroupName $resourceGroupName -Name $topicName).Endpoint
    $keys = Get-AzEventGridTopicKey -ResourceGroupName $resourceGroupName -Name $topicName
    ```
4. Prepare the event. Copy and run the statements in the Cloud Shell window. 

    ```powershell
    $eventID = Get-Random 99999

    #Date format should be SortableDateTimePattern (ISO 8601)
    $eventDate = Get-Date -Format s

    #Construct body using Hashtable
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
    
    #Use ConvertTo-Json to convert event body from Hashtable to JSON Object
    #Append square brackets to the converted JSON payload since they are expected in the event's JSON payload syntax
    $body = "["+(ConvertTo-Json $htbody)+"]"
    ```
5. Use the **Invoke-WebRequest** cmdlet to send the event. 

    ```powershell
    Invoke-WebRequest -Uri $endpoint -Method POST -Body $body -Headers @{"aeg-sas-key" = $keys.Key1}
    ```
5. Confirm that you see the message from the Azure function in the **Logs** tab of your Azure function in the Azure portal.

    :::image type="content" source="./media/custom-event-quickstart-portal/function-log-output.png" alt-text="Screenshot that shows the Logs tab of an Azure function." lightbox="./media/custom-event-quickstart-portal/function-log-output.png":::

### Verify that function received the event
You've triggered the event, and Event Grid sent the message to the endpoint you configured when subscribing.

1. On the **Monitor** page for your Azure function, you see an invocation. 

    :::image type="content" source="./media/custom-event-to-function/monitor-page-invocations.png" alt-text="Screenshot showing the Invocations tab of the Monitor page.":::
2. Select the invocation to see the details. 

    :::image type="content" source="./media/custom-event-to-function/invocation-details-page.png" alt-text="Screenshot showing the Invocation details.":::
3. You can also use the **Logs** tab in the right pane to see the logged messages when you post events to the topic's endpoint. 

    :::image type="content" source="./media/custom-event-to-function/successful-function.png" lightbox="./media/custom-event-to-function/successful-function.png" alt-text="Image showing the Monitor view of the Azure function with a log.":::

## Clean up resources
If you plan to continue working with this event, don't clean up the resources created in this article. Otherwise, delete the resources you created in this article.

1. Select **Resource Groups** on the left menu. If you don't see it on the left menu, select **All Services** on the left menu, and select **Resource Groups**. 
2. Select the resource group to launch the **Resource Group** page. 
3. Select **Delete resource group** on the toolbar. 
4. Confirm deletion by entering the name of the resource group, and select **Delete**. 

    ![Resource groups](./media/custom-event-to-function/delete-resource-groups.png)

    The other resource group you see in the image was created and used by the Cloud Shell window. Delete it if you don't plan to use the Cloud Shell window later. 

## Next steps

Now that you know how to create topics and event subscriptions, learn more about what Event Grid can help you do:

- [About Event Grid](overview.md)
- [Route Blob storage events to a custom web endpoint](../storage/blobs/storage-blob-event-quickstart.md?toc=%2fazure%2fevent-grid%2ftoc.json)
- [Monitor virtual machine changes with Azure Event Grid and Logic Apps](monitor-virtual-machine-changes-logic-app.md)
- [Stream big data into a data warehouse](event-hubs-integration.md)

See the following samples to learn about publishing events to and consuming events from Event Grid using different programming languages. 

- [Azure Event Grid samples for .NET](/samples/azure/azure-sdk-for-net/azure-event-grid-sdk-samples/)
- [Azure Event Grid samples for Java](/samples/azure/azure-sdk-for-java/eventgrid-samples/)
- [Azure Event Grid samples for Python](/samples/azure/azure-sdk-for-python/eventgrid-samples/)
- [Azure Event Grid samples for JavaScript](/samples/azure/azure-sdk-for-js/eventgrid-javascript/)
- [Azure Event Grid samples for TypeScript](/samples/azure/azure-sdk-for-js/eventgrid-typescript/)
