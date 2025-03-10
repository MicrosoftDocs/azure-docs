---
title:  Manage the backup jobs using REST API in Azure Backup
description: In this article, learn how to track and manage the backup and restore jobs of Azure Backup using REST API.
ms.service: azure-backup
ms.topic: how-to
ms.date: 02/09/2025
ms.assetid: b234533e-ac51-4482-9452-d97444f98b38
author: jyothisuri
ms.author: jsuri
ms.custom: engagement-fy24
---

# Track the backup and restore jobs using REST API in Azure Backup

This article describes how to monitor the backup and restore jobs using REST API in Azure Backup.

The Azure Backup service triggers jobs that run in background in various scenarios such as triggering backup, restore operations, disabling backup. You can track these jobs using their IDs.

## Fetch Job information from operations

Triggering a backup operation always returns a jobID. The following example provides the final response of a [trigger backup REST API operation](backup-azure-arm-userestapi-backupazurevms.md#example-responses-for-on-demand-backup):

```http
{
  "id": "cd153561-20d3-467a-b911-cc1de47d4763",
  "name": "cd153561-20d3-467a-b911-cc1de47d4763",
  "status": "Succeeded",
  "startTime": "2018-09-12T02:16:56.7399752Z",
  "endTime": "2018-09-12T02:16:56.7399752Z",
  "properties": {
    "objectType": "OperationStatusJobExtendedInfo",
    "jobId": "41f3e94b-ae6b-4a20-b422-65abfcaf03e5"
  }
}
```

You can identify the Azure Virtual Machine (VM) backup job by the "jobId" field. Track the job  as mentioned [here](/rest/api/backup/job-details) using a simple `GET` request.

## Track the job

```http
GET https://management.azure.com/Subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupJobs/{jobName}?api-version=2019-05-13
```

The `{jobName}` is `jobId`. The response is always 200 OK with the "status" field indicating the current status of the job. Once the job is complete with the message `Completed` or `CompletedWithWarnings`, the *extendedInfo* section provides more details about the job.

### Response

|Name  |Type  |Description  |
|---------|---------|---------|
|200 OK     | [JobResource](/rest/api/backup/job-details/get#jobresource)        | OK        |

#### Example response

Once the `GET` URI submission is complete, a 200 (OK) response is returned.

```http
HTTP/1.1 200 OK
Pragma: no-cache
X-Content-Type-Options: nosniff
x-ms-request-id: e9702101-9da2-4681-bdf3-a54e17329a56
x-ms-client-request-id: ba4dff71-1655-4c1d-a71f-c9869371b18b; ba4dff71-1655-4c1d-a71f-c9869371b18b
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-reads: 14989
x-ms-correlation-request-id: e9702101-9da2-4681-bdf3-a54e17329a56
x-ms-routing-request-id: SOUTHINDIA:20180521T102317Z:e9702101-9da2-4681-bdf3-a54e17329a56
Cache-Control: no-cache
Date: Mon, 21 May 2018 10:23:17 GMT
Server: Microsoft-IIS/8.0
X-Powered-By: ASP.NET

{
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/Default-RecoveryServices-ResourceGroup-centralindia/providers/microsoft.recoveryservices/vaults/abdemovault/backupJobs/7ddead57-bcb9-4269-ac31-6a1b57588700",
  "name": "7ddead57-bcb9-4269-ac31-6a1b57588700",
  "type": "Microsoft.RecoveryServices/vaults/backupJobs",
  "properties": {
    "jobType": "AzureIaaSVMJob",
    "duration": "00:20:23.0896697",
    "actionsInfo": [
      1
    ],
    "virtualMachineVersion": "Compute",
    "extendedInfo": {
      "tasksList": [
        {
          "taskId": "Take Snapshot",
          "duration": "00:00:00",
          "status": "Completed"
        },
        {
          "taskId": "Transfer data to vault",
          "duration": "00:00:00",
          "status": "Completed"
        }
      ],
      "propertyBag": {
        "VM Name": "uttestvmub1",
        "Backup Size": "2332 MB"
      }
    },
    "entityFriendlyName": "uttestvmub1",
    "backupManagementType": "AzureIaasVM",
    "operation": "Backup",
    "status": "Completed",
    "startTime": "2018-05-21T08:35:40.9488967Z",
    "endTime": "2018-05-21T08:56:04.0385664Z",
    "activityId": "7df8e874-1d66-4f81-8e91-da2fe054811d"
  }
}
}

```
## Next steps

[About Azure Backup](backup-overview.md).