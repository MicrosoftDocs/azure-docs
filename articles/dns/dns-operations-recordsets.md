<properties 
   pageTitle="Manage DNS record sets and records on Azure DNS | Microsoft Azure" 
   description="Managing DNS record sets and records on Azure DNS when hosting your domain on Azure DNS. All PowerShell commands for operations on record sets and records." 
   services="dns" 
   documentationCenter="na" 
   authors="cherylmc" 
   manager="carmon" 
   editor=""/>

<tags
   ms.service="dns"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="05/03/2016"
   ms.author="cherylmc"/>

# Manage DNS records and record sets using PowerShell



> [AZURE.SELECTOR]
- [Azure Portal](dns-operations-recordsets-portal.md)
- [Azure CLI](dns-operations-recordsets-cli.md)
- [PowerShell](dns-operations-recordsets.md)



This article shows you how to manage record sets and records for your DNS zone using Azure PowerShell.

It is important to understand the difference between DNS record sets and individual DNS records. A record set is the collection of records in a zone with the same name and the same type. For more information, see [Understanding record sets and records](dns-getstarted-create-recordset-portal.md).


## Create a new record set and a record

To create a record set in the Azure portal, see [Create DNS records using the Azure portal](dns-getstarted-create-recordset.md).

## Get a record set

To retrieve an existing record set, use `Get-AzureRmDnsRecordSet`. Specify the record set relative name, the record type, and the zone.

	$rs = Get-AzureRmDnsRecordSet –Name www –RecordType A -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup

As with `New-AzureRmDnsRecordSet`, the record name must be a relative name, i.e. excluding the zone name. 

The zone can be specified using either the zone name and resource group name, or using a zone object:

	$zone = Get-AzureRmDnsZone -Name contoso.com -ResouceGroupName MyAzureResourceGroup
	$rs = Get-AzureRmDnsRecordSet -Name www –RecordType A -Zone $zone
	
`Get-AzureRmDnsRecordSet` returns a local object representing the record set created in Azure DNS.

## List record sets

`Get-AzureRmDnsRecordSet` can also be used to list record sets by omitting the *–Name* and/or *–RecordType* parameters.

### To list all record sets 

This example will return all record sets, regardless of name or record type:

	$list = Get-AzureRmDnsRecordSet -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup

### To list record sets of a given record type

This will return all record sets matching the given record type, In this case, A records.

	$list = Get-AzureRmDnsRecordSet –RecordType A -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup 

The zone can be specified using either the *–ZoneName* and *–ResourceGroupName* parameters (as shown) or by specifying a zone object:

	$zone = Get-AzureRmDnsZone -Name contoso.com -ResouceGroupName MyAzureResourceGroup
	$list = Get-AzureRmDnsRecordSet -Zone $zone

## Add a record to a record set

Records are added to record sets using the `Add-AzureRmDnsRecordConfig` cmdlet. This is an off-line operation—only the local object representing the record set is changed.

The parameters for adding records to a record set vary depending on the type of the record set. For example, when using a record set of type *A* you will only be able to specify records with the parameter *-IPv4Address*.

Additional records can be added to each record set by additional calls to `Add-AzureRmDnsRecordConfig`. You can add up to 20 records to any record set.  However, record sets of type *CNAME* can contain at most 1 record, and a record set cannot contain two identical records. Empty record sets (with zero records) can be created, but do not appear at the Azure DNS name servers.

Once the record set contains the desired collection of records, it needs to be committed using the `Set-AzureRmDnsRecordSet` cmdlet, which replaces the existing record set in Azure DNS with the record set provided.

The following examples show how to create a record set of each record type containing a single record.

### Create A record set with single record

	$rs = New-AzureRmDnsRecordSet -Name "test-a" -RecordType A -Ttl 60 -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup 
	PS C:\> Add-AzureRmDnsRecordConfig -RecordSet $rs -Ipv4Address "1.2.3.4"
	PS C:\> Set-AzureRmDnsRecordSet -RecordSet $rs

The sequence of operations to create a record can also be ‘piped’, passing the record set object using the pipe rather than as a parameter.  For example:

	PS C:\> New-AzureRmDnsRecordSet -Name "test-a" -RecordType A -Ttl 60 -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup | Add-AzureRmDnsRecordConfig -Ipv4Address "1.2.3.4" | Set-AzureRmDnsRecordSet

### Create AAAA record set with single record

	PS C:\> $rs = New-AzureRmDnsRecordSet -Name "test-aaaa" -RecordType AAAA -Ttl 60 -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup
	PS C:\> Add-AzureRmDnsRecordConfig -RecordSet $rs -Ipv6Address "2607:f8b0:4009:1803::1005"
	PS C:\> Set-AzureRmDnsRecordSet -RecordSet $rs

### Create CNAME record set with single record

	PS C:\> $rs = New-AzureRmDnsRecordSet -Name "test-cname" -RecordType CNAME -Ttl 60 -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup
	PS C:\> Add-AzureRmDnsRecordConfig -RecordSet $rs -Cname "www.contoso.com"
	PS C:\> Set-AzureRmDnsRecordSet -RecordSet $rs

### Create MX record set with single record

In this example, we use the record set name "@" to create the MX record at the zone apex (e.g. "contoso.com").  This is common for MX records.

	PS C:\> $rs = New-AzureRmDnsRecordSet -Name "@" -RecordType MX -Ttl 60 -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup
	PS C:\> Add-AzureRmDnsRecordConfig -RecordSet $rs -Exchange "mail.contoso.com" -Preference 5
	PS C:\> Set-AzureRmDnsRecordSet -RecordSet $rs

### Create NS record set with single record

	PS C:\> $rs = New-AzureRmDnsRecordSet -Name "test-ns" -RecordType NS -Ttl 60 -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup
	PS C:\> Add-AzureRmDnsRecordConfig -RecordSet $rs -Nsdname "ns1.contoso.com"
	PS C:\> Set-AzureRmDnsRecordSet -RecordSet $rs

### Create SRV record set with single record

If creating an SRV record in root of zone, just specify _service and _protocol in the record name—there is no need to also include ‘.@’ in the record name

	PS C:\> $rs = New-AzureRmDnsRecordSet -Name "_sip._tls" -RecordType SRV -Ttl 60 -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup
	PS C:\> Add-AzureRmDnsRecordConfig -RecordSet $rs –Priority 0 –Weight 5 –Port 8080 –Target "sip.contoso.com"
	PS C:\> Set-AzureRmDnsRecordSet -RecordSet $rs

### Create TXT record set with single record

	PS C:\> $rs = New-AzureRmDnsRecordSet -Name "test-txt" -RecordType TXT -Ttl 60 -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup
	PS C:\> Add-AzureRmDnsRecordConfig -RecordSet $rs -Value "This is a TXT record"
	PS C:\> Set-AzureRmDnsRecordSet -RecordSet $rs

## Modifying existing record sets

Modifying existing record sets follows a similar pattern to creating records.  The sequence of operations is as follows:

1.	Retrieve the existing record set using Get-AzureRmDnsRecordSet.
2.	Modify the record set, by either adding records, removing records, changing the record parameters or changing the record set TTL.  These changes are off-line—only the local object representing the record set is changed.
3.	Commit your changes using the Set-AzureRmDnsRecordSet cmdlet.  This replaces the existing record set in Azure DNS with the record set provided.

This is shown by the following examples:

### Update a record in an existing record set

For this example we will change the IP address of an existing A record:

	PS C:\> $rs = Get-AzureRmDnsRecordSet -name "test-a" -RecordType A -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup
	PS C:\> $rs.Records[0].Ipv4Address = "134.170.185.46"
	PS C:\> Set-AzureRmDnsRecordSet -RecordSet $rs 

The Set-AzureRmDnsRecordSet cmdlet uses ‘etag’ checks to ensure concurrent changes are not overwritten.  Use the ‘-Overwrite’ flag to suppress these checks.  See Etags and Tags for more information.

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

### Remove MX record from a record set

	PS C:\> $rs = Get-AzureRmDnsRecordSet -name "test-mx" -RecordType MX -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup	
	PS C:\> Remove-AzureRmDnsRecordConfig -RecordSet $rs -Exchange "mail.contoso.com" -Preference 5
	PS C:\> Set-AzureRmDnsRecordSet -RecordSet $rs

### Remove NS record from record set
	
	PS C:\> $rs = Get-AzureRmDnsRecordSet -Name "test-ns" -RecordType NS -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup
	PS C:\> Remove-AzureRmDnsRecordConfig -RecordSet $rs -Nsdname "ns1.contoso.com"
	PS C:\> Set-AzureRmDnsRecordSet -RecordSet $rs

### Remove SRV record from a record set

	PS C:\> $rs = Get-AzureRmDnsRecordSet -Name "_sip._tls" -RecordType SRV -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup
	PS C:\> Remove-AzureRmDnsRecordConfig -RecordSet $rs –Priority 0 –Weight 5 –Port 8080 –Target "sip.contoso.com"
	PS C:\> Set-AzureRmDnsRecordSet -RecordSet $rs

### Remove TXT record from a record set

	PS C:\> $rs = Get-AzureRmDnsRecordSet -Name "test-txt" -RecordType TXT -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup
	PS C:\> Remove-AzureRmDnsRecordConfig -RecordSet $rs -Value "This is a TXT record"
	PS C:\> Set-AzureRmDnsRecordSet -RecordSet $rs

## Delete a record set
Record sets can be deleted using the Remove-AzureRmDnsRecordSet cmdlet.

>[AZURE.NOTE] You cannot delete the SOA and NS record sets at the zone apex (name = ‘@’) that are created automatically when the zone is created.  They will be deleted automatically when deleting the zone.

Use one of the following three ways to remove a record set:

### Option 1

Specify the all parameters by name:

	PS C:\> Remove-AzureRmDnsRecordSet -Name "test-a" -RecordType A -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup [-Force]

The optional ‘-Force’ switch can be used to suppress the confirmation prompt.

### Option 2

Specify the record set by name and type, specify the zone by object:

	PS C:\> $zone = Get-AzureRmDnsZone -Name contoso.com -ResourceGroupName MyAzureResourceGroup
	PS C:\> Remove-AzureRmDnsRecordSet -Name "test-a" -RecordType A -Zone $zone [-Force]

### Option 3

Specify the record set by object:

	PS C:\> $rs = Get-AzureRmDnsRecordSet -Name "test-a" -RecordType A -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup
	PS C:\> Remove-AzureRmDnsRecordSet –RecordSet $rs [-Overwrite] [-Force]

Specifying the record set using an object enables ‘etag’ checks to ensure concurrent changes are not deleted.  The optional ‘-Overwrite’ flag suppresses these checks. See [Etags and tags](../dns-getstarted-create-dnszone#Etags-and-tags) for more information.

The record set object can also be piped instead of being passed as a parameter:

	PS C:\> Get-AzureRmDnsRecordSet -Name "test-a" -RecordType A -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup | Remove-AzureRmDnsRecordSet [-Overwrite] [-Force]

##See Also

[Get started creating record sets and records](dns-getstarted-create-recordset.md)<BR>
[Manage DNS zones](dns-operations-dnszones.md)<BR>
[Automate operations using .NET SDK](dns-sdk.md)
 
