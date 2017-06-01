---
title: Azure Service Fabric Docker Compose Preview | Microsoft Docs
description: Azure Service Fabric accepts Docker Compose format to make it easier to orchestrate exsiting containers using Service Fabric. This support is currently in preview.
services: service-fabric
documentationcenter: .net
author: mani-ramaswamy
manager: timlt
editor: ''

ms.assetid: ab49c4b9-74a8-4907-b75b-8d2ee84c6d90
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 05/01/2017
ms.author: subramar
---


# Compose Application support in Service Fabric (Preview)

Docker uses the [docker-compose.yml](https://docs.docker.com/compose) file for defining multi-container applications. To make it easy for customers familiar with Docker to orchestrate existing container applications on Service Fabric, we've included preview support for Docker Compose natively in the platform. Service Fabric can accept version 3(+) of `docker-compose.yml` files. Since this support is in preview, only a subset of Compose directives are supported. For example, application upgrades aren't supported. However, you can always remove and deploy applications instead of upgrading them.  

To use this preview, you need to install the preview SDK (version 255.255.x.x) through the portal. 

> [!NOTE]
> This feature is in preview and not supported.

## Using a docker-compose.yml file with Service Fabric (Preview)

Create a Service Fabric application from a docker-compose.yml file by running the following command in PS:

```powershell
New-ServiceFabricComposeApplication -ApplicationName fabric:/TestContainerApp -Compose docker-compose.yml [-RepositoryUserName <>] [-RepositoryPassword <>] [-PasswordEnctypted]
```

RepositoryUserName and RepoistoryPassword refer to the container registry user name and password.

If you are using Azure CLI 2.0, run the following command:

```bash
az sf compose create --application-id fabric:/TestContainerApp --file docker-compose.yml [ [ --repo-user --repo-pass --encrypted ] | [ --repo-user ] ] [ --timeout ]
```
These commands create a Service Fabric application (named `fabric:/TestContainerApp` in the preceding example) which can be monitored through Service Fabric Explorer(). The specified `ApplicationName` is used for health queries through PS, Azure CLI 2.0 or through SFX.

To delete the application through PS, use the following command:

```powershell
Remove-ServiceFabricComposeApplication  -ApplicationName fabric:/TestContainerApp
```

To delete the application through Azure CLI 2.0, use the following command:

```bash
az sf compose remove  --application-id TestContainerApp [ --timeout ]
```

To get the status of the compose application, use the following command in PS:

```powershell
Get-ServiceFabricComposeApplicationStatus -ApplicationName fabric:/TestContainerApp -GetAllPages
```

For Azure CLI 2.0, use the following command:

```bash
az sf compose status --application-id TestContainerApp [ --timeout ]
```



## Supported Compose directives

A subset of the configuration options from Compose V3 format are supported in this preview. The following primitives are supported:

* Services->Deploy->replicas	
* Services->Deploy->Placement->Constraints	
* Services->Deploy->Resources->Limits 
*         -cpu-shares	
*         -memory
*         -memory-swap
* Services->Commands	
* Services->Environment
* Services->Ports	
* Services->image
* Services->Isolation(Only for windows)
* Services->logging->driver	
* Services->logging->driver->options
* Volume & Deploy->Volume	

The cluster must be setup for enforcing resource limits as described in [Service Fabric Resource Governance](service-fabric-resource-governance.md).
All other docker compose directives are unsupported for this preview. 

## ServiceDnsName Computation

If the service name specified in compose file is a fully qualified domain name (that is, it contains a period, ‘.’) then the DNS name registered by Service Fabric is `<ServiceName>` including the period. If not, each path segment in the ApplicationName becomes a domain label in the service DNS Name with the first path segment becoming the top-level domain label. Thus, if the application name specified is `fabric:/SampleApp/MyComposeApp` then `<ServiceName>.MyComposeApp.SampleApp` would be the registered DNS name.

## Differences between Compose (instance definition) and Service Fabric application model (type definition)

The docker-compose.yml file describes a deployable set of containers including their properties and configurations(for example, environment variables and ports). Deployment parameters such as placement constraints, resource limits, and DNS names are also specified in the docker-compose.yml file.

The [Service Fabric application model](service-fabric-application-model.md) uses service types and application types, where you can have many application instances of the same type (for example, one application instance per customer). This type-based model supports multiple versions of the same application type registered with the runtime. For example, customer A can have an application instantiated with type 1.0 of AppTypeA and customer B can have another application instantiated with the same type and version. The application types are defined in application manifests, and the application name and deployment parameters are specified at the time of application creation.

While this model offers flexibility, we're also planning to support a simpler instance-based deployment model where types are implicit from the manifest file. In this model, each application gets its own independent manifest. We're previewing this effort by adding support for docker-compose.yml, which is an instance-based deployment format.


## Next Steps

* Read up on the [Service Fabric application model](service-fabric-application-model.md).
