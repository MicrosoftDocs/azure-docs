---
title: Use Azure Storage inventory to manage blob data (preview)
description: Azure Storage inventory is a tool to help get an overview of all your blob data within a storage account.
services: storage
author: normesta

ms.service: storage
ms.date: 06/02/2021
ms.topic: conceptual
ms.author: normesta
ms.reviewer: klaasl
ms.subservice: blobs
ms.custom: references_regions
---

# Use Azure Storage blob inventory to manage blob data (preview)

The Azure Storage blob inventory feature provides an overview of your containers, blobs, snapshots, and blob versions within a storage account. Use the inventory report to understand various attributes of blobs and containers such as your total data size, age, encryption status, immutability policy, and legal hold and so on. The report provides an overview of your data for business and compliance requirements. 

## Availability

Blob inventory is supported for both general purpose version 2 (GPv2) and premium block blob storage accounts. This feature is supported with or without the [hierarchical namespace](data-lake-storage-namespace.md) feature enabled on the account.

> [!IMPORTANT]
> Blob inventory is currently in PREVIEW and is available on storage accounts in all public regions.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Pricing and billing

The fee for inventory reports isn't charged during the preview period. Pricing will be determined when this feature is generally available. 

## Inventory features

The following list describes features and capabilities that are available in the current release of Azure Storage blob inventory.

- **Inventory reports for blobs and containers**

  You can generate inventory reports for blobs and containers. A report for blobs can contain base blobs, snapshots, blob versions and their associated properties such as creation time, last modified time. A report for containers describes containers and their associated properties such as immutability policy status, legal hold status. 

- **Custom Schema**

  You can choose schema fields from a list of supported schema fields to publish in inventory reports. The list of supported fields are described later in this article. 

- **CSV and Apache Parquet output format per rule**

  For each rule, you can generate an inventory report in either CSV or Apache Parquet output format. 

- **Manifest file and Azure Event Grid event per rule**

  For each rule, a manifest file and an Azure Event Grid event are generated. Previously, only one manifest and one Azure Event Grid event was generated across all rules. 

## Enable inventory reports

Enable blob inventory reports by adding a policy to your storage account. Add, edit, or remove a policy by using the [Azure portal](https://portal.azure.com/).

1. Navigate to the [Azure portal](https://portal.azure.com/)
1. Select one of your storage accounts
1. Under **Blob service**, select **Blob inventory**
1. Make sure **Blob inventory enabled** is selected
1. Select **Add a rule**
1. Name your new rule
1. Select the **Blob types** for your inventory report
1. Add a prefix match to filter your inventory report
1. Select whether to **Include blob versions** and **Include snapshots** in your inventory report. Versions and snapshots must be enabled on the account to save a new rule with the corresponding option enabled.
1. Select **Save**

:::image type="content" source="./media/blob-inventory/portal-blob-inventory.png" alt-text="Screenshot showing how to add a blob inventory rule by using the Azure portal":::

Inventory policies are read or written in full. Partial updates aren't supported.

> [!IMPORTANT]
> If you enable firewall rules for your storage account, inventory requests may be blocked. You can unblock these requests by providing exceptions for trusted Microsoft services. For more information, see the Exceptions section in [Configure firewalls and virtual networks](../common/storage-network-security.md#exceptions).

A blob inventory run is automatically scheduled every day. It can take up to 24 hours for an inventory run to complete. An inventory report is configured by adding an inventory policy with one or more rules.

## Inventory policy

An inventory policy is a collection of rules in a JSON document.

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

| Parameter name | Parameter type        | Notes | Required? |
|----------------|-----------------------|-------|-----------|
| enabled        | Boolean               | Used to disable the entire policy. When set to **true**, the rule level enabled field overrides this parameter. When disabled, inventory for all rules will be disabled. | Yes |
| rules          | Array of rule objects | At least one rule is required in a policy. Up to 10 rules are supported. | Yes |

## Inventory rules

A rule captures the filtering conditions and output parameters for generating an inventory report. Each rule creates an inventory report. Rules can have overlapping prefixes. A blob can appear in more than one inventory depending on rule definitions.

Each rule within the policy has several parameters:

| Parameter name | Parameter type                 | Notes | Required? |
|----------------|--------------------------------|-------|-----------|
| name           | String                         | A rule name can include up to 256 case-sensitive alphanumeric characters. The name must be unique within a policy. | Yes |
| enabled        | Boolean                        | A flag allowing a rule to be enabled or disabled. The default value is **true**. | Yes |
| definition     | JSON inventory rule definition | Each definition is made up of a rule filter set. | Yes |
| destination    | String                | The destination container where all inventory files will be generated. The destination container must already exist.|

The global **Blob inventory enabled** flag takes precedence over the *enabled* parameter in a rule.

### Rule definition

| Parameter name | Parameter type | Notes | Required |
|--|--|--|--|
| filters | json | Filters decide whether a blob or container is part of inventory or not. | Yes |
| format | String | Determines the output of the inventory file. Acceptable values are csv (For CSV format) and **parquet** (For Apache Parquet format).| Yes |
| objectType | String | Denotes whether this is an inventory rule for blobs or containers. Valid values are "blob" and "container". |Yes |
| schemaFields | Json array | List of Schema fields to be part of inventory. | Yes |

### Rule filters

Several filters are available for customizing a blob inventory report:

| Filter name         | Filter type                     | Notes | Required? |
|---------------------|---------------------------------|-------|-----------|
| blobTypes           | Array of predefined enum values | Valid values are `blockBlob` and `appendBlob` for hierarchical namespace enabled accounts, and `blockBlob`, `appendBlob`, and `pageBlob` for other accounts. This field is not applicable for inventory on a container, (objectType : "container"). | Yes |
| prefixMatch         | Array of up to 10 strings for prefixes to be matched. A prefix must start with a container name, for example, "container1/foo" | If you don't define *prefixMatch* or provide an empty prefix, the rule applies to all blobs within the storage account. | No |
| includeSnapshots    | Boolean                         | Specifies whether the inventory should include snapshots. Default is **false**. This field is not applicable for inventory on a container, (objectType : "container").| No |
| includeBlobVersions | Boolean                         | Specifies whether the inventory should include blob versions. Default is **false**. This field is not applicable for inventory on a container, (objectType : "container").| No |

View the JSON for inventory rules by selecting the **Code view** tab in the **Blob inventory** section of the Azure portal. Filters are specified within a rule definition.

```json
{
	"destination": "inventorydestinationContainer",
	"enabled": true,
	"rules": [
                             {
			"definition": {
				"filters": {
					"blobTypes": ["blockBlob", "appendBlob", "pageBlob"],
					"prefixMatch": ["inventorytestcontainer1", "inventorytestcontainer2/abcd", "etc"],
					"includeSnapshots": false,
					"includeBlobVersions": true,
				},
				"format": "csv",
				"objectType": "blob",
				"schedule": "daily",
				"schemaFields": ["Name", "Creation-Time"]
			}
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
			}
			"enabled": true,
			"name": "containerinventorytest",
			"destination": "inventorydestinationContainer"
		}
	]
}

```

### Custom schema fields for Blob inventory

- Creation-Time
- Last-Modified
- Content-Length
- Content-MD5
- BlobType
- AccessTier
- AccessTierChangeTime
- AccessTierInferred
- Expiry-Time
- hdi_isfolder
- Owner
- Group
- Permissions
- Acl
- Snapshot
- VersionId
- IsCurrentVersion
- Metadata
- Tags
- LastAccessTime

### Custom schema fields for container inventory

- Last-Modified
- LeaseStatus
- LeaseState
- LeaseDuration
- PublicAccess
- HasImmutabilityPolicy
- HasLegalHold
- Metadata

## Inventory output

Each inventory rule generates a set of files in the specified inventory destination container for that rule. The inventory output is generated under the following path:
`https://<accountName>.blob.core.windows.net/<inventory-destination-container>/YYYY/MM/DD/HH-MM-SS/<ruleName` where:

- *accountName* is your Azure Blob Storage account name.
- *inventory-destination-container* is the destination container you specified in the inventory rule.
- *YYYY/MM/DD/HH-MM-SS* is the time when the inventory began to run.
- ruleName is the inventory rule name.

### Inventory files

Each inventory run for a rule generates the following files:

- **Inventory file**: An inventory run for a rule generates one or more CSV or Apache Parquet formatted files. If the matched object count is large, then multiple files are generated instead of a single file. Each such file contains matched objects and their metadata. For a CS formatted file, the first row is always the schema row. The following image shows an inventory CSV file opened in Microsoft Excel.

  :::image type="content" source="./media/blob-inventory/csv-file-excel.png" alt-text="Screenshot of an inventory CSV file opened in Microsoft Excel":::

- **Checksum file**: A manifest.checksum contains the MD5 checksum of the contents of manifest.json file. Generation of the manifest.checksum file marks the completion of an inventory rule run.

- **Manifest file**: A manifest.json file contains the details of the inventory file(s) generated for that rule. The manifest file also captures the rule definition provided by the user and the path to the inventory for that rule. The following json shows the contents of a sample manifest.json file.

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

## Inventory completed event

An inventory completed event is generated when the inventory run completes for a rule. The inventory completed event also occurs if the inventory run fails into user error before it starts to run. For example, an invalid policy, or destination container not present error will trigger the event. The event is published to Blob Inventory Topic. The following json shows an example inventory completed event.

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
    "policyRunId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" 
"manifestBlobUrl": "https://testaccount.blob.core.windows.net/inventory-destination-container/2021/05/26/13-25-36/Rule_1/Rule_1.csv" 
  }, 
  "dataVersion": "1.0", 
  "metadataVersion": "1", 
  "eventTime": "2021-05-28T15:03:18Z" 
} 
```

## Upgrading inventory policy for existing users 

If you are an existing Azure Storage blob inventory user who has configured inventory already, you can start using the new features by loading the policy, and then saving the policy back after making changes. When an existing policy is loaded again, the new fields in the policy will be populated with default values. You can change these values if you want. After you reload the policy, the following two capabilities will be available.

- A destination container is now supported for every rule instead of just being supported for the policy.

- A manifest file and Azure Event Grid event are now generated per rule instead of per policy. 

## Known issues

This section describes limitations and known issues of the Azure Storage blob inventory feature.

### Inventory job fails to complete for hierarchical namespace enabled accounts

The inventory job may not complete within 24 hours for an account with millions of blobs and hierarchical namespaces enabled. If this happens, no inventory file is created.

### Inventory job cannot write Inventory reports

An object replication policy can prevent Inventory job from writing Inventory reports to the destination container. Some other scenarios can archive the inventory created reports or make them immutable when they are partially completed and this can lead to inventory job failure.

## Next steps

- [Calculate the count and total size of blobs per container](calculate-blob-count-size.md)
- [Manage the Azure Blob Storage lifecycle](storage-lifecycle-management-concepts.md)
