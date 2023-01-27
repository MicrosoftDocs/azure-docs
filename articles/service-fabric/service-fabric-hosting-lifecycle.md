---
title: Azure Service Fabric hosting activation and deactivation life cycle 
description: Learn about the life cycle of an application and a ServicePackage on a node. 
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Azure Service Fabric hosting life cycle

This article provides an overview of events that happen in Azure Service Fabric when an application is activated on a node. It explains various cluster configurations that control the behavior.

Before you continue, be sure that you understand the concepts and relationships explained in [Model an application in Service Fabric][a1]. 

> [!NOTE]
> This article uses some terminology in specialized ways. Unless otherwise noted:
>
> - *Replica* refers to both a replica of a stateful service and an instance of a stateless service.
> - *CodePackage* is treated as equivalent to a ServiceHost process that registers a ServiceType. It hosts Replicas of services of that ServiceType.
>

## Activate an ApplicationPackage or ServicePackage

To activate an ApplicationPackage or ServicePackage:

1. Download the ApplicationPackage (for example, *ApplicationManifest.xml*).
2. Set up an environment for the application. Your steps include, for example, creating users.
3. Start tracking the application for deactivation.
4. Download the ServicePackage (for example, *ServiceManifest.xml*, code, configuration files, and data packages).
5. Set up an environment for the ServicePackage. Your steps include, for example, setting up a firewall and allocating ports for endpoints.
6. Start tracking the ServicePackage for deactivation.
7. Start the SetupEntryPoint for the CodePackages and wait for it to finish.
8. Start the MainEntryPoint for the CodePackages.

### ServiceType blocklisting
`ServiceTypeDisableFailureThreshold` determines the number of allowed activation, download, and CodePackage failures. After the threshold is reached, the ServiceType is scheduled for blocklisting. The first activation failure, download failure, or CodePackage crash schedules the ServiceType blocklisting. 

The `ServiceTypeDisableGraceInterval` configuration determines the grace interval before ServiceType is blocklisted on the node. As this process plays out, activation, download, and CodePackage restart are retried in parallel. Retrying means, for example, that the CodePackage is scheduled to start again after the crash or Service Fabric will try to download packages again.

When ServiceType is blocklisted, you see a health error: `'System.Hosting' reported Error for property 'ServiceTypeRegistration:ServiceType'. The ServiceType was disabled on the node.`

ServiceType is enabled again on the node if any of the following events happens:
- Activation succeeds. Or if it fails, it reaches the `ActivationMaxFailureCount` maximum number of retries.
- Download succeeds. Or if it fails, it reaches the `DeploymentMaxFailureCount` maximum number of retries.
- A CodePackage that has crashed starts and successfully registers the ServiceType.

`ActivationMaxFailureCount` and `DeploymentMaxFailureCount` are the maximum number of attempts Service Fabric will make to activate or download an application on a node. After the maximum is reached, Service Fabric enables the ServiceType for activation again. 

These thresholds give the service another opportunity for activation. If activation succeeds, the issue is automatically healed. 

A newly placed or activated Replica can trigger a new activation or download operation. This action will either succeed or trigger the ServiceType blocklisting again.

> [!NOTE]
> A crashing CodePackage that doesn't register a ServiceType  doesn't affect the ServiceType. Only a crashing CodePackage that hosts a Replica affects the ServiceType.
>

### CodePackage crash
When a CodePackage crashes, Service Fabric uses a backoff to start it again. The backoff is applied regardless of whether the CodePackage has registered a type with the Service Fabric runtime.

The backoff value is `Min(RetryTime, ActivationMaxRetryInterval)`. The value is incremented in constant, linear, or exponential amounts based on the `ActivationRetryBackoffExponentiationBase` configuration setting:

- **Constant**: If `ActivationRetryBackoffExponentiationBase == 0`, then `RetryTime = ActivationRetryBackoffInterval`.
- **Linear**:  If  `ActivationRetryBackoffExponentiationBase == 0`, then `RetryTime = ContinuousFailureCount ActivationRetryBackoffInterval`, where `ContinuousFailureCount` is the number of times a CodePackage crashes or fails to activate.
- **Exponential**: `RetryTime = (ActivationRetryBackoffInterval in seconds) * (ActivationRetryBackoffExponentiationBase ^ ContinuousFailureCount)`.
	
You can control the behavior by changing the values. For example, if you want several quick restart attempts, you can use linear amounts by setting `ActivationRetryBackoffExponentiationBase` to `0` and setting `ActivationRetryBackoffInterval` to `10`. So if a CodePackage crashes, the start interval will be after 10 seconds. If the package continues to crash, the backoff changes to 20 seconds, 30 seconds, 40 seconds, and so on, until the CodePackage activation succeeds or the CodePackage is deactivated. 
	
The maximum amount of time that Service Fabric backs off (that is, waits) after a failure is governed by `ActivationMaxRetryInterval`.
	
If your CodePackage crashes and comes back up, it needs to stay up for time period specified by `CodePackageContinuousExitFailureResetInterval`. After this interval, Service Fabric considers the CodePackage healthy. Service Fabric then overwrites the prior error health report as OK and resets the `ContinuousFailureCount`.

### CodePackage not registering ServiceType
If a CodePackage stays up and is expected to register a ServiceType but doesn't, Service Fabric generates a warning health report after the `ServiceTypeRegistrationTimeout`. The report indicates that ServiceType hasn't been registered within the expected amount of time.

### Activation failure
When Service Fabric finds an error during activation, it always uses a linear backoff, as it does with a CodePackage crash. The activation operation gives up after retries at these intervals: (0 + 10 + 20 + 30 + 40) = 100 seconds. (The first retry is immediate.) After this sequence, activation isn't retried.
	
The maximum activation backoff can be `ActivationMaxRetryInterval`. The retry can be `ActivationMaxFailureCount`.

### Download failure
Service Fabric always uses a linear backoff when it finds an error during a download. The activation operation gives up after retries at these intervals: (0 + 10 + 20 + 30 + 40) = 100 seconds. (The first retry is immediate.) After this sequence, the download isn't retried. 

The linear backoff for a download is equal to `ContinuousFailureCount` * `DeploymentRetryBackoffInterval`. The maximum backoff can be `DeploymentMaxRetryInterval`. Like activations, download operations can retry for the `ActivationMaxFailureCount` limit.

> [!NOTE]
> Before you change these settings, keep in mind the following examples:
>
>* If the CodePackage keeps crashing and backing off, the ServiceType will be disabled. But if the activation configuration has a quick restart, then the CodePackage can come up a few times before the ServiceType is actually blocklisted. 
>
>    For example, let's say your CodePackage comes up, registers the ServiceType with Service Fabric, and then crashes. In that case, after hosting receives a type registration, the `ServiceTypeDisableGraceInterval` period is canceled. This process can repeat until your CodePackage backs off to a value greater than the `ServiceTypeDisableGraceInterval` period. Then the ServiceType will be blocklisted on the node. The ServiceType blocklisting might take longer than you expect.
>
>* In case of activations, when a Service Fabric system needs to place a Replica on a node, the reconfiguration agent asks the hosting subsystem to activate the application. It retries the activation request every 15 seconds. (The duration is governed by the `RAPMessageRetryInterval` configuration setting.) Service Fabric can't know that the ServiceType has been blocklisted unless the activation operation in hosting is up for a longer period than the retry interval and the `ServiceTypeDisableGraceInterval`. 
>
>    For example, assume the cluster's `ActivationMaxFailureCount` is set to 5, and `ActivationRetryBackoffInterval` is set to 1 second. In this case, the activation operation gives up after intervals of (0 + 1 + 2 + 3 + 4) = 10 seconds. (The first retry is immediate.) After this sequence, hosting gives up retrying. The activation operation finishes and won't retry after 15 seconds. 
>
>    Service Fabric has exhausted all of the allowed retries within 15 seconds. So every retry from the reconfiguration agent creates a new activation operation in the hosting subsystem, and the pattern keeps repeating. As a result, the ServiceType is never blocklisted on the node. Because the ServiceType won't be blocklisted on the node, the Replica won't be moved and tried on a different node.
> 

## Deactivation

When a ServicePackage is activated on a node, it's tracked for deactivation. Deactivation works in two ways:

- **Periodic deactivation**:  At every `DeactivationScanInterval`, the system checks for service packages that have *never* hosted a Replica and marks them as candidates for deactivation.
- **ReplicaClose deactivation**: If a Replica is closed, the deactivator gets a `DecrementUsageCount`. A count is at 0 when the ServicePackage doesn't host any Replica, so the ServicePackage is a candidate for deactivation.

The activation mode determines when candidates are scheduled for deactivation. In shared mode, candidates for deactivation are scheduled after the `DeactivationGraceInterval`. In exclusive mode, they're scheduled after the `ExclusiveModeDeactivationGraceInterval`. If a new Replica placement arrives between these times, the deactivation is canceled. 

For more information, see [Exclusive mode and shared mode][a2].

### Periodic deactivation
Here are some examples of periodic deactivation:

* **Example 1**: Let's say the deactivator starts a scan at time T (the `DeactivationScanInterval`). Its next scan will be at 2T. Assume a ServicePackage activation happened at T + 1. This ServicePackage doesn't host a Replica, so it needs to be deactivated. 

    To be a candidate for deactivation, the ServicePackage needs to host no Replica for at least T time. It will be eligible for deactivation at 2T + 1. So the scan at 2T won't identify this ServicePackage as a candidate for deactivation. 

    The next deactivation cycle, 3T, will schedule this ServicePackage for deactivation because now the package has been in a no-Replica state for time T.  

* **Example 2**: Let's say a ServicePackage gets activated at time T - 1, and the deactivator starts a scan at T. The ServicePackage doesn't host a Replica. At the next scan, 2T, the ServicePackage will be identified as a candidate for deactivation, so it will be scheduled for deactivation.  

* **Example 3**: Let's say a ServicePackage gets activated at T – 1, and the deactivator starts a scan at T. The ServicePackage doesn't host a Replica yet. Now at T + 1, a Replica gets placed. That is, hosting gets an `IncrementUsageCount`, which means a Replica is created. 

    At 2T, this ServicePackage won't be scheduled for deactivation. Because the package contains a Replica, deactivation will follow the ReplicaClose logic, as the next section in this article explains.

* **Example 4**: Let's say your ServicePackage is 10 GB. Because the package is large, it takes time to download on the node. When an application is activated, the deactivator tracks its life cycle. If the `DeactivationScanInterval` is set to a small value, your ServicePackage might not have time to activate on the node because of the time it took to download. To overcome this problem, you can [download the ServicePackage in advance on the node][p1] or increase the `DeactivationScanInterval`. 

> [!NOTE]
> A ServicePackage can get deactivated anywhere between (`DeactivationScanInterval` to 2 * `DeactivationScanInterval`) + `DeactivationGraceInterval`/`ExclusiveModeDeactivationGraceInterval`. 
>

### ReplicaClose deactivation

> [!NOTE]
> This section refers to the following configuration settings:
> - **DeactivationGraceInterval**/**ExclusiveModeDeactivationGraceInterval**: The time given to a ServicePackage to host another Replica if it has already hosted any Replica. 
> - **DeactivationScanInterval**: The minimum time given to a ServicePackage to host a Replica if it has *never* hosted any Replica, that is, if it has not been used.
>

The system keeps count of the Replicas that a ServicePackage holds. If a ServicePackage is holding a Replica and the Replica is closed or down, hosting gets a `DecrementUsageCount`. When a Replica is opened, hosting gets an `IncrementUsageCount`. 

The decrement indicates that the number of Replicas that the ServicePackage is hosting has been reduced by one Replica. When the count drops to 0, the ServicePackage is scheduled for deactivation. The time after which it will be deactivated is `DeactivationGraceInterval`/`ExclusiveModeDeactivationGraceInterval`. 

For example, let's say that a decrement happens at T, and the ServicePackage is scheduled to deactivate at 2T + X (`DeactivationGraceInterval`/`ExclusiveModeDeactivationGraceInterval`). During this time, if hosting gets an `IncrementUsage` because a Replica is created, the deactivation is canceled.

### Ctrl + C
If a ServicePackage passes the `DeactivationGraceInterval`/`ExclusiveModeDeactivationGraceInterval` and is still not hosting a Replica, the deactivation can't be canceled. CodePackages receive a Ctrl + C handler. So now the deactivation pipeline has to finish to bring the process down. 

During this time, if a new Replica for the same ServicePackage is trying to get placed, it will fail because the process can't transition from deactivation to activation.

## Cluster configurations

This section lists configurations that have defaults that affect activation and deactivation.

### ServiceType
- **ServiceTypeDisableFailureThreshold**: Default: 1. Threshold for the failure count; after this threshold is reached, FailoverManager is notified to disable the service type on the node and try a different node for placement.
- **ServiceTypeDisableGraceInterval**: Default: 30 seconds. Time interval after which the service type can be disabled.
- **ServiceTypeRegistrationTimeout**: Default: 300 seconds. Timeout for the ServiceType to register with Service Fabric.

### Activation
- **ActivationRetryBackoffInterval**: Default: 10 seconds. Backoff interval for every activation failure.
- **ActivationMaxFailureCount**: Default: 20. Maximum count for which the system will retry a failed activation before giving up. 
- **ActivationRetryBackoffExponentiationBase**: Default: 1.5.
- **ActivationMaxRetryInterval**: Default: 3,600 seconds. Maximum backoff retry interval for activation after failures.
- **CodePackageContinuousExitFailureResetInterval**: Default: 300 seconds. Timeout interval to reset the continuous exit failure count for the CodePackage.

### Download
- **DeploymentRetryBackoffInterval**: Default: 10. Backoff interval for the deployment failure.
- **DeploymentMaxRetryInterval**: Default: 3,600 seconds. Maximum backoff interval for the deployment after failures.
- **DeploymentMaxFailureCount**: Default: 20. Application deployment will be retried for `DeploymentMaxFailureCount` times before failing the deployment of that application on the node.

### Deactivation
- **DeactivationScanInterval**: Default: 600 seconds. Minimum time given to the ServicePackage to host a Replica if it has never hosted any Replica (that is, if it isn't used).
- **DeactivationGraceInterval**: Default: 60 seconds. In a *shared* process model, the time given to a ServicePackage to again host another Replica after it has already hosted any Replica.
- **ExclusiveModeDeactivationGraceInterval**: Default: 1 second. In an *exclusive* process model, the time given to a ServicePackage to again host another Replica after it has already hosted any Replica.

## Next steps

- [Package an application][a3] and get it ready to deploy.
- [Deploy and remove applications][a4] in PowerShell.

<!--Link references--In actual articles, you only need a single period before the slash-->
[a1]: service-fabric-application-model.md
[a2]: service-fabric-hosting-model.md
[a3]: service-fabric-package-apps.md
[a4]: service-fabric-deploy-remove-applications.md

[p1]: /powershell/module/servicefabric/copy-servicefabricservicepackagetonode
