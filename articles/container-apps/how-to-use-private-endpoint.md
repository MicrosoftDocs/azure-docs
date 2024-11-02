---
title: Use a private endpoint with an Azure Container Apps environment
description: Learn how to use a private endpoint with an Azure Container Apps environment.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.topic:  how-to
ms.date: 11/2/2024
ms.author: cshoe
zone_pivot_groups: azure-cli-or-portal
---

# Use a private endpoint with an Azure Container Apps environment

The following example shows you how to use a private endpoint with a Container Apps environment.

::: zone pivot="azure-portal"

Begin by signing in to the [Azure portal](https://portal.azure.com).

## Create a container app

To create your container app, start at the Azure portal home page.

1. Search for **Container Apps** in the top search bar.
1. Select **Container Apps** in the search results.
1. Select the **Create** button.

### Basics tab

In the *Create Container App* page on the *Basics* tab, do the following actions.

1. Enter the following values in the *Project details* section.

    | Setting | Action |
    |---|---|
    | Subscription | Select your Azure subscription. |
    | Resource group | Select **Create new** and enter **my-container-apps**. |
    | Container app name |  Enter **my-container-app**. |
    | Deployment source | Select **Container image**. |

#### Create an environment

Next, create an environment for your container app.

1. Select the appropriate region.

    | Setting | Value |
    |--|--|
    | Region | Select **Central US**. |

1. In the *Create Container Apps environment* field, select the **Create new** link.

1. In the *Create Container Apps Environment* page on the *Basics* tab, enter the following values:

    | Setting | Value |
    |--|--|
    | Environment name | Enter **my-environment**. |
    | Zone redundancy | Select **Disabled** |

1. Select the **Networking** tab to create a virtual network (VNet). By default, public network access is enabled, which means private endpoints are disabled.

   :::image type="content" source="media/private-endpoints/private-endpoint-create-environment-1.png" alt-text="By default, public network access is enabled.":::

   :::image type="content" source="media/private-endpoints/private-endpoint-create-environment-2.png" alt-text="If public network access is enabled, private endpoints are disabled.":::

1. Disable public network access.

   :::image type="content" source="media/private-endpoints/private-endpoint-create-environment-3.png" alt-text="Disable public network access.":::

1. Leave **Use your own virtual network** set to **No**.

    > [!NOTE]
    > You can use an existing virtual network, but a dedicated subnet with a CIDR range of `/23` or larger is required for use with Container Apps when using the Consumption only Architecture. When using a workload profiles environment, a `/27` or larger is required. To learn more about subnet sizing, see the [networking architecture overview](./networking.md#subnet). To learn more about using an existing virtual network, see [Deploy with an external environment](./vnet-custom.md) or [Deploy with an internal environment](./vnet-custom-internal.md).

1. Enable private endpoints.

1. Set **Private endpoint name** to **my-private-endpoint**.

1. In the *Private endpoint virtual network* field, select the **Create new** link.

1. In the *Create Virtual Network* page, set **Virtual Network** to **my-private-endpoint-vnet**. Select **OK**.

1. In the *Private endpoint virtual network Subnet* field, select the **Create new** link.

1. In the *Create Subnet* page, set **Subnet Name** to **my-private-endpoint-vnet-subnet**. Select **OK**.

1. Leave **DNS** set to **Azure Private DNS Zone**.

   :::image type="content" source="media/private-endpoints/private-endpoint-create-environment-4.png" alt-text="Enable private endpoints.":::

1. Select **Create**.

1. In the *Create Container App* page on the *Basics* tab, select **Next : Container >**.

### Container tab

In the *Create Container App* page on the *Container* tab, select **Use quickstart image**.

<!-- Deploy -->
[!INCLUDE [container-apps-create-portal-deploy.md](../../includes/container-apps-create-portal-deploy.md)]

::: zone-end

::: zone pivot="azure-cli"

## Prerequisites

- Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- Install the [Azure CLI](/cli/azure/install-azure-cli) version 2.28.0 or higher.

## Setup

1. To sign in to Azure from the CLI, run the following command and follow the prompts to complete the authentication process.

    ```azurecli
    az login
    ```

1. To ensure you're running the latest version of the CLI, run the upgrade command.

    ```azurecli
    az upgrade
    ```

1. Install or update the Azure Container Apps extension for the CLI.

    If you receive errors about missing parameters when you run `az containerapp` commands in Azure CLI or cmdlets from the `Az.App` module in Azure PowerShell, be sure you have the latest version of the Azure Container Apps extension installed.

    ```azurecli
    az extension add --name containerapp --upgrade
    ```

    > [!NOTE]
    > Starting in May 2024, Azure CLI extensions no longer enable preview features by default. To access Container Apps [preview features](./whats-new.md), install the Container Apps extension with `--allow-preview true`.
    > ```azurecli
    > az extension add --name containerapp --upgrade --allow-preview true
    > ```

1. Register the `Microsoft.App`, `Microsoft.OperationalInsights`, and `Microsoft.ContainerService` namespaces.

    ```azurecli
    az provider register --namespace Microsoft.App
    ```

    ```azurecli
    az provider register --namespace Microsoft.OperationalInsights
    ```

    ```azurecli
    az provider register --namespace Microsoft.ContainerService
    ```

## Set environment variables

Set the following environment variables.

```azurecli
RESOURCE_GROUP="my-container-apps"
LOCATION="centralus"
ENVIRONMENT_NAME="my-environment"
CONTAINERAPP_NAME="my-container-app"
VNET_NAME="my-custom-vnet"
PRIVATE_ENDPOINT="my-private-endpoint"
CONNECTION="my-connection"
```

## Create an Azure resource group

Create a resource group to organize the services related to your container app deployment.

```azurecli
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION
```

## Create a virtual network

An environment in Azure Container Apps creates a secure boundary around a group of container apps. Container Apps deployed to the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace.

Now create an Azure virtual network to associate with the Container Apps environment. The virtual network must have a subnet available for the environment deployment.

> [!NOTE]
> Network subnet address prefix requires a minimum CIDR range of `/23` for use with Container Apps when using the Consumption only Architecture. When using the Workload Profiles Architecture, a `/27` or larger is required. To learn more about subnet sizing, see the [networking architecture overview](./networking.md#subnet).

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
  --address-prefixes 10.0.0.0/21
```

When using the Workload profiles environment, you need to update the VNet to delegate the subnet to `Microsoft.App/environments`. This delegation is not applicable to the Consumption-only environment.

```azurecli
az network vnet subnet update \
  --resource-group $RESOURCE_GROUP \
  --vnet-name $VNET_NAME \
  --name infrastructure-subnet \
  --delegations Microsoft.App/environments
```

With the virtual network created, you can retrieve the ID for the infrastructure subnet.

```azurecli
INFRASTRUCTURE_SUBNET=`az network vnet subnet show --resource-group ${RESOURCE_GROUP} --vnet-name $VNET_NAME --name infrastructure-subnet --query "id" -o tsv | tr -d '[:space:]' `
```

## Create an environment

Create the Container Apps environment using the custom VNet deployed in the preceding steps.

```azurecli
az containerapp env create \
  --name $ENVIRONMENT_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --infrastructure-subnet-resource-id $INFRASTRUCTURE_SUBNET
```

With the environment created, you can retrieve the environment ID.

```azurecli
ENVIRONMENT_ID=`az containerapp env show --resource-group ${RESOURCE_GROUP} --name ${ENVIRONMENT_NAME} --query "id"`
```

Disable public network access for the environment. This is needed to enable private endpoints.

```azurecli
az containerapp env update --id ${ENVIRONMENT_ID} --public-network-access Disabled
```

## Create a private endpoint

Create the private endpoint.

```azurecli
az network private-endpoint create \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --name $PRIVATE_ENDPOINT \
    --subnet $INFRASTRUCTURE_SUBNET \
    --private-connection-resource-id $ENVIRONMENT_ID \
    --connection-name $CONNECTION \
    --group-id managedEnvironments
```

## Deploy a container app

Run the following command to deploy a container app in your environment.

```azurecli
az containerapp up \
  --name $CONTAINERAPP_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --environment $ENVIRONMENT_NAME \
  --image mcr.microsoft.com/k8se/quickstart:latest \
  --target-port 80 \
  --ingress external \
  --query properties.configuration.ingress.fqdn
```

When you browse to the container app endpoint, you receive `ERR_CONNECTION_CLOSED` because the container app environment has public access disabled.

::: zone-end

## Test connection

1. Open [Private Link Center](https://portal.azure.com/#blade/Microsoft_Azure_Network/PrivateLinkCenterBlade/overview).

1. Select **Private endpoints**.

1. Select your private endpoint.

1. Expand **Monitoring** and select **Metrics**.

1. Set **Metric** to **Bytes in**.

1. Verify the graph shows data flowing. Expect a delay of approximately 10 minutes.

For more information, see [Create a private endpoint](/azure/private-link/create-private-endpoint-portal?tabs=dynamic-ip#test-connectivity-to-the-private-endpoint) and [Troubleshoot Azure Private Link Service connectivity problems](/azure/private-link/troubleshoot-private-link-connectivity).

## Clean up resources

If you're not going to continue to use this application, you can remove the **my-container-apps** resource group. This deletes the Azure Container Apps instance and all associated services. It also deletes the resource group that the Container Apps service automatically created and which contains the custom network components.

::: zone pivot="azure-cli"

> [!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If resources outside the scope of this guide exist in the specified resource group, they will also be deleted.

```azurecli-interactive
az group delete --name $RESOURCE_GROUP
```

::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Managing autoscaling behavior](scale-app.md)
