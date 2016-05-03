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
   ms.devlang="en"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="03/04/2016"
   ms.author="cherylmc"/>

# How to manage DNS records using PowerShell



> [AZURE.SELECTOR]
- [Azure Portal](dns-operations-recordsets-portal.md)
- [Azure CLI](dns-operations-recordsets-cli.md)
- [PowerShell](dns-operations-recordsets.md)



This guide will show how to manage record sets and records for your DNS zone using Azure PowerShell.

It is important to understand the distinction between DNS record sets and individual DNS records.  A record set is the collection of records in a zone with the same name and the same type.  For more details, see [Understanding record sets and records](../dns-getstarted-create-recordset#Understanding-record-sets-and-records).

## Create a record set

Record sets are created using the New-AzureRmDnsRecordSet cmdlet.  You need to specify the record set name, the zone, the Time-to-Live (TTL) and the record type.

The record set name must be a relative name, excluding the zone name.  For example, the record set name ‘www’ in zone ‘contoso.com’ will create a record set with the fully-qualified name ‘www.contoso.com’.

For a record set at the zone apex, use "@" as the record set name, including quotation marks.  The fully-qualified name of the record set is then equal to the zone name, in this case "contoso.com".

Azure DNS supports the following record types: A, AAAA, CNAME, MX, NS, SOA, SRV, TXT.  Record sets of type SOA are created automatically with each zone, they cannot be created separately.

	PS C:\> $rs = New-AzureRmDnsRecordSet -Name www -RecordType A -Ttl 300 -ZoneName contoso.com -ResouceGroupName MyAzureResouceGroup [-Tag $tags] [-Overwrite] [-Force]

If a record set already exists, the command will fail unless the -Overwrite switch is used.  The ‘-Overwrite’ option will trigger a confirmation prompt, which can be suppressed using the -Force switch.

In the above example, the zone is specified using the zone name and resource group name.  Alternatively, you can specify a zone object, as returned by Get-AzureRmDnsZone or New-AzureRmDnsZone.

	PS C:\> $zone = Get-AzureRmDnsZone -ZoneName contoso.com –ResourceGroupName MyAzureResourceGroup
	PS C:\> $rs = New-AzureRmDnsRecordSet -Name www -RecordType A -Ttl 300 –Zone $zone [-Tag $tags] [-Overwrite] [-Force]

New-AzureRmDnsRecordSet returns a local object representing the record set created in Azure DNS.

>[AZURE.IMPORTANT] CNAME record sets cannot co-exist with other record sets with the same name.  For example, you cannot create a CNAME with the relative name ‘www’ and an A record with the relative name ‘www’ at the same time.  Since the zone apex (name = ‘@’) always contains the NS and SOA record sets created when the zone is created, this means you cannot create a CNAME record set at the zone apex.  These constraints arise from the DNS standards, they are not limitations of Azure DNS.

### Wildcard records

Azure DNS supports [wildcard records](https://en.wikipedia.org/wiki/Wildcard_DNS_record).  These are returned for any query with a matching name (unless there is a closer match from a non-wildcard record set).

To create a wildcard record set, use the record set name "\*", or a name whose first label is "\*", e.g. "\*.foo".

Wildcard record sets are supported for all record types except NS and SOA.  

## Get a record set

To retrieve an existing record set, use ‘Get-AzureRmDnsRecordSet’, specifying the record set relative name, the record type, and the zone:

	PS C:\> $rs = Get-AzureRmDnsRecordSet –Name www –RecordType A -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup

As with New-AzureRmDnsRecordSet, the record name must be a relative name, i.e. excluding the zone name.  The zone can be specified using either the zone name and resource group name, or using a zone object:

	PS C:\> $zone = Get-AzureRmDnsZone -Name contoso.com -ResouceGroupName MyAzureResourceGroup
	PS C:\> $rs = Get-AzureRmDnsRecordSet -Name www –RecordType A -Zone $zone
	
Get-AzureRmDnsRecordSet returns a local object representing the record set created in Azure DNS.

## List record sets
By omitting the –Name and/or –RecordType parameters, Get-AzureRmDnsRecordSet can also be used to list record sets:

### Option 1 

List all record sets.  This will return all record sets, regardless of name or record type:

	PS C:\> $list = Get-AzureRmDnsRecordSet -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup

### Option 2 

List record sets of a given record type.  This will return all record sets matching the given record type (in this case, A records):

	PS C:\> $list = Get-AzureRmDnsRecordSet –RecordType A -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup 

In both options above, the zone can be specified using either the –ZoneName and –ResourceGroupName parameters (as shown) or by specifying a zone object:

	PS C:\> $zone = Get-AzureRmDnsZone -Name contoso.com -ResouceGroupName MyAzureResourceGroup
	PS C:\> $list = Get-AzureRmDnsRecordSet -Zone $zone

## Add a record to a record set

Records are added to record sets using the Add-AzureRmDnsRecordConfig cmdlet. This is an off-line operation—only the local object representing the record set is changed.

The parameters for adding records to a record set vary depending on the type of the record set. For example, when using a record set of type 'A' you will only be able to specify records with the parameter ‘IPv4Address’.

Additional records can be added to each record set by additional calls to Add-AzureRmDnsRecordConfig.  You can add up to 20 records to any record set.  However, record sets of type CNAME can contain at most 1 record, and a record set cannot contain two identical records.  Empty record sets (with zero records) can be created, but do not appear at the Azure DNS name servers.

Once the record set contains the desired collection of records, it needs to be committed using the Set-AzureRmDnsRecordSet cmdlet, which replaces the existing record set in Azure DNS with the record set provided.
The following examples show how to create a record set of each record type containing a single record.

### Create A record set with single record

	PS C:\> $rs = New-AzureRmDnsRecordSet -Name "test-a" -RecordType A -Ttl 60 -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup 
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
 
