---
title: Create a custom role defnition in Azure AD role-based access control - Azure Active Directory | Microsoft Docs
description: You can now see and manage members of an Azure AD administrator role in the Azure AD admin center.
services: active-directory
author: curtand
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: article
ms.date: 06/30/2019
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro

ms.collection: M365-identity-device-management
---
## Create a custom role in your Azure Active Directory (Azure AD) organization.

In Azure Active Directory (Azure AD), custom roles can be created in the Roles and administrators tab on the Azure AD page or the Application registration page. Custom roles can be assigned at the directory scope or a scope of a single app registration.

Create a new custom role using the Azure AD portal
	1. Sign in to the Azure portal as a Privileged Role Administrator or Global Administrator for the organization.
	2. Select Azure Active Directory, select Roles and administrators, and then select New custom role
	
	<screenshot of Roles and administrators tab>
	
	3. On the Basics tab provide "Application Support Administrator" for the name of the role and "Can manage basic aspects of application registrations." for the role description.
	
	<screenshot of Assignments tab>

	1. On the Permissions tab use the filter box to search for the following permissions individually, selecting the checkbox next to each one:
		a. microsoft.directory/applications/allProperties/read
		b. microsoft.directory/applications/basic/update
		c. microsoft.directory/applications/credentials/update
	
	<screenshot of Permissions tab>
	
	4. On the Review + create tab review the permissions and select Create

Create a custom role using Azure AD PowerShell
	1. Open the Azure AD preview PowerShell module
	2. Sign in by executing the command Connect-AzureAD
	3. Create a new role using the below PowerShell script:
	
	# Basic role information
	$description = "Application Support Administrator"
	$displayName = "Can manage basic aspects of application registrations."
	$templateId = (New-Guid).Guid
	
	# Set of permissions to grant
	$allowedResourceAction =
	@(
	    "microsoft.directory/applications/allProperties/read",
	    "microsoft.directory/applications/basic/update",
	    "microsoft.directory/applications/credentials/update"
	)
	$resourceActions = @{'allowedResourceActions'= $allowedResourceAction}
	$rolePermission = @{'resourceActions' = $resourceActions}
	$rolePermissions = $rolePermission
	
	# Create new custom admin role
	$customAdmin = New-AzureAdRoleDefinition -RolePermissions $rolePermissions -DisplayName $displayName -Description $description -TemplateId $templateId -IsEnabled $true

Create a custom role using Microsoft Graph API

HTTP Request 
POST https://graph.microsoft.com/beta/roleManagement/directory/roleDefinitions
Body 
{
    "description":"Can manage basic aspects of application registrations.",
    "displayName":"Application Support Administrator",
    "isEnabled":true, 
    "rolePermissions":
    [
        {
            "resourceActions":
            {
                "allowedResourceActions": 
                [
                    "microsoft.directory/applications/allProperties/read",
                    "microsoft.directory/applications/basic/update",
                    "microsoft.directory/applications/credentials/update"
                ]
            },
            "condition":null
        }
    ],
    "templateId":"<GET NEW GUID AND INSERT HERE>",
    "version":"1"
}

Note: there are two permissions available for granting the ability to create application registrations with different behaviors.
		○ microsoft.directory/applications/createAsOwner: this permission will result in the creator being added as the first owner of the created app registration, and the created app registration will count against the creator's 250 created objects quota.
		○ microsoft.directory/applicationPolicies/create: this permission will result in the creator not being added as the first owner of the createa app registration, and the created app registration will not count against the creator's 250 created objects quota. Use this permission carefully, as there is nothing preventing the assignee from creating app registrations until the directory-level quota is hit. If both permissions are assigned, this permission will take precedent.

## Next steps

* Feel free to share with us on the [Azure AD administrative roles forum](https://feedback.azure.com/forums/169401-azure-active-directory?category_id=166032).
* For more about roles and Administrator role assignment, see [Assign administrator roles](directory-assign-admin-roles.md).
* For default user permissions, see a [comparison of default guest and member user permissions](../fundamentals/users-default-permissions.md).
