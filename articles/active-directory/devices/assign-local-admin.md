---
title: How to manage local administrators on Azure AD joined devices
description: Learn how to assign Azure roles to the local administrators group of a Windows device.

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: how-to
ms.date: 10/27/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: ravenn

#Customer intent: As an IT admin, I want to manage the local administrators group assignment during an Azure AD join, so that I can control who can manage Azure AD joined devices

ms.collection: M365-identity-device-management
---
# How to manage the local administrators group on Azure AD joined devices

To manage a Windows device, you need to be a member of the local administrators group. As part of the Azure Active Directory (Azure AD) join process, Azure AD updates the membership of this group on a device. You can customize the membership update to satisfy your business requirements. A membership update is, for example, helpful if you want to enable your helpdesk staff to do tasks requiring administrator rights on a device.

This article explains how the local administrators membership update works and how you can customize it during an Azure AD Join. The content of this article doesn't apply to **hybrid Azure AD joined** devices.

## How it works

When you connect a Windows device with Azure AD using an Azure AD join, Azure AD adds the following security principals to the local administrators group on the device:

- The Azure AD Global Administrator role
- The Azure AD joined device local administrator role 
- The user performing the Azure AD join   

By adding Azure AD roles to the local administrators group, you can update the users that can manage a device anytime in Azure AD without modifying anything on the device. Azure AD also adds the Azure AD joined device local administrator role to the local administrators group to support the principle of least privilege (PoLP). In addition to the global administrators, you can also enable users that have been *only* assigned the device administrator role to manage a device. 

## Manage the global administrators role

To view and update the membership of the Global Administrator role, see:

- [View all members of an administrator role in Azure Active Directory](../roles/manage-roles-portal.md)
- [Assign a user to administrator roles in Azure Active Directory](../fundamentals/active-directory-users-assign-role-azure-portal.md)

## Manage the device administrator role 

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

In the Azure portal, you can manage the device administrator role from **Device settings**. 

1. Sign in to the [Azure portal](https://portal.azure.com) as a Global Administrator.
1. Browse to **Azure Active Directory** > **Devices** > **Device settings**.
1. Select **Manage Additional local administrators on all Azure AD joined devices**.
1. Select **Add assignments** then choose the other administrators you want to add and select **Add**.

To modify the device administrator role, configure **Additional local administrators on all Azure AD joined devices**.  

> [!NOTE]
> This option requires Azure AD Premium licenses. 

Device administrators are assigned to all Azure AD joined devices. You can’t scope device administrators to a specific set of devices. Updating the device administrator role doesn't necessarily have an immediate impact on the affected users. On devices where a user is already signed into, the privilege elevation takes place when *both* the below actions happen:

- Upto 4 hours have passed for Azure AD to issue a new Primary Refresh Token with the appropriate privileges. 
- User signs out and signs back in, not lock/unlock, to refresh their profile.

Users won't be listed in the local administrator group, the permissions are received through the Primary Refresh Token. 

> [!NOTE]
> The above actions are not applicable to users who have not signed in to the relevant device previously. In this case, the administrator privileges are applied immediately after their first sign-in to the device. 

## Manage administrator privileges using Azure AD groups (preview)

Starting with Windows 10 version 20H2, you can use Azure AD groups to manage administrator privileges on Azure AD joined devices with the [Local Users and Groups](/windows/client-management/mdm/policy-csp-localusersandgroups) MDM policy. This policy allows you to assign individual users or Azure AD groups to the local administrators group on an Azure AD joined device, providing you the granularity to configure distinct administrators for different groups of devices. 

Organizations can use Intune to manage these policies using [Custom OMA-URI Settings](/mem/intune/configuration/custom-settings-windows-10) or [Account protection policy](/mem/intune/protect/endpoint-security-account-protection-policy). A few considerations for using this policy:

- Adding Azure AD groups through the policy requires the group's SID that can be obtained by executing the [Microsoft Graph API for Groups](/graph/api/resources/group). The SID is defined by the property `securityIdentifier` in the API response.

- Administrator privileges using this policy are evaluated only for the following well-known groups on a Windows 10 or newer device - Administrators, Users, Guests, Power Users, Remote Desktop Users and Remote Management Users. 

- Managing local administrators using Azure AD groups isn't applicable to Hybrid Azure AD joined or Azure AD Registered devices.

- Azure AD groups deployed to a device with this policy don't apply to remote desktop connections. To control remote desktop permissions for Azure AD joined devices, you need to add the individual user's SID to the appropriate group. 

> [!IMPORTANT]
> Windows sign-in with Azure AD supports evaluation of up to 20 groups for administrator rights. We recommend having no more than 20 Azure AD groups on each device to ensure that administrator rights are correctly assigned. This limitation also applies to nested groups. 

## Manage regular users

By default, Azure AD adds the user performing the Azure AD join to the administrator group on the device. If you want to prevent regular users from becoming local administrators, you have the following options:

- [Windows Autopilot](/windows/deployment/windows-autopilot/windows-10-autopilot) -
Windows Autopilot provides you with an option to prevent primary user performing the join from becoming a local administrator by [creating an Autopilot profile](/intune/enrollment-autopilot#create-an-autopilot-deployment-profile).
- [Bulk enrollment](/intune/windows-bulk-enroll) - An Azure AD join that is performed in the context of a bulk enrollment happens in the context of an auto-created user. Users signing in after a device has been joined aren't added to the administrators group.   

## Manually elevate a user on a device 

In addition to using the Azure AD join process, you can also manually elevate a regular user to become a local administrator on one specific device. This step requires you to already be a member of the local administrators group. 

Starting with the **Windows 10 1709** release, you can perform this task from **Settings -> Accounts -> Other users**. Select **Add a work or school user**, enter the user's UPN under **User account** and select *Administrator* under **Account type**  
 
Additionally, you can also add users using the command prompt:

- If your tenant users are synchronized from on-premises Active Directory, use `net localgroup administrators /add "Contoso\username"`.
- If your tenant users are created in Azure AD, use `net localgroup administrators /add "AzureAD\UserUpn"`

## Considerations 

- You can only assign role based groups to the device administrator role.
- Device administrators are assigned to all Azure AD Joined devices. They can't be scoped to a specific set of devices.
- Local administrator rights on Windows devices aren't applicable to [Azure AD B2B guest users](../external-identities/what-is-b2b.md).
- When you remove users from the device administrator role, changes aren't instant. Users still have local administrator privilege on a device as long as they're signed in to it. The privilege is revoked during their next sign-in when a new primary refresh token is issued. This revocation, similar to the privilege elevation, could take upto 4 hours.

## Next steps

- To get an overview of how to manage device in the Azure portal, see [managing devices using the Azure portal](manage-device-identities.md).
- To learn more about device-based Conditional Access, see [Conditional Access: Require compliant or hybrid Azure AD joined device](../conditional-access/howto-conditional-access-policy-compliant-device.md).
