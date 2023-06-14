---
title: Introducing the Service Fabric Cluster Resource Manager 
description: Learn about the Service Fabric Cluster Resource Manager, a way to manage orchestration of your application's services.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Introducing the Service Fabric cluster resource manager
Traditionally managing IT systems or online services meant dedicating specific physical or virtual machines to those specific services or systems. Services were architected as tiers. There would be a “web” tier and a “data” or “storage” tier. Applications would have a messaging tier where requests flowed in and out, as well as a set of machines dedicated to caching. Each tier or type of workload had specific machines dedicated to it: the database got a couple machines dedicated to it, the web servers a few. If a particular type of workload caused the machines it was on to run too hot, then you added more machines with that same configuration to that tier. However, not all workloads could be scaled out so easily - particularly with the data tier you would typically replace machines with larger machines. Easy. If a machine failed, that part of the overall application ran at lower capacity until the machine could be restored. Still fairly easy (if not necessarily fun).

Now however the world of service and software architecture has changed. It's more common that applications have adopted a scale-out design. Building applications with containers or microservices (or both) is common. Now, while you may still have only a few machines, they're not running just a single instance of a workload. They may even be running multiple different workloads at the same time. You now have dozens of different types of services (none consuming a full machine's worth of resources), perhaps hundreds of different instances of those services. Each named instance has one or more instances or replicas for High Availability (HA). Depending on the sizes of those workloads, and how busy they are, you may find yourself with hundreds or thousands of machines. 

Suddenly managing your environment is not so simple as managing a few machines dedicated to single types of workloads. Your servers are virtual and no longer have names (you have switched mindsets from [pets to cattle](https://www.slideshare.net/randybias/architectures-for-open-and-scalable-clouds/20) after all). Configuration is less about the machines and more about the services themselves. Hardware that is dedicated to a single instance of a workload is largely a thing of the past. Services themselves have become small distributed systems that span multiple smaller pieces of commodity hardware.

Because your app is no longer a series of monoliths spread across several tiers, you now have many more combinations to deal with. Who decides what types of workloads can run on which hardware, or how many? Which workloads work well on the same hardware, and which conflict? When a machine goes down how do you know what was running there on that machine? Who is in charge of making sure that workload starts running again? Do you wait for the (virtual?) machine to come back or do your workloads automatically fail over to other machines and keep running? Is human intervention required? What about upgrades in this environment?

As developers and operators dealing in this environment, we’re going to want help with managing this complexity. A hiring binge and trying to hide the complexity with people is probably not the right answer, so what do we do?

## Introducing orchestrators
An “Orchestrator” is the general term for a piece of software that helps administrators manage these types of environments. Orchestrators are the components that take in requests like “I would like five copies of this service running in my environment." They try to make the environment match the desired state, no matter what happens.

Orchestrators (not humans) are what take action when a machine fails or a workload terminates for some unexpected reason. Most orchestrators do more than just deal with failure. Other features they have are managing new deployments, handling upgrades, and dealing with resource consumption and governance. All orchestrators are fundamentally about maintaining some desired state of configuration in the environment. You want to be able to tell an orchestrator what you want and have it do the heavy lifting. Aurora on top of Mesos, Docker Datacenter/Docker Swarm, Kubernetes, and Service Fabric are all examples of orchestrators. These orchestrators are being actively developed to meet the needs of real workloads in production environments. 

## Orchestration as a service
The Cluster Resource Manager is the system component that handles orchestration in Service Fabric. The Cluster Resource Manager’s job is broken down into three parts:

1. Enforcing Rules
2. Optimizing Your Environment
3. Helping with Other Processes

[Check this page for a training video to understand how the Cluster Resource Manager works:](/shows/building-microservices-applications-on-azure-service-fabric/cluster-resource-manager)
### What it isn’t
In traditional N tier applications, there's always a [Load Balancer](https://en.wikipedia.org/wiki/Load_balancing_(computing)). Usually this was a Network Load Balancer (NLB) or an Application Load Balancer (ALB) depending on where it sat in the networking stack. Some load balancers are Hardware-based like F5’s BigIP offering, others are software-based such as Microsoft’s NLB. In other environments, you might see something like HAProxy, nginx, Istio, or Envoy in this role. In these architectures, the job of load balancing is to ensure stateless workloads receive (roughly) the same amount of work. Strategies for balancing load varied. Some balancers would send each different call to a different server. Others provided session pinning/stickiness. More advanced balancers use actual load estimation or reporting to route a call based on its expected cost and current machine load.

Network balancers or message routers tried to ensure that the web/worker tier remained roughly balanced. Strategies for balancing the data tier were different and depended on the data storage mechanism. Balancing the data tier relied on data sharding, caching, managed views, stored procedures, and other store-specific mechanisms.

While some of these strategies are interesting, the Service Fabric Cluster Resource Manager is not anything like a network load balancer or a cache. A Network Load Balancer balances frontends by spreading traffic across frontends. The Service Fabric Cluster Resource Manager has a different strategy. Fundamentally, Service Fabric moves *services* to where they make the most sense, expecting traffic or load to follow. For example, it might move services to nodes that are currently cold because the services that are there are not doing much work. The nodes may be cold since the services that were present were deleted or moved elsewhere. As another example, the Cluster Resource Manager could also move a service away from a machine. Perhaps the machine is about to be upgraded, or is overloaded due to a spike in consumption by the services running on it. Alternatively, the service's resource requirements may have increased. As a result there aren't sufficient resources on this machine to continue running it. 

Because the Cluster Resource Manager is responsible for moving services around, it contains a different feature set compared to what you would find in a network load balancer. This is because network load balancers deliver network traffic to where services already are, even if that location is not ideal for running the service itself. The Service Fabric Cluster Resource Manager employs fundamentally different strategies for ensuring that the resources in the cluster are efficiently utilized.

## Next steps
- For information on the architecture and information flow within the Cluster Resource Manager, check out [this article](service-fabric-cluster-resource-manager-architecture.md)
- The Cluster Resource Manager has many options for describing the cluster. To find out more about metrics, check out this article on [describing a Service Fabric cluster](service-fabric-cluster-resource-manager-cluster-description.md)
- For more information on configuring services, [Learn about configuring Services](service-fabric-cluster-resource-manager-configure-services.md)
- Metrics are how the Service Fabric Cluster Resource Manger manages consumption and capacity in the cluster. To learn more about metrics and how to configure them check out [this article](service-fabric-cluster-resource-manager-metrics.md)
- The Cluster Resource Manager works with Service Fabric's management capabilities. To find out more about that integration, read [this article](service-fabric-cluster-resource-manager-management-integration.md)
- To find out about how the Cluster Resource Manager manages and balances load in the cluster, check out the article on [balancing load](service-fabric-cluster-resource-manager-balancing.md)
