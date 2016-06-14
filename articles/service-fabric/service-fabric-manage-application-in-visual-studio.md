<properties
   pageTitle="Manage your applications in Visual Studio | Microsoft Azure"
   description="Use Visual Studio to create, develop, package, deploy, and debug your Service Fabric applications and services."
   services="service-fabric"
   documentationCenter=".net"
   authors="seanmck"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="02/02/2016"
   ms.author="seanmck"/>

# Use Visual Studio to simplify writing and managing your Service Fabric applications

You can manage your Azure Service Fabric applications and services through Visual Studio. Once you've [set up your development environment](service-fabric-get-started.md), you can use Visual Studio to create Service Fabric applications, add services, or package, register, and deploy applications in your local development cluster.

To manage an application, in Solution Explorer, right-click your application project.

![Manage your Service Fabric application by right-clicking the application project][manageservicefabric]

## Deploy your Service Fabric application

Deploying an application combines the following steps into one simple operation:

1. Creating the application package
2. Uploading the application package to the image store
3. Registering the application type
4. Removing any running application instances
5. Creating a new application instance

In Visual Studio, pressing **F5** will also deploy your application and attach the debugger to all application instances. You can use **Ctrl+F5** to deploy an application without debugging, or you can publish to a local or remote cluster by using the publish profile. For more information, refer to [Publish an application to a remote cluster by using Visual Studio](service-fabric-publish-app-remote-cluster.md).

### Application Debug Mode

While debugging the service locally, sometime you may want to keep the existing application and data. The Visual Studio Service Fabric Tools provide a property called **Application Debug Mode**, which controls whether the **F5** should uninstall the application or keep the application after a debug session ends.

#### To set the Application Debug Mode property

1. On the application project's shortcut menu, choose **Properties** (or press the **F4** key).
2. In the **Properties** window, set the **Application Debug Mode** property to either **Remove** or **Auto Upgrade**.

![Set Application Debug Mode Property][debugmodeproperty]

Setting this property value to **Auto Upgrade** will leave the application running on the local cluster. The next **F5** will treat the deployment as an upgrade by using unmonitored auto mode to quickly upgrade the application to a newer version with a date string appended. The upgrade process preserves any data that you entered in a previous debug session.

![Example of new application version with date1 appended][preservedate]

Data is preserved by leveraging the upgrade capability from the Service Fabric platform. For more information about upgrading an application, refer to [Service Fabric application upgrade](service-fabric-application-upgrade.md).

**Note:** This property doesn't exist prior to 1.1 version of Service Fabric Tools for Visual Studio. Prior to 1.1 version please use **Preserve Data On Start** property to achieve the same behavior.
## Add a service to your Service Fabric application

You can add new fabric services to your application to extend its functionality.  To ensure that the service is included in your application package, add the service through the **New Fabric Service...** menu item.

![Add a new fabric service to your application][newservice]

Select a Service Fabric project type to add to your application, and specify a name for the service.  See [Choosing a framework for your service](service-fabric-choose-framework.md) to help you decide which service type to use.

![Select a Fabric Service project type to add to your application][addserviceproject]

The new service will be added to your solution and existing application package. The service references and a default service instance will be added to the application manifest. The service will be created and started the next time you deploy the application.

![The new service will be added to your application manifest][newserviceapplicationmanifest]

## Package your Service Fabric application

To deploy the application and its services to a cluster, you need to create an application package.  The package organizes the application manifest, service manifest(s), and other necessary files in a specific layout.  Visual Studio sets up and manages the package in the application project's folder, in the 'pkg' directory.  Clicking **Package**  from the **Application** context menu creates or updates the application package.  You may want to do this if you deploy the application by using custom PowerShell scripts.

## Remove an application

You can deprovision an application type from your local cluster by using Service Fabric Explorer.  The cluster explorer is accessible from the cluster's HTTP gateway endpoint (typically 19080 or 19007), e.g. http://localhost:19080/Explorer.  This will revert the deployment steps described above:

1. Remove any running application instances
2. Unregister the application type

![Remove an application](./media/service-fabric-manage-application-in-visual-studio/removeapplication.png)

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

- [Service Fabric application model](service-fabric-application-model.md)
- [Service Fabric application deployment](service-fabric-deploy-remove-applications.md)
- [Managing application parameters for multiple environments](service-fabric-manage-multiple-environment-app-configuration.md)
- [Debugging your Service Fabric application](service-fabric-debugging-your-application.md)
- [Visualizing your cluster by using Service Fabric Explorer](service-fabric-visualizing-your-cluster.md)

<!--Image references-->
[addserviceproject]:./media/service-fabric-manage-application-in-visual-studio/addserviceproject.png
[manageservicefabric]: ./media/service-fabric-manage-application-in-visual-studio/manageservicefabric.png
[newservice]:./media/service-fabric-manage-application-in-visual-studio/newservice.png
[newserviceapplicationmanifest]:./media/service-fabric-manage-application-in-visual-studio/newserviceapplicationmanifest.png
[preservedata]:./media/service-fabric-manage-application-in-visual-studio/preservedata.png
[preservedate]:./media/service-fabric-manage-application-in-visual-studio/preservedate.png
[debugmodeproperty]:./media/service-fabric-manage-application-in-visual-studio/debugmodeproperty.png
