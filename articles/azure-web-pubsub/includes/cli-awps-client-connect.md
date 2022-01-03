---
author: vicancy
ms.service: azure-web-pubsub
ms.topic: include
ms.date: 08/06/2021
ms.author: lianwei
---

Use the Azure CLI [az webpubsub client](/cli/azure/webpubsub/client) command to start a WebSocket client connection to the service created from the previous step, providing the following information:

- Hub name: A string of 1 to 127 characters. It should start with alphabetic characters `(a-z, A-Z)` and only contain alpha-numeric `(0-9, a-z, A-Z)` characters or underscore `(_)`.

**Hub** is a logical set of the connected WebSocket connections. Check [About Hubs, groups and connections](../key-concepts.md) for details about the concepts.

  > [!Important]
  > Replace &lt;your-unique-resource-name&gt; with the name of your Web PubSub resource created from the previous steps.

- Hub name: **myHub1**.
- Resource group name: **myResourceGroup**.
- User ID: **user1**

```azurecli-interactive
az webpubsub client start --name "<your-unique-resource-name>" --resource-group "myResourceGroup" --hub-name "myHub1" --user-id "user1"
```

You can see that the command established a WebSocket connection to the Web PubSub service and you received a JSON message indicating that it is now successfully connected, and is assigned with a unique `connectionId`:

```json
{"type":"system","event":"connected","userId":"user1","connectionId":"<your_unique_connection_id>"}
```
