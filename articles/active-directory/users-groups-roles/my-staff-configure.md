---
title: Delegate user management with My Staff - Azure AD | Microsoft Docs
description: Using administrative units for more granular delegation of permissions in Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
ms.topic: article
ms.service: active-directory
ms.subservice: user-help
ms.workload: identity
ms.date: 03/3/2020
ms.author: curtand
ms.reviewer: sahenry
ms.custom: oldportal;it-pro;

---
# Delegate user management with My Staff

My Staff enables firstline managers, such as a store manager, to ensure that their staff members are able to access their Azure AD accounts. Instead of relying on a central helpdesk, organizations can delegate common tasks such as resetting passwords or changing phone numbers to a firstline manager. With My Staff, a user who can’t access their account can re-gain access in just a couple of clicks – no helpdesk or IT staff required.

Before you configure My Staff for your organization, we recommend that you review this documentation as well as the end user documentation to ensure you understand the functionality and impact of this feature. You can leverage the user documentation to train and prepare your users for the new experience and help to ensure a successful rollout.

## How to configure administrative units

My Staff is based on administrative units (AUs), which are a container of resources over which a user can be given scoped administrative control. To learn more about AUs, see [Administrative units management](directory-administrative-units.md).

For My Staff, administrative units define a set of users such as a store or department. A firstline manager is then assigned a role whose permissions are scoped to one or more AUs. To reset passwords and manage phone numbers in My Staff, firstline managers should be assigned roles that have permission to take those actions, such as Helpdesk (Password) Administrator and Authentication Administrator.

Those permissions should then be scoped to a specific AU or AUs. To learn more about Azure AD administrator roles, read our documentation.

AUs can be managed in the Azure AD portal and using PowerShell. The portal experience for configuring AUs is in private preview and can be accessed at https://aka.ms/adminunits. For info on the private preview, read this documentation. Note: Only Helpdesk (Password) Administrator and User Administrator roles can be scoped to AUs through the UX. If you want to scope the Authentication Admin role, you will need to use PowerShell.

You can also manage AUs through PowerShell, which is supported in public preview. The following are example scripts that you can use to configure Admin Units for testing My Staff:
Setup script: Create users and managers for three Contoso locations: Seattle, Portland, and Denver. If you receive an error when running the last three commands for activating administrator roles, you can safely ignore them and proceed. The following accounts are created:

-	Users
o	ContosoSeattleUser1 through ContosoSeattleUser20
o	ContosoPortlandUser1 through ContosoSeattleUser20
o	ContosoDenverUser1 through ContosoDenverUser20
o	ContosoChicagoUser1 through ContosoChicagoUser20
o	ContosoOrlandoUser1 through ContosoOrlandoUser20
-	Admins
  - ContosoSeattleManager1 through ContosoSeattleManager20
  - ContosoPortlandManager1 through ContosoSeattleManager20
  - ContosoDenverManager1 through ContosoDenverManager20
  - ContosoChicagoManager1 through ContosoChicagoManager20
  - ContosoOrlandoManager1 through ContosoOrlandoManager20

Create and populate script: Create an AU for each location, add users to AUs, scope manager permissions to appropriate AUs. The following permissions are assigned:

- Seattle location assigned to all ContosoSeattleManager accounts with Authentication Administrator role scoped to the Seattle AU
- Portland location assigned to all ContosoPortlandManager accounts with Helpdesk Administrator role scoped to the Portland AU
- Denver location assigned to all ContosoDenverManager accounts with Authentication Administrator and Helpdesk Administrator roles scoped to the Denver AU
- Chicago location assigned to all ContosoChicagoManager accounts with User Administrator role scoped to the Chicago AU
- All ContosoOrlandoManager accounts assigned the User Administrator role, not scoped. 

Cleanup script: Delete all scoped role memberships, admin units, and users create during the demo.

## How to enable My Staff

Once you have configured Admin units, you can enable your administrators to access My Staff. To enable My Staff, complete the following steps:

1. Sign into the Azure portal as a User administrator or a Global administrator.
2. Browse to **Azure Active Directory** > **User settings** > **Manage settings for access panel preview features**.
3. Under **Administrators can access My Staff**, you can choose to enable for all users, selected users, or no user access.

## Access My Staff

Once My Staff has been enabled, the users that it is enabled for will be able to access it through https://mystaff.microsoft.com or aka.ms/mystaff. Only administrators can access My Staff, so if a non-admin user tries to access it, they will see an error message.
When you first sign into My Staff, you will be a shown a list of AUs that you have been given administrative permissions over. Select an AU to view the members of that AU. When you select an AU, select a user to open their profile.

## Reset a user’s password

To do this, you must have the Helpdesk (Password) Administrator role or a more privileged role.From **My Staff**, open a user’s profile. Choose **Reset password**. If the user is cloud-only, you will be shown a temporary password that you can give to the user. They will be prompted to change their password the next time they sign in. If the user is synced from on-premises Active Directory, you will be asked to enter a password for them that meets your on-premises AD policies. You can then give that password to the user.

## Manage a user’s phone number (coming soon)

From My Staff, open a user’s profile. Choose the plus icon in the “Phone number” section. Add a phone number for the user. You can also choose pencil icon to change the phone number. Lastly, you can choose the trashcan icon to delete the phone number from the user’s profile. 
Depending on your settings, the user can use the phone number you set to sign in with SMS sign in, perform Multi-Factor Authentication, and perform self-service password reset.
To do this, you must have the Authentication Administrator role or a more privileged role. 

## Search

You can search for locations and users in your organization. Use the search bar at the top of the My Staff experience. You can search across all locations and users in your organization, but you can only make changes to users who are in a location to which you have been given admin permissions. 
 
You can also search for a user within a location. To do this, use the search bar at the top of the user list.

## Audit logs

You can view audit logs for My Staff in the Azure Active Directory portal. The following audit logs are generated from My Staff:
-	Reset password (by admin)
-	



## Next steps

[Azure Active Directory editions](../fundamentals/active-directory-whatis.md)
