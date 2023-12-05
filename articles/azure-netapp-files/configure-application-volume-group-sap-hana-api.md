---
title: Configure application volume groups for SAP HANA using REST API 
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
ms.date: 04/09/2023
ms.author: b-ahibbard
---
# Configure application volume groups for SAP HANA using REST API

Application volume groups (AVG) enable you to deploy all volumes for a single HANA host in one atomic step. The Azure portal and the Azure Resource Manager template have implemented prechecks and recommendations for deployment in areas including throughputs and volume naming conventions. As a REST API user, those checks and recommendations are not available.

Without these checks, it's important to understand the requirements for running HANA on Azure NetApp Files and the basic architecture and workflows application volume groups on which are built.

SAP HANA can be installed in a single-host (scale-up) or in a multiple-host (scale-out) configuration. The volumes required for each of the HANA nodes differ for the first HANA node (single-host) and for subsequent HANA hosts (multiple-host). Since an application volume group creates the volumes for a single HANA host, the number and type of volumes created differ for the first HANA host and all subsequent HANA hosts in a multiple-host setup. 

Application volume groups allow you to define volume size and throughput according to your specific requirements. To ensure you can customize to your specific needs, you must only use manual QoS capacity pools. According to the SAP HANA certification, only a subset of volume features can be used for the different volumes. Since enterprise applications such as SAP HANA require application-consistent data protection, it's _not_ recommended to configure automated snapshot policies for any of the volumes. Instead consider using specific data protection applications such as [AzAcSnap](azacsnap-introduction.md) or Commvault. 

## Rules and restrictions

Using application volume groups requires understanding the rules and restrictions:
* A single volume group is used to create the volumes for a single HANA host only. 
* In a HANA multiple-host setup (scale-out), you should start with the volume group for the first HANA host and continue host by host.
* HANA requires different volume types for the first HANA host and all additional multiple-hosts hosts you add. 
* Available volume types are: data, log, shared, log-backup, and data-backup.
* The first node can have all five different volumes (one for each type).
    * data, log and shared volumes must be provided
    * log-backup and data-backup are optional, as you may choose to use a central share to store the backups or even use `backint` for the log-backup
* All additional hosts in a multiple-host setup may only add one data and one log volume each. 
* For data, log and shared volumes, SAP HANA certification requires NFSv4.1 protocol.
* Log-backup and file-backup volumes, if created optionally with the volume group of the first HANA host, may use NFSv4.1 or NFSv3 protocol.
* Each volume must have at least one export policy defined. To install SAP, root access must be enabled.
* Kerberos and LDAP enablement are not supported.
* You should follow the naming convention outlined in the following table.

The following list describes all the possible volume types for application volume groups for SAP HANA.

| Volume type | Creation limits | Supported Protocol | Recommended naming | Data protection recommendation |
| ---- | ----- | ------- | ------ | ----- |
| **SAP HANA data volume** | One data volume must be created for every HANA host. | NFSv4.1 (LDAP nor Kerberos are supported) | `<SID>-data-mnt<00001>`: <ol><li> `<SID>` is the SAP system ID </li><li> `<00001>` refers to host number. For example, in a single-host configuration or for the first host in a multi-host configuration is host number is 00001. The next host is 00002. </li></ol> | No initial data protection recommendation | 
| **SAP HANA log volume** | One log volume bust must be created for every HANA host | NFSv4.1 (LDAP nor Kerberos are supported) | `<SID>-data-mnt<00001>`: <ol><li> `<SID>` is the SAP system ID </li><li> `<00001>` refers to host number. For example, in a single-host configuration or for the first host in a multi-host configuration, the host number is 00001. The next host is 00002 </li></ol> | No initial data protection recommendation | 
| **SAP HANA shared volume** | One shared volume must be created for the first host HANA host of a multiple-host setup, or for a single-host HANA installation. | NFSv4.1 (LDAP nor Kerberos are supported) | `<SID>-shared` where `<SID>` is the SAP system ID | No initial data protection recommended | 
| **SAP HANA data backup volume** | An optional volume created only for the first HANA node | NFSv4.1 (LDAP nor Kerberos are supported) | `<SID>-data-backup` where `<SID>` is the SAP system ID | No initial data protection recommended | 
| **SAP HANA log backup volume** | An optional volume created only for the first HANA node. | NFSv4.1 (LDAP nor Kerberos are supported) | `<SID>-log-backup` where `<SID>` is the SAP system ID | No initial data protection recommended | 

## Prepare your environment

1. **Networking:** You need to decide on the networking architecture. To use Azure NetApp Files, you need to create a VNet that will host a delegated subnet for the Azure NetApp Files storage endpoints (IPs). To ensure that the size of this subnet is large enough, see [Considerations about delegating a subnet to Azure NetApp Files](azure-netapp-files-delegate-subnet.md#considerations).
    1.	Create a VNet.
    2.	Create a virtual machine (VM) subnet and delegated subnet for Azure NetApp Files.
1.	**Storage Account and Capacity Pool:** A storage account is the entry point to consume Azure NetApp Files. At least one storage account needs to be created. Within a storage account, a capacity pool is the logical unit to create volumes. Application volume groups require a capacity pool with a manual QoS. It should be created with a size and service level that meets your HANA requirements.
    >[!NOTE]
    > A capacity pool can be resized at any time. For more information about changing a capacity pool, refer to [Manage a manual QoS capacity pool](manage-manual-qos-capacity-pool.md).
    1.	Create a NetApp storage account.
    2.	Create a manual QoS capacity pool.
1. **Create AvSet and proximity placement group (PPG):** For production landscapes, you should create an AvSet that is manually pinned to a data center where Azure NetApp Files resources are available in proximity. The AvSet pinning ensures that VMs won't be moved on restart. The proximity placement group (PPG) needs to be assigned to the AvSet. With the help of application volume groups, the PPG can find the closest Azure NetApp Files hardware. For more information, see [Best practices about proximity placement groups](application-volume-group-considerations.md#best-practices-about-proximity-placement-groups).
    1. Create AvSet.
    2. Create PPG.
    3. Assign PPG to AvSet.
1. **Manual Steps - Request AvSet pinning**: AvSet pinning is required for long term SAP HANA systems. The Microsoft capacity planning team ensures that the required VMs for SAP HANA and Azure NetApp Files resources are in proximity to available VMs. VMs will not move on restart. 
    * Request pinning using [this form](https://aka.ms/HANAPINNING).
1. **Create and start HANA DB VM:** Before you can create volumes using application volume groups, the PPG must be anchored. At least one VM must be created using the pinned AvSet. Once this VM is started, the PPG can be used to detect where the VM is running.
    1. Create and start the VM using the AvSet.

## Understand application volume group REST API parameters

The following tables describe the generic application volume group creation using the REST API, detailing selected parameters and properties required for SAP HANA application volume group creation. Constraints and typical values for SAP HANA AVG creation are also specified where applicable.

### Application volume group create

In a create request, use the following URI format:
```rest
/subscriptions/<subscriptionId/providers/Microsoft.NetApp/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.NetApp/netAppAccounts/<accountName>/volumeGroups/<volumeGroupName>?api-version=<apiVersion>
```

| URI parameter | Description | Restrictions for SAP HANA |
| ---- | ----- | ----- |
| `subscriptionId` | Subscription ID | None | 
| `resourceGroupName` | Resource group name | None | 
| `accountName` | NetApp account name | None | 
| `volumeGroupName` | Volume group name | None. The recommended format is `<SID>-<Name>-<ID>` <ol><li> `SID`: HANA System ID. </li><li>Name: A string of your choosing</li><li>ID: Five-digit HANA Host ID</li><ol> Example: `SH9-Testing-00003` | 
| `apiVersion` | API version | Must be `2022-03-01` or later |

### Request body

The request body consists of the _outer_ parameters, the group properties, and an array of volumes to be created, each with their individual outer parameters and volume properties.

The following table describes the request body parameters and group level properties required to create a SAP HANA application volume group.

| URI parameter | Description | Restrictions for SAP HANA |
| ---- | ----- | ----- |
| `Location` | Region in which to create the application volume group |	None |
| **GROUP PROPERTIES** | | |
| `groupDescription` | Description for the group | Free-form string | 
| `applicationType` | Application type | Must be "SAP-HANA" |
| `applicationIdentifier` | Application specific identifier string, following application naming rules | The SAP System ID, which should follow aforementioned naming rules, for example `SH9` | 
| `volumes` | Array of volumes to be created (see the next table for volume-granular details) | Volume count depends upon host configuration: <ul><li>Single-host (3-5 volumes) <br /> **Required**: _data_, _log_ and _shared_ <br /> **Optional**: _data-backup_, _log-backup_ </li><li> Multiple-host (two volumes) <br /> **Required**: _data_ and _log_ </li></ul> |

This table describes the request body parameters and volume properties for creating a volume in a SAP HANA application volume group.   

| Volume-level request parameter | Description | Restrictions for SAP HANA |
| ---- | ----- | ----- |
| `name` | Volume name | None. Examples or recommended volume names: <ul><li> `SH9-data-mnt00001` data for Single-Host.</li><li> `SH9-log-backup` log-backup for Single-Host.</li><li> `HSR-SH9-shared` shared for HSR Secondary.</li><li> `DR-SH9-data-backup` data-backup for cross-region replication destination </li><li> `DR2-SH9-data-backup` data-backup for cross-region replication destination of HSR Secondary.</li></ul> | 
| `tags` | Volume tags | None, however, it may be helpful to add a tag to the HSR partner volume to identify the corresponding HSR partner volume. The Azure portal suggests the following tag for the HSR Secondary volumes: <ul><li> **Name**: `HSRPartnerStorageResourceId` </li><li> **Value:** `<Partner volume Id>` </li></ul> |
| **Volume properties** | **Description** | **SAP HANA Value Restrictions** |
| `creationToken` | Export path name, typically same as the volume name. | None. Example: `SH9-data-mnt00001` |
| `throughputMibps` | QoS throughput | This must be between 1 Mbps and 4500 Mbps. You should set throughput based on volume type. | 
| `usageThreshhold` | Size of the volume in bytes. This must be in the 100 GiB to 100-TiB range. For instance, 100 GiB = 107374182400 bytes. | None. You should set volume size depending on the volume type. | 
| `exportPolicyRule` | Volume export policy rule | At least one export policy rule must be specified for SAP HANA. Only the following rules values can be modified for SAP HANA, the rest _must_ have their default values: <ul><li>`unixReadOnly`: should be false</li><li>`unixReadWrite`: should be true</li><li>`allowedClients`: specify allowed clients. Use `0.0.0.0/0` for no restrictions.</li><li>`hasRootAccess`: must be true to install SAP.</li><li>`chownMode`: Specify `chown` mode.</li><li>`nfsv41`: true for data, log, and shared volumes, optionally true for data backup and log backup volumes</li><li>`nfsv3`: optionally true for data backup and log backup volumes</li><ul> All other rule values _must_ be left defaulted. |
| `volumeSpecName` | Specifies the type of volume for the application volume group being created | SAP HANA volumes must have a value that is one of the following: <ul><li>"data"</li><li>"log"</li><li>"shared"</li><li>"data-backup"</li><li>"log-backup"</li></ul> | 
| `proximityPlacementGroup` | Resource ID of the Proximity Placement Group (PPG) for proper placement of the volume. | <ul><li>The “data”, “log” and “shared” volumes must each have a PPG specified, preferably a common PPG.</li><li>A PPG must be specified for the “data-backup” and “log-backup” volumes, but it will be ignored during placement.</li></ul> |
| `subnetId` | Delegated subnet ID for Azure NetApp Files. | In a normal case where there are sufficient resources available, the number of IP addresses required in the subnet depends on the order of the application volume group created in the subscription: <ol><li> First application volume group created: the creation usually requires to 3-4 IP addresses but can require up to 5</li><li> Second application volume group created: Normally requires two IP addresses</li><li></li>Third and subsequent application volume group created: Normally, more IP addresses are not required</ol> |
| `capacityPoolResourceId` | ID of the capacity pool | The capacity pool must be of type manual QoS. Generally, all SAP volumes are placed in a common capacity pool, however this is not a requirement. |
| `protocolTypes` | Protocol to use | This should be either NFSv3 or NFSv4.1 and should match the protocol specified in the Export Policy Rule described earlier in this table. | 

## Example API request content: application volume group creation

The examples in this section illustrate the values passed in the volume group creation request for various SAP HANA configurations. The examples demonstrate best practices for naming, sizing, and values as described in the tables.

In the following examples, selected placeholders are specified. You should replace them with the values specific to your configuration. These values include:
1.	`<SubscriptionId>`: Subscription ID. Example: `11111111-2222-3333-4444-555555555555`
2.	`<ResourceGroup>`: Resource group. Example: `TestResourceGroup`
3.	`<NtapAccount>`: NetApp account, for example: `TestAccount`
4.	`<VolumeGroupName>`: Volume group name, for example: `SH9-Test-00001`
5.	`<SubnetId>`: Subnet resource ID, for example: `/subscriptions/11111111-2222-3333-4444-555555555555/resourceGroups/myRP/providers/Microsoft.Network/virtualNetworks/testvnet3/subnets/SH9_Subnet`
6. `<CapacityPoolResourceId>`: Capacity pool resource ID, for example: `/subscriptions/11111111-2222-3333-4444-555555555555/resourceGroups/myRG/providers/Microsoft.NetApp/netAppAccounts/account1/capacityPools/SH9_Pool`
7.	`<ProximityPlacementGroupResourceId>`: Proximity placement group, for example: `/subscriptions/11111111-2222-3333-4444-555555555555/resourceGroups/test/providers/Microsoft.Compute/proximityPlacementGroups/SH9_PPG`
8.	`<PartnerVolumeId>`: Partner volume ID (for HSR volumes).
9.	`<ExampleJson>`: JSON Request from one of the examples in the API request tables below.


>[!NOTE]
> The following samples use jq, a tool that helps format the JSON output in a user-friendly way. If you don't have or use jq, you should omit the `| jq xxx` snippets.

## Creating SAP HANA volume groups using curl

SAP HANA volume groups for the following examples can be created using a sample shell script that calls the API using curl:

1. Extract the subscription ID. This automates the extraction of the subscription ID and generate the authorization token:
    ```bash
    subId=$(az account list | jq ".[] | select (.name == \"Pay-As-You-Go\") | .id" -r)
    echo "Subscription ID: $subId"
    ```
1. Create the access token:
    ```bash
    response=$(az account get-access-token)
    token=$(echo $response | jq ".accessToken" -r)
    echo "Token: $token"
    ```
1. Call the REST API using curl
    ```bash
    echo "---"
    curl -X PUT -H "Authorization: Bearer $token" -H "Content-Type:application/json" -H "Accept:application/json" -d @<ExampleJson> https://management.azure.com/subscriptions/$subId/resourceGroups/<ResourceGroup>/providers/Microsoft.NetApp/netAppAccounts/<NtapAccount>/volumeGroups/<VolumeGroupName>?api-version=2022-03-01 | jq .
    ```

### Example 1: Deploy volumes for the first HANA host for a single-host or multi-host configuration
To create the five volumes (data, log, shared, data-backup, log-backup) for a single-node SAP HANA system with SID `SH9` as in the example, use the following API request as shown in the JSON example.

>[!NOTE]
>You need to replace the placeholders and adapt the parameters to meet your requirements.

#### Example single-host SAP HANA application volume group creation request

This example pertains to data, log, shared, data-backup, and log-backup volumes demonstrating best practices for naming, sizing, and throughputs. This example serves as the primary volume if you're configuring an HSR pair. 

1. Save the JSON template as `sh9.json`:
    ```json
    {
        "location": "westus",
        "properties": {
            "groupMetaData": {
                "groupDescription": "Test group for SH9",
                "applicationType": "SAP-HANA",
                "applicationIdentifier": "SH9"
            },
            "volumes": [
                {
                    "name": "SH9-data-mnt00001",
                    "properties": {
                        "creationToken": "SH9-data-mnt00001",
                        "serviceLevel": "premium",
                        "throughputMibps": 400,
                        "exportPolicy": {
                            "rules": [
                                {
                                    "ruleIndex": 1,
                                    "unixReadOnly": false,
                                    "unixReadWrite": true,
                                    "kerberos5ReadOnly": false,
                                    "kerberos5ReadWrite": false,
                                    "kerberos5iReadOnly": false,
                                    "kerberos5iReadWrite": false,
                                    "kerberos5pReadOnly": false,
                                    "kerberos5pReadWrite": false,
                                    "cifs": false,
                                    "nfsv3": false,
                                    "nfsv41": true,
                                    "allowedClients": "0.0.0.0/0",
                                    "hasRootAccess": true
                                }
                            ]
                        },
                        "protocolTypes": [
                            "NFSv4.1"
                        ],
                        "subnetId": <SubnetId>,
                        "usageThreshold": 107374182400,
                        "volumeSpecName": "data",
                        "capacityPoolResourceId": <CapacityPoolResourceId>,
                        "proximityPlacementGroup": <ProximityPlacementGroupResourceId>
                    }
                },
                {
                    "name": "SH9-log-mnt00001",
                    "properties": {
                        "creationToken": "SH9-log-mnt00001",
                        "serviceLevel": "premium",
                        "throughputMibps": 250,
                        "exportPolicy": {
                            "rules": [
                                {
                                    "ruleIndex": 1,
                                    "unixReadOnly": false,
                                    "unixReadWrite": true,
                                    "kerberos5ReadOnly": false,
                                    "kerberos5ReadWrite": false,
                                    "kerberos5iReadOnly": false,
                                    "kerberos5iReadWrite": false,
                                    "kerberos5pReadOnly": false,
                                    "kerberos5pReadWrite": false,
                                    "cifs": false,
                                    "nfsv3": false,
                                    "nfsv41": true,
                                    "allowedClients": "0.0.0.0/0",
                                    "hasRootAccess": true
                                }
                            ]
                        },
                        "protocolTypes": [
                            "NFSv4.1"
                        ],
                        "subnetId": <SubnetId>,
                        "usageThreshold": 107374182400,
                        "volumeSpecName": "log",
                        "capacityPoolResourceId": <CapacityPoolResourceId>,
                        "proximityPlacementGroup": <ProximityPlacementGroupResourceId>
                    }
                },
                {
                    "name": "SH9-shared",
                    "properties": {
                        "creationToken": "SH9-shared",
                        "serviceLevel": "premium",
                        "throughputMibps": 64,
                        "exportPolicy": {
                            "rules": [
                                {
                                    "ruleIndex": 1,
                                    "unixReadOnly": false,
                                    "unixReadWrite": true,
                                    "kerberos5ReadOnly": false,
                                    "kerberos5ReadWrite": false,
                                    "kerberos5iReadOnly": false,
                                    "kerberos5iReadWrite": false,
                                    "kerberos5pReadOnly": false,
                                    "kerberos5pReadWrite": false,
                                    "cifs": false,
                                    "nfsv3": false,
                                    "nfsv41": true,
                                    "allowedClients": "0.0.0.0/0",
                                    "hasRootAccess": true
                                }
                            ]
                        },
                        "protocolTypes": [
                            "NFSv4.1"
                        ],
                        "subnetId": <SubnetId>,
                        "usageThreshold": 1099511627776,
                        "volumeSpecName": "shared",
                        "capacityPoolResourceId": <CapacityPoolResourceId>,
                        "proximityPlacementGroup": <ProximityPlacementGroupResourceId>
                    }
                },
                {
                    "name": "SH9-data-backup",
                    "properties": {
                        "creationToken": "SH9-data-backup",
                        "serviceLevel": "premium",
                        "throughputMibps": 128,
                        "exportPolicy": {
                            "rules": [
                                {
                                    "ruleIndex": 1,
                                    "unixReadOnly": false,
                                    "unixReadWrite": true,
                                    "kerberos5ReadOnly": false,
                                    "kerberos5ReadWrite": false,
                                    "kerberos5iReadOnly": false,
                                    "kerberos5iReadWrite": false,
                                    "kerberos5pReadOnly": false,
                                    "kerberos5pReadWrite": false,
                                    "cifs": false,
                                    "nfsv3": false,
                                    "nfsv41": true,
                                    "allowedClients": "0.0.0.0/0",
                                    "hasRootAccess": true
                                }
                            ]
                        },
                        "protocolTypes": [
                            "NFSv4.1"
                        ],
                        "subnetId": <SubnetId>,
                        "usageThreshold": 214748364800,
                        "volumeSpecName": "data-backup",
                        "capacityPoolResourceId": <CapacityPoolResourceId>,
                        "proximityPlacementGroup": <ProximityPlacementGroupResourceId>
                    }
                },
                {
                    "name": "SH9-log-backup",
                    "properties": {
                        "creationToken": "SH9-log-backup",
                        "serviceLevel": "premium",
                        "throughputMibps": 250,
                        "exportPolicy": {
                            "rules": [
                                {
                                    "ruleIndex": 1,
                                    "unixReadOnly": false,
                                    "unixReadWrite": true,
                                    "kerberos5ReadOnly": false,
                                    "kerberos5ReadWrite": false,
                                    "kerberos5iReadOnly": false,
                                    "kerberos5iReadWrite": false,
                                    "kerberos5pReadOnly": false,
                                    "kerberos5pReadWrite": false,
                                    "cifs": false,
                                    "nfsv3": false,
                                    "nfsv41": true,
                                    "allowedClients": "0.0.0.0/0",
                                    "hasRootAccess": true
                                }
                            ]
                        },
                        "protocolTypes": [
                            "NFSv4.1"
                        ],
                        "subnetId": <SubnetId>,
                        "usageThreshold": 549755813888,
                        "volumeSpecName": "log-backup",
                        "capacityPoolResourceId": <CapacityPoolResourceId>,
                        "proximityPlacementGroup": <ProximityPlacementGroupResourceId>
                    }
                }
            ]
        }
    }
    ```
1. Extract the subscription ID:
    ```bash
    subId=$(az account list | jq ".[] | select (.name == \"Pay-As-You-Go\") | .id" -r)
    echo "Subscription ID: $subId"
    ```
1. Create the access token:
    ```bash
    response=$(az account get-access-token)
    token=$(echo $response | jq ".accessToken" -r)
    echo "Token: $token"
    ```
3. Call the REST API using curl
    ```bash
    echo "---"
    curl -X PUT -H "Authorization: Bearer $token" -H "Content-Type:application/json" -H "Accept:application/json" -d @sh9.json https://management.azure.com/subscriptions/$subId/resourceGroups/rg-westus/providers/Microsoft.NetApp/netAppAccounts/ANF-WestUS-test/volumeGroups/SAP-HANA-SH9-00001?api-version=2022-03-01 | jq .
    ```
1. Sample result:
```json
{
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/rg-westus/providers/Microsoft.NetApp/netAppAccounts/ANF-WestUS-test/volumeGroups/SAP-HANA-SH9-00001",
  "name": "ANF-WestUS-test/SAP-HANA-SH9-00001",
  "type": "Microsoft.NetApp/netAppAccounts/volumeGroups",
  "location": "westus",
  "properties": {
    "provisioningState": "Creating",
    "groupMetaData": {
      "groupDescription": "Test group for SH9",
      "applicationType": "SAP-HANA",
      "applicationIdentifier": "SH9",
      "volumesCount": 0
    },
    "volumes": [
      {
        "name": "SH9-data-mnt00001",
        "properties": {
          "serviceLevel": "premium",
          "creationToken": "SH9-data-mnt00001",
          "usageThreshold": 107374182400,
          "exportPolicy": {
            "rules": [
              {
                "ruleIndex": 1,
                "unixReadOnly": false,
                "unixReadWrite": true,
                "cifs": false,
                "nfsv3": false,
                "nfsv41": true,
                "allowedClients": "0.0.0.0/0",
                "kerberos5ReadOnly": false,
                "kerberos5ReadWrite": false,
                "kerberos5iReadOnly": false,
                "kerberos5iReadWrite": false,
                "kerberos5pReadOnly": false,
                "kerberos5pReadWrite": false,
                "hasRootAccess": true
              }
            ]
          },
          "protocolTypes": [
            "NFSv4.1"
          ],
          "subnetId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/rg-westus/providers/Microsoft.Network/virtualNetworks/rg-westus-vnet/subnets/default",
          "throughputMibps": 1,
          "capacityPoolResourceId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/rg-westus/providers/Microsoft.NetApp/netAppAccounts/ANF-WestUS-test/capacityPools/avg",
          "proximityPlacementGroup": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/rg-westus/providers/Microsoft.Compute/proximityPlacementGroups/ppg-westus-test",
          "volumeSpecName": "data",
          "maximumNumberOfFiles": 100000000
        }
      },
      {
        "name": "SH9-log-mnt00001",
        "properties": {
          "serviceLevel": "premium",
          "creationToken": "SH9-log-mnt00001",
          "usageThreshold": 107374182400,
          "exportPolicy": {
            "rules": [
              {
                "ruleIndex": 1,
                "unixReadOnly": false,
                "unixReadWrite": true,
                "cifs": false,
                "nfsv3": false,
                "nfsv41": true,
                "allowedClients": "0.0.0.0/0",
                "kerberos5ReadOnly": false,
                "kerberos5ReadWrite": false,
                "kerberos5iReadOnly": false,
                "kerberos5iReadWrite": false,
                "kerberos5pReadOnly": false,
                "kerberos5pReadWrite": false,
                "hasRootAccess": true
              }
            ]
          },
          "protocolTypes": [
            "NFSv4.1"
          ],
          "subnetId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/rg-westus/providers/Microsoft.Network/virtualNetworks/rg-westus-vnet/subnets/default",
          "throughputMibps": 1,
          "capacityPoolResourceId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/rg-westus/providers/Microsoft.NetApp/netAppAccounts/ANF-WestUS-test/capacityPools/avg",
          "proximityPlacementGroup": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/rg-westus/providers/Microsoft.Compute/proximityPlacementGroups/ppg-westus-test",
          "volumeSpecName": "log",
          "maximumNumberOfFiles": 100000000
        }
      },
      {
        "name": "SH9-shared",
        "properties": {
          "serviceLevel": "premium",
          "creationToken": "SH9-shared",
          "usageThreshold": 107374182400,
          "exportPolicy": {
            "rules": [
              {
                "ruleIndex": 1,
                "unixReadOnly": false,
                "unixReadWrite": true,
                "cifs": false,
                "nfsv3": false,
                "nfsv41": true,
                "allowedClients": "0.0.0.0/0",
                "kerberos5ReadOnly": false,
                "kerberos5ReadWrite": false,
                "kerberos5iReadOnly": false,
                "kerberos5iReadWrite": false,
                "kerberos5pReadOnly": false,
                "kerberos5pReadWrite": false,
                "hasRootAccess": true
              }
            ]
          },
          "protocolTypes": [
            "NFSv4.1"
          ],
          "subnetId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/rg-westus/providers/Microsoft.Network/virtualNetworks/rg-westus-vnet/subnets/default",
          "throughputMibps": 1,
          "capacityPoolResourceId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/rg-westus/providers/Microsoft.NetApp/netAppAccounts/ANF-WestUS-test/capacityPools/avg",
          "proximityPlacementGroup": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/rg-westus/providers/Microsoft.Compute/proximityPlacementGroups/ppg-westus-test",
          "volumeSpecName": "shared",
          "maximumNumberOfFiles": 100000000
        }
      },
      {
        "name": "SH9-data-backup",
        "properties": {
          "serviceLevel": "premium",
          "creationToken": "SH9-data-backup",
          "usageThreshold": 107374182400,
          "exportPolicy": {
            "rules": [
              {
                "ruleIndex": 1,
                "unixReadOnly": false,
                "unixReadWrite": true,
                "cifs": false,
                "nfsv3": false,
                "nfsv41": true,
                "allowedClients": "0.0.0.0/0",
                "kerberos5ReadOnly": false,
                "kerberos5ReadWrite": false,
                "kerberos5iReadOnly": false,
                "kerberos5iReadWrite": false,
                "kerberos5pReadOnly": false,
                "kerberos5pReadWrite": false,
                "hasRootAccess": true
              }
            ]
          },
          "protocolTypes": [
            "NFSv4.1"
          ],
          "subnetId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/rg-westus/providers/Microsoft.Network/virtualNetworks/rg-westus-vnet/subnets/default",
          "throughputMibps": 1,
          "capacityPoolResourceId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/rg-westus/providers/Microsoft.NetApp/netAppAccounts/ANF-WestUS-test/capacityPools/avg",
          "proximityPlacementGroup": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/rg-westus/providers/Microsoft.Compute/proximityPlacementGroups/ppg-westus-test",
          "volumeSpecName": "data-backup",
          "maximumNumberOfFiles": 100000000
        }
      },
      {
        "name": "SH9-log-backup",
        "properties": {
          "serviceLevel": "premium",
          "creationToken": "SH9-log-backup",
          "usageThreshold": 107374182400,
          "exportPolicy": {
            "rules": [
              {
                "ruleIndex": 1,
                "unixReadOnly": false,
                "unixReadWrite": true,
                "cifs": false,
                "nfsv3": false,
                "nfsv41": true,
                "allowedClients": "0.0.0.0/0",
                "kerberos5ReadOnly": false,
                "kerberos5ReadWrite": false,
                "kerberos5iReadOnly": false,
                "kerberos5iReadWrite": false,
                "kerberos5pReadOnly": false,
                "kerberos5pReadWrite": false,
                "hasRootAccess": true
              }
            ]
          },
          "protocolTypes": [
            "NFSv4.1"
          ],
          "subnetId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/rg-westus/providers/Microsoft.Network/virtualNetworks/rg-westus-vnet/subnets/default",
          "throughputMibps": 1,
          "capacityPoolResourceId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/rg-westus/providers/Microsoft.NetApp/netAppAccounts/ANF-WestUS-test/capacityPools/avg",
          "proximityPlacementGroup": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/rg-westus/providers/Microsoft.Compute/proximityPlacementGroups/ppg-westus-test",
          "volumeSpecName": "log-backup",
          "maximumNumberOfFiles": 100000000
        }
      }
    ]
  }
}
```

### Example 2: Deploy volumes for an additional HANA Host for a multiple-host HANA configuration

To create a multiple-host HANA system, you need to add additional hosts to the previously deployed HANA hosts. Additional hosts only require a data and log volume each host you add. In this example, a volume group is added for host number `00002`.

This example is similar to the single-host system request in the earlier example, except it only contains the data and log volumes. 

```json 
{
    "location": "westus",
    "properties": {
        "groupMetaData": {
            "groupDescription": "Test group for SH9, host #2",
            "applicationType": "SAP-HANA",
            "applicationIdentifier": "SH9"
        },
        "volumes": [
            {
                "name": "SH9-data-mnt00002",
                "properties": {
                    "creationToken": "SH9-data-mnt00002",
                    "serviceLevel": "premium",
                    "throughputMibps": 400,
                    "exportPolicy": {
                        "rules": [
                            {
                                "ruleIndex": 1,
                                "unixReadOnly": false,
                                "unixReadWrite": true,
                                "kerberos5ReadOnly": false,
                                "kerberos5ReadWrite": false,
                                "kerberos5iReadOnly": false,
                                "kerberos5iReadWrite": false,
                                "kerberos5pReadOnly": false,
                                "kerberos5pReadWrite": false,
                                "cifs": false,
                                "nfsv3": false,
                                "nfsv41": true,
                                "allowedClients": "0.0.0.0/0",
                                "hasRootAccess": true
                            }
                        ]
                    },
                    "protocolTypes": [
                        "NFSv4.1"
                    ],
                    "subnetId": <SubnetId>,
                    "usageThreshold": 107374182400,
                    "volumeSpecName": "data",
                    "capacityPoolResourceId": <CapacityPoolResourceId>,
                    "proximityPlacementGroup": <ProximityPlacementGroupResourceId>
                }
            },
            {
                "name": "SH9-log-mnt00002",
                "properties": {
                    "creationToken": "SH9-log-mnt00002",
                    "serviceLevel": "premium",
                    "throughputMibps": 250,
                    "exportPolicy": {
                        "rules": [
                            {
                                "ruleIndex": 1,
                                "unixReadOnly": false,
                                "unixReadWrite": true,
                                "kerberos5ReadOnly": false,
                                "kerberos5ReadWrite": false,
                                "kerberos5iReadOnly": false,
                                "kerberos5iReadWrite": false,
                                "kerberos5pReadOnly": false,
                                "kerberos5pReadWrite": false,
                                "cifs": false,
                                "nfsv3": false,
                                "nfsv41": true,
                                "allowedClients": "0.0.0.0/0",
                                "hasRootAccess": true
                            }
                        ]
                    },
                    "protocolTypes": [
                        "NFSv4.1"
                    ],
                    "subnetId": <SubnetId>,
                    "usageThreshold": 107374182400,
                    "volumeSpecName": "log",
                    "capacityPoolResourceId": <CapacityPoolResourceId>,
                    "proximityPlacementGroup": <ProximityPlacementGroupResourceId>
                }
            }
        ]
    }
```

### Example 3: Deploy volumes for a secondary HANA system using HANA system replication

HANA System Replication (HSR) will be used to set up a HANA database where both databases are using the same SAP System Identifier (SID) but have their individual volumes. Typically, HSR setups are in different zones and therefore require different proximity placement groups.

Volumes for a secondary database need to have different volume names. In this example, a volume is created for the secondary HANA system that has HSR with the single-host HANA system as a primary HSR (similar to what is described in example one).

It's recommended that you:
1. Use the same volume names as the primary volumes using the prefix `HSR-`.
1. Add Azure tags to the volumes to identify the corresponding primary volumes:
    * Name: `HSRPartnerStorageResourceId`
    * Value: `<Partner Volume ID>`

This example encompasses the creation of data, log, shared, data-backup, and log-backup volumes, demonstrating best practices for naming, sizing, and throughputs. 

```json
{
    "location": "westus",
    "properties": {
        "groupMetaData": {
            "groupDescription": "HSR Secondary: Test group for SH9",
            "applicationType": "SAP-HANA",
            "applicationIdentifier": "SH9"
        },
        "volumes": [
            {
                "name": "HSR-SH9-data-mnt00001",
                "tags": {"HSRPartnerStorageResourceId": "<PartnerVolumeId>"},
                "properties": {
                    "creationToken": "HSR-SH9-data-mnt00001",
                    "serviceLevel": "premium",
                    "throughputMibps": 400,
                    "exportPolicy": {
                        "rules": [
                            {
                                "ruleIndex": 1,
                                "unixReadOnly": false,
                                "unixReadWrite": true,
                                "kerberos5ReadOnly": false,
                                "kerberos5ReadWrite": false,
                                "kerberos5iReadOnly": false,
                                "kerberos5iReadWrite": false,
                                "kerberos5pReadOnly": false,
                                "kerberos5pReadWrite": false,
                                "cifs": false,
                                "nfsv3": false,
                                "nfsv41": true,
                                "allowedClients": "0.0.0.0/0",
                                "hasRootAccess": true
                            }
                        ]
                    },
                    "protocolTypes": [
                        "NFSv4.1"
                    ],
                    "subnetId": <SubnetId>,
                    "usageThreshold": 107374182400,
                    "volumeSpecName": "data",
                    "capacityPoolResourceId": <CapacityPoolResourceId2>,
                    "proximityPlacementGroup": <ProximityPlacementGroupResourceId2>
                }
            },
            {
                "name": "HSR-SH9-log-mnt00001",
                "tags": {"HSRPartnerStorageResourceId": "<PartnerVolumeId>"},
                "properties": {
                    "creationToken": "HSR-SH9-log-mnt00001",
                    "serviceLevel": "premium",
                    "throughputMibps": 250,
                    "exportPolicy": {
                        "rules": [
                            {
                                "ruleIndex": 1,
                                "unixReadOnly": false,
                                "unixReadWrite": true,
                                "kerberos5ReadOnly": false,
                                "kerberos5ReadWrite": false,
                                "kerberos5iReadOnly": false,
                                "kerberos5iReadWrite": false,
                                "kerberos5pReadOnly": false,
                                "kerberos5pReadWrite": false,
                                "cifs": false,
                                "nfsv3": false,
                                "nfsv41": true,
                                "allowedClients": "0.0.0.0/0",
                                "hasRootAccess": true
                            }
                        ]
                    },
                    "protocolTypes": [
                        "NFSv4.1"
                    ],
                    "subnetId": <SubnetId>,
                    "usageThreshold": 107374182400,
                    "volumeSpecName": "log",
                    "capacityPoolResourceId": <CapacityPoolResourceId2>,
                    "proximityPlacementGroup": <ProximityPlacementGroupResourceId2>
                }
            },
            {
                "name": "HSR-SH9-shared",
                "tags": {"HSRPartnerStorageResourceId": "<PartnerVolumeId>"},
                "properties": {
                    "creationToken": "HSR-SH9-shared",
                    "serviceLevel": "premium",
                    "throughputMibps": 64,
                    "exportPolicy": {
                        "rules": [
                            {
                                "ruleIndex": 1,
                                "unixReadOnly": false,
                                "unixReadWrite": true,
                                "kerberos5ReadOnly": false,
                                "kerberos5ReadWrite": false,
                                "kerberos5iReadOnly": false,
                                "kerberos5iReadWrite": false,
                                "kerberos5pReadOnly": false,
                                "kerberos5pReadWrite": false,
                                "cifs": false,
                                "nfsv3": false,
                                "nfsv41": true,
                                "allowedClients": "0.0.0.0/0",
                                "hasRootAccess": true
                            }
                        ]
                    },
                    "protocolTypes": [
                        "NFSv4.1"
                    ],
                    "subnetId": <SubnetId>,
                    "usageThreshold": 1099511627776,
                    "volumeSpecName": "shared",
                    "capacityPoolResourceId": <CapacityPoolResourceId2>,
                    "proximityPlacementGroup": <ProximityPlacementGroupResourceId2>
                }
            },
            {
                "name": "HSR-SH9-data-backup",
                "tags": {"HSRPartnerStorageResourceId": "<PartnerVolumeId>"},
                "properties": {
                    "creationToken": "HSR-SH9-data-backup",
                    "serviceLevel": "premium",
                    "throughputMibps": 128,
                    "exportPolicy": {
                        "rules": [
                            {
                                "ruleIndex": 1,
                                "unixReadOnly": false,
                                "unixReadWrite": true,
                                "kerberos5ReadOnly": false,
                                "kerberos5ReadWrite": false,
                                "kerberos5iReadOnly": false,
                                "kerberos5iReadWrite": false,
                                "kerberos5pReadOnly": false,
                                "kerberos5pReadWrite": false,
                                "cifs": false,
                                "nfsv3": false,
                                "nfsv41": true,
                                "allowedClients": "0.0.0.0/0",
                                "hasRootAccess": true
                            }
                        ]
                    },
                    "protocolTypes": [
                        "NFSv4.1"
                    ],
                    "subnetId": <SubnetId>,
                    "usageThreshold": 214748364800,
                    "volumeSpecName": "data-backup",
                    "capacityPoolResourceId": <CapacityPoolResourceId2>,
                    "proximityPlacementGroup": <ProximityPlacementGroupResourceId2>
                }
            },
            {
                "name": "HSR-SH9-log-backup",
                "tags": {"HSRPartnerStorageResourceId": "<PartnerVolumeId>"},
                "properties": {
                    "creationToken": "HSR-SH9-log-backup",
                    "serviceLevel": "premium",
                    "throughputMibps": 250,
                    "exportPolicy": {
                        "rules": [
                            {
                                "ruleIndex": 1,
                                "unixReadOnly": false,
                                "unixReadWrite": true,
                                "kerberos5ReadOnly": false,
                                "kerberos5ReadWrite": false,
                                "kerberos5iReadOnly": false,
                                "kerberos5iReadWrite": false,
                                "kerberos5pReadOnly": false,
                                "kerberos5pReadWrite": false,
                                "cifs": false,
                                "nfsv3": false,
                                "nfsv41": true,
                                "allowedClients": "0.0.0.0/0",
                                "hasRootAccess": true
                            }
                        ]
                    },
                    "protocolTypes": [
                        "NFSv4.1"
                    ],
                    "subnetId": <SubnetId>,
                    "usageThreshold": 549755813888,
                    "volumeSpecName": "log-backup",
                    "capacityPoolResourceId": <CapacityPoolResourceId2>,
                    "proximityPlacementGroup": <ProximityPlacementGroupResourceId2>
                }
            }
        ]
    }
}
```

### Example 4: Deploy volumes for a disaster recovery HANA system using cross-region replication

Cross-region replication is one way to set up a disaster recovery configuration for HANA, where the volumes of the HANA database in the DR-region are replicated on the storage side using cross-region replication in contrast to HSR, which replicates at the application level where it requires to have the HANA VMs deployed and running. Refer to [Add volumes for an SAP HANA system as a DR system using cross-region replication](application-volume-group-disaster-recovery.md) to understand for which volumes in cross-region replication relations are required (data, shared, log-backup), not allowed (log), or optional (data-backup). 

In this example, the following placeholders are specified and should be replaced by values specific to your configuration:
1.	`<CapacityPoolResourceId3>`: DR capacity pool resource ID, for example:
`/subscriptions/11111111-2222-3333-4444-555555555555/resourceGroups/myRG/providers/Microsoft.NetApp/netAppAccounts/account1/capacityPools/DR_SH9_HSR_Pool`
2.	`<ProximityPlacementGroupResourceId3>`: DR proximity placement group, for example:`/subscriptions/11111111-2222-3333-4444-555555555555/resourceGroups/test/providers/Microsoft.Compute/proximityPlacementGroups/DR_SH9_PPG`
3.	`<SrcVolumeId_data>`, `<SrcVolumeId_shared>`, `<SrcVolumeId_data-backup>`, `<SrcVolumeId_log-backup>`: cross-region replication source volume IDs for the data, shared, and log-backup cross-region replication destination volumes.

```json
{
    "location": "eastus",
    "properties": {
        "groupMetaData": {
            "groupDescription": "Data Protection: Test group for SH9",
            "applicationType": "SAP-HANA",
            "applicationIdentifier": "SH9"
        },
        "volumes": [
            {
                "name": "DR-SH9-data-mnt00001",
                "properties": {
                    "creationToken": "DR-SH9-data-mnt00001",
                    "serviceLevel": "premium",
                    "throughputMibps": 400,
                    "exportPolicy": {
                        "rules": [
                            {
                                "ruleIndex": 1,
                                "unixReadOnly": false,
                                "unixReadWrite": true,
                                "kerberos5ReadOnly": false,
                                "kerberos5ReadWrite": false,
                                "kerberos5iReadOnly": false,
                                "kerberos5iReadWrite": false,
                                "kerberos5pReadOnly": false,
                                "kerberos5pReadWrite": false,
                                "cifs": false,
                                "nfsv3": false,
                                "nfsv41": true,
                                "allowedClients": "0.0.0.0/0",
                                "hasRootAccess": true
                            }
                        ]
                    },
                    "protocolTypes": [
                        "NFSv4.1"
                    ],
                    "subnetId": <SubnetId>,
                    "usageThreshold": 107374182400,
                    "volumeSpecName": "data",
                    "capacityPoolResourceId": <CapacityPoolResourceId3>,
                    "proximityPlacementGroup": <ProximityPlacementGroupResourceId3>,
                    "volumeType": "DataProtection",
                    "dataProtection": {
                        "replication": {
                            "endpointType": "dst",
                            "remoteVolumeResourceId": <SrcVolumeId_data>,
                            "replicationSchedule": "hourly"
                        }
                    }
                }
            },
            {
                "name": "DR-SH9-log-mnt00001",
                "properties": {
                    "creationToken": "DR-SH9-log-mnt00001",
                    "serviceLevel": "premium",
                    "throughputMibps": 250,
                    "exportPolicy": {
                        "rules": [
                            {
                                "ruleIndex": 1,
                                "unixReadOnly": false,
                                "unixReadWrite": true,
                                "kerberos5ReadOnly": false,
                                "kerberos5ReadWrite": false,
                                "kerberos5iReadOnly": false,
                                "kerberos5iReadWrite": false,
                                "kerberos5pReadOnly": false,
                                "kerberos5pReadWrite": false,
                                "cifs": false,
                                "nfsv3": false,
                                "nfsv41": true,
                                "allowedClients": "0.0.0.0/0",
                                "hasRootAccess": true
                            }
                        ]
                    },
                    "protocolTypes": [
                        "NFSv4.1"
                    ],
                    "subnetId": <SubnetId>,
                    "usageThreshold": 107374182400,
                    "volumeSpecName": "log",
                    "capacityPoolResourceId": <CapacityPoolResourceId3>,
                    "proximityPlacementGroup": <ProximityPlacementGroupResourceId3>,
                }
            },
            {
                "name": "DR-SH9-shared",
                "properties": {
                    "creationToken": "DR-SH9-shared",
                    "serviceLevel": "premium",
                    "throughputMibps": 64,
                    "exportPolicy": {
                        "rules": [
                            {
                                "ruleIndex": 1,
                                "unixReadOnly": false,
                                "unixReadWrite": true,
                                "kerberos5ReadOnly": false,
                                "kerberos5ReadWrite": false,
                                "kerberos5iReadOnly": false,
                                "kerberos5iReadWrite": false,
                                "kerberos5pReadOnly": false,
                                "kerberos5pReadWrite": false,
                                "cifs": false,
                                "nfsv3": false,
                                "nfsv41": true,
                                "allowedClients": "0.0.0.0/0",
                                "hasRootAccess": true
                            }
                        ]
                    },
                    "protocolTypes": [
                        "NFSv4.1"
                    ],
                    "subnetId": <SubnetId>,
                    "usageThreshold": 1099511627776,
                    "volumeSpecName": "shared",
                    "capacityPoolResourceId": <CapacityPoolResourceId3>,
                    "proximityPlacementGroup": <ProximityPlacementGroupResourceId3>,
                    "volumeType": "DataProtection",
                    "dataProtection": {
                        "replication": {
                            "endpointType": "dst",
                            "remoteVolumeResourceId": <SrcVolumeId_shared>,
                            "replicationSchedule": "hourly"
                        }
                    }
                }
            },
            {
                "name": "DR-SH9-data-backup",
                "properties": {
                    "creationToken": "DR-SH9-data-backup",
                    "serviceLevel": "premium",
                    "throughputMibps": 128,
                    "exportPolicy": {
                        "rules": [
                            {
                                "ruleIndex": 1,
                                "unixReadOnly": false,
                                "unixReadWrite": true,
                                "kerberos5ReadOnly": false,
                                "kerberos5ReadWrite": false,
                                "kerberos5iReadOnly": false,
                                "kerberos5iReadWrite": false,
                                "kerberos5pReadOnly": false,
                                "kerberos5pReadWrite": false,
                                "cifs": false,
                                "nfsv3": false,
                                "nfsv41": true,
                                "allowedClients": "0.0.0.0/0",
                                "hasRootAccess": true
                            }
                        ]
                    },
                    "protocolTypes": [
                        "NFSv4.1"
                    ],
                    "subnetId": <SubnetId>,
                    "usageThreshold": 214748364800,
                    "volumeSpecName": "data-backup",
                    "capacityPoolResourceId": <CapacityPoolResourceId3>,
                    "proximityPlacementGroup": <ProximityPlacementGroupResourceId3>,
                    "volumeType": "DataProtection",
                    "dataProtection": {
                        "replication": {
                            "endpointType": "dst",
                            "remoteVolumeResourceId": <SrcVolumeId_data-backup>,
                            "replicationSchedule": "daily"
                        }
                    }
                }
            },
            {
                "name": "DR-SH9-log-backup",
                "properties": {
                    "creationToken": "DR-SH9-log-backup",
                    "serviceLevel": "premium",
                    "throughputMibps": 250,
                    "exportPolicy": {
                        "rules": [
                            {
                                "ruleIndex": 1,
                                "unixReadOnly": false,
                                "unixReadWrite": true,
                                "kerberos5ReadOnly": false,
                                "kerberos5ReadWrite": false,
                                "kerberos5iReadOnly": false,
                                "kerberos5iReadWrite": false,
                                "kerberos5pReadOnly": false,
                                "kerberos5pReadWrite": false,
                                "cifs": false,
                                "nfsv3": false,
                                "nfsv41": true,
                                "allowedClients": "0.0.0.0/0",
                                "hasRootAccess": true
                            }
                        ]
                    },
                    "protocolTypes": [
                        "NFSv4.1"
                    ],
                    "subnetId": <SubnetId>,
                    "usageThreshold": 549755813888,
                    "volumeSpecName": "log-backup",
                    "capacityPoolResourceId": <CapacityPoolResourceId3>,
                    "proximityPlacementGroup": <ProximityPlacementGroupResourceId3>,
                    "volumeType": "DataProtection",
                    "dataProtection": {
                        "replication": {
                            "endpointType": "dst",
                            "remoteVolumeResourceId": <SrcVolumeId_log-backup>,
                            "replicationSchedule": "_10minutely"
                        }
                    }
                }
            }
        ]
    }
}
```

## Next steps

* [Deploy the first SAP HANA host using application volume group for SAP HANA](application-volume-group-deploy-first-host.md)
* [Add hosts to a multiple-host SAP HANA system using application volume group for SAP HANA](application-volume-group-add-hosts.md)
* [Add volumes for an SAP HANA system as a secondary database in HSR](application-volume-group-add-volume-secondary.md)
* [Add volumes for an SAP HANA system as a DR system using cross-region replication](application-volume-group-disaster-recovery.md).
