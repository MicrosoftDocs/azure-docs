---
title: Use Windows Local Administrator Password Solution (LAPS) with Microsoft Entra ID (preview)
description: Manage your device's local administrator password with Microsoft Entra LAPS.

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: how-to
ms.date: 04/21/2023

ms.author: sandeo
author: sandeo-MSFT
ms.reviewer: joflore
ms.custom: references_regions

ms.collection: M365-identity-device-management
---
# Windows Local Administrator Password Solution in Microsoft Entra ID (preview)

> [!IMPORTANT]
> Microsoft Entra ID support for Windows Local Administrator Password Solution is currently in preview.
> For more information about previews, see [Universal License Terms For Online Services](https://www.microsoft.com/licensing/terms/product/ForOnlineServices/all).

Every Windows device comes with a built-in local administrator account that you must secure and protect to mitigate any Pass-the-Hash (PtH) and lateral traversal attacks. Many customers have been using our standalone, on-premises [Local Administrator Password Solution (LAPS)](https://www.microsoft.com/download/details.aspx?id=46899) product for local administrator password management of their domain joined Windows machines. With Microsoft Entra ID support for Windows LAPS, we're providing a consistent experience for both Microsoft Entra joined and Microsoft Entra hybrid joined devices.

Microsoft Entra ID support for LAPS includes the following capabilities:

- **Enabling Windows LAPS with Microsoft Entra ID** - Enable a tenant wide policy and a client-side policy to backup local administrator password to Microsoft Entra ID.
- **Local administrator password management** - Configure client-side policies to set account name, password age, length, complexity, manual password reset and so on.
- **Recovering local administrator password** - Use API/Portal experiences for local administrator password recovery.
- **Enumerating all Windows LAPS enabled devices** - Use API/Portal experiences to enumerate all Windows devices in Microsoft Entra ID enabled with Windows LAPS.
- **Authorization of local administrator password recovery** - Use role based access control (RBAC) policies with custom roles and administrative units.
- **Auditing local administrator password update and recovery** - Use audit logs API/Portal experiences to monitor password update and recovery events.
- **Conditional Access policies for local administrator password recovery** - Configure Conditional Access policies on directory roles that have the authorization of password recovery.

> [!NOTE]  
> Windows LAPS with Microsoft Entra ID is not supported for Windows devices that are [Microsoft Entra registered](concept-device-registration.md).

Local Administrator Password Solution isn't supported on non-Windows platforms.

To learn about Windows LAPS in more detail, start with the following articles in the Windows documentation:

- [What is Windows LAPS?](/windows-server/identity/laps/laps-scenarios-azure-active-directory) – Introduction to Windows LAPS and the Windows LAPS documentation set.
- [Windows LAPS CSP](/windows/client-management/mdm/laps-csp) – View the full details for LAPS settings and options. Intune policy for LAPS uses these settings to configure the LAPS CSP on devices.
- [Microsoft Intune support for Windows LAPS](/mem/intune/protect/windows-laps-overview)
- [Windows LAPS architecture](/windows-server/identity/laps/laps-concepts#windows-laps-architecture)

## Requirements

### Supported Azure regions and Windows distributions

This feature is now available in the following Azure clouds:

- Azure Global
- Azure Government
- Microsoft Azure operated by 21Vianet

### Operating system updates

This feature is now available on the following Windows OS platforms with the specified update or later installed:

- [Windows 11 22H2 - April 11 2023 Update](https://support.microsoft.com/help/5025239)
- [Windows 11 21H2 - April 11 2023 Update](https://support.microsoft.com/help/5025224)
- [Windows 10 20H2, 21H2 and 22H2 - April 11 2023 Update](https://support.microsoft.com/help/5025221)
- [Windows Server 2022 - April 11 2023 Update](https://support.microsoft.com/help/5025230)
- [Windows Server 2019 - April 11 2023 Update](https://support.microsoft.com/help/5025229)

### Join types

LAPS is supported on Microsoft Entra joined or Microsoft Entra hybrid joined devices only. Microsoft Entra registered devices aren't supported. 

### License requirements

LAPS is available to all customers with Microsoft Entra ID Free or higher licenses. Other related features like administrative units, custom roles, Conditional Access, and Intune have other licensing requirements.

### Required roles or permission

Other than the built-in Microsoft Entra roles of Cloud Device Administrator, Intune Administrator, and Global Administrator that are granted *device.LocalCredentials.Read.All*, you can use [Microsoft Entra custom roles](../roles/custom-create.md) or administrative units to authorize local administrator password recovery. For example,

- Custom roles must be assigned the *microsoft.directory/deviceLocalCredentials/password/read* permission to authorize local administrator password recovery. During the preview, you must create a custom role and grant permissions using the [Microsoft Graph API](../roles/custom-create.md#create-a-role-with-the-microsoft-graph-api) or [PowerShell](../roles/custom-create.md#create-a-role-using-powershell). Once you have created the custom role, you can assign it to users.

- You can also create a Microsoft Entra ID [administrative unit](../roles/administrative-units.md), add devices, and assign the Cloud Device Administrator role scoped to the administrative unit to authorize local administrator password recovery.

<a name='enabling-windows-laps-with-azure-ad'></a>

## Enabling Windows LAPS with Microsoft Entra ID

To enable Windows LAPS with Microsoft Entra ID, you must take actions in Microsoft Entra ID and the devices you wish to manage. We recommend organizations [manage Windows LAPS using Microsoft Intune](/mem/intune/protect/windows-laps-policy). However, if your devices are Microsoft Entra joined but you're not using Microsoft Intune or Microsoft Intune isn't supported (like for Windows Server 2019/2022), you can still deploy Windows LAPS for Microsoft Entra ID manually. For more information, see the article [Configure Windows LAPS policy settings](/windows-server/identity/laps/laps-management-policy-settings).

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Device Administrator](../roles/permissions-reference.md#cloud-device-administrator).
1. Browse to **Identity** > **Devices** > **Overview** > **Device settings**
1. Select **Yes** for the Enable Local Administrator Password Solution (LAPS) setting and select **Save**. You may also use the Microsoft Graph API [Update deviceRegistrationPolicy](/graph/api/deviceregistrationpolicy-update?view=graph-rest-beta&preserve-view=true).
1. Configure a client-side policy and set the **BackUpDirectory** to be Microsoft Entra ID.

   - If you're using Microsoft Intune to manage client side policies, see [Manage Windows LAPS using Microsoft Intune](/mem/intune/protect/windows-laps-policy)
   - If you're using Group Policy Objects (GPO) to manage client side policies, see [Windows LAPS Group Policy](/windows-server/identity/laps/laps-management-policy-settings#windows-laps-group-policy)

## Recovering local administrator password and password metadata

To view the local administrator password for a Windows device joined to Microsoft Entra ID, you must be granted the *microsoft.directory/deviceLocalCredentials/password/read* action.

To view the local administrator password metadata for a Windows device joined to Microsoft Entra ID,  you must be granted the *microsoft.directory/deviceLocalCredentials/standard/read* action.

The following built-in roles are granted these actions by default:

|Built-in role|microsoft.directory/deviceLocalCredentials/standard/read and microsoft.directory/deviceLocalCredentials/password/read|microsoft.directory/deviceLocalCredentials/standard/read|
|---|---|---|
|[Global Administrator](../roles/permissions-reference.md#global-administrator)|Yes|Yes|
|[Cloud Device Administrator](../roles/permissions-reference.md#cloud-device-administrator)|Yes|Yes|
|[Intune Service Administrator](../roles/permissions-reference.md#intune-administrator)|Yes|Yes|
|[Global Reader](../roles/permissions-reference.md#global-reader)|No|Yes|
|[Helpdesk Administrator](../roles/permissions-reference.md#helpdesk-administrator)|No|Yes|
|[Security Administrator](../roles/permissions-reference.md#security-administrator)|No|Yes|
|[Security Reader](../roles/permissions-reference.md#security-reader)|No|Yes|

Any roles not listed are granted neither action.

You can also use Microsoft Graph API [Get deviceLocalCredentialInfo](/graph/api/devicelocalcredentialinfo-get?view=graph-rest-beta&preserve-view=true) to recover local administrative password. If you use the Microsoft Graph API, the password returned is in Base64 encoded value that you need to decode before using it.

## List all Windows LAPS enable devices

To list all Windows LAPS enabled devices, you can browse to  **Identity** > **Devices** > **Overview** > **Local administrator password recovery (Preview)** or use the Microsoft Graph API.

## Auditing local administrator password update and recovery

To view audit events, you can browse to  **Identity** > **Devices** > **Overview** > **Audit logs**, then use the **Activity** filter and search for **Update device local administrator password** or **Recover device local administrator password** to view the audit events.

## Conditional Access policies for local administrator password recovery

Conditional Access policies can be scoped to the built-in roles like Cloud Device Administrator, Intune Administrator, and Global Administrator to protect access to recover local administrator passwords. You can find an example of a policy that requires multifactor authentication in the article, [Common Conditional Access policy: Require MFA for administrators](../conditional-access/howto-conditional-access-policy-admin-mfa.md).

> [!NOTE]  
> Other role types including administrative unit-scoped roles and custom roles aren't supported

## Frequently asked questions

<a name='is-windows-laps-with-azure-ad-management-configuration-supported-using-group-policy-objects-gpo'></a>

### Is Windows LAPS with Microsoft Entra management configuration supported using Group Policy Objects (GPO)?

Yes, for [Microsoft Entra hybrid joined](concept-hybrid-join.md) devices only. See see [Windows LAPS Group Policy](/windows-server/identity/laps/laps-management-policy-settings#windows-laps-group-policy).

<a name='is-windows-laps-with-azure-ad-management-configuration-supported-using-mdm'></a>

### Is Windows LAPS with Microsoft Entra management configuration supported using MDM?

Yes, for [Microsoft Entra join](concept-directory-join.md)/[Microsoft Entra hybrid join](concept-hybrid-join.md) ([co-managed](/mem/configmgr/comanage/overview)) devices. Customers can use [Microsoft Intune](/mem/intune/protect/windows-laps-overview) or any other third party MDM of their choice.

<a name='what-happens-when-a-device-is-deleted-in-azure-ad'></a>

### What happens when a device is deleted in Microsoft Entra ID?

When a device is deleted in Microsoft Entra ID, the LAPS credential that was tied to that device is lost and the password that is stored in Microsoft Entra ID is lost. Unless you have a custom workflow to retrieve LAPS passwords and store them externally, there's no method in Microsoft Entra ID to recover the LAPS managed password for a deleted device.

### What roles are needed to recover LAPS passwords?

The following built-in roles Microsoft Entra roles have permission to recover LAPS passwords: Global Administrator, Cloud Device Administrator, and Intune Administrator.

### What roles are needed to read LAPS metadata?

The following built-in roles are supported to view metadata about LAPS including the device name, last password rotation, and next password rotation: Global Administrator, Cloud Device Administrator, Intune Administrator, Helpdesk Administrator, Security Reader, Security Administrator, and Global Reader.

### Are custom roles supported?

Yes. If you have Microsoft Entra ID P1 or P2, you can create a custom role with the following RBAC permissions:

- To read LAPS metadata: *microsoft.directory/deviceLocalCredentials/standard/read*
- To read LAPS passwords: *microsoft.directory/deviceLocalCredentials/password/read*

### What happens when the local administrator account specified by policy is changed?

Because Windows LAPS can only manage one local admin account on a device at a time, the original account is no longer managed by LAPS policy. If policy has the device back up that account, the new account is backed up and details about the previous account are no longer available from within the Intune admin center or from the Directory that is specified to store the account information.

## Next steps

- [Choosing a device identity](overview.md#modern-device-scenario)
- [Microsoft Intune support for Windows LAPS](/mem/intune/protect/windows-laps-overview)
- [Create policy for LAPS](/mem/intune/protect/windows-laps-policy)
- [View reports for LAPS](/mem/intune/protect/windows-laps-reports)
- [Account protection policy for endpoint security in Intune](/mem/intune/protect/endpoint-security-account-protection-policy)
