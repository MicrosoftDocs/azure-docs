---
author: khdownie
ms.service: azure-file-storage
ms.topic: include
ms.date: 01/07/2025
ms.author: kendownie
---
The Azure File Sync agent is updated regularly to add new functionality and to address issues. We recommend updating the Azure File Sync agent as new versions are available.

#### Major vs. minor agent versions

- Major agent versions often contain new features and have an increasing number as the first part of the version number. For example: 18.0.0.0.
- Minor agent versions are also called *patches* and are released more frequently than major versions. They often contain bug fixes and smaller improvements but no new features. For example: 18.2.0.0.

#### Update paths

There are five approved and tested ways to install the Azure File Sync agent updates:

- **Use the Azure File Sync automatic update feature to install agent updates**: The Azure File Sync agent is automatically updated. You can select to install the latest agent version when it's available or update when the currently installed agent is near expiration. To learn more, see the next section, [Automatic management of the agent lifecycle](#automatic-management-of-the-agent-lifecycle).
- **Configure Microsoft Update to automatically download and install agent updates**: We recommend installing every Azure File Sync update to ensure that you have access to the latest fixes for the server agent. Microsoft Update makes this process seamless by automatically downloading and installing updates for you.
- **Use AfsUpdater.exe to download and install agent updates**: The `AfsUpdater.exe` file is located in the agent installation directory. Double-click the executable file to download and install agent updates. Depending on the release version, you might need to restart the server.
- **Patch an existing Azure File Sync agent by using a Microsoft Update patch file or an .msp executable file**: You can download the latest Azure File Sync update package from the [Microsoft Update Catalog](https://www.catalog.update.microsoft.com/Search.aspx?q=Azure%20File%20Sync). Running an .msp executable file updates your Azure File Sync installation with the same method that Microsoft Update uses automatically. Applying a Microsoft Update patch performs an in-place update of an Azure File Sync installation.
- **Download the newest Azure File Sync agent installer**: You can get the installer in the [Microsoft Download Center](https://go.microsoft.com/fwlink/?linkid=858257). To update an existing Azure File Sync agent installation, uninstall the older version and then install the latest version from the downloaded installer. Agent settings (for example, server registration and server endpoints) are maintained when the Azure File Sync agent is uninstalled.

> [!NOTE]
> The downgrade of Azure File Sync agent isn't supported. New versions often include breaking changes when they're compared to the old versions, making the downgrade process unsupported. If you encounter any problems with your current agent version, contact support or update to the latest available release.

#### Automatic management of the agent lifecycle

The Azure File Sync agent is updated automatically. You can select either of the following modes and specify a maintenance window in which the update is attempted on the server. This feature is designed to help you with agent lifecycle management by either providing a guardrail that prevents your agent from expiration or allowing for a no-hassle, stay-current setting.

- The default setting attempts to prevent the agent from expiring. Within 21 days of the posted expiration date of an agent, the agent attempts to self-update. It starts an update attempt once a week within 21 days before expiration and in the selected maintenance window. Note that this option doesn't eliminate the need for taking regular Microsoft Update patches.

- You can select that the agent automatically updates itself as soon as a new agent version becomes available. This ability is currently not applicable to clustered servers.

  This update occurs during the selected maintenance window and allows your server to benefit from new features and improvements as soon as they become generally available. This recommended, worry-free setting provides major agent versions and regular update patches to your server. Every agent released is at GA quality.
  
  If you select this option, Microsoft flights the newest agent version to you. Clustered servers are excluded. After flighting is complete, the agent also becomes available in Microsoft Update and the [Microsoft Download Center](https://go.microsoft.com/fwlink/?linkid=858257).

##### Change the automatic update setting

The following instructions describe how to change the settings after you complete the installer, if you need to make changes.

Open a PowerShell console and go to the directory where you installed the sync agent, and then import the server cmdlets. By default, this action looks something like the following example:

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
Set-StorageSyncAgentAutoUpdatePolicy -PolicyMode InstallLatest -Day <day> -Hour <hour>
```

> [!NOTE]
> If flighting is already completed for the latest agent version and the agent's automatic update policy is changed to `InstallLatest`, the agent isn't automatically updated until the next agent version is flighted. To update to an agent version that finished flighting, use Microsoft Update or `AfsUpdater.exe`. To check if an agent version is currently flighting, check the [Supported versions](/azure/storage/file-sync/file-sync-release-notes#supported-versions) section in the release notes.

#### Agent lifecycle and change management guarantees

Azure File Sync is a cloud service that continuously introduces new features and improvements. A specific Azure File Sync agent version can be supported for only a limited time. To facilitate your deployment, the following rules guarantee that you have enough time and notification to accommodate agent updates in your change management process:

- Major agent versions are supported for at least 12 months from the date of initial release.
- There's an overlap of at least 3 months between the support of major agent versions.
- Warnings are issued for registered servers through a soon-to-be expired agent at least 3 months before expiration. You can check if a registered server is using an older version of the agent in the section about registered servers in a storage sync service.
- The lifetime of a minor agent version is bound to the associated major version. For example, when agent version 18.0.0.0 is set to expire, agent versions 18.\*.\*.\* all expire together.

> [!NOTE]
> Installing an expired agent version displays a warning but succeeds. Attempting to install or connect with an expired agent version isn't supported and is blocked.
