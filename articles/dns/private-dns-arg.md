---
title: Use Azure Resource Graph Explorer to query Azure Private DNS
titleSuffix: Azure DNS
description: Learn how to query Azure Private DNS zones using Azure Resource Graph Explorer.
services: dns
author: greg-lindsay
ms.service: dns
ms.date: 03/20/2024
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

To use Resource Graph in the Azure portal, search and select **Resource Graph Explorer**. In the left-hand navigation pane, select the **Table** tab and review the **dnsresources** table. This table is used to query private DNS zone data. Public DNS zones are not queried when you use this table. 

Select **dnsresources** to create a basic query and then click **Run query** to return the results. See the following example:

![Screenshot of a basic ARG query.](./media/private-dns-arg/basic-query.png)

To replace IDs with display names and show values as links where possible, toggle **Formatted results** to **On** in the upper right corner of the display. To view the details for a record, scroll to the right and select **See details**. The first few records shown in the previous example are PTR records (type = microsoft.network/privatednszones/ptr).

## Count resource records by type

The following query uses the **dnsresources** table to provide a count of resource records by type for all private zones:

```Kusto
dnsresources
| summarize count() by recordType = tostring(type)
```

![Screenshot of a resource record count query.](./media/private-dns-arg/count-query.png)

The query counts all records that the current subscription has permission to view. You can also view the count visually by selecting the **Charts** tab and then selecting the chart type. The following is an example of a **Donut chart**:

![Screenshot of a resource record count query donut chart.](./media/private-dns-arg/count-donut.png)

## List and sort resource records

The following query lists all resource

Query results can be filtered by specifying parameters such as the zone name, subscription ID, resource group, or record type. For example, the following example query returns list of A or CNAME records in the zone **private.contoso.com** for a given subscription and resource group:

```Kusto
dnsresources
| where managedBy == "private.contoso.com"
| where subscriptionId == "<your subscription ID>"
| where resourceGroup == "<your resource group name>"
| where type in (
    "microsoft.network/privatednszones/a",
    "microsoft.network/privatednszones/cname"
)
| project name, type, id, properties
```

The following query uses a regular expression to match only IPv4 addresses in the given private DNS zone and specified subscription:

```Kusto
dnsresources
| where subscriptionId == "<your subscription ID>"
| where managedBy == "private.contoso.com"
| where properties matches regex @'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}'
| extend IP=extract_all(@'(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?:\/\d{1,2}){0,1})',tostring(properties))
| project  name, IP, resourceGroup, subscriptionId, properties
| mv-expand IP
| order by name
```

## Zones with virtual network links

The following query to list all private DNS zones that have virtual network links. This query uses the generic **resources** table, not the **dnsresources** table and specifies a resource type of only **privatednszones**.

```Kusto
resources
| where subscriptionId == "<your subscription ID>"
| where type == "microsoft.network/privatednszones"
| where properties['numberOfVirtualNetworkLinks'] == "1"
| project name, properties
```

## Autoregistion

The following query returns a list of virtual network links with autoregistration enabled and the associated private DNS records"

dnsresources
| where subscriptionId == "186ffd69-c40a-4dec-87ff-1495378be90e"
| where isnull(properties.virtualNetworkId) == false
| extend linkname=(properties.virtualNetworkLinkName)
| project name, type, linkname, properties



## Next steps

* Learn how to [manage record sets and records](./private-dns-getstarted-cli.md) in your DNS zone.
