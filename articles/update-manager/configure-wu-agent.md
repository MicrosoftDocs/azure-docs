---
title: Configure Windows Update settings in Azure Update Manager
description: This article tells how to configure Windows update settings to work with Azure Update Manager.
ms.service: azure-update-manager
ms.date: 02/27/2025
ms.topic: how-to
author: habibaum
ms.author: v-uhabiba
ms.custom: engagement-fy24
# Customer intent: As a system administrator, I want to configure Windows Update settings for Azure Update Manager, so that I can ensure all Windows servers are consistently updated with the latest patches and maintain compliance across the environment.
---

# Configure Windows update settings for Azure Update Manager

Azure Update Manager (AUM) uses the native Windows Update client to manage to patch. However, the behavior differs depending on whether the machine is an Azure VM or an Azure Arc-enabled server. This guide outlines how to configure update settings, what AUM modifies, and how to avoid conflicts with Group Policy.

##  Key Differences: Azure VMs vs. Arc Machines

|Feature|Azure VMs|Azure Arc Machines|
|----|----|----|
|Patch orchestration|Azure-orchestrated or OS-orchestrated|OS-orchestrated only|
|Registry changes by AUM|Yes (when Azure-orchestrated)|No (AUM doesn't modify registry)|
|Group Policy interaction|Can override AUM settings|Fully controls update behavior|
|WSUS support|Supported|Supported|
|Pre download support|Not supported|Not supported|

## What AUM Configures Automatically (Azure VMs Only)
When **Azure-orchestrated patching** is enabled on an Azure VM, AUM may configure the following registry keys:

### Registry Keys Modified by AUM

|Registry Path|Key|Purpose|
|----|----|----|
|HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU|AUOptions|Sets automatic update behavior|
|HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate\Auto Update|RebootRequired|Tracks reboot status|
|HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate\Services|ServiceID|Registers Microsoft Update service|

These changes are applied only when the VM is configured for Azure-orchestrated patching *(AutomaticByPlatform = Azure-Orchestrated)*. Arc machines aren't affected.

## Group Policy Conflicts

Group Policy can override or conflict with AUM settings. This is especially important for:

**Automatic Updates**: If Group Policy enforces a different *AUOptions* value, AUM might not be able to control update timing.
**Reboot Behavior**: Even if AUM is set to "Never Reboot" Group Policy or registry keys can still trigger reboots.
**Microsoft Update Source**: Group Policy might restrict updates to WSUS or block Microsoft Update, which can cause AUM deployments to fail.

### Best Practice

If you use Group Policy:

Ensure it aligns with AUM’s intended behavior.
Avoid setting conflicting values in Configure Automatic Updates or No auto-restart with logged on users.

## How to Enable Microsoft Updates

To receive updates for products like SQL Server or Office:

### For Azure VMs (Azure-orchestrated patching)

Run this PowerShell script:

```
$ServiceManager = (New-Object -com "Microsoft.Update.ServiceManager")
$ServiceID = "7971f918-a847-4430-9279-4a52d1efe18d"
$ServiceManager.AddService2($ServiceId,7,"")
```

### For Arc Machines or OS-orchestrated VMs

Use Group Policy:

1. Go to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Windows Update** > **Manage end user experience**
2. Open the **Configure Automatic Updates** setting
3. Set the option to **Enabled** and then select the box labeled **Install updates for other Microsoft products**

## WSUS Configuration

AUM supports WSUS. To configure:

- Use Group Policy to set the WSUS server location.
- Ensure updates are approved in WSUS, or AUM deployments fails.
- To restrict internet access, enable **Do not connect to any Windows Update Internet locations**.

## Verify Patch Source

Check these registry keys to confirm update source:

- HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\
- HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate\Services

## Not Supported

- Pre download of updates isn't supported by AUM.
- To change the patch source (for example, from WSUS to Microsoft Update), use Windows settings or Group Policy. Do not use AUM for this configuration.

## Next Steps
After configuring your update settings, proceed to [Deploy updates](deploy-updates.md) using Azure Update Manager.
