---
title: Configure Windows Update Settings in Azure Update Manager
description: This article describes how to configure Windows Update settings to work with Azure Update Manager.
ms.service: azure-update-manager
ms.date: 02/27/2025
ms.topic: how-to
author: habibaum
ms.author: v-uhabiba
ms.custom: engagement-fy24
# Customer intent: As a system administrator, I want to configure Windows Update settings for Azure Update Manager so that I can keep all Windows servers consistently updated with the latest patches and maintain compliance across the environment.
---

# Configure Windows Update settings for Azure Update Manager

Azure Update Manager uses the native Windows Update client to manage patching. However, the behavior differs depending on whether the machine is an Azure virtual machine (VM) or an Azure Arc-enabled server. This guide outlines how to configure update settings, what Update Manager modifies, and how to avoid conflicts with Group Policy.

## Key differences: Azure VMs vs. Azure Arc-enabled machines

|Feature|Azure VMs|Azure Arc-enabled machines|
|----|----|----|
|Patch orchestration|Azure orchestrated or OS orchestrated|OS orchestrated only|
|Registry changes by Update Manager|Yes (when Azure orchestrated)|No (Update Manager doesn't modify the registry)|
|Group Policy interaction|Can override Update Manager settings|Fully controls update behavior|
|Windows Server Update Services (WSUS) support|Supported|Supported|
|Pre-download support|Not supported|Not supported|

## What Update Manager configures automatically (Azure VMs only)

When Azure-orchestrated patching is enabled on an Azure VM, Update Manager might configure the following registry keys:

|Registry path|Key|Purpose|
|----|----|----|
|`HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU`|`AUOptions`|Sets automatic update behavior|
|`HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate\Auto Update`|`RebootRequired`|Tracks reboot status|
|`HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate\Services`|`ServiceID`|Registers the Microsoft Update service|

These changes are applied only when the VM is configured for Azure-orchestrated patching (`AutomaticByPlatform = Azure-Orchestrated`). Azure Arc-enabled machines aren't affected.

## Group Policy conflicts

Group Policy can override or conflict with Update Manager settings. This behavior is especially important for:

- **Automatic updates**: If Group Policy enforces a different `AUOptions` value, Update Manager might not be able to control update timing.
- **Reboot behavior**: Even if Update Manager is set to **Never Reboot**, Group Policy or registry keys can still trigger reboots.
- **Microsoft Update source**: Group Policy might restrict updates to WSUS or block Microsoft Update, which can cause Update Manager deployments to fail.

If you use Group Policy, a best practice is to ensure that it aligns with the intended behavior of Update Manager. Avoid setting conflicting values in **Configure Automatic Updates** or **No auto-restart with logged on users**.

## How to enable Microsoft Update

To receive updates for products like SQL Server or Office, use the following instructions.

### Azure VMs (Azure-orchestrated patching)

Run this PowerShell script:

```
$ServiceManager = (New-Object -com "Microsoft.Update.ServiceManager")
$ServiceID = "7971f918-a847-4430-9279-4a52d1efe18d"
$ServiceManager.AddService2($ServiceId,7,"")
```

### Azure Arc-enabled machines or OS-orchestrated VMs

Use Group Policy:

1. Go to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Windows Update** > **Manage end user experience**.

2. Open the **Configure Automatic Updates** setting.

3. Set the option to **Enabled**, and then select the **Install updates for other Microsoft products** checkbox.

## WSUS configuration

Update Manager supports WSUS. To configure it:

- Use Group Policy to set the WSUS server location.
- Ensure that updates are approved in WSUS, to prevent the failure of Update Manager deployments.
- To restrict internet access, enable **Do not connect to any Windows Update Internet locations**.

## Verification of the patch source

Check these registry keys to confirm the update source:

- `HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\`
- `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate\Services`

## Not supported

- Update Manager doesn't support the pre-download of updates.
- To change the patch source (for example, from WSUS to Microsoft Update), use Windows settings or Group Policy. Don't use Update Manager for this configuration.

## Related content

- After you configure your update settings, proceed to [deploy updates](deploy-updates.md) by using Update Manager.
