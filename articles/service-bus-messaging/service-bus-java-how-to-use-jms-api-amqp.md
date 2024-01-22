---
title: Use AMQP with the Java Message Service 1.1 API and Azure Service Bus standard
description: Use the Java Message Service (JMS) with Azure Service Bus and the Advanced Message Queuing Protocol (AMQP) 1.0.
ms.topic: article
ms.date: 09/20/2021
ms.devlang: java
ms.custom:
  - seo-java-july2019
  - seo-java-august2019
  - seo-java-september2019
  - devx-track-java
  - devx-track-extended-java
  - ignite-2023
---

# Use Java Message Service 1.1 with Azure Service Bus standard and AMQP 1.0

> [!WARNING]
> This article caters to *limited support* for the Java Message Service (JMS) 1.1 API and exists for the Azure Service Bus standard tier only.
>
> Full support for the Java Message Service 2.0 API is available only on the [Azure Service Bus premium tier](how-to-use-java-message-service-20.md). We recommend that you use this tier.
>

This article explains how to use Service Bus messaging features from Java applications by using the popular JMS API standard. These messaging features include queues and publishing or subscribing to topics. A [companion article](service-bus-amqp-dotnet.md) explains how to do the same by using the Azure Service Bus .NET API. You can use these two articles together to learn about cross-platform messaging using the Advanced Message Queuing Protocol (AMQP) 1.0.

AMQP 1.0 is an efficient, reliable, wire-level messaging protocol that you can use to build robust, cross-platform messaging applications.

Support for AMQP 1.0 in Service Bus means that you can use the queuing and publish or subscribe brokered messaging features from a range of platforms by using an efficient binary protocol. You also can build applications composed of components built by using a mix of languages, frameworks, and operating systems.

## Get started with Service Bus

This article assumes that you already have a Service Bus namespace that contains a queue named `basicqueue`. If you don't, you can [create the namespace and queue](service-bus-quickstart-portal.md#create-a-namespace-in-the-azure-portal) by using the [Azure portal](https://portal.azure.com). For more information about how to create Service Bus namespaces and queues, see [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md).

> [!NOTE]
> Partitioned queues and topics also support AMQP. For more information, see [Partitioned messaging entities](service-bus-partitioning.md) and [AMQP 1.0 support for Service Bus partitioned queues and topics](./service-bus-amqp-protocol-guide.md).
> 
> 

## Download the AMQP 1.0 JMS client library

For information about where to download the latest version of the Apache Qpid JMS AMQP 1.0 client library, see the [Apache Qpid download site](https://qpid.apache.org/download.html).

You must add the following JAR files from the Apache Qpid JMS AMQP 1.0 distribution archive to the Java CLASSPATH environment variable when you build and run JMS applications with Service Bus:

* geronimo-jms\_1.1\_spec-1.0.jar
* qpid-jms-client-[version].jar

> [!NOTE]
> JMS JAR names and versions might have changed. For more information, see [Qpid JMS AMQP 1.0](https://qpid.apache.org/maven.html#qpid-jms-amqp-10).

## Code Java applications

### Java Naming and Directory Interface

JMS uses the Java Naming and Directory Interface (JNDI) to create a separation between logical names and physical names. Two types of JMS objects are resolved by using JNDI: **ConnectionFactory** and **Destination**. JNDI uses a provider model into which you can plug different directory services to handle name resolution duties. The Apache Qpid JMS AMQP 1.0 library comes with a simple property file-based JNDI provider that's configured by using a properties file of the following format:

```TEXT
# servicebus.properties - sample JNDI configuration

# Register a ConnectionFactory in JNDI using the form:
# connectionfactory.[jndi_name] = [ConnectionURL]
connectionfactory.SBCF = amqps://[SASPolicyName]:[SASPolicyKey]@[namespace].servicebus.windows.net

# Register some queues in JNDI using the form
# queue.[jndi_name] = [physical_name]
# topic.[jndi_name] = [physical_name]
queue.QUEUE = queue1
```

#### Set up JNDI context and configure the ConnectionFactory object

The connection string referenced is the one available in the Shared Access Policies in the [Azure portal](https://portal.azure.com) under **Primary Connection String**.

```java
// The connection string builder is the only part of the azure-servicebus SDK library
// we use in this JMS sample and for the purpose of robustly parsing the Service Bus 
// connection string. 
ConnectionStringBuilder csb = new ConnectionStringBuilder(connectionString);
        
// Set up JNDI context
Hashtable<String, String> hashtable = new Hashtable<>();
hashtable.put("connectionfactory.SBCF", "amqps://" + csb.getEndpoint().getHost() + "?amqp.idleTimeout=120000&amqp.traceFrames=true");
hashtable.put("queue.QUEUE", "BasicQueue");
hashtable.put(Context.INITIAL_CONTEXT_FACTORY, "org.apache.qpid.jms.jndi.JmsInitialContextFactory");
Context context = new InitialContext(hashtable);

ConnectionFactory cf = (ConnectionFactory) context.lookup("SBCF");

// Look up queue
Destination queue = (Destination) context.lookup("QUEUE");
```

#### Configure producer and consumer destination queues

The entry used to define a destination in the Qpid properties file JNDI provider is of the following format.

To create a destination queue for the producer:
```java
String queueName = "queueName";
Destination queue = (Destination) queueName;

ConnectionFactory cf = (ConnectionFactory) context.lookup("SBCF");
Connection connection - cf.createConnection(csb.getSasKeyName(), csb.getSasKey());

Session session = connection.createSession(false, Session.CLIENT_ACKNOWLEDGE);

// Create producer
MessageProducer producer = session.createProducer(queue);
```

To create a destination queue for the consumer:
```java
String queueName = "queueName";
Destination queue = (Destination) queueName;

ConnectionFactory cf = (ConnectionFactory) context.lookup("SBCF");
Connection connection - cf.createConnection(csb.getSasKeyName(), csb.getSasKey());

Session session = connection.createSession(false, Session.CLIENT_ACKNOWLEDGE);

// Create consumer
MessageConsumer consumer = session.createConsumer(queue);
```

### Write the JMS application

No special APIs or options are required when you use JMS with Service Bus. There are a few restrictions that will be covered later. As with any JMS application, the first thing required is configuration of the JNDI environment to be able to resolve a **ConnectionFactory** object and destinations.

#### Configure the JNDI InitialContext object

The JNDI environment is configured by passing a hash table of configuration information into the constructor of the javax.naming.InitialContext class. The two required elements in the hash table are the class name of the Initial Context Factory and the provider URL. The following code shows how to configure the JNDI environment to use the Qpid properties file-based JNDI provider with a properties file named **servicebus.properties**.

```java
// Set up JNDI context
Hashtable<String, String> hashtable = new Hashtable<>();
hashtable.put("connectionfactory.SBCF", "amqps://" + csb.getEndpoint().getHost() + \
"?amqp.idleTimeout=120000&amqp.traceFrames=true");
hashtable.put("queue.QUEUE", "BasicQueue");
hashtable.put(Context.INITIAL_CONTEXT_FACTORY, "org.apache.qpid.jms.jndi.JmsInitialContextFactory");
Context context = new InitialContext(hashtable);
``` 

### A simple JMS application that uses a Service Bus queue

The following example program sends JMS text messages to a Service Bus queue with the JNDI logical name of QUEUE and receives the messages back.

You can access all the source code and configuration information from the [Azure Service Bus samples JMS queue quickstart](https://github.com/Azure/azure-service-bus/tree/master/samples/Java/qpid-jms-client/JmsQueueQuickstart).

```java
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

package com.microsoft.azure.servicebus.samples.jmsqueuequickstart;

import com.azure.core.amqp.implementation.ConnectionStringProperties;
import org.apache.commons.cli.*;
import org.apache.log4j.*;

import javax.jms.*;
import javax.naming.Context;
import javax.naming.InitialContext;
import java.util.Hashtable;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Function;

/**
 * This sample demonstrates how to send messages from a JMS queue producer into
 * an Azure Service Bus queue and receive them with a JMS message consumer.
 * JMS queue. 
 */
public class JmsQueueQuickstart {

    // Number of messages to send
    private static int totalSend = 10;
    //Tracking counter for how many messages have been received; used as termination condition
    private static AtomicInteger totalReceived = new AtomicInteger(0);
    // log4j logger 
    private static Logger logger = Logger.getRootLogger();

    public void run(String connectionString) throws Exception {

        // The connection string properties is the only part of the azure-servicebus SDK library
        // we use in this JMS sample and for the purpose of robustly parsing the Service Bus 
        // connection string. 
        ConnectionStringProperties csb = new ConnectionStringProperties(connectionString);
        
        // Set up JNDI context
        Hashtable<String, String> hashtable = new Hashtable<>();
        hashtable.put("connectionfactory.SBCF", "amqps://" + csb.getEndpoint().getHost() + "?amqp.idleTimeout=120000&amqp.traceFrames=true");
        hashtable.put("queue.QUEUE", "BasicQueue");
        hashtable.put(Context.INITIAL_CONTEXT_FACTORY, "org.apache.qpid.jms.jndi.JmsInitialContextFactory");
        Context context = new InitialContext(hashtable);
        ConnectionFactory cf = (ConnectionFactory) context.lookup("SBCF");
        
        // Look up queue
        Destination queue = (Destination) context.lookup("QUEUE");

        // We create a scope here so we can use the same set of local variables cleanly 
        // again to show the receive side separately with minimal clutter.
        {
            // Create connection
            Connection connection = cf.createConnection(csb.getSharedAccessKeyName(), csb.getSharedAccessKey());
            // Create session, no transaction, client ack
            Session session = connection.createSession(false, Session.CLIENT_ACKNOWLEDGE);

            // Create producer
            MessageProducer producer = session.createProducer(queue);

            // Send messages
            for (int i = 0; i < totalSend; i++) {
                BytesMessage message = session.createBytesMessage();
                message.writeBytes(String.valueOf(i).getBytes());
                producer.send(message);
                System.out.printf("Sent message %d.\n", i + 1);
            }

            producer.close();
            session.close();
            connection.stop();
            connection.close();
        }

        {
            // Create connection
            Connection connection = cf.createConnection(csb.getSharedAccessKeyName(), csb.getSharedAccessKey());
            connection.start();
            // Create session, no transaction, client ack
            Session session = connection.createSession(false, Session.CLIENT_ACKNOWLEDGE);
            // Create consumer
            MessageConsumer consumer = session.createConsumer(queue);
            // Create a listener callback to receive the messages
            consumer.setMessageListener(message -> {
                try {
                    // Received message is passed to callback
                    System.out.printf("Received message %d with sq#: %s\n",
                            totalReceived.incrementAndGet(), // increments the tracking counter
                            message.getJMSMessageID());
                    message.acknowledge();
                } catch (Exception e) {
                    logger.error(e);
                }
            });

            // Wait on the main thread until all sent messages have been received
            while (totalReceived.get() < totalSend) {
                Thread.sleep(1000);
            }
            consumer.close();
            session.close();
            connection.stop();
            connection.close();
        }

        System.out.printf("Received all messages, exiting the sample.\n");
        System.out.printf("Closing queue client.\n");
    }

    public static void main(String[] args) {

        System.exit(runApp(args, (connectionString) -> {
            JmsQueueQuickstart app = new JmsQueueQuickstart();
            try {
                app.run(connectionString);
                return 0;
            } catch (Exception e) {
                System.out.printf("%s", e.toString());
                return 1;
            }
        }));
    }

    static final String SB_SAMPLES_CONNECTIONSTRING = "SB_SAMPLES_CONNECTIONSTRING";

    public static int runApp(String[] args, Function<String, Integer> run) {
        try {

            String connectionString = null;

            // Parse connection string from command line
            Options options = new Options();
            options.addOption(new Option("c", true, "Connection string"));
            CommandLineParser clp = new DefaultParser();
            CommandLine cl = clp.parse(options, args);
            if (cl.getOptionValue("c") != null) {
                connectionString = cl.getOptionValue("c");
            }

            // Get overrides from the environment
            String env = System.getenv(SB_SAMPLES_CONNECTIONSTRING);
            if (env != null) {
                connectionString = env;
            }

            if (connectionString == null) {
                HelpFormatter formatter = new HelpFormatter();
                formatter.printHelp("run jar with", "", options, "", true);
                return 2;
            }
            return run.apply(connectionString);
        } catch (Exception e) {
            System.out.printf("%s", e.toString());
            return 3;
        }
    }
}
```

### Run the application

Pass the **Connection String** from the Shared Access Policies to run the application.
The following output is of the form running the application:

```Output
> mvn clean package
>java -jar ./target/jmsqueuequickstart-1.0.0-jar-with-dependencies.jar -c "<CONNECTION_STRING>"

Sent message 1.
Sent message 2.
Sent message 3.
Sent message 4.
Sent message 5.
Sent message 6.
Sent message 7.
Sent message 8.
Sent message 9.
Sent message 10.
Received message 1 with sq#: ID:7f6a7659-bcdf-4af6-afc1-4011e2ddcb3c:1:1:1-1
Received message 2 with sq#: ID:7f6a7659-bcdf-4af6-afc1-4011e2ddcb3c:1:1:1-2
Received message 3 with sq#: ID:7f6a7659-bcdf-4af6-afc1-4011e2ddcb3c:1:1:1-3
Received message 4 with sq#: ID:7f6a7659-bcdf-4af6-afc1-4011e2ddcb3c:1:1:1-4
Received message 5 with sq#: ID:7f6a7659-bcdf-4af6-afc1-4011e2ddcb3c:1:1:1-5
Received message 6 with sq#: ID:7f6a7659-bcdf-4af6-afc1-4011e2ddcb3c:1:1:1-6
Received message 7 with sq#: ID:7f6a7659-bcdf-4af6-afc1-4011e2ddcb3c:1:1:1-7
Received message 8 with sq#: ID:7f6a7659-bcdf-4af6-afc1-4011e2ddcb3c:1:1:1-8
Received message 9 with sq#: ID:7f6a7659-bcdf-4af6-afc1-4011e2ddcb3c:1:1:1-9
Received message 10 with sq#: ID:7f6a7659-bcdf-4af6-afc1-4011e2ddcb3c:1:1:1-10
Received all messages, exiting the sample.
Closing queue client.

```

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

JMS topics allow clients to dynamically create nondurable and durable subscribers that optionally allow filtering  messages with message selectors. These unshared entities aren't supported by Service Bus. The SQL filter rule syntax for Service Bus is similar to the message selector syntax supported by JMS.

The JMS topic publisher side is compatible with Service Bus, as shown in this sample, but dynamic subscribers aren't. The following topology-related JMS APIs aren't supported with Service Bus.

## Unsupported features and restrictions

The following restrictions exist when you use JMS over AMQP 1.0 with Service Bus, namely:

* Only one **MessageProducer** or **MessageConsumer** object is allowed per session. If you need to create multiple **MessageProducer** or **MessageConsumer** objects in an application, create a dedicated session for each of them.
* Volatile topic subscriptions aren't currently supported.
* **MessageSelector** objects aren't currently supported.
* Distributed transactions aren't supported, but transacted sessions are supported.

Service Bus splits the control plane from the data plane, so it doesn't support several of
JMS's dynamic topology functions.

| Unsupported method          | Replace with                                                                             |
|-----------------------------|------------------------------------------------------------------------------------------|
| createDurableSubscriber     | Create a topic subscription that ports the message selector.                                |
| createDurableConsumer       | Create a topic subscription that ports the message selector.                                |
| createSharedConsumer        | Service Bus topics are always shareable. See the section "JMS topics vs. Service Bus topics."                                    |
| createSharedDurableConsumer | Service Bus topics are always shareable. See the section "JMS topics vs. Service Bus topics."                                      |
| createTemporaryTopic        | Create a topic via the management API, tools, or the portal with *AutoDeleteOnIdle* set to an expiration period. |
| createTopic                 | Create a topic via the management API, tools, or the portal.                                         |
| unsubscribe                 | Delete the topic management API, tools, or portal.                                            |
| createBrowser               | Unsupported. Use the Peek() functionality of the Service Bus API.                         |
| createQueue                 | Create a queue via the management API, tools, or the portal.                                           | 
| createTemporaryQueue        | Create a queue via the management API, tools, or the portal with *AutoDeleteOnIdle* set to an expiration period. |
| receiveNoWait               | Use the receive() method provided by the Service Bus SDK and specify a very low or zero timeout. |

## Summary

This article showed you how to use Service Bus brokered messaging features, such as queues and publish or subscribe topics, from Java by using the popular JMS API and AMQP 1.0.

You can also use Service Bus AMQP 1.0 from other languages, such as .NET, C, Python, and PHP. Components built by using these different languages can exchange messages reliably and at full fidelity by using the AMQP 1.0 support in Service Bus.

## Next steps

* [AMQP 1.0 support in Azure Service Bus](service-bus-amqp-overview.md)
* [Use AMQP 1.0 with the Service Bus .NET API](./service-bus-amqp-dotnet.md)
* [Service Bus AMQP 1.0 developer's guide](service-bus-amqp-dotnet.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
* [Java developer center](https://azure.microsoft.com/develop/java/)
