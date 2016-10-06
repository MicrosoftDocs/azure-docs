<properties
   pageTitle="Create your first Service Fabric application on Linux using C#| Microsoft Azure"
   description="Create and deploy a Service Fabric application using C#"
   services="service-fabric"
   documentationCenter="csharp"
   authors="mani-ramaswamy"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="csharp"
   ms.topic="hero-article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="10/04/2016"
   ms.author="subramar"/>


# Create your first Azure Service Fabric application

> [AZURE.SELECTOR]
- [C# - Windows](service-fabric-create-your-first-application-in-visual-studio.md)
- [Java - Linux](service-fabric-create-your-first-linux-application-with-java.md)
- [C# - Linux](service-fabric-create-your-first-linux-application-with-csharp.md)

Service Fabric provides SDKs for building services on Linux in both .NET Core and Java. In this tutorial, we look at how to create an application for Linux and build a service using C# (.NET Core).

## Prerequisites

Before you get started, make sure that you have [set up your Linux development environment](service-fabric-get-started-linux.md). If you are using Mac OS X, you can [set up a Linux one-box environment in a virtual machine using Vagrant](service-fabric-get-started-mac.md).

## Create the application

A Service Fabric application can contain one or more services, each with a specific role in delivering the application's functionality. The Service Fabric SDK for Linux includes a [Yeoman](http://yeoman.io/) generator that makes it easy to create your first service and to add more later. Let's use Yeoman to create an application with a single service.

1. In a terminal, type the following command to start building the scaffolding: `yo azuresfcsharp`

2. Name your application.

3. Choose the type of your first service and name it. For the purposes of this tutorial, we choose a Reliable Actor Service.

  ![Service Fabric Yeoman generator for C#][sf-yeoman]

>[AZURE.NOTE] For more information about the options, see [Service Fabric programming model overview](service-fabric-choose-framework.md).

## Build the application

The Service Fabric Yeoman templates include a build script that you can use to build the app from the terminal (after navigating to the application folder).

  ```bash
 cd myapp 
 ./build.sh 
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

3. Click the node you found in the previous step, then select **Deactivate (restart)** from the Actions menu. This action restarts one of the five nodes in your local cluster forcing a failover to a secondary replica running on another node. As you perform this action, pay attention to the output from the test client and note that the counter continues to increment despite the failover.


## Next steps

- [Learn more about Reliable Actors](service-fabric-reliable-actors-introduction.md)
- [Interacting with Service Fabric clusters using the Azure CLI](service-fabric-azure-cli.md)

<!-- Images -->
[sf-yeoman]: ./media/service-fabric-create-your-first-linux-application-with-csharp/yeoman-csharp.png
[sfx-primary]: ./media/service-fabric-create-your-first-linux-application-with-csharp/sfx-primary.png
