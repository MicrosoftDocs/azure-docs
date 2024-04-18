---
title: Configure Azure NetApp Files application volume group for Oracle using REST API 
description: Describes the Azure NetApp Files application volume group creation for Oracle by using the REST API, including examples.
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 10/20/2023
ms.author: anfdocs
---
# Configure application volume group for Oracle using REST API

This article describes the creation of application volume group (AVG) for Oracle using the REST API. The details include selected parameters and properties required for deployment. The article also specifies constraints and typical values for AVG for Oracle creation where applicable.

## Application volume group `create` 

In a `create` request, use the following URI format:

```/subscriptions/<subscriptionId>/providers/Microsoft.NetApp/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.NetApp/netAppAccounts/<accountName>/volumeGroups/<volumeGroupName>?api-version=<apiVersion>```

| URI parameter | Description | Restrictions for Oracle AVG |
| ---- | ----- | ----- |
| `subscriptionId` | Subscription ID | None | 
| `resourceGroupName` | Resource group name | None | 
| `accountName` | NetApp account name | None | 
| `volumeGroupName` | Volume group name | The recommended format is `<SID>-<Name>` <br><br> - `SID`: Unique Identifier. The Oracle unique system ID can contain alphanumeric characters, hyphens ('-'), and underscores ('_') only. It must be min 3 characters and max 12 characters string, and it must begin with a letter. <br><br> - Name: A string of your choosing.  <br><br> Example: `ORA-Testing` | 
| `apiVersion` | API version | Must be `2023-05-01` or later |

## Request body 

The request body consists of the *outer* parameters, the group properties, and an array of volumes to be created, each with their individual outer parameters and volume properties.

The following table describes the request body parameters and group level properties required to create an Oracle deployment.

| URI parameter | Description | Restrictions for Oracle AVG |
| ---- | ----- | ----- |
| `Location` | Region in which to create the application volume group |	None |
| **Group Properties** | | |
| `groupDescription` | Description for the group | Free-form string | 
| `applicationType` | Application type | Use **ORACLE** for AVG for Oracle deployments |
| `applicationIdentifier` | Application specific identifier string | For Oracle, this parameter is the unique system ID | 
| `deploymentSpecId` | Deployment specification identifier defining the rules to deploy the specific application volume group type | Must be: `10542149-bfca-5618-1879-9863dc6767f1` | 
| `volumes` | Array of volumes to be created (see the next table for volume-granular details) | There can be 2-12 volumes as part of Oracle deployment: <br><br> - **Required**: 1 data and 1 log <br><br> - **Optional**: data 2-8, mir-log, backup, binary <br><br>  |

The following tables describe the request body parameters and volume properties for creating a volume in an Oracle application volume group.

| Volume-level request parameter | Description | Restrictions for Oracle |
|---------|---------|---------|
| `name` | Volume name, which includes Oracle SID to identify database using the volumes in the group | None. <br><br> Examples or recommended volume names: <br><br> - `<sid>-ora-data1` (data) <br> - `<sid>-ora-data2` (data) <br> - `<sid>-ora-log` (log) <br> - `<sid>-ora-log-mirror` (mirlog) <br> - `<sid>-ora-binary` (binary) <br> - `<sid>-ora-bakup` (backup) <br> | 
| `tags` | Volume tags | None |
| `zones` | Availability Zones | For Oracle AVG: <br><br> - If the region has availability zones, then you must select zones. Ex: Zones (1, 2 or 3). <br><br> - In case a region has no available zones and the use of PPG isn't enabled then customer can go for regional deployment (requires PPG activation). <br><br> |

| Volume properties | Description | Oracle value restrictions |
|---------|---------|---------|
| `creationToken` | Export path name, typically same as the volume name. | `<sid>-ora-data1` |
| `throughputMibps` | QoS throughput | You should set throughput based on volume type between 1 MiBps and 4500 MiBps. |
| `usageThreshhold` | Size of the volume in bytes. This value must be in the 100 GiB to 100-TiB range. For instance, 100 GiB = 107374182400 bytes. | You should set volume size in bytes. | 
| `exportPolicyRule` | Volume export policy rule | At least one export policy rule must be specified for Oracle. Only the following rules values can be modified for Oracle. The rest *must* have their default values: <br><br> - `unixReadOnly`: should be false. <br><br> - `unixReadWrite`: should be true. <br><br> - `allowedClients`: specify allowed clients. Use `0.0.0.0/0` for no restrictions. <br><br> - `hasRootAccess`: must be true to use root user for installation. <br><br> - `chownMode`: Specify `chown` mode. <br><br> - `Select nfsv41: or nfsv3:`: as true. It's recommended to use the same protocol version for all volumes. <br> <br> All other rule values _must_ be left defaulted. |
| `volumeSpecName` | Specifies the type of volume for the application volume group being created | Oracle volumes must have a value that is one of the following: <br><br> - `ora-data1` <br> - `ora-data2` <br> - `ora-data3` <br> - `ora-data4` <br> - `ora-data5` <br> - `ora-data6` <br> - `ora-data7` <br> - `ora-data8` <br> - `ora-log` <br> - `ora-log-mirror` <br> - `ora-binary` <br> - `ora-backup` <br> | 
| `proximityPlacementGroup` | Resource ID of the Proximity Placement Group (PPG) for proper placement of the volume. This parameter is optional. If the region has zones available, then use of zones is always priority. | The `data`, `log` and `mirror-log`, `ora-binary` and `backup` volumes must each have a PPG specified, preferably a common PPG. |
| `subnetId` | Delegated subnet ID for Azure NetApp Files. | The subnet ID must be the same for all volumes. |
| `capacityPoolResourceId` | ID of the capacity pool | The capacity pool must be of type manual QoS. Generally, all Oracle volumes are placed in a common capacity pool. However, it isn't a requirement. |
| `protocolTypes` | Protocol to use | This parameter should be either NFSv3 or NFSv4.1 and should match the protocol specified in the Export Policy Rule described earlier in this table. | 

## Examples: Application volume group for Oracle API request content

The examples in this section illustrate the values passed in the volume group creation request for various Oracle configurations. The examples demonstrate best practices for naming, sizing, and values as described in the tables.

In the following examples, selected placeholders are specified. You should replace them with values specific to your configuration. These values include:

* `<SubscriptionId>`:  
    Subscription ID. Example: `11111111-2222-3333-4444-555555555555`
* `<ResourceGroup>`:  
    Resource group. Example: `TestResourceGroup`
* `<NtapAccount>`:  
    NetApp account. Example: `TestAccount`
* `<VolumeGroupName>`:  
    Volume group name. Example: `SH9-Test-00001`
* `<SubnetId>`:  
    Subnet resource ID. Example: `/subscriptions/11111111-2222-3333-4444-555555555555/resourceGroups/myRP/providers/Microsoft.Network/virtualNetworks/testvnet3/subnets/SH9_Subnet`
* `<CapacityPoolResourceId>`:  
    Capacity pool resource ID. Example: `/subscriptions/11111111-2222-3333-4444-555555555555/resourceGroups/myRG/providers/Microsoft.NetApp/netAppAccounts/account1/capacityPools/SH9_Pool `

## Create application volume groups for Oracle using curl

Oracle volume groups for the following examples can be created using a sample shell script that calls the API using curl:

1. Extract the subscription ID. This command automates the extraction of the subscription ID and generates the authorization token:
    ```bash
    subId=$(az account list | jq ".[] | select (.name == \"Pay-As-You-Go\") | .id" -r)echo "Subscription ID: $subId" 
    ```
1. Create the access token:
    ```bash
    response=$(az account get-access-token)token=$(echo $response | jq ".accessToken" -r)echo "Token: $token" 
    ```
1. Call the REST API using curl: 
    ```bash
    echo "---"curl -X PUT -H "Authorization: Bearer $token" -H "Content-Type:application/json" -H "Accept:application/json" -d @<ExampleJson> https://management.azure.com/subscriptions/$subId/resourceGroups/<ResourceGroup>/providers/Microsoft.NetApp/netAppAccounts/<NtapAccount>/volumeGroups/<VolumeGroupName>?api-version=2023-05-01 | jq . 
    ```

## Example: Application volume group for Oracle creation request

This example creates a volume group name "group1" with the following volumes:
* test-ora-data1
* test-ora-data2
* test-ora-data3
* test-ora-data4
* test-ora-data5
* test-ora-data6
* test-ora-data7
* test-ora-data8
* test-ora-log
* test-ora-log-mirror
* test-ora-binary
* test-ora-backup

Save the JSON template as `sh9.json`:

> [!NOTE]
> The placeholders `<SubnetId>` and `<CapacityPoolResourceId>` need to be replaced, and the volume data need to be adapted when using this `json` as template for your own deployment.

```json
{ 
      "location": "westus", 
      "properties": { 
        "groupMetaData": { 
          "groupDescription": "Volume group", 
          "applicationType": "ORACLE", 
          "applicationIdentifier": "OR2" 
        }, 
        "volumes": [ 
          { 
            "name": "test-ora-data1", 
            "zones": [ 
              "1" 
            ], 
            "properties": { 
              "creationToken": " OR2-ora-data1", 
              "serviceLevel": "Premium", 
              "throughputMibps": 10, 
              "subnetId": <SubnetId>, 
              "usageThreshold": 107374182400, 
              "volumeSpecName": "ora-data1", 
              "capacityPoolResourceId": <CapacityPoolResourceId>, 
              "exportPolicy": { 
                "rules": [ 
                  { 
                    "ruleIndex": 1, 
                    "unixReadOnly": true, 
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
              ] 
            } 
          }, 
          { 
            "name": "test-ora-data2", 
            "zones": [ 
              "1" 
            ], 
            "properties": { 
              "creationToken": " OR2-ora-data2", 
              "serviceLevel": "Premium", 
              "throughputMibps": 10, 
              "subnetId": <SubnetId>, 
              "usageThreshold": 107374182400, 
              "volumeSpecName": "ora-data2", 
              "capacityPoolResourceId": <CapacityPoolResourceId>, 
              "exportPolicy": { 
                "rules": [ 
                  { 
                    "ruleIndex": 1, 
                    "unixReadOnly": true, 
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
              ] 
            } 
          }, 
          { 
            "name": "test-ora-data3", 
            "zones": [ 
              "1" 
            ], 
            "properties": { 
              "creationToken": " OR2-ora-data3", 
              "serviceLevel": "Premium", 
              "throughputMibps": 10, 
              "subnetId": <SubnetId>, 
              "usageThreshold": 107374182400, 
              "volumeSpecName": "ora-data3", 
              "capacityPoolResourceId": <CapacityPoolResourceId>, 
              "exportPolicy": { 
                "rules": [ 
                  { 
                    "ruleIndex": 1, 
                    "unixReadOnly": true, 
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
              ] 
            } 
          }, 
          { 
            "name": "test-ora-data4", 
            "zones": [ 
              "1" 
            ], 
            "properties": { 
              "creationToken": " OR2-ora-data4", 
              "serviceLevel": "Premium", 
              "throughputMibps": 10, 
              "subnetId": <SubnetId>, 
              "usageThreshold": 107374182400, 
              "volumeSpecName": "ora-data4", 
              "capacityPoolResourceId": <CapacityPoolResourceId>, 
              "exportPolicy": { 
                "rules": [ 
                  { 
                    "ruleIndex": 1, 
                    "unixReadOnly": true, 
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
              ] 
            } 
          }, 
          { 
            "name": " OR2-ora-data5", 
            "zones": [ 
              "1" 
            ], 
            "properties": { 
              "creationToken": "test-ora-data5", 
              "serviceLevel": "Premium", 
              "throughputMibps": 10, 
              "subnetId": <SubnetId>, 
              "usageThreshold": 107374182400, 
              "volumeSpecName": "ora-data5", 
              "capacityPoolResourceId": <CapacityPoolResourceId>, 
              "exportPolicy": { 
                "rules": [ 
                  { 
                    "ruleIndex": 1, 
                    "unixReadOnly": true, 
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
              ] 
            } 
          }, 
          { 
            "name": " OR2-ora-data6", 
            "zones": [ 
              "1" 
            ], 
            "properties": { 
              "creationToken": "test-ora-data6", 
              "serviceLevel": "Premium", 
              "throughputMibps": 10, 
              "subnetId": <SubnetId>, 
              "usageThreshold": 107374182400, 
              "volumeSpecName": "ora-data6", 
              "capacityPoolResourceId": <CapacityPoolResourceId>, 
              "exportPolicy": { 
                "rules": [ 
                  { 
                    "ruleIndex": 1, 
                    "unixReadOnly": true, 
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
              ] 
            } 
          }, 
          { 
            "name": " OR2-ora-data7", 
            "zones": [ 
              "1" 
            ], 
            "properties": { 
              "creationToken": "test-ora-data7", 
              "serviceLevel": "Premium", 
              "throughputMibps": 10, 
              "subnetId": <SubnetId>, 
              "usageThreshold": 107374182400, 
              "volumeSpecName": "ora-data7", 
              "capacityPoolResourceId": <CapacityPoolResourceId>, 
              "exportPolicy": { 
                "rules": [ 
                  { 
                    "ruleIndex": 1, 
                    "unixReadOnly": true, 
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
              ] 
            } 
          }, 
          { 
            "name": " OR2-ora-data8", 
            "zones": [ 
              "1" 
            ], 
            "properties": { 
              "creationToken": "test-ora-data8", 
              "serviceLevel": "Premium", 
              "throughputMibps": 10, 
              "subnetId": <SubnetId>, 
              "usageThreshold": 107374182400, 
              "volumeSpecName": "ora-data8", 
              "capacityPoolResourceId": <CapacityPoolResourceId>, 
              "exportPolicy": { 
                "rules": [ 
                  { 
                    "ruleIndex": 1, 
                    "unixReadOnly": true, 
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
              ] 
            } 
          }, 
          { 
            "name": " OR2-ora-log", 
            "zones": [ 
              "1" 
            ], 
            "properties": { 
              "creationToken": "test-ora-log", 
              "serviceLevel": "Premium", 
              "throughputMibps": 10, 
              "subnetId": <SubnetId>, 
              "usageThreshold": 107374182400, 
              "volumeSpecName": "ora-log", 
              "capacityPoolResourceId": <CapacityPoolResourceId>, 
              "exportPolicy": { 
                "rules": [ 
                  { 
                    "ruleIndex": 1, 
                    "unixReadOnly": true, 
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
              ] 
            } 
          }, 
          { 
            "name": " OR2-ora-log-mirror", 
            "zones": [ 
              "1" 
            ], 
            "properties": { 
              "creationToken": "test-ora-log-mirror", 
              "serviceLevel": "Premium", 
              "throughputMibps": 10, 
              "subnetId": <SubnetId>, 
              "usageThreshold": 107374182400, 
              "volumeSpecName": "ora-log-mirror", 
              "capacityPoolResourceId": <CapacityPoolResourceId>, 
              "exportPolicy": { 
                "rules": [ 
                  { 
                    "ruleIndex": 1, 
                    "unixReadOnly": true, 
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
              ] 
            } 
          }, 
          { 
            "name": " OR2-ora-binary", 
            "zones": [ 
              "1" 
            ], 
            "properties": { 
              "creationToken": "test-ora-binary", 
              "serviceLevel": "Premium", 
              "throughputMibps": 10, 
              "subnetId": <SubnetId>, 
              "usageThreshold": 107374182400, 
              "volumeSpecName": "ora-binary", 
              "capacityPoolResourceId": <CapacityPoolResourceId>, 
              "exportPolicy": { 
                "rules": [ 
                  { 
                    "ruleIndex": 1, 
                    "unixReadOnly": true, 
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
              ] 
            } 
          }, 
          { 
            "name": " OR2-ora-backup", 
            "zones": [ 
              "1" 
            ], 
            "properties": { 
              "creationToken": "test-ora-backup", 
              "serviceLevel": "Premium", 
              "throughputMibps": 10, 
              "subnetId": <SubnetId>, 
              "usageThreshold": 107374182400, 
              "volumeSpecName": "ora-backup", 
              "capacityPoolResourceId": <CapacityPoolResourceId>, 
              "exportPolicy": { 
                "rules": [ 
                  { 
                    "ruleIndex": 1, 
                    "unixReadOnly": true, 
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
              ]
            }
          }
        ]
      }
    }
  }
}
```
## Adapt and start the script 

> [!NOTE]
> This json input file should now be used with the above script.

```bash
#! /bin/bash
# 1. Extract the subscription ID:
#
subId=$(az account list | jq ".[] | select (.name == \"Pay-As-You-Go\") | .id" -r)
echo "Subscription ID: $subId"
 
#
# 2. Create the access token:
#
response=$(az account get-access-token)
token=$(echo $response | jq ".accessToken" -r)
echo "Token: $token"
#
# 3. Call the REST API using curl
# 
echo "---"
curl -X PUT -H "Authorization: Bearer $token" -H "Content-Type:application/json" -H "Accept:application/json" -d @sh9.json https://management.azure.com/subscriptions/$subId/resourceGroups/rg-westus/providers/Microsoft.NetApp/netAppAccounts/ANF-WestUS-test/volumeGroups/test-ORA?api-version=2022-03-01 | jq .
```

## Sample result 

> [!NOTE] 
> Using `| jq .` at the end of the curl call, the returned json is well formatted.

```
{
        "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myRG/providers/Microsoft.NetApp/netAppAccounts/account1/volumeGroups/group1",
        "name": "group1",
        "type": "Microsoft.NetApp/netAppAccounts/volumeGroups",
        "location": "westus",
        "properties": {
          "provisioningState": "Creating",
          "groupMetaData": {
            "groupDescription": "Volume group",
            "applicationType": "ORACLE",
            "applicationIdentifier": "OR2"
          },
          "volumes": [
            {
              "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myRG/providers/Microsoft.NetApp/netAppAccounts/account1/capacityPools/pool1/volumes/test-ora-data1",
              "type": "Microsoft.NetApp/netAppAccounts/capacityPools/volumes",
              "name": "test-ora-data1",
              "zones": [
                "1"
              ],
              "properties": {
                "throughputMibps": 10.0,
                "volumeSpecName": "ora-data1",
                "serviceLevel": "Premium",
                "creationToken": "test-ora-data1",
                "usageThreshold": 107374182400,
                "subnetId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myRP/providers/Microsoft.Network/virtualNetworks/testvnet3/subnets/testsubnet3",
                "exportPolicy": {
                  "rules": [
                    {
                      "ruleIndex": 1,
                      "unixReadOnly": true,
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
                ]
              }
            },
            {
              "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myRG/providers/Microsoft.NetApp/netAppAccounts/account1/capacityPools/pool1/volumes/test-ora-data2",
              "type": "Microsoft.NetApp/netAppAccounts/capacityPools/volumes",
              "name": "test-ora-data2",
              "zones": [
                "1"
              ],
              "properties": {
                "throughputMibps": 10.0,
                "volumeSpecName": "ora-data2",
                "serviceLevel": "Premium",
                "creationToken": "test-ora-data2",
                "usageThreshold": 107374182400,
                "subnetId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myRP/providers/Microsoft.Network/virtualNetworks/testvnet3/subnets/testsubnet3",
                "exportPolicy": {
                  "rules": [
                    {
                      "ruleIndex": 1,
                      "unixReadOnly": true,
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
                ]
              }
            },
            {
              "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myRG/providers/Microsoft.NetApp/netAppAccounts/account1/capacityPools/pool1/volumes/test-ora-data3",
              "type": "Microsoft.NetApp/netAppAccounts/capacityPools/volumes",
              "name": "test-ora-data3",
              "zones": [
                "1"
              ],
              "properties": {
                "throughputMibps": 10.0,
                "volumeSpecName": "ora-data3",
                "serviceLevel": "Premium",
                "creationToken": "test-ora-data3",
                "usageThreshold": 107374182400,
                "subnetId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myRP/providers/Microsoft.Network/virtualNetworks/testvnet3/subnets/testsubnet3",
                "exportPolicy": {
                  "rules": [
                    {
                      "ruleIndex": 1,
                      "unixReadOnly": true,
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
                ]
              }
            },
            {
              "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myRG/providers/Microsoft.NetApp/netAppAccounts/account1/capacityPools/pool1/volumes/test-ora-data4",
              "type": "Microsoft.NetApp/netAppAccounts/capacityPools/volumes",
              "name": "test-ora-data4",
              "zones": [
                "1"
              ],
              "properties": {
                "throughputMibps": 10.0,
                "volumeSpecName": "ora-data4",
                "serviceLevel": "Premium",
                "creationToken": "test-ora-data4",
                "usageThreshold": 107374182400,
                "subnetId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myRP/providers/Microsoft.Network/virtualNetworks/testvnet3/subnets/testsubnet3",
                "exportPolicy": {
                  "rules": [
                    {
                      "ruleIndex": 1,
                      "unixReadOnly": true,
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
                ]
              }
            },
            {
              "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myRG/providers/Microsoft.NetApp/netAppAccounts/account1/capacityPools/pool1/volumes/test-ora-data5",
              "type": "Microsoft.NetApp/netAppAccounts/capacityPools/volumes",
              "name": "test-ora-data5",
              "zones": [
                "1"
              ],
              "properties": {
                "throughputMibps": 10.0,
                "volumeSpecName": "ora-data5",
                "serviceLevel": "Premium",
                "creationToken": "test-ora-data5",
                "usageThreshold": 107374182400,
                "subnetId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myRP/providers/Microsoft.Network/virtualNetworks/testvnet3/subnets/testsubnet3",
                "exportPolicy": {
                  "rules": [
                    {
                      "ruleIndex": 1,
                      "unixReadOnly": true,
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
                ]
              }
            },
            {
              "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myRG/providers/Microsoft.NetApp/netAppAccounts/account1/capacityPools/pool1/volumes/test-ora-data6",
              "type": "Microsoft.NetApp/netAppAccounts/capacityPools/volumes",
              "name": "test-ora-data6",
              "zones": [
                "1"
              ],
              "properties": {
                "throughputMibps": 10.0,
                "volumeSpecName": "ora-data6",
                "serviceLevel": "Premium",
                "creationToken": "test-ora-data6",
                "usageThreshold": 107374182400,
                "subnetId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myRP/providers/Microsoft.Network/virtualNetworks/testvnet3/subnets/testsubnet3",
                "exportPolicy": {
                  "rules": [
                    {
                      "ruleIndex": 1,
                      "unixReadOnly": true,
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
                ]
              }
            },
            {
              "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myRG/providers/Microsoft.NetApp/netAppAccounts/account1/capacityPools/pool1/volumes/test-ora-data7",
              "type": "Microsoft.NetApp/netAppAccounts/capacityPools/volumes",
              "name": "test-ora-data7",
              "zones": [
                "1"
              ],
              "properties": {
                "throughputMibps": 10.0,
                "volumeSpecName": "ora-data7",
                "serviceLevel": "Premium",
                "creationToken": "test-ora-data7",
                "usageThreshold": 107374182400,
                "subnetId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myRP/providers/Microsoft.Network/virtualNetworks/testvnet3/subnets/testsubnet3",
                "exportPolicy": {
                  "rules": [
                    {
                      "ruleIndex": 1,
                      "unixReadOnly": true,
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
                ]
              }
            },
            {
              "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myRG/providers/Microsoft.NetApp/netAppAccounts/account1/capacityPools/pool1/volumes/test-ora-data8",
              "type": "Microsoft.NetApp/netAppAccounts/capacityPools/volumes",
              "name": "test-ora-data8",
              "zones": [
                "1"
              ],
              "properties": {
                "throughputMibps": 10.0,
                "volumeSpecName": "ora-data8",
                "serviceLevel": "Premium",
                "creationToken": "test-ora-data8",
                "usageThreshold": 107374182400,
                "subnetId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myRP/providers/Microsoft.Network/virtualNetworks/testvnet3/subnets/testsubnet3",
                "exportPolicy": {
                  "rules": [
                    {
                      "ruleIndex": 1,
                      "unixReadOnly": true,
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
                ]
              }
            },
            {
              "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myRG/providers/Microsoft.NetApp/netAppAccounts/account1/capacityPools/pool1/volumes/test-ora-log",
              "type": "Microsoft.NetApp/netAppAccounts/capacityPools/volumes",
              "name": "test-ora-log",
              "zones": [
                "1"
              ],
              "properties": {
                "throughputMibps": 10.0,
                "volumeSpecName": "ora-log",
                "serviceLevel": "Premium",
                "creationToken": "test-ora-log",
                "usageThreshold": 107374182400,
                "subnetId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myRP/providers/Microsoft.Network/virtualNetworks/testvnet3/subnets/testsubnet3",
                "exportPolicy": {
                  "rules": [
                    {
                      "ruleIndex": 1,
                      "unixReadOnly": true,
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
                ]
              }
            },
            {
              "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myRG/providers/Microsoft.NetApp/netAppAccounts/account1/capacityPools/pool1/volumes/test-ora-log-mirror",
              "type": "Microsoft.NetApp/netAppAccounts/capacityPools/volumes",
              "name": "test-ora-log-mirror",
              "zones": [
                "1"
              ],
              "properties": {
                "throughputMibps": 10.0,
                "volumeSpecName": "ora-log-mirror",
                "serviceLevel": "Premium",
                "creationToken": "test-ora-log-mirror",
                "usageThreshold": 107374182400,
                "subnetId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myRP/providers/Microsoft.Network/virtualNetworks/testvnet3/subnets/testsubnet3",
                "exportPolicy": {
                  "rules": [
                    {
                      "ruleIndex": 1,
                      "unixReadOnly": true,
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
                ]
              }
            },
            {
              "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myRG/providers/Microsoft.NetApp/netAppAccounts/account1/capacityPools/pool1/volumes/test-ora-binary",
              "type": "Microsoft.NetApp/netAppAccounts/capacityPools/volumes",
              "name": "test-ora-binary",
              "zones": [
                "1"
              ],
              "properties": {
                "throughputMibps": 10.0,
                "volumeSpecName": "ora-binary",
                "serviceLevel": "Premium",
                "creationToken": "test-ora-binary",
                "usageThreshold": 107374182400,
                "subnetId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myRP/providers/Microsoft.Network/virtualNetworks/testvnet3/subnets/testsubnet3",
                "exportPolicy": {
                  "rules": [
                    {
                      "ruleIndex": 1,
                      "unixReadOnly": true,
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
                ]
              }
            },
            {
              "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myRG/providers/Microsoft.NetApp/netAppAccounts/account1/capacityPools/pool1/volumes/test-ora-backup",
              "type": "Microsoft.NetApp/netAppAccounts/capacityPools/volumes",
              "name": "test-ora-backup",
              "zones": [
                "1"
              ],
              "properties": {
                "throughputMibps": 10.0,
                "volumeSpecName": "ora-backup",
                "serviceLevel": "Premium",
                "creationToken": "test-ora-backup",
                "usageThreshold": 107374182400,
                "subnetId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myRP/providers/Microsoft.Network/virtualNetworks/testvnet3/subnets/testsubnet3",
                "exportPolicy": {
                  "rules": [
                    {
                      "ruleIndex": 1,
                      "unixReadOnly": true,
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
                ]
              }
            }
          ]
        }
      }
    }
  }
}
```

## Next steps

* [Understand application volume group for Oracle](application-volume-group-oracle-introduction.md)
* [Requirements and considerations for application volume group for Oracle](application-volume-group-oracle-considerations.md)
* [Deploy application volume group for Oracle](application-volume-group-oracle-deploy-volumes.md)
* [Manage volumes in an application volume group for Oracle](application-volume-group-manage-volumes-oracle.md)
* [Deploy application volume group for Oracle using Azure Resource Manager](configure-application-volume-oracle-azure-resource-manager.md) 
* [Troubleshoot application volume group errors](troubleshoot-application-volume-groups.md)
* [Delete an application volume group](application-volume-group-delete.md)
* [Application volume group FAQs](faq-application-volume-group.md)