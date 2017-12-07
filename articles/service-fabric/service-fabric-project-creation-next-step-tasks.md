---
title: Service Fabric project creation next steps | Microsoft Docs
description: This article contains links to a set of core development tasks for Service Fabric.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: ''

ms.assetid: 299d1f97-1ca9-440d-9f81-d1d0dd2bf4df
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 12/06/2017
ms.author: rwike77

---
# Your Service Fabric application and next steps
Your Azure Service Fabric application has been created. This article describes the makeup of your project, some tutorials to try out, more information, and some potential next steps.

## The application project
Every new application includes an application project. There may be one or two additional projects, depending on the type of service chosen.

The application project consists of:

* A set of references to the services that make up your application.
* Three publish profiles (1-Node Local, 5-Node Local, and Cloud) that you can use to maintain preferences for working with different environments--such as preferences related to a cluster endpoint and whether to perform upgrade deployments by default.
* Three application parameter files (same as above) that you can use to maintain environment-specific application configurations, such as the number of partitions to create for a service. Learn how to [configure your application for multiple environments](service-fabric-manage-multiple-environment-app-configuration.md).
* A deployment script that you can use to deploy your application from the command line or as part of an automated continuous integration and deployment pipeline. Learn more about [deploying applications using PowerShell](service-fabric-deploy-remove-applications.md).
* The application manifest, which describes the application. You can find the manifest under the ApplicationPackageRoot folder. Learn more about [application and service manifests](service-fabric-application-model.md).

## Learn more about the programming models
Service Fabric offers multiple ways to write and manage your services.  Here's overview and conceptual information on [stateless and stateful Reliable Services](service-fabric-reliable-services-introduction.md), [Reliable Actors](service-fabric-reliable-actors-introduction.md), [containers](service-fabric-containers-overview.md), [guest executables](service-fabric-deploy-existing-app.md), and [stateless and stateful ASP.NET Core services](service-fabric-reliable-services-communication-aspnetcore.md).

## Tutorials and walk-throughs
Try out the .NET application tutorial.  Learn how to [build an app](service-fabric-tutorial-create-dotnet-app.md) with an ASP.NET Core front-end and a stateful back-end, [deploy the application](service-fabric-tutorial-deploy-app-to-party-cluster.md) to a cluster, [configure CI/CD](service-fabric-tutorial-deploy-app-with-cicd-vsts.md), and [set up monitoring and diagnostics](service-fabric-tutorial-monitoring-aspnet.md).

Or, try out one of the following walk-throughs and create your first...
- [C# application in Visual Studio](service-fabric-create-your-first-application-in-visual-studio.md) 
- [C# Reliable Services service on Windows](service-fabric-reliable-services-quick-start.md) 
- [C# Reliable Actors service on Windows](service-fabric-reliable-actors-get-started.md) 
- [Guest executable service on Windows](quickstart-guest-app.md) 
- [Windows container application](service-fabric-get-started-containers.md) 


## Learn about service communication
In Service Fabric, services run somewhere in a Service Fabric cluster composed of multiple virtual or physical machines. Services move from one place to another and are not statically tied to a particular machine or address.  A Service Fabric application is composed of different services, where each service performs a specialized task. These services may communicate with each other and there may be client applications that connect to and communicate with services. Learn how to [set up communication with and between your services](service-fabric-connect-and-communicate-with-services.md) in Service Fabric. 

## Learn about configuring application security
You can secure applications that are running in the cluster under different user accounts. Service Fabric also helps secure the resources that are used by applications at the time of deployment under the user accounts--for example, files, directories, and certificates. This makes running applications, even in a shared hosted environment, more secure from one another.  Learn how to [configure security policies for your application](service-fabric-application-runas-security.md).

Your application may contain sensitive information, such as storage connection strings, passwords, or other values that should not be handled in plain text. Learn how to [manage secrets in your application](service-fabric-application-secret-management.md).

## Learn about the application life-cycle
As with other platforms, a Service Fabric application usually goes through the following phases: design, development, testing, deployment, upgrading, maintenance, and removal. [This article](service-fabric-application-lifecycle.md) provides an overview of the APIs and how they are used by the different roles throughout the phases of the Service Fabric application life-cycle.

## Next steps
- [Create a Windows cluster in Azure](service-fabric-tutorial-create-vnet-and-windows-cluster.md).
- Visualize your cluster, including deployed applications and physical layout, with [Service Fabric Explorer](service-fabric-visualizing-your-cluster.md).
- [Version and upgrade your services](service-fabric-application-upgrade-tutorial.md)



<!-- Links -->
[add-web-frontend]: service-fabric-add-a-web-frontend.md
[publish-app-to-azure]: service-fabric-manage-application-in-visual-studio.md
[reliable-services-webapi]: service-fabric-reliable-services-communication-webapi.md
[app-upgrade-tutorial]: 
[aspnet-webapi]: https://docs.asp.net/en/latest/tutorials/first-web-api.html
[aspnet-webapp]: https://docs.asp.net/en/latest/tutorials/first-mvc-app/index.html
