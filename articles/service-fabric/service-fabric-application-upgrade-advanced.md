---
title: Advanced Application Upgrade Topics | Microsoft Docs
description: This article covers some advanced topics pertaining to upgrading a Service Fabric application.
services: service-fabric
documentationcenter: .net
author: mani-ramaswamy
manager: chackdan
editor: ''

ms.assetid: e29585ff-e96f-46f4-a07f-6682bbe63281
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 2/23/2018
ms.author: subramar

---
# Service Fabric application upgrade: advanced topics
## Adding or removing service types during an application upgrade
If a new service type is added to a published application as part of an upgrade, then the new service type is added to the deployed application. Such an upgrade does not affect any of the service instances that were already part of the application, but an instance of the service type that was added must be created for the new service type to be active (see [New-ServiceFabricService](https://docs.microsoft.com/powershell/module/servicefabric/new-servicefabricservice?view=azureservicefabricps)).

Similarly, service types can be removed from an application as part of an upgrade. However, all service instances of the to-be-removed service type must be removed before proceeding with the upgrade (see [Remove-ServiceFabricService](https://docs.microsoft.com/powershell/module/servicefabric/remove-servicefabricservice?view=azureservicefabricps)).

## Manual upgrade mode
> [!NOTE]
> The *Monitored* upgrade mode is recommended for all Service Fabric upgrades.
> The *UnmonitoredManual* upgrade mode should only be considered for failed or suspended upgrades. 
>
>

In *Monitored* mode, Service Fabric applies health policies to ensure that the application is healthy as the upgrade progresses. If health policies are violated, then the upgrade is either suspended or automatically rolled back depending on the specified *FailureAction*.

In *UnmonitoredManual* mode, the application administrator has total control over the progression of the upgrade. This mode is useful when applying custom health evaluation policies or performing non-conventional upgrades to bypass health monitoring completely (e.g. the application is already in data loss). An upgrade running in this mode will suspend itself after completing each UD and must be explicitly resumed using [Resume-ServiceFabricApplicationUpgrade](https://docs.microsoft.com/powershell/module/servicefabric/resume-servicefabricapplicationupgrade?view=azureservicefabricps). When an upgrade is suspended and ready to be resumed by the user, its upgrade state will show *RollforwardPending* (see [UpgradeState](https://docs.microsoft.com/dotnet/api/system.fabric.applicationupgradestate?view=azure-dotnet)).

Finally, the *UnmonitoredAuto* mode is useful for performing fast upgrade iterations during service development or testing since no user input is required and no application health policies are evaluated.

## Upgrade with a diff package
Instead of provisioning a complete application package, upgrades can also be performed by provisioning diff packages that contain only the updated code/config/data packages along with the complete application manifest and complete service manifests. Complete application packages are only required for the initial installation of an application to the cluster. Subsequent upgrades can either be from complete application packages or diff packages.  

Any reference in the application manifest or service manifests of a diff package that can't be found in the application package is automatically replaced with the currently provisioned version.

Scenarios for using a diff package are:

* When you have a large application package that references several service manifest files and/or several code packages, config packages, or data packages.
* When you have a deployment system that generates the build layout directly from your application build process. In this case, even though the code hasn't changed, newly built assemblies get a different checksum. Using a full application package would require you to update the version on all code packages. Using a diff package, you only provide the files that changed and the manifest files where the version has changed.

When an application is upgraded using Visual Studio, a diff package is published automatically. To create a diff package manually, the application manifest and the service manifests must be updated, but only the changed packages should be included in the final application package.

For example, let's start with the following application (version numbers provided for ease of understanding):

```text
app1           1.0.0
  service1     1.0.0
    code       1.0.0
    config     1.0.0
  service2     1.0.0
    code       1.0.0
    config     1.0.0
```

Let's assume you wanted to update only the code package of service1 using a diff package. Your updated application has the following version changes:

```text
app1           2.0.0      <-- new version
  service1     2.0.0      <-- new version
    code       2.0.0      <-- new version
    config     1.0.0
  service2     1.0.0
    code       1.0.0
    config     1.0.0
```

In this case, you update the application manifest to 2.0.0 and the service manifest for service1 to reflect the code package update. The folder for your application package would have the following structure:

```text
app1/
  service1/
    code/
```

In other words, create a complete application package normally, then remove any code/config/data package folders for which the version has not changed.

## Rolling back application upgrades

While upgrades can be rolled forward in one of three modes (*Monitored*, *UnmonitoredAuto*, or *UnmonitoredManual*), they can only be rolled back in either *UnmonitoredAuto* or *UnmonitoredManual* mode. Rolling back in *UnmonitoredAuto* mode works the same way as rolling forward with the exception that the default value of *UpgradeReplicaSetCheckTimeout* is different - see [Application Upgrade Parameters](service-fabric-application-upgrade-parameters.md). Rolling back in *UnmonitoredManual* mode works the same way as rolling forward - the rollback will suspend itself after completing each UD and must be explicitly resumed using [Resume-ServiceFabricApplicationUpgrade](https://docs.microsoft.com/powershell/module/servicefabric/resume-servicefabricapplicationupgrade?view=azureservicefabricps) to continue with the rollback.

Rollbacks can be triggered automatically when the health policies of an upgrade in *Monitored* mode with a *FailureAction* of *Rollback* are violated (see [Application Upgrade Parameters](service-fabric-application-upgrade-parameters.md)) or explicitly using [Start-ServiceFabricApplicationRollback](https://docs.microsoft.com/powershell/module/servicefabric/start-servicefabricapplicationrollback?view=azureservicefabricps).

During rollback, the value of *UpgradeReplicaSetCheckTimeout* and the mode can still be changed at any time using [Update-ServiceFabricApplicationUpgrade](https://docs.microsoft.com/powershell/module/servicefabric/update-servicefabricapplicationupgrade?view=azureservicefabricps).

## Next steps
[Upgrading your Application Using Visual Studio](service-fabric-application-upgrade-tutorial.md) walks you through an application upgrade using Visual Studio.

[Upgrading your Application Using Powershell](service-fabric-application-upgrade-tutorial-powershell.md) walks you through an application upgrade using PowerShell.

Control how your application upgrades by using [Upgrade Parameters](service-fabric-application-upgrade-parameters.md).

Make your application upgrades compatible by learning how to use [Data Serialization](service-fabric-application-upgrade-data-serialization.md).

Fix common problems in application upgrades by referring to the steps in [Troubleshooting Application Upgrades](service-fabric-application-upgrade-troubleshooting.md).
