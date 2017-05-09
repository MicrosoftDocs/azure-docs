# Overview

## [Introduction](storage-introduction.md)

# Get Started

## [Create a storage account](storage-create-storage-account.md)

## Blob Storage
### [.NET](storage-dotnet-how-to-use-blobs.md)
### [Java](storage-java-how-to-use-blob-storage.md)
### [Node.js](storage-nodejs-how-to-use-blob-storage.md)
### [C++](storage-c-plus-plus-how-to-use-blobs.md)
### [Python](storage-python-how-to-use-blob-storage.md)
### [PHP](storage-php-how-to-use-blobs.md)
### [Ruby](storage-ruby-how-to-use-blob-storage.md)
### [iOS](storage-ios-how-to-use-blob-storage.md)
### [Xamarin](storage-xamarin-blob-storage.md)

## Queue Storage
### [.NET](storage-dotnet-how-to-use-queues.md)
### [Java](storage-java-how-to-use-queue-storage.md)
### [Node.js](storage-nodejs-how-to-use-queues.md)
### [C++](storage-c-plus-plus-how-to-use-queues.md)
### [Python](storage-python-how-to-use-queue-storage.md)
### [PHP](storage-php-how-to-use-queues.md)
### [Ruby](storage-ruby-how-to-use-queue-storage.md)

## Table Storage
### [.NET](storage-dotnet-how-to-use-tables.md)
### [Java](storage-java-how-to-use-table-storage.md)
### [Node.js](storage-nodejs-how-to-use-table-storage.md)
### [C++](storage-c-plus-plus-how-to-use-tables.md)
### [Python](storage-python-how-to-use-table-storage.md)
### [PHP](storage-php-how-to-use-table-storage.md)
### [Ruby](storage-ruby-how-to-use-table-storage.md)

## File Storage
### [Windows, .NET, PowerShell](storage-dotnet-how-to-use-files.md)
### [Linux](storage-how-to-use-files-linux.md)
### [Java](storage-java-how-to-use-file-storage.md)
### [C++](storage-c-plus-plus-how-to-use-files.md)
### [Python](storage-python-how-to-use-file-storage.md)

## Disk Storage 
### [Create a VM using Resource Manager and PowerShell](../virtual-machines/virtual-machines-windows-ps-create.md)
### [Create a Linux VM using the Azure CLI 2.0](../virtual-machines/linux/quick-create-cli.md)
### [Attach a managed disk to a Windows VM using PowerShell](../virtual-machines/windows/attach-disk-ps.md)
### [Add a managed disk to a Linux VM](../virtual-machines/linux/add-disk.md)
### [Create copy of VHD stored as a Managed Disk using Snapshots in Windows](../virtual-machines/windows/snapshot-copy-managed-disk.md)
### [Create copy of VHD stored as a Managed Disk using Snapshots in Linux](../virtual-machines/linux/snapshot-copy-managed-disk.md)

# How To
## [Create a storage account](storage-create-storage-account.md)
## Use blobs
### [Service overview](https://msdn.microsoft.com/library/dd179376.aspx)
### [Hot and cool tiers](storage-blob-storage-tiers.md)
### [Custom domains](storage-custom-domain-name.md)
### [Anonymous access to blobs](storage-manage-access-to-resources.md)
### [Samples](https://azure.microsoft.com/documentation/samples/?service=storage&term=blob)
## Use queues
### [Concepts](https://msdn.microsoft.com/library/dd179353.aspx)
### [Samples](https://azure.microsoft.com/documentation/samples/?service=storage&term=queue)
## Use tables
### [Overview](https://msdn.microsoft.com/library/dd179463.aspx)
### [Table design guide](storage-table-design-guide.md)
### [Samples](https://azure.microsoft.com/documentation/samples/?service=storage&term=table)
## Use files
### [Overview](/rest/api/storageservices/File-Service-Concepts)
### [Troubleshoot Azure Files](storage-troubleshoot-file-connection-problems.md)
### [Samples](https://azure.microsoft.com/documentation/samples/?service=storage&term=file)
## Use disks
### [Disks and VHDs for Windows VMs](storage-about-disks-and-vhds-windows.md)
### [Disks and VHDs for Linux VMs](storage-about-disks-and-vhds-linux.md)
### [Azure Managed Disks Overview](storage-managed-disks-overview.md)
### [Migrate Azure VMs to Azure Managed Disks](../virtual-machines/windows/migrate-to-managed-disks.md)
### [Migrate from AWS and other platforms to Managed Disks](../virtual-machines/windows/on-prem-to-azure.md)
### [Frequently Asked Questions about Azure IaaS VM Disks](storage-faq-for-disks.md)
### Premium Storage
#### [High-performance Premium Storage for VM Disks](storage-premium-storage.md)
#### [Migrating to Premium Storage using Azure Site Recovery](storage-migrate-to-premium-storage-using-azure-site-recovery.md)
#### [Design for high performance](storage-premium-storage-performance.md)
### Standard Storage
#### [Cost-effective Standard Storage and unmanaged and managed VM Disks](storage-standard-storage.md)
### Using unmanaged disks
#### [Migrate to Premium Storage](storage-migration-to-premium-storage.md)
#### [Back up unmanaged VM disks with incremental snapshots](storage-incremental-snapshots.md)
## Plan and design
### [Replication](storage-redundancy.md)
### [Scalability and performance targets](storage-scalability-targets.md)
### [Performance and scalability checklist](storage-performance-checklist.md)
### [Concurrency](storage-concurrency.md)
## Develop
### Samples
#### [.NET](storage-samples-dotnet.md)
#### [Java](storage-samples-java.md)
### [Designing HA Apps using RA-GRS](storage-designing-ha-apps-with-ragrs.md)
### [Configure connection strings](storage-configure-connection-string.md)
### [Use the Storage Emulator](storage-use-emulator.md)
### [Set and retrieve properties and metadata](storage-properties-metadata.md)
## Manage
### [PowerShell](storage-powershell-guide-full.md)
### [Azure CLI 2.0](storage-azure-cli.md)
### [Azure CLI 1.0](storage-azure-cli-nodejs.md)
### [Azure Automation](automation-manage-storage.md)
## Secure
### [Security guide](storage-security-guide.md)
### [Encryption for data at rest](storage-service-encryption.md)
### [Shared key authentication](https://msdn.microsoft.com/library/dd179428.aspx)
### [Shared access signatures (SAS)](storage-dotnet-shared-access-signature-part-1.md)
### [Tutorial: Encrypt and decrypt blobs using Azure Key Vault](storage-encrypt-decrypt-blobs-key-vault.md)
### Client-side encryption
#### [.NET](storage-client-side-encryption.md)
#### [Java](storage-client-side-encryption-java.md)
#### [Python](storage-client-side-encryption-python.md)
## Monitor and troubleshoot
### Metrics and logging
#### [Storage Analytics](storage-analytics.md)
#### [Enable and view metrics](storage-enable-and-view-metrics.md)
#### [Monitor, diagnose, and troubleshoot](storage-monitoring-diagnosing-troubleshooting.md)
#### [Troubleshooting tutorial](storage-e2e-troubleshooting.md)
### Troubleshoot disk deletion errors
#### [In a Resource Manager deployment](storage-resource-manager-cannot-delete-storage-account-container-vhd.md)
#### [In a classic deployment](storage-cannot-delete-storage-account-container-vhd.md)
### [Troubleshoot File storage](storage-troubleshoot-file-connection-problems.md)
### [Disaster recovery guidance](storage-disaster-recovery-guidance.md)
## Transfer Data
### [Move data to and from Storage](storage-moving-data.md)
### [AzCopy command-line utility](storage-use-azcopy.md)
### [Using the Import/Export service](storage-import-export-service.md)
### [Using the Import/Export Tool](storage-import-export-tool-how-to.md)
#### [Setting up the Import/Export Tool](storage-import-export-tool-setup.md)
#### [Preparing hard drives for an import job](storage-import-export-tool-preparing-hard-drives-import.md)
##### [Setting properties and metadata during the import process](storage-import-export-tool-setting-properties-metadata-import.md)
##### [Sample workflow to prepare hard drives for an import job](storage-import-export-tool-sample-preparing-hard-drives-import-job-workflow.md)
##### [Quick reference for frequently used commands for import jobs](storage-import-export-tool-quick-reference.md)
#### [Previewing drive usage for an export job](storage-import-export-tool-previewing-drive-usage-export-v1.md)
#### [Reviewing job status with copy log files](storage-import-export-tool-reviewing-job-status-v1.md)
#### [Repairing an import job](storage-import-export-tool-repairing-an-import-job-v1.md)
#### [Repairing an export job](storage-import-export-tool-repairing-an-export-job-v1.md)
#### [Troubleshooting the Import/Export Tool](storage-import-export-tool-troubleshooting-v1.md)
#### [Import/Export service manifest file format](storage-import-export-file-format-manifest.md)
#### [Import/Export service metadata and properties file format](storage-import-export-file-format-metadata-and-properties.md)
#### [Import/Export service log file format](storage-import-export-file-format-log.md)
### [Using the Import/Export Tool (v1)](storage-import-export-tool-how-to-v1.md)
#### [Setting up the Import/Export Tool](storage-import-export-tool-setup-v1.md)
#### [Preparing hard drives for an import job](storage-import-export-tool-preparing-hard-drives-import-v1.md)
##### [Setting properties and metadata during the import process](storage-import-export-tool-setting-properties-metadata-import-v1.md)
##### [Sample workflow to prepare hard drives for an import job](storage-import-export-tool-sample-preparing-hard-drives-import-job-workflow-v1.md)
##### [Quick reference for frequently used commands for import jobs](storage-import-export-tool-quick-reference-v1.md)
#### [Previewing drive usage for an export job](storage-import-export-tool-previewing-drive-usage-export-v1.md)
#### [Reviewing job status with copy log files](storage-import-export-tool-reviewing-job-status-v1.md)
#### [Repairing an import job](storage-import-export-tool-repairing-an-import-job-v1.md)
#### [Repairing an export job](storage-import-export-tool-repairing-an-export-job-v1.md)
#### [Troubleshooting the Import/Export Tool](storage-import-export-tool-troubleshooting-v1.md)
#### [Import/Export service manifest file format](storage-import-export-file-format-manifest.md)
#### [Import/Export service metadata and properties file format](storage-import-export-file-format-metadata-and-properties.md)
#### [Import/Export service log file format](storage-import-export-file-format-log.md)
### [Using the Azure Import/Export service REST API](storage-import-export-using-the-rest-api.md)
#### [Creating an import job](storage-import-export-creating-an-import-job.md)
#### [Creating an export job](storage-import-export-creating-an-export-job.md)
#### [Retrieving state information for a job](storage-import-export-retrieving-state-info-for-a-job.md)
#### [Enumerating jobs](storage-import-export-enumerating-jobs.md)
#### [Cancelling and deleting jobs](storage-import-export-cancelling-and-deleting-jobs.md)
#### [Backing up drive manifests](storage-import-export-backing-up-drive-manifests.md)
#### [Diagnostics and error recovery for Import/Export jobs](storage-import-export-diagnostics-and-error-recovery.md)
# Reference
## [PowerShell](/powershell/module/azure.storage)
## [Azure CLI](/cli/azure/storage)
## .NET
### [Resource Manager](/dotnet/api/microsoft.azure.management.storage)
### [Data movement](/dotnet/api/microsoft.windowsazure.storage.datamovement)
### [Blobs, Queues, Tables, and Files](https://msdn.microsoft.com/library/azure/mt347887.aspx)
## [Java](http://azure.github.io/azure-storage-java/)
## [Node.js](http://azure.github.io/azure-storage-node)
## [Ruby](http://azure.github.io/azure-storage-ruby)
## [Python](https://azure-storage.readthedocs.io/en/latest/index.html)
## [C++](http://azure.github.io/azure-storage-cpp)
## [iOS](http://azure.github.io/azure-storage-ios/)
## [Android](http://azure.github.io/azure-storage-android)
## REST
### [Blobs, Queues, Tables, and Files](/rest/api/storageservices)
### [Resource provider](/rest/api/storagerp)
### [Import/Export](/rest/api/storageimportexport)

# Related
## Classic Portal
### [Create storage account](storage-create-storage-account-classic-portal.md)
### [Enable and view metrics](storage-enable-and-view-metrics-classic-portal.md)
### [Monitor, diagnose, and troubleshoot](storage-monitoring-diagnosing-troubleshooting-classic-portal.md)
### [Troubleshooting tutorial](storage-e2e-troubleshooting-classic-portal.md)

# Resources
## [Pricing](https://azure.microsoft.com/pricing/details/storage/blobs/)
## [Azure Storage client tools](storage-explorers.md)
## [Stack Overflow](http://stackoverflow.com/questions/tagged/windows-azure-storage)
## [Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=windowsazuredata)
## [Service updates](https://azure.microsoft.com/updates/?product=storage)
## [Videos](https://azure.microsoft.com/documentation/videos/index/?services=storage)

## Azure Storage Explorer
### [Storage Explorer (Preview)](../vs-azure-tools-storage-manage-with-storage-explorer.md)
### [Manage blobs with Storage Explorer (Preview)](../vs-azure-tools-storage-explorer-blobs.md)
### [Using Storage Explorer (Preview) with Azure file storage](../vs-azure-tools-storage-explorer-files.md)

## NuGet packages
### [Azure Storage Client Library for .NET](https://www.nuget.org/packages/WindowsAzure.Storage/)
### [Azure Storage Data Movement Library](https://www.nuget.org/packages/Microsoft.Azure.Storage.DataMovement/)
### [Azure Configuration Manager](https://www.nuget.org/packages/Microsoft.WindowsAzure.ConfigurationManager/)

## Source code
### .NET
#### [Blob, queue, table, and file](https://github.com/Azure/azure-storage-net)
#### [Data movement](https://github.com/Azure/azure-storage-net-data-movement)
#### [Resource provider](https://github.com/Azure/azure-sdk-for-net)
### [Node.js](http://azure.github.io/azure-storage-node/)
### [Java](https://github.com/Azure/azure-storage-java)
### [C++](https://github.com/Azure/azure-storage-cpp)
### [PHP](https://github.com/Azure/azure-storage-php)
### [Ruby](https://github.com/Azure/azure-storage-ruby)
### [Python](https://github.com/Azure/azure-storage-python)
### [iOS](https://github.com/Azure/azure-storage-ios)
