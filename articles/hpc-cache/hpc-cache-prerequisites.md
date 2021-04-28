---
title: Azure HPC Cache prerequisites
description: Prerequisites for using Azure HPC Cache
author: ekpgh
ms.service: hpc-cache
ms.topic: how-to
ms.date: 04/14/2021
ms.author: v-erkel
---

# Prerequisites for Azure HPC Cache

Before using the Azure portal to create a new Azure HPC Cache, make sure your environment meets these requirements.

## Video overviews

Watch these videos for a quick overview of the system's components and what they need to work together.

(Click the video image or the link to watch.)

* [How it works](https://azure.microsoft.com/resources/videos/how-hpc-cache-works/) - Explains how Azure HPC Cache interacts with storage and clients

  [![video thumbnail image: Azure HPC Cache: How it works (click to visit video page)](media/video-2-components.png)](https://azure.microsoft.com/resources/videos/how-hpc-cache-works/)  

* [Prerequisites](https://azure.microsoft.com/resources/videos/hpc-cache-prerequisites/) - Describes requirements for NAS storage, Azure Blob storage, network access, and client access

  [![video thumbnail image: Azure HPC Cache: Prerequisites (click to visit video page)](media/video-3-prerequisites.png)](https://azure.microsoft.com/resources/videos/hpc-cache-prerequisites/)

Read the rest of this article for specific recommendations.

## Azure subscription

A paid subscription is recommended.

## Network infrastructure

Two network-related prerequisites should be set up before you can use your cache:

* A dedicated subnet for the Azure HPC Cache instance
* DNS support so that the cache can access storage and other resources

### Cache subnet

The Azure HPC Cache needs a dedicated subnet with these qualities:

* The subnet must have at least 64 IP addresses available.
* The subnet cannot host any other VMs, even for related services like client machines.
* If you use multiple Azure HPC Cache instances, each one needs its own subnet.

The best practice is to create a new subnet for each cache. You can create a new virtual network and subnet as part of creating the cache.

### DNS access

The cache needs DNS to access resources outside of its virtual network. Depending on which resources you are using, you might need to set up a customized DNS server and configure forwarding between that server and Azure DNS servers:

* To access Azure Blob storage endpoints and other internal resources, you need the Azure-based DNS server.
* To access on-premises storage, you need to configure a custom DNS server that can resolve your storage hostnames. You must do this before you create the cache.

If you only use Blob storage, you can use the default Azure-provided DNS server for your cache. However, if you need access to storage or other resources outside of Azure, you should create a custom DNS server and configure it to forward any Azure-specific resolution requests to the Azure DNS server.

To use a custom DNS server, you need to do these setup steps before you create your cache:

* Create the virtual network that will host the Azure HPC Cache.
* Create the DNS server.
* Add the DNS server to the cache's virtual network.

  Follow these steps to add the DNS server to the virtual network in the Azure portal:

  1. Open the virtual network in the Azure portal.
  1. Choose DNS servers from the Settings menu in the sidebar.
  1. Select Custom
  1. Enter the DNS server's IP address in the field.

A simple DNS server also can be used to load balance client connections among all the available cache mount points.

Learn more about Azure virtual networks and DNS server configurations in [Name resolution for resources in Azure virtual networks](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md).

## Permissions

Check these permission-related prerequisites before starting to create your cache.

* The cache instance needs to be able to create virtual network interfaces (NICs). The user who creates the cache must have sufficient privileges in the subscription to create NICs.

* If using Blob storage, Azure HPC Cache needs authorization to access your storage account. Use Azure role-based access control (Azure RBAC) to give the cache access to your Blob storage. Two roles are required: Storage Account Contributor and Storage Blob Data Contributor.

  Follow the instructions in [Add storage targets](hpc-cache-add-storage.md#add-the-access-control-roles-to-your-account) to add the roles.

## Storage infrastructure
<!-- heading is linked in create storage target GUI as aka.ms/hpc-cache-prereq#storage-infrastructure - make sure to fix that if you change the wording of this heading -->

The cache supports Azure Blob containers, NFS hardware storage exports, and NFS-mounted ADLS blob containers (currently in preview). Add storage targets after you create the cache.

Each storage type has specific prerequisites.

### Blob storage requirements

If you want to use Azure Blob storage with your cache, you need a compatible storage account and either an empty Blob container or a container that is populated with Azure HPC Cache formatted data as described in [Move data to Azure Blob storage](hpc-cache-ingest.md).

> [!NOTE]
> Different requirements apply to NFS-mounted blob storage. Read [ADLS-NFS storage requirements](#nfs-mounted-blob-adls-nfs-storage-requirements-preview) for details.

Create the account before attempting to add a storage target. You can create a new container when you add the target.

To create a compatible storage account, use one of these combinations:

| Performance | Type | Replication | Access tier |
|--|--|--|--|
| Standard | StorageV2 (general purpose v2)| Locally redundant storage (LRS) or Zone-redundant storage (ZRS) | Hot |
| Premium | Block blobs | Locally redundant storage (LRS) | Hot |

The storage account must be accessible from your cache's private subnet. If your account uses a private endpoint or a public endpoint that is restricted to specific virtual networks, make sure to enable access from the cache's subnet. (An open public endpoint is not recommended.)

It's a good practice to use a storage account in the same Azure region as your cache.

You also must give the cache application access to your Azure storage account as mentioned in [Permissions](#permissions), above. Follow the procedure in [Add storage targets](hpc-cache-add-storage.md#add-the-access-control-roles-to-your-account) to give the cache the required access roles. If you are not the storage account owner, have the owner do this step.

### NFS storage requirements
<!-- linked from configuration.md -->

If using an NFS storage system (for example, an on-premises hardware NAS system), make sure it meets these requirements. You might need to work with the network administrators or firewall managers for your storage system (or data center) to verify these settings.

> [!NOTE]
> Storage target creation will fail if the cache has insufficient access to the NFS storage system.

More information is included in [Troubleshoot NAS configuration and NFS storage target issues](troubleshoot-nas.md).

* Network connectivity: The Azure HPC Cache needs high-bandwidth network access between the cache subnet and the NFS system's data center. [ExpressRoute](../expressroute/index.yml) or similar access is recommended. If using a VPN, you might need to configure it to clamp TCP MSS at 1350 to make sure large packets are not blocked. Read [VPN packet size restrictions](troubleshoot-nas.md#adjust-vpn-packet-size-restrictions) for additional help troubleshooting VPN settings.

* Port access: The cache needs access to specific TCP/UDP ports on your storage system. Different types of storage have different port requirements.

  To check your storage system's settings, follow this procedure.

  * Issue an `rpcinfo` command to your storage system to check the needed ports. The command below lists the ports and formats the relevant results in a table. (Use your system's IP address in place of the *<storage_IP>* term.)

    You can issue this command from any Linux client that has NFS infrastructure installed. If you use a client inside the cluster subnet, it also can help verify connectivity between the subnet and the storage system.

    ```bash
    rpcinfo -p <storage_IP> |egrep "100000\s+4\s+tcp|100005\s+3\s+tcp|100003\s+3\s+tcp|100024\s+1\s+tcp|100021\s+4\s+tcp"| awk '{print $4 "/" $3 " " $5}'|column -t
    ```

  Make sure that all of the ports returned by the ``rpcinfo`` query allow unrestricted traffic from the Azure HPC Cache's subnet.

  * If you can't use the `rpcinfo` command, make sure that these commonly used ports allow inbound and outbound traffic:

    | Protocol | Port  | Service  |
    |----------|-------|----------|
    | TCP/UDP  | 111   | rpcbind  |
    | TCP/UDP  | 2049  | NFS      |
    | TCP/UDP  | 4045  | nlockmgr |
    | TCP/UDP  | 4046  | mountd   |
    | TCP/UDP  | 4047  | status   |

    Some systems use different port numbers for these services - consult your storage system's documentation to be sure.

  * Check firewall settings to be sure that they allow traffic on all of these required ports. Be sure to check firewalls used in Azure as well as on-premises firewalls in your data center.

* Root access (read/write): The cache connects to the back-end system as user ID 0. Check these settings on your storage system:
  
  * Enable `no_root_squash`. This option ensures that the remote root user can access files owned by root.

  * Check export policies to make sure they do not include restrictions on root access from the cache's subnet.

  * If your storage has any exports that are subdirectories of another export, make sure the cache has root access to the lowest segment of the path. Read [Root access on directory paths](troubleshoot-nas.md#allow-root-access-on-directory-paths) in the NFS storage target troubleshooting article for details.

* NFS back-end storage must be a compatible hardware/software platform. Contact the Azure HPC Cache team for details.

### NFS-mounted blob (ADLS-NFS) storage requirements (PREVIEW)

Azure HPC Cache also can use a blob container mounted with the NFS protocol as a storage target.

> [!NOTE]
> NFS 3.0 protocol support for Azure Blob storage is in public preview. Availability is restricted, and features might change between now and when the feature becomes generally available. Do not use preview technology in production systems.
>
> Read more about this preview feature in [NFS 3.0 protocol support in Azure Blob storage](../storage/blobs/network-file-system-protocol-support.md).

The storage account requirements are different for an ADLS-NFS blob storage target and for a standard blob storage target. Follow the instructions in [Mount Blob storage by using the Network File System (NFS) 3.0 protocol](../storage/blobs/network-file-system-protocol-support-how-to.md) carefully to create and configure the NFS-enabled storage account.

This is a general overview of the steps. These steps might change, so always refer to the [ADLS-NFS instructions](../storage/blobs/network-file-system-protocol-support-how-to.md) for current details.

1. Make sure that the features you need are available in the regions where you plan to work.

1. Enable the NFS protocol feature for your subscription. Do this *before* you create the storage account.

1. Create a secure virtual network (VNet) for the storage account. You should use the same virtual network for your NFS-enabled storage account and for your Azure HPC Cache. (Do not use the same subnet as the cache.)

1. Create the storage account.

   * Instead of the using the storage account settings for a standard blob storage account, follow the instructions in the [how-to document](../storage/blobs/network-file-system-protocol-support-how-to.md). The type of storage account supported might vary by Azure region.

   * In the Networking section, choose a private endpoint in the secure virtual network you created (recommended), or choose a public endpoint with restricted access from the secure VNet.

   * Do not forget to complete the Advanced section, where you enable NFS access.

   * Give the cache application access to your Azure storage account as mentioned in [Permissions](#permissions), above. You can do this the first time you create a storage target. Follow the procedure in [Add storage targets](hpc-cache-add-storage.md#add-the-access-control-roles-to-your-account) to give the cache the required access roles.

     If you are not the storage account owner, have the owner do this step.

Learn more about using ADLS-NFS storage targets with Azure HPC Cache in [Use NFS-mounted blob storage with Azure HPC Cache](nfs-blob-considerations.md).

## Set up Azure CLI access (optional)

If you want to create or manage Azure HPC Cache from the Azure command-line interface (Azure CLI), you need to install the CLI software and the hpc-cache extension. Follow the instructions in [Set up Azure CLI for Azure HPC Cache](az-cli-prerequisites.md).

## Next steps

* [Create an Azure HPC Cache instance](hpc-cache-create.md) from the Azure portal
