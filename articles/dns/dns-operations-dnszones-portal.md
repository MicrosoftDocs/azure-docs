---
title: Manage DNS zones in Azure DNS - Azure portal | Microsoft Docs
description: You can manage DNS zones using the Azure portal. This article describes how to update, delete, and create DNS zones on Azure DNS
services: dns
documentationcenter: na
author: greg-lindsay
ms.service: dns
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/27/2022
ms.author: greglin
---
# How to manage DNS Zones in the Azure portal

> [!div class="op_single_selector"]
> * [Portal](dns-operations-dnszones-portal.md)
> * [PowerShell](dns-operations-dnszones.md)
> * [Azure classic CLI](./dns-operations-dnszones-cli.md)
> * [Azure CLI](dns-operations-dnszones-cli.md)

This article shows you how to manage your DNS zones by using the Azure portal. You can also manage your DNS zones using the cross-platform [Azure CLI](dns-operations-dnszones-cli.md) or the Azure [PowerShell](dns-operations-dnszones.md).

## Create a DNS zone

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. On the top left-hand side of the screen, select **Create a resource** and search for **DNS zone**. Then select **Create**.

    :::image type="content" source="./media/dns-operations-dnszones-portal/search-dns-zone.png" alt-text="Screenshot of create a resource search for DNS zone.":::

1. On the **Create DNS zone** page enter the following values, then select **Create**:

    | Setting | Details |
    | --- | --- |
    | **Subscription** | Select a subscription to create the DNS zone in.|
    | **Resource group** | Select or create a new resource group. To learn more about resource groups, read the [Resource Manager](../azure-resource-manager/management/overview.md?toc=%2fazure%2fdns%2ftoc.json#resource-groups) overview article.|
    | **Name** | Enter a name for the DNS zone. For example: **contoso.com**. |
    | **Location** | Select the location for the resource group. The location will already be selected if you're using a previously created resource group.  |

> [!NOTE]
> The resource group refers to the location of the resource group, and has no impact on the DNS zone. The DNS zone location is always "global", and is not shown.

## List DNS zones

In the search resources at the top of the Azure portal, search for **DNS zones**. Each DNS zone is its own resource. Information such as number of record-sets and name servers are viewable from this page. The column **Name servers** isn't in the default view. To add it, select **Managed view > Edit columns > + Add Column**, then from the drop-down select **Name servers**. Select **Save** to apply the new column.

:::image type="content" source="./media/dns-operations-dnszones-portal/list-zones.png" alt-text="Screenshot of DNS zone list page.":::

## Delete a DNS zone

Navigate to a DNS zone in the portal. On the selected **DNS zone** overview page, select **Delete zone**. You're then prompted to confirm that you want to delete the DNS zone. Deleting a DNS zone also deletes all records that are contained in the zone.

:::image type="content" source="./media/dns-operations-dnszones-portal/delete-zone.png" alt-text="Screenshot of delete DNS zone button on overview page.":::

## Next steps

Learn how to work with your DNS Zone and records by visiting [Get started with Azure DNS using the Azure portal](dns-getstarted-portal.md).
