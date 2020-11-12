---
title: Zone-redundant registry for high availability
description: Learn about enabling zone redundancy in Azure Container Registry by creating a container registry or geo-replica in an Azure availability zone. Zone redundancy is a feature of the Premium service tier.
ms.topic: article
ms.date: 11/10/2020
---

# Enable zone redundancy in Azure Container Registry for resiliency and high availability

In addition to [geo-replication](container-registry-geo-replication.md), which replicates registry data across one or more Azure regions to provide availability and reduce latency for regional operations, Azure Container Registry provides *zone redundancy* in selected regions. 

This article shows how to set up a zone-redundant container registry or zone-redundant replica by using an Azure Resource Manager template. Zone redundancy provides resiliency and high availability to a registry or replica in a specific region.

Zone redundancy is a **preview** feature of the Premium container registry service tier. For information about registry service tiers and limits, see [Azure Container Registry service tiers](container-registry-skus.md).

## Limitations

The following are current limitations of zone redundancy in Azure Container Registry:

* Supported only in the following regions: East US, East US 2, and West US 2.
* Can only be enabled in a registry or a regional replica when you create the resource.
* Can't be disabled after it's enabled. You can't migrate a zone-redundant registry or replica to a non-zone-redundant state, nor the other way around. You also can't downgrade the registry to a different service tier.
* [ACR Tasks](container-registry-tasks-overview.md) aren't currently supported.
* Can only be enabled by using an Azure Resource Manager template.

## About zone redundancy

Use Azure [availability zones](../availability-zones/az-overview.md) to create a resilient and high availability Azure container registry (or geo-replica) in a specific Azure region. For example, organizations can set up a zone-redundant Azure container registry with other [supported Azure resources](../availability-zones/az-region.md) to meet data residency or other compliance requirements while providing high availability.

Availability zones are unique physical locations within an Azure region. To ensure resiliency, there's a minimum of three separate zones in all enabled regions. Each zone has one or more datacenters equipped with independent power, cooling, and networking. When configured for zone redundancy, a registry (or a registry replica in a different region) is replicated across all availability zones in the region, protecting against datacenter failures.

## Create a zone-redundant registry - template

### Create a resource group

If needed, run the [az group create](/cli/az/group#az_group_create) command to create a resource group for the registry in a region that [supports availability zones](../availability-zones/az-region.md) for Azure Container Registry.

```azurecli
az group create --name <resource-group-name> --location <location>
```

### Deploy the template 

You can use the following Resource Manager template to create a registry in a supported region and enable zone redundancy. Copy the following contents to a new file and save it using a filename such as `registryZone.json`.

```JSON
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "registryName": {
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
        "description": "Location for registry."
      }
    }
  },
  "variables": {},
  "resources": [
    {
      "type": "Microsoft.ContainerRegistry/registries",
      "apiVersion": "2020-11-01-preview",
      "name": "[parameters('registryName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Premium",
        "tier": "Premium"
      },
      "properties": {
        "zoneRedundancy": "Enabled",
        "adminUserEnabled": false,
        "dataEndpointEnabled": true,
        "networkRuleSet": {
          "defaultAction": "Allow",
          "virtualNetworkRules": [],
          "ipRules": []
        },
        "policies": {
          "quarantinePolicy": {
            "status": "disabled"
          },
          "trustPolicy": {
            "type": "Notary",
            "status": "disabled"
          },
          "retentionPolicy": {
            "days": 7,
            "status": "disabled"
          }
        }
      }
    }
  ]
}
```

Run the following [az deployment group create](/cli/az/deployment#az_group_deployment_create) command to create the registry using the preceding template file. Where indicated, provide a unique registry name, or deploy the template without parameters and it will create a unique name for you.

```azurecli
az deployment group create \
  --resource-group <resource-group-name> \
  --template-file registryZone.json \
  --parameters \
    registryName=<registry-name>
```

In the command output, note the `zoneRedundancy` property. When enabled, the registry is zone redundant:

```JSON
{
 [...]
"zoneRedundancy": "enabled",
}
```

## Create a zone-redundant replica

You can use the following Resource Manager template to create a registry replica in a supported region and enable zone redundancy. Copy the following contents to a new file and save it using a filename such as `replicaZone.json`.

> [!NOTE]
> You can enable zone redundancy when creating a replica even if the original registry (sometimes called the *home replica*) isn't zone redundant.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
      "existingRegistryName": {
        "type": "string",
        "metadata": {
          "description": "Name of the registry to add a replica to"
        }
      },
      "location": {
        "type": "string",
        "metadata": {
          "description": "Short name for registry replica location."
        }
      }
    },
    "resources": [
      {
      "type": "Microsoft.ContainerRegistry/registries/replications",
      "apiVersion": "2020-11-01-preview",
      "name": "[concat(parameters('existingRegistryName'), '/', parameters('location'))]",
      "location": "[parameters('location')]",
      "properties": {
        "zoneRedundancy":"enabled",
        "regionEndpointEnabled": true
      }
    }
    ]
  }
```

Run the following [az deployment group create](/cli/az/deployment#az_group_deployment_create) command to create the replica using the preceding template file. Where indicated, provide the name of the existing registry and the location of the relica. The location must be a region that [supports availability zones](../availability-zones/az-region.md) for Azure Container Registry.

```azurecli
az deployment group create \
  --template-file replicaZone.json \
  --parameters \
    registryName=<registry-name> \
    location=<short-region-name>
```

In the command output, note the `zoneRedundancy` property. When enabled, the replica is zone redundant:

```JSON
{
 [...]
"zoneRedundancy": "enabled",
}
```

## Next steps

* Learn more about [regions that support availability zones](../availability-zones/az-region.md).
* Learn more about building for [reliability](../architecture/framework/resiliency/overview.md) in Azure.