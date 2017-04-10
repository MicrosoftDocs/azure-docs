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
# Service Fabric Hosting Model
This article provides an overview of application hosting models provided by Service Fabric, namely, **Multiple Replica per Process (MRPP)** and **Single Replica per Process (SRPP)**. It describes how does a deployed application looks on a Service Fabric cluster node and relationship beween replicas (or instances) of the service and the serice-host process.

Before proceeding further, make sure that you are familiar with [Service Fabric Application Model][a1]. To understand the hosting model, lets walk through an example. Lets say, we have an *ApplicationType* **ApplicationType1** which has a *ServiceType* **ServiceType1** which is provided by *ServicePackage* **ServicePackage1** which has a *CodePackage* **CodePackage1** which has entry point executable **ServiceHost1.exe** which registers **ServiceType1** when it runs.

Let's say we have a 3 node cluster and we create an application **APP1** of type **ApplicationType1**. Inside this application **APP1** we create a service **SVC11** of type **ServiceType1** which has 2 partitions (say **SVC11-P1** & **SVC11-P2**) and 3 replicas (or instances) per partition. *Please note that, since hosting model does not depend on service being stateful or stateless, for simplicity, all uses of word 'replica' in this article, unless explcitly mentioned, refers to both a replica of a stateful service or an instance of a statless service*. Following diagram shows the node view of the deployed application:

![Node view of deployed application][node-view-one]

Service Fabric activated **ServicePackage1** which started executable **ServiceHost1.exe** which is hosting replica from both the partitions i.e. **SVC11-P1** & **SVC11-P2**. Note that all the nodes in the cluster will have same view since we chose number of replica per partition equal to number of nodes in the cluster. Let's create another service **SVC12** in application **APP1** which has 1 partition (say **SVC12-P1**) and 3 replicas. Following diagram shows the new view on the node:

![Node view of deployed application][node-view-two]

As we can see Service Fabric placed the new replica for partition **SVC12-P1** in the existing activation of **ServicePackage1**. Now lets create another application **APP2** of type **ApplicationType1** and inside **APP2** create service **SVC21** which has 2 partitions (say **SVC21-P1** & **SVC21-P2**) and 3 replicas. Following diagrams shows the new node view: 

![Node view of deployed application][node-view-three]

This time Service Fabric has activated a new copy of **ServicePackage1** which starts another copy of executable **ServiceHost1.exe** and replicas from both partition of **SVC21** (i.e. **SVC21-P1** & **SVC21-P2**) are placed in this new activated copy. 

What we saw above is the default hosting model provided by Service Fabric and is referred to as **Multiple Replica per Process (MRPP)** model. In this model, for a given *application*, only one copy of a given *ServicePackage* is activated on a *Node*. The activated copy of *ServicePackage* starts a copy of *ServiceHost* which registers the *ServiceType*. All replicas of all services ('*Service1*' to '*ServiceN*')  of this *ServiceType* are placed is this copy of *ServiceHost* i.e. all these replicas share the same process.

The other hosting model provided by Service Fabric is **Single Replica per Process (SRPP)** model. In this model, on a given *Node*, for placing each replica, Service Fabric activates a new copy of *ServicePackage* which starts a copy of *ServiceHost* and replica is placed in this copy of *ServiceHost* i.e. each replica lives in its own dedicated process. This model is supported starting version 5.6 of Service Fabric.

## Single Replica per Process (SRPP) Model
**SRPP** hosting model can be chosen at the time of creating the service (using [PowerShell][p1], [REST][r1] or [FabricClient][c1]) by specifying **ServicePackageActivationMode** as **ExclusiveProcess**.

```powershell
PS C:\>New-ServiceFabricService -ApplicationName "fabric:/HelloWorld" -ServiceName "fabric:/HelloWorld/svc1" -ServiceTypeName "HelloWorldStateless" -Stateless -PartitionSchemeSingleton -InstanceCount -1 -ServicePackageActivationMode "ExclusiveProcess"
```

```csharp
var serviceDescription = new StatelessServiceDescription
{
    ApplicationName = new Uri("fabric:/HelloWorld"),
    ServiceName = new Uri("fabric:/HelloWorld/svc1"),
    ServiceTypeName = "HelloWorldStateless",
    PartitionSchemeDescription = new SingletonPartitionSchemeDescription(),
    InstanceCount = -1,
    ServicePackageActivationMode = ServicePackageActivationMode.ExclusiveProcess
};

var fabricClient = new FabricClient(clusterEndpoints);
await fabricClient.ServiceManager.CreateServiceAsync(serviceDescription);
```

If you have a default service in you application manifest, you can choose **SRPP** by specifying **ServicePackageActivationMode** the attribute as shown below:

```xml
<DefaultServices>
  <Service Name="MyService" ServicePackageActivationMode="ExclusiveProcess">
    <StatelessService ServiceTypeName="MyServiceType" InstanceCount="1">
      <SingletonPartition/>
    </StatelessService>
  </Service>
</DefaultServices>
```
Continuing with our example above, lets create another service **SVC13** in application **APP1** which has 2 partitions (say **SVC13-P1** & **SVC13-P2**) and 3 replicas per partition with **SRPP**. Following diagram shows new view on the node:

![Node view of deployed application][node-view-four]

As you can see, Service Fabric activated two new copies of **ServicePackage1** (one for each replica from partition **SVC13-P1** and **SVC13-P2**) and placed each replica in its dedicated copy of **ServiceHost1.exe**. Another thing to note here is, when **SRPP** model is used, for a given *application*, multiple copies of a given *ServicePackage* can be active on a **Node**. In above example, we see that three copies of **ServicePackage1** are active for **APP1**. Each of these active copy of **ServicePackage1** has a **ServicePackageAtivationId** associated with it which identifies that copy within *application* **APP1**. When only **MRPP** model is used for an *application*, like **APP2** in above example, there is only one active copy of *ServicePackage* on a *Node* and **ServicePackageAtivationId** for this copy of *ServicePackage* is **empty string**.

> [!NOTE]
>- **MRPP** hosting model corresponds to **ServicePackageAtivationMode** equal **SharedProcess**. This is the default hosting model and **ServicePackageAtivationMode** need not be specified at the time of creating the service.
>
>- **SRPP** hosting model corresponds to **ServicePackageAtivationMode** equal **ExclusiveProcess** and need to be explicitly specified at the time of creating the service. 
>
>- Hosting model of a service can be known by querying the [service description][p2] and looking at value of **ServicePackageAtivationMode**.
>
>

## Working with Deployed Service Package
An active copy of a *ServicePackage* on a node is referred as [deployed service package][p3].  As previously mentioned above, when **SRPP** model is used for creating services, for a given *application*, there could be multiple deployed service packages for the same *ServicePackage*. While performing operations specific to deployed service package like [reporting health of a deployed service package][p4] or [restarting code package of a deployed service package][p5] etc., **ServicePackageAtivationId** needs to be provided to identify a specific deployed service package. If **ServicePackageAtivationId** is ommited it defaults to **empty string** and the operation will be perfomed on the deployed service package that was activated under **MRPP** model. **ServicePackageAtivationId** of a deployed service package can be obtained by querying the list of [deployed service packages][p3] on a node. When querying [deployed service types][p6], [deployed replicas][p7] and [deployed code packages][p8] on a node, the query result also contains the **ServicePackageAtivationId** of parent deployed service package.

> [!NOTE]
>- Under **MRPP** hosting model, on a given *node*, for a given *application*, only one copy of *ServicePackage* is activated. It has **ServicePackageAtivationId** equal to *empty string* and need not be specified while performing deployed service package related operations. 
>
>- Under **SRPP** hosting model, on a given *node*, for a given *application*, one or more copy of *ServicePackage* can be activated. Each activation has a *non-empty* **ServicePackageAtivationId** and needs to be specified while performing deployed service package related operations.
>
>- It is not recommended to query once and cache **ServicePackageAtivationId** as it is dynamically generated and can change for various reasons. Before performing an operation that needs **ServicePackageAtivationId**, you should first query the list of [deployed service packages][p3] on a node and then use **ServicePackageAtivationId** from query result to perform the original operation.
>
>

## Guest executable and container applications
Service Fabric treats [Guest executable][a2] and [container][a3] applications as statless services which are self-contained i.e. there is no Service Fabric runtime in *ServiceHost* (a process or container). Since these servicess are self-contained, number of replica per *ServiceHost* is not applicable for these servicess. The most common configuration used with these servicess is single-partition with [InstanceCount][c2] equal to -1 (i.e. one copy of service running on each node of cluster). 

The default **ServicePackageActivationMode** for these services is **SharedProcess** in which case Service Fabric only activates one copy of *ServicePackage* on a *Node* for a given *application* which means only one copy of service will run a *Node*. If you want multiple copies of your service to run on a *Node* when you create multiple services (*Service1* to *ServiceN*) of *ServiceType* (specified in *ServiceManifest*) or when your service is multi-partition, you should specify **ServicePackageActivationMode** as **ExclusiveProcess** at the time of creating the service.

## Changing Hosting Model of an existing service
Changin hosting model of an existing service from MRPP to SRPP and vice-versa through upgrade or update mechanism (or in default service specification in application manifest) is currenlty not supported. Support for this feature will come in future versions.

## Choosing between MRPP and SRPP model
Both these hosting models has its pros and cons and user needs to evaluate which one fits their requirements best. **MRPP** enables better utilization of OS resources like lesser number of processes are spawned, multiple replicas in the same process sharing port etc. However, if one of the replica hits an error where it needs to bring down the service host, it will impact all other replicas in same process and in some case can impact availibility of involved services. **SRPP** provides better isolation with every replica in its own process and a bad behaving replica will not impact other replicas. It comes in handy for cases where port sharing is not supported by the communication protocol. It facilitates the ability to apply resource governance at replica level. On the other hand, **SRPP** will consume more OS resources as it spawns one process for each replica on the node.

## SRPP and application model considerations
The recommended way to model your application in Service Fabric is to keep one *ServiceType* per *ServicePackage*. However, if you have a special scenario where you need to have more than one *ServiceType* per *ServicePackage*, using **SRPP** model can lead to redundant resource usage. For example, say a ServicePackge **SP1** has two CodePackages **CP1** and **CP2** whcih has *ServiceHost* **SH1.exe** and **SH2.exe** which registers ServiceType **ST1** and **ST2** respectively. Now, lets say, we create an *application* **APP1** and inside **APP1** we create service **SVC1** of *ServiceType* **ST1** and service **SVC2** of *ServiceType* **ST2** each with two partition (say **SVC1-P1** and **SVC1-P2** for **SVC1** and **SVC2-P1** and **SVC2-P2** for **SVC1**) and **SRPP** hosting model. On a given node, both service **SVC1** and **SVC2** will have two replica each. Since we created **SVC1** and **SVC2** with **SRPP** model, Service Fabric will activate a new copy of **SP1** for each replica. Each activation of **SP1** will start a copy of **SH1.exe** and **SH2.exe**. However, only one of **SH1.exe** or **SH2.exe** will host the replica for which **SP1** was activated. Following diagram shows the node view:

![Node view of deployed application][node-view-five]

 As we can see, in the activation of **SP1** for replica of partition **SVC1-P1**, **SH1.exe** is hosting the replica and **SH2.exe** is just up and running. Similarly, in activation of **SP1** for replica of partition **SVC2-P1**, **SH2.exe** is hosting the replica and **SH1.exe** is just up and running and so on. Hence, more the number of *CodePackages* (registering different *ServiceTypes*) per *ServicePackage*, higher will be redundant resource usage. On the other hand if we create **SVC1** and **SVC2** with **MRPP** model, Service Fabric will activate only one copy of **SP1** for **APP1** (as we saw previously). **SH1.exe** and **SH2.exe** will host all replicas for **SVC1** and **SVC2** respectively as shown in following diagram: 

![Node view of deployed application][node-view-six]

Functionally Service Fabric allows to register more than one *ServiceType* from the same *ServiceHost*. In the above example, you might think if **SH1.exe** registers both **ST1** and **ST2** and there is no **CP2**, then there will be no redundant *ServiceHost* running. This is correct, however, using **SRPP** model when a *ServiceHost* registers multiple *ServieType* defeats the original purpose of registering multiple *ServiceType* itself. Note that registering multiple *ServiceType* from the same *ServiceHost* is not a recommended practice and this may only be needed in rare scenarios.

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

[r1]: https://docs.microsoft.com/rest/api/servicefabric/create-a-service

[c1]: https://docs.microsoft.com/dotnet/api/system.fabric.fabricclient.servicemanagementclient.createserviceasync
[c2]: https://docs.microsoft.com/en-us/dotnet/api/system.fabric.description.statelessservicedescription.instancecount

[p1]: https://docs.microsoft.com/powershell/servicefabric/vlatest/new-servicefabricservice
[p2]: https://docs.microsoft.com/powershell/servicefabric/vlatest/get-servicefabricservicedescription
[p3]: https://docs.microsoft.com/powershell/servicefabric/vlatest/get-servicefabricdeployedservicePackage
[p4]: https://docs.microsoft.com/powershell/servicefabric/vlatest/send-servicefabricdeployedservicepackagehealthreport
[p5]: https://docs.microsoft.com/powershell/servicefabric/vlatest/restart-servicefabricdeployedcodepackage
[p6]: https://docs.microsoft.com/powershell/servicefabric/vlatest/get-servicefabricdeployedservicetype
[p7]: https://docs.microsoft.com/powershell/servicefabric/vlatest/get-servicefabricdeployedreplica
[p8]: https://docs.microsoft.com/powershell/servicefabric/vlatest/get-servicefabricdeployedcodepackage