---
title: Deploy the Dapr extension for Azure Functions in Azure Container Apps
titleSuffix: "Azure Container Apps"
description: Learn how to use and deploy the Azure Functions with Dapr extension in your Dapr-enabled container apps.  
author: hhunter-ms
ms.author: hannahhunter
ms.reviewer: paulyuk
ms.service: container-apps
ms.topic: how-to 
ms.date: 09/19/2023
ms.custom: devx-track-linux
# Customer Intent: I'm a developer who wants to use the Dapr extension for Azure Functions in my Dapr-enabled container app
---

# Deploy the Dapr extension for Azure Functions in Azure Container Apps

The [Dapr extension for Azure Functions](../azure-functions/functions-bindings-dapr.md) allows you to easily interact with the Dapr APIs from an Azure Function using triggers and bindings. In this guide, you learn how to:

- Create an Azure Redis Cache for use as a Dapr statestore
- Deploy an Azure Container Apps environment to host container apps
- Deploy a Dapr-enabled function on Azure Container Apps:
  - One function that invokes the other service 
  - One function that creates an Order and saves it to storage via Dapr statestore
- Verify the interaction between the two apps 

> [!NOTE]
> The Dapr extension for Azure Functions is currently in preview. 

## Prerequisites

- [An Azure account with an active subscription.](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Install Azure CLI](/cli/azure/install-azure-cli)

## Set up the environment

1. In the terminal, log into your Azure subscription. 

   ```azurecli
   az login
   ```

1. Set up your Azure login with the active subscription you'd like to use.

   ```azurecli
   az account set --subscription <subscription-id-or-name>
   ```

1. Clone the [Dapr extension for Azure Functions repo](https://github.com/Azure/azure-functions-dapr-extension).

   ```azurecli
   git clone https://github.com/Azure/azure-functions-dapr-extension.git
   ```

## Create resource group

> [!NOTE]
> Azure Container Apps support for Functions is currently in preview and available in the following regions. 
> - Australia East
> - Central US
> - East US
> - East US 2
> - North Europe
> - South Central US
> - UK South
> - West Europe
> - West US 3

Specifying one of the available regions, create a resource group for your container app.

   ```azurecli
   az group create --name {resourceGroupName} --location {region}
   ```

## Deploy the Azure Function templates

1. From the root directory, change into the folder holding the template.

   ```azurecli
   cd quickstarts/dotnet-isolated/deploy/aca
   ```

1. Create a deployment group and specify the template you'd like to deploy.

   ```azurecli
   az deployment group create --resource-group {resourceGroupName} --template-file deploy-quickstart.bicep
   ```

1. When prompted by the CLI, enter a resource name prefix. The name you choose must be a combination of numbers and lowercase letters, 3 and 24 characters in length.

   ```
   Please provide string value for 'resourceNamePrefix' (? for help): {your-resource-name-prefix} 
   ```

   The template deploys the following resources and may take a while:

    - A Container App Environment
    - A Function App
    - An Azure Blob Storage Account and a default storage container
    - Application Insights
    - Log Analytics WorkSpace
    - Dapr Component (Azure Redis Cache) for State Management
    - The following .NET Dapr-enabled Functions: 
       - `OrderService`
       - `CreateNewOrder`
       - `RetrieveOrder`

1. In the Azure portal, navigate to your resource group and select **Deployments** to track the deployment status.

   :::image type="content" source="media/dapr-binding-functions/deployment-status.png" alt-text="Screenshot showing the deployment group deployment status in the Azure portal.":::


## Verify the result

Once the template has deployed successfully, run the following command to initiate an `OrderService` function that triggers the `CreateNewOrder` process. A new order is created and stored in the Redis statestore.

In the command:
- Replace `{quickstart-functionapp-url}` with your actual function app URL. For example: `https://daprext-funcapp.wittyglacier-20884174.eastus.azurecontainerapps.io`.
- Replace `{quickstart-functionapp-name}` with your function app name.

# [PowerShell](#tab/powershell)

```powershell
Invoke-RestMethod -Uri 'https://{quickstart-functionapp-url.io}/api/invoke/{quickstart-functionapp-name}/CreateNewOrder' -Method POST -Headers @{"Content-Type" = "application/json"} -Body '{
    "data": {
        "value": {
            "orderId": "Order22"
        }
    }
}'
```

# [Curl](#tab/curl)

```sh
curl --location 'https://{quickstart-functionapp-url.io}/api/invoke/{quickstart-functionapp-name}/CreateNewOrder' \
--header 'Content-Type: application/json' \
--data '{
    "data": {
        "value": {
            "orderId": "Order22"
        }
    }
}'
```

---

## View logs

Data logged via a function app is stored in the `ContainerAppConsoleLogs_CL` custom table in the Log Analytics workspace. Wait a few minutes for the analytics to arrive for the first time before you query the logged data.

You can view logs through the Azure portal or from the command line.

### Via the Azure portal

1. Navigate to your container app environment.

1. In the left side menu, under **Monitoring**, select **Logs**.

1. Run a query like the following to verify your function app is receiving the invoked message from Dapr.

   ```
   ContainerAppsConsoleLogs_CL
   | where RevisionName_s == $revision_name
   | where Log_s contains "Order22"
   | project Log_s
   ```

:::image type="content" source="media/dapr-binding-functions/check-console-logs.png" alt-text="Screenshot demonstrating how to run a Console Log query to view the logs.":::


### Via the Azure CLI

Run the following command to view the saved state.

# [PowerShell](#tab/powershell)

```powershell
Invoke-RestMethod -Uri 'https://{quickstart-functionapp-url.io}/api/retrieveorder' -Method GET
```

# [Curl](#tab/curl)

```sh
curl --location 'https://{quickstart-functionapp-url.io}/api/retrieveorder'
```

---

## Clean up resources

Once you're finished with this tutorial, run the following command to delete your resource group, along with all the resources you created.

```
az group delete --resource-group $RESOURCE_GROUP
```

## Related links

- [Learn more about the Dapr extension for Azure Functions](../azure-functions/functions-bindings-dapr.md)
- [Learn more about connecting Dapr components to your container app](./dapr-component-connection.md)