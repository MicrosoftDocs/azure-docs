---
title: Host a Service Fabric app in a container | Microsoft Docs
description: Teaches you how to package a .NET app in Visual Studio in a Docker Container. This new "container" app is then deployed to a Service Fabric cluster.
services: service-fabric
documentationcenter: .net
author: mikkelhegn
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 01/05/2017
ms.author: mikhegn
---

# Host a .NET application in a container on Service Fabric

This tutorial shows you how to host an existing ASP.NET application in a Windows container using Visual Studio 2017 update 3 preview. Then, how to deploy the container in to Azure using Visual Studio Team Services and host the container in a Service Fabric cluster.

## Prerequisites

1. Install [Docker CE for Windows](https://store.docker.com/editions/community/docker-ce-desktop-windows?tab=description) so that you can run containers on Windows 10.
2. Familiarize yourself with the [Windows 10 Containers quickstart][link-container-quickstart].
3. For this article, we use **Fabrikam Fiber**, a sample app you can download [here][link-fabrikam-github].
4. [Azure PowerShell][link-azure-powershell-install]
5. [Continuous Delivery Tools extension for Visual Studio 2017][link-visualstudio-cd-extension]

## Containerize the application

To start running our application in a container, we need to add **Docker Support** to the project in Visual Studio. When you add **Docker support** to the application, two things happen. First, a _docker_ file is added to the project. This new file describes how the container image is to be built. Then second, a new _docker-compose_ project is added to the solution. This new project contains a few docker-compose file, which can be used to describe how the container will be run.

More info on working with [Visual Studio Container Tools][link-visualstudio-container-tools].

### Add Docker support

1. Open the **FabrikamFiber.CallCenter.sln** file in Visual Studio

2. Right-click the **FabrikamFiber.Web** project > **Add** > **Docker Support**.

### Add support for SQL

This application uses SQL as the data provider, so a SQL Server is required to run the application. We will use SQL Server running in a container in this tutorial.
To tell Docker that we want to run a SQL Server in a container, we can reference a SQL Server container image in our docker-compose.override.yml file in the docker-compose project. That way the SQL Server running in the container will be used when debugging the application in Visual Studio.

1. Open **Solution Explorer**.

2. Open **docker-compose** > **docker-compose.yml** > **docker-compose.override.yml**.

3. Under the `services:` node, add a new node named `db:`. This will describe the SQL Server to startup in a container.

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

   >[!NOTE] You can use any SQL Server you prefer for local debugging, as long as it is reachable from your host. However, **localdb** does not support `container -> host` communication.

   >[!NOTE] If you always want to always run your SQL Server in a container, you can choose to add the above to the docker-compose.yml file instead of the docker-compose.override.yml file.


4. Modify the `fabrikamfiber.web` node, add a new child node named `depends_on:`. This will esure that the `db` service (the SQL Server container) will start before our web application (fabrikamfiber.web).

   ```yml
     fabrikamfiber.web:
       ports:
         - "80"
       depends_on:
         - db
   ```

5. In the **FabrikamFiber.Web** project, update the connection string in the **web.config** file, to point to the SQL Server in the container.

   ```xml
   <add name="FabrikamFiber-Express" connectionString="Data Source=db,1433;Database=MusicStore;User Id=sa;Password=Password1;MultipleActiveResultSets=True" providerName="System.Data.SqlClient" />
   
   <add name="FabrikamFiber-DataWarehouse" connectionString="Data Source=db,1433;Database=MusicStore;User Id=sa;Password=Password1;MultipleActiveResultSets=True" providerName="System.Data.SqlClient" />
   ```

   >[!NOTE] If you want to reference a different SQL Server when building a release build of you web application, add another connection string to your web.release.config file. This will ensure that Visual Studio uses web config transform to genereate the right web.donfig file for each build configuration.

6. Press **F5** to run and debug the application in your container.

   >[!NOTE] If this is the first time you have run a Windows container on your machine, Docker CE must pull down the base images for your containers first. The image is approximately 14GB.

   Edge opens your application's defined launch page using the IP address of the container on the internal NAT network (typically 172.x.x.x). To learn more about debugging applications in containers using Visual Studio 2017, see [this article][link-debug-container].

   ![example of fabrikam in a container][image-web-preview]

The application is now ready to be build and packaged in a container. Once you have the container image built on your machine, you can push it to any container registry and pull it down to any host to run.

For the remainder of this tutorial, you will be using Visual Studio Team Services to build and deploy the container, push it to an Azure Container Registry and deploy it to Service Fabric, running in Azure.

## Create a Service Fabric cluster

If you already have a Service Fabric cluster to deploy your application to, you can skip this step. Otherwise, let us go ahead and create a Service Fabric Cluster.

>[!NOTE] The following procedure will create a Service Fabric cluster, secured by a self-signed certificate, that will be paces in a KeyVault, created as part of the deployment. If you want to bring your own certificate or use Azure Active Directory authentication, see the [Create a Service Fabric cluster by using Azure Resource Manager][link-servicefabric-create-secure-clusters] article for more information.

1. Download a local copy of the Azure template and parameters files referenced below.
    * [Azure Resource Manager template for Service Fabric](http://aka.ms/securepreviewonelineclustertemplate) - The resource manager template that defines a Service Fabric Cluster.
    * [Template parameters file](http://aka.ms/securepreviewonelineclusterparameters) - A parameters file for you to customize the cluster deployment.
2. Customize the following parameters in the parameters file:
  
   | Parameter       | Description |
   | --------------- | ----------- |
   | clusterName     | Name of your cluster. |
   | adminUserName   | The local admin account on the cluster virtual machines. |
   | adminPassword   | Password of the local admin account on the cluster virtual machines. |
   | clusterLocation | The Azure region to deploy the cluster to. |

3. Open PowerShell.
4. Log in to Azure.

   ```powershell
   Login-AzureRmAccount
   ```

5. Select the subscription you want to deploy the cluster in.

   ```powershell
   Select-AzureRmSubscription -SubscriptionId <subscription-id>
   ```

6. Create and encrypt a password for the certificate used by Service Fabric.

   ```powershell
   $pwd = "<your password>" | ConvertTo-SecureString -AsPlainText -Force
   ```

7. Create the cluster, by running the following command:

   ```powershell
   New-AzureRmServiceFabricCluster 
       -TemplateFile C:\users\me\downloads\PreviewSecureClusters.json `
       -ParameterFile C:\users\me\downloads\myCluster.parameters.json `
       -CertificateOutputFolder C:\users\me\desktop\ `
       -CertificatePassword $pwd `
       -CertificateSubjectName "mycluster.westeurope.cloudapp.azure.com" `
       -ResourceGroupName myclusterRG
   ```

   >[!NOTE] The `-CertificateSubjectName` parameter should align with the clusterName parameter, specified in the parameters file, and the domain tied to the Azure region you choose, such as: `clustername.eastus.cloudapp.azure.com`.
   
    Once the configuration finished, it will output information about the cluster created in Azure, as well as copy the certificate to the -CertificateOutputFolder directory.

  8. Double-click on the certificate to install in on your local machine.

## Deploy with Visual Studio

To setup deployment using Visual Studio Team Services, you will need the [Continuous Delivery Tools extension for Visual Studio 2017][link-visualstudio-cd-extension]. This extension makes it easy to deploy to Azure by configuring a Visual Studio Team Services and get your app deployed to your Service Fabric cluster.

To get started, your code must be hosted in source control. The rest of this section assumes **git** is being used.

1. At the bottom-right corner of Visual Studio, click **Add to Source Control** > **Git** (or whichever option you prefer).

   ![press the source control button][image-source-control]

2. In the _Team Explorer_ pane, press **Publish Git Repo**.

3. Select your VSTS repository name and press **Repository**.

   ![publish repo to VSTS][image-publish-repo]

Now that your code is synchronized with a VSTS source repository, you can configure continuous integration and continuous delivery.

1. In _Solution Explorer_, right-click the **solution** > **Configure Continuous Delivery**.

2. Select the Azure Subscription.

3. Set **Host Type** to **Service Fabric Cluster**.

   >[!NOTE] Depending on the types of containers you are building, we will be adding more options for you to host your application in containers in Azure. 

4. Set **Target Host** to the service fabric cluster you created in the previous section.

5. Choose a **Container Registry** to publish your container to.

   >[!TIP] Use the **Edit** button to create a new container registry.
	
6. Press OK.

   ![setup service fabric continuous integration][image-setup-ci]

Once the continuous delivery is completed, you can deploy your Service Fabric container whenever you pushes updates to the repository.

7. Go ahead and start a build using Team Explorer and see your container application running in Service Fabric.


## Next steps

- Link to container tooling in Visual Studio
- Link to Visual Studio Team Services and building / release containers
- Link to running containers in Service Fabric
- Link to building Service Fabric applications

[link-debug-container]: ~/dotnet/articles/core/docker/visual-studio-tools-for-docker
[link-fabrikam-github]: http://github/blah
[link-container-quickstart]: ~/virtualization/windowscontainers/quick-start/quick-start-windows-10
[link-visualstudio-container-tools]: ~/dotnet/articles/core/docker/visual-studio-tools-for-docker
[link-azure-powershell-install]: ~/powershell/azure/install-azurerm-ps
[link-servicefabric-create-secure-clusters]: ~/azure/service-fabric/service-fabric-cluster-creation-via-arm
[link-visualstudio-cd-extension]: http://aka.ms/cd4v

[image-web-preview]: media/service-fabric-host-app-in-a-container/fabrikam-web-sample.png
[image-source-control]: media/service-fabric-host-app-in-a-container/add-to-source-control.png
[image-publish-repo]: media/service-fabric-host-app-in-a-container/publish-repo.png
[image-setup-ci]: media/service-fabric-host-app-in-a-container/configure-continuous-integration.png