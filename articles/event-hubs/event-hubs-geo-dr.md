---
title: Azure Event Hubs Geo-disaster recovery | Microsoft Docs
description: How to use geographical regions to failover and perform disaster recovery in Azure Event Hubs
services: event-hubs
documentationcenter: ''
author: ShubhaVijayasarathy
manager: timlt
editor: ''

ms.service: event-hubs
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/11/2017
ms.author: sethm

---

# Azure Event Hubs Geo-disaster recovery (preview)

When regional datacenters experience downtime, it is critical for data processing to continue to operate in a different region or datacenter. As such, *Geo-disaster recovery* and *Geo-replication* are important features for any enterprise. Azure Event Hubs supports both Geo-disaster recovery and Geo-replication, at the namespace level. 

The Geo-disaster recovery feature of Azure Event Hubs is a disaster recovery solution. The concepts and workflow described in this article apply to disaster scenarios, and not to transient, or temporary outages.

For a detailed discussion of disaster recovery in Microsoft Azure, see [this article](/azure/architecture/resiliency/disaster-recovery-azure-applications). 

## How it works?
### Terminology

**Pairing**: Establishing the disaster recovery configuration between the active region and passive region is known as ‘pairing the regions’

**Alias**: A name for a disaster recovery configuration that the user sets up. The alias provides a single stable Fully Qualified Domain Name (FQDN) connection string.
Applications use alias connection string to connect to an Event.

**Meta-data**: Here refers to event hub names, consumer groups, partitions, throughput units, entities, and properties that are associated with the namespace
[TODO:Add image content here]

### Step1: Create a geo-pair
To create a pairing between two regions, you would need a primary namespace and a secondary namespace. An alias
is created to form the geo-pair. Once the namespaces are paired with an alias, the meta-data is replicated periodically in both the namespaces.

The following code snippet shows how to do this:
```csharp
ArmDisasterRecovery adr = await client.DisasterRecoveryConfigs.CreateOrUpdateAsync(
                                    config.PrimaryResourceGroupName,
                                    config.PrimaryNamespace,
                                    config.Alias,
                                    new ArmDisasterRecovery(){ PartnerNamespace = config.SecondaryNamespace});
```

### Step2: Update existing clients
Once the geo-pairing is done, the connection strings that point to the primary namespaces must now be updated to point to the alias
connection string. Obtain the connection strings as shown below,

```csharp
var accessKeys = await client.Namespaces.ListKeysAsync(config.PrimaryResourceGroupName,
                                                       config.PrimaryNamespace, "RootManageSharedAccessKey");
var aliasPrimaryConnectionString = accessKeys.AliasPrimaryConnectionString;
var aliasSecondaryConnectionString =    accessKeys.AliasSecondaryConnectionString;
```
### Step3: Initiate a failover
In the event of disaster or you, decide to initiate a failover to the secondary namespace, metadata and data start flowing into the
secondary namespace. Since the applications use the alias connection strings, no further action is required, as they automatically start reading and writing to and from the event hubs in the secondary namespace. 

The following code snippet shows how to do the failover:
```csharp
await client.DisasterRecoveryConfigs.FailOverAsync(config.SecondaryResourceGroupName,
                                                   config.SecondaryNamespace, config.Alias);
```
Note, once the failover is done and you need the data present in the primary namespace, you must use an explicit connection to the
event hubs in the primary namespace to extract the data.

### Other operations (optional)
You can also break the geo-pairing or delete an alias, which can be done as shown in the code below
Note: To delete an alias,you need to break the geo-paring first.

```csharp
// Break pairing
await client.DisasterRecoveryConfigs.BreakPairingAsync(config.PrimaryResourceGroupName,
                                                       config.PrimaryNamespace, config.Alias);

// Delete alias
// Before the alias is deleted, pairing needs to be broken
await client.DisasterRecoveryConfigs.DeleteAsync(config.PrimaryResourceGroupName,
                                                 config.PrimaryNamespace, config.Alias);

```

## Considerations for public preview

Note the following considerations for this release:

1. The Geo-disaster recovery capability is available only in the North Central US and South Central US regions. 
2. The feature is supported only for newly-created namespaces.
3. For the preview release, only metadata replication is enabled. Actual data is not replicated.
4. With the preview release, there is no cost for enabling the feature. However, both the primary and the secondary namespaces will incur charges for the reserved throughput units.

## Next Steps

* The [sample on GitHub])https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/GeoDRClient) walks you through the simple workflow for creating geo-pair and initiating a failover for a disaster recovery scenario
* The [REST API reference here](/rest/api/eventhub/disasterrecoveryconfigs) gives you the APIs for performing the Geo-DR configurations

For more information about Event Hubs, visit the following links:

* Get started with an [Event Hubs tutorial](event-hubs-dotnet-standard-getstarted-send.md)
* [Event Hubs FAQ](event-hubs-faq.md)
* [Sample applications that use Event Hubs](https://github.com/Azure/azure-event-hubs/tree/master/samples)

