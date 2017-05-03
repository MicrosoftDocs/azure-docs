---
title: Azure Service Fabric Hosting Model | Microsoft Docs
description: Describes relationship between replicas (or instances) of a deployed Servic Fabric service and service-host process.
services: service-fabric
documentationcenter: .net
author: harahma
manager: timlt

ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 04/15/2017
ms.author: harahma

---
# Service Fabric hosting model
This article provides an overview of application hosting models provided by Service Fabric, and describes the differences between the **Shared Process** and **Exclusive Process** models. It describes how a deployed application looks on a Service Fabric node and relationship between replicas (or instances) of the service and the service-host process.

Before proceeding further, make sure that you are familiar with [Service Fabric Application Model][a1] and understand various concepts and relation among them. 

> [!NOTE]
> In this article, for simplicity, unless explicitly mentioned:
>
> - All uses of word *replica* refers to both a replica of a stateful service or an instance of a statless service.
> - *CodePackage* is treated equivalent to *ServiceHost* process that registers a *ServiceType* and hosts replicas of services of that *ServiceType*.
>

To understand the hosting model, let us walk through an example. Let us say, we have an *ApplicationType* 'MyAppType' which has a *ServiceType* 'MyServiceType' which is provided by *ServicePackage* 'MyServicePackage' which has a *CodePackage* 'MyCodePackage' which registers *ServiceType* 'MyServiceType' when it runs.

Let's say we have a 3 node cluster and we create an *application* **fabric:/App1** of type 'MyAppType'. Inside this *application* **fabric:/App1** we create a service **fabric:/App1/ServiceA** of type 'MyServiceType' which has 2 partitions (say **P1** & **P2**) and 3 replicas per partition. The following diagram shows the view of this application as it ends up deployed on a node.

<center>
![Node view of deployed application][node-view-one]
</center>

Service Fabric activated 'MyServicePackage' which started 'MyCodePackage' which is hosting replicas from both the partitions i.e. **P1** & **P2**. Note that all the nodes in the cluster will have same view since we chose number of replicas per partition equal to number of nodes in the cluster. Let's create another service **fabric:/App1/ServiceB** in application **fabric:/App1** which has 1 partition (say **P3**) and 3 replicas per partition. Following diagram shows the new view on the node:

<center>
![Node view of deployed application][node-view-two]
</center>

As we can see Service Fabric placed the new replica for partition **P3** of service **fabric:/App1/ServiceB** in the existing activation of 'MyServicePackage'. Now lets create another *application* **fabric:/App2** of type 'MyAppType' and inside **fabric:/App2** create service **fabric:/App2/ServiceA** which has 2 partitions (say **P4** & **P5**) and 3 replicas per partition. Following diagrams shows the new node view:

<center>
![Node view of deployed application][node-view-three]
</center>

This time Service Fabric has activated a new copy of 'MyServicePackage' which starts a new copy of 'MyCodePackage' and replicas from both partitions of service **fabric:/App2/ServiceA** (i.e. **P4** & **P5**) are placed in this new copy 'MyCodePackage'.

## Shared process model
What we saw above is the default hosting model provided by Service Fabric and is referred to as **Shared Process** model. In this model, for a given *application*, only one copy of a given *ServicePackage* is activated on a *Node* (which starts all the *CodePackages* contained in it) and all the replicas of all services of a given  *ServiceType* are placed in the *CodePackage* that registers that *ServiceType*. In other words, all the replicas of all services of a given *ServiceType* share the same process.

## Exclusive process model
The other hosting model provided by Service Fabric is **Exclusive Process** model. In this model, on a given *Node*, for placing each replica, Service Fabric activates a new copy of *ServicePackage* (which starts all the *CodePackages* contained in it) and replica is placed in the *CodePackage* that registered the *ServiceType* of the service to which replica belongs. In other words, each replica lives in its own dedicated process. 

This model is supported starting version 5.6 of Service Fabric. **Exclusive Process** model can be chosen at the time of creating the service (using [PowerShell][p1], [REST][r1] or [FabricClient][c1]) by specifying **ServicePackageActivationMode** as 'ExclusiveProcess'.

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

If you have a default service in your application manifest, you can choose **Exclusive Process** model by specifying **ServicePackageActivationMode** attribute as shown below:

```xml
<DefaultServices>
  <Service Name="MyService" ServicePackageActivationMode="ExclusiveProcess">
    <StatelessService ServiceTypeName="MyServiceType" InstanceCount="1">
      <SingletonPartition/>
    </StatelessService>
  </Service>
</DefaultServices>
```
Continuing with our example above, lets create another service **fabric:/App1/ServiceC** in application **fabric:/App1** which has 2 partitions (say **P6** & **P7**) and 3 replicas per partition with **ServicePackageActivationMode** set to 'ExclusiveProcess'. Following diagram shows new view on the node:

<center>
![Node view of deployed application][node-view-four]
</center>

As you can see, Service Fabric activated two new copies of 'MyServicePackage' (one for each replica from partition **P6** & **P7**) and placed each replica in its dedicated copy of *CodePackage*. Another thing to note here is, when **Exclusive Process** model is used, for a given *application*, multiple copies of a given *ServicePackage* can be active on a *Node*. In above example, we see that three copies of 'MyServicePackage' are active for **fabric:/App1**. Each of these active copies of 'MyServicePackage' has a **ServicePackageAtivationId** associated with it which identifies that copy within *application* **fabric:/App1**.

When only **Shared Process** model is used for an *application*, like **fabric:/App2** in above example, there is only one active copy of *ServicePackage* on a *Node* and **ServicePackageAtivationId** for this activation of *ServicePackage* is 'empty string'.

> [!NOTE]
>- **Shared Process** hosting model corresponds to **ServicePackageAtivationMode** equal **SharedProcess**. This is the default hosting model and **ServicePackageAtivationMode** need not be specified at the time of creating the service.
>
>- **Exclusive Process** hosting model corresponds to **ServicePackageAtivationMode** equal **ExclusiveProcess** and need to be explicitly specified at the time of creating the service. 
>
>- Hosting model of a service can be known by querying the [service description][p2] and looking at value of **ServicePackageAtivationMode**.
>
>

## Working with deployed service package
An active copy of a *ServicePackage* on a node is referred as [deployed service package][p3]. As previously mentioned above, when **Exclusive Process** model is used for creating services, for a given *application*, there could be multiple deployed service packages for the same *ServicePackage*. While performing operations specific to deployed service package like [reporting health of a deployed service package][p4] or [restarting code package of a deployed service package][p5] etc., **ServicePackageActivationId** needs to be provided to identify a specific deployed service package.

 **ServicePackageActivationId** of a deployed service package can be obtained by querying the list of [deployed service packages][p3] on a node. When querying [deployed service types][p6], [deployed replicas][p7] and [deployed code packages][p8] on a node, the query result also contains the **ServicePackageActivationId** of parent deployed service package.

> [!NOTE]
>- Under **Shared Process** hosting model, on a given *node*, for a given *application*, only one copy of a *ServicePackage* is activated. It has **ServicePackageActivationId** equal to *empty string* and need not be specified while performing deployed service package related operations. 
>
> - Under **Exclusive Process** hosting model, on a given *node*, for a given *application*, one or more copies of a *ServicePackage* can be active. Each activation has a *non-empty* **ServicePackageActivationId** and needs to be specified while performing deployed service package related operations. 
>
> - If **ServicePackageActivationId** is ommited it defaults to 'empty string'. If a deployed service package that was activated under **Shared Process** model is present, then operation will be performed on it, otherwise the operation will fail.
>
> - It is not recommended to query once and cache **ServicePackageActivationId** as it is dynamically generated and can change for various reasons. Before performing an operation that needs **ServicePackageActivationId**, you should first query the list of [deployed service packages][p3] on a node and then use *ServicePackageActivationId** from query result to perform the original operation.
>
>

## Guest executable and container applications
Service Fabric treats [Guest executable][a2] and [container][a3] applications as statless services which are self-contained i.e. there is no Service Fabric runtime in *ServiceHost* (a process or container). Since these services are self-contained, number of replicas per *ServiceHost* is not applicable for these services. The most common configuration used with these services is single-partition with [InstanceCount][c2] equal to -1 (i.e. one copy of the service code running on each node of cluster). 

The default **ServicePackageActivationMode** for these services is **SharedProcess** in which case Service Fabric only activates one copy of *ServicePackage* on a *Node* for a given *application* which means only one copy of service code will run a *Node*. If you want multiple copies of your service code to run on a *Node* when you create multiple services (*Service1* to *ServiceN*) of *ServiceType* (specified in *ServiceManifest*) or when your service is multi-partitioned, you should specify **ServicePackageActivationMode** as **ExclusiveProcess** at the time of creating the service.

## Changing hosting model of an existing service
Changing hosting model of an existing service from **Shared Process** to **Exclusive Process** and vice-versa through upgrade or update mechanism (or in default service specification in application manifest) is currently not supported. Support for this feature will come in future versions.

## Choosing between shared process and exclusive process model
Both these hosting models have its pros and cons and user needs to evaluate which one fits their requirements best. **Shared Process** model enables better utilization of OS resources because fewer processes are spawned, multiple replicas in the same process can share ports, etc. However, if one of the replicas hits an error where it needs to bring down the service host, it will impact all other replicas in same process.

 **Exclusive Process** model provides better isolation with every replica in its own process and a misbehaving replica will not impact other replicas. It comes in handy for cases where port sharing is not supported by the communication protocol. It facilitates the ability to apply resource governance at replica level. On the other hand, **Exclusive Process** will consume more OS resources as it spawns one process for each replica on the node.

## Exclusive process model and application model considerations
The recommended way to model your application in Service Fabric is to keep one *ServiceType* per *ServicePackage* and this model works well for most of the applications. 

However, to enable special scenarios where one *ServiceType* per *ServicePackage* may not be desirable, functionally, Service Fabric allows to have more than one *ServiceType* per *ServicePackage* (and one *CodePackage* can register more than one *ServiceType*). Following are some of the scenarios where these configurations can be useful:

- You want to optimize OS resource utilization by spawning fewer processes and having higher replica density per process.
- Replicas from different ServiceTypes need to share some common data that has a high initialization or memory cost.
- You have a free service offering and you want to put a limit on resource utilization by putting all replicas of the service in same process.

**Exclusive Process** hosting model is not coherent with application model having multiple *ServiceTypes* per *ServicePackage*. This is because multiple *ServiceTypes* per *ServicePackage* is designed to achieve higher resource sharing among replicas and enables higher replica density per process. This is contrary to what **Exclusive Process** model is designed to achieve.

Consider the case of multiple *ServiceTypes* per *ServicePackage* with different *CodePackage* registering each *ServiceType*. Let's say we have a *ServicePackage* 'MultiTypeServicePackge' which has two *CodePackages*:

- 'MyCodePackageA' which registers *ServiceType* 'MyServiceTypeA'.
- 'MyCodePackageB' which registers *ServiceType* 'MyServiceTypeB'.

Now, lets say, we create an *application* **fabric:/SpecialApp** and inside **fabric:/SpecialApp** we create following two services with **Exclusive Process** model:

- Service **fabric:/SpecialApp/ServiceA** of type 'MyServiceTypeA' with two partitions (say **P1** and **P2**) and 3 replicas per partition.
- Service **fabric:/SpecialApp/ServiceB** of type 'MyServiceTypeB' with two partitions (say **P3** and **P4**) and 3 replicas per partition.

On a given node, both the services will have two replicas each. Since we used **Exclusive Process** model to create the services, Service Fabric will activate a new copy of 'MyServicePackge' for each replica. Each activation of 'MultiTypeServicePackge' will start a copy of 'MyCodePackageA' and 'MyCodePackageB'. However, only one of 'MyCodePackageA' or 'MyCodePackageB' will host the replica for which 'MultiTypeServicePackge' was activated. Following diagram shows the node view:

<center>
![Node view of deployed application][node-view-five]
</center>

 As we can see, in the activation of 'MultiTypeServicePackge' for replica of partition **P1** of service **fabric:/SpecialApp/ServiceA**, 'MyCodePackageA' is hosting the replica and 'MyCodePackageB' is just up and running. Similarly, in activation of 'MultiTypeServicePackge' for replica of partition **P3** of service **fabric:/SpecialApp/ServiceB**, 'MyCodePackageB' is hosting the replica and 'MyCodePackageA' is just up and running and so on. Hence, more the number of *CodePackages* (registering different *ServiceTypes*) per *ServicePackage*, higher will be redundant resource usage. 
 
 On the other hand if we create services **fabric:/SpecialApp/ServiceA** and **fabric:/SpecialApp/ServiceB** with **Shared Process** model, Service Fabric will activate only one copy of 'MultiTypeServicePackge' for *application* **fabric:/SpecialApp** (as we saw previously). 'MyCodePackageA' will host all replicas for service **fabric:/SpecialApp/ServiceA** (or of any service of type 'MyServiceTypeA' to be more precise) and 'MyCodePackageB' will host all replicas for service **fabric:/SpecialApp/ServiceB** (or of any service of type 'MyServiceTypeB' to be more precise). Following diagram shows the node view in this setting: 

<center>
![Node view of deployed application][node-view-six]
</center>

In the above example, you might think if 'MyCodePackageA' registers both 'MyServiceTypeA' and 'MyServiceTypeB' and there is no 'MyCodePackageB', then there will be no redundant *CodePackage* running. This is correct, however, as mentioned previously, this application model does not align with **Exclusive Process** hosting model. If goal is to put each replica in its own dedicated process then registering both *ServiceTypes* from same *CodePackage* is not needed and putting each *ServiceType* in its own *ServicePacakge* is a more natural choice.

## Next steps
[Package an application][a4] and get it ready to deploy.

[Deploy and remove applications][a5] describes how to use PowerShell to manage application instances.

<!--Image references-->
[node-view-one]: ./media/service-fabric-hosting-model/node-view-one.png
[node-view-two]: ./media/service-fabric-hosting-model/node-view-two.png
[node-view-three]: ./media/service-fabric-hosting-model/node-view-three.png
[node-view-four]: ./media/service-fabric-hosting-model/node-view-four.png
[node-view-five]: ./media/service-fabric-hosting-model/node-view-five.png
[node-view-six]: ./media/service-fabric-hosting-model/node-view-six.png

<!--Link references--In actual articles, you only need a single period before the slash-->
[a1]: service-fabric-application-model.md
[a2]: service-fabric-deploy-existing-app.md
[a3]: service-fabric-containers-overview.md
[a4]: service-fabric-package-apps.md
[a5]: service-fabric-deploy-remove-applications.md

[r1]: https://docs.microsoft.com/rest/api/servicefabric/sfclient-api-createservice

[c1]: https://docs.microsoft.com/dotnet/api/system.fabric.fabricclient.servicemanagementclient.createserviceasync
[c2]: https://docs.microsoft.com/dotnet/api/system.fabric.description.statelessservicedescription.instancecount

[p1]: https://docs.microsoft.com/powershell/servicefabric/vlatest/new-servicefabricservice
[p2]: https://docs.microsoft.com/powershell/servicefabric/vlatest/get-servicefabricservicedescription
[p3]: https://docs.microsoft.com/powershell/servicefabric/vlatest/get-servicefabricdeployedservicePackage
[p4]: https://docs.microsoft.com/powershell/servicefabric/vlatest/send-servicefabricdeployedservicepackagehealthreport
[p5]: https://docs.microsoft.com/powershell/servicefabric/vlatest/restart-servicefabricdeployedcodepackage
[p6]: https://docs.microsoft.com/powershell/servicefabric/vlatest/get-servicefabricdeployedservicetype
[p7]: https://docs.microsoft.com/powershell/servicefabric/vlatest/get-servicefabricdeployedreplica
[p8]: https://docs.microsoft.com/powershell/servicefabric/vlatest/get-servicefabricdeployedcodepackage