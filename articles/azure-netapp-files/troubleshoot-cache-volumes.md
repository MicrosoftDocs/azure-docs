---
title: Troubleshoot cache volume errors for Azure NetApp Files
description: Describes error messages and resolutions that can help you troubleshoot Azure NetApp Files cache volumes.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.topic: troubleshooting
ms.date: 11/03/2026
ms.author: anfdocs
# Customer intent: As a cloud administrator, I want to troubleshoot cache volume errors for Azure NetApp Files, so that I can resolve creation, update, and deletion failures and keep my cache volumes available.
---
# Troubleshoot cache volume errors for Azure NetApp Files

This article describes error messages you might encounter when you create, update, or delete Azure NetApp Files cache volumes (the `caches` resource type, `Microsoft.NetApp/netAppAccounts/capacityPools/caches`). It also suggests resolutions for each error.

If a cache volume create-read-update-delete (CRUD) operation runs on a cache volume that isn't in a terminal state, the operation fails. Automation workflows should check that the cache volume's `provisioningState` is `Succeeded` or `Failed` before they start another asynchronous operation on the cache volume.

## Understand the cache volume creation workflow

A cache volume isn't ready when the `PUT` request returns. Creation finishes only after the external ONTAP origin cluster accepts the cluster and storage virtual machine (SVM) peering requests. Many creation errors happen because a step in this workflow didn't finish in time. The workflow is:

1. Send a `PUT` request on the `caches` resource. The `provisioningState` is `Creating`.
1. Poll the cache volume with `GET` requests until `cacheState` is `ClusterPeeringOfferSent`.
1. Call the `listPeeringPassphrases` action and run the returned cluster peering command (`clusterPeeringCommand`) on the origin cluster before the peering offer expires.
1. When `cacheState` is `VserverPeeringOfferSent`, run the SVM peering command (`vserverPeeringCommand`) returned by `listPeeringPassphrases` on the origin cluster.
1. When `cacheState` and `provisioningState` are both `Succeeded`, the cache volume is ready for use.

For more information, see [Configure a cache volume for Azure NetApp Files](configure-cache-volumes.md) and [Requirements and considerations for Azure NetApp Files cache volumes](cache-requirements.md).

## Errors for cache volume properties

|     Error conditions    |     Resolutions    |
|--|----|
| Cache volume creation or resize fails with the error: <br> `An invalid value '<size>' was received for properties.size. Must be a whole number of gibibytes expressed in bytes.` | The `size` property is specified in bytes and must be an exact multiple of 1 GiB (1,073,741,824 bytes). Round the value to a whole number of gibibytes, convert it to bytes, and try again. |
| Cache volume creation or resize fails with the error: <br> `An invalid value '<size>' was received for properties.size. Must be 50 gibibytes in bytes or higher.` | The requested size is below the minimum cache volume size. Set `size` to at least 50 GiB (53,687,091,200 bytes). |
| Cache volume creation or resize fails with the error: <br> `An invalid value '<size>' was received for properties.size. Must be 1048576 gibibytes, specified in bytes, or lower.` | The requested size is above the maximum cache volume size of 1 PiB. Set `size` to 1,048,576 GiB (1,125,899,906,842,624 bytes) or lower. |
| Cache volume creation fails with the error: <br> `Missing value for required property 'properties.protocolTypes'. Please provide at least one protocol type and try again.` | The `protocolTypes` property is missing or is an empty array (`[]`). Specify at least one protocol type, such as `NFSv3`, `NFSv4`, or `SMB`. The security style is inherited from the origin volume, so choose the protocol that matches it (`NFSv3` or `NFSv4` for UNIX, `SMB` for NTFS). A mismatch can cause file access problems after the cache volume is created. |
| Cache volume creation fails with the error: <br> `The peer volume name, <name>, provided in 'originClusterInformation.peerVolumeName' is invalid. It must start with a letter (a-z or A-Z), can only contain letters, digits, hyphens (-), or underscores (_), and must be between 1 and 64 characters long.` | Set `originClusterInformation.peerVolumeName` to the exact name of the origin volume on the external ONTAP cluster. Ensure the value follows the naming rules in the message. |
| Cache volume creation fails with the error: <br> `The peer cluster name, '<name>', provided in 'originClusterInformation.peerClusterName' is invalid. The name must start with a letter (a-z or A-Z), end with a letter or digit, and be between 2 and 44 characters long. ... the name cannot be one of the reserved values: 'all', 'cluster', 'local', 'localhost'.` | Set `originClusterInformation.peerClusterName` to the name of the origin ONTAP cluster. To find the cluster name, run `cluster identity show` on the origin cluster. |
| Cache volume creation fails with the error: <br> `The property 'properties.originClusterInformation.peerVserverName' with value '<name>' must not contain leading or trailing whitespace.` | Remove any spaces before or after the SVM name in `originClusterInformation.peerVserverName` and try again. |
| Cache volume creation fails with the error: <br> `The property 'peerAddresses' with value '<address>' is not a valid IPv4 address. Please provide a valid IPv4 address (e.g., '10.0.0.1') and try again.` | Each entry in `originClusterInformation.peerAddresses` must be the IPv4 address of an intercluster logical interface (LIF) on the origin cluster. To list intercluster LIFs, run `network interface show -role intercluster` on the origin cluster. |
| Cache volume creation fails with the error: <br> `Cannot specify KeyVaultPrivateEndpointResourceId property when using NetApp EncryptionKeySource.` | `keyVaultPrivateEndpointResourceId` applies only to customer-managed keys. Either remove `keyVaultPrivateEndpointResourceId` from the request, or set `encryptionKeySource` to `Microsoft.KeyVault`. |

## Errors for cache volume networking

|     Error conditions    |     Resolutions    |
|--|----|
| Cache volume creation fails with the error: <br> `The selected VNet '<vnetName>' in resource group '<resourceGroupName>' has multiple delegated subnets (<subnet1>, <subnet2>). If specifying different values for 'cacheSubnetResourceId' and 'peeringSubnetResourceId' with 'Microsoft.NetApp/volumes' delegation, ensure they reside on different VNets.` | A virtual network (VNet) can contain only one subnet delegated to `Microsoft.NetApp/volumes`. Try one of the following solutions: <ul><li>Use the same subnet for both `cacheSubnetResourceId` and `peeringSubnetResourceId`.</li> <li>Use different VNets when specifying different cache and peering subnets.</li></ul> |
| Cache volume creation fails with the error: <br> `The cache volume cannot be created as the delegated subnet '<subnetResourceId>' does not have enough IP addresses available. Either try cleaning up IP addresses on this subnet or use a different subnet and try again.` | The delegated subnet needs at least seven free IP addresses: six for cluster peering and one for data access. Free IP addresses on the subnet, or specify a larger subnet. See [Guidelines for Azure NetApp Files network planning](azure-netapp-files-network-topologies.md). |
| Cache volume creation fails with the error: <br> `Cross-subscription peering is not supported within the same availability zone. A cluster peer to '<clusterName>' already exists in subscription '<subscriptionId>' for this zone.` | You can't use the same origin cluster from more than one subscription for cache volumes in the same availability zone in the same region. Try one of the following solutions: <ul><li>Create the cache volume in the subscription that already has the cluster peer.</li> <li>Create the cache volume in a different availability zone.</li></ul> |
| Cache volume creation fails because the origin cluster can't reach the cache volume, and the cluster peer is never accepted. | Ensure that ExpressRoute or VPN connectivity exists between the origin cluster and the Azure NetApp Files delegated subnet. The following traffic must be allowed in both directions between all intercluster LIFs on the origin cluster and the cache volume: <ul><li>ICMP</li> <li>TCP 11104</li> <li>TCP 11105</li> <li>HTTPS</li></ul> |

## Errors for cluster and SVM peering

|     Error conditions    |     Resolutions    |
|--|----|
| The `listPeeringPassphrases` action fails with the error: <br> `The cache <cacheResourceId>, peering passphrases is not yet available. Please try again.` | The cache volume didn't send the cluster peering offer yet. Poll the cache volume until `cacheState` is `ClusterPeeringOfferSent`, then call `listPeeringPassphrases` again. |
| The `listPeeringPassphrases` action fails with the error: <br> `The cache <cacheResourceId>, cluster and vserver peering are already in succeeded state.` | Peering is already complete, so you don't need to run the peering commands again. Monitor `cacheState` and `provisioningState` until they're `Succeeded`. |
| The `listPeeringPassphrases` action fails with the error: <br> `The cache <cacheResourceId> is in invalid state, expected provisioning state is creating.` | Peering passphrases are only available while the cache volume is being created. If the cache volume is `Failed`, delete it and create it again. |
| Cache volume creation fails with the error: <br> `The cluster peer was not accepted within 30 minutes. Retry by issuing a PUT on your cache resource '<cacheName>'. Then GET the cache resource and run properties.setupInformation.command on your cluster.` | The cluster peer offer expired before the origin cluster accepted it. To resolve the issue: <ol><li>Delete the failed resource. If the cluster peer command was executed on the origin cluster after the cluster peer offer expired, delete that cluster peer with a `cluster peer delete` command.</li> <li>Send the same `PUT` request on the cache volume again.</li> <li>Wait until `cacheState` is `ClusterPeeringOfferSent`.</li> <li>Call `listPeeringPassphrases` and run the returned command on the origin cluster before the offer expires.</li> <li>If the command fails on the origin cluster, check the network connectivity requirements in [Errors for cache volume networking](#errors-for-cache-volume-networking).</li></ol> |
| Cache volume creation fails with the error: <br> `Failed to create the cache volume because the value in 'properties.originClusterInformation.peerClusterName' does not match the actual cluster name.` | The cluster that accepted the peering request has a different name than the one in the request. Run `cluster identity show` on the origin cluster, update `originClusterInformation.peerClusterName` to match it exactly, and try again. |
| Cache volume creation fails with the error: <br> `Cache creation timed out because the Vserver peering was not accepted on the external cluster. Please delete <cacheName> and retry the operation.` | The SVM peering request wasn't accepted on the origin cluster in time. Delete the failed cache volume and create it again. During creation, when `cacheState` is `VserverPeeringOfferSent`, run the `vserverPeeringCommand` returned by `listPeeringPassphrases` on the origin cluster. |
| Cache volume creation fails with the error: <br> `Cache creation failed because the Vserver peering to the external cluster's Vserver failed. Please delete <cacheName> and retry the operation.` | Ensure that `originClusterInformation.peerVserverName` is the exact name of the SVM that hosts the origin volume, and that the SVM is running. Delete the failed cache volume and create it again. If the issue persists, contact Support and provide the correlation ID from the message. |
| Cache volume creation fails with the error: <br> `Failed to create the cache volume because the origin volume information could not be retrieved. Please verify that the origin volume's underlying storage is healthy, then retry the operation.` | Run `volume show -vserver <svmName> -volume <volumeName>` on the origin cluster to make sure the origin volume exists, is online, and is in the SVM specified in `peerVserverName`. Then delete the failed cache volume and create it again. |
| Cache volume creation with write-back enabled fails with the error: <br> `Cache Volume creation failed due to incorrect originVolume name. Please verify that provided originVolume resides within the specified originVserver.` | The origin volume wasn't found in the specified SVM. Correct `originClusterInformation.peerVolumeName` and `originClusterInformation.peerVserverName`, delete the failed cache volume, and create it again. |
| Cache volume creation fails with the error: <br> `On the external ONTAP cluster, the wrong passphrase was entered.` | A cluster peer is generated on the external cluster but stays in pending status, waiting for acceptance on the Azure NetApp Files side. This causes the cluster peer acceptance for the cache resource to time out after 30 minutes, because it never received acceptance from the external cluster with the correct passphrase. To correct this, delete the cluster peer on the external cluster. If the cache resource has not timed out, run the cluster peer command again on the external cluster and provide the correct passphrase when prompted. If the cache resource has timed out, delete the failed resource and then send the same  `PUT ` request to create the cache resource again.|


## Errors for origin cluster versions and cache features

|     Error conditions    |     Resolutions    |
|--|----|
| Cache volume creation fails with the error: <br> `An effective cluster version of 9.15.1 or later is required on all nodes of an external cluster, please ensure that the external cluster nodes are updated accordingly.` | Cache volumes require ONTAP 9.15.1 or later on every node of the origin cluster. Run `cluster image show` on the origin cluster to check node versions. Upgrade any nodes running an earlier version, then delete the failed cache volume and create it again. |
| A cache volume update fails with the error: <br> `An effective cluster version of 9.15.1 or later is required on all nodes of an external cluster to perform this operation.` | The requested operation requires ONTAP 9.15.1 or later on every node of the origin cluster. Upgrade the origin cluster, then retry the operation. |
| Cache volume creation fails with the error: <br> `Creating a cache with 'WriteBack' enabled requires an effective cluster version of 9.15.1 or later on all nodes of an external cluster.` | The origin cluster doesn't meet the version requirements for write-back. See [Write-back considerations](cache-requirements.md#write-back-considerations). Upgrade the origin cluster to a supported version, or create the cache volume with `writeBack` set to `Disabled`. |
| Cache volume creation fails with the error: <br> `'WriteBack' and 'CifsChangeNotifications' are not supported with ONTAP version 9.13.` | Remove `writeBack` and `cifsChangeNotifications` from the request, or upgrade the origin cluster to a version that supports write-back. See [Write-back considerations](cache-requirements.md#write-back-considerations). Then delete the failed cache volume and create it again. |
| Cache volume creation fails with the error: <br> `'WriteBack' is not supported with ONTAP version 9.14.` | Remove `writeBack` from the request, or upgrade the origin cluster to a version that supports write-back. See [Write-back considerations](cache-requirements.md#write-back-considerations). Then delete the failed cache volume and create it again. |
| Cache volume creation fails with the error: <br> `Global file locking (GFL) mode is already enabled for the external volume. Disabling GFL is only supported when the first external volume is created. Please set 'GlobalFileLocking' to 'true'.` | All cache volumes that share an origin volume must use the same `globalFileLocking` value. Set `globalFileLocking` to `true` to match the existing cache volumes. To disable the setting for all cache volumes, run `volume flexcache origin config modify -is-global-file-locking-enabled false` on the origin cluster. |
| Cache volume creation fails with the error: <br> `Global file locking (GFL) mode is already disabled for the external volume. Enabling GFL is only supported when the first external volume is created. Please set 'GlobalFileLocking' to 'false'.` | Set `globalFileLocking` to `false` to match the existing cache volumes for this origin volume. To enable the setting for all cache volumes, run `volume flexcache origin config modify -is-global-file-locking-enabled true` on the origin cluster. |

## Errors for write-back

|     Error conditions    |     Resolutions    |
|--|----|
| Cache volume creation fails with the error: <br> `The peerVolume '<volumeName>' has reached the maximum number of cache volume relationships. Please delete an existing cache volume before creating a new one.` | The origin volume reached the maximum number of cache volumes it supports. Delete a cache volume that you no longer need for this origin volume, and then try again. |
| Cache volume creation or update fails with the error: <br> `The peerVolume '<volumeName>' has reached the maximum number of write-back enabled cache volumes.` | The origin volume reached the maximum number of write-back cache volumes. Either disable `writeBack` on an existing cache volume for this origin volume, or create the new cache volume with `writeBack` set to `Disabled`. |
| Deleting a cache volume fails with the error: <br> `Deleting a cache with 'WriteBack' enabled is not supported. Please disable 'WriteBack' and retry the delete operation.` | Cached writes must be flushed to the origin volume before the cache volume is deleted. Send a `PATCH` request that sets `writeBack` to `Disabled`, wait for `provisioningState` to be `Succeeded`, and then delete the cache volume. |

## Errors for protocols and export policies

|     Error conditions    |     Resolutions    |
|--|----|
| Cache volume creation fails with the error: <br> `Protocol type occurs more than once` | Remove the duplicate entries from `protocolTypes`. |
| Cache volume creation fails with the error: <br> `This combination of protocol types not supported.` | Cache volumes support a single protocol (NFSv3, NFSv4, or SMB) or a dual-protocol combination of SMB with either NFSv3 or NFSv4. NFSv3 and NFSv4 can't be combined. |
| Cache volume creation fails with the error: <br> `Kerberos feature not supported with NFSv3 and CIFS protocol.` | Kerberos is supported only for NFSv4.1 cache volumes. Set `kerberos` to `Disabled`, or set `protocolTypes` to `NFSv4`. |
| Cache volume creation or update fails with the error: <br> `Mismatch between the kerberos state and exportPolicy rule's access type parameter values. Current cache volume kerberos state: <state>...` | When Kerberos is enabled, each export policy rule must set at least one of the `kerberos5*` access parameters to `true`, and both `unixReadOnly` and `unixReadWrite` must be `false`. When Kerberos is disabled, all `kerberos5*` access parameters must be `false`. |
| Cache volume creation fails with the error: <br> `Protocol type NFSv4 must have at least one export policy rule that does not contain NFSv3 as true` | NFSv4.1 cache volumes need at least one export policy rule with `nfsv41` set to `true` and `nfsv3` set to `false`. Add or correct the rule. |
| Cache volume creation fails with the error: <br> `Cannot specify export policy rules for non-NFS volume` | Export policies apply only to NFS. Remove the `exportPolicy` property from SMB-only cache volumes. |
| Cache volume creation fails with one of the following errors: <br> `Cannot specify NFSv4 export policy rules for non-NFSv4 volume` <br> `Cannot specify NFSv3 export policy rules for non-NFSv3 volume` | The export policy rules must match the protocol type. For NFSv3 cache volumes, set `nfsv3` to `true` and `nfsv41` to `false` on every rule. For NFSv4 cache volumes, set `nfsv41` to `true` and `nfsv3` to `false` on every rule. |
| Cache volume creation fails with the error: <br> `Number of items: <count> for object: ExportPolicy.Rules[RuleIndex] is outside min-max range.` | Cache volumes support a maximum of five export policy rules. Combine or remove rules so that no more than five remain. |
| Updating `protocolTypes` fails with one of the following errors: <br> `Protocol types can not be changed.` <br> `Protocol types can not be changed from <from> to <to>. The only allowed conversions are NFSv3 to NFSv4.1 or NFSv4.1 to NFSv3` | Only conversions between NFSv3 and NFSv4 (NFSv4.1) are supported. To use another protocol, create a new cache volume with the required protocol type. |
| Converting between NFSv3 and NFSv4.1 fails with the error: <br> `Converting between NFSv3 and NFSv4.1 is not available until the feature is registered.` | Register your subscription for the NFS protocol conversion feature, and then retry the update. See [Convert an NFS volume between NFSv3 and NFSv4.1](convert-nfsv3-nfsv41.md). |
| Converting an NFSv4.1 cache volume to NFSv3 fails with the error: <br> `Unable to convert volume from NFSv41 to NFSv3 as the 'KerberosEnabled' property is set to true...` | Kerberos isn't supported with NFSv3, so cache volumes with Kerberos enabled can't be converted to NFSv3. |

## Errors for SMB, dual-protocol, and LDAP cache volumes

Cache volumes that use SMB, dual-protocol, Kerberos, or LDAP depend on the Active Directory connection in the NetApp account. Errors from Active Directory, DNS, and LDAP are the same as for regular volumes. For those errors, see [Troubleshoot volume errors for Azure NetApp Files](troubleshoot-volumes.md).

|     Error conditions    |     Resolutions    |
|--|----|
| SMB cache volume creation fails with the error: <br> `SMB protocol cache volume cannot be created when the NetApp account is configured with shared Active Directory.` | SMB cache volumes require a dedicated Active Directory connection for the NetApp account. Configure the account with its own Active Directory connection. See [Understand guidelines for Active Directory Domain Services site design and planning](understand-guidelines-active-directory-domain-service-site.md). |
| Dual-protocol cache volume creation fails with the error: <br> `Dual protocol (NFS and SMB) cache volumes require LDAP to be enabled for user mapping between protocols. Set 'ldap' to 'Enabled' and specify a valid 'ldapServerType' to create this cache volume.` | Set `ldap` to `Enabled` and set `ldapServerType` to `ActiveDirectory` or `OpenLDAP`. Make sure the NetApp account has an Active Directory or LDAP connection configured. |
| LDAP-enabled cache volume creation fails with the error: <br> `Missing value for required property 'properties.ldapServerType'. Please provide a value for 'ldapServerType' and try again.` | When `ldap` is `Enabled`, `ldapServerType` is required. Set it to `ActiveDirectory` or `OpenLDAP`. |
| LDAP-enabled cache volume creation fails with the error: <br> `LDAP functionality for cache volumes is not supported for this region.` | LDAP-enabled cache volumes aren't available in this region yet. Create the cache volume without `ldap` and `ldapServerType`, or contact Support. |
| The `resetSmbPassword` action fails with the error: <br> `Cannot reset account password for cache volume with NFS in properties.protocolTypes, only cache volumes with SMB protocol can be reset.` | The SMB account password can be reset only on cache volumes that use the SMB protocol. |
| The `resetSmbPassword` action fails with the error: <br> `Resetting the SMB password on the account for the cache volume is not permitted.` | Register your subscription for the `ANFResetADAccountForVolume` feature, then retry. See [Create and manage Active Directory connections](create-active-directory-connections.md). |
| The `resetSmbPassword` action fails with the error: <br> `Cache volume is in a failed state, and the SMB account password could not be reset.` | The cache volume wasn't created successfully. Delete the cache volume and create it again, then retry the action. |

## Errors for cache volume updates

|     Error conditions    |     Resolutions    |
|--|----|
| Reducing the size of a cache volume fails with the error: <br> `The requested cache volume size: '<size>' is lower than what the cache volume is using: '<usage>'.` | A cache volume can't be smaller than the space it currently uses. Choose a size larger than the current usage. |
| A cache volume update fails with the error: <br> `The <operation> operation cannot be performed because the requested cache volume '<cacheName>' was not found or not created successfully. Please delete the cache volume and recreate it.` | The cache volume wasn't created successfully and can't be updated. Delete the cache volume and create it again. If the issue persists, contact Support and provide the correlation ID from the message. |
| A cache volume update fails with the error: <br> `Volume was not found or was not created successfully.` | The cache volume creation didn't finish. Delete the cache volume and create it again. |
| Creating or resizing a cache volume fails because the capacity pool doesn't have enough space. | Make sure the capacity pool has enough unallocated capacity for the new or resized cache volume, or resize the capacity pool. |

## Errors for cache volume actions

|     Error conditions    |     Resolutions    |
|--|----|
| The `modifyClusterPeer` action fails with the error: <br> `The Modify Cluster Peer request payload cannot be empty. Please populate the newPeerAddresses field and retry the request.` | Include the `newPeerAddresses` array in the request body. |
| The `modifyClusterPeer` action fails with the error: <br> `The number of peer addresses must be between 1 and 28.` | Specify between 1 and 28 intercluster LIF IP addresses in `newPeerAddresses`. |
| The `modifyClusterPeer` action fails with the error: <br> `The following peer addresses are duplicated in the request: <addresses>. Each peer IP address must be unique.` | Remove the duplicate IP addresses from `newPeerAddresses`. |
| The `modifyClusterPeer` action fails with the error: <br> `The requested peer addresses are identical to the current peer configuration.` | The new addresses match the current configuration, so no change is needed. To change the peer, include at least one IP address that's different from the current configuration. |
| The `breakFileLocks` action fails with the error: <br> `Unable to initiate break file locks operation as another break file locks operation is in progress.` | Wait for the current `breakFileLocks` operation to finish, then retry. |
| The `breakFileLocks` action fails with the error: <br> `The Break File Locks operation cannot be performed because the cache volume '<cacheName>' is in a failed state.` | The cache volume wasn't created successfully. Delete the cache volume and create it again. |
| The `breakFileLocks` action fails with the error: <br> `Failed to break all file locks on this volume due to some unexpected error.` | Retry the operation. If the issue persists, contact Support and provide the correlation ID from the message. |

## Errors for cache volume allocation

When you create a cache volume, Azure allocates storage and networking resources to your subscription. You might occasionally experience allocation failures because of high demand for Azure services in specific regions.

|     Error conditions    |     Resolutions    |
|--|----|
| Cache volume creation fails with the error: <br> `There are currently insufficient resources available to create a cache volume in this region. Please delete <cacheResourceId> and retry the operation.` | There aren't enough resources available in the region to create the cache volume. Delete the failed cache volume and retry after some time. Resources might be freed in the region or zone in the interim. Contact Support if the issue persists. |
| Cache volume creation fails with the error: <br> `The cache volume has been deleted since the creation request was made, likely due to high load on your subscription. Please try again.` | The cache volume was deleted while it was being created. Send the `PUT` request again. |

## Errors for deleting cache volumes

|     Error conditions    |     Resolutions    |
|--|----|
| Deleting a cache volume fails with the error: <br> `Deleting a cache with 'WriteBack' enabled is not supported. Please disable 'WriteBack' and retry the delete operation.` | Disable `writeBack` with a `PATCH` request, wait for `provisioningState` to be `Succeeded`, and then delete the cache volume. |
| Deleting a cache volume fails with the error: <br> `Unable to delete the volume. The underlying cluster peer is currently busy. Please try again in a few minutes.` | Another operation is using the cluster peer between Azure NetApp Files and the origin cluster. Wait a few minutes, then retry the delete. |

## Next steps

* [Understand Azure NetApp Files cache volumes](cache-volumes.md)
* [Requirements and considerations for Azure NetApp Files cache volumes](cache-requirements.md)
* [Configure a cache volume for Azure NetApp Files](configure-cache-volumes.md)
* [Troubleshoot volume errors for Azure NetApp Files](troubleshoot-volumes.md)
