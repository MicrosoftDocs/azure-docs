---
title: Control upgrade failure behavior with Azure Operator Service Manager
description: Learn about recovery behaviors including pause on failure and rollback on failure.
author: msftadam
ms.author: adamdor
ms.date: 03/06/2026
ms.topic: upgrade-and-migration-article
ms.service: azure-operator-service-manager
---

# Control upgrade failure behavior
This guide describes the Azure Operator Service Manager (AOSM) upgrade failure behavior features for container network functions (CNFs). For faster retries, use pause on failure. To return to the starting point, use rollback on failure.

## Pause on failure overview
Any upgrade using AOSM starts with a site network service (SNS) reput operation. The reput operation processes the network function applications (nfApps) found in the network function design version (NFDV). The reput operation implements the following default logic:
* A user initiates an SNS reput operation with pause-on-failure enabled.
* nfApps are processed following either `updateDependsOn` ordering, or in the sequential order they appear.
* If an nfApp install or upgrade operation fails, the atomic rollback setting for that operation and nfApp is honored.
* No prior completed NfApps are further operated upon.
* The task terminates and leaves the SNS resource in a failed state.

With pause on failure, AOSM rolls back only the failed nfApp, via the `testOptions`, `installOptions`, or `upgradeOptions` operation parameters. No action is taken on any nfApps proceeding the failed nfApp. This method allows the end user to troubleshoot the failed nfApp and then restart the upgrade from that point forward. As the default behavior, this method is the most efficient method, but may cause network function (NF) inconsistencies while in a mixed version state. 

### Upgrade successful
An upgrade is considered successful if all nfApps reach the desired target state without generating helm install or helm upgrade failures. In such conditions, Azure Operator Service Manager returns the following operational status and message:

```
  - Upgrade Succeeded
    - Provisioning State: Succeeded
    - Message: <empty>
```

### Upgrade unsuccessful
An upgrade is considered unsuccessful if any nfApp generates a helm install or helm upgrade failure. In such conditions, Azure Operator Service Manager returns the following operational status and message:

```
  - Upgrade Failed
    - Provisioning State: Succeeded
    - Message: Application(<ComponentName>) : <Failure Reason>
```

## Rollback on failure overview
To address risk of mismatched nfApp versions, Azure Operator Service Manager supports NF level rollback on failure. With this option enabled, if an nfApp operation fails, both the failed nfApp, and all prior completed nfApps, can be rolled back to initial version state. This method minimizes, or eliminates, the amount of time the NF is exposed to nfApp version mismatches. The optional rollback on failure feature works as follows:
* A user initiates an SNS reput operation with rollback on failure enabled.
* nfApps are processed following either `updateDependsOn` ordering, or in the sequential order they appear.
* Atomic state for all NfApps is forced to true, any operator provided values are ignored.
* A snapshot of the current nfApp versions is captured and stored.
* The snapshot is used to determine the individual nfApp actions taken to reverse actions that completed successfully.
  - `helm install` action on deleted components,
  - `helm rollback` action on upgraded components,
  - `helm delete` action on newly installed components
* If an nfApp install or upgrade operation fails, an atomic rollback of the failed nfApp is executed first.
* After the atomic rollback, the prior completed NfApps are restored to original snapshot version, with most recent actions reverted first.
* The task terminates and leaves the SNS resource in a failed state.

> [!NOTE]
> * AOSM doesn't create a snapshot if a user doesn't enable rollback on failure.
> * A rollback on failure only applies to the successfully completed nfApps.
> * An error with the atomic rollback isn't treated as a rollback failure.

### Upgrade successful
An upgrade is considered successful if all nfApps reach the desired target state without generating helm install or helm upgrade failures. In such conditions, Azure Operator Service Manager returns the following operational status and message:

```
  - Upgrade Succeeded
    - Provisioning State: Succeeded
    - Message: <empty>
```

### Rollback successful
A rollback is considered successful if all prior completed NfApps reached the original snapshot state without generating a helm rollback failure. In such conditions, Azure Operator Service Manager returns the following operational status and message:

```
  - Upgrade Failed, Rollback Succeeded
    - Provisioning State: Failed
    - Message: Application(<ComponentName>) : <Failure Reason>; Rollback succeeded
```

### Rollback unsuccessful
A rollback is considered unsuccessful if any prior completed nfApps fail to reach the original snapshot state, instead generating a helm rollback failure. In such conditions, Azure Operator Service Manager stops processing any further rollback-eligible nfApps and terminates with the following operational status and message:

```
  - Upgrade Failed, Rollback Failed
    - Provisioning State: Failed
    - Message: Application(<ComponentName>) : <Failure reason>; Rollback Failed (<RollbackComponentName>) : <Rollback Failure reason>
```

## Configure rollback on failure
The most flexible method to control failure behavior is to extend a new configuration group schema (CGS) parameter, `rollbackEnabled`, to allow for configuration group value (CGV) control via `roleOverrideValues` in the NF payload. First, define the CGS parameter: 
```
{
  "description": "NF configuration",
  "type": "object",
  "properties": {
    "nfConfiguration": {
      "type": "object",
      "properties": {
        "rollbackEnabled": {
          "type": "boolean"
        }
      },
      "required": [
        "rollbackEnabled"
      ]
    }
  }
}
```
> [!NOTE]
> * If the `nfConfiguration` isn't provided through the `roleOverrideValues` parameter, by default the rollback is disabled.

With the new `rollbackEnable` parameter defined, the Operator can now provide a run time value, under `roleOverrideValues`, as part of NF reput payload.
```
example:
{
  "location": "eastus",
  "properties": {
    // ...
    "roleOverrideValues": [
          "{\"nfConfiguration\":{\"rollbackEnabled\":true}}",
            "{\"name\":\"nfApp1\",\"deployParametersMappingRuleProfile\":{\"applicationEnablement\" : \"Disabled\"}}",
            "{\"name\":\"nfApp2\",\"deployParametersMappingRuleProfile\":{\"applicationEnablement\" : \"Disabled\"}}",
          //... other nfApps overrides
       ]
  }
}
```
> [!NOTE]
> * Each `roleOverrideValues` entry overrides the default behavior of the NfAapps.
> * If multiple entries of `nfConfiguration` are found in the `roleOverrideValues`, then the NF reput is returned as a bad request.

## Manage nfApps that don't support rollback
Almost all publishers report some nfApps that aren't compatible with helm rollback operations. These nfApps maybe sourced from third-parties who don't common support such strict resiliency requirements. These nfApps maybe related to database applications with complicated schema management requirements. In these cases, special consideration should be taken to deal with nfApps that don't support rollback.

* The strong preference is to push publishers to support helm rollback for all nfApps.
* nfApps that don't support rollback can't be skipped.
* nfApp rollback order can't change.
* Incremental-NFDV approach must be used in these situations.

### Selective rollback using incremental NFDVs
A network function’s composition often includes one, or more, nfApplications that can't support a helm rollback operation, such as Elastic or VoltDb. If a rollback is attempted on one of these nfApplications, the resulting nfApplication is broken. Pursuing publisher enhancements, to make these nfApplications rollback complaint is the best solution. Recognizing the potential for long publisher enhancement lead times, a method to prevent execution of rollback on selective nfApplications is needed. Selectively skipping rollback requires thorough testing with the network function owners as it resulting in transiet condition where multiple version permutation exist. 

#### Problem Statement
At the network function level, when nfRollbackEnabled is true, and a failure occurs during an upgrade or install, a rollback is executed across all nfApps which proceed the failure. This may include those which are rollback noncompliant. A selective rollback parameter is not supported. It introduces risk of an operational state that doesn't correspond to a defined NFDV. This state mismatch results in nondeterministic behavior, increases the testing surface significantly, and undermines the reliability guarantees of deployment processes. Instead we rely on NFDVs to ensure deterministic workload states that map to well-defined and tested deployment configurations.

#### Proposed Solution 
AOSM proposes that publishers should use a combination of skipUpgrade and nfRollbackEnabled configurations in CGVs, along with multiple NFDVs, to logically segment nfApplications based on rollback compatibility. This multi-NFDV strategy allows customers to bypass rollback for select charts while preserving safety for the rest. This approach is production-safe and aligns with existing AOSM mechanisms. This staged approach effectively simulates per-chart rollback behavior using NFDV-level constructs. Consider the following example where a network function is composed of 20 nfApps with five nfApps that don't support rollback.

* NFDV1
  * Performs initial install of all 20 charts with version v1.0.
  * In CGV1: rollbackEnabled: irrelevant (fresh install).
* NFDV2:
  * Contains all 20 charts but the five Helm charts without rollback support, upgraded to v2.0.
  * In CGV2:
    * Use skipUpgrade: true for the remaining 15 charts.
    * Set nfRollbackEnabled: false.
  * Result: 
    * Success: Only five charts upgrade
    * Failure:
      * No rollback if upgrade fails.
      * Due to chart limitations, the workload is left in a nondeterministic state. No rollback is possible. To recover, there are two options:
        * Upgrade with a working NFDV2
        * Upgrade with NFDV1 and skipUpgrade disabled for every nfApplication
* NFDV3:
  * Contains all charts but the 15 rollback-compatible charts upgraded to v2.0.
  * In CGV3:
    * Use skipUpgrade: true for the 5 charts already handled in NFDV2.
    * Set nfRollbackEnabled: true.
  * Result: Remaining 15 charts upgrade; rollback occurs on failure.

> [!NOTE]
> * The five rollback-incompatible charts must not have runtime upgrade dependencies on charts in NFDV3.
> * AOSM's rollback design assumes that rollback restores the workload state to the previous NFDV state.

This approach providers cleaner separation and manageability of applications not supporting standard helm operations. Maintains the operation’s idempotency and state on the cluster reflected by the last operation. NFDV 2/3 can directly be used for install operations as well (installation of previous version not needed) with any difference in goal state. Overall upgrade time and deployment reliability remain the same. 

## How to troubleshoot rollback on failure
### Understand pod states
Understanding the different pod states is crucial for effective troubleshooting. The following are the most common pod states:
* Pending: Pod scheduling is in progress by Kubernetes.
* Running: All containers in the pod are running and healthy.
* Failed: One or more containers in the pod are terminated with a nonzero exit code.
* CrashLoopBackOff: A container within the pod is repeatedly crashing and Kubernetes is unable to restart it.
* ContainerCreating: Container creation is in progress by the container runtime.

### Check pod status and logs
First start by checking pod status and logs using a kubectl command:
```
$ kubectl get pods
$ kubectl logs <pod-name>
```
The get pods command lists all the pods in the current namespace, along with their current status. The logs command retrieves the logs for a specific pod, allowing you to inspect any errors or exceptions. To troubleshoot networking problems, use the following commands:
```
$ kubectl get services
$ kubectl describe service <service-name>
```
The get services command displays all the services in the current namespace. The command provides details about a specific service, including the associated endpoints, and any relevant error messages. If you're encountering issues with PVCs, you can use the following commands to debug them:
```
$ kubectl get persistentvolumeclaims
$ kubectl describe persistentvolumeclaims <pvc-name>
```
The "get persistentvolumeclaims" command lists all the PVCs in the current namespace. The describe command provides detailed information about a specific PVC, including the status, associated storage class, and any relevant events or errors.
