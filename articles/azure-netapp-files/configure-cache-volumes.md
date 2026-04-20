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
# Configure a cache volume for Azure NetApp Files

The purpose of this article is to provide users of Azure NetApp Files with cache volumes that simplify file distribution, reduce WAN latency, and lower WAN/ExpressRoute bandwidth costs. Azure NetApp Files cache volumes are currently designed to be peered with external sources—origin volumes in on-premises ONTAP, Cloud Volumes ONTAP, or Amazon FSx for NetApp.

Azure NetApp Files cache volumes are cloud-based caches of an external origin volume, containing only the most actively accessed data on the volume. Cache volumes accept both reads and writes but operate at faster speeds with reduced latency. When a cache volume receives a read request of the hot data it contains, it can respond faster than the origin volume because the data doesn't need to travel as far to reach the client. If a cache volume receives a read request for infrequently read data (cold data), it retrieves the needed data from the origin volume and then stores the data before serving the client request. Subsequent read requests for that data are then served directly from the cache volume. After the first request, the data no longer needs to travel across the network or be served from a heavily loaded system.

Write-back allows the write to be committed to stable storage at the cache and acknowledges the client without waiting for the data to make it to the origin. This results in a globally distributed file system that enables writes to perform at near-local speeds for specific workloads and environments, offering significant performance benefits whereas write-around waits for the origin to commit the writes to the stable storage before acknowledging the client. This results in every write incurring the penalty of traversing the network between the cache and origin.  

## Before you begin

You must create ExpressRoute or VPN resources to ensure network connectivity from the external NetApp ONTAP cluster to the target Azure NetApp Files cluster. The connectivity can be accomplished in many ways with the goal being that the source cluster has connectivity to the Azure NetApp Files delegated subnet. Connectivity includes this set of firewall rules (bidirectional for all):

* ICMP
* TCP 11104 
* TCP 11105 
* HTTPS
  
The network connectivity must be in place for all intercluster (IC) LIFs on the source cluster to all IC LIFs on the Azure NetApp Files endpoint.

## Create a cache volume

  > [!NOTE]
  > SMB protocol cache volume cannot be created when the NetApp account is configured with shared Active Directory. You should [configure the account with dedicated Active Directory connections](create-active-directory-connections.md#multi-ad) to create SMB protocol cache volumes.

1.	Initiate the cache volume creation using the PUT caches API call. For information about cache operations, see [API documentation](/rest/api/netapp/caches?view=rest-netapp-2026-01-01&preserve-view=true).

      ```
      PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/capacityPools/{poolName}/caches/{cacheName}?api-version=2026-01-01
      ```
   
2.  Monitor if the cache state is available for cluster peering with a GET request.

      ```
      GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/capacityPools/{poolName}/caches/{cacheName}?api-version=2026-01-01
      ```

    When the `cacheState = ClusterPeeringOfferSent`, execute the POST `listPeeringPassphrases` call to obtain the command and passphrase necessary to complete the cluster peering.

    Example listPeeringPassprhases:

      ```
      POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/capacityPools/{poolName}/caches/{cacheName}/listPeeringPassphrases?api-version=2026-01-01
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
  	GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/capacityPools/{poolName}/caches/{cacheName}?api-version=2026-01-01
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

  > [!NOTE]
  > The peerClusterName needs to exactly match the name of the external cluster hosting the origin volume.

# [NFS](#tab/NFS)

```
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/capacityPools/{poolName}/caches/{cacheName}?api-version=2026-01-01

Body:
{
  "location": "westus",
  "zones": [
    "1"
  ],
  "properties": {
    "filePath": "cache1",
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
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/capacityPools/{poolName}/caches/{cacheName}?api-version=2026-01-01

Body:
{
  "zones": [
    "2"
  ],
  "location": "southcentralus",
  "properties": {
    "filePath": "smb-cache",
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
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/capacityPools/{poolName}/caches/{cacheName}?api-version=2026-01-01

Body:
{
  "zones": ["2"],
  "location": "southcentralus",
  "properties": {
    "filePath": "dual-cache2",
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
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/capacityPools/{poolName}/caches/{cacheName}?api-version=2026-01-01

Body:
{
  "location": "westus",
  "zones": [
    "1"
  ],
  "properties": {
    "filePath": "cache1",
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
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/capacityPools/{poolName}/caches/{cacheName}?api-version=2026-01-01

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
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/capacityPools/{poolName}/caches/{cacheName}?api-version=2026-01-01
```

If the cache volume has `writeBack` enabled, issue a PATCH call to disable `writeBack` then issue the DELETE request. 

## Modify cluster peering

You can update the peer addresses associated with an existing cluster peer by using a POST API call.

> [!NOTE]
> * You should provide the full set of peer addresses to be used by the cluster peer (not just new ones or ones that have changed).
> * You should execute the modifyClusterPeer call against one cache volume using the cluster peer.

```
POST
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/capacityPools/{poolName}/caches/{cacheName}/modifyClusterPeer?api-version=2026-01-01

Example body:

{ newPeerAddresses": [ "1.1.1.1“,”1.1.1.2” ] }

```