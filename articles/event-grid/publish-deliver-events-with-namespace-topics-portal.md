---
title: Deliver events to Azure Event Hubs using namespace topics - Portal
description: This article provides step-by-step instructions to publish to Azure Event Grid in the CloudEvents JSON format and deliver those events by using the push delivery model. You use Azure portal in this quickstart.
ms.topic: quickstart
ms.custom:
  - build-2024
ms.author: spelluru
author: spelluru
ms.date: 02/20/2024
---

# Deliver events to Azure Event Hubs using namespace topics - Azure portal

The article provides step-by-step instructions to publish events to Azure Event Grid in the [CloudEvents JSON format](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/formats/json-format.md) and deliver those events by using the push delivery model. 

To be specific, you use Azure portal and Curl to publish events to a namespace topic in Event Grid and push those events from an event subscription to an Event Hubs handler destination. For more information about the push delivery model, see [Push delivery overview](push-delivery-overview.md).

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

### Enable managed identity for the Event Grid namespace
Enable system assigned managed identity in the Event Grid namespace. To deliver events to event hubs in your Event Hubs namespace using managed identity, follow these steps:

1. Enable system-assigned or user-assigned managed identity: [namespaces](event-grid-namespace-managed-identity.md). Continue reading to the next section to find how to enable managed identity using Azure CLI.
1. [Add the identity to the **Azure Event Hubs Data Sender** role  on the Event Hubs namespace](../event-hubs/authenticate-managed-identity.md#to-assign-azure-roles-using-the-azure-portal), continue reading to the next section to find how to add the role assignment.
1. Configure the event subscription that uses an event hub as an endpoint to use the system-assigned or user-assigned managed identity.

In this section, you enable a system-assigned managed identity on the namespace. You do the other steps later in this quickstart.

1. On the **Event Grid Namespace** page, select **Identity** on the left menu.
1. On the **Identity** page, select **On** for the **Status**.
1. Select **Save** on the command bar. 

    :::image type="content" source="./media/publish-events-using-namespace-topics-portal/enable-managed-identity.png" alt-text="Screenshot that shows the Identity tab of the Event Grid Namespaces page." lightbox="./media/publish-events-using-namespace-topics-portal/enable-managed-identity.png":::       

## Create a topic in the namespace
Create a topic that's used to hold all events published to the namespace endpoint.

1. Select **Topics** on the left menu.
1. On the **Topics** page, select **+ Topic** on the command bar.
    :::image type="content" source="./media/publish-events-using-namespace-topics-portal/topics-page.png" alt-text="Screenshot that shows the Topics page." lightbox="./media/publish-events-using-namespace-topics-portal/topics-page.png":::
1. On the **Create Topic** page, follow these steps:
    1. Enter a **name** for the topic.     
    1. Select **Create**.     
        :::image type="content" source="./media/publish-events-using-namespace-topics-portal/create-topic-page.png" alt-text="Screenshot that shows the Create Topic page." lightbox="./media/publish-events-using-namespace-topics-portal/create-topic-page.png":::

## Create an Event Hubs namespace

Create an Event Hubs resource that is used as the handler destination for the namespace topic push delivery subscription. Do these steps in a separate tab of your internet browser or in a separate window. Navigate to the Azure portal and sign in using the same credentials you used before and the same Azure subscription. 

1. Type **Event Hubs** in the search bar, and select **Event Hubs**. 
1. On the **Event Hubs** page, select **+ Create** on the command bar.
1. On the **Create Namespace** page, follow these steps:
    1. Select the **Azure subscription** you used to create the Event Grid namespace.
    1. Select the **resource group** you used earlier.
    1. Enter a **name** for the Event Hubs namespace.
    1. Select the same **location** you used for the Event Grid namespace.
    1. Select **Basic** for the **Pricing** tier.
    1. Select **Review + create**.
        :::image type="content" source="./media/publish-events-using-namespace-topics-portal/create-event-hubs-namespace.png" alt-text="Screenshot that shows the Create Event Hubs Namespace page." lightbox="./media/publish-events-using-namespace-topics-portal/create-event-hubs-namespace.png":::            
    1. On the **Review** page, select **Create**.
1. On the **Deployment** page, select **Go to resource** after the deployment is successful.


## Add Event Grid managed identity to Event Hubs Data Sender role

1. On the **Event Hubs Namespace** page, select **Access control (IAM)** on the left menu.
1. Select **Add** -> **Add role assignment** on the command bar.
    :::image type="content" source="./media/publish-events-using-namespace-topics-portal/event-hubs-access-control.png" alt-text="Screenshot that shows the Event Hubs Namespace page with Access control tab selected." lightbox="./media/publish-events-using-namespace-topics-portal/event-hubs-access-control.png":::            
1. On the **Add role assignment** page, search for **Event Hubs Data Sender**, and select **Azure Event Hubs Data Sender** from the list of roles, and then select **Next**.
    :::image type="content" source="./media/publish-events-using-namespace-topics-portal/add-role-assignment.png" alt-text="Screenshot that shows the Add Role Assignment page." lightbox="./media/publish-events-using-namespace-topics-portal/add-role-assignment.png":::            
1. In the **Members** tab, select **Managed identity** for the type, and then select **+ Select members**.
    :::image type="content" source="./media/publish-events-using-namespace-topics-portal/add-role-assignment-members.png" alt-text="Screenshot that shows the Members tab of the Add Role Assignment page." lightbox="./media/publish-events-using-namespace-topics-portal/add-role-assignment-members.png":::            
1. On the **Select managed identities** page, select **Event Grid Namespace** for the **Managed identity**, and then select the managed identity that has the same name as the Event Grid namespace.
    :::image type="content" source="./media/publish-events-using-namespace-topics-portal/select-managed-identities.png" alt-text="Screenshot that shows the Select managed identities page." lightbox="./media/publish-events-using-namespace-topics-portal/select-managed-identities.png":::
1. On the **Select managed identities** page, choose **Select**. 
    :::image type="content" source="./media/publish-events-using-namespace-topics-portal/select-managed-identity.png" alt-text="Screenshot that shows the selected managed identity." lightbox="./media/publish-events-using-namespace-topics-portal/select-managed-identity.png":::
1. Now, on the **Add role assignment** page, select **Review + assign**. 
    :::image type="content" source="./media/publish-events-using-namespace-topics-portal/add-role-assignment-managed-identity.png" alt-text="Screenshot that shows Add role assignment page with the managed identity selected." lightbox="./media/publish-events-using-namespace-topics-portal/add-role-assignment-managed-identity.png":::
1. On the **Review + assign** page, select **Review + assign**. 

## Create an event hub

1. On the **Event Hubs Namespace** page, select **Event Hubs** on the left menu.
1. On the **Event Hubs** page, select **+ Event hub** on the command bar.
    :::image type="content" source="./media/publish-events-using-namespace-topics-portal/event-hubs-page.png" alt-text="Screenshot that shows Event Hubs page with + Event hub selected." lightbox="./media/publish-events-using-namespace-topics-portal/event-hubs-page.png":::
1. On the **Create Event hub** page, enter a name for the event hub, and then select **Review + create**.
    :::image type="content" source="./media/publish-events-using-namespace-topics-portal/create-event-hub.png" alt-text="Screenshot that shows the Create event hub page." lightbox="./media/publish-events-using-namespace-topics-portal/create-event-hub.png":::
1. On the **Review + create** page, select **Create**.


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
    1. Confirm that **Event hub** selected for the **Endpoint type**. 
    1. Select **Configure an endpoint**.
        :::image type="content" source="./media/publish-events-using-namespace-topics-portal/create-push-subscription-page.png" alt-text="Screenshot that shows the Create Subscription page with Push selected for Delivery mode." lightbox="./media/publish-events-using-namespace-topics-portal/create-push-subscription-page.png":::       
    1. On the **Select Event hub** page, follow these steps:
        1. Select the **Azure subscription** and **resource group** that has the event hub. 
        1. Select the **Event Hubs namespace** and the **event hub**.
        1. Then, select **Confirm selection**.
            :::image type="content" source="./media/publish-events-using-namespace-topics-portal/select-event-hub.png" alt-text="Screenshot that shows the Select event hub page." lightbox="./media/publish-events-using-namespace-topics-portal/select-event-hub.png":::       
    1. Back on the **Create Subscription** page, select **System Assigned** for **Managed identity type**.
        :::image type="content" source="./media/publish-events-using-namespace-topics-portal/create-subscription-managed-identity-delivery.png" alt-text="Screenshot that shows the Create Subscription page with System Assigned set for Managed identity type." lightbox="./media/publish-events-using-namespace-topics-portal/create-subscription-managed-identity-delivery.png":::                  
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

    Navigate to the **Event Hubs Namespace page** in the Azure portal, refresh the page and verify that incoming messages counter in the chart indicates that an event has been received. 

    :::image type="content" source="./media/publish-events-using-namespace-topics-portal/event-hub-received-event.png" alt-text="Screenshot that shows the Event hub page with chart showing an event has been received." lightbox="./media/publish-events-using-namespace-topics-portal/event-hub-received-event.png":::                  


## Next steps

In this article, you created and configured the Event Grid namespace and Event Hubs resources. For step-by-step instructions to receive events from an event hub, see these tutorials:

- [.NET Core](../event-hubs/event-hubs-dotnet-standard-getstarted-send.md)
- [Java](../event-hubs/event-hubs-java-get-started-send.md)
- [Python](../event-hubs/event-hubs-python-get-started-send.md)
- [JavaScript](../event-hubs/event-hubs-node-get-started-send.md)
- [Go](../event-hubs/event-hubs-go-get-started-send.md)
- [C (send only)](../event-hubs/event-hubs-c-getstarted-send.md)
- [Apache Storm (receive only)](../event-hubs/event-hubs-storm-getstarted-receive.md)
