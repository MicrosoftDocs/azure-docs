<properties
   pageTitle="Service Fabric Application Upgrade Tutorial"
   description="This article walks through an experience of upgrading a Service Fabric application."
   services="service-fabric"
   documentationCenter=".net"
   authors="mani-ramaswamy"
   manager="samgeo"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="04/15/2015"
   ms.author="subramar"/>



# Application Upgrade Tutorial

The most frequently used and recommended upgrade approach is the monitored rolling upgrade.  Service Fabric monitors the health of the application being upgraded based on a set of health policies. When the applications in an upgrade domain (UD) have been upgraded, Service Fabric evaluates the application health and determines whether to proceed to the next upgrade domain or fail the upgrade based on the health policies. A monitored application upgrade can be performed using the managed or native APIs, PowerShell, or REST.

Service Fabric monitored rolling upgrade allows the application administrator to configure the health evaluation policy that Service Fabric uses to determine the application is healthy. In addition, it also allows the administrator to configure the action to be taken when the health evaluation fails such as automatically roll-back. This section walkthrough a monitored upgrade for one of the SDK samples.

## Step 1: Build & Deploy the Visual Objects Sample

These steps can be done by opening the project in Visual Studio, and right clicking on the Solution and selecting the deploy command in the Service Fabric menu item.  See [managing your Service Fabric application in Visual Studio](service-fabric-manage-application-in-visual-studio.md) for more information.  Alternatively, one may use PowerShell.

> [AZURE.NOTE] Before any of the Service Fabric commands may be used in PowerShell, one has to first connect to the cluster by using the `Connect-ServiceFabricCluster` cmdlet. Similarly, it is assumed that the Cluster has already been setup on your local machine. See the article on [setting up your Service Fabric development environment](service-fabric-get-started.md).

After building the project in Visual Studio, one may use the PowerShell command **Copy-ServiceFabricApplicationPackage** to copy the application package to the ImageStore, followed by registering the application to the Service Fabric runtime by using the **Register-ServiceFabricApplicationPackage** cmdlet, and finally starting an instance of the application by using the **New-ServiceFabricApplication** cmdlet.  These three steps are analogous to using the Deploy menu item in Visual Studio.

Now, you can use [Service Fabric Explorer to view the cluster and the application](service-fabric-visualizing-your-cluster.md). The application has a web service that can be navigated to in Internet Explorer by typing [http://localhost:80](http://localhost:80) in the address bar.  You should see some floating visual objects moving around in the screen.  Additionally, one may use **Get-ServiceFabricApplication** to check the application status.

## Step 2: Update the Visual Objects Sample

You might notice that with the version that was deployed in Step 1, the visual objects do not rotate. Let us upgrade this application to one where the visual objects also rotate.

Select the VisualObjects.DataService project within the VisualObjects solution, and open the VisualObjects.cs file in that project. Within that file navigate to the method `CreateMovedObject`, and find the line where rotation of the visual objects is set (search for the following lines in the `CreateMovedObject` method). Comment out the line `nextObject.Rotation = 1`, and uncomment the line below it. Your code should look like the following after the changes are made:

```c#
            //nextObject.Rotation = 1;

            // Once that's deployed, uncomment this line and upgrade the application:

             nextObject.Rotation = (nextObject.Rotation + 10) % 360;
```

We also need to update the *ServiceManifest.xml* file (under PackageRoot) of the project **VisualObjects.DataService**. Update the *CodePackage* and the service version to 2.0, and the corresponding lines in the *ServiceManifest.xml* file should look like the following (highlighted portions show the changes):

```xml
<ServiceManifestName="VisualObjects.DataService"Version="2.0"xmlns="http://schemas.microsoft.com/2011/01/fabric"xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

<CodePackageName="Code"Version="2.0">
```

Now, we need to update the *ApplicationManifest.xml* file (found under the **VisualObjects** project under the **VisualObjects** solution) to use version 2.0 of the **VisualObjects.DataService** project and also update the Application version to 2.0.0.0 from 1.0.0.0. Now, the corresponding lines in the *ApplicationManifest.xml* should read like the following:

```xml
<ApplicationManifestxmlns:xsd="http://www.w3.org/2001/XMLSchema"xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"ApplicationTypeName="VisualObjects"ApplicationTypeVersion="2.0.0.0"xmlns="http://schemas.microsoft.com/2011/01/fabric">

 <ServiceManifestRefServiceManifestName="VisualObjects.DataService"ServiceManifestVersion="2.0" />
```

Now, build the project by selecting the **VisualObjects** project and right clicking and selecting build in Visual Studio (if you select Rebuild all, you might have to update the versions for the **VisualObjects.WebService** project as well in its *ServiceManifest.xml* and in the *ApplicationManifest.xml*, since the code would have changed). Now let's package the updated application by right clicking on the *VisualObjects* project, selecting the Service Fabric Menu and choosing Package. This should create an application package that can be deployed.  Your updated application is ready to be deployed now.

## Step 3:  Decide on health policies and upgrade parameters

Please familiarize yourself with the [application upgrade parameters](service-fabric-application-upgrade-parameters.md) and the [upgrade process](service-fabric-application-upgrade.md) to get a good understanding of the various upgrade parameters, timeouts and health criterion applied. For this walkthrough, we will leave the service health evaluation criterion to be the default (and recommended values) which mean that all services and instances should be _healthy_ after the upgrade.  Let's however increase the *HealthCheckStableDuration* to 60 seconds (so that the services will be healthy for at least 20 seconds before the upgrade proceeds to the next upgrade domain).  Let's also set the *UpgradeDomainTimeout* to be 1200 seconds and the *UpgradeTimeout* to be 3000 seconds. Finally, let's also set the *UpgradeFailureAction* to rollback thereby requesting that Service Fabric rollback the application to the previous version if it encounters any issues during upgrade. Thus, the upgrade parameters we will specify when starting the upgrade (in Step 4) will be the following:

FailureAction = Rollback

HealthCheckStableDurationSec = 60

UpgradeDomainTimeoutSec = 1200

UpgradeTimeout = 3000

## Step 4: Prepare Application for Upgrade

Now, the application is built and ready to be upgraded. If you open up a PowerShell window as administrator and type **Get-ServiceFabricApplication**, it should let you know that it is Application Type 1.0.0.0 of **VisualObjects** that's been deployed.  The application package is stored under the following relative path where you uncompressed the Service Fabric SDK - *Samples\Services\Stateful\VisualObjects\VisualObjects\obj\x64\Debug*. You should find a "Package" folder in that directory - this is where the application package is stored. Please check the timestamps to ensure that it is the latest build (and you may need to modify the paths appropriately as well).

Now let's copy the updated application package to the Service Fabric ImageStore (where the application packages are stored by Service Fabric). The parameter *ApplicationPackagePathInImageStore* informs Service Fabric where it can find the application package. We have put the updated application in "VisualObjects\_V2" with the following command (you may have to modify paths again appropriately).

```powershell
Copy-ServiceFabricApplicationPackage  -ApplicationPackagePath .\Samples\Services\Stateful\VisualObjects\VisualObjects\obj\x64\Debug\Package
-ImageStoreConnectionString fabric:ImageStore   -ApplicationPackagePathInImageStore "VisualObjects\_V2"
```

The next step is to register this application with Service Fabric, which can be performed using the following command:

```powershell
Register-ServiceFabricApplicationType -ApplicationPathInImageStore "VisualObjects\_V2"
```

If the above command doesn't succeed it is likely that you need a rebuild of all services. As mentioned in Step 2, you may have to update your WebService version as well.

## Step 5: Start Application Upgrade

Now, we are all set to start the application upgrade by using the following command:

```powershell
Start-ServiceFabricApplicationUpgrade -ApplicationName fabric:/VisualObjects -ApplicationTypeVersion 2.0.0.0 -HealthCheckStableDurationSec 60 -UpgradeDomainTimeoutSec 1200 -UpgradeTimeout 3000   -FailureAction Rollback -Monitored
```


Note the application name is as was described in the *ApplicationManifest.xml* file. Service Fabric uses this name to identify which application is getting upgraded. If you set the timeouts to be too short, you may encounter a failure message that states the problem. Refer to the troubleshooting section, or increase the timeouts.

Now, as the application upgrade proceeds, you can monitor it using Service Fabric Explorer, or using the following PowerShell command: **Get-ServiceFabricApplicationUpgrade fabric:/VisualObjects**.

In a few minutes, the status using the above PowerShell command should state that all upgrade domains were upgraded (completed). And you should find that the visual objects in your browser window will now have started rotating!

You may want to try changing the versions and moving from version 2 to version 3 as an exercise, or even from version 2 back to version 1 (yes, you can upgrade from v2 to v1). Play with timeouts and health policies to make yourself familiar. When you are deploying to an Azure cluster, the parameters used will be different than those that worked when deploying to a local cluster - it is recommended to set the timeouts conservatively.


## Next steps

[Upgrade Parameters](service-fabric-application-upgrade-parameters.md)

[Data Serialization](service-fabric-application-upgrade-data-serialization.md)

[Advanced Topics](service-fabric-application-upgrade-advanced.md)

[Troubleshooting Application Upgrade ](service-fabric-application-upgrade-troubleshooting.md)
