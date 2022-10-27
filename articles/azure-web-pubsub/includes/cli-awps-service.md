---
author: vicancy
ms.service: azure-web-pubsub
ms.topic: include
ms.date: 08/06/2021
ms.author: lianwei
---

### Publish messages and manage the clients

Azure CLI also provides [az webpubsub service](/cli/azure/webpubsub/service) commands to manage the client connections.

Open **another** CLI command, and you can broadcast messages to the clients:

- Hub name: **myHub1**.
- Resource group name: **myResourceGroup**.

```azurecli-interactive
az webpubsub service broadcast --name "<your-unique-resource-name>" --resource-group "myResourceGroup" --hub-name "myHub1" --payload "Hello World"
```

Switch back to the previous CLI command and you can see that the client received message:
```JSON
{"type":"message","from":"server","dataType":"text","data":"Hello World"}
```

You can also list all the available commands using `--help` option and play with the listed commands.

```azurecli-interactive
az webpubsub service --help
```
