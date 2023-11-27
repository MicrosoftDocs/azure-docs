---
title: 'Use Azure Event Grid to send Blob storage events to web endpoint - portal'
description: 'Quickstart: Use Azure Event Grid and Azure portal to create Blob storage account, and subscribe its events. Send the events to a Webhook.'
ms.date: 11/27/2023
ms.topic: quickstart
ms.custom: mode-ui
---

# Use Azure Event Grid to route Blob storage events to web endpoint (Azure portal)
Event Grid is a fully managed service that enables you to easily manage events across many different Azure services and applications. It simplifies building event-driven and serverless applications. For an overview of the service, see [Event Grid overview](overview.md).

In this article, you use the Azure portal to do the following tasks:

1. Create a Blob storage account.
1. Subscribe to events for that blob storage.
1. Trigger an event by uploading a file to the blob storage.
1. View the result in a handler web app. Typically, you send events to an endpoint that processes the event data and takes actions. To keep it simple, you send events to a web app that collects and displays the messages.

[!INCLUDE [quickstarts-free-trial-note.md](../../includes/quickstarts-free-trial-note.md)]

When you're finished, you see that the event data has been sent to the web app.

:::image type="content" source="./media/blob-event-quickstart-portal/view-results.png" alt-text="Screenshot that shows the sample Azure Event Grid Viewer app with an event.":::

## Create a storage account

1. Sign in to [Azure portal](https://portal.azure.com/).
1. To create a Blob storage, select **Create a resource**. 
1. In the **Search**, enter **Storage account**, and select **Storage account** from the result list. 

    :::image type="content" source="./media/blob-event-quickstart-portal/search-storage-account.png" alt-text="Screenshot showing the search for Storage account on the Create a resource page.":::
1. On the **Storage account** page, select **Create** to start creating the storage account. To subscribe to events, create either a general-purpose v2 storage account or a Blob storage account.   
1. On the **Create storage account** page, do the following steps:
    1. Select your Azure subscription. 
    2. For **Resource group**, create a new resource group or select an existing one. 
    3. Enter the name for your storage account. 
    1. Select the **Region** in which you want the storage account to be created. 
    1. For **Redundancy**, select **Locally-redundant storage (LRS)** from the drop-down list. 
    1. Select **Review** at the bottom of the page. 

        :::image type="content" source="./media/blob-event-quickstart-portal/create-storage-account-page.png" alt-text="Screenshot showing the Create a storage account page.":::
    5. On the **Review** page, review the settings, and select **Create**. 

        >[!NOTE]
        > Only storage accounts of kind **StorageV2 (general purpose v2)** and **BlobStorage** support event integration. **Storage (general purpose v1)** does *not* support integration with Event Grid.
1. The deployment takes a few minutes to complete. On the **Deployment** page, select **Go to resource**. 

    :::image type="content" source="./media/blob-event-quickstart-portal/go-to-resource-link.png" alt-text="Screenshot showing the deployment succeeded page with a link to go to the resource.":::
1. On the **Storage account** page, select **Events** on the left menu. 

    :::image type="content" source="./media/blob-event-quickstart-portal/events-page.png" alt-text="Screenshot showing the Events page for an Azure storage account.":::
1. Keep this page in the web browser open. 

## Create a message endpoint
Before subscribing to the events for the Blob storage, let's create the endpoint for the event message. Typically, the endpoint takes actions based on the event data. To simplify this quickstart, you deploy a [prebuilt web app](https://github.com/Azure-Samples/azure-event-grid-viewer) that displays the event messages. The deployed solution includes an App Service plan, an App Service web app, and source code from GitHub.

1. Select **Deploy to Azure** to deploy the solution to your subscription. 

   <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fazure-event-grid-viewer%2Fmaster%2Fazuredeploy.json" target="_blank"><img src="../media/template-deployments/deploy-to-azure.svg" alt="Button to deploy to Azure."></a>
2. On the **Custom deployment** page, do the following steps: 
    1. For **Resource group**, select the resource group that you created when creating the storage account. It will be easier for you to clean up after you're done with the tutorial by deleting the resource group.  
    2. For **Site Name**, enter a name for the web app.
    3. For **Hosting plan name**, enter a name for the App Service plan to use for hosting the web app.
    5. Select **Review + create**. 

        :::image type="content" source="./media/blob-event-quickstart-portal/template-deploy-parameters.png" alt-text="Screenshot showing the Custom deployment page.":::
1. On the **Review + create** page, select **Create**. 
1. The deployment takes a few minutes to complete. On the **Deployment** page, select **Go to resource group**. 

    :::image type="content" source="./media/blob-event-quickstart-portal/navigate-resource-group.png" alt-text="Screenshot showing the deployment succeeded page with a link to go to the resource group.":::
4. On the **Resource group** page, in the list of resources, select the web app that you created. You also see the App Service plan and the storage account in this list. 

    :::image type="content" source="./media/blob-event-quickstart-portal/resource-group-resources.png" alt-text="Screenshot that shows the selection of web app in the resource group.":::
5. On the **App Service** page for your web app, select the URL to navigate to the web site. The URL should be in this format: `https://<your-site-name>.azurewebsites.net`.

    :::image type="content" source="./media/blob-event-quickstart-portal/web-site.png" alt-text="Screenshot that shows the selection of link to navigate to web app.":::    
6. Confirm that you see the site but no events have been posted to it yet. 

   ![View new site.](./media/blob-event-quickstart-portal/view-site.png)

    > [!IMPORTANT]
    > Keep the Azure Event Grid Viewer window open so that you can see events as they are posted. 

[!INCLUDE [register-provider.md](./includes/register-provider.md)]

## Subscribe to the Blob storage

You subscribe to a topic to tell Event Grid which events you want to track, and where to send the events.

1. If you closed the **Storage account** page, navigate to your Azure Storage account that you created earlier. On the left menu, select **All resources** and select your storage account. 
1. On the **Storage account** page, select **Events** on the left menu. 
1. Select **More Options**, and **Web Hook**. You're sending events to your viewer app using a web hook for the endpoint. 

    :::image type="content" source="./media/blob-event-quickstart-portal/select-web-hook.png" alt-text="Screenshot showing the selection of Web Hook on the Events page.":::
3. On the **Create Event Subscription** page, do the following steps: 
    1. Enter a **name** for the event subscription.
    2. Enter a **name** for the **system topic**. To learn about system topics, see [Overview of system topics](system-topics.md).

        :::image type="content" source="./media/blob-event-quickstart-portal/event-subscription-name-system-topic.png" alt-text="Screenshot showing the Create Event Subscription page with a name for the system topic.":::
    2. Select **Web Hook** for **Endpoint type**. 

        :::image type="content" source="./media/blob-event-quickstart-portal/select-web-hook-end-point-type.png" alt-text="Screenshot showing the Create Event Subscription page with Web Hook selected as an endpoint.":::
4. For **Endpoint**, choose **Select an endpoint**, and enter the URL of your web app and add `api/updates` to the home page URL (for example: `https://spegridsite.azurewebsites.net/api/updates`), and then select **Confirm Selection**.

    :::image type="content" source="./media/blob-event-quickstart-portal/confirm-endpoint-selection.png" lightbox="./media/blob-event-quickstart-portal/confirm-endpoint-selection.png" alt-text="Screenshot showing the Select Web Hook page.":::
5. Now, on the **Create Event Subscription** page, select **Create** to create the event subscription. 

      :::image type="content" source="./media/blob-event-quickstart-portal/create-subscription.png" alt-text="Screenshot showing the Create Event Subscription page with all fields selected.":::
1. View your web app again, and notice that a subscription validation event has been sent to it. Select the eye icon to expand the event data. Event Grid sends the validation event so the endpoint can verify that it wants to receive event data. The web app includes code to validate the subscription.

      :::image type="content" source="./media/blob-event-quickstart-portal/view-subscription-event.png" alt-text="Screenshot showing the Event Grid Viewer with the subscription validation event.":::

Now, let's trigger an event to see how Event Grid distributes the message to your endpoint.

## Send an event to your endpoint

You trigger an event for the Blob storage by uploading a file. The file doesn't need any specific content. 

1. In the Azure portal, navigate to your Blob storage account, and select **Containers** on the let menu.
1. Select **+ Container**. Give your container a name, and use any access level, and select **Create**. 

      :::image type="content" source="./media/blob-event-quickstart-portal/add-container.png" alt-text="Screenshot showing the New container page.":::
1. Select your new container.

      :::image type="content" source="./media/blob-event-quickstart-portal/select-container.png" alt-text="Screenshot showing the selection of the container.":::
1. To upload a file, select **Upload**. On the **Upload blob** page, browse and select a file that you want to upload for testing, and then select **Upload** on that page. 

      :::image type="content" source="./media/blob-event-quickstart-portal/upload-file.png" alt-text="Screenshot showing Upload blob page." lightbox="./media/blob-event-quickstart-portal/upload-file.png":::
1. Browse to your test file and upload it.
1. You've triggered the event, and Event Grid sent the message to the endpoint you configured when subscribing. The message is in the JSON format and it contains an array with one or more events. In the following example, the JSON message contains an array with one event. View your web app and notice that a **blob created** event was received. 

      :::image type="content" source="./media/blob-event-quickstart-portal/blob-created-event.png" alt-text="Screenshot showing the Event Grid Viewer page with the Blob Created event.":::

## Clean up resources

If you plan to continue working with this event, don't clean up the resources created in this article. Otherwise, delete the resources you created in this article.

Select the resource group, and select **Delete resource group**.

## Next steps

Now that you know how to create custom topics and event subscriptions, learn more about what Event Grid can help you do:

- [About Event Grid](overview.md)
- [Route Blob storage events to a custom web endpoint](../storage/blobs/storage-blob-event-quickstart.md?toc=%2fazure%2fevent-grid%2ftoc.json)
- [Monitor virtual machine changes with Azure Event Grid and Logic Apps](monitor-virtual-machine-changes-logic-app.md)
- [Stream big data into a data warehouse](event-hubs-integration.md)
