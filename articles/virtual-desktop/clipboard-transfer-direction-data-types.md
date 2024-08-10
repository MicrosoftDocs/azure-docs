---
title: Configure the clipboard transfer direction in Azure Virtual Desktop
description: Learn how to configure the clipboard in Azure Virtual Desktop to function only in a single direction (unidirectional), from session host to client, or client to session host.
ms.topic: how-to
author: dknappettmsft
ms.author: daknappe
ms.date: 07/18/2024
---

# Configure the clipboard transfer direction and types of data that can be copied in Azure Virtual Desktop

Clipboard redirection in Azure Virtual Desktop allows users to copy and paste content, such as text, images, and files between the user's device and the remote session in either direction. You might want to limit the direction of the clipboard for users, to help prevent data exfiltration or malicious files being copied to a session host. You can configure whether users can use the clipboard from session host to client, or client to session host, and the types of data that can be copied, from the following options:

- Disable clipboard transfers from session host to client, client to session host, or both.
- Allow plain text only.
- Allow plain text and images only.
- Allow plain text, images, and Rich Text Format only.
- Allow plain text, images, Rich Text Format, and HTML only.

You apply settings to your session hosts. It doesn't depend on a specific Remote Desktop client or its version. This article shows you how to configure the direction the clipboard and the types of data that can be copied using Microsoft Intune, or you can configure the local Group Policy or registry of session hosts.

## Prerequisites

To configure the clipboard transfer direction, you need:

- Host pool RDP properties must allow [clipboard redirection](redirection-configure-clipboard.md), otherwise it will be completely blocked.

- Depending on the method you use to configure the clipboard transfer direction:

   - For Intune, you need permission to configure and apply settings. For more information, see [Administrative template for Azure Virtual Desktop](administrative-template.md).

   - For configuring the local Group Policy or registry of session hosts, you need an account that is a member of the local Administrators group.

## Configure clipboard transfer direction

Here's how to configure the clipboard transfer direction and the types of data that can be copied. Select the relevant tab for your scenario.

# [Intune](#tab/intune)

To configure the clipboard using Intune, follow these steps. This process creates an Intune [settings catalog](/mem/intune/configuration/settings-catalog) policy.

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

    1. In the settings picker, expand **Administrative Templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Device and Resource Redirection**.

    1. Select the following settings and make sure you select the settings with the correct scope. The `(User)` settings apply to the user scope. The other settings apply to the device scope. To determine which scope is correct for your scenario, go to [Settings catalog - Device scope vs. user scope settings](/mem/intune/configuration/settings-catalog#device-scope-vs-user-scope-settings):

        - Restrict clipboard transfer from server to client
        - Restrict clipboard transfer from client to server

          **OR**

        - Restrict clipboard transfer from server to client (User)
        - Restrict clipboard transfer from client to server (User)

    1. Close the settings picker.

1. Configure the settings:

    - **Restrict clipboard transfer from server to client**: Select **Enabled**.
    - **Restrict clipboard transfer from server to client**: Select the type of clipboard data you want to prevent or allow. Your options:

      - Disable clipboard transfers from server to client
      - Allow plain text
      - Allow plain text and images
      - Allow plain text, images, and Rich Text Format
      - Allow plain text, images, Rich Text Format, and HTML

    - **Restrict clipboard transfer from client to server**: Select **Enabled**.
    - **Restrict clipboard transfer from client to server**: Select the type of clipboard data you want to prevent or allow. Your options:

      - Disable clipboard transfers from client to server
      - Allow plain text
      - Allow plain text and images
      - Allow plain text, images, and Rich Text Format
      - Allow plain text, images, Rich Text Format, and HTML

1. Select **Next**.

1. At the **Scope tags** tab (optional), you can skip this step. For more information about scope tags in Intune, see [Use RBAC roles and scope tags for distributed IT](/mem/intune/fundamentals/scope-tags).

    Select **Next**.

1. For the **Assignments** tab, select the users, devices, or groups to receive the profile, then select **Next**. For more information on assigning profiles, see [Assign user and device profiles](/mem/intune/configuration/device-profile-assign).

1. On the **Review + create** tab, review the configuration information, then select **Create**.

1. Once the policy configuration is created, resync your session hosts and reboot them for the settings to take effect.

1. Connect to a remote session with a supported client and test the clipboard settings you configured are working by trying to copy and paste content.

# [Group Policy](#tab/group-policy)

To configure the clipboard using Group Policy, follow these steps.

> [!IMPORTANT]
> These policy settings appear in both **Computer Configuration** and **User Configuration**. If both policy settings are configured, the stricter restriction is used.

1. Open **Local Group Policy Editor** from the Start menu or by running `gpedit.msc`.

1. Browse to one of the following policy sections. Use the policy section in **Computer Configuration** to the session host you target, and use the policy section in **User Configuration** applies to specific users you target.

   - Machine: `Computer Configuration\Administrative Templates\Windows Components\Remote Desktop Services\Remote Desktop Session Host\Device and Resource Redirection`
   - User: `User Configuration\Administrative Templates\Windows Components\Remote Desktop Services\Remote Desktop Session Host\Device and Resource Redirection`

1. Open one of the following policy settings, depending on whether you want to configure the clipboard from session host (server) to client, or client to session host:

   - To configure the clipboard from **session host to client**, open the policy setting **Restrict clipboard transfer from server to client**, then select **Enabled**. Choose from the following options:
      - **Disable clipboard transfers from server to client**.
      - **Allow plain text.**
      - **Allow plain text and images.**
      - **Allow plain text, images, and Rich Text Format.**
      - **Allow plain text, images, Rich Text Format, and HTML.**
   
   - To configure the clipboard from **client to session host**, open the policy setting **Restrict clipboard transfer from client to server**, then select **Enabled** . Choose from the following options:
      - **Disable clipboard transfers from client to server**.
      - **Allow plain text.**
      - **Allow plain text and images.**
      - **Allow plain text, images, and Rich Text Format.**
      - **Allow plain text, images, Rich Text Format, and HTML.**

1. Select **OK** to save your changes.

1. Once you configured settings, restart your session hosts for the settings to take effect.

1. Connect to a remote session with a supported client and test the clipboard settings you configured are working by trying to copy and paste content.

> [!TIP]
> During the preview, you can also configure Group Policy centrally in an Active Directory domain by copying the `terminalserver.admx` and `terminalserver.adml` administrative template files from a session host to the [Group Policy Central Store](/troubleshoot/windows-client/group-policy/create-and-manage-central-store) in a test environment.

# [Registry](#tab/registry)

To configure the clipboard using the registry on a session host, follow these steps.

1. Open **Registry Editor** from the Start menu or by running `regedit.exe`.

1. Set one of the following registry keys and its value, depending on whether you want to configure the clipboard from session host to client, or client to session host.

   - To configure the clipboard from **session host to client**, set one of the following registry keys and its value. Using the value for the machine applies to all users, and using the value for the user applies to the current user only.
      - **Key**:
         - Machine: `HKLM\Software\Policies\Microsoft\Windows NT\Terminal Services`
         - Users: `HKCU\Software\Policies\Microsoft\Windows NT\Terminal Services`
      - **Type**: `REG_DWORD`
      - **Value name**: `SCClipLevel`
      - **Value data**: Enter a value from the following table:

         | Value Data | Description |
         |--|--|
         | `0` | Disable clipboard transfers from session host to client. |
         | `1` | Allow plain text. |
         | `2` | Allow plain text and images. |
         | `3` | Allow plain text, images, and Rich Text Format. |
         | `4` | Allow plain text, images, Rich Text Format, and HTML. |

   - To configure the clipboard from **client to session host**, set one of the following registry keys and its value. Using the value for the machine applies to all users, and using the value for the user applies to the current user only.
      - **Key**:
         - Machine: `HKLM\Software\Policies\Microsoft\Windows NT\Terminal Services`
         - Users: `HKCU\Software\Policies\Microsoft\Windows NT\Terminal Services`
      - **Type**: `REG_DWORD`
      - **Value name**: `CSClipLevel`
      - **Value data**: Enter a value from the following table:
      
         | Value Data | Description |
         |--|--|
         | `0` | Disable clipboard transfers from client to session host. |
         | `1` | Allow plain text. |
         | `2` | Allow plain text and images. |
         | `3` | Allow plain text, images, and Rich Text Format. |
         | `4` | Allow plain text, images, Rich Text Format, and HTML. |

1. Restart your session host.

1. Connect to a remote session with a supported client and test the clipboard settings you configured are working by trying to copy and paste content.

---

## Related content

- Configure [Watermarking](watermarking.md).
- Configure [Screen Capture Protection](screen-capture-protection.md).
- Learn about how to secure your Azure Virtual Desktop deployment at [Security best practices](security-guide.md).
