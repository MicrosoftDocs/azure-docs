Updates to the Azure File Sync agent will be released on a regular basis to add new functionality and to address any issues found. We recommend enabling Microsoft Update to get all updates to the Azure File Sync agent as we release them. That said, we understand that some organizations like to strictly control and test updates. For deployments using older versions of the Azure File Sync agent:

- The Storage Sync Service will honor the previous major version for three months after the initial release of a new major version. For example, version 1.\* would be supported by the Storage Sync Service until three months after the release of version 2.\*.
- After three months have elapsed, the Storage Sync Service will begin to block Registered Servers using the expired version from syncing with their Sync Groups.
- Within the three months for a previous major version, all bug fixes will go only to the current major version.

> [!Note]  
> We will notify you via toast notification in the Azure portal if you are using a version of Azure File Sync that will expire within the next three months.