---
title: Azure Service Fabric hosting activation and deactivation life cycle 
description: Learn about the life cycle of Application and ServicePackage on a node. 
author: tugup

ms.topic: conceptual
ms.date: 05/01/2020
ms.author: tugup
---
# Azure Service Fabric hosting life cycle

This article provides an overview of events that happen in Azure Service Fabric when an application is activated on a node. It explains various cluster configurations that are used to control the behavior.

Before you proceed, be sure that you understand the various concepts and relationships explained in [Model an application in Service Fabric][a1]. 

> [!NOTE]
> This article uses some terminology in specific ways. Unless otherwise noted:
>
> - *Replica* refers to both a replica of a stateful service and an instance of a stateless service.
> - *CodePackage* is treated as equivalent to a ServiceHost process that registers a ServiceType. It hosts replicas of services of that ServiceType.
>

## Activate an application or service package

To activate an application or service package:

1. Download the application package (for example, *ApplicationManifest.xml*).
2. Set up an environment for the application. Your steps include, for example, creating users.
3. Start tracking the application for deactivation.
4. Download the service package (for example, *ServiceManifest.xml*, code, configuration files, and data packages).
5. Set up an environment for the service package. Your steps include, for example, setting up a firewall and allocating ports for endpoints.
6. Start tracking the service package for deactivation.
7. Start the `SetupEntryPoint` for the code packages and wait for completion.
8. Start the `MainEntryPoint` for the code packages.

### ServiceType blocklisting
`ServiceTypeDisableFailureThreshold` determines the number of allowed activation, download, and CodePackage failures. After the threshold is reached, the ServiceType is scheduled for blocklisting. The first activation failure, download failure, or CodePackage crash schedules the ServiceType blocklisting. 

The `ServiceTypeDisableGraceInterval` configuration determines the grace interval before ServiceType is marked as blocklisted on the node. As this process plays out, activation, download, and CodePackage restart are retried in parallel. Retrying means, for example, that CodePackage is scheduled to start again after the crash or Service Fabric will try to download packages again.

When ServiceType is blocklisted, you see a health error: `'System.Hosting' reported Error for property 'ServiceTypeRegistration:ServiceType'. The ServiceType was disabled on the node.`

ServiceType is enabled again on the node if any of the following events happens:
- Activation succeeds. Or if it fails, it reaches the `ActivationMaxFailureCount` maximum number of retries.
- Download succeeds. Or if it fails, it reaches the `DeploymentMaxFailureCount` maximum number of retries.
- A CodePackage that has crashed starts and successfully registers the ServiceType.

`ActivationMaxFailureCount` and `DeploymentMaxFailureCount` are the maximum number of attempts Service Fabric will make to activate or download an application on a node. After the maximum is reached, Service Fabric enables the ServiceType for activation again. 

These thresholds give the service another opportunity for activation. If it succeeds, the issue is automatically healed. 

A newly placed or activated replica can trigger a new activation or download operation. This action will either succeed or trigger the ServiceType blocklisting again.

> [!NOTE]
> A crashing CodePackage that doesn't register a ServiceType  doesn't affect the ServiceType. Only a crashing CodePackage that hosts a replica affects the ServiceType.
>

### CodePackage crash
When a CodePackage crashes, Service Fabric uses a backoff to start it again. The backoff is independent of whether the code package has registered a type with the Service Fabric runtime.

The backoff value is `Min(RetryTime, ActivationMaxRetryInterval)`. The value is incremented in constant, linear, or exponential amounts based on the `ActivationRetryBackoffExponentiationBase` configuration setting:

- **Constant**: If `ActivationRetryBackoffExponentiationBase == 0` then `RetryTime = ActivationRetryBackoffInterval`.
- **Linear**:  If  `ActivationRetryBackoffExponentiationBase == 0` then `RetryTime = ContinuousFailureCount ActivationRetryBackoffInterval`, where `ContinousFailureCount` is the number of times a CodePackage crashes or fails to activate.
- **Exponential**: `RetryTime = (ActivationRetryBackoffInterval in seconds) * (ActivationRetryBackoffExponentiationBase ^ ContinuousFailureCount)`.
	
You can control the behavior by changing the values. For example, if you want several quick restart attempts, you can use linear amounts by setting `ActivationRetryBackoffExponentiationBase` to `0` and setting `ActivationRetryBackoffInterval` to `10`. So if a CodePackage crashes, the start interval will be after 10 seconds. If the package continues to crash, the backoff changes to 20 seconds, 30 seconds, 40 seconds, and so on, until the CodePackage activation succeeds or the code package is deactivated. 
	
The maximum amount of time that Service Fabric backs off (that is, waits) after a failure is governed by `ActivationMaxRetryInterval`.
	
If your CodePackage crashes and comes back up, it needs to stay up for time period specified by `CodePackageContinuousExitFailureResetInterval`. After this interval, Service Fabric considers the CodePackage healthy. Service Fabric then overwrites the prior error health report as OK and resets the `ContinousFailureCount`.

### CodePackage not registering ServiceType
If a CodePackage stays up and is expected to register a ServiceType but doesn't, Service Fabric generates a warning HealthReport after the `ServiceTypeRegistrationTimeout`. The report indicates that ServiceType has not been registered within the expected amount of time.

### Activation failure
Service Fabric always uses a linear back-off (same as CodePackage crash) when it finds error during activation. This means that the activation operation will give up after (0 + 10 + 20 + 30 + 40) = 100 sec (first retry is immediate). After this activation is not retried.
	
Max Activation backoff can be **ActivationMaxRetryInterval** and retry **ActivationMaxFailureCount**.

### Download failure
Service Fabric always uses a linear back-off when it encounters error during download. This means that the activation operation will give up after (0+ 10 + 20 + 30 + 40) = 100 sec (first retry is immediate). After this, the download is not retried. The linear back-off for download is equal to ContinuousFailureCount***DeploymentRetryBackoffInterval** and can max back-off to **DeploymentMaxRetryInterval**. Like activations, download operation can retry for **ActivationMaxFailureCount**.

> [!NOTE]
> Before you change these settings, here are a few examples you should keep in mind.
>
>* If the CodePackage keeps crashing and backs off, the ServiceType will be disabled. But if the activation configuration is such that it has a quick restart then the CodePackage can come up a few times before the ServiceType is actually blocklisted. For ex: assume your CodePackage comes up, registers the ServiceType with Service Fabric and then crashes. In that case, once Hosting receives a type registration the **ServiceTypeDisableGraceInterval** period is canceled. And this can repeat until your CodePackage backs offs to a value greater than  **ServiceTypeDisableGraceInterval** and then ServiceType will be blocklisted on the node. It maytake longer than you expect to see the ServiceType blocklisted.
>
>* In case of activations, when Service Fabric system needs to place a Replica on a node, the RA (ReconfigurationAgent) asks Hosting subSystem to activate the application and retries the activation request every 15 seconds (governed by the **RAPMessageRetryInterval** configuration setting). For Service Fabric to know that the ServiceType has been blocklisted, the activation operation in hosting needs to live for a longer period than the retry interval and the **ServiceTypeDisableGraceInterval**. For example: assume the cluster has **ActivationMaxFailureCount** set to 5 and **ActivationRetryBackoffInterval** set to 1 second. This means that the activation operation will give up after (0 + 1 + 2 + 3 + 4) = 10 seconds (recall that the first retry is immediate) and after that Hosting gives up retrying. In this case, the activation operation will get completed and will not retry after 15 seconds. This happens because Service Fabric exhausted all the allowed retries within 15 seconds. So, every retry from ReconfigurationAgent creates a new activation operation in Hosting subSystem and the pattern will keep repeating. As a result, the ServiceType will never be blocklisted on the node. Since the ServiceType will not get blocklisted on the node, the Replica will not be moved and tried on a different node.
> 

## Deactivation

When a ServicePackage is activated on a node, it is tracked for deactivation. 

Deactivation works in two ways:

- Periodically:  At every **DeactivationScanInterval**, it checks for ServicePackages that have NEVER hosted a Replica and marks them as candidates for deactivation.
- ReplicaClose: If a Replica is closed, Deactivator gets a DecrementUsageCount. If the count goes to 0, it means the ServicePackage is not hosting any Replica and hence is a candidate for deactivation.

 Based on the activation mode [Exclusive/Shared][a2], the candidates for deactivation are scheduled after the **DeactivationGraceInterval** for SharedMode and after the **ExclusiveModeDeactivationGraceInterval** for ExclusiveMode. If a new replica placement comes in in between this time, the deactivation is canceled.

### Periodically
Let's discuss some examples of periodic deactivation:

Example 1: Let’s say the Deactivator does a scan at Time T(**DeactivationScanInterval**). Its next scan will be at 2T. Assume a ServicePackage activation happened at T+1. This ServicePackage is not hosting a Replica and hence needs to be deactivated. For the ServicePackage to be a candidate for deactivation, it needs to be in the state of no Replica for atleast T time. That means, it will be eligible for deactivation at 2T+1. So, the scan at 2T won’t find this ServicePackage as a candidate for deactivation. The next deactivation cycle 3T will schedule this ServicePackage for deactivation because now it has been in no Replica state for time T.  

Example 2: Let’s say a ServicePackage gets activated at time T-1 and Deactivator does a scan at T. The ServicePackage doesn’t host a Replica. Then at next scan 2T this ServicePackage will be found as a candidate for deactivation and hence will be scheduled for deactivation.  

Example 3: Let’s say a ServicePackage gets activated at T–1 and Deactivator does a scan at T. The ServicePackage doesn’t host a Replica yet. Now at T+1 a Replica gets placed, i.e Hosting gets an IncrementUsageCount, which means a Replica is created. Now at 2T this ServicePackage will not be scheduled for deactivation. Because it contains a replica, deactivation will move to the ReplicaClose logic explained below.

Example 4: Let's say your ServicePackage is large, say 10 GB, and can take a bit of time to download on the node. Once an application is activated, the Deactivator tracks its life cycle. Now, if you have the **DeactivationScanInterval** config set to a small value, you may run into issues where your ServicePackage is not getting time to activate on the node because all the time went into downloading. To overcome the problem, you can [pre-download the ServicePackage on the node][p1] or increase the **DeactivationScanInterval**. 

> [!NOTE]
> A ServicePackage can get deactivated anywhere between (**DeactivationScanInterval** To 2***DeactivationScanInterval**) + **DeactivationGraceInterval**/**ExclusiveModeDeactivationGraceInterval**. 
>

### Replica close
Deactivation keeps count of Replicas that a ServicePackage holds. If a ServicePackage is holding a Replica and the Replica is closed/down, Hosting gets a DecrementUsageCount. When a Replica is opened, Hosting gets an IncrementUsageCount. The Decrement means that the ServicePackage is now hosting one less Replica and when the count drops to 0, then the ServicePackage is scheduled for deactivation and the time after which it will be deactivated is **DeactivationGraceInterval**/**ExclusiveModeDeactivationGraceInterval**. 

For ex: let’s say a Decrement happens at T and ServicePackage is scheduled to deactivate at 2T+X(**DeactivationGraceInterval**/**ExclusiveModeDeactivationGraceInterval**). If during this time Hosting gets an IncrementUsage meaning a Replica is created then the deactivation is canceled.

> [!NOTE]
> What do these config settings means?
**DeactivationGraceInterval**/**ExclusiveModeDeactivationGraceInterval**: The time given to a ServicePackage to host again another Replica once it has hosted any Replica. 
**DeactivationScanInterval**: The minimum time given to ServicePackage to host a Replica if it has NEVER hosted any Replica i.e if not used.
>

### Ctrl+C
Once a ServicePackage passes the **DeactivationGraceInterval**/**ExclusiveModeDeactivationGraceInterval** and is still not hosting a Replica, the deactivation is non-cancellable. CodePackage are issued a Ctrl+C handler that means that now the deactivation pipeline has to go through to bring the process down. 
During this time if a new Replica for the same ServicePackage is trying to get placed it will fail because we cannot transition from Deactivation to Activation.

## Cluster configs

Configs with defaults impacting the activation/deactivation.

### ServiceType
**ServiceTypeDisableFailureThreshold**: Default 1. The threshold for the failure count after which FM(FailoverManager) is notified to disable the service type on that node and try a different node for placement.
**ServiceTypeDisableGraceInterval**: Default 30 sec. Time interval after which the service type can be disabled.
**ServiceTypeRegistrationTimeout**: Default 300 sec. The timeout for the ServiceType to register with Service Fabric.

### Activation
**ActivationRetryBackoffInterval**: Default 10 sec. Backoff interval on every activation failure.
**ActivationMaxFailureCount**: Default 20. Maximum count for which system will retry failed activation before giving up. 
**ActivationRetryBackoffExponentiationBase**: Default 1.5.
**ActivationMaxRetryInterval**: Default 3600 sec. Max back-off for Activation on failures.
**CodePackageContinuousExitFailureResetInterval**: Default 300 sec. The timeout to reset the continuous exit failure count for CodePackage.

### Download
**DeploymentRetryBackoffInterval**: Default 10. Back-off interval for the deployment failure.
**DeploymentMaxRetryInterval**: Default 3600 sec. Max back-off for the deployment on failures.
**DeploymentMaxFailureCount**: Default 20. Application deployment will be retried for DeploymentMaxFailureCount times before failing the deployment of that application on the node.

### Deactivation
**DeactivationScanInterval**: Default 600 sec. Minimum time given to ServicePackage to host a Replica if it has never hosted any Replica i.e if not used.
**DeactivationGraceInterval**: Default 60 sec. The time given to a ServicePackage to host again another Replica once it has hosted any Replica in case of **Shared** Process model.
**ExclusiveModeDeactivationGraceInterval**: Default 1 sec. The time given to a ServicePackage to host again another Replica once it has hosted any Replica in case of **Exclusive** Process model.

## Next steps
[Package an application][a3] and get it ready to deploy.

[Deploy and remove applications][a4]. This article describes how to use PowerShell to manage application instances.

<!--Link references--In actual articles, you only need a single period before the slash-->
[a1]: service-fabric-application-model.md
[a2]: service-fabric-hosting-model.md
[a3]: service-fabric-package-apps.md
[a4]: service-fabric-deploy-remove-applications.md

[p1]: /powershell/module/servicefabric/copy-servicefabricservicepackagetonode
