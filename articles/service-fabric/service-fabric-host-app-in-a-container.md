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
ms.date: 05/19/2017
ms.author: mikhegn
---

# Deploy a .NET app in a container to Azure Service Fabric

This tutorial shows you how to deploy an existing ASP.NET application in a Windows container using Visual Studio 2017 update 3 preview. Then, how to deploy the container in to Azure using Visual Studio Team Services and host the container in a Service Fabric cluster.

## Prerequisites

1. Install [Docker CE for Windows](https://store.docker.com/editions/community/docker-ce-desktop-windows?tab=description) so that you can run containers on Windows 10.
2. Familiarize yourself with the [Windows 10 Containers quickstart][link-container-quickstart].
3. For this tutorial, we use **Fabrikam Fiber CallCenter**, a sample app you can download [here][link-fabrikam-github].
4. [Azure PowerShell][link-azure-powershell-install]
5. [Continuous Delivery Tools extension for Visual Studio 2017][link-visualstudio-cd-extension]
6. An [Azure subscription][link-azure-subscription] and a [Visual Studio Team Services account][link-vsts-account]. You can go through this tutorial using free tiers of all services.

>[!NOTE]
>If it is the first time you are running Windows container images on your computer, Docker CE must pull down the base images for your containers. The images used in this tutorial are 14 GB. Go ahead and run the following command in Powershell to pull the base images:
>1. docker pull microsoft/mssql-server-windows-developer
>2. docker pull microsoft/aspnet:4.6.2

## Containerize the application

To start running our application in a container, we need to add **Docker Support** to the project in Visual Studio. When you add **Docker support** to the application, two things happen. First, a _docker_ file is added to the project. This new file describes how the container image is to be built. Then second, a new _docker-compose_ project is added to the solution. The new project contains a few docker-compose files. Docker-compose files can be used to describe how the container is run.

More info on working with [Visual Studio Container Tools][link-visualstudio-container-tools].

### Add Docker support

1. Open the **FabrikamFiber.CallCenter.sln** file in Visual Studio

2. Right-click the **FabrikamFiber.Web** project > **Add** > **Docker Support**.

### Add support for SQL

This application uses SQL as the data provider, so a SQL Server is required to run the application. In this tutorial, we use SQL Server running in a container for local debugging.
To run a SQL Server in a container, when debugging, we can reference a SQL Server container image in our docker-compose.override.yml file. 

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

   >[!WARNING]
   >Running SQL Server in a container does not support persisting data, when the container stops. Do not use this configuration for production.

4. Modify the `fabrikamfiber.web` node, add a new child node named `depends_on:`. This ensures that the `db` service (the SQL Server container) starts before our web application (fabrikamfiber.web).

   ```yml
     fabrikamfiber.web:
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

For the remainder of this tutorial, you are using Visual Studio Team Services to deploy the container to Service Fabric, running in Azure.

## Create a Service Fabric cluster

If you already have a Service Fabric cluster to deploy your application to, you can skip this step. Otherwise, let us go ahead and create a Service Fabric Cluster.

>[!NOTE]
>The following procedure creates a Single node (single Virtual Machine) Preview Service Fabric cluster, secured by a self-signed certificate, that is placed in KeyVault.
>Single node clusters cannot be scaled beyond one virtual machine and preview clusters cannot be upgraded to newer versions.
>To calculate cost incurred by running a Service Fabric cluster in Azure use the [Azure Pricing Calculator][link-azure-pricing-calculator].
>For more information on creating Service Fabric clusters, see the [Create a Service Fabric cluster by using Azure Resource Manager][link-servicefabric-create-secure-clusters] article.

1. Download a local copy of the Azure Resource Manager template and the parameter file from this GitHub repository:
    * [Azure Resource Manager template for Service Fabric][link-sf-clustertemplate]
       - **azuredeploy.json** - The Azure Resource Manager template that defines a Service Fabric Cluster.
       - **azuredeploy.parameters.json** - A parameters file for you to customize the cluster deployment.
2. Customize the following parameters in the parameters file:
  
   | Parameter       | Description | Suggested Value |
   | --------------- | ----------- | --------------- |
   | clusterLocation | The Azure region to deploy the cluster to. | *for example, westeurope, eastasia, eastus* |
   | clusterName     | Name of your cluster. | *for example, bobs-sfpreviewcluster* |
   | adminUserName   | The local admin account on the cluster virtual machines. | *Any valid Windows Server username* |
   | adminPassword   | Password of the local admin account on the cluster virtual machines. | *Any valid Windows Server password* |
   | clusterCodeVersion | The Service Fabric version to run. (255.255.X.255 are preview versions). | **255.255.5713.255** |
   | vmInstanceCount | The number of virtual machines in your cluster (can be 1 or 3-99). | **1** |

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
          -TemplateFile C:\Users\me\Desktop\azuredeploy.json `
          -ParameterFile C:\Users\me\Desktop\azuredeploy.parameters.json `
          -CertificateOutputFolder C:\Users\me\Desktop\ `
          -CertificatePassword $pwd `
          -CertificateSubjectName "mycluster.westeurope.cloudapp.azure.com" `
          -ResourceGroupName myclusterRG
   ```

   >[!NOTE]
   >The `-CertificateSubjectName` parameter should align with the clusterName parameter, specified in the parameters file, and the domain tied to the Azure region you choose, such as: `clustername.eastus.cloudapp.azure.com`.
   
    Once the configuration finishes, it will output information about the cluster created in Azure, as well as copy the certificate to the -CertificateOutputFolder directory.

8. **Double-click** the certificate to open the Certificate Import Wizard.

9. Use default settings, but make sure to check the **Mark this key as exportable.** check box, in the **private key protection** step. Visual Studio needs to export the certificate when configuring Azure Container Registry to Service Fabric Cluster authentication later in this tutorial.

10. You can now open Service Fabric Explorer in a browser. The URL is the **ManagementEndpoint** in the output from the PowerShell CmdLet, for example, *https://mycluster.westeurope.cloudapp.azure.com:19080* 

>[!NOTE]
>When opening Service Fabric Explorer, you see a certificate error, as you are using a self-signed certificate. In Edge, you have to click *Details* and then the *Go on to the webpage* link. In Chrome, you have to click *Advanced* and then the *proceed* link.

>[!NOTE]
>If the cluster creation fails, you can always rerun the command, which updates the resources already deployed. If a certificate was created as part of the failed deployment, a new one is generated. To troubleshoot cluster creation, visit the: [Create a Service Fabric cluster by using Azure Resource Manager][link-servicefabric-create-secure-clusters] article.

## Getting the Application Ready for the Cloud

To get the application ready for running in Service Fabric in Azure, we need to complete two steps:

1. Expose the port where we want to be able to reach our web application in the Service Fabric cluster
2. Provide a production ready SQL database for our application

### 1. Exposing the web application in Service Fabric
The Service Fabric cluster we have configured, has port 80 open by default in the Azure Load Balancer, that balances incoming traffic to the cluster. We can expose our container on this port via our docker-compose.yml file.

1. Open **Solution Explorer**.

2. Open **docker-compose** > **docker-compose.yml**.

3. Modify the `fabrikamfiber.web` node, add a new child node named `ports:` and the string `- "80:80"`. The complete docker-compose.yml file should look like this:

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

### 2. Provide a production ready SQL database for our application
When we containerized this application and enabled local debugging, we set it up to run SQL Server in a container. This approach is a good solution when debugging your application locally, since we don’t require the data in the database to be persisted. When running in production however, we need our data to persisted in our database. There is currently no way of guaranteeing persisting data in a container, therefore you cannot store production data in SQL Server in a container.

As a result, if your service requires a persistent SQL Database, we recommend you utilize an Azure SQL Database. To set up and run a managed SQL Server in Azure, visit [Azure SQL Database Quickstarts][[link-azure-sql]] article.

>[!NOTE]
>Remember to change the connection strings to the SQL server in the web.release.config file in the FabrikamFiber.Web project.
>This application fails gracefully if no SQL database is reachable. You can choose to go ahead and deploy the application with no SQL server.

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
   
   Once the configuration is completed, your container is deployed to Service Fabric. Whenever you push updates to the repository a new build and release is executed.
   
   >[!NOTE]
   >Building the container images take approx. 15 minutes.
   >The first deployment to the Service Fabric cluster causes the base Windows Server Core container images to be downloaded. The download takes additional 5-10 minutes to complete.

7. Browse to the Fabrikam Call Center application using the url of your cluster: for example, *http://mycluster.westeurope.cloudapp.azure.com*

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
[link-azure-pricing-calculator]: https://azure.microsoft.com/en-us/pricing/calculator/
[link-azure-subscription]: https://azure.microsoft.com/en-us/free/
[link-vsts-account]: https://www.visualstudio.com/team-services/pricing/
[link-azure-sql]: /sql-database

[image-web-preview]: media/service-fabric-host-app-in-a-container/fabrikam-web-sample.png
[image-source-control]: media/service-fabric-host-app-in-a-container/add-to-source-control.png
[image-publish-repo]: media/service-fabric-host-app-in-a-container/publish-repo.png
[image-setup-ci]: media/service-fabric-host-app-in-a-container/configure-continuous-integration.png