---
title: Use Multiple Azure Service Bus Namespaces to Insulate Applications against Outages and Disasters
description: This article provides patterns to protect applications against a potential Azure Service Bus outage by deploying multiple namespaces.
ms.topic: article
ms.date: 11/10/2026
ai-usage: ai-assisted
---

# Use multiple namespaces to insulate applications against Service Bus outages and disasters

Mission-critical applications must operate continuously, even in the presence of unplanned outages or disasters. Resilience against disastrous outages of data processing resources is a requirement for many enterprises and in some cases even required by industry regulations.

> [!NOTE]
> Service Bus Geo‑Disaster Recovery and Geo‑Replication help you recover from large‑scale disasters or permanently abandon a failed Azure region without requiring changes to your application configuration. For more information about these features and how to enable reliability and resiliency in Azure Service Bus, see [Reliability in Azure Service Bus](/azure/reliability/reliability-service-bus?toc=/azure/service-bus-messaging/TOC.json).

If you can't use Geo-Disaster Recovery or Geo-Replication to meet your requirements, you can deploy multiple Service Bus namespaces. This article describes techniques you can use to protect applications against a potential service outage or disaster by using multiple namespaces.

## Replication types

To achieve resilience against disasters with the Service Bus Standard tier, you can use **active** or  **passive** replication. If a queue or topic must remain available during a datacenter outage, create the same entity in each namespace. The entities can share the same name because they exist in separate namespaces. For example, you can reach a primary queue under **contosoPrimary.servicebus.windows.net/myQueue**, while you can reach its secondary counterpart under **contosoSecondary.servicebus.windows.net/myQueue**.

>[!NOTE]
> The **active replication** and **passive replication** setup are general purpose concepts and not specific features of Service Bus. 
> The sender applications implement replication across namespaces, and the receiver implements duplicate detection.

If the application doesn't require permanent sender-to-receiver communication, the application can implement a durable client-side queue to prevent message loss and to shield the sender from any transient Service Bus errors.

## Active replication

Active replication, also called an *active-active* setup, uses two or more namespaces across different Azure regions. The producer sends a copy of each logical message to each namespace. One consumer application reads from all namespaces and processes the first available copy. After the work succeeds, later copies are completed without repeating the work. Independent send and receive paths let healthy namespaces continue delivering messages when another namespace is slow or unavailable.

Choose regions to balance measured end-to-end latency with the geographic separation required by your disaster-recovery objectives. For example, use two relatively nearby regions for low-latency paths and a third, more distant region to protect against a disaster affecting both nearby regions.

The consumer application can run as one instance or scale out to multiple competing instances. For queues, instances read the corresponding queue in each namespace. For topics, they read the corresponding subscription in each namespace. All receive paths feed the same business-processing logic.

The following example uses two namespaces:

```text
             +--> Namespace A --+
Producer ----+                 +--> Consumer application --> Business work
             +--> Namespace B --+    (one or more instances)
```

### Keep the namespace paths independent

Start sends to all configured namespaces concurrently and wait for every send to finish, including any configured retries. Record each outcome and report failures. Continue if at least one send succeeds, even if other sends fail. If no send has a confirmed successful outcome, retain or retry the logical message according to your application's delivery policy. Preserve the same identifier across retries, including when a send's outcome is uncertain.

Maintain an independent receive loop or processor for each namespace. A slow receive, send retry, or settlement on one namespace should leave the other path free to progress. Bound pending operations separately for each namespace so an unhealthy path can't exhaust the connections, memory, or worker capacity needed by the healthy path. For client reuse, asynchronous operations, and prefetch settings, see [Service Bus performance best practices](service-bus-performance-improvements.md).

Keep corresponding entities, subscription filters, permissions, and network access configured consistently so each path can deliver the intended workload.

### Identify and coordinate duplicate copies

Set the same [MessageId](/dotnet/api/azure.messaging.servicebus.servicebusmessage.messageid) on all copies of a logical message and keep it stable across retries. Choose an identifier that uniquely represents the operation, such as an `OrderId` for an order-creation message. Use the same operation key for all competing consumer instances across all namespaces.

Use a shared data store as an *inbox* to coordinate competing consumer instances. The inbox can use a relational database, a document store, or a cache that meets your state-retention and recovery requirements. It tracks processing state, regardless of the type of business work. A useful record includes the operation key, a payload fingerprint or immutable operation details, the owning instance or attempt ID, processing status, and timestamps.

Multiple instances can receive copies simultaneously. Use an atomic create-if-absent operation or unique constraint to register the processing instance as the owner of the operation. Start the business work only after ownership registration succeeds. Use conditional updates when changing ownership or status, so an older attempt can't overwrite a newer attempt's state. Treat a reused identifier with different operation content as an error to investigate.

For example, an Azure SQL inbox table can enforce a unique key on `MessageId`. For Azure Cosmos DB for NoSQL, use a single-write-region account and a [create operation](/rest/api/cosmos-db/create-a-document) with the same item ID and partition key for every copy, rather than an upsert. Redis can use [`SET key value NX`](https://redis.io/docs/latest/commands/set/) with the operation key.

A rejected inbox insert doesn't reject or settle the Service Bus message. Inspect the existing record to distinguish completed work from work in progress, then apply the [duplicate-handling policy](#handle-a-copy-while-processing-is-underway).

Service Bus [duplicate detection](duplicate-detection.md) can reduce repeated sends to an individual queue or topic. The shared consumer state coordinates copies received across namespaces.

### Handle a copy while processing is underway

Receive messages in [PeekLock mode](message-transfers-locks-settlement.md#peeklock). Keep the original message locked while its handler performs the work. For long-running work, such as processing a video, configure [automatic lock renewal or renew the lock explicitly](message-transfers-locks-settlement.md#renew-locks) for the expected processing duration, including retries and delays.

Choose how to handle additional copies according to processing duration and recovery requirements:

| Approach | Handling additional copies | Considerations |
| --- | --- | --- |
| Wait until processing finishes. | Keep the duplicate locked and check the inbox. Complete it when the inbox shows that the work succeeded. If processing fails, use the inbox to let one instance retry the work. | Useful for short processing times. Limit how long and how many duplicates wait. If the wait limit expires before processing finishes, abandon the duplicate for redelivery. |
| Complete the duplicate immediately. | Confirm in the inbox that another instance is processing the message, then complete the duplicate. That instance continues processing and renews its message lock as needed. | Useful for long processing times. If the processing instance crashes, another instance must be able to retry the unfinished work. See the recovery warning. |

> [!WARNING]
> Plan for a consumer crash before completing duplicates. In a two-namespace example, one instance starts processing copy A and another completes copy B after finding `InProgress` in the inbox. If the first instance crashes, Service Bus delivers copy A again after its lock expires. Completing that delivery just because the inbox still says `InProgress` removes the last copy without finishing the work.
>
> Depending on your requirements, track the instance or processing attempt and a heartbeat or last-progress timestamp. Decide how long to wait before allowing another instance to retry. Update the inbox conditionally so only one instance takes over, and prevent an older attempt from overwriting the new attempt's result if it resumes.
>
> If copy A's namespace is also unavailable, redelivery waits for that namespace to recover. Consider keeping the message itself, or a durable reference to everything needed to repeat the work, in the inbox. A recovery process can then find and retry unfinished work without waiting for another delivery from Service Bus.

### Record results and retry failed work

If the inbox and business data share a transactional store, update them in the same transaction. Use a conditional inbox update to verify ownership, and roll back the transaction if the processing attempt no longer owns the record. For work outside that transaction, use naturally idempotent operations or a destination that deduplicates requests using the same operation ID. Save results or progress where needed. For more information, see the [Idempotent Consumer pattern](/azure/architecture/patterns/idempotent-consumer).

| Situation | What to do |
| --- | --- |
| Processing succeeds. | Record `Completed` in the inbox after the work succeeds, then complete the message. Complete later copies without repeating the work. |
| Processing fails and can be retried. | Roll back database changes where applicable. Release or update ownership in the inbox only if the record still belongs to the failed attempt, then abandon the original message. If the receiver crashes, Service Bus can redeliver the message after its lock expires. |
| A call to another system times out, so the result is uncertain. | Check the destination using the operation ID before repeating the action or recording `Completed`. If the result remains uncertain and repeating the action could duplicate its effects, keep the work pending for investigation. |
| Work succeeds but message completion fails. | Keep the completed inbox record. When Service Bus delivers the message again, complete it without repeating the work. |
| The inbox is unavailable. | Report the failure and keep unprocessed messages for retry. Resume duplicate handling once you can read the shared inbox again. |

Choose concurrency and prefetch settings for the time messages spend waiting or processing, and keep their locks renewed. Repeatedly abandoning a duplicate increases its delivery count and can move it to the [dead-letter queue](service-bus-dead-letter-queues.md#maximum-delivery-count). Include dead-letter monitoring and recovery in your retry policy.

### Keep and protect inbox records

Configure persistence, eviction, expiration, and failover so the store keeps inbox records for as long as you need them. If a record is lost or removed too soon, the same work can run again.

Keep completed records long enough to cover every supported way a duplicate can arrive. Include message lifetime, scheduled messages, producer retries, queues draining after an outage, and manual replay from dead-letter queues or archives. Start the retention period when processing completes, not when it starts. For example, if you allow replay for 30 days after completion, keep the record for at least 30 days, plus extra time for delayed delivery and cleanup.

Use the store's expiration feature or delete expired records in batches. Balance storage use against cleanup load. Manage ownership renewal and timeouts separately, and keep records for work that is still running or waiting for recovery. Replays after a completed record has expired need another durable idempotency check, unless your policy treats them as new work.

The inbox must meet the same availability and recovery requirements as the consumer. For Azure SQL Database, evaluate [zone redundancy](/azure/azure-sql/database/high-availability-sla-local-zone-redundancy) and [failover groups](/azure/azure-sql/database/failover-group-sql-db). For Azure Cosmos DB, evaluate [zone redundancy, multiregion deployment, and failover behavior](/azure/reliability/reliability-cosmos-db), and choose consistency settings that support the ownership checks.

Configure the application to reconnect after failover and size the store for peak ownership updates, status changes, and heartbeats. Plan for how long failover takes and whether it can lose recently written inbox records.

### Plan capacity and monitor processing

Size each namespace and its receive path for the full workload if every other namespace is unavailable. Each additional namespace adds another message copy, with extra send, receive, settlement, and inbox operations. Allow for retries and messages that accumulate during an outage when sizing the consumers and inbox. Use partitions or indexes that support looking up one operation and updating its record conditionally. Use representative workloads to choose cleanup and heartbeat intervals.

Measure completed business operations and end-to-end processing time separately from the number of copies received. Track duplicate counts, inbox records that need recovery, processing failures, lost locks, inbox response times, and backlog by namespace. Use these measurements to check that processing through healthy namespaces still meets your latency requirements when another namespace is slow.

Use a business sequence number or version to coordinate processing order across namespaces. [Message sessions](message-sessions.md) provide ordering only within the same session on a queue or subscription.

> [!NOTE]
> Include both Service Bus and inbox costs when choosing how to handle duplicates, recover failures, and retain state.

## Passive replication

When both namespaces are healthy, passive replication sends messages to only one of them. The other namespace is the backup. If a send fails with an error that indicates the active namespace might be unavailable, the producer sends the same message to the backup. If that send succeeds, switch their roles for subsequent sends. If both sends fail, return an error and keep the roles unchanged.

The consumer reads both queues and handles duplicates in the same way as for active replication.

During normal operation, passive replication sends one copy of each message, avoiding the extra send operations required by active replication.

Passive replication can still delay, lose, or duplicate messages:

- A producer sends message `m1` to the active queue, but the queue becomes unavailable before the consumer receives it. The producer then sends `m2` to the backup queue. The consumer can receive `m1` when the original queue recovers, but a permanent outage can prevent it from receiving `m1`.
- The active queue accepts message `m`, but the producer doesn't receive the acknowledgment. After the send times out, the producer sends another copy to the backup queue. The copies can arrive close together, or the backup copy can arrive first and the original after its queue recovers.

The [Azure Messaging Replication Tasks with .NET Core](https://github.com/Azure-Samples/azure-messaging-replication-dotnet) sample demonstrates replication of messages between namespaces.

## Next steps
To learn more about disaster recovery, see these articles:

* [Azure Service Bus Geo-Disaster Recovery](service-bus-geo-dr.md)
* [Azure Service Bus Geo-Replication](service-bus-geo-replication.md)
* [Azure SQL Database Business Continuity](/azure/azure-sql/database/business-continuity-high-availability-disaster-recover-hadr-overview)
* [Designing resilient applications for Azure](/azure/architecture/framework/resiliency/app-design)
