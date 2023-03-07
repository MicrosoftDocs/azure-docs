---
title: Quickstart - Provision an Azure Spring Apps Standard consumption plan service
description: Learn how to create a Standard consumption plan in Azure Spring Apps for app deployment.
author: karlerickson
ms.author: xuycao
ms.service: spring-apps
ms.topic: quickstart
ms.date: 02/27/2023
ms.custom: devx-track-java
---

# Quickstart: Provision an Azure Spring Apps Standard Consumption plan service instance

**This article applies to:** ✔️Standard consumption (Preview) ✔️Basic/Standard ✔️Enterprise

This article describes how to create a Standard consumption plan in Azure Spring Apps for application deployment.

## Standard consumption plan procedures

You can use either the Azure portal or the Azure CLI to create a Standard consumption plan.

### [Azure portal](#tab/Azure-portal)

The following procedure creates an instance of Azure Spring Apps using the Azure portal.

1. Open the [Azure portal](https://portal.azure.com/).

1. In the search box, search for *Azure Spring Apps*, and then select  **Azure Spring Apps** from the results.

   :::image type="content" source="media/quickstart-provision-service-instance/spring-apps-start.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps service highlighted in the search results." lightbox="media/quickstart-provision-service-instance/spring-apps-start.png":::

1. On the Azure Spring Apps page, select **Create**.

   :::image type="content" source="media/quickstart-provision-service-instance/spring-apps-create.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps resource with Create button highlighted.":::

1. Fill out the **Basics** form on the Azure Spring Apps **Create** page using the following guidelines:

   - **Project Details**

     - **Subscription**: Select the subscription you want to be billed for this resource.
     - **Resource group**: Select an existing resource group or create a new one.

   - **Service Details**

     - **Name**: Create the name for the Azure Spring Apps service instance. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.
     - **Location**: Currently, only the following regions are supported: Australia East, Central US, East US, East US 2, West Europe, East Asia, North Europe, South Central US, UK South, West US 3.
   - **Plan**: Select **Standard Consumption** for the **Pricing tier** option.

   - **App Environment**

     - Select **Create new** to create a new Azure Container Apps Environment or select an existing environment from the dropdown menu.

     :::image type="content" source="media/quickstart-provision-stardard-consumption-plan-service-instance/select-app-environment.png" alt-text="Screenshot of Azure portal showing the Azure Spring Apps Create page." lightbox="media/quickstart-provision-stardard-consumption-plan-service-instance/select-app-environment.png":::

1. Fill out the **Basics** form on the **Create Container Apps Environment** page, use the default value `asa-standard-consumption-app-env` for the **Environment name** and set **Zone redundancy** to **Enabled**.

     :::image type="content" source="media/quickstart-provision-stardard-consumption-plan-service-instance/create-app-env.png" alt-text="Screenshot of Azure portal showing Create App Environment blade.":::

1. Select **Review and create**.

1. On the Azure Spring Apps **Create** page, select **Review and Create** to finish creating the Azure Spring Apps instance.

>[!NOTE]
> Optionally, you can also [create an App Environment with your own virtual network](./how-to-create-app-environment-with-existing-virtual-network.md).

### [Azure CLI](#tab/Azure-CLI)

The following procedure creates an instance of Azure Spring Apps using the Azure CLI.

## Prerequisites

- Install the [Azure CLI](/cli/azure/install-azure-cli) version 2.28.0 or higher.

## Step 1: Create an Azure Container Apps Environment

An Azure Container Apps Environment creates a secure boundary around a group of applications. Apps deployed to the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace.

You can create the Azure Container Apps Environment in one of two ways:

- Using your own virtual network. For more information see [Create an App Environment with your own virtual network](./how-to-create-app-environment-with-existing-virtual-network.md).

- Using a system assigned virtual network as described in the following procedure.

1. Sign in to Azure.

   ```azurecli
   az login
   ```

1. Install the Azure Container Apps extension for the Azure CLI.

   ```azurecli
   az extension add --name containerapp --upgrade
   ```

1. Register the `Microsoft.App` namespace.

   ```azurecli
   az provider register --namespace Microsoft.App
   ```

1. If you have not previously used the Azure Monitor Log Analytics workspace, register the `Microsoft.OperationalInsights` provider.

   ```azurecli
   az provider register --namespace Microsoft.OperationalInsights
   ```

1. Set the following environment variables.

   ```bash
    RESOURCE_GROUP = "<resource-group-name>"
    LOCATION = "eastus"
    MANAGED_ENVIRONMENT = "<azure-container-apps-environment-name>"
   ```

1. Create the environment with the following command.

   ```azurecli
    az containerapp env create \
    --name $MANAGED_ENVIRONMENT \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION
   ```

## Step 2: Deploy an Azure Spring Apps instance

1. Install the latest `spring` extension for Azure Spring Apps.

   ```azurecli
    az extension remove -n spring && \
    az extension add -n spring
   ```

1. Register the `Microsoft.AppPlatform` provider for the Azure Spring Apps.

   ```azurecli
   az provider register --namespace Microsoft.AppPlatform
   ```

1. Set the following environment variables.

   ```bash
    RESOURCE_GROUP = "<resource-group-name>"
    SPRING_APPS_NAME = "<azure-spring-apps-instance-name>"
    MANAGED_ENVIRONMENT = "<azure-container-apps-environment-name>"
    LOCATION = "eastus"
   ```

   ```azurecli
    MANAGED_ENV_RESOURCE_ID = $(az containerapp env show \
        --name $AZURE_CONTAINER_APPS_ENVIRONMENT_NAME" \
        --resource-group $RESOURCE_GROUP \
        --query id -o tsv)
   ```

1. Deploy a Standard Consumption plan for an Azure Spring Apps instance on top of the container Environment. Create your Azure Spring Apps instance by specifying the resource  of the Azure Container Apps Environment you just created.

   ```azurecli
    az spring create \
        --resource-group $RESOURCE_GROUP \
        --name $SPRING_APPS_NAME \
        --managed-environment $MANAGED_ENV_RESOURCE_ID \
        --sku StandardGen2 \
        --location $LOCATION
   ```

1. After the deployment, an additional infrastructure resource group will be created in your subscription to host the underlying resources for the Standard consumption plan Azure Spring Apps instance. The resource group will be named as `{MANAGED_ENVIRONMENT}_SpringApps_{SPRING_APPS_SERVICE_ID}`.

   ```azurecli
    SERVICE_ID=$(az spring show \
        --resource-group $RESOURCE_GROUP \
        --name $SPRING_APPS_NAME --query properties.serviceId -o tsv)
    INFRA_RESOURCE_GROUP=${MANAGED_ENVIRONMENT}_SpringApps_${SERVICE_ID}
    echo ${INFRA_RESOURCE_GROUP}
   ```

---

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the resources in the resource group. To delete the resource group by using Azure CLI, use the following commands:

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Next steps
