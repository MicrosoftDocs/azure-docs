<properties 
   pageTitle="Manage DNS record sets and records using the Azure portal | Microsoft Azure" 
   description="Managing DNS record sets and records when hosting your domain on Azure DNS." 
   services="dns" 
   documentationCenter="na" 
   authors="cherylmc" 
   manager="carmon" 
   editor=""
   tags="azure-resource-manager"/>

<tags
   ms.service="dns"
   ms.devlang="en"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="03/22/2016"
   ms.author="cherylmc"/>

# How to create and manage DNS records and record sets using the Azure portal


> [AZURE.SELECTOR]
- [Azure Portal](dns-operations-recordsets-portal.md)
- [Azure CLI](dns-operations-recordsets-cli.md)
- [PowerShell](dns-operations-recordsets.md)


This guide will show how to create and manage record sets and records for your DNS zone using the Azure portal.

It is important to understand the distinction between DNS record sets and individual DNS records.  A record set is the collection of records in a zone with the same name and the same type.  For more details, see [Understanding record sets and records](../dns-getstarted-create-recordset#Understanding-record-sets-and-records).

## To create a record set

To create a record set in the Azure portal, see [Create DNS records using the Azure portal](dns-getstarted-create-recordset-portal.md).


## To view a record set

1. In the Azure portal, navigate to your DNS zone blade.
2. You can search for the record set and select it from the listed items. Click the record set to select it. This will open the record set properties.


## To add a new record to a record set

You can add up to 20 records to any record set. However, record sets of type CNAME can contain at most 1 record, and a record set cannot contain two identical records. Empty record sets (with zero records) can be created, but do not appear at the Azure DNS name servers.


1. From the record set properties blade for your dns zone, click the record set that you want to add a record to.
2. Specify the record settings by filling in the fields.
2. Save your settings at the top of the page before closing the blade.
3. In the corner, you will see that the record is saving.
4. You can view the values for the record set on the DNS zone blade.


## To update a record in a record set

When updating a record in an existing record set, the fields you can update depend on the type of record you are working with. To update a record:

1. From the record set properties blade for your record set, search for the record.
2. Modify the available settings.
3. Click **Save** at the top of the blade to save your settings.
3. In the corner, you will see that the record is saving and can view the results on the DNS zone blade.


## To remove a record from a record set

Records can be removed from a record set in the Azure portal. Removing the last record from a record set does not delete the record set.  See [Delete a record set](#delete) below for more information.



## <a name="delete"></a>To delete a record set


## Working with  NS and SOA records

### Modify SOA records

You cannot add or remove records from the automatically-created SOA record set at the zone apex (name = ‘@’), but you can modify any of the parameters within the SOA record (except 'Host') and the record set TTL. See [this article](dns-operations-recordsets.md) for more information about how to do this using PowerShell.

### Modify NS records at zone apex

You cannot add to, remove or modify the records in the automatically-created NS record set at the zone apex (name = ‘@’).  The only change permitted is to modify the record set TTL.  See [this article](dns-operations-recordsets.md) for more information about how to do this using PowerShell.

### Deleting SOA or NS record sets

You cannot delete the SOA and NS record sets at the zone apex (name = ‘@’) that are created automatically when the zone is created.  They will be deleted automatically when deleting the zone.

## See Also

[Get started creating record sets and records](dns-getstarted-create-recordset.md)<BR>
[Manage DNS zones](dns-operations-dnszones.md)<BR>
[Automate operations using .NET SDK](dns-sdk.md)
 
