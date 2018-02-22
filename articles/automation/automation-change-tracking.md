---
title: Track changes with Azure Automation | Microsoft Docs
description: The Change Tracking solution helps you identify software and Windows Service changes that occur in your environment.
services: automation
documentationcenter: ''
author: georgewallace
manager: carmonm
editor: ''
ms.assetid: f8040d5d-3c89-4f0c-8520-751c00251cb7
ms.service: automation
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/21/2018
ms.author: gwallace
ms.custom: H1Hack27Feb2017

---
# Track software changes in your environment with the Change Tracking solution

This article helps you use the Change Tracking solution to easily identify changes in your environment. The solution tracks changes to Windows and Linux software, Windows files and registry keys, Windows services, and Linux daemons. Identifying configuration changes can help you pinpoint operational issues.

You install the solution to update the type of agent that you have installed. Changes to installed software, Windows services, and Linux daemons on the monitored servers are read. Then, the data is sent to the Log Analytics service in the cloud for processing. Logic is applied to the received data and the cloud service records the data. By using the information on the Change Tracking dashboard, you can easily see the changes that were made in your server infrastructure.

## Enable Change tracking

First you need to enable Change tracking and Inventory for your VM for this tutorial. If you have previously enabled another automation solution for a VM, this step is not necessary.

1. On the left menu, select **Virtual machines** and select a VM from the list
1. On the left menu, under the **OPERATIONS** section, click **Inventory**. The **Change tracking** page opens.

![Enable change](./media/automation-tutorial-troubleshoot-changes/enableinventory.png)
The **Change Tracking** screen opens. Configure the location, Log analytics workspace, and Automation account to use and click **Enable**. If the fields are grayed out, that means another automation solution is enabled for the VM and the same workspace and Automation account must be used.
    A status bar notifies you that the solution is being enabled. This process can take up to 15 minutes.

### Configure Linux files to track
Use the following steps to configure files to track on Linux computers.

1. In your Automation Account, select **Change tracking** under **CONFIGURATION MANAGEMENT**. Click **Edit Settings** (the gear symbol).
2. On the **Change Tracking** page, select **Linux Files**, then click **+ Add** to add a new file to track.
3. On the **Add Linux File for Change Tracking**, enter the information for the file or directory to track and click **Save**

|Property  |Description  |
|---------|---------|
|Enabled     | Determines if the setting is applied        |
|Item Name     | Friendly name of the file to be tracked        |
|Group     | A group name for logically grouping files        |
|Enter Path     | The path to check for the file For example: "/etc/*.conf"       |
|Path Type     | Type of item to be tracked, possible values are File and Directory        |
|Recursion     | Determines if recursion is used when looking for the item to be tracked.        |
|Use Sudo     | This setting determines if sudo is used when checking for the item.         |
|Links     | This setting determines how symbolic links dealt with when traversing directories.<br> **Ignore** - Ignores symbolic links and does not include the files/directories referenced<br>**Follow** - Follows the symbolic links during recursion and also includes the files/directories referenced<br>**Manage** - Follows the symbolic links and allows alter the treatment of returned content      |

   > [!NOTE]   
   > The "Manage" links option is not recommended. File content retrieval is not supported.

### Configure Windows files to track
Use the following steps to configure files to track on Windows computers.

1. In your Automation Account, select **Change tracking** under **CONFIGURATION MANAGEMENT**. Click **Edit Settings** (the gear symbol).
2. On the **Change Tracking** page, select **Windows Files**, then click **+ Add** to add a new file to track.
3. On the **Add Windows File for Change Tracking**, enter the information for the file or directory to track and click **Save**

|Property  |Description  |
|---------|---------|
|Enabled     | Determines if the setting is applied        |
|Item Name     | Friendly name of the file to be tracked        |
|Group     | A group name for logically grouping files        |
|Enter Path     | The path to check for the file For example: "c:\temp\myfile.txt"       |

### Configure Windows registry keys to track
Use the following steps to configure registry keys to track on Windows computers.

1. In your Automation Account, select **Change tracking** under **CONFIGURATION MANAGEMENT**. Click **Edit Settings** (the gear symbol).
2. On the **Change Tracking** page, select **Windows Registry**, then click **+ Add** to add a new registry key to track.
3. On the **Add Windows Registry for Change Tracking**, enter the information for the key to track and click **Save**

|Property  |Description  |
|---------|---------|
|Enabled     | Determines if the setting is applied        |
|Item Name     | Friendly name of the file to be tracked        |
|Group     | A group name for logically grouping files        |
|Windows Registry Key   | The path to check for the file For example: "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders\Common Startup"      |

## Limitations

The Change Tracking solution does not currently support the following items:

* Folders (directories) for Windows File Tracking
* Recursion for Windows File Tracking
* Wild cards for Windows File Tracking
* Path variables
* Network file systems
* File Content

Other limitations:

* The **Max File Size** column and values are unused in the current implementation.
* If you collect more than 2500 files in the 30-minute collection cycle, solution performance might be degraded.
* When network traffic is high, change records may take up to a maximum of six hours to display.
* If you modify the configuration while a computer is shut down, the computer might post file changes that belonged to the previous configuration.

## Known Issues

The Change Tracking solution is currently experiencing the following issues:
* Hotfix updates are not collected for Windows 10 Creators Update and Windows Server 2016 Core RS3 machines.

## Change Tracking data collection details
Change Tracking collects software inventory and Windows Service metadata using the agents that you have enabled.

The following table shows data collection methods and other details about how data is collected for Change Tracking.

| Platform | Direct Agent | Operations Manager agent | Linux agent | Azure Storage | Operations Manager required? | Operations Manager agent data sent via management group | Collection frequency |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Windows and Linux | &#8226; | &#8226; | &#8226; |  |  | &#8226; | 5 minutes to 50 minutes, depending on the change type. For more information, view the following table. |


The following table shows the data collection frequency for the types of changes.

| **Change type** | **frequency** | **Does**  **agent**  **send differences when found?** |
| --- | --- | --- |
| Windows registry | 50 minutes | No |
| Windows file | 30 minutes | Yes. If there is no change in 24 hours, a snapshot is sent. |
| Linux file | 15 minutes | Yes. If there is no change in 24 hours, a snapshot is sent. |
| Windows services | 30 minutes | Yes, every 30 minutes when changes are found. Every 24 hours a snapshot is sent, regardless of change. So, the snapshot is sent even where there are no changes. |
| Linux daemons | 5 minutes | Yes. If there is no change in 24 hours, a snapshot is sent. |
| Windows software | 30 minutes | Yes, every 30 minutes when changes are found. Every 24 hours a snapshot is sent, regardless of change. So, the snapshot is sent even where there are no changes. |
| Linux software | 5 minutes | Yes. If there is no change in 24 hours, a snapshot is sent. |

### Registry key change tracking

The purpose of monitoring changes to registry keys is to pinpoint extensibility points where third-party code and malware can activate. The following list shows the default registry keys that are tracked by the solution and why each is tracked.

- HKEY\_LOCAL\_MACHINE\Software\Microsoft\Windows\CurrentVersion\Group Policy\Scripts\Startup
    - Monitors scripts that run at startup.
- HKEY\_LOCAL\_MACHINE\Software\Microsoft\Windows\CurrentVersion\Group Policy\Scripts\Shutdown
    - Monitors scripts that run at shutdown.
- HKEY\_LOCAL\_MACHINE\SOFTWARE\Wow6432Node\Microsoft\Windows\CurrentVersion\Run
    - Monitors keys that are loaded before the user signs in to their Windows account. The key is used for 32-bit programs running on 64-bit computers.
- HKEY\_LOCAL\_MACHINE\SOFTWARE\Microsoft\Active Setup\Installed Components
    - Monitors changes to application settings.
- HKEY\_LOCAL\_MACHINE\Software\Classes\Directory\ShellEx\ContextMenuHandlers
    - Monitors common autostart entries that hook directly into Windows Explorer and usually run in-process with Explorer.exe.
- HKEY\_LOCAL\_MACHINE\Software\Classes\Directory\Shellex\CopyHookHandlers
    - Monitors common autostart entries that hook directly into Windows Explorer and usually run in-process with Explorer.exe.
- HKEY\_LOCAL\_MACHINE\Software\Classes\Directory\Background\ShellEx\ContextMenuHandlers
    - Monitors common autostart entries that hook directly into Windows Explorer and usually run in-process with Explorer.exe.
- HKEY\_LOCAL\_MACHINE\Software\Microsoft\Windows\CurrentVersion\Explorer\ShellIconOverlayIdentifiers
    - Monitors for icon overlay handler registration.
- HKEY\_LOCAL\_MACHINE\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Explorer\ShellIconOverlayIdentifiers
    - Monitors for icon overlay handler registration for 32-bit programs running on 64-bit computers.
- HKEY\_LOCAL\_MACHINE\Software\Microsoft\Windows\CurrentVersion\Explorer\Browser Helper Objects
    - Monitors for new browser helper object plugins for Internet Explorer. Used to access the Document Object Model (DOM) of the current page and to control navigation.
- HKEY\_LOCAL\_MACHINE\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Explorer\Browser Helper Objects
    - Monitors for new browser helper object plugins for Internet Explorer. Used to access the Document Object Model (DOM) of the current page and to control navigation for 32-bit programs running on 64-bit computers.
- HKEY\_LOCAL\_MACHINE\Software\Microsoft\Internet Explorer\Extensions
    - Monitors for new Internet Explorer extensions, such as custom tool menus and custom toolbar buttons.
- HKEY\_LOCAL\_MACHINE\Software\Wow6432Node\Microsoft\Internet Explorer\Extensions
    - Monitors for new Internet Explorer extensions, such as custom tool menus and custom toolbar buttons for 32-bit programs running on 64-bit computers.
- HKEY\_LOCAL\_MACHINE\Software\Microsoft\Windows NT\CurrentVersion\Drivers32
    - Monitors the 32-bit drivers associated with wavemapper, wave1 and wave2, msacm.imaadpcm, .msadpcm, .msgsm610, and vidc. Similar to the [drivers] section in the SYSTEM.INI file.
- HKEY\_LOCAL\_MACHINE\Software\Wow6432Node\Microsoft\Windows NT\CurrentVersion\Drivers32
    - Monitors the 32-bit drivers associated with wavemapper, wave1 and wave2, msacm.imaadpcm, .msadpcm, .msgsm610, and vidc for 32-bit programs running on 64-bit computers. Similar to the [drivers] section in the SYSTEM.INI file.
- HKEY\_LOCAL\_MACHINE\System\CurrentControlSet\Control\Session Manager\KnownDlls
    - Monitors the list of known or commonly used system DLLs; this system prevents people from exploiting weak application directory permissions by dropping in Trojan horse versions of system DLLs.
- HKEY\_LOCAL\_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon\Notify
    - Monitors the list of packages able to receive event notifications from Winlogon, the interactive logon support model for the Windows operating system.

## Use Change Tracking

After the solution is installed, you can view the summary of changes for your monitored computers by selecting **Change Tracking** under **CONFIGURATION MANAGEMENT** in your Automation account.

You can view changes to your computers and then drill-into details for each event.

![image of Change Tracking dashboard](./media/automation-change-tracking/change-tracking-dash01.png)

## Next steps
* Use [Log searches in Log Analytics](../log-analytics/log-analytics-log-searches.md) to view detailed change tracking data.
