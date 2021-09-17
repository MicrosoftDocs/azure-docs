---
title: Deploy a Service Fabric managed cluster across Availability Zones
description: Learn how to deploy Service Fabric managed cluster across Availability Zones and how to configure in an ARM template.
ms.topic: how-to
ms.date: 5/10/2021
---
# Deploy a Service Fabric managed cluster across availability zones

Availability Zones in Azure are a high-availability offering that protects your applications and data from datacenter failures. An Availability Zone is a unique physical location equipped with independent power, cooling, and networking within an Azure region.

Service Fabric managed cluster supports deployments that span across multiple Availability Zones to provide zone resiliency. This configuration will ensure high-availability of the critical system services and your applications to protect from single-points-of-failure. Azure Availability Zones are only available in select regions. For more information, see [Azure Availability Zones Overview](../availability-zones/az-overview.md).

>[!NOTE]
>Availability Zone spanning is only available on Standard SKU clusters.

Sample templates are available: [Service Fabric cross availability zone template](https://github.com/Azure-Samples/service-fabric-cluster-templates)

## Recommendations for zone resilient Azure Service Fabric managed clusters
A Service Fabric cluster distributed across Availability Zones ensures high availability of the cluster state. 

The recommended topology for managed cluster requires the resources outlined below:

* The cluster SKU must be Standard
* Primary node type should have at least nine nodes for best resiliency, but supports minimum number of six.
* Secondary node type(s) should have at least six nodes for best resiliency, but supports minimum number of three.

>[!NOTE]
>Only 3 Availability Zone deployments are supported.

>[!NOTE]
> It is not possible to do an in-place change of a managed cluster from non-spanning to a spanned cluster.

Diagram that shows the Azure Service Fabric Availability Zone architecture
 ![Azure Service Fabric Availability Zone Architecture][sf-multi-az-arch]

Sample node list depicting FD/UD formats in a virtual machine scale set spanning zones

 ![Sample node list depicting FD/UD formats in a virtual machine scale set spanning zones.][sfmc-multi-az-nodes]

**Distribution of Service replicas across zones**:
When a service is deployed on the nodeTypes that are spanning zones, the replicas are placed to ensure they land up in separate zones. This separation is ensured as the fault domain’s on the nodes present in each of these nodeTypes are configured with the zone information (i.e FD = fd:/zone1/1 etc.). For example: for five replicas or instances of a service the distribution will be 2-2-1 and runtime will try to ensure equal distribution across AZs.

**User Service Replica Configuration**:
Stateful user services deployed on the cross availability zone nodeTypes should be configured with this configuration: replica count with target = 9, min = 5. This configuration will help the service to be working even when one zone goes down since 6 replicas will be still up in the other two zones. An application upgrade in such a scenario will also go through.

**Zone down scenario**:
When a zone goes down, all the nodes in that zone will appear as down. Service replicas on these nodes will also be down. Since there are replicas in the other zones, the service continues to be responsive with primary replicas failing over to the zones which are functioning. The services will appear in warning state as the target replica count is not met and the VM count is still more than the defined min target replica size. As a result, Service Fabric load balancer will bring up replicas in the working zones to match the configured target replica count. At this point, the services will appear healthy. When the zone which was down comes back up, the load balancer will again spread all the service replicas evenly across all the zones.

## Networking Configuration
For more information, see [Configure network settings for Service Fabric managed clusters](./how-to-managed-cluster-networking.md)

## Enabling a zone resilient Azure Service Fabric managed cluster
To enable a zone resilient Azure Service Fabric managed cluster, you must include the following in the managed cluster resource definition.

* The **ZonalResiliency** property, which specifies if the cluster is zone resilient or not.

```json
{
    "apiVersion": "2021-05-01",
    "type": "Microsoft.ServiceFabric/managedclusters",
    "ZonalResiliency": "true"
    
}
```
[sf-architecture]: ./media/service-fabric-cross-availability-zones/sf-cross-az-topology.png
[sf-architecture]: ./media/service-fabric-cross-availability-zones/sf-cross-az-topology.png
[sf-multi-az-arch]: ./media/service-fabric-cross-availability-zones/sf-multi-az-topology.png
[sfmc-multi-az-nodes]: ./media/how-to-managed-cluster-availability-zones/sfmc-multi-az-nodes.png