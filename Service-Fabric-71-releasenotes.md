Microsoft Azure Service Fabric 7.1 Release Notes

* [Key Announcements](#key-announcements)
* [Upcoming Breaking Changes](#upcomig-breaking-changes)
* [Service Fabric Runtime](#service-fabric-runtime)
* [Service Fabric Common Bug Fixes](#service-fabric-common-bug-fixes)
* [Repositories and Download Links](#repositories-and-download-links)
* [Visual Studio 2015 Tool for Service Fabric - Localized Download Links](#visual-studio-2015-tool-for-service-fabric-\--localized-download-links)

## Key Annoucements
-  Service Fabric applications with [Managed Identities](https://docs.microsoft.com/en-us/azure/service-fabric/concepts-managed-identity) enabled can directly [reference a keyvault](https://docs.microsoft.com/azure/service-fabric/service-fabric-keyvault-references) secret URL as environment/parameter variable. Service Fabric will automatically resolve the secret using the application's managed identity.
- [Service Fabric Backup Explorer](https://github.com/microsoft/service-fabric-backup-explorer):  To ease management of Reliable Collections backup for Service Fabric Stateful applications, we are announcing public preview of Service Fabric Backup Explorer. It is a utility that  enables users to i)Audit and review the contents of the Reliable Collections, ii) update current state to a consistent view, iii) create Backup of the current snapshot of the Reliable Collections and iv) Fix data corruption.
  

## Upcoming Breaking Changes
- For customers [using service fabric to export certificates into their linux containers](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-securing-containers), the export mechanism will be changed in an upcoming CU to encrypt the private key included in the .pem file, with the password being stored in an adjacent .key file.
- For customers using service fabric managed identities, **please switch to new environment variables ‘IDENTITY_ENDPOINT’ and ‘IDENTITY_HEADER’**. The prior environment variables    
  'MSI_ENDPOINT', ‘MSI_ENDPOINT_’ and 'MSI_SECRET' are now deprecated and will be removed in next CU release.

## Service Fabric Runtime
