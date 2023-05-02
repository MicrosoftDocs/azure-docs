---
title: Quickstart - Provision an Azure Spring Apps Standard consumption plan service instance
description: Learn how to create a Standard consumption plan in Azure Spring Apps for app deployment.
author: karlerickson
ms.author: xuycao
ms.service: spring-apps
ms.topic: quickstart
ms.date: 03/21/2023
ms.custom: devx-track-java
---

# Quickstart: Provision an Azure Spring Apps Standard consumption plan service instance

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Standard consumption (Preview) ❌ Basic/Standard ❌ Enterprise

This article describes how to create a Standard consumption plan in Azure Spring Apps for application deployment.

## Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- (Optional) [Azure CLI](/cli/azure/install-azure-cli) version 2.45.0 or higher.

## Provision a Standard consumption plan instance

You can use either the Azure portal or the Azure CLI to create a Standard consumption plan.

### [Azure portal](#tab/Azure-portal)

Use the following steps to create an instance of Azure Spring Apps using the Azure portal.

1. Open the [Azure portal](https://portal.azure.com/).

1. In the search box, search for *Azure Spring Apps*, and then select **Azure Spring Apps** from the results.

   :::image type="content" source="media/quickstart-provision-standard-consumption-service-instance/azure-spring-apps-start.png" alt-text="Screenshot of the Azure portal showing the Azure Spring Apps service highlighted in the search results." lightbox="media/quickstart-provision-standard-consumption-service-instance/azure-spring-apps-start.png":::

1. On the Azure Spring Apps page, select **Create**.

   :::image type="content" source="media/quickstart-provision-standard-consumption-service-instance/azure-spring-apps-create.png" alt-text="Screenshot of the Azure portal showing the Azure Spring Apps resource with the Create button highlighted." lightbox="media/quickstart-provision-standard-consumption-service-instance/azure-spring-apps-create.png":::

1. Fill out the **Basics** form on the Azure Spring Apps **Create** page using the following guidelines:

   - **Project Details**

     - **Subscription**: Select the subscription you want to be billed for this resource.
     - **Resource group**: Select an existing resource group or create a new one.

   - **Service Details**

     - **Name**: Create the name for the Azure Spring Apps service instance. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.
     - **Location**: Currently, only the following regions are supported: Australia East, Central US, East US, East US 2, West Europe, East Asia, North Europe, South Central US, UK South, West US 3.
   - **Plan**: Select **Standard Consumption** for the **Pricing tier** option.

   - **App Environment**

     - Select **Create new** to create a new Azure Container Apps environment, or select an existing environment from the dropdown menu.

     :::image type="content" source="media/quickstart-provision-standard-consumption-service-instance/select-azure-container-apps-environment.png" alt-text="Screenshot of the Azure portal showing the Azure Spring Apps Create page." lightbox="media/quickstart-provision-standard-consumption-service-instance/select-azure-container-apps-environment.png":::

1. Fill out the **Basics** form on the **Create Container Apps environment** page. Use the default value `asa-standard-consumption-app-env` for the **Environment name** and set **Zone redundancy** to **Enabled**.

   :::image type="content" source="media/quickstart-provision-standard-consumption-service-instance/create-azure-container-apps-environment.png" alt-text="Screenshot of Azure portal showing Create Container Apps Environment pane." lightbox="media/quickstart-provision-standard-consumption-service-instance/create-azure-container-apps-environment.png":::

1. Select **Review and create**.

1. On the Azure Spring Apps **Create** page, select **Review and Create** to finish creating the Azure Spring Apps instance.

>[!NOTE]
> Optionally, you can also create an Azure Container Apps environment with your own virtual network. For more information, see [Quickstart: Create an Azure Spring Apps instance in an Azure Container Apps environment with a virtual network](quickstart-provision-standard-consumption-app-environment-with-virtual-network.md).

### [Azure CLI](#tab/Azure-CLI)

The following sections show you how to create an instance of Azure Spring Apps using the Azure CLI.

## Create an Azure Container Apps environment

An Azure Container Apps environment creates a secure boundary around a group of applications. Apps deployed to the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace.

You can create the Azure Container Apps environment in one of two ways:

- Using your own virtual network. For more information, see [Quickstart: Create an Azure Spring Apps instance in an Azure Container Apps environment with a virtual network](quickstart-provision-standard-consumption-app-environment-with-virtual-network.md).

- Using a system assigned virtual network, as described in the following procedure.

1. Sign in to Azure by using the following command:

   ```azurecli
   az login
   ```

1. Install the Azure Container Apps extension for the Azure CLI by using the following command:

   ```azurecli
   az extension add --name containerapp --upgrade
   ```

1. Register the `Microsoft.App` namespace by using the following command:

   ```azurecli
   az provider register --namespace Microsoft.App
   ```

1. If you haven't previously used the Azure Monitor Log Analytics workspace, register the `Microsoft.OperationalInsights` provider by using the following command:

   ```azurecli
   az provider register --namespace Microsoft.OperationalInsights
   ```

1. Use the following commands to create variables to store name and location information. Be sure to replace the placeholder values with your own values.

   ```bash
   RESOURCE_GROUP="<resource-group-name>"
   LOCATION="eastus"
   AZURE_CONTAINER_APPS_ENVIRONMENT="<Azure-Container-Apps-environment-name>"
   ```

1. Create the Azure Container Apps environment by using the following command:

   ```azurecli
   az containerapp env create \
       --resource-group $RESOURCE_GROUP \
       --name $AZURE_CONTAINER_APPS_ENVIRONMENT \
       --location $LOCATION
   ```

## Deploy an Azure Spring Apps instance

Use the following steps to deploy the service instance:

1. Install the latest Azure CLI extension for Azure Spring Apps by using the following command:

   ```azurecli
   az extension remove --name spring && \
   az extension add --name spring
   ```

1. Register the `Microsoft.AppPlatform` provider for the Azure Spring Apps by using the following command:

   ```azurecli
   az provider register --namespace Microsoft.AppPlatform
   ```

1. Use the following commands to create variables to store name and location information. You can skip the first three variables if you set them in the previous section. Be sure to replace the placeholder values with your own values.

   ```azurecli
   RESOURCE_GROUP="<resource-group-name>"
   LOCATION="eastus"
   AZURE_CONTAINER_APPS_ENVIRONMENT="<Azure-Container-Apps-environment-name>"

   AZURE_SPRING_APPS_INSTANCE="<Azure-Spring-Apps-instance-name>"
   MANAGED_ENV_RESOURCE_ID=$(az containerapp env show \
       --resource-group $RESOURCE_GROUP \
       --name $AZURE_CONTAINER_APPS_ENVIRONMENT \
       --query id \
       --output tsv)
   ```

1. Use the following command to deploy a Standard consumption plan for an Azure Spring Apps instance on top of the container environment. Create your Azure Spring Apps instance by specifying the resource of the Azure Container Apps environment you created.

   ```azurecli
   az spring create \
       --resource-group $RESOURCE_GROUP \
       --name $AZURE_SPRING_APPS_INSTANCE \
       --managed-environment $MANAGED_ENV_RESOURCE_ID \
       --sku StandardGen2 \
       --location $LOCATION
   ```

1. After the deployment, an infrastructure resource group is created in your subscription to host the underlying resources for the Azure Spring Apps Standard consumption plan instance. The resource group is named `{AZURE_CONTAINER_APPS_ENVIRONMENT}_SpringApps_{SPRING_APPS_SERVICE_ID}`, as shown with the following command:

   ```azurecli
   SERVICE_ID=$(az spring show \
       --resource-group $RESOURCE_GROUP \
       --name $AZURE_SPRING_APPS_INSTANCE \
       --query properties.serviceId \
       --output tsv)
   INFRA_RESOURCE_GROUP=${AZURE_CONTAINER_APPS_ENVIRONMENT}_SpringApps_${SERVICE_ID}
   echo ${INFRA_RESOURCE_GROUP}
   ```

---

## Clean up resources

Be sure to delete the resources you created in this article when you no longer need them. To delete the resources, just delete the resource group that contains them. You can delete the resource group using the Azure portal. Alternately, to delete the resource group by using Azure CLI, use the following commands:

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Next steps

> [!div class="nextstepaction"]
> [Create an Azure Spring Apps Standard consumption plan instance in an Azure Container Apps environment with a virtual network](./quickstart-provision-standard-consumption-app-environment-with-virtual-network.md)
