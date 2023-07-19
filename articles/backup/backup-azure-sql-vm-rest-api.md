---
title: Back up SQL server databases in Azure VMs using Azure Backup via REST API
description: Learn how to use REST API to back up SQL server databases in Azure VMs in the Recovery Services vault
ms.topic: conceptual
ms.date: 08/11/2022
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Back up SQL server databases in Azure VMs using Azure Backup via REST API

This article describes how to back up SQL server databases in Azure VMs using Azure Backup via REST API.

>[!Note]
>See the [SQL backup support matrix](sql-support-matrix.md) to know more about the supported configurations and scenarios.

## Prerequisites

- A Recovery Services vault
- A policy for configuring backup for your SQL databases.

For more information on how to create new vaults and policies, see [create vault](backup-azure-arm-userestapi-createorupdatevault.md) and [create policy](backup-azure-arm-userestapi-createorupdatepolicy.md) REST API tutorials.

Use the following resources:

- **Recovery Services Vault**: *SQLServer2012*
- **Policy**: *HourlyLogBackup*
- **Resource group**: *SQLServerSelfHost*

## Configure backup for unprotected SQL server databases in Azure VM

### Discover unprotected SQL Server databases

The vault needs to discover all Azure VMs in the subscription with SQL databases that you can back up to the Recovery Services vault. To fetch the details, trigger the [refresh operation](/rest/api/backup/protection-containers/refresh). It's an asynchronous *POST* operation that ensures the vault receives the latest list of all unprotected SQL databases in the current subscription and *caches* them. Once the database is *cached*, recovery services can access the database and protect it.

```http
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{vaultResourceGroupName}/providers/microsoft.recoveryservices/vaults/{vaultName}/backupFabrics/{fabricName}/refreshContainers?api-version=2016-12-01&$filter={$filter}
```

The *POST URI* has `{subscriptionId}`, `{vaultName}`, `{vaultresourceGroupName}`, and `{fabricName}` parameters. In the following example, the values for the different parameters are as follows:

- `{fabricName}`: *Azure*
- `{vaultName}`: *SQLServer2012*
- `{vaultresourceGroupName}`: *SQLServerSelfHost*
- `$filter`: *backupManagementType eq 'AzureWorkload'*

As all the required parameters are given in the URI3, a separate request body isn't needed.

```http
POST https://management.azure.com/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/refreshContainers?api-version=2016-12-01&$filter=backupManagementType eq 'AzureWorkload'
```

#### Responses to the refresh operation

The *refresh* operation is an [asynchronous operation](../azure-resource-manager/management/async-operations.md). It means this operation creates another operation that needs to be tracked separately.

It returns two responses: 202 (Accepted) when another operation is created, and 200 (OK) when that operation is complete.

##### Example responses to the refresh operation

Once you submit the *POST* request, a 202 (Accepted) response is returned.

```http
HTTP/1.1 202 Accepted
Pragma: no-cache
Retry-After: 60
X-Content-Type-Options: nosniff
x-ms-request-id: a85ee4a2-56d7-4477-b29c-d140a8bb90fe
x-ms-client-request-id: 4653a4ed-ffbe-4492-ae7d-3e1ab03722af; 4653a4ed-ffbe-4492-ae7d-3e1ab03722af
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-writes: 1199
x-ms-correlation-request-id: a85ee4a2-56d7-4477-b29c-d140a8bb90fe
x-ms-routing-request-id: SOUTHINDIA:20180528T075517Z:a85ee4a2-56d7-4477-b29c-d140a8bb90fe
Cache-Control: no-cache
Date: Mon, 28 May 2018 07:55:16 GMT
Location: https://management.azure.com/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/operationResults/a60bfc5e-e237-4ead-be5c-b845e9566ea8?api-version=2016-12-01
X-Powered-By: ASP.NET
```

Track the resulting operation using the *Location* header with a simple *GET* command.

```http
GET https://management.azure.com/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/operationResults/a60bfc5e-e237-4ead-be5c-b845e9566ea8?api-version=2016-12-01
```

Once all the SQL databases are discovered, the *GET* command returns a 200 (No Content) response. The vault can now discover any VM with SQL databases that can be backed-up within the subscription.

```http
HTTP/1.1 204 NoContent
Pragma: no-cache
X-Content-Type-Options: nosniff
x-ms-request-id: 55ae46bb-0d61-4284-a408-bcfaa36af643
x-ms-client-request-id: b5ffa56f-a521-48a4-91b2-e3bc1e3f1110; b5ffa56f-a521-48a4-91b2-e3bc1e3f1110
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-reads: 14968
x-ms-correlation-request-id: 55ae46bb-0d61-4284-a408-bcfaa36af643
x-ms-routing-request-id: SOUTHINDIA:20180528T075607Z:55ae46bb-0d61-4284-a408-bcfaa36af643
Cache-Control: no-cache
Date: Mon, 28 May 2018 07:56:06 GMT
X-Powered-By: ASP.NET
```

### List VMs with SQL databases to back up with Recovery Services vault

To confirm that *caching* is done, list all VMs in the subscription with SQL databases that can be backed-up with the Recovery Services vault. Then locate the desired storage account in the response. This's done using the [GET ProtectableContainers](/rest/api/backup/protectable-containers/list) operation.

```http
GET https://management.azure.com/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/protectableContainers?api-version=2016-12-01&$filter=backupManagementType eq 'AzureWorkload'
```

>[!Note]
>The *GET* URI has all the required parameters. No additional request body is needed.

Example of response body:

```json
{
  "value": [
    {
      "id": "/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/protectableContainers/VMAppContainer;Compute;SQLServerPMDemo;ad-primary-dc",
      "name": "VMAppContainer;Compute;SQLServerPMDemo;ad-primary-dc",
      "type": "Microsoft.RecoveryServices/vaults/backupFabrics/protectableContainers",
      "properties": {
        "friendlyName": "ad-primary-dc",
        "backupManagementType": "AzureWorkload",
        "protectableContainerType": "VMAppContainer",
        "healthStatus": "Healthy",
        "containerId": "/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerPMDemo/providers/Microsoft.Compute/virtualMachines/ad-primary-dc"
      }
    },
    {
      "id": "/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/protectableContainers/VMAppContainer;Compute;SQLServerPMDemo;ad-secondry-dc",
      "name": "VMAppContainer;Compute;SQLServerPMDemo;ad-secondry-dc",
      "type": "Microsoft.RecoveryServices/vaults/backupFabrics/protectableContainers",
      "properties": {
        "friendlyName": "ad-secondry-dc",
        "backupManagementType": "AzureWorkload",
        "protectableContainerType": "VMAppContainer",
        "healthStatus": "Healthy",
        "containerId": "/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerPMDemo/providers/Microsoft.Compute/virtualMachines/ad-secondry-dc"
      }
    },
    {
      "id": "/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/protectableContainers/VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0",
      "name": "VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0",
      "type": "Microsoft.RecoveryServices/vaults/backupFabrics/protectableContainers",
      "properties": {
        "friendlyName": "sqlserver-0",
        "backupManagementType": "AzureWorkload",
        "protectableContainerType": "VMAppContainer",
        "healthStatus": "Healthy",
        "containerId": "/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerPMDemo/providers/Microsoft.Compute/virtualMachines/sqlserver-0"
      }
    }
  ]
}
```

As we can locate the VMs in the response body with their friendly names, the refresh operation performed above was successful. The Recovery Services vault can now successfully discover VMs with unprotected SQL databases in the same subscription.

### Register VMs with Recovery Services vault

You need to register the VMs with the Recovery Services vault so that the Azure Backup service is can interact with SQL databases within the VM (use the value in the *Name* field to identify the Azure VM container). You need to provide the values in the JSON request to obtain the HTTP request body from the properties bag of the list protectable containers result.

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/microsoft.recoveryservices/vaults/{vaultName}/backupFabrics/Azure/protectionContainers/{containerName}?api-version=2016-12-01
```

Set the variables for the URI as follows:

- `{resourceGroupName}` - *SQLServerSelfHost*
- `{fabricName}` - *Azure*
- `{vaultName}` - *SQLServer2012*
- `{containerName}` - This is the name attribute in the response body of the *GET ProtectableContainers* operation. In our example, the attribute name is *VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0*.

>[!NOTE]
>Always take the name attribute of the response and fill it in this request. Don't hard-code or create the container-name format. If you create or hard-code it, the API call will fail if the container-name format changes in the future.

<br>

```http
PUT https://management.azure.com/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/protectionContainers/VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0?api-version=2016-12-01
```

The create request body is as follows:

```json
{
  "properties": {
    "backupManagementType": "AzureWorkload",
    "friendlyName": "sqlserver-0",
    "containerType": "VMAppContainer",
    "sourceResourceId": "/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/protectableContainers/VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0",
    "workloadType": "SQLDataBase"
  }
}
```

For the complete list of definitions of the request body and other details, see [ProtectionContainers-Register](/rest/api/backup/protection-containers/register#azurestoragecontainer).

This's an asynchronous operation and returns two responses: 202 (Accepted) when the operation is accepted, and 200 (OK) when the operation is complete.  To track the operation status, use the location header to get the latest status of the operation.

```http
GET https://management.azure.com/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/protectionContainers/VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0/operationResults/2a72d206-b4d8-4c59-89ef-ef3283132237?api-version=2016-12-01
```

Example of response body when operation is complete:

```json
{
  "id": "/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/protectionContainers/VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0",
  "name": "VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0",
  "type": "Microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers",
  "properties": {
    "sourceResourceId": "/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerPMDemo/providers/Microsoft.Compute/virtualMachines/sqlserver-0",
    "lastUpdatedTime": "2018-05-28T08:33:14.7304852Z",
    "extendedInfo": {
      "hostServerName": "sqlserver-0.shopkart.com",
      "inquiryInfo": {
        "status": "Success",
        "errorDetail": {
          "code": "Success",
          "message": "",
          "recommendations": [
            ""
          ]
        },
        "inquiryDetails": [
          {
            "type": "SQL",
            "itemCount": 5,
            "inquiryValidation": {
              "status": "Success",
              "errorDetail": {
                "code": "Success",
                "message": "",
                "recommendations": [
                  ""
                ]
              }
            }
          }
        ]
      }
    },
    "friendlyName": "sqlserver-0",
    "backupManagementType": "AzureWorkload",
    "registrationStatus": "Registered",
    "healthStatus": "Healthy",
    "containerType": "VMAppContainer",
    "protectableObjectType": "VMAppContainer"
  }
}
```

You can verify if the registration was successful from the value of the *registrationstatus* parameter in the response body. In our case, it shows the status as registered for *SQLServer2012*; so, the registration operation was successful.

### Inquire all unprotected SQL databases under a VM

To inquire about protectable items in a storage account, use the [Protection Containers-Inquire](/rest/api/backup/protection-containers/inquire) operation. It's an asynchronous operation and the results should be tracked using the location header.

```http
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/{fabricName}/protectionContainers/{containerName}/inquire?api-version=2016-12-01$filter={$filter}
```

Set the variables for the above URI as follows:

- `{resourceGroupName}`: *SQLServerSelfHost*
- `{vaultName}`: *SQLServer2012*
- `{fabricName}`: *Azure*
- `{containerName}`: Refer to the name attribute in the response body of the GET ProtectableContainers operation. In our example, the attribute name is *VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0*.

```http
POST https://management.azure.com/subscriptions/e3d2d341-4ddb-4c5d-9121-69b7e719485e/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/protectionContainers/VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0/inquire?api-version=2016-12-01$filter=workloadType EQ 'SQLDatabase'
```

Once the request is successful, it returns the status code *OK*.

```http
HTTP/1.1 202 Accepted
Pragma: no-cache
Retry-After: 60
X-Content-Type-Options: nosniff
x-ms-request-id: 50295ae9-3d5b-48d1-8a6d-a0acb6d06b98
x-ms-client-request-id: 4174f98a-80b9-4747-9500-6f702ed83930; 4174f98a-80b9-4747-9500-6f702ed83930
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-writes: 1197
x-ms-correlation-request-id: 50295ae9-3d5b-48d1-8a6d-a0acb6d06b98
x-ms-routing-request-id: SOUTHINDIA:20180528T084628Z:50295ae9-3d5b-48d1-8a6d-a0acb6d06b98
Cache-Control: no-cache
Date: Mon, 28 May 2018 08:46:28 GMT
Location: https://management.azure.com/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/protectionContainers/VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0/operationResults/f0751ec2-445a-4d0e-a6a5-a19957459655?api-version=2016-12-01
X-Powered-By: ASP.NET
```

### Select the databases you want to back up

To list all protectable items under the subscription and locate the desired database to be backed-up, use the [GET backupprotectableItems](/rest/api/backup/backup-protectable-items/list) operation.

```http
GET https://management.azure.com/Subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupProtectableItems?api-version=2016-12-01&$filter={$filter}
```

Construct the URI as follows:

- `{resourceGroupName}`: *SQLServerSelfHost*
- `{vaultName}`: *SQLServer2012*
- `{$filter}`: *backupManagementType eq 'AzureWorkload'*

```http
GET https://management.azure.com/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupProtectableItems?api-version=2016-12-01&$filter=backupManagementType eq 'AzureWorkload'
```

Sample response:

```json
Status Code:200

{
  "value": [
    {
      "id": "/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/protectionContainers/vmappcontainer;compute;SQLServerSelfHost;SQLServersql2012/protectableItems/sqldatabase;mssqlserver;msdb",
      "name": "sqldatabase;mssqlserver;msdb",
      "type": "Microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers/protectableItems",
      "properties": {
        "parentName": "MSSQLSERVER",
        "serverName": "SQLServersql2012",
        "isAutoProtectable": false,
        "subinquireditemcount": 0,
        "subprotectableitemcount": 0,
        "backupManagementType": "AzureWorkload",
        "workloadType": "SQL",
        "protectableItemType": "SQLDataBase",
        "friendlyName": "msdb",
        "protectionState": "NotProtected"
      }
    }
]
}
```

The response contains the list of all unprotected databases and contains all information required by Azure Recovery Service to configure backup. Save the database names for future use.

### Enable backup for the database

After the relevant database is *identified* with the friendly name:

1. Select the policy to protect.
1. [List existing policies in the vault, see with list Policy API](/rest/api/backup/backup-policies/list).
1. Select the [relevant policy](/rest/api/backup/protection-policies/get) by referring to the policy name.
1. [Create policy tutorial](./backup-azure-arm-userestapi-createorupdatepolicy.md).

Enabling protection is an asynchronous *PUT* operation that creates a *protected item*.

```http
PUT https://management.azure.com/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/protectionContainers/{containerName};sqlserver-0/protectedItems/{protectedItemName}?api-version=2016-12-01
```

Set the **containerName** and **protectedItemName** variables using the ID attribute in the response body of the *GET backupprotectableitems* operation.

In our example, the ID of file share we want to protect is:

```
/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/protectionContainers/VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0/protectedItems/sqldatabase;mssqlserver;msdb
```

- `{containerName}`: *VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0*
- `{protectedItemName}`: *sqldatabase;mssqlserver;msdb*

Create a request body:

The following request body defines properties required to create a protected item.

```json
{
  "properties": {
    "backupManagementType": "AzureWorkload",
    "workloadType": "SQLDataBase",
    "policyId": "/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupPolicies/HourlyLogBackup"
  },
  "location": "westcentralus"
}
```
Once you submit the *PUT* request for protected item creation or update, the initial response is 202 (Accepted) with a location header.

Sample response

The creation of a protected item is an asynchronous operation, which creates another operation that needs to be tracked. It returns two responses: 202 (Accepted) when another operation is created, and 200 (OK) when that operation is complete.

Once you submit the *PUT* request for protected item creation or update, the initial response is 202 (Accepted) with a location header.

```http
HTTP/1.1 202 Accepted
Pragma: no-cache
Retry-After: 60
Azure-AsyncOperation: https://management.azure.com/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/protectionContainers/VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0/protectedItems/sqldatabase;mssqlserver;msdb/operationsStatus/b686a165-387f-461d-8579-c55338566338?api-version=2016-12-01
X-Content-Type-Options: nosniff
x-ms-request-id: ab6a8c6c-ab90-433a-8dc2-5194901d428d
x-ms-client-request-id: 7d03bcef-562a-4ddc-8086-a3f4981be915; 7d03bcef-562a-4ddc-8086-a3f4981be915
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-writes: 1199
x-ms-correlation-request-id: ab6a8c6c-ab90-433a-8dc2-5194901d428d
x-ms-routing-request-id: SOUTHINDIA:20180528T102112Z:ab6a8c6c-ab90-433a-8dc2-5194901d428d
Cache-Control: no-cache
Date: Mon, 28 May 2018 10:21:12 GMT
Location: https://management.azure.com/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/protectionContainers/VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0/protectedItems/sqldatabase;mssqlserver;msdb/operationResults/b686a165-387f-461d-8579-c55338566338?api-version=2016-12-01
X-Powered-By: ASP.NET
```

Then track the resulting operation using the location header or Azure-AsyncOperation header with a  *GET* command.

```http
GET https://management.azure.com/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/protectionContainers/VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0/protectedItems/sqldatabase;mssqlserver;msdb/operationResults/b686a165-387f-461d-8579-c55338566338?api-version=2016-12-01
```

Once the operation is complete, it returns 200 (OK) with the protected item content in the response body.

Sample Response Body:

```json
{
  "id": "/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/protectionContainers/VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0/protectedItems/SQLDataBase;mssqlserver;msdb",
  "name": "SQLDataBase;mssqlserver;msdb",
  "type": "Microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers/protectedItems",
  "properties": {
    "friendlyName": "msdb",
    "serverName": "sqlserver-0.shopkart.com",
    "parentName": "MSSQLSERVER",
    "parentType": "AzureVmWorkloadSQLInstance",
    "protectionStatus": "Healthy",
    "protectionState": "IRPending",
    "lastBackupStatus": "IRPending",
    "lastBackupErrorDetail": {
      "code": "Success",
      "message": ""
    },
    "protectedItemDataSourceId": "17592741727863",
    "protectedItemHealthStatus": "IRPending",
    "extendedInfo": {
      "recoveryPointCount": 0,
      "policyState": "Consistent"
    },
    "protectedItemType": "AzureVmWorkloadSQLDatabase",
    "backupManagementType": "AzureWorkload",
    "workloadType": "SQLDataBase",
    "containerName": "VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0",
    "sourceResourceId": "/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerPMDemo/providers/VMAppContainer/sqlserver-0",
    "policyId": "/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupPolicies/HourlyLogBackup"
  }
}
```

This confirms that protection is enabled for the database, and the first backup will be triggered according to the policy schedule.

## Trigger an on-demand backup for the database

Once you configure a database for backup, backups run according to the policy schedule. You can wait for the first scheduled backup or trigger an on-demand backup anytime.

Triggering an on-demand backup is a *POST* operation.

>[!Note]
>The retention period of this backup is determined by the type of on-demand backup you have run.
>
>- *On-demand full* retains backups for a minimum of *45 days* and a maximum of *99 years*.
>- *On-demand copy only full* accepts any v0alue for retaintion.
>- *On-demand differential* retains backup as per the retention of scheduled differentials set in policy.
>- *On-demand log* retains backups as per the retention of scheduled logs set in policy.

```http
POST https://management.azure.com/Subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/{fabricName}/protectionContainers/{containerName}/protectedItems/{protectedItemName}/backup?api-version=2016-12-01
```

{containerName} and {protectedItemName} are as constructed above while enabling backup. For our example, this translates to:

```http
POST https://management.azure.com/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/Microsoft.RecoveryServices/vaults/SQLServer2012/backupFabrics/Azure/protectionContainers/VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0/protectedItems/sqldatabase;mssqlserver;msdb/backup?api-version=2016-12-01
```

### Create request body

Use the following request body to create an on-demand full backup.

```json
{
  "properties": {
    "objectType": "AzureWorkloadBackupRequest",
    "backupType": "Full"
  }
}
```

### Responses to the on-demand backup operation

Triggering an on-demand backup is an [asynchronous operation](../azure-resource-manager/management/async-operations.md). It means this operation creates another operation that needs to be tracked separately.

It returns two responses: 202 (Accepted) when another operation is created and 200 (OK) when that operation is complete.

### Example responses to the on-demand backup operation

Once you submit the *POST* request for an on-demand backup, the initial response is 202 (Accepted) with a location header or Azure-async-header.

```http
HTTP/1.1 202 Accepted
Pragma: no-cache
Retry-After: 60
Azure-AsyncOperation: https://management.azure.com/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/protectionContainers/VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0/protectedItems/sqldatabase;mssqlserver;msdb/operationsStatus/cd2a3b13-d392-4e81-86ac-02ea91cc70b9?api-version=2016-12-01
X-Content-Type-Options: nosniff
x-ms-request-id: a691e2a9-8203-462d-a4da-d1badde22f83
x-ms-client-request-id: 6b033cf6-f875-4c03-8985-9add07ec2845; 6b033cf6-f875-4c03-8985-9add07ec2845
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-writes: 1199
x-ms-correlation-request-id: a691e2a9-8203-462d-a4da-d1badde22f83
x-ms-routing-request-id: SOUTHINDIA:20180528T114321Z:a691e2a9-8203-462d-a4da-d1badde22f83
Cache-Control: no-cache
Date: Mon, 28 May 2018 11:43:21 GMT
Location: https://management.azure.com/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/protectionContainers/VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0/protectedItems/sqldatabase;mssqlserver;msdb/operationResults/cd2a3b13-d392-4e81-86ac-02ea91cc70b9?api-version=2016-12-01
X-Powered-By: ASP.NET
```

Then track the resulting operation using the location header or Azure-AsyncOperation header with a  *GET* command.

```http
GET https://management.azure.com/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/protectionContainers/VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0/protectedItems/sqldatabase;mssqlserver;msdb/operationsStatus/cd2a3b13-d392-4e81-86ac-02ea91cc70b9?api-version=2016-12-01
```

Once the operation is complete, it returns 200 (OK) with the ID of the resulting backup job in the response body.

#### Sample response body

```json
{
  "id": "cd2a3b13-d392-4e81-86ac-02ea91cc70b9",
  "name": "cd2a3b13-d392-4e81-86ac-02ea91cc70b9",
  "status": "Succeeded",
  "startTime": "2018-05-28T11:43:21.6516182Z",
  "endTime": "2018-05-28T11:43:21.6516182Z",
  "properties": {
    "objectType": "OperationStatusJobExtendedInfo",
    "jobId": "c22eca5d-0c1c-48a0-a40d-69bef708d92a"
  }
}
```

As the backup job is a long running operation, it needs to be tracked as explained in the [monitor jobs using REST API document](backup-azure-arm-userestapi-managejobs.md#tracking-the-job).

## Next steps

- Learn how to [restore SQL databases using REST API](restore-azure-sql-vm-rest-api.md).
