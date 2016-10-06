<properties
   pageTitle="Roles in PIM | Microsoft Azure"
   description="Learn what roles are used for privileged identities with the Azure Privileged Identity Management extension."
   services="active-directory"
   documentationCenter=""
   authors="kgremban"
   manager="femila"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="07/01/2016"
   ms.author="kgremban"/>

# Roles in Azure AD Privileged Identity Management

<!-- **PLACEHOLDER: Need description of how this works. Azure PIM uses roles from MSODS objects.**-->

You can assign users in your organization to different administrative roles in Azure AD. These role assignments control which tasks, such as adding or removing users or changing service settings, the users are able to perform on Azure AD, Office 365 and other Microsoft Online Services and connected applications.  

A global administrator can update which users are **permanently** assigned to roles in Azure AD, using PowerShell cmdlets such as `Add-MsolRoleMember` and `Remove-MsolRoleMember`, or through the classic portal as described in [assigning administrator roles in Azure Active Directory](active-directory-assign-admin-roles.md).

Azure AD Privileged Identity Management (PIM) manages policies for privileged access for users in Azure AD. PIM assigns users to one or more roles in Azure AD, and you can assign someone to be permanently in the role, or eligible for the role. When a user is permanently assigned to a role, or activates an eligible role assignment, then they can manage Azure Active Directory, Office 365, and other applications with the permissions assigned to their roles.

There's no difference in the access given to someone with a permanent versus an eligible role assignment. The only difference is that some people don't need that access all the time. They are made eligible for the role, and can turn it on and off whenever they need to.

## Roles managed in PIM

Privileged Identity Management lets you assign users to common administrator roles, including:


- **Global administrator** (also known as Company administrator) has access to all administrative features. You can have more than one global admin in your organization. The person who signs up to purchase Office 365 automatically becomes a global admin.
- **Privileged role administrator** manages Azure AD PIM and updates role assignments for other users.  
- **Billing administrator** makes purchases, manages subscriptions, manages support tickets, and monitors service health.
- **Password administrator** resets passwords, manages service requests, and monitors service health. Password admins are limited to resetting passwords for users.
- **Service administrator** manages service requests and monitors service health.

  > [AZURE.NOTE] If you are using Office 365, then before assigning the service admin role to a user, first assign the user administrative permissions to a service, such as Exchange Online.

- **User management administrator** resets passwords, monitors service health, and manages user accounts, user groups, and service requests. The user management admin can’t delete a global admin, create other admin roles, or reset passwords for billing, global, and service admins.
- **Exchange administrator** has administrative access to Exchange Online through the Exchange admin center (EAC), and can perform almost any task in Exchange Online.
- **SharePoint administrator** has administrative access to SharePoint Online through the SharePoint Online admin center, and can perform almost any task in SharePoint Online.
- **Skype for Business administrator** has administrative access to Skype for Business through the Skype for Business admin center, and can perform almost any task in Skype for Business Online.

Read these articles for more details about [assigning administrator roles in Azure AD](active-directory-assign-admin-roles.md) and [assigning admin roles in Office 365](https://support.office.com/article/Assigning-admin-roles-in-Office-365-eac4d046-1afd-4f1a-85fc-8219c79e1504).

<!--**PLACEHOLDER: The above article may not be the one we want since PIM gets roles from places other that Office 365**-->


From PIM, you can [assign these roles to a user](active-directory-privileged-identity-management-how-to-add-role-to-user.md) so that the user can [activate the role when needed](active-directory-privileged-identity-management-how-to-activate-role.md).

If you want to give another user access to manage in PIM itself, the roles which PIM requires the user to have are described further in [how to give access to PIM](active-directory-privileged-identity-management-how-to-give-access-to-pim.md).


<!-- ## The PIM Security Administrator Role **PLACEHOLDER: Need description of the Security Administrator role.**-->

## Roles not managed in PIM

Roles within Exchange Online or SharePoint Online, except for those mentioned above, are not represented in Azure AD and so are not visible in PIM. For more information on changing fine-grained role assignments in these Office 365 services, see [Permissions in Office 365](https://support.office.com/article/Permissions-in-Office-365-da585eea-f576-4f55-a1e0-87090b6aaa9d).

Azure subscriptions and resource groups are also not represented in Azure AD. To manage Azure subscriptions, see [How to add or change Azure administrator roles](../billing-add-change-azure-subscription-administrator.md) and for more information on Azure RBAC see [Azure Role-Based Access Control](role-based-access-control-configure.md).

<!--**The above links might be replaced by ones that are from within this documentation repository **-->


## User roles and signing in
For some Microsoft services and applications, assigning a user to a role may not be sufficient to enable that user to be an administrator.

Access to the Azure classic portal requires the user be a service administrator or co-administrator on an Azure subscription, even if the user does not need to manage the Azure subscriptions.  For example, to manage configuration settings for Azure AD in the classic portal, a user must be both a global administrator in Azure AD and a subscription co-administrator on an Azure subscription.  To learn how to add users to Azure subscriptions, see [How to add or change Azure administrator roles](../billing-add-change-azure-subscription-administrator.md).

Access to Microsoft Online Services may require the user also be assigned a license before they can open the service's portal or perform administrative tasks.

## Assign a license to a user in Azure AD

1. Sign in to the [Azure classic portal] (http://manage.windowsazure.com) with a global administrator account or a co-administrator account.
2. Select **All Items** from the main menu.
3. Select the directory you want to work with and that has licenses associated with it.
4. Select **Licenses**. The list of available licenses will appear.
5. Select the license plan which contains the licenses that you want to distribute.
6. Select **Assign Users**.
7. Select the user that you want to assign a license to.
8. Click the **Assign** button.  The user can now sign in to Azure.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]
