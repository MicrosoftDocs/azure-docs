---
title: Understand Storage Discovery Pricing | Microsoft Docs
titleSuffix: Azure Storage Discovery
description: Storage Discovery pricing and features available with each pricing plan.
author: fauhse
ms.service: azure-storage-mover
ms.topic: overview
ms.date: 08/01/2025
ms.author: shaas
---

# Azure Storage Discovery preview pricing

Azure Storage Discovery offers free and paid pricing plans. This article describes the differences and explains what influences the bill when choosing a paid option. 

> [!TIP]
> Billing for Azure Storage Discovery starts October 1, 2025. Until then, all pricing plans are free of charge.

## Pricing plans

For each Discovery workspace, you can select from free or paid options. The number of insights and their retention varies.

<table>
    <thead>
        <tr>
            <th rowspan="2">PRICING PLAN</th>
            <th colspan="4">AVAILABLE INSIGHTS</th>
        </tr>
        <tr>
            <th>Capacity</th>
            <th>Transactions</th>
            <th>Configuration</th>
            <th>History</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Free</td>
            <td>
                <ul>
                    <li>Trends</li>
                    <li>Distributions</li>
                    <li>Top storage accounts</li>
                </ul>
            </td>            
            <td><ul><li>N/A</li></ul></td>
            <td><ul><li>N/A</li></ul></td>
            <td>
                <ul>
                    <li>Backfill<sup>1</sup>: 15 days</li>
                    <li>Retention<sup>2</sup>: 15 days</li>
                </ul>
            </td>            
        </tr>
        <tr>
            <td>Standard</td>
            <td>
                <ul>
                    <li>Trends</li>
                    <li>Distributions</li>
                    <li>Top storage accounts</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>Trends</li>
                    <li>Distributions</li>
                    <li>Top storage accounts</li>
                </ul>
            </td>            
            <td>
                <ul>
                    <li>Resource configuration</li>
                    <li>Security configuration</li>
                </ul>
            </td>            
            <td>
                <ul>
                    <li>Backfill<sup>1</sup>: 30 days</li>
                    <li>Retention<sup>2</sup>: 18 months</li>
                </ul>
            </td>            
        </tr>
    </tbody>
</table>

<sup>1</sup> The backfill feature automatically adds historic data into a Storage Discovery workspace from before the workspace is created.<br>
<sup>2</sup> Every workspace retains insights for some time to allow for historical analysis. 

## Understand billing

The total cost of a Storage Discovery workspace depends on the pricing plan you choose and how you configure your workspace.
Cost increases with the number of storage resources and stored data objects you analyze.

For example: Azure Blob Storage consists of storage accounts and each storage account contains blob data objects. The cost of a Discovery workspace depends on the number of storage account resources and blobs within them that are in scope to be analyzed.

|                                | Free pricing plan | Standard pricing plan |
|--------------------------------|-------------------|-----------------------|
| **Storage accounts analyzed**  | Free              | A fee per storage resource (for example: storage account) that is in a scope of your workspace. The more storage resources you analyze, the more the average resource cost decreases.|
| **Total objects analyzed**     | Free              | A fee per data object (for example: blob object) that is contained in a storage resource. The more storage objects you analyze, the more the average object cost decreases. |

<br>

> [!NOTE]
> The cost for these billing components in your market and currency will be published on Azure.com before billing begins on October 1, 2025.

### Other cost considerations

Storing, retrieving, or generating Discovery insights causes no extra charges. Your Azure Storage resources experience no transactions or performance impact when analyzing them with Azure Storage Discovery.

Every workspace is billed individually. Including a storage resource in a paid Discovery workspace increases the bill of that workspace, even if the same storage resource is already included in a different workspace. 

## Next steps

After understanding the billing implications, it's a good idea to get more familiar with the Discovery service.

- [Get an overview of the Discovery service](overview.md)
- [Plan your Storage Discovery deployment](deployment-planning.md)
- [Create a Storage Discovery workspace](create-workspace.md)
