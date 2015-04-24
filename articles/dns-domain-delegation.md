<properties 
   pageTitle="Delegate your domain to Azure DNS" 
   description="Delegate your domain to Azure DNS" 
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


#Delegate Domain to Azure DNS 


DNS delegation requires to have your DNS zone created to get the NS records to change in the registrar. The name servers assigned to your DNS zone on Azure DNS will replace the current value for the name servers of your domain in the registrar. 



##Getting the NS records for your DNS zone

Using powershell, query the DNS zone for the RecordSets created for it:


	PS C:\> Get-AzureDnsRecordSet -ResourceGroupName MyResourceGroup -ZoneName contoso.com -RecordType "NS"


	Name              : @
	ZoneName          : contoso.com
	ResourceGroupName : MyResourceGroup
	Ttl               : 3600
	Etag              : 5fe92e48-cc76-4912-a78c-7652d362ca18
	RecordType        : NS
	Records           : {edge1.azuredns-cloud.net, edge2.azuredns-cloud.net, edge3.azuredns-cloud.net,
                      edge4.azuredns-cloud.net}
	Tags              : {}


The NS values in this example are specific for this zone. When creating your own DNS zone, you will need to query the NS records to get which name servers will be responsible for your DNS zone.

Each registrar have their own DNS management tools to change the name server records for Azure DNS. In the registrar DNS management page, edit the NS records and replace the NS records for the ones on Azure DNS created.

After those steps are done, your domain will be delegated to Azure DNS for name resolution.

>[AZURE.NOTE] The time to live (TTL) for the NS record  defines how much time the record will be cached on DNS servers.The domain delegation might take some time to show in place because of the cached record haven't expired on the DNS server which queried the domain before. As a best practice, you can reduce the TTL for the NS record so the record expires faster and DNS server will have to query for the new updated NS records. After transitioning to Azure DNS, you can increase the TTL for the record to be cached longer to any DNS server which queries your domain.
##See Also 
[Traffic Manager Overview](traffic-manmager-overview.md)

