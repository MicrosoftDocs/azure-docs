<div chunk="../chunks/article-left-menu.md" />

# How to use the Java Message Service (JMS) API with Service Bus & AMQP 1.0

# Introduction

The Advanced Message Queuing Protocol (AMQP) 1.0 is an efficient, reliable, wire-level messaging protocol that can be used to build robust, cross-platform, messaging applications. AMQP 1.0 support was added to Windows Azure Service Bus as a preview feature in October 2012. It is expected to transition to General Availability (GA) in the first half of 2013.

The addition of AMQP 1.0 means that it’s now possible to leverage the queuing and publish/subscribe brokered messaging features of Service Bus from a range of platforms using an efficient binary protocol. Furthermore, you can build applications comprised of components built using a mix of languages, frameworks and operating systems.

This How-To Guide explains how to use the Service Bus brokered messaging features (Queues and publish/subscribe Topics) from Java applications using the popular Java Message Service (JMS) API standard.

# 

# Getting started with Service Bus


*    **_Creating Azure account_**
*    **_Create a Service Bus queue via the portal_**


## Downloading the AMQP 1.0 JMS client library

The Apache Qpid JMS AMQP 1.0 client library is available for download from: [http://people.apache.org/~rgodfrey/qpid-java-amqp-1-0-SNAPSHOT/0.19/qpid-amqp-1-0-SNAPSHOT.zip](http://people.apache.org/~rgodfrey/qpid-java-amqp-1-0-SNAPSHOT/0.19/qpid-amqp-1-0-SNAPSHOT.zip)

This zip archive contains the following eight files:

*    geronimo-jms_1.1_spec-1.0.jar
*    qpid-amqp-1-0-client-0.19-sources.jar
*    qpid-amqp-1-0-client-0.19.jar
*    qpid-amqp-1-0-client-jms-0.19-sources.jar
*    qpid-amqp-1-0-client-jms-0.19.jar
*    qpid-amqp-1-0-common-0.19-sources.jar
*    qpid-amqp-1-0-common-0.19.jar
*    svnversion

The following four JAR files need to be added to the Java CLASSPATH when building and running JMS applications with Service Bus:
*    geronimo-jms_1.1_spec-1.0.jar
*    qpid-amqp-1-0-client-0.19.jar
*    qpid-amqp-1-0-client-jms-0.19.jar
*    qpid-amqp-1-0-common-0.19.jar

## Coding Java applications

## 

## ***Java Naming and Directory Interface (JNDI)***

JMS uses the Java Naming and Directory Interface (JNDI) to create a separation between logical names and physical names. Two types of JMS object that are resolved using JNDI, namely ConnectionFactory and Destination. JNDI uses a provider model in to which different directory services can be plugged in to handle name resolution duties. The Apache Qpid JMS AMQP 1.0 library comes with a very simple properties file based JNDI Provider that is configured using a simple text file.

The Qpid Properties File JNDI Provider is configured using a properties file of the following format:

<pre><code>
\# servicebus.properties – sample JNDI configuration

\# Register a ConnectionFactory in JNDI using the form:
\# connectionfactory.[jndi_name] = [ConnectionURL]

connectionfactory.SBConnectionFactory = \
  amqps://[username]:[password]@[namespace].servicebus.windows.net

\# Register some queues in JNDI using the form
\# queue.[jndi_name] = [physical_name]
queue.SendToEntity = queue1
</code></pre>

### **Configuring the ConnectionFactory**

The entry used to define a ConnectionFactory in the Qpid Properties File JNDI Provider is of the following format:
<pre><code>
connectionfactory.[jndi_name] = [ConnectionURL]
</pre></code>

Where [jndi_name] and [ConnectionURL] have the following meanings:

[jndi_name]-The logical name of the ConnectionFactory. This is the name that will be resolved in the Java application using the JNDI IntialContext.lookup() method.

[ConnectionURL]-A URL that provides the JMS library with the information required to the AMQP broker.



The format of the ConnectionURL is as follows:
<pre><code>
amqps://[username]:[password]@[namespace].servicebus.windows.net
</pre></code>
Where the [username], [password] and [namespace] variables have the following meanings:

[username]-The Service Bus issuer name obtained from the Azure Portal.

[password]-URL encoded form of the Service Bus issuer key obtained from the Azure Portal.



Notes:
*    This URL encoding must be done manually.
*    A useful URL encoding utility is available at: [http://www.w3schools.com/tags/ref_urlencode.asp](http://www.w3schools.com/tags/ref_urlencode.asp)

[namespace]-The Service Bus namespace obtained from the Azure Portal.


So, for example, if the information obtained from the Service Bus portal is as follows:

Namespace-foo.servicebus.windows.net

Issuer name-owner

Issuer key-j9VYv1q33Ea+cbahWsHFYnLkEzrF0yA5SAqcLNvU7KM=

Then in order to define a ConnectionFactory named “SBConnectionFactory” the configuration string would be as follows:
<pre><code>
connectionfactory.SBConnectionFactory = \
amqps://owner:j9VYv1q33Ea%2BcbahWsHFYnLkEzrF0yA5SAqcLNvU7KM%3D@foo.servicebus.windows.net
</pre></code>

### **Configuring Destinations**

The entry used to define a Destination in the Qpid Properties File JNDI Provider is of the following format:

queue.[jndi_name] = [physical_name]

Where [jndi_name] and [physical_name] have the following meanings:

[jndi_name]-The logical name of the Destination. This is the name that will be resolved in the Java application using the JNDI IntialContext.lookup() method.

[physical_name]-The name of the Service Bus entity to which the application wishes to send or receive messages.



Notes:
*    This can be a Service Bus Queue, Topic or Subscription. Messages can be sent to Queues and Topics and received from Queues and Subscriptions.
*    When receiving from a Subscription the format of the [physical_name] is [topic_name]/subscriptions/[subscription_name]. So if an application was to receive messages from a subscription named “hardware” on a topic “orders” then the [physical_name] would be “orders/subscriptions/hardware.”

Note that regardless of whether the application is interacting with a Queue, Topic or a Subscription, the properties file entry is always of the form “queue.[jndi_name] = [physical_name]” never “topic.[jndi_name] = [physical_name]” or “subscription.[jndi_name] = [physical_name].”

So, to define a logical JMS Destination named “orders,” that mapped to a Service Bus Queue named “purchase_orders,” the entry in the properties file would be as follows:

queue.orders = purchase_orders


## **Writing the JMS application**

There are no special APIs or options required when using JMS with Service Bus. However there are a few restrictions that will be covered later. Like any JMS application, the first thing required is configuration of the JNDI environment so as to be able to resolve a ConnectionFactory and Destinations.

### **Configuring the JNDI InitialContext**

The JNDI environment is configured by passing in a hashtable of configuration information into the constructor of the javax.naming.InitialContext class. The two required elements in the hashtable are the class name of the Initial Context Factory and the Provider URL. The code snippet below shows how to configure the JNDI environment to use the Qpid properties file based JNDI Provider with a properties file named “servicebus.properties.”

<pre><code>
    Hashtable<String, String> env = new Hashtable<String, String>(); 
    env.put(Context.INITIAL_CONTEXT_FACTORY,
            "org.apache.qpid.amqp_1_0.jms.jndi.PropertiesFileInitialContextFactory"); 
    env.put(Context.PROVIDER_URL, "servicebus.properties"); 
    InitialContext context = new InitialContext(env); 
</pre></code>

## **A simple JMS application using a Service Bus Queue**

The following simple example program sends JMS BytesMessages to a Service Bus Queue with the JNDI logical name of QUEUE and receives the messages back.

<pre><code>
// SimpleSenderReceiver.java

import javax.jms.*;
import javax.naming.Context;
import javax.naming.InitialContext;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Hashtable;

public class SimpleSenderReceiver implements MessageListener {
    private Connection connection;
    private Session sendSession;
    private Session receiveSession;
    private MessageProducer sender;
    private MessageConsumer receiver;
    private static boolean runReceiver = true;
    public static void main(String[] args) {
        try {
            if ( (args.length > 0) && args[0].equalsIgnoreCase("sendonly") )
                runReceiver = false;
            SimpleSenderReceiver simpleSenderReceiver = new
                    SimpleSenderReceiver();
            System.out.println("Press [enter] to send a message." +
                    " Type 'exit' + [enter] to quit.");
            BufferedReader commandLine = new
                    java.io.BufferedReader(new InputStreamReader(System.in));
            while (true) {
                String s = commandLine.readLine();
                if (s.equalsIgnoreCase("exit")) {
                    simpleSenderReceiver.close();
                    System.exit(0);
                } else
                    simpleSenderReceiver.sendMessage();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public SimpleSenderReceiver() throws Exception {
        // Configure JNDI environment
        Hashtable<String, String> env = new Hashtable<String, String>();
        env.put(Context.INITIAL_CONTEXT_FACTORY,
        "org.apache.qpid.amqp_1_0.jms.jndi.PropertiesFileInitialContextFactory");
        env.put(Context.PROVIDER_URL, "servicebus.properties");
        Context context = new InitialContext(env);

        // Lookup ConnectionFactory and Queue
        ConnectionFactory cf = (ConnectionFactory) context.lookup
                ("SBCONNECTIONFACTORY");
        Destination queue = (Destination) context.lookup("QUEUE");

        // Create Connection
        connection = cf.createConnection();

        // Create sender-side Session and MessageProducer
        sendSession = connection.createSession(false,
                Session.AUTO_ACKNOWLEDGE);

        sender = sendSession.createProducer(queue);
        if (runReceiver)
        {
            // Create receiver-side Session, MessageConsumer,
            // and MessageListener
            receiveSession = connection.createSession(false,
                Session.CLIENT_ACKNOWLEDGE);
            receiver = receiveSession.createConsumer(queue);
            receiver.setMessageListener(this);
            connection.start();
        }
    }

    public void close() throws JMSException {
        connection.close();
    }

    public void onMessage(Message message) {
        try {
            System.out.println("Received message with JMSMessageID = " +
                    message.getJMSMessageID());
            message.acknowledge();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void sendMessage() throws JMSException {
        TextMessage message = sendSession.createTextMessage();
        message.setText("Test AMQP message from JMS");
        sender.send(message);
        System.out.println("Sent message with JMSMessageID = " + message
                .getJMSMessageID());
    }
}
</pre></code>
## **Running the application**

Running the application produces output of the form:

<pre><code>
\> java SimpleSenderReceiver 

Press [enter] to send a message. Type 'exit' + [enter] to quit.

Sent message with JMSMessageID = ID:307c84b6-23a2-45ae-93ba-074f4e882b0c
Received message with JMSMessageID = ID:307c84b6-23a2-45ae-93ba-074f4e882b0c

Sent message with JMSMessageID = ID:92f13538-9ed7-417c-81e3-bf13f205637b
Received message with JMSMessageID = ID:92f13538-9ed7-417c-81e3-bf13f205637b

Sent message with JMSMessageID = ID:ccbecfed-f83d-46ca-aab5-cb379961474b
Received message with JMSMessageID = ID:ccbecfed-f83d-46ca-aab5-cb379961474b

exit
</pre></code>
# **Cross-platform messaging between JMS and .NET**

So far this guide has shown how to send messages to Service Bus using JMS and also how to receive those messages using JMS. However, one of the key benefits of AMQP 1.0 is that it enables applications to be built from components built using different languages with messages exchanged messages reliably and at full-fidelity.

Using the sample JMS application described above and a similar .NET application taken from a companion guide (How to use AMQP 1.0 with the .NET Service Bus .NET API), it’s possible to exchange messages between .NET and Java. 

To show JMS to .NET:
*    Start the above Java sample with the “sendonly” command line argument. In this mode the application will not receive messages from the queue, it will only send.
*    Start the .NET sample app without any command line arguments.
*    Press ‘enter’ a few times in the Java application console which will cause messages to be sent.
*    These messages will be received by the .NET application.

To show .NET to JMS:
*    Start the above Java sample app without any command line arguments.
*    Start the .NET sample with the “sendonly” command line argument. In this mode the application will not receive messages from the queue, it will only send.
*    Press ‘enter’ a few times in the .NET application console which will cause messages to be sent.
*    These messages will be received by the Java application.

More information on the details of cross-platform messaging using Service Bus and AMQP 1.0 can be found in the Service Bus AMQP Preview Developers Guide.

# **Unsupported features and restrictions**

There are several JMS features that are not currently supported with this preview release of AMQP 1.0 support in Service Bus, namely:
*    Only one MessageProducer or MessageConsumer is allowed per Session. If you need to create multiple MessageProducers or MessageConsumers in an application then create dedicated Sessions for each of them.
*    The Topic programming model, i.e., TopicConnection, TopicSession, TopicPublisher, TopicSubscriber is not supported. Use the generic Connection, Session, MessageProducer, MessageConsumer APIs with Service Bus Queues, Topics and Subscriptions.
*    MessageSelectors are not supported.
*    Temporary destinations, i.e., TemporaryQueue, TemporaryTopic are not supported, along with the QueueRequestor and TopicRequestor APIs that use them.
*    Transacted sessions
*    Distributed transactions

# **Summary**

This How-To Guide has shown how to access the Service Bus brokered messaging features (queues and publish/subscribe topics) from Java using the popular JMS API and AMQP 1.0. The AMQP 1.0 support is available in preview today and is expected to transition to General Availability (GA) in the first half of 2013.

The Service Bus AMQP 1.0 support can also be used from other languages including .NET, C, Python, and PHP. Components built using these different languages can exchange messages reliably and at full-fidelity using the AMQP 1.0 in Service Bus. Further information is provided in the Service Bus AMQP 1.0 Preview Developers Guide.

# **Important Notice**

Support for the AMQP 1.0 protocol in the Windows Azure Service Bus (“AMQP Preview”) is provided as a Preview feature, and is governed by the [Azure Preview terms of use](http://www.windowsazure.com/en-us/support/legal/preview-terms-of-use/). Specifically, note that:

1.  The Service Bus SLA does not apply to the AMQP Preview;
2.  Messages or other data that are placed into Service Bus using the AMQP protocol may not be preserved during the AMQP Preview or at the end of the AMQP Preview;
3.  We may make breaking changes to AMPQ related APIs or protocols during or at the end of the AMQP Preview.


# **Further information**
*    AMQP 1.0 support in Azure Service Bus [link to article previously submitted]
*    How to use AMQP 1.0 with the .NET Service Bus .NET API [link to sister article]
*    Service Bus AMQP Preview Developers Guide[ included in the Service Bus AMQP Preview NuGet package]
