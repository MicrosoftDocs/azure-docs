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

To create a record set in the Azure portal, see [Create DNS records using the Azure portal](dns-getstarted-recordset-portal.md).


## To view an existing record set

1. In the Azure portal, navigate to your DNS zone blade.
2. You can search for the record set and select it from the listed items. Click the record set to select it. This will open the record set properties.


## To modify your record set

1. From the record set properties blade for your record set, modify the settings.
2. Save your settings at the top of the page before closing the blade.
3. In the corner, you will see that the record is saving and can view the results on the DNS zone blade.


## To add a record to a record set

Records are added to record sets using the Add-AzureRmDnsRecordConfig cmdlet. This is an off-line operation—only the local object representing the record set is changed.

The parameters for adding records to a record set vary depending on the type of the record set. For example, when using a record set of type 'A' you will only be able to specify records with the parameter ‘IPv4Address’.

You can add up to 20 records to any record set. However, record sets of type CNAME can contain at most 1 record, and a record set cannot contain two identical records. Empty record sets (with zero records) can be created, but do not appear at the Azure DNS name servers.


## To update a record in an existing record set



### Modify SOA record

>[AZURE.NOTE] You cannot add or remove records from the automatically-created SOA record set at the zone apex (name = ‘@’), but you can modify any of the parameters within the SOA record (except 'Host') and the record set TTL.

The following example shows how to change the ‘Email’ property of the SOA record:

	PS C:\> $rs = Get-AzureRmDnsRecordSet -Name "@" -RecordType SOA -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup
	PS C:\> $rs.Records[0].Email = "admin.contoso.com"
	PS C:\> Set-AzureRmDnsRecordSet -RecordSet $rs 

### Modify NS records at zone apex

>[AZURE.NOTE] You cannot add to, remove or modify the records in the automatically-created NS record set at the zone apex (name = ‘@’).  The only change permitted is to modify the record set TTL.

The following example shows how to change the TTL property of the NS record set:

	PS C:\> $rs = Get-AzureRmDnsRecordSet -Name "@" -RecordType NS -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup
	PS C:\> $rs.Ttl = 300
	PS C:\> Set-AzureRmDnsRecordSet -RecordSet $rs 

### Add records to an existing record set

In this example we add two additional MX records to the existing record set:


## Remove a record from an existing record set

Records can be removed from a record set in the Azure portal. Removing the last record from a record set does not delete the record set.  See [Delete a record set](#delete-a-record-set) below for more.

### Remove CNAME record from a record set

Since a CNAME record set can contain at most one record, removing that record will leave an empty record set.


## To delete a record set


>[AZURE.NOTE] You cannot delete the SOA and NS record sets at the zone apex (name = ‘@’) that are created automatically when the zone is created.  They will be deleted automatically when deleting the zone.


## See Also

[Get started creating record sets and records](dns-getstarted-create-recordset.md)<BR>
[Manage DNS zones](dns-operations-dnszones.md)<BR>
[Automate operations using .NET SDK](dns-sdk.md)
 
