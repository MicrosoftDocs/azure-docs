---
title: Publish and consume events using namespace topics - Portal
description: This article provides step-by-step instructions to publish events to Azure Event Grid in the CloudEvents JSON format and consume those events by using the pull delivery model. You use the Azure portal in this quickstart.
ms.topic: quickstart
ms.author: spelluru
author: spelluru
ms.date: 02/20/2024
---

# Publish to namespace topics and consume events in Azure Event Grid - Azure portal
This quickstart provides you with step-by-step instructions to use Azure portal to create an Azure Event Grid namespace, a topic in a namespace, and a subscription to the topic using **Queue** as the delivery mode. Then, you use Curl to send a test event, receive the event, and then acknowledge the event. 

The quickstart is for a quick test of the pull delivery functionality of Event Grid. For more information about the pull delivery model, see the [concepts](concepts-event-grid-namespaces.md) and [pull delivery overview](pull-delivery-overview.md) articles.

In this quickstart, you use the Azure portal to do the following tasks.

1. Create an Event Grid namespace.
1. Create a topic in the namespace.
1. Create a subscription for the topic using the Queue (Pull) model.

Then, you use Curl to do the following tasks to test the setup.

1. Send a test event to the topic.
1. Receive the event from the subscription. 
1. Acknowledge the event in the subscription.  

[!INCLUDE [quickstarts-free-trial-note.md](../../includes/quickstarts-free-trial-note.md)]


## Create a namespace
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
Create a topic that's used to hold all events published to the namespace endpoint.

1. Select **Topics** on the left menu.
1. On the **Topics** page, select **+ Topic** on the command bar.
    :::image type="content" source="./media/publish-events-using-namespace-topics-portal/topics-page.png" alt-text="Screenshot that shows the Topics page." lightbox="./media/publish-events-using-namespace-topics-portal/topics-page.png":::
1. On the **Create Topic** page, follow these steps:
    1. Enter a **name** for the topic.     
    1. Select **Create**.     
        :::image type="content" source="./media/publish-events-using-namespace-topics-portal/create-topic-page.png" alt-text="Screenshot that shows the Create Topic page." lightbox="./media/publish-events-using-namespace-topics-portal/create-topic-page.png":::       

## Create an event subscription
Create an event subscription setting its delivery mode to *queue*, which supports [pull delivery](pull-delivery-overview.md). For more information on all configuration options,see the latest Event Grid control plane [REST API](/rest/api/eventgrid).

1. On the **Topics** page, select the topic you created in the previous step.
1. Select **+ Subscription** on the command bar. 
    :::image type="content" source="./media/publish-events-using-namespace-topics-portal/create-subscription-button.png" alt-text="Screenshot that shows the Topic page with Create subscription button selected." lightbox="./media/publish-events-using-namespace-topics-portal/create-subscription-button.png":::       
1. On the **Create Event Subscription** page, follow these steps:
    1. In the **Basic** tab, enter a **name** for the event subscription, and then select **Additional features** tab at the top.
        :::image type="content" source="./media/publish-events-using-namespace-topics-portal/create-subscription-basics-page.png" alt-text="Screenshot that shows the Create Subscription page." lightbox="./media/publish-events-using-namespace-topics-portal/create-subscription-basics-page.png":::       
    1. In the **Advanced tab**, enter **5** for the **Lock duration**.
        :::image type="content" source="./media/publish-events-using-namespace-topics-portal/create-subscription-lock-duration.png" alt-text="Screenshot that shows the Additional Feature tab of the Create Subscription page." lightbox="./media/publish-events-using-namespace-topics-portal/create-subscription-lock-duration.png":::
    1. Select **Create**. 

## Send events to your topic
Now, send a sample event to the namespace topic by following steps in this section. 

1. Launch Cloud Shell in the Azure portal. Switch to **Bash**. 

    :::image type="content" source="./media/publish-events-using-namespace-topics-portal/cloud-shell-bash.png" alt-text="Screenshot that shows the Cloud Shell." lightbox="./media/publish-events-using-namespace-topics-portal/cloud-shell-bash.png":::
1. In the Cloud Shell, run the following command to declare a variable to hold the access key for the namespace. You noted the access key earlier in this quickstart.

    ```bash
    key=ACCESSKEY
    ```
1. Declare a variable to hold the publishing operation URI. Replace `NAMESPACENAME` with the name of your Event Grid namespace and `TOPICNAME` with the name of the topic.

    ```bash
    publish_operation_uri=https://NAMESPACENAME.eastus-1.eventgrid.azure.net/topics/TOPICNAME:publish?api-version=2023-06-01-preview
    ```
2. Create a sample [CloudEvents](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/formats/json-format.md) compliant event:

    ```bash        
    event=' { "specversion": "1.0", "id": "'"$RANDOM"'", "type": "com.yourcompany.order.ordercreatedV2", "source" : "/mycontext", "subject": "orders/O-234595", "time": "'`date +%Y-%m-%dT%H:%M:%SZ`'", "datacontenttype" : "application/json", "data":{ "orderId": "O-234595", "url": "https://yourcompany.com/orders/o-234595"}} '
    ```

    The `data` element is the payload of your event. Any well-formed JSON can go in this field. For more information on properties (also known as context attributes) that can go in an event, see the [CloudEvents](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md) specifications.    
3. Use CURL to send the event to the topic. CURL is a utility that sends HTTP requests.

    ```bash
    curl -X POST -H "Content-Type: application/cloudevents+json" -H "Authorization:SharedAccessKey $key" -d "$event" $publish_operation_uri
    ```

### Receive the event

You receive events from Event Grid using an endpoint that refers to an event subscription. 

1. Declare a variable to hold the receiving operation URI. Replace `NAMESPACENAME` with the name of your Event Grid namespace, `TOPICNAME` with the name of the topic, and replace `EVENTSUBSCRIPTIONNAME` with the name of the event subscription.

    ```bash
    receive_operation_uri=https://NAMESPACENAME.eastus-1.eventgrid.azure.net/topics/TOPICNAME/eventsubscriptions/EVENTSUBSCRIPTIONNAME:receive?api-version=2023-06-01-preview
    ```
2. Run the following Curl command to consume the event:

    ```bash
    curl -X POST -H "Content-Type: application/json" -H "Authorization:SharedAccessKey $key" $receive_operation_uri
    ```
3. Note down the `lockToken` in the `brokerProperties` object of the result.

### Acknowledge an event

After you receive an event, you pass that event to your application for processing. Once you have successfully processed your event, you no longer need that event to be in your event subscription. To instruct Event Grid to delete the event, you **acknowledge** it using its lock token that you got on the receive operation's response. 

1. Declare a variable to hold the lock token you noted in the previous step. Replace `LOCKTOKEN` with the lock token. 

    ```bash
    lockToken="LOCKTOKEN"
    ```
2. Now, build the acknowledge operation payload, which specifies the lock token for the event you want to be acknowledged.

    ```bash
    acknowledge_request_payload=' { "lockTokens": ["'$lockToken'"]} '
    ```
3. Proceed with building the string with the acknowledge operation URI:

    ```bash
    acknowledge_operation_uri=https://NAMESPACENAME.eastus-1.eventgrid.azure.net/topics/TOPICNAME/eventsubscriptions/EVENTSUBSCRIPTIONNAME:acknowledge?api-version=2023-06-01-preview
    ```
4. Finally, submit a request to acknowledge the event received:

    ```bash
    curl -X POST -H "Content-Type: application/json" -H "Authorization:SharedAccessKey $key" -d "$acknowledge_request_payload" $acknowledge_operation_uri
    ```
    
    If the acknowledge operation is executed before the lock token expires (300 seconds as set when we created the event subscription), you should see a response like the following example:
    
    ```json
    {"succeededLockTokens":["CiYKJDQ4NjY5MDEyLTk1OTAtNDdENS1BODdCLUYyMDczNTYxNjcyMxISChDZae43pMpE8J8ovYMSQBZS"],"failedLockTokens":[]}
    ```
    
## Next steps
For more information about the pull delivery model, see the [concepts](concepts-event-grid-namespaces.md) and [pull delivery overview](pull-delivery-overview.md) articles.

For sample code using the data plane SDKs, see the [.NET](event-grid-dotnet-get-started-pull-delivery.md) or the Java samples. For Java, we provide the sample code in two articles: [publish events](publish-events-to-namespace-topics-java.md) and [receive events](receive-events-from-namespace-topics-java.md) quickstarts.




