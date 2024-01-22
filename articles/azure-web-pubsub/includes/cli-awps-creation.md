---
author: vicancy
ms.service: azure-web-pubsub
ms.topic: include
ms.date: 10/11/2022
ms.author: lianwei
---

Run [az extension add](/cli/azure/extension#az-extension-add) to install or upgrade the *webpubsub* extension to the current version.

```azurecli-interactive
az extension add --upgrade --name webpubsub
```

Use the Azure CLI [az webpubsub create](/cli/azure/webpubsub#az-webpubsub-create) command to create a Web PubSub in the resource group you've created. The following command creates a _Free_ Web PubSub resource under resource group _myResourceGroup_ in _EastUS_:

  > [!Important]
  > Each Web PubSub resource must have a unique name. Replace &lt;your-unique-resource-name&gt; with the name of your Web PubSub in the following examples.

```azurecli
az webpubsub create --name "<your-unique-resource-name>" --resource-group "myResourceGroup" --location "EastUS" --sku Free_F1
```

The output of this command shows properties of the newly created resource. Take note of the two properties listed below:

- **Resource Name**: The name you provided to the `--name` parameter above.
- **hostName**: In the example, the host name is `<your-unique-resource-name>.webpubsub.azure.com/`.

At this point, your Azure account is the only one authorized to perform any operations on this new resource.
