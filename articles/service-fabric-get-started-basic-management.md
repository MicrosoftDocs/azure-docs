<properties 
   pageTitle="microsoft-azure-service-fabric-application-basic-management"
   description="The tutorial goes into details of how a Microsoft Azure Service Fabric Application is packaged, deployed, upgraded and removed." 
   services="service-fabric" 
   documentationCenter=".net" 
   authors="zbrad" 
   manager="mike.andrews" 
   editor="vturecek" />

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="multiple" 
   ms.date="04/13/2015"
   ms.author="brad.merrill" />

# Microsoft Azure Service Fabric Application Basic Management

The tutorial goes into details of how a Microsoft Azure Service Fabric Application is packaged, deployed, upgraded and removed. It's recommended that before you work with this tutorial, you go through [Getting Started with Microsoft Azure Service Fabric Stateless Services](service-fabric-get-started-hello-world-stateless.md) first.

You'll learn:

- [How to set up the development environment for Microsoft Azure Service Fabric](#set-up-the-development-environment)
- [How to use Microsoft Azure Service Fabric PowerShell cmdlets](#getting-started-with-powershell-cmdlets)
- [Understand application package layout](#examine-application-package-and-scripts)
- [How to upgrade an application](#update-an-application)
 
## Set up the development environment

### Prerequisites
- [Visual Studio 2015 CTP 6](https://www.visualstudio.com/en-us/news/vs2015-vs.aspx)
- [Azure PowerShell](http://azure.microsoft.com/en-us/documentation/articles/install-configure-powershell/)
- If you want to deploy the service to Azure, an active Azure subscription. If you don't have one, you can get a free trial at [azure.microsoft.com](http://azure.microsoft.com/en-gb/pricing/free-trial/).

### Install SDK and tools

1. Install [Windows Fabric 3.2](../../resources/WindowsFabric.3.2.181.9490.msi).
2. Install [Windows Fabric 3.2 SDK](../../resources/WindowsFabricSDK.3.2.181.9490.msi).
3. Install [Windows Fabric Tool for Visual Studio 2015 Preview](../../resources/Fabric.VS140.en-us.msi).
4. ![](media/basic-management-workaround.png) Extract [FabActSdk.zip](../../resources/FabActSdk.zip) under the **Resources** folder to your *%SystemDrive%* (i.e. C:\ if C: is your System Drive). After extraction, you should have a *FabActSDK* folder under your system drive root folder. This folder is referred to as the *FabActSdk* folder hereafter in this tutorial.
6. ![](media/basic-management-workaround.png) Disable strong name verification. 
	1. Launch **VS2014 x64 x86 Cross Tools Command Prompt** as an **Administrator**.
	2. Navigate to the *FabActSdk***\bin** folder.
	3. Disable strong name verification for the following three assemblies by running the following commands:
	
			sn -Vr FabActUtil.exe
			sn -Vr System.Fabric.Services.dll
			sn -Vr WindowsFabricServiceModel.dll


## Getting started with Powershell cmdlets
When you install Windows Fabric SDK, a number of PowerShell cmdlets are installed for you. In this segment, we'll run through a couple of cmdlets to get familiarized with these commands.

1. Launch **Windows PowerShell** as an **administrator**.
2. First, let's check if the PowerShell module is installed correctly:

		Get-Command -module WindowsFabric
	The above command should list all supported cmdlets in the _WindowsFabric_ module:

		CommandType     Name                                               Version    Source
		-----------     ----                                               -------    ------
		Cmdlet          Approve-WindowsFabricRepairTask                    3.1.0.0    WindowsFabric
		Cmdlet          Complete-WindowsFabricRepairTask                   3.1.0.0    WindowsFabric
		Cmdlet          Connect-WindowsFabricCluster                       3.1.0.0    WindowsFabric
		...

3. Navigate to the _FabSdk_ folder.
4. Next, we'll launch a local cluster by executing the **DevClusterSetup.ps1** script under the _FabSdk_\ClusterSetup\Local folder.

		.\ClusterSetup\Local\DevClusterSetup.ps1

	After a couple of minutes, you should see some outputs on your screen, ending with texts like the following:

		...
		Cluster created successfully
		WARNING: CLOSE this powershell Window.
		To connect using Powershell, open an a new powershell window and connect using 'Connect-WindowsFabricCluster' command (
		without any arguments).
		To connect using WinFabExplorer, run WinFabExplorer and connect using 'Local/OneBox Cluster'.

	>**NOTE**: Your local cluster might be already running, in which case the script will fail with many errors. If you want to clean up the local cluster, run the **CleanCluster.ps1** script under the same folder.

5. Once the local cluster is up, we can use **Connect-WindowsFabricCluster** to establish a connection to it. Many PowerShell cmdlets require you to have an active connection, which is created by this command.

		Connect-WindowsFabricCluster localhost:19000

	A successful connection generates the following outputs (with some values masked):

		True

		ConnectionEndpoint   : {localhost:19000}
		FabricClientSettings : {
		                       ClientFriendlyName                   : PowerShell-...
		                       PartitionLocationCacheLimit          : 100000
		                       PartitionLocationCacheBucketCount    : 1024
		                       ServiceChangePollInterval            : 00:02:00
		                       ConnectionInitializationTimeout      : 00:00:02
		                       KeepAliveInterval                    : 00:00:20
		                       HealthOperationTimeout               : 00:02:00
		                       HealthReportSendInterval             : 00:00:00
		                       HealthReportRetrySendInterval        : 00:00:30
		                       NotificationGatewayConnectionTimeout : 00:00:00
		                       NotificationCacheUpdateTimeout       : 00:00:00
		                       }
		GatewayInformation   : {
		                       NodeAddress                          : ...:19000
		                       NodeId                               : ...
		                       NodeInstanceId                       : ...
		                       NodeName                             : Node.1
		                       }
	

## Examine application package and scripts

>**NOTE**: To deploy an application you need to go through the following 4 steps (with corresponding PowerShell cmdlets):
>
1. Create an application package.
2. Copy the application to an image store (_**Copy-WindowsFabricApplicationPackage**_).
3. Register, or provision, the application type (_**Register-WindowsFabricApplicationType**_).
4. Create a new application instance (_**New-WindowsFabricApplication**_).

When you create a new Microsoft Azure Service Fabric application, Visual Studio generates a number of PowerShell scripts that help you to deploy the application. We'll examine these scripts in this section.

1. Launch **Visual Studio 2015 Preview**, and open the **Begin\BasicManagementApp.sln** solution.
2. Rebuild the solution to make sure everything builds.
	>Note: if the solution does not build out of the box, you might need to add a reference to **System.Fabric.Services.dll** under the
   **_FabActSdk_\bin** folder (see step 4 of
   installation).![](media/basic-management-workaround.png)
3. Press **F5**. This triggers Visual Studio to build, package, and deploy the application.
4. As the application is running, use the following cmdlet to check application health:

		Get-WindowsFabricApplicationHealth  -ApplicationName fabric:/BasicManagementApp

	If the application is running fine, you should see outputs like the following:
	
		ApplicationName                 : fabric:/BasicManagementApp
		AggregatedHealthState           : Ok
		ServiceHealthStates             :
		                                  ServiceName           : fabric:/BasicManagementApp/BasicManagementApp.Service
		                                  AggregatedHealthState : Ok
		DeployedApplicationHealthStates :
		                                  ApplicationName       : fabric:/BasicManagementApp
		                                  NodeName              : Node.1
		                                  AggregatedHealthState : Ok
		                                  ...
		HealthEvents                    :
		                                  SourceId              : System.CM
		                                  Property              : State
		                                  HealthState           : Ok
		                                  ...
5. Using Windows Explorer, open the **Begin\BasicManagementApp\BasicManagementApp\obj\x64\Debug\Package** folder, which contains the application package:

		
	    Package
	    ├── ApplicationManifest.xml
	    └── BasicManagementApp.Service
	        ├── ServiceManifest.xml
	        └── Code
	            ├── BasicManagementApp.Service.exe
	            ├── BasicManagementApp.Service.exe.config
	            └── ...
		
	At the root of the package, there's a **ApplicationManifest.xml** file, which defines the constitute services and other application-level settings. Under the root folder, there's a sub folder for each of the services. Each service folder contains a **ServiceManifest.xml**, a **Code** package folder that contains service binaries, a **Config** package folder and a **Data** package folder.	
	
6. Back in Visual Studio, open the **Publish-FabricApplication.ps1** script under **BasicManagementApp** project's **Scripts** folder. At the end of the script, you can see lines where the package copy (**Copy-WindowsFabricApplicationPackage**) and application type registration (**Register-WindowsFabricApplicationType**) calls occur:

		...
		Copy-WindowsFabricApplicationPackage -ApplicationPackagePath $tmpPackagePath -ImageStoreConnectionString $imageStoreConnectionString -ApplicationPackagePathInImageStore $applicationPackagePathInImageStore
		Register-WindowsFabricApplicationType -ApplicationPathInImageStore $applicationPackagePathInImageStore
 
7. Open the **New-FabricApplication.ps1** script under the same folder. Observe how the **New-WindowsFabricApplicaiton** cmdlet is called at the end of the script:

		...
		New-WindowsFabricApplication -ApplicationName $names.ApplicationName -ApplicationTypeName $names.ApplicationTypeName -ApplicationTypeVersion $names.ApplicationTypeVersion -ApplicationParameter $ApplicationParameter
8. Stop the application. 
9. To remove applicaiton, use **Remove-WindowsFabricApplication**. To unregister an applicaiton type, use **Unregister-WindowsFabricApplicationType**. Open the **Remove-FabricApplication.ps1** script and observe how these cmdlets are used:

		...
		$app = Get-WindowsFabricApplication -ApplicationName $names.ApplicationName
		if ($app)
		{
		    $app | Remove-WindowsFabricApplication -Force
		}
		$reg = Get-WindowsFabricApplicationType -ApplicationTypeName $names.ApplicationTypeName
		if ($reg)
		{
		    $reg | Unregister-WindowsFabricApplicationType -Force
		}
		...

## Update an application

In this part, we'll update the application to a new version. We'll start by checking the existing application and service version numbers. And then, we'll deploy a new version to replace the old version.

1. To get application info, use **Get-WindowsFabricApplication**:

		Get-WindowsFabricApplication -ApplicationName fabric:/BasicManagementApp
	
  The above command should generate the following output. Please note the application type version is currently 1.0:

		ApplicationName        : fabric:/BasicManagementApp
		ApplicationTypeName    : BasicManagementApp
		ApplicationTypeVersion : 1.0
		ApplicationStatus      : Ready
		HealthState            : Ok
		ApplicationParameters  : ...
	
2. To list the services in an application, use **Get-WindowsFabricService**:

		Get-WindowsFabricService -ApplicationName fabric:/BasicManagementApp

	The above command should generate the following output. Please note the service manifest version is currently 1.0:

		ServiceName            : fabric:/BasicManagementApp/BasicManagementApp.Service
		ServiceKind            : Stateless
		ServiceTypeName        : BasicManagementApp.Service
		IsServiceGroup         : False
		ServiceManifestVersion : 1.0
		ServiceStatus          : Active
		HealthState            : Ok

3. Open the **ApplicationManifest.xml** file under the **BasicManagementApp** project. Modify the **ApplicationTypeVersion** attribute as well as the **ServiceManifestVersion** attribute from "_1.0_" to "_2.0_".
4. Open the **ServiceManifest.xml** file under **PackageRoot**, in the **BasicManagementApp.Service** project. Modify the **Version** attribute from "_1.0_" to "_2.0_".
5. Press **F5**, which will trigger Visual Studio to perform a rolling upgrade.

	>**NOTE**: To be more precise, this rolling upgrade is a monitored rolling upgrade, in which case Service Fabric updates nodes in an upgrade domain, verifies the application health based on a set of health policies, and then moves to the next upgrade domain. On the other hand, you can also perform an automated rolling upgrade and a manual rolling upgrade. An automated rolling upgrade automatically moves to the next upgrade domain once the last node in the current upgrade domain has been successfully upgraded. In contrast, a manual rolling update allows you to manually verify the deployment on an upgrade domain before moving to the next. You can optionally roll back or roll out a different version if the verification fails.

6. Once the deployment finishes, rerun the commands in step 1 and step 2 to observe version updates.



<!--image references-->
[1]: ./media/service-fabric-get-started-basic-management/basic-management-change.png
[2]: ./media/service-fabric-get-started-basic-management/basic-management-info.png
[3]: ./media/service-fabric-get-started-basic-management/basic-management-workaround.png





