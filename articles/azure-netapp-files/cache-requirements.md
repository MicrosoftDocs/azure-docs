---
title: Requirements and considerations for Azure NetApp Files cache volumes
description: Understand the considerations and requirements for Azure NetApp Files cache volumes. 
services: azure-netapp-files
author: netapp-manishc
ms.service: azure-netapp-files
ms.topic: concept-article
ms.date: 03/09/2026
ms.author: anfdocs
ms.custom: references_regions
---
# Requirements and considerations for Azure NetApp Files cache volumes

Before you configure [cache volumes](configure-cache-volumes.md), make sure that you understand the requirements for each option. 

## Requirements and considerations

* Cache volumes are currently only supported with the REST API (new caches endpoint).
* The Azure NetApp Files cache volume must be deployed in an availability zone. To populate a new or existing volume in an availability zone, see [Manage availability zones in Azure NetApp Files](manage-availability-zone-volume-placement.md). 
* When creating a cache volume, ensure that there's sufficient space in the capacity pool to accommodate the new cache volume.
* You should ensure that the protocol type is the same for the cache volume and origin volume. The security style and the Unix permissions are inherited from the origin volume. For example, creating a cache volume with NFSv3 or NFSv4 when origin is UNIX, and SMB when the origin is NTFS.
* You should enable encryption on the origin volume.
* The source cluster must be running ONTAP 9.15.1 or later version.
* You should configure an Active Directory (AD) or LDAP connection within the NetApp account to create an LDAP-enabled cache volume.
* You can't move a cache volume to another capacity pool.
* The `globalFileLocking` parameter value must be the same on all cache volumes that share the same origin volume. Global file locking can be enabled when creating the first cache volume by setting `globalFileLocking` to true. The subsequent cache volumes from the same origin volume must have this setting set to true. To change the global file locking setting on existing cache volumes, you must update the origin volume first. After updating the origin volume, the change propagates to all the cache volumes associated with that origin volume. The `volume flexcache origin config modify -is-global-file-locking-enabled` command should be executed on the source cluster to change the setting on the origin volume.
* The volume security style for a cache volume is inherited from the external ONTAP origin volume only at creation time and is not a configurable parameter on a cache volume. If the security style is changed on the external origin volume, the cache volume must be deleted and recreated with the correct protocol choice to align to the security styles.

    | Origin Volume Security Style |  Cache volume protocol |  Resultant cache volume security style |
    |-|-|-|
    | UNIX  | NFS  |  UNIX |
    | NTFS  | SMB  | NTFS  |
    | MIXED  | NFS or SMB  |  MIXED (unsupported) |

   >[!NOTE]
   >MIXED security style coming from the origin volume configuration will be inherited by the cache volume but is unsupported in Azure NetApp Files if file access issues arise.
  

### Networking considerations 

* Cache volumes only support Standard network features. Basic network features can't be configured on cache volumes. 
* The delegated subnet address space for hosting the Azure NetApp Files volumes must have at least seven free IP addresses: six for cluster peering and one for data access to one or more cache volumes.
    * Ensure that the delegated subnet address space is sized appropriately to accommodate the Azure NetApp Files network interfaces. Review the [guidelines for Azure NetApp Files network planning](azure-netapp-files-network-topologies.md) to ensure you meet the requirements for delegated subnet sizing.
* When creating each cache volume, the Azure NetApp Files volume placement algorithm attempts to reuse the same Azure NetApp Files storage system as any previously created cache volumes in the subscription to reduce the number of network interface cards (NICs)/IPs consumed in the delegated subnet. If this isn't possible, another 6+1 NICs are consumed.
* You can't use the same source cluster for multiple subscriptions for creating cache volumes in the same availability zone in the same region.
* When creating a cache volume, subnets need to be specified for the cache volume (cacheSubnetResourceId) and for cluster peering (peeringSubnetResourceId). 
    * The same subnet can be specified for both cache volume and cluster peering (but the subnet must have the Microsoft.Netapp/volumes delegation).
    * When different subnets are used, each subnet needs to be on a different VNET and each subnet must have the Microsoft.Netapp/volumes delegation.

### Write-back considerations 

If you're enabling write-back on the external origin volume:

* You must be running ONTAP 9.15.1P5 or later on the system hosting the external origin volume. 
* Each external origin system node has at least 128 GB of RAM and 20 CPUs to absorb the write-back messages initiated by write-back enabled caches. This is the equivalent of an A400 or greater. If the origin cluster serves as the origin to multiple write-back enabled Azure NetApp Files cache volumes, it requires more CPUs and RAM.
* Testing is executed for files smaller than 100 GB and WAN roundtrip times between the cache and origin not exceeding 100 milliseconds. Any workloads outside of these limits might result in unexpected performance characteristics.
* The external origin must remain less than 80% full. Cache volumes aren't granted exclusive lock delegations if there isn't at least 20% space remaining in the origin volume. Calls to a write-back-enabled cache are forwarded to the origin in this situation. This helps prevent running out of space at the origin, which would result in leaving dirty data orphaned at a write-back-enabled cache.

### Interoperability considerations 

You can't use cache volumes if the following features are configured on the origin or cache: 

>[!NOTE]
> File Access Logs (FAL) for cache volumes isn't currently supported. Although diagnostic settings might be available for cache volumes, enabling diagnostic settings on a cache volume to configure File Access Logs has no effect.

#### Unsupported features

The following features can't be used with Azure NetApp Files cache volumes:

* Application volume groups
* Azure NetApp Files backup
* Cross-region, cross-zone, and cross-zone-region replication
* FlexCache disaster recovery
* NFSv4.2
* Ransomware protection
* Snapshot policies
* S3 Buckets

#### Supported features

The following features are supported with cache volumes:

* Availability zone volume placement
* Customer-managed keys
* Lightweight Directory Access Protocol (LDAP)
* NFSv3 and NFSv4.1, SMB, and dual-protocol (NFS and SMB)
* Kerberos

>[!NOTE]
>You can't transition noncustomer managed key cache volumes to customer managed key.
