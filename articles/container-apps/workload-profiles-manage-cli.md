---
title: Create a Consumption + Dedicated workload profiles environment (preview) 
description: Learn to create an environment with a specialized hardware profile. 
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic:  how-to
ms.date: 04/11/2023
ms.author: cshoe
zone_pivot_groups: container-apps-vnet-types
---

# Manage workload profiles in a Consumption + Dedicated workload profiles plan structure (preview)

Learn to manage a Container Apps environment with workload profile support.

## Supported regions

The following regions support workload profiles during preview:

- North Central US
- North Europe
- West Europe
- East US

<a id="create"></a>

## Create a container app in a profile

::: zone pivot="aca-vnet-managed"

Azure Container Apps run in an environment, which uses a virtual network (VNet). By default, your Container App environment is created with a managed VNet that is automatically generated for you. Generated VNets are inaccessible to you as they're created in Microsoft's tenant.

Create a container apps environment with a [custom VNet](./workload-profiles-manage-cli.md?pivots=aca-vnet-custom) if you need any of the following features:

- [User defined routes](user-defined-routes.md)
- Integration with Application Gateway
- Network Security Groups
- Communicating with resources behind private endpoints in your virtual network

::: zone-end

::: zone pivot="aca-vnet-custom"

When you create an environment with a custom VNet, you have full control over the VNet configuration. This amount of control gives you the option to implement the following features:

- [User defined routes](user-defined-routes.md)
- Integration with Application Gateway
- Network Security Groups
- Communicating with resources behind private endpoints in your virtual network

::: zone-end

Use the following commands to create an environment with workload profile support.

::: zone pivot="aca-vnet-custom"

1. Create a VNet.

      ```bash
      az network vnet create \
        --address-prefixes 13.0.0.0/23 \
        --resource-group "<RESOURCE_GROUP>" \
        --location "<LOCATION>" \
        --name "<VNET_NAME>"
      ```

1. Create a subnet delegated to `Microsoft.App/environments`.

      ```bash
      az network vnet subnet create \
        --address-prefixes 13.0.0.0/23 \
        --delegations Microsoft.App/environments \
        --name "<SUBNET_NAME>" \
        --resource-group "<RESOURCE_GROUP>" \
        --vnet-name "<VNET_NAME>" \
        --query "id"
      ```

     Copy the ID value and paste into the next command.

     The `Microsoft.App/environments` delegation is required to give the Container Apps runtime the needed control over your VNet to run workload profiles in the Container Apps environment.

     You can specify as small as a `/27` CIDR (32 IPs-8 reserved) for the subnet. Some things to consider if you're going to specify a `/27` CIDR:

      - There are 11 IP addresses reserved for Container Apps infrastructure. Therefore, a `/27` CIDR has a maximum of 21 IP available addresses.

      - IP addresses are allocated differently between Consumption and Dedicated profiles:

        | Consumption | Consumption + Dedicated |
        |---|---|  
        | Every replica requires one IP. Users can't have apps with more than 21 replicas across all apps. Zero downtime deployment requires double the IPs since the old revision is running until the new revision is successfully deployed. | Every instance (VM node) requires a single IP.  You can have up to 21 instances across all workload profiles, and hundreds or more replicas running on these workload profiles. |

    ::: zone-end

1. Create *Consumption + Dedicated* environment with workload profile support

    ::: zone pivot="aca-vnet-custom"

    >[!Note]
    > In Container Apps, you can configure whether your Container Apps will allow public ingress or only ingress from within your VNet at the environment level. In order to restrict ingress to just your VNet, you need to set the `--internal-only` flag.

    # [External environment](#tab/external-env)

    ```bash
    az containerapp env create \
      --enable-workload-profiles \
      --resource-group "<RESOURCE_GROUP>" \
      --name "<NAME>" \
      --location "<LOCATION>"
    ```

    # [Internal environment](#tab/internal-env)

    ```bash
    az containerapp env create \
      --enable-workload-profiles \
      --resource-group "<RESOURCE_GROUP>" \
      --name "<NAME>" \
      --location "<LOCATION>" \
      --infrastructure-subnet-resource-id "<SUBNET_ID>" \
      --internal-only true
    ```

    ---

    ::: zone-end

    ::: zone pivot="aca-vnet-managed"

    ```bash
    az containerapp env create \
      --enable-workload-profiles \
      --resource-group "<RESOURCE_GROUP>" \
      --name "<NAME>" \
      --location "<LOCATION>"
    ```

    ::: zone-end

      This command can take up to 10 minutes to complete.

1. Check status of environment. Here, you're looking to see if the environment is created successfully.

      ```bash
      az containerapp env show \
        --name "<ENVIRONMENT_NAME>" \
        --resource-group "<RESOURCE_GROUP>"
      ```

      The `provisioningState` needs to report `Succeeded` before moving on to the next command.

1. Create a new container app.

    # [External environment](#tab/external-env)

      ```azurecli
      az containerapp create \
        --resource-group "<RESOURCE_GROUP>" \
        --name "<CONTAINER_APP_NAME>" \
        --target-port 80 \
        --ingress external \
        --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \
        --environment "<ENVIRONMENT_NAME>" \
        --workload-profile-name "Consumption"
      ```

    # [Internal environment](#tab/internal-env)

      ```azurecli
      az containerapp create \
        --resource-group "<RESOURCE_GROUP>" \
        --name "<CONTAINER_APP_NAME>" \
        --target-port 80 \
        --ingress internal \
        --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \
        --environment "<ENVIRONMENT_NAME>" \
        --workload-profile-name "Consumption"
      ```

    ---

    This command deploys the application to the built-in Consumption workload profile. If you want to create an app in a dedicated workload profile, you first need to [add the profile to the environment](#add-profiles).

    This command creates the new application in the environment using a specific workload profile.

## Add profiles

Add a new workload profile to an existing environment.

```azurecli
az containerapp env workload-profile set \
  --resource-group <RESOURCE_GROUP> \
  --name <ENVIRONMENT_NAME> \
  --workload-profile-type <WORKLOAD_PROFILE_TYPE> \
  --workload-profile-name <WORKLOAD_PROFILE_NAME> \
  --min-nodes <MIN_NODES> \
  --max-nodes <MAX_NODES>
```

The value you select for the `<WORKLOAD_PROFILE_NAME>` placeholder is the workload profile "friendly name".

Using friendly names allow you to add multiple profiles of the same type to an environment. The friendly name is what you use as you deploy and maintain a container app in a workload profile.

## Edit profiles

You can modify the minimum and maximum number of nodes used by a workload profile via the `set` command.

```azurecli
az containerapp env workload-profile set \
  --resource-group <RESOURCE_GROUP> \
  --name <ENV_NAME> \
  --workload-profile-type <WORKLOAD_PROFILE_TYPE> \
  --workload-profile-name <WORKLOAD_PROFILE_NAME> \
  --min-nodes <MIN_NODES> \
  --max-nodes <MAX_NODES>
```

## Delete a profile

Use the following command to delete a workload profile.

```azurecli
az containerapp env workload-profile delete \
  --resource-group "<RESOURCE_GROUP>" \
  --name <ENVIRONMENT_NAME> \
  --workload-profile-name <WORKLOAD_PROFILE_NAME> 
```

> [!NOTE]
> The *Consumption* workload profile can’t be deleted.

## Inspect profiles

The following commands allow you to list available profiles in your region and ones used in a specific environment.

### List available workload profiles

Use the `list-supported` command to list the supported workload profiles for your region.

The following Azure CLI command displays the results in a table  

```azurecli
az containerapp env workload-profile list-supported \
  --location <LOCATION>  \
  --query "[].{Name: name, Cores: properties.cores, MemoryGiB: properties.memoryGiB, Category: properties.category}" \
  -o table
```

The response resembles a table similar to the below example:

```output
Name         Cores    MemoryGiB    Category
-----------  -------  -----------  ---------------
D4           4        16           GeneralPurpose
D8           8        32           GeneralPurpose
D16          16       64           GeneralPurpose
E4           4        32           MemoryOptimized
E8           8        64           MemoryOptimized
E16          16       128          MemoryOptimized
Consumption  4        8            Consumption
```

Select a workload profile and use the *Name* field when you run `az containerapp env workload-profile set` for the `--workload-profile-type` option.

### Show a workload profile

Display details about a workload profile.

```azurecli
az containerapp env workload-profile show \
  --resource-group <RESOURCE_GROUP> \
  --name <ENVIRONMENT_NAME> \
  --workload-profile-name <WORKLOAD_PROFILE_NAME> 
```

## Next steps

> [!div class="nextstepaction"]
> [Workload profiles overview](./workload-profiles-overview.md)
