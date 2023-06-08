---
title: Migrate an Azure Service Fabric cluster to availability zone support 
description: Learn how to migrate both managed and non-managed Azure Service Fabric clusters to availability zone support.
author: tomvcassidy
ms.service: service-fabric
ms.topic: conceptual
ms.date: 03/23/2023
ms.author: tomcassidy
ms.reviewer: anaharris
ms.custom: references_regions
---

# Migrate your Service Fabric cluster to availability zone support
 
This guide describes how to migrate Service Fabric clusters from non-availability zone support to availability support. We'll take you through the different options for migration. A Service Fabric cluster distributed across availability Zones ensures high availability of the cluster state.

You can migrate both managed and non-managed clusters. Both are covered in this article.

For non-managed clusters, we discuss two different scenarios:

  * Migrating a cluster with a Standard SKU load balancer and IP resource. This configuration supports availability zones without needing to create new resources.
  * Migrating a cluster with a Basic SKU load balancer and IP resource. This configuration doesn't support availability zones and requires the creation of new resources.

See the appropriate sections under each header for your Service Fabric cluster scenario.

> [!NOTE]
> The benefit of spanning the primary node type across availability zones is only seen for three zones and not just two. This is true for both managed and non-managed clusters.

Sample templates are available at [Service Fabric cross availability zone templates](https://github.com/Azure-Samples/service-fabric-cluster-templates).

## Prerequisites

### Service Fabric managed clusters

Required:

* Standard SKU cluster.
* Three [availability zones in the region](availability-zones-service-support.md#azure-regions-with-availability-zone-support).


Recommended:

* The cluster SKU must be Standard.
* Primary node type should have at least nine nodes for best resiliency, but supports minimum number of six.
* Secondary node type(s) should have at least six nodes for best resiliency, but supports minimum number of three.

### Service Fabric non-managed clusters

Required: N/A.

Recommended:

* The cluster reliability level set to `Platinum`.
* A single public IP resource using Standard SKU.
* A single load balancer resource using Standard SKU.
* A network security group (NSG) referenced by the subnet in which you deploy your Virtual Machine Scale Sets.

#### Existing Standard SKU load balancer and IP resource

There are no prerequisites for this scenario, as it assumes you have the existing required resources.

#### Basic SKU load balancer and IP resource

* A new load balancer using the Standard SKU, distinct from your existing Basic SKU load balancer.
* A new IP resource using the Standard SKU, distinct from your existing Basic SKU IP resource.

> [!NOTE]
> It isn't possible to upgrade your existing resources from a Basic SKU to a Standard SKU, so new resources are required.

## Downtime requirements

### Service Fabric managed cluster

Migration to a zone resilient configuration can cause a brief loss of external connectivity through the load balancer, but won't affect cluster health. The loss of external connectivity occurs when a new Public IP needs to be created in order to make the networking resilient to zone failures. Plan the migration accordingly.

### Service Fabric non-managed cluster

Downtime for migrating Service Fabric non-managed clusters vary widely based on the number of VMs and Upgrade Domains (UDs) in your cluster. UDs are logical groupings of VMs that determine the order in which upgrades are pushed to the VMs in your cluster. The downtime is also affected by the upgrade mode of your cluster, which handles how upgrade tasks for the UDs in your cluster are processed. The `sfZonalUpgradeMode` property, which controls the upgrade mode, is covered in more detail in the following sections.

## Migration for Service Fabric managed clusters

### Create new primary and secondary node types that span availability zones

There's only one method for migrating a non-availability zone enabled Service Fabric managed cluster to an availability zone enabled state.

**To migrate your Service Fabric managed cluster:**

1. Determine whether a new IP is required and what resources need to be migrated to become zone resilient. To get the current availability zone resiliency state for the resources of the managed cluster, use the following API call:

   ```http
   POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ServiceFabric/managedClusters/{clusterName}/getazresiliencystatus?api-version=2022-02-01-preview
   ```
   Or, you can use the Az Module as follows:
   ```
   Select-AzSubscription -SubscriptionId {subscriptionId}
   Invoke-AzResourceAction -ResourceId /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ServiceFabric/managedClusters/{clusterName} -Action getazresiliencystatus -ApiVersion 2022-02-01-preview
   ```
   This should provide with response similar to:
   ```json
   {
    "baseResourceStatus" :[
    {
     "resourceName": "sfmccluster1"
     "resourceType": "Microsoft.Storage/storageAccounts"
     "isZoneResilient": false
    },
    {
     "resourceName": "PublicIP-sfmccluster1"
     "resourceType": "Microsoft.Network/publicIPAddresses"
     "isZoneResilient": false
    },
    {
     "resourceName": "primary"
     "resourceType": "Microsoft.Compute/virutalmachinescalesets"
     "isZoneResilient": false
    },
    ],
    "isClusterZoneResilient": false
   }
   ```

   If the Public IP resource isn't zone resilient, migration of the cluster causes a brief loss of external connectivity. The loss of connectivity is due to the migration setting up new Public IP and updating the cluster FQDN to the new IP. If the Public IP resource is zone resilient, migration will not modify the Public IP resource or FQDN and there will be no external connectivity impact.
   
1. Initiate conversion of the underlying storage account created for managed cluster from LRS to ZRS using [customer-initiated conversion](../storage/common/redundancy-migration.md#customer-initiated-conversion). The resource group of storage account that needs to be migrated would be of the form "SFC_ClusterId"(ex SFC_9240df2f-71ab-4733-a641-53a8464d992d) under the same subscription as the managed cluster resource.

1. Add a new primary node type, which spans across availability zones.
    
    This step triggers the resource provider to perform the migration of the primary node type and Public IP along with a cluster FQDN DNS update, if needed, to become zone resilient. Use the above API to understand implication of this step.
    
    * Use apiVersion 2022-02-01-preview or higher.
    * Add a new primary node type to the cluster with zones parameter set to ["1", "2", "3"] as show below:
    
        ```json
        {
          "apiVersion": "2022-02-01-preview",
          "type": "Microsoft.ServiceFabric/managedclusters/nodetypes",
          "name": "[concat(parameters('clusterName'), '/', parameters('nodeTypeName'))]",
          "location": "[resourcegroup().location]",
          "dependsOn": [
            "[concat('Microsoft.ServiceFabric/managedclusters/', parameters('clusterName'))]"
          ],
          "properties": {
            ...
            "isPrimary": true,
            "zones": ["1", "2", "3"]
            ...
          }
        }
        ```
    
1. Add secondary node type, which spans across availability zones.
   This step adds a secondary node type, which spans across availability zones similar to the primary node type. Once created, customers need to migrate existing services from the old node types to the new ones by [using placement properties](../service-fabric/service-fabric-cluster-resource-manager-cluster-description.md).
    
    * Use apiVersion 2022-02-01-preview or higher.
    * Add a new secondary node type to the cluster with zones parameter set to ["1", "2", "3"] as show below:
    
       ```json
       {
         "apiVersion": "2022-02-01-preview",
         "type": "Microsoft.ServiceFabric/managedclusters/nodetypes",
         "name": "[concat(parameters('clusterName'), '/', parameters('nodeTypeName'))]",
         "location": "[resourcegroup().location]",
         "dependsOn": [
           "[concat('Microsoft.ServiceFabric/managedclusters/', parameters('clusterName'))]"
         ],
         "properties": {
           ...
           "isPrimary": false,
           "zones": ["1", "2", "3"]
           ...
         }
       }
       ```

1. Start removing older non az spanning node types from the cluster

   Once all your services are not present on your non zone spanned node types, you must remove the old node types. Start by [removing the old node types from the cluster](../service-fabric/how-to-managed-cluster-modify-node-type.md) using Portal or cmdlet. As a last step, remove any old node types from your template.

1. Mark the cluster resilient to zone failures

   This step helps in future deployments, since it ensures that all future deployments of node types span across availability zones and so the cluster remains tolerant to zone failures. Set `zonalResiliency: true` in the cluster ARM template and do a deployment to mark the cluster as zone resilient and ensure all new node type deployments span across availability zones. 

   ```json
   {
     "apiVersion": "2022-02-01-preview",
     "type": "Microsoft.ServiceFabric/managedclusters",
     "zonalResiliency": "true"
   }
   ```
   You can also see the updated status in portal under **Overview > Properties** similar to `Zonal resiliency True`, once complete.

1. Validate all the resources are zone resilient

   To validate the availability zone resiliency state for the resources of the managed cluster use the following GET API call:

   ```http
   POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ServiceFabric/managedClusters/{clusterName}/getazresiliencystatus?api-version=2022-02-01-preview
   ```
   This should provide with response similar to:
   ```json
   {
    "baseResourceStatus" :[
    {
     "resourceName": "sfmccluster1"
     "resourceType": "Microsoft.Storage/storageAccounts"
     "isZoneResilient": true
    },
    {
     "resourceName": "PublicIP-sfmccluster1"
     "resourceType": "Microsoft.Network/publicIPAddresses"
     "isZoneResilient": true
    },
    {
     "resourceName": "primary"
     "resourceType": "Microsoft.Compute/virutalmachinescalesets"
     "isZoneResilient": true
    },
    ],
    "isClusterZoneResilient": true
   }
   ```
    
  If you run into any problems, reach out to support for assistance.



## Migration options for Service Fabric non-managed clusters

### Migration option 1: enable multiple Availability Zones in a single Virtual Machine Scale Set

#### When to use this option

This solution allows users to span three Availability Zones in the same node type. This is the recommended deployment topology as it enables you to deploy across availability zones while maintaining a single Virtual Machine Scale Set.

A full sample template is available on [GitHub](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/15-VM-Windows-Multiple-AZ-Secure).

You should use this option when you have an existing Service Fabric non-managed cluster with the Standard SKU load balancer and IP Resources that you want to migrate. If your existing non-managed cluster has Basic SKU resources, you should see the Basic SKU migration option below.

#### How to migrate your Service Fabric non-managed cluster with existing Standard SKU load balancer and IP resources

**To enable zones on a Virtual Machine Scale Set:**

Include the following three values in the Virtual Machine Scale Set resource:

* The first value is the `zones` property, which specifies the Availability Zones that are in the Virtual Machine Scale Set.
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
>
> * Service Fabric clusters should have at least one primary node type. The durability level of primary node types should be Silver or higher.
> * An availability zone spanning Virtual Machine Scale Set should be configured with at least three Availability Zones, no matter the durability level.
> * An availability zone spanning Virtual Machine Scale Set with Silver or higher durability should have at least 15 VMs.
> * An availability zone spanning Virtual Machine Scale Set with Bronze durability should have at least six VMs.

##### Enable support for multiple zones in the Service Fabric node type

To support multiple availability zones, the Service Fabric node type must be enabled.

* The first value is `multipleAvailabilityZones`, which should be set to `true` for the node type.

* The second value is `sfZonalUpgradeMode` and is optional. This property can't be modified if a node type with multiple availability zones is already present in the cluster. This property controls the logical grouping of VMs in UDs.
  
  * If this value is set to `Parallel`: VMs under the node type are grouped into UDs and ignore the zone info in five UDs. This setting causes UDs across all zones to be upgraded at the same time. Although this deployment mode is faster for upgrades, we don't recommend it because it goes against the SDP guidelines, which state that the updates should be applied to one zone at a time.

  * If this value is omitted or set to `Hierarchical`: VMs are grouped to reflect the zonal distribution in up to 15 UDs. Each of the three zones has five UDs. This ensures that the zones are updated one at a time, moving to next zone only after completing five UDs within the first zone. The update process is safer for the cluster and the user application.

  This property only defines the upgrade behavior for Service Fabric application and code upgrades. The underlying Virtual Machine Scale Set upgrades are still parallel in all Availability Zones. This property doesn't affect the UD distribution for node types that don't have multiple zones enabled.

* The third value is `vmssZonalUpgradeMode`, is optional and can be updated at any time. This property defines the upgrade scheme for the Virtual Machine Scale Set to happen in parallel or sequentially across Availability Zones.
  * If this value is set to `Parallel`: All scale set updates happen in parallel in all zones. This deployment mode is faster for upgrades, and so we don't recommend it because it goes against the SDP guidelines, which state that the updates should be applied to one zone at a time.
  * If this value is omitted or set to `Hierarchical`: This ensures that the zones are updated one at a time, moving to next zone only after completing five UDs within the first zone. This update process is safer for the cluster and the user application.

>[!IMPORTANT]
>The Service Fabric cluster resource API version should be 2020-12-01-preview or later.
>
>The cluster code version should be at least 8.1.321 or later.

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
> * Upgrading the DurabilityLevel for a nodetype with multipleAvailabilityZones, is not supported. Please create a new node type with the higher durability instead.
> * SF supports just 3 AvailabilityZones. Any higher number is not supported right now.

>[!TIP]
> We recommend setting `sfZonalUpgradeMode` to `Hierarchical` or omitting it. Deployment will follow the zonal distribution of VMs and affect a smaller amount of replicas or instances, making them safer.
> Use `sfZonalUpgradeMode` set to `Parallel` if deployment speed is a priority or only stateless workloads run on the node type with multiple Availability Zones. This causes the UD walk to happen in parallel in all Availability Zones.

##### Migrate to the node type with multiple Availability Zones

For all migration scenarios, you need to add a new node type that supports multiple Availability Zones. An existing node type can't be migrated to support multiple zones.
The [Scale up a Service Fabric cluster primary node type](../service-fabric/service-fabric-scale-up-primary-node-type.md) article includes detailed steps to add a new node type and the other resources required for the new node type, such as IP and load balancer resources. That article also describes how to retire the existing node type after a new node type with multiple Availability Zones is added to the cluster.

* Migration from a node type that uses basic load balancer and IP resources: This process is already described in [a sub-section below](#how-to-migrate-your-service-fabric-non-managed-cluster-with-basic-sku-load-balancer-and-ip-resources) for the solution with one node type per Availability Zone.

  For the new node type, the only difference is that there's only one Virtual Machine Scale Set and one node type for all Availability Zones instead of one each per Availability Zone.
* Migration from a node type that uses the Standard SKU load balancer and IP resources with an NSG: Follow the same procedure described previously. However, there's no need to add new load balancer, IP, and NSG resources. The same resources can be reused in the new node type.

If you run into any problems reach out to support for assistance.

### Migration option 2: deploy zones by pinning one Virtual Machine Scale Set to each zone

#### When to use this option

This is the generally available configuration right now.

To span a Service Fabric cluster across Availability Zones, you must create a primary node type in each Availability Zone supported by the region. This distributes seed nodes evenly across each of the primary node types.

The recommended topology for the primary node type requires this:
* Three node types marked as primary
  * Each node type should be mapped to its own Virtual Machine Scale Set located in a different zone.
  * Each Virtual Machine Scale Set should have at least five nodes (Silver Durability).

You should use this option when you have an existing Service Fabric non-managed cluster with the Standard SKU load balancer and IP Resources that you want to migrate. If your existing non-managed cluster has Basic SKU resources, you should see the Basic SKU migration option below.

#### How to migrate your Service Fabric non-managed cluster with existing Standard SKU load balancer and IP resources

##### Enable zones on a Virtual Machine Scale Set

To enable a zone on a Virtual Machine Scale Set, include the following three values in the Virtual Machine Scale Set resource:

* The first value is the `zones` property, which specifies which Availability Zone the Virtual Machine Scale Set is deployed to.
* The second value is the `singlePlacementGroup` property, which must be set to `true`.
* The third value is the `faultDomainOverride` property in the Service Fabric Virtual Machine Scale Set extension. This property should include only the zone in which this Virtual Machine Scale Set will be placed. Example: `"faultDomainOverride": "az1"`. All Virtual Machine Scale Set resources must be placed in the same region because Azure Service Fabric clusters don't have cross-region support.

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

##### Enable multiple primary node types in the Service Fabric cluster resource

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

If you run into any problems reach out to support for assistance.

### Migration option: Service Fabric non-managed cluster with Basic SKU load balancer and IP resources

#### When to use this option

You should use this option when you have an existing Service Fabric non-managed cluster with the Basic SKU load balancer and IP Resources that you want to migrate. If your existing non-managed cluster has Standard SKU resources, you should see the migration options above. If you have not yet created your non-managed cluster but know you will want it to be AZ-enabled, create it with Standard SKU resources.

#### How to migrate your Service Fabric non-managed cluster with Basic SKU load balancer and IP resources

To migrate a cluster that's using a load balancer and IP with a basic SKU, you must first create an entirely new load balancer and IP resource using the standard SKU. It isn't possible to update these resources.

Reference the new load balancer and IP in the new cross-Availability Zone node types that you want to use. In the previous example, three new Virtual Machine Scale Set resources were added in zones 1, 2, and 3. These Virtual Machine Scale Sets reference the newly created load balancer and IP and are marked as primary node types in the Service Fabric cluster resource.

1. To begin, add the new resources to your existing Azure Resource Manager template. These resources include:

   * A public IP resource using Standard SKU
   * A load balancer resource using Standard SKU
   * An NSG referenced by the subnet in which you deploy your Virtual Machine Scale Sets
   * Three node types marked as primary
     * Each node type should be mapped to its own Virtual Machine Scale Set located in a different zone.
     * Each Virtual Machine Scale Set should have at least five nodes (Silver Durability).

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

1. After the nodes are all disabled, the system services will run on the primary node type, which is spread across zones. You can then remove the disabled nodes from the cluster. After the nodes are removed, you can remove the original IP, load balancer, and Virtual Machine Scale Set resources.

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

If you run into any problems reach out to support for assistance.

## Next steps

- [Scale up a Service Fabric non-managed cluster primary node type](../service-fabric/service-fabric-scale-up-primary-node-type.md)

- [Add, remove, or scale Service Fabric managed cluster node types](../service-fabric/how-to-managed-cluster-modify-node-type.md)
