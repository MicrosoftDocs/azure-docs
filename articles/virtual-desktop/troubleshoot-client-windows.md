---
title: Troubleshoot the Remote Desktop client for Windows - Azure Virtual Desktop
description: Troubleshoot issues you may experience with the Remote Desktop client for Windows when connecting to Azure Virtual Desktop.
author: dknappettmsft
ms.topic: troubleshooting
ms.date: 11/01/2022
ms.author: daknappe
---

# Troubleshoot the Remote Desktop client for Windows when connecting to Azure Virtual Desktop

This article describes issues you may experience with the [Remote Desktop client for Windows](users/connect-windows.md?toc=%2Fazure%2Fvirtual-desktop%2Ftoc.json) when connecting to Azure Virtual Desktop and how to fix them.

## General

In this section you'll find troubleshooting guidance for general issues with the Remote Desktop client.

[!INCLUDE [troubleshoot-remote-desktop-client-doesnt-show-resources](includes/troubleshoot-remote-desktop-client-doesnt-show-resources.md)]

[!INCLUDE [troubleshoot-aadj-connections-all](includes/troubleshoot-aadj-connections-all.md)]

### Client stops responding or cannot be opened

If the Remote Desktop client for Windows stops responding or cannot be opened, you may need to reset user data. If you can open the client, you can reset user data from the **About** menu, or if you can't open the client, you can reset user data from the command line. The default settings for the client will be restored and you'll be unsubscribed from all workspaces.

To reset user data from the client:

1. Open the **Remote Desktop** app on your device.

1. Select the three dots at the top right-hand corner to show the menu, then select **About**.

1. In the section **Reset user data**, select **Reset**. To confirm you want to reset your user data, select **Continue**. 

To reset user data from the command line:

1. Open PowerShell.

1. Change the directory to where the Remote Desktop client is installed, by default this is `C:\Program Files\Remote Desktop`.

1. Run the following command to reset user data. You will be prompted to confirm you want to reset your user data.

   ```powershell
   .\msrdcw.exe /reset
   ```

   You can also add the `/f` option, where your user data will be reset without confirmation:

   ```powershell
   .\msrdcw.exe /reset /f
   ```

## Authentication and identity

In this section you'll find troubleshooting guidance for authentication and identity issues with the Remote Desktop client.

[!INCLUDE [troubleshoot-aadj-connections-windows](includes/troubleshoot-aadj-connections-windows.md)]

### Authentication issues while using an N SKU of Windows

Authentication issues can happen because you're using an *N* SKU of Windows on your local device without the *Media Feature Pack*. For more information and to learn how to install the Media Feature Pack, see [Media Feature Pack list for Windows N editions](https://support.microsoft.com/topic/media-feature-pack-list-for-windows-n-editions-c1c6fffa-d052-8338-7a79-a4bb980a700a).

### Authentication issues when TLS 1.2 not enabled

Authentication issues can happen when your local Windows device doesn't have TLS 1.2 enabled. This is most likely with Windows 7 where TLS 1.2 isn't enabled by default. To enable TLS 1.2 on Windows 7, you need to set the following registry values:

- **Key**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Client`

   | Value Name | Type | Value Data |
   |--|--|--|
   | DisabledByDefault | DWORD | 0 |
   | Enabled | DWORD | 1 |

- **Key**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server`

   | Value Name | Type | Value Data |
   |--|--|--|
   | DisabledByDefault | DWORD | 0 |
   | Enabled | DWORD | 1 |

- **Key**: `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\.NETFramework\v4.0.30319`

   | Value Name | Type | Value Data |
   |--|--|--|
   | SystemDefaultTlsVersions | DWORD | 1 |
   | SchUseStrongCrypto | DWORD | 1 |

You can configure these registry values by opening PowerShell as an administrator and running the following commands:

```powershell
New-Item 'HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server' -Force
New-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server' -Name 'Enabled' -Value '1' -PropertyType 'DWORD' -Force
New-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server' -Name 'DisabledByDefault' -Value '0' -PropertyType 'DWORD' -Force

New-Item 'HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Client' -Force
New-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Client' -Name 'Enabled' -Value '1' -PropertyType 'DWORD' -Force
New-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Client' -Name 'DisabledByDefault' -Value '0' -PropertyType 'DWORD' -Force

New-Item 'HKLM:\SOFTWARE\Microsoft\.NETFramework\v4.0.30319' -Force
New-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\.NETFramework\v4.0.30319' -Name 'SystemDefaultTlsVersions' -Value '1' -PropertyType 'DWORD' -Force
New-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\.NETFramework\v4.0.30319' -Name 'SchUseStrongCrypto' -Value '1' -PropertyType 'DWORD' -Force
```

## Issue isn't listed here

If your issue isn't listed here, see [Troubleshooting overview, feedback, and support for Azure Virtual Desktop](troubleshoot-set-up-overview.md) for information about how to open an Azure support case for Azure Virtual Desktop.