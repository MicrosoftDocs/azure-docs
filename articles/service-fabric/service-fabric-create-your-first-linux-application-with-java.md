---
title: Create an Azure Service Fabric reliable actors Java application on Linux | Microsoft Docs
description: Learn how to create and deploy a Java Service Fabric reliable actors application in five minutes.
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
ms.date: 08/23/2017
ms.author: ryanwi

---
# Create your first Java Service Fabric Reliable Actors application on Linux
> [!div class="op_single_selector"]
> * [C# - Windows](service-fabric-create-your-first-application-in-visual-studio.md)
> * [Java - Linux](service-fabric-create-your-first-linux-application-with-java.md)
> * [C# - Linux](service-fabric-create-your-first-linux-application-with-csharp.md)
>
>

This quick-start helps you create your first Azure Service Fabric Java application in a Linux development environment in just a few minutes.  When you are finished, you'll have a simple Java single-service application running on the local development cluster.  

## Prerequisites
Before you get started, install the Service Fabric SDK, the Service Fabric CLI, and setup a development cluster in your [Linux development environment](service-fabric-get-started-linux.md). If you are using Mac OS X, you can [set up a Linux development environment in a virtual machine using Vagrant](service-fabric-get-started-mac.md).

You will also want to install the [Service Fabric CLI](service-fabric-cli.md).

### Install and set up the generators for Java
Service Fabric provides scaffolding tools which will help you create a Service Fabric Java application from terminal using Yeoman template generator. Please follow the steps below to ensure you have the Service Fabric yeoman template generator for Java working on your machine.
1. Install nodejs and NPM on your machine

  ```bash
  sudo apt-get install npm
  sudo apt install nodejs-legacy
  ```
2. Install [Yeoman](http://yeoman.io/) template generator on your machine from NPM

  ```bash
  sudo npm install -g yo
  ```
3. Install the Service Fabric Yeo Java application generator from NPM

  ```bash
  sudo npm install -g generator-azuresfjava
  ```

## Create the application
A Service Fabric application contains one or more services, each with a specific role in delivering the application's functionality. The generator you installed in the last section, makes it easy to create your first service and to add more later.  You can also create, build, and deploy Service Fabric Java applications using a plugin for Eclipse. See [Create and deploy your first Java application using Eclipse](service-fabric-get-started-eclipse.md). For this quick start, use Yeoman to create an application with a single service that stores and gets a counter value.

1. In a terminal, type ``yo azuresfjava``.
2. Name your application.
3. Choose the type of your first service and name it. For this tutorial, choose a Reliable Actor Service. For more information about the other types of services, see [Service Fabric programming model overview](service-fabric-choose-framework.md).
   ![Service Fabric Yeoman generator for Java][sf-yeoman]

## Build the application
The Service Fabric Yeoman templates include a build script for [Gradle](https://gradle.org/), which you can use to build the application from the terminal.
Service Fabric Java dependencies get fetched from Maven. To build and work on the Service Fabric Java applications, you need to ensure that you have JDK and Gradle installed. If not yet installed, you can run the following to install JDK(openjdk-8-jdk) and Gradle -

  ```bash
  sudo apt-get install openjdk-8-jdk-headless
  sudo apt-get install gradle
  ```

To build and package the application, run the following:

  ```bash
  cd myapp
  gradle
  ```

## Deploy the application
Once the application is built, you can deploy it to the local cluster.

1. Connect to the local Service Fabric cluster.

    ```bash
    sfctl cluster select --endpoint http://localhost:19080
    ```

2. Run the install script provided in the template to copy the application package to the cluster's image store,
register the application type, and create an instance of the application.

    ```bash
    ./install.sh
    ```

Deploying the built application is the same as any other Service Fabric application. See the documentation on
[managing a Service Fabric application with the Service Fabric CLI](service-fabric-application-lifecycle-sfctl.md) for
detailed instructions.

Parameters to these commands can be found in the generated manifests inside the application package.

Once the application has been deployed, open a browser and navigate to
[Service Fabric Explorer](service-fabric-visualizing-your-cluster.md) at
[http://localhost:19080/Explorer](http://localhost:19080/Explorer).
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

## Remove the application
Use the uninstall script provided in the template to delete the application instance, unregister the application package, and remove the application package from the cluster's image store.

```bash
./uninstall.sh
```

In Service Fabric explorer you see that the application and application type no longer appear in the **Applications** node.

## Service Fabric Java libraries on Maven
Service Fabric Java libraries have been hosted in Maven. You can add the dependencies in the ``pom.xml`` or ``build.gradle`` of your projects to use Service Fabric Java libraries from **mavenCentral**.

### Actors

Service Fabric Reliable Actor support for your application.

  ```XML
  <dependency>
      <groupId>com.microsoft.servicefabric</groupId>
      <artifactId>sf-actors-preview</artifactId>
      <version>0.10.0</version>
  </dependency>
  ```

  ```gradle
  repositories {
      mavenCentral()
  }
  dependencies {
      compile 'com.microsoft.servicefabric:sf-actors-preview:0.10.0'
  }
  ```

### Services

Service Fabric Stateless Service support for your application.

  ```XML
  <dependency>
      <groupId>com.microsoft.servicefabric</groupId>
      <artifactId>sf-services-preview</artifactId>
      <version>0.10.0</version>
  </dependency>
  ```

  ```gradle
  repositories {
      mavenCentral()
  }
  dependencies {
      compile 'com.microsoft.servicefabric:sf-services-preview:0.10.0'
  }
  ```

### Others
#### Transport

Transport layer support for Service Fabric Java application. You do not need to explicitly add this dependency to your Reliable Actor or Service applications, unless you program at the transport layer.

  ```XML
  <dependency>
      <groupId>com.microsoft.servicefabric</groupId>
      <artifactId>sf-transport-preview</artifactId>
      <version>0.10.0</version>
  </dependency>
  ```

  ```gradle
  repositories {
      mavenCentral()
  }
  dependencies {
      compile 'com.microsoft.servicefabric:sf-transport-preview:0.10.0'
  }
  ```

#### Fabric support

System level support for Service Fabric, which talks to native Service Fabric runtime. You do not need to explicitly add this dependency to your Reliable Actor or Service applications. This gets fetched automatically from Maven, when you include the other dependencies above.

  ```XML
  <dependency>
      <groupId>com.microsoft.servicefabric</groupId>
      <artifactId>sf-preview</artifactId>
      <version>0.10.0</version>
  </dependency>
  ```

  ```gradle
  repositories {
      mavenCentral()
  }
  dependencies {
      compile 'com.microsoft.servicefabric:sf-preview:0.10.0'
  }
  ```

## Migrating old Service Fabric Java applications to be used with Maven
We have recently moved Service Fabric Java libraries from Service Fabric Java SDK to Maven repository. While the new applications you generate using Yeoman or Eclipse, will generate latest updated projects (which will be able to work with Maven), you can update your existing Service Fabric stateless or actor Java applications, which were using the Service Fabric Java SDK earlier, to use the Service Fabric Java dependencies from Maven. Please follow the steps mentioned [here](service-fabric-migrate-old-javaapp-to-use-maven.md) to ensure your older application works with Maven.

## Next steps

* [Create your first Service Fabric Java application on Linux using Eclipse](service-fabric-get-started-eclipse.md)
* [Learn more about Reliable Actors](service-fabric-reliable-actors-introduction.md)
* [Interact with Service Fabric clusters using the Service Fabric CLI](service-fabric-cli.md)
* Learn about [Service Fabric support options](service-fabric-support.md)
* [Getting started with Service Fabric CLI](service-fabric-cli.md)

<!-- Images -->
[sf-yeoman]: ./media/service-fabric-create-your-first-linux-application-with-java/sf-yeoman.png
[sfx-primary]: ./media/service-fabric-create-your-first-linux-application-with-java/sfx-primary.png
[sf-eclipse-templates]: ./media/service-fabric-create-your-first-linux-application-with-java/sf-eclipse-templates.png
