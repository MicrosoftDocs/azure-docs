---
title: How to use AMQP 1.0 with the Java Service Bus API | Microsoft Docs
description: How to use the Java Message Service (JMS) with Azure Service Bus and Advanced Message Queuing Protodol (AMQP) 1.0.
services: service-bus-messaging
documentationcenter: java
author: spelluru
manager: timlt
editor: ''

ms.assetid: be766f42-6fd1-410c-b275-8c400c811519
ms.service: service-bus-messaging
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: Java
ms.topic: article
ms.date: 08/10/2018
ms.author: spelluru

---
# How to use the Java Message Service (JMS) API with Service Bus and AMQP 1.0
The Advanced Message Queuing Protocol (AMQP) 1.0 is an efficient, reliable, wire-level messaging protocol that you can use to build robust, cross-platform messaging applications.

Support for AMQP 1.0 in Service Bus means that you can use the queuing and publish/subscribe brokered messaging features from a range of platforms using an efficient binary protocol. Furthermore, you can build applications comprised of components built using a mix of languages, frameworks, and operating systems.

This article explains how to use Service Bus messaging features (queues and publish/subscribe topics) from Java applications using the popular Java Message Service (JMS) API standard. There is a [companion article](service-bus-amqp-dotnet.md) that explains how to do the same using the Service Bus .NET API. You can use these two guides together to learn about cross-platform messaging using AMQP 1.0.

## Get started with Service Bus
This guide assumes that you already have a Service Bus namespace containing a queue named **queue1**. If you do not, then you can [create the namespace and queue](service-bus-create-namespace-portal.md) using the [Azure portal](https://portal.azure.com). For more information about how to create Service Bus namespaces and queues, see [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md).

> [!NOTE]
> Partitioned queues and topics also support AMQP. For more information, see [Partitioned messaging entities](service-bus-partitioning.md) and [AMQP 1.0 support for Service Bus partitioned queues and topics](service-bus-partitioned-queues-and-topics-amqp-overview.md).
> 
> 

## Downloading the AMQP 1.0 JMS client library
For information about where to download the latest version of the Apache Qpid JMS AMQP 1.0 client library, visit [https://qpid.apache.org/download.html](https://qpid.apache.org/download.html).

You must add the following four JAR files from the Apache Qpid JMS AMQP 1.0 distribution archive to the Java CLASSPATH when building and running JMS applications with Service Bus:

* geronimo-jms\_1.1\_spec-1.0.jar
* qpid-jms-client-[version].jar

> ![NOTE]
> JMS JAR names and versions may have changed. For details, see [Qpid JMS - AMQP 1.0](https://qpid.apache.org/maven.html#qpid-jms-amqp-10).

## Coding Java applications
### Java Naming and Directory Interface (JNDI)
JMS uses the Java Naming and Directory Interface (JNDI) to create a separation between logical names and physical names. Two types of JMS objects are resolved using JNDI: ConnectionFactory and Destination. JNDI uses a provider model into which you can plug different directory services to handle name resolution duties. The Apache Qpid JMS AMQP 1.0 library comes with a simple properties file-based JNDI Provider that is configured using a properties file of the following format:

```
# servicebus.properties - sample JNDI configuration

# Register a ConnectionFactory in JNDI using the form:
# connectionfactory.[jndi_name] = [ConnectionURL]
connectionfactory.SBCF = amqps://[SASPolicyName]:[SASPolicyKey]@[namespace].servicebus.windows.net

# Register some queues in JNDI using the form
# queue.[jndi_name] = [physical_name]
# topic.[jndi_name] = [physical_name]
queue.QUEUE = queue1
```

#### Configure the ConnectionFactory
The entry used to define a **ConnectionFactory** in the Qpid properties file JNDI provider is of the following format:

```
connectionfactory.[jndi_name] = [ConnectionURL]
```

Where **[jndi_name]** and **[ConnectionURL]** have the following meanings:

* **[jndi_name]**: The logical name of the ConnectionFactory. This is the name that will be resolved in the Java application using the JNDI IntialContext.lookup() method.
* **[ConnectionURL]**: A URL that provides the JMS library with the information required to the AMQP broker.

The format of the **ConnectionURL** is as follows:

```
amqps://[SASPolicyName]:[SASPolicyKey]@[namespace].servicebus.windows.net
```
Where **[namespace]**, **[SASPolicyName]** and **[SASPolicyKey]** have the following meanings:

* **[namespace]**: The Service Bus namespace.
* **[SASPolicyName]**: The Queue Shared Access Signature policy name.
* **[SASPolicyKey]**: The Queue Shared Access Signature policy key.

> [!NOTE]
> You must URL-encode the password manually. A useful URL-encoding utility is available at [http://www.w3schools.com/tags/ref_urlencode.asp](http://www.w3schools.com/tags/ref_urlencode.asp).
> 
> 

#### Configure destinations
The entry used to define a destination in the Qpid properties file JNDI provider is of the following format:

```
queue.[jndi_name] = [physical_name]
```

or

```
topic.[jndi_name] = [physical_name]
```

Where **[jndi\_name]** and **[physical\_name]** have the following meanings:

* **[jndi_name]**: The logical name of the destination. This is the name that will be resolved in the Java application using the JNDI IntialContext.lookup() method.
* **[physical_name]**: The name of the Service Bus entity to which the application sends or receives messages.

> [!NOTE]
> When receiving from a Service Bus topic subscription, the physical name specified in JNDI should be the name of the topic. The subscription name is provided when the durable subscription is created in the JMS application code. The [Service Bus AMQP 1.0 Developer's Guide](service-bus-amqp-dotnet.md) provides more details on working with Service Bus topics from JMS.
> 
> 

### Write the JMS application
There are no special APIs or options required when using JMS with Service Bus. However, there are a few restrictions that will be covered later. As with any JMS application, the first thing required is configuration of the JNDI environment, to be able to resolve a **ConnectionFactory** and destinations.

#### Configure the JNDI InitialContext
The JNDI environment is configured by passing a hashtable of configuration information into the constructor of the javax.naming.InitialContext class. The two required elements in the hashtable are the class name of the Initial Context Factory and the Provider URL. The following code shows how to configure the JNDI environment to use the Qpid properties file based JNDI Provider with a properties file named **servicebus.properties**.

```java
// set up JNDI context
Hashtable<String, String> hashtable = new Hashtable<>();
hashtable.put("connectionfactory.SBCF", "amqps://" + csb.getEndpoint().getHost() + "?amqp.idleTimeout=120000&amqp.traceFrames=true");
hashtable.put("queue.QUEUE", "BasicQueue");
hashtable.put(Context.INITIAL_CONTEXT_FACTORY, "org.apache.qpid.jms.jndi.JmsInitialContextFactory");
Context context = new InitialContext(hashtable);
``` 

### A simple JMS application using a Service Bus queue
The following example program sends JMS TextMessages to a Service Bus queue with the JNDI logical name of QUEUE, and receives the messages back.

You can all access all the source code and configuration information from the [Azure Service Bus Samples JMS Queue Quick Start](https://github.com/Azure/azure-service-bus/tree/master/samples/Java/qpid-jms-client/JmsQueueQuickstart)

```java
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

package com.microsoft.azure.servicebus.samples.jmsqueuequickstart;

import com.microsoft.azure.servicebus.primitives.ConnectionStringBuilder;
import org.apache.commons.cli.*;
import org.apache.log4j.*;

import javax.jms.*;
import javax.naming.Context;
import javax.naming.InitialContext;
import java.util.Hashtable;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Function;

/**
 * This sample demonstrates how to send messages from a JMS Queue producer into
 * an Azure Service Bus Queue, and receive them with a JMS message consumer.
 * JMS Queue. 
 */
public class JmsQueueQuickstart {

    // Number of messages to send
    private static int totalSend = 10;
    //Tracking counter for how many messages have been received; used as termination condition
    private static AtomicInteger totalReceived = new AtomicInteger(0);
    // log4j logger 
    private static Logger logger = Logger.getRootLogger();

    public void run(String connectionString) throws Exception {

        // The connection string builder is the only part of the azure-servicebus SDK library
        // we use in this JMS sample and for the purpose of robustly parsing the Service Bus 
        // connection string. 
        ConnectionStringBuilder csb = new ConnectionStringBuilder(connectionString);
        
        // set up JNDI context
        Hashtable<String, String> hashtable = new Hashtable<>();
        hashtable.put("connectionfactory.SBCF", "amqps://" + csb.getEndpoint().getHost() + "?amqp.idleTimeout=120000&amqp.traceFrames=true");
        hashtable.put("queue.QUEUE", "BasicQueue");
        hashtable.put(Context.INITIAL_CONTEXT_FACTORY, "org.apache.qpid.jms.jndi.JmsInitialContextFactory");
        Context context = new InitialContext(hashtable);
        ConnectionFactory cf = (ConnectionFactory) context.lookup("SBCF");
        
        // Look up queue
        Destination queue = (Destination) context.lookup("QUEUE");

        // we create a scope here so we can use the same set of local variables cleanly 
        // again to show the receive side separately with minimal clutter
        {
            // Create Connection
            Connection connection = cf.createConnection(csb.getSasKeyName(), csb.getSasKey());
            // Create Session, no transaction, client ack
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
            // Create Connection
            Connection connection = cf.createConnection(csb.getSasKeyName(), csb.getSasKey());
            connection.start();
            // Create Session, no transaction, client ack
            Session session = connection.createSession(false, Session.CLIENT_ACKNOWLEDGE);
            // Create consumer
            MessageConsumer consumer = session.createConsumer(queue);
            // create a listener callback to receive the messages
            consumer.setMessageListener(message -> {
                try {
                    // receives message is passed to callback
                    System.out.printf("Received message %d with sq#: %s\n",
                            totalReceived.incrementAndGet(), // increments the tracking counter
                            message.getJMSMessageID());
                    message.acknowledge();
                } catch (Exception e) {
                    logger.error(e);
                }
            });

            // wait on the main thread until all sent messages have been received
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

            // parse connection string from command line
            Options options = new Options();
            options.addOption(new Option("c", true, "Connection string"));
            CommandLineParser clp = new DefaultParser();
            CommandLine cl = clp.parse(options, args);
            if (cl.getOptionValue("c") != null) {
                connectionString = cl.getOptionValue("c");
            }

            // get overrides from the environment
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
Pass the **Connection String** from the Shared Acccess Policies to run the application.
Below is the output of the form by running the Application:

```
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
Here is how an AMQP disposition translates to a Service Bus operation:

```
ACCEPTED = 1; -> Complete()
REJECTED = 2; -> DeadLetter()
RELEASED = 3; (just unlock the message in service bus, will then get redelivered)
MODIFIED_FAILED = 4; -> Abandon() which increases delivery count
MODIFIED_FAILED_UNDELIVERABLE = 5; -> Defer()
```

## Cross-platform messaging between JMS and .NET
This guide showed how to send and receive messages to and from Service Bus using JMS. However, one of the key benefits of AMQP 1.0 is that it enables applications to be built from components written in different languages, with messages exchanged reliably and at full fidelity.

Using the sample JMS application described above and a similar .NET application taken from a companion article, [Using Service Bus from .NET with AMQP 1.0](service-bus-amqp-dotnet.md), you can exchange messages between .NET and Java. Read this article for more information about the details of cross-platform messaging using Service Bus and AMQP 1.0.


## Unsupported features and restrictions
The following restrictions exist when using JMS over AMQP 1.0 with Service Bus, namely:

* Only one **MessageProducer** or **MessageConsumer** is allowed per **Session**. If you need to create multiple **MessageProducers** or **MessageConsumers** in an application, create a dedicated **Session** for each of them.
* Volatile topic subscriptions are not currently supported.
* **MessageSelectors** are not currently supported.
* Temporary destinations; for example, **TemporaryQueue**, **TemporaryTopic** are not currently supported, along with the **QueueRequestor** and **TopicRequestor** APIs that use them.
* Transacted sessions and distributed transactions are not supported.

## Summary
This how-to guide showed how to use Service Bus brokered messaging features (queues and publish/subscribe topics) from Java using the popular JMS API and AMQP 1.0.

You can also use Service Bus AMQP 1.0 from other languages, including .NET, C, Python, and PHP. Components built using these different languages can exchange messages reliably and at full fidelity using the AMQP 1.0 support in Service Bus.

## Next steps
* [AMQP 1.0 support in Azure Service Bus](service-bus-amqp-overview.md)
* [How to use AMQP 1.0 with the Service Bus .NET API](service-bus-dotnet-advanced-message-queuing.md)
* [Service Bus AMQP 1.0 Developer's Guide](service-bus-amqp-dotnet.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
* [Java Developer Center](https://azure.microsoft.com/develop/java/)

