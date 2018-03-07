The Azure File Sync agent is updated on a regular basis to add new functionality and to address issues. We recommend you configure Microsoft Update to get updates for the Azure File Sync agent as they're available. We understand some organizations like to strictly control and test updates.

For deployments that use earlier versions of the Azure File Sync agent:

- After the initial release of a new major version, the Storage Sync Service honors the previous major version for three months. For example, the Storage Sync Service supports version 1.\* for three months after the release of version 2.\*.
- After three months have elapsed, the Storage Sync Service blocks Registered Servers with the expired version from syncing with their sync groups.
- During the three months that the previous major version is honored, all bug fixes go only to the current (new) major version.

> [!Note]  
> If your version of Azure File Sync expires within three months, you're notified via toast notification in the Azure portal.
