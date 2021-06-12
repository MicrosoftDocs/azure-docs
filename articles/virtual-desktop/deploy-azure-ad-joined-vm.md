---
title: Deploy Azure AD joined VMs in Azure Virtual Desktop - Azure
description: How to configure and deploy Azure AD joined VMs in Azure Virtual Desktop.
services: virtual-desktop
author: Heidilohr
manager: lizross

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 07/14/2021
ms.author: helohr
---
# Deploy Azure AD joined virtual machines in Azure Virtual Desktop

> [!IMPORTANT]
> Azure AD joined VM support is currently in public preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article will walk you through the process of deploying and accessing Azure Active Directory joined (AADJ) virtual machines in Azure Virtual Desktop. This removes the need to have line-of-sight from the VM to an on-premise Active Directory Domain Controller (DC) or to deploy a DC or Azure AD Domain services (AAD DS) in Azure. In some cases, it can remove the need for a DC entirely, simplifying the deployment and management of the environment. These VMs can also be automatically enrolled in Intune for ease of management.

> [!NOTE]
> Azure Virtual Desktop (Classic) doesn't support this feature.

## Supported configurations

The following configurations are currently supported with Azure AD joined VMs:

* Personal Desktops with local profiles.
* Pooled desktop or apps with local profiles, generally used as a jump box or for stateless applications.

User accounts can be cloud-only or hybrid users from the same Azure AD tenant. External users are not supported at this time.

## Deploy Azure AD joined VMs

> [!IMPORTANT]
> During public preview, you must configure your host pool to be in the [validation environment](create-validation-host-pool.md).

You can deploy Azure AD joined VMs directly from the Azure Portal when [creating a new host pool](create-host-pools-azure-marketplace.md) or [expanding an existing host pool](expand-existing-host-pool.md). On the Virtual Machines tab, the **Select which directory you would like to join** option allows you to select between Active Directory and Azure Active Directory. Selecting Azure Active Directory provides you with the option to **Enroll the VM with Intune** automatically so you can easily manage [Windows 10 ENT](/mem/intune/fundamentals/windows-virtual-desktop.md) and [Windows 10 ENT multi-session](/mem/intune/fundamentals/windows-virtual-desktop-multi-session.md) VMs. Note that the VMs will be joined to the same Azure AD tenant as the subscription.

> [!NOTE]
> * Host pools should only contain VMs of the same domain join type, be that Active Directory or Azure Active Directory.
> * The host pool VMs must be using Windows 10, version 2004 or above, single or multi-session.

Once the host pool is created, you must assign user access. This is done in 2 parts for Azure AD joined VMs, giving users access to the App Group and providing users access to the VMs.

You can follow the steps to [manage an app group](manage-app-groups.md) to assign user access to apps and desktops. Where possible it is recommended to use user groups instead of individual users.

To provide access to Azure AD joined VMs, users must be assigned the **Virtual Machine User Login** or **Virtual Machine Administrator Login** role on the VMs. This can also be done on the Resource Group or Subscription containing the VMs. The recommended configuration is to assign the Virtual Machine User Login role to the same user group used for the App Group at the Resource Group level, so it applies to all the VMs in the Host Pool.

## Access Azure AD joined VMs

The default configuration supports connections from Windows 10 using the Windows Desktop client. Username/password, smart cards or Windows Hello for Business can be used to sign in to the session host. The local PC must meet one of the following conditions:

* Azure AD joined to the same Azure AD tenant as the session host
* Hybrid Azure AD joined to the same Azure AD tenant as the session host
* Windows 10, version 2004 and above, Azure AD registered to the same Azure AD tenant as the session host

To enable access from Windows devices not joined or registered to Azure AD and all the non-Windows clients, add **targetisaadjoined:i:1** as a [custom RDP property](customize-rdp-properties.md) on the host pool. These connections are restricted to username/password when signing in to the session host.

> [!NOTE]
> Single sign-on is not currently supported for Azure AD joined VMs.

## User profiles

Azure AD joined VMs currently only support local profiles. Support for FSLogix profiles will be available in a future update.

## Troubleshooting

This section contains a list of common errors and how to resolve them.

If you encounter an error saying **The logon attempt failed** on the Windows Security credential prompt, verify the following:

- You are on a device that is AADJ or HAADJ to the same Azure AD tenant as the Session Host OR
- You are on a device running Windows 10 2004 or later and the user account is registered on the local system.
- The [PKU2U protocol is enabled](/windows/security/threat-protection/security-policy-settings/network-security-allow-pku2u-authentication-requests-to-this-computer-to-use-online-identities) on both the local PC and the session host.

If you encounter an error saying **Your account is configured to prevent you from using this device. For more information, contact your system administrator**, ensure the user account was given the [Virtual Machine User Login role](../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md) on the VMs. 

If you encounter an error saying **The sign-in method you're trying to use isn't allowed. Try a different sign-in method or contact your system administrator**, you have some Conditional Access policies restricting the type of credentials that be used to sign-in to the VMs. Ensure you use the right credential type when signing in.

## Next steps

Now that you've deployed some Azure AD joined VMs, you can sign in to a supported Azure Virtual Desktop client to test it as part of a user session. If you want to learn how to connect to a session, check out these articles:

* [Connect with the Windows Desktop client](connect-windows-7-10.md)
* [Connect with the web client](connect-web.md)
