---
title: Azure Storage blob inventory
description: Azure Storage inventory is a tool to help get an overview of all your blob data within a storage account.
services: storage
author: normesta

ms.service: azure-blob-storage
ms.date: 03/28/2024
ms.topic: conceptual
ms.author: normesta
ms.custom: references_regions
---

# Azure Storage blob inventory

Azure Storage blob inventory provides a list of the containers, blobs, blob versions, and snapshots in your storage account, along with their associated properties. It generates an output report in either comma-separated values (CSV) or Apache Parquet format on a daily or weekly basis. You can use the report to audit retention, legal hold or encryption status of your storage account contents, or you can use it to understand the total data size, age, tier distribution, or other attributes of your data. You can also use blob inventory to simplify your business workflows or speed up data processing jobs, by using blob inventory as a scheduled automation of the [List Containers](/rest/api/storageservices/list-containers2) and [List Blobs](/rest/api/storageservices/list-blobs) APIs. Blob inventory rules allow you to filter the contents of the report by blob type, prefix, or by selecting the blob properties to include in the report.

Azure Storage blob inventory is available for the following types of storage accounts:

- Standard general-purpose v2
- Premium block blob storage
- Blob storage

## Inventory features

The following list describes features and capabilities that are available in the current release of Azure Storage blob inventory.

- **Inventory reports for blobs and containers**

  You can generate inventory reports for blobs and containers. A report for blobs can contain base blobs, snapshots, content length, blob versions and their associated properties such as creation time, last modified time. Empty containers aren't listed in the blob inventory report. A report for containers describes containers and their associated properties such as immutability policy status, legal hold status. 

- **Custom Schema**

  You can choose which fields appear in reports. Choose from a list of supported fields. That list appears later in this article.

- **CSV and Apache Parquet output format**

  You can generate an inventory report in either CSV or Apache Parquet output format.

- **Manifest file and Azure Event Grid event per inventory report**

  A manifest file and an Azure Event Grid event are generated per inventory report. These are described later in this article.

## Enabling inventory reports

Enable blob inventory reports by adding a policy with one or more rules to your storage account. For guidance, see [Enable Azure Storage blob inventory reports](blob-inventory-how-to.md).

## Upgrading an inventory policy

If you're an existing Azure Storage blob inventory user who has configured inventory prior to June 2021, you can start using the new features by loading the policy, and then saving the policy back after making changes. When you reload the policy, the new fields in the policy will be populated with default values. You can change these values if you want. Also, the following two features will be available.

- A destination container is now supported for every rule instead of just being supported for the policy.

- A manifest file and Azure Event Grid event are now generated per rule instead of per policy.

## Inventory policy

An inventory report is configured by adding an inventory policy with one or more rules. An inventory policy is a collection of rules in a JSON document.

```json
{
  "enabled": true,
  "rules": [
  {
    "enabled": true,
    "name": "inventoryrule1",
    "destination": "inventory-destination-container",
    "definition": {. . .}
  },
  {
    "enabled": true,
    "name": "inventoryrule2",
    "destination": "inventory-destination-container",
    "definition": {. . .}
  }]
}
```

View the JSON for an inventory policy by selecting the **Code view** tab in the **Blob inventory** section of the Azure portal.

| Parameter name | Parameter type | Notes | Required? |
|--|--|--|--|
| enabled | boolean | Used to disable the entire policy. When set to **true**, the rule level enabled field overrides this parameter. When disabled, inventory for all rules will be disabled. | Yes |
| rules | Array of rule objects | At least one rule is required in a policy. Up to 100 rules are supported per policy. | Yes |

## Inventory rules

A rule captures the filtering conditions and output parameters for generating an inventory report. Each rule creates an inventory report. Rules can have overlapping prefixes. A blob can appear in more than one inventory depending on rule definitions.

Each rule within the policy has several parameters:

| Parameter name | Parameter type | Notes | Required? |
|--|--|--|--|
| name | string | A rule name can include up to 256 case-sensitive alphanumeric characters. The name must be unique within a policy. | Yes |
| enabled | boolean | A flag allowing a rule to be enabled or disabled. The default value is **true**. | Yes |
| definition | JSON inventory rule definition | Each definition is made up of a rule filter set. | Yes |
| destination | string | The destination container where all inventory files are generated. The destination container must already exist. |

The global **Blob inventory enabled** flag takes precedence over the *enabled* parameter in a rule.

### Rule definition

| Parameter name | Parameter type | Notes | Required |
|--|--|--|--|
| filters | json | Filters decide whether a blob or container is part of inventory or not. | Yes |
| format | string | Determines the output of the inventory file. Valid values are `csv` (For CSV format) and `parquet` (For Apache Parquet format).| Yes |
| objectType | string | Denotes whether this is an inventory rule for blobs or containers. Valid values are `blob` and `container`. |Yes |
| schedule | string | Schedule on which to run this rule. Valid values are `daily` and `weekly`. | Yes |
| schemaFields | JSON array | List of Schema fields to be part of inventory. | Yes |

### Rule filters

Several filters are available for customizing a blob inventory report:

| Filter name | Filter type | Notes | Required? |
|--|--|--|--|
| blobTypes | Array of predefined enum values | Valid values are `blockBlob` and `appendBlob` for hierarchical namespace enabled accounts, and `blockBlob`, `appendBlob`, and `pageBlob` for other accounts. This field isn't applicable for inventory on a container, (objectType: `container`). | Yes |
| creationTime | Number |  Specifies the number of days ago within which the blob must have been created. For example, a value of `3` includes in the report only those blobs, which were created in the last three days. | No |
| prefixMatch | Array of up to 10 strings for prefixes to be matched. | If you don't define *prefixMatch* or provide an empty prefix, the rule applies to all blobs within the storage account. A prefix must be a container name prefix or a container name. For example, `container`, `container1/foo`. | No |
| excludePrefix | Array of up to 10 strings for prefixes to be excluded. | Specifies the blob paths to exclude from the inventory report.<br><br>An *excludePrefix* must be a container name prefix or a container name. An empty *excludePrefix* would mean that all blobs with names matching any *prefixMatch* string will be listed.<br><br>If you want to include a certain prefix, but exclude some specific subset from it, then you could use the excludePrefix filter. For example, if you want to include all blobs under `container-a` except those under the folder `container-a/folder`, then *prefixMatch* should be set to `container-a` and *excludePrefix* should be set to `container-a/folder`. | No |
| includeSnapshots | boolean | Specifies whether the inventory should include snapshots. Default is `false`. This field isn't applicable for inventory on a container, (objectType: `container`). | No |
| includeBlobVersions | boolean | Specifies whether the inventory should include blob versions. Default is `false`. This field isn't applicable for inventory on a container, (objectType: `container`). | No |
| includeDeleted | boolean | Specifies whether the inventory should include deleted blobs. Default is `false`. In accounts that have a hierarchical namespace, this filter includes folders and also includes blobs that are in a soft-deleted state. <br><br>Only the folders and files (blobs) that are explicitly deleted appear in reports. Child folders and files that are deleted as a result of deleting a parent folder aren't included in the report. | No |





View the JSON for inventory rules by selecting the **Code view** tab in the **Blob inventory** section of the Azure portal. Filters are specified within a rule definition.

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
        "includeBlobVersions": true,
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
| LastAccessTime<sup>1<sup>  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
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
| DeletedId | ![No](../media/icons/no-icon.png) | ![Yes](../media/icons/yes-icon.png) |
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
| DeletedTime (Will appear only if include deleted containers is selected)  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | 
| RemainingRetentionDays (Will appear only if include deleted containers is selected)  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | 



## Inventory run

If you configure a rule to run daily, then it will be scheduled to run every day. If you configure a rule to run weekly, then it will be scheduled to run each week on Sunday UTC time. 

Most inventory runs complete within 24 hours. For hierarchical namespace enabled accounts, a run can take as long as two days, and depending on the number of files being processed, the run might not complete by end of that two days. The maximum amount of time that a run can complete before it fails is six days. 

Runs don't overlap so a run must complete before another run of the same rule can begin. For example, if a rule is scheduled to run daily, but the previous day's run of that same rule is still in progress, then a new run won't be initiated that day. Rules that are scheduled to run weekly will run each Sunday regardless of whether a previous run succeeds or fails. If a run doesn't complete successfully, check subsequent runs to see if they complete before contacting support. The performance of a run can vary, so if a run doesn't complete, it's possible that subsequent runs will.

Inventory policies are read or written in full. Partial updates aren't supported. Inventory rules are evaluated daily. Therefore, if you change the definition of a rule, but the rules of a policy have already been evaluated for that day, then your updates won't be evaluated until the following day.

## Inventory completed event

The `BlobInventoryPolicyCompleted` event is generated when the inventory run completes for a rule. This event also occurs if the inventory run fails with a user error before it starts to run. For example, an invalid policy, or an error that occurs when a destination container isn't present will trigger the event. The following json shows an example `BlobInventoryPolicyCompleted` event.

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

Each inventory rule generates a set of files in the specified inventory destination container for that rule. The inventory output is generated under the following path:
`https://<accountName>.blob.core.windows.net/<inventory-destination-container>/YYYY/MM/DD/HH-MM-SS/<ruleName` where:

- *accountName* is your Azure Blob Storage account name.
- *inventory-destination-container* is the destination container you specified in the inventory rule.
- *YYYY/MM/DD/HH-MM-SS* is the time when the inventory began to run.
- *ruleName* is the inventory rule name.

### Inventory files

Each inventory run for a rule generates the following files:

- **Inventory file:** An inventory run for a rule generates a CSV or Apache Parquet formatted file. Each such file contains matched objects and their metadata. 

  > [!IMPORTANT]
  > Starting in October 2023, inventory runs will produce multiple files if the object count is large. To learn more, see [Multiple inventory file output FAQ](storage-blob-faq.yml#multiple-inventory-file-output).   
  
  Reports in the Apache Parquet format present dates in the following format: `timestamp_millis [number of milliseconds since 1970-01-01 00:00:00 UTC`]. For a CSV formatted file, the first row is always the schema row. The following image shows an inventory CSV file opened in Microsoft Excel.

  :::image type="content" source="./media/blob-inventory/csv-file-excel.png" alt-text="Screenshot of an inventory CSV file opened in Microsoft Excel":::

  > [!IMPORTANT]
  > The blob paths that appear in an inventory file might not appear in any particular order. 

- **Checksum file:** A checksum file contains the MD5 checksum of the contents of manifest.json file. The name of the checksum file is `<ruleName>-manifest.checksum`. Generation of the checksum file marks the completion of an inventory rule run.

- **Manifest file:** A manifest.json file contains the details of the inventory file(s) generated for that rule. The name of the file is `<ruleName>-manifest.json`. This file also captures the rule definition provided by the user and the path to the inventory for that rule. The following json shows the contents of a sample manifest.json file.

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

  This file is created when the run begins. The `status` field of this file is set to `Pending` until the run completes. After the run completes, this field is set to a completion status (For example: `Succeeded` or `Failed`).

## Pricing and billing

Pricing for inventory is based on the number of blobs and containers that are scanned during the billing period. The [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) page shows the price per one million objects scanned. For example, if the price to scan one million objects is `$0.003`, your account contains three million objects, and you produce four reports in a month, then your bill would be `4 * 3  * $0.003 = $0.036`.

After inventory files are created, additional standard data storage and operations charges will be incurred for storing, reading, and writing the inventory-generated files in the account.

If a rule contains a prefix that overlaps with a prefix of any other rule, then the same blob can appear in more than one inventory report. In this case, you're billed for both instances. For example, assume that the `prefixMatch` element of one rule is set to `["inventory-blob-1", "inventory-blob-2"]`, and the `prefixMatch` element of another rule is set to `["inventory-blob-10", "inventory-blob-20"]`. An object named `inventory-blob-200` appears in both inventory reports.

Snapshots and versions of a blob also count towards billing even if you've set `includeSnapshots` and `includeVersions` filters to `false`. Those filter values don't affect billing. You can use them only to filter what appears in the report.

For more information about pricing for Azure Storage blob inventory, see [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

## Feature support

[!INCLUDE [Blob Storage feature support in Azure Storage accounts](../../../includes/azure-storage-feature-support.md)]

## Known issues and limitations

This section describes limitations and known issues of the Azure Storage blob inventory feature.

### Inventory report object count and data size should not be compared to billing

An inventory report does not include metadata, system logs, and properties, so it shouldn't be compared to the billed object count and data size for the storage account.

### Inventory jobs take a longer time to complete in certain cases

An inventory job can take a longer amount of time in these cases:

- A large amount new data is added

- A rule or set of rules is being run for the first time

  The inventory run might take longer time to run as compared to the subsequent inventory runs.  

- An inventory run is processing a large amount of data in hierarchical namespace enabled accounts

  An inventory job might take more than one day to complete for hierarchical namespace enabled accounts that have hundreds of millions of blobs. Sometimes the inventory job fails and doesn't create an inventory file. If a job doesn't complete successfully, check subsequent jobs to see if they're complete before contacting support.

- There's no option to generate a report retrospectively for a particular date.

### Inventory jobs can't write reports to containers that have an object replication policy

An object replication policy can prevent an inventory job from writing inventory reports to the destination container. Some other scenarios can archive the reports or make the reports immutable when they're partially completed which can cause inventory jobs to fail.

### Inventory and Immutable Storage

You can't configure an inventory policy in the account if support for version-level immutability is enabled on that account, or if support for version-level immutability is enabled on the destination container that is defined in the inventory policy.

### Reports might exclude soft-deleted blobs in accounts that have a hierarchical namespace

If a container or directory is deleted with soft-delete enabled, then the container or directory and all its contents are marked as soft-deleted. However, only the container or directory (reported as a zero-length blob) appears in an inventory report and not the soft-deleted blobs in that container or directory even if you set the `includeDeleted` field of the policy to **true**.  This can lead to a difference between what appears in capacity metrics that you obtain in the Azure portal and what is reported by an inventory report. 

Only blobs that are explicitly deleted appear in reports. Therefore, to obtain a complete listing of all soft-deleted blobs (directory and all child blobs), workloads should delete each blob in a directory before deleting the directory itself.

## Next steps

- [Enable Azure Storage blob inventory reports](blob-inventory-how-to.md)
- [Calculate the count and total size of blobs per container](calculate-blob-count-size.yml)
- [Tutorial: Analyze blob inventory reports](storage-blob-inventory-report-analytics.md)
- [Manage the Azure Blob Storage lifecycle](./lifecycle-management-overview.md)
- [Blob Inventory FAQ](storage-blob-faq.yml#azure-storage-blob-inventory)
