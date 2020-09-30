---
title: Service Fabric project creation next steps 
description: Learn about the application project you just created in Visual Studio.  Learn how to build services using tutorials and learn more about developing services for Service Fabric.

ms.topic: conceptual
ms.date: 12/07/2017
---
# Your Service Fabric application and next steps
Your Azure Service Fabric application has been created. This article describes some tutorials to try out, the makeup of your project, some more information you might be interested in, and potential next steps.

## Get started with tutorials, walk-throughs, and samples
Ready to get started?  

Work through the .NET application tutorial. Learn how to [build an app](service-fabric-tutorial-create-dotnet-app.md) with an ASP.NET Core front-end and a stateful back-end, [deploy the application](service-fabric-tutorial-deploy-app-to-party-cluster.md) to a cluster, [configure CI/CD](service-fabric-tutorial-deploy-app-with-cicd-vsts.md), and [set up monitoring and diagnostics](service-fabric-tutorial-monitoring-aspnet.md).

Or, try out one of the following walk-throughs and create your first...
- [C# Reliable Services service on Windows](service-fabric-reliable-services-quick-start.md) 
- [C# Reliable Actors service on Windows](service-fabric-reliable-actors-get-started.md) 
- [Guest executable service on Windows](quickstart-guest-app.md) 
- [Windows container application](service-fabric-get-started-containers.md) 

You may also be interested in trying out our [sample applications](https://aka.ms/servicefabricsamples).

## Have questions or feedback?  Need to report an issue?
Read through [common questions](service-fabric-common-questions.md) and find answers on what Service Fabric can do and how it should be used.

[Support options](service-fabric-support.md) lists forums on StackOverflow and MSDN for asking questions as well as options for reporting issues, getting support, and submitting product feedback.

## The application project
Every new application includes an application project. There may be one or two additional projects, depending on the type of service chosen.

The application project consists of:

* A set of references to the services that make up your application.
* Three publish profiles (1-Node Local, 5-Node Local, and Cloud) that you can use to maintain preferences for working with different environments--such as preferences related to a cluster endpoint and whether to perform upgrade deployments by default.
* Three application parameter files (same as above) that you can use to maintain environment-specific application configurations, such as the number of partitions to create for a service. Learn how to [configure your application for multiple environments](service-fabric-manage-multiple-environment-app-configuration.md).
* A deployment script that you can use to deploy your application from the command line or as part of an automated continuous integration and deployment pipeline. Learn more about [deploying applications using PowerShell](service-fabric-deploy-remove-applications.md).
* The application manifest, which describes the application. You can find the manifest under the ApplicationPackageRoot folder. Learn more about [application and service manifests](service-fabric-application-model.md).



## Learn more about the programming models
Service Fabric offers multiple ways to write and manage your services.  Here's overview and conceptual information on [stateless and stateful Reliable Services](service-fabric-reliable-services-introduction.md), [Reliable Actors](service-fabric-reliable-actors-introduction.md), [containers](service-fabric-containers-overview.md), [guest executables](service-fabric-guest-executables-introduction.md), and [stateless and stateful ASP.NET Core services](service-fabric-reliable-services-communication-aspnetcore.md).

## Learn about service communication
A Service Fabric application is composed of different services, where each service performs a specialized task. These services may communicate with each other and there may be client applications outside the cluster that connect to and communicate with services. Learn how to [set up communication with and between your services](service-fabric-connect-and-communicate-with-services.md) in Service Fabric. 

## Learn about configuring application security
You can secure applications that are running in the cluster under different user accounts. Service Fabric also helps secure the resources that are used by applications at the time of deployment under the user accounts--for example, files, directories, and certificates. This makes running applications, even in a shared hosted environment, more secure from one another.  Learn how to [configure security policies for your application](service-fabric-application-runas-security.md).

Your application may contain sensitive information, such as storage connection strings, passwords, or other values that should not be handled in plain text. Learn how to [manage secrets in your application](service-fabric-application-secret-management.md).

## Learn about the application lifecycle
As with other platforms, a Service Fabric application usually goes through the following phases: design, development, testing, deployment, upgrading, maintenance, and removal. [This article](service-fabric-application-lifecycle.md) provides an overview of the APIs and how they are used by the different roles throughout the phases of the Service Fabric application lifecycle.

## Next steps
- [Create a Windows cluster in Azure](service-fabric-tutorial-create-vnet-and-windows-cluster.md).
- Visualize your cluster, including deployed applications and physical layout, with [Service Fabric Explorer](service-fabric-visualizing-your-cluster.md).
- [Version and upgrade your services](service-fabric-application-upgrade-tutorial.md)


