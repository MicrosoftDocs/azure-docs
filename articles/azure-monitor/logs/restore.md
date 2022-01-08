---
title: Azure Monitor Basic Logs
description: Use Azure Monitor Basic Logs to quickly, or periodically investigate issues, troubleshoot code or configuration problems or address support cases.
author: MeirMen, adiBiran
ms.author: meirm, adbiran
ms.reviewer: osalzberg
ms.subservice: logs
ms.topic: conceptual
ms.date: 10/31/2021

---

# Restore in Azure Monitor (preview)
Restore makes a specific time range of an Archived orBasic Logs table available as analytics logs and allocates additional compute resources to handle their processing. This allows you to use 



The restore table allows querying its data with full KQL support.  

Restore creates a logical table with a view of the underlying source table, such that a restore table has no retention by its own. The restore table is created in the same workspace as the source table. The restored data will be available as long as the underlying source data is available, and the user did not explicitly asked to release the data back to its source table. Restore is charge according to the volume of the data and the time it is available. For more details on billing, see **TODO:** add link to billing page.

### Restore limits
Executing restore is limited to up to 4 per workspace per week, with concurrent limitation of up to 2 per workspace.
A single table is limited to have only one active restore, such that executing a second restore on a table that has already active restore will fail. To restore a different chunk of a table you should first dismiss the existing one. See details in _Dismiss restored data_ below

### Restore table status
Restore table property provisioningState can have one of the following value:
- Updating - the table and its schema are populated.
- Succeeded - restore has completed. 

### Restore data from archive
Use **Tables - Update** API call to trigger restore:

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{user defined name}_RST?api-version=2021-07-01-privatepreview
```
> [!NOTE]
>Table name must end with _RST postfix
#### Request Body
|Name | Type | Description |
| --- | --- | --- |
|properties.restoredLogs.sourceTable | string  | Table to restore data from |s
|properties.restoredLogs.startRestoreTime | string  | Date and time to start the restore from |
|properties.restoredLogs.endRestoreTime | string  | Date and time to end the restore by |

##### Sample Request
```http
PUT https://management.azure.com/subscriptions/00000000-0000-0000-0000-00000000000/resourcegroups/testRG/providers/Microsoft.OperationalInsights/workspaces/testWS/tables/Usage_RST?api-version=2021-07-01-privatepreview
```

Request body:
```http
{
    "properties":  {
    "restoredLogs":  {
                      "startRestoreTime":  "2020-01-01T00:00:00Z",
                      "endRestoreTime":  "2020-01-31T00:00:00Z",
                      "sourceTable":  "Usage"
    }
  }
}
```

### Dismiss restored data
Restore allocates additional compute resources, and will be charged according to the volume of the data and the time it is available. It is recommended to release the data back to archive as soon as the processing of the data ends. To release the data from restore you should delete the restored table - this action will not affect the underlying source table.

Use **Tables - Delete** API call to delete the (logical) restore table
```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{user defined name}_RST?api-version=2021-07-01-privatepreview
```
