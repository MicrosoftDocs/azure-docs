<properties linkid="develop-net-how-to-guides-service-bus-amqp" urlDisplayName="Service Bus AMQP" pageTitle="How to use AMQP 1.0 with the .NET Service Bus API - Windows Azure" metaKeywords="" metaDescription="Learn how to use Advanced Message Queuing Protodol (AMQP) 1.0 with the Windows Azure .NET Service Bus API." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />


<div chunk="../chunks/article-left-menu.md" />

# How to use AMQP 1.0 with the .NET Service Bus .NET API

<h2><span class="short-header">Introduction</span>Introduction</h2>

The Advanced Message Queuing Protocol (AMQP) 1.0 is an efficient, reliable, wire-level messaging protocol that can be used to build robust, cross-platform messaging applications. AMQP 1.0 support was added to the Windows Azure Service Bus as a preview feature in October 2012. It is expected to transition to General Availability (GA) in the first half of 2013.

The addition of AMQP 1.0 means that it’s now possible to leverage the queuing and publish/subscribe brokered messaging features of the Service Bus from a range of platforms using an efficient binary protocol. Furthermore, you can build applications comprised of components built using a mix of languages, frameworks and operating systems.

This How-To guide explains how to use the Service Bus brokered messaging features (queues and publish/subscribe topics) from AMQP 1.0 using the .NET API.

<h2><span class="short-header">Getting Started</span>Getting Started with the Service Bus</h2>

This guide assumes that you already have a Service Bus namespace. If not, then you can easily create one using the [Windows Azure Management Portal](http://manage.windowsazure.com). For a detailed walk-through of how to create Service Bus namespaces and Queues, refer to the How-To Guide entitled “[How to Use Service Bus Queues.](https://www.windowsazure.com/en-us/develop/net/how-to-guides/service-bus-queues/)”

<h2><span class="short-header">Downloading AMQP 1.0</span>Downloading the Service Bus AMQP 1.0 Preview Package</h2>

Accessing the AMQP 1.0 support in the Service Bus from .NET requires an updated client library. You can download this via NuGet. The package is entitled “ServiceBus.Preview” and it contains a new Service Bus library named “Microsoft.ServiceBus.Preview.dll.” This library should be used instead of the production version (“Microsoft.ServiceBus.dll”) in order to use the AMQP 1.0 features.

<h2><span class="short-header">Coding .NET applications</span>Coding .NET applications</h2>

By default, the Service Bus .NET client library communicates with the Service Bus service using a dedicated SOAP-based protocol. With this preview release, it’s possible to configure the library to use AMQP 1.0 instead. Other than configuring the protocol selection, as described in the next section, application code is unchanged. However, there are a few API features that are not supported in this preview release. These are called out later in the section “Unsupported features and restrictions.” Some of the advanced configuration settings also take on new meaning when using AMQP. None of these are used in this short How-To guide but more details are available in the Service Bus AMQP Preview Developers Guide.

### Configuration via App.config

It is good practice for applications to use the App.config configuration file to store settings. For Service Bus applications, you can use App.config to store the settings for the Service Bus **ConnectionString**. In addition, this sample application stores the name of the Service Bus messaging entity that it uses.

A sample App.config file is shown below:

	<?xml version="1.0" encoding="utf-8" ?>
	<configuration>
	  	<appSettings>
		    <add key="Microsoft.ServiceBus.ConnectionString"
        	     value="Endpoint=sb://[namespace].servicebus.windows.net;SharedSecretIssuer=[issuer name];SharedSecretValue=[issuer key];TransportType=Amqp" />
	    	<add key="EntityName" value="queue1" />
  		</appSettings>
	</configuration>

### Configuring the Service Bus Connection String

The value of the **Microsoft.ServiceBus.ConnectionString** setting is the Service Bus connection string that is used to configure the connection to the Service Bus. The format is as follows:

	Endpoint=sb://[namespace].servicebus.windows.net;SharedSecretIssuer=[issuer name];SharedSecretValue=[issuer key];TransportType=Amqp

Where [namespace], [issuer name], and [issuer key] are obtained from the Windows Azure Management Portal. For more information, see [How to Use Service Bus Queues][].

When using AMQP, the connection string is appended with “;TransportType=Amqp”, which informs the client library to make its connection to the Service Bus using AMQP 1.0.

### Configuring the Entity Name

This sample application uses the “EntityName” setting in the **appSettings** section of the App.config file to configure the name of the queue with which the application exchanges messages.

### A simple .NET application using a Service Bus Queue

The following simple example program sends BrokeredMessages to a Service Bus queue and receives the messages back.

	// SimpleSenderReceiver.cs

	using System;
	using System.Configuration;
	using System.Threading;
	using Microsoft.ServiceBus.Messaging;

	namespace SimpleSenderReceiver
	{
    	class SimpleSenderReceiver
    	{
        	private static string connectionString;
	        private static string entityName;
	        private static Boolean runReceiver = true;
	        private MessagingFactory factory;
	        private MessageSender sender;
	        private MessageReceiver receiver;
	        private MessageListener messageListener;
	        private Thread listenerThread;

	        static void Main(string[] args)
	        {
	            try
	            {
	                if ((args.Length > 0) && args[0].ToLower().Equals("sendonly"))
	                    runReceiver = false;
	
	                string ConnectionStringKey = "Microsoft.ServiceBus.ConnectionString";
	                string entityNameKey = "EntityName";
	                entityName = ConfigurationManager.AppSettings[entityNameKey];
	                connectionString = ConfigurationManager.AppSettings[ConnectionStringKey];                
	
	                SimpleSenderReceiver simpleSenderReceiver = new SimpleSenderReceiver();
	
	                Console.WriteLine("Press [enter] to send a message. " +
	                    "Type 'exit' + [enter] to quit.");
	
	                while (true)
	                {
	                    string s = Console.ReadLine();
	                    if (s.ToLower().Equals("exit"))
	                    {
	                        simpleSenderReceiver.Close();
	                        System.Environment.Exit(0);
	                    }
	                    else
	                        simpleSenderReceiver.SendMessage();
	                }
	            }
	            catch (Exception e)
	            {
	                Console.WriteLine("Caught exception: " + e.Message);
	            }
	        }
	
	        public SimpleSenderReceiver()
	        {
	            factory = MessagingFactory.CreateFromConnectionString(connectionString);
	            sender = factory.CreateMessageSender(entityName);
	
	            if (runReceiver)
	            {
	                receiver = factory.CreateMessageReceiver(entityName);
	                messageListener = new MessageListener(receiver);
	                listenerThread = new Thread(messageListener.Listen);
	                listenerThread.Start();
	            }
	        }
	
	        public void Close()
	        {
	            messageListener.RequestStop();
	            listenerThread.Join();
	            factory.Close();
	        }
	
	        private void SendMessage()
	        {
	            BrokeredMessage message = 
	                new BrokeredMessage("Test AMQP message from .NET");
	            sender.Send(message);
	            Console.WriteLine("Sent message with MessageID = " + message.MessageId);
	        }	
	    }
	
	    public class MessageListener
	    {
	        private MessageReceiver messageReceiver;
	        public MessageListener(MessageReceiver receiver)
	        {
	            messageReceiver = receiver;
	        }
	
	        public void Listen()
	        {
	            while (!_shouldStop)
	            {
	                try
	                {
	                    BrokeredMessage message = 
	                        messageReceiver.Receive(new TimeSpan(0, 0, 10));
	                    if (message != null)
	                    {
	                        Console.WriteLine("Received message with MessageID = " + message.MessageId);
	                        message.Complete();
	                    }
	                }
	                catch (Exception e)
	                {
	                    Console.WriteLine("Caught exception: " + e.Message);
	                    break;
	                }
	            }
	        }
	
	        public void RequestStop()
	        {
	            _shouldStop = true;
	        }
	
	        private volatile bool _shouldStop;
	    }
	}

### Running the application

Running the application produces output of the form:

	> SimpleSenderReceiver.exe
	
	Press [enter] to send a message. Type 'exit' + [enter] to quit.
	
	Sent message with MessageID = 3f900a8971ec46febb01c3c27e8ebc3a
	Received message with MessageID = 3f900a8971ec46febb01c3c27e8ebc3a
	
	Sent message with MessageID = 6a402d2670d34141afed765381d67442
	Received message with MessageID = 6a402d2670d34141afed765381d67442
	
	Sent message with MessageID = e6333a37ba944612886d630dab78b62d
	Received message with MessageID = e6333a37ba944612886d630dab78b62d
	exit

<h2><span class="short-header">Cross-platform messaging</span>Cross-platform messaging between JMS and .NET</h2>

This guide has shown how to send messages to the Service Bus using .NET and also how to receive those messages using .NET. However, one of the key benefits of AMQP 1.0 is that it enables applications to be built from components written in different languages, with messages exchanged reliably and at full-fidelity.

Using the sample .NET application described above and a similar Java application taken from a companion guide, [How to use the Java Message Service (JMS) API with Service Bus & AMQP 1.0](http://aka.ms/ll1fm3), it’s possible to exchange messages between .NET and Java. 

For more information about the details of cross-platform messaging using the Service Bus and AMQP 1.0, see the Service Bus AMQP Preview Developers Guide.

### JMS to .NET

To demonstrate JMS to .NET messaging:

* Start the .NET sample application without any command-line arguments.
* Start the Java sample application with the “sendonly” command-line argument. In this mode, the application will not receive messages from the queue, it will only send.
* Press **Enter** a few times in the Java application console, which will cause messages to be sent.
* These messages are received by the .NET application.

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

* Start the .NET sample application with the “sendonly” command line argument. In this mode, the application will not receive messages from the queue, it will only send.
* Start the Java sample application without any command line arguments.
* Press **Enter** a few times in the .NET application console, which will cause messages to be sent.
* These messages are received by the Java application.

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

<h2><span class="short-header">Unsupported features</span>Unsupported features and restrictions</h2>

There are several features of the .NET Service Bus API that are not currently supported in this preview release of AMQP 1.0 in the Service Bus, namely:

* Transactions
* Receive by message sequence number, i.e. MessageReceiver.Receive(long sequenceNumber).
* Session state, i.e., MessageSession.GetState()/SetState()
* The use of parameters in subscription rule filters (SqlFilter.Parameters) and subscription rule actions (SqlRuleAction.Parameters)
* CorrelationFilter is only supported when using CorrelationId
* Batch-based APIs
* Scaled-out receive
* Message auto-forwarding
* Message lock renewal
* Some minor behavior differences

See the Service Bus AMQP Preview Developers Guide for more information.

<h2><span class="short-header">Summary</span>Summary</h2>

This How-To guide has shown how to access the Service Bus brokered messaging features (queues and publish/subscribe topics) from .NET using AMQP 1.0 and the Service Bus .NET API. The AMQP 1.0 support is available in preview today and is expected to transition to General Availability (GA) in the first half of 2013.

The Service Bus AMQP 1.0 support can also be used from other languages including Java, C, Python, and PHP. Components built using these different languages can exchange messages reliably and at full-fidelity using the AMQP 1.0 in the Service Bus. Further information is provided in the Service Bus AMQP 1.0 Preview Developers Guide.


<h2><span class="short-header">Important notice</span>Important notice</h2>

Support for the AMQP 1.0 protocol in the Windows Azure Service Bus (“AMQP Preview”) is provided as a preview feature, and is governed by the Windows Azure Preview terms of use. Specifically, note that:

* The Service Bus SLA does not apply to the AMQP Preview;
* Any queue or topic that is addressed using the AMQP client libraries (for sending/receiving messages or other data) may not be preserved during the AMQP Preview or at the end of the AMQP Preview;
* We may make breaking changes to AMPQ-related APIs or protocols during or at the end of the AMQP Preview.

<h2><span class="short-header">Further information</span>Further information</h2>

* [AMQP 1.0 support in Windows Azure Service Bus](http://aka.ms/pgr3dp)
* [How to use the Java Message Service (JMS) API with Service Bus & AMQP 1.0](http://aka.ms/ll1fm3)
* [Service Bus AMQP Preview Developers Guide (included in the ServiceBus.Preview NuGet package)](http://aka.ms/tnwtu4)
* [How to Use Service Bus Queues](http://www.windowsazure.com/en-us/develop/net/how-to-guides/service-bus-queues/)

[How to Use Service Bus Queues]: http://www.windowsazure.com/en-us/develop/net/how-to-guides/service-bus-queues/
