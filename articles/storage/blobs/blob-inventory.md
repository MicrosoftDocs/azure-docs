---
title: Use Azure Storage inventory to manage blob data (preview)
description: Azure Storage inventory is a tool to help get an overview of all your blob data within a storage account.
services: storage
author: mhopkins-msft

ms.service: storage
ms.date: 10/29/2020
ms.topic: conceptual
ms.author: mhopkins
ms.reviewer: yzheng
ms.subservice: blobs
---

# Use Azure Storage inventory to manage blob data (preview)

Azure Storage inventory provides an overview of your blob data within a storage account. Use the inventory report to understand your total data size, age, encryption status, and so on. The inventory report provides an overview of your data for business and compliance requirements. Once enabled, an inventory report is automatically created daily.

## Availability

Blob inventory is supported for general purpose version 2 (GPv2), premium block blob storage, and Azure DataLake Storage Gen2 (ADLS Gen2) accounts.

### Preview regions

The blob inventory preview is available on storage accounts in the following regions:

- France Central
- Canada Central
- Canada East

### Pricing and billing

The fee for inventory reports is not charged during the preview period. The inventory reporting fee will be determined when this feature is generally available.

## Enable inventory reports

Enable blob inventory reports by adding a policy to your storage account. Add, edit, or remove a policy by using any of the following methods:

- [Azure portal](https://portal.azure.com/) 
- [REST APIs](/rest/api/storagerp/managementpolicies)

:::image type="content" source="./media/blob-inventory/portal-blob-inventory.png" alt-text="Screenshot showing how to add a blob inventory rule by using the Azure portal":::

Inventory policies are read or written in full. Partial updates are not supported.

> [!NOTE]
> If you enable firewall rules for your storage account, inventory requests may be blocked. You can unblock these requests by providing exceptions for trusted Microsoft services. > For more information, see the Exceptions section in [Configure firewalls and virtual networks](../common/storage-network-security.md#exceptions).

A blob inventory policy is automatically scheduled every day and can take up to 24 hours to complete. An inventory report is configured by adding an inventory policy with one or more rules.

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

## Inventory rules

A rule captures the filtering conditions and output parameters for inventory generation. Each rule leads to an independent inventory. Different rules can have the same or overlapping prefixes. A blob can appear in more than one inventory depending on rule definitions.


| Parameter name | Parameter type        | Notes | Required? |
|----------------|-----------------------|-------|-----------|
| destination    | String                | The destination container where all inventory files will be generated. The destination container must already exist. | Yes |
| enabled        | Boolean               | Used to disable the entire policy. When set to **true**, the rule level enabled field will override this. When disabled, inventory for all rules will be disabled. | Yes |
| rules          | Array of rule objects | At least one rule is required in a policy. Up to 10 rules are supported. | Yes |

Each rule within the policy has several parameters:

| Parameter name | Parameter type                 | Notes | Required? |
|----------------|--------------------------------|-------|-----------|
| name           | String                         | A rule name can include up to 256 case-sensitive alphanumeric characters. The name must be unique within a policy. | Yes |
| enabled        | Boolean                        | An optional flag to allow a rule to be temporarily disabled. The default value is **true**. | Yes |
| definition     | JSON inventory rule definition | Each definition is made up of a rule filter set. | Yes |

## Rule filters

| Filter name         | Filter type                     | Notes | Required? |
|---------------------|---------------------------------|-------|-----------|
| blobTypes           | Array of predefined enum values | Valid values are `blockBlob` and `appendBlob` for hierarchical namespace enabled accounts, and `blockBlob`, `appendBlob` and `pageBlob` for other accounts. | Yes |
| prefixMatch         | Array of up to 10 strings for prefixes to be matched. A prefix must start with a container name, for example, "container1/foo" | If you don't define *prefixMatch* or provide an empty prefix, the rule applies to all blobs within the storage account. | No |
| includeSnapshots    | Boolean                         | Specifies whether the inventory should include snapshots. Default is **false**. | No |
| includeBlobVersions | Boolean                         | Specifies whether the inventory should include blob versions. Default is **false**. | No |

```json
{
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

Each inventory run generates a set of CSV formatted files in the destination container specified by the user. The inventory output is generated under the following path:
`https://<accountName>.blob.core.windows.net/<inventory-destination-container>/YYYY/MM/DD/HH-MM-SS/` where:

- *accountName* is your account name
- *inventory-destination-container* is the destination container you specified in the inventory policy
- *YYYY/MM/DD/HH-MM-SS* is the time when the inventory began to run

## Next steps

[Manage the Azure Blob Storage lifecycle](storage-lifecycle-management-concepts.md)
