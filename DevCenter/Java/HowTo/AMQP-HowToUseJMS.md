
# How to use the Java Message Service (JMS) API with Service Bus & AMQP 1.0

## Introduction

The Advanced Message Queuing Protocol (AMQP) 1.0 is an efficient, reliable, wire-level messaging protocol that can be used to build robust, cross-platform, messaging applications. AMQP 1.0 support was added to Windows Azure Service Bus as a preview feature in October 2012. It is expected to transition to General Availability (GA) in the first half of 2013.

The addition of AMQP 1.0 means that it’s now possible to leverage the queuing and publish/subscribe brokered messaging features of Service Bus from a range of platforms using an efficient binary protocol. Furthermore, you can build applications comprised of components built using a mix of languages, frameworks and operating systems.

This How-To Guide explains how to use the Service Bus brokered messaging features (Queues and publish/subscribe Topics) from Java applications using the popular Java Message Service (JMS) API standard.

## Getting started with Service Bus

This guide assumes that you already have a Service Bus namespace. If not, then this can be easily created using the [Windows Azure Management Portal](http://manage.windowsazure.com). For a detailed walk-through of how to create Service Bus namespaces and Queues, refer to the How-To Guide entitled “[How to Use Service Bus Queues.](https://www.windowsazure.com/en-us/develop/net/how-to-guides/service-bus-queues/)”

## Downloading the AMQP 1.0 JMS client library

The Apache Qpid JMS AMQP 1.0 client library is available for download from: [http://people.apache.org/~rgodfrey/qpid-java-amqp-1-0-SNAPSHOT/0.19/qpid-amqp-1-0-SNAPSHOT.zip](http://people.apache.org/~rgodfrey/qpid-java-amqp-1-0-SNAPSHOT/0.19/qpid-amqp-1-0-SNAPSHOT.zip)

This zip archive contains the following eight files:

*    geronimo-jms\_1.1\_spec-1.0.jar
*    qpid-amqp-1-0-client-0.19-sources.jar
*    qpid-amqp-1-0-client-0.19.jar
*    qpid-amqp-1-0-client-jms-0.19-sources.jar
*    qpid-amqp-1-0-client-jms-0.19.jar
*    qpid-amqp-1-0-common-0.19-sources.jar
*    qpid-amqp-1-0-common-0.19.jar
*    svnversion

The following four JAR files need to be added to the Java CLASSPATH when building and running JMS applications with Service Bus:

*    geronimo-jms\_1.1\_spec-1.0.jar
*    qpid-amqp-1-0-client-0.19.jar
*    qpid-amqp-1-0-client-jms-0.19.jar
*    qpid-amqp-1-0-common-0.19.jar

## Coding Java applications

### Java Naming and Directory Interface (JNDI)
JMS uses the Java Naming and Directory Interface (JNDI) to create a separation between logical names and physical names. Two types of JMS object that are resolved using JNDI, namely ConnectionFactory and Destination. JNDI uses a provider model in to which different directory services can be plugged in to handle name resolution duties. The Apache Qpid JMS AMQP 1.0 library comes with a simple properties file based JNDI Provider that is configured using a text file.

The Qpid Properties File JNDI Provider is configured using a properties file of the following format:

	# servicebus.properties – sample JNDI configuration
	
	# Register a ConnectionFactory in JNDI using the form:
	# connectionfactory.[jndi_name] = [ConnectionURL]
	connectionfactory.SBCONNECTIONFACTORY = amqps://[username]:[password]@[namespace].servicebus.windows.net
	
	# Register some queues in JNDI using the form
	# queue.[jndi_name] = [physical_name]
	queue.QUEUE = queue1


#### Configuring the ConnectionFactory

The entry used to define a ConnectionFactory in the Qpid Properties File JNDI Provider is of the following format:

	connectionfactory.[jndi_name] = [ConnectionURL]

Where [jndi_name] and [ConnectionURL] have the following meanings:

<table>
  <tr>
    <td>[jndi_name]</td>
    <td>The logical name of the ConnectionFactory. This is the name that will be resolved in the Java application using the JNDI IntialContext.lookup() method.</td>
  </tr>
  <tr>
    <td>[ConnectionURL]</td>
    <td>A URL that provides the JMS library with the information required to the AMQP broker.</td>
  </tr>
</table>

The format of the ConnectionURL is as follows:

	amqps://[username]:[password]@[namespace].servicebus.windows.net

Where [namespace], [username] and [password] have the following meanings:

<table>
  <tr>
    <td>[namespace]</td>
    <td>The Service Bus namespace obtained from the Azure Portal.</td>
  </tr>
  <tr>
    <td>[username]</td>
    <td>The Service Bus issuer name obtained from the Azure Portal.</td>
  </tr>
  <tr>
    <td>[password]</td>
    <td>URL encoded form of the Service Bus issuer key obtained from the Azure Portal.</td>
  </tr>
</table>

**Note**: The URL encoding of the password must be done manually. A useful URL encoding utility is available at: [http://www.w3schools.com/tags/ref_urlencode.asp](http://www.w3schools.com/tags/ref_urlencode.asp).

So, for example, if the information obtained from the Service Bus portal is as follows:

<table>
  <tr>
    <td>Namespace:</td>
    <td>foo.servicebus.windows.net</td>
  </tr>
  <tr>
    <td>Issuer name:</td>
    <td>owner</td>
  </tr>
  <tr>
    <td>Issuer key:</td>
    <td>j9VYv1q33Ea+cbahWsHFYnLkEzrF0yA5SAqcLNvU7KM=</td>
  </tr>
</table>

Then in order to define a ConnectionFactory named “SBCONNECTIONFACTORY” the configuration string would be as follows:

	connectionfactory.SBCONNECTIONFACTORY = amqps://owner:j9VYv1q33Ea%2BcbahWsHFYnLkEzrF0yA5SAqcLNvU7KM%3D@foo.servicebus.windows.net

#### Configuring Destinations

The entry used to define a Destination in the Qpid Properties File JNDI Provider is of the following format:

	queue.[jndi_name] = [physical_name]

Where [jndi\_name] and [physical\_name] have the following meanings:

<table>
  <tr>
    <td>[jndi_name]</td>
    <td>The logical name of the Destination. This is the name that will be resolved in the Java application using the JNDI IntialContext.lookup() method.</td>
  </tr>
  <tr>
    <td>[physical_name]</td>
    <td>The name of the Service Bus entity to which the application wishes to send or receive messages.</td>
  </tr>
</table>

**Notes**:

* The [physical\_name] can be a Service Bus Queue, Topic or Subscription. Messages can be sent to Queues and Topics and received from Queues and Subscriptions.
* When receiving from a Subscription the format of the [physical\_name] is [topic\_name]/subscriptions/[subscription\_name]. So if an application was to receive messages from a subscription named “hardware” on a topic “orders” then the [physical\_name] would be “orders/subscriptions/hardware.”
* Regardless of whether the application is interacting with a Queue, Topic or a Subscription, the properties file entry is always of the form “queue.[jndi\_name] = [physical\_name]” never “topic.[jndi\_name] = [physical\_name]” nor “subscription.[jndi\_name] = [physical\_name].”

So, to define a logical JMS Destination named “QUEUE” that mapped to a Service Bus Queue named “queue1” the entry in the properties file would be as follows:

	queue.QUEUE = queue1

### Writing the JMS application

There are no special APIs or options required when using JMS with Service Bus. However there are a few restrictions that will be covered later. Like any JMS application, the first thing required is configuration of the JNDI environment so as to be able to resolve a ConnectionFactory and Destinations.

#### Configuring the JNDI InitialContext

The JNDI environment is configured by passing in a hashtable of configuration information into the constructor of the javax.naming.InitialContext class. The two required elements in the hashtable are the class name of the Initial Context Factory and the Provider URL. The code snippet below shows how to configure the JNDI environment to use the Qpid properties file based JNDI Provider with a properties file named “servicebus.properties.”

	Hashtable<String, String> env = new Hashtable<String, String>(); 
	env.put(Context.INITIAL_CONTEXT_FACTORY, "org.apache.qpid.amqp_1_0.jms.jndi.PropertiesFileInitialContextFactory"); 
	env.put(Context.PROVIDER_URL, "servicebus.properties"); 
	InitialContext context = new InitialContext(env); 

### A simple JMS application using a Service Bus Queue

The following simple example program sends JMS TextMessages to a Service Bus Queue with the JNDI logical name of QUEUE and receives the messages back.

	// SimpleSenderReceiver.java	
	import javax.jms.*;
	import javax.naming.Context;
	import javax.naming.InitialContext;
	import java.io.BufferedReader;
	import java.io.InputStreamReader;
	import java.util.Hashtable;
	import java.util.Random;
	
	public class SimpleSenderReceiver implements MessageListener {
	    private Connection connection;
	    private Session sendSession;
    	private Session receiveSession;
    	private MessageProducer sender;
	    private MessageConsumer receiver;
	    private static boolean runReceiver = true;
	    private static Random randomGenerator = new Random();
	
	    public static void main(String[] args) {
    	    try {
	
    	        if ( (args.length > 0) && args[0].equalsIgnoreCase("sendonly") )
        	        runReceiver = false;

            	SimpleSenderReceiver simpleSenderReceiver = new SimpleSenderReceiver();

            	System.out.println("Press [enter] to send a message. Type 'exit' + [enter] to quit.");

            	BufferedReader commandLine = new java.io.BufferedReader(new InputStreamReader(System.in));

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
        	env.put(Context.INITIAL_CONTEXT_FACTORY, "org.apache.qpid.amqp_1_0.jms.jndi.PropertiesFileInitialContextFactory");
        	env.put(Context.PROVIDER_URL, "servicebus.properties");
        	Context context = new InitialContext(env);
	
    	    // Lookup ConnectionFactory and Queue
        	ConnectionFactory cf = (ConnectionFactory) context.lookup("SBCONNECTIONFACTORY");
        	Destination queue = (Destination) context.lookup("QUEUE");

	        // Create Connection
    	    connection = cf.createConnection();
	
    	    // Create sender-side Session and MessageProducer
        	sendSession = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
        	sender = sendSession.createProducer(queue);

        	if (runReceiver)
        	{
            	// Create receiver-side Session, MessageConsumer, and MessageListener
            	receiveSession = connection.createSession(false, Session.CLIENT_ACKNOWLEDGE);
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
        	    System.out.println("Received message with JMSMessageID = " + message.getJMSMessageID());
            	message.acknowledge();
        	} catch (Exception e) {
            	e.printStackTrace();
        	}
    	}

    	private void sendMessage() throws JMSException {
        	TextMessage message = sendSession.createTextMessage();
        	long randomMessageID = randomGenerator.nextLong() >>>1;
        	message.setJMSMessageID("ID:" + randomMessageID);
        	message.setText("Test AMQP message from JMS");
        	sender.send(message);
        	System.out.println("Sent message with JMSMessageID = " + message.getJMSMessageID());
    	}
	}

### Running the application

Running the application produces output of the form:

	> java SimpleSenderReceiver 

	Press [enter] to send a message. Type 'exit' + [enter] to quit.

	Sent message with JMSMessageID = ID:307c84b6-23a2-45ae-93ba-074f4e882b0c
	Received message with JMSMessageID = ID:307c84b6-23a2-45ae-93ba-074f4e882b0c
	
	Sent message with JMSMessageID = ID:92f13538-9ed7-417c-81e3-bf13f205637b
	Received message with JMSMessageID = ID:92f13538-9ed7-417c-81e3-bf13f205637b

	Sent message with JMSMessageID = ID:ccbecfed-f83d-46ca-aab5-cb379961474b
	Received message with JMSMessageID = ID:ccbecfed-f83d-46ca-aab5-cb379961474b

	exit

## Cross-platform messaging between JMS and .NET

So far this guide has shown how to send messages to Service Bus using JMS and also how to receive those messages using JMS. However, one of the key benefits of AMQP 1.0 is that it enables applications to be built from components built using different languages with messages exchanged messages reliably and at full-fidelity.

Using the sample JMS application described above and a similar .NET application taken from a companion guide, [How to use AMQP 1.0 with the .NET Service Bus .NET API](http://aka.ms/lym3vk), it’s possible to exchange messages between .NET and Java. 

More information on the details of cross-platform messaging using Service Bus and AMQP 1.0 can be found in the Service Bus AMQP Preview Developers Guide.

### JMS to .NET

To demonstrate JMS to .NET messaging:

* Start the .NET sample application without any command line arguments.
* Start the Java sample application with the “sendonly” command line argument. In this mode, the application will not receive messages from the queue, it will only send.
* Press ‘enter’ a few times in the Java application console which will cause messages to be sent.
* These messages will be received by the .NET application.

#### Output from JMS application

	> java SimpleSenderReceiver sendonly
	Press [enter] to send a message. Type 'exit' + [enter] to quit.
	Sent message with JMSMessageID = ID:4364096528752411591
	Sent message with JMSMessageID = ID:459252991689389983
	Sent message with JMSMessageID = ID:1565011046230456854
	exit

#### Output from .NET application

	> SimpleSenderReceiver.exe	
	Press [enter] to send a message. Type 'exit' + [enter] to quit.
	Received message with MessageID = 4364096528752411591
	Received message with MessageID = 459252991689389983
	Received message with MessageID = 1565011046230456854
	exit

### .NET to JMS

To demonstrate .NET to JMS messaging:

* Start the .NET sample application with the “sendonly” command line argument. In this mode the application will not receive messages from the queue, it will only send.
* Start the Java sample application without any command line arguments.
* Press ‘enter’ a few times in the .NET application console which will cause messages to be sent.
* These messages will be received by the Java application.

#### Output from .NET application

	> SimpleSenderReceiver.exe sendonly
	Press [enter] to send a message. Type 'exit' + [enter] to quit.
	Sent message with MessageID = d64e681a310a48a1ae0ce7b017bf1cf3	
	Sent message with MessageID = 98a39664995b4f74b32e2a0ecccc46bb
	Sent message with MessageID = acbca67f03c346de9b7893026f97ddeb
	exit


#### Output from JMS application

	> java SimpleSenderReceiver	
	Press [enter] to send a message. Type 'exit' + [enter] to quit.
	Received message with JMSMessageID = ID:d64e681a310a48a1ae0ce7b017bf1cf3
	Received message with JMSMessageID = ID:98a39664995b4f74b32e2a0ecccc46bb
	Received message with JMSMessageID = ID:acbca67f03c346de9b7893026f97ddeb
	exit

## Unsupported features and restrictions 

There are several JMS features that are not currently supported with this preview release of AMQP 1.0 support in Service Bus, namely:

* Only one MessageProducer or MessageConsumer is allowed per Session. If you need to create multiple MessageProducers or MessageConsumers in an application then create dedicated Sessions for each of them.
* The Topic programming model, i.e., TopicConnection, TopicSession, TopicPublisher, TopicSubscriber is not supported. Use the generic Connection, Session, MessageProducer, MessageConsumer APIs with Service Bus Queues, Topics and Subscriptions.
* MessageSelectors are not supported.
* Temporary destinations, i.e., TemporaryQueue, TemporaryTopic are not supported, along with the QueueRequestor and TopicRequestor APIs that use them.
* Transacted sessions
* Distributed transactions

## Summary

This How-To Guide has shown how to access the Service Bus brokered messaging features (queues and publish/subscribe topics) from Java using the popular JMS API and AMQP 1.0. The AMQP 1.0 support is available in preview today and is expected to transition to General Availability (GA) in the first half of 2013.

The Service Bus AMQP 1.0 support can also be used from other languages including .NET, C, Python, and PHP. Components built using these different languages can exchange messages reliably and at full-fidelity using the AMQP 1.0 in Service Bus. Further information is provided in the Service Bus AMQP 1.0 Preview Developers Guide.

## Important notice

Support for the AMQP 1.0 protocol in the Windows Azure Service Bus (“AMQP Preview”) is provided as a Preview feature, and is governed by the Azure Preview terms of use. Specifically, note that:

* The Service Bus SLA does not apply to the AMQP Preview;
* Messages or other data that are placed into Service Bus using the AMQP protocol may not be preserved during the AMQP Preview or at the end of the AMQP Preview;
* We may make breaking changes to AMPQ related APIs or protocols during or at the end of the AMQP Preview.

## Further information

* [AMQP 1.0 support in Azure Service Bus](http://aka.ms/pgr3dp)
* [How to use AMQP 1.0 with the .NET Service Bus .NET API](http://aka.ms/lym3vk)
* [Service Bus AMQP Preview Developers Guide (included in the Service Bus AMQP Preview NuGet package)](http://aka.ms/tnwtu4)
* [How to Use Service Bus Queues](http://www.windowsazure.com/en-us/develop/net/how-to-guides/service-bus-queues/)

