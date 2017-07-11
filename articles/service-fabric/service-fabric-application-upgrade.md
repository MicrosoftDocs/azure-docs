---
title: Service Fabric application upgrade | Microsoft Docs
description: This article provides an introduction to upgrading a Service Fabric application, including choosing upgrade modes and performing health checks.
services: service-fabric
documentationcenter: .net
author: mani-ramaswamy
manager: timlt
editor: ''

ms.assetid: 803c9c63-373a-4d6a-8ef2-ea97e16e88dd
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 6/28/2017
ms.author: subramar

---
# Service Fabric application upgrade
An Azure Service Fabric application is a collection of services. During an upgrade, Service Fabric compares the new [application manifest](service-fabric-application-model.md#describe-an-application) with the previous version and determines which services in the application require updates. Service Fabric compares the version numbers in the service manifests with the version numbers in the previous version. If a service has not changed, that service is not upgraded.

## Rolling upgrades overview
In a rolling application upgrade, the upgrade is performed in stages. At each stage, the upgrade is applied to a subset of nodes in the cluster, called an update domain. As a result, the application remains available throughout the upgrade. During the upgrade, the cluster may contain a mix of the old and new versions.

For that reason, the two versions must be forward and backward compatible. If they are not compatible, the application administrator is responsible for staging a multiple-phase upgrade to maintain availability. In a multiple-phase upgrade, the first step is upgrading to an intermediate version of the application that is compatible with the previous version. The second step is to upgrade the final version that breaks compatibility with the pre-update version, but is compatible with the intermediate version.

Update domains are specified in the cluster manifest when you configure the cluster. Update domains do not receive updates in a particular order. An update domain is a logical unit of deployment for an application. Update domains allow the services to remain at high availability during an upgrade.

Non-rolling upgrades are possible if the upgrade is applied to all nodes in the cluster, which is the case when the application has only one update domain. This approach is not recommended, since the service goes down and isn't available at the time of upgrade. Additionally, Azure doesn't provide any guarantees when a cluster is set up with only one update domain.

## Health checks during upgrades
For an upgrade, health policies have to be set (or default values may be used). An upgrade is termed successful when all update domains are upgraded within the specified time-outs, and when all update domains are deemed healthy.  A healthy update domain means that the update domain passed all the health checks specified in the health policy. For example, a health policy may mandate that all services within an application instance must be *healthy*, as health is defined by Service Fabric.

Health policies and checks during upgrade by Service Fabric are service and application agnostic. That is, no service-specific tests are done.  For example, your service might have a throughput requirement, but Service Fabric does not have the information to check throughput. Refer to the [health articles](service-fabric-health-introduction.md) for the checks that are performed. The checks that happen during an upgrade include tests for whether the application package was copied correctly, whether the instance was started, and so on.

The application health is an aggregation of the child entities of the application. In short, Service Fabric evaluates the health of the application through the health that is reported on the application. It also evaluates the health of all the services for the application this way. Service Fabric further evaluates the health of the application services by aggregating the health of their children, such as the service replica. Once the application health policy is satisfied, the upgrade can proceed. If the health policy is violated, the application upgrade fails.

## Upgrade modes
The mode that we recommend for application upgrade is the monitored mode, which is the commonly used mode. Monitored mode performs the upgrade on one update domain, and if all health checks pass (per the policy specified), moves on to the next update domain automatically.  If health checks fail and/or time-outs are reached, the upgrade is either rolled back for the update domain, or the mode is changed to unmonitored manual. You can configure the upgrade to choose one of those two modes for failed upgrades. 

Unmonitored manual mode needs manual intervention after every upgrade on an update domain, to kick off the upgrade on the next update domain. No Service Fabric health checks are performed. The administrator performs the health or status checks before starting the upgrade in the next update domain.

## Upgrade default services
Default services within Service Fabric application can be upgraded during the upgrade process of an application. Default services are defined in the [application manifest](service-fabric-application-model.md#describe-an-application). The standard rules of upgrading default services are:

1. Default services in the new [application manifest](service-fabric-application-model.md#describe-an-application) that do not exist in the cluster are created.
> [!TIP]
> [EnableDefaultServicesUpgrade](service-fabric-cluster-fabric-settings.md#fabric-settings-that-you-can-customize) needs to be set to true to enable the following rules. This feature is supported from v5.5.

2. Default services existing in both previous [application manifest](service-fabric-application-model.md#describe-an-application) and new version are updated. Service descriptions in the new version would overwrite those already in the cluster. Application upgrade would rollback automatically upon updating default service failure.
3. Default services in the previous [application manifest](service-fabric-application-model.md#describe-an-application) but not in the new version are deleted. **Note that this deleting default services can not be reverted.**

In case of an application upgrade is rolled back, default services are reverted to the status before upgrade started. But deleted services can never be created.

## Application upgrade flowchart
The flowchart following this paragraph can help you understand the upgrade process of a Service Fabric application. In particular, the flow describes how the time-outs, including *HealthCheckStableDuration*, *HealthCheckRetryTimeout*, and *UpgradeHealthCheckInterval*, help control when the upgrade in one update domain is considered a success or a failure.

![The upgrade process for a Service Fabric Application][image]

## Next steps
[Upgrading your Application Using Visual Studio](service-fabric-application-upgrade-tutorial.md) walks you through an application upgrade using Visual Studio.

[Upgrading your Application Using Powershell](service-fabric-application-upgrade-tutorial-powershell.md) walks you through an application upgrade using PowerShell.

Control how your application upgrades by using [Upgrade Parameters](service-fabric-application-upgrade-parameters.md).

Make your application upgrades compatible by learning how to use [Data Serialization](service-fabric-application-upgrade-data-serialization.md).

Learn how to use advanced functionality while upgrading your application by referring to [Advanced Topics](service-fabric-application-upgrade-advanced.md).

Fix common problems in application upgrades by referring to the steps in [Troubleshooting Application Upgrades](service-fabric-application-upgrade-troubleshooting.md).

[image]: media/service-fabric-application-upgrade/service-fabric-application-upgrade-flowchart.png
