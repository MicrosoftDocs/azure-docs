---
title: Safe Upgrade Practices NF Level Rollback
description: Revert all prior completed operations in case of safe upgrade failure.
author: msftadam
ms.author: adamdor
ms.date: 08/28/2024
ms.topic: upgrade-and-migration-article
ms.service: azure-operator-service-manager
---

#  Rollback on CNF upgrade failure
A guide to understand and use the optional rollback feature for CNF upgrade

## Introduction
CNF upgrade workflow via AOSM currently executes as follows,
* The new and existing NF (network function) apps from the newly referenced NFDV are either created or upgraded in the order based on the ‘updateDependsOn’ property or in the sequential order if former is not provided.
* Will skip processing NF apps those have ‘applicationEnabled’ roleoverride set as ‘Disabled’.
* NF Apps which are present in the CNF before upgrade but are not available as part of the newly referenced NFDV will be deleted.
* The execution is paused if any of the NF app upgrade fails. 

The upgrade failure leaves the NF resource in the failed state. Although AOSM does not supports rollback on the entire NF level, it currently supports rollback at the NF app level, which means that if an update fails for a single NF app within a CNF, that NF app will be rolled back to its previous state. This feature is supported via one of the “testOptions”, “installOptions” and “upgradeOptions” available at per NF app level. 
However, this may cause inconsistency or dependency issues among the NF apps within a CNF. To bring a consistent experience, going forward, AOSM will support NF level rollback for CNF upgrade, which means that if a CNF upgrade fails, the entire CNF will be rolled back to its state before the upgrade was issued, optionally. This needs all the changes applied to be rolled back at per NF app level.

## How the optional rollback feature works
The optional rollback feature for CNF upgrade works as follows:
* When a user initiates a CNF upgrade via AOSM, the user can specify whether to enable or disable the optional rollback feature.
* If the user enables the optional rollback feature, AOSM will create a snapshot of all the NF apps under the CNF, before the upgrade and stores it.
* The snapshot is used to decide whether to do install or upgrade of the individual NF apps from the newly referenced NFDV during the CNF upgrade; and on CNF upgrade failure we again use this information to decide the reversing action
  - helm install action on deleted components,
  - helm rollback action on upgraded components,
  - elm delete action on newly installed components

In the reverse order of actions that happened in the CNF upgrade.
* If any of the NF app updates fails, AOSM will trigger the optional rollback feature and restore the CNF to its state before the upgrade using the snapshot. This will be done by unwinding the stack by rolling back the most recent change first.
* If all the updates succeed, AOSM will delete the snapshot and complete the CNF upgrade.
* If the user did not enable the optional rollback feature, AOSM will not create a snapshot; and will only perform rollback at the NF app level, only if mentioned via one of the “testOptions”, “installOptions” and “upgradeOptions”.
* AOSM will not rollback the currently failed NF app during the upgrade, it rolls back only the successfully completed (1 ... n-1) NF Apps which got upgraded before the current failure (n), to rollback the current NF app as well, please mention one of the above mentioned app level roll back option for each app that might fail. 
* Customer should be getting the operation status and message as follows for the respective scenarios
  - Upgrade Succeeded
    - Provisioning State: Succeeded
    - Message: <empty>
  - Upgrade Failed, Rollback Succeeded
    - Provisioning State: Failed
    - Message: Application(<ComponentName>) : <Failure Reason>; 	Rollback succeeded
  - Upgrade Failed, Rollback Failed
    - Provisioning State: Failed
    - Message: Application(<ComponentName>) : <Failure reason>; 	Rollback Failed (<RollbackComponentName>) : 			<Rollback Failure reason>

## How to set optional rollback for NF
Operator will be able to provide their input by using the ‘roleOverrideValues’ parameter in the NetworkFunction Payload. The operator can use CGV, CGS to propagate the value to the ‘roleOverrideValues’. The ‘roleOverrideValues’ currently accepts an array of serialized JSONs, with each entry configuring the behaviour override of the NF apps in the referenced NFDV; after the availability of this feature the ‘roleOverrideValues’ will also accept another entry matching the JSON schema 
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
* If the ‘nfConfiguration’ is not provided through the roleOverrideValues parameter by default the rollback will be set disabled and is enabled only when the ‘rollbackEnabled’ is set to true (Boolean)
* If multiple entries of ‘nfConfiguration’ are found in the roleOverrideValues then the NF PUT will be returned as BadRequest.

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
* Pending: The pod is being scheduled by the Kubernetes scheduler.
* Running: All containers in the pod are running and healthy.
* Failed: One or more containers in the pod have terminated with a non-zero exit code.
* CrashLoopBackOff: A container within the pod is repeatedly crashing and Kubernetes is unable to restart it.
* ContainerCreating: The container is being created by the container runtime.

### Checking Pod Status and Logs
When troubleshooting a pod, first start by checking its status and logs. The kubectl command-line tool provides a simple way to do this. Use the following commands to check the status of a pod and retrieve its logs:
```
$ kubectl get pods
$ kubectl logs <pod-name>
```
The get pods command lists all the pods in the current namespace, along with their current status. The logs command retrieves the logs for a specific pod, allowing you to inspect any errors or exceptions that might have occurred.
To troubleshoot networking problems, use the following commands:
```
$ kubectl get services
$ kubectl describe service <service-name>
```
The get services command displays all the services in the current namespace. Services in Kubernetes are responsible for load balancing requests to pods. The describe command provides additional details about a specific service, including the associated endpoints and any relevant error messages.
If you are encountering issues with PVCs, you can use the following commands to debug them:
```
$ kubectl get persistentvolumeclaims
$ kubectl describe persistentvolumeclaims <pvc-name>
```
The ‘get persistentvolumeclaims’ command lists all the PVCs in the current namespace. The describe command provides detailed information about a specific PVC, including the status, associated storage class, and any relevant events or errors.
