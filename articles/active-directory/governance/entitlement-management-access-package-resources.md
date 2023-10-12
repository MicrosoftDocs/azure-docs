---
title: Change resource roles for an access package in entitlement management
description: Learn how to change the resource roles for an existing access package in entitlement management.
services: active-directory
documentationCenter: ''
author: owinfreyatl
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


#Customer intent: As an administrator, I want detailed information about how I can edit an access package so that requestors have the resources they need to perform their job.

---
# Change resource roles for an access package in entitlement management

As an access package manager, you can change the resources in an access package at any time without worrying about provisioning the user's access to the new resources, or removing their access from the previous resources. This article describes how to change the resource roles for an existing access package.

This video provides an overview of how to change an access package.

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE3LD4Z]

## Check catalog for resources

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

If you need to add resources to an access package, you should check whether the resources you need are available in the access package's catalog. If you're an access package manager, you can't add resources to a catalog, even if you own them. You're restricted to using the resources available in the catalog.

**Prerequisite role:** Global administrator, Identity Governance administrator, Catalog owner, or Access package manager

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Identity Governance Administrator](../roles/permissions-reference.md#identity-governance-administrator).

1. Browse to **Identity governance** > **Entitlement management** > **Access package**.

1. On the **Access packages** page open the access package you want to check catalog for resources for.

1. In the left menu, select **Catalog** and then open the catalog.

1. In the left menu, select **Resources** to see the list of resources in this catalog.

    ![List of resources in a catalog](./media/entitlement-management-access-package-resources/catalog-resources.png)

1. If the resources aren't already in the catalog, and you're an administrator or a catalog owner, you can [add resources to a catalog](entitlement-management-catalog-create.md#add-resources-to-a-catalog). The types of resources you can add are groups, applications, and SharePoint Online sites. For example:

   * Groups can be cloud-created Microsoft 365 Groups or cloud-created Microsoft Entra security groups. Groups that originate in an on-premises Active Directory can't be assigned as resources because their owner or member attributes can't be changed in Microsoft Entra ID. To give users access to an application that uses AD security group memberships, create a new group in Microsoft Entra ID, configure [group writeback to AD](../hybrid/connect/how-to-connect-group-writeback-v2.md), and [enable that group to be written to AD](../enterprise-users/groups-write-back-portal.md). Groups that originate in Exchange Online as Distribution groups can't be modified in Microsoft Entra ID either.
   * Applications can be Microsoft Entra enterprise applications, which include both software as a service (SaaS) applications and your own applications integrated with Microsoft Entra ID. If your application hasn't yet been integrated with Microsoft Entra ID, see [govern access for applications in your environment](identity-governance-applications-prepare.md) and [integrate an application with Microsoft Entra ID](identity-governance-applications-integrate.md).
   * Sites can be SharePoint Online sites or SharePoint Online site collections.

1. If you're an access package manager and you need to add resources to the catalog, you can ask the catalog owner to add them.

## Add resource roles

A resource role is a collection of permissions associated with a resource.  Resources can be made available for users to request if you add resource roles from each of the catalog's resources to your access package. You can add resource roles that are provided by groups, teams, applications, and SharePoint sites.  When a user receives an assignment to an access package, they are added to all the resource roles in the access package.

If you want some users to receive different roles than others, then you need to create multiple access packages in the catalog, with separate access packages for each of the resource roles.  You can also mark the access packages as [incompatible](entitlement-management-access-package-incompatible.md) with each other so users can't request access to access packages that would give them excessive access.

**Prerequisite role:** Global Administrator, Identity Governance Administrator, Catalog owner, or Access package manager

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Identity Governance Administrator](../roles/permissions-reference.md#identity-governance-administrator).

1. Browse to **Identity governance** > **Entitlement management** > **Access package**.

1. On the **Access packages** page open the access package you want to add resource roles to.

1. In the left menu, select **Resource roles**.

1. Select **Add resource roles** to open the Add resource roles to access package page.

    ![Access package - Add resource roles](./media/entitlement-management-access-package-resources/resource-roles-add.png)

1. Depending on whether you want to add a group, team, application, or SharePoint site, perform the steps in one of the following resource role sections.

## Add a group or team resource role

You can have entitlement management automatically add users to a group or a team in Microsoft Teams when they're assigned an access package. 

- When a group or team is part of an access package and a user is assigned to that access package, the user is added to that group or team, if not already present.
- When a user's access package assignment expires, they're removed from the group or team, unless they currently have an assignment to another access package that includes that same group or team.

You can select any [Microsoft Entra security group or Microsoft 365 Group](../fundamentals/how-to-manage-groups.md). Administrators can add any group to a catalog; catalog owners can add any group to the catalog if they're owner of the group. Keep the following Microsoft Entra constraints in mind when selecting a group:

- When a user, including a guest, is added as a member to a group or team, they can see all the other members of that group or team.
- Microsoft Entra ID can't change the membership of a group that was synchronized from Windows Server Active Directory using Microsoft Entra Connect, or that was created in Exchange Online as a distribution group.  
- The membership of dynamic groups can't be updated by adding or removing a member, so dynamic group memberships aren't suitable for use with entitlement management.
- Microsoft 365 groups have additional constraints, described in the [overview of Microsoft 365 Groups for administrators](/microsoft-365/admin/create-groups/office-365-groups), including a limit of 100 owners per group, limits on how many members can access Group conversations concurrently, and 7000 groups per member.

For more information, see [Compare groups](/office365/admin/create-groups/compare-groups) and [Microsoft 365 Groups and Microsoft Teams](/microsoftteams/office-365-groups).

1. On the **Add resource roles to access package** page, select **Groups and Teams** to open the Select groups pane.

1. Select the groups and teams you want to include in the access package.

    ![Access package - Add resource roles - Select groups](./media/entitlement-management-access-package-resources/group-select.png)

1. Select **Select**.

    Once you select the group or team, the **Sub type** column lists one of the following subtypes:

    | Sub type | Description |
    | --- | --- |
    | Security | Used for granting access to resources. |
    | Distribution | Used for sending notifications to a group of people. |
    | Microsoft 365 | Microsoft 365 Group that isn't Teams-enabled. Used for collaboration between users, both inside and outside your company. |
    | Team | Microsoft 365 Group that is Teams-enabled. Used for collaboration between users, both inside and outside your company. |

1. In the **Role** list, select **Owner** or **Member**.

    You typically select the Member role. If you select the Owner role, that will allow users to add or remove other members or owners.

    ![Access package - Add resource role for a group or team](./media/entitlement-management-access-package-resources/group-role.png)

1. Select **Add**.

    Any users with existing assignments to the access package will automatically become members of this group or team when it's added.

## Add an application resource role

You can have Microsoft Entra ID automatically assign users access to a Microsoft Entra enterprise application, including both SaaS applications and your organization's applications integrated with Microsoft Entra ID, when a user is assigned an access package. For applications that integrate with Microsoft Entra ID through federated single sign-on, Microsoft Entra ID issues federation tokens for users assigned to the application.

Applications can have multiple app roles defined in their manifest. When you add an application to an access package, if that application has more than one app role, you need to specify the appropriate role for those users in each access package. If you're developing applications, you can read more about how those roles are added to your applications in [How to: Configure the role claim issued in the SAML token for enterprise applications](../develop/enterprise-app-role-management.md). If you're using the Microsoft authentication libraries, there is also a [code sample](../develop/sample-v2-code) for how to use app roles for access control.

> [!NOTE]
> If an application has multiple roles, and more than one role of that application are in an access package, then the user will receive all those application's roles.  If instead you want users to only have some of the application's roles, then you will need to create multiple access packages in the catalog, with separate access packages for each of the application roles.

Once an application role is part of an access package:

- When a user is assigned that access package, the user is added to that application role, if not already present.
- When a user's access package assignment expires, their access is removed from the application, unless they have an assignment to another access package that includes that application role.

Here are some considerations when selecting an application:

- Applications may also have groups assigned to their app roles as well.  You can choose to add a group in place of an application role in an access package, however then the application won't be visible to the user as part of the access package in the My Access portal.
- Microsoft Entra admin center may also show service principals for services that can't be selected as applications.  In particular, **Exchange Online** and **SharePoint Online** are services, not applications that have resource roles in the directory, so they can't be included in an access package.  Instead, use group-based licensing to establish an appropriate license for a user who needs access to those services.
- Applications that only support Personal Microsoft Account users for authentication, and don't support organizational accounts in your directory, don't have application roles and can't be added to access package catalogs.

1. On the **Add resource roles to access package** page, select **Applications** to open the Select applications pane.

1. Select the applications you want to include in the access package.

    ![Access package - Add resource roles - Select applications](./media/entitlement-management-access-package-resources/application-select.png)

1. Select **Select**.

1. In the **Role** list, select an application role.

    ![Access package - Add resource role for an application](./media/entitlement-management-access-package-resources/application-role.png)

1. Select **Add**.

    Any users with existing assignments to the access package will automatically be given access to this application when it's added.

## Add a SharePoint site resource role

Microsoft Entra ID can automatically assign users access to a SharePoint Online site or SharePoint Online site collection when they're assigned an access package.

1. On the **Add resource roles to access package** page, select **SharePoint sites** to open the Select SharePoint Online sites pane.

    :::image type="content" source="media/entitlement-management-access-package-resources/resource-sharepoint-add.png" alt-text="Access package - Add resource roles - Select SharePoint sites - Portal view":::

1. Select the SharePoint Online sites you want to include in the access package.

    ![Access package - Add resource roles - Select SharePoint Online sites](./media/entitlement-management-access-package-resources/sharepoint-site-select.png)

1. Select **Select**.

1. In the **Role** list, select a SharePoint Online site role.

    ![Access package - Add resource role for a SharePoint Online site](./media/entitlement-management-access-package-resources/sharepoint-site-role.png)

1. Select **Add**.

    Any users with existing assignments to the access package will automatically be given access to this SharePoint Online site when it's added.

## Add resource roles programmatically

There are two ways to add a resource role to an access package programmatically, through Microsoft Graph and through the PowerShell cmdlets for Microsoft Graph.

### Add resource roles to an access package with Microsoft Graph

You can add a resource role to an access package using Microsoft Graph. A user in an appropriate role with an application that has the delegated `EntitlementManagement.ReadWrite.All` permission can call the API to:

1. [List the accessPackageResources in the catalog](/graph/api/entitlementmanagement-list-accesspackagecatalogs?tabs=http&view=graph-rest-beta&preserve-view=true) and [create an accessPackageResourceRequest](/graph/api/entitlementmanagement-post-accesspackageresourcerequests?tabs=http&view=graph-rest-beta&preserve-view=true) for any resources that aren't yet in the catalog.
1. [List the accessPackageResourceRoles](/graph/api/accesspackage-list-accesspackageresourcerolescopes?tabs=http&view=graph-rest-beta&preserve-view=true) of each accessPackageResource in an accessPackageCatalog. This list of roles will then be used to select a role, when subsequently creating an accessPackageResourceRoleScope.
1. [Create an accessPackageResourceRoleScope](/graph/api/accesspackage-post-accesspackageresourcerolescopes?tabs=http&view=graph-rest-beta&preserve-view=true) for each resource role needed in the access package.

### Add resource roles to an access package with Microsoft PowerShell

You can also create an access package in PowerShell with the cmdlets from the [Microsoft Graph PowerShell cmdlets for Identity Governance](https://www.powershellgallery.com/packages/Microsoft.Graph.Identity.Governance/) beta module version 2.1.x or later beta module version.  This script illustrates using the Graph `beta` profile and Microsoft Graph PowerShell cmdlets module version 2.4.0.

First, you would retrieve the ID of the catalog, and of the resource and its roles in that catalog that you wish to include in the access package, using a script similar to the following.  This assumes there is a single application resource in the catalog.

```powershell
Connect-MgGraph -Scopes "EntitlementManagement.ReadWrite.All"

$catalog = Get-MgBetaEntitlementManagementAccessPackageCatalog -Filter "displayName eq 'Marketing'"

$rsc = Get-MgBetaEntitlementManagementAccessPackageCatalogAccessPackageResource -AccessPackageCatalogId $catalog.Id -Filter "resourceType eq 'Application'" -ExpandProperty "accessPackageResourceScopes"
$filt = "(originSystem eq 'AadApplication' and accessPackageResource/id eq '" + $rsc.Id + "')"
$rr = Get-MgBetaEntitlementManagementAccessPackageCatalogAccessPackageResourceRole -AccessPackageCatalogId $catalog.Id -Filter $filt -ExpandProperty "accessPackageResource"
```

Then, assign the resource role from that resource to the access package.  For example, if you wished to include the second resource role of the resource returned earlier as a resource role of an access package, you would use a script similar to the following.

```powershell
$apid = "cdd5f06b-752a-4c9f-97a6-82f4eda6c76d"

$rparams = @{
	AccessPackageResourceRole = @{
	   OriginId = $rr[2].OriginId
	   DisplayName = $rr[2].DisplayName
	   OriginSystem = $rr[2].OriginSystem
	   AccessPackageResource = @{
	      Id = $rsc.Id
	      ResourceType = $rsc.ResourceType
	      OriginId = $rsc.OriginId
	      OriginSystem = $rsc.OriginSystem
	   }
	}
	AccessPackageResourceScope = @{
	   OriginId = $rsc.OriginId
	   OriginSystem = $rsc.OriginSystem
	}
}
New-MgBetaEntitlementManagementAccessPackageResourceRoleScope -AccessPackageId $apid -BodyParameter $rparams
```

## Remove resource roles

**Prerequisite role:** Global Administrator, Identity Governance Administrator, Catalog owner, or Access package manager

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Identity Governance Administrator](../roles/permissions-reference.md#identity-governance-administrator).

1. Browse to **Identity governance** > **Entitlement management** > **Access package**.

1. On the **Access packages** page open the access package you want to remove resource roles for.

1. In the left menu, select **Resource roles**.

1. In the list of resource roles, find the resource role you want to remove.

1. Select the ellipsis (**...**) and then select **Remove resource role**.

    Any users with existing assignments to the access package will automatically have their access revoked to this resource role when it's removed.

## When changes are applied

In entitlement management, Microsoft Entra ID processes bulk changes for assignment and resources in your access packages several times a day. So, if you make an assignment, or change the resource roles of your access package, it can take up to 24 hours for that change to be made in Microsoft Entra ID, plus the amount of time it takes to propagate those changes to other Microsoft Online Services or connected SaaS applications. If your change affects just a few objects, the change will likely only take a few minutes to apply in Microsoft Entra ID, after which other Microsoft Entra components will then detect that change and update the SaaS applications. If your change affects thousands of objects, the change takes longer. For example, if you have an access package with 2 applications and 100 user assignments, and you decide to add a SharePoint site role to the access package, there may be a delay until all the users are part of that SharePoint site role. You can monitor the progress through the Microsoft Entra audit log, the Microsoft Entra provisioning log, and the SharePoint site audit logs.

When you remove a member of a team, they're removed from the Microsoft 365 Group as well. Removal from the team's chat functionality might be delayed. For more information, see [Group membership](/microsoftteams/office-365-groups#group-membership).

When a resource role is added to an access package by an admin, users who are in that resource role, but don't have assignments to the access package, will remain in the resource role, but won't be assigned to the access package. For example, if a user is a member of a group and then an access package is created and that group's member role is added to an access package, the user won't automatically receive an assignment to the access package.

If you want the users to also be assigned to the access package, you can [directly assign users](entitlement-management-access-package-assignments.md#directly-assign-a-user) to an access package using the Microsoft Entra admin center, or in bulk via Graph or PowerShell. The users will then also receive access to the other resource roles in the access package.  However, as those users already have access prior to being added to the access package, when their access package assignment is removed, they remain in the resource role.  For example, if a user was a member of a group, and was assigned to an access package that included group membership for that group as a resource role, and then that user's access package assignment was removed, the user would retain their group membership.

## Next steps

- [Create a basic group and add members using Microsoft Entra ID](../fundamentals/how-to-manage-groups.md)
- [How to: Configure the role claim issued in the SAML token for enterprise applications](../develop/enterprise-app-role-management.md)
- [Introduction to SharePoint Online](/sharepoint/introduction)
