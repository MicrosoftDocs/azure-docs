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

[Azure Resource Graph](../governance/resource-graph/overview.md) (ARG) is an Azure service that allows you to query your Azure resources with complex filtering, grouping, and sorting. ARG queries provide detailed information about your resources and you can display the results in several ways. 

You can display information about your DNS zones, including:

- The type and number of resource records in one or all zones
- Virtual network links
- Resource record names and IP addresses

## The dnsresources table

To use Resource Graph in the Azure portal, search and select **Resource Graph Explorer**. In the left-hand navigation pane, select the **Table** tab and review the **dnsresources** table. This table is used to query private DNS zone data. Public DNS zones are not queried when you use this table. Select **dnsresources** to create a basic query and then click **Run query** to return the results. See the following example:

![Screenshot of a basic ARG query.](./media/private-dns-arg/basic-query.png)

To replace IDs with display names and show values as links where possible, toggle **Formatted results** to **On** in the upper right corner of the display. To view the details for a record, scroll to the right and select **See details**. The first few records shown in the previous example are PTR records (type = microsoft.network/privatednszones/ptr).

## Count resource records by type

The following query uses the **dnsresources** table to provide a count of private zone resource records by type:

```Kusto
dnsresources
| summarize count() by recordType = tostring(type)
```

![Screenshot of a resource record count query.](./media/private-dns-arg/count-query.png)

The query results display all records that the current subscription has permission to view. You can also specify parameters such as the subscription ID, resource group, or record type. For example, the following example query returns a count of A or CNAME records in a given subscription and resource group:

```Kusto
dnsresources
| where subscriptionId == "<your subscription ID>"
| where resourceGroup == "<your resource group name>"
| where type in (
    "microsoft.network/privatednszones/a",
    "microsoft.network/privatednszones/cname"
)
| summarize count() by recordType = tostring(type)
```
You can also view the total count of resource records visually by selecting the **Charts** tab and then selecting the chart type. The following is an example of a **Donut chart**:

![Screenshot of a resource record count query donut chart.](./media/private-dns-arg/count-donut.png)

## Zones with virtual network links

## Resource record names and IP addresses

## Next steps

* Learn how to [manage record sets and records](./private-dns-getstarted-cli.md) in your DNS zone.
