<properties 
   pageTitle="Create a RecordSet and Records in Azure DNS  " 
   description="Create  DNS RecordSets and Records in Azure DNS" 
   services="virtual-network" 
   documentationCenter="na" 
   authors="joaoma" 
   manager="Adinah" 
   editor=""/>

<tags
   ms.service="virtual-network"
   ms.devlang="en"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="04/23/2015"
   ms.author="joaoma"/>


#Create a RecordSet and Resource Records for a DNS Zone

After creating your DNS Zone, you need to add the record sets and resource records for the hosts you want to have the names resolved for your domain.


##Understanding record sets and records
Record set will be name of the host record you are adding to your DNS zone and a collection of specific record type.For example, we create a "www" record set of type "A" record for DNS zone 'contoso.com' which allow IPv4 values like "65.55.39.10".

When browsing to 'www.contoso.com' the IP address resolving it would be '65.55.39.10.

If you want another IP address to also resolve "www.contoso.com" , you will just add another IPv4 value to the "www" record set.  


##Step by step creating record sets and records

In the following example we will show how to create a record set and records:


Step 1. Create record set for the DNS Zone and define the record type for it:
and assign to a variable $rs:

	PS C:\$rs=New-AzureDnsRecordSet -Name "www" -RecordType "A" -ZoneName "contoso.com" -ResourceGroupName "MyAzureResourceGroup" -Ttl 60 

The record set 'www' was created in zone 'contoso.com'.<BR>
The record set is empty and we have to add records to be able to use the newly create "www" record set.<BR>

Step 2. Add IPv4 A records to the "www" record set using the $rs variable assigned when created record set on step 1: 

	PS C:\>Add-AzureDnsRecordConfig -RecordSet $rs -Ipv4Address "65.55.39.10"

Commit the changes to the record set after adding the record:

	Set-AzureDnsRecordSet -RecordSet $rs

You can review the DNS Zone, record set and records using Get-AzureDnsRecordSet:

	PS C:\logs> Get-AzureDnsRecordSet -ResourceGroupName Azuredns -ZoneName contoso.com


	Name              : @
	ZoneName          : contoso.com
	ResourceGroupName : MyResourceGroup
	Ttl               : 3600
	Etag              : 2b855de1-5c7e-4038-bfff-3a9e55b49caf
	RecordType        : SOA
	Records           : {[edge1.azuredns-cloud.net,msnhst.microsoft.com,900,300,604800,300]}
	Tags              : {}

	Name              : @
	ZoneName          : contoso.com
	ResourceGroupName : MyResourceGroup
	Ttl               : 3600
	Etag              : 5fe92e48-cc76-4912-a78c-7652d362ca18
	RecordType        : NS
	Records           : {edge1.azuredns-cloud.net, edge2.azuredns-cloud.net, edge3.azuredns-cloud.net,
                    edge4.azuredns-cloud.net}
	Tags              : {}


	Name              : www
	ZoneName          : contoso.com
	ResourceGroupName : MyResourceGroup
	Ttl               : 60
	Etag              : f8403f6c-611e-4e08-acce-939de90c4d34
	RecordType        : A
	Records           : {65.55.39.10}
	Tags              : {}


You can now use nslookup or other DNS tool to query the new record set:

To test the new record, you can query directly the name server for the DNS zone.

	c:\Nslookup
	> server edge1.azuredns-cloud.net
	Default Server:  edge1.azuredns-cloud.n
	Address:  204.14.181.10

	> www.contoso.com
	Server:  edge1.azuredns-cloud.net
	Address:  204.14.181.10

	Name:    www.contoso.com
	Addresses:  65.55.39.10
