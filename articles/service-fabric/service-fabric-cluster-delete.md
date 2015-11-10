<properties
   pageTitle="Deleting a Service Fabric cluster  | Microsoft Azure"
   description="Deleting a Service Fabric cluster"
   services="service-fabric"
   documentationCenter=".net"
   authors="ChackDan"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="11/9/2015"
   ms.author="chackdan"/>

# Deleting a Service Fabric cluster.

The service fabric cluster is stitched together from a lot of azure resource types like a VNet, one or more Availablity sets, multiple VMs or VMSSs, Atleast one VIP, Atleast one LoadBalancer and atleast one storage. So in order to delete the cluster you need to delete all the resources that make up your cluster.

If you had created a new resource group (RG) for your cluster, then you can just delete the RG and you are done.
if you used an existing RG while creating your cluster, then you have to now delete each of the resources that was used in putting together the cluster.


## Next steps

- [Learn about cluster upgrades](service-fabric-cluster-upgrade.md)
- [Learn about partitioning stateful services for maximum scale](service-fabric-concepts-partitioning.md)



