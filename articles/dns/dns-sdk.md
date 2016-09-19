<properties 
   pageTitle="Create DNS zones and record sets in Azure DNS using the .NET SDK | Microsoft Azure" 
   description="How to create DNS zones and record sets in Azure DNS by using the .NET SDK." 
   services="dns" 
   documentationCenter="na" 
   authors="jonatul" 
   manager="carmonm" 
   editor=""/>

<tags
   ms.service="dns"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="09/19/2016"
   ms.author="jonatul"/>


# Create DNS zones and record sets using the .NET SDK

You can automate operations to create, delete, or update DNS zones, record sets, and records by using DNS SDK with .NET DNS Management library. A full Visual Studio project is available [here.](https://www.microsoft.com/en-us/download/details.aspx?id=47268&WT.mc_id=DX_MVP4025064&e6b34bbe-475b-1abd-2c51-b5034bcdd6d2=True)

## Create a service principal account

Programmatic access to Azure resources is usually granted via a dedicated account, rather than your own user credentials. These are called 'service principal' accounts. To use the Azure DNS SDK sample project, you will first need to create a service principal account and assign it the correct permissions.

1. Follow [these instructions](../resource-group-authenticate-service-principal.md) to create a service principal account.  Note that the Azure DNS SDK sample project assumes password-based authentication.

2. Create a resource group ([here's how](../azure-portal/resource-group-portal.md)).

3. Use Azure RBAC to grant the service principal account 'DNS Zone Contributor' permissions to the resource group ([here's how](../active-directory/role-based-access-control-configure.md)).

4. If using the Azure DNS SDK sample project, edit the 'program.cs' file to insert the correct values for the tenatId, clientId (also known as account ID), secret (service principal account password) and subscriptionId as used in step 1 above.  Enter the resource group name chosen in step 2, and enter a DNS zone name of your choice.

## NuGet packages and namespace declarations

In order to use the Azure DNS .NET SDK, you'll need to install the **Azure DNS Management Library** NuGet package as well as other required Azure packages.
 
1. In **Visual Studio**, open a project or new project. 

2. Go to **Tools** **>** **NuGet Package Manager** **>** **Manage NuGet Packages for Solution...**. 

3. Click **Browse**, enable the **Include prerelease** checkbox, and type **Microsoft.Azure.Management.Dns** in the search box.

4. Select the package and click **Install** to add it to your Visual Studio project.
 
5. Repeat the process above to also install the following packages: **Microsoft.Rest.ClientRuntime.Azure.Authentication** and **Microsoft.Azure.Management.ResourceManager**.

## Add namespace declarations

Add the following namespace declarations

	using Microsoft.Rest.Azure.Authentication;
	using Microsoft.Azure.Management.Dns;
	using Microsoft.Azure.Management.Dns.Models;

## Initialize the DNS management client

The *DnsManagementClient* contains the methods and properties necessary for managing DNS zones and recordsets.  The following code logs into the service principal account and creates a DnsManagementClient object.

	// Build the service credentials and DNS management client
	var serviceCreds = await ApplicationTokenProvider.LoginSilentAsync(tenantId, clientId, secret);
	var dnsClient = new DnsManagementClient(serviceCreds);
	dnsClient.SubscriptionId = subscriptionId;

## Create or update a DNS zone

To create a DNS zone, first a "Zone" object is created to contain the DNS zone parameters. Because DNS zones are not linked to a specific region, the location is set to "global".   In this example, an [Azure Resource Manager 'tag'](https://azure.microsoft.com/updates/organize-your-azure-resources-with-tags/) is also added to the zone.

To actually create or update the zone in Azure DNS, the zone object containing the zone parameters is passed to the *DnsManagementClient.Zones.CreateOrUpdateAsyc* method.

>[AZURE.NOTE] Methods on DnsManagementClient support 3 modes of operation: synchronous (e.g. 'CreateOrUpdate'), asynchronous (e.g. 'CreateOrUpdateAsync', or asynchronous with access to the HTTP response (e.g. 'CreateOrUpdateWithHttpMessagesAsync').  You can choose any of these modes, depending on your application needs.

Azure DNS supports optimistic concurrency, called [Etags](dns-getstarted-create-dnszone.md). In this example, specifying "*" for the 'If-None-Match' header tells Azure DNS to create a new DNS zone if one does not already exist, but to fail the call if a zone with the given name already exists in the given resource group.

	// Create zone parameters
	var dnsZoneParams = new Zone("global"); // All DNS zones must have location = "global"
	
	// Create a Azure Resource Manager 'tag'.  This is optional.  You can add multiple tags
	dnsZoneParams.Tags = new Dictionary<string, string>();
	dnsZoneParams.Tags.Add("dept", "finance");
	
	// Create the actual zone.
	// Note: Uses 'If-None-Match *' ETAG check, so will fail if the zone exists already.
	// Note: For non-async usage, call dnsClient.Zones.CreateOrUpdate(resourceGroupName, zoneName, dnsZoneParams, null, "*")
	// Note: For getting the http response, call dnsClient.Zones.CreateOrUpdateWithHttpMessagesAsync(resourceGroupName, zoneName, dnsZoneParams, null, "*")
	var dnsZone = await dnsClient.Zones.CreateOrUpdateAsync(resourceGroupName, zoneName, dnsZoneParams, null, "*");

## Create DNS record sets and records

DNS records are managed as a record set. A record set is a set of records with the same name and record type within a zone.  Note that the record set name is relative to the zone name, as opposed to being the fully qualified DNS name.

To create or update a record set, a "RecordSet" parameters object is created and passed to *DnsManagementClient.RecordSets.CreateOrUpdateAsync*. As with DNS zones, there are 3 modes of operation: synchronous, ('CreateOrUpdate'), asynchronous ('CreateOrUpdateAsync'), or asynchronous with access to the HTTP response (e.g. 'CreateOrUpdateWithHttpMessagesAsync').

As with DNS zones, operations on record sets include support for optimistic concurrency.  In this example, since neither 'If-Match' nor 'If-None-Match' are specified, the record set will always be created and will overwrite any existing record set with the same name and record type in this DNS zone.

	// Create record set parameters
	var recordSetParams = new RecordSet();
	recordSetParams.TTL = 3600;

	// Add records to the record set parameter object.  In this case, we'll add a record of type 'A'
	recordSetParams.ARecords = new List<ARecord>();
	recordSetParams.ARecords.Add(new ARecord("1.2.3.4"));

	// Add metadata to the record set.  Similar to Azure Resource Manager tags, this is optional and you can add multiple metadata name/value pairs
	recordSetParams.Metadata = new Dictionary<string, string>();
	recordSetParams.Metadata.Add("user", "Mary");

	// Create the actual record set in Azure DNS
	// Note: no ETAG checks specified, will overwrite existing record set if one exists
	var recordSet = await dnsClient.RecordSets.CreateOrUpdateAsync(resourceGroupName, zoneName, recordSetName, RecordType.A, recordSetParams);

## Get zones and record sets

The *DnsManagementClient.Zones.Get* and *DnsManagementClient.RecordSets.Get* methods provide the ability to retrieve individual zones and record sets, respectively. RecordSets are identified by their type, name, and the zone and resource group they exist in. Zones are identified by their name and the resource group they exist in.

	var recordSet = dnsClient.RecordSets.Get(resourceGroupName, zoneName, recordSetName, RecordType.A);
	
## Update an existing record set

To update an existing DNS record set, first retrieve the record set, then update the record set contents, then submit the change.  In this case, specifying the 'Etag' from the retrieved record set in the 'If-Match' parameter means that the call will fail if a concurrent operation has modified the record set in the meantime.

	var recordSet = dnsClient.RecordSets.Get(resourceGroupName, zoneName, recordSetName, RecordType.A);

	// Add a new record to the local object.  Note that records in a record set must be unique/distinct
	recordSet.ARecords.Add(new ARecord("5.6.7.8"));

	// Update the record set in Azure DNS
	// Note: ETAG check specified, update will be rejected if the record set has changed in the meantime
	recordSet = await dnsClient.RecordSets.CreateOrUpdateAsync(resourceGroupName, zoneName, recordSetName, RecordType.A, recordSet, recordSet.Etag);

## List zones and record sets

To list zones, use the *DnsManagementClient.Zones.List...* methods, which support listing either all zones in a given resource group or all zones in all resource groups in a given Azure subscription. To list record sets, use *DnsManagementClient.RecordSets.List...* methods, which support either listing all record sets in a given zone or only those of a specific type in a given zone.

Note when listing zones and record sets that results may be paginated.  The example below shows how to iterate through the pages of results.  Note that an artificially small page size of '2' is used in order to force paging; in practice this parameter should be omitted and the default page size used.

	// Note: in this demo, we'll use a very small page size (2 record sets) to demonstrate paging
	// In practice, to improve performance you would use a large page size or just use the system default
	int recordSets = 0;
	var page = await dnsClient.RecordSets.ListAllInResourceGroupAsync(resourceGroupName, zoneName, "2");
	recordSets += page.Count();

	while (page.NextPageLink != null)
	{
		page = await dnsClient.RecordSets.ListAllInResourceGroupNextAsync(page.NextPageLink);
		recordSets += page.Count();
	}

## Next steps

Download the [Azure DNS .NET SDK sample project](https://www.microsoft.com/en-us/download/details.aspx?id=47268&WT.mc_id=DX_MVP4025064&e6b34bbe-475b-1abd-2c51-b5034bcdd6d2=True), which include further examples of how to use the Azure DNS .NET SDK, including examples for other DNS record types.
