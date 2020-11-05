---
title: Use Azure Storage inventory to manage blob data (preview)
description: Azure Storage inventory is a tool to help get an overview of all your blob data within a storage account.
services: storage
author: mhopkins-msft

ms.service: storage
ms.date: 11/04/2020
ms.topic: conceptual
ms.author: mhopkins
ms.reviewer: yzheng
ms.subservice: blobs
---

# Use Azure Storage blob inventory to manage blob data (preview)

The Azure Storage blob inventory feature provides an overview of your blob data within a storage account. Use the inventory report to understand your total data size, age, encryption status, and so on. The report provides an overview of your data for business and compliance requirements. Once enabled, an inventory report is automatically created daily.

## Availability

Blob inventory is supported for general purpose version 2 (GPv2), premium block blob storage, and Azure DataLake Storage Gen2 (ADLS Gen2) accounts.

### Preview regions

The blob inventory preview is available on storage accounts in the following regions:

- France Central
- Canada Central
- Canada East

### Pricing and billing

The fee for inventory reports isn't charged during the preview period. Pricing will be determined when this feature is generally available.

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
    "destination": "destinationContainer",
    "enabled": true,
    "rules": [
    {
        "enabled": true,
        "name": "inventoryrule1",
        "definition": {. . .}
    },
    {
        "enabled": true,
        "name": "inventoryrule2",
        "definition": {. . .}
    }]
}
```

View the JSON for an inventory policy by selecting the **Code view** tab in the **Blob inventory** section of the Azure portal.

| Parameter name | Parameter type        | Notes | Required? |
|----------------|-----------------------|-------|-----------|
| destination    | String                | The destination container where all inventory files will be generated. The destination container must already exist. | Yes |
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

The global **Blob inventory enabled** flag takes precedence over the *enabled* property in a rule.

### Rule filters

Several filters are available for customizing a blob inventory report:

| Filter name         | Filter type                     | Notes | Required? |
|---------------------|---------------------------------|-------|-----------|
| blobTypes           | Array of predefined enum values | Valid values are `blockBlob` and `appendBlob` for hierarchical namespace enabled accounts, and `blockBlob`, `appendBlob`, and `pageBlob` for other accounts. | Yes |
| prefixMatch         | Array of up to 10 strings for prefixes to be matched. A prefix must start with a container name, for example, "container1/foo" | If you don't define *prefixMatch* or provide an empty prefix, the rule applies to all blobs within the storage account. | No |
| includeSnapshots    | Boolean                         | Specifies whether the inventory should include snapshots. Default is **false**. | No |
| includeBlobVersions | Boolean                         | Specifies whether the inventory should include blob versions. Default is **false**. | No |

View the JSON for inventory rules by selecting the **Code view** tab in the **Blob inventory** section of the Azure portal. Filters are specified within a rule definition.

```json
{
    "destination": "destinationContainer",
    "enabled": true,
    "rules": [
    {
        "enabled": true,
        "name": "inventoryrule1",
        "definition":
        {
            "filters":
            {
                "blobTypes": ["blockBlob", "appendBlob", "pageBlob"],
                "prefixMatch": ["inventorycontainer1", "inventorycontainer2/abcd", "etc"]
            }
        }
    },
    {
        "enabled": true,
        "name": "inventoryrule2",
        "definition":
        {
            "filters":
            {
                "blobTypes": ["pageBlob"],
                "prefixMatch": ["inventorycontainer-disks-", "inventorycontainer4/"],
                "includeSnapshots": true,
                "includeBlobVersions": true
            }
        }
    }]
}
```

## Inventory output

Each inventory run generates a set of CSV formatted files in the specified inventory destination container. The inventory output is generated under the following path:
`https://<accountName>.blob.core.windows.net/<inventory-destination-container>/YYYY/MM/DD/HH-MM-SS/` where:

- *accountName* is your Azure Blob Storage account name
- *inventory-destination-container* is the destination container you specified in the inventory policy
- *YYYY/MM/DD/HH-MM-SS* is the time when the inventory began to run

### Inventory files

Each inventory run generates the following files:

- **Inventory CSV file**: A comma separated values (CSV) file for each inventory rule. Each file contains matched objects and their metadata. The first row in every CSV formatted file is always the schema row. The following image shows an inventory CSV file opened in Microsoft Excel.

   :::image type="content" source="./media/blob-inventory/csv-file-excel.png" alt-text="Screenshot of an inventory CSV file opened in Microsoft Excel":::

- **Manifest file**: A manifest.json file containing the details of the inventory files generated for every rule in that run. The manifest file also captures the rule definition provided by the user and the path to the inventory for that rule.

- **Checksum file**: A manifest.checksum file containing the MD5 checksum of the contents of manifest.json file. Generation of the manifest.checksum file marks the completion of an inventory run.

## Inventory completed event

Subscribe to the inventory completed event to get notified when the inventory run completes. This event is generated when the manifest checksum file is created. The inventory completed event also occurs if the inventory run fails into user error before it starts to run. For example, an invalid policy, or destination container not present error will trigger the event. The event is published to Blob Inventory Topic.

Sample event:

```json
{
  "topic": "/subscriptions/3000151d-7a84-4120-b71c-336feab0b0f0/resourceGroups/BlobInventory/providers/Microsoft.EventGrid/topics/BlobInventoryTopic",
  "subject": "BlobDataManagement/BlobInventory",
  "eventType": "Microsoft.Storage.BlobInventoryPolicyCompleted",
  "id": "c99f7962-ef9d-403e-9522-dbe7443667fe",
  "data": {
    "scheduleDateTime": "2020-10-13T15:37:33Z",
    "accountName": "inventoryaccountname",
    "policyRunStatus": "Succeeded",
    "policyRunStatusMessage": "Inventory run succeeded, refer manifest file for inventory details.",
    "policyRunId": "b5e1d4cc-ee23-4ed5-b039-897376a84f79",
    "manifestBlobUrl": "https://inventoryaccountname.blob.core.windows.net/inventory-destination-container/2020/10/13/15-37-33/manifest.json"
  },
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2020-10-13T15:47:54Z"
}
```

## Next steps

[Manage the Azure Blob Storage lifecycle](storage-lifecycle-management-concepts.md)
