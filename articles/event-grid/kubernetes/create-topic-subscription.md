---
title: Azure Event Grid on Kubernetes - Webhook as event handler
description: This article describes how to create an event grid topic on a Kubernetes cluster that's connected to Azure Arc and then create a subscription for the topic. 
author: jfggdl
ms.subservice: kubernetes
ms.author: jafernan
ms.date: 05/25/2021
ms.topic: quickstart
---

# Route cloud events to Webhooks with Azure Event Grid on Kubernetes
In this quickstart, you'll create a topic in Event Grid on Kubernetes, create a subscription for the topic, and then send a sample event to the topic to test the scenario. 

[!INCLUDE [event-grid-preview-feature-note.md](../../../includes/event-grid-preview-feature-note.md)]


## Prerequisites

1. [Connect your Kubernetes cluster to Azure Arc](../../azure-arc/kubernetes/quickstart-connect-cluster.md).
1. [Install Event Grid extension on Kubernetes cluster](install-k8s-extension.md). This extension deploys Event Grid to a Kubernetes cluster. 
1. [Create a custom location](../../azure-arc/kubernetes/custom-locations.md). A custom location represents a namespace in the cluster and it's the place where topics and event subscriptions are deployed.

## Create a topic

### Azure CLI
Run the following Azure CLI command to create a topic:

```azurecli-interactive
az eventgrid topic create --name <EVENT GRID TOPIC NAME> \
                        --resource-group <RESOURCE GROUP NAME> \
                        --location <REGION> \
                        --kind azurearc \
                        --extended-location-name /subscriptions/<AZURE SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP NAME>/providers/Microsoft.ExtendedLocation/customLocations/<CUSTOM LOCATION NAME> \
                        --extended-location-type customlocation \
                        --input-schema CloudEventSchemaV1_0
```
Specify values for the place holders before running the command:
- Name of the Azure resource group in which you want the event grid topic to created. 
- Name for the topic. 
- Region for the topic.
- In the resource ID of the custom location, specify the following values:
    - ID of the Azure subscription in which the custom location exists.
    - Name of the resource group that contains the custom location.
    - Name of the custom location

For more information about the CLI command, see [`az eventgrid topic create`](/cli/azure/eventgrid/topic#az_eventgrid_topic_create).

## Create a message endpoint
Before you create a subscription for the custom topic, create an endpoint for the event message. Typically, the endpoint takes actions based on the event data. To simplify this quickstart, you deploy a [pre-built web app](https://github.com/Azure-Samples/azure-event-grid-viewer) that displays the event messages. The deployed solution includes an App Service plan, an App Service web app, and source code from GitHub.

1. In the article page, select **Deploy to Azure** to deploy the solution to your subscription. In the Azure portal, provide values for the parameters.

   <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fazure-event-grid-viewer%2Fmaster%2Fazuredeploy.json" target="_blank"><img src="https://azuredeploy.net/deploybutton.png"  alt="Button to Deploy to Aquent." /></a>
1. The deployment may take a few minutes to complete. After the deployment has succeeded, view your web app to make sure it's running. In a web browser, navigate to: 
`https://<your-site-name>.azurewebsites.net`

    If the deployment fails, check the error message. It may be because the web site name is already taken. Deploy the template again and choose a different name for the site. 
1. You see the site but no events have been posted to it yet.

   ![View new site](../media/custom-event-quickstart-portal/view-site.png)

## Create a subscription
Subscribers can register for events published to a topic. To receive any event, you'll need to create an Event Grid subscription for a topic of interest. An event subscription defines the destination to which those events are sent. To learn about all the destinations or handlers supported, see [Event handlers](event-handlers.md).


### Azure CLI
To create an event subscription with a WebHook (HTTPS endpoint) destination, run the following Azure CLI command:

```azurecli-interactive
az eventgrid event-subscription create --name <EVENT SUBSCRIPTION NAME> \
                                    --source-resource-id /subscriptions/<AZURE SUBSCRIPTION ID>/resourceGroups/<TOPIC'S RESOURCE GROUP NAME>/providers/Microsoft.EventGrid/topics/<TOPIC NAme> \
                                    --endpoint https://<SITE NAME>.azurewebsites.net/api/updates
```

Specify values for the place holders before running the command:
- Name of the event subscription to be created. 

- In the **resource ID of the topic**, specify the following values:
    - ID of the Azure subscription in which you want the subscription to be created. 
    - Name of the resource group that contains the topic.
    - Name of the topic. 
- For the endpoint, specify the name of the Event Grid Viewer web site.
    
For more information about the CLI command, see [`az eventgrid event-subscription create`](/cli/azure/eventgrid/event-subscription#az_eventgrid_event_subscription_create).


## Send events to the topic
1. Run the following command to get the **endpoint** for the topic: After you copy and paste the command, update the **topic name** and **resource group name** before you run the command. You'll publish sample events to this topic endpoint. 

    ```azurecli
    az eventgrid topic show --name <topic name> -g <resource group name> --query "endpoint" --output tsv
    ```
2. Run the following command to get the **key** for the custom topic: After you copy and paste the command, update the **topic name** and **resource group** name before you run the command. It's the primary key of the topic. To get this key from the Azure portal, switch to the **Access keys** tab of the **Event Grid Topic** page. To be able post an event to a custom topic, you need the access key. 

    ```azurecli
    az eventgrid topic key list --name <topic name> -g <resource group name> --query "key1" --output tsv
    ```
1. Run the following **Curl** command to post the event. Specify the endpoint URL and key from step 1 and 2 before running the command. 

    ```bash
    curl  -k -X POST -H "Content-Type: application/cloudevents-batch+json" -H "aeg-sas-key: <KEY_FROM_STEP_2>" -g <ENDPOINT_URL_FROM_STEP_1> \
    -d  '[{ 
          "specversion": "1.0",
          "type" : "orderCreated",
          "source": "myCompanyName/us/webCommerceChannel/myOnlineCommerceSiteBrandName",
          "id" : "eventId-n",
          "time" : "2020-12-25T20:54:07+00:00",
          "subject" : "account/acct-123224/order/o-123456",
          "dataSchema" : "1.0",
          "data" : {
             "orderId" : "123",
             "orderType" : "PO",
             "reference" : "https://www.myCompanyName.com/orders/123"
          }
    }]'
    ```
    
    If the topic endpoint URL from step 1 is a private IP address, such as in the case when Event Grid broker's service type is ClusterIP, you can execute **Curl** from within another pod in the cluster to have access to that IP address. For example, you can perform the following steps:

    1. Create a manifest file with the following configuration. You may want to adjust the ``dnsPolicy`` according to your needs. Consult [DNS for Services and Pods](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/) for more information.
    
        ```yml
            apiVersion: v1
            kind: Pod
            metadata:
              name: test-pod
            spec:
              volumes:
              - name: shared-data
                emptyDir: {}
              containers:
              - name: nginx
                image: nginx
                volumeMounts:
                - name: shared-data
                  mountPath: /usr/share/nginx/html
          hostNetwork: true
          dnsPolicy: ClusterFirstWithHostNet    
        ```
    1. Create the pod.
        ```bash
            kubectl apply -f <name_of_your_yaml_manifest_file>
        ```
    1. Verify that the pod is running.
        ```bash
            kubectl get pod test-pod
        ```
    1. Start a shell session from the container
        ```bash
            kubectl exec --stdin --tty test-pod -- /bin/bash
        ```

    At this point, you have a shell session from a running container in the cluster from which you can execute the **Curl** command described in an earlier step above.

    > [!NOTE]
    > To learn how to send cloud events using programming languages, see the following samples: 
    > - [C#](/samples/azure/azure-sdk-for-net/azure-event-grid-sdk-samples/).
    > - [Java](/samples/azure/azure-sdk-for-java/eventgrid-samples/)
    > - [JavaScript](/samples/azure/azure-sdk-for-js/eventgrid-javascript/) and [TypeScript](/samples/azure/azure-sdk-for-js/eventgrid-typescript/)
    > - [Python](/samples/azure/azure-sdk-for-python/eventgrid-samples/)

### Verify in the Event Grid Viewer
You've triggered the event, and Event Grid sent the message to the endpoint you configured when subscribing. View your web app to see the event you just sent.

:::image type="content" source="./media/create-topic-subscription/viewer-received-event.png" alt-text="View received event in Event Grid Viewer":::

## Next steps
See the following articles: 
- [Event handlers and destinations](event-handlers.md) - provides information about all the event handlers and destinations that Event Grid on Kubernetes supports. 
- [Event filtering](filter-events.md) - provides information about filtering events on event subscriptions. 