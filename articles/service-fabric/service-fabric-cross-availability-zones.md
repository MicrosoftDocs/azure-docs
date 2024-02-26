---
title: Deploy a cluster across Availability Zones
description: Learn how to create an Azure Service Fabric cluster across Availability Zones.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Deploy an Azure Service Fabric cluster across Availability Zones

Availability Zones in Azure are a high-availability offering that protects your applications and data from datacenter failures. An Availability Zone is a unique physical location equipped with independent power, cooling, and networking within an Azure region.

To support clusters that span across Availability Zones, Azure Service Fabric provides the two configuration methods as described in the article below. Availability Zones are available only in select regions. For more information, see the [Availability Zones overview](../availability-zones/az-overview.md).

Sample templates are available at [Service Fabric cross-Availability Zone templates](https://github.com/Azure-Samples/service-fabric-cluster-templates).

## Topology for spanning a primary node type across Availability Zones

>[!NOTE]
>The benefit of spanning the primary node type across availability zones is really only seen for three zones and not just two.

* The cluster reliability level set to `Platinum`
* A single public IP resource using Standard SKU
* A single load balancer resource using Standard SKU
* A network security group (NSG) referenced by the subnet in which you deploy your virtual machine scale sets

>[!NOTE]
>The virtual machine scale set single placement group property must be set to `true`.

The following sample node list depicts FD/UD formats in a virtual machine scale set spanning zones:

![Screenshot that shows a sample node list of FD/UD formats in a virtual machine scale set spanning zones.][sf-multi-az-nodes]

### Distribution of service replicas across zones

When a service is deployed on the node types that span Availability Zones, the replicas are placed to ensure that they land in separate zones. The fault domains on the nodes in each of these node types are configured with the zone information (that is, FD = fd:/zone1/1, etc.). For example, for five replicas or service instances, the distribution is 2-2-1, and the runtime will try to ensure equal distribution across zones.

### User service replica configuration

Stateful user services deployed on the node types across Availability Zones should be configured like this: replica count with target = 9, min = 5. This configuration helps the service work even when one zone goes down because six replicas will be still up in the other two zones. An application upgrade in this scenario will also be successful.

### Cluster ReliabilityLevel

This value defines the number of seed nodes in the cluster and the replica size of the system services. A cross-Availability Zone setup has a higher number of nodes, which are spread across zones to enable zone resiliency.
  
A higher `ReliabilityLevel` value ensures that more seed nodes and system service replicas are present and evenly distributed across zones, so that if a zone fails, the cluster and the system services aren't affected. `ReliabilityLevel = Platinum` (recommended) ensures that there are nine seed nodes spread across zones in the cluster, with three seeds in each zone.

### Zone-down scenario

When a zone goes down, all of the nodes and service replicas for that zone appear as down. Because there are replicas in the other zones, the service continues to respond. Primary replicas fail over to the functioning zones. The services appear to be in warning states because the target replica count isn't yet achieved and the virtual machine (VM) count is still higher than the minimum target replica size.

The Service Fabric load balancer brings up replicas in the working zones to match the target replica count. At this point, the services appear healthy. When the zone that was down comes back up, the load balancer will spread all of the service replicas evenly across the zones.

## Upcoming Optimizations
* To provide reliable infrastructure updates, Service Fabric requires the virtual machine scale set durability to be set at least to Silver. This enables the underlying virtual machine scale set and Service Fabric runtime to provide reliable updates. This also requires each zone to have at minimum of 5 VMs. We are working to bring this requirement down to 3 & 2 VMs per zone for primary & non-primary node types respectively.
* All the below mentioned configurations and upcoming work, provide in-place migration to the customers where the same cluster can be upgraded to use the new configuration by adding new nodeTypes and retiring the old ones.

## Networking requirements

### Public IP and load balancer resource

To enable the `zones` property on a virtual machine scale set resource, the load balancer and the IP resource referenced by that virtual machine scale set must both use a Standard SKU. Creating a load balancer or IP resource without the SKU property creates a Basic SKU, which does not support Availability Zones. A Standard SKU load balancer blocks all traffic from the outside by default. To allow outside traffic, deploy an NSG to the subnet.

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
> It isn't possible to do an in-place change of SKU on the public IP and load balancer resources. If you're migrating from existing resources that have a Basic SKU, see the migration section of this article.

### NAT rules for virtual machine scale sets

The inbound network address translation (NAT) rules for the load balancer should match the NAT pools from the virtual machine scale set. Each virtual machine scale set must have a unique inbound NAT pool.

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

### Outbound rules for a Standard SKU load balancer

The Standard SKU load balancer and public IP introduce new abilities and different behaviors to outbound connectivity when compared to using Basic SKUs. If you want outbound connectivity when you're working with Standard SKUs, you must explicitly define it with either a Standard SKU public IP addresses or a Standard SKU load balancer. For more information, see [Outbound connections](../load-balancer/load-balancer-outbound-connections.md) and [What is Azure Load Balancer?](../load-balancer/load-balancer-overview.md).

>[!NOTE]
> The standard template references an NSG that allows all outbound traffic by default. Inbound traffic is limited to the ports that are required for Service Fabric management operations. The NSG rules can be modified to meet your requirements.

>[!IMPORTANT]
> Each node type in a Service Fabric cluster that uses a Standard SKU load balancer requires a rule allowing outbound traffic on port 443. This is necessary to complete cluster setup. Any deployment without this rule will fail.


## 1. Enable multiple Availability Zones in single virtual machine scale set

This solution allows users to span three Availability Zones in the same node type. This is the recommended deployment topology as it enables you to deploy across availability zones while maintaining a single virtual machine scale set..

A full sample template is available on [GitHub](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/15-VM-Windows-Multiple-AZ-Secure).

![Diagram of the Azure Service Fabric Availability Zone architecture.][sf-multi-az-arch]

### Configuring zones on a virtual machine scale set

To enable zones on a virtual machine scale set, include the following three values in the virtual machine scale set resource:

* The first value is the `zones` property, which specifies the Availability Zones that are in the virtual machine scale set.
* The second value is the `singlePlacementGroup` property, which must be set to `true`. The scale set that's spanned across three Availability Zones can scale up to 300 VMs even with `singlePlacementGroup = true`.
* The third value is `zoneBalance`, which ensures strict zone balancing. This value should be `true`. This ensures that the VM distributions across zones are not unbalanced, which means that when one zone goes down, the other two zones have enough VMs to keep the cluster running.

  A cluster with an unbalanced VM distribution might not survive a zone-down scenario because that zone might have the majority of the VMs. Unbalanced VM distribution across zones also leads to service placement issues and infrastructure updates getting stuck. Read more about [zoneBalancing](../virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones.md#zone-balancing).

You don't need to configure the `FaultDomain` and `UpgradeDomain` overrides.

```json
{
  "apiVersion": "2018-10-01",
  "type": "Microsoft.Compute/virtualMachineScaleSets",
  "name": "[parameters('vmNodeType1Name')]",
  "location": "[parameters('computeLocation')]",
  "zones": [ "1", "2", "3" ],
  "properties": {
    "singlePlacementGroup": true,
    "zoneBalance": true
  }
}
```

>[!NOTE]
> * Service Fabric clusters should have at least one primary node type. The durability level of primary node types should be Silver or higher.
> * An Availability Zone spanning virtual machine scale set should be configured with at least three Availability Zones, no matter the durability level.
> * An Availability Zone spanning virtual machine scale set with Silver or higher durability should have at least 15 VMs ([5 per region](service-fabric-cluster-capacity.md#durability-characteristics-of-the-cluster)).  
> * An Availaibility Zone spanning virtual machine scale set with Bronze durability should have at least six VMs.

### Enable support for multiple zones in the Service Fabric node type

The Service Fabric node type must be enabled to support multiple Availability Zones.

* The first value is `multipleAvailabilityZones`, which should be set to `true` for the node type.
* The second value is `sfZonalUpgradeMode` and is optional. This property can't be modified if a node type with multiple Availability Zones is already present in the cluster.
  This property controls the logical grouping of VMs in upgrade domains (UDs).

  * If this value is set to `Parallel`: VMs under the node type are grouped into UDs and ignore the zone info in five UDs. This setting causes UDs across all zones to be upgraded at the same time. This deployment mode is faster for upgrades, we don't recommend it because it goes against the SDP guidelines, which state that the updates should be applied to one zone at a time.
  * If this value is omitted or set to `Hierarchical`: VMs are grouped to reflect the zonal distribution in up to 15 UDs. Each of the three zones has five UDs. This ensures that the zones are updated one at a time, moving to next zone only after completing five UDs within the first zone. This update process is safer for the cluster and the user application.

  This property only defines the upgrade behavior for Service Fabric application and code upgrades. The underlying virtual machine scale set upgrades are still parallel in all Availability Zones. This property doesn't affect the UD distribution for node types that don't have multiple zones enabled.
* The third value is `vmssZonalUpgradeMode`, is optional and can be updated at anytime. This property defines the upgrade scheme for the virtual machine scale set to happen in parallel or sequentially across Availability Zones.

  * If this value is set to `Parallel`: All scale set updates happen in parallel in all zones. This deployment mode is faster for upgrades, we don't recommend it because it goes against the SDP guidelines, which state that the updates should be applied to one zone at a time.
  * If this value is omitted or set to `Hierarchical`: This ensures that the zones are updated one at a time, moving to next zone only after completing five UDs within the first zone. This update process is safer for the cluster and the user application.

>[!IMPORTANT]
>The Service Fabric cluster resource API version should be 2020-12-01-preview or later.
>
>The cluster code version should be atleast 8.1.321 or later.

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
    "reliabilityLevel": "Platinum",
    "sfZonalUpgradeMode": "Hierarchical",
    "vmssZonalUpgradeMode": "Parallel",
    "nodeTypes": [
      {
        "name": "[parameters('vmNodeType0Name')]",
        "multipleAvailabilityZones": true
      }
    ]
  }
}
```

>[!NOTE]
>
> * Public IP and load balancer resources should use the Standard SKU described earlier in the article.
> * The `multipleAvailabilityZones` property on the node type can only be defined when the node type is created and can't be modified later. Existing node types can't be configured with this property.
> * When `sfZonalUpgradeMode` is omitted or set to `Hierarchical`, the cluster and application deployments will be slower because there are more upgrade domains in the cluster. It's important to correctly adjust the upgrade policy timeouts to account for the upgrade time required for 15 upgrade domains. The upgrade policy for both the app and the cluster should be updated to ensure that the deployment doesn't exceed the Azure Resource Service deployment time limit of 12 hours. This means that deployment shouldn't take more than 12 hours for 15 UDs (that is, shouldn't take more than 40 minutes for each UD).
> * Set the cluster reliability level to `Platinum` to ensure that the cluster survives the one zone-down scenario.
> * Upgrading the DurabilityLevel for a nodetype with multipleAvailabilityZones, is not supported. Please create a new nodetype with the higher durability instead.
> * SF supports just 3 AvailabilityZones. Any higher number is not supported right now.

>[!TIP]
> We recommend setting `sfZonalUpgradeMode` to `Hierarchical` or omitting it. Deployment will follow the zonal distribution of VMs and affect a smaller amount of replicas or instances, making them safer.
> Use `sfZonalUpgradeMode` set to `Parallel` if deployment speed is a priority or only stateless workloads run on the node type with multiple Availability Zones. This causes the UD walk to happen in parallel in all Availability Zones.

### Migrate to the node type with multiple Availability Zones

For all migration scenarios, you need to add a new node type that supports multiple Availability Zones. An existing node type can't be migrated to support multiple zones.
The [Scale up a Service Fabric cluster primary node type](./service-fabric-scale-up-primary-node-type.md) article includes detailed steps to add a new node type and the other resources required for the new node type, such as IP and load balancer resources. That article also describes how to retire the existing node type after a new node type with multiple Availability Zones is added to the cluster.

* Migration from a node type that uses basic load balancer and IP resources: This process is already described in [a sub-section below](#migrate-to-availability-zones-from-a-cluster-by-using-a-basic-sku-load-balancer-and-a-basic-sku-ip) for the solution with one node type per Availability Zone.

  For the new node type, the only difference is that there's only one virtual machine scale set and one node type for all Availability Zones instead of one each per Availability Zone.
* Migration from a node type that uses the Standard SKU load balancer and IP resources with an NSG: Follow the same procedure described previously. However, there's no need to add new load balancer, IP, and NSG resources. The same resources can be reused in the new node type.


## 2. Deploy zones by pinning one virtual machine scale set to each zone

This is the generally available configuration right now.
To span a Service Fabric cluster across Availability Zones, you must create a primary node type in each Availability Zone supported by the region. This distributes seed nodes evenly across each of the primary node types.

The recommended topology for the primary node type requires this:
* Three node types marked as primary
  * Each node type should be mapped to its own virtual machine scale set located in a different zone.
  * Each virtual machine scale set should have at least five nodes (Silver Durability).

The following diagram shows the Azure Service Fabric Availability Zone architecture:

![Diagram that shows the Azure Service Fabric Availability Zone architecture.][sf-architecture]

### Enable zones on a virtual machine scale set

To enable a zone on a virtual machine scale set, include the following three values in the virtual machine scale set resource:

* The first value is the `zones` property, which specifies which Availability Zone the virtual machine scale set is deployed to.
* The second value is the `singlePlacementGroup` property, which must be set to `true`.
* The third value is the `faultDomainOverride` property in the Service Fabric virtual machine scale set extension. This property should include only the zone in which this virtual machine scale set will be placed. Example: `"faultDomainOverride": "az1"`. All virtual machine scale set resources must be placed in the same region because Azure Service Fabric clusters don't have cross-region support.

```json
{
  "apiVersion": "2018-10-01",
  "type": "Microsoft.Compute/virtualMachineScaleSets",
  "name": "[parameters('vmNodeType1Name')]",
  "location": "[parameters('computeLocation')]",
  "zones": [
    "1"
  ],
  "properties": {
    "singlePlacementGroup": true
  },
  "virtualMachineProfile": {
    "extensionProfile": {
      "extensions": [
        {
          "name": "[concat(parameters('vmNodeType1Name'),'_ServiceFabricNode')]",
          "properties": {
            "type": "ServiceFabricNode",
            "autoUpgradeMinorVersion": false,
            "publisher": "Microsoft.Azure.ServiceFabric",
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
              "faultDomainOverride": "az1"
            },
            "typeHandlerVersion": "1.0"
          }
        }
      ]
    }
  }
}
```

### Enable multiple primary node types in the Service Fabric cluster resource

To set one or more node types as primary in a cluster resource, set the `isPrimary` property to `true`. When you deploy a Service Fabric cluster across Availability Zones, you should have three node types in distinct zones.

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
  ]
}
```

## Migrate to Availability Zones from a cluster by using a Basic SKU load balancer and a Basic SKU IP

To migrate a cluster that's using a load balancer and IP with a basic SKU, you must first create an entirely new load balancer and IP resource using the standard SKU. It isn't possible to update these resources.

Reference the new load balancer and IP in the new cross-Availability Zone node types that you want to use. In the previous example, three new virtual machine scale set resources were added in zones 1, 2, and 3. These virtual machine scale sets reference the newly created load balancer and IP and are marked as primary node types in the Service Fabric cluster resource.

1. To begin, add the new resources to your existing Azure Resource Manager template. These resources include:

   * A public IP resource using Standard SKU
   * A load balancer resource using Standard SKU
   * An NSG referenced by the subnet in which you deploy your virtual machine scale sets
   * Three node types marked as primary
     * Each node type should be mapped to its own virtual machine scale set located in a different zone.
     * Each virtual machine scale set should have at least five nodes (Silver Durability).

   An example of these resources can be found in the [sample template](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/10-VM-Ubuntu-2-NodeType-Secure).

   ```powershell
   New-AzureRmResourceGroupDeployment `
       -ResourceGroupName $ResourceGroupName `
       -TemplateFile $Template `
       -TemplateParameterFile $Parameters
   ```

1. When the resources finish deploying, you can disable the nodes in the primary node type from the original cluster. When the nodes are disabled, the system services migrate to the new primary node type that you deployed previously.

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

1. After the nodes are all disabled, the system services will run on the primary node type, which is spread across zones. You can then remove the disabled nodes from the cluster. After the nodes are removed, you can remove the original IP, load balancer, and virtual machine scale set resources.

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

1. Next, remove the references to these resources from the Resource Manager template that you deployed.

1. Finally, update the DNS name and public IP.

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

[sf-architecture]: ./media/service-fabric-cross-availability-zones/sf-cross-az-topology.png
[sf-multi-az-arch]: ./media/service-fabric-cross-availability-zones/sf-multi-az-topology.png
[sf-multi-az-nodes]: ./media/service-fabric-cross-availability-zones/sf-multi-az-nodes.png
