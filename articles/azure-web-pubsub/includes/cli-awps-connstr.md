---
author: vicancy
ms.service: azure-web-pubsub
ms.topic: include
ms.date: 12/10/2024
ms.author: lianwei
---

Use the Azure CLI [az webpubsub key](/cli/azure/webpubsub#az-webpubsub-key) command to get the **ConnectionString** of the service.  Replace the `<your-unique-resource-name>` placeholder with the name of your Azure Web PubSub instance.

```azurecli
az webpubsub key show --resource-group myResourceGroup --name <your-unique-resource-name> --query primaryConnectionString --output tsv
```

Copy the connection string to use later.