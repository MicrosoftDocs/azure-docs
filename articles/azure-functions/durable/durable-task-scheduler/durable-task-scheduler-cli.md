---
title: Create the Durable Task Scheduler (preview) using the Azure CLI
description: Learn how to create the Durable Task Scheduler using the CLI.
ms.topic: how-to
ms.date: 01/27/2025
---

# Create the Durable Task Scheduler (preview) using the Azure CLI

TODO 

## Prerequisites
- An Azure subscription. [Don't have one? Create a free account.](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- [The latest version of the Azure CLI.](/cli/azure/install-azure-cli) 

## Set up the CLI

Login to the Azure CLI and make sure you have the latest installed.

```azurecli
az login
az upgrade
```

Install the Durable Task Scheduler CLI extension.

```azurecli
az extension add --name durabletask
```

If you've already installed the Durable Task Scheduler CLI extension, upgrade to the latest version.

```azurecli
az extension add --upgrade --name durabletask
```

## Register the `DurableTask` feature

The `DurableTask` feature needs to be registered to your Azure subscription. Verify you're in the correct subscription:

```azurecli
az account set --subscription <YOUR-AZURE-SUBSCRIPTION-ID>
```

Start by running the following command to register the preview feature.

```azurecli
az feature register --namespace Microsoft.DurableTask
```

Feature registration may take some time. After a few minutes, check the registration status using the following command: 

```azurecli
az feature show --namespace Microsoft.DurableTask 
```

Once the output shows the feature as `"Registered"`, continue to register the resource provider. 

## Register the Durable Task Scheduler resource provider

To use the `DurableTask` resource provider, you need to register it with your subscription. Check the status of the provider registration using the [az provider list](/cli/azure/provider#az-provider-list) command, as shown in the following example. 

```azurecli
az provider list --query "[?contains(namespace,'Microsoft.KubernetesConfiguration')]" -o table
```

The `Microsoft.DurableTask` provider should report as `Registered`, as shown in the following example output:

```output
Namespace              RegistrationState    RegistrationPolicy
---------------------  -------------------  --------------------
Microsoft.DurableTask  Registered           RegistrationRequired
```

If the provider shows as `NotRegistered`, register the provider using the [az provider register](/cli/azure/provider#az-provider-register) command:

```azurecli
az provider register --namespace Microsoft.DurableTask
```

Check the registration status of the resource provider.

```azurecli
az provider show --namespace Microsoft.DurableTask 
```

Now that you've registered, you can start creating Durable Task Scheduler and task hubs. 

## Create a Durable Task Scheduler and task hub

Durable Task Scheduler is only available in certain Azure regions. To check available regions, run the following command:

```azurecli
az provider show --namespace Microsoft.DurableTask --query "resourceTypes[?resourceType=='schedulers'].locations | [0]" --out table
```

### Create a resource group

Run the following command to create a resource group in your Azure subscription:

```azurecli
az group create --name YOUR_RESOURCE_GROUP --location LOCATION
```

### Create a scheduler

Use the `az durabletask` CLI to create a scheduler in your resource group.

```azurecli
az durabletask scheduler create --name "YOUR_SCHEDULER" --resource-group "YOUR_RESOURCE_GROUP" --location "LOCATION" --ip-allowlist "[0.0.0.0/0]" --sku-name "dedicated" --sku-capacity "1"
```

The creation process may take up to 15 minutes to complete.

*Output*

```json
{
    "id": "/subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/YOUR_RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/YOUR_SCHEDULER",
    "location": "northcentralus",
    "name": "YOUR_SCHEDULER",
    "properties": {
        "endpoint": "https://YOUR_SCHEDULER.northcentralus.durabletask.io",
        "ipAllowlist": [
            "0.0.0.0/0"
        ],
        "provisioningState": "Succeeded",
        "sku": {
            "capacity": 1,
            "name": "Dedicated",
            "redundancyState": "None"
        }
    },
    "resourceGroup": "YOUR_RESOURCE_GROUP",
    "systemData": {
        "createdAt": "2025-01-06T21:22:59Z",
        "createdBy": "YOUR_EMAIL@microsoft.com",
        "createdByType": "User",
        "lastModifiedAt": "2025-01-06T21:22:59Z",
        "lastModifiedBy": "YOUR_EMAIL@microsoft.com",
        "lastModifiedByType": "User"
    },
    "tags": {}
}
```

### Create a task hub

Use `az durabletask` to create a task hub in the scheduler you created.

```azurecli
az durabletask taskhub create --resource-group YOUR_RESOURCE_GROUP --scheduler-name YOUR_SCHEDULER --name YOUR_TASKHUB
```

*Output*

```json
{
  "id": "/subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/YOUR_RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/YOUR_SCHEDULERS/taskHubs/YOUR_TASKHUB",
  "name": "YOUR_TASKHUB",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "resourceGroup": "YOUR_RESOURCE_GROUP",
  "systemData": {
    "createdAt": "2024-09-18T22:13:56.5467094Z",
    "createdBy": "OBJECT_ID",
    "createdByType": "User",
    "lastModifiedAt": "2024-09-18T22:13:56.5467094Z",
    "lastModifiedBy": "OBJECT_ID",
    "lastModifiedByType": "User"
  },
  "type": "microsoft.durabletask/scheduler/taskhubs"
}
```


## Next steps

[Configure Durable Task Scheduler for an existing Function app](./configure-durable-task-scheduler.md)

## Related links

- Durable Functions
  - If you're looking to configure existing Durable Functions app to use Durable Task Scheduler, see tutorial.
  - If you're starting from scratch, check out [Durable Functions quickstart sample](quickstart-durable-task-scheduler.md)
  - Did you know that you can host your Durable Functions app inside an Azure Container Apps environment? See tutorial.
- Durable Task Framework
  - Your Durable Task Framework app can also configure the Durable Task Scheduler as its backend. See quickstart sample.