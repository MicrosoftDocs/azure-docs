---
title: Configure single sign-on for Azure Virtual Desktop using Microsoft Entra ID authentication
description: Learn how to configure single sign-on for an Azure Virtual Desktop environment using Microsoft Entra ID authentication.
ms.topic: how-to
author: dknappettmsft
ms.author: daknappe
ms.date: 12/15/2023
---

# Configure single sign-on for Azure Virtual Desktop using Microsoft Entra ID authentication

This article walks you through the process of configuring single sign-on (SSO) for Azure Virtual Desktop using Microsoft Entra ID authentication. When you enable single sign-on, users authenticate to Windows using a Microsoft Entra ID token. This token enables the use of passwordless authentication and third-party identity providers that federate with Microsoft Entra ID when connecting to a session host, making the sign-in experience seamless.

Single sign-on using Microsoft Entra ID authentication also provides a seamless experience for Microsoft Entra ID-based resources inside the session. For more information on using passwordless authentication within a session, see [In-session passwordless authentication](authentication.md#in-session-passwordless-authentication).

To enable single sign-on using Microsoft Entra ID authentication, there are five tasks you must complete:

1. Enable Microsoft Entra authentication for Remote Desktop Protocol (RDP).

1. Configure the target device groups.

1. Create a *Kerberos Server object*, if Active Directory Domain Services is part of your environment. More information on the criteria is included in its section.

1. Review your conditional access policies.

1. Configure your host pool to enable single sign-on.

## Before enabling single sign-on

Before you enable single sign-on, review the following information for using it in your environment.

### Disconnection when the session is locked

When single sign-on is enabled, you sign in to Windows using a Microsoft Entra ID authentication token, which provides support for passwordless authentication to Windows. The Windows lock screen in the remote session doesn't support Microsoft Entra ID authentication tokens or passwordless authentication methods, like FIDO keys. The lack of support for these authentication methods means that users can't unlock their screens in a remote session. When you try to lock a remote session, either through user action or system policy, the session is instead disconnected and the service sends a message to the user explaining they were disconnected.

Disconnecting the session also ensures that when the connection is relaunched after a period of inactivity, Microsoft Entra ID reevaluates any applicable conditional access policies.

### Using an Active Directory domain administrator account with single sign-on

In environments with an Active Directory Domain Services (AD DS) and hybrid user accounts, the default *Password Replication Policy* on read-only domain controllers denies password replication for members of *Domain Admins* and *Administrators* security groups. This policy prevents these administrator accounts from signing in to Microsoft Entra hybrid joined hosts and might keep prompting them to enter their credentials. It also prevents administrator accounts from accessing on-premises resources that use Kerberos authentication from Microsoft Entra joined hosts.

To allow these admin accounts to connect when single sign-on is enabled, see [Allow Active Directory domain administrator accounts to connect](#allow-active-directory-domain-administrator-accounts-to-connect).

## Prerequisites

Before you can enable single sign-on, you must meet the following prerequisites:

- To configure your Microsoft Entra tenant, you must be assigned one of the following [Microsoft Entra built-in roles](/entra/identity/role-based-access-control/manage-roles-portal):
   - [Application Administrator](/entra/identity/role-based-access-control/permissions-reference#application-administrator)
   - [Cloud Application Administrator](/entra/identity/role-based-access-control/permissions-reference#cloud-application-administrator)
   - [Global Administrator](/entra/identity/role-based-access-control/permissions-reference#global-administrator)

- Your session hosts must be running one of the following operating systems with the relevant cumulative update installed:

   - Windows 11 Enterprise single or multi-session with the [2022-10 Cumulative Updates for Windows 11 (KB5018418)](https://support.microsoft.com/kb/KB5018418) or later installed.
   - Windows 10 Enterprise single or multi-session with the [2022-10 Cumulative Updates for Windows 10 (KB5018410)](https://support.microsoft.com/kb/KB5018410) or later installed.
   - Windows Server 2022 with the [2022-10 Cumulative Update for Microsoft server operating system (KB5018421)](https://support.microsoft.com/kb/KB5018421) or later installed.

- Your session hosts must be [Microsoft Entra joined](/entra/identity/devices/concept-directory-join) or [Microsoft Entra hybrid joined](/entra/identity/devices/concept-hybrid-join). Session hosts joined to Microsoft Entra Domain Services or to Active Directory Domain Services only aren't supported.

   If your Microsoft Entra hybrid joined session hosts are in a different Active Directory domain than your user accounts, there must be a two-way trust between the two domains. Without the two-way trust, connections will fall back to older authentication protocols.

- [Install the Microsoft Graph PowerShell SDK](/powershell/microsoftgraph/installation) version 2.9.0 or later on your local device or in [Azure Cloud Shell](../cloud-shell/overview.md).

- A supported Remote Desktop client to connect to a remote session. The following clients are supported:

   - [Windows Desktop client](users/connect-windows.md) on local PCs running Windows 10 or later. There's no requirement for the local PC to be joined to Microsoft Entra ID or an Active Directory domain.
   - [Web client](users/connect-web.md).
   - [macOS client](users/connect-macos.md), version 10.8.2 or later.
   - [iOS client](users/connect-ios-ipados.md), version 10.5.1 or later.
   - [Android client](users/connect-android-chrome-os.md), version 10.0.16 or later.

- To configure allowing Active Directory domain administrator account to connect when single sign-on is enabled, you need an account that is a member of the **Domain Admins** security group.

## Enable Microsoft Entra authentication for RDP

You must first allow Microsoft Entra authentication for Windows in your Microsoft Entra tenant, which enables issuing RDP access tokens allowing users to sign in to your Azure Virtual Desktop session hosts. You set the `isRemoteDesktopProtocolEnabled` property to true on the service principal's `remoteDesktopSecurityConfiguration` object for the following Microsoft Entra applications:

| Application Name | Application ID |
|--|--|
| Microsoft Remote Desktop | a4a365df-50f1-4397-bc59-1a1564b8bb9c |
| Windows Cloud Login | 270efc09-cd0d-444b-a71f-39af4910ec45 |

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

   The output should be:

   ```output
   Id IsRemoteDesktopProtocolEnabled
   -- ------------------------------
   id True
   ```

## Configure the target device groups

After you enable Microsoft Entra authentication for RDP, you need to configure the target device groups. By default when enabling single sign-on, users are prompted to authenticate to Microsoft Entra ID and allow the Remote Desktop connection when launching a connection to a new session host. Microsoft Entra remembers up to 15 hosts for 30 days before prompting again. If you see a dialogue to allow the Remote Desktop connection, select **Yes** to connect.

You can hide this dialog and provide single sign-on for connections to all your session hosts by configuring a list of trusted devices. You need to create one or more groups in Microsoft Entra ID that contains your session hosts, then set a property on the service principals for the same *Microsoft Remote Desktop* and *Windows Cloud Login* applications, as used in the previous section, for the group.

> [!TIP]
> We recommend you use a dynamic group and configure the dynamic membership rules to includes all your Azure Virtual Desktop session hosts. You can use the device names in this group, but for a more secure option, you can set and use [device extension attributes](/graph/extensibility-overview) using [Microsoft Graph API](/graph/api/resources/device). While dynamic groups normally update within 5-10 minutes, large tenants can take up to 24 hours.
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

   The output should be similar:

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

## Create a Kerberos Server object

If your session hosts meet the following criteria, you must [Create a Kerberos Server object](../active-directory/authentication/howto-authentication-passwordless-security-key-on-premises.md#create-a-kerberos-server-object):

- Your session host is Microsoft Entra hybrid joined. You must have a Kerberos Server object to complete authentication to a domain controller.
- Your session host is Microsoft Entra joined and your environment contains Active Directory domain controllers. You must have a Kerberos Server object for users to access on-premises resources, such as SMB shares, and Windows-integrated authentication to websites.

> [!IMPORTANT]
> If you enable single sign-on on Microsoft Entra hybrid joined session hosts before you create a Kerberos server object, one of the following things can happen: 
>
> - You receive an error message saying the specific session doesn't exist.
> - Single sign-on will be skipped and you see a standard authentication dialog for the session host. 
>
> To resolve these issues, create the Kerberos Server object, then connect again.

## Review your conditional access policies

When single sign-on is enabled, a new Microsoft Entra ID app is introduced to authenticate users to the session host. If you have conditional access policies that apply when accessing Azure Virtual Desktop, review the recommendations on setting up [multifactor authentication](set-up-mfa.md) to ensure users have the desired experience.

## Configure your host pool to enable single sign-on

To enable single sign-on on your host pool, you must configure the following RDP property, which you can do using the Azure portal or PowerShell. You can find the steps to do configure RDP properties in [Customize Remote Desktop Protocol (RDP) properties for a host pool](customize-rdp-properties.md).

- In the Azure portal, set **Microsoft Entra single sign-on** to **Connections will use Microsoft Entra authentication to provide single sign-on**.
- For PowerShell, set the **enablerdsaadauth** property to **1**.

## Allow Active Directory domain administrator accounts to connect

To allow Active Directory domain administrator accounts to connect when single sign-on is enabled:

1. On a device that you use to manage your Active Directory domain, open the **Active Directory Users and Computers** console using an account that is a member of the **Domain Admins** security group.

1. Open the **Domain Controllers** organizational unit for your domain.

1. Find the **AzureADKerberos** object, right-click it, then select **Properties**.

1. Select the **Password Replication Policy** tab.

1. Change the policy for **Domain Admins** from *Deny* to *Allow*.

1. Delete the policy for **Administrators**. The Domain Admins group is a member of the Administrators group, so denying replication for administrators also denies it for domain admins.

1. Select **OK** to save your changes.

## Next steps

- Check out [In-session passwordless authentication](authentication.md#in-session-passwordless-authentication) to learn how to enable passwordless authentication.
- For more information about Microsoft Entra Kerberos, see [Deep dive: How Microsoft Entra Kerberos works](https://techcommunity.microsoft.com/t5/itops-talk-blog/deep-dive-how-azure-ad-kerberos-works/ba-p/3070889)
- If you're accessing Azure Virtual Desktop from our Windows Desktop client, see [Connect with the Windows Desktop client](./users/connect-windows.md).
- If you're accessing Azure Virtual Desktop from our web client, see [Connect with the web client](./users/connect-web.md).
- If you encounter any issues, go to [Troubleshoot connections to Microsoft Entra joined VMs](troubleshoot-azure-ad-connections.md).
