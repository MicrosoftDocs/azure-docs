---
title: Create a new access package in entitlement management
description: Learn how to create a new access package of resources you want to share in Azure Active Directory entitlement management.
services: active-directory
documentationCenter: ''
author: owinfreyATL
manager: amycolannino
editor: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.subservice: compliance
ms.date: 01/25/2023
ms.author: owinfrey
ms.reviewer: 
ms.collection: M365-identity-device-management


#Customer intent: As an administrator, I want detailed information about the options available when creating a new access package so that the access package can be managed with minimal effort.

---
# Create a new access package in entitlement management

An access package enables you to do a one-time setup of resources and policies that automatically administers access for the life of the access package. This article describes how to create a new access package.

## Overview

All access packages must be put in a container called a catalog. A catalog defines what resources you can add to your access package. If you don't specify a catalog, your access package will be put into the general catalog. Currently, you can't move an existing access package to a different catalog.

An access package can be used to assign access to roles of multiple resources that are in the catalog. If you're an administrator or catalog owner, you can add resources to the catalog while creating an access package.
If you're an access package manager, you can't add resources you own to a catalog. You're restricted to using the resources available in the catalog. If you need to add resources to a catalog, you can ask the catalog owner.

All access packages must have at least one policy for users to be assigned to the access package. Policies specify who can request the access package and also approval and lifecycle settings. When you create a new access package, you can create an initial policy for users in your directory, for users not in your directory, for administrator direct assignments only, or you can choose to create the policy later.

![Create an access package](./media/entitlement-management-access-package-create/access-package-create.png)

Here are the high-level steps to create a new access package.

1. In Identity Governance, start the process to create a new access package.

1. Select the catalog you want to create the access package in.

1. Add resource roles from resources in the catalog to your access package.

1. Specify an initial policy for users that can request access.

1. Specify any approval settings.

1. Specify lifecycle settings.

## Start new access package

**Prerequisite role:** Global administrator, Identity Governance administrator, User administrator, Catalog owner, or Access package manager

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Azure Active Directory** and then select **Identity Governance**.

1. In the left menu, select **Access packages**.

1. Select **New access package**.
   
    ![Entitlement management in the Azure portal](./media/entitlement-management-shared/access-packages-list.png)

## Basics

On the **Basics** tab, you give the access package a name and specify which catalog to create the access package in.

1. Enter a display name and description for the access package. Users will see this information when they submit a request for the access package.

1. In the **Catalog** drop-down list, select the catalog you want to create the access package in. For example, you might have a catalog owner that manages all the marketing resources that can be requested. In this case, you could select the marketing catalog.

    You'll only see catalogs you have permission to create access packages in. To create an access package in an existing catalog, you must be either a Global administrator, Identity Governance administrator or User administrator, or you must be a catalog owner or access package manager in that catalog.

    ![Access package - Basics](./media/entitlement-management-access-package-create/basics.png)

    If you're a Global administrator, an Identity Governance administrator, a User administrator, or catalog creator and you would like to create your access package in a new catalog that's not listed, select **Create new catalog**. Enter the Catalog name and description and then select **Create**. 

    The access package you're creating, and any resources included in it, will be added to the new catalog. You can also add additional catalog owners later, and add attributes to the resources you put in the catalog. Read [Add resource attributes in the catalog](entitlement-management-catalog-create.md#add-resource-attributes-in-the-catalog) to learn more about how to edit the attributes list for a specific catalog resource and the prerequisite roles. 

1. Select **Next**.

## Resource roles

On the **Resource roles** tab, you select the resources to include in the access package. Users who request and receive the access package will receive all the resource roles, such as group membership, in the access package.

If you're not sure which resource roles to include, you can skip adding resource roles while creating the access package, and then [add resource roles](entitlement-management-access-package-resources.md) after you've created the access package.

1. Select the resource type you want to add (**Groups and Teams**, **Applications**, or **SharePoint sites**).

1. In the Select pane that appears, select one or more resources from the list.

    ![Access package - Resource roles](./media/entitlement-management-access-package-create/resource-roles.png)

    If you're creating the access package in the General catalog or a new catalog, you'll be able to pick any resource from the directory that you own. You must be at least a Global administrator, a User administrator, or Catalog creator.

    If you're creating the access package in an existing catalog, you can select any resource that is already in the catalog without owning it.

    If you're a Global administrator, a User administrator, or catalog owner, you have the additional option of selecting resources you own that aren't yet in the catalog. If you select resources not currently in the selected catalog, these resources will also be added to the catalog for other catalog administrators to build access packages with. To see all the resources that can be added to the catalog, check the **See all** check box at the top of the Select pane. If you only want to select resources that are currently in the selected catalog, leave the check box **See all** unchecked (default state).

1. Once you've selected the resources, in the **Role** list, select the role you want users to be assigned for the resource.  For more information on selecting the appropriate roles for a resource, read [add resource roles](entitlement-management-access-package-resources.md#add-resource-roles).

    ![Access package - Resource role selection](./media/entitlement-management-access-package-create/resource-roles-role.png)

1. Select **Next**.

>[!NOTE]
>You can add dynamic groups to a catalog and to an access package. However, you will be able to select only the Owner role when managing a dynamic group resource in an access package.

## Requests

On the **Requests** tab, you create the first policy to specify who can request the access package and also approval settings. Later, you can create more request policies to allow additional groups of users to request the access package with their own approval settings.

![Access package - Requests tab](./media/entitlement-management-access-package-create/requests.png)

Depending on who you want to be able to request this access package, perform the steps in one of the following sections.

[!INCLUDE [Entitlement management request policy](../../../includes/active-directory-entitlement-management-request-policy.md)]

[!INCLUDE [Entitlement management lifecycle policy](../../../includes/active-directory-entitlement-management-lifecycle-policy.md)]

## Review + create

On the **Review + create** tab, you can review your settings and check for any validation errors.

1. Review the access package's settings

    ![Access package - Enable policy setting](./media/entitlement-management-access-package-create/review-create.png)

1. Select **Create** to create the access package.

    The new access package appears in the list of access packages.

## Create an access package programmatically

There are two ways to create an access package programmatically, through Microsoft Graph and through the PowerShell cmdlets for Microsoft Graph.

### Create an access package with Microsoft Graph

You can create an access package using Microsoft Graph. A user in an appropriate role with an application that has the delegated `EntitlementManagement.ReadWrite.All` permission can call the API to

1. [List the accessPackageResources in the catalog](/graph/api/entitlementmanagement-list-accesspackagecatalogs?tabs=http&view=graph-rest-beta&preserve-view=true) and [create an accessPackageResourceRequest](/graph/api/entitlementmanagement-post-accesspackageresourcerequests?tabs=http&view=graph-rest-beta&preserve-view=true) for any resources that aren't yet in the catalog.
1. [List the accessPackageResourceRoles](/graph/api/accesspackage-list-accesspackageresourcerolescopes?tabs=http&view=graph-rest-beta&preserve-view=true) of each accessPackageResource in an accessPackageCatalog. This list of roles will then be used to select a role, when later creating an accessPackageResourceRoleScope.
1. [Create an accessPackage](/graph/tutorial-access-package-api).
1. [Create an accessPackageResourceRoleScope](/graph/api/accesspackage-post-accesspackageresourcerolescopes?tabs=http&view=graph-rest-beta&preserve-view=true) for each resource role needed in the access package.
1. [Create an accessPackageAssignmentPolicy](/graph/api/entitlementmanagement-post-accesspackageassignmentpolicies?tabs=http&view=graph-rest-beta&preserve-view=true) for each policy needed in the access package.


### Create an access package with Microsoft PowerShell

You can also create an access package in PowerShell with the cmdlets from the [Microsoft Graph PowerShell cmdlets for Identity Governance](https://www.powershellgallery.com/packages/Microsoft.Graph.Identity.Governance/) module version 1.16.0 or later.  This script illustrates using the Graph `beta` profile.

First, you would retrieve the ID of the catalog, and of the resources and their roles in that catalog that you wish to include in the access package, using a script similar to the following.

```powershell
Connect-MgGraph -Scopes "EntitlementManagement.ReadWrite.All"
Select-MgProfile -Name "beta"
$catalog = Get-MgEntitlementManagementAccessPackageCatalog -Filter "displayName eq 'Marketing'"

$rsc = Get-MgEntitlementManagementAccessPackageCatalogAccessPackageResource -AccessPackageCatalogId $catalog.Id -Filter "resourceType eq 'Application'" -ExpandProperty "accessPackageResourceScopes"
$filt = "(originSystem eq 'AadApplication' and accessPackageResource/id eq '" + $rsc[0].Id + "')"
$rr = Get-MgEntitlementManagementAccessPackageCatalogAccessPackageResourceRole -AccessPackageCatalogId $catalog.Id -Filter $filt -ExpandProperty "accessPackageResource"
```

Then, create the access package.

```powershell
$params = @{
	CatalogId = $catalog.id
	DisplayName = "sales reps"
	Description = "outside sales representatives"
}

$ap = New-MgEntitlementManagementAccessPackage -BodyParameter $params
```
Once the access package has been created, assign the resource roles to the access package.  For example, if you wished to include the second resource role of the first resource returned earlier as a resource role of the new access package, you would use a script similar to the following.

```powershell
$rparams = @{
	AccessPackageResourceRole = @{
	   OriginId = $rr[2].OriginId
	   DisplayName = $rr[2].DisplayName
	   OriginSystem = $rr[2].OriginSystem
	   AccessPackageResource = @{
	      Id = $rsc[0].Id
	      ResourceType = $rsc[0].ResourceType
	      OriginId = $rsc[0].OriginId
	      OriginSystem = $rsc[0].OriginSystem
	   }
	}
	AccessPackageResourceScope = @{
	   OriginId = $rsc[0].OriginId
	   OriginSystem = $rsc[0].OriginSystem
	}
}
New-MgEntitlementManagementAccessPackageResourceRoleScope -AccessPackageId $ap.Id -BodyParameter $rparams
```

Finally, create the policies.  In this policy, only the administrator can assign access, and there are no access reviews.  See [create an assignment policy through PowerShell](entitlement-management-access-package-request-policy.md#create-an-access-package-assignment-policy-through-powershell) and [create an accessPackageAssignmentPolicy](/graph/api/entitlementmanagement-post-assignmentpolicies?tabs=http&view=graph-rest-beta&preserve-view=true) for more examples.

```powershell

$pparams = @{
	AccessPackageId = $ap.Id
	DisplayName = "direct"
	Description = "direct assignments by administrator"
	AccessReviewSettings = $null
	RequestorSettings = @{
		ScopeType = "NoSubjects"
		AcceptRequests = $true
		AllowedRequestors = @(
		)
	}
	RequestApprovalSettings = @{
		IsApprovalRequired = $false
		IsApprovalRequiredForExtension = $false
		IsRequestorJustificationRequired = $false
		ApprovalMode = "NoApproval"
		ApprovalStages = @(
		)
	}
}
New-MgEntitlementManagementAccessPackageAssignmentPolicy -BodyParameter $pparams

```

## Next steps

- [Share link to request an access package](entitlement-management-access-package-settings.md)
- [Change resource roles for an access package](entitlement-management-access-package-resources.md)
- [Directly assign a user to the access package](entitlement-management-access-package-assignments.md)
- [Create an access review for an access package](entitlement-management-access-reviews-create.md)
