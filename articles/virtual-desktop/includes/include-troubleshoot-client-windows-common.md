---
author: dknappettmsft
ms.author: daknappe
ms.topic: include
ms.date: 04/11/2023
---

### Retrieve and open client logs

You might need the client logs when investigating a problem.

To retrieve the client logs:

1. Ensure no sessions are active and the client process isn't running in the background by right-clicking on the **Remote Desktop** icon in the system tray and selecting **Disconnect all sessions**.
1. Open **File Explorer**.
1. Navigate to the **%temp%\DiagOutputDir\RdClientAutoTrace** folder.

The logs are in the .ETL file format. You can convert these to .CSV or .XML to make them easily readable by using the `tracerpt` command. Find the name of the file you want to convert and make a note of it.

- To convert the .ETL file to .CSV, open PowerShell and run the following, replacing the value for `$filename` with the name of the file you want to convert (without the extension) and `$outputFolder` with the directory in which to create the .CSV file.

   ```powershell
   $filename = "<filename>"
   $outputFolder = "C:\Temp"
   cd $env:TEMP\DiagOutputDir\RdClientAutoTrace
   tracerpt "$filename.etl" -o "$outputFolder\$filename.csv" -of csv
   ```

- To convert the .ETL file to .XML, open Command Prompt or PowerShell and run the following, replacing `<filename>` with the name of the file you want to convert and `$outputFolder` with the directory in which to create the .XML file.

   ```powershell
   $filename = "<filename>"
   $outputFolder = "C:\Temp"
   cd $env:TEMP\DiagOutputDir\RdClientAutoTrace
   tracerpt "$filename.etl" -o "$outputFolder\$filename.xml"
   ```

### Client stops responding or can't be opened

If the Remote Desktop client for Windows or Azure Virtual Desktop Store app for Windows stops responding or can't be opened, you may need to reset user data. If you can open the client, you can reset user data from the **About** menu, or if you can't open the client, you can reset user data from the command line. The default settings for the client will be restored and you'll be unsubscribed from all workspaces.

To reset user data from the client:

1. Open the **Remote Desktop** app on your device.

1. Select the three dots at the top right-hand corner to show the menu, then select **About**.

1. In the section **Reset user data**, select **Reset**. To confirm you want to reset your user data, select **Continue**. 

To reset user data from the command line:

1. Open PowerShell.

1. Change the directory to where the Remote Desktop client is installed, by default this is `C:\Program Files\Remote Desktop`.

1. Run the following command to reset user data. You'll be prompted to confirm you want to reset your user data.

   ```powershell
   .\msrdcw.exe /reset
   ```

   You can also add the `/f` option, where your user data will be reset without confirmation:

   ```powershell
   .\msrdcw.exe /reset /f
   ```

### Your administrator may have ended your session

You see the error message **Your administrator may have ended your session. Try connecting again. If this does not work, ask your administrator or technical support for help**, when the policy setting **Allow users to connect remotely using Remote Desktop Services** has been set to disabled.

To configure the policy to enable users to connect again depending on whether your session hosts are managed with Group Policy or Intune.

For Group Policy:

1. Open the **Group Policy Management Console** (GPMC) for session hosts managed with Active Directory or the **Local Group Policy Editor console** and edit the policy that targets your session hosts.

1. Browse to **Computer Configuration > Administrative Templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Connections**

1. Set the policy setting **Allow users to connect remotely using Remote Desktop Services** to **Enabled**.

For Intune:

1. Open the **Settings catalog**.

1. Browse to **Computer Configuration > Administrative Templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Connections**

1. Set the policy setting **Allow users to connect remotely using Remote Desktop Services** to **Enabled**.

## Authentication and identity

In this section you'll find troubleshooting guidance for authentication and identity issues with the Remote Desktop client.

[!INCLUDE [troubleshoot-aadj-connections-windows](include-troubleshoot-azure-ad-joined-connections-windows.md)]

### Authentication issues while using an N SKU of Windows

Authentication issues can happen because you're using an *N* SKU of Windows on your local device without the *Media Feature Pack*. For more information and to learn how to install the Media Feature Pack, see [Media Feature Pack list for Windows N editions](https://support.microsoft.com/topic/media-feature-pack-list-for-windows-n-editions-c1c6fffa-d052-8338-7a79-a4bb980a700a).

### Authentication issues when TLS 1.2 not enabled

Authentication issues can happen when your local Windows device doesn't have TLS 1.2 enabled. To enable TLS 1.2, you need to set the following registry values:

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
