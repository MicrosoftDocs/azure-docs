---
title: Troubleshooting roles assigned to cloud group FAQ - Azure Active Directory | Microsoft Docs
description: Assign an Azure AD role to a role-assignable group in the Azure portal, PowerShell, or Graph API.
services: active-directory
author: curtand
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: article
ms.date: 08/13/2020
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro

ms.collection: M365-identity-device-management
---

# Troubleshooting roles assigned to cloud groups

Here are some common questions and troubleshooting tips for assigning roles to groups in Azure Active Directory (Azure AD).

**Q:** I'm a Groups Administrator but I can't see the **Azure AD roles can be assigned to the group** switch.

**A:** Only Privileged Role administrators or Global administrators can create a group that's eligible for role assignment. Only users in those roles see this control.

**Q:** Who can modify the membership of groups that are assigned to Azure AD roles?

**A:** By default, only Privileged Role Administrator and Global Administrator manage the membership of a role-assignable group, but you can delegate the management of role-assignable groups by adding group owners.

**Q**: I am a Helpdesk Administrator in my organization but I can't update password of a user who is a Directory Reader. Why does that happen?

**A**: The user might have gotten Directory Reader by way of a role-assignable group. All members and owners of a role-assignable groups are protected. Only users in the Privileged Authentication Administrator or Global Administrator roles can reset credentials for a protected user.

**Q:** I can't update password of a user. They don't have any higher privileged role assigned. Why is it happening?

**A:** The user could be an owner of a role-assignable group. We protect owners of role-assignable groups to avoid elevation of privilege. An example might be if a group Contoso_Security_Admins is assigned to Security administrator role, where Bob is the group owner and Alice is Password administrator in the organization. If this protection weren't present, Alice could reset Bob's credentials and take over his identity. After that, Alice could add herself or anyone to the group Contoso_Security_Admins group to become a Security administrator in the organization. To find out if a user is a group owner, get the list of owned objects of that user and see if any of the groups have isAssignableToRole set to true. If yes, then that user is protected and the behavior is by design. Refer to these documentations for getting owned objects:

- [Get-AzureADUserOwnedObject](/powershell/module/azuread/get-azureaduserownedobject?view=azureadps-2.0)  
- [List ownedObjects](/graph/api/user-list-ownedobjects?tabs=http&view=graph-rest-1.0)

**Q:** Can I create an access review on groups that can be assigned to Azure AD roles (specifically, groups with isAssignableToRole property set to true)?  

**A:** Yes, you can. If you are on newest version of Access Review, then your reviewers are directed to My Access by default, and only Global administrators can create access reviews on role-assignable groups. However, if you are on the older version of Access Review, then your reviewers are directed to the Access Panel by default, and both Global administrators and User administrator can create access reviews on role-assignable groups. The new experience will be rolled out to all customers on July 28, 2020 but if you’d like to upgrade sooner, make a request to [Azure AD Access Reviews - Updated reviewer experience in My Access Signup](https://forms.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR5dv-S62099HtxdeKIcgO-NUOFJaRDFDWUpHRk8zQ1BWVU1MMTcyQ1FFUi4u).

**Q:** Can I create an access package and put groups that can be assigned to Azure AD roles in it?

**A:** Yes, you can. Global Administrator and User Administrator have the power to put any group in an access package. Nothing changes for Global Administrator, but there's a slight change in User administrator role permissions. To put a role-assignable group into an access package, you must be a User Administrator and also owner of the role-assignable group. Here's the full table showing who can create access package in Enterprise License Management:

Azure AD directory role | Entitlement management role | Can add security group\* | Can add Microsoft 365 group\* | Can add app | Can add SharePoint Online site
----------------------- | --------------------------- | ----------------------- | ------------------------- | ----------- |  -----------------------------
Global administrator | n/a | ✔️ | ✔️ | ✔️  | ✔️
User administrator  | n/a  | ✔️  | ✔️  | ✔️
Intune administrator | Catalog owner | ✔️  | ✔️  | &nbsp;  | &nbsp;
Exchange administrator  | Catalog owner  | &nbsp; | ✔️  | &nbsp;  | &nbsp;
Teams service administrator | Catalog owner  | &nbsp; | ✔️  | &nbsp;  | &nbsp;
SharePoint administrator | Catalog owner | &nbsp; | ✔️  | &nbsp;  | ✔️ 
Application administrator | Catalog owner  | &nbsp;  | &nbsp; | ✔️  | &nbsp;
Cloud application administrator | Catalog owner  | &nbsp;  | &nbsp; | ✔️  | &nbsp;
User | Catalog owner | Only if group owner | Only if group owner | Only if app owner  | &nbsp;

\*Group isn't role-assignable; that is, isAssignableToRole = false. If a group is role-assignable, then the person creating the access package must also be owner of the role-assignable group.

**Q:** I can't find "Remove assignment" option in "Assigned Roles". How do I delete role assignment to a user?

**A:** This answer is applicable only to Azure AD Premium P1 organizations.

1. Sign in to the [Azure portal](https://portal.azure.com) and open **Azure Active Directory**.
1. Select users and open a user profile.
1. Select **Assigned roles**.
1. Select the gear icon. A pane opens that can give this information. There's a "Remove" button beside direct assignments. To remove indirect role assignment, remove the user from the group that has been assigned the role.

**Q:** How do I see all groups that are role-assignable?

**A:** Follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and open **Azure Active Directory**.
1. Select **Groups** > **All groups**.
1. Select **Add filters**.
1. Filter to **Role assignable**.

**Q:** How do I know which role are assigned to a principal directly and indirectly?

**A:** Follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and open **Azure Active Directory**.
1. Select users and open a user profile.
1. Select **Assigned roles**, and then:

    - In Azure AD Premium P1 licensed organizations: Select the gear icon. A pane opens that can give this information.
    - In Azure AD Premium P2 licensed organizations: You'll find direct and inherited license information in the **Membership** column.

**Q:** Why do we enforce creating a new cloud group for assigning it to role?  

**A:** If you assign an existing group to a role, the existing group owner could add other members to this group without the new members realizing that they'll have the role. Because role-assignable groups are powerful, we're putting lots of restrictions to protect them. You don't want changes to the group that would be surprising to the person managing the group.

## Next steps

- [Use cloud groups to manage role assignments](roles-groups-concept.md)
- [Create a role-assignable group](roles-groups-create-eligible.md)