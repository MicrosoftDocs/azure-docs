---
title: Deploy Azure AD joined VMs in Azure Virtual Desktop - Azure
description: How to configure and deploy Azure AD joined VMs in Azure Virtual Desktop.
services: virtual-desktop
author: Heidilohr
manager: femila

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 06/23/2023
ms.author: helohr
---

# Deploy Azure AD-joined virtual machines in Azure Virtual Desktop

This article will walk you through the process of deploying and accessing Azure Active Directory joined virtual machines in Azure Virtual Desktop. Azure AD-joined VMs remove the need to have line-of-sight from the VM to an on-premises or virtualized Active Directory Domain Controller (DC) or to deploy Azure AD Domain services (Azure AD DS). In some cases, it can remove the need for a DC entirely, simplifying the deployment and management of the environment. These VMs can also be automatically enrolled in Intune for ease of management.

## Known limitations

The following known limitations may affect access to your on-premises or Active Directory domain-joined resources and you should consider them when deciding whether Azure AD-joined VMs are right for your environment.

- Azure Virtual Desktop (classic) doesn't support Azure AD-joined VMs.
- Azure AD-joined VMs don't currently support external identities, such as Azure AD Business-to-Business (B2B) and Azure AD Business-to-Consumer (B2C).
- Azure AD-joined VMs can only access [Azure Files shares](create-profile-container-azure-ad.md) or [Azure NetApp Files shares](create-fslogix-profile-container.md) for hybrid users using Azure AD Kerberos for FSLogix user profiles.
- The [Remote Desktop app for Windows](users/connect-microsoft-store.md) doesn't support Azure AD-joined VMs.

## Deploy Azure AD-joined VMs

You can deploy Azure AD-joined VMs directly from the Azure portal when you [create a new host pool](create-host-pools-azure-marketplace.md) or [expand an existing host pool](expand-existing-host-pool.md). To deploy an Azure AD-joined VM, open the **Virtual Machines** tab, then select whether to join the VM to Active Directory or Azure Active Directory. Selecting **Azure Active Directory** gives you the option to enroll VMs with Intune automatically, which lets you easily [manage your session hosts](management.md). Keep in mind that the Azure Active Directory option will only join VMs to the same Azure AD tenant as the subscription you're in.

> [!NOTE]
> - Host pools should only contain VMs of the same domain join type. For example, Azure AD-joined VMs should only be with other Azure AD VMs, and vice-versa.
> - The VMs in the host pool must be Windows 11 or Windows 10 single-session or multi-session, version 2004 or later, or Windows Server 2022 or Windows Server 2019.

### Assign user access to host pools

After you've created your host pool, you must assign users access to their resources. To grant access to resources, add each user to the application group. Follow the instructions in [Manage application groups](manage-app-groups.md) to assign user access to apps and desktops. We recommend that you use user groups instead of individual users wherever possible.

For Azure AD-joined VMs, you'll need to do two extra things on top of the requirements for Active Directory or Azure Active Directory Domain Services-based deployments:  

- Assign your users the **Virtual Machine User Login** role so they can sign in to the VMs.
- Assign administrators who need local administrative privileges the **Virtual Machine Administrator Login** role.

To grant users access to Azure AD-joined VMs, you must [configure role assignments for the VM](../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md#configure-role-assignments-for-the-vm). You can assign the **Virtual Machine User Login** or **Virtual Machine Administrator Login** role either on the VMs, the resource group containing the VMs, or the subscription. We recommend assigning the Virtual Machine User Login role to the same user group you used for the application group at the resource group level to make it apply to all the VMs in the host pool.

## Access Azure AD-joined VMs

This section explains how to access Azure AD-joined VMs from different Azure Virtual Desktop clients.

### Connect using the Windows Desktop client

The default configuration supports connections from Windows 11 or Windows 10 using the [Windows Desktop client](users/connect-windows.md). You can use your credentials, smart card, [Windows Hello for Business certificate trust](/windows/security/identity-protection/hello-for-business/hello-hybrid-cert-trust) or [Windows Hello for Business key trust with certificates](/windows/security/identity-protection/hello-for-business/hello-deployment-rdp-certs) to sign in to the session host. However, to access the session host, your local PC must meet one of the following conditions:

- The local PC is Azure AD-joined to the same Azure AD tenant as the session host
- The local PC is hybrid Azure AD-joined to the same Azure AD tenant as the session host
- The local PC is running Windows 11 or Windows 10, version 2004 or later, and is Azure AD registered to the same Azure AD tenant as the session host

If your local PC doesn't meet one of these conditions, add **targetisaadjoined:i:1** as a [custom RDP property](customize-rdp-properties.md) to the host pool. These connections are restricted to entering user name and password credentials when signing in to the session host.

### Connect using the other clients

To access Azure AD-joined VMs using the web, Android, macOS and iOS clients, you must add **targetisaadjoined:i:1** as a [custom RDP property](customize-rdp-properties.md) to the host pool. These connections are restricted to entering user name and password credentials when signing in to the session host.

### Enforcing Azure AD Multi-Factor Authentication for Azure AD-joined session VMs

You can use Azure AD Multi-Factor Authentication with Azure AD-joined VMs. Follow the steps to [Enforce Azure Active Directory Multi-Factor Authentication for Azure Virtual Desktop using Conditional Access](set-up-mfa.md) and note the extra steps for [Azure AD-joined session host VMs](set-up-mfa.md#azure-ad-joined-session-host-vms).

If you're using Azure AD Multi-Factor Authentication and you don't want to restrict signing in to strong authentication methods like Windows Hello for Business, you'll need to [exclude the Azure Windows VM Sign-In app](../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md#mfa-sign-in-method-required) from your Conditional Access policy.

### Single sign-on

You can enable a single sign-on experience using Azure AD authentication when accessing Azure AD-joined VMs. Follow the steps to [Configure single sign-on](configure-single-sign-on.md) to provide a seamless connection experience.

## User profiles

You can use FSLogix profile containers with Azure AD-joined VMs when you store them on Azure Files or Azure NetApp Files while using hybrid user accounts. For more information, see [Create a profile container with Azure Files and Azure AD](create-profile-container-azure-ad.md).

## Accessing on-premises resources

While you don't need an Active Directory to deploy or access your Azure AD-joined VMs, an Active Directory and line-of-sight to it are needed to access on-premises resources from those VMs. To learn more about accessing on-premises resources, see [How SSO to on-premises resources works on Azure AD joined devices](../active-directory/devices/azuread-join-sso.md).

## Next steps

Now that you've deployed some Azure AD joined VMs, we recommend enabling single sign-on before connecting with a supported Azure Virtual Desktop client to test it as part of a user session. To learn more, check out these articles:

- [Configure single sign-on](configure-single-sign-on.md)
- [Create a profile container with Azure Files and Azure AD](create-profile-container-azure-ad.md)
- [Connect with the Windows Desktop client](users/connect-windows.md)
- [Connect with the web client](users/connect-web.md)
- [Troubleshoot connections to Azure AD-joined VMs](troubleshoot-azure-ad-connections.md)
- [Create a profile container with Azure NetApp Files](create-fslogix-profile-container.md)
