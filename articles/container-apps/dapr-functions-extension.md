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

The [Dapr extension for Azure Functions](../azure-functions/functions-bindings-dapr.md) allows you to easily interact with the Dapr APIs from an Azure Function using triggers and bindings. In this guide, you learn how to use the Dapr extension for Azure Functions using a Bicep template for your container app. 

> [!NOTE]
> The Dapr extension for Azure Functions is currently in preview. 

## Prerequisites

- [An Azure account with an active subscription.](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Install](https://docs.dapr.io/getting-started/install-dapr-cli/) and [init](https://docs.dapr.io/getting-started/install-dapr-selfhost/) Dapr
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Install [Git](https://git-scm.com/downloads)

## Set up the environment

1. In the terminal, log into your Azure subscription. 

   ```azurecli
   az login
   ```

1. Clone the [Dapr extension for Azure Functions repo](https://github.com/Azure/azure-functions-dapr-extension).

   ```azurecli
   git clone https://github.com/Azure/azure-functions-dapr-extension.git
   ```

1. From the root directory, change into the folder holding the template.

   ```azurecli
   cd deploy/aca
   ```

## Create resource group

1. Create a resource group for your container app.

   ```azurecli
   az group create --name {resourceGroupName} --location {region}
   ```


## Deploy the Azure Function templates

1. Create a deployment group and specify the template you'd like to deploy.

   ```azurecli
   az deployment group create --resource-group {resourceGroupName} --template-file deploy-samples.bicep
   ```

1. When prompted by the CLI, enter a resource name prefix. The name you choose must be a combination of numbers and lowercase letters, 3 and 24 characters in length.

   ```
   Please provide string value for 'resourceNamePrefix' (? for help): {your-resource-name-prefix} 
   ```

   Deployment may take a while. In the Azure portal, navigate to your resource group and select **Deployments** to track the deployment status.

   :::image type="content" source="media/dapr-binding-functions/deployment-status.png" alt-text="Screenshot of the expected deployment status in the portal.":::

1. Verify the Dapr components have deployed.

   1. Navigate to your newly deployed container app environment. 
   1. Select **Settings** > **Dapr components** to view the components deployed.

      :::image type="content" source="media/dapr-binding-functions/verify-dapr-components.png" alt-text="Screenshot of the Dapr components deployed to the container app environment.":::

## Check logs

Test the application by invoking a message and checking the console logs. For example, to test the `DaprServiceInvocationTrigger` and `DaprInvokeOutputBinding`:

1. Navigate to your container app environment.
1. In the left side menu, under **Monitoring**, select **Logs**. 
1. Run a query to check the container app console logs to verify your function app is receiving the invoked message from Dapr. 

   :::image type="content" source="media/dapr-binding-functions/check-logs.png" alt-text="Screenshot of the Container Apps Console Logs.":::

## Clean up resources

When you're finished with the resources you've deployed, run the following command to remove.

```azurecli
az group delete --name {resourceGroupName}
```

## Related links

- [Learn more about the Dapr extension for Azure Functions](../azure-functions/functions-bindings-dapr.md)
- [Learn more about connecting Dapr components to your container app](./dapr-component-connection.md)