---
title: Azure Change Tracking and Inventory Overview by Using Azure Monitor Agent
description: Learn about the Change Tracking and Inventory feature by using the Azure Monitor Agent, which helps you identify software and Microsoft service changes in your environment.
#customer intent: As a customer, I want to evaluate the compatibility of Azure Change Tracking and Inventory with my existing infrastructure so that I can ensure seamless integration.
services: automation
ms.date: 12/03/2025
ms.topic: overview
ms.service: azure-change-tracking-inventory
ms.author: v-rochak2
author: RochakSingh-blr
---

# About Azure Change Tracking and Inventory

This article provides an overview of Azure Change Tracking and Inventory by using the Azure Monitor Agent (AMA). This article also includes the key features and benefits of the service.

## What is Change Tracking and Inventory

Change Tracking and Inventory enhances the auditing and governance for in-guest operations by monitoring changes and providing detailed inventory logs for servers across Azure, on-premises, and other cloud environments.

> [!IMPORTANT]
> We recommend that you use Change Tracking and Inventory with the Change Tracking extension version 2.20.0.0 or later.

### Change tracking

- Monitors changes, including modifications to files, registry keys, software installations, and Windows services or Linux daemons.</br>
- Provides detailed logs of what and when the changes were made so that you can quickly detect configuration drifts or unauthorized changes. </br>
Change tracking metadata gets ingested into the `ConfigurationChange` table in the connected Log Analytics workspace. For more information, see [ConfigurationChange](/azure/azure-monitor/reference/tables/configurationchange).

> [!NOTE]
> Change Tracking and Inventory data is logged for both system-level and user-level applications. System-level data is always logged, but user-level applications appear only when a user signs in to a machine. If the user signs out, those applications are marked as **Removed**.

### Inventory

- Collects and maintains an updated list of installed software, operating system details, and other server configurations in linked Log Analytics workspaces. </br>
- Helps create an overview of system assets, which is useful for compliance, audits, and proactive maintenance.</br>
- Ingests inventory metadata into the `ConfigurationData` table in the connected Log Analytics workspace. For more information, see [ConfigurationData](/azure/azure-monitor/reference/tables/configurationdata).

## Key benefits of Azure Change Tracking and Inventory

Here are the key benefits:

- **Compatibility with the unified monitoring agent**: Is compatible with the [AMA](/azure/azure-monitor/agents/agents-overview) that enhances security and reliability and facilitates multi-homing experience to store data.
- **Compatibility with tracking tool**: Is compatible with the Change Tracking extension deployed through the Azure Policy on the client's virtual machine (VM). You can switch to the AMA, and then the Change Tracking extension pushes the software, files, and registry to the AMA.
- **Multi-homing experience**: Provides standardization of management from one central workspace. You can [transition from Azure Monitor Logs to the AMA](/azure/azure-monitor/agents/azure-monitor-agent-migration) so that all VMs point to a single workspace for data collection and maintenance.
- **Rules management**: Uses [data collection rules](/azure/azure-monitor/essentials/data-collection-rule-overview) to configure or customize various aspects of data collection. For example, you can change the frequency of file collection.

For information on supported operating systems, see [Support matrix and regions](../azure-change-tracking-inventory/change-tracking-inventory-support-matrix.md) for Change Tracking and Inventory.

## Enable Azure Change Tracking and Inventory

You can enable Change Tracking and Inventory in the following ways:

- **Azure Arc-enabled servers (non-Azure machines)**: In the Azure portal, on the **Change Tracking and Inventory Center | Machines** pane, select **Policy** > **Definition Type** > **Category** > **Change Tracking and Inventory**. Under **Initiative**, select **Enable Change Tracking and Inventory for Arc-enabled virtual machines**. To enable Change Tracking and Inventory at scale, use the deploy-if-not-exists (DINE) policy-based solution. For more information, see [Quickstart: Enable Azure Change Tracking and Inventory](quickstart-monitor-changes-collect-inventory-azure-change-tracking-inventory.md).
- **Single Azure VM**: In the Azure portal, select the VM from the [Virtual machines pane](quickstart-monitor-changes-collect-inventory-azure-change-tracking-inventory.md). This scenario is available for Linux and Windows VMs.
- [Single and multiple Azure VMs](quickstart-monitor-changes-collect-inventory-azure-change-tracking-inventory.md): In the Azure portal, select the VMs from the **Virtual machines** pane.

## Track file changes

For tracking changes in files on both Windows and Linux, Change Tracking and Inventory uses SHA256 hashes of the files. The feature uses the hashes to detect if changes were made since the last inventory.

## Track file content changes

With Change Tracking and Inventory, you can view the contents of a Windows or Linux file. For each change to a file, Change Tracking and Inventory stores the contents of the file in an [Azure Storage account](../storage/common/storage-account-create.md). When you track a file, you can view its contents before or after a change. You can view the file content either inline or side by side. For more information, see [Tutorial: Change a workspace and configure data collection rule](tutorial-change-workspace-configure-data-collection-rule.md).

![Screenshot of viewing changes in a Windows or Linux file.](./media/overview/view-file-changes.png)

## Track registry keys

Change Tracking and Inventory allows monitoring of changes to Windows registry keys. When you use monitoring, you can pinpoint extensibility points where non-Microsoft code and malware can activate. The following table lists preconfigured (but not enabled) registry keys. To track these keys, you must enable each one.

> [!div class="mx-tdBreakAll"]
> |Registry key | Purpose |
> | --- | --- |
> |`HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Group Policy\Scripts\Startup` | Monitors scripts that run at startup.
> |`HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Group Policy\Scripts\Shutdown` | Monitors scripts that run at shutdown.
> |`HKEY_LOCAL_MACHINE\SOFTWARE\Wow6432Node\Microsoft\Windows\CurrentVersion\Run` | Monitors keys that are loaded before the user signs in to the Windows account. The key is used for 32-bit applications running on 64-bit computers.
> |`HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Active Setup\Installed Components` | Monitors changes to application settings.
> |`HKEY_LOCAL_MACHINE\Software\Classes\Directory\ShellEx\ContextMenuHandlers` | Monitors context menu handlers that hook directly into Windows Explorer and usually run in-process with `explorer.exe`.
> |`HKEY_LOCAL_MACHINE\Software\Classes\Directory\Shellex\CopyHookHandlers` | Monitors copy hook handlers that hook directly into Windows Explorer and usually run in-process with `explorer.exe`.
> |`HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Explorer\ShellIconOverlayIdentifiers` | Monitors for icon overlay handler registration.
>|`HKEY_LOCAL_MACHINE\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Explorer\ShellIconOverlayIdentifiers` | Monitors for icon overlay handler registration for 32-bit applications running on 64-bit computers.
> |`HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Explorer\Browser Helper Objects` | Monitors for new browser helper object plugins for Internet Explorer. Used to access the Document Object Model (DOM) of the current pane and to control navigation.
> |`HKEY_LOCAL_MACHINE\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Explorer\Browser Helper Objects` | Monitors for new browser helper object plugins for Internet Explorer. Used to access the DOM of the current pane and to control navigation for 32-bit applications running on 64-bit computers.
> |`HKEY_LOCAL_MACHINE\Software\Microsoft\Internet Explorer\Extensions` | Monitors for new Internet Explorer extensions, such as custom tool menus and custom toolbar buttons.
> |`HKEY_LOCAL_MACHINE\Software\Wow6432Node\Microsoft\Internet Explorer\Extensions` | Monitors for new Internet Explorer extensions, such as custom tool menus and custom toolbar buttons for 32-bit applications running on 64-bit computers.
> |`HKEY_LOCAL_MACHINE\Software\Microsoft\Windows NT\CurrentVersion\Drivers32` | Monitors 32-bit drivers associated with wavemapper, wave1 and wave2, msacm.imaadpcm, .msadpcm, .msgsm610, and vidc. Similar to the `[drivers]` section in the `system.ini` file.
> |`HKEY_LOCAL_MACHINE\Software\Wow6432Node\Microsoft\Windows NT\CurrentVersion\Drivers32` | Monitors 32-bit drivers associated with wavemapper, wave1 and wave2, msacm.imaadpcm, .msadpcm, .msgsm610, and vidc for 32-bit applications running on 64-bit computers. Similar to the `[drivers]` section in the `system.ini` file.
> |`HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Session Manager\KnownDlls` | Monitors the list of known or commonly used system DLLs. Monitoring prevents people from exploiting weak application directory permissions by dropping in Trojan horse versions of system DLLs.
> |`HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon\Notify` | Monitors the list of packages that can receive event notifications from `winlogon.exe`, the interactive sign-in support model for Windows.

## Related content

- Review the [support matrix and regions](../azure-change-tracking-inventory/change-tracking-inventory-support-matrix.md) for Change Tracking and Inventory.
