---
title: Configure application volume groups for SAP HANA API | Microsoft Docs
description: Setting up your application volume groups for the SAP HANA API requires special configurations. 
services: azure-netapp-files
documentationcenter: ''
author: b-ahibbard
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 08/31/2022
ms.author: b-ahibbard
---
# Configure application volume groups for the SAP HANA API

Application volume group (AVG) enables customers to deploy all volumes for a single HANA host in one atomic step. The portal GUI and the Azure Resource Manager template have implemented pre-checks and recommendations for deployment: for example size and throughput as well as volume naming conventions, the user can change during the GUI workflow. As an API user, those checks, and recommendations are not available.

In lieu of these checks, you should understand the basic architecture and workflow the application volume group is built upon as well as the HANA requirements for running HANA on Azure NetApp Files. 

SAP HANA can be installed as single-host (scale-up) or in a multiple-host (scale-out) configuration. The volumes required for each of the HANA nodes differ for the first HANA node (single-host) and for additional HANA hosts (multiple-host). Since an application volume group creates the volumes for a single HANA host, the number and type of volumes created differ for the first HANA host and all subsequent HANA hosts in case of a multiple-host setup. 

Application volume groups allows you to define volume size and throughput according to your requirements. To do this, only manual QoS capacity pools can be used. According to the SAP HANA certification, only a subset of volume features can be used for the different volumes. Since enterprise applications such as SAP HANA require an application consistent data protection it is **not** recommended to configure automated snapshot policies for any of the volumes. Instead consider using specific data protection applications such as [AzAcSnap](azacsnap-introduction.md) or Commvault. 

## Rules and restrictions

Using AVG application volume groups requires understanding the rules and restrictions:.
* A single volume group is used to create the volumes for a single HANA host only. 
* In a HANA multiple-host setup (scale-out) it is best practice to start with the volume group for the first HANA host, and continue host by host
* HANA requires different volume types for the first HANA host and all additional multiple-hosts hosts you add. 
* Available volume types are: data, log, shared, log-backup, and data-backup.
* The first node can have all 5 different volumes (one for each type).
    * data, log and shared volumes must be provided
    * log-backup and data-backup are optional, since customers may choose to use a central share to store the backups or even use backint for the log-backup
* All additional hosts in a multiple-host setup may only add one data and one log volume each. 
* For data, log and shared volumes NFSv4.1 protocol is mandatory based on the SAP HANA certification.
* Log-backup and file-backup volumes, if created with the volume group of the first HANA host as they are optional, may use NFSv4.1 or NFSv3 protocol.
* Each volume must have at least one export policy defined. To install SAP, root access must be enabled.
* Kerberos nor LDAP enablement are currently not supported.
* It is strongly recommended to follow the naming convention proposal as outlined in the next list.

The following list describes all the possible volume types for application volume groups for SAP HANA.

| Volume type | Creation limits | Supported Protocol | Recommended naming | Data protection recommendation |
| ---- | ----- | ------- | ------ | ----- |
| **SAP HANA data volume** | One data volume must be created for every HANA host. | NFSv4.1 (LDAP nor Kerberos are supported) | `<SID>-data-mnt<00001>`: <ol><li> `<SID>` is the SAP system ID </li><li> `<00001>` refers to host number, for example first host or single is 00001, the next host is 00002 </li></ol> | No initial data protection recommendation | 
| **SAP HANA log volume** | One log volume bust must be created for every HANA host | NFSv4.1 (LDAP nor Kerberos are supported) | `<SID>-data-mnt<00001>`: <ol><li> `<SID>` is the SAP system ID </li><li> `<00001>` refers to host number, for example first host or single is 00001, the next host is 00002 </li></ol> | No initial data protection recommendation | 
| **SAP HANA shared volume** | One shared volume must be created for the first host HANA host of a multiple-host setup, or for a single-host HANA installation. | NFSv4.1 (LDAP nor Kerberos are supported) | `<SID>-shared` where `<SID>` is the SAP system ID | No initial data protection recommended | 
| **SAP HANA data backup volume** | An optional volume created only for the first HANA node | NFSv4.1 (LDAP nor Kerberos are supported) | `<SID>-data-backup` where `<SID>` is the SAP system ID | No initial data protection recommended | 
| **SAP HANA log backup volume** | An optional volume created only for the first HANA node. | NFSv4.1 (LDAP nor Kerberos are supported) | `<SID>-log-backup` where `<SID>` is the SAP system ID | No initial data protection recommended | 

## Prepare your environment

1. **Networking:** You need to decide on the networking architecture. To use Azure NetApp Files, a VNet needs to be created and within the vNet a delegated subnet where the ANF storage endpoints (IPs) will be placed. To ensure that the size of this subnet is large enough, see [Considerations about delegating a subnet to Azure NetApp Files](azure-netapp-files-delegate-subnet#considerations.md).
    1.	Create a VNet
    2.	Create a VM subnet and delegated subnet for ANF
1.	**Storage Account and Capacity Pool:** A storage account is the entry point to consume Azure NetApp Files and at least one storage account needs to be created. Within a storage account a capacity pool is the logical unit to create volumes. For application volume groups we need a manual QoS capacity pool. It should be created with a size and service level that meets your HANA requirements. NOTE: a capacity pool can be resized at any time.
    1.	Create a NetApp storage account
    2.	Create a manual QoS capacity pool
1. **Create AvSet and PPG:** For production landscapes we recommend using a AvSet that is manually pinned to a datacenter where Azure NetApp Files resources are available in proximity. The AvSet pinning ensures that VMs will not be moved on restart. The PPG needs to be assigned to the AvSet and with the help of a it AVG can find the closest Azure NetApp Files hardware, see [Best practices about proximity placement groups](application-volume-group-considerations.md#best-practices-about-proximity-placement-groups).
    1. Create AvSet
    2. Create PPG
    3. Assign PPG to AvSet
1. **Manual Steps - Request AvSet pinning**: AvSet pinning is required for long term SAP HANA systems. Microsoft capacity planning team ensures that the required VMS for SAP HANA as well as Azure NetApp Files resources in proximity to the VMs are available, and VMss will not move on restart. 
    * Request pinning using [this form](https://aka.ms/HANAPINNING).
1. **Create and start HANA DB VM:** Before you can create volumes using application volume groups, the PPG must be anchored. At least one VM must be created using the pinned AvSet. Once this VM is started, the PPG can be used to detect where the VM is running.
    1. Create and start the VM using the AvSet

## Understand application volume group REST API parameters

The following tables describe the generic application volume group creation using the REST API, detailing selected parameters and properties required for SAP HANA application volume group creation.  Constraints and typical values for SAP HANA AVG creation are also specified where applicable.

### Application volume group create

The URI for the creation request is in the following format:
````rest
/subscriptions/<subscriptionId/providers/Microsoft.NetApp/subscriptions/<subscriptionId>
/resourceGroups/<resourceGroupName>/providers/Microsoft.NetApp
/netAppAccounts/<accountName>/volumeGroups/<volumeGroupName>?api-version=<apiVersion>
````

| URI parameter | Description | Restrictions for SAP HANA |
| ---- | ----- | ----- |
| `subscriptionId` | Subscription ID | None | 
| `resourceGroupName` | Resource group name | None | 
| `accountName` | NetApp account name | None | 
| `volumeGroupName` | Volume group name | None. The recommended format is `<SID>-<Name>-<ID>` <ol><li> `SID` HANA System ID. </li><li>Name: A string of your choosing</li><li>ID: 5-digit HANA Host ID.</li><ol> Example: `SH9-Testing-00003` | 
| `apiVersion` | API version | Must be `2022-03-01` or later |

### Request body

The request body consists of the _outer_ parameters, the group properties, and an array of volumes to be created, each with their individual outer parameters and volume properties.

The following table describes the required request body parameters and group level properties required to create an SAP HANA application volume groups.

| URI parameter | Description | Restrictions for SAP HANA |
| ---- | ----- | ----- |
| `Location` | Region in which to create the application volume group |	None |
| **GROUP PROPERTIES** | | |
| `groupDescription` | Description for the group | Free-form string | 
| `applicationType` | Application type | Must be "SAP-HANA" |
| `applicationIdentifier` | Application specific identifier string, following application naming rules | The SAP System ID, which should follow naming rules, for example `SH9` | 
| `deploymentSpecId` | Deployment specification identifier defining the rules to deploy the specific application volume group type | Must be: “20542149-bfca-5618-1879-9863dc6767f1” |
| `volumes` | Array of volumes to be created (see following table for volume-granular details) | Volume count depends upon host configuration: <ul><li>Single-host (3-5 volumes)</li><li>**Required**: _data_, _log_ and _shared_. **Optional**: _data-backup_, _log-backup_ </li><li> Multiple-Host (2 volumes)
Required: _data_ and _log_.</li><ul> |

This table describes the per-volume required request body parameters and selected volume properties that are pertinent to creating an SAP HANA application volume group.   

| Request parameter per volume | Description | Restrictions for SAP HANA |
| ---- | ----- | ----- |
| `name` | Volume name | None. Examples or recommended volume names: <ul><li> `SH9-data-mnt00001` data for Single-Host.</li><li> `SH9-log-backup` log-backup for Single-Host.</li><li> `HSR-SH9-shared` shared for HSR Secondary.</li><li> `DR-SH9-data-backup` data-backup for CRR destination </li><li> `DR2-SH9-data-backup` data-backup for CRR destination of HSR Secondary.</li></ul> | 
| `tags` | Volume tags | None, however, it may be helpful to add a tag to the HSR partner volume to identify the corresponding HSR partner volume. The Azure portal suggests the following tag for the HSR Secondary volumes: <ul><li> **Name**: `HSRPartnerStorageResourceId` </li><li> **Value:** `<Partner volume Id>` </li></ul> |
| **Volume properties** | **Description** | **SAP HANA Value Restrictions** |
| `creationToken` | Export path name, typically same as name above. | None. Example: `SH9-data-mnt00001` |
| `throughputMibps` | QoS throughput | This must be between 1 and 4500 Mibps. You should set throughput based on volume type. | 
| `usageThreshhold` | Size of the volume in bytes. This must be in the 100GiB to 100TiB range. For instance, 100GiB = 107374182400 bytes. | None. You should set volume size depending on the volume type. | 
| `exportPolicyRule` | Volume export policy rule | At least one export policy rule must be specified for SAP HANA. Only the following rules values can be modified for SAP HANA, the rest _must_ have their default values: <ul><li>`unixReadOnly`: should be false</li><li>`unixReadWrite`: should be true</li><li>`allowedClients`: specify allowed clients. Use `0.0.0.0/0` for no restrictions.</li><li>`hasRootAccess`: must be true to install SAP.</li><li>`chownMode`: Specify `chown` mode.</li><li>`nfsv41`: true for data, log, and shared volumes, optionally true for data backup and log backup volumes</li><li>`nfsv3`: optionally true for data backup and log backup volumes</li><ul> All other rule values _must_ be left defaulted. |
| `volumeSpecName` | Specifies the type of volume for the application volume group being created | SAP HANA volumes must have a value that is one of the following: <ul><li>"data"</li><li>"log"</li><li>"shared"</li><li>"data-backup"</li><li>"log-backup"</li></ul> | 
| `proximityPlacementGroup` | Resource ID of the Proximity Placement Group (PPG) for proper placement of the volume. | The “data”, “log” and “shared” volumes must each have a PPG specified, preferably a common PPG.
Known Issue:
A PPG must be specified for the “data-backup” and “log-backup” volumes, but it will be ignored during placement.

|



