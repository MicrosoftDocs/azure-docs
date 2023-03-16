---
author: vicancy
ms.service: azure-web-pubsub
ms.topic: include
ms.date: 08/06/2021
ms.author: lianwei
---

> [!IMPORTANT]
> A connection string includes the authorization information required for your application to access Azure Web PubSub service. The access key inside the connection string is similar to a root password for your service. In production environments, always be careful to protect your access keys. Use Azure Key Vault to manage and rotate your keys securely. Avoid distributing access keys to other users, hard-coding them, or saving them anywhere in plain text that is accessible to others. Rotate your keys if you believe they may have been compromised.

Use the Azure CLI [az webpubsub key](/cli/azure/webpubsub#az-webpubsub-key) command to get the **ConnectionString** of the service.  Replace the `<your-unique-resource-name>` placeholder with the name of your Azure Web PubSub instance.

```azurecli
az webpubsub key show --resource-group myResourceGroup --name <your-unique-resource-name> --query primaryConnectionString --output tsv
```

Copy the connection string to use later.