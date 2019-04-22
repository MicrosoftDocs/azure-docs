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
# Deploy an Azure Service Fabric cluster across availability zones
## Overview
Availability Zones is a high-availability offering that protects your applications and data from datacenter failures. Availability Zones are unique physical locations within an Azure region. Each zone is made up of one or more datacenters equipped with independent power, cooling, and networking.

Service Fabric supports clusters that are able to span across availability zones through the deployment of node types that are pinned to zones in a supported region. Deploying a Service Fabric cluster across availability zones will ensure high-availability of your applications. Azure Availability Zones are only available in select regions. For more information, see [Azure Availability Zones Overview](https://docs.microsoft.com/azure/availability-zones/az-overview).

Sample templates are available: [cross availability zone templates](https://docs.microsoft.com/azure/availability-zones/az-overview)

## Recommended Topology for primary node type of Azure Service Fabric clusters spanning across availability zones
To ensure high availability of a Service Fabric cluster which is distributed across availability zones, it is important that a primary node type is located in each of the zones supported by the region. To spread a primary node type across, you
can mark multiple node types as primary which will distribute seed nodes evenly across the multiple primary node types.

The recommended topology for the primary node type requires the resources outlined below:
* A Single Public IP Resource using Standard SKU.
* A Single Load Balancer Resource using Standard SKU.
* Three Node Types marked as primary.
    * Each Node Type should be mapped to its own virtual machine scale set (VMSS) located in different zones.
    * Each virtual machine scale set should have at least five nodes (Silver Durability).
* The cluster reliability level set to Platinum.

>[!NOTE]
> Service Fabric does not support a single virtual machine scale set which span zones. The virtual machine scale set **single placement group property must be set to true**.

 ![Azure Service Fabric Availability Zone Architecture][sf-architecture]

## Networking Requirements
### Public IP and Load Balancer Resource
To enable the zones property on a virtual machine scale set resource, the load balancer and IP resource that is referenced by the virtual machine scale set must both be using a standard SKU. When creating a load balancer or IP resource without the SKU property, the default SKU will be basic, and the resources will not have the ability to support availability zones. A Standard SKU load balancer will by default block all traffic from the outside. To allow outside traffic, an NSG must be deployed to the subnet.

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

>[!NOTE]
> It is not possible to do an in-place change of SKU on the public IP and load balancer resources. If you are migrating from existing resources which are basic SKU see the migration section for more info. 


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

## Enabling zones on a Virtual Machine Scale Set
To enable a zone, on a virtual machine scale set you must include three values in the virtual machine scale set resource. The first value is the **zones** property that specifies which availability zone the virtual machine scale set will be deployed to. The second value is the "singlePlacementGroup" property that must be set to true.

The “faultDomainOverride” property in the Service Fabric virtual machine scale set extension needs to be included. The value for this property should include the region and zone in which this virtual machine scale set will be placed. Example: "faultDomainOverride": "eastus/az1" All virtual machine scale set resources must be placed in the same region as Service Fabric does not support clusters across regions.

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

## Enabling multiple primary Node Types in the Service Fabric Cluster resource
To set multiple node types as primary in a cluster resource, set the isPrimary property to "true" for each of the node types that you would like to mark as primary. When deploying a Service Fabric cluster across availability zones, you should have three node types in distinct zones.

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

## Migrate to using availability zones from a cluster using a Basic SKU Load Balancer and a Basic SKU IP
To migrate a cluster, which was using a Load Balancer and IP with a basic SKU, you must first create an entirely new Load Balancer and IP resource using the standard SKU. It is not possible to update these resources in-place. 

The new LB and IP should be referenced in the new cross availability zone node types that you would like to use. In the example above, three new virtual machine scale set resources were added in zones 1,2, and 3. These virtual machine scale sets reference the newly created LB and IP and are marked as primary node types in the Service Fabric Cluster Resource.

To migrate the system services over from the existing primary node type to the new cross availability zone node types, you must first disable with intent to remove all of the nodes in the existing primary node type.  The system services will then migrate to the new primary types as the nodes are disabled. This process takes several hours to complete due to the process of node and node type removal. 

```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint $ClusterName -KeepAliveIntervalInSec 10 `

KeepAliveIntervalInSec 10 `
    -X509Credential `
    -ServerCertThumbprint $thumb  `
    -FindType FindByThumbprint `
    -FindValue $thumb `
    -StoreLocation CurrentUser `
    -StoreName My 

Write-Host "Connected to cluster"

$nodeNames = @("_nt0_0", "_nt0_1", "_nt0_2", "_nt0_3", "_nt0_4")

Write-Host "Disabling nodes..."
foreach($name in $nodeNames) {
    Disable-ServiceFabricNode -NodeName $name -Intent RemoveNode -Force
}
```

Once the nodes are all disabled. You can delete the nodes and remove the node type from the Service Fabric cluster resource. You will also need to update the public IP. You can also delete the initial virtual machine scale set resource, IP resource, and Load Balancer resource.

```powershell
$scaleSetName="nt0"

Remove-AzureRmVmss -ResourceGroupName $groupname -VMScaleSetName $scaleSetName -Force

$lbname="LB-cluster-nt0"
$oldPublicIpName="LBIP-cluster-0"
$newPublicIpName="LBIP-cluster-1"

$oldprimaryPublicIP = Get-AzureRmPublicIpAddress -Name $oldPublicIpName  -ResourceGroupName $groupname
$primaryDNSName = $oldprimaryPublicIP.DnsSettings.DomainNameLabel
$primaryDNSFqdn = $oldprimaryPublicIP.DnsSettings.Fqdn

Remove-AzureRmLoadBalancer -Name $lbname -ResourceGroupName $groupname -Force
Remove-AzureRmPublicIpAddress -Name $oldPublicIpName -ResourceGroupName $groupname -Force

$PublicIP = Get-AzureRmPublicIpAddress -Name $newPublicIpName  -ResourceGroupName $groupname
$PublicIP.DnsSettings.DomainNameLabel = $primaryDNSName
$PublicIP.DnsSettings.Fqdn = $primaryDNSFqdn
Set-AzureRmPublicIpAddress -PublicIpAddress $PublicIP

foreach($name in $nodeNames){
    # Remove the node from the cluster
    Remove-ServiceFabricNodeState -NodeName $name -TimeoutSec 300 -Force
    Write-Host "Removed node state for node $name"
}

```

[sf-architecture]: .\media\service-fabric-availability-zones\sf-cross-az-topology.png