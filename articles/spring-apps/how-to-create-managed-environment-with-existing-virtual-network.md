# Create Managed Environment with existing Virtual Network

The following example shows you how to create a Managed Environment in an existing virtual network.

## Prerequisites

- Install the [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) version 2.28.0 or higher.

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
    MANAGED_ENVIRONMENT="my-environment"
```

## Create an environment

A Managed Environment creates a secure boundary around a group apps. Apps deployed to the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace.

6. Next, declare a variable to hold the VNET name


```bash
    VNET_NAME="my-custom-vnet"
```

7. Now create an Azure virtual network to associate with the Managed Environment. The virtual network must have a subnet available for the environment deployment

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

9. Finally, create the Managed Environment using the custom VNET deployed in the preceding steps


```azurecli
    az containerapp env create \
    --name $MANAGED_ENVIRONMENT \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --infrastructure-subnet-resource-id $INFRASTRUCTURE_SUBNET
```

> [!NOTE]
> You can create an internal Managed Environment that doesn't use a public static IP, only internal IP addresses available in the custom VNET. Please refer: [Create an Internal Managed Environment](https://learn.microsoft.com/en-us/azure/container-apps/vnet-custom-internal?tabs=bash&pivots=azure-cli#create-an-environment)

The following table describes the parameters used in `containerapp env create`.

| Parameter | Description |
|---|---|
| `name` | Name of the Managed Environment. |
| `resource-group` | Name of the resource group. |
| `location` | The Azure location where the environment is to deploy.  |
| `infrastructure-subnet-resource-id` | Resource ID of a subnet for infrastructure components and user application containers. |
| `internal-only` | (Optional) The environment doesn't use a public static IP, only internal IP addresses available in the custom VNET. (Requires an infrastructure subnet resource ID.) |