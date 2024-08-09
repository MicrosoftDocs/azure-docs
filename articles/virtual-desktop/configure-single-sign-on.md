---
title: Configure single sign-on for Azure Virtual Desktop using Microsoft Entra ID authentication
description: Learn how to configure single sign-on for an Azure Virtual Desktop environment using Microsoft Entra ID authentication.
ms.topic: how-to
author: dknappettmsft
ms.author: daknappe
ms.date: 08/27/2024
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

When single sign-on is enabled and the remote session is locked, either by the user or by policy, the session is instead disconnected and a dialog is shown. Users can select the Reconnect option from the dialog when they are ready to connect again. This is done for security reason and to ensure full support of passwordless authentication. Disconnecting provides the following benefits:

- Consistent sign-in experience through Microsoft Entra ID when needed.
- Single sign-on experience and reconnection without authentication prompt when allowed by conditional access policies.
- Supports passwordless authentication like passkeys and FIDO2 devices, contrary to the remote lock screen.
- Conditional access policies, including multifactor authentication and sign-in frequency, are re-evaluated when the user reconnects to their session.
- Can require multi-factor authentication to return to the session and prevent users from unlocking with a simple username and password.

If you prefer to show the remote lock screen instead of disconnecting the session, your session hosts must use the following operating systems:

  - Windows 11 single or multi-session with the [2024-05 Cumulative Updates for Windows 11 (KB5037770)](https://support.microsoft.com/kb/KB5037770) or later installed.
  - Windows 10 single or multi-session, versions 20H2 or later with the [2024-06 Cumulative Updates for Windows 10 (KB5039211)](https://support.microsoft.com/kb/KB5039211) or later installed.
  - Windows Server 2022 with the [2024-05 Cumulative Update for Microsoft server operating system (KB5037782)](https://support.microsoft.com/kb/KB5037782) or later installed.

 You can configure the session lock behavior of your session hosts by using Intune, Group Policy or the registry.

# [Intune](#tab/intune)

To configure the session lock experience using Intune, follow these steps. This process creates an Intune [settings catalog](/mem/intune/configuration/settings-catalog) policy.

1. Sign in to the [Microsoft Intune admin center](https://intune.microsoft.com/).

1. Select **Devices** > **Manage devices** > **Configuration** > **Create** > **New policy**.

1. Enter the following properties:

    - **Platform**: Select **Windows 10 and later**.
    - **Profile type**: Select **Settings catalog**.

1. Select **Create**.
1. In **Basics**, enter the following properties:

    - **Name**: Enter a descriptive name for the profile. Name your profile so you can easily identify it later.
    - **Description**: Enter a description for the profile. This setting is optional, but recommended.

1. Select **Next**.

1. In **Configuration settings**, select **Add settings**. Then:

    1. In the settings picker, expand **Administrative Templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Security**.

    1. Select the **Disconnect remote session on lock for Microsoft identity platform authentication** setting.

    1. Close the settings picker.

1. Configure the setting to "Disabled" to show the remote lock screen when the session locks.

1. Select **Next**.

1. (Optional) Add the **Scope tags**. For more information about scope tags in Intune, see [Use RBAC roles and scope tags for distributed IT](/mem/intune/fundamentals/scope-tags).

1. Select **Next**.

1. For the **Assignments** tab, select the devices, or groups to receive the profile, then select **Next**. For more information on assigning profiles, see [Assign user and device profiles](/mem/intune/configuration/device-profile-assign).

1. On the **Review + create** tab, review the configuration information, then select **Create**.

1. Once the policy configuration is created, the setting will take effect after the session hosts sync with Intune and users initiate a new session.

# [Group Policy](#tab/group-policy)

To configure the session lock experience using Group Policy, follow these steps.

1. Open **Local Group Policy Editor** from the Start menu or by running `gpedit.msc`.

1. Browse to the following policy section:

   - `Computer Configuration\Administrative Templates\Windows Components\Remote Desktop Services\Remote Desktop Session Host\Security`

1. Select the **Disconnect remote session on lock for Microsoft identity platform authentication** policy.

1. Set the policy to **Disabled** to show the remote lock screen when the session locks.

1. Select **OK** to save your changes.

1. Once the policy is configured, it will take effect after the user initiate a new session.

> [!TIP]
> To configure the Group Policy centrally on Active Directory Domain Controllers using Windows Server 2019 or Windows Server 2016, copy the `terminalserver.admx` and `terminalserver.adml` administrative template files from a session host to the [Group Policy Central Store](/troubleshoot/windows-client/group-policy/create-and-manage-central-store) on the domain controller.

# [Registry](#tab/registry)

To configure the session lock experience using the registry on a session host, follow these steps.

1. Open **Registry Editor** from the Start menu or by running `regedit.exe`.

1. Set the following registry key and its value.

   - **Key**: `HKLM\Software\Policies\Microsoft\Windows NT\Terminal Services`
   - **Type**: `REG_DWORD`
   - **Value name**: `fdisconnectonlockmicrosoftidentity`
   - **Value data**: Enter a value from the following table:

      | Value Data | Description |
      |--|--|
      | `0` | Show the remote lock screen. |
      | `1` | Disconnect the session. |

### Active Directory domain administrator accounts with single sign-on

In environments with an Active Directory Domain Services (AD DS) and hybrid user accounts, the default *Password Replication Policy* on read-only domain controllers denies password replication for members of *Domain Admins* and *Administrators* security groups. This policy prevents these administrator accounts from signing in to Microsoft Entra hybrid joined hosts and might keep prompting them to enter their credentials. It also prevents administrator accounts from accessing on-premises resources that use Kerberos authentication from Microsoft Entra joined hosts. We don't recommend connecting to a remote session using an account that is a domain administrator.

If you need to make changes to a session host as an administrator, sign in to the session host using a non-administrator account, then use the *Run as administrator* option or [runas](/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/cc771525(v=ws.11)) from a command prompt to change to an administrator.

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

## Hide the consent prompt dialog

By default when single sign-on is enabled, users will see a dialog to allow the Remote Desktop connection when connecting to a new session host. Microsoft Entra remembers up to 15 hosts for 30 days before prompting again. If users see this dialogue to allow the Remote Desktop connection, the can select **Yes** to connect.

You can hide this dialog by configuring a list of trusted devices. To configure the list of devices, create one or more groups in Microsoft Entra ID that contains your session hosts, then add the group IDs to a property on the SSO service principals, *Microsoft Remote Desktop* and *Windows Cloud Login*.

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

## Next steps

- Check out [In-session passwordless authentication](authentication.md#in-session-passwordless-authentication) to learn how to enable passwordless authentication.
- For more information about Microsoft Entra Kerberos, see [Deep dive: How Microsoft Entra Kerberos works](https://techcommunity.microsoft.com/t5/itops-talk-blog/deep-dive-how-azure-ad-kerberos-works/ba-p/3070889)
- If you're accessing Azure Virtual Desktop from our Windows Desktop client, see [Connect with the Windows Desktop client](./users/connect-windows.md).
- If you're accessing Azure Virtual Desktop from our web client, see [Connect with the web client](./users/connect-web.md).
- If you encounter any issues, go to [Troubleshoot connections to Microsoft Entra joined VMs](troubleshoot-azure-ad-connections.md).
