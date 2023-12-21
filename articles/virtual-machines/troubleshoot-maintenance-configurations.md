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

#### Shutdown and Unresponsive VM in Guest Maintenance Scope

#####  Dynamic Scope

It will take 12 hours to complete the cleanup process for the maintenance configuration assignment. If a new VM is recreated with the same name before the cleanup, the backend service will be unable to trigger the schedule.

##### Static Scope

Ensure that the VM is up and running. If the VM was indeed up and running, and the issue persists, verify whether the VM was recreated with the same name within a 12-hour window. If so, delete all configuration assignments associated with the recreated VM and then proceed to recreate the assignments.

#### Failed to create dynamic scope due to RBAC

In order to create a dynamic scope, user must have the permission at the subscription level or at a resource group level. Please refer to the [list of permissions list for different resources](../update-manager/overview.md#permissions) for more details.

#### Apply Update stuck and Update not progressing
**Applies to:** :heavy_check_mark: Dedicated Hosts :heavy_check_mark: VMs 

If a resource is redeployed to a different cluster, and a pending update request is created using the old cluster value, the request will become stuck indefinitely. In the event of a request being stuck for an extended period (more than 300 minutes), please contact the  support team for further mitigation.

#### Dedicated host update even after Maintenance Configuration is attached

If a Dedicated Host is recreated with the same name, the backend retains the old Dedicated Host ID, preventing it from blocking updates. Customers can resolve this by removing the maintenance configuration and reassigning it for mitigation. If the issue persists, please reach out to the support team for further assistance.

#### Install patch operation failed due to invalid classfication type in Maintenance Configuration

Due to a previous bug, the system patch operation couldn't perform validation, and an invalid classification type was found in the Maintenance Configuration. The bug has been fixed and deployed. To address this issue, customers can update the Maintenance Configuration and set the correct classification type.

## Open Issues

#### Schedule did not trigger

If a resource has two maintenance configurations with the same trigger time and an install patch configuration, and both are assigned to the same VM/resource, only one policy will trigger. This is a known bug, and it is rarely observed. To mitigate this issue, adjust the start time of the maintenance configuration.

#### Unable to create dynamic scope (at Resource Group Level)

Dynamic scope validation fails due to a null value in the location, resulting in a regression in the validation process. We recommend that customers provide the required set of locations for resource group-level dynamic scope.

#### Dynamic Scope not executed

If in your maintenance schedule, dynamic schedule is not evaluated and no machines are patched then this error might be occuring due to the number of subscriptions per dynamic scope which should be less than 30. Dynamic scope flattening failed due to throttling, and the service is unable to determine the list of VMs associated with VM. Please refer to this [page](../virtual-machines/maintenance-configurations.md#service-limits) for more details on the service limits of Dynamic Scoping 

#### Dedicated host configuration assignment not cleaned up ater Dedicated Host removal

Before deleting a dedicated host, make sure to delete the maintenance configuration associated with it. If the dedicated host is deleted but still appears on the portal, please reach out to the support team. Cleanup processes are currently in place for dedicated hosts, ensuring no impact on customers as the dedicated host no longer exists.

#### Maintenance Configuration recreated with the same name and old dynamic scope appeared on portal

After deleting the maintenance configuration, the system performs cleanup of all associations (static as well as dynamic). However, due to a regression from the backend, the backend system is unable to delete the dynamic scope from ARG. The portal displays configurations using ARG, and old configurations may be visible. Stale configurations in ARG will automatically be purged after 60 hours. The backend does not utilize any stale dynamic scope.

#### Unable to provide Multiple tag values for dynamic scope

This is a currently know limitation on the portal. The team is working on making thsi feature accessible on the portal as well but in the meantime, customers can use CLI/PowerShell to create dynamic scope. The system accepts multiple values for tag using CLI/PowerShell option.

#### Unable to remove tag from maintenance configuration

This is a known bug in the backend system where the customer is unable to remove tag from Maintenance Configuration. The mitigation is to remove all tags and then update the maintenance configuration. Then you can add all the previous tags defined. Removal of a single tag is not working due to regression.

#### Maintenance Configuration executes twice after policy updates (Policy trigger with old trigger time)

There is a known issue in Maintenance Schedule related to the caching of old maintenance policies. If an old policy is cached and the new policy processing is moved to a new instance, the old machine may trigger the schedule with the outdated start time.
It is recommended to update the Maintenance Configuration at least 1 hour before. If the issue persists, please reach out to support team for further assistance.

## Unsupported

#### Unimplemented APIs

Following is the list of APIs which are not yet implemented and we are in the process of implementing it in the next few days
+ Get Apply Update at Subscription Level
+ Get Apply Update at Resource Group Level.
+ Get Pending Update at Subscription Level
+ Get Pending Update at Resource Group Level
