---
title: Create your first Azure microservices app on Linux using Java | Microsoft Docs
description: Create and deploy a Service Fabric application using Java
services: service-fabric
documentationcenter: java
author: rwike77
manager: timlt
editor: ''

ms.assetid: 02b51f11-5d78-4c54-bb68-8e128677783e
ms.service: service-fabric
ms.devlang: java
ms.topic: hero-article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 06/02/2017
ms.author: ryanwi

---
# Create your first Service Fabric Java application on Linux
> [!div class="op_single_selector"]
> * [C# - Windows](service-fabric-create-your-first-application-in-visual-studio.md)
> * [Java - Linux](service-fabric-create-your-first-linux-application-with-java.md)
> * [C# - Linux](service-fabric-create-your-first-linux-application-with-csharp.md)
>
>

This quick start helps you create your first Azure Service Fabric Java application in a Linux development environment in just a few minutes.  When you are finished, you'll have a simple Java single-service app running on the local development cluster.  

## Prerequisites
Before you get started, install the Service Fabric SDK, the Azure CLI, and setup a development cluster in your [Linux development environment](service-fabric-get-started-linux.md). If you are using Mac OS X, you can [set up a Linux development environment in a virtual machine using Vagrant](service-fabric-get-started-mac.md).

## Create the application
A Service Fabric application contains one or more services, each with a specific role in delivering the application's functionality. The Service Fabric SDK for Linux includes a [Yeoman](http://yeoman.io/) generator that makes it easy to create your first service and to add more later.  You can also create, build, and deploy Service Fabric Java applications using a plugin for Eclipse. See [Create and deploy your first Java application using Eclipse](service-fabric-get-started-eclipse.md). For this quick start, use Yeoman to create an application with a single service that stores and gets a counter value.

1. In a terminal, type ``yo azuresfjava``.
2. Name your application. 
3. Choose the type of your first service and name it. For this tutorial, choose a Reliable Actor Service. For more information about the other types of services, see [Service Fabric programming model overview](service-fabric-choose-framework.md).
   ![Service Fabric Yeoman generator for Java][sf-yeoman]

## Build the application
The Service Fabric Yeoman templates include a build script for [Gradle](https://gradle.org/), which you can use to build the app from the terminal. To build and package the app, run the following:

  ```bash
  cd myapp
  gradle
  ```

## Deploy the application
Once the application is built, you can deploy it to the local cluster.

### Using XPlat CLI

1. Connect to the local Service Fabric cluster.

    ```bash
    azure servicefabric cluster connect
    ```

2. Run the install script provided in the template to copy the application package to the cluster's image store, register the application type, and create an instance of the application.

    ```bash
    ./install.sh
    ```

### Using Azure CLI 2.0

Deploying the built application is the same as any other Service Fabric application. See the documentation on
[managing a Service Fabric application with the Azure CLI](service-fabric-application-lifecycle-azure-cli-2.0.md) for
detailed instructions.

Parameters to these commands can be found in the generated manifests inside the application package.

Once the application has been deployed, open a browser and navigate to [Service Fabric Explorer](service-fabric-visualizing-your-cluster.md) at [http://localhost:19080/Explorer](http://localhost:19080/Explorer).
Then, expand the **Applications** node and note that there is now an entry for your application type and another for
the first instance of that type.

## Start the test client and perform a failover
Actors do not do anything on their own, they require another service or client to send them messages. The actor template includes a simple test script that you can use to interact with the actor service.

1. Run the script using the watch utility to see the output of the actor service.  The test script calls the `setCountAsync()` method on the actor to increment a counter, calls the `getCountAsync()` method on the actor to get the new counter value, and displays that value to the console.

    ```bash
    cd myactorsvcTestClient
    watch -n 1 ./testclient.sh
    ```

2. In Service Fabric Explorer, locate the node hosting the primary replica for the actor service. In the screenshot below, it is node 3. The primary service replica handles read and write operations.  Changes in service state are then replicated out to the secondary replicas, running on nodes 0 and 1 in the screen shot below.

    ![Finding the primary replica in Service Fabric Explorer][sfx-primary]

3. In **Nodes**, click the node you found in the previous step, then select **Deactivate (restart)** from the Actions menu. This action restarts the node running the primary service replica and forces a failover to one of the secondary replicas running on another node.  That secondary replica is promoted to primary, another secondary replica is created on a different node, and the primary replica begins to take read/write operations. As the node restarts, watch the output from the test client and note that the counter continues to increment despite the failover.

## Add another service to the application
To add another service to an existing application using `yo`, perform the following steps:
1. Change directory to the root of the existing application.  For example, `cd ~/YeomanSamples/MyApplication`, if `MyApplication` is the application created by Yeoman.
2. Run `yo azuresfjava:AddService`
3. Build and deploy the app, as in the preceding steps.

## Remove the application
Use the uninstall script provided in the template to delete the app instance, unregister the application package, and remove the application package from the cluster's image store.

```bash
./uninstall.sh
```

In Service Fabric explorer you see that the application and application type no longer appear in the **Applications** node.

## Next steps
* [Create your first Service Fabric Java application on Linux using Eclipse](service-fabric-get-started-eclipse.md)
* [Learn more about Reliable Actors](service-fabric-reliable-actors-introduction.md)
* [Interact with Service Fabric clusters using the Azure CLI](service-fabric-azure-cli.md)
* [Troubleshooting deployment](service-fabric-azure-cli.md#troubleshooting)
* Learn about [Service Fabric support options](service-fabric-support.md)

<!-- Images -->
[sf-yeoman]: ./media/service-fabric-create-your-first-linux-application-with-java/sf-yeoman.png
[sfx-primary]: ./media/service-fabric-create-your-first-linux-application-with-java/sfx-primary.png
[sf-eclipse-templates]: ./media/service-fabric-create-your-first-linux-application-with-java/sf-eclipse-templates.png
