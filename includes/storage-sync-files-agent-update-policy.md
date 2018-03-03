Updates to the Azure File Sync agent will be released on a regular basis to add new functionality, and to address any issues that were discovered. We recommend that you enable Microsoft Update to get all updates to the Azure File Sync agent as they are released. 

### Major vs. minor agent versions
* Major agent versions often contain new features and have an increasing number as the first part of the version number. For example: *2.&ast;.&ast;*
* Minor agent versions are also called "patches" and are released more frequently than major versions. They often contain bug fixes and smaller improvements but no new features. For example: *&ast;.3.&ast;*

> [!Important]
> If you use domain-specific firewall rules, check the [Azure File Sync Firewall and Proxy document](../articles/storage/files/storage-sync-files-firewall-and-proxy.md) for each new agent release to ensure your firewall rules allow communication to the currently required set of domains.

### Upgrade paths
* [The latest Azure File Sync agent installer](https://go.microsoft.com/fwlink/?linkid=858257) (&ast;.msi) can be downloaded from the Microsoft Download Center. <br />It is possible to use the &ast;.msi file to upgrade an existing install. For that, the existing agent must be uninstalled before the latest version can then be installed. All settings as well as the server registration will be maintained for a seamless experience.
* Existing installs of an agent can also be patched with either minor or major version updates. <br />These Microsoft Update patches (&ast;.msp) can be downloaded by [searching the Microsoft Update Catalog for Azure File Sync](https://www.catalog.update.microsoft.com/Search.aspx?q=Azure%20File%20Sync).

### Agent support guarantees
A specific Azure File Sync agent version is supported for a limited time. The service keeps rolling forward and so must the agents installed on servers to take advantage of the latest features as well as staying compatible with the service.

The following rules guarantee enough time and notifications to accommodate agent updates/upgrades in any change management process:

> 1. Any major agent version has guaranteed supported for at least six months from the date of release.
> 2. Support between major agent versions will overlap for at least three months.
> 3. Any agent version will receive a warning at least three months prior to its expiration. Find it in the Azure portal -> YourStorageSyncService -> Registered servers section.

> [!Note]
> The lifetime of a minor agent version is bound to the associated major version. <br />
Installing an agent version with an expiration warning will display a warning but succeed. Attempting to install or connect with an expired agent version is not supported and will be blocked.