<properties
   pageTitle="Service Fabric project creation next steps | Microsoft Azure"
   description="This article contains links to a set of core development tasks for Service Fabric"
   services="service-fabric"
   documentationCenter=".net"
   authors="seanmck"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotNet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="11/7/2015"
   ms.author="seanmck"/>

# Your Service Fabric application and next steps

Your Service Fabric application has been created. This article describes the makeup of your project and some potential next steps.

## Your application

Your solution contains at least two projects: an application project and a service project. In addition, actor templates contain a class library project for defining your actor interface.

The application project consists of:

- A set of references to the services that make up your application.
- Two publish profiles (Local and Cloud) that you can use to maintain preferences for working with different environments, such as a cluster endpoint and whether to perform upgrade deployments by default.
- Two application parameter files (Local and Cloud) that you can use to maintain environment-specific application configurations, such as the number of partitions to create for a service.
- A deployment script that you can use to deploy your application from the command line or as part of an automated continuous integration pipeline.
- The application manifest, which describes the application.

The details of your service project will depend on the type of service you chose:

- **Stateless Reliable Service**:
- **Stateful Reliable Service**:
- **Stateless Reliable Actor**:
- **Stateful Reliable Actor**:
- **ASP.NET 5**:

## Next steps

### Create an Azure cluster

The Service Fabric SDK provides a local cluster for development and testing. To create a cluster in Azure, see [Setting up a Service Fabric Cluster from the Azure Portal](service-fabric-cluster-creation-via-portal.md).

### Publish your application to Azure

You can publish your application directly from Visual Studio to an Azure cluster. To learn how, see [Publishing your application to Azure](service-fabric-publish-your-app-to-azure.md).

### Use Service Fabric Explorer to visualize your cluster

Service Fabric Explorer offers an easy way to visual your cluster, including deployed applications and physical layout. To learn, see [Visualizing your cluster using Service Fabric Explorer](service-fabric-visualizing-your-cluster.md).

### Version and upgrade your services

Service Fabric enables independent versioning and upgrade of independent services in an application. To learn more, see [Versioning and upgrading your services](service-fabric-application-upgrade-tutorial.md).

### Communicate between services in your cluster

There are several ways to communicate between services in your cluster:

- The simplest option is based on [ServiceProxy and ServiceCommunicationListener](service-fabric-reliable-services-communication-default.md)
- For an HTTP-based approach using REST APIs, consider using [OWIN and WebAPI](service-fabric-reliable-services-communication-webapi.md)

### Consume services from clients outside your cluster

Placeholder

### Set up Diagnostics

Placeholder

### Configure continuous integration with Visual Studio Online

To learn how you can set up a continuous integration process for your Service Fabric application, see [Configure continuous integration with Visual Studio Online](service-fabric-configure-continuous-integration-with-vso.md).
