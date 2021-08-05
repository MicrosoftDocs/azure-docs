---
title: View, add, and remove assignments for an access package in Azure AD entitlement management - Azure Active Directory
description: Learn how to view, add, and remove assignments for an access package in Azure Active Directory entitlement management.
services: active-directory
documentationCenter: ''
author: ajburnle
manager: daveba
editor: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.subservice: compliance
ms.date: 04/12/2021
ms.author: ajburnle
ms.reviewer: 
ms.collection: M365-identity-device-management


#Customer intent: As an administrator, I want detailed information about how I can edit an access package so that requestors have the resources they need to perform their job.

---
# View, add, and remove assignments for an access package in Azure AD entitlement management

In Azure AD entitlement management, you can see who has been assigned to access packages, their policy, and status. If an access package has an appropriate policy, you can also directly assign user to an access package. This article describes how to view, add, and remove assignments for access packages.

## Prerequisites

To use Azure AD entitlement management and assign users to access packages, you must have one of the following licenses:

- Azure AD Premium P2
- Enterprise Mobility + Security (EMS) E5 license

## View who has an assignment

**Prerequisite role:** Global administrator, Identity Governance administrator, User administrator, Catalog owner, Access package manager or Access package assignment manager

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Access packages** and then open the access package.

1. Click **Assignments** to see a list of active assignments.

    ![List of assignments to an access package](./media/entitlement-management-access-package-assignments/assignments-list.png)

1. Click a specific assignment to see additional details.

1. To see a list of assignments that did not have all resource roles properly provisioned, click the filter status and select **Delivering**.

    You can see additional details on delivery errors by locating the user's corresponding request on the **Requests** page.

1. To see expired assignments, click the filter status and select **Expired**.

1. To download a CSV file of the filtered list, click **Download**.

## View assignments programmatically
### View assignments with Microsoft Graph
You can also retrieve assignments in an access package using Microsoft Graph.  A user in an appropriate role with an application that has the delegated `EntitlementManagement.Read.All` or `EntitlementManagement.ReadWrite.All` permission can call the API to [list accessPackageAssignments](/graph/api/accesspackageassignment-list?view=graph-rest-beta&preserve-view=true). While an identity governance administrator can retrieve access packages from multiple catalogs, if user is assigned only to catalog-specific delegated administrative roles, the request must supply a filter to indicate a specific access package, such as: `$filter=accessPackage/id eq 'a914b616-e04e-476b-aa37-91038f0b165b'`. An application that has the application permission `EntitlementManagement.Read.All` or `EntitlementManagement.ReadWrite.All` permission can also use this API.

### View assignments with PowerShell

You can perform this query in PowerShell with the `Get-MgEntitlementManagementAccessPackageAssignment` cmdlet from the [Microsoft Graph PowerShell cmdlets for Identity Governance](https://www.powershellgallery.com/packages/Microsoft.Graph.Identity.Governance/) module version 1.6.0 or later. This cmdlet takes as a parameter the access package ID, which is included in the response from the `Get-MgEntitlementManagementAccessPackage` cmdlet.

```powershell
Connect-MgGraph -Scopes "EntitlementManagement.Read.All"
Select-MgProfile -Name "beta"
$accesspackage = Get-MgEntitlementManagementAccessPackage -DisplayNameEq "Marketing Campaign"
$assignments = Get-MgEntitlementManagementAccessPackageAssignment -AccessPackageId $accesspackage.Id -ExpandProperty target -All -ErrorAction Stop
$assignments | ft Id,AssignmentState,TargetId,{$_.Target.DisplayName}
```

## Directly assign a user

In some cases, you might want to directly assign specific users to an access package so that users don't have to go through the process of requesting the access package. To directly assign users, the access package must have a policy that allows administrator direct assignments.

**Prerequisite role:** Global administrator, User administrator, Catalog owner, Access package manager or Access package assignment manager

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Access packages** and then open the access package.

1. In the left menu, click **Assignments**.

1. Click **New assignment** to open Add user to access package.

    ![Assignments - Add user to access package](./media/entitlement-management-access-package-assignments/assignments-add-user.png)

1.	In the **Select policy** list, select a policy that the users' future requests and lifecycle will be governed and tracked by. If you want the selected users to have different policy settings, you can click **Create new policy** to add a new policy.

1.	Once you select a policy, you’ll be able to Add users to select the users you want to assign this access package to, under the chosen policy.

    > [!NOTE]
    > If you select a policy with questions, you can only assign one user at a time.

1. Set the date and time you want the selected users' assignment to start and end. If an end date is not provided, the policy's lifecycle settings will be used.

1.	Optionally provide a justification for your direct assignment for record keeping.

1.	If the selected policy includes additional requestor information, click **View questions** to answer them on behalf of the users, then click **Save**.  

     ![Assignments - click view questions](./media/entitlement-management-access-package-assignments/assignments-view-questions.png)

    ![Assignments - questions pane](./media/entitlement-management-access-package-assignments/assignments-questions-pane.png)

1. Click **Add** to directly assign the selected users to the access package.

    After a few moments, click **Refresh** to see the users in the Assignments list.

## Directly assigning users programmatically
### Assign a user to an access package with Microsoft Graph
You can also directly assign a user to an access package using Microsoft Graph.  A user in an appropriate role with an application that has the delegated `EntitlementManagement.ReadWrite.All` permission, or an application with that application permission, can call the API to [create an accessPackageAssignmentRequest](/graph/api/accesspackageassignmentrequest-post?view=graph-rest-beta&preserve-view=true). In this request, the value of the `requestType` property should be `AdminAdd`, and the `accessPackageAssignment` property is a structure that contains the `targetId` of the user being assigned.

### Assign a user to an access package with PowerShell

You can assign a user to an access package in PowerShell with the `New-MgEntitlementManagementAccessPackageAssignmentRequest` cmdlet from the [Microsoft Graph PowerShell cmdlets for Identity Governance](https://www.powershellgallery.com/packages/Microsoft.Graph.Identity.Governance/) module version 1.6.0 or later. This cmdlet takes as parameters
* the access package ID, which is included in the response from the `Get-MgEntitlementManagementAccessPackage` cmdlet,
* the access package assignment policy ID, which is included in the response from the `Get-MgEntitlementManagementAccessPackageAssignmentPolicy`cmdlet,
* the object ID of the target user.

```powershell
Connect-MgGraph -Scopes "EntitlementManagement.ReadWrite.All"
Select-MgProfile -Name "beta"
$accesspackage = Get-MgEntitlementManagementAccessPackage -DisplayNameEq "Marketing Campaign" -ExpandProperty "accessPackageAssignmentPolicies"
$policy = $accesspackage.AccessPackageAssignmentPolicies[0]
$req = New-MgEntitlementManagementAccessPackageAssignmentRequest -AccessPackageId $accesspackage.Id -AssignmentPolicyId $policy.Id -TargetId "a43ee6df-3cc5-491a-ad9d-ea964ef8e464"
```

You can also assign multiple users to an access package in PowerShell with the `New-MgEntitlementManagementAccessPackageAssignment` cmdlet from the [Microsoft Graph PowerShell cmdlets for Identity Governance](https://www.powershellgallery.com/packages/Microsoft.Graph.Identity.Governance/) module version 1.6.1 or later. This cmdlet takes as parameters
* the access package ID, which is included in the response from the `Get-MgEntitlementManagementAccessPackage` cmdlet,
* the access package assignment policy ID, which is included in the response from the `Get-MgEntitlementManagementAccessPackageAssignmentPolicy`cmdlet,
* the object IDs of the target users, either as an array of strings, or as a list of user members returned from the `Get-MgGroupMember` cmdlet.

For example, if you want to ensure all the users who are currently members of a group also have assignments to an access package, you can use this cmdlet to create requests for those users who don't currently have assignments.  Note that this will cmdlet will only create assignments; it does not remove assignments.

```powershell
Connect-MgGraph -Scopes "EntitlementManagement.ReadWrite.All,Directory.Read.All"
Select-MgProfile -Name "beta"
$members = Get-MgGroupMember -GroupId "a34abd69-6bf8-4abd-ab6b-78218b77dc15"
$accesspackage = Get-MgEntitlementManagementAccessPackage -DisplayNameEq "Marketing Campaign" -ExpandProperty "accessPackageAssignmentPolicies"
$policy = $accesspackage.AccessPackageAssignmentPolicies[0]
$req = New-MgEntitlementManagementAccessPackageAssignment -AccessPackageId $accesspackage.Id -AssignmentPolicyId $policy.Id -RequiredGroupMember $members
```

## Remove an assignment

**Prerequisite role:** Global administrator, User administrator, Catalog owner, Access package manager or Access package assignment manager

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Access packages** and then open the access package.

1. In the left menu, click **Assignments**.
 
1. Click the check box next to the user whose assignment you want to remove from the access package. 

1. Click the **Remove** button near the top of the left pane. 
 
    ![Assignments - Remove user from access package](./media/entitlement-management-access-package-assignments/remove-assignment-select-remove-assignment.png)

    A notification will appear informing you that the assignment has been removed. 

## Remove an assignment programmatically
### Remove an assignment with Microsoft Graph
You can also remove an assignment of a user to an access package using Microsoft Graph.  A user in an appropriate role with an application that has the delegated `EntitlementManagement.ReadWrite.All` permission, or an application with that application permission, can call the API to [create an accessPackageAssignmentRequest](/graph/api/accesspackageassignmentrequest-post?view=graph-rest-beta&preserve-view=true).  In this request, the value of the `requestType` property should be `AdminRemove`, and the `accessPackageAssignment` property is a structure that contains the `id` property identifying the `accessPackageAssignment` being removed.

### Remove an assignment with PowerShell

You can remove a user's assignment in PowerShell with the `New-MgEntitlementManagementAccessPackageAssignmentRequest` cmdlet from the [Microsoft Graph PowerShell cmdlets for Identity Governance](https://www.powershellgallery.com/packages/Microsoft.Graph.Identity.Governance/) module version 1.6.0 or later.

```powershell
Connect-MgGraph -Scopes "EntitlementManagement.ReadWrite.All"
Select-MgProfile -Name "beta"
$assignments = Get-MgEntitlementManagementAccessPackageAssignment -Filter "accessPackageId eq '9f573551-f8e2-48f4-bf48-06efbb37c7b8' and assignmentState eq 'Delivered'" -All -ErrorAction Stop
$toRemove = $assignments | Where-Object {$_.targetId -eq '76fd6e6a-c390-42f0-879e-93ca093321e7'}
$req = New-MgEntitlementManagementAccessPackageAssignmentRequest -AccessPackageAssignmentId $toRemove.Id -RequestType "AdminRemove"
```

## Next steps

- [Change request and settings for an access package](entitlement-management-access-package-request-policy.md)
- [View reports and logs](entitlement-management-reports.md)
