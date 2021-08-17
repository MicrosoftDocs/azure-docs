---
title: Troubleshoot Azure disk pools (preview) overview
description: Troubleshoot issues with Azure disk pools. Learn about common failure codes and how to resolve them.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 07/19/2021
ms.author: rogarana
ms.subservice: disks
---

# Troubleshoot Azure disk pools (preview)

This article lists some common failure codes related to Azure disk pools (preview). It also provides possible resolutions and some clarity on disk pool statuses.

## Disk pool status

Disk pools and iSCSI targets each have four states: **Unknown**, **Running**, **Updating**, and **Stopped (deallocated)**.

**Unknown** means that the resource is in a bad or unknown state. To attempt recovery, perform an update operation on the resource (such as adding or removing disks/LUNS) or delete and redeploy your disk pool.

**Running** means the resource is running and in a healthy state.

**Updating** means that the resource is going through an update. This usually happens during deployment or when applying an update like adding disks or LUNs.

**Stopped (deallocated)** means that the resource is stopped and its underlying resources have been deallocated. You can restart the resource to recover your disk pool or iSCSI target.

## Recover a disk pool or an iSCSI target

First, stop the disk pool and restart it. Then check the status of the disk pool and the iSCSI target. If they have recovered, then any Azure VMware clusters connected to the disk pool will recover automatically unless the disk pool has been inaccessible for more than 24 hours. If it has been more than 24 hours, then you need to contact Azure support to forcibly disconnect the inaccessible datastores associated with the disk pool. After that, you can reconnect the VS clusters to the disk pool and configure the datastores.

If the disk pool didn't recover after this process, contact Azure support and provide the tracking ID for any error message you've received.

## Common failure codes when deploying a disk pool
 
|Code  |Description  |
|---------|---------|
|UnexpectedError     |Usually occurs when a backend unrecoverable error occurs. Retry the deployment. If the issue isn't resolved, contact Azure Support and provide the tracking ID of the error message.         |
|DeploymentFailureZonalAllocationFailed     |This occurs when Azure runs out of capacity to provision a VM in the specified region/zone. Retry the deployment at another time.         |
|DeploymentFailureQuotaExceeded     |The subscription used to deploy the disk pool is out of VM core quota in this region. You can [request an increase in vCPU quota limits per Azure VM series](../azure-portal/supportability/per-vm-quota-requests.md) for Dsv3 series.         |
|DeploymentFailurePolicyViolation     |A policy on the subscription prevented the deployment of Azure resources that are required to support a disk pool. See the error for more details.         |
|DeploymentTimeout     |This occurs when the deployment of the disk pool infrastructure gets stuck and doesn't complete in the allotted time. Retry the deployment. If the issue persists, contact Azure support and provide the tracking ID of the error message.         |
|OngoingOperationInProgress     |An ongoing operation is in-progress on the disk pool. Wait until that operation completes, then retry deployment.         |

## Common failure codes when enabling iSCSI on disk pools

|Code  |Description  |
|---------|---------|
|GoalStateApplicationError     |Occurs when the iSCSI target configuration is invalid and cannot be applied to the disk pool. Retry the deployment. If the issue persists, contact Azure support and provide the tracking ID of the error.         |
|GoalStateApplicationTimeoutError     |Occurs when the disk pool infrastructure stops responding to the resource provider. Retry the deployment. If the issue persists, contact Azure support and provide the tracking ID of the error.         |
|OngoingOperationInProgress     |An ongoing operation is in-progress on the disk pool. Wait until that operation completes, then retry deployment.         |

## Next steps

[Manage a disk pool (preview)](disks-pools-manage.md)