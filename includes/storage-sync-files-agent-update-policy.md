The Azure File Sync agent is updated on a regular basis to add new functionality and to address issues. We recommend you configure Microsoft Update to get updates for the Azure File Sync agent as they're available.

#### Major vs. minor agent versions
* Major agent versions often contain new features and have an increasing number as the first part of the version number. For example: *2.\*.\**
* Minor agent versions are also called "patches" and are released more frequently than major versions. They often contain bug fixes and smaller improvements but no new features. For example: *\*.3.\**

#### Upgrade paths
There are three approved and tested ways to install the Azure File Sync agent updates. These update paths work for both major and minor versions.
1. **(Preferred) Configure Microsoft Update to automatically download and install agent updates.**  
    We always recommend taking every Azure File Sync update to ensure you have access to the latest fixes for the server agent. Microsoft Update makes this process seamless, by automatically downloading and installing updates for you.
2. **Patch an existing Azure File Sync agent by using a Microsoft Update patch file, or a .msp executable. The latest Azure File Sync update package can be downloaded from the [Microsoft Update Catalog](https://www.catalog.update.microsoft.com/Search.aspx?q=Azure%20File%20Sync).**  
    Running a .msp executable will upgrade your Azure File Sync installation with the same method used automatically by Microsoft Update in the previous upgrade path. Applying a Microsoft Update patch will perform an in-place upgrade of an Azure File Sync installation.
3. **Download the newest Azure File Sync agent installer from the [Microsoft Download Center](https://go.microsoft.com/fwlink/?linkid=858257). The installer download is a Microsoft Installer package, or a .msi executable.**  
    To upgrade an existing Azure File Sync agent installation, uninstalled the older version and then install the latest version from the downloaded installer. The server registration, sync groups, and any other settings are maintained by the Azure File Sync installer.

#### Agent lifecycle and change management guarantees
Azure File Sync is a cloud service, which enables continuously introduction of new features and functionality. This means that a specific Azure File Sync agent version can only be supported for a limited time. To facilitate your deployment, the following rules to guarantee you have enough time and notification to accommodate agent updates/upgrades in your change management process:

- Major agent versions are supported for at least six months from the date of initial release.
- We guarantee there is an overlap of at least three months between the support of major agent versions. 
- Warnings are issued for registered servers using a soon-to-be expired agent at least three months prior to expiration. You can check if a registered server is using an older version of the agent under the registered servers section of a Storage Sync Service.
- The lifetime of a minor agent version is bound to the associated major version. For example, when agent version 3.0 is released, agent versions 2.\* will all be set to expire together.

> [!Note]
> Installing an agent version with an expiration warning will display a warning but succeed. Attempting to install or connect with an expired agent version is not supported and will be blocked.