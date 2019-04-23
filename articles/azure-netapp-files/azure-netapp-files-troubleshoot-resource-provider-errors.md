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
ms.date: 03/25/2019
ms.author: b-juche
---
# Troubleshoot Azure NetApp Files Resource Provider errors
This article describes common Azure NetApp Files Resource Provider errors, their causes, solutions, and workarounds. 

<a name="error_01"></a>***Azure Key Vault not configured.***   
Azure Key Vault stores the required credentials for accessing the underlying API. This error indicates that Azure Key Vault did not receive the complete credentials for accessing the underlying API.

* Cause  
Azure Key Vault did not receive the correct credentials, or the credentials are incomplete.  

* Solution   
The Azure NetApp Files service uses Azure Key Vault. Azure Key Vault authenticates by using a token from Azure Active Directory. Therefore, the owner of the application must register the application in the Azure Active Directory.

* Workaround   
None.  Azure Key Vault must be set up correctly for using Azure NetApp Files.  

<a name="error_02"></a>***Creation Token cannot be changed.***   
This error occurs when you try to change the creation token after the volume has been created.
Creation token must be set when the volume is created and cannot be changed later.

* Cause   
You are trying to change the creation token after the volume has been created, which is not a supported operation.

* Solution   
After the Volume has been created, consider removing the parameter from the request to dismiss the error message.

* Workaround   
If you need to change the creation token, you can create a new volume with a new creation token, and then migrate the data to the new volume.


<a name="error_03"></a>***Creation Token must be at least 16 characters long.***   
This error occurs when the creation token does not meet the length requirement. The length of the creation token must be at least 16 characters.

* Cause   
The creation token does not meet the length requirement.  When you create a volume by using the API, a creation token is required. If you are using the portal, the token can be generated automatically.

* Solution   
Increase the length of the creation token. For example, you can add another word at the beginning or the end of the creation token.

* Workaround   
The minimum required length of the creation token cannot be bypassed.  You can use a prefix or suffix to increase the creation token length.


<a name="error_04"></a>***Error deleting a volume that was not found at Azure NetApp Files.***   
This error occurred because the internal registry of resources is out of sync.

* Cause   
The volume might stay displayed in the portal for some time after it has been deleted. If you delete the volume by using the API, it is possible that the volume was not specified correctly. The error can also be caused by outdated browser cache.

* Solution   
Clear browser cache if you are using the portal. There is also an internal cache that is refreshed every 10 minutes.  You can try to clear cache again.  If the problem persists after 10 minutes, you can create a support ticket.

* Workaround   
Use a different volume in the meantime and ignore the existing one.


<a name="error_05"></a>***Error inserting a new Volume found at Azure NetApp Files.***   
This error occurs because the internal registry of resources is out of sync.

* Cause   
The volume might remain displayed in the portal for some time after it has been deleted. If you delete the volume by using the API, it is possible that the volume was not specified correctly.

* Solution   
If you are using the portal, the volume has already been created.  The volume should appear automatically. If the problem persists, you can create a support ticket.

* Workaround   
You can create a volume with a different name and a different creation token.


<a name="error_06"></a>***The file path name can contain letters, numbers, and hyphens (""-"") only.***   
This error occurs when the file path contains unsupported characters, for example, a period ("."), comma (","), underscore ("\_"), or dollar sign ("$").

* Cause   
The file path contains unsupported characters, for example, a period ("."), comma (","), underscore ("\_"), or dollar sign ("$").

* Solution   
Remove characters that are not alphabetical letters, numbers, or hyphens ("-") from the file path you entered.

* Workaround   
You can replace an underscore with a hyphen or use capitalization instead of spaces to indicate the beginning of new words (for example, using "NewVolume" instead of "new volume").


<a name="error_07"></a>***Volume ID cannot be changed.***   
This error occurs when you try to change the volume ID.  Changing the volume ID is not a supported operation.

* Cause   
The ID of the file system is set when the volume is created. The volume ID cannot be changed subsequently.

* Solution   
None.

* Workaround   
None.  The volume ID is generated when the volume is created and cannot be changed subsequently.


<a name="error_08"></a>***An invalid value '{0}' was received for {1}.***   
This message indicates an error in the fields for RuleIndex, AllowedClients, UnixReadOnly, UnixReadWrite, Nfsv3, and Nfsv4.

* Cause   
The input validation request has failed for at least one of the following fields: RuleIndex, AllowedClients, UnixReadOnly, UnixReadWrite, Nfsv3, and Nfsv4.

* Solution   
Make sure to set all required and non-conflicting parameters on the command line. For example, you cannot set both the UnixReadOnly and UnixReadWrite parameters at the same time.

* Workaround   
See the Solution section.  


<a name="error_09"></a>***Missing value for '{0}'.***   
This error indicates that a required attribute is missing from the request for at least one of the following parameters: RuleIndex, AllowedClients, UnixReadOnly, UnixReadWrite, Nfsv3, and Nfsv4.

* Cause   
The input validation request has failed for at least one of the following fields: RuleIndex, AllowedClients, UnixReadOnly, UnixReadWrite, Nfsv3, and Nfsv4.

* Solution   
Make sure to set all required and non-conflicting parameters on the command line. For example, you cannot set both the UnixReadOnly and UnixReadWrite parameters at the same time

* Workaround   
See the Solution section.  


<a name="error_10"></a> ***{0} already in use.***   
This error indicates that the name for the resource has already been used.

* Cause   
You are trying to create a volume with a name that is the same as an existing volume.

* Solution   
Use a unique name when creating a volume.

* Workaround   
If necessary, you can change the name of the existing volume so that the new volume can use the intended name.


<a name="error_11"></a> ***{0} too short.***   
This error indicates that the volume name does not meet the minimum length requirement.

* Cause   
The volume name is too short.

* Solution   
Increase the length of the volume name.  

* Workaround   
You can add a common prefix or suffix to the volume name.


<a name="error_12"></a>***Azure NetApp Files API unreachable.***   
The Azure API relies on the Azure NetApp Files API to manage volumes.  This error indicates an issue with the API connection.

* Cause   
The underlying API is not responding, resulting in an internal error. This error is likely to be temporary.

* Solution   
The issue is likely to be temporary.  The request should succeed after some time.

* Workaround   
None. The underlying API is essential for managing volumes.  


<a name="error_13"></a>***No credentials found for subscription '{0}'.***   
This error indicates that the provided credentials are either invalid or have not been set correctly in the subscription.

* Cause   
Credentials that are invalid or incorrectly set prevent access to the service for managing volumes.

* Solution   
Make sure that the credentials are set and entered correctly on the command line.

* Workaround   
None.  Setting credentials correctly is essential for using Azure NetApp Files.  


<a name="error_14"></a>***No operation result id found for '{0}'.***   
This error indicates that an internal error is preventing the operation from completing.

* Cause   
An internal error occurred and prevented the operation from completing.

* Solution   
This error is likely to be temporary.  Wait a few minutes and try again. If the problem persists, create a ticket to have technical support investigate the issue.

* Workaround   
Wait a few minutes and check if the problem persists.


<a name="error_15"></a>***Operation '{0}' not supported.***   
This error indicates that the command is not available for the active subscription or resource.

* Cause   
The operation is not available for the subscription or resource.

* Solution   
Make sure that the command is entered correctly and available for the resource and subscription that you are using.

* Workaround   
See the Solution section.  


<a name="error_16"></a>***Patch operation is not supported for this resource type.***   
This error occurs when you try to change the mount target or snapshot.

* Cause   
The mount target is defined when it is created, and it cannot be changed subsequently.

* Solution   
None.  The mount target cannot be changed after the volume is created.

* Workaround   
None.


<a name="error_17"></a>***Received a value for read-only property '{0}'.***   
This error occurs when you define a value for a property that cannot be changed. For example, you cannot change the volume ID.

* Cause   
You attempted to modify a parameter (such as the volume ID) that cannot be changed.

* Solution   
None. The parameter for the volume ID cannot be modified.

* Workaround   
The volume ID should not require modification.  Therefore, a workaround is not necessary.

<a name="error_18"></a>***The requested {0} was not found.***   
This error occurs when you try to reference a nonexistent resource, for example, a volume or snapshot. The resource might have been deleted or have a misspelt resource name.

* Cause   
You are trying to reference a nonexistent resource (for example, a volume or snapshot) that has already been deleted or has an incorrectly spelled resource name.

* Solution   
Check the request for spelling errors to make sure that it is correctly referenced.

* Workaround   
See the Solution section.

<a name="error_19"></a>***Unable to get credentials for subscription '{0}'.***   
This error indicates that the provided credentials are either invalid or incorrectly set in the subscription.

* Cause   
Credentials that are invalid or incorrectly set in the subscription prevent access to the service for managing volumes.

* Solution   
Make sure that the credentials are set and entered correctly on the command line.

* Workaround   
None.  Correctly set credentials are essential for using Azure NetApp Files.

<a name="error_20"></a>***Unknown Azure NetApp Files Error.***   
The Azure API relies on the Azure NetApp Files API to manage volumes. The error indicates an issue in the communication to the API.

* Cause   
The underlying API is sending an unknown error.  This error is likely to be temporary.

* Solution   
The issue is likely to be temporary, and the request should succeed after some time. If the problem persists, create a support ticket to have the issue investigated.

* Workaround   
None.  The underlying API is essential for managing volumes.

<a name="error_21"></a>***Value received for an unknown property '{0}'.***   
This error occurs when nonexistent properties are provided for a resource such as the volume, snapshot, or mount target.

* Cause   
The request has a set of properties that can be used with each resource.  You cannot include any nonexistent properties in the request.

* Solution   
Make sure that all property names are spelled correctly and the properties are available for the subscription and resource.

* Workaround   
Reduce the number of properties defined in the request to eliminate the property that is causing the error.


<a name="error_22"></a>***Update operation is not supported for this resource type.***   
Only volumes can be updated. This error occurs when you try to perform an unsupported update operation, for example, updating a snapshot.

* Cause   
The resource you are trying to update does not support the update operation.  Only volumes can have their properties modified.

* Solution   
None.  The resource that you are trying to update does not support the update operation. Therefore, it cannot be changed.

* Workaround   
For a volume, create a new resource with the update in place and migrate the data.


<a name="error_23"></a>***Number of items: {0} for object: {1} is outside min-max range.***   
This error occurs when the export policy rules do not meet the minimum or maximum range requirement.  If you define the export policy, it must have one export policy rule at the minimum and five export policy rules at the maximum.

* Cause   
The export policy you defined does not meet the required range.  

* Solution   
Make sure that the index is not already used and that is in the range from 1 to 5.

* Workaround   
It is not mandatory to use export policy on the volumes. Therefore, you can omit the export policy entirely if you do not need to have export policy rules.


<a name="error_24"></a>***Duplicate value error for object {0}.***   
This error occurs when the export policy is not defined with a unique index.  When you define export policies, all export policy rules must have a unique index between 1 and 5.

* Cause   
The defined export policy does not meet the requirement for export policy rules. You must have one export policy rule at the minimum and five export policy rules at the maximum.  

* Solution   
Make sure that the index is not already used and that it is in the range from 1 to 5.

* Workaround   
Use a different index for the rule that you are trying to set.


