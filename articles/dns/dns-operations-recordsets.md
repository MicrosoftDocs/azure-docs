<properties
   pageTitle="Manage DNS record sets and records by using the Azure portal| Microsoft Azure"
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
   ms.date="05/06/2016"
   ms.author="cherylmc"/>

# Manage DNS records and record sets by using PowerShell



> [AZURE.SELECTOR]
- [Azure Portal](dns-operations-recordsets-portal.md)
- [Azure CLI](dns-operations-recordsets-cli.md)
- [PowerShell](dns-operations-recordsets.md)



This article shows you how to manage record sets and records for your DNS zone by using Windows PowerShell.

It's important to understand the difference between DNS record sets and individual DNS records. A record set is the collection of records in a zone that have the same name and are the same type. For more information, see [Create DNS record sets and records by using the Azure portal](dns-getstarted-create-recordset-portal.md).

To manage your record sets and records, you need the latest version of the Azure Resource Manager PowerShell cmdlets. For more information, see [How to install and configure Azure PowerShell](../powershell-install-configure.md). For more information about working with PowerShell, see [Using Azure PowerShell with Azure Resource Manager](../powershell-azure-resource-manager.md).



## Create a new record set and a record

To create a record set by using PowerShell, see [Create DNS record sets and records by using PowerShell](dns-getstarted-create-recordset.md).

## Get a record set

To retrieve an existing record set, use `Get-AzureRmDnsRecordSet`. Specify the record set relative name, the record type, and the zone.

	$rs = Get-AzureRmDnsRecordSet –Name www –RecordType A -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup

As with `New-AzureRmDnsRecordSet`, the record name must be a relative name, meaining it must exclude the zone name.

You can specify the zone can by using either the zone name and resource group name, or by using a zone object:

	$zone = Get-AzureRmDnsZone -Name contoso.com -ResouceGroupName MyAzureResourceGroup
	$rs = Get-AzureRmDnsRecordSet -Name www –RecordType A -Zone $zone

`Get-AzureRmDnsRecordSet` returns a local object that represents the record set that was created in Azure DNS.

## List record sets

You can also use`Get-AzureRmDnsRecordSet` to list record sets if you omit the *–Name* and/or *–RecordType* parameters.

### To list all record sets

This example returns all record sets, regardless of name or record type:

	$list = Get-AzureRmDnsRecordSet -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup

### To list record sets of a given record type

This example returns all record sets that match the given record type. In this case, the record set that is returned is "A" records:

	$list = Get-AzureRmDnsRecordSet –RecordType A -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup

The zone can be specified by using either the *–ZoneName* and *–ResourceGroupName* parameters (as shown), or by specifying a zone object:

	$zone = Get-AzureRmDnsZone -Name contoso.com -ResouceGroupName MyAzureResourceGroup
	$list = Get-AzureRmDnsRecordSet -Zone $zone

## Add a record to a record set

You add records to record sets by using the `Add-AzureRmDnsRecordConfig` cmdlet. This is an offline operation. Only the local object that represents the record set is changed.

The parameters for adding records to a record set vary depending on the type of the record set. For example, when using a record set of type "A", you can only specify records with the parameter *-IPv4Address*.

Additional records can be added to each record set by additional calls to `Add-AzureRmDnsRecordConfig`. You can add up to 20 records to any record set. However, record sets of type "CNAME" can contain at most one record, and a record set cannot contain two identical records. Empty record sets (with zero records) can be created, but do not appear on the Azure DNS name servers.

After the record set contains the desired collection of records, you need to commit it by using the `Set-AzureRmDnsRecordSet` cmdlet. After a record set has been committed, it replaces the existing record set in Azure DNS.

### To create an A record set with a single record

	$rs = New-AzureRmDnsRecordSet -Name "test-a" -RecordType A -Ttl 60 -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup
	Add-AzureRmDnsRecordConfig -RecordSet $rs -Ipv4Address "1.2.3.4"
	Set-AzureRmDnsRecordSet -RecordSet $rs

The sequence of operations to create a record can also be *piped*, meaning you pass the record set object by using the pipe rather than passing it as a parameter. For example:

	New-AzureRmDnsRecordSet -Name "test-a" -RecordType A -Ttl 60 -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup | Add-AzureRmDnsRecordConfig -Ipv4Address "1.2.3.4" | Set-AzureRmDnsRecordSet

### Additional record type examples

[AZURE.INCLUDE [dns-add-record-ps-include](../../includes/dns-add-record-ps-include.md)]

## Modify existing record sets

The steps for modifying an existing record set are similar to the steps you take when creating records. The sequence of operations is as follows:

1.	Retrieve the existing record set by using `Get-AzureRmDnsRecordSet`.

2.	Modify the record set by either adding records, removing records, changing the record parameters, or changing the record set time to live (TTL). This is an offline operation. Only the local object that represents the record set is changed.

3.	Commit your changes by using the `Set-AzureRmDnsRecordSet` cmdlet. This replaces the existing record set in Azure DNS.


### To update a record in an existing record set

In this example, we change the IP address of an existing "A" record:

	$rs = Get-AzureRmDnsRecordSet -name "test-a" -RecordType A -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup
	$rs.Records[0].Ipv4Address = "134.170.185.46"
	Set-AzureRmDnsRecordSet -RecordSet $rs

The `Set-AzureRmDnsRecordSet` cmdlet uses etag checks to ensure that concurrent changes are not overwritten. Use the *-Overwrite* flag to suppress these checks. For more information, see [About etags and tags](dns-getstarted-create-dnszone.md#tagetag).

### To modify an SOA record

You cannot add or remove records from the automatically-created SOA record set at the zone apex (name = "@"). However, you can modify any of the parameters within the SOA record (except "Host") and the record set TTL.

The following example shows how to change the *Email* property of the SOA record:

	$rs = Get-AzureRmDnsRecordSet -Name "@" -RecordType SOA -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup
	$rs.Records[0].Email = "admin.contoso.com"
	Set-AzureRmDnsRecordSet -RecordSet $rs

### To modify NS records at the zone apex

You cannot add to, remove, or modify the records in the automatically-created NS record set at the zone apex (name = "@"). The only change that's permitted is to modify the record set TTL.

The following example shows how to change the TTL property of the NS record set:

	$rs = Get-AzureRmDnsRecordSet -Name "@" -RecordType NS -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup
	$rs.Ttl = 300
	Set-AzureRmDnsRecordSet -RecordSet $rs

### To add records to an existing record set

In this example, we add two additional MX records to the existing record set:

	$rs = Get-AzureRmDnsRecordSet -name "test-mx" -RecordType MX -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup
	Add-AzureRmDnsRecordConfig -RecordSet $rs -Exchange "mail2.contoso.com" -Preference 10
	Add-AzureRmDnsRecordConfig -RecordSet $rs -Exchange "mail3.contoso.com" -Preference 20
	Set-AzureRmDnsRecordSet -RecordSet $rs

## Remove a record from an existing record set

Records can be removed from a record set by using `Remove-AzureRmDnsRecordConfig`. Note that the record that's being removed must be an exact match with an existing record across all parameters. Changes must be committed by using `Set-AzureRmDnsRecordSet`.

Removing the last record from a record set does not delete the record set. See [Delete a record set](#delete-a-record-set) below for more information.


	$rs = Get-AzureRmDnsRecordSet -Name "test-a" -RecordType A -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup
	Remove-AzureRmDnsRecordConfig -RecordSet $rs -Ipv4Address "1.2.3.4"
	Set-AzureRmDnsRecordSet -RecordSet $rs

The sequence of operations to remove a record from a record set can also be piped, meaning you pass the record set object by using the pipe rather than passing it as a parameter. For example:

	Get-AzureRmDnsRecordSet -Name "test-a" -RecordType A -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup | Remove-AzureRmDnsRecordConfig -Ipv4Address "1.2.3.4" | Set-AzureRmDnsRecordSet

### Remove an AAAA record from a record set

	$rs = Get-AzureRmDnsRecordSet -Name "test-aaaa" -RecordType AAAA -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup
	Remove-AzureRmDnsRecordConfig -RecordSet $rs -Ipv6Address "2607:f8b0:4009:1803::1005"
	Set-AzureRmDnsRecordSet -RecordSet $rs

### Remove a CNAME record from a record set

Because a CNAME record set can contain at most one record, removing that record leaves an empty record set.

	$rs =  Get-AzureRmDnsRecordSet -name "test-cname" -RecordType CNAME -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup
	Remove-AzureRmDnsRecordConfig -RecordSet $rs -Cname "www.contoso.com"
	Set-AzureRmDnsRecordSet -RecordSet $rs

### Remove an MX record from a record set

	$rs = Get-AzureRmDnsRecordSet -name "test-mx" -RecordType MX -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup
	Remove-AzureRmDnsRecordConfig -RecordSet $rs -Exchange "mail.contoso.com" -Preference 5
	Set-AzureRmDnsRecordSet -RecordSet $rs

### Remove an NS record from record set

	$rs = Get-AzureRmDnsRecordSet -Name "test-ns" -RecordType NS -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup
	Remove-AzureRmDnsRecordConfig -RecordSet $rs -Nsdname "ns1.contoso.com"
	Set-AzureRmDnsRecordSet -RecordSet $rs

### Remove an SRV record from a record set

	$rs = Get-AzureRmDnsRecordSet -Name "_sip._tls" -RecordType SRV -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup
	Remove-AzureRmDnsRecordConfig -RecordSet $rs –Priority 0 –Weight 5 –Port 8080 –Target "sip.contoso.com"
	Set-AzureRmDnsRecordSet -RecordSet $rs

### Remove a TXT record from a record set

	$rs = Get-AzureRmDnsRecordSet -Name "test-txt" -RecordType TXT -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup
	Remove-AzureRmDnsRecordConfig -RecordSet $rs -Value "This is a TXT record"
	Set-AzureRmDnsRecordSet -RecordSet $rs

## Delete a record set

Record sets can be deleted by using the `Remove-AzureRmDnsRecordSet` cmdlet. You cannot delete the SOA and NS record sets at the zone apex (name = "@") that were created automatically when the zone was created. They will be deleted automatically if the zone is deleted.

Use one of the following three methods to remove a record set:

### Specify all the parameters by name

The optional *-Force* switch can be used to suppress the confirmation prompt.

	Remove-AzureRmDnsRecordSet -Name "test-a" -RecordType A -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup [-Force]


### Specify the record set by name and type, and specify the zone by object

	$zone = Get-AzureRmDnsZone -Name contoso.com -ResourceGroupName MyAzureResourceGroup
	Remove-AzureRmDnsRecordSet -Name "test-a" -RecordType A -Zone $zone [-Force]

### Specify the record set by object

	$rs = Get-AzureRmDnsRecordSet -Name "test-a" -RecordType A -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup
	Remove-AzureRmDnsRecordSet –RecordSet $rs [-Overwrite] [-Force]

When you specify the record set by using an object, it enables etag checks to ensure that concurrent changes are not deleted. The optional *-Overwrite* flag suppresses these checks. See [Etags and tags](dns-getstarted-create-dnszone.md#tagetag) for more information.

The record set object can also be piped instead of being passed as a parameter:

	Get-AzureRmDnsRecordSet -Name "test-a" -RecordType A -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup | Remove-AzureRmDnsRecordSet [-Overwrite] [-Force]

## Next steps

For more information about Azure DNS, see [Azure DNS overview](dns-overview.md). For information about automating DNS, see [Creating DNS zones and record sets using the .NET SDK](dns-sdk.md).

For more information about reverse DNS records, see [How to manage reverse DNS records for your services using PowerShell](dns-reverse-dns-record-operations-ps.md).
