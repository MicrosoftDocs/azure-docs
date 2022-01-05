---
author: vicancy
ms.service: azure-web-pubsub
ms.topic: include
ms.date: 08/06/2021
ms.author: lianwei
---

Use the Azure CLI [az webpubsub event-handler hub](/cli/azure/webpubsub/event-handler/hub) command to update the event handler settings:

  > [!Important]
  > Replace &lt;your-unique-resource-name&gt; with the name of your Web PubSub resource created from the previous steps.
  > Replace &lt;domain-name&gt; with the name ngrok printed.

```azurecli-interactive
az webpubsub event-handler hub update -n "<your-unique-resource-name>" -g "myResourceGroup" --hub-name myHub1 --template url-template="https://<domain-name>.ngrok.io/eventHandler" user-event-pattern="*" system-event-pattern="connected"
```
