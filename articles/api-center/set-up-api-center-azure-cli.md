---
title: Quickstart - Create your Azure API center - Azure CLI
description: In this quickstart, use the Azure CLI to set up an API center for API discovery, reuse, and governance. 
author: dlepow
ms.service: api-center
ms.topic: quickstart
ms.date: 04/19/2024
ms.author: danlep 
---

# Quickstart: Create your API center - Azure CLI

[!INCLUDE [quickstart-intro](includes/quickstart-intro.md)]

[!INCLUDE [quickstart-prerequisites](includes/quickstart-prerequisites.md)]

* For Azure CLI:
    [!INCLUDE [include](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

    [!INCLUDE [install-apic-extension](includes/install-apic-extension.md)]

## Register the Microsoft.ApiCenter provider

If you haven't already, you need to register the **Microsoft.ApiCenter** resource provider in your subscription. You only need to register the resource provider once. 

To register the resource provider in your subscription using the Azure CLI, run the following [`az provider register`](/cli/azure/provider#az-provider-register) command:

```azurecli-interactive
az provider register --namespace Microsoft.ApiCenter
```

You can check the registration status by running the following [`az provider show`](/cli/azure/provider#az-provider-show) command:

```azurecli-interactive        
az provider show --namespace Microsoft.ApiCenter
```

## Create a resource group

Azure API Center instances, like all Azure resources, must be deployed into a resource group. Resource groups let you organize and manage related Azure resources.

Create a resource group using the [`az group create`](/cli/azure/group#az-group-create) command. The following example creates a group called *MyGroup* in the *East US* location:

```azurecli-interactive
az group create --name MyGroup --location eastus
```

## Create an API center

Create an API center using the [`az apic service create`](/cli/azure/apic/service#az-apic-service-create) command. 

The following example creates an API center called *MyApiCenter* in the *MyGroup* resource group. In this example, the API center is deployed in the *West Europe* location. Substitute an API center name of your choice and enter one of the [available locations](overview.md#available-regions) for your API center.

```azurecli-interactive
az apic service create --name MyApiCenter --resource-group MyGroup --location westeurope
```

Output from the command looks similar to the following. By default, the API center is created in the Free plan.

```json
{
  "dataApiHostname": "myapicenter.data.westeurope.azure-apicenter.ms",
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/mygroup/providers/Microsoft.ApiCenter/services/myapicenter",
  "location": "westeurope",
  "name": "myapicenter",
  "resourceGroup": "mygroup",
  "systemData": {
    "createdAt": "2024-04-22T21:40:35.2541624Z",
    "lastModifiedAt": "2024-04-22T21:40:35.2541624Z"
  },
  "tags": {},
  "type": "Microsoft.ApiCenter/services"
}
```

After deployment, your API center is ready to use!

[!INCLUDE [quickstart-next-steps](includes/quickstart-next-steps.md)]
