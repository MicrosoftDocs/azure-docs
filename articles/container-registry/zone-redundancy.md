---
title: Zone-redundant registry for high availability
description: Learn about enabling zone redundancy in Azure Container Registry. Create a container registry or replication in an Azure availability zone. Zone redundancy is a feature of the Premium service tier.
ms.topic: article
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 10/11/2022
ms.custom: references_regions, devx-track-azurecli

---

# Enable zone redundancy in Azure Container Registry for resiliency and high availability

In addition to [geo-replication](container-registry-geo-replication.md), which replicates registry data across one or more Azure regions to provide availability and reduce latency for regional operations, Azure Container Registry supports optional *zone redundancy*. [Zone redundancy](../availability-zones/az-overview.md#availability-zones) provides resiliency and high availability to a registry or replication resource (replica) in a specific region.

This article shows how to set up a zone-redundant container registry or replica by using the Azure CLI, Azure portal, or Azure Resource Manager template. 

Zone redundancy is a  feature of the Premium container registry service tier. For information about registry service tiers and limits, see [Azure Container Registry service tiers](container-registry-skus.md).

## Regional Support

* ACR Availability Zones are supported in the following regions: 
  
    |Americas  |Europe  |Africa  |Asia Pacific  |
    |---------|---------|---------|---------|
    |Brazil South<br/>Canada Central<br/>Central US<br/>East US<br/>East US 2<br/>East US 2 EUAP<br/>South Central US<br/>US Government Virginia<br/>West US 2<br/>West US 3     |France Central<br/>Germany West Central<br/>North Europe<br/>Norway East<br/>Sweden Central<br/>Switzerland North<br/>UK South<br/>West Europe    |South Africa North<br/>        |Australia East<br/>Central India<br/>China North 3<br/>East Asia<br/>Japan East<br/>Korea Central<br/>Qatar Central<br/>Southeast Asia<br/>UAE North     |

* Region conversions to availability zones aren't currently supported. 
* To enable availability zone support in a region, create the registry in the desired region with availability zone support enabled, or add a replicated region with availability zone support enabled.
* A registry with an AZ-enabled stamp creates a home region replication with an AZ-enabled stamp by default. The AZ stamp can't be disabled once it's enabled.
* The home region replication represents the home region registry. It helps to view and manage the availability zone properties and can't be deleted.
* The availability zone is per region, once the replications are created, their states can't be changed, except by deleting and re-creating the replications.
* Zone redundancy can't be disabled in a region.
* [ACR Tasks](container-registry-tasks-overview.md) doesn't yet support availability zones.


## About zone redundancy

Use Azure [availability zones](../availability-zones/az-overview.md) to create a resilient and high availability Azure container registry within an Azure region. For example, organizations can set up a zone-redundant Azure container registry with other [supported Azure resources](../availability-zones/az-region.md) to meet data residency or other compliance requirements, while providing high availability within a region.

Azure Container Registry also supports [geo-replication](container-registry-geo-replication.md), which replicates the service across multiple regions, enabling redundancy and locality to compute resources in other locations. The combination of availability zones for redundancy within a region, and geo-replication across multiple regions, enhances both the reliability and performance of a registry.

Availability zones are unique physical locations within an Azure region. To ensure resiliency, there's a minimum of three separate zones in all enabled regions. Each zone has one or more datacenters equipped with independent power, cooling, and networking. When configured for zone redundancy, a registry (or a registry replica in a different region) is replicated across all availability zones in the region, keeping it available if there are datacenter failures.

## Create a zone-redundant registry - CLI

To use the Azure CLI to enable zone redundancy, you need Azure CLI version 2.17.0 or later, or Azure Cloud Shell. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

### Create a resource group

If needed, run the [az group create](/cli/azure/group#az-group-create) command to create a resource group for the registry.

```azurecli
az group create --name <resource-group-name> --location <location>
```

### Create zone-enabled registry

Run the [az acr create](/cli/azure/acr#az-acr-create) command to create a zone-redundant registry in the Premium service tier. Choose a region that [supports availability zones](../availability-zones/az-region.md) for Azure Container Registry. In the following example, zone redundancy is enabled in the *eastus* region. See the `az acr create` command help for more registry options.

```azurecli
az acr create \
  --resource-group <resource-group-name> \
  --name <container-registry-name> \
  --location eastus \
  --zone-redundancy enabled \
  --sku Premium
```

In the command output, note the `zoneRedundancy` property for the registry. When enabled, the registry is zone redundant:

```JSON
{
 [...]
"zoneRedundancy": "Enabled",
}
```

### Create zone-redundant replication

Run the [az acr replication create](/cli/azure/acr/replication#az-acr-replication-create) command to create a zone-redundant registry replica in a region that [supports availability zones](../availability-zones/az-region.md) for Azure Container Registry, such as *westus2*. 

```azurecli
az acr replication create \
  --location westus2 \
  --resource-group <resource-group-name> \
  --registry <container-registry-name> \
  --zone-redundancy enabled
```
 
In the command output, note the `zoneRedundancy` property for the replica. When enabled, the replica is zone redundant:

```JSON
{
 [...]
"zoneRedundancy": "Enabled",
}
```

## Create a zone-redundant registry - portal

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Create a resource** > **Containers** > **Container Registry**.
1. In the **Basics** tab, select or create a resource group, and enter a unique registry name. 
1. In **Location**, select a region that supports zone redundancy for Azure Container Registry, such as *East US*.
1. In **SKU**, select **Premium**.
1. In **Availability zones**, select **Enabled**.
1. Optionally, configure more registry settings, and then select **Review + create**.
1. Select **Create** to deploy the registry instance.

    :::image type="content" source="media/zone-redundancy/enable-availability-zones-portal.png" alt-text="Enable zone redundancy in Azure portal":::

To create a zone-redundant replication:

1. Navigate to your Premium tier container registry, and select **Replications**.
1. On the map that appears, select a green hexagon in a region that supports zone redundancy for Azure Container Registry, such as **West US 2**. Or select **+ Add**.
1. In the **Create replication** window, confirm the **Location**. In **Availability zones**, select **Enabled**, and then select **Create**.

    :::image type="content" source="media/zone-redundancy/enable-availability-zones-replication-portal.png" alt-text="Enable zone-redundant replication in Azure portal":::

## Create a zone-redundant registry - template

### Create a resource group

If needed, run the [az group create](/cli/azure/group#az-group-create) command to create a resource group for the registry in a region that [supports availability zones](../availability-zones/az-region.md) for Azure Container Registry, such as *eastus*. This region is used by the template to set the registry location.

```azurecli
az group create --name <resource-group-name> --location eastus
```

### Deploy the template 

You can use the following Resource Manager template to create a zone-redundant, geo-replicated registry. The template by default enables zone redundancy in the registry and a regional replica. 

Copy the following contents to a new file and save it using a filename such as `registryZone.json`.

```JSON
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
      "acrName": {
        "type": "string",
        "defaultValue": "[concat('acr', uniqueString(resourceGroup().id))]",
        "minLength": 5,
        "maxLength": 50,
        "metadata": {
          "description": "Globally unique name of your Azure Container Registry"
        }
      },
      "location": {
        "type": "string",
        "defaultValue": "[resourceGroup().location]",
        "metadata": {
          "description": "Location for registry home replica."
        }
      },
      "acrSku": {
        "type": "string",
        "defaultValue": "Premium",
        "allowedValues": [
          "Premium"
        ],
        "metadata": {
          "description": "Tier of your Azure Container Registry. Geo-replication and zone redundancy require Premium SKU."
        }
      },
      "acrZoneRedundancy": {
        "type": "string",
        "defaultValue": "Enabled",
        "metadata": {
          "description": "Enable zone redundancy of registry's home replica. Requires registry location to support availability zones."
        }
      },
      "acrReplicaLocation": {
        "type": "string",
        "metadata": {
          "description": "Short name for registry replica location."
        }
      },
      "acrReplicaZoneRedundancy": {
        "type": "string",
        "defaultValue": "Enabled",
        "metadata": {
          "description": "Enable zone redundancy of registry replica. Requires replica location to support availability zones."
        }
      }
    },
    "resources": [
      {
        "comments": "Container registry for storing docker images",
        "type": "Microsoft.ContainerRegistry/registries",
        "apiVersion": "2020-11-01",
        "name": "[parameters('acrName')]",
        "location": "[parameters('location')]",
        "sku": {
          "name": "[parameters('acrSku')]",
          "tier": "[parameters('acrSku')]"
        },
        "tags": {
          "displayName": "Container Registry",
          "container.registry": "[parameters('acrName')]"
        },
        "properties": {
          "adminUserEnabled": "[parameters('acrAdminUserEnabled')]",
          "zoneRedundancy": "[parameters('acrZoneRedundancy')]"
        }
      },
      {
        "type": "Microsoft.ContainerRegistry/registries/replications",
        "apiVersion": "2020-11-01",
        "name": "[concat(parameters('acrName'), '/', parameters('acrReplicaLocation'))]",
        "location": "[parameters('acrReplicaLocation')]",
          "dependsOn": [
          "[resourceId('Microsoft.ContainerRegistry/registries/', parameters('acrName'))]"
        ],
        "properties": {
          "zoneRedundancy": "[parameters('acrReplicaZoneRedundancy')]"
        }
      }
    ],
    "outputs": {
      "acrLoginServer": {
        "value": "[reference(resourceId('Microsoft.ContainerRegistry/registries',parameters('acrName')),'2019-12-01').loginServer]",
        "type": "string"
      }
    }
  }
```

Run the following [az deployment group create](/cli/azure/deployment/group#az-deployment-group-create) command to create the registry using the preceding template file. Where indicated, provide:

* a unique registry name, or deploy the template without parameters and it will create a unique name for you
* a location for the replica that supports availability zones, such as *westus2*

```azurecli
az deployment group create \
  --resource-group <resource-group-name> \
  --template-file registryZone.json \
  --parameters acrName=<registry-name> acrReplicaLocation=<replica-location>
```

In the command output, note the `zoneRedundancy` property for the registry and the replica. When enabled, each resource is zone redundant:

```JSON
{
 [...]
"zoneRedundancy": "Enabled",
}
```

## Next steps

* Learn more about [regions that support availability zones](../availability-zones/az-region.md).
* Learn more about building for [reliability](/azure/architecture/framework/resiliency/app-design) in Azure.
