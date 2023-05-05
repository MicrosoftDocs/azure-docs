---
title: Service Fabric application upgrade 
description: This article provides an introduction to upgrading a Service Fabric application, including choosing upgrade modes and performing health checks.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Service Fabric application upgrade
An Azure Service Fabric application is a collection of services. During an upgrade, Service Fabric compares the new [application manifest](service-fabric-application-and-service-manifests.md) with the previous version and determines which services in the application require updates. Service Fabric compares the version in the service manifests with the version in the previous version. If the service version has not changed, that service will not be upgraded.

> [!NOTE]
> [ApplicationParameter](/dotnet/api/system.fabric.description.applicationdescription.applicationparameters#System_Fabric_Description_ApplicationDescription_ApplicationParameters)s are not preserved across an application upgrade. In order to preserve current application parameters, the user should get the parameters first and pass them into the upgrade API call like below:
```powershell
$myApplication = Get-ServiceFabricApplication -ApplicationName fabric:/myApplication
$appParamCollection = $myApplication.ApplicationParameters

$applicationParameterMap = @{}
foreach ($pair in $appParamCollection)
{
    $applicationParameterMap.Add($pair.Name, $pair.Value);
}

Start-ServiceFabricApplicationUpgrade -ApplicationName fabric:/myApplication -ApplicationTypeVersion 2.0.0 -ApplicationParameter $applicationParameterMap -Monitored -FailureAction Rollback
```

## Rolling upgrades overview
In a rolling application upgrade, the upgrade is performed in stages. At each stage, the upgrade is applied to a subset of nodes in the cluster, called an update domain. As a result, the application remains available throughout the upgrade. During the upgrade, the cluster may contain a mix of the old and new versions.

For that reason, the two versions must be forward and backward compatible. If they are not compatible, the application administrator is responsible for staging a multiple-phase upgrade to maintain availability. In a multiple-phase upgrade, the first step is upgrading to an intermediate version of the application that is compatible with the previous version. The second step is to upgrade the final version that breaks compatibility with the pre-update version, but is compatible with the intermediate version.

Update domains are specified in the cluster manifest when you configure the cluster. Update domains do not receive updates in a particular order. An update domain is a logical unit of deployment for an application. Update domains allow the services to remain at high availability during an upgrade.

Non-rolling upgrades are possible if the upgrade is applied to all nodes in the cluster, which is the case when the application has only one update domain. This approach is not recommended, since the service goes down and isn't available at the time of upgrade. Additionally, Azure doesn't provide any guarantees when a cluster is set up with only one update domain.

After the upgrade completes, all the services and replicas(instances) would stay in the same version-i.e., if the upgrade succeeds, they will be updated to the new version; if the upgrade fails and is rolled back, they would be rolled back to the old version.

## Health checks during upgrades
For an upgrade, health policies have to be set (or default values may be used). An upgrade is termed successful when all update domains are upgraded within the specified time-outs, and when all update domains are deemed healthy.  A healthy update domain means that the update domain passed all the health checks specified in the health policy. For example, a health policy may mandate that all services within an application instance must be *healthy*, as health is defined by Service Fabric.

Health policies and checks during upgrade by Service Fabric are service and application agnostic. That is, no service-specific tests are done.  For example, your service might have a throughput requirement, but Service Fabric does not have the information to check throughput. Refer to the [health articles](service-fabric-health-introduction.md) for the checks that are performed. The checks that happen during an upgrade include tests for whether the application package was copied correctly, whether the instance was started, and so on.

The application health is an aggregation of the child entities of the application. In short, Service Fabric evaluates the health of the application through the health that is reported on the application. It also evaluates the health of all the services for the application this way. Service Fabric further evaluates the health of the application services by aggregating the health of their children, such as the service replica. Once the application health policy is satisfied, the upgrade can proceed. If the health policy is violated, the application upgrade fails.

## Upgrade modes
The mode that we recommend for application upgrade is the monitored mode, which is the commonly used mode. Monitored mode performs the upgrade on one update domain, and if all health checks pass (per the policy specified), moves on to the next update domain automatically.  If health checks fail and/or time-outs are reached, the upgrade is either rolled back for the update domain, or the mode is changed to unmonitored manual. You can configure the upgrade to choose one of those two modes for failed upgrades. 

Unmonitored manual mode needs manual intervention after every upgrade on an update domain, to kick off the upgrade on the next update domain. No Service Fabric health checks are performed. The administrator performs the health or status checks before starting the upgrade in the next update domain.

## Upgrade default services
Some default service parameters defined in the [application manifest](service-fabric-application-and-service-manifests.md) can also be upgraded as part of an application upgrade. Only the service parameters that support being changed through [Update-ServiceFabricService](/powershell/module/servicefabric/update-servicefabricservice) can be changed as part of an upgrade. The behavior of changing default services during application upgrade is as follows:

1. Default services in the new application manifest that do not already exist in the cluster are created.
2. Default services that exist in both the previous and new application manifests are updated. The parameters of the default service in the new application manifest overwrite the parameters of the existing service. The application upgrade will rollback automatically if updating a default service fails.
3. Default services that do not exist in the new application manifest are deleted if they exist in the cluster. **Note that deleting a default service will result in deleting all that service's state and cannot be undone.**

When an application upgrade is rolled back, default service parameters are reverted back to their old values before the upgrade started but deleted services cannot be re-created with their old state.

> [!TIP]
> The [EnableDefaultServicesUpgrade](service-fabric-cluster-fabric-settings.md) cluster config setting must be *true* to enable rules 2) and 3) above (default service update and deletion). This feature is supported starting in Service Fabric version 5.5.

## Upgrading multiple applications with HTTPS endpoints
You need to be careful not to use the **same port** for different instances of the same application when using HTTP**S**. The reason is that Service Fabric won't be able to upgrade the cert for one of the application instances. For example, if application 1 or application 2 both want to upgrade their cert 1 to cert 2. When the upgrade happens, Service Fabric might have cleaned up the cert 1 registration with http.sys even though the other application is still using it. To prevent this, Service Fabric detects that there is already another application instance registered on the port with the certificate (due to http.sys) and fails the operation.

Hence Service Fabric does not support upgrading two different services using **the same port** in different application instances. In other words, you cannot use the same certificate on different services on the same port. If you need to have a shared certificate on the same port, you need to ensure that the services are placed on different machines with placement constraints. Or consider using Service Fabric dynamic ports if possible for each service in each application instance. 

If you see an upgrade fail with https, an error warning saying "The Windows HTTP Server API does not support multiple certificates for applications that share a port.”

## Application upgrade flowchart
The flowchart following this paragraph can help you understand the upgrade process of a Service Fabric application. In particular, the flow describes how the time-outs, including *HealthCheckStableDuration*, *HealthCheckRetryTimeout*, and *UpgradeHealthCheckInterval*, help control when the upgrade in one update domain is considered a success or a failure.

![The upgrade process for a Service Fabric Application][image]

## Next steps
[Upgrading your Application Using Visual Studio](service-fabric-application-upgrade-tutorial.md) walks you through an application upgrade using Visual Studio.

[Upgrading your Application Using PowerShell](service-fabric-application-upgrade-tutorial-powershell.md) walks you through an application upgrade using PowerShell.

Control how your application upgrades by using [Upgrade Parameters](service-fabric-application-upgrade-parameters.md).

Make your application upgrades compatible by learning how to use [Data Serialization](service-fabric-application-upgrade-data-serialization.md).

Learn how to use advanced functionality while upgrading your application by referring to [Advanced Topics](service-fabric-application-upgrade-advanced.md).

Fix common problems in application upgrades by referring to the steps in [Troubleshooting Application Upgrades](service-fabric-application-upgrade-troubleshooting.md).

[image]: media/service-fabric-application-upgrade/service-fabric-application-upgrade-flowchart.png
