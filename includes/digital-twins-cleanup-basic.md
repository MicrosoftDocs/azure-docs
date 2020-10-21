---
author: baanders
description: include file for cleaning up a basic Azure Digital Twins instance and app registration
ms.service: digital-twins
ms.topic: include
ms.date: 8/13/2020
ms.author: baanders
---

If you no longer need the resources created in this tutorial, follow these steps to delete them.

Using the [Azure Cloud Shell](https://shell.azure.com), you can delete all Azure resources in a resource group with the [az group delete](https://docs.microsoft.com/cli/azure/group?view=azure-cli-latest&preserve-view=true#az-group-delete) command. This removes the resource group and the Azure Digital Twins instance.

> [!IMPORTANT]
> Deleting a resource group is irreversible. The resource group and all the resources contained in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. 

Open an Azure Cloud Shell and run the following command to delete the resource group and everything it contains.

```azurecli
az group delete --name <your-resource-group>
```

Next, delete the Azure Active Directory app registration you created for your client app with this command:

```azurecli
az ad app delete --id <your-application-ID>
```