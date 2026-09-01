---
title: Azure Storage blob inventory
description: Azure Storage inventory is a tool to help get an overview of all your blob data within a storage account.
services: storage
author: normesta

ms.service: azure-blob-storage
ms.date: 08/31/2026
ms.topic: concept-article
ms.author: normesta
ms.custom: references_regions
# Customer intent: "As a cloud storage administrator, I want to generate inventory reports for blob data, so that I can audit data properties and automate workflows to efficiently manage storage resources."
---

# Azure Storage blob inventory

Azure Storage blob inventory lists the containers, blobs, blob versions, snapshots, and associated properties in your storage account. The service generates reports daily or weekly in comma-separated values (CSV) or Apache Parquet format.

Use inventory reports to audit the retention, legal hold, or encryption status of your storage account contents. You can also analyze the total size, age, tier distribution, and other attributes of your data.

Blob inventory can simplify business workflows and speed up data processing jobs. It provides scheduled automation of the [List Containers](/rest/api/storageservices/list-containers2) and [List Blobs](/rest/api/storageservices/list-blobs) APIs. Inventory rules filter report contents by blob type, prefix, or selected blob properties.

Azure Storage blob inventory is available for the following types of storage accounts:

- Standard general-purpose v2
- Premium block blob storage
- Blob storage

## Inventory features

Azure Storage blob inventory supports the following features and capabilities.

- **Inventory reports for blobs and containers**

  You can generate inventory reports for blobs and containers. A report for blobs can contain base blobs, snapshots, content length, blob versions, and their associated properties such as creation time and last modified time. The report doesn't list empty containers. A report for containers describes containers and their associated properties such as immutability policy status and legal hold status. 

- **Custom schema**

  You can choose which fields appear in reports. Choose from a list of supported fields. That list appears later in this article.

- **CSV and Apache Parquet output format**

  You can generate an inventory report in either CSV or Apache Parquet output format.

- **Manifest file and Azure Event Grid event per inventory report**

  The service generates a manifest file and an Azure Event Grid event for each inventory report. The article describes these items later.

## Enabling inventory reports

Enable blob inventory reports by adding a policy with one or more rules to your storage account. For guidance, see [Enable Azure Storage blob inventory reports](blob-inventory-how-to.md).

## Upgrading an inventory policy

If you configured Azure Storage blob inventory before June 2021, load the policy, make any needed changes, and then save it. When you reload the policy, the service populates the per-rule destination, manifest file, and Azure Event Grid event settings with default values. You can change these values.

- Each rule supports a destination container instead of sharing one destination at the policy level.

- The service generates a manifest file and Azure Event Grid event for each rule instead of for the policy.

## Inventory policy

To configure inventory reports, add an inventory policy with one or more rules to a JSON document.

```json
{
  "enabled": true,
  "rules": [
  {
    "enabled": true,
    "name": "inventoryrule1",
    "destination": "inventory-destination-container",
    "definition": {
      "filters": {
        "blobTypes": ["blockBlob"]
      },
      "format": "csv",
      "objectType": "blob",
      "schedule": "daily",
      "schemaFields": ["Name"]
    }
  },
  {
    "enabled": true,
    "name": "inventoryrule2",
    "destination": "inventory-destination-container",
    "definition": {
      "filters": {},
      "format": "csv",
      "objectType": "container",
      "schedule": "weekly",
      "schemaFields": ["Name"]
    }
  }]
}
```

View the JSON for an inventory policy by selecting the **Code view** tab in the **Blob inventory** section of the Azure portal.

| Parameter name | Parameter type | Notes | Required? |
|--|--|--|--|
| `enabled` | boolean | Used to disable the entire policy. When set to **true**, the rule-level `enabled` field overrides this parameter. When disabled, inventory is disabled for all rules. | Yes |
| `rules` | Array of rule objects | At least one rule is required in a policy. Up to 100 rules are supported per policy. | Yes |

## Inventory rules

A rule captures the filtering conditions and output parameters for generating an inventory report. Each rule creates an inventory report. Rules can have overlapping prefixes. A blob can appear in more than one inventory depending on rule definitions.

Each rule within the policy has several parameters:

| Parameter name | Parameter type | Notes | Required? |
|--|--|--|--|
| `name` | string | A rule name can include up to 256 case-sensitive alphanumeric characters. The name must be unique within a policy. | Yes |
| `enabled` | boolean | A flag to enable or disable a rule. The default value is **true**. | Yes |
| `definition` | JSON inventory rule definition | Each definition is made up of a rule filter set. | Yes |
| `destination` | string | The destination container where the service generates all inventory files. The destination container must already exist. |

The global **Blob inventory enabled** flag takes precedence over the *enabled* parameter in a rule.

### Rule definition

| Parameter name | Parameter type | Notes | Required |
|--|--|--|--|
| `filters` | JSON | Filters determine whether a blob or container is part of the inventory. | Yes |
| `format` | string | Determines the output format of the inventory file. Valid values are `csv` (for CSV format) and `parquet` (for Apache Parquet format). | Yes |
| `objectType` | string | Indicates whether the inventory rule applies to blobs or containers. Valid values are `blob` and `container`. | Yes |
| `schedule` | string | Specifies when to run the rule. Valid values are `daily` and `weekly`. | Yes |
| `schemaFields` | JSON array | Lists the schema fields to include in the inventory. | Yes |

### Rule filters

Use the following filters to customize a blob inventory report:

| Filter name | Filter type | Notes | Required? |
|--|--|--|--|
| `blobTypes` | Array of predefined enum values | Valid values are `blockBlob` and `appendBlob` for hierarchical namespace-enabled accounts, and `blockBlob`, `appendBlob`, and `pageBlob` for other accounts. This field doesn't apply to container inventory (`objectType`: `container`). | Yes |
| `creationTime` | Number | Specifies how many days ago the blob was created. For example, a value of `3` includes only blobs created in the last three days. | No |
| `prefixMatch` | Array of up to 10 strings | If you don't define `prefixMatch` or provide an empty prefix, the rule applies to all blobs within the storage account. A prefix must be a container name prefix or a container name. For example, `container` or `container1/foo`. | No |
| `excludePrefix` | Array of up to 10 strings | Specifies the blob paths to exclude from the inventory report.<br><br>An `excludePrefix` must be a container name prefix or a container name. With an empty `excludePrefix`, the report lists all blobs with names that match any `prefixMatch` string.<br><br>To include a prefix but exclude a specific subset, use the `excludePrefix` filter. For example, to include all blobs under `container-a` except those under `container-a/folder`, set `prefixMatch` to `container-a` and `excludePrefix` to `container-a/folder`. | No |
| `includeSnapshots` | boolean | Specifies whether the inventory includes snapshots. The default is `false`. This field doesn't apply to container inventory (`objectType`: `container`). | No |
| `includeBlobVersions` | boolean | Specifies whether the inventory includes blob versions. The default is `false`. This field doesn't apply to container inventory (`objectType`: `container`). | No |
| `includeDeleted` | boolean | Specifies whether the inventory includes deleted blobs. The default is `false`. In accounts that have a hierarchical namespace, this filter includes folders and blobs in a soft-deleted state.<br><br>Only explicitly deleted folders and files appear in reports. Child folders and files deleted as a result of deleting a parent folder aren't included. | No |





View the JSON for inventory rules by selecting the **Code view** tab in the **Blob inventory** section of the Azure portal. You specify filters within a rule definition.

```json
{
  "destination": "inventory-destination-container",
  "enabled": true,
  "rules": [
  {
    "definition": {
      "filters": {
        "blobTypes": ["blockBlob", "appendBlob", "pageBlob"],
        "prefixMatch": ["inventorytestcontainer1", "inventorytestcontainer2/abcd", "etc"],
        "excludePrefix": ["inventorytestcontainer10", "etc/logs"],
        "includeSnapshots": false,
        "includeBlobVersions": true
      },
      "format": "csv",
      "objectType": "blob",
      "schedule": "daily",
      "schemaFields": ["Name", "Creation-Time"]
    },
    "enabled": true,
    "name": "blobinventorytest",
    "destination": "inventorydestinationContainer"
  },
  {
    "definition": {
      "filters": {
        "prefixMatch": ["inventorytestcontainer1", "inventorytestcontainer2/abcd", "etc"]
      },
      "format": "csv",
      "objectType": "container",
      "schedule": "weekly",
      "schemaFields": ["Name", "HasImmutabilityPolicy", "HasLegalHold"]
    },
    "enabled": true,
    "name": "containerinventorytest",
    "destination": "inventorydestinationContainer"
    }
  ]
}
```

### Custom schema fields supported for blob inventory

> [!NOTE]
> The **Data Lake Storage** column shows support in accounts that have the hierarchical namespace feature enabled.

| Field | Blob Storage (default support) | Data Lake Storage |
|---------------|-------------------|---|
| Name (Required)  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Creation-Time  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Last-Modified  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| LastAccessTime<sup>1</sup>  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| ETag  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Content-Length  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Content-Type  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Content-Encoding  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Content-Language  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Content-CRC64 | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Content-MD5  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Cache-Control  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Cache-Disposition  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| BlobType  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| AccessTier  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| AccessTierChangeTime  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| LeaseStatus  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| LeaseState  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| ServerEncrypted  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| CustomerProvidedKeySHA256  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Metadata  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Expiry-Time  | ![No](../media/icons/no-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| hdi_isfolder  | ![No](../media/icons/no-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Owner  | ![No](../media/icons/no-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Group  | ![No](../media/icons/no-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Permissions  | ![No](../media/icons/no-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Acl  | ![No](../media/icons/no-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Snapshot (Available and required when you choose to include snapshots in your report)  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Deleted | ![Yes](../media/icons/yes-icon.png)| ![Yes](../media/icons/yes-icon.png) |
| DeletionId | ![No](../media/icons/no-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| DeletedTime | ![No](../media/icons/no-icon.png)| ![Yes](../media/icons/yes-icon.png) |
| RemainingRetentionDays | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)|
| VersionId (Available and required when you choose to include blob versions in your report)  | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| IsCurrentVersion (Available and required when you choose to include blob versions in your report)  | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| TagCount | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Tags | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| CopyId | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | 
| CopySource | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | 
| CopyStatus | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | 
| CopyProgress | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | 
| CopyCompletionTime | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | 
| CopyStatusDescription | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | 
| ImmutabilityPolicyUntilDate | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | 
| ImmutabilityPolicyMode | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | 
| LegalHold | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | 
| RehydratePriority  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| ArchiveStatus | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | 
| EncryptionScope | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | 
| IncrementalCopy | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | 
| x-ms-blob-sequence-number | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) | 

<sup>1</sup> Disabled by default. [Optionally enable access time tracking](blob-inventory-how-to.md#optionally-enable-access-time-tracking).

### Custom schema fields supported for container inventory

> [!NOTE]
> The **Data Lake Storage** column shows support in accounts that have the hierarchical namespace feature enabled.

| Field | Blob Storage (default support) | Data Lake Storage |
|---------------|-------------------|---|
| Name (Required)  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Last-Modified  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| ETag | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| LeaseStatus  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| LeaseState  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| LeaseDuration  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Metadata  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| PublicAccess  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| DefaultEncryptionScope  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | 
| DenyEncryptionScopeOverride  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | 
| HasImmutabilityPolicy  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| HasLegalHold  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| ImmutableStorageWithVersioningEnabled  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | 
| Deleted (Appears only if include deleted containers is selected)  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | 
| Version (Appears only if include deleted containers is selected)  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | 
| DeletedTime (Appears only if include deleted containers is selected)  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| RemainingRetentionDays (Appears only if include deleted containers is selected)  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |



## Inventory run

If you configure a rule to run daily, it runs every day. If you configure a rule to run weekly, it runs each Sunday in UTC.

An inventory run can take up to six days before it fails. To learn about factors that affect run time, see [Blob inventory performance characteristics](blob-inventory-performance-characteristics.md).


Runs don't overlap, so a run must complete before another run of the same rule can begin. For example, if the previous day's run of a daily rule is still in progress, the service doesn't initiate a new run that day. Weekly rules run each Sunday regardless of whether a previous run succeeds or fails. If a run doesn't complete successfully, check subsequent runs before contacting support. Run performance can vary, so a subsequent run might complete successfully.

Inventory policies are read or written in full. Partial updates aren't supported. Inventory rules are evaluated daily. If you change a rule definition after the service evaluates the policy for that day, the service evaluates your updates the following day.

## Inventory completed event

The `BlobInventoryPolicyCompleted` event is generated when the inventory run completes for a rule. This event also occurs if the inventory run fails with a user error before it starts to run. For example, an invalid policy or a missing destination container triggers the event. The following JSON shows an example `BlobInventoryPolicyCompleted` event.

```json
{
  "topic": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/BlobInventory/providers/Microsoft.EventGrid/topics/BlobInventoryTopic",
  "subject": "BlobDataManagement/BlobInventory",
  "eventType": "Microsoft.Storage.BlobInventoryPolicyCompleted",
  "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "data": {
    "scheduleDateTime": "2021-05-28T03:50:27Z",
    "accountName": "testaccount",
    "ruleName": "Rule_1",
    "policyRunStatus": "Succeeded",
    "policyRunStatusMessage": "Inventory run succeeded, refer manifest file for inventory details.",
    "policyRunId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "manifestBlobUrl": "https://testaccount.blob.core.windows.net/inventory-destination-container/2021/05/26/13-25-36/Rule_1/Rule_1-manifest.json"
  },
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2021-05-28T15:03:18Z"
}
```

The following table describes the schema of the `BlobInventoryPolicyCompleted` event.

|Field|Type|Description|
|---|---|
|scheduleDateTime|string|The time that the inventory rule was scheduled.|
|accountName|string|The storage account name.|
|ruleName|string|The rule name.|
|policyRunStatus|string|The status of inventory run. Possible values are `Succeeded`, `PartiallySucceeded`, and `Failed`.|
|policyRunStatusMessage|string|The status message for the inventory run.|
|policyRunId|string|The policy run ID for the inventory run.|
|manifestBlobUrl|string|The blob URL for manifest file for inventory run.|

## Inventory output

Each inventory rule creates a set of files in the specified inventory destination container for that rule. The inventory output is available at the following path:
`https://<accountName>.blob.core.windows.net/<inventory-destination-container>/YYYY/MM/DD/HH-MM-SS/<ruleName>` where:

- *accountName* is your Azure Blob Storage account name.
- *inventory-destination-container* is the destination container you specified in the inventory rule.
- *YYYY/MM/DD/HH-MM-SS* is the time when the inventory started.
- *ruleName* is the inventory rule name.

### Inventory files

Each inventory run for a rule generates the following files:

- **Inventory file:** An inventory run for a rule generates a CSV or Apache Parquet formatted file. Each such file contains matched objects and their metadata. 

  > [!IMPORTANT]
  > Inventory runs produce multiple files if the object count is large. To learn more, see [Multiple inventory file output FAQ](blob-inventory-faq.md#multiple-inventory-file-output).
  
  Reports in the Apache Parquet format present dates in the following format: `timestamp_millis [number of milliseconds since 1970-01-01 00:00:00 UTC]`. For a CSV formatted file, the first row is always the schema row. The following image shows an inventory CSV file opened in Microsoft Excel.

  :::image type="content" source="./media/blob-inventory/csv-file-excel.png" alt-text="Screenshot of an inventory CSV file opened in Microsoft Excel":::

  > [!IMPORTANT]
  > The blob paths that appear in an inventory file might not appear in any particular order. 

- **Checksum file:** A checksum file contains the MD5 checksum of the contents of the `manifest.json` file. The name of the checksum file is `<ruleName>-manifest.checksum`. Generation of the checksum file marks the completion of an inventory rule run.

- **Manifest file:** A `manifest.json` file contains the details of the inventory files generated for that rule. The name of the file is `<ruleName>-manifest.json`. This file also captures the rule definition and the path to the inventory for that rule. The following JSON shows the contents of a sample `manifest.json` file.

  ```json
  {
  "destinationContainer" : "inventory-destination-container",
  "endpoint" : "https://testaccount.blob.core.windows.net",
  "files" : [
    {
      "blob" : "2021/05/26/13-25-36/Rule_1/Rule_1.csv",
      "size" : 12710092
    }
  ],
  "inventoryCompletionTime" : "2021-05-26T13:35:56Z",
  "inventoryStartTime" : "2021-05-26T13:25:36Z",
  "ruleDefinition" : {
    "filters" : {
      "blobTypes" : [ "blockBlob" ],
      "includeBlobVersions" : false,
      "includeSnapshots" : false,
      "prefixMatch" : [ "penner-test-container-100003" ]
    },
    "format" : "csv",
    "objectType" : "blob",
    "schedule" : "daily",
    "schemaFields" : [
      "Name",
      "Creation-Time",
      "BlobType",
      "Content-Length",
      "LastAccessTime",
      "Last-Modified",
      "Metadata",
      "AccessTier"
    ]
  },
  "ruleName" : "Rule_1",
  "status" : "Succeeded",
  "summary" : {
    "objectCount" : 110000,
    "totalObjectSize" : 23789775
  },
  "version" : "1.0"
  }
  ```

  This file is created when the run begins. The `status` field of this file is set to `Pending` until the run completes. After the run completes, this field is set to a completion status (for example: `Succeeded` or `Failed`).

## Pricing and billing

Pricing for inventory is based on the number of blobs and containers that you scan during the billing period. The [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) page shows the price per one million objects scanned. For example, if the price to scan one million objects is `$0.003`, your account contains three million objects, and you produce four reports in a month, then your bill would be `4 * 3  * $0.003 = $0.036`.

After you create inventory files, you incur additional standard data storage and operations charges for storing, reading, and writing the inventory-generated files in the account.

If a rule contains a prefix that overlaps with a prefix of any other rule, the same blob can appear in more than one inventory report. In this case, you pay for both instances. For example, assume that the `prefixMatch` element of one rule is set to `["inventory-blob-1", "inventory-blob-2"]`, and the `prefixMatch` element of another rule is set to `["inventory-blob-10", "inventory-blob-20"]`. An object named `inventory-blob-200` appears in both inventory reports.

Snapshots and versions of a blob also count towards billing even if you set `includeSnapshots` and `includeBlobVersions` filters to `false`. Those filter values don't affect billing. You can use them only to filter what appears in the report.

For more information about pricing for Azure Storage blob inventory, see [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

## Feature support

[!INCLUDE [Blob Storage feature support in Azure Storage accounts](../../../includes/azure-storage-feature-support.md)]

## Known issues and limitations

This section describes limitations and known issues of the Azure Storage blob inventory feature.

### Inventory report object count and data size shouldn't be compared to billing

An inventory report doesn't include metadata, system logs, and properties, so don't compare it to the billed object count and data size for the storage account.

### Inventory jobs take longer to complete in certain cases

An inventory job can take longer in these cases:

- You add a large amount of new data.

- You run a rule or set of rules for the first time.

  The inventory run might take longer than subsequent runs.

- An inventory run processes a large amount of data in hierarchical namespace-enabled accounts.

  An inventory job might take more than one day to complete for hierarchical namespace-enabled accounts that have hundreds of millions of blobs. Sometimes the inventory job fails and doesn't create an inventory file. If a job doesn't complete successfully, check subsequent jobs to see if they're complete before contacting support.

- There's no option to generate a report retrospectively for a particular date.

### Inventory jobs can't write reports to containers that have an object replication policy

An object replication policy can prevent an inventory job from writing inventory reports to the destination container. Some other scenarios can archive the reports or make the reports immutable when they're partially completed, which can cause inventory jobs to fail.

### Inventory and immutable storage

You can't configure an inventory policy in the account if support for version-level immutability is enabled on that account, or if support for version-level immutability is enabled on the destination container that you define in the inventory policy.

### Reports might exclude soft-deleted blobs in accounts that have a hierarchical namespace

If you delete a container or directory when soft delete is enabled, the service marks it and all its contents as soft-deleted. However, only the container or directory, reported as a zero-length blob, appears in an inventory report. The report doesn't include soft-deleted child blobs even if you set the policy's `includeDeleted` field to **true**. This behavior can create a difference between capacity metrics in the Azure portal and the inventory report.

Only blobs that you explicitly delete appear in reports. To obtain a complete listing of all soft-deleted blobs (directory and all child blobs), workloads should delete each blob in a directory before deleting the directory itself.

### Handle duplicates in blob inventory

Blob Inventory operates on a distributed system, which means that in rare cases, duplicate blob entries might appear in your reports.

If your use case requires unique blob entries when you postprocess an inventory report, use the `Name` field to return only unique blobs.

  
If your report includes blob versions, use both the `Name` and `Version ID` fields together to identify and return only the unique blobs and versions.


## Next steps

- [Enable Azure Storage blob inventory reports](blob-inventory-how-to.md)
- [Calculate the count and total size of blobs per container](calculate-blob-count-size.yml)
- [Tutorial: Analyze blob inventory reports](storage-blob-inventory-report-analytics.md)
- [Manage the Azure Blob Storage lifecycle](./lifecycle-management-overview.md)
- [Blob inventory FAQ](blob-inventory-faq.md#azure-storage-blob-inventory)
