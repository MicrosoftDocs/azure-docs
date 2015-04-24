<properties 
   pageTitle="Creating DNS zones and record sets using .net SDK" 
   description=" Overview of Azure DNS" 
   services="Azure DNS" 
   documentationCenter="dev-center-name" 
   authors="joaoma" 
   manager="adinah" 
   editor=""/>

<tags
   ms.service="virtual-networks"
   ms.devlang="en"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="04/22/2015"
   ms.author="joaoma"/>
#Creating DNS zones and record sets using the .NET SDK#
You can automate operations to create , delete or update DNS zones, recordsets and records using DNS SDK with .NET DNS Management library.

##NuGet Packages & Namespace Declarations
In order to use the DNS Client, it is necessary to install the “Azure DNS Management Library” NuGet package and add the DNS management namespaces to your project. Go to Visual Studio, open a project or new project and go to tools, Nuget package manager console. Download the Azure DNS management library:

using Microsoft.Azure;<BR>
using Microsoft.Azure.Management.Dns;

##Initializing the DNS Management Client

The DnsManagementClient contains the methods and properties necessary for managing DNS zones and recordsets.  In order for the client to be able to access your subscription it is necessary to setup the correct permissions and generate an AWT token, see “Authenticating Azure Resource Manager requests” for more details.

Get a token for the AAD application (see linked article for code)<BR>

	string jwt = GetAToken();

make the TokenCloudCredentials using subscription ID and token:<BR>

	TokenCloudCredentials tcCreds = new TokenCloudCredentials(subID, jwt);

make the DNS management client:<BR>

	DnsManagementClient dnsClient = new DnsManagementClient(tcCreds);

##Creating or Updating a DNS Zone

To create a DNS zone, a Zone object is created and passed to dnsClient.Zones.CreateOrUpdate.  As DNS zones are not linked to a specific region, the location is set to "global".<BR>

create a DNS zone:

	Zone z = new Zone("global");
	z.Properties = new ZoneProperties();
	z.Tags.Add("dept", "shopping");
	z.Tags.Add("env", "production");
	ZoneCreateOrUpdateParameters zoneParams = new ZoneCreateOrUpdateParameters(z);
	ZoneCreateOrUpdateResponse responseCreateZone =
	dnsClient.Zones.CreateOrUpdate("myresgroup", "myzone.com", zoneParams);

Azure DNS supports optimistic concurrency <link to Jonathan’s description>.  The Etag is a property of the Zone and IfNoneMatch is a property in ZoneCreateOrUpdateParameters.

##Creating or Updating DNS Records
DNS records are managed as a record set.  A record set is the set of records with the same name and record type within a zone.  To create or update a record set, a RecordSet object is created and passed to dnsClient.RecordSets.CreateOrUpdate.  Note that the record set name is relative to the zone name as opposed to being the fully qualified DNS name.  Again the location is set to "global".
    
make some records sets

	RecordSet rsWwwA = new RecordSet("global");
	sWwwA.Properties = new RecordProperties(3600);>
	rsWwwA.Properties.ARecords = new List<ARecord>();
	rsWwwA.Properties.ARecords.Add(new ARecord("1.2.3.4"));
	rsWwwA.Properties.ARecords.Add(new ARecord("1.2.3.5"));
	RecordCreateOrUpdateParameters recordParams = 
	new RecordCreateOrUpdateParameters(rsWwwA);<bR>
	RecordCreateOrUpdateResponse responseCreateA = 
	dnsClient.RecordSets.CreateOrUpdate("myresgroup", 
	"myzone.com", "www", RecordType.A, recordParams);

    
Azure DNS supports optimistic concurrency <link to Jonathan’s description>.  The Etag is a property of the RecordSet and IfNoneMatch is a property in RecordSetCreateOrUpdateParameters.

##Getting Zones and RecordSets
The Zones and RecordSets collections provide the ability to get zones and record sets respectively.  RecordSets are identified by their type, name and the zone (and resource group) they exist in.  Zones are identified by their name and the resource group they exist in.

	ZoneGetResponse getZoneResponse = 
	dnsClient.Zones.Get("myresgroup", "myzone.com");
	RecordGetResponse getRSResp = 
	dnsClient.RecordSets.Get("myresgroup", 
	"myzone.com", "www", RecordType.A);

##Listing Zones and RecordSets

To list zones, use the List method in the Zones collection.  To list record sets use the List or ListAll methods in the RecordSets collection.  The List method differs from the ListAll method in that it only returns record sets of the specified type.

###list the zones & record sets in the resource group

	ZoneListResponse zoneListResponse = dnsClient.Zones.List("myresgroup");

	foreach (Zone zone in zoneListResponse.Zones)<BR>
	{
    RecordListResponse recordSets = 
                 dnsClient.RecordSets.ListAll("myresgroup", "myzone.com");
	}
