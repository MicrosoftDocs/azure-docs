<properties 
   pageTitle="Service Fabric: Service Model" 
   description="An overview of the service model within Service Fabric " 
   services="service-fabric" 
   documentationCenter=".net" 
   authors="mani-ramaswamy" 
   manager="timlt"/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA" 
   ms.date="04/14/2015"
   ms.author="subramar"/>

# Service Model

Two different manifest files are used to describe applications and services: the service manifest and application manifest. The service manifest declaratively defines the service type and version and specifies service metadata such as service type, health properties, load balancing metrics, and the service binaries and configuration files. 

The application manifest declaratively describes the application type and version and specifies service composition metadata such as stable names, partitioning scheme, instance count/replication factor, security/isolation policy, placement constraints, configuration overrides, and constituent service types. The load balancing domains into which the application is placed are also described.

The following diagram shows how applications are composed of service types, which in turn are composed of code, configuration, and packages.

[Service Fabric ApplicationTypes and ServiceTypes][Image1]


Manifests are schematized XML documents that can either be hand written or tool generated. These manifests are updated by the different service model roles throughout the application lifecycle. More information on the service model and modeling and authoring the manifest can be found in the [Application Model](service-fabric-application-model.md) article.


## Applications and Service Instances, Partitioning, and Replicas

An application is a collection of constituent services that performs certain functionality. A service typically performs a complete and standalone function (they can start and run independently). A service type is the categorization of a service, which can have different settings and configurations but the core functionality remains the same. The instances of a service are the different service configuration variations of the same service type. There can be one or more instances of a service type active in the cluster. Stateful service instances, or replicas, achieve reliability by replicating state between replicas located on different nodes in the cluster. A partitioned service divides its state (and access patterns to that state) across nodes in the cluster. Both stateless and stateful services can be partitioned. The following diagram shows the relationship between applications and service instances, partitions, and replicas.

[Partitions and Replicas within a Service][Image2]


[Image1]: media/service-fabric-service-model/Service1.jpg
[Image2]: media/service-fabric-service-model/Service2.jpg
