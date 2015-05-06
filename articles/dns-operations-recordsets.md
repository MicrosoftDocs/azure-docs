<properties 
   pageTitle="Manage DNS record sets and records on Azure DNS | Microsoft Azure" 
   description="Managing DNS record sets and records on Azure DNS when hosting your domain on Azure DNS. All PowerShell commands for operations on record sets and records." 
   services="dns" 
   documentationCenter="na" 
   authors="joaoma" 
   manager="Adinah" 
   editor=""/>

<tags
   ms.service="dns"
   ms.devlang="en"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="05/01/2015"
   ms.author="joaoma"/>

# How to manage DNS records

This guide will show how to manage record sets and records for your DNS zone.

It is important to understand the distinction between DNS record sets and individual DNS records.  A record set is the collection of records in a zone with the same name and the same type.  For more details, see [Understanding record sets and records](../dns-getstarted-create-recordset#Understanding-record-sets-and-records).

## Create a record set

Record sets are created using the New-AzureDnsRecordSet cmdlet.  You need to specify the record set name, the zone, the Time-to-Live (TTL) and the record type.

>[AZURE.NOTE] The record set name must be a relative name, excluding the zone name.  For example, the record set name ‘www’ in zone ‘contoso.com’ will create a record set with the fully-qualified name ‘www.contoso.com’.

Azure DNS supports the following record types: A, AAAA, CNAME, MX, NS, SOA, SRV, TXT.  Record sets of type SOA are created automatically with each zone, they cannot be created separately.

	PS C:\> $rs = New-AzureDnsRecordSet -Name www -Zone $zone -RecordType A -Ttl 300 [-Tag $tags] [-Overwrite] [-Force]

If a record set already exists, the command will fail unless the -Overwrite switch is used.  The ‘-Overwrite’ option will trigger a confirmation prompt, which can be suppressed using the -Force switch.

In the above example, the zone is specified using a zone object, as returned by Get-AzureDnsZone or New-AzureDnsZone. Alternatively, you can also specify the zone by zone name and resource group name:

	PS C:\> $rs = New-AzureDnsRecordSet -Name www –ZoneName contoso.com –ResourceGroupName MyAzureResourceGroup -RecordType A -Ttl 300 [-Tag $tags] [-Overwrite] [-Force]

New-AzureDnsRecordSet returns a local object representing the record set created in Azure DNS.

>[AZURE.NOTE] CNAME record sets cannot co-exist with other record sets with the same name.  For example, you cannot create a CNAME with the relative name ‘www’ and an A record with the relative name ‘www’ at the same time.  Since the zone apex (name = ‘@’) always contains the NS and SOA record sets created when the zone is created, this means you cannot create a CNAME record set at the zone apex.  These constraints arise from the DNS standards, they are not limitations of Azure DNS.

## Get a record set
To retrieve an existing record set, use ‘Get-AzureDnsRecordSet’, specifying the record set relative name, the record type, and the zone:

	PS C:\> $rs = Get-AzureDnsRecordSet -Name www –RecordType A -Zone $zone

As with New-AzureDnsRecordSet, the record name must be a relative name, i.e. excluding the zone name.  The zone can be specified using either a zone object (as above) or by zone name and resource group name:

	PS C:\> $rs = Get-AzureDnsRecordSet –Name www –RecordType A -Zonename contoso.com -ResourceGroupName MyAzureResourceGroup

Get-AzureDnsRecordSet returns a local object representing the record set created in Azure DNS.

## List record sets
By omitting the –Name and/or –RecordType parameters, Get-AzureDnsRecordSet can also be used to list record sets:

### Option 1 
List all record sets.  This will return all record sets, regardless of name or record type:

	PS C:\> $list = Get-AzureDnsRecordSet -Zone $zone
### Option 2 

List record sets of a given record type.  This will return all record sets matching the given record type (in this case, A records):

	PS C:\> $list = Get-AzureDnsRecordSet –RecordType A -Zone $zone 

In both cases above, the zone can be specified using either a zone object (as shown) or by specifying the –ZoneName and –ResourceGroupName parameters.

## Add a record to a record set
Records are added to record sets using the Add-AzureDnsRecordConfig cmdlet. This is an off-line operation—only the local object representing the record set is changed.

The parameters for adding records to a record set vary depending on the type of the record set. For example, when using a record set of type 'A' you will only be able to specify records with the parameter ‘IPv4Address’.

Additional records can be added to each record set by additional calls to Add-AzureDnsRecordConfig.  You can add up to 100 records to any record set.  However, record sets of type CNAME can contain at most 1 record, and a record set cannot contain two identical records.  Empty record sets (with zero records) can be created, but do not appear at the Azure DNS name servers.

Once the record set contains the desired collection of records, it needs to be committed using the Set-AzureDnsRecordSet cmdlet, which replaces the existing record set in Azure DNS with the record set provided.
The following examples show how to create a record set of each record type containing a single record.

### Create A record set with single record

	PS C:\> $rs = New-AzureDnsRecordSet -Name "test-a" -RecordType A -Zone $zone -Ttl 60
	PS C:\> Add-AzureDnsRecordConfig -RecordSet $rs -Ipv4Address "1.2.3.4"
	PS C:\> Set-AzureDnsRecordSet -RecordSet $rs

The sequence of operations to create a record can also be ‘piped’, passing the record set object using the pipe rather than as a parameter.  For example:

	PS C:\> New-AzureDnsRecordSet -Name "test-a" -RecordType A -Zone $zone -Ttl 60 | Add-AzureDnsRecordConfig -Ipv4Address "1.2.3.4" | Set-AzureDnsRecordSet

### Create AAAA record set with single record

	PS C:\> $rs = New-AzureDnsRecordSet -Name "test-aaaa" -RecordType AAAA -Zone $zone -Ttl 60
	PS C:\> Add-AzureDnsRecordConfig -RecordSet $rs -Ipv6Address "2607:f8b0:4009:1803::1005"
	PS C:\> Set-AzureDnsRecordSet -RecordSet $rs

### Create CNAME record set with single record

	PS C:\> $rs = New-AzureDnsRecordSet -Name "test-cname" -RecordType CNAME -Zone $zone -Ttl 60
	PS C:\> Add-AzureDnsRecordConfig -RecordSet $rs -Cname "www.contoso.com"
	PS C:\> Set-AzureDnsRecordSet -RecordSet $rs

### Create MX record set with single record

	PS C:\> $rs = New-AzureDnsRecordSet -Name "test-mx" -RecordType MX -Zone $zone -Ttl 60
	PS C:\> Add-AzureDnsRecordConfig -RecordSet $rs -Exchange "mail.contoso.com" -Preference 5
	PS C:\> Set-AzureDnsRecordSet -RecordSet $rs

### Create NS record set with single record

	PS C:\> $rs = New-AzureDnsRecordSet -Name "test-ns" -RecordType NS -Zone $zone -Ttl 60
	PS C:\> Add-AzureDnsRecordConfig -RecordSet $rs -Nsdname "ns1.contoso.com"
	PS C:\> Set-AzureDnsRecordSet -RecordSet $rs
### Create SRV record set with single record

If creating an SRV record in root of zone, just specify _service and _protocol in the record name—there is no need to also include ‘.@’ in the record name

	PS C:\> $rs = New-AzureDnsRecordSet -Name "_sip._tls" -RecordType SRV -Zone $zone -Ttl 60
	PS C:\> Add-AzureDnsRecordConfig -RecordSet $rs –Priority 0 –Weight 5 –Port 8080 –Target "sip.contoso.com"
	PS C:\> Set-AzureDnsRecordSet -RecordSet $rs

### Create TXT record set with single record

	PS C:\> $rs = New-AzureDnsRecordSet -Name "test-txt" -RecordType TXT -Zone $zone -Ttl 60
	PS C:\> Add-AzureDnsRecordConfig -RecordSet $rs -Value "This is a TXT record"
	PS C:\> Set-AzureDnsRecordSet -RecordSet $rs

## Modifying existing record sets
Modifying existing record sets follows a similar pattern to creating records.  The sequence of operations is as follows:

1.	Retrieve the existing record set using Get-AzureDnsRecordSet.
2.	Modify the record set, by either adding records, removing records, changing the record parameters or changing the record set TTL.  These changes are off-line—only the local object representing the record set is changed.
3.	Commit your changes using the Set-AzureDnsRecordSet cmdlet.  This replaces the existing record set in Azure DNS with the record set provided.

This is shown by the following examples:

### Update a record in an existing record set
For this example we will change the IP address of an existing A record:

	PS C:\> $rs = Get-AzureDnsRecordSet -name "test-a" -RecordType A -Zone $zone 
	PS C:\> $rs.Records[0].Ipv4Address = "134.170.185.46"
	PS C:\> Set-AzureDnsRecordSet -RecordSet $rs 

The Set-AzureDnsRecordSet cmdlet uses ‘etag’ checks to ensure concurrent changes are not overwritten.  Use the ‘-Overwrite’ flag to suppress these checks.  See Etags and Tags for more information.

### Modify SOA record

>[AZURE.NOTE] You cannot add or remove records from the automatically-created SOA record set at the zone apex (name = ‘@’), but you can modify the parameters within the SOA record and the record set TTL.

The following example shows how to change the ‘Email’ property of the SOA record:

	PS C:\> $rs = Get-AzureDnsRecordSet -Name "@" -RecordType SOA -Zone $zone
	PS C:\> $rs.Records[0].Email = "admin.contoso.com"
	PS C:\> Set-AzureDnsRecordSet -RecordSet $rs 

### Modify NS records at zone apex

>[AZURE.NOTE] You cannot add to, remove or modify the records in the automatically-created NS record set at the zone apex (name = ‘@’).  The only change permitted is to modify the record set TTL.

The following example shows how to change the TTL property of the NS record set:

	PS C:\> $rs = Get-AzureDnsRecordSet -Name "@" -RecordType NS -Zone $zone
	PS C:\> $rs.Ttl = 300
	PS C:\> Set-AzureDnsRecordSet -RecordSet $rs 

### Add records to an existing record set
In this example we add two additional MX records to the existing record set:

	PS C:\> $rs = Get-AzureDnsRecordSet -name "test-mx" -RecordType MX -Zone $zone
	PS C:\> Add-AzureDnsRecordConfig -RecordSet $rs -Exchange "mail2.contoso.com" -Preference 10
	PS C:\> Add-AzureDnsRecordConfig -RecordSet $rs -Exchange "mail3.contoso.com" -Preference 20
	PS C:\> Set-AzureDnsRecordSet -RecordSet $rs 

## Remove a record from an existing record set

Records can be removed from a record set using Remove-AzureDnsRecordConfig.  Note that the record being removed must be an exact match with an existing record, across all parameters.  Changes must be committed using Set-AzureDnsRecordSet.

Removing the last record from a record set does not delete the record set.  See [Delete a record set](#delete-a-record-set) below for more.


	PS C:\> $rs = Get-AzureDnsRecordSet -Name "test-a" -RecordType A –Zone $zone
	PS C:\> Remove-AzureDnsRecordConfig -RecordSet $rs -Ipv4Address "1.2.3.4"
	PS C:\> Set-AzureDnsRecordSet -RecordSet $rs

The sequence of operations to remove a record from a record set can also be ‘piped’, passing the record set object using the pipe rather than as a parameter.  For example:

	PS C:\> Get-AzureDnsRecordSet -Name "test-a" -RecordType A -Zone $zone | Remove-AzureDnsRecordConfig -Ipv4Address "1.2.3.4" | Set-AzureDnsRecordSet
### Remove AAAA record from a record set

	PS C:\> $rs = Get-AzureDnsRecordSet -Name "test-aaaa" -RecordType AAAA –Zone $zone
	PS C:\> Remove-AzureDnsRecordConfig -RecordSet $rs -Ipv6Address "2607:f8b0:4009:1803::1005"
	PS C:\> Set-AzureDnsRecordSet -RecordSet $rs

### Remove CNAME record from a record set

Since a CNAME record set can contain at most one record, removing that record will leave an empty record set.

	PS C:\> $rs =  Get-AzureDnsRecordSet -name "test-cname" -RecordType CNAME –Zone $zone	
	PS C:\> Remove-AzureDnsRecordConfig -RecordSet $rs -Cname "www.contoso.com"
	PS C:\> Set-AzureDnsRecordSet -RecordSet $rs

### Remove MX record from a record set

	PS C:\> $rs = Get-AzureDnsRecordSet -name "test-mx" -RecordType 'MX' –Zone $zone	
	PS C:\> Remove-AzureDnsRecordConfig -RecordSet $rs -Exchange "mail.contoso.com" -Preference 5
	PS C:\> Set-AzureDnsRecordSet -RecordSet $rs

### Remove NS record from record set
	
	PS C:\> $rs = Get-AzureDnsRecordSet -Name "test-ns" -RecordType NS -Zone $zone
	PS C:\> Remove-AzureDnsRecordConfig -RecordSet $rs -Nsdname "ns1.contoso.com"
	PS C:\> Set-AzureDnsRecordSet -RecordSet $rs

### Remove SRV record from a record set

	PS C:\> $rs = Get-AzureDnsRecordSet -Name "_sip._tls" -RecordType SRV -Zone $zone
	PS C:\> Remove-AzureDnsRecordConfig -RecordSet $rs –Priority 0 –Weight 5 –Port 8080 –Target "sip.contoso.com"
	PS C:\> Set-AzureDnsRecordSet -RecordSet $rs

### Remove TXT record from a record set

	PS C:\> $rs = Get-AzureDnsRecordSet -Name "test-txt" -RecordType TXT -Zone $zone
	PS C:\> Remove-AzureDnsRecordConfig -RecordSet $rs -Value "This is a TXT record"
	PS C:\> Set-AzureDnsRecordSet -RecordSet $rs

## Delete a record set
Record sets can be deleted using the Remove-AzureDnsRecordSet cmdlet.

>[AZURE.NOTE] You cannot delete the SOA and NS record sets at the zone apex (name = ‘@’) that are created automatically when the zone is created.  They will be deleted automatically when deleting the zone.

Use one of the following three ways to remove a record set:
### Option 1
Specify the all parameters by name:

	PS C:\> Remove-AzureDnsRecordSet -Name "test-a" -RecordType A -Zonename "contoso.com" -ResourceGroupName MyAzureResourceGroup [-Force]
The optional ‘-Force’ switch can be used to suppress the confirmation prompt.

### Option 2
Specify the record set by name and type, specify the zone by object:

	PS C:\> Remove-AzureDnsRecordSet -Name "test-a" -RecordType A -Zone $zone [-Force]

### Option 3
Specify the record set by object:

	PS C:\> Remove-AzureDnsRecordSet –RecordSet $rs [-Overwrite] [-Force]

Specifying the record set using an object enables ‘etag’ checks to ensure concurrent changes are not deleted.  The optional ‘-Overwrite’ flag suppresses these checks. See [Etags and tags](../dns-getstarted-create-dnszone#Etags-and-tags) for more information.

The record set object can also be piped instead of being passed as a parameter:

	PS C:\> Get-AzureDnsRecordSet -Name "test-a" -RecordType A -Zone $zone | Remove-AzureDnsRecordSet [-Overwrite] [-Force]

##See Also

[Get started creating record sets and records](../dns-getstarted-create-record)<BR>
[Perform operations on DNS zones](../dns-operations-dnszones)<BR>
[Automate operations using .NET SDK](../dns-sdk)