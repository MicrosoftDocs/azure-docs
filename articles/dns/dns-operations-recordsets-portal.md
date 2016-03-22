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

It's very easy to view your DNS record set and records from the Azure portal.

1. In the Azure portal, navigate to your DNS zone blade.
2. You can search for the record set and select it from the listed items. Click the record set to select it. This will open the record set properties.


## To modify your record set

1. From the record set properties blade for your record set, modify the settings.
2. Save your settings at the top of the page before closing the blade.
3. In the corner, you will see that the record is saving and can view the results on the DNS zone blade.


## To add a record to a record set

Records are added to record sets using the Add-AzureRmDnsRecordConfig cmdlet. This is an off-line operation—only the local object representing the record set is changed.

The parameters for adding records to a record set vary depending on the type of the record set. For example, when using a record set of type 'A' you will only be able to specify records with the parameter ‘IPv4Address’.

Additional records can be added to each record set by additional calls to Add-AzureRmDnsRecordConfig.  You can add up to 20 records to any record set.  However, record sets of type CNAME can contain at most 1 record, and a record set cannot contain two identical records.  Empty record sets (with zero records) can be created, but do not appear at the Azure DNS name servers.

Once the record set contains the desired collection of records, it needs to be committed using the Set-AzureRmDnsRecordSet cmdlet, which replaces the existing record set in Azure DNS with the record set provided.
The following examples show how to create a record set of each record type containing a single record.

The sequence of operations to create a record can also be ‘piped’, passing the record set object using the pipe rather than as a parameter.  For example:

	PS C:\> New-AzureRmDnsRecordSet -Name "test-a" -RecordType A -Ttl 60 -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup | Add-AzureRmDnsRecordConfig -Ipv4Address "1.2.3.4" | Set-AzureRmDnsRecordSet


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

	PS C:\> $rs = Get-AzureRmDnsRecordSet -name "test-mx" -RecordType MX -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup
	PS C:\> Add-AzureRmDnsRecordConfig -RecordSet $rs -Exchange "mail2.contoso.com" -Preference 10
	PS C:\> Add-AzureRmDnsRecordConfig -RecordSet $rs -Exchange "mail3.contoso.com" -Preference 20
	PS C:\> Set-AzureRmDnsRecordSet -RecordSet $rs 

## Remove a record from an existing record set

Records can be removed from a record set using Remove-AzureRmDnsRecordConfig.  Note that the record being removed must be an exact match with an existing record, across all parameters.  Changes must be committed using Set-AzureRmDnsRecordSet.

Removing the last record from a record set does not delete the record set.  See [Delete a record set](#delete-a-record-set) below for more.


	PS C:\> $rs = Get-AzureRmDnsRecordSet -Name "test-a" -RecordType A -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup
	PS C:\> Remove-AzureRmDnsRecordConfig -RecordSet $rs -Ipv4Address "1.2.3.4"
	PS C:\> Set-AzureRmDnsRecordSet -RecordSet $rs

The sequence of operations to remove a record from a record set can also be ‘piped’, passing the record set object using the pipe rather than as a parameter.  For example:

	PS C:\> Get-AzureRmDnsRecordSet -Name "test-a" -RecordType A -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup | Remove-AzureRmDnsRecordConfig -Ipv4Address "1.2.3.4" | Set-AzureRmDnsRecordSet

### Remove AAAA record from a record set

	PS C:\> $rs = Get-AzureRmDnsRecordSet -Name "test-aaaa" -RecordType AAAA -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup
	PS C:\> Remove-AzureRmDnsRecordConfig -RecordSet $rs -Ipv6Address "2607:f8b0:4009:1803::1005"
	PS C:\> Set-AzureRmDnsRecordSet -RecordSet $rs

### Remove CNAME record from a record set

Since a CNAME record set can contain at most one record, removing that record will leave an empty record set.

	PS C:\> $rs =  Get-AzureRmDnsRecordSet -name "test-cname" -RecordType CNAME -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup	
	PS C:\> Remove-AzureRmDnsRecordConfig -RecordSet $rs -Cname "www.contoso.com"
	PS C:\> Set-AzureRmDnsRecordSet -RecordSet $rs


## Delete a record set
Record sets can be deleted using the Remove-AzureRmDnsRecordSet cmdlet.

>[AZURE.NOTE] You cannot delete the SOA and NS record sets at the zone apex (name = ‘@’) that are created automatically when the zone is created.  They will be deleted automatically when deleting the zone.


## See Also

[Get started creating record sets and records](dns-getstarted-create-recordset.md)<BR>
[Manage DNS zones](dns-operations-dnszones.md)<BR>
[Automate operations using .NET SDK](dns-sdk.md)
 
