---
title: Create an Azure Spring Apps instance in an Azure Container Apps environment with a virtual network
description: Learn how to create an Azure Spring Apps instance in an Azure Container Apps environment with a virtual network.
author: karlerickson
ms.author: xuycao
ms.service: spring-apps
ms.topic: how-to
ms.date: 03/14/2023
ms.custom: devx-track-java
---

# Create an Azure Spring Apps instance in an Azure Container Apps environment with a virtual network

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Standard consumption (Preview) ✔️ Basic/Standard ✔️ Enterprise  

This article describes how create an Azure Spring Apps instance in an Azure Container Apps environment with a virtual network. An Azure Container Apps environment creates a secure boundary around a group of applications. Applications deployed to the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace.

When you create an Azure Spring Apps instance in an Azure Container Apps environment, it shares the same virtual network with other services and resources in the same Azure Container Apps environment. When you deploy frontend apps as containers in Azure Container Apps, and you also deploy Spring apps in the Azure Spring Apps Standard consumption plan, the apps are all in the same Azure Container Apps environment.

You can also deploy your Azure Container Apps environment to an existing virtual network created by your IT team. This scenario simplifies the virtual network experience for running polyglot apps.

> [!NOTE]
> You can use an existing virtual network that has a dedicated subnet with a CIDR range of `/23` or higher.

## Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- (Optional) [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) version 2.28.0 or higher.

## Create an Azure Container Apps environment

You can use either the Azure portal or the Azure CLI to create the Azure Container Apps environment.

Use the following steps to create an Azure Container Apps environment with a virtual network.

### [Azure portal](#tab/Azure-portal)

1. Open the [Azure portal](https://portal.azure.com/).

1. In the search box, search for *Azure Spring Apps*, and then select **Azure Spring Apps** in the results.

   :::image type="content" source="media/how-to-create-app-environment-with-existing-virtual-network/spring-apps-start.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps in search results, with Azure Spring Apps highlighted in the search bar and in the results." lightbox="media/how-to-create-app-environment-with-existing-virtual-network/spring-apps-start.png":::

1. On the Azure Spring Apps page, select **Create**.

   :::image type="content" source="media/how-to-create-app-environment-with-existing-virtual-network/spring-apps-create.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps page with the Create button highlighted.":::

1. Fill out the **Basics** form on the Azure Spring Apps **Create** page using the following guidelines:

   - **Project Details**:

     - **Subscription**: Select the subscription you want to be billed for this resource.
     - **Resource group**: Select an existing resource group or create a new one.

   - **Service Details**:

     - **Name**: Create the name for the Azure Spring Apps instance. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.
     - **Location**: Currently, only the following regions are supported: Australia East, Central US, East US, East US 2, West Europe, East Asia, North Europe, South Central US, UK South, West US 3.

   - **Plan**: Select **Standard Consumption** for the **Pricing tier** option.

   - **App Environment**:

     - Select **Create new** to create a new Azure Container Apps environment or select an existing environment from the dropdown menu.

   :::image type="content" source="media/how-to-create-app-environment-with-existing-virtual-network/select-app-environment.png" alt-text="Screenshot of Azure portal showing the Create Container Apps environment page for an Azure Spring Apps instance with Create new highlighted for Azure Container Apps environment." lightbox="media/how-to-create-app-environment-with-existing-virtual-network/select-app-environment.png":::

1. Fill out the **Basics** form on the **Create Container Apps environment** page. Use the default value `asa-standard-consumption-app-env` for the **Environment name** and set **Zone redundancy** to **Enabled**.

   :::image type="content" source="media/how-to-create-app-environment-with-existing-virtual-network/create-app-env.png" alt-text="Screenshot of Azure portal showing Create Container Apps environment page with the Basics tab selected.":::

1. Select **Networking** and then specify the settings using the following guidelines:

   - For **Use your own virtual network**, select **Yes**.
   - Select the names for **Virtual network** and for **Infrastructure subnet** from the dropdown menus or use **Create new** as needed.
   - Set **Virtual IP** to **External**. You can set the value to **Internal** if you prefer to use use only internal IP addresses available in the virtual network instead of a public static IP.

   :::image type="content" source="media/how-to-create-app-environment-with-existing-virtual-network/create-app-env-in-vnet.png" alt-text="Screenshot of Azure portal showing Create Container Apps environment page with the Networking tab selected.":::

   >[!NOTE]
   > The subnet associated with an Azure Container Apps environment requires a CIDR prefix of `/23` or higher.

1. Select **Create**.

1. On the Azure Spring Apps **Create** page, select **Review and Create** to finish creating the Azure Spring Apps instance.

### [Azure CLI](#tab/Azure-CLI)

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

1. Use the following commands to create variables to store various values:

   ```bash
   RESOURCE_GROUP="<resource-group-name>"
   LOCATION="eastus"
   APP_ENVIRONMENT="<azure-container-apps-environment-name>"
   ```

1. Declare a variable for the name of the virtual network:

   ```bash
   VNET_NAME="<virtual-network-name>"
   ```

1. Use the following commands to create an Azure virtual network and subnet to associate with the Azure Container Apps environment. The virtual network must have a subnet available for the environment deployment.

   ```azurecli
   az network vnet create \
       --resource-group $RESOURCE_GROUP \
       --name $VNET_NAME \
       --location $LOCATION \
       --address-prefix 10.0.0.0/16

   az network vnet subnet create \
       --resource-group $RESOURCE_GROUP \
       --vnet-name $VNET_NAME \
       --name $INFRASTRUCTURE_SUBNET \
       --address-prefixes 10.0.0.0/23
   ```

1. Use the following command to get the ID for the infrastructure subnet and store it in a variable.

   ```azurecli
   INFRASTRUCTURE_SUBNET=$(az network vnet subnet show \
       --resource-group $RESOURCE_GROUP \
       --vnet-name $VNET_NAME \
       --name infrastructure-subnet \
       --query "id" \
       --output tsv \
       | tr -d '[:space:]')
   ```

1. Use the following command to create the Azure Container Apps environment using the infrastructure subnet ID.

   ```azurecli
   az containerapp env create \
       --name $APP_ENVIRONMENT \
       --resource-group $RESOURCE_GROUP \
       --location $LOCATION \
       --infrastructure-subnet-resource-id $INFRASTRUCTURE_SUBNET
   ```

   > [!NOTE]
   > You can create an internal Azure Container Apps environment that doesn't use a public static IP, but instead uses only internal IP addresses available in the custom virtual network. For more information see the [Create an environment](../container-apps/vnet-custom-internal.md?tabs=bash&pivots=azure-cli#create-an-environment) section of [Provide a virtual network to an internal Azure Container Apps environment](../container-apps/vnet-custom-internal.md?tabs=bash&pivots=azure-cli).

   The following table describes the parameters used in the `containerapp env create` command.

   | Parameter                           | Description                                                                                                                                                                                |
   |-------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | `name`                              | The name of the Azure Container Apps environment.                                                                                                                                          |
   | `resource-group`                    | The name of the resource group.                                                                                                                                                            |
   | `location`                          | The Azure location where the environment is to deploy.                                                                                                                                     |
   | `infrastructure-subnet-resource-id` | The Resource ID of a subnet for infrastructure components and user application containers.                                                                                                 |
   | `internal-only`                     | (Optional) Sets the environment to use only internal IP addresses available in the custom virtual network instead of a public static IP. (Requires the infrastructure subnet resource ID.) |

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

- [Azure Spring Apps](./index.yml)
