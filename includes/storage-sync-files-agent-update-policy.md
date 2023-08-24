---
author: roygara
ms.service: azure-storage
ms.topic: include
ms.date: 5/13/2022
ms.author: rogarana
---
The Azure File Sync agent is updated on a regular basis to add new functionality and to address issues. We recommend updating the Azure File Sync agent as new versions are available.

#### Major vs. minor agent versions
* Major agent versions often contain new features and have an increasing number as the first part of the version number. For example: 14.0.0.0
* Minor agent versions are also called "patches" and are released more frequently than major versions. They often contain bug fixes and smaller improvements but no new features. For example: 14.1.0.0

#### Upgrade paths
There are five approved and tested ways to install the Azure File Sync agent updates. 
1. **Use Azure File Sync agent auto-upgrade feature to install agent updates.**  
    The Azure File Sync agent will auto-upgrade. You can select to install the latest agent version when available or update when the currently installed agent is near expiration. To learn more, see [Automatic agent lifecycle management](#automatic-agent-lifecycle-management).
2. **Configure Microsoft Update to automatically download and install agent updates.**  
    We recommend installing every Azure File Sync update to ensure you have access to the latest fixes for the server agent. Microsoft Update makes this process seamless, by automatically downloading and installing updates for you.
3. **Use AfsUpdater.exe to download and install agent updates.**  
    The AfsUpdater.exe is located in the agent installation directory. Double-click the executable to download and install agent updates. 
4. **Patch an existing Azure File Sync agent by using a Microsoft Update patch file, or a .msp executable. The latest Azure File Sync update package can be downloaded from the [Microsoft Update Catalog](https://www.catalog.update.microsoft.com/Search.aspx?q=Azure%20File%20Sync).**  
    Running an .msp executable will upgrade your Azure File Sync installation with the same method used automatically by Microsoft Update in the previous upgrade path. Applying a Microsoft Update patch will perform an in-place upgrade of an Azure File Sync installation.
5. **Download the newest Azure File Sync agent installer from the [Microsoft Download Center](https://go.microsoft.com/fwlink/?linkid=858257).**  
    To upgrade an existing Azure File Sync agent installation, uninstall the older version and then install the latest version from the downloaded installer. The server registration, sync groups, and any other settings are maintained by the Azure File Sync installer.

> [!Note]
> The downgrade of Azure File Sync agent is not supported. The new versions often include breaking changes when compared to the old versions, making the downgrade process unsupported. In case you encounter any problems with your current agent version, reach out to support or upgrade to the latest available release.

#### Automatic agent lifecycle management
The Azure File Sync agent will auto-upgrade. You can select either of two modes and specify a maintenance window in which the upgrade shall be attempted on the server. This feature is designed to help you with the agent lifecycle management by either providing a guardrail preventing your agent from expiration or allowing for a no-hassle, stay current setting.
1. The **default setting** will attempt to prevent the agent from expiration. Within 21 days of the posted expiration date of an agent, the agent will attempt to self-upgrade. It will start an attempt to upgrade once a week within 21 days prior to expiration and in the selected maintenance window. **This option does not eliminate the need for taking regular Microsoft Update patches.**
1. Optionally, you can select that the agent will automatically upgrade itself as soon as a new agent version becomes available (currently not applicable to clustered servers). This update will occur during the selected maintenance window and allow your server to benefit from new features and improvements as soon as they become generally available. This is the recommended, worry-free setting that will provide major agent versions as well as regular update patches to your server. Every agent released is at GA quality. If you select this option, Microsoft will flight the newest agent version to you. Clustered servers are excluded. Once flighting is complete, the agent will also become available on [Microsoft Download Center](https://go.microsoft.com/fwlink/?linkid=858257) aka.ms/AFS/agent.

 ##### Changing the auto-upgrade setting

The following instructions describe how to change the settings after you've completed the installer, if you need to make changes.

Open a PowerShell console and navigate to the directory where you installed the sync agent then import the server cmdlets. By default this would look something like this:
```powershell
cd 'C:\Program Files\Azure\StorageSyncAgent'
Import-Module -Name .\StorageSync.Management.ServerCmdlets.dll
```

You can run `Get-StorageSyncAgentAutoUpdatePolicy` to check the current policy setting and determine if you want to change it.

To change the current policy setting to the delayed update track, you can use:
```powershell
Set-StorageSyncAgentAutoUpdatePolicy -PolicyMode UpdateBeforeExpiration
```

To change the current policy setting to the immediate update track, you can use:
```powershell
Set-StorageSyncAgentAutoUpdatePolicy -PolicyMode InstallLatest
```

#### Agent lifecycle and change management guarantees
Azure File Sync is a cloud service, which continuously introduces new features and improvements. This means that a specific Azure File Sync agent version can only be supported for a limited time. To facilitate your deployment, the following rules guarantee you have enough time and notification to accommodate agent updates/upgrades in your change management process:

- Major agent versions are supported for at least six months from the date of initial release.
- We guarantee there is an overlap of at least three months between the support of major agent versions. 
- Warnings are issued for registered servers using a soon-to-be expired agent at least three months prior to expiration. You can check if a registered server is using an older version of the agent under the registered servers section of a Storage Sync Service.
- The lifetime of a minor agent version is bound to the associated major version. For example, when agent version 14.0.0.0 is set to expire, agent versions 14.\*.\*.\* will all be set to expire together.

> [!Note]
> Installing an agent version with an expiration warning will display a warning but succeed. Attempting to install or connect with an expired agent version is not supported and will be blocked.
