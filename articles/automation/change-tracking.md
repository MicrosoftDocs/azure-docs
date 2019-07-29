---
title: Track changes with Azure Automation
description: The Change Tracking solution helps you identify software and Windows Service changes that occur in your environment.
services: automation
ms.service: automation
ms.subservice: change-inventory-management
author: bobbytreed
ms.author: robreed
ms.date: 04/29/2019
ms.topic: conceptual
manager: carmonm
ms.custom: H1Hack27Feb2017
---
# Track changes in your environment with the Change Tracking solution

This article helps you use the Change Tracking solution to easily identify changes in your environment. The solution tracks changes to Windows and Linux software, Windows and Linux files, Windows registry keys, Windows services, and Linux daemons. Identifying configuration changes can help you pinpoint operational issues.

Changes to installed software, Windows services, Windows registry and files, and Linux daemons on the monitored servers are sent to the Azure Monitor service in the cloud for processing. Logic is applied to the received data and the cloud service records the data. By using the information on the Change Tracking dashboard, you can easily see the changes that were made in your server infrastructure.

> [!NOTE]
> Azure Automation Change Tracking tracks changes in virtual machines. To track Azure Resource
> Manager property changes, see Azure Resource Graph's [Change history](../governance/resource-graph/how-to/get-resource-changes.md).

## Supported Windows operating systems

The following versions of the Windows operating system are officially supported for the Windows agent:

* Windows Server 2008 R2 or later

## Supported Linux operating systems

The following Linux distributions are officially supported. However, the Linux agent might also run on other distributions not listed. Unless otherwise noted, all minor releases are supported for each major version listed.  

### 64-bit

* CentOS 6 and 7
* Amazon Linux 2017.09
* Oracle Linux 6 and 7
* Red Hat Enterprise Linux Server 6 and 7
* Debian GNU/Linux 8 and 9
* Ubuntu Linux 14.04 LTS, 16.04 LTS, and 18.04 LTS
* SUSE Linux Enterprise Server 12

### 32-bit

* CentOS 6
* Oracle Linux 6
* Red Hat Enterprise Linux Server 6
* Debian GNU/Linux 8 and 9
* Ubuntu Linux 14.04 LTS and 16.04 LTS

## <a name="onboard"></a>Enable Change Tracking and Inventory

To begin tracking changes, you need to enable the Change Tracking and Inventory solution. There are many ways to onboard machines to Change Tracking and Inventory. The following are the recommended and supported ways to onboard the solution.

* [From a virtual machine](automation-onboard-solutions-from-vm.md)
* [From browsing multiple machines](automation-onboard-solutions-from-browse.md)
* [From your Automation account](automation-onboard-solutions-from-automation-account.md)
* [With an Azure Automation runbook](automation-onboard-solutions.md)

## Configuring Change Tracking and Inventory

To learn how to onboard computers to the solution visit: [Onboarding Automation solutions](automation-onboard-solutions-from-automation-account.md). Once you have a machine onboarding with the Change Tracking and Inventory solution, you can configure the items to track. When you enable a new file or registry key to track, it is enabled for both Change Tracking and Inventory.

For tracking changes in files on both Windows and Linux, MD5 hashes of the files are used. Theses hashes are then used to detect if a change has been made since the last inventory.

### Configure Linux files to track

Use the following steps to configure file tracking on Linux computers:

1. In your Automation Account, select **Change tracking** under **CONFIGURATION MANAGEMENT**. Click **Edit Settings** (the gear symbol).
2. On the **Change Tracking** page, select **Linux Files**, then click **+ Add** to add a new file to track.
3. On the **Add Linux File for Change Tracking**, enter the information for the file or directory to track and click **Save**.

|Property  |Description  |
|---------|---------|
|Enabled     | Determines if the setting is applied.        |
|Item Name     | Friendly name of the file to be tracked.        |
|Group     | A group name for logically grouping files.        |
|Enter Path     | The path to check for the file. For example: "/etc/*.conf"       |
|Path Type     | Type of item to be tracked, possible values are File and Directory.        |
|Recursion     | Determines if recursion is used when looking for the item to be tracked.        |
|Use Sudo     | This setting determines if sudo is used when checking for the item.         |
|Links     | This setting determines how symbolic links dealt with when traversing directories.<br> **Ignore** - Ignores symbolic links and doesn't include the files/directories referenced.<br>**Follow** - Follows the symbolic links during recursion and also includes the files/directories referenced.<br>**Manage** - Follows the symbolic links and allows altering of returned content.     |
|Upload file content for all settings| Turns on or off file content upload on tracked changes. Available options: **True** or **False**.|

> [!NOTE]
> The "Manage" links option is not recommended. File content retrieval is not supported.

### Configure Windows files to track

Use the following steps to configure files tracking on Windows computers:

1. In your Automation Account, select **Change tracking** under **CONFIGURATION MANAGEMENT**. Click **Edit Settings** (the gear symbol).
2. On the **Change Tracking** page, select **Windows Files**, then click **+ Add** to add a new file to track.
3. On the **Add Windows File for Change Tracking**, enter the information for the file to track and click **Save**.

|Property  |Description  |
|---------|---------|
|Enabled     | Determines if the setting is applied.        |
|Item Name     | Friendly name of the file to be tracked.        |
|Group     | A group name for logically grouping files.        |
|Enter Path     | The path to check for the file For example: "c:\temp\\\*.txt"<br>You can also use environment variables such as "%winDir%\System32\\\*.*"       |
|Recursion     | Determines if recursion is used when looking for the item to be tracked.        |
|Upload file content for all settings| Turns on or off file content upload on tracked changes. Available options: **True** or **False**.|

## Wildcard, recursion, and environment settings

Recursion allows you to specify wildcards to simplify tracking across directories, and environment variables to allow you to track files across environments with multiple or dynamic drive names. The following list shows common information you should know when configuring recursion:

* Wildcards are required for tracking multiple files
* If using wildcards, they can only be used in the last segment of a path. (such as `c:\folder\*file*` or `/etc/*.conf`)
* If an environment variable has an invalid path, validation will succeed but that path will fail when inventory runs.
* Avoid general paths such as `c:\*.*` when setting the path, as this would result in too many folders being traversed.

## Configure File Content tracking

You can view the contents before and after a change of a file with File Content Change Tracking. This is available for Windows and Linux files, for each change to the file, the contents of the file is stored in a storage account, and shows the file before and after the change, inline, or side by side. To learn more, see [View the contents of a tracked file](change-tracking-file-contents.md).

![view changes in a file](./media/change-tracking-file-contents/view-file-changes.png)

### Configure Windows registry keys to track

Use the following steps to configure registry key tracking on Windows computers:

1. In your Automation Account, select **Change tracking** under **CONFIGURATION MANAGEMENT**. Click **Edit Settings** (the gear symbol).
2. On the **Change Tracking** page, select **Windows Registry**, then click **+ Add** to add a new registry key to track.
3. On the **Add Windows Registry for Change Tracking**, enter the information for the key to track and click **Save**.

|Property  |Description  |
|---------|---------|
|Enabled     | Determines if the setting is applied.        |
|Item Name     | Friendly name of the registry key to be tracked.        |
|Group     | A group name for logically grouping registry keys.        |
|Windows Registry Key   | The path to check for the registry key. For example: "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders\Common Startup"      |

## Limitations

The Change Tracking solution doesn't currently support the following items:

* Recursion for Windows registry tracking
* Network file systems

Other limitations:

* The **Max File Size** column and values are unused in the current implementation.
* If you collect more than 2500 files in the 30-minute collection cycle, solution performance might be degraded.
* When network traffic is high, change records may take up to six hours to display.
* If you modify the configuration while a computer is shut down, the computer might post changes that belonged to the previous configuration.

## Known Issues

The Change Tracking solution is currently experiencing the following issues:

* Hotfix updates are not collected on Windows Server 2016 Core RS3 machines.
* Linux Daemons may show a changed state even though there was no change. This is due to how the `SvcRunLevels` field is captured.

## Change Tracking data collection details

The following table shows the data collection frequency for the types of changes. For every type the data snapshot of the current state is also refreshed at least every 24 hours:

| **Change type** | **Frequency** |
| --- | --- |
| Windows registry | 50 minutes |
| Windows file | 30 minutes |
| Linux file | 15 minutes |
| Windows services | 10 seconds to 30 minutes</br> Default: 30 minutes |
| Linux daemons | 5 minutes |
| Windows software | 30 minutes |
| Linux software | 5 minutes |

The following table shows the tracked item limits per machine for Change Tracking.

| **Resource** | **Limit**| **Notes** |
|---|---|---|
|File|500||
|Registry|250||
|Windows software|250|Doesn't include software updates|
|Linux packages|1250||
|Services|250||
|Daemon|250||

The average Log Analytics data usage for a machine using Change Tracking and Inventory is approximately 40MB per month. This value is only an approximation and is subject to change based on your environment. It's recommended that you monitor your environment to see the exact usage that you have.

### Windows service tracking

The default collection frequency for Windows services is 30 minutes. To configure the frequency, go to **Change Tracking**. Under **Edit Settings** on the **Windows Services** tab, there's a slider that allows you to change the collection frequency for Windows services from as quickly as 10 seconds to as long as 30 minutes. Move the slider bar to the frequency you want and it automatically saves it.

![Windows services slider](./media/change-tracking/windowservices.png)

The agent only tracks changes, this optimizes the performance of the agent. Setting a high threshold may miss changes if the service reverted to their original state. Setting the frequency to a smaller value allows you to catch changes that may be missed otherwise.

> [!NOTE]
> While the agent can track changes down to a 10 second interval, the data still takes a few minutes to be displayed in the portal. Changes during the time to display in the portal are still tracked and logged.
  
### Registry key change tracking

The purpose of monitoring changes to registry keys is to pinpoint extensibility points where third-party code and malware can activate. The following list shows the list of pre-configured registry keys. These keys are configured but not enabled. To track these registry keys, you must enable each one.

> [!div class="mx-tdBreakAll"]
> |  |
> |---------|
> |**HKEY\_LOCAL\_MACHINE\Software\Classes\Directory\ShellEx\ContextMenuHandlers**     |
|&nbsp;&nbsp;&nbsp;&nbsp;Monitors common autostart entries that hook directly into Windows Explorer and usually run in-process with Explorer.exe.    |
> |**HKEY\_LOCAL\_MACHINE\Software\Microsoft\Windows\CurrentVersion\Group Policy\Scripts\Startup**     |
|&nbsp;&nbsp;&nbsp;&nbsp;Monitors scripts that run at startup.     |
> |**HKEY\_LOCAL\_MACHINE\Software\Microsoft\Windows\CurrentVersion\Group Policy\Scripts\Shutdown**    |
|&nbsp;&nbsp;&nbsp;&nbsp;Monitors scripts that run at shutdown.     |
> |**HKEY\_LOCAL\_MACHINE\SOFTWARE\Wow6432Node\Microsoft\Windows\CurrentVersion\Run**     |
|&nbsp;&nbsp;&nbsp;&nbsp;Monitors keys that are loaded before the user signs in to their Windows account. The key is used for 32-bit programs running on 64-bit computers.    |
> |**HKEY\_LOCAL\_MACHINE\SOFTWARE\Microsoft\Active Setup\Installed Components**     |
|&nbsp;&nbsp;&nbsp;&nbsp;Monitors changes to application settings.     |
> |**HKEY\_LOCAL\_MACHINE\Software\Classes\Directory\ShellEx\ContextMenuHandlers**|
|&nbsp;&nbsp;&nbsp;&nbsp;Monitors common autostart entries that hook directly into Windows Explorer and usually run in-process with Explorer.exe.|
> |**HKEY\_LOCAL\_MACHINE\Software\Classes\Directory\Shellex\CopyHookHandlers**|
|&nbsp;&nbsp;&nbsp;&nbsp;Monitors common autostart entries that hook directly into Windows Explorer and usually run in-process with Explorer.exe.|
> |**HKEY\_LOCAL\_MACHINE\Software\Microsoft\Windows\CurrentVersion\Explorer\ShellIconOverlayIdentifiers**|
|&nbsp;&nbsp;&nbsp;&nbsp;Monitors for icon overlay handler registration.|
|**HKEY\_LOCAL\_MACHINE\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Explorer\ShellIconOverlayIdentifiers**|
|&nbsp;&nbsp;&nbsp;&nbsp;Monitors for icon overlay handler registration for 32-bit programs running on 64-bit computers.|
> |**HKEY\_LOCAL\_MACHINE\Software\Microsoft\Windows\CurrentVersion\Explorer\Browser Helper Objects**|
|&nbsp;&nbsp;&nbsp;&nbsp;Monitors for new browser helper object plugins for Internet Explorer. Used to access the Document Object Model (DOM) of the current page and to control navigation.|
> |**HKEY\_LOCAL\_MACHINE\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Explorer\Browser Helper Objects**|
|&nbsp;&nbsp;&nbsp;&nbsp;Monitors for new browser helper object plugins for Internet Explorer. Used to access the Document Object Model (DOM) of the current page and to control navigation for 32-bit programs running on 64-bit computers.|
> |**HKEY\_LOCAL\_MACHINE\Software\Microsoft\Internet Explorer\Extensions**|
|&nbsp;&nbsp;&nbsp;&nbsp;Monitors for new Internet Explorer extensions, such as custom tool menus and custom toolbar buttons.|
> |**HKEY\_LOCAL\_MACHINE\Software\Wow6432Node\Microsoft\Internet Explorer\Extensions**|
|&nbsp;&nbsp;&nbsp;&nbsp;Monitors for new Internet Explorer extensions, such as custom tool menus and custom toolbar buttons for 32-bit programs running on 64-bit computers.|
> |**HKEY\_LOCAL\_MACHINE\Software\Microsoft\Windows NT\CurrentVersion\Drivers32**|
|&nbsp;&nbsp;&nbsp;&nbsp;Monitors the 32-bit drivers associated with wavemapper, wave1 and wave2, msacm.imaadpcm, .msadpcm, .msgsm610, and vidc. Similar to the [drivers] section in the SYSTEM.INI file.|
> |**HKEY\_LOCAL\_MACHINE\Software\Wow6432Node\Microsoft\Windows NT\CurrentVersion\Drivers32**|
|&nbsp;&nbsp;&nbsp;&nbsp;Monitors the 32-bit drivers associated with wavemapper, wave1 and wave2, msacm.imaadpcm, .msadpcm, .msgsm610, and vidc for 32-bit programs running on 64-bit computers. Similar to the [drivers] section in the SYSTEM.INI file.|
> |**HKEY\_LOCAL\_MACHINE\System\CurrentControlSet\Control\Session Manager\KnownDlls**|
|&nbsp;&nbsp;&nbsp;&nbsp;Monitors the list of known or commonly used system DLLs; this system prevents people from exploiting weak application directory permissions by dropping in Trojan horse versions of system DLLs.|
> |**HKEY\_LOCAL\_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon\Notify**|
|&nbsp;&nbsp;&nbsp;&nbsp;Monitors the list of packages able to receive event notifications from Winlogon, the interactive logon support model for the Windows operating system.|

## Network requirements

The following addresses are required specifically for Change Tracking. Communication to these addresses is done over port 443.

|Azure Public  |Azure Government  |
|---------|---------|
|*.ods.opinsights.azure.com     |*.ods.opinsights.azure.us         |
|*.oms.opinsights.azure.com     | *.oms.opinsights.azure.us        |
|*.blob.core.windows.net|*.blob.core.usgovcloudapi.net|
|*.azure-automation.net|*.azure-automation.us|

## Use Change Tracking

After the solution is enabled, you can view the summary of changes for your monitored computers by selecting **Change Tracking** under **CONFIGURATION MANAGEMENT** in your Automation account.

You can view changes to your computers and then drill-into details for each event. Drop downs are available at the top of the chart to limit the chart and detailed information based on change type and time ranges. You can also click and drag on the chart to select a custom time range. **Change Type** will be one of the following values **Events**, **Daemons**, **Files**, **Registry**, **Software**, **Windows Services**. Category shows you the type of change and can be **Added**, **Modified**, or **Removed**.

![image of Change Tracking dashboard](./media/change-tracking/change-tracking-dash01.png)

Clicking on a change or event brings up the detailed information about that change. As you can see from the example, the startup type of the service was changed from Manual to Auto.

![image of change tracking details](./media/change-tracking/change-tracking-details.png)

## Search logs

In addition to the details that are provided in the portal, searches can be done against the logs. With the **Change Tracking** page open, click **Log Analytics**, this opens the **Logs** page.

### Sample queries

The following table provides sample log searches for change records collected by this solution:

|Query  |Description  |
|---------|---------|
|ConfigurationData<br>&#124; where   ConfigDataType == "WindowsServices" and SvcStartupType == "Auto"<br>&#124; where SvcState == "Stopped"<br>&#124; summarize arg_max(TimeGenerated, *) by SoftwareName, Computer         | Shows the most recent inventory records for Windows Services that were set to Auto but were reported as being Stopped<br>Results are limited to the most recent record for that SoftwareName and Computer      |
|ConfigurationChange<br>&#124; where ConfigChangeType == "Software" and ChangeCategory == "Removed"<br>&#124; order by TimeGenerated desc|Shows the change records for removed software|

## Alert on changes

A key capability of Change Tracking and Inventory is the ability to alert on the configuration state and any changes to the configuration state of your hybrid environment.  

In the following example, the screenshot shows that the file `C:\windows\system32\drivers\etc\hosts` has been modified on a machine. This file is important because the Hosts file is used by Windows to resolve hostnames to IP addresses and takes precedence over even DNS, which could result in connectivity issues or the redirection of traffic to malicious or otherwise dangerous websites.

![A chart showing the hosts file change](./media/change-tracking/changes.png)

To analyze this change further, go to Log search from clicking **Log Analytics**. Once in Log search, search for content changes to the Hosts file with the query `ConfigurationChange | where FieldsChanged contains "FileContentChecksum" and FileSystemPath contains "hosts"`. This query looks for changes that included a change of file content for files whose fully qualified path contains the word “hosts”. You can also ask for a specific file by changing the path portion to its fully qualified form (such as `FileSystemPath == "c:\windows\system32\drivers\etc\hosts"`).

After the query returns the desired results, click the **New alert rule** button in the Log search experience to open the alert creation page. You could also navigate to this experience through **Azure Monitor** in the Azure portal. In the alert creation experience, check our query again and modify the alert logic. In this case, you want the alert to be triggered if there's even one change detected across all the machines in the environment.

![An image showing the change query for tracking changes to the hosts file](./media/change-tracking/change-query.png)

After the condition logic is set, assign action groups to perform actions in response to the alert being triggered. In this case, I have set up emails to be sent and an ITSM ticket to be created.  Many other useful actions can also be taken such as triggering an Azure Function, Automation runbook, webhook, or Logic App.

![An image configuring an action group to alert on the change](./media/change-tracking/action-groups.png)

After all the parameters and logic are set, we can apply the alert to the environment.

### Alert suggestions

While alerting on changes to the Hosts file is one good application of alerts for Change Tracking or Inventory data, there are many more scenarios for alerting, including the cases defined along with their example queries in the section below.

|Query  |Description  |
|---------|---------|
|ConfigurationChange <br>&#124; where ConfigChangeType == "Files" and FileSystemPath contains " c:\\windows\\system32\\drivers\\"|Useful for tracking changes to system critical files|
|ConfigurationChange <br>&#124; where FieldsChanged contains "FileContentChecksum" and FileSystemPath == "c:\\windows\\system32\\drivers\\etc\\hosts"|Useful for tracking modifications to key configuration files|
|ConfigurationChange <br>&#124; where ConfigChangeType == "WindowsServices" and SvcName contains "w3svc" and SvcState == "Stopped"|Useful for tracking changes to system critical services|
|ConfigurationChange <br>&#124; where ConfigChangeType == "Daemons" and SvcName contains "ssh" and SvcState != "Running"|Useful for tracking changes to system critical services|
|ConfigurationChange <br>&#124; where ConfigChangeType == "Software" and ChangeCategory == "Added"|Useful for environments that need locked down software configurations|
|ConfigurationData <br>&#124; where SoftwareName contains "Monitoring Agent" and CurrentVersion != "8.0.11081.0"|Useful for seeing which machines have an outdated or non-compliant software version installed. It reports the last reported configuration state, not changes.|
|ConfigurationChange <br>&#124; where RegistryKey == "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\QualityCompat"| Useful for tracking changes to crucial anti-virus keys|
|ConfigurationChange <br>&#124; where RegistryKey contains "HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\SharedAccess\\Parameters\\FirewallPolicy"| Useful for tracking changes to firewall settings|

## Next steps

Visit the tutorial on Change Tracking to learn more about using the solution:

> [!div class="nextstepaction"]
> [Troubleshoot changes in your environment](automation-tutorial-troubleshoot-changes.md)

* Use [Log searches in Azure Monitor logs](../log-analytics/log-analytics-log-searches.md) to view detailed change tracking data.