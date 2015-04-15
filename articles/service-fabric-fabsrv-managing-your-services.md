<properties
   pageTitle="Managing your Service Fabric applications in Visual Studio"
   description="You can manage your Microsoft Azure Service Fabric applications and services through Visual Studio."
   services="service-fabric"
   documentationCenter=".net"
   authors="jessebenson"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="04/14/2015"
   ms.author="jesseb"/>

# Managing your Service Fabric applications in Visual Studio

You can manage your Microsoft Azure Service Fabric applications and services through Visual Studio. Once you've [setup your development environment](../service-fabric-setup-your-development-environment), you can use the Visual Studio to create Service Fabric applications, add services, or package, register, and deploy applications in your local development cluster.

To manage your Service Fabric application, in the Solution Explorer right-click on your application project and expand the **Service Fabric** menu.

![Manage your Service Fabric application by right-clicking on the Application project][manageservicefabric]

## Deploying your Service Fabric application

Deploying a Service Fabric application combines the following steps into one simple operation.

1. Creating the application package
2. Uploading the application package to the image store
3. Registering the application type
4. Removing any running application instances
5. Creating a new application instance

In Visual Studio, deployment is done by right-clicking on your Service Fabric application in the **Solution Explorer** and clicking **Service Fabric** > **Deploy**, or simply **Deploy**.  Pressing **F5** will also deploy your application and attach the debugger to all application instances.

The deployment can be removed using **Service Fabric** > **Remove Deployment**.  This will reverse all the deployment steps above.

## Adding a service to your Service Fabric application

You can add new Fabric Services to your application to extend its functionality.  To ensure the service is included in your application package, add the service through the **Service Fabric** menu > **New Fabric Service...**

![Add a new Fabric Service to your application][newservice]

Select a Service Fabric project type to add to your application, and specify a name for the service.

![Select a Fabric Service project type to add to your application][addserviceproject]

The new service will be added to your solution and existing application package. The service references will be added to the application manifest, and the next time you deploy the application the service will be created and started.

![The new service will be added to your application manifest][newserviceapplicationmanifest]

## Packaging your Service Fabric application

An application package needs to be created in order to deploy the application and services to a cluster.  The package organizes the application manifest, service manifest(s), and other necessary package files in a specific layout.  Visual Studio sets up and manages the package in the application project's folder, in the 'pkg' directory.  Clicking the **Service Fabric** > **Package** creates or updates the application package.

## Registering your Service Fabric application

Once an application type has been packaged, the application type can be registered with the Service Fabric cluster.  Registration involves uploading the package to a location accessible by internal Service Fabric components and registering the application type for use.  In Visual Studio, this can be done by clicking **Service Fabric** > **Register Type**.

The application type can be unregistered from the cluster using **Service Fabric** > **Unregister Type**.  This unregisters the application type and removes the application package from the cluster's internal location.

> [AZURE.NOTE] An application cannot be unregistered if an application instance is currently running in the cluster.  All application instances must be removed before unregistering the application type.

## Creating an application instance

Once the application type is registered, an application instance can be instantiated in the Service Fabric cluster.  In Visual Studio, this can be done by clicking **Service Fabric** > **Create Application**.

The application instance can be removed from the cluster using **Service Fabric** > **Remove Application**.  This triggers a safe shutdown of the application and all services running in the cluster.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

- [Service Fabric application model](../service-fabric-application-model)
- [Service Fabric application deployment](../service-fabric-deploy-remove-applications)
- [Debugging your Service Fabric application](../service-fabric-debugging-your-application)
- [Visualizing your cluster using Service Fabric Explorer](../service-fabric-visualizing-your-cluster)

<!--Image references-->
[addserviceproject]:./media/service-fabric-managing-your-services/addserviceproject.png
[manageservicefabric]: ./media/service-fabric-managing-your-services/manageservicefabric.png
[newservice]:./media/service-fabric-managing-your-services/newservice.png
[newserviceapplicationmanifest]:./media/service-fabric-managing-your-services/newserviceapplicationmanifest.png
