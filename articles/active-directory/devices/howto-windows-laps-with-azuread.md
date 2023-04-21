---
title: How to use Windows Local Administrator Password Solution (LAPS) with Azure AD (preview)
description: Use Windows Local Administrator Password Solution to keep your Windows devices in Azure AD secure.

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: how-to
ms.date: 04/20/2023

ms.author: sandeo
author: sandeo-MSFT
ms.reviewer: joflore

#Customer intent: As an IT admin, I want to deploy Windows Local Administartor Password Solutiin for Windows devices that are joined to Azure AD

ms.collection: M365-identity-device-management
---

# Azure AD support for Windows LAPS (preview)

> [!IMPORTANT]
> Azure AD support for Windows LAPS is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Every Windows device comes with a built-in local administrator account that you must secure and protect to mitigate any Pass-the-Hash (PtH) and lateral traversal attacks. Many customers have been using our standalone, on-premises [LAPS](https://www.microsoft.com/download/details.aspx?id=46899) product for local administrator password management of their domain joined Windows machines. With Azure AD support for Windows LAPS, we are providing a consistent experience for both Azure AD joined and hybrid Azure AD joined devices.

Azure AD support for LAPS includes the following capabilities:

- **Enabling Windows LAPS with Azure AD** - Enable a tenant wide policy and a client-side policy to backup local administrator password to Azure AD.
- **Local administrator password management** - Configure client-side policies to set account name, password age, length, complexity, manual password reset and so on.
- **Recovering local administrator password** - Use API/Portal eperiences for local administrator password recovery.
- **Enumerating all Windows LAPS enabled devices** - Use API/Portal eperiences to enumerate all Windows devices in Azure AD enabled with Windows LAPS.
- **Authorization of local administrator password recovery** - Use role based access control (RBAC) policies with custom roles and administrative units.
- **Auditing local administrator password update and recovery** - Use audit logs API/Portal experinces to monitor password update and recovery events.
- **Conditional Access policies for local administrator password recovery** - Configure Conditional Access policies on directory roles that have the authorization of password recovery.

> [!NOTE]  
> Devices that are workplace-joined (WPJ) are not supported by Intune for LAPS.

To learn about Windows LAPS in more detail, start with the following articles in the Windows documentation:

- [What is Windows LAPS?](https://learn.microsoft.com/windows-server/identity/laps/laps-scenarios-azure-active-directory) – Introduction to Windows LAPS and the Windows LAPS documentation set.
- [Windows LAPS CSP](https://learn.microsoft.com/windows/client-management/mdm/laps-csp) – View the full details for LAPS settings and options. Intune policy for LAPS uses these settings to configure the LAPS CSP on devices.
- [Microsoft Intune support for Windows LAPS](https://learn.microsoft.com/mem/intune/protect/windows-laps-overview)

## Requirements

### Supported Azure regions and Windows distributions

This feature is now available in the following Azure clouds:

- Azure Global
- Azure Government
- Azure China 21Vianet

This feature is now available on the following Windows OS platforms with the specified update or later installed:

- [Windows 11 22H2 - April 11 2023 Update](https://support.microsoft.com/help/5025239)
- [Windows 11 21H2 - April 11 2023 Update](https://support.microsoft.com/help/5025224)
- [Windows 10 20H2, 21H2 and 22H2 - April 11 2023 Update](https://support.microsoft.com/help/5025221)
- [Windows Server 2022 - April 11 2023 Update](https://support.microsoft.com/help/5025230)
- [Windows Server 2019 - April 11 2023 Update](https://support.microsoft.com/help/5025229)

## Enabling Windows LAPS with Azure AD

To enable Windows LAPS with Azure AD, you must:

1. In the **Azure AD Devices** menu, select **Device settings**, and then select **Yes** for Enable Local Administartor Password Solution (LAPS) setting and click **Save**. You also have the option to use MS Graph API [Update deviceRegistrationPolicy](https://learn.microsoft.com/graph/api/deviceregistrationpolicy-update?view=graph-rest-beta&preserve-view=true).
2. Configure client-side policy and set **BackUpDirectory** to be Azure AD.
- If you are using Microsoft Intune to manage client side policies, see [Manage Windows LAPS using Microsoft Intune](https://learn.microsoft.com/mem/intune/protect/windows-laps-policy)
- If you are using Group Policy Objects (GPO) to manage client side policies, see [Windows LAPS Group Policy](https://learn.microsoft.com/windows-server/identity/laps/laps-management-policy-settings#windows-laps-group-policy)

> [!NOTE]  
> The preferred option to configure Windows LAPS policy for Azure AD joined devices is to use [Manage Windows LAPS using Microsoft Intune](https://learn.microsoft.com/mem/intune/protect/windows-laps-policy). However, if your devices are Azure AD joined but you're not using Microsoft Intune or Microsoft Intune is not supported (e.g. Windows Server 2019/2022), you can still deploy Windows LAPS for Azure AD. In this scenario, you must deploy policy manually (for example, either by using direct registry modification or by using Local Computer Group Policy). For more information, see [Configure Windows LAPS policy settings](https://learn.microsoft.com/windows-server/identity/laps/laps-management-policy-settings).

## LAPS password management
To configure LAPS password management policies for your Azure AD joined devices, you can use Microsoft Intune or any other MDM provider of your choide. If you are using Microsoft Intune to manage client side policies, see [Manage Windows LAPS using Microsoft Intune](https://learn.microsoft.com/mem/intune/protect/windows-laps-policy)
To configure LAPS password management for your hybrid Azure AD joined devices, you can use GPO if such devices are not [co-managed](https://learn.microsoft.com/mem/configmgr/comanage/overview) with Microsoft Intune. If you are using GPO, see [Windows LAPS Group Policy](https://learn.microsoft.com/windows-server/identity/laps/laps-management-policy-settings#windows-laps-group-policy).

## Recovering local administrator password
To view local administrator password for a Windows device joined to Azure AD, you need to be garnted the *deviceLocalCredentials.Read.All* permission and you must be assigned one of the following roles:

- Global Administrator
- Cloud Device Administrator
- Intune Service Administrator

You can also use MS Graph API [Get deviceLocalCredentialInfo](https://learn.microsoft.com/graph/api/devicelocalcredentialinfo-get?view=graph-rest-beta&preserve-view=true) to recover local administrative password. If you use the MS Graph API, the password returned is in Base64 encoded value that you will need to decode before using it.

## Enumerating all Windows LAPS enable devices

To enumerate all Windows LAPS enabled devices with Azure AD, you can use Azure AD portal by going to **Azure AD Devices | Overview** page and selecting **Local administrator password recovery (Preview)** menu.

You can also use MS Graph API to list all devices in Azure AD enbled with Windows LAPS.

## Authorization of local administrator password recovery
Other than the built-in Azure AD roles of Global Administrator, Cloud Device Administrator and Intune Administrator that are granted *device.LocalCredentials.Read.All*, you can use Azure AD custom roles or administrative units to authorize local administrator password recovery. For example,

- **You want to allow users other than Global Administrator, Cloud Device Administrator or Intune Administrator to have access to local administrator password account**
  
  You can create an Azure AD [custom role](https://learn.microsoft.com/azure/active-directory/roles/custom-create), you need to assign *microsoft.directory/deviceLocalCredentials/password/read* permission to authorize local administrator password recovery.
  
  > [!NOTE]  
  > Since Microsoft Entra portal is not yet enabled to show permissions for LAPS, you will need to create a custom role and grant permissions using [MS Graph API](https://learn.microsoft.com/azure/active-directory/roles/custom-create#create-a-role-with-the-microsoft-graph-api) or [Powershell](https://learn.microsoft.com/azure/active-directory/roles/custom-create#create-a-role-using-powershell)

  Once you have created the custom role, you can assign it to users using Microsoft Entra portal, MS Graph API or Powershell.
  
- **You want to allow users other than Global Administrator, Cloud Device Administrator or Intune Administrator to have access to local administrator password account to specific set of devices**

 You can also create an Azure AD [administrative unit](https://learn.microsoft.com/azure/active-directory/roles/administrative-units), add devices and assign Cloud Device Administrator role with administrative unit scope to authorize local administrator password recovery.
  
  > [!NOTE]  
  > Since Microsoft Entra portal is not yet enabled to assign custom role (you would create to authorize local administartor password recovery) with administrative unit, you will need to use [MS Graph API](https://learn.microsoft.com/azure/active-directory/roles/admin-units-manage#microsoft-graph-api) or [Powershell](https://learn.microsoft.com/azure/active-directory/roles/admin-units-manage#microsoft-graph-powershell)

## Auditing local administrator password update and recovery
To view audit events for local adminsitartor password update, you can go to **Azure AD Devices | Overview** page, select **Audit** logs, then use **Activity** filter and Search for **Update device local administrator password** to view the audit events.

To view audit events for local adminsitartor password recovery, you can go to **Azure AD Devices | Overview** page, select **Audit** logs, then use **Activity** filter and Search for **Recover device local administrator password** to view the audit events.

## Conditional Access policies for local administrator password recovery
To configure Conditional Access for local administartor passwrod recovery you will need to assign policy with user scope to built-in roles such as Global Administrator, Cloud Device Administrator and Intune Administrator that when granted *deviceLocalCredential.Read.All* permission have the ability to recover local administrator password for any Windows device joined to Azure AD and enabled with Windows LAPS. You can find more details on [Conditional Access USer Assignments](https://learn.microsoft.com/azure/active-directory/conditional-access/concept-conditional-access-users-groups)

> [!NOTE]  
> Other role types including administrative unit-scoped roles and custom roles aren't supported

**Licensing requirements**:

- **Azure Active Directory subscription**
  *Azure Active Directory Free*, when you are using basic Windows LAPS with Microsoft Entra (Azure AD) features such as enabling LAPS using device settings, storing encrypted local administrator password, password recovery and audit logsis the free version of Azure AD that’s included when you subscribe to Intune. With Azure AD Free, you can use all the features of LAPS.
  *Azure Active Directory Premium*, when you are using premium experiences to improve security with capabilities such as Conditional Access, Custom Roles and Administrative Units 
- **Intune subscription**
  *Microsoft Intune Plan 1*, which is the basic Intune subscription. You can also use Windows LAPS with a free trial subscription for Intune.


For information about Windows LAPS architecture, see [Key concepts in Windows LAPS](/windows-server/identity/laps/laps-concepts#windows-laps-architecture) in the Windows documentation.

## Frequently Asked Questions

### Is Windows LAPS supported on non Windows platforms?

No.

### Is Windows LAPS with Azure AD supported for Azure AD registered (aka Workplace Join) devices?

No.

### Which Windows OS platforms is Windows LAPS supported on?

Windows LAPS is now available on the following Windows OS platforms with the specified update or later installed:

- [Windows 11 22H2 - April 11 2023 Update](https://support.microsoft.com/help/5025239)
- [Windows 11 21H2 - April 11 2023 Update](https://support.microsoft.com/help/5025224)
- [Windows 10 20H2, 21H2 and 22H2 - April 11 2023 Update](https://support.microsoft.com/help/5025221)
- [Windows Server 2022 - April 11 2023 Update](https://support.microsoft.com/help/5025230)
- [Windows Server 2019 - April 11 2023 Update](https://support.microsoft.com/help/5025229)

### Is Windows LAPS with Azure AD management configuration supported using Group Policy Objects (GPO)?

Yes, for [hybrid Azure AD joined](https://learn.microsoft.com/azure/active-directory/devices/concept-azure-ad-join-hybrid) devices only. See see [Windows LAPS Group Policy](https://learn.microsoft.com/windows-server/identity/laps/laps-management-policy-settings#windows-laps-group-policy).

### Is Windows LAPS with Azure AD management configuration supported using MDM?

Yes, for [Azure AD join](https://learn.microsoft.com/azure/active-directory/devices/concept-azure-ad-join)/[hybrid Azure AD join](https://learn.microsoft.com/azure/active-directory/devices/concept-azure-ad-join-hybrid) ([co-managed](https://learn.microsoft.com/mem/configmgr/comanage/overview)) devices. Customers can use [Microsoft Intune](https://learn.microsoft.com/mem/intune/protect/windows-laps-overview) or any other third party MDM of their choice.

### What happens when a device is deleted in Azure AD?

When a device is deleted in Azure AD, the LAPS credential that was tied to that device is lost and the password that is stored in Azure AD is lost. Unless you have a custom workflow to retrieve LAPS passwords and store them externally, there's no method in Azure AD to recover the LAPS managed password for a deleted device.

### What roles are needed to recover LAPS passwords?

The following built-in roles Azure AD roles have permission to recover LAPS passwords: Global Administrator, Cloud Device Administrator, and Intune Administrator.

### What roles are needed to read LAPS metadata?

The following built-in roles are supported to view metadata about LAPS including the device name, last password rotation, and next password rotation: Global Administrator, Cloud Device Administrator, Intune Administrator, Helpdesk Administrator, Security Reader, Security Administrator, and Global Reader.

### Are custom roles supported?

Yes. If you have Azure AD Premium, you can create a custom role with the following RBAC permissions:

- To read LAPS metadata: *microsoft.directory/deviceLocalCredentials/standard/read*
- To read LAPS passwords: *microsoft.directory/deviceLocalCredentials/password/read*

### What happens when the local administrator account specified by policy is changed?

Because Windows LAPS can only manage one local admin account on a device at a time, the original account is no longer managed by LAPS policy. If policy has the device back up that account, the new account is backed up and details about the previous account are no longer available from within the Intune admin center or from the Directory that is specified to store the account information.

## Next steps
- [Microsoft Intune support for Windows LAPS](https://learn.microsoft.com/mem/intune/protect/windows-laps-overview)
- [Create policy for LAPS](https://learn.microsoft.com/mem/intune)/protect/windows-laps-policy.md)
- [View reports for LAPS](https://learn.microsoft.com/mem/intune/protect/windows-laps-reports.md)
- [Account protection policy for endpoint security in Intune](https://learn.microsoft.com/mem/intune/protect/endpoint-security-account-protection-policy.md)
