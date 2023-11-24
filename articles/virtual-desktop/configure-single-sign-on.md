---
title: Configure single sign-on for Azure Virtual Desktop using Microsoft Entra authentication - Azure
description: How to configure single sign-on for an Azure Virtual Desktop environment using Microsoft Entra authentication.
services: virtual-desktop
author: Heidilohr
manager: femila

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 11/14/2023
ms.author: helohr
---
# Configure single sign-on for Azure Virtual Desktop using Microsoft Entra authentication

This article walks you through the process of configuring single sign-on (SSO) using Microsoft Entra authentication for Azure Virtual Desktop. When you enable SSO, users will authenticate to Windows using a Microsoft Entra ID token, obtained for the *Microsoft Remote Desktop* resource application (changing to *Windows Cloud Login* beginning in 2024). This enables them to use passwordless authentication and third-party Identity Providers that federate with Microsoft Entra ID to sign in to your Azure Virtual Desktop resources. When enabled, this feature provides a single sign-on experience when authenticating to the session host and configures the session to provide single sign-on to Microsoft Entra ID-based resources inside the session.

For information on using passwordless authentication within the session, see [In-session passwordless authentication](authentication.md#in-session-passwordless-authentication).

> [!NOTE]
> Azure Virtual Desktop (classic) doesn't support this feature.

## Prerequisites

Single sign-on is available on session hosts using the following operating systems:

- Windows 11 Enterprise single or multi-session with the [2022-10 Cumulative Updates for Windows 11 (KB5018418)](https://support.microsoft.com/kb/KB5018418) or later installed.
- Windows 10 Enterprise single or multi-session, versions 20H2 or later with the [2022-10 Cumulative Updates for Windows 10 (KB5018410)](https://support.microsoft.com/kb/KB5018410) or later installed.
- Windows Server 2022 with the [2022-10 Cumulative Update for Microsoft server operating system (KB5018421)](https://support.microsoft.com/kb/KB5018421) or later installed.

Session hosts must be Microsoft Entra joined or [Microsoft Entra hybrid joined](../active-directory/devices/hybrid-join-plan.md).

> [!NOTE]
> Azure Virtual Desktop doesn't support this solution with VMs joined to Microsoft Entra Domain Services or Active Directory only joined session hosts.

Clients currently supported:

- [Windows Desktop client](users/connect-windows.md) on local PCs running Windows 10 or later. There's no requirement for the local PC to be joined to a domain or Microsoft Entra ID.
- [Web client](users/connect-web.md).
- [macOS client](users/connect-macos.md) version 10.8.2 or later.
- [iOS client](users/connect-ios-ipados.md) version 10.5.1 or later.
- [Android client](users/connect-android-chrome-os.md) version 10.0.16 or later.

## Things to know before enabling single sign-on

Before enabling single sign-on, review the following information for using SSO in your environment.

### Disconnection when the session is locked

When SSO is enabled, you sign in to Windows using a Microsoft Entra authentication token, which provides support for passwordless authentication to Windows. The Windows lock screen in the remote session doesn't support Microsoft Entra authentication tokens or passwordless authentication methods like FIDO keys. The lack of support for these authentication methods means that users can't unlock their screens in a remote session. When you try to lock a remote session, either through user action or system policy, the session is instead disconnected and the service sends a message to the user explaining they've been disconnected.

Disconnecting the session also ensures that when the connection is relaunched after a period of inactivity, Microsoft Entra ID reevaluates the applicable conditional access policies.

### Using an Active Directory domain admin account with single sign-on

In environments with an Active Directory (AD) and hybrid user accounts, the default Password Replication Policy on Read-only Domain Controllers denies password replication for members of Domain Admins and Administrators security groups. This will prevent these admin accounts from signing in to Microsoft Entra hybrid joined hosts and might keep prompting them to enter their credentials. It will also prevent admin accounts from accessing on-premises resources that leverage Kerberos authentication from Microsoft Entra joined hosts.

To allow these admin accounts to connect when single sign-on is enabled:

1. On a device that you use to manage your Active Directory domain, open the **Active Directory Users and Computers** console.
1. Open the **Domain Controllers** folder for your tenant.
1. Find the **AzureADKerberos** object, then right-click it and select **Properties**.
1. Select the **Password Replication Policy** tab.
1. Change the policy for **Domain Admins** from *Deny* to *Allow*.
1. Delete the policy for **Administrators**. The Domain Admins group is a member of the Administrators group, so denying replication for administrators also denies it for domain admins.
1. Select **OK** to save your changes.

## Enable single sign-on

To enable single sign-on in your environment, you must:

1. Enable Microsoft Entra authentication for Remote Desktop Protocol (RDP).
1. Configure the target device groups.
1. Create a Kerberos Server object.
1. Review your conditional access policies.
1. Configure your host pool to enable single sign-on.

### Enable Microsoft Entra authentication for RDP

> [!IMPORTANT]
> Due to an upcoming change, the steps below should be completed for the following Microsoft Entra Apps:
> 
> - Microsoft Remote Desktop (App ID a4a365df-50f1-4397-bc59-1a1564b8bb9c).
> - Windows Cloud Login (App ID 270efc09-cd0d-444b-a71f-39af4910ec45)

Before enabling the single sign-on feature, you must first allow Microsoft Entra authentication for Windows in your Microsoft Entra tenant. This will enable issuing RDP access tokens allowing users to sign in to Azure Virtual Desktop session hosts. This is done by enabling the isRemoteDesktopProtocolEnabled property on the service principal's remoteDesktopSecurityConfiguration object for the apps listed above.

Use the [Microsoft Graph API](/graph/use-the-api) to [create remoteDesktopSecurityConfiguration](/graph/api/serviceprincipal-post-remotedesktopsecurityconfiguration)  or the [PowerShell Microsoft Graph Module](https://learn.microsoft.com/en-us/powershell/microsoftgraph/overview?view=graph-powershell-1.0) to [Update-MgServicePrincipalRemoteDesktopSecurityConfiguration](https://learn.microsoft.com/en-us/powershell/module/microsoft.graph.applications/update-mgserviceprincipalremotedesktopsecurityconfiguration?view=graph-powershell-1.0)  to set the property **isRemoteDesktopProtocolEnabled** to **true**.

```powershell
#Requirements
Install-Module Microsoft.Graph.Authentication
Install-Module Microsoft.Graph.Applications

#Login to Microsoft Graph
Connect-MgGraph -Scopes Application-RemoteDesktopConfig.ReadWrite.All

#Get the service principal ID's
$MSRDspId = Get-MgServicePrincipal -Filter "DisplayName eq 'Microsoft Remote Desktop'"
$WCLspId = Get-MgServicePrincipal -Filter "DisplayName eq 'Windows Cloud Login'"

#Check status of IsRemoteDesktopProtocolEnabled flag if already enabled for the service principal ID's
Get-MgServicePrincipalRemoteDesktopSecurityConfiguration -ServicePrincipalId $MSRDspId.Id
Get-MgServicePrincipalRemoteDesktopSecurityConfiguration -ServicePrincipalId $WCLspId.Id

#Set the IsRemoteDesktopProtocolEnabled flag to true
Update-MgServicePrincipalRemoteDesktopSecurityConfiguration -ServicePrincipalId $MSRDspId.Id -IsRemoteDesktopProtocolEnabled
Update-MgServicePrincipalRemoteDesktopSecurityConfiguration -ServicePrincipalId $WCLspId.Id -IsRemoteDesktopProtocolEnabled
```

### Configure the target device groups

> [!IMPORTANT]
> Due to an upcoming change, the steps below should be completed for the following Microsoft Entra Apps:
> 
> - Microsoft Remote Desktop (App ID a4a365df-50f1-4397-bc59-1a1564b8bb9c).
> - Windows Cloud Login (App ID 270efc09-cd0d-444b-a71f-39af4910ec45)

By default when enabling single sign-on, users are prompted to authenticate to Microsoft Entra ID and allow the Remote Desktop connection when launching a connection to a new session host. Microsoft Entra remembers up to 15 hosts for 30 days before prompting again. If you see this dialogue, select **Yes** to connect.

To provide single sign-on for all connections, you can hide this dialog by configuring a list of trusted devices. This is done by adding one or more Device Groups containing Azure Virtual Desktop session hosts to a property on the service principals for the apps listed above in your Microsoft Entra tenant.

Follow these steps to hide the dialog:

1. [Create a Dynamic Device Group](/entra/identity/users/groups-create-rule) in Microsoft Entra containing the devices to hide the dialog for. Remember the device group ID for the next step.
    > [!TIP]
    > It's recommended to use a dynamic device group and configure the dynamic membership rules to includes all your Azure Virtual Desktop session hosts. This can be done using the device names or for a more secure option, you can set and use [device extension attributes](/graph/extensibility-overview) using [Microsoft Graph API](/graph/api/resources/device).
1. Use the [Microsoft Graph API](/graph/use-the-api) to [create a new targetDeviceGroup object](/graph/api/remotedesktopsecurityconfiguration-post-targetdevicegroups) to suppress the prompt from these devices.

### Create a Kerberos Server object

You must [Create a Kerberos Server object](../active-directory/authentication/howto-authentication-passwordless-security-key-on-premises.md#create-a-kerberos-server-object) if your session host meets the following criteria:

- Your session host is Microsoft Entra hybrid joined. You must have a Kerberos Server object to complete authentication to the domain controller.
- Your session host is Microsoft Entra joined and your environment contains Active Directory Domain Controllers. You must have a Kerberos Server object for users to access on-premises resources, such as SMB shares, and Windows-integrated authentication to websites.

> [!IMPORTANT]
> If you enable SSO on your Microsoft Entra hybrid joined VMs before you create a Kerberos server object, one of the following things can happen: 
>
> - You receive an error message saying the specific session doesn't exist.
> - SSO will be skipped and you'll see a standard authentication dialog for the session host. 
>
> To resolve these issues, create the Kerberos server object before trying to connect again.

### Review your conditional access policies

When single sign-on is enabled, a new Microsoft Entra ID app is introduced to authenticate users to the session host. If you have conditional access policies that apply when accessing Azure Virtual Desktop, review the recommendations on setting up [multifactor authentication](set-up-mfa.md) to ensure users have the desired experience.

### Configure your host pool

To enable SSO on your host pool, you must configure the following RDP property, which you can do using the Azure portal or PowerShell. You can find the steps to do this in [Customize Remote Desktop Protocol (RDP) properties for a host pool](customize-rdp-properties.md).

- In the Azure portal, set **Microsoft Entra single sign-on** to **Connections will use Microsoft Entra authentication to provide single sign-on**.
- For PowerShell, set the **enablerdsaadauth** property to **1**.

## Next steps

- Check out [In-session passwordless authentication](authentication.md#in-session-passwordless-authentication) to learn how to enable passwordless authentication.
- For more information about Microsoft Entra Kerberos, see [Deep dive: How Microsoft Entra Kerberos works](https://techcommunity.microsoft.com/t5/itops-talk-blog/deep-dive-how-azure-ad-kerberos-works/ba-p/3070889)
- If you're accessing Azure Virtual Desktop from our Windows Desktop client, see [Connect with the Windows Desktop client](./users/connect-windows.md).
- If you're accessing Azure Virtual Desktop from our web client, see [Connect with the web client](./users/connect-web.md).
- If you encounter any issues, go to [Troubleshoot connections to Microsoft Entra joined VMs](troubleshoot-azure-ad-connections.md).
