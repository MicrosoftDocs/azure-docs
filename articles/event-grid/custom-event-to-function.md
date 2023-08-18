---
title: 'Quickstart: Send custom events to Azure Function - Event Grid'
description: 'Quickstart: Use Azure Event Grid and Azure CLI or portal to publish a topic, and subscribe to that event. An Azure Function is used for the endpoint.'
ms.date: 11/02/2022
ms.topic: quickstart
ms.custom: mode-other, devx-track-azurecli 
ms.devlang: azurecli
---

# Quickstart: Route custom events to an Azure Function with Event Grid

[Azure Event Grid](overview.md) is an eventing service for the cloud. Azure Functions is one of the [supported event handlers](event-handlers.md). In this article, you use the Azure portal to create a custom topic, subscribe to the custom topic, and trigger the event to view the result. You send the events to an Azure Function.

[!INCLUDE [quickstarts-free-trial-note.md](../../includes/quickstarts-free-trial-note.md)]

## Create Azure function app

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the left navigational menu, select **All services**.
1. Select **Compute** in the list of **Categories**.
1. Hover (not select) the mouse over **Function App**, and select **Create**.

    :::image type="content" source="./media/custom-event-to-function/create-function-app-link.png" lightbox="./media/custom-event-to-function/create-function-app-link.png" alt-text="Screenshot showing the select of Create link for a Function App.":::    
1. On the **Basics** page of the **Create Function App** wizard, follow these steps: 
    1. Select your **Azure subscription** in which you want to create the function app.
    1. Create a new **resource group** or select an existing resource group.
    1. Specify a **name** for the function app.
    1. Select **.NET** for **Runtime stack**.
    1. Select the **region** closest to you. 
    1. Select **Next: Hosting** at the bottom of the page. 
    
        :::image type="content" source="./media/custom-event-to-function/create-function-app-page.png" alt-text="Screenshot showing the Basics tab of the Create Function App page.":::    
1. On the **Hosting** page, create a new storage account or select an existing storage account to be associated with the function app, and then select **Review + create** at the bottom of the page. 
        
    :::image type="content" source="./media/custom-event-to-function/create-function-app-hosting-page.png" alt-text="Screenshot showing the Hosting tab of the Create Function App page.":::  
1. On the **Review + create** page, review settings, and select **Create** at the bottom of the page to create the function app.   
1. Once the deployment is successful, select **Go to resource** to navigate to the home page for the function app. 

## Create a function
Before subscribing to the custom topic, create a function to handle the events. 

1. On the **Function App** page, select **Functions** on the left menu. 
1. Select **+ Create** on the toolbar to create a function.

    :::image type="content" source="./media/custom-event-to-function/create-function-link.png" alt-text="Screenshot showing the selection of Create function link.":::  
    
1. On the **Create Function** page, follow these steps:
    1. This step is optional. For **Development environment**, select the development environment that you want to use to work with the function code. 
    1. In the **Select a template** section, in the filter or search box, type **Azure Event Grid trigger**.
    1. Select **Azure Event Grid Trigger** template in the template list. 
    1. In the **Template details** section in the bottom pane, enter a name for the function. In this example, it's **HandleEventsFunc**. 
    1. Select **Create**.

        :::image type="content" source="./media/custom-event-to-function/function-trigger.png" lightbox="./media/custom-event-to-function/function-trigger.png" alt-text="Screenshot showing select Event Grid trigger.":::
4. On the **Function** page for the **HandleEventsFunc**, select **Code + Test** on the left navigational menu. 

    :::image type="content" source="./media/custom-event-to-function/function-code-test-menu.png" alt-text="Image showing the selection Code + Test menu for an Azure function.":::
5. Replace the code with the following code.

    ```csharp
    #r "Azure.Messaging.EventGrid"
    #r "System.Memory.Data"
    
    using Azure.Messaging.EventGrid;
    using System;
    
    public static void Run(EventGridEvent eventGridEvent, ILogger log)
    {
        log.LogInformation(eventGridEvent.Data.ToString());
    }        
    ```
    :::image type="content" source="./media/custom-event-to-function/function-updated-code.png" alt-text="Screenshot showing the Code + Test view of an Azure function with the updated code.":::    
6. Select **Monitor** on the left menu, and then select **Logs**. 

    :::image type="content" source="./media/custom-event-to-function/monitor-page.png" alt-text="Screenshot showing the Monitor view the Azure function.":::    
7. Keep this window or tab of the browser open so that you can see the received event information. 

## Create a custom topic

An Event Grid topic provides a user-defined endpoint that you post your events to. 

1. On a new tab of the web browser window, sign in to [Azure portal](https://portal.azure.com/).
2. In the search bar at the topic, search for **Event Grid Topics**, and select **Event Grid Topics**. 

    :::image type="content" source="./media/custom-event-to-function/select-topics.png" alt-text="Image showing the selection of Event Grid topics.":::
3. On the **Event Grid Topics** page, select **+ Create** on the command bar.

    :::image type="content" source="./media/custom-event-to-function/add-topic-button.png" alt-text="Screenshot showing the Create button to create an Event Grid topic.":::
4. On the **Create Topic** page, follow these steps:
    1. Select your **Azure subscription**.
    2. Select the same **resource group** from the previous steps.
    3. Provide a unique **name** for the custom topic. The topic name must be unique because it's represented by a DNS entry. Don't use the name shown in the image. Instead, create your own name - it must be between 3-50 characters and contain only values a-z, A-Z, 0-9, and "-".
    4. Select a **location** for the Event Grid topic.
    5. Select **Review + create**. 
    
        :::image type="content" source="./media/custom-event-to-function/create-custom-topic.png" alt-text="Image showing the Create Topic page.":::      
    1. On the **Review + create** page, review settings and select **Create**. 
5. After the custom topic has been created, select **Go to resource** link to see the following Event Grid topic page for the topic you created. 

    :::image type="content" source="./media/custom-event-to-function/topic-home-page.png" lightbox="./media/custom-event-to-function/topic-home-page.png" alt-text="Image showing the home page for your Event Grid custom topic.":::

## Subscribe to custom topic

You subscribe to an Event Grid topic to tell Event Grid which events you want to track, and where to send the events.

1. Now, on the **Event Grid Topic** page for your custom topic, select **+ Event Subscription** on the toolbar.

    :::image type="content" source="./media/custom-event-to-function/new-event-subscription.png" alt-text="Image showing the selection of Add Event Subscription on the toolbar.":::
2. On the **Create Event Subscription** page, follow these steps:
    1. Enter a **name** for the event subscription.
    3. Select **Azure Function** for the **Endpoint type**. 
    4. Choose **Select an endpoint**. 

        :::image type="content" source="./media/custom-event-to-function/provide-subscription-values.png" alt-text="Image showing event subscription values.":::
    5. For the function endpoint, select the Azure Subscription and Resource Group your Function App is in and then select the Function App and function you created earlier. Select **Confirm Selection**.

        :::image type="content" source="./media/custom-event-to-function/provide-endpoint.png" alt-text="Image showing the Select Azure Function page showing the selection of function you created earlier.":::
    6. This step is optional, but recommended for production scenarios. On the **Create Event Subscription** page, switch to the **Advanced Features** tab, and set values for **Max events per batch** and **Preferred batch size in kilobytes**. 
    
        Batching can give you high-throughput. For **Max events per batch**, set maximum number of events that a subscription will include in a batch. Preferred batch size sets the preferred upper bound of batch size in kilo bytes, but can be exceeded if a single event is larger than this threshold.
    
        :::image type="content" source="./media/custom-event-to-function/enable-batching.png" alt-text="Image showing batching settings for an event subscription.":::
    6. On the **Create Event Subscription** page, select **Create**.

## Send an event to your topic

Now, let's trigger an event to see how Event Grid distributes the message to your endpoint. Use either Azure CLI or PowerShell to send a test event to your custom topic. Typically, an application or Azure service would send the event data.

The first example uses Azure CLI. It gets the URL and key for the custom topic, and sample event data. Use your custom topic name for `<topic name>`. It creates sample event data. The `data` element of the JSON is the payload of your event. Any well-formed JSON can go in this field. You can also use the subject field for advanced routing and filtering. CURL is a utility that sends HTTP requests.


### Azure CLI
1. In the Azure portal, select **Cloud Shell**. Select **Bash** in the top-left corner of the Cloud Shell window. 

    :::image type="content" source="./media/custom-event-quickstart-portal/cloud-shell-bash.png" alt-text="Image showing Cloud Shell - Bash window":::
1. Set the `topicname` and `resourcegroupname` variables that will be used in the commands. 

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

### Azure PowerShell
The second example uses PowerShell to perform similar steps.

1. In the Azure portal, select **Cloud Shell** (alternatively go to `https://shell.azure.com/`). Select **PowerShell** in the top-left corner of the Cloud Shell window. See the sample **Cloud Shell** window image in the Azure CLI section.
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

### Verify that function received the event
You've triggered the event, and Event Grid sent the message to the endpoint you configured when subscribing. Navigate to your Event Grid triggered function and open the logs. You should see a copy of the data payload of the event in the logs. If you don't make sure you open the logs window first, or hit reconnect, and then try sending a test event again.

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
