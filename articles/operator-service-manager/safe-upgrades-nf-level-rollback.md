---
title: Safe Upgrade Practices NF Level Rollback
description: Revert all prior completed operations during safe upgrade failure.
author: msftadam
ms.author: adamdor
ms.date: 08/28/2024
ms.topic: upgrade-and-migration-article
ms.service: azure-operator-service-manager
---

# Rollback on upgrade failure
A guide to understand and use the optional rollback feature for container network function (CNF) upgrade

## Current state
CNF upgrade workflow via Azure Operator Service Manager (AOSM) currently executes as follows,
* The network function applications (NfApps) are created or upgraded following either updateDependsOn ordering, if provided, or in the sequential order they appear.
* NfApps with parameter applicationEnabled roleOverride set to disabled are skipped.
* NFApps present before upgrade, but not referenced by the new network function definition version (NFDV) are deleted.
* The execution is stopped if any of the NfApp upgrades fail.
* The failure leaves the NF resource in a failed state.

### Pause on failure 
With pause on failure, AOSM rolls back the failed NfApp, via the testOptions, installOptions, or upgradeOptions parameters. This method allows the end user to troubleshoot the failed NfApp and then restart the upgrade from that point forward. As the default behavior, this method is the most efficient upgrade method, but may cause network function (NF) inconsistencies while in a mixed version state. 


## Rollback on failure
To address risk of mismatched NfApp versions, AOSM now supports NF level rollback on failure. With this option enabled, if an NfApp upgrade fails, both the failed NfApp, and all prior completed NfApps, are rolled back to initial version state. This method minimizes, or eliminates, the amount of time the NF is exposed to NfApp version mismatches. The optional rollback on failure feature works as follows:
* A user initiates an upgrade and enables the rollback on failure feature.
* A snapshot of the current NfApp versions is captured and stored.
* The snapshot is used to determine the individual NfApp actions taken to reverse actions that completed successfully.
  - "helm install" action on deleted components,
  - "helm rollback" action on upgraded components,
  - "helm delete" action on newly installed components
* NfApp failure occurs, AOSM restores the NfApps to the snapshot version state before the upgrade, with most recent actions reverted first.

**Notes:**
* AOSM doesn't create a snapshot if a user doesn't enable rollback on failure.
* A rollback on failure only applies to the successfully completed NFApps.
  - Use the testOptions, installOptions, or upgradeOptions parameters to control rollback of the failed NfApp.
* AOSM returns the following operational status and messages, given the respective results:
```
  - Upgrade Succeeded
    - Provisioning State: Succeeded
    - Message: <empty>
  - Upgrade Failed, Rollback Succeeded
    - Provisioning State: Failed
    - Message: Application(<ComponentName>) : <Failure Reason>; 	Rollback succeeded
  - Upgrade Failed, Rollback Failed
    - Provisioning State: Failed
    - Message: Application(<ComponentName>) : <Failure reason>; 	Rollback Failed (<RollbackComponentName>) : <Rollback Failure reason>
```

## Configure rollback on failure
Operator provides input using the roleOverrideValues parameter in the NF payload. The operator can use configuration group value (CGV) or configuration group schema (CGS) to propagate into roleOverrideValues. Each roleOverrideValues entry overrides the default behavior of the NfAapps. To support rollback on failure, the "roleOverrideValues" is extended to accept a new JSON schema parameter. 

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
**Notes:**
* If the nfConfiguration isn't provided through the roleOverrideValues parameter, by default the rollback is disabled.
* If multiple entries of nfConfiguration are found in the roleOverrideValues, then the NF reput is returned as a bad request.

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
          //... other nfapps overrides
       ]
  }
}
```
## Troubleshooting Guide:
### Understanding Pod States
Understanding the different pod states is crucial for effective troubleshooting. The following are the most common pod states:
* Pending: Pod scheduling is in progress by Kubernetes.
* Running: All containers in the pod are running and healthy.
* Failed: One or more containers in the pod are terminated with a non zero exit code.
* CrashLoopBackOff: A container within the pod is repeatedly crashing and Kubernetes is unable to restart it.
* ContainerCreating: Container creation is in progress by the container runtime.

### Checking Pod Status and Logs
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
