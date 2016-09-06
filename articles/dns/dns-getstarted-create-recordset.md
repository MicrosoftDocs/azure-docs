<properties
   pageTitle="Create a record set and records for a DNS zone using PowerShell | Microsoft Azure"
   description="How to create host records for Azure DNS.Setting up record sets and records using PowerShell"
   services="dns"
   documentationCenter="na"
   authors="cherylmc"
   manager="carmonm"
   editor=""/>

<tags
   ms.service="dns"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="05/06/2016"
   ms.author="cherylmc"/>



# Create DNS record sets and records by using PowerShell


> [AZURE.SELECTOR]
- [Azure Portal](dns-getstarted-create-recordset-portal.md)
- [PowerShell](dns-getstarted-create-recordset.md)
- [Azure CLI](dns-getstarted-create-recordset-cli.md)

This article walks you through the process of creating records and records sets by using Windows PowerShell. After creating your DNS zone, you add the DNS records for your domain. To do this, you first need to understand DNS records and record sets.

[AZURE.INCLUDE [dns-about-records-include](../../includes/dns-about-records-include.md)]

## Verify that you have the latest version of PowerShell

Verify that you have installed the latest version of the Azure Resource Manager PowerShell cmdlets. See [How to install and configure Azure PowerShell](../powershell-install-configure.md) for more information about installing the PowerShell cmdlets.

## Create a record set and record

This section describes how to create a record set and record.


### 1. Connect to your subscription

Open your PowerShell console and connect to your account. Use the following sample to help you connect:

	Login-AzureRmAccount

Check the subscriptions for the account.

	Get-AzureRmSubscription

Specify the subscription that you want to use.

	Select-AzureRmSubscription -SubscriptionName "Replace_with_your_subscription_name"

For more information about working with PowerShell, see [Using Windows PowerShell with Resource Manager](../powershell-azure-resource-manager.md).


### 2. Create a record set

You create record sets by using the `New-AzureRmDnsRecordSet` cmdlet. When creating a record set, you need to specify the record set name, the zone, the time to live (TTL), and the record type.

To create a record set in the apex of the zone (in this case, "contoso.com"), use the record name "@", including the quotation marks. This is a common DNS convention.

The following example creates a record set with the relative name "www" in the DNS Zone "contoso.com". The fully-qualified name of the record set is "www.contoso.com". The record type is "A", and the TTL is 60 seconds. After completing this step, you will have an empty "www" record set that is assigned to the variable *$rs*.

	$rs = New-AzureRmDnsRecordSet -Name "www" -RecordType "A" -ZoneName "contoso.com" -ResourceGroupName "MyAzureResourceGroup" -Ttl 60

#### If a record set already exists

If a record set already exists, the command fails unless the *-Overwrite* switch is used. The *-Overwrite* option triggers a confirmation prompt, which can be suppressed by using the *-Force* switch.


	$rs = New-AzureRmDnsRecordSet -Name www -RecordType A -Ttl 300 -ZoneName contoso.com -ResouceGroupName MyAzureResouceGroup [-Tag $tags] [-Overwrite] [-Force]


In this example, you specify the zone by using the zone name and resource group name. Alternatively, you can specify a zone object, as returned by `Get-AzureRmDnsZone` or `New-AzureRmDnsZone`.

	$zone = Get-AzureRmDnsZone -Name contoso.com –ResourceGroupName MyAzureResourceGroup
	$rs = New-AzureRmDnsRecordSet -Name www -RecordType A -Ttl 300 –Zone $zone [-Tag $tags] [-Overwrite] [-Force]

`New-AzureRmDnsRecordSet` returns a local object that represents the record set that was created in Azure DNS.

### 3. Add a record

To use the newly created "www" record set, you need to add records to it. You can add IPv4 *A* records to the "www" record set by using the following example. This example relies on the variable *$rs* that you set in the previous step.

Adding records to a record set by using `Add-AzureRmDnsRecordConfig` is an offline operation. Only the local variable *$rs* is updated.


	Add-AzureRmDnsRecordConfig -RecordSet $rs -Ipv4Address 134.170.185.46
	Add-AzureRmDnsRecordConfig -RecordSet $rs -Ipv4Address 134.170.188.221

### 4. Commit the changes

Commit the changes to the record set. Use `Set-AzureRmDnsRecordSet` to upload the changes to the record set to Azure DNS.

	Set-AzureRmDnsRecordSet -RecordSet $rs

### 5. Retrieve the record set

You can retrieve the record set from Azure DNS by using `Get-AzureRmDnsRecordSet` as shown in the following example.


	Get-AzureRmDnsRecordSet –Name www –RecordType A -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup


	Name              : www
	ZoneName          : contoso.com
	ResourceGroupName : MyAzureResourceGroup
	Ttl               : 3600
	Etag              : 68e78da2-4d74-413e-8c3d-331ca48246d9
	RecordType        : A
	Records           : {134.170.185.46, 134.170.188.221}
	Tags              : {}


You can also use the nslookup tool or other DNS tools to query the new record set.  

If you have not yet delegated the domain to the Azure DNS name servers, you need to explicitly specify the name, server, and address for your zone.


	nslookup www.contoso.com ns1-01.azure-dns.com

	Server: ns1-01.azure-dns.com
	Address:  208.76.47.1

	Name:    www.contoso.com
	Addresses:  134.170.185.46
    	        134.170.188.221

## Create a record set of each type with a single record


The following examples show how to create a record set of each record type. Each record set contains a single record.

[AZURE.INCLUDE [dns-add-record-ps-include](../../includes/dns-add-record-ps-include.md)]


## Next steps

[How to manage DNS zones using PowerShell](dns-operations-dnszones.md)

[Manage DNS records and record sets by using PowerShell](dns-operations-recordsets.md)

[Automate Azure operations with .NET SDK](dns-sdk.md)
