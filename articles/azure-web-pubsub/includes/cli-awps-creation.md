---
author: vicancy
ms.service: azure-web-pubsub
ms.topic: include
ms.date: 08/06/2021
ms.author: lianwei
---

Use the Azure CLI [az webpubsub create](/cli/azure/webpubsub#az-webpubsub-create) command to create a Web PubSub in the resource group from the previous step, providing the following information:

- Resource name: A string of 3 to 24 characters that can contain only numbers (0-9), letters (a-z, A-Z), and hyphens (-)

  > [!Important]
  > Each Web PubSub resource must have a unique name. Replace &lt;your-unique-resource-name&gt; with the name of your Web PubSub in the following examples.

- Resource group name: **myResourceGroup**.
- The location: **EastUS**.
- Sku: **Free_F1**

```azurecli-interactive
az webpubsub create --name "<your-unique-resource-name>" --resource-group "myResourceGroup" --location "EastUS" --sku Free_F1
```

The output of this command shows properties of the newly created resource. Take note of the two properties listed below:

- **Resource Name**: The name you provided to the `--name` parameter above.
- **hostName**: In the example, the host name is `<your-unique-resource-name>.webpubsub.azure.com/`.

At this point, your Azure account is the only one authorized to perform any operations on this new resource.
