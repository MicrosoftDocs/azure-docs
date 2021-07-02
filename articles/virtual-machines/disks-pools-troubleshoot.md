---
title: Troubleshoot Azure disk pools (preview) overview
description: Learn about Azure disk pools (preview).
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 07/02/2021
ms.author: rogarana
ms.subservice: disks
---

# Troubleshoot Azure disk pools (preview)

## Common failure codes when deploying a disk pool
 
|Code  |Description  |
|---------|---------|
|UnexpectedError     |Usually occurs when a backend unrecoverable error occurs. Retry the deployment. If the issue isn't resolved, contact Azure Support and provide the tracking ID of the error message.         |
|DeploymentFailureZonalAllocationFailed     |This occurs when Azure runs out of capacity to provision a VM in the specified region/zone. Retry the deployment at another time.         |
|DeploymentFailureQuotaExceeded     |The subscription used to deploy the disk pool is out of VM core quota in this region. You can [request an increase in vCPU quota limits per Azure VM series](../azure-portal/supportability/per-vm-quota-requests.md) for Dsv3 series.         |
|DeploymentFailurePolicyViolation     |A policy on the subscription prevented the deployment of Azure resources that are required to support a disk pool. See the error for more details.         |
|DeploymentTimeout     |This occurs when the deployment of the disk pool infrastructure gets stuck and doesn't complete in the alloted time. Retry the deployment. If the issue persists, contact Azure support and provide the tracking ID of the error message.         |
|OngoingOperationInProgress     |An ongoing operation is in-progress on the disk pool. Wait until that operation completes, then retry deployment.         |

## Common failure codes when enabling iSCSI on disk pools

|Code  |Description  |
|---------|---------|
|GoalStateApplicationError     |Occurs when the iSCSI target configuration is invalid and cannot be applied to the disk pool. Retry the deployment. If the issue persists, contact Azure support and provide the tracking ID of the error.         |
|GoalStateApplicationTimeoutError     |Occurs when the disk pool infrastructure stops responding to the resource provider. Retry the deployment. If the issue persists, contact Azure support and provide the tracking ID of the error.         |
|OngoingOperationInProgress     |An ongoing operation is in-progrress on the disk pool. Wait until that operation completes, then retry deployment.         |



## What do the unknown and updating statuses mean?

Disk pools and iSCSI targets each have four states, Unknown, Running, Updating, and Stopped (deallocated).

Unknown means that the resource is in a bad or unknown state. To attempt recovery, perform an update operation on the resource (such as adding or removing disks/LUNS) or delete and redeploy your disk pool.

Updating means that the resource is going through an update. This usually happens during deployment or when applying an update like adding disks or LUNs.