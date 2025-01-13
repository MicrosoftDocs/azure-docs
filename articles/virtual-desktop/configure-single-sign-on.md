---
title: Configure single sign-on for Azure Virtual Desktop using Microsoft Entra ID
description: Learn how to configure single sign-on for an Azure Virtual Desktop environment using Microsoft Entra ID.
ms.topic: how-to
author: dknappettmsft
ms.author: daknappe
ms.date: 09/17/2024
---

# Configure single sign-on for Azure Virtual Desktop using Microsoft Entra ID

Single sign-on (SSO) for Azure Virtual Desktop using Microsoft Entra ID provides a seamless sign-in experience for users connecting to session hosts. When you enable single sign-on, users authenticate to Windows using a Microsoft Entra ID token. This token enables the use of passwordless authentication and third-party identity providers that federate with Microsoft Entra ID when connecting to a session host, making the sign-in experience seamless.

Single sign-on using Microsoft Entra ID also provides a seamless experience for Microsoft Entra ID-based resources within the session. For more information on using passwordless authentication within a session, see [In-session passwordless authentication](authentication.md#in-session-passwordless-authentication).

To enable single sign-on using Microsoft Entra ID authentication, there are five tasks you must complete:

1. Enable Microsoft Entra authentication for Remote Desktop Protocol (RDP).

1. Hide the consent prompt dialog.

1. Create a *Kerberos Server object*, if Active Directory Domain Services is part of your environment. More information on the criteria is included in its section.

1. Review your conditional access policies.

1. Configure your host pool to enable single sign-on.

## Before enabling single sign-on

Before you enable single sign-on, review the following information for using it in your environment.

### Session lock behavior

When single sign-on using Microsoft Entra ID is enabled and the remote session is locked, either by the user or by policy, you can choose whether the session is disconnected or the remote lock screen is shown. The default behavior is to disconnect the session when it locks.

When the session lock behavior is set to disconnect, a dialog is shown to let users know they were disconnected. Users can choose the **Reconnect** option from the dialog when they're ready to connect again. This behavior is done for security reasons and to ensure full support of passwordless authentication. Disconnecting the session provides the following benefits:

- Consistent sign-in experience through Microsoft Entra ID when needed.

- Single sign-on experience and reconnection without authentication prompt when allowed by conditional access policies.

- Supports passwordless authentication like passkeys and FIDO2 devices, contrary to the remote lock screen.

- Conditional access policies, including multifactor authentication and sign-in frequency, are reevaluated when the user reconnects to their session.

- Can require multifactor authentication to return to the session and prevent users from unlocking with a simple username and password.

If you want to configure the session lock behavior to show the remote lock screen instead of disconnecting the session, see [Configure the session lock behavior](configure-session-lock-behavior.md).

### Active Directory domain administrator accounts with single sign-on

In environments with an Active Directory Domain Services (AD DS) and hybrid user accounts, the default *Password Replication Policy* on read-only domain controllers denies password replication for members of *Domain Admins* and *Administrators* security groups. This policy prevents these administrator accounts from signing in to Microsoft Entra hybrid joined hosts and might keep prompting them to enter their credentials. It also prevents administrator accounts from accessing on-premises resources that use Kerberos authentication from Microsoft Entra joined hosts. We don't recommend connecting to a remote session using an account that is a domain administrator for security reasons.

If you need to make changes to a session host as an administrator, sign in to the session host using a non-administrator account, then use the *Run as administrator* option or the [runas](/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/cc771525(v=ws.11)) tool from a command prompt to change to an administrator.

## Prerequisites

Before you can enable single sign-on, you must meet the following prerequisites:

- To configure your Microsoft Entra tenant, you must be assigned one of the following [Microsoft Entra built-in roles](/entra/identity/role-based-access-control/manage-roles-portal) or equivalent:

   - [Application Administrator](/entra/identity/role-based-access-control/permissions-reference#application-administrator)
   - [Cloud Application Administrator](/entra/identity/role-based-access-control/permissions-reference#cloud-application-administrator)

- Your session hosts must be running one of the following operating systems with the relevant cumulative update installed:

   - Windows 11 Enterprise single or multi-session with the [2022-10 Cumulative Updates for Windows 11 (KB5018418)](https://support.microsoft.com/kb/KB5018418) or later installed.

   - Windows 10 Enterprise single or multi-session with the [2022-10 Cumulative Updates for Windows 10 (KB5018410)](https://support.microsoft.com/kb/KB5018410) or later installed.

   - Windows Server 2022 with the [2022-10 Cumulative Update for Microsoft server operating system (KB5018421)](https://support.microsoft.com/kb/KB5018421) or later installed.

- Your session hosts must be [Microsoft Entra joined](/entra/identity/devices/concept-directory-join) or [Microsoft Entra hybrid joined](/entra/identity/devices/concept-hybrid-join). Session hosts joined to Microsoft Entra Domain Services or to Active Directory Domain Services only aren't supported.

   If your Microsoft Entra hybrid joined session hosts are in a different Active Directory domain than your user accounts, there must be a two-way trust between the two domains. Without the two-way trust, connections fall back to older authentication protocols.

- [Install the Microsoft Graph PowerShell SDK](/powershell/microsoftgraph/installation) version 2.9.0 or later on your local device or in [Azure Cloud Shell](../cloud-shell/overview.md).

- Use a supported version of Windows App or the Remote Desktop client to connect to a remote session. The following platforms and versions are supported:

   - Windows App:
      - Windows: All versions of Windows App. There's no requirement for the local PC to be joined to Microsoft Entra ID or an Active Directory domain.
      - macOS: version 10.9.10 or later.
      - iOS/iPadOS: version 10.5.2 or later.
      - Web browser.

   - Remote Desktop client:
      - [Windows Desktop client](users/connect-windows.md) on local PCs running Windows 10 or later. There's no requirement for the local PC to be joined to Microsoft Entra ID or an Active Directory domain.
      - [Web client](users/connect-web.md).
      - [macOS client](users/connect-macos.md), version 10.8.2 or later.
      - [iOS client](users/connect-ios-ipados.md), version 10.5.1 or later.
      - [Android client](users/connect-android-chrome-os.md), version 10.0.16 or later.

## Enable Microsoft Entra authentication for RDP

You must first allow Microsoft Entra authentication for Windows in your Microsoft Entra tenant, which enables issuing RDP access tokens allowing users to sign in to your Azure Virtual Desktop session hosts. You set the `isRemoteDesktopProtocolEnabled` property to true on the service principal's `remoteDesktopSecurityConfiguration` object for the following Microsoft Entra applications:

| Application Name | Application ID |
|--|--|
| Microsoft Remote Desktop | `a4a365df-50f1-4397-bc59-1a1564b8bb9c` |
| Windows Cloud Login | `270efc09-cd0d-444b-a71f-39af4910ec45` |

> [!IMPORTANT]
> As part of an upcoming change, we're transitioning from Microsoft Remote Desktop to Windows Cloud Login, beginning in 2024. Configuring both applications now ensures you're ready for the change.

To configure the service principal, use the [Microsoft Graph PowerShell SDK](/powershell/microsoftgraph/overview) to create a new [remoteDesktopSecurityConfiguration object](/graph/api/serviceprincipal-post-remotedesktopsecurityconfiguration) on the service principal and set the property `isRemoteDesktopProtocolEnabled` to `true`. You can also use the [Microsoft Graph API](/graph/use-the-api) with a tool such as [Graph Explorer](/graph/use-the-api#graph-explorer).

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Make sure you installed the [Microsoft Graph PowerShell SDK](/powershell/microsoftgraph/installation) from the [prerequisites](#prerequisites), then import the *Authentication* and *Applications* Microsoft Graph modules and connect to Microsoft Graph with the `Application.Read.All` and `Application-RemoteDesktopConfig.ReadWrite.All` scopes by running the following commands:

   ```powershell
   Import-Module Microsoft.Graph.Authentication
   Import-Module Microsoft.Graph.Applications

   Connect-MgGraph -Scopes "Application.Read.All","Application-RemoteDesktopConfig.ReadWrite.All"
   ```

3. Get the object ID for each service principal and store them in variables by running the following commands:

   ```powershell
   $MSRDspId = (Get-MgServicePrincipal -Filter "AppId eq 'a4a365df-50f1-4397-bc59-1a1564b8bb9c'").Id
   $WCLspId = (Get-MgServicePrincipal -Filter "AppId eq '270efc09-cd0d-444b-a71f-39af4910ec45'").Id
   ```

4. Set the property `isRemoteDesktopProtocolEnabled` to `true` by running the following commands. There's no output from these commands.

   ```powershell
   If ((Get-MgServicePrincipalRemoteDesktopSecurityConfiguration -ServicePrincipalId $MSRDspId) -ne $true) {
       Update-MgServicePrincipalRemoteDesktopSecurityConfiguration -ServicePrincipalId $MSRDspId -IsRemoteDesktopProtocolEnabled
   }

   If ((Get-MgServicePrincipalRemoteDesktopSecurityConfiguration -ServicePrincipalId $WCLspId) -ne $true) {
       Update-MgServicePrincipalRemoteDesktopSecurityConfiguration -ServicePrincipalId $WCLspId -IsRemoteDesktopProtocolEnabled
   }
   ```

5. Confirm the property `isRemoteDesktopProtocolEnabled` is set to `true` by running the following commands:

   ```powershell
   Get-MgServicePrincipalRemoteDesktopSecurityConfiguration -ServicePrincipalId $MSRDspId
   Get-MgServicePrincipalRemoteDesktopSecurityConfiguration -ServicePrincipalId $WCLspId
   ```

   The output to both commands should be:

   ```output
   Id IsRemoteDesktopProtocolEnabled
   -- ------------------------------
   id True
   ```

## Hide the consent prompt dialog

By default when single sign-on is enabled, users see a dialog to allow the Remote Desktop connection when connecting to a new session host. Microsoft Entra remembers up to 15 hosts for 30 days before prompting again. If users see this dialogue to allow the Remote Desktop connection, they can select **Yes** to connect.

You can hide this dialog by configuring a list of trusted devices. To configure the list of devices, create one or more groups in Microsoft Entra ID that contains your session hosts, then add the group IDs to a property on the SSO service principals, *Microsoft Remote Desktop* and *Windows Cloud Login*.

> [!TIP]
> We recommend you use a dynamic group and configure the dynamic membership rules to include all your Azure Virtual Desktop session hosts. You can use the device names in this group, but for a more secure option, you can set and use [device extension attributes](/graph/extensibility-overview) using [Microsoft Graph API](/graph/api/resources/device). While dynamic groups normally update within 5-10 minutes, large tenants can take up to 24 hours.
>
> Dynamic groups requires the Microsoft Entra ID P1 license or Intune for Education license. For more information, see [Dynamic membership rules for groups](/entra/identity/users/groups-dynamic-membership).

To configure the service principal, use the [Microsoft Graph PowerShell SDK](/powershell/microsoftgraph/overview) to create a new [targetDeviceGroup object](/graph/api/remotedesktopsecurityconfiguration-post-targetdevicegroups) on the service principal with the dynamic group's object ID and display name. You can also use the [Microsoft Graph API](/graph/use-the-api) with a tool such as [Graph Explorer](/graph/use-the-api#graph-explorer).

1. [Create a dynamic group](/entra/identity/users/groups-create-rule) in Microsoft Entra ID containing the session hosts for which you want to hide the dialog. Make a note of the object ID of the group for the next step.

1. In the same PowerShell session, create a `targetDeviceGroup` object by running the following commands, replacing the `<placeholders>` with your own values:

   ```powershell
   $tdg = New-Object -TypeName Microsoft.Graph.PowerShell.Models.MicrosoftGraphTargetDeviceGroup
   $tdg.Id = "<Group object ID>"
   $tdg.DisplayName = "<Group display name>"
   ```

1. Add the group to the `targetDeviceGroup` object by running the following commands:

   ```powershell
   New-MgServicePrincipalRemoteDesktopSecurityConfigurationTargetDeviceGroup -ServicePrincipalId $MSRDspId -BodyParameter $tdg
   New-MgServicePrincipalRemoteDesktopSecurityConfigurationTargetDeviceGroup -ServicePrincipalId $WCLspId -BodyParameter $tdg
   ```

   The output should be similar to the following example:

   ```output
   Id                                   DisplayName
   --                                   -----------
   12345678-abcd-1234-abcd-1234567890ab Contoso-session-hosts
   ```

   Repeat steps 2 and 3 for each group you want to add to the `targetDeviceGroup` object, up to a maximum of 10 groups.

1. If you later need to remove a device group from the `targetDeviceGroup` object, run the following commands, replacing the `<placeholders>` with your own values:

   ```powershell
   Remove-MgServicePrincipalRemoteDesktopSecurityConfigurationTargetDeviceGroup -ServicePrincipalId $MSRDspId -TargetDeviceGroupId "<Group object ID>"
   Remove-MgServicePrincipalRemoteDesktopSecurityConfigurationTargetDeviceGroup -ServicePrincipalId $WCLspId -TargetDeviceGroupId "<Group object ID>"
   ```

## Create a Kerberos server object

If your session hosts meet the following criteria, you must create a Kerberos server object. For more information, see [Enable passwordless security key sign-in to on-premises resources by using Microsoft Entra ID](/entra/identity/authentication/howto-authentication-passwordless-security-key-on-premises), specifically the section to [Create a Kerberos Server object](../active-directory/authentication/howto-authentication-passwordless-security-key-on-premises.md#create-a-kerberos-server-object):

- Your session host is Microsoft Entra hybrid joined. You must have a Kerberos server object to complete authentication to a domain controller.

- Your session host is Microsoft Entra joined and your environment contains Active Directory domain controllers. You must have a Kerberos server object for users to access on-premises resources, such as SMB shares and Windows-integrated authentication to websites.

> [!IMPORTANT]
> If you enable single sign-on on Microsoft Entra hybrid joined session hosts without creating a Kerberos server object, one of the following things can happen when you try to connect to a remote session: 
>
> - You receive an error message saying the specific session doesn't exist.
> - Single sign-on will be skipped and you see a standard authentication dialog for the session host. 
>
> To resolve these issues, create the Kerberos server object, then connect again.

## Review your conditional access policies

When single sign-on is enabled, a new Microsoft Entra ID app is introduced to authenticate users to the session host. If you have conditional access policies that apply when accessing Azure Virtual Desktop, review the recommendations on setting up [multifactor authentication](set-up-mfa.md) to ensure users have the desired experience.

## Configure your host pool to enable single sign-on

To enable single sign-on on your host pool, you must configure the following RDP property, which you can do using the Azure portal or PowerShell. You can find the steps to do configure RDP properties in [Customize Remote Desktop Protocol (RDP) properties for a host pool](customize-rdp-properties.md).

- In the Azure portal, set **Microsoft Entra single sign-on** to **Connections will use Microsoft Entra authentication to provide single sign-on**.

- For PowerShell, set the **enablerdsaadauth** property to **1**.

## Next steps

- Check out [In-session passwordless authentication](authentication.md#in-session-passwordless-authentication) to learn how to enable passwordless authentication.

- Learn how to [Configure the session lock behavior for Azure Virtual Desktop](configure-session-lock-behavior.md).

- For more information about Microsoft Entra Kerberos, see [Deep dive: How Microsoft Entra Kerberos works](https://techcommunity.microsoft.com/t5/itops-talk-blog/deep-dive-how-azure-ad-kerberos-works/ba-p/3070889).

- If you encounter any issues, go to [Troubleshoot connections to Microsoft Entra joined VMs](troubleshoot-azure-ad-connections.md).
