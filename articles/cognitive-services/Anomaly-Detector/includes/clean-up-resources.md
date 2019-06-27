---
author: aahill
ms.author: aahi
ms.service: cognitive-services
ms.topic: include
ms.date: 06/20/2019
---

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with the resource group.

* [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../cognitive-services-create-account-cli.md#clean-up-resources)

You can also run the following cloud shell command to remove the resource group and its associated resources. This may take a few minutes to complete. 

```azurecli-interactive
az group delete --name example-anomaly-detector-resource-group
```
