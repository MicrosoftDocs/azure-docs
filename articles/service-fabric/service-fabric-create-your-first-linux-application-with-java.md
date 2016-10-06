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
   ms.date="10/04/2016"
   ms.author="seanmck"/>


# Create your first Azure Service Fabric application

> [AZURE.SELECTOR]
- [C# - Windows](service-fabric-create-your-first-application-in-visual-studio.md)
- [Java - Linux](service-fabric-create-your-first-linux-application-with-java.md)
- [C# - Linux](service-fabric-create-your-first-linux-application-with-csharp.md)

Service Fabric provides SDKs for building services on Linux in both .NET Core and Java. In this tutorial, we will look at how to create an application for Linux and build a service using Java.

## Prerequisites

Before you get started, make sure that you have [set up your Linux development environment](service-fabric-get-started-linux.md). If you are using Mac OS X, you can [set up a Linux one-box environment in a virtual machine using Vagrant](service-fabric-get-started-mac.md).

## Create the application

A Service Fabric application can contain one or more services, each with a specific role in delivering the application's functionality. The Service Fabric SDK for Linux includes a [Yeoman](http://yeoman.io/) generator that makes it easy to create your first service and to add more later. Let's use Yeoman to create a new application with a single service.

1. In a terminal, type **yo azuresfjava**.

2. Name your application.

3. Choose the type of your first service and name it. For the purposes of this tutorial, we will choose a Reliable Actor Service.

  ![Service Fabric Yeoman generator for Java][sf-yeoman]

>[AZURE.NOTE] For more information about the options, see [Service Fabric programming model overview](service-fabric-choose-framework.md).

## Build the application

The Service Fabric Yeoman templates include a build script for [Gradle](https://gradle.org/), which you can use to build the app from the terminal.

  ```bash
  cd myapp
  gradle
  ```

## Deploy the application

Once the application is built, you can deploy it to the local cluster using the Azure CLI.

1. Connect to the local Service Fabric cluster.

    ```bash
    azure servicefabric cluster connect
    ```

2. Use the install script provided in the template to copy the application package to the cluster's image store, register the application type, and create an instance of the application.

    ```bash
    ./install.sh
    ```

3. Open a browser and navigate to Service Fabric Explorer at http://localhost:19080/Explorer (replace localhost with the private IP of the VM if using Vagrant on Mac OS X).

4. Expand the Applications node and note that there is now an entry for your application type and another for the first instance of that type.

## Start the test client and perform a failover

Actor projects do not do anything on their own. They require another service or client to send them messages. The actor template includes a simple test script that you can use to interact with the actor service.

1. Run the script using the watch utility to see the output of the actor service.

    ```bash
    cd myactorsvcTestClient
    watch -n 1 ./testclient.sh
    ```

2. In Service Fabric Explorer, locate node hosting the primary replica for the actor service. In the screenshot below, it is node 3.

    ![Finding the primary replica in Service Fabric Explorer][sfx-primary]

3. Click the node you found in the previous step, then select **Deactivate (restart)** from the Actions menu. This will restart one of the five nodes in your local cluster and force a failover to one of the secondary replicas running on another node. As you do this, pay attention to the output from the test client and note that the counter continues to increment despite the failover.

## Build and deploy an application with the Eclipse Neon plugin

If you installed the Service Plugin for Eclipse Neon, you can use it to create, build, and deploy Service Fabric applications built with Java.

### Create the application

The Service Fabric plugin is available through Eclipse extensibility.

1. In Eclipse, choose **File > Other > Service Fabric**. You see a set of options, including Actors and Containers.

    ![Service Fabric templates in Eclipse][sf-eclipse-templates]

2. In this case, choose Stateless Service.

3. You are asked to confirm the use of the Service Fabric perspective, which optimizes Eclipse for use with Service Fabric projects. Choose 'Yes'.

### Deploy the application

The Service Fabric templates include a set of Gradle tasks for building and deploying applications, which you can trigger through Eclipse.

1. Choose **Run > Run Configurations**.

2. Expand **Gradle Project** and choose **ServiceFabricDeployer**.

3. Click **Run**.

Your app will build and deploy within a few moments. You can monitor its status from Service Fabric Explorer.

## Next steps

- [Learn more about Reliable Actors](service-fabric-reliable-actors-introduction.md)
- [Interacting with Service Fabric clusters using the Azure CLI](service-fabric-azure-cli.md)

<!-- Images -->
[sf-yeoman]: ./media/service-fabric-create-your-first-linux-application-with-java/sf-yeoman.png
[sfx-primary]: ./media/service-fabric-create-your-first-linux-application-with-java/sfx-primary.png
[sf-eclipse-templates]: ./media/service-fabric-create-your-first-linux-application-with-java/sf-eclipse-templates.png
