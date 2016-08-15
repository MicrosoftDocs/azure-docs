<properties
	pageTitle="Automate Service Fabric application management by using PowerShell | Microsoft Azure"
	description="Deploy, upgrade, test, and remove Service Fabric applications by using PowerShell."
	services="service-fabric"
	documentationCenter=".net"
	authors="rwike77"
	manager="timlt"
	editor=""/>

<tags
	ms.service="service-fabric"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="07/15/2016"
	ms.author="ryanwi"/>

# Automate the application lifecycle using PowerShell

Many aspects of the [Service Fabric application lifecycle](service-fabric-application-lifecycle.md) can be automated.  This article shows how to use PowerShell to automate common tasks for deploying, upgrading, removing, and testing Azure Service Fabric applications.  Managed and HTTP APIs for app management are also available, see [app lifecycle](service-fabric-application-lifecycle.md) for more information.  

## Prerequisites
Before you move on to the tasks in the article, be sure to:

+ Get familiar with the Service Fabric concepts described in [Technical overview of Service Fabric](service-fabric-technical-overview.md).
+ [Install the runtime, SDK, and tools](service-fabric-get-started.md), which also installs the **ServiceFabric** PowerShell module.
+ [Enable PowerShell script execution](service-fabric-get-started.md#enable-powershell-script-execution).
+ Start a local cluster.  Launch a new PowerShell window as an administrator and then run the cluster setup script from the SDK folder: `& "$ENV:ProgramFiles\Microsoft SDKs\Service Fabric\ClusterSetup\DevClusterSetup.ps1"`
+ Before you run any PowerShell commands in this article, first connect to the local Service Fabric cluster by using [**Connect-ServiceFabricCluster**](https://msdn.microsoft.com/library/azure/mt125938.aspx): `Connect-ServiceFabricCluster localhost:19000`
+ The following tasks require a v1 application package to deploy and a v2 application package for upgrade. Download the [**WordCount** sample application](http://aka.ms/servicefabricsamples) (located in the Getting Started samples). Build and package the application in Visual Studio (right-click on **WordCount** in Solution Explorer and select **Package**). Copy the v1 package in `C:\ServiceFabricSamples\Services\WordCount\WordCount\pkg\Debug` to `C:\Temp\WordCount`. Copy `C:\Temp\WordCount` to `C:\Temp\WordCountV2`, creating the v2 application package for upgrade. Open `C:\Temp\WordCountV2\ApplicationManifest.xml` in a text editor. In the **ApplicationManifest** element, change the **ApplicationTypeVersion** attribute from "1.0.0" to "2.0.0". This updates the version number of the application. Save the changed ApplicationManifest.xml file.

## Task: Deploy a Service Fabric application

After you've built and packaged the application (or downloaded the application package), you can deploy the application into a local Service Fabric cluster. Deployment involves uploading the application package, registering the application type, and creating the application instance. Use the instructions in this section to deploy a new application to a cluster.

### Step 1: Upload the application package
Uploading the application package to the image store puts it in a location accessible to internal Service Fabric components.  The application package contains the necessary application manifest, service manifest(s), and code, configuration, and data package(s) to create the application and service instances.  The [**Copy-ServiceFabricApplicationPackage**](https://msdn.microsoft.com/library/azure/mt125905.aspx) command will upload the package. For example:

```powershell
Copy-ServiceFabricApplicationPackage C:\Temp\WordCount\ -ImageStoreConnectionString file:C:\SfDevCluster\Data\ImageStoreShare -ApplicationPackagePathInImageStore WordCount
```

### Step 2: Register the application type
Registering the application package makes the application type and version declared in the application manifest available for use. The system will read the package uploaded in the step 1, verify the package (equivalent to running [**Test-ServiceFabricApplicationPackage**](https://msdn.microsoft.com/library/azure/mt125950.aspx) locally), process the package contents, and copy the processed package to an internal system location.  Run the [**Register-ServiceFabricApplicationType**](https://msdn.microsoft.com/library/azure/mt125958.aspx) cmdlet:

```powershell
Register-ServiceFabricApplicationType WordCount
```
To see all the application types registered in the cluster, run the [Get-ServiceFabricApplicationType](https://msdn.microsoft.com/library/azure/mt125871.aspx) cmdlet:

```powershell
Get-ServiceFabricApplicationType
```

### Step 3: Create the application instance
An application can be instantiated by using any application type version that has been registered successfully by using the [**New-ServiceFabricApplication**](https://msdn.microsoft.com/library/azure/mt125913.aspx) command. The name of each application is declared at deploy time and must start with the **fabric:** scheme and be unique for each application instance. The application type name and application type version are declared in the **ApplicationManifest.xml** file of the application package. If any default services were defined in the application manifest of the target application type, then those will also be created at this time.

```powershell
New-ServiceFabricApplication fabric:/WordCount WordCount 1.0.0
```

The [**Get-ServiceFabricApplication**](https://msdn.microsoft.com/library/azure/mt163515.aspx) command lists all application instances that were successfully created, along with their overall status. The [**Get-ServiceFabricService**](https://msdn.microsoft.com/library/azure/mt125889.aspx) command lists all of the service instances that were successfully created within a given application instance. Default services (if any) will be listed.

```powershell
Get-ServiceFabricApplication

Get-ServiceFabricApplication | Get-ServiceFabricService
```

## Task: Upgrade a Service Fabric application
You can upgrade a previously deployed Service Fabric application with an updated application package. This task upgrades the WordCount application that was deployed in "Task: Deploy a Service Fabric application." Read through [Service Fabric application upgrade](service-fabric-application-upgrade.md) for more information.

To keep things simple for this example, only the application version number was updated in the WordCountV2 application package created in the prerequisites. A more realistic scenario would involve updating your service code, configuration, or data files and then rebuilding and packaging the application with updated version numbers.  

### Step 1: Upload the updated application package
The WordCount v1 application is ready to be upgraded. If you open up a PowerShell window as administrator and type [**Get-ServiceFabricApplication**](https://msdn.microsoft.com/library/azure/mt163515.aspx), you will see that version 1.0.0 of the WordCount application type is deployed.  

Now copy the updated application package to the Service Fabric image store (where the application packages are stored by Service Fabric). The parameter **ApplicationPackagePathInImageStore** informs Service Fabric where it can find the application package. The following command will copy the application package to **WordCountV2** in the image store:  

```powershell
Copy-ServiceFabricApplicationPackage C:\Temp\WordCountV2\ -ImageStoreConnectionString file:C:\SfDevCluster\Data\ImageStoreShare -ApplicationPackagePathInImageStore WordCountV2

```
### Step 2: Register the updated application type
The next step is to register the new version of the application with Service Fabric, which can be performed by using the [**Register-ServiceFabricApplicationType**](https://msdn.microsoft.com/library/azure/mt125958.aspx) cmdlet:

```powershell
Register-ServiceFabricApplicationType WordCountV2
```

### Step 3: Start the upgrade
Various upgrade parameters, timeouts, and health criteria can be applied to application upgrades. Read through the [application upgrade parameters](service-fabric-application-upgrade-parameters.md) and [upgrade process](service-fabric-application-upgrade.md) documents to learn more. All services and instances should be _healthy_ after the upgrade.  Set the **HealthCheckStableDuration** to 60 seconds (so that the services will be healthy for at least 20 seconds before the upgrade proceeds to the next upgrade domain).  Also set the **UpgradeDomainTimeout** to 1200 seconds and the **UpgradeTimeout** to 3000 seconds. Finally, set the **UpgradeFailureAction** to **rollback**, which requests that Service Fabric rolls back the application to the previous version if failures are encountered during upgrade.

You can now start the application upgrade by using the [**Start-ServiceFabricApplicationUpgrade**](https://msdn.microsoft.com/library/azure/mt125975.aspx) cmdlet:

```powershell
Start-ServiceFabricApplicationUpgrade -ApplicationName fabric:/WordCount -ApplicationTypeVersion 2.0.0 -HealthCheckStableDurationSec 60 -UpgradeDomainTimeoutSec 1200 -UpgradeTimeout 3000  -FailureAction Rollback -Monitored
```

Note that the application name is the same as the previously deployed v1.0.0 application name (fabric:/WordCount). Service Fabric uses this name to identify which application is getting upgraded. If you set the time-outs to be too short, you might encounter a time-out failure message that states the problem. Refer to [Troubleshoot application upgrades](service-fabric-application-upgrade-troubleshooting.md), or increase the time-outs.

### Step 4: Check upgrade progress
You can monitor application upgrade progress by using [Service Fabric Explorer](service-fabric-visualizing-your-cluster.md), or by using the [**Get-ServiceFabricApplicationUpgrade**](https://msdn.microsoft.com/library/azure/mt125988.aspx) cmdlet:

```powershell
Get-ServiceFabricApplicationUpgrade fabric:/WordCount
```

In a few minutes, the [Get-ServiceFabricApplicationUpgrade](https://msdn.microsoft.com/library/azure/mt125988.aspx) cmdlet will show that all upgrade domains were upgraded (completed).

## Task: Test a Service Fabric application

To write high quality services, developers need to be able to induce unreliable infrastructure faults to test the stability of their services. Service Fabric gives developers the ability to induce fault actions and test services in the presence of failures by using the chaos and failover test scenarios.  Read through [Testability overview](service-fabric-testability-overview.md) for additional information.

### Step 1: Run the chaos test scenario
The chaos test scenario generates faults across the entire Service Fabric cluster. The scenario compresses faults generally seen over months or years to a few hours. The combination of interleaved faults with a high fault rate finds corner cases that would otherwise be missed. The following example runs the chaos test scenario for 60 minutes.

```powershell
$timeToRun = 60
$maxStabilizationTimeSecs = 180
$concurrentFaults = 3
$waitTimeBetweenIterationsSec = 60

Invoke-ServiceFabricChaosTestScenario -TimeToRunMinute $timeToRun -MaxClusterStabilizationTimeoutSec $maxStabilizationTimeSecs -MaxConcurrentFaults $concurrentFaults -EnableMoveReplicaFaults -WaitTimeBetweenIterationsSec $waitTimeBetweenIterationsSec
```

### Step 2: Run the failover test scenario
The failover test scenario targets a specific service partition instead of the entire cluster, and it leaves other services unaffected. The scenario iterates through a sequence of simulated faults in service validation while your business logic runs. A failure in service validation indicates an issue that needs further investigation. The failover test induces only one fault at a time, as opposed to the chaos test scenario, which can induce multiple faults. The following example runs the failover test for 60 minutes against the fabric:/WordCount/WordCountService service.

```powershell
$timeToRun = 60
$maxStabilizationTimeSecs = 180
$waitTimeBetweenFaultsSec = 10
$serviceName = "fabric:/WordCount/WordCountService"

Invoke-ServiceFabricFailoverTestScenario -TimeToRunMinute $timeToRun -MaxServiceStabilizationTimeoutSec $maxStabilizationTimeSecs -WaitTimeBetweenFaultsSec $waitTimeBetweenFaultsSec -ServiceName $serviceName -PartitionKindUniformInt64 -PartitionKey 1
```

## Task: Remove a Service Fabric application
You can delete an instance of a deployed application, remove the provisioned application type from the cluster, and remove the application package from the ImageStore.

### Step 1: Remove an application instance
When an application instance is no longer needed, you can permanently remove it by using the [**Remove-ServiceFabricApplication**](https://msdn.microsoft.com/library/azure/mt125914.aspx) cmdlet. This will also automatically remove all services belonging to the application, permanently removing all service state. This operation cannot be reversed and application state cannot be recovered.

```powershell
Remove-ServiceFabricApplication fabric:/WordCount
```

### Step 2: Unregister the application type
When you no longer need a particular version of an application type, unregister it by using the [**Unregister-ServiceFabricApplicationType**](https://msdn.microsoft.com/library/azure/mt125885.aspx) cmdlet. Unregistering unused types will release storage space used by the application package in the image store. An application type can be unregistered as long as there are no applications instantiated against it or pending application upgrades referencing it.

```powershell
Unregister-ServiceFabricApplicationType WordCount 1.0.0
```

### Step 3: Remove the application package
After the application type is unregistered, the application package can be removed from the image store by using the [**Remove-ServiceFabricApplicationPackage**](https://msdn.microsoft.com/library/azure/mt163532.aspx) cmdlet.

```powershell
Remove-ServiceFabricApplicationPackage -ImageStoreConnectionString file:C:\SfDevCluster\Data\ImageStoreShare -ApplicationPackagePathInImageStore WordCount
```

## Next steps
[Service Fabric application lifecycle](service-fabric-application-lifecycle.md)

[Deploy an application](service-fabric-deploy-remove-applications.md)

[Application upgrade](service-fabric-application-upgrade.md)

[Azure Service Fabric cmdlets](https://msdn.microsoft.com/library/azure/mt125965.aspx)

[Azure Service Fabric testability cmdlets](https://msdn.microsoft.com/library/azure/mt125844.aspx)
