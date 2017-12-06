---
title: Azure Service Bus Geo-disaster recovery | Microsoft Docs
description: How to use geographical regions to failover and perform disaster recovery in Azure Service Bus
services: service-bus-messaging
documentationcenter: ''
author: christianwolf42
manager: timlt
editor: ''

ms.service: service-bus-messaging
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/11/2017
ms.author: sethm

---

# Azure Service Bus Geo-disaster recovery (preview)

When regional datacenters experience downtime, it is critical for data processing to continue to operate in a different region or datacenter. As such, *Geo-disaster recovery* and *Geo-replication* are important features for any enterprise. Azure Service Bus supports both Geo-disaster recovery and Geo-replication, at the namespace level. 

The Geo-disaster recovery preview is currently only available in two regions (**North Central US** and **South Central US)**.

## Outages and disasters

The [Best practices for insulating applications against Service Bus outages and disasters](service-bus-outages-disasters.md) article makes a distinction between "outages" and "disasters," which is important to note. An *outage* is the temporary unavailability of Azure Service Bus, and can affect some components of the service, such as a messaging store, or even the entire datacenter. However, after the problem has been fixed, Service Bus becomes available again. Typically, an outage does not cause the loss of messages or other data. An example of such an outage might be a power failure in the datacenter.

A *disaster* is defined as the permanent, or longer-term loss of a Service Bus [scale unit](service-bus-architecture.md#service-bus-scale-units) or datacenter. The datacenter may or may not become available again, or may be down for hours or days. Examples of such disasters are fire, flooding, or earthquake. A disaster that becomes permanent might cause the loss of some messages or other data. However, in most cases there should be no data loss and messages can be recovered once the data center is back up.

The Geo-disaster recovery feature of Azure Service Bus is a disaster recovery solution. The concepts and workflow described in this article apply to disaster scenarios, and not to transient, or temporary outages.  

## Basic concepts and terms

The disaster recovery feature implements metadata disaster recovery, and relies on primary and a secondary disaster recovery namespaces. Note that the Geo-disaster recovery feature is available for [Premium namespaces](service-bus-premium-messaging.md) only. You do not need to make any connection string changes, as the connection is made via an alias.

The following terms are used in this article:

-  *Alias*: Your main connection string.

-  *Primary/secondary namespace*: Describes the namespaces that correspond to the alias. The primary is "active" and receives messages, the secondary is "passive" and does not receive messages. The metadata between both is in sync, so both can seamlessly accept messages without any application code changes.

-  *Metadata*: Your representation of objects in Azure Service Bus. Currently we only support metadata.

-  *Failover*: The process of activating the secondary namespace. You must pull messages from your formerly primary namespace once it becomes available again, and then delete the namespace. To create another failover, you add a new secondary namespace to the pairing. If you want to reuse the former primary namespace after a failover, you must first remove all existing entities from the namespace. Make sure to receive all messages before doing so.

## Failover workflow

The following section is an overview of the entire process of setting up the initial failover, and how to go forward from that point.

![1][]

You first set up a primary and a secondary namespace, then create a pairing. This pairing gives you an alias that you can use to connect. Because you use an alias, you do not have to change connection strings. Only new namespaces can be added to your failover pairing. Finally, you must add some trigger logic (for example, some business logic that detects if the namespace is not available, and initiates the failover). You can check for namespace availability using the [message browsing](message-browsing.md) capability of Service Bus.

After you have set up both monitoring and disaster recovery, you can look at the failover process. If the trigger initiates a failover, or you initiate the failover manually, two steps are required:

1. In case of another outage, you want to be able to failover again. Therefore, set up a second passive namespace and update the pairing. 
2. Pull messages from the formerly primary namespace once the new namespace is available. After that, either reuse or delete the old primary namespace.

![2][]

## Set up disaster recovery

This section describes how to build your own Service Bus Geo-disaster recovery code. To do so, you need two namespaces in independent locations; for example, South US and North Central US. The following example uses Visual Studio 2017.

1.  Create a new **Console App(.Net Framework)** project in Visual Studio and give it a name; for example, **SBGeoDR**.

2.  Install the following NuGet packages:
    1.  Microsoft.IdentityModel.Clients.ActiveDirectory
    2.  Microsoft.Azure.Management.ServiceBus

3. Make sure that the version of the Newtonsoft.Json NuGet package you are using is version 10.0.3.

3.  Add the following `using` statements to your code:

	```csharp
    using System.Threading;
    using Microsoft.Azure.Management.ServiceBus;
    using Microsoft.Azure.Management.ServiceBus.Models;
    using Microsoft.IdentityModel.Clients.ActiveDirectory;
    using Microsoft.Rest;
    ```

4. Modify your `main()` method to add two premium namespaces:

    ```csharp
    // 1. Create primary namespace (optional).

    var namespaceParams = new SBNamespace()
    {
        Location = "South Central US",
        Sku = new SBSku()
        {
            Name = SkuName.Premium,
            Capacity = 1
        }

    };

    var namespace1 = client.Namespaces.CreateOrUpdate(resourceGroupName, geoDRPrimaryNS, namespaceParams);

    // 2. Create secondary namespace (optional if you already have an empty namespace available).

    var namespaceParams2 = new SBNamespace()
    {
        Location = "North Central US",
        Sku = new SBSku()
        {
            Name = SkuName.Premium,
            Capacity = 1
        }

    };

    // If you re-run this program while namespaces are still paired this operation will fail with a bad request.
    // This is because we block all updates on secondary namespaces once it is paired.

    var namespace2 = client.Namespaces.CreateOrUpdate(resourceGroupName, geoDRSecondaryNS, namespaceParams2);
    ```

5. Enable the pairing between the two namespaces and get the alias you later use to connect to your entities:

    ```csharp
    // 3. Pair the namespaces to enable DR.

    ArmDisasterRecovery drStatus = client.DisasterRecoveryConfigs.CreateOrUpdate(
        resourceGroupName,
        geoDRPrimaryNS,
        alias,
        new ArmDisasterRecovery { PartnerNamespace = geoDRSecondaryNS });

    // A similar loop can be used to check if other operations (Failover, BreakPairing, Delete) 
    // mentioned below have been successful.
    while (drStatus.ProvisioningState != ProvisioningStateDR.Succeeded)
    {
        Console.WriteLine("Waiting for DR to be set up. Current state: " +
        drStatus.ProvisioningState);
        drStatus = client.DisasterRecoveryConfigs.Get(
        resourceGroupName,
        geoDRPrimaryNS,
        alias);

        Thread.CurrentThread.Join(TimeSpan.FromSeconds(30));
    }
    ```

You have successfully set up two paired namespaces. Now you can create entities to observe the metadata synchronization. If you want to perform a failover immediately afterwards, you should allow some time for the metadata to synchronize. You can add a short sleep time, for example:

```csharp
client.Topics.CreateOrUpdate(resourceGroupName, geoDRPrimaryNS, "myTopic", new SBTopic());
client.Subscriptions.CreateOrUpdate(resourceGroupName, geoDRPrimaryNS, "myTopic", "myTopic-Sub1", new SBSubscription());

// sleeping to allow metadata to sync across primary and secondary
Thread.Sleep(1000 * 60);
```

At this point you can add entities via the portal or via Azure Resource Manager, and see how they synchronize. Unless your plan is to failover manually, you should create an app that monitors your primary namespace and initiates failover if it becomes unavailable. 

## Initiate a failover

The following code shows how to initiate a failover:

```csharp
// Note that this failover operation is always run against the secondary namespace 
// (because primary might be down at time of failover).

client.DisasterRecoveryConfigs.FailOver(resourceGroupName, geoDRSecondaryNS, alias);
```

After you trigger the failover, add a new passive namespace and re-establish the pairing. The code to create a new pairing is shown in the previous section. Additionally, you must remove the messages from the old primary namespace once the failover is complete. For examples of how to receive messages from a queue, see [Get started with queues](service-bus-dotnet-get-started-with-queues.md).

## How to disable Geo-disaster recovery

The following code shows how to disable a namespace pairing:

```csharp
client.DisasterRecoveryConfigs.BreakPairing(resourceGroupName, geoDRPrimaryNS, alias);
```

The following code deletes the alias you created:

```csharp
// Delete the DR config (alias).
// Note that this operation must run against the namespace to which the alias is currently pointing.
// If you break the pairing and want to delete the namespaces afterwards, you must delete the alias first.

client.DisasterRecoveryConfigs.Delete(resourceGroupName, geoDRPrimaryNS, alias);
```

## Steps after a failover (failback)

After a failover, perform the following two steps:

1.  Create a new passive secondary namespace. The code is shown in a previous section.
2.  Remove the remaining messages from your queue.

## Alias connection string and test code

If you want to test the failover process, you can write a sample application that pushes messages to the primary namespace using the alias. To do so, make sure that you obtain the alias connection string from an active namespace. With the current preview release, there is no other interface to directly obtain the connection string. The following example code connects before and after the failover:

```csharp
var accessKeys = client.Namespaces.ListKeys(resourceGroupName, geoDRPrimaryNS, "RootManageSharedAccessKey");
var aliasPrimaryConnectionString = accessKeys.AliasPrimaryConnectionString;
var aliasSecondaryConnectionString = accessKeys.AliasSecondaryConnectionString;

if(aliasPrimaryConnectionString == null)
{
    accessKeys = client.Namespaces.ListKeys(resourceGroupName, geoDRSecondaryNS, "RootManageSharedAccessKey");
    aliasPrimaryConnectionString = accessKeys.AliasPrimaryConnectionString;
    aliasSecondaryConnectionString = accessKeys.AliasSecondaryConnectionString;
}
```

## Next steps

- See the Geo-disaster recovery [REST API reference here](/rest/api/servicebus/disasterrecoveryconfigs).
- Run the Geo-disaster recovery [sample on GitHub](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.ServiceBus.Messaging/GeoDR/SBGeoDR2/SBGeoDR2).
- See the Geo-disaster recovery [sample that sends messages to an alias](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.ServiceBus.Messaging/GeoDR/TestGeoDR/ConsoleApp1).

To learn more about Service Bus messaging, see the following articles:

* [Service Bus fundamentals](service-bus-fundamentals-hybrid-solutions.md)
* [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
* [How to use Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)
* [Rest API](/rest/api/servicebus/) 

[1]: ./media/service-bus-geo-dr/geo1.png
[2]: ./media/service-bus-geo-dr/geo2.png
