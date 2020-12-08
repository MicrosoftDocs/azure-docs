---
title: Deploy a cluster across Availability Zones
description: Learn how to create an Azure Service Fabric cluster across Availability Zones.
author: peterpogorski

ms.topic: conceptual
ms.date: 04/25/2019
ms.author: pepogors
---
# Deploy an Azure Service Fabric cluster across Availability Zones
Availability Zones in Azure is a high-availability offering that protects your applications and data from datacenter failures. An Availability Zone is a unique physical location equipped with independent power, cooling, and networking within an Azure region.

Service Fabric supports clusters that span across Availability Zones by deploying node types that are pinned to specific zones. This will ensure high-availability of your applications. Azure Availability Zones are only available in select regions. For more information, see [Azure Availability Zones Overview](https://docs.microsoft.com/azure/availability-zones/az-overview).

Sample templates are available: [Service Fabric cross availability zone template](https://github.com/Azure-Samples/service-fabric-cluster-templates)

## Recommended topology for primary node type of Azure Service Fabric clusters spanning across Availability Zones
A Service Fabric cluster distributed across Availability Zones ensures high availability of the cluster state. To span a Service Fabric cluster across zones, you must create a primary node type in each Availability Zone supported by the region. This will distribute seed nodes evenly across each of the primary node types.

The recommended topology for the primary node type requires the resources outlined below:

* The cluster reliability level set to Platinum.
* Three Node Types marked as primary.
    * Each Node Type should be mapped to its own virtual machine scale set located in different zones.
    * Each virtual machine scale set should have at least five nodes (Silver Durability).
* A Single Public IP Resource using Standard SKU.
* A Single Load Balancer Resource using Standard SKU.
* A NSG referenced by the subnet in which you deploy your virtual machine scale sets.

>[!NOTE]
> The virtual machine scale set single placement group property must be set to true, since Service Fabric does not support a single virtual machine scale set which spans zones.

 ![Azure Service Fabric Availability Zone Architecture][sf-architecture]

## Networking requirements
### Public IP and Load Balancer Resource
To enable the zones property on a virtual machine scale set resource, the load balancer and IP resource referenced by that virtual machine scale set must both be using a *Standard* SKU. Creating a load balancer or IP resource without the SKU property will create a Basic SKU, which does not support Availability Zones. A Standard SKU load balancer will block all traffic from the outside by default; to allow outside traffic, an NSG must be deployed to the subnet.

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
    "dependsOn": [
        "[concat('Microsoft.Network/networkSecurityGroups/', concat('nsg', parameters('subnet0Name')))]"
    ],
    "properties": {
        "addressSpace": {
            "addressPrefixes": [
                "[parameters('addressPrefix')]"
            ]
        },
        "subnets": [
        {
            "name": "[parameters('subnet0Name')]",
            "properties": {
                "addressPrefix": "[parameters('subnet0Prefix')]",
                "networkSecurityGroup": {
                "id": "[resourceId('Microsoft.Network/networkSecurityGroups', concat('nsg', parameters('subnet0Name')))]"
              }
            }
          }
        ]
    },
    "sku": {
        "name": "Standard"
    }
}
```

>[!NOTE]
> It is not possible to do an in-place change of SKU on the public IP and load balancer resources. If you are migrating from existing resources which have a Basic SKU, see the migration section of this article.

### Virtual machine scale set NAT rules
The load balancer inbound NAT rules should match the NAT pools from the virtual machine scale set. Each virtual machine scale set must have a unique inbound NAT pool.

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

### Standard SKU Load Balancer outbound rules
Standard Load Balancer and Standard Public IP introduce new abilities and different behaviors to outbound connectivity when compared to using Basic SKUs. If you want outbound connectivity when working with Standard SKUs, you must explicitly define it either with Standard Public IP addresses or Standard public Load Balancer. For more information, see [Outbound connections](https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-connections#snatexhaust) and [Azure Standard Load Balancer](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-overview).

>[!NOTE]
> The standard template references an NSG which allows all outbound traffic by default. Inbound traffic is limited to the ports that are required for Service Fabric management operations. The NSG rules can be modified to meet your requirements.

### Enabling zones on a virtual machine scale set
To enable a zone, on a virtual machine scale set you must include the following three values in the virtual machine scale set resource.

* The first value is the **zones** property, which specifies which Availability Zone the virtual machine scale set will be deployed to.
* The second value is the "singlePlacementGroup" property, which must be set to true.
* The third value is the “faultDomainOverride” property in the Service Fabric virtual machine scale set extension. The value for this property should include the region and zone in which this virtual machine scale set will be placed. Example: "faultDomainOverride": "eastus/az1" All virtual machine scale set resources must be placed in the same region because Azure Service Fabric clusters do not have cross region support.

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
            "durabilityLevel": "Silver",
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

### Enabling multiple primary Node Types in the Service Fabric Cluster resource
To set one or more node types as primary in a cluster resource, set the "isPrimary" property to "true". When deploying a Service Fabric cluster across Availability Zones, you should have three node types in distinct zones.

```json
{
    "reliabilityLevel": "Platinum",
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

## Migrate to using Availability Zones from a cluster using a Basic SKU Load Balancer and a Basic SKU IP
To migrate a cluster, which was using a Load Balancer and IP with a basic SKU, you must first create an entirely new Load Balancer and IP resource using the standard SKU. It is not possible to update these resources in-place.

The new LB and IP should be referenced in the new cross Availability Zone node types that you would like to use. In the example above, three new virtual machine scale set resources were added in zones 1,2, and 3. These virtual machine scale sets reference the newly created LB and IP and are marked as primary node types in the Service Fabric Cluster Resource.

To begin, you will need to add the new resources to your existing Resource Manager template. These resources include:
* A Public IP Resource using Standard SKU.
* A Load Balancer Resource using Standard SKU.
* A NSG referenced by the subnet in which you deploy your virtual machine scale sets.
* Three node types marked as primary.
    * Each node type should be mapped to its own virtual machine scale set located in different zones.
    * Each virtual machine scale set should have at least five nodes (Silver Durability).

An example of these resources can be found in the [sample template](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/10-VM-Ubuntu-2-NodeType-Secure).

```powershell
New-AzureRmResourceGroupDeployment `
    -ResourceGroupName $ResourceGroupName `
    -TemplateFile $Template `
    -TemplateParameterFile $Parameters
```

Once the resources have finished deploying, you can begin to disable the nodes in the primary node type from the original cluster. As the nodes are disabled, the system services will migrate to the new primary node type that had been deployed in the step above.

```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint $ClusterName `
    -KeepAliveIntervalInSec 10 `
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

Once the nodes are all disabled, the system services will be running on the primary node type, which is spread across zones. You can then remove the disabled nodes from the cluster. Once the nodes are removed, you can remove the original IP, Load Balancer, and virtual machine scale set resources.

```powershell
foreach($name in $nodeNames){
    # Remove the node from the cluster
    Remove-ServiceFabricNodeState -NodeName $name -TimeoutSec 300 -Force
    Write-Host "Removed node state for node $name"
}

$scaleSetName="nt0"
Remove-AzureRmVmss -ResourceGroupName $groupname -VMScaleSetName $scaleSetName -Force

$lbname="LB-cluster-nt0"
$oldPublicIpName="LBIP-cluster-0"
$newPublicIpName="LBIP-cluster-1"

Remove-AzureRmLoadBalancer -Name $lbname -ResourceGroupName $groupname -Force
Remove-AzureRmPublicIpAddress -Name $oldPublicIpName -ResourceGroupName $groupname -Force
```

You should then remove the references to these resources from the Resource Manager template that you had deployed.

The final step will involve updating the DNS name and Public IP.

```powershell
$oldprimaryPublicIP = Get-AzureRmPublicIpAddress -Name $oldPublicIpName  -ResourceGroupName $groupname
$primaryDNSName = $oldprimaryPublicIP.DnsSettings.DomainNameLabel
$primaryDNSFqdn = $oldprimaryPublicIP.DnsSettings.Fqdn

Remove-AzureRmLoadBalancer -Name $lbname -ResourceGroupName $groupname -Force
Remove-AzureRmPublicIpAddress -Name $oldPublicIpName -ResourceGroupName $groupname -Force

$PublicIP = Get-AzureRmPublicIpAddress -Name $newPublicIpName  -ResourceGroupName $groupname
$PublicIP.DnsSettings.DomainNameLabel = $primaryDNSName
$PublicIP.DnsSettings.Fqdn = $primaryDNSFqdn
Set-AzureRmPublicIpAddress -PublicIpAddress $PublicIP

```

## (Preview) Enable multiple Availability zones in single VMSS

The previously mentioned solution uses one nodeType per AZ. The following solution will allow users to deploy 3 AZ's in the same nodeType.

Full sample template is present [here](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/15-VM-Windows-Multiple-AZ-Secure).

![Azure Service Fabric Availability Zone Architecture][sf-multi-az-arch]

### Configuring zones on a virtual machine scale set
To enable zones on a virtual machine scale set you must include the following three values in the virtual machine scale set resource.

* The first value is the **zones** property, which specifies the Availability Zones present in the virtual machine scale set.
* The second value is the "singlePlacementGroup" property, which must be set to true.
* The third value is "zoneBalance" and is optional, which ensures strict zone balancing if set to true. Read about [zoneBalancing](https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones#zone-balancing).
* The FaultDomain and UpgradeDomain overrides are not required to be configured.

```json
{
    "apiVersion": "2018-10-01",
    "type": "Microsoft.Compute/virtualMachineScaleSets",
    "name": "[parameters('vmNodeType1Name')]",
    "location": "[parameters('computeLocation')]",
    "zones": ["1", "2", "3"],
    "properties": {
        "singlePlacementGroup": "true",
        "zoneBalance": false
    }
}
```

>[!NOTE]
> * **SF clusters should have atleast one Primary nodeType. DurabilityLevel of Primary nodeTypes should be Silver or above.**
> * The AZ spanning VMSS should be configured with atleast 3 Availability zones irrespective of the durabilityLevel.
> * AZ spanning VMSS with Silver durability (or above), should have atleast 15 VMs.
> * AZ spanning VMSS with Bronze durability, should have atleast 6 VMs.

### Enabling the support for multiple zones in the Service Fabric nodeType
The Service Fabric nodeType must be enabled to support multiple availability zones.

* The first value is **multipleAvailabilityZones** which should be set to true for the nodeType.
* The second value is **sfZonalUpgradeMode** and is optional. This property can’t be modified if a nodetype with multiple AZ’s is already present in the cluster.
      The property controls the logical grouping of VMs in upgrade domains.
          If value is set to false (flat mode): VMs under the node type will be grouped in UD ignoring the zone info in 5 UDs.
          If value is omitted or set to true (hierarchical mode): VMs will be grouped to reflect the zonal distribution in up to 15 UDs. Each of the 3 zones will have 5 UDs.
          This property only defines the upgrade behavior for ServiceFabric application and code upgrades. The underlying VMSS upgrades will still be parallel in all AZ’s.
      This property will not have any impact on the UD distribution for node types which do not have multiple zones enabled.
* The third value is **vmssZonalUpgradeMode = Parallel**. This is a *mandatory* property to be configured in the cluster, if a nodeType with multiple AZs is added. This property defines the upgrade mode for the VMSS updates which will happen in parallel in all AZ’s at once.
      Right now this property can only be set to parallel.
* The Service Fabric cluster resource apiVersion should be "2020-12-01-preview" or higher.
* The cluster code version should be "7.2.445" or higher.

```json
{
    "apiVersion": "2020-12-01-preview",
    "type": "Microsoft.ServiceFabric/clusters",
    "name": "[parameters('clusterName')]",
    "location": "[parameters('clusterLocation')]",
    "dependsOn": [
        "[concat('Microsoft.Storage/storageAccounts/', parameters('supportLogStorageAccountName'))]"
    ],
    "properties": {
        "SFZonalUpgradeMode": "Hierarchical",
        "VMSSZonalUpgradeMode": "Parallel",
        "nodeTypes": [
          {
                "name": "[parameters('vmNodeType0Name')]",
                "multipleAvailabilityZones": true,
          }
        ]
}
```

>[!NOTE]
> * Public IP and Load Balancer Resources should be using the Standard SKU as described earlier in the article.
> * "multipleAvailabilityZones" property on the nodeType can only be defined at the time of nodeType creation and can't be modified later. Hence, existing nodeTypes can't be configured with this property.
> * When "hierarchicalUpgradeDomain" is omitted or set to true, the cluster and application deployments will be slower as there are more upgrade domains in the cluster. It is important to correctly adjust the upgrade policy timeouts to incorporate for the upgrade time duration for 15 upgrade domains.
> * It is recommended to set the cluster reliability level to Platinum to ensure the cluster survives the one zone down scenario.

>[!NOTE]
> For best practice we recommend hierarchicalUpgradeDomain set to true or be omitted. Deployment will follow the zonal distribution of VMs impacting a smaller amount of replicas and/or instances making them safer.
> Use hierarchicalUpgradeDomain set to false if deployment speed is a priority or only stateless workload runs on the node type with multiple AZ's. This will result in the UD walk to happen in parallel in all AZ’s.

### Migration to the node type with multiple Availability Zones
For all migration scenarios, a new nodeType needs to added which will have multiple availability zones supported. An existing nodeType can’t be migrated to support multiple zones.
The article [here](https://docs.microsoft.com/azure/service-fabric/service-fabric-scale-up-primary-node-type ) captures the detailed steps of adding a new nodeType and also adding the other resources required for the new nodeType like the IP and LB resources. 
The same article also describes now to retire the existing nodeType after the nodeType with multiple Availability zones is added to the cluster.

* Migration from a nodeType which is using basic LB and IP resources:
    This is already described [here](https://docs.microsoft.com/azure/service-fabric/service-fabric-cross-availability-zones#migrate-to-using-availability-zones-from-a-cluster-using-a-basic-sku-load-balancer-and-a-basic-sku-ip) for the solution with one node type per AZ. 
    For the new node type, the only difference is that there is only 1 VMSS and 1 nodetype for all AZ’s instead of 1 each per AZ.
* Migration from a nodeType which is using the Standard SKU LB and IP resources with NSG:
    Follow the same procedure as described above with the exception that there is no need to add new LB, IP and NSG resources, and the same resources can be reused in the new nodeType.


[sf-architecture]: ./media/service-fabric-cross-availability-zones/sf-cross-az-topology.png
[sf-multi-az-arch]: ./media/service-fabric-cross-availability-zones/sf-multi-az-topology.png
