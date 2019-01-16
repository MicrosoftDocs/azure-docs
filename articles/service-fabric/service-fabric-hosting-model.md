---
title: Azure Service Fabric hosting model | Microsoft Docs
description: Describes the relationship between replicas (or instances) of a deployed Service Fabric service and the service-host process.
services: service-fabric
documentationcenter: .net
author: harahma
manager: timlt

ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 04/15/2017
ms.author: harahma

---
# Azure Service Fabric hosting model
This article provides an overview of application hosting models provided by Azure Service Fabric, and describes the differences between the **Shared Process** and **Exclusive Process** models. It describes how a deployed application looks on a Service Fabric node, and the relationship between replicas (or instances) of the service and the service-host process.

Before proceeding further, be sure that you understand the various concepts and relationships explained in [Model an application in Service Fabric][a1]. 

> [!NOTE]
> In this article, unless explicitly mentioned as meaning something different:
>
> - *Replica* refers to both a replica of a stateful service and an instance of a stateless service.
> - *CodePackage* is treated as equivalent to a *ServiceHost* process that registers a *ServiceType*, and hosts replicas of services of that *ServiceType*.
>

To understand the hosting model, let's walk through an example. Let's say we have an *ApplicationType* 'MyAppType', which has a *ServiceType* 'MyServiceType'. 'MyServiceType' is provided by the *ServicePackage* 'MyServicePackage', which has a *CodePackage* 'MyCodePackage'. 'MyCodePackage' registers *ServiceType* 'MyServiceType' when it runs.

Let's say we have a three-node cluster, and we create an *application* **fabric:/App1** of type 'MyAppType'. Inside this application **fabric:/App1**, we create a service **fabric:/App1/ServiceA** of type 'MyServiceType'. This service has two partitions (for example, **P1** and **P2**), and three replicas per partition. The following diagram shows the view of this application as it ends up deployed on a node.


![Diagram of node view of deployed application][node-view-one]


Service Fabric activated 'MyServicePackage', which started 'MyCodePackage', which is hosting replicas from both the partitions. All the nodes in the cluster have the same view, because we chose the number of replicas per partition to be equal to the number of nodes in the cluster. Let's create another service, **fabric:/App1/ServiceB**, in the application **fabric:/App1**. This service has one partition (for example, **P3**), and three replicas per partition. The following diagram shows the new view on the node:


![Diagram of node view of deployed application][node-view-two]


Service Fabric placed the new replica for partition **P3** of service **fabric:/App1/ServiceB** in the existing activation of 'MyServicePackage'. Now. let's create another application **fabric:/App2** of type 'MyAppType'. Inside **fabric:/App2**, create a service **fabric:/App2/ServiceA**. This service has two partitions (**P4** and **P5**), and three replicas per partition. The following diagram shows the new node view:


![Diagram of node view of deployed application][node-view-three]


Service Fabric activates a new copy of 'MyServicePackage', which starts a new copy of 'MyCodePackage'. Replicas from both partitions of service **fabric:/App2/ServiceA** (**P4** and **P5**) are placed in this new copy 'MyCodePackage'.

## Shared Process model
The preceding section describes the default hosting model provided by Service Fabric, referred to as the Shared Process model. In this model, for a given application, only one copy of a given *ServicePackage* is activated on a node (which starts all the *CodePackages* contained in it). All the replicas of all services of a given *ServiceType* are placed in the *CodePackage* that registers that *ServiceType*. In other words, all the replicas of all services on a node of a given *ServiceType* share the same process.

## Exclusive Process model
The other hosting model provided by Service Fabric is the Exclusive Process model. In this model, on a given node, each replica lives in its own dedicated process. Service Fabric activates a new copy of *ServicePackage* (which starts all the *CodePackages* contained in it). Replicas are placed in the *CodePackage* that registered the *ServiceType* of the service to which the replica belongs. 

If you are using Service Fabric version 5.6 or later, you can choose the Exclusive Process model at the time you create a service (by using [PowerShell][p1], [REST][r1], or [FabricClient][c1]). Specify **ServicePackageActivationMode** as 'ExclusiveProcess'.

```powershell
PS C:\>New-ServiceFabricService -ApplicationName "fabric:/App1" -ServiceName "fabric:/App1/ServiceA" -ServiceTypeName "MyServiceType" -Stateless -PartitionSchemeSingleton -InstanceCount -1 -ServicePackageActivationMode "ExclusiveProcess"
```

```csharp
var serviceDescription = new StatelessServiceDescription
{
    ApplicationName = new Uri("fabric:/App1"),
    ServiceName = new Uri("fabric:/App1/ServiceA"),
    ServiceTypeName = "MyServiceType",
    PartitionSchemeDescription = new SingletonPartitionSchemeDescription(),
    InstanceCount = -1,
    ServicePackageActivationMode = ServicePackageActivationMode.ExclusiveProcess
};

var fabricClient = new FabricClient(clusterEndpoints);
await fabricClient.ServiceManager.CreateServiceAsync(serviceDescription);
```

If you have a default service in your application manifest, you can choose the Exclusive Process model by specifying the **ServicePackageActivationMode** attribute:

```xml
<DefaultServices>
  <Service Name="MyService" ServicePackageActivationMode="ExclusiveProcess">
    <StatelessService ServiceTypeName="MyServiceType" InstanceCount="1">
      <SingletonPartition/>
    </StatelessService>
  </Service>
</DefaultServices>
```
Now let's create another service, **fabric:/App1/ServiceC**, in application **fabric:/App1**. This service has two partitions (for example, **P6** and **P7**), and three replicas per partition. You set **ServicePackageActivationMode** to 'ExclusiveProcess'. The following diagram shows new view on the node:


![Diagram of node view of deployed application][node-view-four]


As you can see, Service Fabric activated two new copies of 'MyServicePackage' (one for each replica from partition **P6** and **P7**). Service Fabric placed each replica in its dedicated copy of *CodePackage*. When you use the Exclusive Process model, for a given application, multiple copies of a given *ServicePackage* can be active on a node. In the preceding example, three copies of 'MyServicePackage' are active for **fabric:/App1**. Each of these active copies of 'MyServicePackage' has a **ServicePackageActivationId** associated with it. This ID identifies that copy within application **fabric:/App1**.

When you use only the Shared Process model for an application, there is only one active copy of *ServicePackage* on a node. The **ServicePackageActivationId** for this activation of *ServicePackage* is an empty string. This is the case, for example, with **fabric:/App2**.

> [!NOTE]
>- The Shared Process hosting model corresponds to **ServicePackageActivationMode** equals **SharedProcess**. This is the default hosting model, and **ServicePackageActivationMode** need not be specified at the time of creating the service.
>
>- The Exclusive Process hosting model corresponds to **ServicePackageActivationMode** equals **ExclusiveProcess**. To use this setting, you should specify it explicitly at the time of creating the service. 
>
>- To view the hosting model of a service, query the [service description][p2], and look at the value of **ServicePackageActivationMode**.
>
>

## Work with a deployed service package
An active copy of a *ServicePackage* on a node is referred to as a [deployed service package][p3]. When you use the Exclusive Process model for creating services, for a given application, there might be multiple deployed service packages for the same *ServicePackage*. If you are performing operations specific to a deployed service package, you should provide **ServicePackageActivationId** to identify a specific deployed service package. For example, provide the ID if you are [reporting the health of a deployed service package][p4] or [restarting the code package of a deployed service package][p5].

You can find out the **ServicePackageActivationId** of a deployed service package by querying the list of [deployed service packages][p3] on a node. When you are querying for the [deployed service types][p6], [deployed replicas][p7], and [deployed code packages][p8] on a node, the query result also contains the **ServicePackageActivationId** of the parent deployed service package.

> [!NOTE]
>- Under the Shared Process hosting model, on a given node, for a given application, only one copy of a *ServicePackage* is activated. It has a **ServicePackageActivationId** equal to *empty string*, and need not be specified while performing operations related to the deployed service package. 
>
> - Under the Exclusive Process hosting model, on a given node, for a given application, one or more copies of a *ServicePackage* can be active. Each activation has a *non-empty* **ServicePackageActivationId**, specified while performing operations related to the deployed service package. 
>
> - If **ServicePackageActivationId** is omitted, it defaults to *empty string*. If a deployed service package that was activated under the Shared Process model is present, the operation will be performed on it. Otherwise, the operation fails.
>
> - Do not query once and cache the **ServicePackageActivationId**. The ID is dynamically generated, and can change for various reasons. Before performing an operation that needs **ServicePackageActivationId**, you should first query the list of [deployed service packages][p3] on a node. Then use the **ServicePackageActivationId** from the query result to perform the original operation.
>
>

## Guest executable and container applications
Service Fabric treats [guest executable][a2] and [container][a3] applications as stateless services, which are self-contained. There is no Service Fabric runtime in *ServiceHost* (a process or container). Because these services are self-contained, the number of replicas per *ServiceHost* is not applicable for these services. The most common configuration used with these services is single-partition, with [InstanceCount][c2] equal to -1 (one copy of the service code running on each node of the cluster). 

The default **ServicePackageActivationMode** for these services is **SharedProcess**, in which case Service Fabric only activates one copy of *ServicePackage* on a node for a given application.  This means only one copy of service code will run a node. If you want multiple copies of your service code to run on a node, specify **ServicePackageActivationMode** as **ExclusiveProcess** at the time of creating the service. For example, you can do this when you create multiple services (*Service1* to *ServiceN*) of *ServiceType* (specified in *ServiceManifest*), or when your service is multi-partitioned. 

## Change the hosting model of an existing service
At the present time, you can't change the hosting model of an existing service from Shared Process to Exclusive Process (or vice-versa).

## Choose between the hosting models
You should evaluate which hosting model best fits your requirements. The Shared Process model uses operating system resources better, because fewer processes are spawned, and multiple replicas in the same process can share ports. However, if one of the replicas has an error where it needs to bring down the service host, it impacts all other replicas in same process.

 The Exclusive Process model provides better isolation, with every replica in its own process. If one of the replicas has an error, it does not impact other replicas. This model is useful for cases where port sharing is not supported by the communication protocol. It facilitates the ability to apply resource governance at replica level. However, the Exclusive Process consumes more operating system resources, as it spawns one process for each replica on the node.

## Exclusive Process model and application model considerations
For most applications, you can model your application in Service Fabric by keeping one *ServiceType* per *ServicePackage*. 

For certain cases, Service Fabric also allows more than one *ServiceType* per *ServicePackage* (and one *CodePackage* can register more than one *ServiceType*). The following are some of the scenarios where these configurations can be useful:

- You want to optimize resource utilization by spawning fewer processes and having higher replica density per process.
- Replicas from different *ServiceTypes* need to share some common data that has a high initialization or memory cost.
- You have a free service offering, and you want to put a limit on resource utilization by putting all replicas of the service in same process.

The Exclusive Process hosting model is not coherent with an application model having multiple *ServiceTypes* per *ServicePackage*. This is because multiple *ServiceTypes* per *ServicePackage* are designed to achieve higher resource sharing among replicas, and enables higher replica density per process. The Exclusive Process model is designed to achieve different outcomes.

Consider the case of multiple *ServiceTypes* per *ServicePackage*, with a different *CodePackage* registering each *ServiceType*. Let's say we have a *ServicePackage* 'MultiTypeServicePackge', which has two *CodePackages*:

- 'MyCodePackageA', which registers *ServiceType* 'MyServiceTypeA'.
- 'MyCodePackageB', which registers *ServiceType* 'MyServiceTypeB'.

Now, let's say that we create an application, **fabric:/SpecialApp**. Inside **fabric:/SpecialApp**, we create following two services with the Exclusive Process model:

- Service **fabric:/SpecialApp/ServiceA** of type 'MyServiceTypeA', with two partitions (for example, **P1** and **P2**), and three replicas per partition.
- Service **fabric:/SpecialApp/ServiceB** of type 'MyServiceTypeB', with two partitions (**P3** and **P4**), and three replicas per partition.

On a given node, both of the services have two replicas each. Because we used the Exclusive Process model to create the services, Service Fabric activates a new copy of 'MyServicePackage' for each replica. Each activation of 'MultiTypeServicePackge' starts a copy of 'MyCodePackageA' and 'MyCodePackageB'. However, only one of 'MyCodePackageA' or 'MyCodePackageB' hosts the replica for which 'MultiTypeServicePackge' was activated. The following diagram shows the node view:


![Diagram of the node view of deployed application][node-view-five]


In the activation of 'MultiTypeServicePackge' for the replica of partition **P1** of service **fabric:/SpecialApp/ServiceA**, 'MyCodePackageA' is hosting the replica. 'MyCodePackageB' is running. Similarly, in the activation of 'MultiTypeServicePackge' for the replica of partition **P3** of service **fabric:/SpecialApp/ServiceB**, 'MyCodePackageB' is hosting the replica. 'MyCodePackageA' is running. Hence, the greater the number of *CodePackages* (registering different *ServiceTypes*) per *ServicePackage*, the higher the redundant resource usage. 
 
 However, if we create the services **fabric:/SpecialApp/ServiceA** and **fabric:/SpecialApp/ServiceB** with the Shared Process model, Service Fabric activates only one copy of 'MultiTypeServicePackge' for the application **fabric:/SpecialApp**. 'MyCodePackageA' hosts all replicas for the service **fabric:/SpecialApp/ServiceA**. 'MyCodePackageB' hosts all replicas for the service **fabric:/SpecialApp/ServiceB**. The following diagram shows the node view in this setting: 


![Diagram of the node view of deployed application][node-view-six]


In the preceding example, you might think that if 'MyCodePackageA' registers both 'MyServiceTypeA' and 'MyServiceTypeB', and there is no 'MyCodePackageB', then there is no redundant *CodePackage* running. Although this is correct, this application model does not align with the Exclusive Process hosting model. If the goal is to put each replica in its own dedicated process, you do not need to register both *ServiceTypes* from same *CodePackage*. Instead, you simply put each *ServiceType* in its own *ServicePackage*.

## Next steps
[Package an application][a4] and get it ready to deploy.

[Deploy and remove applications][a5]. This article describes how to use PowerShell to manage application instances.

<!--Image references-->
[node-view-one]: ./media/service-fabric-hosting-model/node-view-one.png
[node-view-two]: ./media/service-fabric-hosting-model/node-view-two.png
[node-view-three]: ./media/service-fabric-hosting-model/node-view-three.png
[node-view-four]: ./media/service-fabric-hosting-model/node-view-four.png
[node-view-five]: ./media/service-fabric-hosting-model/node-view-five.png
[node-view-six]: ./media/service-fabric-hosting-model/node-view-six.png

<!--Link references--In actual articles, you only need a single period before the slash-->
[a1]: service-fabric-application-model.md
[a2]: service-fabric-guest-executables-introduction.md
[a3]: service-fabric-containers-overview.md
[a4]: service-fabric-package-apps.md
[a5]: service-fabric-deploy-remove-applications.md

[r1]: https://docs.microsoft.com/rest/api/servicefabric/sfclient-api-createservice

[c1]: https://docs.microsoft.com/dotnet/api/system.fabric.fabricclient.servicemanagementclient.createserviceasync
[c2]: https://docs.microsoft.com/dotnet/api/system.fabric.description.statelessservicedescription.instancecount

[p1]: https://docs.microsoft.com/powershell/module/servicefabric/new-servicefabricservice
[p2]: https://docs.microsoft.com/powershell/module/servicefabric/get-servicefabricservicedescription
[p3]: https://docs.microsoft.com/powershell/module/servicefabric/get-servicefabricdeployedservicePackage
[p4]: https://docs.microsoft.com/powershell/module/servicefabric/send-servicefabricdeployedservicepackagehealthreport
[p5]: https://docs.microsoft.com/powershell/module/servicefabric/restart-servicefabricdeployedcodepackage
[p6]: https://docs.microsoft.com/powershell/module/servicefabric/get-servicefabricdeployedservicetype
[p7]: https://docs.microsoft.com/powershell/module/servicefabric/get-servicefabricdeployedreplica
[p8]: https://docs.microsoft.com/powershell/module/servicefabric/get-servicefabricdeployedcodepackage
