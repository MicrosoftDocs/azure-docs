---
title: Troubleshoot known issues with Maintenance Configurations
description: This article provides details on known and fixed issues and how to troubleshoot any problems with Maintenance Configurations.
author: ApnaLakshay
ms.service: virtual-machines
ms.subservice: maintenance
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 10/13/2023
ms.author: lnagpal
---

# Troubleshoot issues with Maintenance Configurations

This article describes the open and fixed issues that might occur when you use Maintenance Configurations, their scope and their mitigation steps.

## Fixed Issues

### Shutdown and Unresponsive VM in Guest Maintenance Scope

####  Dynamic Scope

It will take 12 hours to complete the cleanup process for the maintenance configuration assignment. If a new VM is recreated with the same name before the cleanup, the backend service will be unable to trigger the schedule.

#### Static Scope

Ensure that the VM is up and running. If the VM was indeed up and running, and the issue persists, verify whether the VM was recreated with the same name within a 12-hour window. If so, delete all configuration assignments associated with the recreated VM and then proceed to recreate the assignments.

### Failed to create dynamic scope due to RBAC

In order to create a dynamic scope, user must have the permission at the subscription level or at a resource group level. Please refer to the [list of permissions list for different resources](../update-manager/overview.md#permissions) for more details.

#### Apply Update stuck and Update not progressing
**Applies to:** :heavy_check_mark: Dedicated Hosts :heavy_check_mark: VMs 

If a resource is redeployed to a different cluster, and a pending update request is created using the old cluster value, the request will become stuck indefinitely. In the event of a request being stuck for an extended period (more than 300 minutes), please contact the  support team for further mitigation.

#### Dedicated host update even after Maintenance Configuration is attached

If a Dedicated Host is recreated with the same name, the backend retains the old Dedicated Host ID, preventing it from blocking updates. Customers can resolve this by removing the maintenance configuration and reassigning it for mitigation. If the issue persists, please reach out to the support team for further assistance.

#### Install patch operation failed due to invalid classfication type in Maintenance Configuration

Due to a previous bug, the MRP patch operation couldn't perform validation, and an invalid classification type was found in the Maintenance Configuration. The bug has been fixed and deployed. To address this issue, customers can update the Maintenance Configuration and set the correct classification type.

## Open Issues

