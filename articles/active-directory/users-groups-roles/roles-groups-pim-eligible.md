---
title: Assign a role to a group using Privileged Identity Management in Azure AD | Microsoft Docs
description: Preview custom Azure AD roles for delegating identity management. Manage Azure roles in the Azure portal, PowerShell, or Graph API.
services: active-directory
author: curtand
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: article
ms.date: 05/13/2020
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro

ms.collection: M365-identity-device-management
# Make a group an eligible member of an Azure AD role via Privileged Identity Management
---

# Assign a role to a group using Privileged Identity Management

This article describes how you can assign an Azure Active Directory (Azure AD) role to a group using Azure AD Privileged Identity Management. Beginning in November 2019, the Azure AD roles portion of Privileged Identity Management is being updated to a new version. You can assign a role to a group only in the new version. While the new version is being rolled out, you need to make sure you're in the new version to use the procedures in this article depend on version of Privileged Identity Management you currently have.

1. Sign in to the [Azure portal](https://portal.azure.com/) with a user who is in the [Privileged role administrator](../users-groups-roles/directory-assign-admin-roles.md#privileged-role-administrator) role.
1. Open **Azure AD Privileged Identity Management**. If you have a banner on the top of the overview page, you have the new version and con proceed with the instructions in this article. If you don't have the new version, you can't complete the role assignment.

   [![](media/roles-groups-pim-eligible/pim-new-version.png "Select Azure AD > Privileged Identity Management")](media/roles-groups-pim-eligible/pim-new-version.png#lightbox)

## Using Azure AD admin center

1. Open Azure AD [Privileged Identity Management](https://ms.portal.azure.com/?Microsoft_AAD_IAM_GroupRoles=true&Microsoft_AAD_IAM_userRolesV2=true&Microsoft_AAD_IAM_enablePimIntegration=true#blade/Microsoft_Azure_PIMCommon/CommonMenuBlade/quickStart) and sign in with Privileged role administrator or Global administrator permissions in the Azure AD organization.  

1. Select Privileged Identity Management > Azure AD roles > Roles > Add assignment

    ![Azure AD roles](./media/roles-groups-pim-eligible/roles-list.png)

1. Select the group. Only groups that are eligible for role assignment (the cloud groups created with "Azure AD roles can be assigned to the group") are shown in the list, not all groups.

    ![select the user to whom you're assigning the role](./media/roles-groups-pim-eligible/select-member.png)

1. Select the desired membership setting. For roles requiring activation, choose eligible. By default, the user would be permanently eligible, but you could also set a start and end time for the user's eligibility. Once you are complete, hit Save and Add to complete the role assignment.

    ![select the user to whom you're assigning the role](./media/roles-groups-pim-eligible/set-assignment-settings.png)

## Using PowerShell

### Download the Azure AD Preview PowerShell module

To install the Azure AD #PowerShell module, use the following cmdlets:

    install-module azureadpreview 
    import-module azureadpreview 

To verify that the module is ready to use, use the following cmdlet:

    get-module azureadpreview 

### Assign a group as an eligible member of a role

    $schedule = New-Object Microsoft.Open.MSGraph.Model.AzureADMSPrivilegedSchedule
    $schedule.Type = "Once"     
    $schedule.StartDateTime = "2019-04-26T20:49:11.770Z"
    $schedule.endDateTime = "2019-07-25T20:49:11.770Z"
    Open-AzureADMSPrivilegedRoleAssignmentRequest -ProviderId aadRoles -Schedule $schedule -ResourceId "[YOUR TENANT ID]" -RoleDefinitionId "9f8c1837-f885-4dfd-9a75-990f9222b21d" -SubjectId "[YOUR GROUP ID]" -AssignmentState "Eligible" -Type "AdminAdd" 

## Using Microsoft Graph API

    POST 
    https://graph.microsoft.com/beta/privilegedAccess/aadroles/roleAssignmentRequests  
    
    {
    
     "roleDefinitionId": {roleDefinitionId}, 
    
     "resourceId": {tenantId}, 
    
     "subjectId": {GroupId}, 
    
     "assignmentState": "Eligible", 
    
     "type": "AdminAdd", 
    
     "reason": "reason string", 
    
     "schedule": { 
    
           "startDateTime": {DateTime}, 
    
           "endDateTime": {DateTime}, 
    
           "type": "Once"  
    
     } 
    
    }

## Next steps

- [Configure Azure AD admin role settings in Privileged Identity Management](../privileged-identity-management/pim-how-to-change-default-settings.md)
- [Assign Azure resource roles in Privileged Identity Management](../privileged-identity-management/pim-resource-roles-assign-roles.md)
