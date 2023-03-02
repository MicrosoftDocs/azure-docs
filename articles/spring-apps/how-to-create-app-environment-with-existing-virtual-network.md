---
title: Create App Environment with existing virtual network in Azure Spring Apps
description: Learn how to create an app environment for an existing virtual network in Azure Spring Apps
author: karlerickson
ms.author: xuycao
ms.service: spring-apps
ms.topic: how-to
ms.date: 03/2/2023
---

# Create App Environment with existing Virtual Network

**This article applies to:** ✔️ Standard Consumption plan ❌ Basic/Standard tier ❌ Enterprise tier

This article describes how to create an App Environment in an existing virtual network in an Azure Apps instance.

### [Azure portal](#tab/Azure-portal)

The following procedure creates an App Environment using the Azure portal.

1. Open the [Azure portal](https://portal.azure.com/).

1. Search for **Azure Spring Apps**, and then select **Azure Spring Apps** in the results.

   :::image type="content" source="media/quickstart-provision-service-instance/spring-apps-start.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps, with Azure Spring Apps highlighted in the search bar and in the results." lightbox="media/quickstart-provision-service-instance/spring-apps-start.png":::

1. On the Azure Spring Apps page, select **Create**.

   :::image type="content" source="media/quickstart-provision-service-instance/spring-apps-create.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps page with the Create button highlighted.":::

1. On the Azure Spring Apps **Create** page, use the following guidelines to specify settings for **Basics**.

   - **Subscription**: Select the subscription you want billed for this resource.
   - **Resource group**: Creating new resource groups for new resources is a best practice. 
   - **Name**: The service name must meet the following requirements:
     - Have a minimum length of 4 and a maximum length of 32 characters.
     - Contains only lowercase letters, numbers, and hyphens.
     - Starts with a letter, and ends with a letter or a number.
   - **Region**: Select the region for your service instance. Currently, only the folowing regions are supported:
     - East US
     - West Europe
     - East Asia
     - Southeast Asia.
   - **Plan**: Select **Standard Consumption** for the **Pricing tier** option.
   - For **App Environment**, select **Create new** under the dropdown menu.

   :::image type="content" source="media/quickstart-provision-stardard-consumption-plan-service-instance/select-app-environment.png" alt-text="Screenshot of Azure portal showing the Create Container Apps Environment page for an Azure Spring Apps instance with Create new highlighted for App Environment." lightbox="media/quickstart-provision-stardard-consumption-plan-service-instance/select-app-environment.png":::

1. On the **Create Container Apps Environment** page, use the default value `asa-standard-consumption-app-env` for the **Environment name** and set **Zone redundancy** to **Enabled**.

    :::image type="content" source="media/quickstart-provision-stardard-consumption-plan-service-instance/create-app-env.png" alt-text="Screenshot of Azure portal showing Create App Environment blade.":::

1. Select **Networking**. For **Use your own virtual network** select **Yes**. For **virtual network** and **Infrastructure subnet**, select their names from the dropdown menus or create new ones if needed.

   :::image type="content" source="media/quickstart-provision-stardard-consumption-plan-service-instance/create-app-env-in-vnet.png" alt-text="Screenshot of Azure portal showing Create App Environment in own vnet blade.":::

   >[!NOTE]
   > The subnet associated with an App Environment requires a CIDR prefix of `/23` or larger.

1. Select **Create**.

1. Back on the Azure Spring Apps **Create** page, select **Review and Create** to finish.

### [Azure CLI](#tab/Azure-CLI)

## Prerequisites

- Install the [Azure CLI](/cli/azure/install-azure-cli) version 2.28.0 or higher.

## Setup

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

```bash
    RESOURCE_GROUP="my-spring-apps"
    LOCATION="eastus"
    APP_ENVIRONMENT="my-environment"
```

## Create an environment

An App Environment creates a secure boundary around a group apps. Apps deployed to the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace.

6. Next, declare a variable to hold the VNET name


```bash
    VNET_NAME="my-custom-vnet"
```

7. Now create an Azure virtual network to associate with the App Environment. The virtual network must have a subnet available for the environment deployment

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

8. With the virtual network created, you can retrieve the ID for the infrastructure subnet

```bash
    INFRASTRUCTURE_SUBNET=`az network vnet subnet show --resource-group $RESOURCE_GROUP --vnet-name $VNET_NAME --name infrastructure-subnet --query "id" -o tsv | tr -d '[:space:]'`
```

9. Finally, create the App Environment using the custom VNET deployed in the preceding steps


```azurecli
    az containerapp env create \
    --name $APP_ENVIRONMENT \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --infrastructure-subnet-resource-id $INFRASTRUCTURE_SUBNET
```

> [!NOTE]
> You can create an internal App Environment that doesn't use a public static IP, only internal IP addresses available in the custom VNET. Please refer: [Create an Internal App Environment](/azure/container-apps/vnet-custom-internal?tabs=bash&pivots=azure-cli#create-an-environment)

The following table describes the parameters used in `containerapp env create`.

| Parameter | Description |
|---|---|
| `name` | Name of the App Environment. |
| `resource-group` | Name of the resource group. |
| `location` | The Azure location where the environment is to deploy.  |
| `infrastructure-subnet-resource-id` | Resource ID of a subnet for infrastructure components and user application containers. |
| `internal-only` | (Optional) The environment doesn't use a public static IP, only internal IP addresses available in the custom VNET. (Requires an infrastructure subnet resource ID.) |