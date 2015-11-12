
<properties
   pageTitle="Capacity Planning for Service Fabric Applications| Microsoft Azure"
   description="Describes how to identify the number of compute nodes required for a Service Fabric application"
   services="service-fabric"
   documentationCenter=".net"
   authors="mani-ramaswamy"
   manager="coreysa"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="11/12/2015"
   ms.author="subramar"/>


# Capacity Planning for Service Fabric Applications: How many nodes do you need?

This document teaches you how to estimate the amount of resources (CPU, RAM, disk storage) you need to run your Service Fabric applications. It is common for your resource requirements to change over time. You typically require few resources as you develop/test your service and then require more resources as you go into production and your application grows is popularity. When designing your application it is best to think about the long-term requirements today and make choices now that allow your service to easily scale to meet high-customer demand. When creating a Service Fabric cluster, you decide what kinds of virtual machines (VMs) you want making up the cluster. Each VM comes with a limited amount of resources in the form of CPU (cores and speed), network bandwidth, RAM, and disk storage. As your service grows over time, you can upgrade to VMs offering greater resources and/or add more VMs to your cluster. Of course, to do the latter, you must architect your service initially so it can take advantage of new VMs that get dynamically added to the cluster.

Some services manage little to no data on the VMs themselves and therefore capacity planning should focus primarily on performance. This means you should be carefully considering the performance of the code’s algorithms and the VMs CPU (cores and speed) required to execute your algorithms. In addition, you should also consider network bandwidth and specifically how frequently network transfers are occurring and how much data is being transferred. If your service needs to perform well as service usage increases, you can add more VMs to the cluster and load balance the network requests across all the VMs.

For services that manage a lot of data on the VMs, capacity planning should focus primarily on size. This means you should be carefully considering the capacity of the VM’s RAM and disk storage. If your service’s data grows over time, you can add more VMs to the cluster and partition the data across all the VMs.

Partitioning your service allows you to scale out your service’s data (TBD: Link to Boris’ article). Each partition must fit within a single VM but multiple (small) partitions can be placed on a single VM. So, having a larger number of small partitions gives you greater flexibility as opposed to having a small number of larger partitions. The tradeoff is that having lots of partitions increases Service Fabric overhead and you cannot perform transacted operations across partitions. There is also more potential network traffic if your service code frequently needs to access pieces of data that live in different partitions. When designing your service, you should carefully consider these pros and cons to arrive at an effective partitioning strategy.

Let’s assume your application has a single stateful service that has a store size you expect to grow to DB_Size GB in a year, and you are willing to add more applications (and partitions) as you experience growth beyond that year (TBD: Link to partitioning article).  To find the total DB size across all replicas, we have to also take in the Replication Factor, RF, which determines the number of replicas for your service (the total DB size across all replicas is the Replication Factor multiplied by DB_size).  Node_Size represents the memory per node you want to use for your service . For best performance, you will want the DB to fit into memory across the cluster, and will want to put in a Node_Size that is around the RAM capacity of the VM you chose.  By allocating a Node_Size that is larger than the RAM capacity, you are relying on the OS paging, and thus, your performance may not be optimal, but it might still be sufficient for your purpose.

Thus, the number of nodes required for maximum performance can be computed as follows: 

```
Number of Nodes = (DB_Size * RF)/Node_Size

```

You may want to compute the number of nodes based on the DB size that you expect your service to grow to, in addition to the DB size that you start out with, and grow the number of nodes as your service grows so that you are not over provisioning the number of nodes. But, the number of partitions should be based on the number of nodes needed when running your service at maximum growth.
It is a good idea to have a few spare machines (excess capacity) available at any time so that you can handle any unexpected spikes or any infrastructure failure (e.g., if a few machines go down).  While this is something that should be determined by using your expected spikes, a good starting point would be to reserve a few extra machines (5-10% extra).

The above assumes a single stateful service – if you have more than one stateful service, you will have to add the DB size associated with the other services into the equation as well, or compute the number of nodes separately for each stateful service.  Your service may have replicas or partitions that aren’t balanced (e.g., some partitions may have more data than some others – please refer to the partitioning article on best practises.) However, the above equation is agnostic of the number of partitions or replicas, because Service Fabric will ensure that the replicas are spread out amongst the node in an optimized manner using the dynamic load balancer built into the runtime. 

# Spreadsheet for Cost Calculation

Now, let’s put some real numbers to the formula. The spreadsheet [here](http://aka.ms/servicefabricdocs) has an example of an application, its expected max growth and a starting point. The DB size is computed by determining the cost of each object (whether it be using a reliable dictionary, queue or the size of an actor) and the number of instances of the object that’s needed.  You can tweak the spreadsheet to match your service. A snapshot of the spreadhseet is included below for your reference. 

![][Image1]

## Next steps

[Partitioning Service Fabric Services][10]



<!--Image references-->
[Image1]: ./media/SF-Cost.png

<!--Link references--In actual articles, you only need a single period before the slash-->
[10]: service-fabric-concepts-partitioning.md
