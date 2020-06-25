---
title: Advanced Application Upgrade Topics
description: This article covers some advanced topics pertaining to upgrading a Service Fabric application.

ms.topic: conceptual
ms.date: 03/11/2020
---
# Service Fabric application upgrade: Advanced topics

## Add or remove service types during an application upgrade

If a new service type is added to a published application as part of an upgrade, then the new service type is added to the deployed application. Such an upgrade does not affect any of the service instances that were already part of the application, but an instance of the service type that was added must be created for the new service type to be active (see [New-ServiceFabricService](https://docs.microsoft.com/powershell/module/servicefabric/new-servicefabricservice?view=azureservicefabricps)).

Similarly, service types can be removed from an application as part of an upgrade. However, all service instances of the to-be-removed service type must be removed before proceeding with the upgrade (see [Remove-ServiceFabricService](https://docs.microsoft.com/powershell/module/servicefabric/remove-servicefabricservice?view=azureservicefabricps)).

## Avoid connection drops during stateless service planned downtime

For planned stateless instance downtimes, such as application/cluster upgrade or node deactivation, connections can get dropped as the exposed endpoint is removed after the instance goes down, which results in forceful connection closures.

To avoid this, configure the *RequestDrain* feature by adding an *instance close delay duration* in the service configuration to allow existing requests from within the cluster to drain on the exposed endpoints. This is achieved as the endpoint advertised by the stateless instance is removed *before* the delay starts prior to closing the instance. This delay enables existing requests to drain gracefully before the instance actually goes down. Clients are notified of the endpoint change by a callback function at the time of starting the delay, so that they can re-resolve the endpoint and avoid sending new requests to the instance which is going down. These requests could be originating from clients using [Reverse Proxy](https://docs.microsoft.com/azure/service-fabric/service-fabric-reverseproxy) or using service endpoint resolution api's with the notification model ([ServiceNotificationFilterDescription](https://docs.microsoft.com/dotnet/api/system.fabric.description.servicenotificationfilterdescription)) for updating the endpoints.

### Service configuration

There are several ways to configure the delay on the service side.

 * **When creating a new service**, specify a `-InstanceCloseDelayDuration`:

    ```powershell
    New-ServiceFabricService -Stateless [-ServiceName] <Uri> -InstanceCloseDelayDuration <TimeSpan>
    ```

 * **While defining the service in the defaults section in the application manifest**, assign the `InstanceCloseDelayDurationSeconds` property:

    ```xml
          <StatelessService ServiceTypeName="Web1Type" InstanceCount="[Web1_InstanceCount]" InstanceCloseDelayDurationSeconds="15">
              <SingletonPartition />
          </StatelessService>
    ```

 * **When updating an existing service**, specify a `-InstanceCloseDelayDuration`:

    ```powershell
    Update-ServiceFabricService [-Stateless] [-ServiceName] <Uri> [-InstanceCloseDelayDuration <TimeSpan>]`
    ```

 * **When creating or updating an existing service through the ARM template**, specify the `InstanceCloseDelayDuration` value (minimum supported API version: 2019-11-01-preview):

    ```ARM template to define InstanceCloseDelayDuration of 30seconds
    {
      "apiVersion": "2019-11-01-preview",
      "type": "Microsoft.ServiceFabric/clusters/applications/services",
      "name": "[concat(parameters('clusterName'), '/', parameters('applicationName'), '/', parameters('serviceName'))]",
      "location": "[variables('clusterLocation')]",
      "dependsOn": [
        "[concat('Microsoft.ServiceFabric/clusters/', parameters('clusterName'), '/applications/', parameters('applicationName'))]"
      ],
      "properties": {
        "provisioningState": "Default",
        "serviceKind": "Stateless",
        "serviceTypeName": "[parameters('serviceTypeName')]",
        "instanceCount": "-1",
        "partitionDescription": {
          "partitionScheme": "Singleton"
        },
        "serviceLoadMetrics": [],
        "servicePlacementPolicies": [],
        "defaultMoveCost": "",
        "instanceCloseDelayDuration": "00:00:30.0"
      }
    }
    ```

### Client configuration

To receive notification when an endpoint has changed, clients should register a callback see [ServiceNotificationFilterDescription](https://docs.microsoft.com/dotnet/api/system.fabric.description.servicenotificationfilterdescription).
The change notification is an indication that the endpoints have changed, the client should re-resolve the endpoints, and not use the endpoints which are not advertised anymore, as they will go down soon.

### Optional upgrade overrides

In addition to setting default delay durations per service, you can also override the delay during application/cluster upgrade using the same (`InstanceCloseDelayDurationSec`) option:

```powershell
Start-ServiceFabricApplicationUpgrade [-ApplicationName] <Uri> [-ApplicationTypeVersion] <String> [-InstanceCloseDelayDurationSec <UInt32>]

Start-ServiceFabricClusterUpgrade [-CodePackageVersion] <String> [-ClusterManifestVersion] <String> [-InstanceCloseDelayDurationSec <UInt32>]
```

The overridden delay duration only applies to the invoked upgrade instance and does not otherwise change individual service delay configurations. For example, you can use this to specify a delay of `0` in order to skip any preconfigured upgrade delays.

> [!NOTE]
> * The settings to drain requests will not be able to prevent the Azure Load balancer from sending new requests to the endpoints which are undergoing drain.
> * A complaint based resolution mechanism will not result in graceful draining of requests, as it triggers a service resolution after a failure. As described earlier, this should instead be enhanced to subscribe to the endpoint change notifications using [ServiceNotificationFilterDescription](https://docs.microsoft.com/dotnet/api/system.fabric.description.servicenotificationfilterdescription).
> * The settings are not honored when the upgrade is an impactless one i.e when the replicas will not be brought down during the upgrade.
>
>

> [!NOTE]
> This feature can be configured in existing services using Update-ServiceFabricService cmdlet or the ARM template as mentioned above, when the cluster code version is 7.1.XXX or above.
>
>

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

## Upgrade application parameters independently of version

Sometimes, it is desirable to change the parameters of a Service Fabric application without changing the manifest version. This can be done conveniently by using the **-ApplicationParameter** flag with the **Start-ServiceFabricApplicationUpgrade** Azure Service Fabric PowerShell cmdlet. Assume a Service Fabric application with the following properties:

```PowerShell
PS C:\> Get-ServiceFabricApplication -ApplicationName fabric:/Application1

ApplicationName        : fabric:/Application1
ApplicationTypeName    : Application1Type
ApplicationTypeVersion : 1.0.0
ApplicationStatus      : Ready
HealthState            : Ok
ApplicationParameters  : { "ImportantParameter" = "1"; "NewParameter" = "testBefore" }
```

Now, upgrade the application using the **Start-ServiceFabricApplicationUpgrade** cmdlet. This example shows an monitored upgrade, but an unmonitored upgrade can also be used. To see a full description of flags accepted by this cmdlet, see the [Azure Service Fabric PowerShell module reference](/powershell/module/servicefabric/start-servicefabricapplicationupgrade?view=azureservicefabricps#parameters)

```PowerShell
PS C:\> $appParams = @{ "ImportantParameter" = "2"; "NewParameter" = "testAfter"}

PS C:\> Start-ServiceFabricApplicationUpgrade -ApplicationName fabric:/Application1 -ApplicationTypeVers
ion 1.0.0 -ApplicationParameter $appParams -Monitored

```

After upgrading, confirm that the application has the updated parameters and the same version:

```PowerShell
PS C:\> Get-ServiceFabricApplication -ApplicationName fabric:/Application1

ApplicationName        : fabric:/Application1
ApplicationTypeName    : Application1Type
ApplicationTypeVersion : 1.0.0
ApplicationStatus      : Ready
HealthState            : Ok
ApplicationParameters  : { "ImportantParameter" = "2"; "NewParameter" = "testAfter" }
```

## Roll back application upgrades

While upgrades can be rolled forward in one of three modes (*Monitored*, *UnmonitoredAuto*, or *UnmonitoredManual*), they can only be rolled back in either *UnmonitoredAuto* or *UnmonitoredManual* mode. Rolling back in *UnmonitoredAuto* mode works the same way as rolling forward with the exception that the default value of *UpgradeReplicaSetCheckTimeout* is different - see [Application Upgrade Parameters](service-fabric-application-upgrade-parameters.md). Rolling back in *UnmonitoredManual* mode works the same way as rolling forward - the rollback will suspend itself after completing each UD and must be explicitly resumed using [Resume-ServiceFabricApplicationUpgrade](https://docs.microsoft.com/powershell/module/servicefabric/resume-servicefabricapplicationupgrade?view=azureservicefabricps) to continue with the rollback.

Rollbacks can be triggered automatically when the health policies of an upgrade in *Monitored* mode with a *FailureAction* of *Rollback* are violated (see [Application Upgrade Parameters](service-fabric-application-upgrade-parameters.md)) or explicitly using [Start-ServiceFabricApplicationRollback](https://docs.microsoft.com/powershell/module/servicefabric/start-servicefabricapplicationrollback?view=azureservicefabricps).

During rollback, the value of *UpgradeReplicaSetCheckTimeout* and the mode can still be changed at any time using [Update-ServiceFabricApplicationUpgrade](https://docs.microsoft.com/powershell/module/servicefabric/update-servicefabricapplicationupgrade?view=azureservicefabricps).

## Next steps
[Upgrading your Application Using Visual Studio](service-fabric-application-upgrade-tutorial.md) walks you through an application upgrade using Visual Studio.

[Upgrading your Application Using Powershell](service-fabric-application-upgrade-tutorial-powershell.md) walks you through an application upgrade using PowerShell.

Control how your application upgrades by using [Upgrade Parameters](service-fabric-application-upgrade-parameters.md).

Make your application upgrades compatible by learning how to use [Data Serialization](service-fabric-application-upgrade-data-serialization.md).

Fix common problems in application upgrades by referring to the steps in [Troubleshooting Application Upgrades](service-fabric-application-upgrade-troubleshooting.md).
