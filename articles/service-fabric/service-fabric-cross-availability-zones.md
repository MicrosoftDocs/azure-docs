---
title: Deploy an Azure Service Fabric cluster across availability zones| Microsoft Docs
description: Learn how to create an Azure Service Fabric cluster across availability zones.
services: service-fabric
documentationcenter: .net
author: peterpogorski
manager: chackdan
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 04/17/2019
ms.author: pepogors

---
# Overview
Availability Zones is a high-availability offering that protects your applications and data from datacenter failures. Availability Zones are unique physical locations within an Azure region. Each zone is made up of one or more datacenters equipped with independent power, cooling, and networking.

Service Fabric supports clusters which span across availability zones through the deployment of node types which are pinned to zones in a supported region.

Azure Availability Zones are only available in select regions. Please see the [Azure Availability Zones Overview](https://docs.microsoft.com/azure/availability-zones/az-overview) for more details.

## Recommended Topology for primary node type of Azure Service Fabric clusters spanning across zones
To ensure that a Service Fabric cluster which is distributed across availability zones it is important that a primary node type is located in each of the zones supported by the region. This can be marking multiple node types as primary will distribute seed nodes evenly across the multiple primary node types. The topology for the primary node type requires the resources outlined below:

* Single Public IP Resource - Standard SKU.
* Single Load Balancer Resource - Standard SKU.
* 3 Node Types marked as primary. Each Node Type should be mapped to its own Virtual Machine Scale Set (VMSS) located in different zones.
* Each Node Type should have at least 5 nodes (Silver Durability).
* The cluster reliability setting should be Platinum (Run the System services with a target replica set count of seven and nine seed nodes).

>[!NOTE]
> Service Fabric does not support Virutal Machine Scale Sets which span zones.

 ![Azure Service Fabric Availability Zone ArchitectureV][sf-architecture]

## Networking Requirements
### Load Balancer and IP Resources
To enables zones on a VMSS resource the load balancer and IP resource that is referenced by the VMSS must both be using a standard SKU. When creating a load balancer or IP resource without the SKU property, the default SKU will be basic, and the resources will not have the ability to support availability zones. 

```json
{
    "apiVersion": "2018-11-01",
    "type": "Microsoft.Network/publicIPAddresses",
    "name": "[concat('LB','-', parameters('clusterName')]",
    "location": "[parameters('computeLocation')]",
    "sku": {
        "name": "Standard"
    }
}
```

```json
{
    "apiVersion": "2018-11-01",
    "type": "Microsoft.Network/loadBalancers",
    "name": "[concat('LB','-', parameters('clusterName')]", 
    "location": "[parameters('computeLocation')]",
    "dependsOn": "[]",
    "sku": {
        "name": "Standard"
    }
}
```

### Virtual Machine Scale Set (VMSS) NAT Rules
The load balancer inbound NAT rules should match the NAT pools from the Virtual Machine Scale Set. Each Virtual Machine Scale Set must have a unique inbound NAT pool.
```json
{
"inboundNatPools": [
    {
        "name": "LoadBalancerBEAddressNatPool0",
        "properties": {
            "backendPort": "3389",
            "frontendIPConfiguration": {
                "id": "[variables('lbIPConfig0')]"
            },
            "frontendPortRangeEnd": "50999",
            "frontendPortRangeStart": "50000",
            "protocol": "tcp"
        }
    },
    {
        "name": "LoadBalancerBEAddressNatPool1",
        "properties": {
            "backendPort": "3389",
            "frontendIPConfiguration": {
                "id": "[variables('lbIPConfig0')]"
            },
            "frontendPortRangeEnd": "51999",
            "frontendPortRangeStart": "51000",
            "protocol": "tcp"
        }
    },
    {
        "name": "LoadBalancerBEAddressNatPool2",
        "properties": {
            "backendPort": "3389",
            "frontendIPConfiguration": {
                "id": "[variables('lbIPConfig0')]"
            },
            "frontendPortRangeEnd": "52999",
            "frontendPortRangeStart": "52000",
            "protocol": "tcp"
        }
    }
    ]
}
```

## Enabling Zones on a Virtual Machine Scale Set
To enable a zone on a VMSS you must include two values in the VMSS resource. The first one is "zones" which specifies which availability zone in the region that you would like to deploy to. The second is the "singlePlacementGroup" property which must be set to true.

You must then also include the “faultDomainOverride” property in the Service Fabric VMSS Extension. The value for this property should include the zone in which this VMSS will be placed.

```json
{
    "apiVersion": "2018-10-01",
    "type": "Microsoft.Compute/virtualMachineScaleSets",
    "name": "[parameters('vmNodeType1Name')]",
    "location": "[parameters('computeLocation')]",
    "zones": ["1"],
    "properties": {
        "singlePlacementGroup": "true",
    },
    "virtualMachineProfile": {
    "extensionProfile": {
    "extensions": [
    {
    "name": "[concat(parameters('vmNodeType1Name'),'_ServiceFabricNode')]",
    "properties": {
        "type": "ServiceFabricNode",
        "autoUpgradeMinorVersion": false,
        "publisher": "Microsoft.Azure.ServiceFabric.Test",
        "settings": {
            "clusterEndpoint": "[reference(parameters('clusterName')).clusterEndpoint]",
            "nodeTypeRef": "[parameters('vmNodeType1Name')]",
            "dataPath": "D:\\\\SvcFab",
            "durabilityLevel": "Bronze",
            "TestExtension": true,
            "certificate": {
                "thumbprint": "[parameters('certificateThumbprint')]",
                "x509StoreName": "[parameters('certificateStoreValue')]"
            },
            "systemLogUploadSettings": {
                "Enabled": true
            },
            "faultDomainOverride": "eastus/az1"
        },
        "typeHandlerVersion": "1.0"
    }
}
```

## Enabling Multiple Primary Node Types in the Service Fabric Cluster Resource
To set multiple node types as primary in a cluster resource, set the isPrimary property to "true" for each of the node types that you would like to be a primary node type.

```json
{
    "nodeTypes": [
    {
        "name": "[parameters('vmNodeType0Name')]",
        "applicationPorts": {
            "endPort": "[parameters('nt0applicationEndPort')]",
            "startPort": "[parameters('nt0applicationStartPort')]"
        },
        "clientConnectionEndpointPort": "[parameters('nt0fabricTcpGatewayPort')]",
        "durabilityLevel": "Silver",
        "ephemeralPorts": {
            "endPort": "[parameters('nt0ephemeralEndPort')]",
            "startPort": "[parameters('nt0ephemeralStartPort')]"
        },
        "httpGatewayEndpointPort": "[parameters('nt0fabricHttpGatewayPort')]",
        "isPrimary": true,
        "vmInstanceCount": "[parameters('nt0InstanceCount')]"
    },
    {
        "name": "[parameters('vmNodeType1Name')]",
        "applicationPorts": {
            "endPort": "[parameters('nt1applicationEndPort')]",
            "startPort": "[parameters('nt1applicationStartPort')]"
        },
        "clientConnectionEndpointPort": "[parameters('nt1fabricTcpGatewayPort')]",
        "durabilityLevel": "Silver",
        "ephemeralPorts": {
            "endPort": "[parameters('nt1ephemeralEndPort')]",
            "startPort": "[parameters('nt1ephemeralStartPort')]"
        },
        "httpGatewayEndpointPort": "[parameters('nt1fabricHttpGatewayPort')]",
        "isPrimary": true,
        "vmInstanceCount": "[parameters('nt1InstanceCount')]"
    },
    {
        "name": "[parameters('vmNodeType2Name')]",
        "applicationPorts": {
            "endPort": "[parameters('nt2applicationEndPort')]",
            "startPort": "[parameters('nt2applicationStartPort')]"
        },
        "clientConnectionEndpointPort": "[parameters('nt2fabricTcpGatewayPort')]",
        "durabilityLevel": "Silver",
        "ephemeralPorts": {
            "endPort": "[parameters('nt2ephemeralEndPort')]",
            "startPort": "[parameters('nt2ephemeralStartPort')]"
        },
        "httpGatewayEndpointPort": "[parameters('nt2fabricHttpGatewayPort')]",
        "isPrimary": true,
        "vmInstanceCount": "[parameters('nt2InstanceCount')]"
    }
    ],
}

```

## Next steps
* Learn about [cluster security](service-fabric-cluster-security.md).
* Learn how to [rollover a cluster certificate](service-fabric-cluster-rollover-cert-cn.md)
* [Update and Manage cluster certificates](service-fabric-cluster-security-update-certs-azure.md)
* Simplify Certificate Management by [Changing cluster from certificate thumbprint to common name](service-fabric-cluster-change-cert-thumbprint-to-cn.md)

[sf-architecture]: .\media\service-fabric-availability-zones\az-architecture.png