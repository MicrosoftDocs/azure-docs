---
title: Create your first Azure Service Fabric app on Linux using C#
description: Learn how to create and deploy a Service Fabric application using C# and .NET Core 2.0.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
ms.custom: devx-track-dotnet
services: service-fabric
ms.date: 07/14/2022
---

# Create your first Azure Service Fabric application
> [!div class="op_single_selector"]
> * [Java - Linux (Preview)](service-fabric-create-your-first-linux-application-with-java.md)
> * [C# - Linux (Preview)](service-fabric-create-your-first-linux-application-with-csharp.md)
>
>

Service Fabric provides SDKs for building services on Linux in both .NET Core and Java. In this tutorial, we look at how to create an application for Linux and build a service using C# on .NET Core 2.0.

## Prerequisites
Before you get started, make sure that you have [set up your Linux development environment](service-fabric-get-started-linux.md). If you are using Mac OS X, you can [set up a Linux one-box environment in a virtual machine using Vagrant](service-fabric-get-started-mac.md).

You will also want to install the [Service Fabric CLI](service-fabric-cli.md)

### Install and set up the generators for C#
Service Fabric provides scaffolding tools which help you create Service Fabric applications from a terminal using Yeoman template generators. Follow these steps to set up the Service Fabric Yeoman template generators for C#:

1. Install nodejs and NPM on your machine

   ```bash
   curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash 
   nvm install node 
   ```
2. Install [Yeoman](https://yeoman.io/) template generator on your machine from NPM

   ```bash
   npm install -g yo
   ```
3. Install the Service Fabric Yeoman C# application generator from NPM

   ```bash
   npm install -g generator-azuresfcsharp
   ```

## Create the application
A Service Fabric application can contain one or more services, each with a specific role in delivering the application's functionality. The Service Fabric [Yeoman](https://yeoman.io/) generator for C#, which you installed in last step, makes it easy to create your first service and to add more later. Let's use Yeoman to create an application with a single service.

1. In a terminal, type the following command to start building the scaffolding: `yo azuresfcsharp`
2. Name your application.
3. Choose the type of your first service and name it. For the purposes of this tutorial, we choose a Reliable Actor Service.

   ![Service Fabric Yeoman generator for C#][sf-yeoman]

> [!NOTE]
> For more information about the options, see [Service Fabric programming model overview](service-fabric-choose-framework.md).
>
>

## Build the application
The Service Fabric Yeoman templates include a build script that you can use to build the app from the terminal (after navigating to the application folder).

  ```sh
 cd myapp
 ./build.sh
  ```

## Deploy the application

Once the application is built, you can deploy it to the local cluster.

1. Connect to the local Service Fabric cluster.

    ```bash
    sfctl cluster select --endpoint http://localhost:19080
    ```

2. Run the install script provided in the template to copy the application package to the cluster's image store, register the application type, and create an instance of the application.

    ```bash
    ./install.sh
    ```

Deploying the built application is the same as any other Service Fabric application. See the documentation on
[managing a Service Fabric application with the Service Fabric CLI](service-fabric-application-lifecycle-sfctl.md) for
detailed instructions.

Parameters to these commands can be found in the generated manifests inside the application package.

Once the application has been deployed, open a browser and navigate to
[Service Fabric Explorer](service-fabric-visualizing-your-cluster.md) at
`http://localhost:19080/Explorer`. Then, expand the **Applications** node and note
that there is now an entry for your application type and another for the first instance of that type.

> [!IMPORTANT]
> To deploy the application to a secure Linux cluster in Azure, you need to configure a certificate to validate your application with the Service Fabric runtime. Doing so enables your Reliable Services services to communicate with the underlying Service Fabric runtime APIs. To learn more, see [Configure a Reliable Services app to run on Linux clusters](./service-fabric-configure-certificates-linux.md#configure-a-reliable-services-app-to-run-on-linux-clusters).  
>

## Start the test client and perform a failover
Actor projects do not do anything on their own. They require another service or client to send them messages. The actor
template includes a simple test script that you can use to interact with the actor service.

1. Run the script using the watch utility to see the output of the actor service.

   In case of MAC OS X, you need to copy the myactorsvcTestClient folder into the same location inside the container by running the following additional commands.
    
    ```bash
    docker cp  [first-four-digits-of-container-ID]:/home
    docker exec -it [first-four-digits-of-container-ID] /bin/bash
    cd /home
    ```
    
    ```bash
    cd myactorsvcTestClient
    watch -n 1 ./testclient.sh
    ```
2. In Service Fabric Explorer, locate node hosting the primary replica for the actor service. In the screenshot below, it is node 3.

    ![Finding the primary replica in Service Fabric Explorer][sfx-primary]
3. Click the node you found in the previous step, then select **Deactivate (restart)** from the Actions menu. This action restarts one node in your local cluster forcing a failover to a secondary replica running on another node. As you perform this action, pay attention to the output from the test client and note that the counter continues to increment despite the failover.

## Adding more services to an existing application

To add another service to an application already created using `yo`, perform the following steps:
1. Change directory to the root of the existing application.  For example, `cd ~/YeomanSamples/MyApplication`, if `MyApplication` is the application created by Yeoman.
2. Run `yo azuresfcsharp:AddService`

## Next steps

* [Interacting with Service Fabric clusters using the Service Fabric CLI](service-fabric-cli.md)
* Learn about [Service Fabric support options](service-fabric-support.md)
* [Getting started with Service Fabric CLI](service-fabric-cli.md)

<!-- Images -->
[sf-yeoman]: ./media/service-fabric-create-your-first-linux-application-with-csharp/yeoman-csharp.png
[sfx-primary]: ./media/service-fabric-create-your-first-linux-application-with-csharp/sfx-primary.png
