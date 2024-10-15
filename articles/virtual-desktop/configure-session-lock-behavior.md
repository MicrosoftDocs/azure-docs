---
title: Configure the session lock behavior for Azure Virtual Desktop
description: Learn how to configure session lock behavior for Azure Virtual Desktop.
ms.topic: how-to
author: dknappettmsft
ms.author: daknappe
ms.date: 09/17/2024
---

# Configure the session lock behavior for Azure Virtual Desktop

You can choose whether the session is disconnected or the remote lock screen is shown when a remote session is locked, either by the user or by policy. When the session lock behavior is set to disconnect, a dialog is shown to let users know they were disconnected. Users can choose the **Reconnect** option from the dialog when they're ready to connect again.

When used with single sign-on using Microsoft Entra ID, disconnecting the session provides the following benefits:

- A consistent sign-in experience through Microsoft Entra ID when needed.

- A single sign-on experience and reconnection without authentication prompt, when allowed by conditional access policies.

- Support for passwordless authentication like passkeys and FIDO2 devices, contrary to the remote lock screen. Disconnecting the session is necessary to ensure full support of passwordless authentication.

- Conditional access policies, including multifactor authentication and sign-in frequency, are reevaluated when the user reconnects to their session.

- You can require multifactor authentication to return to the session and prevent users from unlocking with a simple username and password.

For scenarios that rely on legacy authentication, including NTLM, CredSSP, RDSTLS, TLS, and RDP basic authentication protocols, users are prompted to re-enter their credentials when they reconnect or start a new connection.

The default session lock behavior is different depending on whether you're using single sign-on with Microsoft Entra ID or legacy authentication. The following table shows the default configuration for each scenario:

| Scenario | Default configuration |
|--|--|
| Single sign-on using Microsoft Entra ID | Disconnect the session |
| Legacy authentication protocols | Show the remote lock screen |

This article shows you how to change the session lock behavior from its default configuration using Microsoft Intune or Group Policy.

## Prerequisites

Select the relevant tab for your configuration method.

# [Intune](#tab/intune)

Before you can configure the session lock behavior, you need to meet the following prerequisites:

- An existing host pool with session hosts.

- Your session hosts must be running one of the following operating systems with the relevant cumulative update installed:

   - Windows 11 single or multi-session with the [2024-05 Cumulative Updates for Windows 11 (KB5037770)](https://support.microsoft.com/kb/KB5037770) or later installed.
   - Windows 10 single or multi-session, versions 21H2 or later with the [2024-06 Cumulative Updates for Windows 10 (KB5039211)](https://support.microsoft.com/kb/KB5039211) or later installed.
   - Windows Server 2022 with the [2024-05 Cumulative Update for Microsoft server operating system (KB5037782)](https://support.microsoft.com/kb/KB5037782) or later installed.

- To configure Intune, you need:

   - A Microsoft Entra ID account that is assigned the [Policy and Profile manager](/mem/intune/fundamentals/role-based-access-control-reference#policy-and-profile-manager) built-in RBAC role.
   - A group containing the devices you want to configure.

# [Group Policy](#tab/group-policy)

Before you can configure the session lock behavior, you need to meet the following prerequisites:

- An existing host pool with session hosts.

- Your session hosts must be running one of the following operating systems with the relevant cumulative update installed:

   - Windows 11 single or multi-session with the [2024-05 Cumulative Updates for Windows 11 (KB5037770)](https://support.microsoft.com/kb/KB5037770) or later installed.
   - Windows 10 single or multi-session, versions 21H2 or later with the [2024-06 Cumulative Updates for Windows 10 (KB5039211)](https://support.microsoft.com/kb/KB5039211) or later installed.
   - Windows Server 2022 with the [2024-05 Cumulative Update for Microsoft server operating system (KB5037782)](https://support.microsoft.com/kb/KB5037782) or later installed.

- To configure Group Policy, you need:

   - A domain account that has permission to create or edit Group Policy objects.
   - A security group or organizational unit (OU) containing the devices you want to configure.

---

## Configure the session lock behavior

Select the relevant tab for your configuration method.

# [Intune](#tab/intune)

To configure the session lock experience using Intune:

1. Sign in to the [Microsoft Intune admin center](https://endpoint.microsoft.com/).

1. [Create or edit a configuration profile](/mem/intune/configuration/administrative-templates-windows) for **Windows 10 and later** devices, with the **Settings catalog** profile type.

1. In the settings picker, browse to **Administrative templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Security**.

   :::image type="content" source="media/configure-session-lock-behavior/remote-desktop-session-host-security-intune.png" alt-text="A screenshot showing the Remote Desktop Session Host security options in the Microsoft Intune portal." lightbox="media/configure-session-lock-behavior/remote-desktop-session-host-security-intune.png":::

1. Check the box for one of the following settings, depending on your requirements:

   - For single sign-on using Microsoft Entra ID:

      1. Check the box for **Disconnect remote session on lock for Microsoft identity platform authentication**, then close the settings picker.

      1. Expand the **Administrative templates** category, then toggle the switch for **Disconnect remote session on lock for Microsoft identity platform authentication** to **Enabled** or **Disabled**:

         - To disconnect the remote session when the session locks, toggle the switch to **Enabled**.

         - To show the remote lock screen when the session locks, toggle the switch to **Disabled**.

   - For legacy authentication protocols:

      1. Check the box for **Disconnect remote session on lock for legacy authentication**, then close the settings picker.

      1. Expand the **Administrative templates** category, then toggle the switch for **Disconnect remote session on lock for legacy authentication** to **Enabled** or **Disabled**:

         - To disconnect the remote session when the session locks, toggle the switch to **Enabled**.

         - To show the remote lock screen when the session locks, toggle the switch to **Disabled**.

1. Select **Next**.

1. *Optional*: On the **Scope tags** tab, select a scope tag to filter the profile. For more information about scope tags, see [Use role-based access control (RBAC) and scope tags for distributed IT](/mem/intune/fundamentals/scope-tags).

1. On the **Assignments** tab, select the group containing the computers providing a remote session you want to configure, then select **Next**.

1. On the **Review + create** tab, review the settings, then select **Create**.

1. Once the policy applies to the session hosts, restart them for the settings to take effect.

1. To test the configuration, connect to a remote session, then lock the remote session. Verify that the session either disconnects or the remote lock screen is shown, depending on your configuration.

# [Group Policy](#tab/group-policy)

To configure the session lock experience using Group Policy, follow these steps.

1. The Group Policy settings are only available on the operating systems listed in [Prerequisites](#prerequisites). To make them available on other versions of Windows Server, you need to copy the administrative template files `C:\Windows\PolicyDefinitions\terminalserver.admx` and `C:\Windows\PolicyDefinitions\en-US\terminalserver.adml` from a session host to the same location on your domain controllers or the [Group Policy Central Store](/troubleshoot/windows-client/group-policy/create-and-manage-central-store), depending on your environment. In the file path for `terminalserver.adml` replace `en-US` with the appropriate language code if you're using a different language.

1. Open the **Group Policy Management** console on the device you use to manage the Active Directory domain.

1. Create or edit a policy that targets the computers providing a remote session you want to configure.

1. Navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Security**.

   :::image type="content" source="media/configure-session-lock-behavior/remote-desktop-session-host-security-group-policy.png" alt-text="A screenshot showing the Remote Desktop Session Host security options in the Group Policy editor." lightbox="media/configure-session-lock-behavior/remote-desktop-session-host-security-group-policy.png":::

1. Double-click one of the following policy settings, depending on your requirements:

   - For single sign-on using Microsoft Entra ID:
   
      1. Double-click **Disconnect remote session on lock for Microsoft identity platform authentication** to open it.

         - To disconnect the remote session when the session locks, select **Enabled** or **Not configured**.

         - To show the remote lock screen when the session locks, select **Disabled**.

      1. Select **OK**.

   - For legacy authentication protocols:

      1. Double-click **Disconnect remote session on lock for legacy authentication** to open it.

         - To disconnect the remote session when the session locks, select **Enabled**.

         - To show the remote lock screen when the session locks, select **Disabled** or **Not configured**.

      1. Select **OK**.

1. Ensure the policy is applied to the session hosts, then restart them for the settings to take effect.

1. To test the configuration, connect to a remote session, then lock the remote session. Verify that the session either disconnects or the remote lock screen is shown, depending on your configuration.

---

## Related content

- Learn how to [Configure single sign-on for Azure Virtual Desktop using Microsoft Entra ID](configure-single-sign-on.md).
