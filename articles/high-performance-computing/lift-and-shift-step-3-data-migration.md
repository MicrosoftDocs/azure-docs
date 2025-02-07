---
title: "Deployment step 3: storage - data migration component"
description: Learn about data migration during migration deployment step three.
author: tomvcassidy
ms.author: tomcassidy
ms.date: 08/30/2024
ms.topic: how-to
ms.service: azure-virtual-machines
ms.subservice: hpc
---

# Deployment step 3: storage - data migration component

Process to allow users to migrate data from an on-premises environment to the cloud environment in a secure and reliable way. Moving data closer to the cloud environment’s computing nodes is essential to meet the needs of throughput and IOPS.

This component should:

- Retain all existing file and directory structure from source to target.
- Retain all metadata related to the files, including user and group ownership, permissions, modification time, and access time.
- Report on the results of the data migration or copy tool.
- Implement a data migration restart process.

## Define data migration needs

* **Data integrity:**
   - Ensure that all files and directories retain their original structure and metadata during the migration process.

* **Security:**
   - Maintain data security throughout the migration process by using encrypted transfer methods and secure access controls.

* **Performance:**
   - Optimize the data migration process to handle large volumes of data efficiently, minimizing downtime and disruption.

## Tools and services

* **Azure Data Box:**
  - Use Azure Data Box for large-scale offline data transfers.
  - Deploy the Data Box appliance to transfer large amounts of data to Azure quickly and safely.
  - Set up and manage data transfers through the Azure portal.

* **AzCopy:**
  - Use AzCopy for command-line data transfer.
  - Perform high-performance, reliable data transfer between on-premises storage and Azure Blob Storage, Azure Files, and Azure Table Storage.
  - Support both synchronous and asynchronous transfer modes.

**Rsync:**
  - Use rsync for efficient and secure data transfer between on-premises storage and Azure storage.
  - Retain file and directory structure and file metadata during the transfer.
  - Utilize rsync options to ensure data integrity and transfer efficiency.

## Best practices for data migration

* **Plan and test:**
  - Thoroughly plan your data migration strategy, including the selection of tools (AzCopy, rsync) and target storage (Blob Storage, Azure NetApp Files, Azure Managed Lustre).
  - Perform test migrations with a subset of data to validate the process and ensure that the tools and configurations work as expected.

* **Maintain data integrity:**
  - Use options in AzCopy and rsync that preserve file metadata (permissions, timestamps, ownership).
  - Verify the integrity of the migrated data by comparing checksums or using built-in verification tools.

* **Optimize performance:**
  - Compress data during transfer (using rsync’s `-z` option) to reduce bandwidth usage.
  - Use parallel transfers in AzCopy to increase throughput and reduce migration time.

* **Secure data transfers:**
  - Encrypt data during transfer to protect it from unauthorized access. Use secure transfer options in AzCopy and rsync.
  - Ensure that access controls and permissions are correctly set up on both the source and target environments.

* **Monitor and report:**
  - Continuously monitor the data migration process to detect any issues early.
  - Generate and review detailed reports from AzCopy and rsync to ensure that all data migrated successfully and to identify any errors or discrepancies.

## Example steps for data migration

This section outlines the steps for using Azure Data Box, AzCopy, and rsync to transfer data from on-premises storage to Azure. It includes detailed instructions for deploying and configuring Azure Data Box, installing and using AzCopy for data transfer, and setting up and using rsync to ensure secure and efficient data migration.

1. **Using Azure Data Box:**

   - **Deploy Azure Data Box:**
     - Navigate to the Azure portal and order an Azure Data Box.
     - Follow the instructions to set up the Data Box appliance at your on-premises location.
     - Copy the data to the Data Box and ship it back to Azure.

   - **Configure data transfer:**
     - Once the Data Box arrives at the Azure data center, the data is uploaded to your specified storage account.
     - Verify the data transfer status and integrity through the Azure portal.

2. **Using AzCopy:**

   - **Install AzCopy:**
     - Download and install AzCopy on your on-premises server.
     - Configure AzCopy with the necessary permissions to access your Azure storage account.

   - **Perform data transfer:**
     - Use AzCopy commands to transfer data from on-premises storage to Azure Blob Storage.
     - Example command for data transfer:

       ```bash
       azcopy copy 'https://<storage_account>.blob.core.windows.net/<container>/<path>' '<local_path>' --recursive
       ```

   > [!NOTE]
   > For detailed information about AzCopy, visit [Get started with AzCopy](/azure/storage/common/storage-use-azcopy-v10).

3. **Using rsync:**

   - **Install rsync:**
     - Ensure rsync is installed on your on-premises server. Most Linux distributions include `rsync` by default.
     - Install rsync on your server if it isn't already installed:

       ```bash
       sudo apt-get install rsync  # For Debian-based systems
       sudo yum install rsync      # For Red Hat-based systems
       ```

   - **Perform data transfer:**
     - Use rsync to transfer data from on-premises storage to Azure storage.
     - Example command for data transfer:

       ```bash
       rsync -avz /path/to/local/data/ user@remote:/path/to/azure/data/
       ```

     - Options explained:
       - `-a`: Archive mode: preserves permissions, timestamps, symbolic links, and other metadata.
       - `-v`: Verbose mode: provides detailed output of the transfer process.
       - `-z`: Compresses data during transfer to reduce bandwidth usage.
   
     > [!NOTE]
     > For examples using Rsync, visit [rysnc examples](https://rsync.samba.org/examples.html).

### Example data migration implementation

**Data migration script using AzCopy:**

```bash
#!/bin/bash

# Define storage account and container
storage_account="<storage_account_name>"
container_name="<container_name>"
local_path="<local_path>"

# Perform data transfer using AzCopy
azcopy copy "https://$storage_account.blob.core.windows.net/$container_name" "$local_path" --recursive

# Verify transfer and generate report
azcopy jobs show --latest > migration_report.txt
```

**Data Migration Script using rsync:**

```bash
#!/bin/bash

# Define variables
local_path="/path/to/local/data"
remote_user="user"
remote_host="remote"
remote_path="/path/to/azure/data/"

# Perform data transfer using rsync
rsync -avz $local_path $remote_user@$remote_host:$remote_path

# Verify transfer and generate report
rsync -avz --dry-run $local_path $remote_user@$remote_host:$remote_path > migration_report.txt
```

## Resources

- [AzCopy](/azure/storage/common/storage-use-azcopy-v10)
- [Migrate to NFS Azure file shares (rsync, fpsync)](/azure/storage/files/storage-files-migration-nfs?tabs=ubuntu)
- [Azure Data Box](/azure/databox/)
- [rsync](https://rsync.samba.org/)
