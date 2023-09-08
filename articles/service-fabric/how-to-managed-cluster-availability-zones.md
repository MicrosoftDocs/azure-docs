---
title: Deploy a Service Fabric managed cluster across Availability Zones
description: Learn how to deploy Service Fabric managed cluster across Availability Zones and how to configure in an ARM template.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 11/09/2022
ms.custom: engagement-fy23, devx-track-arm-template
---
# Deploy a Service Fabric managed cluster across availability zones
Availability Zones in Azure are a high-availability offering that protects your applications and data from datacenter failures. An Availability Zone is a unique physical location equipped with independent power, cooling, and networking within an Azure region.

Service Fabric managed cluster supports deployments that span across multiple Availability Zones to provide zone resiliency. This configuration ensures high-availability of the critical system services and your applications to protect from single-points-of-failure. Azure Availability Zones are only available in select regions. For more information, see [Azure Availability Zones Overview](../availability-zones/az-overview.md).

>[!NOTE]
>Availability Zone spanning is only available on Standard SKU clusters.

Sample templates are available: [Service Fabric cross availability zone template](https://github.com/Azure-Samples/service-fabric-cluster-templates)

## Topology for zone resilient Azure Service Fabric managed clusters

>[!NOTE]
>The benefit of spanning the primary node type across availability zones is really only seen for three zones and not just two.

A Service Fabric cluster distributed across Availability Zones ensures high availability of the cluster state. 

The recommended topology for managed cluster requires the following resources:

* The cluster SKU must be Standard
* Primary node type should have at least nine nodes (3 in each AZ) for best resiliency, but supports minimum number of six (2 in each AZ).
* Secondary node type(s) should have at least six nodes for best resiliency, but supports minimum number of three.

>[!NOTE]
>Only 3 Availability Zone deployments are supported.

>[!NOTE]
> It is not possible to do an in-place change of virtual machine scale sets in a managed cluster from non-zone-spanning to a zone-spanned cluster.

Diagram that shows the Azure Service Fabric Availability Zone architecture
 ![Azure Service Fabric Availability Zone Architecture][sf-multi-az-arch]

Sample node list depicting FD/UD formats in a virtual machine scale set spanning zones

 ![Sample node list depicting FD/UD formats in a virtual machine scale set spanning zones.][sfmc-multi-az-nodes]

**Distribution of Service replicas across zones**:
When a service is deployed on the node types that are spanning zones, the replicas are placed to ensure they land up in separate zones. This separation is ensured as the fault domain’s on the nodes present in each of these node types are configured with the zone information (i.e FD = fd:/zone1/1 etc.). For example: for five replicas or instances of a service, the distribution will be 2-2-1 and runtime will try to ensure equal distribution across AZs.

**User Service Replica Configuration**:
Stateful user services deployed on the cross-availability zone node types should be configured with this configuration: replica count with target = 9, min = 5. This configuration helps the service to be working even when one zone goes down since six replicas will be still up in the other two zones. An application upgrade in such a scenario will also go through.

**Zone down scenario**:
When a zone goes down, all the nodes in that zone appear as down. Service replicas on these nodes will also be down. Since there are replicas in the other zones, the service continues to be responsive with primary replicas failing over to the zones that are functioning. The services will appear in warning state as the target replica count is not met and the VM count is still more than the defined min target replica size. As a result, Service Fabric load balancer brings up replicas in the working zones to match the configured target replica count. At this point, the services should appear healthy. When the zone that was down comes back up, the load balancer will again spread all the service replicas evenly across all the zones.

## Networking Configuration
For more information, see [Configure network settings for Service Fabric managed clusters](./how-to-managed-cluster-networking.md)

## Enabling a zone resilient Azure Service Fabric managed cluster
To enable a zone resilient Azure Service Fabric managed cluster, you must include the following **ZonalResiliency** property, which specifies if the cluster is zone resilient or not.

```json
{
  "apiVersion": "2021-05-01",
  "type": "Microsoft.ServiceFabric/managedclusters",
  "properties": {
  ...
  "zonalResiliency": "true",
  ...
  }
}
```

## Migrate an existing nonzone resilient cluster to Zone Resilient (Preview) 
Existing Service Fabric managed clusters that are not spanned across availability zones can now be migrated in-place to span availability zones. Supported scenarios include clusters created in regions that have three availability zones and clusters in regions where three availability zones are made available post-deployment.

Requirements:
* Standard SKU cluster
* Three [availability zones in the region](../availability-zones/az-overview.md#azure-regions-with-availability-zones).

>[!NOTE]
>Migration to a zone resilient configuration can cause a brief loss of external connectivity through the load balancer, but will not affect cluster health. This occurs when a new Public IP needs to be created in order to make the networking resilient to Zone failures. Please plan the migration accordingly.

1) Start with determining if there will be a new IP required and what resources need to be migrated to become zone resilient. To get the current Availability Zone resiliency state for the resources of the managed cluster use the following  API call:

   ```http
   POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ServiceFabric/managedClusters/{clusterName}/getazresiliencystatus?api-version=2022-02-01-preview
   ```
   Or you can use the Az Module as follows:
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

   If the Public IP resource is not zone resilient, migration of the cluster will cause a brief loss of external connectivity. This connection loss is due to the migration setting up new Public IP and updating the cluster FQDN to the new IP. If the Public IP resource is zone resilient, migration will not modify the Public IP resource nor the FQDN, and there will be no external connectivity impact.
   
2) Initiate conversion of the underlying storage account created for managed cluster from LRS to ZRS using [customer-initiated conversion](../storage/common/redundancy-migration.md#customer-initiated-conversion). The resource group of storage account that needs to be migrated would be of the form "SFC_ClusterId"(ex SFC_9240df2f-71ab-4733-a641-53a8464d992d) under the same subscription as the managed cluster resource.

3) Add a new primary node type which spans across availability zones

   This step triggers the resource provider to perform the migration of the primary node type and Public IP along with a cluster FQDN DNS update, if needed, to become zone resilient. Use the above API to understand implication of this step.

* Use apiVersion 2022-02-01-preview or higher.
* Add a new primary node type to the cluster with zones parameter set to ["1," "2," "3"] as show below:
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

4) Add secondary node type which spans across availability zones.
   This step will add a secondary node type which spans across availability zones similar to the primary node type. Once created, customers need to migrate existing services from the old node types to the new ones by [using placement properties](./service-fabric-cluster-resource-manager-cluster-description.md).

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

5) Start removing older non az spanning node types from the cluster

   Once all your services are not present on your non zone spanned node types, you must remove the old node types. Start by [removing the old node types from the cluster](./how-to-managed-cluster-modify-node-type.md) using Portal or cmdlet. As a last step, remove any old node types from your template.

6) Mark the cluster resilient to zone failures

   This step helps in future deployments, since it ensures all future deployments of node types span across availability zones and thus cluster remains tolerant to AZ failures. Set `zonalResiliency: true` in the cluster ARM template and do a deployment to mark cluster as zone resilient and ensure all new node type deployments span across availability zones. 

   ```json
   {
     "apiVersion": "2022-02-01-preview",
     "type": "Microsoft.ServiceFabric/managedclusters",
     "zonalResiliency": "true"
   }
   ```
   You can also see the updated status in portal under Overview -> Properties similar to `Zonal resiliency True`, once complete.

7) Validate all the resources are zone resilient

   To validate the Availability Zone resiliency state for the resources of the managed cluster use the following GET API call:

   ```http
   POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ServiceFabric/managedClusters/{clusterName}/getazresiliencystatus?api-version=2022-02-01-preview
   ```
   This API call should provide a response similar to:
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
   If you run in to any problems reach out to support for assistance.

## Enable FastZonalUpdate on Service Fabric managed clusters (preview)
Service Fabric managed clusters support faster cluster and application upgrades by reducing the max upgrade domains per availability zone. The default configuration right now can have at most 15 UDs in multiple AZ nodetype. This huge number of UDs reduced the upgrade velocity. The new configuration reduces the max UDs, which results in faster updates, keeping the safety of the upgrades intact.   

The update should be done via ARM template by setting the zonalUpdateMode property to “fast” and then modifying a node type attribute, such as adding a node and then removing the node to each nodetype (see required steps 2 and 3).  The Service Fabric managed cluster resource apiVersion should be 2022-10-01-preview or later.

1. Modify the ARM template with the new property mentioned above.
```json
   "resources": [
        {
            "type": "Microsoft.ServiceFabric/managedClusters",
            "apiVersion": "2022-10-01-preview",
            '''
            "properties": {
                '''
                "zonalResiliency": true,
                "zonalUpdateMode": “fast”,
                ...
            }
        }]
```
2. Add a node to the node type from a cluster by following the procedure to [modify node type](how-to-managed-cluster-modify-node-type.md). 

3. Remove a node to the node type from a cluster by following the procedure to [modify node type](how-to-managed-cluster-modify-node-type.md).

[sf-architecture]: ./media/service-fabric-cross-availability-zones/sf-cross-az-topology.png
[sf-architecture]: ./media/service-fabric-cross-availability-zones/sf-cross-az-topology.png
[sf-multi-az-arch]: ./media/service-fabric-cross-availability-zones/sf-multi-az-topology.png
[sfmc-multi-az-nodes]: ./media/how-to-managed-cluster-availability-zones/sfmc-multi-az-nodes.png
