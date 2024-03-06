---
title: Use Azure Resource Graph Explorer to query Azure Private DNS
titleSuffix: Azure DNS
description: Learn how to query Azure Private DNS zones using Azure Resource Graph Explorer.
services: dns
author: greg-lindsay
ms.service: dns
ms.date: 03/05/2024
ms.author: greglin
ms.topic: how-to
---

# Private DNS information in Azure Resource Graph

[Azure Resource Graph](../governance/resource-graph/overview.md) is an Azure service that allows you to query your Azure resources with complex filtering, grouping, and sorting. Azure Resource Graph (ARG) provides detailed information about your resources and can display results in several ways. 

You can use the `dnsresources` table to query information about your private zones, including:

- The type and number of resource records in one or all zones
- Virtual network links
- Resource record names and IP addresses

To get started with Resource Graph, search and select **Resource Graph Explorer** in the Azure portal. In the left-hand navigation pane, select the **Table** tab and review the **dnsresources** table. Select **dnsresources** to create a basic query and then click **Run** to return the results.

![Screenshot of a basic ARG query.](./media/private-dns-arg/basic-query.png)

To replace IDs with display names and show values as links where possible, toggle **Formatted results** to **On** in the upper right corner of the display. To view the details for a record, scroll to the right and select **See details**. The first few records shown in the previous example are PTR records (type = microsoft.network/privatednszones/ptr).

## Count resource records by type

To list the types of resource record by type, run the following query:

```Kusto
dnsresources
| summarize count() by recordType = tostring(type)
```

![Screenshot of a resource record count query.](./media/private-dns-arg/count-query.png)

The query results display all records that the current subscription has permission to view. To specify a subscription ID, use the following query:

```Kusto
dnsresources
| where subscriptionId == "<your subscription ID>"
| summarize count() by recordType = tostring(type)
```
You can also view the total count of resource records visually by selecting the **Chart** tab and then selecting the chart type. The following is an example of a **Donut chart**:

![Screenshot of a resource record count query donut chart.](./media/private-dns-arg/count-donut.png)

## Zones with virtual network links

## Resource record names and IP addresses

## Next steps

* Learn how to [manage record sets and records](./private-dns-getstarted-cli.md) in your DNS zone.
