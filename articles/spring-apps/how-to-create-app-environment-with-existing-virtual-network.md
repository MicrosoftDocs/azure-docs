---
title: Create an Azure Container Apps Environment with existing virtual network in Azure Spring Apps
description: Learn how to create an Azure Container Apps Environment for an existing virtual network in Azure Spring Apps
author: karlerickson
ms.author: xuycao
ms.service: spring-apps
ms.topic: how-to
ms.date: 03/2/2023
---

# Create an Azure Container Apps Environment with existing Virtual Network

**This article applies to:** ✔️ Standard Consumption plan ❌ Basic/Standard tier ❌ Enterprise tier

This article describes how to create an Azure Container Apps Environment in an existing virtual network in an Azure Apps instance.

### [Azure portal](#tab/Azure-portal)

The following procedure creates an Azure Container Apps Environment with a virtual network using the Azure portal.

1. Open the [Azure portal](https://portal.azure.com/).

1. Search for **Azure Spring Apps**, and then select **Azure Spring Apps** in the results.

   :::image type="content" source="media/quickstart-provision-service-instance/spring-apps-start.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps in search results, with Azure Spring Apps highlighted in the search bar and in the results." lightbox="media/quickstart-provision-service-instance/spring-apps-start.png":::

1. On the Azure Spring Apps page, select **Create**.

   :::image type="content" source="media/quickstart-provision-service-instance/spring-apps-create.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps page with the Create button highlighted.":::

1. On the Azure Spring Apps **Create** page, use the following guidelines to specify your settings.

   - **Subscription**: Select the subscription you want billed for this resource.
   - **Resource group**: A new resource group is recommended.
   - **Name**: The service name must meet the following requirements:
     - Have a minimum length of 4 and a maximum length of 32 characters.
     - Contains only lowercase letters, numbers, and hyphens.
     - Starts with a letter, and ends with a letter or a number.
   - **Region**: Currently, only the following regions are supported:
     - East US
     - West Europe
     - East Asia
     - Southeast Asia.
   - **Plan**: Select **Standard Consumption** for the **Pricing tier** option.
   - For **App Environment**, select **Create new** under the dropdown menu.

   :::image type="content" source="media/quickstart-provision-stardard-consumption-plan-service-instance/select-app-environment.png" alt-text="Screenshot of Azure portal showing the Create Container Apps Environment page for an Azure Spring Apps instance with Create new highlighted for Azure Container Apps Environment." lightbox="media/quickstart-provision-stardard-consumption-plan-service-instance/select-app-environment.png":::

1. On the **Create Container Apps Environment** page, use the default value `asa-standard-consumption-app-env` for the **Environment name** and set **Zone redundancy** to **Enabled**.

    :::image type="content" source="media/quickstart-provision-stardard-consumption-plan-service-instance/create-app-env.png" alt-text="Screenshot of Azure portal showing Create Container Apps Environment page with the Basics tab selected.":::

1. Select **Networking**. Select **Yes** for **Use your own virtual network**. For **virtual network** and **Infrastructure subnet**, select their names from the dropdown menus or create new ones if needed.

   :::image type="content" source="media/quickstart-provision-stardard-consumption-plan-service-instance/create-app-env-in-vnet.png" alt-text="Screenshot of Azure portal showing Create Container Apps Environment page with the Networking tab selected.":::

   >[!NOTE]
   > The subnet associated with an Azure Container Apps Environment requires a CIDR prefix of `/23` or larger.

1. Select **Create**.

1. Back on the Azure Spring Apps **Create** page, select **Review and Create** to finish creating the Azure Spring Apps instance.

### [Azure CLI](#tab/Azure-CLI)

Use the Azure CLI to create an Azure Container Apps Environment with a virtual network.

## Prerequisites

- Install the Azure Spring Apps extension with the following command:

```azurecli
az extension add --name containerapp --upgrade
```

- Set the following variables names to your settings, or as otherwise specified.
- `$RESOURCE_GROUP` - The name of the resource group that contains your Azure Spring Apps Instance.
- `$LOCATION` - Set to `East US`.
- `$VNET_NAME` - Set to name of virtual network associated with your Azure Spring Apps instance.
- `$AZURE_CONTAINER_APPS_ENVIRONMENT` - Set to the name to be used for your Azure Container Apps Environment.

## Setup

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

1. Set the following environment variables to the variables you defined previously.

```bash
    RESOURCE_GROUP = $RESOURCE_GROUP
    LOCATION = $LOCATION
    APP_ENVIRONMENT = $AZURE_CONTAINER_APPS_ENVIRONMENT
```

## Create an environment

An Azure Container Apps Environment creates a secure boundary around a group of applications. Apps deployed to the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace.

1. Create an Azure virtual network to associate with the Azure Container Apps Environment. The virtual network must have a subnet available for the environment deployment.

> [!NOTE]
> You can use an existing virtual network, but a dedicated subnet with a CIDR range of `/23` or larger is required.

   ```azurecli
    az network vnet create \
    --resource-group $RESOURCE_GROUP \
    --name $VNET_NAME \
    --location $LOCATION \
    --address-prefix 10.0.0.0/16
   ```

   ```azurecli
    az network vnet subnet create \
    --resource-group $RESOURCE_GROUP \
    --vnet-name $VNET_NAME \
    --name infrastructure-subnet \
    --address-prefixes 10.0.0.0/23
   ```

1. With the virtual network created, you can retrieve the ID for the infrastructure subnet.

   ```bash
    INFRASTRUCTURE_SUBNET = `az network vnet subnet show --resource-group $RESOURCE_GROUP --vnet-name $VNET_NAME --name infrastructure-subnet --query "id" -o tsv | tr -d '[:space:]'`
   ```

1. Create the Azure Container Apps Environment using the virtual network deployed in the preceding steps.

```azurecli
    az containerapp env create \
    --name $APP_ENVIRONMENT \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --infrastructure-subnet-resource-id $INFRASTRUCTURE_SUBNET
```

> [!NOTE]
> You can create an internal Azure Container Apps Environment that doesn't use a public static IP, but rather only internal IP addresses available in the custom virtual network. For more information see [Create an Internal App Environment](/azure/container-apps/vnet-custom-internal?tabs=bash&pivots=azure-cli#create-an-environment).

The following table describes the parameters used in `containerapp env create`.

| Parameter                           | Description                                                                                                                                                          |
|--------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name`                              | Name of the Azure Container Apps Environment.                                                                                                                        |
| `resource-group`                    | Name of the resource group.                                                                                                                                          |
| `location`                          | The Azure location where the environment is to deploy.                                                                                                               |
| `infrastructure-subnet-resource-id` | Resource ID of a subnet for infrastructure components and user application containers.                                                                               |
| `internal-only`                     | (Optional) The environment doesn't use a public static IP, only internal IP addresses available in the custom VNET. (Requires an infrastructure subnet resource ID.) |