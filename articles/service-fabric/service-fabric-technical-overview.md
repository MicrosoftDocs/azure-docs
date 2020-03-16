---
title: Learn Azure Service Fabric terminology 
description: Learn key Service Fabric terminology and concepts used in the rest of the documentation.
author: masnider
ms.topic: conceptual
ms.date: 09/17/2018
ms.author: masnider
ms.custom: sfrev
---

# Service Fabric terminology overview

Azure Service Fabric is a distributed systems platform that makes it easy to package, deploy, and manage scalable and reliable microservices.  You can [host Service Fabric clusters anywhere](service-fabric-deploy-anywhere.md): Azure, in an on-premises datacenter, or on any cloud provider.  Service Fabric is the orchestrator that powers [Azure Service Fabric Mesh](/azure/service-fabric-mesh). You can use any framework to write your services and choose where to run the application from multiple environment choices. This article details the terminology used by Service Fabric to understand the terms used in the documentation.

## Infrastructure concepts

**Cluster**: A network-connected set of virtual or physical machines into which your microservices are deployed and managed.  Clusters can scale to thousands of machines.

**Node**: A machine or VM that's part of a cluster is called a *node*. Each node is assigned a node name (string). Nodes have characteristics, such as placement properties. Each machine or VM has an auto-start Windows service, `FabricHost.exe`, that starts running upon boot and then starts two executables: `Fabric.exe` and `FabricGateway.exe`. These two executables make up the node. For testing scenarios, you can host multiple nodes on a single machine or VM by running multiple instances of `Fabric.exe` and `FabricGateway.exe`.

## Application and service concepts

**Service Fabric Mesh Application**: Service Fabric Mesh Applications are described by the Resource Model (YAML and JSON resource files) and can be deployed to any environment where Service Fabric runs.

**Service Fabric Native Application**: Service Fabric Native Applications are described by the Native Application Model (XML-based application and service manifests).  Service Fabric Native Applications cannot run in Service Fabric Mesh.

### Service Fabric Mesh Application concepts

**Application**: An application is the unit of deployment, versioning, and lifetime of a Mesh application. The lifecycle of each application instance can be managed independently.  Applications are composed of one or more service code packages and settings. An application is defined using the Azure Resource Model (RM) schema.  Services are described as properties of the application resource in a RM template.  Networks and volumes used by the application are referenced by the application.  When creating an application, the application, service(s), network, and volume(s) are modeled using the Service Fabric Resource Model.

**Service**: A service in an application represents a microservice and performs a complete and standalone function. Each service is composed of one or more code packages that describe everything needed to run the container image associated with the code package.  The number of services in an application can be scaled up and down.

**Network**: A network resource creates a private network for your applications and is independent of the applications or services that may refer to it. Multiple services from different applications can be part of the same network. Networks are deployable resources that are referenced by applications.

**Code package**: Code packages describe everything needed to run the container image associated with the code package, including the following:

* Container name, version, and registry
* CPU and memory resources required for each container
* Network endpoints
* Volumes to mount in the container, referencing a separate volume resource.

All the code packages defined as part of an application resource are deployed and activated together as a group.

**Volume**: Volumes are directories that get mounted inside your container instances that you can use to persist state. The Azure Files volume driver mounts an Azure Files share to a container and provides reliable data storage through any API which supports file storage. Volumes are deployable resources that are referenced by applications.

### Service Fabric Native Application concepts

**Application**: An application is a collection of constituent services that perform a certain function or functions. The lifecycle of each application instance can be managed independently.

**Service**: A service performs a complete and standalone function and can start and run independently of other services. A service is composed of code, configuration, and data. For each service, code consists of the executable binaries, configuration consists of service settings that can be loaded at run time, and data consists of arbitrary static data to be consumed by the service.

**Application type**: The name/version assigned to a collection of service types. It is defined in an `ApplicationManifest.xml` file and embedded in an application package directory. The directory is then copied to the Service Fabric cluster's image store. You can then create a named application from this application type within the cluster.

Read the [Application model](service-fabric-application-model.md) article for more information.

**Application package**: A disk directory containing the application type's `ApplicationManifest.xml` file. References the service packages for each service type that makes up the application type. The files in the application package directory are copied to Service Fabric cluster's image store. For example, an application package for an email application type might contain references to a queue-service package, a frontend-service package, and a database-service package.

**Named application**: After you copy an application package to the image store, you create an instance of the application within the cluster. You create an instance when you specify the application package's application type, by using its name or version. Each application type instance is assigned a uniform resource identifier (URI) name that looks like: `"fabric:/MyNamedApp"`. Within a cluster, you can create multiple named applications from a single application type. You can also create named applications from different application types. Each named application is managed and versioned independently.

**Service type**: The name/version assigned to a service's code packages, data packages, and configuration packages. The service type is defined in the `ServiceManifest.xml` file and embedded in a service package directory. The service package directory is then referenced by an application package's `ApplicationManifest.xml` file. Within the cluster, after creating a named application, you can create a named service from one of the application type's service types. The service type's `ServiceManifest.xml` file describes the service.

Read the [Application model](service-fabric-application-model.md) article for more information.

There are two types of services:

* **Stateless**: Use a stateless service when the service's persistent state is stored in an external storage service, such as Azure Storage, Azure SQL Database, or Azure Cosmos DB. Use a stateless service when the service has no persistent storage. For example, for a calculator service where values are passed to the service, a computation is performed that uses these values, and then a result is returned.
* **Stateful**: Use a stateful service when you want Service Fabric to manage your service's state via its Reliable Collections or Reliable Actors programming models. When you create a named service, specify how many partitions you want to spread your state over for scalability. Also specify how many times to replicate your state across nodes, for reliability. Each named service has a single primary replica and multiple secondary replicas. You modify your named service's state when you write to the primary replica. Service Fabric then replicates this state to all the secondary replicas to keep your state in sync. Service Fabric automatically detects when a primary replica fails and promotes an existing secondary replica to a primary replica. Service Fabric then creates a new secondary replica.  

**Replicas or instances** refer to code (and state for stateful services) of a service that's deployed and running. See [Replicas and instances](service-fabric-concepts-replica-lifecycle.md).

**Reconfiguration** refers to the process of any change in the replica set of a service. See [Reconfiguration](service-fabric-concepts-reconfiguration.md).

**Service package**: A disk directory containing the service type's `ServiceManifest.xml` file. This file references the code, static data, and configuration packages for the service type. The files in the service package directory are referenced by the application type's `ApplicationManifest.xml` file. For example, a service package might refer to the code, static data, and configuration packages that make up a database service.

**Named service**: After you create a named application, you can create an instance of one of its service types within the cluster. You specify the service type by using its name/version. Each service type instance is assigned a URI name scoped under its named application's URI. For example, if you create a "MyDatabase" named service within a "MyNamedApp" named application, the URI looks like: `"fabric:/MyNamedApp/MyDatabase"`. Within a named application, you can create several named services. Each named service can have its own partition scheme and instance or replica counts.

**Code package**: A disk directory containing the service type's executable files, typically EXE/DLL files. The files in the code package directory are referenced by the service type's `ServiceManifest.xml` file. When you create a named service, the code package is copied to the node or nodes selected to run the named service. Then the code starts to run. There are two types of code package executables:

* **Guest executables**: Executables that run as-is on the host operating system (Windows or Linux). These executables don't link to or reference any Service Fabric runtime files and therefore don't use any Service Fabric programming models. These executables are unable to use some Service Fabric features, such as the naming service for endpoint discovery. Guest executables can't report load metrics that are specific to each service instance.
* **Service host executables**: Executables that use Service Fabric programming models by linking to Service Fabric runtime files, enabling Service Fabric features. For example, a named service instance can register endpoints with Service Fabric's Naming Service and can also report load metrics.

**Data package**: A disk directory that contains the service type's static, read-only data files, typically photo, sound, and video files. The files in the data package directory are referenced by the service type's `ServiceManifest.xml` file. When you create a named service, the data package is copied to the node or nodes selected to run the named service. The code starts running and can now access the data files.

**Configuration package**: A disk directory that contains the service type's static, read-only configuration files, typically text files. The files in the configuration package directory are referenced by the service type's `ServiceManifest.xml` file. When you create a named service, the files in the configuration package are copied to one or more nodes selected to run the named service. Then the code starts to run and can now access the configuration files.

**Containers**: By default, Service Fabric deploys and activates services as processes. Service Fabric can also deploy services in container images. Containers are a virtualization technology that abstracts the underlying operating system from applications. An application and its runtime, dependencies, and system libraries run inside a container. The container has full, private access to the container's own isolated view of the operating system constructs. Service Fabric supports Windows Server containers and Docker containers on Linux. For more information, read [Service Fabric and containers](service-fabric-containers-overview.md).

**Partition scheme**: When you create a named service, you specify a partition scheme. Services with substantial amounts of state split the data across partitions, which spreads the state across the cluster's nodes. By splitting the data across partitions, your named service's state can scale. Within a partition, stateless named services have instances, whereas stateful named services have replicas. Usually, stateless named services have only one partition, because they have no internal state. The partition instances provide for availability. If one instance fails, other instances continue to operate normally, and then Service Fabric creates a new instance. Stateful named services maintain their state within replicas and each partition has its own replica set so the state is kept in sync. Should a replica fail, Service Fabric builds a new replica from the existing replicas.

Read the [Partition Service Fabric reliable services](service-fabric-concepts-partitioning.md) article for more information.

## System services

There are system services that are created in every cluster that provide the platform capabilities of Service Fabric.

**Naming Service**: Each Service Fabric cluster has a Naming Service, which resolves service names to a location in the cluster. You manage the service names and properties, like an internet Domain Name System (DNS) for the cluster. Clients securely communicate with any node in the cluster by using the Naming Service to resolve a service name and its location. Applications move within the cluster. For example, this can be due to failures, resource balancing, or the resizing of the cluster. You can develop services and clients that resolve the current network location. Clients obtain the actual machine IP address and port where it's currently running.

Read [Communicate with services](service-fabric-connect-and-communicate-with-services.md) for more information on the client and service communication APIs that work with the Naming Service.

**Image Store service**: Each Service Fabric cluster has an Image Store service where deployed, versioned application packages are kept. Copy an application package to the Image Store and then register the application type contained within that application package. After the application type is provisioned, you create a named application from it. You can unregister an application type from the Image Store service after all its named applications have been deleted.

Read [Understand the ImageStoreConnectionString setting](service-fabric-image-store-connection-string.md) for more information about the Image Store service.

Read the [Deploy an application](service-fabric-deploy-remove-applications.md) article for more information on deploying applications to the Image Store service.

**Failover Manager service**: Each Service Fabric cluster has a Failover Manager service that is responsible for the following actions:

 - Performs functions related to high availability and consistency of services.
 - Orchestrates application and cluster upgrades.
 - Interacts with other system components.

**Repair Manager service**: This is an optional system service that allows repair actions to be performed on a cluster in a way that is safe, automatable, and transparent. Repair manager is used in:

   - Performing Azure maintenance repairs on [Silver and Gold durability](service-fabric-cluster-capacity.md#the-durability-characteristics-of-the-cluster) Azure Service Fabric clusters.
   - Carrying out repair actions for [Patch Orchestration Application](service-fabric-patch-orchestration-application.md)

## Deployment and application models

To deploy your services, you need to describe how they should run. Service Fabric supports three different deployment models:

### Resource model (preview)

Service Fabric Resources are anything that can be deployed individually to Service Fabric; including applications, services, networks, and volumes. Resources are defined using a JSON file, which can be deployed to a cluster endpoint.  For Service Fabric Mesh, the Azure Resource Model schema is used. A YAML file schema can also be used to more easily author definition files. Resources can be deployed anywhere Service Fabric runs. The resource model is the simplest way to describe your Service Fabric applications. Its main focus is on simple deployment and management of containerized services. To learn more, read [Introduction to the Service Fabric Resource Model](/azure/service-fabric-mesh/service-fabric-mesh-service-fabric-resources).

### Native model

The native application model provides your applications with full low-level access to Service Fabric. Applications and services are defined as registered types in XML manifest files.

The native model supports the Reliable Services and Reliable Actors frameworks, which provides access to the Service Fabric runtime APIs and cluster management APIs in C# and Java. The native model also supports arbitrary containers and executables. The native model is not supported in the [Service Fabric Mesh environment](/azure/service-fabric-mesh/service-fabric-mesh-overview).

**Reliable Services**: An API to build stateless and stateful services. Stateful services store their state in Reliable Collections, such as a dictionary or a queue. You can also plug in various communication stacks, such as Web API and Windows Communication Foundation (WCF).

**Reliable Actors**: An API to build stateless and stateful objects through the virtual Actor programming model. This model is useful when you have lots of independent units of computation or state. This model uses a turn-based threading model, so it's best to avoid code that calls out to other actors or services because an individual actor can't process other incoming requests until all its outbound requests are finished.

You can also run your existing applications on Service Fabric:

**Containers**:  Service Fabric supports the deployment of Docker containers on Linux and Windows Server containers on Windows Server 2016, along with support for Hyper-V isolation mode. In the Service Fabric [application model](service-fabric-application-model.md), a container represents an application host in which multiple service replicas are placed. Service Fabric can run any containers, and the scenario is similar to the guest executable scenario, where you package an existing application inside a container. In addition, you can [run Service Fabric services inside containers](service-fabric-services-inside-containers.md) as well.

**Guest executables**: You can run any type of code, such as Node.js, Python, Java, or C++ in Azure Service Fabric as a service. Service Fabric refers to these types of services as guest executables, which are treated as stateless services. The advantages to running a guest executable in a Service Fabric cluster include high availability, health monitoring, application lifecycle management, high density, and discoverability.

Read the [Choose a programming model for your service](service-fabric-choose-framework.md) article for more information.

### Docker Compose 

[Docker Compose](https://docs.docker.com/compose/) is part of the Docker project. Service Fabric provides limited support for [deploying applications using the Docker Compose model](service-fabric-docker-compose.md).

## Environments

Service Fabric is an open-source platform technology that several different services and products are based on. Microsoft provides the following options:

 - **Azure Service Fabric Mesh**: A fully managed service for running Service Fabric applications in Microsoft Azure.
 - **Azure Service Fabric**: The Azure hosted Service Fabric cluster offering. It provides integration between Service Fabric and the Azure infrastructure, along with upgrade and configuration management of Service Fabric clusters.
 - **Service Fabric standalone**: A set of installation and configuration tools to [deploy Service Fabric clusters anywhere](/azure/service-fabric/service-fabric-deploy-anywhere) (on-premises or on any cloud provider). Not managed by Azure.
 - **Service Fabric development cluster**: Provides a local development experience on Windows, Linux, or Mac for development of Service Fabric applications.

## Environment, framework, and deployment model support matrix

Different environments have different levels of support for frameworks and deployment models. The following table describes the supported framework and deployment model combinations.

| Type of Application | Described By | Azure Service Fabric Mesh | Azure Service Fabric Clusters (any OS)| Local cluster | Standalone cluster |
|---|---|---|---|---|---|
| Service Fabric Mesh Applications | Resource Model (YAML & JSON) | Supported |Not supported | Windows- supported, Linux and Mac- not supported | Windows- not supported |
|Service Fabric Native Applications | Native Application Model (XML) | Not Supported| Supported|Supported|Windows- supported|

The following table describes the different application models and the tooling that exists for them against Service Fabric.

| Type of Application | Described By | Visual Studio | Eclipse | SFCTL | AZ CLI | Powershell|
|---|---|---|---|---|---|---|
| Service Fabric Mesh Applications | Resource Model (YAML & JSON) | VS 2017 |Not supported |Not supported | Supported - Mesh environment only | Not Supported|
|Service Fabric Native Applications | Native Application Model (XML) | VS 2017 and VS 2015| Supported|Supported|Supported|Supported|

## Next steps

To learn more about Service Fabric:

* [Overview of Service Fabric](service-fabric-overview.md)
* [Why a microservices approach to building applications?](service-fabric-overview-microservices.md)
* [Application scenarios](service-fabric-application-scenarios.md)

To learn more about Service Fabric Mesh:

* [Overview of Service Fabric Mesh](/azure/service-fabric-mesh/service-fabric-mesh-overview)
