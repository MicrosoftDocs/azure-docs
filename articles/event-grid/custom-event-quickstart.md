---
title: Custom events for Azure Event Grid | Microsoft Docs
description: Use Azure Event Grid to publish a topic, and subscribe to that event. 
services: event-grid 
keywords: 
author: djrosanova
ms.author: darosa
ms.date: 08/07/2017
ms.topic: hero-article
ms.service: event-grid
---

# Create and route custom events with the Azure CLI

Azure Event Grid is an eventing service for the cloud. In this article, you use the Azure CLI to create an Event Grid topic, subscribe to the topic, and trigger the event to view the result. Typically, you send events to an endpoint that responds to the event, such as, a webhook or Azure Function. However, to simplify this article, you send the events to a URL that merely collects the messages. For a tutorial on using Azure Functions with Event Grid, see [Automatically resize images in web application to improve load time]().

[!INCLUDE [quickstarts-free-trial-note.md](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this topic requires that you are running the Azure CLI version 2.0 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli).
 
## Create a resource group

An Azure resource group is a logical container for Azure resources. You create a resource group to contain the topic.

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

## Create an application topic

A topic provides a user-defined endpoint to which you post your own events. You create an event topic in the resource group. The following example creates a topic with a name that includes a random value.

```azurecli-interactive
topicName=mytopic$RANDOM
topic=$(az eventgird topic create --name $topicName --resource-group myResourceGroup)
```

## Create a RequestBin

Before subscribing to the topic, let's create the endpoint for the event message. Go to [RequestBin](https://requestb.in/), and click **Create a RequestBin**. Copy the bin URL. You use this URL when subscribing to the topic.

## Subscribe to a topic

You subscribe to a topic to tell Event Grid which events you want to track. The following example subscribes to the topic you created in the preceding example. It passes the URL from RequestBin as the endpoint for event notification.

```azurecli-interactive
binURL={value from Request Bin}
az eventgrid sub create --id $topic.id --name sub1 -url $binURL
```
 
## Create a sample event from a template

```azurecli-interactive
body=$(eval echo "'$(curl https://tempstor1ga23s.blob.core.windows.net/template/customevent.json)'")
```

If you `echo "$body"` you can see the full event. The `data` element of the JSON is the payload of your event, any well formed JSON can go in this field. You can also use the subject field for advanced routing and filtering. 

## Send an event to your topic with CURL
CURL is a utility to perform HTTP requests with. In this article, we use CURL to send the event to our topic. 

```azurecli-interactive
curl -X POST -H "aeg-sas-key: $topic.key1" -d "$body" $topic.endpoint
```

## Look at your event in RequestBin
Browse to the BinURL that you created earlier. Or, click refresh in your open Request Bin browser. You see the event you just sent. 

## Clean up resources
If you plan to continue working with this event, do not clean up the resources created in this article. If you do not plan to continue, use the following command to delete the resources you created in this article.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next steps

Now that you know how to create topics and event subscriptions, learn more about what Event Grid can help you do:

- [About Event Grid](overview.md)
