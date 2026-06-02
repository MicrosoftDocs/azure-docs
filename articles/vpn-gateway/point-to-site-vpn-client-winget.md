---
title: 'Install P2S VPN clients - Using Winget'
titleSuffix: Azure VPN Gateway
description: Learn how to install the VPN client for VPN Gateway P2S configurations with WinGet/Windows Package Manager. This article applies to Windows Azure VPN client.
author: flapinski
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 03/26/2026
ms.author: flapinski
# Customer intent: As a Windows user configuring a VPN client, I want to install the Azure VPN client using WinGet, so that I can securely connect to my Azure virtual network.
---

# Install Azure VPN Client using Windows Package Manager (winget)
The Azure VPN Client is now available through **Windows Package Manager (winget)**, giving you a fast, command-line-friendly way to install and update the client directly from your terminal. This is especially useful in environments where organizational policy restricts access to the Microsoft Store. 

Windows Package Manager (`winget`) is a built-in command-line tool for Windows that lets you discover, install, and update applications. The Azure VPN Client package on winget provides a self-contained installer. No Microsoft Store access or authentication is required. 

## Supported Platforms

| Operating System                  | Supported | 
|-----------------------------------|-----------| 
| Windows 11 (21H2 and later)       | ✅        | 
| Windows Server 2025               | ✅        | 

See more on Azure VPN Client supported windows settings [here](azure-vpn-client-versions.md).

## Prerequisites 
 - **Windows Package Manager (winget)** must be available on your system. Learn more about installation [here](https://learn.microsoft.com/windows/package-manager/winget/).
- An active internet connection is required to download the package. 
- Administrator rights are **not** required to install or connect. 

## How to Install 
Open a terminal (PowerShell, Command Prompt, or Windows Terminal) and run: 
``` 

winget install "Azure VPN Client" --source winget 
``` 

 
## How to Update 
When a newer version of the Azure VPN Client is available, you may see an in-app notification prompting you to update. To apply the update, run: 

``` 

winget upgrade "Azure VPN Client" 

``` 

To check for all available updates on your system: 

``` 

winget upgrade 

``` 

## How to Uninstall 
To remove the Azure VPN Client, run: 
 
``` 
winget uninstall "Azure VPN Client" 

``` 
 

## Limitations and Known Considerations 
- **Update notifications:** The in-app update prompt notifies you that a new version is available, but the update itself must be applied by running the `winget upgrade` command. Auto-update on launch isn't currently supported through this channel. 

- **No GUI installer:** This method uses the command line. Users who prefer a graphical click-to-install experience should use the [Microsoft Store listing](https://apps.microsoft.com/detail/9NP355QT2SQB) or the [Download Center](https://aka.ms/azvpnclientdownload) where available. 

- **Platform restrictions:** Only Windows 11 and Windows Server 2025 or later are supported.
--- 

 

## Alternative Installation Methods 
| Method             | Best For                                      | 
|--------------------|-----------------------------------------------| 
| **Microsoft Store** | Users with Store access who prefer GUI install | 
| **winget (CLI)**    | Scripted/automated deployments, Store-blocked environments | 
| **Download Center** | Direct download via browser (see link below)  | 

> [!NOTE]
> The Azure VPN Client may be released to winget and Download Center on a staggered schedule compared to the Microsoft Store.

For the direct download option, visit: [https://aka.ms/azvpnclientdownload](https://aka.ms/azvpnclientdownload) 

--- 

## Learn More
- [Azure VPN Client documentation](point-to-site-about.md) 
- [Configure Azure VPN Client — Point-to-Site connections](point-to-site-vpn-client-certificate-windows-azure-vpn-client.md) 
- [Windows Package Manager (winget) documentation](https://learn.microsoft.com/windows/package-manager/winget/) 
- [winget install command reference](https://learn.microsoft.com/windows/package-manager/winget/install) 

--- 

 