---
title: Create Azure Spring Apps in Azure Container Apps Environment with an existing virtual network
description: Learn how to create an Azure Spring Apps in an Azure Container Apps Environment with a existing virtual network.
author: karlerickson
ms.author: xuycao
ms.service: spring-apps
ms.topic: how-to
ms.date: 03/2/2023
ms.custom: devx-track-java
---

# Create Azure Spring Apps in Azure Container Apps Environment with an existing virtual network

**This article applies to:** ✔️Standard consumption (Preview) ✔️Basic/Standard ✔️Enterprise  

This article describes how create an Azure Spring Apps instance in an Azure Container Apps Environment with an existing virtual network. When Azure Spring Apps is created in an Azure Container Apps environment, it will share the same virtual network with other services and resources that reside in the same Azure Container Apps Environment.

Furthermore, you can pick an existing virtual network created by your IT team to deploy your Azure Container Apps environment. This scenario significantly simplifies the virtual network experience for running polyglot apps.

When you deploy frontend apps as containers in Azure Container Apps, and also deploy Spring apps in Standard consumption, they are all in the same Azure Container Apps environment.

When Azure Spring Apps is created in an Azure Container Apps environment, it will share the same Virtual Network with other services and resources that dwell in the same Azure Container Apps Environment. Furthermore, you can pick an existing Virtual Network that was setup by your IT team to deploy your Azure Container Apps environment. This significantly simplifies the Virtual Network experience for running polyglot apps, when you deploy frontend apps as containers in Azure Container Apps and Spring apps in Standard consumption, in the same Azure Container Apps environment.

### [Azure portal](#tab/Azure-portal)

The following procedure creates an Azure Container Apps Environment with a virtual network using the Azure portal.

1. Open the [Azure portal](https://portal.azure.com/).

1. In the search box, search for *Azure Spring Apps*, and then select **Azure Spring Apps** in the results.

   :::image type="content" source="media/how-to-create-app-environment-with-existing-virtual-network/spring-apps-start.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps in search results, with Azure Spring Apps highlighted in the search bar and in the results." lightbox="media/how-to-create-app-environment-with-existing-virtual-network/spring-apps-start.png":::

1. On the Azure Spring Apps page, select **Create**.

   :::image type="content" source="media/how-to-create-app-environment-with-existing-virtual-network/spring-apps-create.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps page with the Create button highlighted.":::

1. Fill out the **Basics** form on the Azure Spring Apps **Create** page using the following guidelines:

   - **Project Details**

     - **Subscription**: Select the subscription you want to be billed for this resource.
     - **Resource group**: Select an existing resource group or create a new one.

   - **Service Details**

     - **Name**: Create the name for the Azure Spring Apps instance. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.
     - **Location**: Currently, only the following regions are supported: Australia East, Central US, East US, East US 2, West Europe, East Asia, North Europe, South Central US, UK South, West US 3.
   - **Plan**: Select **Standard Consumption** for the **Pricing tier** option.

   - **App Environment**

     - Select **Create new** to create a new Azure Container Apps Environment or select an existing environment from the dropdown menu.

   :::image type="content" source="media/how-to-create-app-environment-with-existing-virtual-network/select-app-environment.png" alt-text="Screenshot of Azure portal showing the Create Container Apps Environment page for an Azure Spring Apps instance with Create new highlighted for Azure Container Apps Environment." lightbox="media/how-to-create-app-environment-with-existing-virtual-network/select-app-environment.png":::

1. Fill out the **Basics** form on the **Create Container Apps Environment** page, use the default value `asa-standard-consumption-app-env` for the **Environment name** and set **Zone redundancy** to **Enabled**.

    :::image type="content" source="media/how-to-create-app-environment-with-existing-virtual-network/create-app-env.png" alt-text="Screenshot of Azure portal showing Create Container Apps Environment page with the Basics tab selected.":::

1. Select **Networking** and specify the settings using the following guidelines:

   - For **Use your own virtual network** select **Yes**.
   - Select the names for **Virtual network** and for **Infrastructure subnet** from the dropdown menus or use **Create new** as needed.
   - Set **Virtual IP** to **External**. You can set to **Internal** if you prefer to use use only internal IP addresses available in the virtual network instead of a public static IP.

   :::image type="content" source="media/how-to-create-app-environment-with-existing-virtual-network/create-app-env-in-vnet.png" alt-text="Screenshot of Azure portal showing Create Container Apps Environment page with the Networking tab selected.":::

   >[!NOTE]
   > The subnet associated with an Azure Container Apps Environment requires a CIDR prefix of `/23` or larger.

1. Select **Create**.

1. On the Azure Spring Apps **Create** page, select **Review and Create** to finish creating the Azure Spring Apps instance.

### [Azure CLI](#tab/Azure-CLI)

Use the Azure CLI to create an Azure Container Apps Environment with a virtual network.

## Prerequisites

- Install the Azure Spring Apps extension with the following command:

   ```azurecli
    az extension add --name containerapp --upgrade
   ```

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

1. Set the following environment variables.

   ```bash
    RESOURCE_GROUP = "<resource-group-name>"
    LOCATION = "eastus"
    APP_ENVIRONMENT = "<azure-container-apps-environment-name>"
   ```

## Create an environment

An Azure Container Apps Environment creates a secure boundary around a group of applications. Applications deployed to the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace.

> [!NOTE]
> You can use an existing virtual network that has a dedicated subnet with a CIDR range of `/23` or larger.

1. Declare a variable for the name of the virtual network:

    ```bash
    VNET_NAME = "<virtual-network-name>"
   ```

1. Create an Azure virtual network to associate with the Azure Container Apps Environment. The virtual network must have a subnet available for the environment deployment.

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
    --name $INFRASTRUCTURE_SUBNET \
    --address-prefixes 10.0.0.0/23
   ```

1. Get the ID for the infrastructure subnet.

   ```bash
    $INFRASTRUCTURE_SUBNET = `az network vnet subnet show --resource-group $RESOURCE_GROUP --vnet-name $VNET_NAME --name infrastructure-subnet --query "id" -o tsv | tr -d '[:space:]'`
   ```

1. Create the Azure Container Apps Environment using the infrastructure subent ID.

   ```azurecli
    az containerapp env create \
    --name $APP_ENVIRONMENT \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --infrastructure-subnet-resource-id $INFRASTRUCTURE_SUBNET
   ```

> [!NOTE]
> You can create an internal Azure Container Apps Environment that doesn't use a public static IP, but instead uses only internal IP addresses available in the custom virtual network. For more information see [Create an Internal App Environment](/azure/container-apps/vnet-custom-internal?tabs=bash&pivots=azure-cli#create-an-environment).

The following table describes the parameters used in the `containerapp env create` command.

| Parameter                           | Description                                                                                                                                                          |
|--------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name`                              | The name of the Azure Container Apps Environment.                                                                                                                        |
| `resource-group`                    | The name of the resource group.                                                                                                                                          |
| `location`                          | The Azure location where the environment is to deploy.                                                                                                               |
| `infrastructure-subnet-resource-id` | The Resource ID of a subnet for infrastructure components and user application containers.                                                                               |
| `internal-only`                     | (Optional) Sets the environment to use only internal IP addresses available in the custom virtual network instead of a public static IP (Requires the infrastructure subnet resource ID.) |

---

## Next steps
