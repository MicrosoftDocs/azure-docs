---
title: "Deployment step 3: storage - storage component"
description: Learn about the configuration of storage during migration deployment step three.
author: tomvcassidy
ms.author: tomcassidy
ms.date: 08/30/2024
ms.topic: how-to
ms.service: azure-virtual-machines
ms.subservice: hpc
---

# Deployment step 3: storage - storage component

When migrating HPC environments to the cloud, it's essential to define and implement an effective storage strategy that meets your performance, scalability, and cost requirements. An effective storage strategy ensures that your HPC workloads can access and process data efficiently, securely, and reliably. This approach includes considering different types of storage solutions for various needs such as long-term data archiving, high-performance scratch space, and shared storage for collaborative work.

Proper data management practices, such as lifecycle policies and access controls, help maintain the integrity and security of your data. Additionally, efficient data movement techniques are necessary to handle large-scale data transfers and automate ETL processes to streamline workflows. Here are the key steps and considerations for setting up storage in the cloud:

## Define storage needs

* **Storage types:**
   - **Long-term storage:** Use Azure Blob Storage for data archiving. Azure Blob Storage provides a cost-effective solution for storing large volumes of data that are infrequently accessed but must be retained for compliance or historical purposes. It offers various access tiers (Hot, Cool, and Archive) to optimize costs based on how frequently the data is accessed.
   - **High-performance storage:** Use Azure Managed Lustre or Azure NetApp Files for scratch space and high IOPS requirements. Azure Managed Lustre is ideal for HPC workloads that require high throughput and low latency, making it suitable for applications that process large datasets quickly.

      Azure NetApp Files provide enterprise-grade performance and features such as snapshots, cloning, and data replication, which are essential for critical HPC applications.
   - **Shared storage:** Use Azure Files or NFS on Blob for user home directories and shared data. Azure Files offers fully managed file shares in the cloud that can be accessed via the industry-standard SMB protocol, making it easy for multiple users and applications to share data.

      NFS on Blob allows for POSIX-compliant shared access to Azure Blob Storage, enabling seamless integration with existing HPC workflows and applications.

* **Data management:**
   - **Implement data lifecycle policies:** To manage data movement between hot, cool, and archive tiers, implement data lifecycle policies that automatically move data to the most appropriate storage tier based on usage patterns. This approach helps optimize storage costs by ensuring that frequently accessed data is kept in high-performance storage, while rarely accessed data is moved to more cost-effective archival storage.
   - **Set up access controls:** Use Azure Active Directory (AD) and role-based access control (RBAC) to set up granular access controls for your storage resources. Azure AD provides identity and access management capabilities, while RBAC allows you to assign specific permissions to users and groups based on their roles. This strategy ensures that only authorized users can access sensitive data, enhancing security and compliance.

* **Data movement:**
   - **Azure Data Box:** Use Azure Data Box for large-scale offline data transfers. Azure Data Box is a secure, ruggedized appliance that allows you to transfer large amounts of data to Azure quickly and safely, minimizing the time and cost associated with network-based data transfer.
   - **Azure Data Factory:** Use Azure Data Factory for orchestrating and automating data movement and transformation. Azure Data Factory provides a fully managed ETL service that allows you to move data between on-premises and cloud storage solutions, schedule data workflows, and transform data as needed.
   - **AzCopy:** Use AzCopy for command-line data transfer. AzCopy is a command-line utility that provides high-performance, reliable data transfer between on-premises storage and Azure Blob Storage, Azure Files, and Azure Table Storage. It supports both synchronous and asynchronous transfer modes, making it suitable for various data movement scenarios.

## Tools and services

* **Azure Managed Lustre:**
  - Use Azure Managed Lustre for high-performance storage needs in HPC workloads.
  - Deploy and configure Lustre file systems through the Azure Marketplace.
  - Set up and manage mount points on HPC nodes to access the Lustre file system.

* **Azure NetApp Files:**
  - Utilize Azure NetApp Files for enterprise-grade performance and data management features.
  - Configure snapshots, cloning, and data replication for critical HPC applications.
  - Integrate with Azure services and manage multiple protocols (NFS, SMB) for versatile usage.

* **Azure Blob Storage:**
  - Use Azure Blob Storage for cost-effective long-term data archiving.
  - Implement data lifecycle policies to automatically move data between access tiers (Hot, Cool, Archive).
  - Set up access controls and integrate with data analytics services for efficient data management.

* **Azure Files:**
  - Use Azure Files for fully managed file shares accessible via SMB protocol.
  - Configure Azure AD and RBAC for secure access management and compliance.
  - Ensure high availability with options for geo-redundant storage to protect against regional failures.

## Best practices for HPC storage

* **Define clear storage requirements:**
   - Identify the specific storage needs for different workloads, such as high-performance scratch space, long-term archiving, and shared storage.
   - Choose the appropriate storage solutions (for example, Azure Managed Lustre, Azure Blob Storage, Azure NetApp Files) based on performance, scalability, and cost requirements.

* **Implement data lifecycle management:**
   - Set up automated lifecycle policies to manage data movement between different storage tiers (Hot, Cool, Archive) to optimize costs and performance.
   - Regularly review and adjust lifecycle policies to ensure data is stored in the most cost-effective and performance-appropriate tier.

* **Ensure data security and compliance:**
   - Use Azure Active Directory (AD) and role-based access control (RBAC) to enforce granular access controls on storage resources.
   - Implement encryption for data at rest and in transit to meet security and compliance requirements.

* **Optimize data movement:**
   - Utilize tools like Azure Data Box for large-scale offline data transfers and AzCopy or rsync for efficient online data transfers.
   - Monitor and optimize data transfer processes to minimize downtime and ensure data integrity during migration.

* **Monitor and manage storage performance:**
   - Continuously monitor storage performance and usage metrics to identify and address bottlenecks.
   - Use Azure Monitor and Azure Metrics to gain insights into storage performance and capacity utilization, and make necessary adjustments to meet workload demands.

These best practices ensure that your HPC storage strategy is effective, cost-efficient, and capable of meeting the performance and scalability requirements of your workloads.

## Example steps for storage setup and deployment

This section provides detailed instructions for setting up various storage solutions for HPC in the cloud. It covers the deployment and configuration of Azure Managed Lustre, Azure NetApp Files, NFS on Azure Blob, and Azure Files, including how to deploy these services and configure mount points on HPC nodes.

1. **Setting up Azure Managed Lustre:**
   - **Deploy a Lustre filesystem:**
     - Navigate to the Azure Marketplace and search for "Azure Managed Lustre."
     - Follow the prompts to deploy the Lustre filesystem, specifying the required parameters such as resource group, location, and storage size.
     - Confirm the deployment and wait for the Lustre filesystem to be provisioned.
   - **Configure mount points:**
     - Once the Lustre filesystem is deployed, obtain the necessary mount information from the Azure portal.
     - On each HPC node, install the Lustre client packages if not already present.
     - Use the mount information to configure the mount points by adding entries to the `/etc/fstab` file or using the `mount` command directly.
     - Example:
       ```bash
       sudo mount -t lustre <LUSTRE_FILESYSTEM_URL> /mnt/lustre
       ```

2. **Setting up Azure NetApp Files:**

   - **Deploy an Azure NetApp Files volume:**
      - Navigate to the Azure portal and search for "Azure NetApp Files."
      - Create a NetApp account if not already existing.
      - Create a capacity pool by specifying the required parameters such as resource group, location, and pool size.
      - Create a new volume within the capacity pool by providing details like volume size, protocol type (NFS or SMB), and virtual network.

   - **Configure mount points:**
      - Once the NetApp volume is created, obtain the necessary mount information from the Azure portal.
      - On each HPC node, install the necessary client packages for the protocol used (NFS or SMB) if not already present.
      - Use the mount information to configure the mount points by adding entries to the `/etc/fstab` file or using the `mount` command directly.
      - Example for NFS:
        ```bash
        sudo mount -t nfs <NETAPP_VOLUME_URL>:/<VOLUME_NAME> /mnt/netapp
        ```

3. **Implementing NFS on Azure Blob:**
   - **Create an Azure Storage account:**
     - Navigate to the Azure portal and create a new storage account.
     - Enable NFS v3 support during the creation process by selecting the appropriate options under "File shares."
   - **Configure NFS client:**
     - On each HPC node, install NFS client packages if not already present.
     - Configure the NFS client by adding entries to the `/etc/fstab` file or using the `mount` command to mount the Azure Blob storage.
     - Example:

       ```bash
       sudo mount -t nfs <STORAGE_ACCOUNT_URL>:/<FILE_SHARE_NAME> /mnt/blob
       ```

4. **Setting up Azure Files:**

   - **Deploy an Azure File Share:**
      - Navigate to the Azure portal and search for "Azure Storage accounts."
      - Create a new storage account if not already existing by specifying parameters such as resource group, location, and performance tier (Standard or Premium).
      - Within the storage account, navigate to the "File shares" section and create a new file share by specifying the name and quota (size).

   - **Configure mount points:**
      - Once the file share is created, obtain the necessary mount information from the Azure portal.
      - On each HPC node, install the necessary client packages for the protocol used (SMB) if not already present.
      - Use the mount information to configure the mount points by adding entries to the `/etc/fstab` file or using the `mount` command directly.
      - Example for SMB:

         ```bash
         sudo mount -t cifs //<STORAGE_ACCOUNT_NAME>.file.core.windows.net/<FILE_SHARE_NAME> /mnt/azurefiles -o vers=3.0,username=<STORAGE_ACCOUNT_NAME>,password=<STORAGE_ACCOUNT_KEY>,dir_mode=0777,file_mode=0777,sec=ntlmssp
         ```

## Resources

- [Lustre - Azure Managed Lustre File System documentation](/azure/azure-managed-lustre)
- [Lustre - Robinhood for Azure Managed Lustre File System](https://techcommunity.microsoft.com/t5/azure-high-performance-computing/azure-managed-lustre-with-automatic-synchronisation-to-azure/ba-p/3997202)
- [Lustre - AzureHPC Lustre On Marketplace](https://techcommunity.microsoft.com/t5/azure-high-performance-computing/azurehpc-lustre-marketplace-offer/ba-p/3272689)
- [Lustre - Lustre File System Template on CycleCloud](https://techcommunity.microsoft.com/t5/azure-high-performance-computing/lustre-on-azure/ba-p/1052536)
- [NFS on Blob](/azure/storage/blobs/network-file-system-protocol-support)
- [NFS on Azure Files](/azure/storage/files/files-nfs-protocol)
- [Azure NetApp Files](https://azure.microsoft.com/products/netapp)
