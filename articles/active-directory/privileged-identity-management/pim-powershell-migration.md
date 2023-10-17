---
title: PIM PowerShell for Azure Resources Migration Guidance
description: The following documentation provides guidance for Privileged Identity Management (PIM) PowerShell migration.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''
ms.service: active-directory
ms.workload: identity
ms.subservice: pim
ms.topic: how-to
ms.date: 07/11/2023
ms.author: billmath
ms.reviewer: shaunliu
ms.custom: pim, devx-track-azurepowershell
ms.collection: M365-identity-device-management
---
# PIM PowerShell for Azure Resources Migration Guidance
The following table provides guidance on using the new PowerShell cmdlts in the newer Azure PowerShell module.


## New cmdlts in the Azure PowerShell module

|Old AzureADPreview cmd|New Az cmd equivalent|Description|
|-----|-----|-----|
|Get-AzureADMSPrivilegedResource|[Get-AzResource](/powershell/module/az.resources/get-azresource)|Get resources|
|Get-AzureADMSPrivilegedRoleDefinition|[Get-AzRoleDefinition](/powershell/module/az.resources/get-azroledefinition)| Get role definitions|
|Get-AzureADMSPrivilegedRoleSetting|[Get-AzRoleManagementPolicy](/powershell/module/az.resources/get-azrolemanagementpolicy)|Get the specified role management policy for a resource scope|
|Set-AzureADMSPrivilegedRoleSetting|[Update-AzRoleManagementPolicy](/powershell/module/az.resources/update-azrolemanagementpolicy)| Update a rule defined for a role management policy|
|Open-AzureADMSPrivilegedRoleAssignmentRequest|[New-AzRoleAssignmentScheduleRequest](/powershell/module/az.resources/new-azroleassignmentschedulerequest)|Used for Assignment Requests</br>Create role assignment schedule request
|Open-AzureADMSPrivilegedRoleAssignmentRequest|[New-AzRoleEligibilityScheduleRequest](/powershell/module/az.resources/new-azroleeligibilityschedulerequest)|Used for Eligibility Requests</br>Create role eligibility schedule request|

## Next steps

- [Microsoft Entra Privileged Identity Management API reference](/graph/api/resources/privilegedidentitymanagementv3-overview)
