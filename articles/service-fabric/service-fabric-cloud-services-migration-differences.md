---
title: Differences between Cloud Services and Service Fabric 
description: A conceptual overview for migrating applications from Cloud Services to Service Fabric.
author: vturecek

ms.topic: conceptual
ms.date: 11/02/2017
ms.author: vturecek
---
# Learn about the differences between Cloud Services and Service Fabric before migrating applications.
Microsoft Azure Service Fabric is the next-generation cloud application platform for highly scalable, highly reliable distributed applications. It introduces many new features for packaging, deploying, upgrading, and managing distributed cloud applications. 

This is an introductory guide to migrating applications from Cloud Services to Service Fabric. It focuses primarily on architectural and design differences between Cloud Services and Service Fabric.

## Applications and infrastructure
A fundamental difference between Cloud Services and Service Fabric is the relationship between VMs, workloads, and applications. A workload here is defined as the code you write to perform a specific task or provide a service.

* **Cloud Services is about deploying applications as VMs.** The code you write is tightly coupled to a VM instance, such as a Web or Worker Role. To deploy a workload in Cloud Services is to deploy one or more VM instances that run the workload. There is no separation of applications and VMs, and so there is no formal definition of an application. An application can be thought of as a set of Web or Worker Role instances within a Cloud Services deployment or as an entire Cloud Services deployment. In this example, an application is shown as a set of role instances.

![Cloud Services applications and topology][1]

* **Service Fabric is about deploying applications to existing VMs or machines running Service Fabric on Windows or Linux.** The services you write are completely decoupled from the underlying infrastructure, which is abstracted away by the Service Fabric application platform, so an application can be deployed to multiple environments. A workload in Service Fabric is called a "service," and one or more services are grouped in a formally-defined application that runs on the Service Fabric application platform. Multiple applications can be deployed to a single Service Fabric cluster.

![Service Fabric applications and topology][2]

Service Fabric itself is an application platform layer that runs on Windows or Linux, whereas Cloud Services is a system for deploying Azure-managed VMs with workloads attached.
The Service Fabric application model has a number of advantages:

* Fast deployment times. Creating VM instances can be time consuming. In Service Fabric, VMs are only deployed once to form a cluster that hosts the Service Fabric application platform. From that point on, application packages can be deployed to the cluster very quickly.
* High-density hosting. In Cloud Services, a Worker Role VM hosts one workload. In Service Fabric, applications are separate from the VMs that run them, meaning you can deploy a large number of applications to a small number of VMs, which can lower overall cost for larger deployments.
* The Service Fabric platform can run anywhere that has Windows Server or Linux machines, whether it's Azure or on-premises. The platform provides an abstraction layer over the underlying infrastructure so your application can run on different environments. 
* Distributed application management. Service Fabric is a platform that not only hosts distributed applications, but also helps manage their lifecycle independently of the hosting VM or machine lifecycle.

## Application architecture
The architecture of a Cloud Services application usually includes numerous external service dependencies, such as Service Bus, Azure Table and Blob Storage, SQL, Redis, and others to manage the state and data of an application and communication between Web and Worker Roles in a Cloud Services deployment. An example of a complete Cloud Services application might look like this:  

![Cloud Services architecture][9]

Service Fabric applications can also choose to use the same external services in a complete application. Using this example Cloud Services architecture, the simplest migration path from Cloud Services to Service Fabric is to replace only the Cloud Services deployment with a Service Fabric application, keeping the overall architecture the same. The Web and Worker Roles can be ported to Service Fabric stateless services with minimal code changes.

![Service Fabric architecture after simple migration][10]

At this stage, the system should continue to work the same as before. Taking advantage of Service Fabric's stateful features, external state stores can be internalized as stateful services where applicable. This is more involved than a simple migration of Web and Worker Roles to Service Fabric stateless services, as it requires writing custom services that provide equivalent functionality to your application as the external services did before. The benefits of doing so include: 

* Removing external dependencies 
* Unifying the deployment, management, and upgrade models. 

An example resulting architecture of internalizing these services could look like this:

![Service Fabric architecture after full migration][11]

## Communication and workflow
Most Cloud Service applications consist of more than one tier. Similarly, a Service Fabric application consists of more than one service (typically many services). Two common communication models are direct communication and via an external durable storage.

### Direct communication
With direct communication, tiers can communicate directly through endpoint exposed by each tier. In stateless environments such as Cloud Services, this means selecting an instance of a VM role, either randomly or round-robin to balance load, and connecting to its endpoint directly.

![Cloud Services direct communication][5]

 Direct communication is a common communication model in Service Fabric. The key difference between Service Fabric and Cloud Services is that in Cloud Services you connect to a VM, whereas in Service Fabric you connect to a service. This is an important distinction for a couple reasons:

* Services in Service Fabric are not bound to the VMs that host them; services may move around in the cluster, and in fact, are expected to move around for various reasons: Resource balancing, failover, application and infrastructure upgrades, and placement or load constraints. This means a service instance's address can change at any time. 
* A VM in Service Fabric can host multiple services, each with unique endpoints.

Service Fabric provides a service discovery mechanism, called the Naming Service, which can be used to resolve endpoint addresses of services. 

![Service Fabric direct communication][6]

### Queues
A common communication mechanism between tiers in stateless environments such as Cloud Services is to use an external storage queue to durably store work tasks from one tier to another. A common scenario is a web tier that sends jobs to an Azure Queue or Service Bus where Worker Role instances can dequeue and process the jobs.

![Cloud Services queue communication][7]

The same communication model can be used in Service Fabric. This can be useful when migrating an existing Cloud Services application to Service Fabric. 

![Service Fabric direct communication][8]

## Parity
[Cloud Services is similar to Service Fabric in degree of control versus ease of use, but it’s now a legacy service and Service Fabric is recommended for new development](https://docs.microsoft.com/azure/app-service/overview-compare); the following is an API comparison:


| **Cloud Service API** | **Service Fabric API** | **Notes** |
| --- | --- | --- |
| RoleInstance.GetID | FabricRuntime.GetNodeContext.NodeId or .NodeName | ID is a property of the NodeName |
| RoleInstance.GetFaultDomain | FabricClient.QueryManager.GetNodeList | Filter on NodeName and use FD Property |
| RoleInstance.GetUpgradeDomain | FabricClient.QueryManager.GetNodeList | Filter on NodeName, and use Upgrade property |
| RoleInstance.GetInstanceEndpoints | FabricRuntime.GetActivationContext or Naming (ResolveService) | CodePackageActivationContext which is provided both by FabricRuntime.GetActivationContext and within the replicas via ServiceInitializationParameters.CodePackageActivationContext provided during .Initialize |
| RoleEnvironment.GetRoles | FabricClient.QueryManager.GetNodeList | If you want to do the same sort of filtering by type you can get the list of node types from the cluster manifest via FabricClient.ClusterManager.GetClusterManifest and grab the role/node types from there. |
| RoleEnvironment.GetIsAvailable | Connect-WindowsFabricCluster or create a FabricRuntime pointed to a particular node | * |
| RoleEnvironment.GetLocalResource | CodePackageActivationContext.Log/Temp/Work | * |
| RoleEnvironment.GetCurrentRoleInstance | CodePackageActivationContext.Log/Temp/Work | * |
| LocalResource.GetRootPath | CodePackageActivationContext.Log/Temp/Work | * |
| Role.GetInstances | FabricClient.QueryManager.GetNodeList or ResolveService | * |
| RoleInstanceEndpoint.GetIPEndpoint | FabricRuntime.GetActivationContext or Naming (ResolveService) | * |

## Next Steps
The simplest migration path from Cloud Services to Service Fabric is to replace only the Cloud Services deployment with a Service Fabric application, keeping the overall architecture of your application roughly the same. The following article provides a guide to help convert a Web or Worker Role to a Service Fabric stateless service.

* [Simple migration: convert a Web or Worker Role to a Service Fabric stateless service](service-fabric-cloud-services-migration-worker-role-stateless-service.md)

<!--Image references-->
[1]: ./media/service-fabric-cloud-services-migration-differences/topology-cloud-services.png
[2]: ./media/service-fabric-cloud-services-migration-differences/topology-service-fabric.png
[5]: ./media/service-fabric-cloud-services-migration-differences/cloud-service-communication-direct.png
[6]: ./media/service-fabric-cloud-services-migration-differences/service-fabric-communication-direct.png
[7]: ./media/service-fabric-cloud-services-migration-differences/cloud-service-communication-queues.png
[8]: ./media/service-fabric-cloud-services-migration-differences/service-fabric-communication-queues.png
[9]: ./media/service-fabric-cloud-services-migration-differences/cloud-services-architecture.png
[10]: ./media/service-fabric-cloud-services-migration-differences/service-fabric-architecture-simple.png
[11]: ./media/service-fabric-cloud-services-migration-differences/service-fabric-architecture-full.png
