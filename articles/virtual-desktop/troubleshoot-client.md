---
title: Troubleshoot Remote Desktop client Azure Virtual Desktop - Azure
description: How to resolve issues with the Remote Desktop client when connecting to Azure Virtual Desktop.
author: Heidilohr
ms.topic: troubleshooting
ms.date: 09/20/2022
ms.author: helohr
manager: femila
---
# Troubleshoot the Remote Desktop client

This article describes common issues with the Remote Desktop client and how to fix them.

## All clients

In this section you'll find troubleshooting guidance for all Remote Desktop clients.

### Remote Desktop Client doesn't show my resources

First, check the Azure Active Directory account you're using. If you've already signed in with a different Azure Active Directory account than the one you want to use for Azure Virtual Desktop, you should either sign out or use a private browser window.

If you're using Azure Virtual Desktop (classic), use the web client link in [this article](./virtual-desktop-fall-2019/connect-web-2019.md) to connect to your resources.

If that doesn't work, make sure your app group is associated with a workspace.

## Windows client

In this section you'll find troubleshooting guidance for the Remote Desktop client for Windows.

### Access client logs

You might need the client logs when investigating an issue.

To retrieve the client logs:

1. Ensure no sessions are active and the client process isn't running in the background by right-clicking on the **Remote Desktop** icon in the system tray and selecting **Disconnect all sessions**.
1. Open **File Explorer**.
1. Navigate to the **%temp%\DiagOutputDir\RdClientAutoTrace** folder.

Below you will find different methods used to read the client logs.

#### Event Viewer

1. Navigate to the Start menu, Control Panel, System and Security, and select **view event logs** under "Windows Tools".
1. Once the **Event Viewer** is open, click the Action tab at the top and select **Open Saved Log...**.
1. Navigate to the **%temp%\DiagOutputDir\RdClientAutoTrace** folder and select the log file you want to view.
1. The **Event Viewer** dialog box will open requesting a response to which it will convert etl format to evtx format. Select **Yes**.
1. In the **Open Saved Log** dialog box, you have the options to rename the log file and add a description. Select **Ok**.
1. The **Event Viewer** dialog box will open asking to overwrite the log file. Select **Yes**. This will not overwrite your original etl log file but create a copy in evtx format.

#### Command-line

This method will enable you to convert the log file from etl format to either _csv_ or _xml_ format using the `tracerpt` command. Open the Command Prompt or PowerShell and run the following:

```
tracerpt "<FilePath>.etl" -o "<OutputFilePath>.extension"
```

**CSV example:**

```
tracerpt "C:\Users\admin\AppData\Local\Temp\DiagOutputDir\RdClientAutoTrace\msrdcw_09-07-2022-15-48-44.etl" -o "C:\Users\admin\Desktop\LogFile.csv" -of csv
```

If the `-of csv` parameter is omitted from the command above, it won't properly convert the file.

**XML example:**

```
tracerpt "C:\Users\admin\AppData\Local\Temp\DiagOutputDir\RdClientAutoTrace\msrdcw_09-07-2022-15-48-44.etl" -o "C:\Users\admin\Desktop\LogFile.xml"
```

The `-of xml` parameter is not necessary in this instance as the default output for the conversion is in _xml_ format.

### Remote Desktop client for Windows stops responding or cannot be opened

If the Remote Desktop client for Windows stops responding or cannot be opened, you may need to reset your client. Starting with version 1.2.790, you can reset the user data from the About page or using a command.

You can also use the following command to remove your user data, restore default settings and unsubscribe from all Workspaces. From a Command Prompt or PowerShell session, run the following command:

```cmd
msrdcw.exe /reset [/f]
```

If you're using an earlier version of the Remote Desktop client, we recommend you uninstall and reinstall the client.

### Authentication issues while using an N SKU

Authentication issues can happen because you're using an *N* SKU of Windows without the media features pack. To resolve this issue, [install the media features pack](https://support.microsoft.com/topic/media-feature-pack-list-for-windows-n-editions-c1c6fffa-d052-8338-7a79-a4bb980a700a).

### Authentication issues when TLS 1.2 not enabled

Authentication issues can happen when your client doesn't have TLS 1.2 enabled. This is most likely with Windows 7 where TLS 1.2 is not enabled by default. To enable TLS 1.2 on Windows 7, you need to set the following registry values:

- `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Client`
  - "DisabledByDefault": **00000000**
  - "Enabled": **00000001**
- `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server`
  - "DisabledByDefault": **00000000**
  - "Enabled": **00000001**
- `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\.NETFramework\v4.0.30319`
  - "SchUseStrongCrypto": **00000001**

You can configure these registry values by running the following commands from an elevated PowerShell session:

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

### Windows client blocks Azure Virtual Desktop (classic) feed

If the Windows client feed won't show Azure Virtual Desktop (classic) apps, follow these instructions as an admin of Azure Virtual Desktop in Azure:

1. Check if the Conditional Access policy includes the app IDs associated with Azure Virtual Desktop (classic).
2. Check if the Conditional Access policy blocks all access except Azure Virtual Desktop (classic) app IDs. If so, you'll need to add the app ID.**9cdead84-a844-4324-93f2-b2e6bb768d07** to the policy to allow the client to discover the feeds.

If you can't find the app ID 9cdead84-a844-4324-93f2-b2e6bb768d07 in the list, you'll need to re-register the Azure Virtual Desktop resource provider. To re-register the resource provider:

1. Sign in to the Azure portal.
2. Go to **Subscription**, then select your subscription.
3. In the menu on the left side of the page, select **Resource provider**.
4. Find and select **Microsoft.DesktopVirtualization**, then select **Re-register**.

## Web client

In this section you'll find troubleshooting guidance for the Remote Desktop Web client.

### Web client stops responding or disconnects

Try connecting using another browser or client.

### Web client won't open

First, test your internet connection by opening another website in your browser, for example [www.bing.com](https://www.bing.com).

Next, open a Command Prompt or PowerShell session and use **nslookup** to confirm DNS can resolve the FQDN by running the following command:

```cmd
nslookup rdweb.wvd.microsoft.com
```

If one or neither of these work, you most likely have a problem with your network connection. We recommend you contact your network admin for help.

### Your client can't connect but other clients on your network can connect

If your browser starts acting up or stops working while you're using the web client, try these actions to resolve it:

1. Restart the browser.
2. Clear browser cookies. See [How to delete cookie files in Internet Explorer](https://support.microsoft.com/help/278835/how-to-delete-cookie-files-in-internet-explorer).
3. Clear browser cache. See [clear browser cache for your browser](https://binged.it/2RKyfdU).
4. Open browser InPrivate mode.

If issues continue even after you've switched browsers, the problem may not be with your browser, but with your network. We recommend you contact your network admin for help.

### Web client keeps prompting for credentials

If the Web client keeps prompting for credentials, follow these instructions:

1. Confirm the web client URL is correct.
2. Confirm that the credentials you're using are for the Azure Virtual Desktop environment tied to the URL.
3. Clear browser cookies. For more information, see [How to delete cookie files in Internet Explorer](https://support.microsoft.com/help/278835/how-to-delete-cookie-files-in-internet-explorer).
4. Clear browser cache. For more information, see [Clear browser cache for your browser](https://binged.it/2RKyfdU).
5. Open your browser in Private mode.

### Web client out of memory

When using the web client, if you see the error message "Oops, we couldn't connect to 'SessionDesktop,'" (where *SessionDesktop* is the name of the resource you're connecting to), then the web client has run out of memory.

To resolve this issue, you'll need to either reduce the size of the browser window or disconnect all existing connections and try connecting again. If you still encounter this issue after doing these things, ask your local admin or tech support for help.

## Next steps

- For an overview on troubleshooting Azure Virtual Desktop and the escalation tracks, see [Troubleshooting overview, feedback, and support](troubleshoot-set-up-overview.md).
- To troubleshoot issues while creating an Azure Virtual Desktop environment and host pool in an Azure Virtual Desktop environment, see [Environment and host pool creation](troubleshoot-set-up-issues.md).
- To troubleshoot issues while configuring a virtual machine (VM) in Azure Virtual Desktop, see [Session host virtual machine configuration](troubleshoot-vm-configuration.md).
- To troubleshoot issues related to the Azure Virtual Desktop agent or session connectivity, see [Troubleshoot common Azure Virtual Desktop Agent issues](troubleshoot-agent.md).
- To troubleshoot issues when using PowerShell with Azure Virtual Desktop, see [Azure Virtual Desktop PowerShell](troubleshoot-powershell.md).
- To go through a troubleshoot tutorial, see [Tutorial: Troubleshoot Resource Manager template deployments](../azure-resource-manager/templates/template-tutorial-troubleshoot.md).
