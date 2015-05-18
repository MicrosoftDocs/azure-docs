<properties 
   pageTitle="Automating DNS and record sets operations using .net SDK | Microsoft Azure" 
   description=" Using the .NET SDK to automate all DNS operations for Azure DNS. " 
   services="dns" 
   documentationCenter="na" 
   authors="joaoma" 
   manager="adinah" 
   editor=""/>

<tags
   ms.service="dns"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="05/01/2015"
   ms.author="joaoma"/>
# Creating DNS zones and record sets using the .NET SDK
You can automate operations to create , delete or update DNS zones, recordsets and records using DNS SDK with .NET DNS Management library.

## NuGet Packages & Namespace Declarations
In order to use the DNS Client, it is necessary to install the “Azure DNS Management Library” NuGet package and add the DNS management namespaces to your project. Go to Visual Studio, open a project or new project and go to tools, Nuget package manager console. Download the Azure DNS management library:

	using Microsoft.Azure;
	using Microsoft.Azure.Management.Dns;
	using Microsoft.Azure.Management.Dns.Models;


## Initializing the DNS Management Client

The DnsManagementClient contains the methods and properties necessary for managing DNS zones and recordsets.  In order for the client to be able to access your subscription it is necessary to setup the correct permissions and generate an AWT token, see “Authenticating Azure Resource Manager requests” for more details.

	// get a token for the AAD application (see linked article for code)
	string jwt = GetAToken();

	// make the TokenCloudCredentials using subscription ID and token
	TokenCloudCredentials tcCreds = new TokenCloudCredentials(subID, jwt);

	// make the DNS management client
	DnsManagementClient dnsClient = new DnsManagementClient(tcCreds);

## Creating or Updating a DNS Zone

To create a DNS zone, a Zone object is created and passed to dnsClient.Zones.CreateOrUpdate.  As DNS zones are not linked to a specific region, the location is set to "global".<BR>

create a DNS zone:

	// create a DNS zone
	Zone z = new Zone("global");
	z.Properties = new ZoneProperties();
	z.Tags.Add("dept", "shopping");
	z.Tags.Add("env", "production");
	ZoneCreateOrUpdateParameters zoneParams = new ZoneCreateOrUpdateParameters(z);
	ZoneCreateOrUpdateResponse responseCreateZone = 
	dnsClient.Zones.CreateOrUpdate("myresgroup", "myzone.com", zoneParams);


Azure DNS supports optimistic concurrency called [Etags](../dns-getstarted-create-dnszone.md#Etags-and-tags)  The Etag is a property of the Zone and IfNoneMatch is a property in ZoneCreateOrUpdateParameters.

## Creating or Updating DNS Records
DNS records are managed as a record set.  A record set is the set of records with the same name and record type within a zone.  To create or update a record set, a RecordSet object is created and passed to dnsClient.RecordSets.CreateOrUpdate.  Note that the record set name is relative to the zone name as opposed to being the fully qualified DNS name.  Again the location is set to "global".
    
make some records sets

	// make some records sets
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
	
    
Azure DNS supports optimistic concurrency [Etags](../dns-getstarted-create-dnszone.md#Etags-and-tags).  The Etag is a property of the RecordSet and IfNoneMatch is a property in RecordSetCreateOrUpdateParameters.

## Getting Zones and RecordSets
The Zones and RecordSets collections provide the ability to get zones and record sets respectively.  RecordSets are identified by their type, name and the zone (and resource group) they exist in.  Zones are identified by their name and the resource group they exist in.

	ZoneGetResponse getZoneResponse = 
	dnsClient.Zones.Get("myresgroup", "myzone.com");
	RecordGetResponse getRSResp = 
	dnsClient.RecordSets.Get("myresgroup", 
	"myzone.com", "www", RecordType.A);

##Listing Zones and RecordSets

To list zones, use the List method in the Zones collection.  To list record sets use the List or ListAll methods in the RecordSets collection.  The List method differs from the ListAll method in that it only returns record sets of the specified type.

The following example shows how to get a list of DNS zones and Record sets:


	ZoneListResponse zoneListResponse = dnsClient.Zones.List("myresgroup", new ZoneListParameters());
	foreach (Zone zone in zoneListResponse.Zones)
	{
    	RecordListResponse recordSets = 
                 			dnsClient.RecordSets.ListAll("myresgroup", "myzone.com", new RecordSetListParameters());

    // do something like write out each record set
	}
## See Also 
[Traffic Manager Overview](../traffic-manager-overview)
