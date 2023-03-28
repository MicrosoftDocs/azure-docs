---
title: Create a Consumption with Dedicated workload profiles environment (preview) 
description: Learn to create an environment with a specialized hardware profile. 
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic:  how-to
ms.date: 03/27/2023
ms.author: cshoe
---

# Create a Consumption with Dedicated workload profiles environment (preview)

## Prerequisites

- Resource group
- Select from a supported location during preview
  - North Central US
  - North Europe
  - West Europe
  - East US

## List available workload profiles

Use this command to list the supported workload profiles for your region.

```azurecli
az containerapp env workload-profile list-supported \
  --location <LOCATION> 
  -o table
```

The response will resemble a table similar to the below example:

```output
Location     Name
-----------  -----------
northeurope  D4
northeurope  D8
northeurope  D16
northeurope  E4
northeurope  E8
northeurope  E16
northeurope  F4
northeurope  F8
northeurope  F16
northeurope  Consumption
```

Select a workload profile and us the *Name* when you run `az containerapp create` for the `--workload-profile-type` option.

## Create a new environment with a workload profile

At a high level, you execute the following steps to create a container app that uses a specific workload profile.

- Select a workload profile
- Create or provide a VNet 
- Create a subnet with a `Microsoft.App/environments` delegation
- Create a new environment
- Create a container app associated with the workload profile in the environment

1. Create a VNet

      ```bash
      az network vnet create \
        --address-prefixes 13.0.0.0/26 \
        --resource-group "<RESOURCE_GROUP>" \
        --location "<LOCATION>" \
        --name "<VNET_NAME>"
      ```

1. Create a subnet

      ```bash
      az network vnet subnet create \
        --address-prefixes 13.0.0.0/26 \
        --delegations Microsoft.App/environments \
        --name "<SUBNET_NAME>" \
        --resource-group "<RESOURCE_GROUP>" \
        --vnet-name "<VNET_NAME>" \
        --query "id"
      ```

      Copy the ID value and paste into the next command.

      As mentioned above, you can specify as small as a `/27` CIDR (32 IPs-8 reserved) for the subnet. Some things to consider if you are going to specify a `/27` CIDR: 

      - 11 IP addresses are reserved for ACA infrastructure requirements. Hence, a `/27` CIDR will have a maximum of 21 IP addresses available.

      - IP addresses are allocated differently between Consumption and Dedicated profiles:

        | Consumption | Consumption + Dedicated |
        |---|---|  
        | Every replica requires 1 IP. Users cannot have apps with more than 21 replicas across all apps. Note that zero downtime deployment requires double the IPs since the old revision is running until the new revision is successfully deployed. | Every instance (VM node) requires 1 IP.  You can have up to 21 instances across all workload profiles, and hundreds or more replicas running on these workload profiles. |

1. Create *Consumption + Dedicated* environment with workload profile support

      ```bash
      az containerapp env create \
        --enableWorkloadProfiles \
        --resource-group "<RESOURCE_GROUP>" \
        --name "<NAME>" \
        --location "<LOCATION>" \
        --infrastructure-subnet-resource-id "<SUBNET_ID>"
      ```

<!-- "/subscriptions/$SUBCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Network/virtualNetworks/$VNET_NAME/subnets/$SUBNET_NAME" -->

  This command can take up to 10 minutes to complete.

1. Check status of environment. Here, you're looking to see if the environment is created successfully.

      ```bash
      az containerapp env show \
        --name "<ENVIRONMENT_NAME>" \
        --resource-group "<RESOURCE_GROUP>"
      ```

      The `provisioningState` needs to report `Succeeded` before moving on to the next command.

1. Create a new container app.

      ```azurecli
      az containerapp create \
        --resource-group "<RESOURCE_GROUP>" \
        --name "<CONTAINER_APP_NAME>" \
        --target-port 80 \
        --ingress external \
        --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \
        --environment "<ENVIRONMENT_NAME>" \
        --workload-profile-name "<WORKLOAD_PROFILE_NAME>"
      ```

    This uses creates the new application in the environment using a specific workload profile.

## Show a workload profile

Display details about a workload profile.

```azurecli
az containerapp env workload-profile show \
  --resource-group <RESOURCE_GROUP> \
  --name <ENVIRONMENT_NAME> \
  --workload-profile-name <WORKLOAD_PROFILE_NAME> 
```

## Delete a workload profile from an environment

```azurecli
az containerapp env workload-profile delete \
  --resource-group "<RESOURCE_GROUP>" \
  --name <ENVIRONMENT_NAME> \
  --workload-profile-name <WORKLOAD_PROFILE_NAME> 
```

> [!NOTE]
> The *Consumption* workload profile can’t be deleted.

## List profiles

The following commands allow you to list available profiles in your region and ones used in a specific environment.

### List profiles used by an environment

```azurecli
az containerapp env workload-profile list-supported \
  --location "<LOCATION>"
```

## Next section

| Cores | Memory Gi |
|---|---|
| 0.20 | 0.5 |
| 0.5 | 1 |
| 0.75  | 1.5 |
| 1 | 2 |
| 1.25 | 2.5 |
| 1.5 | 3 |
| 1.75 | 3.5 |
| 2 | 4 |
| 2.25 | 4.5 |
| 2.5 | 5 |
| 2.75 | 5.5 |
| 3 | 6 |
| 3.25 | 6.5 |
| 3.5 | 7 |
| 3.75 | 7.5 |
| 4 | 8 |
