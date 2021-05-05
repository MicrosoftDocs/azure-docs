---
title: Azure Event Grid on Kubernetes - create topics and subscriptions
description: This article describes how to create an event grid topic on a Kubernetes cluster connected to Azure Arc and then create a subscription for the topic. 
author: spelluru
manager: JasonWHowell
ms.author: spelluru
ms.date: 05/05/2021
ms.topic: how-to
---

# Azure Event Grid on kubernetes - Create a topic and subscriptions

## Prerequisites

1. [Connect your Kubernetes cluster to Azure Arc](../../azure-arc/kubernetes/quickstart-connect-cluster.md)
1. Deploy the Event Grid Kubernetes extension. 
1. Create a custom location.
1. Download and install [Azure Resource Manager client (armclient)](https://github.com/yangl900/armclient-go). This command-line tool will allow you to send request to Azure to create and manage resources.

## Create a topic
1. Create a file called ```topic-1.json``` containing the following request payload that defines the topic you want to create.  

    ```json
    {
      "name": "<TOPIC-NAME>",
      "location": "<REGION>",
      "kind": "AzureArc",
      "extendedLocation": {
        "name": "<YOUR-CUSTOMLOCATION-RESOURCE-ID>",
        "type": "CustomLocation"
      },
      "properties": {
              "inputschema": "cloudeventschemav1_0"
      }
    }
    ```
2. Create a topic by sending the following request.

    ```console
    armclient put "https://<REGION>.management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourcegroups/<RESOURCE GROUP NAME>/providers/Microsoft.EventGrid/topics/<EVENT GRID TOPIC NAME>?api-version=2020-10-15-preview" @topic-1.json -verbose
    ```
3. Verify that the provisioning state of the topic is ```Succeeded```.

   ```console
   armclient get "https://<REGION>.management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourcegroups/<RESOURCE GROUP NAME>/providers/Microsoft.EventGrid/topics/<TOPIC NAME>?api-version=2020-10-15-preview"
   ```

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
An event subscription defines the filtering criteria to select the events to be routed and the destination to which those events are sent. To learn about all the destinations or handlers supported, see [Event handlers](event-handlers.md).

To create an event subscription with a WebHook (HTTPS endpoint) destination, follow these steps: 

1. Create a file called ```event-subscription-1.json``` that will contain the following request payload that defines a basic filter criteria that selects events for routing based on prefix and suffix strings in the event's subject attribute. You should change the values in  ```subjectBeginsWith``` and ```subjectEndsWith``` to suit your needs. You might also remove the filter criteria. If you do, Event Grid will send all events to the defined destination in ```endpointUrl```.

    ```json
    {
      "properties": {
              "destination": {
                 "endpointType": "WebHook",
                 "properties": {
                         "endpointUrl": "{provide-a-full-url-to-an-http-endpoint}"
                 }
              },
              "filter": {
                 "isSubjectCaseSensitive": false,
                 "subjectBeginsWith": "ExamplePrefix",
                 "subjectEndsWith": "ExampleSuffix"
             }
      }
    }
    ```
2. For the web hook URL, provide the URL of your web app and add `api/updates` to the home page URL.
1. Create an event subscription by sending the following HTTP PUT request with the entity  body defined above:
  
    ```console
    armclient put "https://<REGION>.management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.EventGrid/topics/{topic-name}/providers/Microsoft.EventGrid/eventSubscriptions/{eventSubscriptionName}?api-version=2020-10-15-preview" @event-subscription-1.json -verbose
    ```

Following are some request payload examples for different type of destinations.

## Next steps
See [Event handlers and destinations](event-handlers.md) to learn about all the event handlers and destinations that Event Grid on Kubernetes supports. 