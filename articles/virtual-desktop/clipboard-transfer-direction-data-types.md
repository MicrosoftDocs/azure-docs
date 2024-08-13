---
title: Configure the clipboard transfer direction in Azure Virtual Desktop
description: Learn how to configure the clipboard transfer direction and types of data that can be copied in Azure Virtual Desktop from session host to client, or client to session host.
ms.topic: how-to
author: dknappettmsft
ms.author: daknappe
ms.date: 08/13/2024
---

# Configure the clipboard transfer direction and types of data that can be copied in Azure Virtual Desktop

Clipboard redirection in Azure Virtual Desktop allows users to copy and paste content, such as text, images, and files between the user's device and the remote session in either direction. You might want to limit the direction of the clipboard for users, to help prevent data exfiltration or malicious files being copied to a session host. You can configure whether users can use the clipboard from session host to client, or client to session host, and the types of data that can be copied, from the following options:

- Disable clipboard transfers from session host to client, client to session host, or both.
- Allow plain text only.
- Allow plain text and images only.
- Allow plain text, images, and Rich Text Format only.
- Allow plain text, images, Rich Text Format, and HTML only.

You apply settings to your session hosts. It doesn't depend on a specific Remote Desktop client or its version. This article shows you how to configure the direction the clipboard and the types of data that can be copied using Microsoft Intune or Group Policy.

## Prerequisites

To configure the clipboard transfer direction, you need:

- Host pool RDP properties must allow [clipboard redirection](redirection-configure-clipboard.md), otherwise it will be completely blocked.

- Your session hosts must be running one of the following operating systems:

   - Windows 11 Enterprise or Enterprise multi-session, version 22H2 or 23H2 with the [2024-06 cumulative update (KB5039212)](https://support.microsoft.com/kb/5039212) or later installed.
   - Windows 11 Enterprise or Enterprise multi-session, version 21H2 with the [2024-06 cumulative update (KB5039213)](https://support.microsoft.com/kb/5039213) or later installed.
   - Windows Server 2022 with the [2024-07 cumulative update (KB5040437)](https://support.microsoft.com/kb/5040437) or later installed.

- Depending on the method you use to configure the clipboard transfer direction:

   - For Intune, you need permission to configure and apply settings. For more information, see [Administrative template for Azure Virtual Desktop](administrative-template.md).

   - For configuring the local Group Policy or registry of session hosts, you need an account that is a member of the local Administrators group.

## Configure clipboard transfer direction

Here's how to configure the clipboard transfer direction and the types of data that can be copied. Select the relevant tab for your scenario.

# [Intune](#tab/intune)

To configure the clipboard using Intune, follow these steps. This process creates an Intune [settings catalog](/mem/intune/configuration/settings-catalog) policy.

1. Sign in to the [Microsoft Intune admin center](https://intune.microsoft.com/).

1. [Create or edit a configuration profile](/mem/intune/configuration/administrative-templates-windows) for **Windows 10 and later** devices, with the **Settings catalog** profile type.

1. In the settings picker, browse to **Administrative templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Device and Resource Redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-intune.png" alt-text="A screenshot showing the device and resource redirection options in the Microsoft Intune portal." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-intune.png":::

1. Check the box for the following settings, making sure you select the settings with the correct scope for your requirements, then close the settings picker. To determine which scope is correct for your scenario, see [Settings catalog - Device scope vs. user scope settings](/mem/intune/configuration/settings-catalog#device-scope-vs-user-scope-settings):

   - Device scope settings:
      - **Restrict clipboard transfer from server to client**
      - **Restrict clipboard transfer from client to server**

   - User scope settings:
      - **Restrict clipboard transfer from server to client (User)**
      - **Restrict clipboard transfer from client to server (User)**

1. Expand the **Administrative templates** category, then toggle the switch for each setting you added to **Enabled**.

1. Once each setting is enabled, a drop-down list appears from which you can select the types of data that can be copied. Choose from the following options:

      - **Disable clipboard transfers from server to client** or **Disable clipboard transfers from client to server**
      - **Allow plain text**
      - **Allow plain text and images**
      - **Allow plain text, images, and Rich Text Format**
      - **Allow plain text, images, Rich Text Format, and HTML**

1. Select **Next**.

1. *Optional*: On the **Scope tags** tab, select a scope tag to filter the profile. For more information about scope tags, see [Use role-based access control (RBAC) and scope tags for distributed IT](/mem/intune/fundamentals/scope-tags).

1. On the **Assignments** tab, select the group containing the computers providing a remote session you want to configure, then select **Next**.

1. On the **Review + create** tab, review the settings, then select **Create**.

1. Once the policy applies to the computers providing a remote session, restart them for the settings to take effect.

1. Connect to a remote session with a supported client and test the clipboard settings you configured are working by trying to copy and paste different types of content.

# [Group Policy](#tab/group-policy)

To configure the clipboard using Group Policy in an Active Directory domain, follow these steps.

> [!IMPORTANT]
> These policy settings appear in both **Computer Configuration** and **User Configuration**. If both policy settings are configured, the stricter restriction is used.

1. The Group Policy settings are only available in Windows 11, version 23H2 and later. You need to copy the administrative template files `C:\Windows\PolicyDefinitions\terminalserver.admx` and `C:\Windows\PolicyDefinitions\en-US\terminalserver.adml` from a session host to the same location on your domain controllers or the [Group Policy Central Store](/troubleshoot/windows-client/group-policy/create-and-manage-central-store), depending on your environment. In the file path for `terminalserver.adml` replace `en-US` with the appropriate language code if you're using a different language.

1. On a device you use to manage Group Policy, open the **Group Policy Management Console (GPMC)** and create or edit a policy that targets your session hosts.

1. Browse to one of the following policy sections. Use the policy section in **Computer Configuration** to the session host you target, and use the policy section in **User Configuration** applies to specific users you target.

   - Machine: `Computer Configuration\Administrative Templates\Windows Components\Remote Desktop Services\Remote Desktop Session Host\Device and Resource Redirection`
   
   - User: `User Configuration\Administrative Templates\Windows Components\Remote Desktop Services\Remote Desktop Session Host\Device and Resource Redirection`

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-group-policy.png" alt-text="A screenshot showing the device and resource redirection options in the Group Policy editor.":::

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

1. Once you've configured settings, ensure the policy is applied to your session hosts, then refresh Group Policy on the session hosts and restart them for the settings to take effect

1. Connect to a remote session with a supported client and test the clipboard settings you configured are working by trying to copy and paste different types of content.

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

1. Connect to a remote session with a supported client and test the clipboard settings you configured are working by trying to copy and paste different types of content.

---

## Related content

- Configure [Watermarking](watermarking.md).
- Configure [Screen Capture Protection](screen-capture-protection.md).
- Learn about how to secure your Azure Virtual Desktop deployment at [Security best practices](security-guide.md).
