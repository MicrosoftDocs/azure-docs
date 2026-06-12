---
title: Deploy the Dapr Extension for Azure Functions
titleSuffix: "Azure Container Apps"
description: Learn how to use and deploy the Azure Functions with Dapr extension in your Dapr-enabled container apps.
author: greenie-msft
ms.author: nigreenf
ms.reviewer: hannahhunter
ms.service: azure-container-apps
ms.subservice: dapr
ms.topic: how-to
ms.date: 02/02/2026
ms.custom: references_regions
# Customer Intent: I'm a developer who wants to use the Dapr extension for Azure Functions in my Dapr-enabled container app
---

# Deploy the Dapr extension for Azure Functions in Azure Container Apps

The [Dapr extension for Azure Functions](../azure-functions/functions-bindings-dapr.md) allows you to easily interact with the Dapr APIs from an Azure Function by using triggers and bindings. In this guide, you learn how to:

- Create an Azure Cache for Redis to use as a Dapr state store.
- Deploy an Azure Container Apps environment to host container apps.
- Deploy a Dapr-enabled function on Azure Container Apps:
  - One function that invokes the other service.
  - One function that creates an order and saves it to storage via Dapr state store.
- Verify the interaction between the two apps.

## Prerequisites

- [An Azure account with an active subscription](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn)
- [Install Azure CLI](/cli/azure/install-azure-cli)

## Set up the environment

1. In the terminal, sign in to your Azure account.

   ```azurecli
   az login
   ```

1. Set the active subscription you'd like to use.

   ```azurecli
   az account set --subscription <subscription-id-or-name>
   ```

1. Register the `Microsoft.App` and `Microsoft.OperationalInsights` namespaces.

   ```azurecli
   az provider register --namespace Microsoft.App
   ```

   ```azurecli
   az provider register --namespace Microsoft.OperationalInsights
   ```

1. Clone the [Dapr extension for Azure Functions repo](https://github.com/Azure/azure-functions-dapr-extension).

   ```azurecli
   git clone https://github.com/Azure/azure-functions-dapr-extension.git
   ```

## Create resource group

Specifying one of the available regions, create a resource group for your container app.

   ```azurecli
   az group create --name <resource-group-name> --location <region>
   ```

## Deploy the Azure Function templates

1. Change into the folder holding the template.

   ```azurecli
   cd azure-functions-dapr-extension/quickstarts/dotnet-isolated/deploy/aca
   ```

1. Create a deployment group and specify the template you'd like to deploy.

   ```azurecli
   az deployment group create --resource-group <resource-group-name> --template-file deploy-quickstart.bicep
   ```

1. When prompted by the CLI, enter a resource name prefix. The name you choose must be a combination of numbers and lowercase letters, between 3 and 24 characters in length.

   ```
   Please provide string value for 'resourceNamePrefix' (? for help): <your-resource-name-prefix>
   ```

   The template deploys the following resources and might take a while:

    - A Container App Environment
    - A Function App
    - An Azure Blob Storage Account and a default storage container
    - Application Insights
    - Log Analytics workSpace
    - Dapr Component (Azure Redis Cache) for state management
    - The following .NET Dapr-enabled functions:
       - `OrderService`
       - `CreateNewOrder`
       - `RetrieveOrder`

1. In the Azure portal, navigate to your resource group and select **Deployments** to track the deployment status.

   :::image type="content" source="media/dapr-binding-functions/deployment-status.png" alt-text="Screenshot showing the deployment group deployment status in the Azure portal." lightbox="media/dapr-binding-functions/deployment-status.png":::

## Verify the result

After the template deploys successfully, run the following command to initiate an `OrderService` function that triggers the `CreateNewOrder` process. A new order is created and stored in the Redis state store.

In the command:
- Replace `<quickstart-functionapp-url>` with your actual function app URL. For example: `https://daprext-funcapp.wittyglacier-20884174.eastus.azurecontainerapps.io`.
- Replace `<quickstart-functionapp-name>` with your function app name.

To find your function app URL, navigate to **Container Apps** in the Azure portal, then select your new container app.

# [PowerShell](#tab/powershell)

```powershell
Invoke-RestMethod -Uri 'https://<quickstart-functionapp-url.io>/api/invoke/<quickstart-functionapp-name>/CreateNewOrder' -Method POST -Headers @{"Content-Type" = "application/json"} -Body '{
    "data": {
        "value": {
            "orderId": "Order22"
        }
    }
}'
```

# [Curl](#tab/curl)

```sh
curl --location 'https://<quickstart-functionapp-url.io>/api/invoke/<quickstart-functionapp-name>/CreateNewOrder' \
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

### Using the Azure portal

1. Navigate to your container app environment.

1. In the sidebar menu, under **Monitoring**, select **Logs**.

1. Run a query like the following to verify your function app is receiving the invoked message from Dapr.

   ```
   ContainerAppsConsoleLogs_CL
   | where RevisionName_s == $revision_name
   | where Log_s contains "Order22"
   | project Log_s
   ```

:::image type="content" source="media/dapr-binding-functions/check-console-logs.png" alt-text="Screenshot demonstrating how to run a Console Log query to view the logs." lightbox="media/dapr-binding-functions/check-console-logs.png":::


### Using the Azure CLI

Run the following command to view the saved state.

# [PowerShell](#tab/powershell)

```powershell
Invoke-RestMethod -Uri 'https://<quickstart-functionapp-url.io>/api/retrieveorder' -Method GET
```

# [Curl](#tab/curl)

```sh
curl --location 'https://<quickstart-functionapp-url.io>/api/retrieveorder'
```

---

## Clean up resources

After you finish with this tutorial, run the following command to delete your resource group, along with all the resources you created.

```azurecli
az group delete --resource-group <resource-group-name>
```

## Related links

- [Dapr Extension for Azure Functions](../azure-functions/functions-bindings-dapr.md)
- [Connect to Azure services via Dapr components in the Azure portal](./dapr-component-connection.md)
