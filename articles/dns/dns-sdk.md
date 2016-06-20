<properties 
   pageTitle="Create DNS zones and record sets for Azure DNS using the .NET SDK | Microsoft Azure" 
   description="How to create DNS zones and record sets for Azure DNS by using the .NET SDK." 
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
   ms.date="05/10/2016"
   ms.author="cherylmc"/>


# Create DNS zones and record sets using the .NET SDK

You can automate operations to create, delete, or update DNS zones, record sets, and records by using DNS SDK with .NET DNS Management library. A full Visual Studio project is available [here.](http://download.microsoft.com/download/2/A/C/2AC64449-1747-49E9-B875-C71827890126/AzureDnsSDKExample_2015_05_05.zip)

## NuGet packages and namespace declarations

In order to use the DNS Client, you'll need to install the **Azure DNS Management Library** NuGet package and add the DNS management namespaces to your project.
 
1. In **Visual Studio**, open a project or new project. 

2. Go to **Tools** **>** **NuGet Package Manager** **>** **Package Manager Console**. 

3. Download the Azure DNS Management Library.

		using Microsoft.Azure;
		using Microsoft.Azure.Management.Dns;
		using Microsoft.Azure.Management.Dns.Models;

## Initialize the DNS management client

The *DnsManagementClient* contains the methods and properties necessary for managing DNS zones and recordsets. For the client to be able to access your subscription, you'll need to setup the correct permissions and generate an AWT token. See [Authenticating Azure Resource Manager requests](https://msdn.microsoft.com/library/azure/dn790557.aspx) for more details.

	// get a token for the AAD application (see the article link above for code)
	string jwt = GetAToken();

	// make the TokenCloudCredentials using subscription ID and token
	TokenCloudCredentials tcCreds = new TokenCloudCredentials(subID, jwt);

	// make the DNS management client
	DnsManagementClient dnsClient = new DnsManagementClient(tcCreds);

## Create or update a DNS zone

To create a DNS zone, a "Zone" object is created and passed to *dnsClient.Zones.CreateOrUpdate*. Because DNS zones are not linked to a specific region, the location is set to "global".<BR> 
Azure DNS supports optimistic concurrency, called [Etags](dns-getstarted-create-dnszone.md). The "Etag" is a property of the Zone. "IfNoneMatch" is a property in ZoneCreateOrUpdateParameters.

	// To create a DNS zone
	Zone z = new Zone("global");
	z.Properties = new ZoneProperties();
	z.Tags.Add("dept", "shopping");
	z.Tags.Add("env", "production");
	ZoneCreateOrUpdateParameters zoneParams = new ZoneCreateOrUpdateParameters(z);
	ZoneCreateOrUpdateResponse responseCreateZone = 
	dnsClient.Zones.CreateOrUpdate("myresgroup", "myzone.com", zoneParams);



## Create or update DNS records and record sets

DNS records are managed as a record set. A record set is a set of records with the same name and record type within a zone. To create or update a record set, a "RecordSet" object is created and passed to *dnsClient.RecordSets.CreateOrUpdate*. Note that the record set name is relative to the zone name, as opposed to being the fully qualified DNS name. The location is set to "global".<BR>
Azure DNS supports optimistic concurrency [Etags](dns-getstarted-create-dnszone.md). The "Etag" is a property of the RecordSet. "IfNoneMatch" is a property in RecordSetCreateOrUpdateParameters.
    


	// To create record sets
	RecordSet rsWwwA = new RecordSet("global");
	rsWwwA.Properties = new RecordProperties(3600);
	rsWwwA.Properties.ARecords = new List<ARecord>();
	rsWwwA.Properties.ARecords.Add(new ARecord("1.2.3.4"));
	rsWwwA.Properties.ARecords.Add(new ARecord("1.2.3.5"));
	RecordCreateOrUpdateParameters recordParams = 
								new RecordCreateOrUpdateParameters(rsWwwA);
	RecordCreateOrUpdateResponse responseCreateA = 
								dnsClient.RecordSets.CreateOrUpdate("myresgroup", 
	"myzone.com", "www", RecordType.A, recordParams);
	
    
## Get zones and record sets

The *Zones* and *RecordSets* collections provide the ability to get zones and record sets, respectively. RecordSets are identified by their type, name, and the zone and resource group they exist in. Zones are identified by their name and the resource group they exist in.

	ZoneGetResponse getZoneResponse = 
	dnsClient.Zones.Get("myresgroup", "myzone.com");
	RecordGetResponse getRSResp = 
	dnsClient.RecordSets.Get("myresgroup", 
	"myzone.com", "www", RecordType.A);

## List zones and record sets

To list zones, use the *List* method in the Zones collection. To list record sets, use the *List* or *ListAll* methods in the RecordSets collection. The *List* method differs from the *ListAll* method in that it only returns record sets of a specified type.

The following example shows how to get a list of DNS zones and record sets.


	ZoneListResponse zoneListResponse = dnsClient.Zones.List("myresgroup", new ZoneListParameters());
	foreach (Zone zone in zoneListResponse.Zones)
	{
    	RecordListResponse recordSets = 
                 			dnsClient.RecordSets.ListAll("myresgroup", "myzone.com", new RecordSetListParameters());

    // do something like write out each record set
	}


## Next steps

[Visual Studio SDK sample project](http://download.microsoft.com/download/2/A/C/2AC64449-1747-49E9-B875-C71827890126/AzureDnsSDKExample_2015_05_05.zip) 