---
title: Use AMQP with the Java Message Service 1.1 API and Azure Service Bus standard
description: Use the Java Message Service (JMS) with Azure Service Bus and the Advanced Message Queuing Protocol (AMQP) 1.0.
ms.topic: article
ms.date: 10/06/2026
ms.devlang: java
ms.custom:
  - devx-track-java
  - devx-track-extended-java
  - ignite-2023
  - sfi-ropc-nochange
---

# Use Java Message Service 1.1 with Azure Service Bus standard and AMQP 1.0

> [!WARNING]
> This article covers limited support for the Java Message Service (JMS) 1.1 API in the Azure Service Bus Standard tier.
>
> For full JMS 2.0 support, use the [Azure Service Bus Premium tier](how-to-use-java-message-service-20.md).

Use Apache Qpid JMS to send and receive messages through AMQP 1.0. The examples use Qpid directly; they don't depend on the retired `com.microsoft.azure:azure-servicebus` library or internal Azure client library classes.

## Get started with Service Bus

Create a [Service Bus namespace and queue](service-bus-quickstart-portal.md). The queue sample uses a queue named `BasicQueue`.

Create a shared access policy with Send and Listen permissions. Configure the following environment variables:

| Variable | Value |
| --- | --- |
| `SB_SAMPLES_NAMESPACE` | Namespace host, such as `example.servicebus.windows.net`. |
| `SB_SAMPLES_SAS_KEY_NAME` | Shared access policy name. |
| `SB_SAMPLES_SAS_KEY` | Shared access policy key. |

Keep access keys out of source control. These are separate values, not a Service Bus connection string.

## Download the AMQP 1.0 JMS client library

Install JDK 11 or later and Maven, then clone the [Service Bus sample repository](https://github.com/Azure/azure-service-bus). The [JMS queue sample](https://github.com/Azure/azure-service-bus/tree/master/samples/Java/qpid-jms-client/JmsQueueQuickstart) includes its dependencies in `pom.xml`.

The sample uses the `javax.jms` API with the Qpid JMS 1.x client. For Qpid version and API information, see the [Apache Qpid JMS documentation](https://qpid.apache.org/components/jms/).

## Code Java applications

### Java Naming and Directory Interface

Java Naming and Directory Interface (JNDI) separates logical names from physical addresses. The Qpid JNDI provider resolves a connection factory and a queue from configuration properties.

#### Set up JNDI context and configure the ConnectionFactory object

The following code uses the namespace host and policy credentials configured earlier:

```java
import javax.jms.ConnectionFactory;
import javax.jms.Connection;
import javax.jms.Destination;
import javax.jms.MessageProducer;
import javax.jms.Session;
import javax.naming.Context;
import javax.naming.InitialContext;
import java.util.Hashtable;

String namespaceHost = System.getenv("SB_SAMPLES_NAMESPACE");
String sasKeyName = System.getenv("SB_SAMPLES_SAS_KEY_NAME");
String sasKey = System.getenv("SB_SAMPLES_SAS_KEY");
if (namespaceHost == null || namespaceHost.isEmpty()
        || sasKeyName == null || sasKeyName.isEmpty()
        || sasKey == null || sasKey.isEmpty()) {
    throw new IllegalArgumentException("Set the namespace host, policy name, and policy key.");
}

Hashtable<String, String> properties = new Hashtable<>();
properties.put(Context.INITIAL_CONTEXT_FACTORY,
        "org.apache.qpid.jms.jndi.JmsInitialContextFactory");
properties.put("connectionfactory.SBCF",
        "amqps://" + namespaceHost + "?amqp.idleTimeout=120000");
properties.put("queue.QUEUE", "BasicQueue");

Context context = new InitialContext(properties);
ConnectionFactory factory = (ConnectionFactory) context.lookup("SBCF");
Destination queue = (Destination) context.lookup("QUEUE");
```

#### Configure producer and consumer destination queues

Create a JMS connection with the policy name and key. Use the queue resolved through JNDI as the destination, rather than casting a queue-name string to `Destination`.

```java
Connection connection = factory.createConnection(sasKeyName, sasKey);
Session session = connection.createSession(false, Session.CLIENT_ACKNOWLEDGE);
MessageProducer producer = session.createProducer(queue);
```

Create a separate session for the consumer. Start its connection before receiving messages.

### A simple JMS application that uses a Service Bus queue

The [JMS queue quickstart](https://github.com/Azure/azure-service-bus/tree/master/samples/Java/qpid-jms-client/JmsQueueQuickstart) contains the complete application, including sending messages, receiving and acknowledging them, and closing JMS resources.

### Run the application

From the `samples/Java/qpid-jms-client/JmsQueueQuickstart` directory, build the sample. The integration test also uses the configured namespace and queue.

```bash
mvn clean package
```

Run the packaged application:

```bash
java -jar target/jmsqueuequickstart-1.0.0-jar-with-dependencies.jar
```

The application sends ten messages, receives and acknowledges them, and exits. To compile and package without running the integration test, use `mvn -DskipTests package`.

## AMQP disposition and Service Bus operation mapping

Here's how an AMQP disposition translates to a Service Bus operation:

```Output
ACCEPTED = 1; -> Complete()
REJECTED = 2; -> DeadLetter()
RELEASED = 3; (just unlock the message in service bus, will then get redelivered)
MODIFIED_FAILED = 4; -> Abandon() which increases delivery count
MODIFIED_FAILED_UNDELIVERABLE = 5; -> Defer()
```

## JMS topics vs. Service Bus topics

Using Service Bus topics and subscriptions through the JMS API provides basic send and receive capabilities. It's a convenient choice when you port applications from other message brokers with JMS-compliant APIs, even though Service Bus topics differ from JMS topics and require a few adjustments.

Service Bus topics route messages into named, shared, and durable subscriptions that are managed through the Azure Resource Management interface, the Azure command-line tools, or the Azure portal. Each subscription allows for up to 2,000 selection rules, each of which might have a filter condition and, for SQL filters, also a metadata transformation action. Each filter condition match selects the input message to be copied into the subscription.

Receiving messages from subscriptions is identical to receiving messages from queues. Each subscription has an associated dead-letter queue and the ability to automatically forward messages to another queue or topics.

JMS topics allow clients to dynamically create nondurable and durable subscribers that optionally allow filtering messages with message selectors. These unshared entities aren't supported by Service Bus Standard. The SQL filter rule syntax for Service Bus is similar to the message selector syntax supported by JMS.

The JMS topic publisher side is compatible with Service Bus Standard, as shown in the [JMS topic sample](https://github.com/Azure/azure-service-bus/tree/master/samples/Java/qpid-jms-client/JmsTopicQuickstart), but dynamic subscribers aren't.

## Unsupported features and restrictions

The following restrictions apply to JMS over AMQP 1.0 with Service Bus Standard:

* Only one **MessageProducer** or **MessageConsumer** object is allowed per session. If you need multiple producers or consumers, create a dedicated session for each.
* Volatile topic subscriptions aren't supported.
* **MessageSelector** objects aren't supported.
* Distributed transactions aren't supported, but transacted sessions are supported.

Service Bus Standard splits the control plane from the data plane, so it doesn't support several of JMS's dynamic topology functions.

| Unsupported method | Replace with |
| --- | --- |
| createDurableSubscriber | Create a topic subscription that ports the message selector. |
| createDurableConsumer | Create a topic subscription that ports the message selector. |
| createSharedConsumer | Service Bus topics are always shareable. See [JMS topics vs. Service Bus topics](#jms-topics-vs-service-bus-topics). |
| createSharedDurableConsumer | Service Bus topics are always shareable. See [JMS topics vs. Service Bus topics](#jms-topics-vs-service-bus-topics). |
| createTemporaryTopic | Create a topic via the management API, tools, or portal with *AutoDeleteOnIdle* set to an expiration period. |
| createTopic | Create a topic via the management API, tools, or portal. |
| unsubscribe | Delete the topic via the management API, tools, or portal. |
| createBrowser | Use the Peek functionality of the Service Bus client library. |
| createQueue | Create a queue via the management API, tools, or portal. |
| createTemporaryQueue | Create a queue via the management API, tools, or portal with *AutoDeleteOnIdle* set to an expiration period. |
| receiveNoWait | Use a receive operation with a short timeout. |

## Next steps

* [AMQP 1.0 support in Azure Service Bus](service-bus-amqp-overview.md)
* [Service Bus AMQP protocol guide](service-bus-amqp-protocol-guide.md)
* [Use JMS 2.0 with Service Bus Premium](how-to-use-java-message-service-20.md)
