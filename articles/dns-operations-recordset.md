<properties 
   pageTitle="Manage DNS record sets and records on Azure DNS" 
   description="Manage DNS record sets and records on Azure DNS" 
   services="virtual-network" 
   documentationCenter="dev-center-name" 
   authors="joaoma" 
   manager="Adinah" 
   editor=""/>

<tags
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="04/24/2015"
   ms.author="joaoma"/>


#Manage DNS record sets and records on Azure DNS

After having your DNS zone created, it will be time to add record sets and resource records for it.

Record sets are a collection of values for a specific record type. In DNS terms we create resource records with a name and type. In Azure DNS, we first define the name you want to be of the record and the type of record it will be by using a record set.
<BR>
For example: When creating a 'www' record for contoso.com, first it's created a record set named 'www' and define what record type that record set will be. in this case we tell the record set is of record type "A". This record set 'www' will then take IPv4 addresses to resolve 'www.contoso.com'. 
<BR>
<BR>
<If we define a record set of record type 'CNAME', in the example above, instead of record set 'www' taking a value of IPv4, the value this record set will take would be an alias like 'webserver.cloudapp.net'.Anyone who queries 'www.contoso.com' will be sent to 'webserver.cloudapp.net'.

>[AZURE.NOTE]keep in mind: when using DNS zone cmdlets, the switch -Name referred to the DNS Zone. Using Powershell cmdlets for record sets and records, -Name will refer to the relative name or record set name, while -Zonename will be the DNS Zone you are operating for record sets PowerShell cmdlets.


How to create Record sets and records for each record type:

When creating a host record type www for domain contoso.com, that record being a CNAME will refer to another name which could be contoso.cloudapp.net. 


We will split the operations based on the record type 



New-AzureDnsRecordSet -Name "<relativeName>" -Zone $zone -RecordType "<type>" -Ttl 60 -Tag $tags [-Overwrite] [-Force]
•	Purpose: Create an empty RecordSet object
•	Returns: DnsRecordSet object
•	Can pass in Zone object either as a parameter or via pipe
•	Fails if RecordSet already exists, unless '-Overwrite' is specified.
•	Overwrite triggers an 'Are you sure?' prompt, unless '-Force' is specified
New-AzureDnsRecordSet -Name "<relativeName>" -ZoneName "<zoneName>" -ResourceGroupName "<resourceGroupName>" -recordType "<type>" -Ttl 60 -Tag $tags [-Overwrite] [-Force]
•	As above, except specifying zone via zone name and resource group name instead of passing zone object
Get-AzureDnsRecordSet [-Name "<relativeName>"] -Zone $zone [-RecordType "<type>"]
•	Purpose: Get a record set or array of record sets
•	Returns: If -Name and -RecordType are specified, returns an individual DnsRecordSet object.  Otherwise, an array of DnsRecordSet objects matching parameters passed
•	Can either pass in Zone object as a parameter or via pipe
•	Not supported yet: Specifying name but not type
Get-AzureDnsRecordSet [-Name "<relativeName>"] -ZoneName "<zoneName>" -ResourceGroupName "<resourceGroupName>" [-recordType "<type>"]
•	As above, except specifying zone via zone name and resource group name instead of passing zone object
Add-AzureDnsRecordConfig -RecordSet $recordSet <various type-specific parameters go here—see examples>
•	Purpose: Add a record to an existing DnsRecordSet object
•	Returns modified DnsRecordSet object
•	This is an offline operation--need to call 'Set' afterwards to update server
•	Can either pass in DnsRecordSet object as a parameter or via pipe
•	Type-specific parameters, with type-specific error messages if used incorrectly--see examples
•	Will get server error on subsequent 'Set' if trying to create duplicate records
•	SOA not supported
•	Error if trying to create record set with 2 records and recordType is CNAME
Remove-AzureDnsRecordConfig -RecordSet $recordSet <various type-specific parameters here—see examples>
•	Purpose: Removes a record from an existing DnsRecordSet object
•	Returns modified DnsRecordSet object
•	This is an offline operation--need to call 'Set' afterwards to update server
•	Can either pass in DnsRecordSet object as a parameter or via pipe
•	Type-specific parameters, with type-specific error messages if used incorrectly--see example
•	Remove must be exact match (all parameters match existing record), else error
•	SOA not supported
Set-AzureDnsRecordSet -RecordSet $recordSet [-IgnoreEtag]
•	Purpose: Saves a modified the record set back to the server
•	Returns DnsRecordSet object
•	Can either pass in DnsRecordSet object as a parameter or via pipe
•	Fails if Etag has changed since New/Get, unless -IgnoreEtag is specified
Remove-AzureDnsRecordSet -RecordSet $recordSet [-Force] [-IgnoreEtag]
