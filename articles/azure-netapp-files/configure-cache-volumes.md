---
title: Configure a cache volume for Azure NetApp Files 
description: This article shows you how to create a cache volume in Azure NetApp Files. 
services: azure-netapp-files
author: netapp-manishc
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 12/09/2025
ms.author: anfdocs
ms.custom: sfi-image-nochange
# Customer intent: As a cloud administrator, I want to create a cache volume in Azure NetApp Files, so that I can leverage scalable storage solutions and reduce cost.
---
# Configure a cache volume for Azure NetApp Files (preview)

The purpose of this article is to provide users of Azure NetApp Files with cache volumes that simplify file distribution, reduce WAN latency, and lower WAN/ExpressRoute bandwidth costs. Azure NetApp Files cache volumes are currently designed to be peered with external sources—origin volumes in on-premises ONTAP, Cloud Volumes ONTAP, or Amazon FSx for NetApp.

Azure NetApp Files cache volumes are cloud-based caches of an external origin volume, containing only the most actively accessed data on the volume. Cache volumes accept both reads and writes but operate at faster speeds with reduced latency. When a cache volume receives a read request of the hot data it contains, it can respond faster than the origin volume because the data doesn't need to travel as far to reach the client. If a cache volume receives a read request for infrequently read data (cold data), it retrieves the needed data from the origin volume and then stores the data before serving the client request. Subsequent read requests for that data are then served directly from the cache volume. After the first request, the data no longer needs to travel across the network or be served from a heavily loaded system.

Write-back allows the write to be committed to stable storage at the cache and acknowledges the client without waiting for the data to make it to the origin. This results in a globally distributed file system that enables writes to perform at near-local speeds for specific workloads and environments, offering significant performance benefits whereas write-around waits for the origin to commit the writes to the stable storage before acknowledging the client. This results in every write incurring the penalty of traversing the network between the cache and origin.  

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

You can't use cache volumes if the following features are configured on the source or destination: 

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

## Register the feature

Cache volumes for Azure NetApp Files are currently in preview. You need to register the feature before using it for the first time. After registration, the feature is enabled and works in the background. 

1. Register the feature: 

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFCacheVolumesExternal 
    ```

2. Check the status of the feature registration: 

    > [!NOTE]
    > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to`Registered`. Wait until the status is **Registered** before continuing.

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFCacheVolumesExternal 
    ```

You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status.

## Before you begin

You must create ExpressRoute or VPN resources to ensure network connectivity from the external NetApp ONTAP cluster to the target Azure NetApp Files cluster. The connectivity can be accomplished in many ways with the goal being that the source cluster has connectivity to the Azure NetApp Files delegated subnet. Connectivity includes this set of firewall rules (bidirectional for all):

* ICMP
* TCP 11104 
* TCP 11105 
* HTTPS
  
The network connectivity must be in place for all intercluster (IC) LIFs on the source cluster to all IC LIFs on the Azure NetApp Files endpoint.

## Create a cache volume

1.	Initiate the cache volume creation using the PUT caches API call. For information about cache operations, see [API documentation](/rest/api/netapp/caches?view=rest-netapp-2025-09-01-preview&preserve-view=true).

      ```
       PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/capacityPools/{poolName}/caches/{cacheName}?api-version=2025-09-01-preview 
      ```
2.  Monitor if the cache state is available for cluster peering with a GET request.

      ```
      GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/capacityPools/{poolName}/caches/{cacheName}?api-version=2025-09-01-preview
      ```

    When the `cacheState = ClusterPeeringOfferSent`, execute the POST `listPeeringPassphrases` call to obtain the command and passphrase necessary to complete the cluster peering.

    Example listPeeringPassprhases:

      ```
      POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/capacityPools/{poolName}/caches/{cacheName}/listPeeringPassphrases?api-version=2025-09-01-preview 
      ```
      Example Response: 
   
       ```
         {
         "clusterPeeringCommand": "cluster peer create -ipspace <IP-SPACE-NAME> -encryption-protocol-proposed tls-psk -peer-addrs 1.1.1.1,1.1.1.2,1.1.1.3,1.1.1.4,1.1.1.5,1.1.1.6",
         "cachePeeringPassphraseExample": "AUniquePassphrase",
         "vserverPeeringCommand": "vserver peer accept -vserver vserver1 -peer-vserver cache_volume_svm"
         } 
      ```
    
    Execute the `clusterPeeringCommand` on the ONTAP system that contains the external origin volume and when prompted, enter the clusterPeeringPassphrase.  

    > [!NOTE]
    > You have 30 minutes after the `cacheState` transitions to `ClusterPeeringOfferSent` to execute the `clusterPeeringCommand`. If you don't execute the command within 30 minutes, cache creation fails. You'll need to delete the cache volume and initiate a new PUT call.

    > [!NOTE]
    > Replace `IP-SPACE-NAME` with the IP space that the IC LIFs use on the external origin volume’s ONTAP system.

    > [!NOTE]
    > Don't execute the `vserverPeeringCommand` until the next step.

    > [!NOTE]
    > If cache volumes are already created using this ONTAP system, then the existing cluster peer is reused. There can be situations where a different Azure NetApp Files cluster might be used, which requires a new cluster peer.

3.	Monitor if the cache state is available for storage VM peering using a GET request.

    ```
  	GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/capacityPools/{poolName}/caches/{cacheName}?api-version=2025-09-01-preview  
    ```
    When the `cacheState = VserverPeeringOfferSent`, go to the ONTAP system that contains the external origin volume and execute the `vserver peer show` command until an entry appears where the remote storage VM displays the `<value of the -peer-vserver in the vserverPeeringCommand>`. The peer state shows "pending."

    Execute the `vserverPeeringCommand` on the ONTAP system that contains the external origin volume. The peer state should transition to "peered."

    > [!NOTE]
    > You have 12 minutes after the `cacheState` transitions to `VserverPeeringOfferSent` to complete execution of the `vserverPeeringCommand`. If you don't execute the command within 12 minutes, cache creation fails. You'll need to delete the cache volume and initiate a new PUT request.

    > [!NOTE]
    > If cache volumes are already created using this ONTAP system and the cluster peer was reused, then the existing vserver peer may be reused. If that happens, you'll skip step three and the next step will be executed.

4.	Complete the cache volume creation.

    Once the peering completes, the cache volume is created. Monitor the `cacheState` and `provisioningState` of the cache volume with a GET request. When the cacheState and provisioningState transition to "Succeeded," the cache volume is ready for use.

## Cache creation request body examples

# [NFS](#tab/NFS)

```
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/capacityPools/{poolName}/caches/{cacheName}?api-version=2025-09-01-preview 

Body:
{
  "location": "westus",
  "zones": [
    "1"
  ],
  "properties": {
    "filepath": "cache1",
    "size": 53687091200,
    "protocolTypes": [
      "NFSv4"
    ],
    "cacheSubnetResourceId": "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet1/subnets/subnet1",
    "peeringSubnetResourceId": "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet1/subnets/subnet1",
    "encryptionKeySource": "Microsoft.NetApp",
    "originClusterInformation": {
      "peerClusterName": "origin_cluster",
      "peerAddresses": [
        "1.2.3.4"
      ],
      "peerVserverName": "origin_svm",
      "peerVolumeName": "origin_volume"
    },
    "exportPolicy": {
      "rules": [
        {
          "ruleIndex": 1,
          "unixReadOnly": "true",
          "unixReadWrite": "false",
          "kerberos5ReadOnly": "false",
          "kerberos5ReadWrite": "false",
          "kerberos5iReadOnly": "false",
          "kerberos5iReadWrite": "false",
          "kerberos5pReadOnly": "false",
          "kerberos5pReadWrite": "false",
          "nfsv3": "false",
          "nfsv41": "true",
          "allowedClients": "0.0.0.0/0"
        }
      ]
    }
  }
}
```

# [SMB](#tab/SMB)

```
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/capacityPools/{poolName}/caches/{cacheName}?api-version=2025-09-01-preview 

Body:
{
  "zones": [
    "2"
  ],
  "location": "southcentralus",
  "properties": {
    "filepath": "smb-cache",
    "cacheSubnetResourceId": "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet1/subnets/subnet1",
    "peeringSubnetResourceId": "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet1/subnets/subnet1",
    "size": 53687091200,
    "protocolTypes": [
      "SMB"
    ],
    "encryptionKeySource": "Microsoft.NetApp",
    "originClusterInformation": {
      "peerClusterName": "origin_cluster",
      "peerAddresses": [
        "1.2.3.4"
      ],
      "peerVserverName": "origin_svm",
      "peerVolumeName": "origin_volume"
    }
  }
}
```

# [Dual-protocol](#tab/DualProtocol)

```
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/capacityPools/{poolName}/caches/{cacheName}?api-version=2025-09-01-preview 

Body:
{
  "zones": ["2"],
  "location": "southcentralus",
  "properties": {
    "filepath": "dual-cache2",
    "cacheSubnetResourceId": "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet1/subnets/subnet1",
    "peeringSubnetResourceId": "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet1/subnets/subnet1",
    "size": 53687091200,
    "encryptionKeySource": "Microsoft.NetApp",
    "writeBack": "Enabled",
    "protocolTypes": [
    "SMB",
    "NFSv3"
    ],
    "exportPolicy": {
     "rules": [
    {
        "ruleIndex": 1,
        "unixReadOnly": "true",
        "unixReadWrite": "false",
        "kerberos5ReadOnly": "false",
        "kerberos5ReadWrite": "false",
        "kerberos5iReadOnly": "false",
        "kerberos5iReadWrite": "false",
        "kerberos5pReadOnly": "false",
        "kerberos5pReadWrite": "false",
        "nfsv3": "false",
        "nfsv41": "true",
        "allowedClients": "0.0.0.0/0"
    }
    ]
    },
    "originClusterInformation": {
      "peerClusterName": "origin_cluster",
      "peerAddresses": [
      "1.2.3.4"
    ],
    "peerVserverName": "origin_svm",
    "peerVolumeName": "origin_volume"
    }
    }
    }
```

# [LDAP](#tab/LDAP)

```
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/capacityPools/{poolName}/caches/{cacheName}?api-version=2025-09-01-preview 

Body:
{
  "location": "westus",
  "zones": [
    "1"
  ],
  "properties": {
    "filepath": "cache1",
    "size": 53687091200,
    "protocolTypes": [
      "NFSv4"
    ],
    "cacheSubnetResourceId": "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet1/subnets/subnet1",
    "peeringSubnetResourceId": "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet1/subnets/subnet1",
    "encryptionKeySource": "Microsoft.NetApp",
    "originClusterInformation": {
      "peerClusterName": "origin_cluster",
      "peerAddresses": [
        "1.2.3.4"
      ],
      "peerVserverName": "origin_svm",
      "peerVolumeName": "origin_volume"
    },
    "ldap": "Enabled", 
    "ldapServerType": "OpenLDAP",
    "exportPolicy": {
      "rules": [
        {
          "ruleIndex": 1,
          "unixReadOnly": "true",
          "unixReadWrite": "false",
          "kerberos5ReadOnly": "false",
          "kerberos5ReadWrite": "false",
          "kerberos5iReadOnly": "false",
          "kerberos5iReadWrite": "false",
          "kerberos5pReadOnly": "false",
          "kerberos5pReadWrite": "false",
          "nfsv3": "false",
          "nfsv41": "true",
          "allowedClients": "0.0.0.0/0"
        }
      ]
    }
  }
}
```
---

## Update a cache volume

Example patch request body to update a cache volume:

```
PATCH
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/capacityPools/{poolName}/caches/{cacheName}?api-version=2025-09-01-preview

Example Body:
{
  "properties": {
    "writeBack": "Disabled"
  }
} 
```

## Delete a cache volume

You can delete a cache volume if it's no longer required using a DELETE API call.

```
DELETE
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/capacityPools/{poolName}/caches/{cacheName}?api-version=2025-09-01-preview
```

If the cache volume has `writeBack` enabled, issue a PATCH call to disable `writeBack` then issue the DELETE request. 
