---
title: Manage DNS record sets and records with Azure DNS
description: Azure DNS provides the capability to manage DNS record sets and records when hosting your domain.
services: dns
author: greg-lindsay
ms.service: dns
ms.topic: how-to
ms.date: 09/27/2022
ms.author: greglin
---

# Manage DNS records and record sets by using the Azure portal

This article shows you how to manage record sets and records for your DNS zone by using the Azure portal.

It's important to understand the difference between DNS record sets and individual DNS records. A record set is a collection of records in a zone that have the same name and are the same type. For more information, see [Create DNS record sets and records by using the Azure portal](./dns-getstarted-portal.md).

## Create a new record set and record

To create a record set in the Azure portal, see [Create DNS records by using the Azure portal](./dns-getstarted-portal.md).

## View a record set

1. In the Azure portal, go to the **DNS zone** overview page.

1. Search for the record set and select it will open the record set properties.

    :::image type="content" source="./media/dns-operations-recordsets-portal/overview.png" alt-text="Screenshot of contosotest.com zone overview page.":::

## Add a new record to a record set

You can add up to 20 records to any record set. A record set may not contain two identical records. Empty record sets (with zero records) can be created, but don't appear on the Azure DNS name servers. Record sets of type CNAME can contain one record at most.

1. On the **Record set properties** page for your DNS zone, select the record set that you want to add a record to.

    :::image type="content" source="./media/dns-operations-recordsets-portal/select-record.png" alt-text="Screenshot of selecting www record set.":::

1. Specify the record set properties by filling in the fields.

    :::image type="content" source="./media/dns-operations-recordsets-portal/record-page.png" alt-text="Screenshot of add a record page.":::

1. Select **Save** at the top of the page to save your settings. Then close the page.

After the record has been saved, the values on the **DNS zone** page will reflect the new record.

## Update a record

When you update a record in an existing record set, the fields you can update depend on the type of record you're working with.

1. On the **Record set properties** page for your record set, search for the record.

1. Modify the record. When you modify a record, you can change the available settings for the record. In the following example, the **IP address** field is selected, and the IP address is being modified.

    :::image type="content" source="./media/dns-operations-recordsets-portal/update-record-page.png" alt-text="Screenshot of update a record page.":::

1. Select **Save** at the top of the page to save your settings. In the upper right corner, you'll see the notification that the record has been saved.

    :::image type="content" source="./media/dns-operations-recordsets-portal/record-saved.png" alt-text="Screenshot of a successfully saved record.":::

After the record has been saved, the values for the record set on the **DNS zone** page will reflect the updated record.

## Remove a record from a record set

You can use the Azure portal to remove records from a record set. Removing the last record from a record set doesn't delete the record set.

1. On the **Record set properties** page for your record set, search for the record.

1. Select the **...** next to the record, then select **Remove** to delete the record from the record set.

    :::image type="content" source="./media/dns-operations-recordsets-portal/delete-record.png" alt-text="Screenshot of how to delete a record.":::

1. Select **Save** at the top of the page to save your settings.

1. After the record has been removed, the values for the record on the **DNS zone** page will reflect the removal.

## <a name="delete"></a>Delete a record set

1. On the **Record set properties** page for your record set, select **Delete**.

    :::image type="content" source="./media/dns-operations-recordsets-portal/delete-record-set.png" alt-text="Screenshot of how to delete a record set.":::

1. A message appears asking if you want to delete the record set.

1. Verify that the name matches the record set that you want to delete, and then select **Yes**.

1. On the **DNS zone** page, verify that the record set is no longer visible.

## Work with NS and SOA records

NS and SOA records that are automatically created are managed differently from other record types.

### Modify SOA records

You can't add or remove records from the automatically created SOA record set at the zone apex (name = "\@"). However, you can modify any of the parameters within the SOA record, except "Host" and the record set TTL.

### Modify NS records at the zone apex

The NS record set at the zone apex is automatically created with each DNS zone. It contains the names of the Azure DNS name servers assigned to the zone.

You may add more name servers to this NS record set, to support cohosting domains with more than one DNS provider. You can also modify the TTL and metadata for this record set. However, you can't remove or modify the pre-populated Azure DNS name servers.

This restriction only applies to the NS record set at the zone apex. Other NS record sets in your zone (as used to delegate child zones) can be modified without constraint.

### Delete SOA or NS record sets

You can't delete the SOA and NS record sets at the zone apex (name = "\@") that gets automatically created when the zone gets created. They're deleted automatically when you delete the zone.

## Next steps

* For more information about Azure DNS, see the [Azure DNS overview](dns-overview.md).
* For more information about automating DNS, see [Creating DNS zones and record sets using the .NET SDK](dns-sdk.md).
* For more information about reverse DNS records, see [Overview of reverse DNS and support in Azure](dns-reverse-dns-overview.md).
* For more information about Azure DNS alias records, see [Azure DNS alias records overview](dns-alias.md).