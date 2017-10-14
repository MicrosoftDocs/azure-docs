---
title: Azure Event Hubs geo-disaster recovery | Microsoft Docs
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
ms.date: 10/13/2017
ms.author: sethm

---

# Azure Event Hubs geo-disaster recovery (preview)

When regional datacenters experience downtime, it is critical for data processing to continue to operate in a different region or datacenter. As such, *geo-disaster recovery* and *geo-replication* are important features for any enterprise. Azure Event Hubs supports both geo-disaster recovery and geo-replication, at the namespace level. 

The geo-disaster recovery feature of Azure Event Hubs is a disaster recovery solution. The concepts and workflow described in this article apply to disaster scenarios, and not to transient, or temporary outages.

For a detailed discussion of disaster recovery in Microsoft Azure, see [this article](/azure/architecture/resiliency/disaster-recovery-azure-applications). 

## Terminology

**Pairing**: The primary namespace is referred to as *active* and receives messages. The failover namespace is *passive* and does not receive messages. The metadata between both is in sync, so both can seamlessly accept messages without any application code changes. Establishing the disaster recovery configuration between the active region and passive region is known as *pairing* the regions.

**Alias**: A name for a disaster recovery configuration that you set up. The alias provides a single stable Fully Qualified Domain Name (FQDN) connection string. Applications use this alias connection string to connect to a namespace.

**Metadata**: Refers to event hub names, consumer groups, partitions, throughput units, entities, and properties that are associated with the namespace.

## Enable geo-disaster recovery

You enable Event Hubs geo-disaster recovery in 3 steps: 

1. Create a geo-pairing, which creates an alias connection string and provides live metadata replication. 
2. Update the existing client connection strings to the alias created in step 1.
3. Initiate the failover: the geo-pairing is broken and the alias points to the secondary namespace as its new primary namespace.

The following figure shows this workflow:

![Geo-pairing flow][1] 

### Step 1: create a geo-pairing

To create a pairing between two regions, you need a primary namespace and a secondary namespace. You then create an alias to form the geo-pair. Once the namespaces are paired with an alias, the metadata is periodically replicated in both namespaces. 

The following code shows how to do this:

```csharp
ArmDisasterRecovery adr = await client.DisasterRecoveryConfigs.CreateOrUpdateAsync(
                                    config.PrimaryResourceGroupName,
                                    config.PrimaryNamespace,
                                    config.Alias,
                                    new ArmDisasterRecovery(){ PartnerNamespace = config.SecondaryNamespace});
```

### Step 2: update existing client connection strings

Once the geo-pairing is complete, the connection strings that point to the primary namespaces must be updated to point to the alias connection string. Obtain the connection strings as shown in the following example:

```csharp
var accessKeys = await client.Namespaces.ListKeysAsync(config.PrimaryResourceGroupName,
                                                       config.PrimaryNamespace, "RootManageSharedAccessKey");
var aliasPrimaryConnectionString = accessKeys.AliasPrimaryConnectionString;
var aliasSecondaryConnectionString = accessKeys.AliasSecondaryConnectionString;
```

### Step 3: initiate a failover

If a disaster occurs, or if you decide to initiate a failover to the secondary namespace, metadata and data start flowing into the secondary namespace. Because the applications use the alias connection strings, no further action is required, as they automatically start reading from and writing to the event hubs in the secondary namespace. 

The following code shows how to trigger the failover:

```csharp
await client.DisasterRecoveryConfigs.FailOverAsync(config.SecondaryResourceGroupName,
                                                   config.SecondaryNamespace, config.Alias);
```

Once the failover is complete and you need the data present in the primary namespace, to extract the data you must use an explicit connection string to the event hubs in the primary namespace.

### Other operations (optional)

You can also break the geo-pairing or delete an alias, as shown in the following code. Note that to delete an alias connection string, you must first break the geo-paring:

```csharp
// Break pairing
await client.DisasterRecoveryConfigs.BreakPairingAsync(config.PrimaryResourceGroupName,
                                                       config.PrimaryNamespace, config.Alias);

// Delete alias connection string
// Before the alias is deleted, pairing must be broken
await client.DisasterRecoveryConfigs.DeleteAsync(config.PrimaryResourceGroupName,
                                                 config.PrimaryNamespace, config.Alias);
```

## Considerations for public preview

Note the following considerations for this release:

1. The geo-disaster recovery capability is available only in the North Central US and South Central US regions. 
2. The feature is supported only for newly-created namespaces.
3. For the preview release, only metadata replication is enabled. Actual data is not replicated.
4. With the preview release, there is no cost for enabling the feature. However, both the primary and the secondary namespaces will incur charges for the reserved throughput units.

## Next steps

* The [sample on GitHub](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/GeoDRClient) walks through a simple workflow that creates a geo-pairing and initiates a failover for a disaster recovery scenario.
* The [REST API reference](/rest/api/eventhub/disasterrecoveryconfigs) describes APIs for performing the Geo-disaster recovery configuration.

For more information about Event Hubs, visit the following links:

* Get started with an [Event Hubs tutorial](event-hubs-dotnet-standard-getstarted-send.md)
* [Event Hubs FAQ](event-hubs-faq.md)
* [Sample applications that use Event Hubs](https://github.com/Azure/azure-event-hubs/tree/master/samples)

[1]: ./media/event-hubs-geo-dr/eh-geodr1.png

