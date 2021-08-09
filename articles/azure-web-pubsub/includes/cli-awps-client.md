---
author: vicancy
ms.service: azure-web-pubsub
ms.topic: include
ms.date: 08/06/2021
ms.author: lianwei
---

Use the Azure CLI [az webpubsub client](/cli/azure/webpubsub/client) command to start a WebSocket client connection to the service created from the previous step. You will need to provide some information:

- Hub name: A string of 1 to 127 characters that starts with alphabetic characters (a-z, A-Z) and only contain alpha-numeric (0-9, a-z, A-Z) characters or underscore (_).

**Hub** is a logical isolation of the connected WebSocket connections. Check [Hubs, groups and users](../terms.md) for details about the concepts.

  > [!Important]
  > Replace <your-unique-resource-name> with the name of your Web PubSub resource created from the previous steps.

- Hub name: **myHub1**.
- Resource group name: **myResourceGroup**.

```azurecli-interactive
az webpubsub client start --name "<your-unique-resource-name>" --resource-group "myResourceGroup" --hub-name myHub1
```

You can see that the command established a WebSocket connection to the Web PubSub service and you received a JSON message indicating that you are now successfully connected, and is assigned with a unique `connectionId`:

```json
{"type":"system","event":"connected","userId":null,"connectionId":"<your_unique_connection_id>"}
```

Play with it and try joining to groups using `joingroup <group-name>` and send messages to groups using `sendtogroup <group-name>`.

Azure CLI also provides [az webpubsub service](/cli/azure/webpubsub/service) commands to manage the client connections. Under the hood, the CLI calls our data-plane [Python SDK]. 

Open another CLI command, and you can broadcast messages to the clients:

- Hub name: **myHub1**.
- Resource group name: **myResourceGroup**.

```azurecli-interactive
az webpubsub service broadcast --name "<your-unique-resource-name>" --resource-group "myResourceGroup" --hub-name --payload "Hello World"
```

Switch back to the previous CLI command and you can see that the client received message:
```JSON
{"type":"message","from":"server","dataType":"text","data":"Hello World"}
```