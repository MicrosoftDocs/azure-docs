---
title: Service Fabric App upgrade using PowerShell
description: This article walks through the experience of deploying a Service Fabric application, changing the code, and rolling out an upgrade using PowerShell.

ms.topic: conceptual
ms.date: 2/23/2018
---
# Service Fabric application upgrade using PowerShell
> [!div class="op_single_selector"]
> * [PowerShell](service-fabric-application-upgrade-tutorial-powershell.md)
> * [Visual Studio](service-fabric-application-upgrade-tutorial.md)
> 
> 

<br/>

The most frequently used and recommended upgrade approach is the monitored rolling upgrade.  Azure Service Fabric monitors the health of the application being upgraded based on a set of health policies. Once an update domain (UD) is upgraded, Service Fabric evaluates the application health and either proceeds to the next update domain or fails the upgrade depending on the health policies.

A monitored application upgrade can be performed using the managed or native APIs, PowerShell, Azure CLI, Java, or REST. For instructions on performing an upgrade using Visual Studio, see [Upgrading your application using Visual Studio](service-fabric-application-upgrade-tutorial.md).

With Service Fabric monitored rolling upgrades, the application administrator can configure the health evaluation policy that Service Fabric uses to determine if the application is healthy. In addition, the administrator can configure the action to be taken when the health evaluation fails (for example, doing an automatic rollback.) This section walks through a monitored upgrade for one of the SDK samples that uses PowerShell. 

## Step 1: Build and deploy the Visual Objects sample
Build and publish the application by right-clicking on the application project, **VisualObjectsApplication,** and selecting the **Publish** command.  For more information, see [Service Fabric application upgrade tutorial](service-fabric-application-upgrade-tutorial.md).  Alternatively, you can use PowerShell to deploy your application.

> [!NOTE]
> Before any of the Service Fabric commands may be used in PowerShell, you first need to connect to the cluster by using the `Connect-ServiceFabricCluster` cmdlet. Similarly, it is assumed that the Cluster has already been set up on your local machine. See the article on [setting up your Service Fabric development environment](service-fabric-get-started.md).
> 
> 

After building the project in Visual Studio, you can use the PowerShell command [Copy-ServiceFabricApplicationPackage](/powershell/module/servicefabric/copy-servicefabricapplicationpackage) to copy the application package to the ImageStore. If you want to verify the app package locally, use the [Test-ServiceFabricApplicationPackage](/powershell/module/servicefabric/test-servicefabricapplicationpackage) cmdlet. The next step is to register the application to the Service Fabric runtime using the [Register-ServiceFabricApplicationType](/powershell/module/servicefabric/register-servicefabricapplicationtype) cmdlet. The following step is to start an instance of the application by using the [New-ServiceFabricApplication](/powershell/module/servicefabric/new-servicefabricapplication?view=azureservicefabricps) cmdlet.  These three steps are analogous to using the **Deploy** menu item in Visual Studio.  Once provisioning is completed, you should clean up the copied application package from the image store in order to reduce the resources consumed.  If an application type is no longer required, it should be unregistered for the same reason. See [Deploy and remove applications using PowerShell](service-fabric-application-upgrade-tutorial-powershell.md) for more information.

Now, you can use [Service Fabric Explorer to view the cluster and the application](service-fabric-visualizing-your-cluster.md). The application has a web service that can be navigated to in Internet Explorer by typing `http://localhost:8081/visualobjects` in the address bar.  You should see some floating visual objects moving around in the screen.  Additionally, you can use [Get-ServiceFabricApplication](/powershell/module/servicefabric/get-servicefabricapplication?view=azureservicefabricps) to check the application status.

## Step 2: Update the Visual Objects sample
You might notice that with the version that was deployed in Step 1, the visual objects do not rotate. Let's upgrade this application to one where the visual objects also rotate.

Select the VisualObjects.ActorService project within the VisualObjects solution, and open the StatefulVisualObjectActor.cs file. Within that file, navigate to the method `MoveObject`, comment out `this.State.Move()`, and uncomment `this.State.Move(true)`. This change rotates the objects after the service is upgraded.

We also need to update the *ServiceManifest.xml* file (under PackageRoot) of the project **VisualObjects.ActorService**. Update the *CodePackage* and the service version to 2.0, and the corresponding lines in the *ServiceManifest.xml* file.
You can use the Visual Studio *Edit Manifest Files* option after you right-click on the solution to make the manifest file changes.

After the changes are made, the manifest should look like the following (highlighted portions show the changes):

```xml
<ServiceManifestName="VisualObjects.ActorService" Version="2.0" xmlns="http://schemas.microsoft.com/2011/01/fabric" xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance">

<CodePackageName="Code" Version="2.0">
```

Now the *ApplicationManifest.xml* file (found under the **VisualObjects** project under the **VisualObjects** solution) is updated to version 2.0 of the **VisualObjects.ActorService** project. In addition, the Application version is updated to 2.0.0.0 from 1.0.0.0. The *ApplicationManifest.xml* should look like the following snippet:

```xml
<ApplicationManifestxmlns:xsd="https://www.w3.org/2001/XMLSchema" xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" ApplicationTypeName="VisualObjects" ApplicationTypeVersion="2.0.0.0" xmlns="http://schemas.microsoft.com/2011/01/fabric">

 <ServiceManifestRefServiceManifestName="VisualObjects.ActorService" ServiceManifestVersion="2.0" />
```

Now, build the project by selecting just the **ActorService** project, and then right-clicking and selecting the **Build** option in Visual Studio. If you select **Rebuild all**, you should update the versions for all projects, since the code would have changed. Next, let's package the updated application by right-clicking on ***VisualObjectsApplication***, selecting the Service Fabric Menu, and choosing **Package**. This action creates an application package that can be deployed.  Your updated application is ready to be deployed.

## Step 3:  Decide on health policies and upgrade parameters
Familiarize yourself with the [application upgrade parameters](service-fabric-application-upgrade-parameters.md) and the [upgrade process](service-fabric-application-upgrade.md) to get a good understanding of the various upgrade parameters, time-outs, and health criterion applied. For this walkthrough, the service health evaluation criterion is set to the default (and recommended) values, which means that all services and instances should be *healthy* after the upgrade.  

However, let's increase the *HealthCheckStableDuration* to 180 seconds (so that the services are healthy for at least 120 seconds before the upgrade proceeds to the next update domain).  Let's also set the *UpgradeDomainTimeout* to be 1200 seconds and the *UpgradeTimeout* to be 3000 seconds.

Finally, let's also set the *UpgradeFailureAction* to rollback. This option requires Service Fabric to roll back the application to the previous version if it encounters any issues during the upgrade. Thus, when starting the upgrade (in Step 4), the following parameters are specified:

FailureAction = Rollback

HealthCheckStableDurationSec = 180

UpgradeDomainTimeoutSec = 1200

UpgradeTimeout = 3000

## Step 4: Prepare application for upgrade
Now the application is built and ready to be upgraded. If you open up a PowerShell window as an administrator and type [Get-ServiceFabricApplication](/powershell/module/servicefabric/get-servicefabricapplication?view=azureservicefabricps), it should let you know that it is application type 1.0.0.0 of **VisualObjects** that's been deployed.  

The application package is stored under the following relative path where you uncompressed the Service Fabric SDK - *Samples\Services\Stateful\VisualObjects\VisualObjects\obj\x64\Debug*. You should find a "Package" folder in that directory, where the application package is stored. Check the timestamps to ensure that it is the latest build (you may need to modify the paths appropriately as well).

Now let's copy the updated application package to the Service Fabric ImageStore (where the application packages are stored by Service Fabric). The parameter *ApplicationPackagePathInImageStore* informs Service Fabric where it can find the application package. We have put the updated application in "VisualObjects\_V2" with the following command (you may need to modify paths again appropriately).

```powershell
Copy-ServiceFabricApplicationPackage -ApplicationPackagePath .\Samples\Services\Stateful\VisualObjects\VisualObjects\obj\x64\Debug\Package -ApplicationPackagePathInImageStore "VisualObjects\_V2"
```

The next step is to register this application with Service Fabric, which can be performed using the [Register-ServiceFabricApplicationType](/powershell/module/servicefabric/register-servicefabricapplicationtype?view=azureservicefabricps) command:

```powershell
Register-ServiceFabricApplicationType -ApplicationPathInImageStore "VisualObjects\_V2"
```

If the preceding command doesn't succeed, it is likely that you need a rebuild of all services. As mentioned in Step 2, you may have to update your WebService version as well.

It's recommended that you remove the application package after the application is successfully registered.  Deleting application packages from the image store frees up system resources.  Keeping unused application packages consumes disk storage and leads to application performance issues.

```powershell
Remove-ServiceFabricApplicationPackage -ApplicationPackagePathInImageStore "VisualObjects\_V2" -ImageStoreConnectionString fabric:ImageStore
```

## Step 5: Start the application upgrade
Now, we're all set to start the application upgrade by using the [Start-ServiceFabricApplicationUpgrade](/powershell/module/servicefabric/start-servicefabricapplicationupgrade?view=azureservicefabricps) command:

```powershell
Start-ServiceFabricApplicationUpgrade -ApplicationName fabric:/VisualObjects -ApplicationTypeVersion 2.0.0.0 -HealthCheckStableDurationSec 60 -UpgradeDomainTimeoutSec 1200 -UpgradeTimeout 3000   -FailureAction Rollback -Monitored
```


The application name is the same as it was described in the *ApplicationManifest.xml* file. Service Fabric uses this name to identify which application is getting upgraded. If you set the time-outs to be too short, you may encounter a failure message that states the problem. Refer to the troubleshooting section, or increase the time-outs.

Now, as the application upgrade proceeds, you can monitor it using Service Fabric Explorer, or by using the [Get-ServiceFabricApplicationUpgrade](/powershell/module/servicefabric/get-servicefabricapplicationupgrade?view=azureservicefabricps) PowerShell command: 

```powershell
Get-ServiceFabricApplicationUpgrade fabric:/VisualObjects
```

In a few minutes, the status that you got by using the preceding PowerShell command, should state that all update domains were upgraded (completed). And you should find that the visual objects in your browser window have started rotating!

You can try upgrading from version 2 to version 3, or from version 2 to version 1 as an exercise. Moving from version 2 to version 1 is also considered an upgrade. Play with time-outs and health policies to make yourself familiar with them. When you are deploying to an Azure cluster, the parameters need to be set appropriately. It is good to set the time-outs conservatively.

## Next steps
[Upgrading your application using Visual Studio](service-fabric-application-upgrade-tutorial.md) walks you through an application upgrade using Visual Studio.

Control how your application upgrades by using [upgrade parameters](service-fabric-application-upgrade-parameters.md).

Make your application upgrades compatible by learning how to use [data serialization](service-fabric-application-upgrade-data-serialization.md).

Learn how to use advanced functionality while upgrading your application by referring to [Advanced topics](service-fabric-application-upgrade-advanced.md).

Fix common problems in application upgrades by referring to the steps in [Troubleshooting application upgrades](service-fabric-application-upgrade-troubleshooting.md).

