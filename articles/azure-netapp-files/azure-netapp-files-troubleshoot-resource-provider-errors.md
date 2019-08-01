---
title: Troubleshoot Azure NetApp Files Resource Provider errors | Microsoft Docs
description: Describes causes, solutions, and workarounds for common Azure NetApp Files Resource Provider errors.
services: azure-netapp-files
documentationcenter: ''
author: b-juche
manager: ''
editor: ''
tags:

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 07/10/2019
ms.author: b-juche
---
# Troubleshoot Azure NetApp Files Resource Provider errors 

This article describes common Azure NetApp Files Resource Provider errors, their causes, solutions, and workarounds (if available).

## Common Azure NetApp Files Resource Provider errors

***BareMetalTenantId cannot be changed.***  

This error occurs when you try to update or patch a volume and the `BaremetalTenantId` property has a changed value.

* Cause:   
You are trying to update a volume and the `BaremetalTenantId` property has a different value from the value stored in Azure.
* Solution:   
Don’t include `BaremetalTenantId` in the patch and update (put) request. Alternatively, make sure `BaremetalTenantId` is the same in the request.

***ServiceLevel cannot be changed.***  

This error occurs when you try to update or patch a capacity pool with a different service level when the capacity pool already has volumes in it.

* Cause:   
You are trying to update a capacity pool service level when the pool contains volumes.
* Solution:   
Delete all volumes from the capacity pool, then change the service level.
* Workaround:   
Create another capacity pool, then create the volumes again in the new capacity pool.

***PoolId cannot be changed***  

This error occurs when you try to update or patch a capacity pool with a changed `PoolId` property.

* Cause:   
You are trying to update a capacity pool `PoolId` property. The `PoolId` property is a read-only property and cannot be changed.
* Solution:   
Don’t include `PoolId` in the patch and update (put) request.  Alternatively, make sure `PoolId` is the same in the request.

***CreationToken cannot be changed.***

This error occurs when you try to change the file path (`CreationToken`) after the volume has been created. File path (`CreationToken`) must be set when the volume is created, and it cannot be changed later.

* Cause:   
You are trying to change the file path (`CreationToken`) after the volume has been created, which is not a supported operation. 
* Solution:   
If changing the file path is not needed, then consider removing the parameter from the request to dismiss the error message.
* Workaround:   
If you need to change the file path (`CreationToken`), you can create a new volume with a new file path, and then migrate the data to the new volume.

***CreationToken must be at least 16 characters long.***

This error occurs when the file path (`CreationToken`) does not meet the length requirement. The length of the file path must be at least one character in length.

* Cause:   
The file path is empty.  When you create a volume by using the API, a creation token is required. If you are using the Azure portal, the file path is generated automatically.
* Solution:   
Enter at least one character as the file path (`CreationToken`).

***Domain name cannot be changed.***

This error occurs when you try to change the domain name in Active Directory.

* Cause:   
You are trying to update the domain name property.
* Solution:    
None. You cannot change the domain name.
* Workaround:   
Delete all volumes by using the Active Directory configuration. Then delete the Active Directory configuration and re-create the volumes.

***Duplicate value error for object ExportPolicy.Rules[RuleIndex].***

This error occurs when the export policy is not defined with a unique index. When you define export policies, all export policy rules must have a unique index between 1 and 5.

* Cause:   
The defined export policy does not meet the requirement for export policy rules. You must have one export policy rule at the minimum and five export policy rules at the maximum.
* Solution:   
Make sure that the index is not already used and that it is in the range from 1 to 5.
* Workaround:   
Use a different index for the rule that you are trying to set.

***Error {action} {resourceTypeName}***

This error is displayed when other error handling has failed to handle the error while performing an action on a resource.   It includes text ‘Error’. The `{action}` can be any of (`getting`, `creating`, `updating`, or `deleting`).  The `{resourceTypeName}` is the `resourceTypeName` (for example, `netAppAccount`, `capacityPool`, `volume`, and so on).

* Cause:   
This error is an unhandled exception where the cause is not known.
* Solution:   
Contact Azure Support Center to report the detailed reason in logs.
* Workaround:   
None.

***The file path name can contain letters, numbers, and hyphens (""-"") only.***

This error occurs when the file path contains unsupported characters, for example, a period ("."), comma (","), underscore ("_"), or dollar sign ("$").

* Cause:   
The file path contains unsupported characters, for example, a period ("."), comma (","), underscore ("_"), or dollar sign ("$").
* Solution:   
Remove characters that are not alphabetical letters, numbers, or hyphens ("-") from the file path you entered.
* Workaround:   
You can replace an underscore with a hyphen or use capitalization instead of spaces to indicate the beginning of new words.  For example, use "NewVolume" instead of "new volume".

***FileSystemId cannot be changed.***

This error occurs when you try to change `FileSystemId`.  Changing `FileSystemdId` is not a supported operation. 

* Cause:   
The ID of the file system is set when the volume is created. `FileSystemId` cannot be changed subsequently.
* Solution:   
Don’t include `FileSystemId` in a patch and update (put) request.  Alternatively make sure that `FileSystemId` is the same in the request.

***ActiveDirectory with id: '{string}' does not exist.***

The `{string}` portion is the value you entered in the `ActiveDirectoryId` property for the Active Directory connection.

* Cause:   
When you created an account with the Active Directory configuration, you have entered a value for `ActiveDirectoryId` that is supposed to be empty.
* Solution:   
Don’t include `ActiveDirectoryId` in the create (put) request.

***Invalid api-version.***

The API version is either not submitted or contains an invalid value.

* Cause:   
The value in the query parameter `api-version` contains an invalid value.
* Solution:   
Use correct API version value.  The resource provider supports many API versions. The value is in the format of yyyy-mm-dd.

***An invalid value '{value}' was received for {1}.***

This message indicates an error in the fields for `RuleIndex`, `AllowedClients`, `UnixReadOnly`, `UnixReadWrite`, `Nfsv3`, and `Nfsv4`.

* Cause:   
The input validation request has failed for at least one of the following fields: `RuleIndex`, `AllowedClients`, `UnixReadOnly`, `UnixReadWrite`, `Nfsv`3, and `Nfsv4`.
* Solution:   
Make sure to set all required and nonconflicting parameters on the command line. For example, you cannot set both the `UnixReadOnly` and `UnixReadWrite` parameters at the same time.
* Workaround:   
See the solution above.

***IP range {0} to {1} for vlan {2} is already in use***

This error occurs because the internal records of the used IP ranges have a conflict with the newly assigned IP address.

* Cause:   
The IP address assigned for the volume creation is already registered.
The reason could be an earlier failed volume creation.
* Solution:   
Contact Azure Support Center.

***Missing value for '{property}'.***

This error indicates that a required property is missing from the request. The string {property} contains the name of the missing property.

* Cause:   
The input validation request has failed for at least one of the properties.
* Solution:   
Make sure to set all required and nonconflicting properties in the request, specially, the property from the error message.

***MountTargets cannot be changed.***

This error occurs when a user is trying to update or patch the volume MountTargets property.

* Cause:   
You are trying to update the volume `MountTargets` property. Changing this property is not supported.
* Solution:   
Don’t include `MountTargets` in a patch and update (put) request.  Alternatively, make sure that `MountTargets` is the same in the request.

***Name already in use.***

This error indicates that the name for the resource is already in use.

* Cause:   
You are trying to create a resource with a name that is used for an existing resource.
* Solution:   
Use a unique name when creating the resource.

***File path already in use.***

This error indicates that the file path for the volume is already in use.

* Cause:   
You are trying to create a volume with a file path that is the same as an existing volume.
* Solution:   
Use a unique file path when creating the volume.

***Name too long.***

This error indicates that the resource name does not meet the maximum length requirement.

* Cause:   
The resource name is too long.
* Solution:   
Use a shorter name for the resource.

***File path too long.***

This error indicates that the file path for the volume does not meet the maximum length requirement.

* Cause:   
The volume file path is too long.
* Solution:   
Use a shorter file path.

***Name too short.***

This error indicates that the resource name does not meet the minimum length requirement.

* Cause:   
The resource name is too short.
* Solution:   
Use a longer name for the resource.

***File path too short.***

This error indicates that the volume file path does not meet the minimum length requirement.

* Cause:   
The volume file path is too short.
* Solution:   
Increase the length of the volume file path.

***Azure NetApp Files API unreachable.***

The Azure API relies on the Azure NetApp Files API to manage volumes. This error indicates an issue with the API connection.

* Cause:   
The underlying API is not responding, resulting in an internal error. This error is likely to be temporary.
* Solution:   
The issue is likely to be temporary. The request should succeed after some time.
* Workaround:   
None. The underlying API is essential for managing volumes.

***No operation result id found for '{0}'.***

This error indicates that an internal error is preventing the operation from completing.

* Cause:   
An internal error occurred and prevented the operation from completing.
* Solution:   
This error is likely to be temporary. Wait a few minutes and try again. If the problem persists, create a ticket to have technical support investigate the issue.
* Workaround:   
Wait a few minutes and check if the problem persists.

***Not allowed to mix protocol types CIFS and NFS***

This error occurs when you are trying to create a Volume and there are both the CIFS (SMB) and NFS protocol types in the volume properties.

* Cause:   
Both the CIFS (SMB) and NFS protocol types are used in the volume properties.
* Solution:   
Remove one of the protocol types.
* Workaround:   
Leave the protocol type property empty or null.

***Number of items: {value} for object: ExportPolicy.Rules[RuleIndex] is outside min-max range.***

This error occurs when the export policy rules do not meet the minimum or maximum range requirement. If you define the export policy, it must have one export policy rule at the minimum and five export policy rules at the maximum.

* Cause:   
The export policy you defined does not meet the required range.
* Solution:   
Make sure that the index is not already used and that is in the range from 1 to 5.
* Workaround:   
It is not mandatory to use export policy on the volumes. You can omit the export policy entirely if you do not need to use export policy rules.

***Only one active directory allowed***

This error occurs when you try to create an Active Directory configuration, and one already exists for the subscription in the region. The error can also occur when you try to create more than one Active Directory configuration.

* Cause:   
You are trying to create (not update) an active directory, but one already exists.
* Solution:   
If the Active Directory configuration is not in use, then you can first delete the existing configuration and then retry the create operation.
* Workaround:   
None. Only one Active Directory is allowed.

***Operation '{operation}' not supported.***

This error indicates that the operation is not available for the active subscription or resource.

* Cause:   
The operation is not available for the subscription or resource.
* Solution:   
Make sure that the operation is entered correctly and that it is available for the resource and subscription that you are using.

***OwnerId cannot be changed***

This error occurs when you try to change the OwnerId property of the volume. Changing the OwnerId is not a supported operation. 

* Cause:   
The `OwnerId` property is set when the volume is created. The property cannot be changed subsequently.
* Solution:   
Don’t include `OwnerId` in a patch and update (put) request. Alternatively, make sure that `OwnerId` is the same in the request.

***Parent pool not found***

This error occurs when you try to create a volume and the capacity pool in which you are creating the volume is not found.

* Cause:   
The capacity pool where the volume is being created is not found.
* Solution:   
Most likely the pool was not fully created or was already deleted at the time of the volume creation.

***Patch operation is not supported for this resource type.***

This error occurs when you try to change the mount target or snapshot.

* Cause:   
The mount target is defined when it is created, and it cannot be changed subsequently.
The snapshots don’t contain any properties that can be changed.
* Solution:   
None. Those resources do not have any properties that can be changed.

***Pool size too small for total volume size.***

This error occurs when you are updating the capacity pool size, and the size is smaller than the total `usedBytes` value of all volumes in that capacity pool.  This error can also occur when you are creating a new volume or resizing an existing volume, and the new volume size exceeds the free space in the capacity pool.

* Cause:   
You are trying to update the capacity pool to a smaller size than usedBytes in all volumes in the capacity pool.  Or, you are trying to create a volume that is larger than the free space in the capacity pool.  Alternatively, you are trying to resize a volume and the new size exceeds free space in the capacity pool.
* Solution:   
Set the capacity pool size to a larger value, or create a smaller volume for a volume.
* Workaround:   
Remove enough volumes so that the capacity pool size can be updated to this size.

***The property: Location for Snapshot must be the same as Volume***

This error occurs when you are creating a snapshot with location other than the volume that owns the snapshot.

* Cause:   
Invalid value in the Location property for the snapshot.
* Solution:   
Set valid string in the Location property.

***The {resourceType} name must be the same as the resource identifier name.***

This error occurs when you are creating a resource, and you fill in the name property with other value than the name property of `resourceId`.

* Cause:   
Invalid value in the name property when you create a resource.
* Solution:   
Leave the name property empty or allow it to use the same value as the name property (between the last backslash “/” and the question mark “?”) in `resourceId`.

***Protocol type {value} not known***

This error occurs when you are creating a volume with an unknown protocol type.  Valid values are “NFSv3” and “CIFS”.

* Cause:   
You are trying to set an invalid value in the volume `protocolType` property.
* Solution:   
Set a valid string in `protocolType`.
* Workaround:   
Set `protocolType` as null.

***Protocol types cannot be changed***

This error occurs when you try to update or patch `ProtocolType` for a volume.  Changing ProtocolType is not a supported operation.

* Cause:   
The `ProtocolType` property is set when the volume is created.  It cannot be updated.
* Solution:   
None.
* Workaround:   
Create another volume with new protocol types.

***Creating the resource of type {resourceType} would exceed the quota of {quota} resources of type {resourceType} per {parentResourceType}. The current resource count is {currentCount}, please delete some resources of this type before creating a new one.***

This error occurs when you are trying to create a resource (`NetAppAccount`, `CapacityPool`, `Volume`, or `Snapshot`), but your quota has reached its limit.

* Cause:   
You are trying to create a resource, but the quota limit is reached (example: `NetAppAccounts` per subscription or `CapacityPools` per `NetAppAccount`).
* Solution:   
Increase the quota limit.
* Workaround:   
Delete unused resources of the same type and create them again.

***Received a value for read-only property '{propertyName}'.***

This error occurs when you define a value for a property that cannot be changed. For example, you cannot change the volume ID.

* Cause:   
You are trying to modify a parameter (for example, the volume ID) that cannot be changed.
* Solution:   
Do not modify a value for the property.

***The requested {resource} was not found.***

This error occurs when you try to reference a nonexistent resource, for example, a volume or snapshot. The resource might have been deleted or have a misspelt resource name.

* Cause:   
You are trying to reference a nonexistent resource (for example, a volume or snapshot) that has already been deleted or has a misspelled resource name.
* Solution:   
Check the request for spelling errors to make sure that it is correctly referenced.
* Workaround:   
See the Solution section above.

***Service level ‘{volumeServiceLevel}’ is higher than parent ‘{poolServiceLevel}’***

This error occurs when you are creating or updating a volume, and you have set the service level to a higher level than the capacity pool that contains it.

* Cause:   
You are trying to create or update a volume with a higher ranked service level than the parent capacity pool.
* Solution:   
Set the service level to the same or a lower rank than the parent capacity pool.
* Workaround:   
Create the volume in another capacity pool with a correct service level. Alternatively, delete all volumes from the capacity pool, and set service level for the capacity pool to a higher rank.

***SMB server name may not be longer than 10 characters.***

This error occurs when you are creating or updating an Active Directory configuration for an account.

* Cause:   
The length of the SMB server name exceeds 10 characters.
* Solution:   
Use a shorter server name. The maximum length is 10 characters.
* Workaround:   
None.  See the solution above. 

***SubnetId cannot be changed.***

This error occurs when you try to change the `subnetId` after the volume has been created.  `SubnetId` must be set when the volume is created and cannot be changed later.

* Cause:   
You are trying to change the `subnetId` after the volume has been created, which is not a supported operation. 
* Solution:   
If changing the `subnetId` is not needed, then consider removing the parameter from the request to dismiss the error message.
* Workaround:   
If you need to change the `subnetId`, you can create a new volume with a new `subnetId`, and then migrate the data to the new volume.

***SubnetId is in invalid format.***

This error occurs when you try to create a new volume but the `subnetId` is not a `resourceId` for a subnet.

* Cause:   
This error occurs when you try to create a new volume, but the `subnetId` is not a `resourceId` for a subnet. 
* Solution:   
Check the value for the `subnetId` to ensure that it contains a `resourceId` for the subnet used.
* Workaround:   
None. See the solution above. 

***Subnet must have a ‘Microsoft.NetApp/volumes’ delegation.***

This error occurs when you are creating a volume and the selected subnet is not delegated to `Microsoft.NetApp/volumes`.

* Cause:   
You tried to create volume and you selected a subnet that is not delegated to `Microsoft.NetApp/volumes`.
* Solution:   
Select another subnet that is delegated to `Microsoft.NetApp/volumes`.
* Workaround:   
Add a correct delegation to the subnet.

***The specified resource type is unknown/not applicable.***

This error occurs when a name check has been requested either on a nonapplicable resource type or for an unknown resource type.

* Cause:   
Name check has been requested for an unknown or unsupported resource type.
* Solution:   
Check that the resource you are doing the request for is supported or contains no spelling errors.
* Workaround:   
See the solution above.

***Unknown Azure NetApp Files Error.***

The Azure API relies on the Azure NetApp Files API to manage volumes. The error indicates an issue in the communication to the API.

* Cause:   
The underlying API is sending an unknown error. This error is likely to be temporary.
* Solution:   
The issue is likely to be temporary, and the request should succeed after some time. If the problem persists, create a support ticket to have the issue investigated.
* Workaround:   
None. The underlying API is essential for managing volumes.

***Value received for an unknown property '{propertyName}'.***

This error occurs when nonexistent properties are provided for a resource such as the volume, snapshot, or mount target.

* Cause:   
The request has a set of properties that can be used with each resource. You cannot include any nonexistent properties in the request.
* Solution:   
Make sure that all property names are spelled correctly and that the properties are available for the subscription and resource.
* Workaround:   
Reduce the number of properties defined in the request to eliminate the property that is causing the error.

***Update operation is not supported for this resource type.***

Only volumes can be updated. This error occurs when you try to perform an unsupported update operation, for example, updating a snapshot.

* Cause:   
The resource you are trying to update does not support the update operation. Only volumes can have their properties modified.
* Solution:   
None. The resource that you are trying to update does not support the update operation. Therefore, it cannot be changed.
* Workaround:   
For a volume, create a new resource with the update in place and migrate the data.

***Volume cannot be created in a pool that is not in state succeeded.***

This error occurs when you try to create a volume in a pool that is not in the succeeded state. Most likely, the create operation for the capacity pool failed for some reason.

* Cause:   
The capacity pool containing the new volume is in a failed state.
* Solution:   
Check that the capacity pool is created successfully, and that it is not in a failed state.
* Workaround:   
Create a new capacity pool and create the volume in the new pool.

***Volume is being created and cannot be deleted at the moment.***

This error occurs when you try to delete a volume that is still being created.

* Cause:   
A volume is still being created when you try to delete the volume.
* Solution:   
Wait until the volume creation is finished, and then retry the deletion.
* Workaround:   
See the solution above.

***Volume is being deleted and cannot be deleted at the moment.***

This error occurs when you try to delete a volume when it is already being deleted.

* Cause:   
A volume is already being deleted when you try to delete the volume.
* Solution:   
Wait until the current delete operation is finished.
* Workaround:   
See the solution above.

***Volume is being updated and cannot be deleted at the moment.***

This error occurs when you try to delete a volume that is being updated.

* Cause:   
A volume is being updated when you try to delete the volume.
* Solution:   
Wait until the update operation is finished, and then retry the deletion.
* Workaround:   
See the solution above.

***Volume was not found or was not created successfully.***

This error occurs when the volume creation has failed, and you are trying to change the volume or create a snapshot for the volume.

* Cause:   
The volume does not exist, or the creation failed.
* Solution:   
Check that you are changing the correct volume and that the creation of the volume was successful. Or, check that the volume you are creating a snapshot for does exist.
* Workaround:   
None.  See the solution above. 

***Specified creation token already exists***

This error occurs when you try to create a volume, and you specify a creation token (export path) for which a volume already exists.

* Cause:   
The creation token (export path) you specified during volume creation is already associated with another volume. 
* Solution:   
Choose a different creation token.  Alternatively, delete the other volume.

***Specified creation token is reserved***

This error occurs when you try to create a volume, and you specify “default” or “none” as the file path (creation token).

* Cause:    
You are trying to create a volume, and you specify “default” or “none” as the file path (creation token).
* Solution:   
Choose a different file path (creation token).
 
***Active Directory credentials are in use***

This error occurs when you try to delete the Active Directory configuration from an account where at least one SMB volume still exists.  The SMB volume was created by using the Active Directory configuration that you are trying to delete.

* Cause:   
You are trying to delete the Active Directory configuration from an account, but at least one SMB volume still exists that was initially created by using the Active Directory configuration. 
* Solution:   
First, delete all SMB volumes that were created by using the Active Directory configuration.  Then retry the configuration deletion.

***Cannot modify Organizational Unit assignment if the credentials are in use***

This error occurs when you try to change the Organizational Unit of an Active Directory configuration, but at least one SMB volume still exists.  The SMB volume was created by using that Active Directory configuration you are trying to delete.

* Cause:   
You are trying to change the Organizational Unit of an Active Directory configuration.  But at least one SMB volume still exists that was initially created by using the Active Directory configuration.
* Solution:   
 First, delete all SMB volumes that were created by using the Active Directory configuration.  Then retry the configuration deletion. 

***Active Directory update already in progress***

This error occurs when you try to edit an Active Directory configuration for which an edit operation is already in progress.

* Cause:   
You are trying to edit an Active Directory configuration, but another edit operation is already in progress.
* Solution:   
Wait until the currently running edit operation has finished.

***Delete all volumes using the selected credentials first***

This error occurs when you try to delete an Active Directory configuration, but at least one SMB volume still exists.  The SMB volume was created by using the Active Directory configuration that you are trying to delete.

* Cause:   
You are trying to delete an Active Directory configuration, but at least one SMB volume still exists that was initially created by using the Active Directory configuration.
* Solution:   
First, delete all SMB volumes that were created by using the Active Directory configuration.  Then retry the configuration deletion. 

***No Active Directory credentials found in region***

This error occurs when you try to create an SMB volume, but no Active Directory configuration has been added to the account for the region.

* Cause:   
You are trying to create an SMB volume, but no Active Directory configuration has been added to the account. 
* Solution:   
Add an Active Directory configuration to the account before you create an SMB volume.

***Could not query DNS server. Verify that the network configuration is correct and that DNS servers are available.***

This error occurs when you try to create an SMB volume, but a DNS server (specified in your Active Directory configuration) is unreachable. 

* Cause:   
You are trying to create an SMB volume, but a DNS server (specified in your Active Directory configuration) is unreachable.
* Solution:   
Review your Active Directory configuration and make sure that the DNS server IP addresses are correct and reachable.
If there’s no issues with the DNS server IP addresses, then verify that no firewalls are blocking the access.

***Too many concurrent jobs***

This error occurs when you try to create a snapshot when three other snapshot creation operations are already in progress for the subscription.

* Cause:   
You are trying to create a snapshot when three other snapshot creation operations are already in progress for the subscription. 
* Solution:   
Snapshot creation jobs take a few seconds at most to finish.  Wait a few seconds and retry the snapshot creation operation.

***Cannot spawn additional jobs. Please wait for the ongoing jobs to finish and try again***

This error can occur when you try to create or delete a volume under specific circumstances.

* Cause:   
You are trying to create or delete a volume under specific circumstances.
* Solution:   
Wait a minute or so and retry the operation.

***Volume is already transitioning between states***

This error can occur when you try to delete a volume that is currently in a transitioning state (that is, currently in the creating, updating, or deleting state).

* Cause:   
You are trying to delete a volume that is currently in a transitioning state.
* Solution:   
Wait until the currently running (state transitioning) operation has finished, and then retry the operation.

***Failed to split new volume from source volume snapshot***

 This error can occur when you try to create a volume from a snapshot.  

* Cause:   
You try to create a volume from a snapshot and volume ends in an error state.
* Solution:   
Delete the volume, then retry the volume creation operation from the snapshot.

 
## Next steps

* [Develop for Azure NetApp Files with REST API](azure-netapp-files-develop-with-rest-api.md)
