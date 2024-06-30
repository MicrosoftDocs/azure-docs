---
title: Deliver events to webhooks using push model (portal)
description: This article provides step-by-step instructions to use the Azure portal to create a WebHook subscription for a namespace topic. 
ms.topic: quickstart
ms.author: spelluru
author: spelluru
ms.date: 05/21/2024
---

# Deliver events to webhooks using namespace topics - Azure portal (preview)

The article provides step-by-step instructions to publish events to Azure Event Grid in the [CloudEvents JSON format](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/formats/json-format.md) and deliver those events by using the push delivery model. To be specific, you publish events to a namespace topic in Event Grid and push those events from an event subscription to a webhook handler destination. For more information about the push delivery model, see [Push delivery overview](push-delivery-overview.md).

> [!NOTE]
> Azure Event Grid namespaces currently supports Shared Access Signatures (SAS) token and access keys authentication.

[!INCLUDE [quickstarts-free-trial-note.md](../../includes/quickstarts-free-trial-note.md)]


## Create an Event Grid namespace
An Event Grid namespace provides a user-defined endpoint to which you post your events. The following example creates a namespace in your resource group using Bash in Azure Cloud Shell. The namespace name must be unique because it's part of a Domain Name System (DNS) entry.

1. Navigate to the Azure portal.
1. In the search bar at the topic, type `Event Grid Namespaces`, and select `Event Grid Namespaces` from the results. 

    :::image type="content" source="./media/publish-events-using-namespace-topics-portal/search-bar-namespace-topics.png" alt-text="Screenshot that shows the search bar in the Azure portal." lightbox="./media/publish-events-using-namespace-topics-portal/search-bar-namespace-topics.png":::
1. On the **Event Grid Namespaces** page, select **+ Create** on the command bar.
    :::image type="content" source="./media/publish-events-using-namespace-topics-portal/namespaces-create-button.png" alt-text="Screenshot that shows the Event Grid Namespaces page with the Create button on the command bar selected." lightbox="./media/publish-events-using-namespace-topics-portal/namespaces-create-button.png":::
1. On the **Create Namespace** page, follow these steps: 
    1. Select the **Azure subscription** in which you want to create the namespace.
    1. Create a new resource group by selecting **Create new** or select an existing resource group.
    1. Enter a **name** for the namespace.    
    1. Select the **location** where you want to create the resource group.
    1. Then, select **Review + create**.    
        :::image type="content" source="./media/publish-events-using-namespace-topics-portal/create-namespace.png" alt-text="Screenshot that shows the Create Namespace page." lightbox="./media/publish-events-using-namespace-topics-portal/create-namespace.png":::
    1. On the **Review + create** page, select **Create**.
1. On the **Deployment** page, select **Go to resource** after the successful deployment.

### Get the access key

1. On the **Event Grid Namespace** page, select **Access keys** on the left menu.    
1. Select copy button next to the **access key**.
    :::image type="content" source="./media/publish-events-using-namespace-topics-portal/access-key.png" alt-text="Screenshot that shows the Event Grid Namespaces page with the Access keys tab selected." lightbox="./media/publish-events-using-namespace-topics-portal/access-key.png":::   
1. Save the access key somewhere. You use it later in this quickstart.  

## Create a topic in the namespace
Create a topic that holds all events published to the namespace endpoint.

1. Select **Topics** on the left menu.
1. On the **Topics** page, select **+ Topic** on the command bar.
    :::image type="content" source="./media/publish-events-using-namespace-topics-portal/topics-page.png" alt-text="Screenshot that shows the Topics page." lightbox="./media/publish-events-using-namespace-topics-portal/topics-page.png":::
1. On the **Create Topic** page, follow these steps:
    1. Enter a **name** for the topic.     
    1. Select **Create**.     
        :::image type="content" source="./media/publish-events-using-namespace-topics-portal/create-topic-page.png" alt-text="Screenshot that shows the Create Topic page." lightbox="./media/publish-events-using-namespace-topics-portal/create-topic-page.png":::


## Create a message endpoint
Before subscribing to the events, let's create the endpoint for the event message. Typically, the endpoint takes actions based on the event data. To simplify this quickstart, you deploy a [prebuilt web app](https://github.com/Azure-Samples/azure-event-grid-viewer) that displays the event messages. The deployed solution includes an App Service plan, an App Service web app, and source code from GitHub.

1. Select **Deploy to Azure** to deploy the solution to your subscription. 

   :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fazure-event-grid-viewer%2Fmaster%2Fazuredeploy.json":::

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
6. Confirm that you see the site but no events are posted to it yet. 

   ![Screenshot of a new site.](./media/blob-event-quickstart-portal/view-site.png)

    > [!IMPORTANT]
    > Keep the Azure Event Grid Viewer window open so that you can see events as they are posted. 

    
## Create an event subscription
Create an event subscription setting its delivery mode to *Push*, which supports [push delivery](namespace-push-delivery-overview.md). 

1. Switch to the tab or window with the **Event Grid Namespace** page open from the tab or window with the **Event Hubs Namespace** page open.
1. On the **Event Grid Namespace** page, select **Topics** on the left menu.
1. On the **Topics** page, select the topic you created in the previous step.
1. Select **+ Subscription** on the command bar. 
    :::image type="content" source="./media/publish-events-using-namespace-topics-portal/create-subscription-button.png" alt-text="Screenshot that shows the Topic page with Create subscription button selected." lightbox="./media/publish-events-using-namespace-topics-portal/create-subscription-button.png":::       
1. On the **Create Event Subscription** page, follow these steps:
    1. In the **Basic** tab, enter a **name** for the event subscription.
    1. Select **Push** for the event delivery mode.
    1. For **Endpoint type**, select **Web Hook**. 
    1. Select **Configure an endpoint**.
    
        :::image type="content" source="./media/publish-deliver-events-with-namespace-topics-webhook-portal/select-webhook-handler.png" alt-text="Screenshot that shows the Create Subscription page with Push selected for Delivery mode and WebHook as endpoint type." :::       
    1. On the **Web Hook** page, specify the endpoint (for example: `https://spegridsite0520.azurewebsites.net/api/updates`) as shown in the following example, and select **Confirm selection**. 
    
        :::image type="content" source="./media/publish-deliver-events-with-namespace-topics-webhook-portal/webhook-endpoint.png" alt-text="Screenshot that shows the Web Hook page with a value for subscriber endpoint." :::          
    1. Back on the **Create Subscription** page, select **Create**.
    
          :::image type="content" source="./media/publish-deliver-events-with-namespace-topics-webhook-portal/create-subscription-full.png" alt-text="Screenshot that shows the Create Subscription page with all fields filled." :::                          
     
## Send events to your topic

Now, send a sample event to the namespace topic by following steps in this section.

### Declare variables

1. Launch Cloud Shell in the Azure portal. Switch to **Bash**. 

    :::image type="content" source="./media/publish-events-using-namespace-topics-portal/cloud-shell-bash.png" alt-text="Screenshot that shows the Cloud Shell." lightbox="./media/publish-events-using-namespace-topics-portal/cloud-shell-bash.png":::
1. Run the following command to declare a variable to hold the resource group name. Replace `RESOUREGROUPNAME` with the name of your Azure resource group.

    ```bash
    resource_group=RESOURCEGROUPNAME
    ```
1. In the Cloud Shell, run the following command to declare a variable to hold the namespace name. Replace `NAMESPACENAME` with the name of your Event Grid namespace.

    ```bash
    namespace=NAMESPACENAME
    ```
1. Run the following command to declare a variable to hold the access key value you noted down earlier. Replace `ACCESSKEY` with the value of access key to your Event Grid namespace.

    ```azurecli-interactive 
    key=ACCESSKEY
    ```
1. In the Cloud Shell, run the following command to declare a variable to hold the namespace name. 

    ```bash
    topic=TOPICNAME
    ```

### Publish an event

1. Retrieve the namespace hostname. You use it to compose the namespace HTTP endpoint to which events are sent. The following operations were first available with API version `2023-06-01-preview`. You can also get the hostname from the **Overview** page of your Event Grid namespace in the Azure portal. 

    ```azurecli-interactive
    publish_operation_uri="https://"$(az eventgrid namespace show -g $resource_group -n $namespace --query "topicsConfiguration.hostname" --output tsv)"/topics/"$topic:publish?api-version=2023-06-01-preview
    ```

2. Create a sample [CloudEvents](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/formats/json-format.md) compliant event:

    ```azurecli-interactive
    event=' { "specversion": "1.0", "id": "'"$RANDOM"'", "type": "com.yourcompany.order.ordercreatedV2", "source" : "/mycontext", "subject": "orders/O-234595", "time": "'`date +%Y-%m-%dT%H:%M:%SZ`'", "datacontenttype" : "application/json", "data":{ "orderId": "O-234595", "url": "https://yourcompany.com/orders/o-234595"}} '
    ```

    The `data` element is the payload of your event. Any well-formed JSON can go in this field. For more information on properties (also known as context attributes) that can go in an event, see the [CloudEvents](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md) specifications.

3. Use CURL to send the event to the topic. CURL is a utility that sends HTTP requests.

    ```azurecli-interactive
    curl -X POST -H "Content-Type: application/cloudevents+json" -H "Authorization:SharedAccessKey $key" -d "$event" $publish_operation_uri
    ```

## Verify that Azure Event Grid Viewer received the event
Verify that the Azure Event Grid Viewer web app shows the events it received from Event Grid. 

:::image type="content" source="./media/publish-deliver-events-with-namespace-topics-webhook/verify-received-events.png" alt-text="Screenshot that shows the Azure Event Grid Viewer with a sample received event.":::

## Related content

In this quickstart, you used a webhook as an event handler. For quickstart that uses an Azure event hub as an event handler, see [Deliver events to Azure Event Hubs using namespace topics](publish-deliver-events-with-namespace-topics.md).