---
title: Send Custom Events to Web Endpoint With Azure Event Grid
description: In this tutorial, you use Azure Event Grid and Azure portal to publish a custom topic, and subscribe to events for that topic.
#customer intent: As a developer, I want to learn how to create a custom topic in Azure Event Grid so that I can send custom events to a Webhook endpoint.
ms.date: 02/17/2026
ms.topic: quickstart
ms.custom: mode-ui
# Customer intent: I want to learn how to send custom events to Azure Event Grid and have them routed to a Webhook endpoint.
---

# Quickstart: Send custom events to web endpoint by using the Azure portal and Azure Event Grid
In this quickstart, you create a topic, create a subscription to that topic using a Webhook endpoint, trigger a sample event, and then view the result. Typically, you send events to an endpoint that processes the event data and takes actions. However, to simplify this tutorial, you send the events to a web app that collects and displays the messages.

## Prerequisites

- If you don't have an Azure subscription, create an [Azure free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.
- If you're new to Azure Event Grid, see [Event Grid overview](overview.md).

## Create a custom topic
An Event Grid topic provides a user-defined endpoint that you post your events to. 

1. Sign in to [Azure portal](https://portal.azure.com/).
1. In the search bar at the topic, type **Event Grid Topics**, and then select **Event Grid Topics** from the drop-down list. 

    :::image type="content" source="./media/custom-event-quickstart-portal/select-topics.png" alt-text="Screenshot of the Azure port search bar to search for Event Grid topics.":::
1. On the **Event Grid Topics** page, select **+ Create** on the toolbar. 

    :::image type="content" source="./media/custom-event-quickstart-portal/create-topic-button.png" alt-text="Screenshot of the Create Topic button on Event Grid topics page." lightbox="./media/custom-event-quickstart-portal/create-topic-button.png":::
1. On the **Create Topic** page, follow these steps:
    1. Select your Azure **subscription**.
    1. Select an existing resource group or select **Create new**, and enter a **name** for the **resource group**.
    1. Provide a unique **name** for the custom topic. The topic name must be unique because it's represented by a DNS entry. Don't use the name shown in the image. Instead, create your own name - it must be between 3-50 characters and contain only values a-z, A-Z, 0-9, and `-`.
    1. Select a **location** for the Event Grid topic.
    1. Select **Review + create** at the bottom of the page. 

        :::image type="content" source="./media/custom-event-quickstart-portal/create-custom-topic.png" alt-text="Screenshot of the Create Topic page." lightbox="./media/custom-event-quickstart-portal/create-custom-topic.png":::
    1. On the **Review + create** tab of the **Create topic** page, select **Create**. 
    
        :::image type="content" source="./media/custom-event-quickstart-portal/review-create-page.png" alt-text="Screenshot of the Review settings and create page." lightbox="./media/custom-event-quickstart-portal/review-create-page.png":::
1. After the deployment succeeds, select **Go to resource** to navigate to the **Event Grid Topic** page for your topic. Keep this page open. You use it later in the quickstart. 

    :::image type="content" source="./media/custom-event-quickstart-portal/topic-home-page.png" alt-text="Screenshot of the Event Grid topic home page." lightbox="./media/custom-event-quickstart-portal/topic-home-page.png":::

    > [!NOTE]
    > To keep the quickstart simple, you use only the **Basics** page to create a topic. For detailed steps about configuring network, security, and data residency settings on other pages of the wizard, see [Create a custom topic](create-custom-topic.md).

## Create a message endpoint
Before you create a subscription for the custom topic, create an endpoint for the event message. Typically, the endpoint takes actions based on the event data. To simplify this quickstart, you deploy a [prebuilt web app](https://github.com/Azure-Samples/azure-event-grid-viewer) that displays the event messages. The deployed solution includes an App Service plan, an App Service web app, and source code from GitHub.

1. In the article, select **Deploy to Azure** to deploy the solution to your subscription. In the Azure portal, provide values for the parameters.

   :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fazure-event-grid-viewer%2Fmaster%2Fazuredeploy.json":::

1. On the **Custom deployment** page, complete the following steps: 
    1. For **Resource group**, select an existing resource group or create a resource group.  
    1. For **Site Name**, enter a name for the web app.
    1. For **Hosting plan name**, enter a name for the App Service plan to use for hosting the web app.
    1. Select **Review + create**. 

        :::image type="content" source="./media/blob-event-quickstart-portal/template-deploy-parameters.png" alt-text="Screenshot of the Custom deployment page." lightbox="./media/blob-event-quickstart-portal/template-deploy-parameters.png":::
1. On the **Review + create** page, select **Create**. 
1. The deployment might take a few minutes to complete. Select **Alerts** (bell icon) in the portal, and then select **Go to resource group**. 

    :::image type="content" source="./media/blob-event-quickstart-portal/navigate-resource-group.png" alt-text="Screenshot of the successful deployment message with a link to navigate to the resource group." lightbox="./media/blob-event-quickstart-portal/navigate-resource-group.png":::
1. On the **Resource group** page, in the list of resources, select the web app (**contosoegriviewer** in the following example) that you created. 

    :::image type="content" source="./media/blob-event-quickstart-portal/resource-group-resources.png" alt-text="Screenshot of the Resource Group page with the deployed resources." lightbox="./media/blob-event-quickstart-portal/resource-group-resources.png":::
1. On the **App Service** page for your web app, select the URL to navigate to the web site. The URL should be in this format: `https://<your-site-name>.azurewebsites.net`.
    
    :::image type="content" source="./media/blob-event-quickstart-portal/event-grid-viewer-site.png" alt-text="Screenshot of the App Service page with the link to the site highlighted." lightbox="./media/blob-event-quickstart-portal/event-grid-viewer-site.png":::
1. Confirm that you see the site but no events are posted to it yet.

    :::image type="content" source="./media/blob-event-quickstart-portal/event-grid-viewer-site.png" alt-text="Screenshot of the Event Grid Viewer sample app." lightbox="./media/blob-event-quickstart-portal/event-grid-viewer-site.png":::

## Subscribe to custom topic

Subscribe to an Event Grid topic to tell Event Grid which events you want to track, and where to send the events.

1. On the **Event Grid Topic** page for your custom topic, select **+ Event Subscription** on the toolbar.

    :::image type="content" source="./media/custom-event-quickstart-portal/new-event-subscription.png" alt-text="Screenshot of the Add Event Subscription button on the toolbar." lightbox="./media/custom-event-quickstart-portal/new-event-subscription.png":::
1. On the **Create Event Subscription** page, follow these steps:
    1. Enter a **name** for the event subscription.
    1. Select **Web Hook** for the **Endpoint type**. 
    1. Choose **Select an endpoint**. 

        :::image type="content" source="./media/custom-event-quickstart-portal/provide-subscription-values.png" alt-text="Screenshot of providing event subscription values page." lightbox="./media/custom-event-quickstart-portal/provide-subscription-values.png":::
    1. For the web hook endpoint, provide the URL of your web app and add `api/updates` to the home page URL. Select **Confirm Selection**.

        :::image type="content" source="./media/custom-event-quickstart-portal/provide-endpoint.png" alt-text="Screenshot of providing endpoint URL page." lightbox="./media/custom-event-quickstart-portal/provide-endpoint.png":::
    1. Back on the **Create Event Subscription** page, select **Create**.

1. View your web app again, and notice that a subscription validation event is sent to it. Select the eye icon to expand the event data. Event Grid sends the validation event so the endpoint can verify that it wants to receive event data. The web app includes code to validate the subscription.

    :::image type="content" source="./media/custom-event-quickstart-portal/view-subscription-event.png" alt-text="Screenshot of the Event Grid Viewer app with the Subscription Validated event." lightbox="./media/custom-event-quickstart-portal/view-subscription-event.png":::

## Send an event to your topic

Now, trigger an event to see how Event Grid distributes the message to your endpoint. Use either Azure CLI or PowerShell to send a test event to your custom topic. Typically, an application or Azure service sends the event data.

The first example uses Azure CLI. It gets the URL and key for the custom topic, and sample event data. Use your custom topic name for `<topic name>`. It creates sample event data. The `data` element of the JSON is the payload of your event. Any well-formed JSON can go in this field. You can also use the subject field for advanced routing and filtering. CURL is a utility that sends HTTP requests.


### Azure CLI
1. In the Azure portal, select **Cloud Shell**. The Cloud Shell opens in the bottom pane of the web browser. 

    :::image type="content" source="./media/custom-event-quickstart-portal/select-cloud-shell.png" alt-text="Screenshot of the selection of Cloud Shell button." lightbox="./media/custom-event-quickstart-portal/select-cloud-shell.png":::
1. If the Cloud Shell opens a PowerShell session, select **Switch to Bash** in the top-left corner of the Cloud Shell window. If not, continue to the next step. 

    :::image type="content" source="./media/custom-event-quickstart-portal/cloud-shell-bash.png" alt-text="Screenshot of the Cloud Shell with Bash selected in the top-left corner." lightbox="./media/custom-event-quickstart-portal/cloud-shell-bash.png":::
1. Run the following command to get the **endpoint** for the topic. After you copy and paste the command, update the **topic name** and **resource group name** before you run the command. You publish sample events to this topic endpoint. 

    ```azurecli
    endpoint=$(az eventgrid topic show --name <topic name> -g <resource group name> --query "endpoint" --output tsv)
    ```
1. Run the following command to get the **key** for the custom topic. After you copy and paste the command, update the **topic name** and **resource group** name before you run the command. It's the primary key of the Event Grid topic. To get this key from the Azure portal, switch to the **Access keys** tab of the **Event Grid Topic** page. To post an event to a custom topic, you need the access key. 

    ```azurecli
    key=$(az eventgrid topic key list --name <topic name> -g <resource group name> --query "key1" --output tsv)
    ```
1. Copy the following statement with the event definition, and press **ENTER**. 

    ```json
    event='[ {"id": "'"$RANDOM"'", "eventType": "recordInserted", "subject": "myapp/vehicles/motorcycles", "eventTime": "'`date +%Y-%m-%dT%H:%M:%S%z`'", "data":{ "make": "Ducati", "model": "Monster"},"dataVersion": "1.0"} ]'
    ```
1. Run the following **Curl** command to post the event. In the command, set the `aeg-sas-key` header to the access key you got earlier. 

    ```
    curl -X POST -H "aeg-sas-key: $key" -d "$event" $endpoint
    ```

### Azure PowerShell
The second example uses PowerShell to perform similar steps.

1. In the Azure portal, select **Cloud Shell** (alternatively go to `https://shell.azure.com/`). The Cloud Shell opens in the bottom pane of the web browser. 

    :::image type="content" source="./media/custom-event-quickstart-portal/select-cloud-shell.png" alt-text="Screenshot of the Select Cloud Shell icon.":::
1. In the **Cloud Shell**, select **PowerShell** in the top-left corner of the Cloud Shell window. See the sample **Cloud Shell** window image in the Azure CLI section.
1. Set the following variables. After you copy and paste each command, update the **topic name** and **resource group name** before you run the command:

    **Resource group**:
    ```powershell
    $resourceGroupName = "<resource group name>"
    ```

    **Event Grid topic name**:    
    ```powershell
    $topicName = "<topic name>"
    ```
1. Run the following commands to get the **endpoint** and the **keys** for the topic:

    ```powershell
    $endpoint = (Get-AzEventGridTopic -ResourceGroupName $resourceGroupName -Name $topicName).Endpoint
    $keys = Get-AzEventGridTopicKey -ResourceGroupName $resourceGroupName -Name $topicName
    ```
1. Prepare the event. Copy and run the statements in the Cloud Shell window. 

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
1. Use the **Invoke-WebRequest** cmdlet to send the event. 

    ```powershell
    Invoke-WebRequest -Uri $endpoint -Method POST -Body $body -Headers @{"aeg-sas-key" = $keys.Key1}
    ```

### Verify in the Event Grid Viewer
You triggered the event, and Event Grid sent the message to the endpoint you configured when subscribing. View your web app to see the event you just sent.

:::image type="content" source="./media/custom-event-quickstart-portal/viewer-end.png" alt-text="Screenshot of the Event Grid Viewer." lightbox="./media/custom-event-quickstart-portal/viewer-end.png":::

## Clean up resources
If you plan to continue working with this event, don't clean up the resources created in this article. Otherwise, delete the resources you created in this article.

1. Select **Resource Groups** in the left menu. If you don't see it in the left menu, select **All Services** in the left menu, and select **Resource Groups**. 

    :::image type="content" source="./media/custom-event-quickstart-portal/delete-resource-groups.png" alt-text="Screenshot of the Resource Groups page." lightbox="./media/custom-event-quickstart-portal/delete-resource-groups.png":::
1. Select the resource group to open the **Resource Group** page. 
1. Select **Delete resource group** in the toolbar. 
1. Confirm deletion by entering the name of the resource group, and select **Delete**. 

    The other resource group you see in the image was created and used by the Cloud Shell window. Delete it if you don't plan to use the Cloud Shell window later. 

## Related content

Now that you know how to create custom topics and event subscriptions, learn more about what Event Grid can help you do:

- [Route Blob storage events to a custom web endpoint](../storage/blobs/storage-blob-event-quickstart.md?toc=%2fazure%2fevent-grid%2ftoc.json)
- [Azure Event Grid samples for .NET](/samples/azure/azure-sdk-for-net/azure-event-grid-sdk-samples/)
- [Azure Event Grid samples for Java](/samples/azure/azure-sdk-for-java/eventgrid-samples/)
