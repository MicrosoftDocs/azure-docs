---
title: Azure Service Fabric Hosting activation and deactivation lifecycle 
description: Explains the lifecycle of Application and ServicePackage on a node  
author: tugup

ms.topic: conceptual
ms.date: 05/1/2020
ms.author: tugup
---
# Azure Service Fabric hosting lifecycle
This article provides an overview of events that happen when a application is activated on a node and various cluster level configs used to control the behavior.

Before proceeding further, be sure that you understand the various concepts and relationships explained in [Model an application in Service Fabric][a1]. 

> [!NOTE]
> In this article, unless explicitly mentioned as meaning something different:
>
> - *Replica* refers to both a Replica of a stateful service and an instance of a stateless service.
> - *CodePackage* is treated as equivalent to a *ServiceHost* process that registers a *ServiceType*, and hosts Replicas of services of that *ServiceType*.
>

## Cluster Configs

Configs with defaults impacting the activation/decativation. Their impacts will be discussed in details in the article ahead.

### ServiceType
**ServiceTypeDisableFailureThreshold**: Default 1. The threshold for the failure count after which FM is notified to disable the service type on that node and try a different node for placement.
**ServiceTypeDisableGraceInterval**: Default 30 sec. Time interval after which the service type can be disabled.

### Activation
**ActivationRetryBackoffInterval**: Default 10 sec. Backoff interval on every activation failure.
**ActivationMaxFailureCount**: Default 20. This is the maximum count for which system will retry failed activation before giving up. 
**ActivationRetryBackoffExponentiationBase**: Default 1.5. 
**ActivationMaxRetryInterval**: Default 3600 sec. Max back-off for Activation on failures.
**CodePackageContinuousExitFailureResetInterval**: Default 300 sec. The timeout to reset the continuous exit failure count for CodePackage.

### Download
**DeploymentRetryBackoffInterval**: Default 10. Back-off interval for the deployment failure.
**DeploymentMaxRetryInterval**: Default 3600 sec. Max back-off for the deployment on failures.
**DeploymentMaxFailureCount**: Default 20. Application deployment will be retried for DeploymentMaxFailureCount times before failing the deployment of that application on the node.

## Deactivation
**DeactivationScanInterval**: Default 600 sec. The minimum time given to SP to host a replica if it has never hosted any replica i.e if it is unused.
**DeactivationGraceInterval**: Default 60 sec. The time given to a SP to host a replica once it has hosted any replica in case of **Shared** Process model.
**ExclusiveModeDeactivationGraceInterval**: Default 1 sec. The time given to a SP to host a replica once it has hosted any replica in case of **Exclusive** Process model.

## Activation of Application/ServicePackage

The pipeline for activation is as follows:

1. Download the ApplicationPackage. This includes files for ex: ApplicationManifest.xml etc.
2. Setup environment for Application for ex: create users etc.
3. Create an entry in Deactivator to track the Application entity.
4. Download ServicePackage. This includes files like: ServicePackage.xml, code, config, dat packages etc.
5. Setup environment for Service Package for ex: setup firewall, allocate ports for dynamic endpoints etc.
6. Create an entry in Deactivator to track the ServicePackage entity. 
7. Start your CodePackage.

### ServiceType Disabling
In SF, when activation/download operation encounters errors or CodePackage crashes, it schedules the ServiceType to be disabled on that node depending on two other hosting configs **ServiceTypeDisableFailureThreshold** and **ServiceTypeDisableGraceInterval**. So first activation/downlaod failure or CodePackage crash should trigger ServiceTypeDisabled to be scheduled. The **ServiceTypeDisableGraceInterval** config determines the grace interval after which ServiceType is finally marked as disabled on that node. Note, that for all this to happen activation/download/CodePackage restart should still be in retrying mode and being tracked by Hosting SubSystem. 

ServiceType will be enabled back on the node 
- If activation succeeds or reaches **ActivationMaxFailureCount** retries upon failure.
- If download succeeds or reaches **DeploymentMaxFailureCount** retries upon failure.
- If a CodePackage that has crashed, starts back up and registers the ServiceType again.

> [!NOTE]
> If your CodePackage which is a watchdog is crashing, then it doesn't impact the ServiceType. Only the CodePackage hosting a Replica crash will impact the ServcieType.

### CodePackage crash
When a CodePackage crashes SF, uses a back-off which is calculated:

The value is  always Min(RetryTime , **ActivationMaxRetryInterval**) and this value can be constant, linear or exponential based on **ActivationRetryBackoffExponentiationBase** config.

- Constant : If **ActivationRetryBackoffExponentiationBase** == 0 then RetryTime = **ActivationRetryBackoffInterval**;
- Linear :  If  **ActivationRetryBackoffExponentiationBase** == 0  then RetryTime = ContinuousFailureCount* **ActivationRetryBackoffInterval** where ContinousFailureCount is the number of times a CodePackage crashes or fails to activate.
- Exponential : RetryTime = (**ActivationRetryBackoffInterval** in seconds) * (**ActivationRetryBackoffExponentiationBase** ^ ContinuousFailureCount);
	
You can control the behavior as you want like quick restarts. Let's talk about Linear. That means if a CodePackage crashes then the start interval will be after 10, 20, 30 40 sec till the CodePackage is deactivated. 
	
Your CodePackage can MAX back-off for **ActivationMaxRetryInterval**.
	
If your CodePackage crashes and comes back up, it needs to stay up for **CodePackageContinuousExitFailureResetInterval** for SF to consider it as healthy at which point it will overwrite the health report as OK and reset the ContinousFailureCount.

### Activation Failure
SF always uses a linear back-off (same as CodePackage crash) when it encounters error during activation. This means that the activation operation will give up after (0+ 10 + 20 + 30 + 40) = 100 sec (first retry is immediate). After this activation is not retried and operation is untracked.
	
Your activation can max backoff for **ActivationMaxRetryInterval** and can retry for **ActivationMaxFailureCount**.

### Download Failure
SF always uses a linear back-off when it encounters error during download. This means that the activation operation will give up after (0+ 10 + 20 + 30 + 40) = 100 sec (first retry is immediate). After this download is not retried and operation is untracked. The lineroff back-off for download is equal to ContinuousFailureCount***DeploymentRetryBackoffInterval** and can max back-off to **DeploymentMaxRetryInterval**. Like activations, download opertaion can retry for **ActivationMaxFailureCount**.

> [!NOTE]
> Before you change the configs, here are a few examples you should keep in mind.

1. In case of CodePackage crashes because the CodePackage keeps crashing and backs off, you will see ServiceType disabled. But if the activations config is such that it has a quick restart then the CodePackage can come up for a few times before it can see the disable of ServiceType. For ex: assume your CodePackage comes up and registers the ServiceType with us and then crashes. In that case, once Hosting receives a type registration the **ServiceTypeDisableGraceInterval** period is cancelled. And this can repeat until your CodePackage backs offs to a value greater than  **ServiceTypeDisableGraceInterval**. So, it may be a while before your ServiceType is disabled on the node.

2. In case of activations, when SF system needs to place a Replica on a node, it asks Hosting SubSystem to activate the application and retries the activation request every 15 sec(**RAPMessageRetryInterval**). For SF system to know that ServiceType has been disabled, the activation operation in hosting needs to live for a longer period than retry interval and **ServiceTypeDisableGraceInterval**. For example: let the cluster has the configs **ActivationMaxFailureCount** set to 5 and **ActivationRetryBackoffInterval** set to 1 sec. This means that the activation operation will give up after (0 + 1 + 2 + 3 + 4) = 10 sec (first retry is immediate). After this Hostinng gives up retrying and activation operation is untracked. In this case, the activation operation will get completed and untracked before next retry after 15 seconds. This happened because SF exhausted all retries within 15 seconds. Hence, every retry created a new activation operation in Hosting SubSystem and the pattern will keep repeating and ServiceType will never be disabled on the node. Since the ServiceType will not get disabled on the node Sf System's component FM(FailoverManager) will not move the Replica to a different node.
> 

## Deactivation

When a ServicePackage(SP) is activated on a node, Deactivator keeps track of it. Based on the activation mode [Exclusive/Shared][a2], when Deactivator finds a SP it schedules it for deactivation after **DeactivationGraceInterval** for SharedMode or **ExclusiveModeDeactivationGraceInterval** for ExclusiveMode.

The Deactivator works in two ways:

1.	Periodically:  At every **DeactivationScanInterval** it check for ServicePackages which has NEVER hosted a Replica. .
2.	ReplicaClose: If a Replica is closed, Deactivator gets a DecrementUsageCount. If the count goes to 0 that means the SP is not hosting any Replica and hence it schedules it for deactivation after **DeactivationGraceInterval**/**ExclusiveModeDeactivationGraceInterval**.

### Periodically:
Example 1: Let’s say the Deactivator does a scan at Time T1. It’s next scan will be at T1+X(**DeactivationScanInterval**). Assume a SP activation happened at T1+1. This SP is not hosting a Replica and hence needs to be deactivated. For the SP to be a candidate for deactivation it needs to be in the state of no Replica for atleast X time. That means, it will be eligible for deactivation at T1+1+X. So, the scan at T1+X won’t find this SP as a candidate for deactivation. The next deactivation cycle T1+ 2X will schedule this SP for deactivation because now it has been in no Replica state for time X.  

Example 2: Let’s say a SP gets activated at T1–1 and Deactivator does a scan at T1. The SP doesn’t host a Replica. Then at next scan T1+X this SP will be found as a candidate for deactivation and hence will be scheduled for deactivation.  

Example 3: Let’s say a SP gets activated at T1–1 and Deactivator does a scan at T1. The SP doesn’t host a Replica Yet. Now at T1+1 a Replica get’s placed, i.e Hosting gets an IncrementUsageCount which means a Replica is created. Now at T1+X this SP will not be scheduled for deactivation. Now, the deactivation will move the ReplicaClose logic explained below.

Example 4: Let's say your SP is really big, like 10GB, then it can take a bit of time to download on the node. Once an application is activated, the Deactivator tracks it's lifecycle. Now, if you have the **DeactivationScanInterval** config really small then you may run into issues where your ServicePackage is not getting time to activate on the node because all the time went into downloading. To overcome this problem, you can [pre-download the SP on the node][p1]. 

> [!NOTE]
> So a SP can get deactivated anywhere between (**DeactivationScanInterval** To 2***DeactivationScanInterval**) + **DeactivationGraceInterval**/**ExclusiveModeDeactivationGraceInterval**. 
>

### Replica Close:
Deactivator keeps count of Replicas that a SP holds. If a SP is holding a Replica and the Replica is closed/down, Hosting gets a DecrementUsageCount. When a Replica is opened Hosting gets an IncrementUsageCount. The Decrement means that this SP is now hosting one less Replica. If the count drops to 0 then the SP is scheduled for deactivation and the time after which it will be deactivated is **DeactivationGraceInterval**/**ExclusiveModeDeactivationGraceInterval**. 

For ex: let’s say a Decrement happens at T1 and SP is scheduled to deactivate at T1+Y(**DeactivationGraceInterval**/**ExclusiveModeDeactivationGraceInterval**). If during, this time Hosting gets an IncrementUsage meaning a Replica is created then this deactivation is cancelled.

> [!NOTE]
>So what does these config basically means:
**DeactivationGraceInterval**/**ExclusiveModeDeactivationGraceInterval**: The time given to a SP to host a Replica once it has hosted any Replica. 
**DeactivationScanInterval**: The time given to SP to host a Replica if it has NEVER hosted any Replica i.e if it is unused.
>

### Ctrl+C
Once a SP passes the **DeactivationGraceInterval**/**ExclusiveModeDeactivationGraceInterval** and is still not hosting a Replica, the deactivation is non-cancellable. CodePackage are issued a Ctrl+C handler which means that now the deactivation pipleline has to go through to bring the process down. 
During this time if a new Replica for the same SP is trying to get places it will fail because we cannot transition from Deactivation to Activation.

## Next steps
[Package an application][a3] and get it ready to deploy.

[Deploy and remove applications][a4]. This article describes how to use PowerShell to manage application instances.

<!--Link references--In actual articles, you only need a single period before the slash-->
[a1]: service-fabric-application-model.md
[a2]: service-fabric-hosting-model.md
[a3]: service-fabric-package-apps.md
[a4]: service-fabric-deploy-remove-applications.md

[p1]: https://docs.microsoft.com/powershell/module/servicefabric/copy-servicefabricservicepackagetonode
