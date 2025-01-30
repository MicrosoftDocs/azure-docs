---
title: Manage the Durable Task Scheduler (preview)
description: Learn how to manage the Durable Task Scheduler and task hub resources
ms.topic: how-to
ms.date: 01/29/2025
---

# Manage the Durable Task Scheduler (preview)

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

You can create a scheduler and a task hub using either the Azure CLI or the Azure portal. 

# [Azure CLI](#tab/cli)

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

# [Azure portal](#tab/portal)

You can create Durable Task Scheduler and task hub via the two following ways:
1. [Function app integrated creation](#function-app-integrated-creation)  
1. [Top-level creation](#top-level-creation) 

### Function app integrated creation

You can create a Durable Task Scheduler and a task hub as part of the existing Function app creation process in the Azure portal. 

> [!NOTE]
> This experience is only available with Functions hosted in the **App Service** plan. 

#### Create a Function app

Navigate to the Function app creation blade and select **App Service** as a hosting option.

:::image type="content" source="media/create-durable-task-scheduler/function-app-hosted-app-service.png" alt-text="Screenshot of hosting options for Function apps and selecting App Service.":::

In the **Create Function App (App Service)** blade, [create the function app settings as specified in the Azure Functions documentation](../../functions-create-function-app-portal.md)

:::image type="content" source="media/create-durable-task-scheduler/function-app-basic-tab.png" alt-text="Screenshot of the Basic tab for creating an App Service plan Function app.":::

#### Set Durable Task Scheduler as storage backend

After filling out the appropriate fields in the **Basic** and other necessary tabs, select the **Durable Functions** tab. Choose **Durable Task Scheduler** as your storage backend. 

:::image type="content" source="media/create-durable-task-scheduler/durable-func-tab.png" alt-text="Screenshot of creating an App Service plan Function app.":::

> [!NOTE]
> It is recommended that the region chosen for your Durable Task Scheduler matches the region chosen for your Function App. 

#### Verify user-managed identity

Durable Task Scheduler supports only identity-based authentication. Once your function app is deployed, a user-managed identity resource with the necessary RBAC permission is automatically created. 

On the **Review + create** tab, you can find information related to the managed identity resource, such as:
- The RBAC assigned to it (*Durable Task Data Contributor*) 
- The scope of the assignment (on the scheduler level):

   :::image type="content" source="media/create-durable-task-scheduler/func-review-create-tab.png" alt-text="Screenshot of fields and properties chosen and in review on the Review + create tab.":::

### Top-level creation  

In the Azure portal, search for **Durable Task Scheduler** and select it from the results. 

:::image type="content" source="media/create-durable-task-scheduler/search-for-dts.png" alt-text="Screenshot of searching for Durable Task Scheduler in the portal.":::

Click **Create** to open the **Azure Functions: Durable Task Scheduler (preview)** pane.

:::image type="content" source="media/create-durable-task-scheduler/top-level-create-form.png" alt-text="Screenshot of the create page for the Durable Task Scheduler.":::

Fill out the fields in the **Basics** tab. Click **Review + create**. Once the validation passes, click **Create**. 

Deployment may take around 15 to 20 minutes. 

---

## View all Durable Task Scheduler resources in a subscription

# [Azure CLI](#tab/cli)

Get a list of all Durable Task Scheduler names within a subscription by running:

```azurecli
  az durabletask scheduler list --subscription <SUBSCRIPTION_ID>
```

You can narrow results down to a specific resource group by adding the `--resource-group` flag.

```azurecli
  az durabletask scheduler list --subscription <SUBSCRIPTION_ID> --resource-group <RESOURCE_GROUP_NAME>
```


# [Azure portal](#tab/portal)


---

## View all task hubs in a Durable Task Scheduler

# [Azure CLI](#tab/cli)

Retrieve a list of task hubs in a specific Durable Task Scheduler by running: 

```azurecli
  az durabletask taskhub list --resource-group <RESOURCE_GROUP_NAME> --scheduler-name <SCHEDULER_NAME>
```

# [Azure portal](#tab/portal)


---

## Provide access to a Durable Task Scheduler and task hub

# [Azure CLI](#tab/cli)

[!INCLUDE [assign-rbac-cli](./includes/assign-rbac-cli.md)]

# [Azure portal](#tab/portal)

[!INCLUDE [assign-rbac-portal](./includes/assign-rbac-portal.md)]

---

## Delete a Durable Task Scheduler and task hub

# [Azure CLI](#tab/cli)

Remove the task hub you created using the `az durabletask` command.

```azurecli
az durabletask taskhub delete --resource-group YOUR_RESOURCE_GROUP --scheduler-name YOUR_SCHEDULER --name YOUR_TASKHUB
```

Delete the scheduler that housed that task hub.

```azurecli
az durabletask scheduler --resource-group YOUR_RESOURCE_GROUP --scheduler-name YOUR_SCHEDULER
```

# [Azure portal](#tab/portal)


---

## Next steps

- [Configure Durable Task Scheduler for an existing Function app](./configure-durable-task-scheduler.md)
- Try out the [Durable Functions quickstart sample](quickstart-durable-task-scheduler.md)
- [Host your Durable Functions app inside an Azure Container Apps environment](./durable-task-scheduler-hosted-on-container-apps.md)