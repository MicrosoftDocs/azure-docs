---
title: Create DNS zones and record sets using the .NET SDK
titleSuffix: Azure DNS
description: In this learning path, get started creating DNS zones and record sets in Azure DNS by using the .NET SDK.
services: dns
documentationcenter: na
author: asudbring
manager: kumudD

ms.assetid: eed99b87-f4d4-4fbf-a926-263f7e30b884
ms.service: dns
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/19/2016
ms.author: allensu
---

# Create DNS zones and record sets using the .NET SDK

You can automate operations to create, delete, or update DNS zones, record sets, and records by using the DNS SDK with the .NET DNS Management library. A full Visual Studio project is available [here.](https://www.microsoft.com/en-us/download/details.aspx?id=47268&WT.mc_id=DX_MVP4025064&e6b34bbe-475b-1abd-2c51-b5034bcdd6d2=True)

## Create a service principal account

Typically, programmatic access to Azure resources is granted via a dedicated account rather than your own user credentials. These dedicated accounts are called 'service principal' accounts. To use the Azure DNS SDK sample project, you first need to create a service principal account and assign it the correct permissions.

1. Follow [these instructions](../active-directory/develop/howto-authenticate-service-principal-powershell.md) to create a service principal account (the Azure DNS SDK sample project assumes password-based authentication.)
2. Create a resource group ([here's how](../azure-resource-manager/templates/deploy-portal.md)).
3. Use Azure RBAC to grant the service principal account 'DNS Zone Contributor' permissions to the resource group ([here's how](../role-based-access-control/role-assignments-portal.md).)
4. If using the Azure DNS SDK sample project, edit the 'program.cs' file as follows:

   * Insert the correct values for the `tenantId`, `clientId` (also known as account ID), `secret` (service principal account password) and `subscriptionId` as used in step 1.
   * Enter the resource group name chosen in step 2.
   * Enter a DNS zone name of your choice.

## NuGet packages and namespace declarations

To use the Azure DNS .NET SDK, you need to install the **Azure DNS Management Library** NuGet package and other required Azure packages.

1. In **Visual Studio**, open a project or new project.
2. Go to **Tools** **>** **NuGet Package Manager** **>** **Manage NuGet Packages for Solution...**.
3. Click **Browse**, enable the **Include prerelease** checkbox, and type **Microsoft.Azure.Management.Dns** into the search box.
4. Select the package and click **Install** to add it to your Visual Studio project.
5. Repeat the process above to also install the following packages: **Microsoft.Rest.ClientRuntime.Azure.Authentication** and **Microsoft.Azure.Management.ResourceManager**.

## Add namespace declarations

Add the following namespace declarations

```cs
using Microsoft.Rest.Azure.Authentication;
using Microsoft.Azure.Management.Dns;
using Microsoft.Azure.Management.Dns.Models;
```

## Initialize the DNS management client

The `DnsManagementClient` contains the methods and properties necessary for managing DNS zones and record sets.  The following code logs into the service principal account and creates a `DnsManagementClient` object.

```cs
// Build the service credentials and DNS management client
var serviceCreds = await ApplicationTokenProvider.LoginSilentAsync(tenantId, clientId, secret);
var dnsClient = new DnsManagementClient(serviceCreds);
dnsClient.SubscriptionId = subscriptionId;
```

## Create or update a DNS zone

To create a DNS zone, first a "Zone" object is created to contain the DNS zone parameters. Because DNS zones are not linked to a specific region, the location is set to 'global'. In this example, an [Azure Resource Manager 'tag'](https://azure.microsoft.com/updates/organize-your-azure-resources-with-tags/) is also added to the zone.

To actually create or update the zone in Azure DNS, the zone object containing the zone parameters is passed to the `DnsManagementClient.Zones.CreateOrUpdateAsyc` method.

> [!NOTE]
> DnsManagementClient supports three modes of operation: synchronous ('CreateOrUpdate'), asynchronous ('CreateOrUpdateAsync'), or asynchronous with access to the HTTP response ('CreateOrUpdateWithHttpMessagesAsync').  You can choose any of these modes, depending on your application needs.

Azure DNS supports optimistic concurrency, called [Etags](dns-getstarted-create-dnszone.md). In this example, specifying "*" for the 'If-None-Match' header tells Azure DNS to create a DNS zone if one does not already exist.  The call fails if a zone with the given name already exists in the given resource group.

```cs
// Create zone parameters
var dnsZoneParams = new Zone("global"); // All DNS zones must have location = "global"

// Create an Azure Resource Manager 'tag'.  This is optional.  You can add multiple tags
dnsZoneParams.Tags = new Dictionary<string, string>();
dnsZoneParams.Tags.Add("dept", "finance");

// Create the actual zone.
// Note: Uses 'If-None-Match *' ETAG check, so will fail if the zone exists already.
// Note: For non-async usage, call dnsClient.Zones.CreateOrUpdate(resourceGroupName, zoneName, dnsZoneParams, null, "*")
// Note: For getting the http response, call dnsClient.Zones.CreateOrUpdateWithHttpMessagesAsync(resourceGroupName, zoneName, dnsZoneParams, null, "*")
var dnsZone = await dnsClient.Zones.CreateOrUpdateAsync(resourceGroupName, zoneName, dnsZoneParams, null, "*");
```

## Create DNS record sets and records

DNS records are managed as a record set. A record set is a set of records with the same name and record type within a zone.  The record set name is relative to the zone name, not the fully qualified DNS name.

To create or update a record set, a "RecordSet" parameters object is created and passed to `DnsManagementClient.RecordSets.CreateOrUpdateAsync`. As with DNS zones, there are three modes of operation: synchronous ('CreateOrUpdate'), asynchronous ('CreateOrUpdateAsync'), or asynchronous with access to the HTTP response ('CreateOrUpdateWithHttpMessagesAsync').

As with DNS zones, operations on record sets include support for optimistic concurrency.  In this example, since neither 'If-Match' nor 'If-None-Match' are specified, the record set is always created.  This call overwrites any existing record set with the same name and record type in this DNS zone.

```cs
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
```

## Get zones and record sets

The `DnsManagementClient.Zones.Get` and `DnsManagementClient.RecordSets.Get` methods retrieve individual zones and record sets, respectively. RecordSets are identified by their type, name, and the zone and resource group they exist in. Zones are identified by their name and the resource group they exist in.

```cs
var recordSet = dnsClient.RecordSets.Get(resourceGroupName, zoneName, recordSetName, RecordType.A);
```

## Update an existing record set

To update an existing DNS record set, first retrieve the record set, then update the record set contents, then submit the change.  In this example, we specify the 'Etag' from the retrieved record set in the 'If-Match' parameter. The call fails if a concurrent operation has modified the record set in the meantime.

```cs
var recordSet = dnsClient.RecordSets.Get(resourceGroupName, zoneName, recordSetName, RecordType.A);

// Add a new record to the local object.  Note that records in a record set must be unique/distinct
recordSet.ARecords.Add(new ARecord("5.6.7.8"));

// Update the record set in Azure DNS
// Note: ETAG check specified, update will be rejected if the record set has changed in the meantime
recordSet = await dnsClient.RecordSets.CreateOrUpdateAsync(resourceGroupName, zoneName, recordSetName, RecordType.A, recordSet, recordSet.Etag);
```

## List zones and record sets

To list zones, use the *DnsManagementClient.Zones.List...* methods, which support listing either all zones in a given resource group or all zones in a given Azure subscription (across resource groups.) To list record sets, use *DnsManagementClient.RecordSets.List...* methods, which support either listing all record sets in a given zone or only those record sets of a specific type.

Note  when listing zones and record sets that results may be paginated.  The following example shows how to iterate through the pages of results. (An artificially small page size of '2' is used to force paging; in practice this parameter should be omitted and the default page size used.)

```cs
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
```

## Next steps

Download the [Azure DNS .NET SDK sample project](https://www.microsoft.com/en-us/download/details.aspx?id=47268&WT.mc_id=DX_MVP4025064&e6b34bbe-475b-1abd-2c51-b5034bcdd6d2=True), which includes further examples on how to use the Azure DNS .NET SDK, including examples for other DNS record types.
