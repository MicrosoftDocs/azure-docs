<properties
   pageTitle="Service Fabric Developer Tasks | Microsoft Azure"
   description="This topic contains links to a set of core development tasks for Service Fabric"
   services="service-fabric"
   documentationCenter=".net"
   authors="seanmck"
   manager="coreysa"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotNet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="10/7/2015"
   ms.author="seanmck"/>

# Service Fabric Development Tasks

The following are a set of core tasks typically often required when building a Service Fabric application.

## Create an Azure cluster

The Service Fabric SDK provides a local cluster for development and testing. To create a cluster in Azure, see [Setting up a Service Fabric Cluster from the Azure Portal](service-fabric-cluster-creation-via-portal.md).

## Publish your application to Azure

You can publish your application directly from Visual Studio to an Azure cluster. To learn how, see [Publishing your application to Azure](service-fabric-publish-your-app-to-azure.md).

## Use Service Fabric Explorer to visualize your cluster

Service Fabric Explorer offers an easy way to visual your cluster, including deployed applications and physical layout. To learn, see [Visualizing your cluster using Service Fabric Explorer](service-fabric-visualizing-your-cluster.md).

## Version and upgrade your services

Service Fabric enables independent versioning and upgrade of independent services in an application. To learn more, see [Versioning and upgrading your services](service-fabric-application-upgrade-tutorial.md).

## Communicate between services in your cluster

There are several ways to communicate between services in your cluster:

- The simplest option is based on [ServiceProxy and ServiceCommunicationListener](service-fabric-reliable-services-communication-default.md)
- For a RESTful HTTP approach, consider using [OWIN and WebAPI](service-fabric-reliable-services-communication-webapi.md)

## Consume services from clients outside your cluster

Placeholder

## Set up Diagnostics

Placeholder

## Configure continuous integration with Visual Studio Online

To learn how you can set up a continuous integration process for your Service Fabric application, see [Configure continuous integration with Visual Studio Online](service-fabric-configure-continuous-integration-with-vso.md).
