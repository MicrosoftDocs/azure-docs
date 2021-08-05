---
title: Deploy Azure AD joined VMs in Azure Virtual Desktop - Azure
description: How to configure and deploy Azure AD joined VMs in Azure Virtual Desktop.
services: virtual-desktop
author: Heidilohr
manager: lizross

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 08/09/2021
ms.author: helohr
---
# Deploy Azure AD joined virtual machines in Azure Virtual Desktop

> [!IMPORTANT]
> Azure AD joined VM support is currently in public preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article will walk you through the process of deploying and accessing Azure Active Directory joined virtual machines in Azure Virtual Desktop. This removes the need to have line-of-sight from the VM to an on-premise or virtualized Active Directory Domain Controller (DC) or to deploy Azure AD Domain services (Azure AD DS). In some cases, it can remove the need for a DC entirely, simplifying the deployment and management of the environment. These VMs can also be automatically enrolled in Intune for ease of management.

> [!NOTE]
> Azure Virtual Desktop (Classic) doesn't support this feature.

## Supported configurations

The following configurations are currently supported with Azure AD-joined VMs:

- Personal desktops with local user profiles.
- Pooled desktops used as a jump box. In this configuration, users first access the Azure Virtual Desktop VM before connecting to a different PC on the network. Users shouldn't save data on the VM.
- Pooled desktops or apps where users don't need to save data on the VM. For example, for applications that save data online or connect to a remote database.

User accounts can be cloud-only or hybrid users from the same Azure AD tenant. External users aren't supported at this time.

## Deploy Azure AD-joined VMs

> [!IMPORTANT]
> During public preview, you must configure your host pool to be in the [validation environment](create-validation-host-pool.md).

You can deploy Azure AD-joined VMs directly from the Azure portal when [creating a new host pool](create-host-pools-azure-marketplace.md) or [expanding an existing host pool](expand-existing-host-pool.md). On the Virtual Machines tab, select whether to join the VM to Active Directory or Azure Active Directory. Selecting **Azure Active Directory** gives you the option to **Enroll the VM with Intune** automatically so you can easily manage [Windows 10 Enterprise](/mem/intune/fundamentals/windows-virtual-desktop) and [Windows 10 Enterprise multi-session](/mem/intune/fundamentals/windows-virtual-desktop-multi-session) VMs. Keep in mind that the Azure Active Directory option will join VMs to the same Azure AD tenant as the subscription you're in.

> [!NOTE]
> - Host pools should only contain VMs of the same domain join type. For example, AD-joined VMs should only be with other AD VMs, and vice-versa.
> - The host pool VMs must be Windows 10 single-session or multi-session, version 2004 or later.

After you've created the host pool, you must assign user access. For Azure AD-joined VMs, you'll need to do two things: give users access to both the App Group and VMs.

Follow the instructions in [Manage app groups](manage-app-groups.md) to assign user access to apps and desktops. We recommend that you use user groups instead of individual users wherever possible.

To grant users access to Azure AD-joined VMs, you must [configure role assignments for the VM](../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md#configure-role-assignments-for-the-vm). You can assign the **Virtual Machine User Login** or **Virtual Machine Administrator Login** role either on the VMs, the resource group containing the VMs, or the subscription. We recommend assigning the Virtual Machine User Login role to the same user group you used for the app group at the resource group level to make it apply to all the VMs in the host pool.

## Access Azure AD-joined VMs

This section explains how to access Azure AD-joined VMs from different Azure Virtual Desktop clients.

> [!NOTE]
> Connecting to Azure AD-joined VMs isn't currently supported using the Windows Store client.

> [!NOTE]
> Azure Virtual Desktop doesn't currently support single sign-on for Azure AD-joined VMs.

### Connect using the Windows Desktop client

The default configuration supports connections from Windows 10 using the [Windows Desktop client](user-documentation/connect-windows-7-10.md). You can use your credentials, smart card, [Windows Hello for Business certificate trust](/windows/security/identity-protection/hello-for-business/hello-hybrid-cert-trust) or [Windows Hello for Business key trust with certificates](/windows/security/identity-protection/hello-for-business/hello-deployment-rdp-certs) to sign in to the session host. However, to access the session host, your local PC must meet one of the following conditions:

- The local PC is Azure AD-joined to the same Azure AD tenant as the session host
- The local PC is hybrid Azure AD-joined to the same Azure AD tenant as the session host
- The local PC is running Windows 10, version 2004 and later, and is Azure AD registered to the same Azure AD tenant as the session host

To enable access from Windows devices not joined to Azure AD, add **targetisaadjoined:i:1** as a [custom RDP property](customize-rdp-properties.md) to the host pool. These connections are restricted to entering user name and password credentials when signing in to the session host.

### Connect using the other clients

To access Azure AD-joined VMs using the web, Android, macOS and iOS clients, you must add **targetisaadjoined:i:1** as a [custom RDP property](customize-rdp-properties.md) to the host pool. These connections are restricted to entering user name and password credentials when signing in to the session host.

### Enabling MFA for Azure AD joined VMs

You can enable [multifactor authentication](set-up-mfa.md) for Azure AD joined VMs by setting a Conditional Access policy on the "Azure Virtual Desktop" app. Unless you want to restrict sign in to strong authentication methods like Windows Hello for Business, you need to [exclude the "Azure Windows VM Sign-In" app]((../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md#mfa-sign-in-method-required)) and [disable per-user MFA](../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md#using-conditional-access). You must follow the same guidance to access Azure AD-joined VMs from non-Windows clients.

## User profiles

Azure Virtual Desktop currently only supports local profiles for Azure AD-joined VMs.

## Next steps

Now that you've deployed some Azure AD joined VMs, you can sign in to a supported Azure Virtual Desktop client to test it as part of a user session. If you want to learn how to connect to a session, check out these articles:

- [Connect with the Windows Desktop client](user-documentation/connect-windows-7-10.md)
- [Connect with the web client](user-documentation/connect-web.md)
- [Troubleshoot connections to Azure AD-joined VMs](troubleshoot-azure-ad-connections.md)
