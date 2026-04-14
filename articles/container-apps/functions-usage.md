---
title: Create an Azure Functions app with auto scaling rules on Azure Container Apps
description: Learn to create an Azure Functions app preconfigured with auto scaling rules in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic:  how-to
ms.date: 01/12/2026
ms.author: cshoe
zone_pivot_groups: azure-cli-or-portal
---

# Use Azure Functions in Azure Container Apps

This article shows you how to create an [Azure Functions app in Azure Container Apps](functions-overview.md), complete with preconfigured autoscaling rules.

:::zone pivot="azure-portal"

## Prerequisites

| Resource | Description |
|---|---|
| Azure account | An Azure account with an active subscription.<br><br>If you don't have one, you can [create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn). |
| Azure Storage account | A [blob storage account](/azure/storage/common/storage-account-create?tabs=azure-portal) to store state for your Azure Functions. |
| Azure Application Insights | An instance of [Azure Application Insights](/azure/azure-monitor/app/create-workspace-resource?tabs=portal) to collect data about your container app. |

## Create a Functions app

The following steps show you how to use a sample container image to create your container app. If you want to use this procedure with a custom container image, see [Create your first function app in Azure Container Apps](https://github.com/Azure/azure-functions-on-container-apps/blob/main/README.md#create-your-first-azure-function-on-azure-container-apps).

1. Go to the Azure portal and search for **Container Apps** in the search bar.

1. Select **Container Apps**.

1. Select **Create**.

1. Select **Container App**.

1. In the *Basics* section, enter the following values.

    Under *Project details*:

    | Property | Value |
    |---|---|
    | Subscription | Select your Azure subscription. |
    | Resource group | Select **Create new resource group**, name it **my-aca-functions-group**, and select **OK**.  |
    | Container app name | Enter **my-aca-functions-app**. |

1. Next to *Optimize for Azure Functions*, check the checkbox.

    :::image type="content" source="media/functions-overview/functions-create-container-app.png" alt-text="Screenshot of the Azure portal when you create a container app preconfigured for Azure Functions.":::

1. Under *Container Apps environment*, enter:

    | Property | Value |
    |---|---|
    | Region | Select a region closest to you. |
    | Container Apps environment | Select **Create new environment**. |

1. In the environment setup window, enter:

    | Property | Value |
    |---|---|
    | Environment name | Enter **my-aca-functions-environment** |
    | Zone redundancy | Select **Disabled**. |

1. Select **Create** to save your values.

1. Select **Next: Container** to switch to the *Container* section.

1. Next to *Use quickstart image*, leave this box unchecked.

1. Under the *Container details* section, enter the following values.

    | Property | Value |
    |---|---|
    | Name | This box is prefilled with your selection in the previous section. |
    | Image source | Select **Docker Hub or other registries** |
    | Subscription  | Select your subscription. |
    | Image type | Select **Public**. |
    | Registry login server  | Enter **mcr.microsoft.com** |
    | Image and tag | Enter **k8se/quickstart-functions:latest** |

1. Under *Environment variables*, enter values for the following variables:

    - `AzureWebJobsStorage`
    - `APPINSIGHTS_INSTRUMENTATIONKEY` or `APPLICATIONINSIGHTS_CONNECTION_STRING`

    Enter either managed identity or connection string values for these variables. Use managed identity.

    The `AzureWebJobsStorage` variable is a required Azure Storage account connection string for Azure Functions. This storage account stores function execution logs, manages triggers and bindings, and maintains state for durable functions.

    Application Insights is a monitoring and diagnostic service that provides insights into the performance and usage of your Azure Functions. This monitoring helps you track request rates, response times, failure rates, and other metrics.

1. Select **Next > Ingress** to switch to the Ingress section and enter the following values.

    | Property | Value |
    |---|---|
    | Ingress | Select the **Enabled** checkbox to enable ingress. |
    | Ingress traffic | Select **Accepting traffic from anywhere**. |
    | Ingress type | Select **HTTP**. |
    | Target port | Enter **80**. |

1. Select **Review + Create**.

1. Select **Create**.

1. Once the deployment is complete, select **Go to resource**.

1. From the *Overview* page, select the link next to *Application URL* to open the application in a new browser tab.

1. Append `/api/HttpExample` to the end of the URL.

    A message stating "HTTP trigger function processed a request" is returned in the browser.

:::zone-end

:::zone pivot="azure-cli"

## Prerequisites

- An Azure account with an active subscription.
  - If you don't have an Azure account, you can [create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- The [Azure CLI](/cli/azure/install-azure-cli) installed.

## Create a Functions app

To sign in to Azure from the CLI, run the following command and follow the prompts to complete the authentication process.

1. Sign in to Azure.

    ```azurecli
    az login
    ```

1. To ensure you're running the latest version of the CLI, run the upgrade command.

    ```azurecli
    az upgrade
    ```

1. Install or update the Azure Container Apps extension for the CLI.

    If you receive errors about missing parameters when you run `az containerapp` commands in Azure CLI or cmdlets from the `Az.App` module in PowerShell, make sure you have the latest version of the Azure Container Apps extension installed.

    ```azurecli
    az extension add --name containerapp --allow-preview true --upgrade

    
    ```

    Now that the current extension or module is installed, register the `Microsoft.App` and `Microsoft.OperationalInsights` namespaces.

    ```azurecli
    az provider register --namespace Microsoft.App
    ```

    ```azurecli
    az provider register --namespace Microsoft.OperationalInsights
    ```

1. Create environment variables.

    ```bash
    RESOURCE_GROUP_NAME="my-aca-functions-group"
    CONTAINER_APP_NAME="my-aca-functions-app"
    ENVIRONMENT_NAME="my-aca-functions-environment"
    LOCATION="westus"
    STORAGE_ACCOUNT_NAME="storage-account-name"
    STORAGE_ACCOUNT_SKU="storage-account-sku"
    APPLICATION_INSIGHTS_NAME="application-insights-name"
    ```

1. Create a resource group.

    ```azurecli
    az group create \
      --name $RESOURCE_GROUP_NAME \
      --location $LOCATION \
      --output none
    ```

1. Create the Container Apps environment.

    ```azurecli
    az containerapp env create \
        --name $ENVIRONMENT_NAME \
        --resource-group $RESOURCE_GROUP_NAME \
        --location $LOCATION \
        --output none
    ```

1. Create the Storage Account

    ```azurecli
    az storage account create \
      --name $STORAGE_ACCOUNT_NAME \
      --resource-group $RESOURCE_GROUP \
      --location $LOCATION \
      --sku $STORAGE_ACCOUNT_SKU
    ```

1. Acquire Storage Account Connection String

    ```azurecli
    $STORAGE_ACCOUNT_CONNECTION_STRING = az storage account show-connection-string \
      --name $STORAGE_ACCOUNT_NAME \
      --resource-group $RESOURCE_GROUP \
      --query connectionString \
      --output tsv
    ```

1. Create Azure Applications Insights

    ```azurecli
    az monitor app-insights component create \
    --app $APPLICATION_INSIGHTS_NAME \
    --location $LOCATION \
      --resource-group $RESOURCE_GROUP \
      --application-type web
    ```

1. Acquire application Insights Connection string

    ```azurecli
    $APPLICATION_INSIGHTS_CONNECTION_STRING = az monitor app-insights component show \
      --app $APPLICATION_INSIGHTS_NAME \
      --resource-group $RESOURCE_GROUP \
      --query connectionString \
      --output tsv
    ```

1. Create an Azure Functions container app.

    ```azurecli
    az containerapp create \
      --resource-group $RESOURCE_GROUP_NAME \
      --name $CONTAINER_APP_NAME \
      --environment $ENVIRONMENT_NAME \
      --image mcr.microsoft.com/azure-functions/dotnet8-quickstart-demo:1.0 \
      --ingress external \
      --target-port 80 \
      --kind functionapp \
      --query properties.outputs.fqdn
    ```

    This command returns the URL of your Functions app. Copy this URL and paste it into a web browser.

1. Create an Azure Functions container app with `--revisions-mode multiple` for multirevision scenario

    ```azurecli
    az containerapp create \
      --name $CONTAINERAPP_NAME \
      --resource-group $RESOURCE_GROUP \
      --environment $CONTAINERAPPS_ENVIRONMENT \
      --image mcr.microsoft.com/azure-functions/dotnet8-quickstart-demo:1.0 \
      --target-port 80 \
      --ingress external \
      --kind functionapp \
      --workload-profile-name $WORKLOAD_PROFILE_NAME \
      --env-vars AzureWebJobsStorage="$STORAGE_ACCOUNT_CONNECTION_STRING" APPLICATIONINSIGHTS_CONNECTION_STRING="$APPLICATION_INSIGHTS_CONNECTION_STRING"
    ```

1. For multirevision scenario, upgrade the containerapp and split traffic

    ```azurecli
    az containerapp update \
      --resource-group $RESOURCE_GROUP \
      --name $CONTAINERAPP_NAME \
      --image mcr.microsoft.com/azure-functions/dotnet8-quickstart-demo:latest

    az containerapp ingress traffic set -resource-group \
      --name $CONTAINERAPP_NAME \
      --resource-group $RESOURCE_GROUP \
      --revision-weight {revision1_name}=50 \
      --revision-weight {revision2_name}=50
    ```

1. Append `/api/HttpExample` to the end of the URL.

    A message stating "HTTP trigger function processed a request" is returned in the browser.

:::zone-end

## Related content

- [Azure Functions on Azure Container Apps overview](../../articles/container-apps/functions-overview.md)
