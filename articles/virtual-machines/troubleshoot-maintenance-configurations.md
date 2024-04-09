---
title: Troubleshoot known issues with Maintenance Configurations
description: This article provides details on known and fixed issues and how to troubleshoot any problems with Maintenance Configurations.
author: ApnaLakshay
ms.service: virtual-machines
ms.subservice: maintenance
ms.topic: conceptual
ms.date: 10/13/2023
ms.author: lnagpal
---

# Troubleshoot issues with Maintenance Configurations

This article outlines common errors that may arise during the deployment or utilization of Maintenance Configuration for Scheduled Patching, along with strategies to address them effectively.

### Shutdown and Unresponsive VM when using `dynamic` scope in Guest Maintenance 

#### Issue
Scheduled patching doesn't install the patches on the VMs and gives an error `ShutdownOrUnresponsive`

#### Resolution
It takes 12 hours to complete the cleanup process for the maintenance configuration assignment so make sure to keep the buffer of 12 hours before recreating the VM with the same name. 
If a new VM is recreated with the same name before the cleanup, Maintenance Configuration service will be unable to trigger the schedule.

### Shutdown and Unresponsive VM when using `static` scope in Guest Maintenance 

#### Issue
Scheduled patching doesn't install the patches on the VMs and gives an error `ShutdownOrUnresponsive`

#### Resolution
In a static scope, it's crucial for customers to avoid relying on outdated VM configurations. Instead, they should prioritize re-assigning configurations after recreating instances.

### Schedule Patching stops working after the resource is moved

#### Issue
If a resource is moved to a different resource group or subscription, then scheduled patching for the resource stops working.

#### Resolution 
Resource move or Maintenance Configuration move capability across resource group or subscription is currently unsupported by the system. The team is working to provide this capability but in the meantime, as a workaround, for the resource you want to move (in static scope)

1. You need to remove the assignment of it
2. Move the resource to a different resource group or subscription
3. Recreate the assignment of it

In the dynamic scope, the steps are similar, but after removing the assignment in step 1, you simply need to initiate or wait for the next scheduled run. This action prompts the system to completely remove the assignment, enabling you to proceed with steps 2 and 3.

If you forget/miss any one of the above mentioned steps, you can reassign the resource to original assignment and repeat the steps again sequentially.

### Dynamic Scope creation fails

#### Issue
Failed to create dynamic scope due to RBAC

#### Resolution
In order to create a dynamic scope, user must have the permission at the subscription level or at a resource group level. Refer to the [list of permissions list for different resources](../update-manager/overview.md#permissions) for more details.

### Apply Update stuck and Update not progressing

#### Issue
**Applies to:** :heavy_check_mark: Dedicated Hosts :heavy_check_mark: VMs 
User initiated update stuck for long time and update is not progressing

#### Resolution
If a resource is redeployed to a different cluster, and a pending update request is created using the old cluster value, the request becomes stuck indefinitely. If the status of the apply update operation is closed/not found, then retry after 120 hours. If the issue persist, contact the support team for further mitigation.

### Dedicated host updates even after Maintenance Configuration is attached

#### Issue
Dedicated Host update not blocked by Maintenance Configuration and it gets updated even after maintenance configuration is attached

#### Resolution
If a Dedicated Host is recreated with the same name, Maintenance Configuration service retains the old Dedicated Host ID, preventing it from blocking updates. Customers can resolve this issue by removing the Maintenance Configuration and reassigning it. If the issue persists, reach out to the support team for further assistance.

### Install patch operation fails for invalid classification type

#### Issue
Install patch operation failed due to invalid classification type in Maintenance Configuration

#### Resolution
Due to a previous bug, the system patch operation couldn't perform validation, and an invalid classification type was found in the Maintenance Configuration. The bug has been fixed and deployed. To address this issue, customers can update the Maintenance Configuration and set the correct classification type.

### Schedule didn't trigger

#### Issue
If a resource has two maintenance configurations with the same trigger time and an install patch configuration, and both are assigned to the same VM/resource, only one maintenance configuration triggers.

#### Resolution
Please modify the start time of one of the maintenance configurations to mitigate the issue. It's a known system limitation due to which Maintenance Configuration is unable to identify which maintenance configuration triggers. The team is working on solving this limitation. 

### Unable to create dynamic scope (at Resource Group Level)

#### Issue
Dynamic scope validation fails due to a null value in the location

#### Resolution
Due to this issue in dynamic scope validation, it results in regression in the validation process. We recommend that customers provide the required set of locations for resource group-level dynamic scope.

### Dynamic Scope not executed and no resources patched

#### Issue
Dynamic scope flattening failed due to throttling, and the service is unable to determine the list of VMs associated with VM.

#### Resolution
This issue might be occurring due to the number of subscriptions per dynamic scope that should be less than 30. Refer to this [page](../virtual-machines/maintenance-configurations.md#service-limits) for more details on the service limits of Dynamic Scoping 

### Dedicated host configuration assignment not cleaned up after Dedicated Host removal

#### Issue
After deleting the dedicated hosts, configuration assignments attached to dedicated hosts still exists.

#### Resolution
Before deleting a dedicated host, make sure to delete the maintenance configuration associated with it. If the dedicated host is deleted but still appears on the portal, reach out to the support team. Cleanup processes are currently in place for dedicated hosts, ensuring no impact on customers.

### Unable to provide Multiple tag values for dynamic scope

#### Issue
Portal users might not be able to provide multiple tag values for dynamic scope

#### Resolution
This is a currently known limitation on the portal. The team is working on making this feature accessible on the portal as well but in the meantime, customers can use CLI/PowerShell to create dynamic scope. The system accepts multiple values for tag using CLI/PowerShell option.

### Maintenance Configuration triggered again with older trigger time

#### Issue
Maintenance Configuration executed again with the older trigger time, after the update

#### Resolution 
There's a known issue in Maintenance Schedule related to the caching of old maintenance policies. If an old policy is cached and the new policy processing is moved to a new instance, the old machine may trigger the schedule with the outdated start time. It's recommended to update the Maintenance Configuration at least 1 hour before. If the issue persists, reach out to support team for further assistance.

### Schedule timeout, waiting for an ongoing update to complete the resource

#### Issue
Maintenance configuration timeout due to the host update window coinciding with the guest (VM) patching window

#### Resolution
In rare cases if platform catchup host update window happens to coincide with the guest (VM) patching window and if the guest patching window don't get sufficient time to execute after host update then the system would show **Schedule timeout, waiting for an ongoing update to complete the resource** error since only a single update is allowed by the platform at a time. 

### Unimplemented APIs

Following is the list of APIs that aren't yet supported.
+ Get Apply Update at Subscription Level
+ Get Apply Update at Resource Group Level.
+ Get Pending Update at Subscription Level
+ Get Pending Update at Resource Group Level
