---
title: 'Send custom events to web endpoint - Event Grid, Azure portal'
description: 'Quickstart: Use Azure Event Grid and Azure portal to publish a custom topic, and subscribe to events for that topic. The events are handled by a web application.'
ms.date: 09/25/2023
ms.topic: quickstart
ms.custom: mode-ui
---

# Route custom events to web endpoint with the Azure portal and Azure Event Grid
Event Grid is a fully managed service that enables you to easily manage events across many different Azure services and applications. It simplifies building event-driven and serverless applications. For an overview of the service, see [Event Grid overview](overview.md).

In this article, you use the Azure portal to do the following tasks: 

1. Create a custom topic.
1. Subscribe to the custom topic.
1. Trigger the event.
1. View the result. Typically, you send events to an endpoint that processes the event data and takes actions. However, to simplify this article, you send the events to a web app that collects and displays the messages.


## Prerequisites
[!INCLUDE [quickstarts-free-trial-note.md](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [register-provider.md](./includes/register-provider.md)]

## Create a custom topic
An Event Grid topic provides a user-defined endpoint that you post your events to. 

1. Sign in to [Azure portal](https://portal.azure.com/).
2. In the search bar at the topic, type **Event Grid Topics**, and then select **Event Grid Topics** from the drop-down list. 

    :::image type="content" source="./media/custom-event-quickstart-portal/select-topics.png" alt-text="Screenshot showing the Azure port search bar to search for Event Grid topics.":::
3. On the **Event Grid Topics** page, select **+ Create** on the toolbar. 

    :::image type="content" source="./media/custom-event-quickstart-portal/create-topic-button.png" alt-text="Screenshot showing the Create Topic button on Event Grid topics page.":::
1. On the **Create Topic** page, follow these steps:
    1. Select your Azure **subscription**.
    2. Select an existing resource group or select **Create new**, and enter a **name** for the **resource group**.
    3. Provide a unique **name** for the custom topic. The topic name must be unique because it's represented by a DNS entry. Don't use the name shown in the image. Instead, create your own name - it must be between 3-50 characters and contain only values a-z, A-Z, 0-9, and "-".
    4. Select a **location** for the Event Grid topic.
    5. Select **Review + create** at the bottom of the page. 

        :::image type="content" source="./media/custom-event-quickstart-portal/create-custom-topic.png" alt-text="Create Topic page":::
    6. On the **Review + create** tab of the **Create topic** page, select **Create**. 
    
        :::image type="content" source="./media/custom-event-quickstart-portal/review-create-page.png" alt-text="Review settings and create":::
5. After the deployment succeeds, select **Go to resource** to navigate to the **Event Grid Topic** page for your topic. Keep this page open. You use it later in the quickstart. 

    :::image type="content" source="./media/custom-event-quickstart-portal/topic-home-page.png" alt-text="Screenshot showing the Event Grid topic home page.":::

    > [!NOTE]
    > To keep the quickstart simple, you'll be using only the **Basics** page to create a topic. For detailed steps about configuring network, security, and data residency settings on other pages of the wizard, see [Create a custom topic](create-custom-topic.md).

## Create a message endpoint
Before you create a subscription for the custom topic, create an endpoint for the event message. Typically, the endpoint takes actions based on the event data. To simplify this quickstart, you deploy a [prebuilt web app](https://github.com/Azure-Samples/azure-event-grid-viewer) that displays the event messages. The deployed solution includes an App Service plan, an App Service web app, and source code from GitHub.

1. In the article page, select **Deploy to Azure** to deploy the solution to your subscription. In the Azure portal, provide values for the parameters.

   :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fazure-event-grid-viewer%2Fmaster%2Fazuredeploy.json":::

2. On the **Custom deployment** page, do the following steps: 
    1. For **Resource group**, select the resource group that you created when creating the storage account. It will be easier for you to clean up after you're done with the tutorial by deleting the resource group.  
    2. For **Site Name**, enter a name for the web app.
    3. For **Hosting plan name**, enter a name for the App Service plan to use for hosting the web app.
    5. Select **Review + create**. 

        :::image type="content" source="./media/blob-event-quickstart-portal/template-deploy-parameters.png" alt-text="Screenshot showing the Custom deployment page.":::
1. On the **Review + create** page, select **Create**. 
1. The deployment may take a few minutes to complete. Select Alerts (bell icon) in the portal, and then select **Go to resource group**. 

    :::image type="content" source="./media/blob-event-quickstart-portal/navigate-resource-group.png" alt-text="Screenshot showing the successful deployment message with a link to navigate to the resource group.":::
4. On the **Resource group** page, in the list of resources, select the web app that you created. You also see the App Service plan and the storage account in this list. 

    :::image type="content" source="./media/blob-event-quickstart-portal/resource-group-resources.png" alt-text="Screenshot that shows the Resource Group page with the deployed resources.":::
5. On the **App Service** page for your web app, select the URL to navigate to the web site. The URL should be in this format: `https://<your-site-name>.azurewebsites.net`.
    
    :::image type="content" source="./media/blob-event-quickstart-portal/web-site.png" alt-text="Screenshot that shows the App Service page with the link to the site highlighted.":::
6. Confirm that you see the site but no events have been posted to it yet.

    :::image type="content" source="./media/blob-event-quickstart-portal/view-site.png" alt-text="Screenshot that shows the Event Grid Viewer sample app.":::    

## Subscribe to custom topic

You subscribe to an Event Grid topic to tell Event Grid which events you want to track, and where to send the events.

1. Now, on the **Event Grid Topic** page for your custom topic, select **+ Event Subscription** on the toolbar.

    :::image type="content" source="./media/custom-event-quickstart-portal/new-event-subscription.png" alt-text="Add event subscription button":::
2. On the **Create Event Subscription** page, follow these steps:
    1. Enter a **name** for the event subscription.
    3. Select **Web Hook** for the **Endpoint type**. 
    4. Choose **Select an endpoint**. 

        :::image type="content" source="./media/custom-event-quickstart-portal/provide-subscription-values.png" alt-text="Provide event subscription values":::
    5. For the web hook endpoint, provide the URL of your web app and add `api/updates` to the home page URL. Select **Confirm Selection**.

        :::image type="content" source="./media/custom-event-quickstart-portal/provide-endpoint.png" alt-text="Provide endpoint URL":::
    6. Back on the **Create Event Subscription** page, select **Create**.

3. View your web app again, and notice that a subscription validation event has been sent to it. Select the eye icon to expand the event data. Event Grid sends the validation event so the endpoint can verify that it wants to receive event data. The web app includes code to validate the subscription.

    :::image type="content" source="./media/custom-event-quickstart-portal/view-subscription-event.png" alt-text="Screenshot of the Event Grid Viewer app with the Subscription Validated event.":::

## Send an event to your topic

Now, let's trigger an event to see how Event Grid distributes the message to your endpoint. Use either Azure CLI or PowerShell to send a test event to your custom topic. Typically, an application or Azure service would send the event data.

The first example uses Azure CLI. It gets the URL and key for the custom topic, and sample event data. Use your custom topic name for `<topic name>`. It creates sample event data. The `data` element of the JSON is the payload of your event. Any well-formed JSON can go in this field. You can also use the subject field for advanced routing and filtering. CURL is a utility that sends HTTP requests.


### Azure CLI
1. In the Azure portal, select **Cloud Shell**. The Cloud Shell opens in the bottom pane of the web browser. 

    :::image type="content" source="./media/custom-event-quickstart-portal/select-cloud-shell.png" alt-text="Select Cloud Shell icon":::
1. Select **Bash** in the top-left corner of the Cloud Shell window. 

    :::image type="content" source="./media/custom-event-quickstart-portal/cloud-shell-bash.png" alt-text="Screenshot that shows the Cloud Shell with Bash selected in the top-left corner.":::
1. Run the following command to get the **endpoint** for the topic: After you copy and paste the command, update the **topic name** and **resource group name** before you run the command. You publish sample events to this topic endpoint. 

    ```azurecli
    endpoint=$(az eventgrid topic show --name <topic name> -g <resource group name> --query "endpoint" --output tsv)
    ```
2. Run the following command to get the **key** for the custom topic: After you copy and paste the command, update the **topic name** and **resource group** name before you run the command. It's the primary key of the Event Grid topic. To get this key from the Azure portal, switch to the **Access keys** tab of the **Event Grid Topic** page. To be able post an event to a custom topic, you need the access key. 

    ```azurecli
    key=$(az eventgrid topic key list --name <topic name> -g <resource group name> --query "key1" --output tsv)
    ```
3. Copy the following statement with the event definition, and press **ENTER**. 

    ```json
    event='[ {"id": "'"$RANDOM"'", "eventType": "recordInserted", "subject": "myapp/vehicles/motorcycles", "eventTime": "'`date +%Y-%m-%dT%H:%M:%S%z`'", "data":{ "make": "Ducati", "model": "Monster"},"dataVersion": "1.0"} ]'
    ```
4. Run the following **Curl** command to post the event: In the command, `aeg-sas-key` header is set to the access key you got earlier. 

    ```
    curl -X POST -H "aeg-sas-key: $key" -d "$event" $endpoint
    ```

### Azure PowerShell
The second example uses PowerShell to do similar steps.

1. In the Azure portal, select **Cloud Shell** (alternatively go to `https://shell.azure.com/`). The Cloud Shell opens in the bottom pane of the web browser. 

    :::image type="content" source="./media/custom-event-quickstart-portal/select-cloud-shell.png" alt-text="Select Cloud Shell icon":::
1. In the **Cloud Shell**, select **PowerShell** in the top-left corner of the Cloud Shell window. See the sample **Cloud Shell** window image in the Azure CLI section.
2. Set the following variables. After you copy and paste each command, update the **topic name** and **resource group name** before you run the command:

    **Resource group**:
    ```powershell
    $resourceGroupName = "<resource group name>"
    ```

    **Event Grid topic name**:    
    ```powershell
    $topicName = "<topic name>"
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

### Verify in the Event Grid Viewer
You've triggered the event, and Event Grid sent the message to the endpoint you configured when subscribing. View your web app to see the event you just sent.

:::image type="content" source="./media/custom-event-quickstart-portal/viewer-end.png" alt-text="Event Grid Viewer":::

## Clean up resources
If you plan to continue working with this event, don't clean up the resources created in this article. Otherwise, delete the resources you created in this article.

1. Select **Resource Groups** on the left menu. If you don't see it on the left menu, select **All Services** on the left menu, and select **Resource Groups**. 

    :::image type="content" source="./media/custom-event-quickstart-portal/delete-resource-groups.png" alt-text="Screenshot that shows the Resource Groups page." :::
1. Select the resource group to launch the **Resource Group** page. 
1. Select **Delete resource group** on the toolbar. 
1. Confirm deletion by entering the name of the resource group, and select **Delete**. 

    The other resource group you see in the image was created and used by the Cloud Shell window. Delete it if you don't plan to use the Cloud Shell window later. 

## Next steps

Now that you know how to create custom topics and event subscriptions, learn more about what Event Grid can help you do:

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
