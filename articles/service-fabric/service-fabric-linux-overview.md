---
title: Azure Service Fabric on Linux | Microsoft Docs
description: Service Fabric clusters support Linux and Java, which means you'll be able to deploy and host Service Fabric applications written in Java and C# on Linux.
services: service-fabric
documentationcenter: .net
author: mani-ramaswamy
manager: timlt
editor: ''

ms.assetid: 459afade-145d-4ee6-b72b-ddf380ccd1bf
ms.service: service-fabric
ms.devlang: Java
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 6/28/2017
ms.author: SubramaR

---
# Service Fabric on Linux
The preview of Service Fabric on Linux enables you to build, deploy, and manage highly available, highly scalable applications on Linux just as you would on Windows. The Service Fabric frameworks (Reliable Services and Reliable Actors) are available in Java on Linux in addition to C# (.NET Core).  You can also build [guest executable services](service-fabric-deploy-existing-app.md) with any language or framework. In addition, the preview also supports orchestrating Docker containers. Docker containers can run guest executables or native Service Fabric services, which use the Service Fabric frameworks.

Service Fabric on Linux is conceptually equivalent to Service Fabric on Windows (except for OS specifics and programming language support). Thus, most of our [existing documentation](http://aka.ms/servicefabricdocs) applies in helping you get familiar with the technology.

> [!VIDEO https://channel9.msdn.com/Blogs/Azure/Service-Fabric-Linux-Preview/player]
>
>

## Supported operating systems and programming languages
The limited preview supports the creation of one-box development clusters in addition to multi-machine clusters in Azure running Ubuntu Server 16.04. The preview supports the Reliable Actors and the Reliable Stateless Services frameworks in Java and C# in addition to guest executables and orchestrating Docker containers.  

> [!NOTE]
> Reliable Collections are not supported in Linux yet. Stand alone clusters aren't supported either - only one box and Azure Linux multi-machine clusters are supported in the preview.
>
>


## Supported tooling
The preview supports interaction with the cluster through Azure CLI. For Java developers, integration with Eclipse and Yeoman is provided with Eclipse supported on Linux and on OSX. The OSX integration uses a Linux VM under the hood via vagrant. For C# developers, integration with Yeoman is provided to generate application templates.

## Next steps
1. Get familiar with the [Reliable Actors](service-fabric-reliable-actors-introduction.md) and [Reliable Services](service-fabric-reliable-services-introduction.md) programming frameworks.
2. [Prepare your development environment on Linux](service-fabric-get-started-linux.md)
3. [Prepare your development environment on OSX](service-fabric-get-started-mac.md)
4. [Create your first Service Fabric Java application on Linux](service-fabric-create-your-first-linux-application-with-java.md)
5. [Setup Service Fabric continuous integration and deployment with Jenkins and GitHub](service-fabric-cicd-your-linux-java-application-with-jenkins.md)
6. [Service Fabric Windows/Linux differences](service-fabric-linux-windows-differences.md)
