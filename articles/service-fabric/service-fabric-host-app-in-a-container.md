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
ms.date: 05/01/2018
ms.author: ryanwi,mikhegn
---

# Deploy a .NET application in a Windows container to Azure Service Fabric

This tutorial shows you how to deploy an existing ASP.NET application in a Windows container on Azure.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Docker project in Visual Studio
> * Containerize an existing application
> * Setup continuous integration with Visual Studio and VSTS

## Prerequisites

1. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
2. Install [Docker CE for Windows](https://store.docker.com/editions/community/docker-ce-desktop-windows?tab=description) so that you can run containers on Windows 10.
3. Install [Service Fabric runtime version 6.2 or later](service-fabric-get-started.md) and the [Service Fabric SDK version 3.1](service-fabric-get-started.md) or later.
4. Install [Visual Studio 2017 version 15.7](https://www.visualstudio.com/) or later with the **Azure development** and **ASP.NET and web development** workloads.
5. Install [Azure PowerShell][link-azure-powershell-install]
6. Create a [Visual Studio Team Services account][link-vsts-account]. 

## Download and run Fabrikam Fiber CallCenter
Download the [Fabrikam Fiber CallCenter][link-fabrikam-github] sample application.  Click the **download archive** link.  From the *sourceCode* directory in the *fabrikam.zip* file, extract the *sourceCode.zip* file and then extract the *VS2015* directory to your computer.

Verify that the Fabrikam Fiber CallCenter application builds and runs without error.  Launch Visual Studio as an **administrator** and open the [FabrikamFiber.CallCenter.sln][link-fabrikam-github] file.  Press F5 to debug and run the application.

![Fabrikam web sample][fabrikam-web-page]

## Containerize the application
Right-click the **FabrikamFiber.Web** project > **Add** > **Container Orchestrator Support**.  Select **Service Fabric** as the container orchestrator and click **OK**.

A new project Service Fabric application project **FabrikamFiber.CallCenterApplication** is created in the solution.  A Dockerfile is added to the existing **FabrikamFiber.Web** project.  A **PackageRoot** directory is also added to the **FabrikamFiber.Web** project, which contains the service manifest and settings for the new FabrikamFiber.Web service. 

The container is now ready to be built and packaged in a Service Fabric application. Once you have the container image built on your machine, you can push it to any container registry and pull it down to any host to run.

## Create a cluster on Azure
Service Fabric applications run on a cluster, a network-connected set of virtual or physical machines. [Setup a Service Fabric cluster running in Azure](service-fabric-tutorial-create-vnet-and-windows-cluster.md) before you create and deploy your application. When creating the cluster, choose a SKU that supports running containers (such as Windows Server 2016 Datacenter with Containers).

## Create a Azure SQL DB
When running in production, we need our data persisted in our database. There is currently no way to guarantee persistent data in a container, therefore you cannot store production data in SQL Server in a container.

We recommend you utilize an [Azure SQL Database](/azure/sql-database/sql-database-get-started-powershell). To set up and run a managed SQL Server DB in Azure, run the following script.

```powershell
$subscriptionID="<subscription ID>"

# sign in to your Azure account and select your subscription
Login-AzureRmAccount -SubscriptionId $subscriptionID 

# The data center and resource name for your resources
$dbresourcegroupname = "fabrikam-fiber-db-group"
$location = "southcentralus"
# The logical server name: Use a random value or replace with your own value (do not capitalize)
$servername = "fab-fiber-$(Get-Random)"
# Set an admin login and password for your database
# The login information for the server
$adminlogin = "ServerAdmin"
$password = "Password@123"
# The ip address range that you want to allow to access your server - change as appropriate
$startip = "24.18.117.76"
$endip = "24.18.117.76"
# The database name
$databasename = "call-center-db"

# Create a new resource group for your deployment and give it a name and a location.
New-AzureRmResourceGroup -Name $dbresourcegroupname -Location $location

New-AzureRmSqlServer -ResourceGroupName $dbresourcegroupname `
    -ServerName $servername `
    -Location $location `
    -SqlAdministratorCredentials $(New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $adminlogin, $(ConvertTo-SecureString -String $password -AsPlainText -Force))

New-AzureRmSqlServerFirewallRule -ResourceGroupName $dbresourcegroupname `
    -ServerName $servername `
    -FirewallRuleName "AllowClient" -StartIpAddress $startip -EndIpAddress $endip


New-AzureRmSqlDatabase  -ResourceGroupName $dbresourcegroupname `
    -ServerName $servername `
    -DatabaseName $databasename `
    -RequestedServiceObjectiveName "S0"

# Create a virtual network service endpoint
$clusterresourcegroup = "fabrikamfiber.callcenterapplication_RG"
$resource = Get-AzureRmResource -ResourceGroupName $clusterresourcegroup -ResourceType Microsoft.Network/virtualNetworks | Select-Object -first 1
$vnetName = $resource.Name

Write-Host 'Virtual network name: ' $vnetName 

# Get the virtual network by name.
$vnet = Get-AzureRmVirtualNetwork `
  -ResourceGroupName $clusterresourcegroup `
  -Name              $vnetName

Write-Host "Get the subnet in the virtual network:"

$subnetName = $subnet.Name
$subnetID = $subnet.Id
$addressPrefix = $subnet.AddressPrefix

# Get the subnet, assume the first subnet contains the Service Fabric cluster.
$subnet = Get-AzureRmVirtualNetworkSubnetConfig -VirtualNetwork $vnet | Select-Object -first 1
Write-Host "Subnet name: " $subnetName " Address prefix: " $addressPrefix " ID: " $subnetID

# Assign a Virtual Service endpoint 'Microsoft.Sql' to the subnet.
$vnet = Set-AzureRmVirtualNetworkSubnetConfig `
  -Name            $subnetName `
  -AddressPrefix   $addressPrefix `
  -VirtualNetwork  $vnet `
  -ServiceEndpoint Microsoft.Sql | Set-AzureRmVirtualNetwork

$vnet.Subnets[0].ServiceEndpoints;  # Display the first endpoint.

# Add a SQL DB firewall rule for the virtual network Service endpoint
$subnet = Get-AzureRmVirtualNetworkSubnetConfig `
  -Name           $subnetName `
  -VirtualNetwork $vnet;

$VNetRuleName="ServiceFabricClusterVNetRule"
$vnetRuleObject1 = New-AzureRmSqlServerVirtualNetworkRule `
  -ResourceGroupName      $dbresourcegroupname `
  -ServerName             $servername `
  -VirtualNetworkRuleName $VNetRuleName `
  -VirtualNetworkSubnetId $subnetID;
```
>[!NOTE]
>Remember to change the connection strings to the SQL server in the **web.release.config** file in the **FabrikamFiber.Web** project.
>
>This application fails gracefully if no SQL database is reachable. You can choose to go ahead and deploy the application with no SQL server.

## Update the web config
Back in the **FabrikamFiber.Web** project, update the connection string in the **web.config** file, to point to the SQL Server in the container.  Update the *Server* part of the connection string for the server created by the previous script. 

```xml
<add name="FabrikamFiber-Express" connectionString="Server=tcp:fab-fiber-1300282665.database.windows.net,1433;Initial Catalog=call-center-db;Persist Security Info=False;User ID=ServerAdmin;Password=Password@123;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;" providerName="System.Data.SqlClient" />
<add name="FabrikamFiber-DataWarehouse" connectionString="Server=tcp:fab-fiber-1300282665.database.windows.net,1433;Initial Catalog=call-center-db;Persist Security Info=False;User ID=ServerAdmin;Password=Password@123;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;" providerName="System.Data.SqlClient" />
  
```
>[!NOTE]
>You can use any SQL Server you prefer for local debugging, as long as it is reachable from your host. However, **localdb** does not support `container -> host` communication. If you want to use a different SQL Server when building a release build of your web application, add another connection string to your web.release.config file.

## Run the containerized application locally
Press **F5** to run and debug the application in your container.

## Create a container registry
Container images need to be stored in a container registry.  Create an [Azure container registry](/azure/container-registry/container-registry-intro) using the following script.  Before deploying the application to Azure, you push the container image to this registry.

```powershell
# Variables
$acrresourcegroupname = "fabrikam-acr-group"
$location = "southcentralus"
$registryname="fabrikamregistry"

New-AzureRmResourceGroup -Name $acrresourcegroupname -Location $location

$registry = New-AzureRMContainerRegistry -ResourceGroupName $acrresourcegroupname -Name $registryname -EnableAdminUser -Sku Basic
```


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

## Clean up resources
If you're done, be sure to remove all the resources you created.  The simplest way to is to remove the resources groups that contain the Service Fabric cluster, Azure SQL DB, and Azure Container Registry.

```powershell
$dbresourcegroupname = "fabrikam-fiber-db-group"
$acrresourcegroupname = "fabrikam-acr-group"
$clusterresourcegroupname="fabrikamcallcentergroup"

Remove-AzureRmResourceGroup -Name $dbresourcegroupname
Remove-AzureRmResourceGroup -Name $acrresourcegroupname
Remove-AzureRmResourceGroup -Name $clusterresourcegroupname
```

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a Docker project in Visual Studio
> * Containerize an existing application
> * Setup continuous integration with Visual Studio and VSTS

In the next part of the tutorial, learn how to set up [monitoring for your container](service-fabric-tutorial-monitoring-wincontainers.md).


[link-fabrikam-github]: https://aka.ms/fabrikamcontainer
[link-azure-powershell-install]: /powershell/azure/install-azurerm-ps
[link-servicefabric-create-secure-clusters]: service-fabric-cluster-creation-via-arm.md
[link-visualstudio-cd-extension]: https://aka.ms/cd4vs
[link-servicefabric-containers]: service-fabric-get-started-containers.md
[link-servicefabric-createapp]: service-fabric-create-your-first-application-in-visual-studio.md
[link-azure-portal]: https://portal.azure.com
[link-sf-clustertemplate]: https://aka.ms/securepreviewonelineclustertemplate
[link-azure-pricing-calculator]: https://azure.microsoft.com/pricing/calculator/
[link-azure-subscription]: https://azure.microsoft.com/free/
[link-vsts-account]: https://www.visualstudio.com/team-services/pricing/
[link-azure-sql]: /azure/sql-database/

[image-web-preview]: media/service-fabric-host-app-in-a-container/fabrikam-web-sample.png
[image-source-control]: media/service-fabric-host-app-in-a-container/add-to-source-control.png
[image-publish-repo]: media/service-fabric-host-app-in-a-container/publish-repo.png
[image-setup-ci]: media/service-fabric-host-app-in-a-container/configure-continuous-integration.png
[fabrikam-web-page]: media/service-fabric-host-app-in-a-container/fabrikam-web-page.png
