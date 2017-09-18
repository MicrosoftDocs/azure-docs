---
title: Deploy a .NET app in a container to Azure Service Fabric | Microsoft Docs
description: Teaches you how to package a .NET app in Visual Studio in a Docker Container. This new "container" app is then deployed to a Service Fabric cluster.
services: service-fabric
documentationcenter: .net
author: mikkelhegn
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 07/19/2017
ms.author: mikhegn
---

# Deploy a .NET application in a Windows container to Azure Service Fabric

This tutorial shows you how to deploy an existing ASP.NET application in a Windows container on Azure.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Docker project in Visual Studio
> * Containerize an existing application
> * Setup continuous integration with Visual Studio and VSTS

## Prerequisites

1. Install [Docker CE for Windows](https://store.docker.com/editions/community/docker-ce-desktop-windows?tab=description) so that you can run containers on Windows 10.
2. Familiarize yourself with the [Windows 10 Containers quickstart][link-container-quickstart].
3. Download the [Fabrikam Fiber CallCenter][link-fabrikam-github] sample application.
4. Install [Azure PowerShell][link-azure-powershell-install]
5. Install the [Continuous Delivery Tools extension for Visual Studio 2017][link-visualstudio-cd-extension]
6. Create an [Azure subscription][link-azure-subscription] and a [Visual Studio Team Services account][link-vsts-account]. 
7. [Create a cluster on Azure](service-fabric-tutorial-create-cluster-azure-ps.md)

## Containerize the application

Now that you have a [Service Fabric cluster is running in Azure](service-fabric-tutorial-create-cluster-azure-ps.md) you are ready to create and deploy a containerized application. To start running our application in a container, we need to add **Docker Support** to the project in Visual Studio. When you add **Docker support** to the application, two things happen. First, a _Dockerfile_ is added to the project. This new file describes how the container image is to be built. Then second, a new _docker-compose_ project is added to the solution. The new project contains a few docker-compose files. Docker-compose files can be used to describe how the container is run.

More info on working with [Visual Studio Container Tools][link-visualstudio-container-tools].

>[!NOTE]
>If it is the first time you are running Windows container images on your computer, Docker CE must pull down the base images for your containers. The images used in this tutorial are 14 GB. Go ahead and run the following terminal command to pull the base images:
>```cmd
>docker pull microsoft/mssql-server-windows-developer
>docker pull microsoft/aspnet:4.6.2
>```

### Add Docker support

Open the [FabrikamFiber.CallCenter.sln][link-fabrikam-github] file in Visual Studio.

Right-click the **FabrikamFiber.Web** project > **Add** > **Docker Support**.

### Add support for SQL

This application uses SQL as the data provider, so a SQL server is required to run the application. Reference a SQL Server container image in our docker-compose.override.yml file.

In Visual Studio, open **Solution Explorer**, find **docker-compose**, and open the file **docker-compose.override.yml**.

Navigate to the `services:` node, add a node named `db:` that defines the SQL Server entry for the container.

```yml
  db:
    image: microsoft/mssql-server-windows-developer
    environment:
      sa_password: "Password1"
      ACCEPT_EULA: "Y"
    ports:
      - "1433"
    healthcheck:
      test: [ "CMD", "sqlcmd", "-U", "sa", "-P", "Password1", "-Q", "select 1" ]
      interval: 1s
      retries: 20
```

>[!NOTE]
>You can use any SQL Server you prefer for local debugging, as long as it is reachable from your host. However, **localdb** does not support `container -> host` communication.

>[!WARNING]
>Running SQL Server in a container does not support persisting data. When the container stops, your data is erased. Do not use this configuration for production.

Navigate to the `fabrikamfiber.web:` node and add a child node named `depends_on:`. This ensures that the `db` service (the SQL Server container) starts before our web application (fabrikamfiber.web).

```yml
  fabrikamfiber.web:
    depends_on:
      - db
```

### Update the web config

Back in the **FabrikamFiber.Web** project, update the connection string in the **web.config** file, to point to the SQL Server in the container.

```xml
<add name="FabrikamFiber-Express" connectionString="Data Source=db,1433;Database=FabrikamFiber;User Id=sa;Password=Password1;MultipleActiveResultSets=True" providerName="System.Data.SqlClient" />

<add name="FabrikamFiber-DataWarehouse" connectionString="Data Source=db,1433;Database=FabrikamFiber;User Id=sa;Password=Password1;MultipleActiveResultSets=True" providerName="System.Data.SqlClient" />
```

>[!NOTE]
>If you want to use a different SQL Server when building a release build of your web application, add another connection string to your web.release.config file.

### Test your container

Press **F5** to run and debug the application in your container.

Edge opens your application's defined launch page using the IP address of the container on the internal NAT network (typically 172.x.x.x). To learn more about debugging applications in containers using Visual Studio 2017, see [this article][link-debug-container].

![example of fabrikam in a container][image-web-preview]

The container is now ready to be built and packaged in a Service Fabric application. Once you have the container image built on your machine, you can push it to any container registry and pull it down to any host to run.

## Get the application ready for the cloud

To get the application ready for running in Service Fabric in Azure, we need to complete two steps:

1. Expose the port where we want to be able to reach our web application in the Service Fabric cluster.
2. Provide a production ready SQL database for our application.

### Expose the port for the app
The Service Fabric cluster we have configured, has port *80* open by default in the Azure Load Balancer, that balances incoming traffic to the cluster. We can expose our container on this port via our docker-compose.yml file.

In Visual Studio, open **Solution Explorer**, find **docker-compose**, and open the file **docker-compose.override.yml**.

Modify the `fabrikamfiber.web:` node, add a child node named `ports:`.

Add a string entry `- "80:80"`.

```yml
  version: '3'

  services:
    fabrikamfiber.web:
      image: fabrikamfiber.web
      build:
        context: .\FabrikamFiber.Web
        dockerfile: Dockerfile
      ports:
        - "80:80"
```

### Use a production SQL database
When running in production, we need our data persisted in our database. There is currently no way to guarantee persistent data in a container, therefore you cannot store production data in SQL Server in a container.

We recommend you utilize an Azure SQL Database. To set up and run a managed SQL Server in Azure, visit the [Azure SQL Database Quickstarts][link-azure-sql] article.

>[!NOTE]
>Remember to change the connection strings to the SQL server in the **web.release.config** file in the **FabrikamFiber.Web** project.
>
>This application fails gracefully if no SQL database is reachable. You can choose to go ahead and deploy the application with no SQL server.

## Deploy with Visual Studio Team Services

To set up deployment using Visual Studio Team Services, you need to install the [Continuous Delivery Tools extension for Visual Studio 2017][link-visualstudio-cd-extension]. This extension makes it easy to deploy to Azure by configuring Visual Studio Team Services and get your app deployed to your Service Fabric cluster.

To get started, your code must be hosted in source control. The rest of this section assumes **git** is being used.

### Set up a VSTS repo
At the bottom-right corner of Visual Studio, click **Add to Source Control** > **Git** (or whichever option you prefer).

![press the source control button][image-source-control]

In the _Team Explorer_ pane, press **Publish Git Repo**.

Select your VSTS repository name and press **Repository**.

![publish repo to VSTS][image-publish-repo]

Now that your code is synchronized with a VSTS source repository, you can configure continuous integration and continuous delivery.

### Setup continuous delivery

In _Solution Explorer_, right-click the **solution** > **Configure Continuous Delivery**.

Select the Azure Subscription.

Set **Host Type** to **Service Fabric Cluster**.

Set **Target Host** to the service fabric cluster you created in the previous section.

Choose a **Container Registry** to publish your container to.

>[!TIP]
>Use the **Edit** button to create a container registry.

Press **OK**.

![setup service fabric continuous integration][image-setup-ci]
   
   Once the configuration is completed, your container is deployed to Service Fabric. Whenever you push updates to the repository a new build and release is executed.
   
   >[!NOTE]
   >Building the container images take approximately 15 minutes.
   >The first deployment to the Service Fabric cluster causes the base Windows Server Core container images to be downloaded. The download takes additional 5-10 minutes to complete.

Browse to the Fabrikam Call Center application using the url of your cluster: for example, *http://mycluster.westeurope.cloudapp.azure.com*

Now that you have containerized and deployed the Fabrikam Call Center solution, you can open the [Azure portal][link-azure-portal] and see the application running in Service Fabric. To try the application, open a web browser and go to the URL of your Service Fabric cluster.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a Docker project in Visual Studio
> * Containerize an existing application
> * Setup continuous integration with Visual Studio and VSTS

<!--   NOTE SURE WHAT WE SHOULD DO YET HERE

Advance to the next tutorial to learn how to bind a custom SSL certificate to it.

> [!div class="nextstepaction"]
> [Bind an existing custom SSL certificate to Azure Web Apps](app-service-web-tutorial-custom-ssl.md)

## Next steps

- [Container Tooling in Visual Studio][link-visualstudio-container-tools]
- [Get started with containers in Service Fabric][link-servicefabric-containers]
- [Creating Service Fabric applications][link-servicefabric-createapp]
-->

[link-debug-container]: /dotnet/articles/core/docker/visual-studio-tools-for-docker
[link-fabrikam-github]: https://aka.ms/fabrikamcontainer
[link-container-quickstart]: /virtualization/windowscontainers/quick-start/quick-start-windows-10
[link-visualstudio-container-tools]: /dotnet/articles/core/docker/visual-studio-tools-for-docker
[link-azure-powershell-install]: /powershell/azure/install-azurerm-ps
[link-servicefabric-create-secure-clusters]: service-fabric-cluster-creation-via-arm.md
[link-visualstudio-cd-extension]: https://aka.ms/cd4vs
[link-servicefabric-containers]: service-fabric-get-started-containers.md
[link-servicefabric-createapp]: service-fabric-create-your-first-application-in-visual-studio.md
[link-azure-portal]: https://portal.azure.com
[link-sf-clustertemplate]: https://aka.ms/securepreviewonelineclustertemplate
[link-azure-pricing-calculator]: https://azure.microsoft.com/en-us/pricing/calculator/
[link-azure-subscription]: https://azure.microsoft.com/en-us/free/
[link-vsts-account]: https://www.visualstudio.com/team-services/pricing/
[link-azure-sql]: /azure/sql-database/

[image-web-preview]: media/service-fabric-host-app-in-a-container/fabrikam-web-sample.png
[image-source-control]: media/service-fabric-host-app-in-a-container/add-to-source-control.png
[image-publish-repo]: media/service-fabric-host-app-in-a-container/publish-repo.png
[image-setup-ci]: media/service-fabric-host-app-in-a-container/configure-continuous-integration.png
