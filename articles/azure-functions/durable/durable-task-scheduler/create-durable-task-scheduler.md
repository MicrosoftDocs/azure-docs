---
title: Create the Durable Task Scheduler (preview)
description: Learn how to create the Durable Task Scheduler using the portal and the CLI.
ms.topic: how-to
ms.date: 01/27/2025
---

# Create the Durable Task Scheduler (preview)

TODO 

## Prerequisites
- An Azure subscription. [Don't have one? Create a free account.](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- [The latest version of the Azure CLI.](/cli/azure/install-azure-cli) 

Select how you'd like to install, deploy, and configure the Durable Task Scheduler.

# [CLI](#tab/cli)

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

# [Azure portal](#tab/portal)

You can create Durable Task Scheduler via the two following ways:
1. [Function app integrated creation](#function-app-integrated-creation)  
1. [Top-level creation](#top-level-creation) 

## Function app integrated creation

You can create a Durable Task Scheduler and a task hub as part of the existing Function app creation process in the Azure portal. 

> [!NOTE]
> This experience is only available with Functions hosted in the **App Service** plan. 

### Create a Function app

Navigate to the Function app creation blade and select **App Service** as a hosting option.

:::image type="content" source="media/create-durable-task-scheduler/function-app-hosted-app-service.png" alt-text="Screenshot of hosting options for Function apps and selecting App Service.":::

In the **Create Function App (App Service) blade, [create the function app settings as specified in the Azure Functions documentation](../../functions-create-function-app-portal.md)

:::image type="content" source="media/create-durable-task-scheduler/function-app-basic-tab.png" alt-text="Screenshot of the Basic tab for creating an App Service plan Function app.":::

### Set Durable Task Scheduler as storage backend

After filling out the appropriate fields in the **Basic** and other necessary tabs, select the **Durable Functions** tab. Choose **Durable Task Scheduler** as your storage backend. 

:::image type="content" source="media/create-durable-task-scheduler/durable-func-tab.png" alt-text="Screenshot of creating an App Service plan Function app.":::

> [!NOTE]
> It is recommended that the region chosen for your Durable Task Scheduler matches the region chosen for your Function App. 

### Verify user-managed identity

Durable Task Scheduler supports only identity-based authentication. Once your function app is deployed, a user-managed identity resource with the necessary RBAC permission is automatically created. 

On the **Review + create** tab, you can find information related to the managed identity resource, such as:
- The RBAC assigned to it (*Durable Task Data Contributor*) 
- The scope of the assignment (on the scheduler level):

   :::image type="content" source="media/create-durable-task-scheduler/func-review-create-tab.png" alt-text="Screenshot of fields and properties chosen and in review on the Review + create tab.":::

## Top-level creation  

In the Azure portal, search for **Durable Task Scheduler** and select it from the results. 

:::image type="content" source="media/create-durable-task-scheduler/search-for-dts.png" alt-text="Screenshot of searching for Durable Task Scheduler in the portal.":::

Click **Create** to open the **Azure Functions: Durable Task Scheduler (preview)** pane.

:::image type="content" source="media/create-durable-task-scheduler/top-level-create-form.png" alt-text="Screenshot of the create page for the Durable Task Scheduler.":::

Fill out the fields in the **Basics** tab. Click **Review + create**. Once the validation passes, click **Create**. 

Deployment may take around 15 to 20 minutes. 

### Durable Task Scheduler endpoint and connection string

> [!NOTE] 
> Unlike when creating a Durable Task Scheduler as part of the Function app creation process, you need to manually create a managed identity with the proper RBAC access when following the top-level creation approach. 

Navigate to the **Overview** page of your Durable Task Scheduler resource. 

In the **Essentials** section, make note of the endpoint. 

You use this endpoint to construct the connection string for accessing the resource. The connection string varies depending on what kind of identity you're using, which depends on how you're running your app. 

#### If you're running your app locally 

For local development, the connection string looks like the following: 

`Endpoint=<Your Durable Task Scheduler endpoint>;Authentication=DefaultAzure`

For example, if the Durable Task Scheduler endpoint is `https://my-dts.westus.durabletask.io`, the connection string would be:

`Endpoint=https://my-dts.westus.durabletask.io;Authentication=DefaultAzure`

For local development, you need to give your developer identity the right permission to access the Durable Task Scheduler resource. See [Assign RBAC access to developer identity](./configure-durable-task-scheduler.md). 

#### If you're running your app on Azure

When running on Azure, you need to set up user-assigned managed identity or system-assigned managed identity to access the Durable Task Scheduler resource. See [Run the app on Azure](./configure-durable-task-scheduler.md). 

##### User-assigned managed identity

When using user-assigned managed identity, the connection string looks like the following: 

`Endpoint=<Your Durable Task Scheduler endpoint>;Authentication=ManagedIdentity;ClientID=<Managed identity ID>`

The `ClientID` is the ID of the managed identity resource with the proper RBAC access to the scheduler. 

For example, if the Durable Task Scheduler endpoint is `https://my-dts.westus.durabletask.io`, the connection string would be:

`Endpoint=https://my-dts.westus.durabletask.io;Authentication=ManagedIdentity;ClientID=<MANAGED-IDENTITY-ID>`

##### System-assigned managed identity

If you're using system-assigned managed identity, you can omit the `ClientID` in the connection string: 

`Endpoint=<Your Durable Task Scheduler endpoint>;Authentication=ManagedIdentity`

---

## Next steps

[Configure Durable Task Scheduler for an existing Function app](./configure-durable-task-scheduler.md)

## Related links

- Durable Functions
  - If you're looking to configure existing Durable Functions app to use Durable Task Scheduler, see tutorial.
  - If you're starting from scratch, check out [Durable Functions quickstart sample](quickstart-durable-task-scheduler.md)
  - Did you know that you can host your Durable Functions app inside an Azure Container Apps environment? See tutorial.
- Durable Task Framework
  - Your Durable Task Framework app can also configure the Durable Task Scheduler as its backend. See quickstart sample.