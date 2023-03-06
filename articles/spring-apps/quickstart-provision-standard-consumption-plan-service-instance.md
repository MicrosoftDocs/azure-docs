---
title: "Quickstart - Provision an Azure Spring Apps Standard Consumption plan service"
description: Describes creation of an Azure Spring Apps Standard Consumption plan service instance for app deployment.
author: Caoxuyang
ms.author: xuycao
ms.service: spring-apps
ms.topic: quickstart
ms.date: 02/27/2023
---

# Quickstart: Provision an Azure Spring Apps Standard Consumption plan service instance

**This article applies to:** ✔️ Standard Consumption plan ❌ Basic/Standard tier ❌ Enterprise tier

### [Azure portal](#tab/Azure-portal)

The following procedure creates an instance of Azure Spring Apps using the Azure portal.

1. In a new tab, open the [Azure portal](https://portal.azure.com/).

1. From the top search box, search for **Azure Spring Apps**.

1. Select **Azure Spring Apps** from the results.

   :::image type="content" source="media/quickstart-provision-service-instance/spring-apps-start.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps service in search results." lightbox="media/quickstart-provision-service-instance/spring-apps-start.png":::

1. On the Azure Spring Apps page, select **Create**.

   :::image type="content" source="media/quickstart-provision-service-instance/spring-apps-create.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps resource with Create button highlighted.":::

1. Fill out the form on the Azure Spring Apps **Create** page.  Consider the following guidelines:

   - **Subscription**: Select the subscription you want to be billed for this resource.
   - **Resource group**: Creating new resource groups for new resources is a best practice. You will use this value in later steps as **\<resource group name\>**.
   - **Service Details/Name**: Specify the **\<service instance name\>**.  The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens.  The first character of the service name must be a letter and the last character must be either a letter or a number.
   - **Location**: Select the location for your service instance. For now, the following regions are supported: Australia East, Central US, East US, East US 2, West Europe, East Asia, North Europe, South Central US, UK South, West US 3.
   - Select **Standard Consumption** for the **Pricing tier** option.
   - **App Environment**: Create a new App Environment or use an existing App Environment. 

      > How to create a new App Environment
      > 1. Select **Create new** under the App Environment
      > 2. Fill out the form on the App Environment **Create** page.
      > :::image type="content" source="media/quickstart-provision-stardard-consumption-plan-service-instance/create-app-env.png" alt-text="Screenshot of Azure portal showing Create App Environment blade.":::

    >[!NOTE]
    > Optionally, you can also [create an App Environment with your own virtual network](./how-to-create-app-environment-with-existing-virtual-network.md).
   

   :::image type="content" source="media/quickstart-provision-stardard-consumption-plan-service-instance/select-app-environment.png" alt-text="Screenshot of Azure portal showing the Azure Spring Apps Create page." lightbox="media/quickstart-provision-stardard-consumption-plan-service-instance/select-app-environment.png":::

1. Select **Review and create**.

### [Azure cli](#tab/Azure-CLI)

## Prerequisites

- Install the [Azure CLI](/cli/azure/install-azure-cli) version 2.28.0 or higher.

## Step 1: Create a Managed Environment

A Managed Environment creates a secure boundary around a group apps. Apps deployed to the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace.

Please create the Managed Environment in one of two options:

#### Option 1: Create a Managed Environment with system assigned virtual network

1. To begin, sign in to Azure. Run the following command, and follow the prompts to complete the authentication process
  ```azurecli
    az login
  ```

2. Next, install the Azure Container Apps extension for the CLI

```azurecli
  az extension add --name containerapp --upgrade
```

3. Now that the current extension or module is installed, register the `Microsoft.App` namespace

```azurecli
  az provider register --namespace Microsoft.App
```

4. Register the `Microsoft.OperationalInsights` provider for the Azure Monitor Log Analytics workspace if you have not used it before

```azurecli
  az provider register --namespace Microsoft.OperationalInsights
```

5. Next, set the following environment variables

> [!NOTE]
> You can customize the values of all the environment variables

```bash
    RESOURCE_GROUP="my-spring-apps"
    LOCATION="eastus"
    MANAGED_ENVIRONMENT="my-environment"
```

### Create an environment

A Managed Environment creates a secure boundary around a group apps. Apps deployed to the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace.

To create the environment, run the following command
```azurecli
    az containerapp env create \
    --name $MANAGED_ENVIRONMENT \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION
```


#### Option 2: Please refer [Create an App Environment with your own virtual network](./how-to-create-app-environment-with-existing-virtual-network.md)


---

## Step 2: Deploy an Azure Spring Apps instance

1. Install the latest `spring` extension for Azure Spring Apps

```azurecli
    az extension remove -n spring && \
    az extension add -n spring
```

2. Register the `Microsoft.AppPlatform` provider for the Azure Spring Apps

```azurecli
    az provider register --namespace Microsoft.AppPlatform
```

3. Set the following environment variables

```bash
    RESOURCE_GROUP="my-spring-apps"
    SPRING_APPS_NAME="my-spring-apps-instance"
    MANAGED_ENVIRONMENT="my-environment"
    LOCATION="eastus"
```
```azurecli
    MANAGED_ENV_RESOURCE_ID=$(az containerapp env show \
        --name $MANAGED_ENVIRONMENT \
        --resource-group $RESOURCE_GROUP \
        --query id -o tsv)
```

4. To deploy a Standard Consumption plan Azure Spring Apps instance on top of the Container Environment: 
Create your Azure Spring Apps instance by specifying the resource id of the Managed Environment you just created

```azurecli
    az spring create \
        --resource-group $RESOURCE_GROUP \
        --name $SPRING_APPS_NAME \
        --managed-environment $MANAGED_ENV_RESOURCE_ID \
        --sku StandardGen2 \
        --location $LOCATION
```

5. After the deployment, one additional infra resource group will be created in your subscription to host the underlying resources for the Standard Consumption plan Azure Spring Apps instance. 
The resource group will be named as {MANAGED_ENVIRONMENT}\_SpringApps\_{SPRING_APPS_SERVICE_ID}

```azurecli
    SERVICE_ID=$(az spring show \
        --resource-group $RESOURCE_GROUP \
        --name $SPRING_APPS_NAME --query properties.serviceId -o tsv)
    INFRA_RESOURCE_GROUP=${MANAGED_ENVIRONMENT}_SpringApps_${SERVICE_ID}
    echo ${INFRA_RESOURCE_GROUP}
```

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the resources in the resource group. To delete the resource group by using Azure CLI, use the following commands:

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```
