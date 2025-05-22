---
title: Reliability in Azure IoT Hub
description: Find out about reliability in Azure IoT Hub, including availability zones and multi-region deployments.
author: kgremban
ms.author: kgremban
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: azure-iot-hub
ms.date: 05/02/2025

#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure IoT Hub works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.

---

# Reliability in Azure IoT Hub

This article describes reliability support in Azure IoT Hub, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

Reliability is a shared responsibility between you and Microsoft. You can use this guide to find out which reliability options fulfill your specific business objectives and uptime goals.  When you evaluate reliability options, you'll also need to evaluate the trade-offs between:

- Level of resiliency you require
- Implementation and maintenance complexity
- Cost of implementing different options

For a deeper understanding of trade-offs when choosing reliability options, see [Well-Architected Framework - Reliability tradeoffs](/azure/well-architected/reliability/tradeoffs).


## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

Although IoT Hub offers a reasonably high uptime guarantee, transient failures are to be expected in any distributed computing platform.  To handle transient failures, build the appropriate [retry patterns](../iot/concepts-manage-device-reconnections.md#retry-patterns) in components that interact with cloud applications.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

IoT Hub supports two distinct types of availability zone support:

- *Zone redundancy for data*, which automatically replicates data between multiple availability zones for the underlying storage components that store the device identity registry and device-to-cloud messages.

- *Zone redundancy for compute*, which provides resiliency in the components responsible for managing the devices and routing messages.

The types of availability zone support available in a specific IoT hub depend on the region it's deployed to.

### Region support

The type of availability zone support for your IoT hub depends on the region it's deployed in:

| Region | Zone redundancy for data | Zone redundancy for compute |
| ------ | --------------- | ------------ |
| Australia East | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| Brazil South | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| Canada Central | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| Central India | :::image type="content" source="./media/icon-x.svg" alt-text="No" border="false"::: | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| Central US | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| East US | :::image type="content" source="./media/icon-x.svg" alt-text="No" border="false"::: | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| France Central | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| Germany West Central | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| Japan East | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| Korea Central | :::image type="content" source="./media/icon-x.svg" alt-text="No" border="false"::: | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| North Europe  | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| Norway East | :::image type="content" source="./media/icon-x.svg" alt-text="No" border="false"::: | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| Qatar Central | :::image type="content" source="./media/icon-x.svg" alt-text="No" border="false"::: | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| South Central US | :::image type="content" source="./media/icon-x.svg" alt-text="No" border="false"::: | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| Southeast Asia  | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| UK South | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| West Europe | :::image type="content" source="./media/icon-x.svg" alt-text="No" border="false"::: | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| West US 2 | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| West US 3 | :::image type="content" source="./media/icon-x.svg" alt-text="No" border="false"::: | :::image type="content" source="./media/icon-checkmark.svg" alt-text="Yes" border="false"::: |

IoT hubs you create in regions that aren't on this list aren't resilient to zone outages.

### Cost

There's no additional cost for zone redundancy with Azure IoT Hub.

### Configure availability zone support

Azure IoT Hub resources automatically support zone redundancy when deployed in [supported regions](#region-support). No further configuration is required.

### Normal operations

This section describes what to expect when Azure IoT Hub resources are configured for zone redundancy and all availability zones are operational.

- **Data replication between zones:** When your IoT hub is deployed in a region that supports zone redundancy for data, changes in data are replicated between availability zones automatically. Replication occurs synchronously.

- **Traffic routing between zones:** When your IoT hub is deployed in a region that supports zone redundancy for compute components, requests are routed to a primary instance of the service in one of the availability zones. Azure selects the active instance and zone automatically.

### Zone-down experience

This section describes what to expect when IoT Hub resources are configured for zone redundancy and there's an availability zone outage.

- **Detection and response:** The IoT Hub service is responsible for detecting a failure in an availability zone. You don't need to do anything to initiate a zone failover.

- **Active requests:** During a zone failure, active requests might be dropped. Your clients and devices should have sufficient [retry logic](../iot/concepts-manage-device-reconnections.md#retry-patterns) implemented to handle transient faults.

- **Expected data loss**: When your IoT hub is deployed in a region that supports zone redundancy for data, a zone failure isn't expected to cause any data loss.

- **Expected downtime**: When your IoT hub is deployed in a region that supports zone redundancy for both compute and data components, a zone failure isn't expected to cause downtime to your IoT Hub resources.

- **Traffic rerouting**: When your IoT hub is deployed in a region that supports zone redundancy for compute components, IoT Hub detects the loss of the zone. Then, any new requests are automatically redirected to a new primary instance of the service in one of the healthy availability zones.

### Failback

When the availability zone recovers, IoT Hub automatically restores instances in the availability zone, and reroutes traffic between your instances as normal.

### Testing for zone failures

Because IoT Hub fully manages traffic routing, failover, and failback for zone failures, you don't need to validate availability zone failure processes, nor provide any further input.

## Multi-region support

Azure IoT Hub is a single-region service. If the region becomes unavailable, your Azure IoT Hub resources are also unavailable.

However, if your resources are in a [region that's paired](./regions-paired.md), your IoT hub's data is replicated to the paired region.

Your IoT hub might fail over to the paired region in the following situations:

- *Customer initiated failover:* You can trigger manual failover to the paired region yourself, whether the region is experiencing downtime or not. You can use this approach to perform planned failovers and drills.

- *Microsoft initiated failover:* If a region is lost, Microsoft can initiate a failover of IoT hubs to the paired region. However, Microsoft is unlikely to initiate failover except after a significant delay and on a best-effort basis. Failover of Azure IoT Hub resources might happen at a different time than failover of other Azure services. This process is a default option and requires no intervention from you.

If resources are in a *nonpaired region*, Microsoft doesn’t replicate configuration and data across regions, and there’s no built-in cross-region failover. However, you can deploy separate resources into multiple regions. In this case, it's your responsibility to manage replication, traffic distribution, failover, etc.

If your IoT hub is in a nonpaired region, or if the default replication and failover behavior doesn't meet your needs, you can use [alternative multi-region approaches](#alternative-multi-region-approaches) to plan for and initiate failovers.

### Region support

Default replication and failover is only supported in regions that are paired.

In nonpaired regions, there's no built-in cross-region failover. If your IoT hub is in a nonpaired region and needs a failover mechanism to be resilient to region outages, consider [alternative multi-region approaches](#alternative-multi-region-approaches).

### Requirements

Paired region replication and failover options are available for all IoT Hub tiers.

### Considerations

Don't use customer-initiated failover to permanently migrate your hub between the Azure paired regions. Generally, devices are located close to the hub's primary region. If you move your hub to the secondary region, latency increases for operations between the devices and the IoT hub in the secondary location.

### Cost

For hubs in regions that are paired, there's no additional cost for cross-region data replication or failover.

If your IoT hub is in a nonpaired region, see [alternative multi-region approaches](#alternative-multi-region-approaches) for possible cost information.

### Configure replication and prepare for failover

By default, cross-region data replication is automatically configured when you create an IoT hub in a region that's paired. This process is a default option and requires no intervention from you. In regions except for Brazil South and Southeast Asia (Singapore), your customer data won't be stored or processed outside of the geography where you deploy the service instance.

If your IoT hub is in the Brazil South or Southeast Asia (Singapore) regions, you can disable data replication and opt out of failover. For more information, see [Disable disaster recovery](../iot-hub/how-to-disable-dr.md).

If your IoT hub is in a nonpaired region, you need to plan your own cross-region replication and failover approach. For more information, see [alternative multi-region approaches](#alternative-multi-region-approaches)

### Normal operations

This section describes what to expect when an IoT hub is configured for cross-region replication and failover, and the primary region is operational.

- **Data replication between regions:** Data is replicated automatically to the paired region. Replication occurs asynchronously, which means that some data loss is expected if a failover occurs. There's no data replication between regions for IoT hubs in nonpaired regions.

- **Traffic routing between regions:** In normal operations, traffic only flows to the primary region.

### Region-down experience

This section describes what to expect when an IoT hub is configured for cross-region replication and failover, and there's an outage in the primary region.

- **Detection and response:** Responsibility for detecting and responding to an outage in the primary region can vary:

  - *Customer initiated failover.* You're responsible for detecting a region loss and deciding when to fail over. To learn how to perform customer initiated failover between paired regions, see [Tutorial: Perform manual failover for an IoT hub](../iot-hub/tutorial-manual-failover.md).

    There are limits on how frequently you can perform customer initiated failover or failback:

    - Users are allowed to perform 2 successful failover and 2 successful failback operations per day.
    - Back to back failover/failback operations aren't allowed. You must wait for 1 hour between these operations.

  - *Microsoft initiated failover.* Microsoft can elect to perform a failover if the primary region is lost. This could take several hours after the loss of the primary region, or even longer in some situations. Failover of Azure IoT Hub resources might happen at a different time to any failover of other Azure services.

- **Active requests:** Any requests that are actively being processed by the primary region during a failover are likely to be lost. Clients should retry requests after failover completes.

- **Expected data loss:** For regions that are paired, data is replicated asynchronously to the paired region, which means that some data loss is expected after failover. This applies to both Microsoft-managed and customer-managed failovers. The *recovery point objective* (RPO), or expected data loss, of each type of data stored by IoT hubs is:

  | Data type | Recovery point objectives (RPO) |
  | --- | --- |
  | Identity registry |0-5 mins data loss |
  | Device twin data |0-5 mins data loss |
  | Cloud-to-device messages<sup>1</sup> |0-5 mins data loss |
  | Parent<sup>1</sup> and device jobs |0-5 mins data loss |
  | Device-to-cloud messages |All unread messages are lost |
  | Cloud-to-device feedback messages |All unread messages are lost |

  <sup>1</sup>Cloud-to-device messages and parent jobs aren't recovered as a part of customer initiated failover.

- **Expected downtime:** The expected downtime during region failover depends on the failover type.

  - *Customer initiated failover.* Expect approximately 10 minutes to 2 hours of downtime from when the region is lost to when the resource is operational in the paired region. The recovery time is influenced by the number of devices registered against the IoT hub instance being failed over. You can expect that the recovery time for a hub hosting approximately 100,000 devices to be around 15 minutes.

  - *Microsoft initiated failover.* Expect approximately 2 to 26 hours of downtime from when the region is lost to when the resource is available in the paired region.

    The high amount of recovery time is because Microsoft must perform the failover operation on behalf of all the affected customers in that region. For critical systems, we recommend using customer initiated failover to achieve less downtime. However, if you're running a less critical IoT solution that can sustain a downtime of roughly a day, it might be acceptable for you to take a dependency on the Microsoft initiated option to satisfy the overall disaster recovery goals for your IoT solution.

  - For both failover types, the fully qualified domain name (FQDN) of the IoT hub instance remains the same after failover, which means that the connection string also remains the same. However, the underlying IP address does change, and clients need to wait for DNS records to be updated before they can access the IoT hub after failover.

    > [!IMPORTANT]
    > The IoT SDKs don't cache the IP address of the IoT hub. We recommend that user code interfacing with the SDKs also shouldn't cache the IP address of the IoT hub.

    Because of all of these factors, the time for the runtime operations being performed against your IoT hub instance to become fully operational after the failover process can be expressed using the following function:

    > Time to recover = RTO [10 min - 2 hours for customer initiated failover | 2 - 26 hours for Microsoft-initiated failover] + DNS propagation delay + Time taken by the client application to refresh any cached IoT hub IP address.

- **Traffic rerouting** During the failover process, Azure IoT Hub updates DNS records to point to the paired region. All subsequent requests are sent to the paired region.

  Once the failover operation for the IoT hub completes, all operations from the device and back-end applications are expected to continue working without requiring manual intervention. This means that your device-to-cloud messages should continue to work, and the entire device registry is intact. Events emitted via Event Grid can be consumed via the same subscription(s) configured earlier as long as those Event Grid subscriptions continue to be available. No additional handling is required for custom endpoints.

### Post-failover configuration required

Depending on where you route your IoT hub's messages to, you might need to perform additional steps after failover completes:

- **Azure Event Hubs:** The Event Hubs-compatible name and endpoint of your IoT hub's built-in events endpoint change after failover. This is because the Event Hubs client doesn't have visibility into IoT Hub events.

  When receiving telemetry messages from the built-in endpoint using either the Event Hubs client or event processor host, you should [use the IoT hub's connection string](../iot-hub/iot-hub-devguide-messages-read-builtin.md#connect-to-the-built-in-endpoint) to establish the connection. This ensures that your back-end applications continue to work without requiring manual intervention post failover.

  If you use the Event Hub-compatible name and endpoint in your application directly, you need to [fetch the new Event Hub-compatible endpoint](../iot-hub/iot-hub-devguide-messages-read-builtin.md#connect-to-the-built-in-endpoint) after failover to continue operations. To retrieve the endpoint and name, you can use the Azure portal or the .NET SDK:

  - *Azure portal:* For more information about using the portal to retrieve the Event Hub-compatible endpoint and the Event Hub-compatible name, see [Connect to the built-in endpoint](../iot-hub/iot-hub-devguide-messages-read-builtin.md#connect-to-the-built-in-endpoint).

  - *The .NET SDK:* To use the IoT hub connection string to recapture the Event Hubs-compatible endpoint, use the sample code [How to request the IoT Hub built-in Event Hubs-compatible endpoint connection string](https://github.com/Azure/azure-sdk-for-net/tree/main/samples/iothub-connect-to-eventhubs). The code example uses the connection string to get the new Event Hubs endpoint and re-establish the connection. You must have Visual Studio installed.

- **Azure Functions and Azure Stream Analytics:** If you use Azure Functions or Azure Stream Analytics to connect the built-in Events endpoint, you need to update the Event Hubs endpoint that the function or job connects to, following the same process described in the preceding bullet point. Then, perform a **Restart** action. This is because any event stream offsets are no longer valid after failover.

- **Azure Storage:** When routing to Azure Storage, we recommend listing the blobs or files and then iterating over them, to ensure all blobs or files are read without making any assumptions of partition. The partition range could potentially change during a Microsoft-initiated failover or customer initiated failover. You can use the [List Blobs API](/rest/api/storageservices/list-blobs) to enumerate the list of blobs or [List ADLS Gen2 API](/rest/api/storageservices/datalakestoragegen2/filesystem/list) for the list of files. To learn more, see [Azure Storage as a routing endpoint](../iot-hub//iot-hub-devguide-endpoints.md#azure-storage-as-a-routing-endpoint).

### Failback

To fail back to the primary region, you can manually trigger the failover action a second time. It's important to remember the [restrictions on how frequently you can fail over](#region-down-experience).

If the original failover operation was performed to recover from an extended outage in the original primary region, we recommend that you perform failback to the primary region after the primary region has recovered from the outage.

### Testing for region failures

To simulate a failure during a region outage, you can trigger a manual failover of your IoT hub. However, because regional failover causes both downtime and data loss, as described in [region-down experience](#region-down-experience), you should only perform test failovers in nonproduction environments. Consider setting up a test IoT Hub instance to initiate the planned failover option periodically. Periodic testing can help you gain confidence in your ability to get your end-to-end solutions up and running when a real disaster happens.

### Alternative multi-region approaches

There are situations where the cross-region failover capabilities of Azure IoT Hub aren't suitable, such as:

- Your IoT hub is in a nonpaired region.
- Your business uptime goals aren't satisfied by the recovery time or data loss that either built-in failover option provides.
- You need to fail over to a region that isn't your primary region's pair.

You can design a cross-region failover solution on a per-device basis. While a complete treatment of deployment topologies in IoT solutions is outside the scope of this article, you can consider a multi-region deployment model. In this model, your primary IoT hub and solution back end run primarily in one Azure region. A secondary IoT hub and back end are deployed in another Azure region. If the IoT hub in the primary region suffers an outage or the network connectivity from the device to the primary region is interrupted, devices use a secondary service endpoint.

- **Expected downtime**. This approach can provide a short amount of downtime (less than one minute), but can be complex to implement.

- **Expected data loss**. The amount of data loss depends on the specific data stores you use, and how you configure geo-replication between them.

- **Cost**. This approach requires provisioning at least one additional IoT hub, which increases your overall cost.

At a high level, to implement a regional failover model with IoT Hub, you need to take the following measures:

- **A secondary IoT hub and device routing logic**: If service in your primary region is disrupted, devices must start connecting to your secondary region. Given the state-aware nature of most services involved, it's common for solution administrators to manually trigger the inter-region failover process. The best way to communicate the new endpoint to devices, while maintaining control of the process, is to have them regularly check a *concierge* service for the current active endpoint. The concierge service can be a web application that is replicated and kept reachable using DNS-redirection techniques (for example, using [Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md)).

  > [!NOTE]
  > Azure Traffic Manager doesn't have built-in support for Azure IoT Hub. You can configure custom Traffic Manager endpoints for each IoT hub. Configure the Traffic Manager endpoint's health probe to use the IoT hub's endpoint.

- **Identity registry replication**: To be usable, the secondary IoT hub must contain all device identities that can connect to the solution. The solution should keep geo-replicated backups of device identities, and upload them to the secondary IoT hub before switching the active endpoint for the devices. The device identity export functionality of IoT Hub is useful in this context. For more information, see [IoT Hub developer guide - identity registry](../iot-hub/iot-hub-devguide-identity-registry.md).

- **Merging logic**: When the primary region becomes available again, all the state and data that have been created in the secondary region must be migrated back to the primary region. This state and data mostly relate to device identities and application metadata, which must be merged with the primary IoT hub and any other application-specific stores in the primary region.

  To simplify this step, you should use *idempotent* operations. Idempotent operations minimize the side-effects from the eventual consistent distribution of events, and from duplicates or out-of-order delivery of events. In addition, the application logic should be designed to tolerate potential inconsistencies or slightly out-of-date state. This situation can occur due to the extra time it takes for the system to heal based on recovery point objectives (RPO).

## Backups

For most solutions, you shouldn't rely exclusively on backups. Instead, use the other capabilities described in this guide to support your resiliency requirements. However, backups protect against some risks that other approaches don't.

The IoT Hub service supports bulk export operations to export the entirety of an IoT hub identity registry to an Azure Storage blob container using a shared access signature (SAS). This method enables you to create reliable backups of your device information in a blob container that you control. For more information, see [Import and export IoT Hub device identities in bulk](../iot-hub/iot-hub-bulk-identity-mgmt.md).

You can also export an existing IoT hub's Azure Resource Manager template to create a backup of the IoT hub's configuration. For more information, see [Manually migrate an IoT hub using an Azure Resource Manager template](../iot-hub/migrate-hub-arm.md).

## Service-level agreement

The service-level agreement (SLA) for Azure IoT Hub describes the expected availability of the service and the conditions that must be met to achieve that availability expectation. To understand those conditions, it's important that you review the [SLA for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

## Related content

- [Reliability in Azure](./overview.md)
- [IoT scalability, high availability, and disaster recovery](../iot/iot-overview-scalability-high-availability.md)
