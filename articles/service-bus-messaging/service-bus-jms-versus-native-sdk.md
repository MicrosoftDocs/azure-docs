---
title: Choose between JMS and native SDK for Java
description: Compare the Java Message Service (JMS) library and the native Azure SDK for Java to determine which client library to use with Azure Service Bus.
ms.topic: concept-article
ms.date: 03/30/2026
ms.custom:
  - devx-track-extended-java
#customer intent: As a Java developer, I want to understand the differences between the JMS library and the native Azure SDK so that I can choose the right client library for my Service Bus application.
---

# Choose between JMS and the native SDK for Azure Service Bus

Azure Service Bus provides two Java client libraries:

- **[azure-servicebus-jms](https://github.com/azure/azure-servicebus-jms)** - a JMS 2.0 provider built on Apache Qpid JMS, enabling standard JMS API access to Service Bus.
- **[azure-messaging-servicebus](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/servicebus/azure-messaging-servicebus)** - the native Azure SDK client with full access to Service Bus features.

Both libraries connect to Service Bus over AMQP 1.0 and support Microsoft Entra ID authentication. They differ in feature coverage, tier requirements, and programming model. Choosing the wrong library leads to rework, meaning you discover limitations only after you build your app. This guide helps you pick the right library before you start.

## When to use JMS

Use `azure-servicebus-jms` when:

- **Migrating from another JMS broker.** If your workload currently runs against ActiveMQ, IBM MQ, or RabbitMQ with a JMS plugin, the JMS library lets you repoint to Service Bus with minimal code changes. The JMS 2.0 API stays the same - only the connection factory configuration changes.

- **Using Spring Boot with JMS.** The [spring-cloud-azure-starter-servicebus-jms](/azure/developer/java/spring-framework/configure-spring-boot-starter-java-app-with-azure-service-bus) starter integrates directly with Spring's `@JmsListener` and `JmsTemplate` patterns. If your team already leverages Spring's JMS abstractions, this is the shortest path.

- **Requiring JMS 2.0 compliance.** Some enterprise architectures mandate a standard messaging API. The JMS library satisfies that requirement while connecting to Service Bus underneath.

- **Leveraging existing JMS expertise.** If your developers have deep JMS experience and no Azure SDK experience, the learning curve is lower with the JMS library.

> [!IMPORTANT]
> The JMS library requires the **Azure Service Bus Premium tier** for full JMS 2.0 support. The Standard tier only supports JMS 1.1 with a reduced feature set. For more information, see [Use Java Message Service 2.0 API with Azure Service Bus Premium](how-to-use-java-message-service-20.md).

## When to use the native SDK

Use `azure-messaging-servicebus` when you need:

- **Full feature access.** The native SDK exposes every Service Bus capability: sessions (FIFO ordering), scheduled messages, message deferral, dead-lettering with custom reason and description, batch operations, transactions across entities, and sequence number-based receive. No abstraction layer sits between your code and the service.

- **Sessions (FIFO processing).** The JMS API doesn't support receiving messages from session-enabled queues or topics. If your workload requires ordered processing per session, the native SDK is the only option.

- **AMQP over WebSocket.** The native SDK supports WebSocket transport (port 443), which is essential when firewalls or corporate proxies block AMQP port 5671. The JMS library doesn't expose this capability.

- **Standard tier.** The native SDK works identically on both Standard and Premium tiers. Customers on Standard tier get the same feature set without tier restrictions.

- **Async or reactive patterns.** The native SDK provides true nonblocking reactive streams (Project Reactor `Mono`/`Flux`). JMS supports callback-based async receive via `MessageListener`, but the underlying threading model is blocking. For workloads that need backpressure or reactive composition, the native SDK is the better fit.

- **Fine-grained control.** The native SDK gives full control over prefetch counts, connection management, batching, and lock renewal, so you can tune performance for your specific workloads. The JMS library wraps these features behind the JMS abstraction with limited tuning.

- **New projects with no JMS dependency.** When there's no existing JMS codebase to preserve, the native SDK is the better default. It has broader feature support and closer alignment with the service.

## Feature comparison

The following table compares the capabilities of each library:

| Feature | JMS (`azure-servicebus-jms`) | Native SDK (`azure-messaging-servicebus`) |
|---|---|---|
| Send and receive messages | Yes | Yes |
| Topics and subscriptions | Yes | Yes |
| Sessions (FIFO) | No | Yes |
| Dead-letter queue | Partial - receive only, no custom reason | Yes - with reason and description |
| Scheduled messages | Yes - `setDeliveryDelay` | Yes - `scheduleMessage` |
| Message deferral | Partial - via AMQP disposition only | Yes - programmatic API |
| Batch receive | No | Yes |
| AMQP over WebSocket | No | Yes |
| Standard tier | JMS 1.1 only (limited) | Yes - full feature set |
| Premium tier | Yes - JMS 2.0 | Yes |
| Spring Boot integration | Yes - via starter | Via Spring Integration |
| Microsoft Entra ID | Yes | Yes |
| Cross-entity transactions | Yes | Yes |
| Lock renewal | Manual | Automatic (processor) |
| Prefetch control | Limited | Full |
| Queue browser | Yes | Yes - via peek |
| Message selectors / filters | Partial - no `LIKE` support | Yes - SQL filters with `LIKE` support |
| Temporary queues/topics | Yes | N/A |

> [!NOTE]
> For the full list of JMS features supported by Azure Service Bus, see [JMS features](how-to-use-java-message-service-20.md).

### Feature details

The following sections explain the most impactful differences in the table.

#### Sessions

The JMS API can't receive messages from session-enabled queues or topics - the [JMS developer guide](jms-developer-guide.md) documents this explicitly. There's no workaround. If your workload needs FIFO ordering through sessions, use the native SDK.

#### Dead-lettering

JMS can dead-letter messages through the AMQP `REJECTED` disposition, but the JMS API provides no way to set a custom dead-letter reason or description. The native SDK's `deadLetter` method lets you specify both, so you can classify and triage dead-lettered messages without guessing why they failed.

#### Message deferral

The underlying AMQP protocol maps `MODIFIED_FAILED_UNDELIVERABLE` to `Defer()`, so you can defer messages through the JMS library's AMQP layer. However, there's no programmatic JMS API to defer or receive deferred messages by sequence number. This limitation makes deferral impractical for most real workloads.

#### WebSocket transport

The JMS library's connection factory builds `amqps://` URIs (AMQP over TLS on port 5671). WebSocket transport isn't available through the standard configuration path. If your network blocks port 5671, you can't use the JMS library. The native SDK supports AMQP over WebSocket on port 443.

## Common migration scenarios

### ActiveMQ to Service Bus

**Use JMS.** This approach provides the easiest migration path. Your existing JMS code stays mostly unchanged - replace the ActiveMQ connection factory with `ServiceBusJmsConnectionFactory`, update the connection string, and test.

For a step-by-step guide, see [Migrate from ActiveMQ to Azure Service Bus](migrate-jms-activemq-to-servicebus.md).

Evaluate whether any features your ActiveMQ workload uses are unsupported in the JMS library (see the comparison table). If your app relies on sessions, WebSocket transport, or batch receive, migrate those components to the native SDK.

### IBM MQ to Service Bus

**Use JMS for existing JMS-based workloads.** If your IBM MQ app uses the JMS API, the migration path to Service Bus JMS is similar to ActiveMQ - swap the connection factory and configuration.

**Use the native SDK for new code.** If you're rewriting the messaging layer anyway, the native SDK gives you access to the full Service Bus feature set without JMS limitations.

### Starting a new project

**Default to the native SDK** unless you have a specific reason to use JMS (portability requirement, existing JMS expertise, or Spring Boot JMS starter integration). The native SDK has broader feature coverage, works on both Standard and Premium tiers, and aligns more closely with the service.

## Known limitations of the JMS library

Review these limitations before choosing the JMS library. Each one has caused customers to switch to the native SDK mid-project.

1. **No session support.** The JMS API can't receive from session-enabled entities. This limitation is the most common source of rework - customers choose JMS, build their workload, then discover they need FIFO ordering and have to switch to the native SDK.

1. **No WebSocket transport.** The library hardcodes `amqps://` (AMQP over TLS on port 5671). If your network blocks that port, you can't use the JMS library.

1. **No dead-letter with reason.** When the JMS library dead-letters a message via the AMQP `REJECTED` disposition, it can't attach a custom reason or description. This limitation makes dead-letter queue triage harder.

1. **Premium tier required for JMS 2.0.** Standard tier only supports JMS 1.1 with a reduced feature set. If cost is a concern and you don't need Premium, the native SDK works fully on Standard tier.

1. **No distributed transaction (XA/JTA) support.** Neither library supports distributed transactions. Cross-entity transactions within a single Service Bus namespace are supported by both.

1. **Partial message selectors.** JMS message selectors on Service Bus don't support `LIKE` pattern matching. The native SDK uses a different filtering mechanism ([subscription rules](topic-filters.md)) that does support `LIKE`.

## Related content

- [Azure Service Bus JMS 2.0 developer guide](jms-developer-guide.md)
- [Use Java Message Service 2.0 API with Azure Service Bus Premium](how-to-use-java-message-service-20.md)
- [Migrate from ActiveMQ to Azure Service Bus](migrate-jms-activemq-to-servicebus.md)
- [Get started with Azure Service Bus queues (Java)](service-bus-java-how-to-use-queues.md)
- [Use JMS in Spring to access Azure Service Bus](/azure/developer/java/spring-framework/configure-spring-boot-starter-java-app-with-azure-service-bus)
- [Java Message Service (JMS) 2.0 entities](java-message-service-20-entities.md)
