---
title: Deploy the Dapr binding for Azure Functions in Azure Container Apps
titleSuffix: "Azure Container Apps"
description: Learn how to use and deploy the Dapr binding for Azure Functions in your Dapr-enabled container apps. 
author: hhunter-ms
ms.author: hannahhunter
ms.reviewer: paulyuk
ms.service: container-apps
ms.topic: how-to 
ms.date: 08/30/2023
ms.custom: devx-track-linux
# Customer Intent: I'm a developer who wants to use the Dapr binding for Azure Functions in my Dapr-enabled container app
---

# Deploy the Dapr binding for Azure Functions in Azure Container Apps

Need blurb for intro.

This guide demonstrates using the Dapr binding for Azure Functions template to deploy a Dapr-enabled container app. 

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

1. Clone the [Dapr binding for Azure Functions repo](https://github.com/Azure/azure-functions-dapr-extension).

   ```azurecli
   git clone https://github.com/Azure/azure-functions-dapr-extension.git
   ```

1. From the root directory, change into the folder holding the template.

   ```azurecli
   cd samples/sample-infra
   ```

## Create resource group

1. Create a resource group for your container app.

   ```azurecli
   az group create --name {resourceGroupName} --location eastasia
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


## Clean up resources

When you're finished with the resources you've deployed, run the following command to remove.

```azurecli
az group delete --name {resourceGroupName}
```

## Next steps