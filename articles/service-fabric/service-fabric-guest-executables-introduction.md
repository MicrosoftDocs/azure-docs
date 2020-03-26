---
title: Package an existing executable to Azure Service Fabric 
description: Learn about packaging an existing application as a guest executable, so it can be deployed to a Service Fabric cluster.

ms.topic: conceptual
ms.date: 03/15/2018
---
# Deploy an existing executable to Service Fabric
You can run any type of code, such as Node.js, Java, or C++ in Azure Service Fabric as a service. Service Fabric refers to these types of services as guest executables.

Guest executables are treated by Service Fabric like stateless services. As a result, they are placed on nodes in a cluster, based on availability and other metrics. This article describes how to package and deploy a guest executable to a Service Fabric cluster, by using Visual Studio or a command-line utility.

## Benefits of running a guest executable in Service Fabric
There are several advantages to running a guest executable in a Service Fabric cluster:

* High availability. Applications that run in Service Fabric are made highly available. Service Fabric ensures that instances of an application are running.
* Health monitoring. Service Fabric health monitoring detects if an application is running, and provides diagnostic information if there is a failure.   
* Application lifecycle management. Besides providing upgrades with no downtime, Service Fabric provides automatic rollback to the previous version if there is a bad health event reported during an upgrade.    
* Density. You can run multiple applications in a cluster, which eliminates the need for each application to run on its own hardware.
* Discoverability: Using REST you can call the Service Fabric Naming service to find other services in the cluster. 

## Samples
* [Sample for packaging and deploying a guest executable](https://github.com/Azure-Samples/service-fabric-dotnet-getting-started)
* [Sample of two guest executables (C# and nodejs) communicating via the Naming service using REST](https://github.com/Azure-Samples/service-fabric-dotnet-containers)

## Overview of application and service manifest files
As part of deploying a guest executable, it is useful to understand the Service Fabric packaging and deployment model as described in [application model](service-fabric-application-model.md). The Service Fabric packaging model relies on two XML files: the application and service manifests. The schema definition for the ApplicationManifest.xml and ServiceManifest.xml files is installed with the Service Fabric SDK into *C:\Program Files\Microsoft SDKs\Service Fabric\schemas\ServiceFabricServiceModel.xsd*.

* **Application manifest**
  The application manifest is used to describe the application. It lists the services that compose it, and other parameters that are used to define how one or more services should be deployed, such as the number of instances.

  In Service Fabric, an application is a unit of deployment and upgrade. An application can be upgraded as a single unit where potential failures and potential rollbacks are managed. Service Fabric guarantees that the upgrade process is either successful, or, if the upgrade fails, does not leave the application in an unknown or unstable state.
* **Service manifest**
  The service manifest describes the components of a service. It includes data, such as the name and type of service, and its code and configuration. The service manifest also includes some additional parameters that can be used to configure the service once it is deployed.

## Application package file structure
To deploy an application to Service Fabric, the application should follow a predefined directory structure. The following is an example of that structure.

```
|-- ApplicationPackageRoot
    |-- GuestService1Pkg
        |-- Code
            |-- existingapp.exe
        |-- Config
            |-- Settings.xml
        |-- Data
        |-- ServiceManifest.xml
    |-- ApplicationManifest.xml
```

The ApplicationPackageRoot contains the ApplicationManifest.xml file that defines the application. A subdirectory for each service included in the application is used to contain all the artifacts that the service requires. These subdirectories are the ServiceManifest.xml and, typically, the following:

* *Code*. This directory contains the service code.
* *Config*. This directory contains a Settings.xml file (and other files if necessary) that the service can access at runtime to retrieve specific configuration settings.
* *Data*. This is an additional directory to store additional local data that the service may need. Data should be used to store only ephemeral data. Service Fabric does not copy or replicate changes to the data directory if the service needs to be relocated (for example, during failover).

> [!NOTE]
> You don't have to create the `config` and `data` directories if you don't need them.
>
>

## Next steps
See the following articles for related information and tasks.
* [Deploy a guest executable](service-fabric-deploy-existing-app.md)
* [Deploy multiple guest executables](service-fabric-deploy-multiple-apps.md)
* [Create your first guest executable application using Visual Studio](quickstart-guest-app.md)
* [Sample for packaging and deploying a guest executable](https://github.com/Azure-Samples/service-fabric-dotnet-getting-started), including a link to the prerelease of the packaging tool
* [Sample of two guest executables (C# and nodejs) communicating via the Naming service using REST](https://github.com/Azure-Samples/service-fabric-containers)

