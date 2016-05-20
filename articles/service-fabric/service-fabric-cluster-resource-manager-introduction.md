<properties
   pageTitle="Introducing the Service Fabric Cluster Resource Manager | Microsoft Azure"
   description="An introduction to the Service Fabric Cluster Resource Manager."
   services="service-fabric"
   documentationCenter=".net"
   authors="masnider"
   manager="timlt"
   editor=""/>

<tags
   ms.service="Service-Fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="05/20/2016"
   ms.author="masnider"/>

# Introducing the Service Fabric cluster resource manager
Traditionally managing IT systems or a set of services meant getting a few machines dedicated to those specific services or systems. Many major services were broken down into a “web” tier and a “data” or “storage” tier, maybe with a few other specialized components like a cache. Other types of applications would have a messaging tier where requests flowed in and out, connected to a work tier for any analysis or transformation necessary as a part of the messaging. Each part got a specific machines or a couple of machines dedicated to it: the database got a couple machines dedicated to it, the web servers a few. If a particular type of workload caused the machines it was on to run too hot, then you added more machines with that type of workload configured to run on it, or replace a few of the machines with larger machines. Easy. If a machine failed, that part of the overall application ran at lower capacity until the machine could be restored. Still fairly easy (if not necessarily fun).

Now however, let’s say you’ve found a need to scale out and have taken the containers and/or microservice plunge. Suddenly you find yourself with hundreds or even thousands of machines, dozens of different types of services, perhaps hundreds of different instances of those services, each with one or more instances or replicas for High Availability (HA).

Suddenly managing your environment is not so simple as managing a few machines dedicated to single types of workloads. Your servers are virtual and no longer have names (you have switched mindsets from [pets to cattle](http://www.slideshare.net/randybias/architectures-for-open-and-scalable-clouds/20) after all), and machines aren’t dedicated to single types of workloads. Configuration is less about the machines and more about the services themselves.

As a consequence of this decoupling and breaking your formerly monolithic tiered app into separate services, you now have many more combinations to deal with. Who decides what types of workloads can run on specific hardware, or next to each other? When a machine goes down… what was even running there? Who is in charge of making sure it starts running again? Do you wait for the (virtual) machine to come back or do your workloads automatically fail over to other machines and keep running? Is human intervention required? What about upgrades in this sort of environment? As developers and operators in this sort of environment, we’re going to need some help managing this complexity, and you get the sense that a hiring binge and trying to paper over the complexity with people is not the right answer.

What to do?

## Introducing orchestrators
An “Orchestrator” is the general term for a piece of software that helps administrators manage these types of deployments. Orchestrators are the components that take in requests like “I would like 5 copies of this service running in my environment” make it true, and (try) to keep it that way.

Orchestrators (not humans) are what swing into action when a machine fails or a workload terminates for some unexpected reason. Most Orchestrators do more than just deal with failure, such as helping with new deployments, handling upgrades, and dealing with resource consumption, but all are fundamentally about maintaining some desired state of configuration in the environment. You want to be able to tell an Orchestrator what you want and have it do the heavy lifting. Chronos or Marathon on top of Mesos, Fleet, Swarm, Kubernetes, and Service Fabric are all types of Orchestrators or have them built in. More are being created all the time as the complexities of managing real world deployments in different types of environments and conditions grow and change.

## Orchestration as a service
The job of the Orchestrator within a Service Fabric cluster is handled primarily by the Cluster Resource Manager. The Service Fabric Cluster Resource Manager is one of the System Services within Service Fabric and is automatically started up within each cluster.  Generally, the Resource Manager’s job is broken down into three parts:

1. Enforcing Rules
2. Optimizing Your Environment
3. Assisting in Other Processes

Before we look at all of the capabilities that the Resource Manager has, let’s take a brief look at how it works.
The Service Fabric Cluster Resource Manager

## General architecture and implementation
Before we get too far in describing the Cluster Resource Manager and all of its features, let’s first talk a bit about what it really is and how it works.

### What it isn’t
In traditional N tier web-apps there was always some notion of a “Load Balancer”, usually referred to as a Network Load Balancer (NLB) or an Application Load Balancer (ALB) depending on where it sat in the networking stack. Some load balancers are Hardware based like F5’s BigIP offering, others are software based such as Microsoft’s NLB. In these architectures the job of load balancing is to make sure that all of the different stateless front end machines or the different machines in the cluster receive (roughly) the same amount of work. Strategies for this varied, from sending each different call to a different server, to session pinning/stickiness, to actual estimation and call allocation based on its expected cost and current machine load.

Note that this was at best the mechanism for ensuring that the web tier remained roughly balanced. Strategies for balancing the data tier were completely different and depended on the data storage mechanism, usually centering around data sharding, caching, database managed views and stored procedures, etc.

While some of these strategies are interesting, the Service Fabric Cluster Resource Manager is not anything like a network load balancer or a cache. While a Network Load Balancer ensures that the front ends are balanced by moving traffic to where the services are running, the Service Fabric Cluster Resource Manager takes a completely different strategy – fundamentally, Service Fabric moves *services* to where they make the most sense (and expects traffic or load to follow). This can be, for example, nodes which are currently cold because the services which are there are not doing a lot of work right now. It could also be away from a node which is about to be upgraded or which is overloaded due to a spike in consumption of the services which were running on it. Because it is responsible for moving services around (not delivering network traffic to where services already are), the Service Fabric Resource Manager is more versatile and also contains additional capabilities for controlling where and how services are moved.

## Next steps
- For information on the architecture and information flow within the Cluster Resource manager, check out [this article ](service-fabric-cluster-resource-manager-architecture.md)
- The Cluster Resource Manager has a lot of options for describing the cluster. To find out more about them check out this article on [describing a Service Fabric cluster](service-fabric-cluster-resource-manager-cluster-description.md)
- For more information about the other options available for configuring services check out the topic on the other Cluster Resource Manager configurations available [Learn about configuring Services](service-fabric-cluster-resource-manager-configure-services.md)
- Metrics are how the Service Fabric Cluster Resource Manger manages consumption and capacity in the cluster. To learn more about them and how to configure them check out [this article](service-fabric-cluster-resource-manager-metrics.md)
- The Cluster Resource Manager works with Service Fabric's management capabilities. To find out more about that integration, read [this article](service-fabric-cluster-resource-manager-management-integration.md)
- To find out about how the Cluster Resource Manager manages and balances load in the cluster, check out the article on [balancing load](service-fabric-cluster-resource-manager-balancing.md)
