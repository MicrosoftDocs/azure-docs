<properties
   pageTitle="Create your first Service Fabric application on Linux using Java | Microsoft Azure"
   description="Create and deploy a Service Fabric application using Java"
   services="service-fabric"
   documentationCenter="java"
   authors="seanmck"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="java"
   ms.topic="hero-article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="09/21/2016"
   ms.author="seanmck"/>

# Create your first Azure Service Fabric application on Linux with Java

Service Fabric provides SDKs for building services on Linux in both .NET Core and Java. In this tutorial, we will look at how to create an application for Linux and build a service using Java.

## Prerequisites

Before you get started, make sure that you have [set up your Linux development environment](service-fabric-get-started-linux.md). If you are using Mac OS X, you can [set up a Linux one-box environment in a virtual machine using Vagrant](service-fabric-get-started-mac.md).

## Create the application

A Service Fabric application can contain one or more services, each with a specific role in delivering the application's functionality. The Service Fabric SDK for Linux includes a [Yeoman](http://yeoman.io/) generator that makes it easy to create your first service and to add more later. Let's look at how to use Yeoman to create a new application with a single service.

1. In a terminal, type **yo azuresfjava**.

2. Name your application.

3. Choose the type of your first service and name it. For the purposes of this tutorial, we will choose a Reliable Actor Service.

>[AZURE.NOTE] For more information about the options, see [Service Fabric programming model overview](service-fabric-choose-framework.md).

## Build the application

The Service Fabric Yeoman templates include a build script for [Gradle](https://gradle.org/), which you can use to build the app from the terminal.

```bash
$ gradle
```

## Install the application



1. Connect to the local Service Fabric cluster.

  ```bash
  $ azuresfcli servicefabric cluster connect
  ```

2. Install the application. This will copy the application package to the cluster's image store, register the application type, and create an instance of the application.

  ```bash
  $ install.sh
  ```

## Next steps

//todo
