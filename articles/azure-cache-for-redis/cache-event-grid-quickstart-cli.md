---
title: 'Quickstart: Route Azure Cache for Redis events to web endpoint with Azure CLI'
description: Use Azure Event Grid to subscribe to Azure Cache for Redis events, trigger an event, and view the results.
author: flang-msft
ms.author: franlanglois
ms.date: 1/5/2021
ms.topic: quickstart
ms.service: cache
ms.custom: mode-api, devx-track-azurecli
---

# Quickstart: Route Azure Cache for Redis events to web endpoint with Azure CLI

Azure Event Grid is an eventing service for the cloud. In this quickstart, you'll use the Azure CLI to subscribe to Azure Cache for Redis events, trigger an event, and view the results.

Typically, you send events to an endpoint that processes the event data and takes actions. However, to simplify this quickstart, you'll send events to a web app that will collect and display the messages. When you complete the steps described in this quickstart, you'll see that the event data has been sent to the web app.

[!INCLUDE [quickstarts-free-trial-note.md](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you're running the latest version of Azure CLI (2.0.70 or later). To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

If you aren't using Cloud Shell, you must first sign in using `az login`.

## Create a resource group

Event Grid topics are deployed as individual Azure resources and must be provisioned under an Azure resource group. A resource group is a logical collection into which Azure resources are deployed and managed.

Create a resource group with the [az group create](/cli/azure/group) command. 

The following example creates a resource group named `<resource_group_name>` in the *westcentralus* location.  Replace `<resource_group_name>` with a unique name for your resource group.

```azurecli-interactive
az group create --name <resource_group_name> --location westcentralus
```

## Create a cache instance

```azurecli-interactive
#/bin/bash

# Create a Basic C0 (256 MB) Azure Cache for Redis instance
az redis create --name <cache_name> --resource-group <resource_group_name> --location westcentralus --sku Basic --vm-size C0
```


## Create a message endpoint

Before subscribing to the topic, let's create the endpoint for the event message. Typically, the endpoint takes actions based on the event data. To simplify this quickstart, you deploy a [pre-built web app](https://github.com/Azure-Samples/azure-event-grid-viewer) that displays the event messages. The deployed solution includes an App Service plan, an App Service web app, and source code from GitHub.

Replace `<your-site-name>` with a unique name for your web app. The web app name must be unique because it's part of the DNS entry.

```azurecli-interactive
sitename=<your-site-name>

az deployment group create \
  --resource-group <resource_group_name> \
  --template-uri "https://raw.githubusercontent.com/Azure-Samples/azure-event-grid-viewer/main/azuredeploy.json" \
  --parameters siteName=$sitename hostingPlanName=viewerhost
```

The deployment may take a few minutes to complete. After the deployment has succeeded, view your web app to make sure it's running. In a web browser, navigate to: `https://<your-site-name>.azurewebsites.net`

You should see the site with no messages currently displayed.

[!INCLUDE [register-provider-cli.md](../../articles/event-grid/includes/register-provider-cli.md)]

## Subscribe to your Azure Cache for Redis instance

In this step, you'll subscribe to a topic to tell Event Grid which events you want to track and where to send those events. The following example subscribes to the Azure Cache for Redis instance you created, and passes the URL from your web app as the endpoint for event notification. Replace `<event_subscription_name>` with a name for your event subscription. For `<resource_group_name>` and `<cache_name>`, use the values you created earlier.

The endpoint for your web app must include the suffix `/api/updates/`.

```azurecli-interactive
cacheId=$(az redis show --name <cache_name> --resource-group <resource_group_name> --query id --subscription <subscription_id> --output tsv)
endpoint=https://$sitename.azurewebsites.net/api/updates

az eventgrid event-subscription create \
  --source-resource-id $cacheId \
  --name <event_subscription_name> \
  --endpoint $endpoint
```

View your web app again, and notice that a subscription validation event has been sent to it. Select the eye icon to expand the event data. Event Grid sends the validation event so the endpoint can verify that it wants to receive event data. The web app includes code to validate the subscription.

  :::image type="content" source="media/cache-event-grid-portal/subscription-event.png" alt-text="Azure Event Grid Viewer.":::

## Trigger an event from Azure Cache for Redis

Now, let's trigger an event to see how Event Grid distributes the message to your endpoint. Let's export the data stored in your Azure Cache for Redis instance. Again, use the values for `{cache_name}` and `{resource_group_name}` you created earlier.

```azurecli-interactive
az redis export  --ids '/subscriptions/{subscription_id}/resourceGroups/{resource_group_name}/providers/Microsoft.Cache/Redis/{cache_name}' \
    --prefix '<prefix_for_exported_files>' \
    --container '<SAS_url>'  
```

You've triggered the event, and Event Grid sent the message to the endpoint you configured when subscribing. View your web app to see the event you just sent.


```json
[{
"id": "e1ceb52d-575c-4ce4-8056-115dec723cff",
  "eventType": "Microsoft.Cache.ExportRDBCompleted",
  "topic": "/subscriptions/{subscription_id}/resourceGroups/{resource_group_name}/providers/Microsoft.Cache/Redis/{cache_name}",
  "data": {
    "name": "ExportRDBCompleted",
    "timestamp": "2020-12-10T18:07:54.4937063+00:00",
    "status": "Succeeded"
  },
  "subject": "ExportRDBCompleted",
  "dataversion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2020-12-10T18:07:54.4937063+00:00"
}]

```

## Clean up resources
If you plan to continue working with this Azure Cache for Redis instance and event subscription, do not clean up the resources created in this quickstart. If you do not plan to continue, use the following command to delete the resources you created in this quickstart.

Replace `<resource_group_name>` with the resource group you created above.

```azurecli-interactive
az group delete --name <resource_group_name>
```

## Next steps

Now that you know how to create topics and event subscriptions, learn more about Azure Cache for Redis Events and what Event Grid can help you do:

- [Reacting to Azure Cache for Redis events](cache-event-grid.md)
- [About Event Grid](../event-grid/overview.md)
