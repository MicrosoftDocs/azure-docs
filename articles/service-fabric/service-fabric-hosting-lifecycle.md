---
title: Azure Service Fabric Hosting activation and deactivation lifecycle 
description: Explains the lifecycle of Application and ServicePackage on a node  
author: tugup

ms.topic: conceptual
ms.date: 05/1/2020
ms.author: tugup
---
# Azure Service Fabric hosting lifecycle
This article provides an overview of events that happen when an application is activated on a node and various cluster configs used to control the behavior.

Before proceeding further, be sure that you understand the various concepts and relationships explained in [Model an application in Service Fabric][a1]. 

> [!NOTE]
> In this article, unless explicitly mentioned as meaning something different:
>
> - *Replica* refers to both a Replica of a stateful service and an instance of a stateless service.
> - *CodePackage* is treated as equivalent to a *ServiceHost* process that registers a *ServiceType*, and hosts Replicas of services of that *ServiceType*.
>

## Activation of Application/ServicePackage

The pipeline for activation is as follows:

1. Download the ApplicationPackage. For example: ApplicationManifest.xml etc.
2. Set up environment for Application for ex: create users etc.
3. Start tracking Application for deactivation.
4. Download ServicePackage. For example: ServiceManifest.xml, code, config, data packages etc.
5. Set up environment for Service Package for ex: setup firewall, allocate ports for endpoints etc.
6. Start tracking ServicePackage for deactivation.
7. Start SetupEntryPoint of CodePackages and wait for completion.
8. Start MainEntryPoint of CodePackages.

### ServiceType Blocklisting
**ServiceTypeDisableFailureThreshold** determines the number of failures (activation, download, CodePackage failures) after which the ServiceType is scheduled for blocklisting. So first activation/download failure, or CodePackage crash, should trigger schedule of ServiceType blocklisting. The **ServiceTypeDisableGraceInterval** config determines the grace interval after which ServiceType is finally marked as blocklisted on that node. Note, that for all this to happen activation/download/CodePackage restart should still be in retrying mode internally and being tracked by Hosting subSystem. Retrying, means for example: CodePackage will be scheduled to start again after the crash, or Service Fabric will try to download packages again.
Once blocklisted, you should see an error "'System.Hosting' reported Error for property 'ServiceTypeRegistration:ServiceType'. The ServiceType was disabled on the node."

ServiceType will be enabled back on the node 
- If activation operation succeeds or reaches **ActivationMaxFailureCount** retries upon failure.
- If download operation succeeds or reaches **DeploymentMaxFailureCount** retries upon failure.
- If a CodePackage that has crashed starts back up and successfully registers the ServiceType.

The reason for enabling the ServiceType again after **ActivationMaxFailureCount**/**DeploymentMaxFailureCount** retries is, they are the max attempts Service Fabric will perform to activate/download an application on a node. If it doesn't succeed, the current operation is not retried and since Service Fabric wants to give the service another opportunity for activation, which might succeed, resulting in the issue automatically healing, it is tied to the lifecycle of the activation/download operation. A new activation/download operation triggered by placement of a Replica can trigger the ServiceType blocklisting again or can succeed.

> [!NOTE]
> If your CodePackage which does not register a ServiceType is crashing, then it doesn't impact the ServiceType. Only the CodePackage hosting a Replica crash will impact the ServiceType.
>

### CodePackage crash
When a CodePackage crash, Service Fabric uses a back-off to start it again and the back-off is independent of whether the code package has registered a type with us or not.

Back-off value is always Min(RetryTime, **ActivationMaxRetryInterval**) and this value can be constant, linear, or exponential based on **ActivationRetryBackoffExponentiationBase** config.

- Constant: If **ActivationRetryBackoffExponentiationBase** == 0 then RetryTime = **ActivationRetryBackoffInterval**;
- Linear:  If  **ActivationRetryBackoffExponentiationBase** == 0  then RetryTime = ContinuousFailureCount* **ActivationRetryBackoffInterval** where ContinousFailureCount is the number of times a CodePackage crashes or fails to activate.
- Exponential: RetryTime = (**ActivationRetryBackoffInterval** in seconds) * (**ActivationRetryBackoffExponentiationBase** ^ ContinuousFailureCount);
	
You can control the behavior as you want like quick restarts. Let's talk about Linear. That means if a CodePackage crashes then the start interval will be after 10, 20, 30 40 sec until the CodePackage is deactivated. 
	
The maximum amount of time Service Fabric backs off (waits) after a failure is governed by the **ActivationMaxRetryInterval**
	
If your CodePackage crashes and comes back up, it needs to stay up for **CodePackageContinuousExitFailureResetInterval** for Service Fabric to consider it as healthy at which point it will overwrite the health report as OK and reset the ContinousFailureCount.

### CodePackage not registering ServiceType
If a CodePackage stays alive and is expected to register a ServiceType with us but never does, in that case Service Fabric will generate a warning HealthReport after **ServiceTypeRegistrationTimeout** saying that ServiceType has not being configured within the timeout.

### Activation Failure
Service Fabric always uses a linear back-off (same as CodePackage crash) when it finds error during activation. This means that the activation operation will give up after (0+ 10 + 20 + 30 + 40) = 100 sec (first retry is immediate). After this activation is not retried.
	
Max Activation backoff can be **ActivationMaxRetryInterval** and retry **ActivationMaxFailureCount**.

### Download Failure
Service Fabric always uses a linear back-off when it encounters error during download. This means that the activation operation will give up after (0+ 10 + 20 + 30 + 40) = 100 sec (first retry is immediate). After this download is not retried. The linear back-off for download is equal to ContinuousFailureCount***DeploymentRetryBackoffInterval** and can max back-off to **DeploymentMaxRetryInterval**. Like activations, download operation can retry for **ActivationMaxFailureCount**.

> [!NOTE]
> Before you change the configs, here are a few examples you should keep in mind.

* If the CodePackage keeps crashing and backs off, ServiceType will be disabled. But if the activations config is such that it has a quick restart then the CodePackage can come up for a few times before it can see the disable of ServiceType. For ex: assume your CodePackage comes up, registers the ServiceType with Service Fabric and then crashes. In that case, once Hosting receives a type registration the **ServiceTypeDisableGraceInterval** period is canceled. And this can repeat until your CodePackage backs offs to a value greater than  **ServiceTypeDisableGraceInterval** and then ServiceType will be disabled on the node. So, it may be a while before your ServiceType is disabled on the node.

* In case of activations, when Service Fabric system needs to place a Replica on a node, RA(ReconfigurationAgent) asks Hosting subSystem to activate the application and retries the activation request every 15 sec(**RAPMessageRetryInterval**). For Service Fabric system to know that ServiceType has been disabled, the activation operation in hosting needs to live for a longer period than retry interval and **ServiceTypeDisableGraceInterval**. For example: let the cluster has the configs **ActivationMaxFailureCount** set to 5 and **ActivationRetryBackoffInterval** set to 1 sec. It means that the activation operation will give up after (0 + 1 + 2 + 3 + 4) = 10 sec (first retry is immediate) and after that Hosting gives up retrying. In this case, the activation operation will get completed and will not retry after 15 seconds. It happened because Service Fabric exhausted all retries within 15 seconds. So, every retry from ReconfigurationAgent creates a new activation operation in Hosting subSystem and the pattern will keep repeating and ServiceType will never be disabled on the node. Since the ServiceType will not get disabled on the node Sf System's component FM(FailoverManager) will not move the Replica to a different node.
> 

## Deactivation

When a ServicePackage is activated on a node, it is tracked for deactivation. Deactivator is the entity that keeps track of it.
The Deactivator works in two ways:

1.	Periodically:  At every **DeactivationScanInterval**, it checks for ServicePackages, which have NEVER hosted a Replica and marks them as candidates for deactivation.
2.	ReplicaClose: If a Replica is closed, Deactivator gets a DecrementUsageCount. If the count goes to 0 that means the ServicePackage is not hosting any Replica and hence is a candidate for deactivation.

 Based on the activation mode [Exclusive/Shared][a2], the candidates for deactivation are scheduled after **DeactivationGraceInterval** for SharedMode / **ExclusiveModeDeactivationGraceInterval** for ExclusiveMode. If in between this time a new replica placement comes in then the deactivation is canceled.

### Periodically:
Example 1: Let’s say the Deactivator does a scan at Time T(**DeactivationScanInterval**). Its next scan will be at 2T. Assume a ServicePackage activation happened at T+1. This ServicePackage is not hosting a Replica and hence needs to be deactivated. For the ServicePackage to be a candidate for deactivation, it needs to be in the state of no Replica for atleast T time. That means, it will be eligible for deactivation at 2T+1. So, the scan at 2T won’t find this ServicePackage as a candidate for deactivation. The next deactivation cycle 3T will schedule this ServicePackage for deactivation because now it has been in no Replica state for time T.  

Example 2: Let’s say a ServicePackage gets activated at time T-1 and Deactivator does a scan at T. The ServicePackage doesn’t host a Replica. Then at next scan 2T this ServicePackage will be found as a candidate for deactivation and hence will be scheduled for deactivation.  

Example 3: Let’s say a ServicePackage gets activated at T–1 and Deactivator does a scan at T. The ServicePackage doesn’t host a Replica yet. Now at T+1 a Replica gets placed, i.e Hosting gets an IncrementUsageCount, which means a Replica is created. Now at 2T this ServicePackage will not be scheduled for deactivation. Now, the deactivation will move to the ReplicaClose logic explained below.

Example 4: Let's say your ServicePackage is large, like 10 GB, then it can take a bit of time to download on the node. Once an application is activated, the Deactivator tracks its lifecycle. Now, if you have the **DeactivationScanInterval** config small then you may run into issues where your ServicePackage is not getting time to activate on the node because all the time went into downloading. To overcome the problem, you can [pre-download the ServicePackage on the node][p1]. 

> [!NOTE]
> So a ServicePackage can get deactivated anywhere between (**DeactivationScanInterval** To 2***DeactivationScanInterval**) + **DeactivationGraceInterval**/**ExclusiveModeDeactivationGraceInterval**. 
>

### Replica Close:
Deactivator keeps count of Replicas that a ServicePackage holds. If a ServicePackage is holding a Replica and the Replica is closed/down, Hosting gets a DecrementUsageCount. When a Replica is opened, Hosting gets an IncrementUsageCount. The Decrement means that the ServicePackage is now hosting one less Replica and when the count drops to 0, then the ServicePackage is scheduled for deactivation and the time after which it will be deactivated is **DeactivationGraceInterval**/**ExclusiveModeDeactivationGraceInterval**. 

For ex: let’s say a Decrement happens at T and ServicePackage is scheduled to deactivate at 2T+X(**DeactivationGraceInterval**/**ExclusiveModeDeactivationGraceInterval**). If during this time Hosting gets an IncrementUsage meaning a Replica is created then the deactivation is canceled.

> [!NOTE]
>So what does these config basically means:
**DeactivationGraceInterval**/**ExclusiveModeDeactivationGraceInterval**: The time given to a ServicePackage to host again another Replica once it has hosted any Replica. 
**DeactivationScanInterval**: The minimum time given to ServicePackage to host a Replica if it has NEVER hosted any Replica i.e if not used.
>

### Ctrl+C
Once a ServicePackage passes the **DeactivationGraceInterval**/**ExclusiveModeDeactivationGraceInterval** and is still not hosting a Replica, the deactivation is non-cancellable. CodePackage are issued a Ctrl+C handler that means that now the deactivation pipeline has to go through to bring the process down. 
During this time if a new Replica for the same ServicePackage is trying to get placed it will fail because we cannot transition from Deactivation to Activation.

## Cluster Configs

Configs with defaults impacting the activation/decativation.

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

[p1]: https://docs.microsoft.com/powershell/module/servicefabric/copy-servicefabricservicepackagetonode
