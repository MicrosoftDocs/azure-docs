Updates to the Azure File Sync agent will be released on a regular basis to add new functionality, and to address any issues that were discovered. We recommend that you configure Microsoft Update to get all updates to the Azure File Sync agent as we release them. We understand that some organizations like to strictly control and test updates. 

For deployments that use earlier versions of the Azure File Sync agent:

- The Storage Sync Service honors the preceding major version for three months after the initial release of a new major version. For example, the Storage Sync Service would support version 1.\* until three months after the release of version 2.\*.
- After three months have elapsed, the Storage Sync Service begins to block Registered Servers that are using the expired version from syncing with their Sync Groups.
- Within the three months for a preceding major version, all bug fixes go only to the current major version.

> [!Note]  
> We will notify you via toast notification in the Azure portal if you are using a version of Azure File Sync that will expire within the next three months.