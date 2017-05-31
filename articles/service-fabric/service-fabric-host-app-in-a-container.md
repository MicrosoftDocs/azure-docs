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
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 05/10/2017
ms.author: mikhegn
---

# Deploy a .NET app in a container to Azure Service Fabric

This tutorial shows you how to deploy an existing ASP.NET application in a Windows container using Visual Studio 2017 update 3 preview. Then, how to deploy the container in to Azure using Visual Studio Team Services and host the container in a Service Fabric cluster.

## Prerequisites

1. Install [Docker CE for Windows](https://store.docker.com/editions/community/docker-ce-desktop-windows?tab=description) so that you can run containers on Windows 10.
2. Familiarize yourself with the [Windows 10 Containers quickstart][link-container-quickstart].
3. For this article, we use **Fabrikam Fiber**, a sample app you can download [here][link-fabrikam-github].
4. [Azure PowerShell][link-azure-powershell-install]
5. [Continuous Delivery Tools extension for Visual Studio 2017][link-visualstudio-cd-extension]

>[!NOTE]
>If this is the first time you are running Windows container images on your computer, Docker CE must pull down the base images for your containers. The images used in this tutorial are 14GB in size. Go ahead and run the following command in Powershell to pull the base images:
>
>```cmd
>docker pull microsoft/mssql-server-windows-developer
>docker pull microsoft/aspnet:4.6.2
>```

## Containerize the application

To start running our application in a container, we need to add **Docker Support** to the project in Visual Studio. When you add **Docker support** to the application, two things happen. First, a _docker_ file is added to the project. This new file describes how the container image is to be built. Then second, a new _docker-compose_ project is added to the solution. This new project contains a few docker-compose file, which can be used to describe how the container is run.

More info on working with [Visual Studio Container Tools][link-visualstudio-container-tools].

### Add Docker support

1. Open the **FabrikamFiber.CallCenter.sln** file in Visual Studio

2. Right-click the **FabrikamFiber.Web** project > **Add** > **Docker Support**.

### Add support for SQL

This application uses SQL as the data provider, so a SQL Server is required to run the application. We use SQL Server running in a container in this tutorial.
To tell Docker that we want to run a SQL Server in a container, we can reference a SQL Server container image in our docker-compose.override.yml file in the docker-compose project. That way the SQL Server running in the container is used when debugging the application in Visual Studio.

1. Open **Solution Explorer**.

2. Open **docker-compose** > **docker-compose.yml** > **docker-compose.override.yml**.

3. Under the `services:` node, add a new node named `db:`. This node declares to run a SQL Server in a container.

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

   >[!NOTE]
   >If you always want to run your SQL Server in a container, you can choose to add the preceding to the docker-compose.yml file instead of the docker-compose.override.yml file.


4. Modify the `fabrikamfiber.web` node, add a new child node named `depends_on:`. This ensures that the `db` service (the SQL Server container) starts before our web application (fabrikamfiber.web).

   ```yml
     fabrikamfiber.web:
       ports:
         - "80"
       depends_on:
         - db
   ```

5. In the **FabrikamFiber.Web** project, update the connection string in the **web.config** file, to point to the SQL Server in the container.

   ```xml
   <add name="FabrikamFiber-Express" connectionString="Data Source=db,1433;Database=FabrikamFiber;User Id=sa;Password=Password1;MultipleActiveResultSets=True" providerName="System.Data.SqlClient" />
   
   <add name="FabrikamFiber-DataWarehouse" connectionString="Data Source=db,1433;Database=FabrikamFiber;User Id=sa;Password=Password1;MultipleActiveResultSets=True" providerName="System.Data.SqlClient" />
   ```

   >[!NOTE]
   >If you want to use a different SQL Server when building a release build of your web application, add another connection string to your web.release.config file.

6. Press **F5** to run and debug the application in your container.

   Edge opens your application's defined launch page using the IP address of the container on the internal NAT network (typically 172.x.x.x). To learn more about debugging applications in containers using Visual Studio 2017, see [this article][link-debug-container].

   ![example of fabrikam in a container][image-web-preview]

The application is now ready to be build and packaged in a container. Once you have the container image built on your machine, you can push it to any container registry and pull it down to any host to run.

For the remainder of this tutorial, you are using Visual Studio Team Services to build and deploy the container, push it to an Azure Container Registry and deploy it to Service Fabric, running in Azure.

## Create a Service Fabric cluster

If you already have a Service Fabric cluster to deploy your application to, you can skip this step. Otherwise, let us go ahead and create a Service Fabric Cluster.

>[!NOTE]
>The following procedure creates a Service Fabric cluster, secured by a self-signed certificate, that is placed in a KeyVault, created as part of the deployment. For more information on using Azure Active Directory authentication, see the [Create a Service Fabric cluster by using Azure Resource Manager][link-servicefabric-create-secure-clusters] article.

1. Download a local copy of the Azure template and parameters files referenced in the following.
    * [Azure Resource Manager template for Service Fabric][link-sf-clustertemplate] - The Resource Manager template that defines a Service Fabric Cluster.
    * [Template parameters file][link-sf-clustertemplate-parameters] - A parameters file for you to customize the cluster deployment.
2. Customize the following parameters in the parameters file:
  
   | Parameter       | Description |
   | --------------- | ----------- |
   | clusterName     | Name of your cluster. |
   | adminUserName   | The local admin account on the cluster virtual machines. |
   | adminPassword   | Password of the local admin account on the cluster virtual machines. |
   | clusterLocation | The Azure region to deploy the cluster to. |
   | vmInstanceCount | The number of nodes in your cluster (can be 1) |

3. Open **PowerShell**.
4. **Log in** to Azure.

   ```powershell
   Login-AzureRmAccount
   ```

5. Select the **subscription** you want to deploy the cluster in.

   ```powershell
   Select-AzureRmSubscription -SubscriptionId <subscription-id>
   ```

6. Create and **encrypt a password** for the certificate used by Service Fabric.

   ```powershell
   $pwd = "<your password>" | ConvertTo-SecureString -AsPlainText -Force
   ```

7. **Create the cluster**, by running the following command:

   ```powershell
   New-AzureRmServiceFabricCluster 
       -TemplateFile C:\users\me\downloads\PreviewSecureClusters.json `
       -ParameterFile C:\users\me\downloads\myCluster.parameters.json `
       -CertificateOutputFolder C:\users\me\desktop\ `
       -CertificatePassword $pwd `
       -CertificateSubjectName "mycluster.westeurope.cloudapp.azure.com" `
       -ResourceGroupName myclusterRG
   ```

   >[!NOTE]
   >The `-CertificateSubjectName` parameter should align with the clusterName parameter, specified in the parameters file, and the domain tied to the Azure region you choose, such as: `clustername.eastus.cloudapp.azure.com`.
   
    Once the configuration finishes, it will output information about the cluster created in Azure, as well as copy the certificate to the -CertificateOutputFolder directory.

8. **Double-click** the certificate to install it on your local machine.

## Deploy with Visual Studio

To set up deployment using Visual Studio Team Services, you need to install the [Continuous Delivery Tools extension for Visual Studio 2017][link-visualstudio-cd-extension]. This extension makes it easy to deploy to Azure by configuring Visual Studio Team Services and get your app deployed to your Service Fabric cluster.

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

   >[!NOTE]
   >Depending on the types of containers you are building, we are adding more options for you to host your application in containers in Azure. 

4. Set **Target Host** to the service fabric cluster you created in the previous section.

5. Choose a **Container Registry** to publish your container to.

   >[!TIP]
   >Use the **Edit** button to create a container registry.
	
6. Press **OK**.

   ![setup service fabric continuous integration][image-setup-ci]
   
   Once the configuration is completed, your container will be deployed to Service Fabric whenever you push updates to the repository.

7. **Start a build** using **Team Explorer** and see your container application running in Service Fabric.

Now that you have containerized and deployed the Fabrikam Call Center solution, you can open the [Azure portal][link-azure-portal] and see the application running in Service Fabric. To try the application, open a web browser and go to the URL of your Service Fabric cluster.

## Next steps

- [Container Tooling in Visual Studio][link-visualstudio-container-tools]
- [Get started with containers in Service Fabric][link-servicefabric-containers]
- [Creating Service Fabric applications][link-servicefabric-createapp]

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
[link-sf-clustertemplate-parameters]: https://aka.ms/securepreviewonelineclusterparameters

[image-web-preview]: media/service-fabric-host-app-in-a-container/fabrikam-web-sample.png
[image-source-control]: media/service-fabric-host-app-in-a-container/add-to-source-control.png
[image-publish-repo]: media/service-fabric-host-app-in-a-container/publish-repo.png
[image-setup-ci]: media/service-fabric-host-app-in-a-container/configure-continuous-integration.png
