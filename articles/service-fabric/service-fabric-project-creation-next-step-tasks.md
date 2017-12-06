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
* Three application parameter files (same as above) that you can use to maintain environment-specific application configurations, such as the number of partitions to create for a service. Learn how to [configure your application for multiple environments](service-fabric-manage-multiple-environment-app-configuration.md)
* A deployment script that you can use to deploy your application from the command line or as part of an automated continuous integration and deployment pipeline. Learn more about [deploying applications using PowerShell](service-fabric-deploy-remove-applications.md)
* The application manifest, which describes the application. You can find the manifest under the ApplicationPackageRoot folder. Learn more about [application and service manifests](service-fabric-application-model.md)

## Learn more about the different programming models
Service Fabric offers multiple ways to write and manage your services. Services can choose to use the Service Fabric APIs to take full advantage of the platform's features and application frameworks. Services can also be any compiled executable program written in any language or code running in a guest executable or container hosted on a Service Fabric cluster.  Here's some overview information on [stateless and stateful Reliable Services](service-fabric-reliable-services-introduction.md), [Reliable Actors](service-fabric-reliable-actors-introduction.md), [containers](service-fabric-containers-overview.md), [guest executables](service-fabric-deploy-existing-app.md), and [stateless and stateful ASP.NET Core services](service-fabric-reliable-services-communication-aspnetcore.md).

## Get started coding
Try out the .NET application tutorial.  Learn how to [build an app](service-fabric-tutorial-create-dotnet-app.md) with an ASP.NET core front-end and a stateful back-end, [deploy the application](service-fabric-tutorial-deploy-app-to-party-cluster.md) to a cluster, [configure CI/CD](service-fabric-tutorial-deploy-app-with-cicd-vsts.md), and [set up monitoring and diagnostics](service-fabric-tutorial-monitoring-aspnet.md).

Or, try out one of the following walk-throughs and create your first...
- [C# application in Visual Studio](service-fabric-create-your-first-application-in-visual-studio.md) 
- [C# Reliable Services service on Windows](service-fabric-reliable-services-quick-start.md) 
- [C# Reliable Actors service on Windows](service-fabric-reliable-actors-get-started.md) 
- [Guest executable service on Windows](quickstart-guest-app.md) 
- [Windows container application](service-fabric-get-started-containers.md) 


## Learn about service communication

## Learn about configuring security

## Learn about the application life-cycle

## Next steps
### Create an Azure cluster
The Service Fabric SDK provides a local cluster for development and testing. To create a cluster in Azure, see [Setting up a Service Fabric cluster from the Azure portal](service-fabric-tutorial-create-vnet-and-windows-cluster.md).

### Publish your application to Azure
You can publish your application directly from Visual Studio to an Azure cluster. To learn how, see [Publishing your application to Azure][publish-app-to-azure].

### Use Service Fabric Explorer to visualize your cluster
Service Fabric Explorer offers an easy way to visualize your cluster, including deployed applications and physical layout. To learn more, see [Visualizing your cluster by using Service Fabric Explorer][visualize-with-sfx].

### Version and upgrade your services
Service Fabric enables independent versioning and upgrading of independent services in an application. To learn more, see [Versioning and upgrading your services][app-upgrade-tutorial].

### Configure continuous integration with Visual Studio Team Services
To learn how you can set up a continuous integration process for your Service Fabric application, see [Configure continuous integration with Visual Studio Team Services][ci-with-vso].

<!-- Links -->
[add-web-frontend]: service-fabric-add-a-web-frontend.md
[publish-app-to-azure]: service-fabric-manage-application-in-visual-studio.md
[visualize-with-sfx]: service-fabric-visualizing-your-cluster.md
[ci-with-vso]: service-fabric-set-up-continuous-integration.md
[reliable-services-webapi]: service-fabric-reliable-services-communication-webapi.md
[app-upgrade-tutorial]: service-fabric-application-upgrade-tutorial.md
[aspnet-webapi]: https://docs.asp.net/en/latest/tutorials/first-web-api.html
[aspnet-webapp]: https://docs.asp.net/en/latest/tutorials/first-mvc-app/index.html
