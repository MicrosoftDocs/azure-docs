---
title: Deploy Microsoft Entra joined VMs in Azure Virtual Desktop - Azure
description: How to configure and deploy Microsoft Entra joined VMs in Azure Virtual Desktop.
services: virtual-desktop
author: Heidilohr
manager: femila

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 11/14/2023
ms.author: helohr
---

# Deploy Microsoft Entra joined virtual machines in Azure Virtual Desktop

This article will walk you through the process of deploying and accessing Microsoft Entra joined virtual machines in Azure Virtual Desktop. Microsoft Entra joined VMs remove the need to have line-of-sight from the VM to an on-premises or virtualized Active Directory Domain Controller (DC) or to deploy Microsoft Entra Domain Services. In some cases, it can remove the need for a DC entirely, simplifying the deployment and management of the environment. These VMs can also be automatically enrolled in Intune for ease of management.

## Known limitations

The following known limitations may affect access to your on-premises or Active Directory domain-joined resources and you should consider them when deciding whether Microsoft Entra joined VMs are right for your environment.

- Azure Virtual Desktop (classic) doesn't support Microsoft Entra joined VMs.
- Microsoft Entra joined VMs don't currently support external identities, such as Microsoft Entra Business-to-Business (B2B) and Microsoft Entra Business-to-Consumer (B2C).
- Microsoft Entra joined VMs can only access [Azure Files shares](create-profile-container-azure-ad.md) or [Azure NetApp Files shares](create-fslogix-profile-container.md) for hybrid users using Microsoft Entra Kerberos for FSLogix user profiles.
- The [Remote Desktop app for Windows](users/connect-microsoft-store.md) doesn't support Microsoft Entra joined VMs.

<a name='deploy-azure-ad-joined-vms'></a>

## Deploy Microsoft Entra joined VMs

You can deploy Microsoft Entra joined VMs directly from the Azure portal when you [create a new host pool](create-host-pools-azure-marketplace.md) or [expand an existing host pool](expand-existing-host-pool.md). To deploy a Microsoft Entra joined VM, open the **Virtual Machines** tab, then select whether to join the VM to Active Directory or Microsoft Entra ID. Selecting **Microsoft Entra ID** gives you the option to enroll VMs with Intune automatically, which lets you easily [manage your session hosts](management.md). Keep in mind that the Microsoft Entra ID option will only join VMs to the same Microsoft Entra tenant as the subscription you're in.

> [!NOTE]
> - Host pools should only contain VMs of the same domain join type. For example, Microsoft Entra joined VMs should only be with other Microsoft Entra joined VMs, and vice-versa.
> - The VMs in the host pool must be Windows 11 or Windows 10 single-session or multi-session, version 2004 or later, or Windows Server 2022 or Windows Server 2019.

### Assign user access to host pools

After you've created your host pool, you must assign users access to their resources. To grant access to resources, add each user to the application group. Follow the instructions in [Manage application groups](manage-app-groups.md) to assign user access to apps and desktops. We recommend that you use user groups instead of individual users wherever possible.

For Microsoft Entra joined VMs, you'll need to do two extra things on top of the requirements for Active Directory or Microsoft Entra Domain Services-based deployments:  

- Assign your users the **Virtual Machine User Login** role so they can sign in to the VMs.
- Assign administrators who need local administrative privileges the **Virtual Machine Administrator Login** role.

To grant users access to Microsoft Entra joined VMs, you must [configure role assignments for the VM](../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md#configure-role-assignments-for-the-vm). You can assign the **Virtual Machine User Login** or **Virtual Machine Administrator Login** role either on the VMs, the resource group containing the VMs, or the subscription. We recommend assigning the Virtual Machine User Login role to the same user group you used for the application group at the resource group level to make it apply to all the VMs in the host pool.

<a name='access-azure-ad-joined-vms'></a>

## Access Microsoft Entra joined VMs

This section explains how to access Microsoft Entra joined VMs from different Azure Virtual Desktop clients.

### Single sign-on

For the best experience across all platforms, you should enable a single sign-on experience using Microsoft Entra authentication when accessing Microsoft Entra joined VMs. Follow the steps to [Configure single sign-on](configure-single-sign-on.md) to provide a seamless connection experience.

### Connect using legacy authentication protocols

If you prefer not to enable single sign-on, you can use the following configuration to enable access to Microsoft Entra joined VMs.

**Connect using the Windows Desktop client**

The default configuration supports connections from Windows 11 or Windows 10 using the [Windows Desktop client](users/connect-windows.md). You can use your credentials, smart card, [Windows Hello for Business certificate trust](/windows/security/identity-protection/hello-for-business/hello-hybrid-cert-trust) or [Windows Hello for Business key trust with certificates](/windows/security/identity-protection/hello-for-business/hello-deployment-rdp-certs) to sign in to the session host. However, to access the session host, your local PC must meet one of the following conditions:

- The local PC is Microsoft Entra joined to the same Microsoft Entra tenant as the session host
- The local PC is Microsoft Entra hybrid joined to the same Microsoft Entra tenant as the session host
- The local PC is running Windows 11 or Windows 10, version 2004 or later, and is Microsoft Entra registered to the same Microsoft Entra tenant as the session host

If your local PC doesn't meet one of these conditions, add **targetisaadjoined:i:1** as a [custom RDP property](customize-rdp-properties.md) to the host pool. These connections are restricted to entering user name and password credentials when signing in to the session host.

**Connect using the other clients**

To access Microsoft Entra joined VMs using the web, Android, macOS and iOS clients, you must add **targetisaadjoined:i:1** as a [custom RDP property](customize-rdp-properties.md) to the host pool. These connections are restricted to entering user name and password credentials when signing in to the session host.

<a name='enforcing-azure-ad-multi-factor-authentication-for-azure-ad-joined-session-vms'></a>

### Enforcing Microsoft Entra multifactor authentication for Microsoft Entra joined session VMs

You can use Microsoft Entra multifactor authentication with Microsoft Entra joined VMs. Follow the steps to [Enforce Microsoft Entra multifactor authentication for Azure Virtual Desktop using Conditional Access](set-up-mfa.md) and note the extra steps for [Microsoft Entra joined session host VMs](set-up-mfa.md#azure-ad-joined-session-host-vms).

If you're using Microsoft Entra multifactor authentication and you don't want to restrict signing in to strong authentication methods like Windows Hello for Business, you'll need to [exclude the Azure Windows VM Sign-In app](../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md#mfa-sign-in-method-required) from your Conditional Access policy.

## User profiles

You can use FSLogix profile containers with Microsoft Entra joined VMs when you store them on Azure Files or Azure NetApp Files while using hybrid user accounts. For more information, see [Create a profile container with Azure Files and Microsoft Entra ID](create-profile-container-azure-ad.md).

## Accessing on-premises resources

While you don't need an Active Directory to deploy or access your Microsoft Entra joined VMs, an Active Directory and line-of-sight to it are needed to access on-premises resources from those VMs. To learn more about accessing on-premises resources, see [How SSO to on-premises resources works on Microsoft Entra joined devices](../active-directory/devices/azuread-join-sso.md).

## Next steps

Now that you've deployed some Microsoft Entra joined VMs, we recommend enabling single sign-on before connecting with a supported Azure Virtual Desktop client to test it as part of a user session. To learn more, check out these articles:

- [Configure single sign-on](configure-single-sign-on.md)
- [Create a profile container with Azure Files and Microsoft Entra ID](create-profile-container-azure-ad.md)
- [Connect with the Windows Desktop client](users/connect-windows.md)
- [Connect with the web client](users/connect-web.md)
- [Troubleshoot connections to Microsoft Entra joined VMs](troubleshoot-azure-ad-connections.md)
- [Create a profile container with Azure NetApp Files](create-fslogix-profile-container.md)
