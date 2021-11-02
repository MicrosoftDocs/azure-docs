---
author: vicancy
ms.service: azure-web-pubsub
ms.topic: include
ms.date: 08/06/2021
ms.author: lianwei
---

Use the Azure CLI [az webpubsub hub update](/cli/azure/webpubsub/hub#az_webpubsub_hub_update) command to update the event handler settings for the hub

  > [!Important]
  > Replace &lt;your-unique-resource-name&gt; with the name of your Web PubSub resource created from the previous steps.
  > Replace &lt;domain-name&lt; with the name ngrok printed.

```azurecli-interactive
az webpubsub hub update -n "<your-unique-resource-name>" -g "myResourceGroup" --hub-name myHub1 --event-handler url-template="https://<domain-name>.ngrok.io/eventHandler" user-event-pattern="*" system-event="connected"
```
