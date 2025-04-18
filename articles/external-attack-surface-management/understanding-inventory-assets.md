---
title: Understanding Inventory Assets
description: Learn how Microsoft Defender External Attack Surface Management (Defender EASM) uses proprietary discovery technology to recursively searches for infrastructure with observed connections to known legitimate assets.
author: danielledennis
ms.author: dandennis
ms.service: defender-easm
ms.date: 07/14/2022
ms.topic: conceptual
---

# Understanding inventory assets

Microsoft Defender External Attack Surface Management (Defender EASM) uses Microsoft proprietary discovery technology to recursively search for infrastructure through observed connections to known legitimate assets (*discovery seeds*). It makes inferences about that infrastructure's relationship to the organization to uncover previously unknown and unmonitored properties.

Defender EASM discovery includes the following kinds of assets:

- Domains
- IP address blocks
- Hosts
- Email contacts
- Autonomous system numbers (ASNs)
- Whois organizations

These asset types make up your attack surface inventory in Defender EASM. The solution discovers externally facing assets that are exposed to the open internet outside of traditional firewall protection. The external assets need to be monitored and maintained to minimize risk and improve the organization’s security posture. Defender EASM actively discovers and monitors the assets, and then surfaces key insights that help you efficiently address any vulnerabilities to your organization.

:::image type="content" source="media/inventory-changes-all.png" alt-text="Screenshot of the Inventory changes pane with approved inventory numbers of changes by type.":::

## Asset states

All assets are labeled with one of the following states:

| State name | Description |
|--|--|
| **Approved Inventory** | An item that is part of your owned attack surface. It's an item that you're directly responsible for. |
| **Dependency** | Infrastructure that is owned by a third party, but it's part of your attack surface because it directly supports the operation of your owned assets. For example, you might depend on an IT provider to host your web content. The domain, host name, and pages would be part of your approved inventory, so you might want to treat the IP address that runs the host as a dependency. |
| **Monitor Only** | An asset that is relevant to your attack surface, but it's not directly controlled or a technical dependency. For example, independent franchisees or assets that belong to related companies might be labeled **Monitor Only** rather than **Approved Inventory** to separate the groups for reporting purposes. |
| **Candidate** | An asset that has some relationship to your organization's known seed assets, but which doesn't have a strong enough connection to immediately label it **Approved Inventory**. You must manually review these candidate assets to determine ownership. |
| **Requires Investigation** | A state similar to the **Candidate** state, but this value is applied to assets that require manual investigation to validate. The state is determined based on our internally generated confidence scores that assess the strength of detected connections between assets. It doesn't indicate the infrastructure's exact relationship to the organization, but it flags the asset for more review to determine how it should be categorized. |

## Handling different asset states

These asset states are uniquely processed and monitored to ensure that you have clear visibility into your most critical assets by default. For example, assets in the **Approved Inventory** state are always represented in dashboard charts, and they're scanned daily to ensure data recency. All other types of assets aren't included in dashboard charts by default. But you can adjust your inventory filters to view assets in different states as needed. Similarly, **Candidate** state assets are scanned only during the discovery process. If these types of assets are owned by your organization, it’s important to review these assets and change their state to **Approved Inventory**.

## Tracking inventory changes

Your attack surface constantly changes. Defender EASM continuously analyzes and updates your inventory to ensure accuracy. Assets are frequently added and removed from inventory, so it's important to track these changes to understand your attack surface and identify key trends. The inventory changes dashboard provides an overview of these changes. You can easily view "added" and "removed" counts for each asset type. You can filter the dashboard by two date ranges: either the last 7 days or the last 30 days. For a more granular view of inventory changes, see the **Changes by date** section of the dashboard.

:::image type="content" source="media/inventory-changes-date.png" alt-text="Screenshot of inventory changes grouped by date." lightbox="media/inventory-changes-date.png":::

## Related content

- [Modify inventory assets](labeling-inventory-assets.md)
- [Understanding asset details](understanding-asset-details.md)
- [Use and manage discovery](using-and-managing-discovery.md)
