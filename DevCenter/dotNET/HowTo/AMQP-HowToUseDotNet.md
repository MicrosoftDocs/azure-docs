
# How to use AMQP 1.0 with the .NET Service Bus .NET API

## Introduction

The Advanced Message Queuing Protocol (AMQP) 1.0 is an efficient, reliable, wire-level messaging protocol that can be used to build robust, cross-platform, messaging applications. AMQP 1.0 support was added to Windows Azure Service Bus as a preview feature in October 2012. It is expected to transition to General Availability (GA) in the first half of 2013.

The addition of AMQP 1.0 means that it’s now possible to leverage the queuing and publish/subscribe brokered messaging features of Service Bus from a range of platforms using an efficient binary protocol. Furthermore, you can build applications comprised of components built using a mix of languages, frameworks and operating systems.

This How-To Guide explains how to use the Service Bus brokered messaging features (Queues and publish/subscribe Topics) from AMQP 1.0 using the .NET API.


## Getting started with Service Bus

This guide assumes that you already have a Service Bus namespace. If not, then this can be easily created using the [Windows Azure Management Portal](http://manage.windowsazure.com). For a detailed walk-through of how to create Service Bus namespaces and Queues, refer to the How-To Guide entitled “[How to Use Service Bus Queues.](https://www.windowsazure.com/en-us/develop/net/how-to-guides/service-bus-queues/)”

## Downloading the Service Bus AMQP 1.0 Preview Package 

Accessing the AMQP 1.0 support in Service Bus from .NET requires an updated client library. This can be downloaded via NuGet. The package is entitled “ServiceBus.Preview” and it contains a new Service Bus library named “Microsoft.ServiceBus.Preview.dll.” This library should be used instead of the production version (“Microsoft.ServiceBus.DLL”) in order to use the AMQP 1.0 features.

## Coding .NET applications

By default, the Service Bus .NET client library communicates with the Service Bus service using a dedicated SOAP-based protocol. With this preview release, it’s possible to configure the library to instead use AMQP 1.0. Other than configuring the protocol selection, as described in the next section, application code is unchanged. However, there are a few API features that are not supported in this preview release. These are called out later in the section entitled “Unsupported features and restrictions.” Some of the advanced configuration settings also take on new meaning when using AMQP. None of these are used in this short How-To Guide but more details are available in the Service Bus AMQP Preview Developers Guide.

### Configuration via App.config

It is good practice for applications to use the App.config configuration file to store settings. For Service Bus applications, App.config can be used to store the settings for the Service Bus ConnectionString. In addition, this sample application stores the name of the Service Bus entity that it uses.

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

The value of the Microsoft.ServiceBus.ConnectionString setting is the Service Bus Connection String that is used to configure the connection to Service Bus. The format is as follows:

	Endpoint=sb://[namespace].servicebus.windows.net;SharedSecretIssuer=[issuer name];SharedSecretValue=[issuer key];TransportType=Amqp

Where [namespace] and [issuer name] and [issuer key] are obtained from the Windows Azure Management Portal. For more information, see the “How to Use Service Bus Queues” guide for more information.

When using AMQP, the Connection String is appended with “;TransportType=Amqp” which informs the client library to make its connection to Service Bus using AMQP 1.0.

### Configuring the Entity Name

This sample application uses the “EntityName” setting in the <appSettings> of the App.config file to configure the name of the queue with which the application will exchange messages.

### A simple .NET application using a Service Bus Queue

The following simple example program sends BrokeredMessages to a Service Bus Queue and receives the messages back.

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

## Cross-platform messaging between JMS and .NET

So far this guide has shown how to send messages to Service Bus using .NET and also how to receive those messages using .NET. However, one of the key benefits of AMQP 1.0 is that it enables applications to be built from components built using different languages with messages exchanged messages reliably and at full-fidelity.

Using the sample .NET application described above and a similar Java application taken from a companion guide (How to use the Java Message Service (JMS) API with Service Bus & AMQP 1.0) TODO, it’s possible to exchange messages between .NET and Java. 

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

There are several features of the .NET Service Bus API that are not currently supported with this preview release of AMQP 1.0 support in Service Bus, namely:

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

## Summary

This How-To Guide has shown how to access the Service Bus brokered messaging features (queues and publish/subscribe topics) from .NET using AMQP 1.0 and the Service Bus .NET API. The AMQP 1.0 support is available in preview today and is expected to transition to General Availability (GA) in the first half of 2013.

The Service Bus AMQP 1.0 support can also be used from other languages including Java, C, Python, and PHP. Components built using these different languages can exchange messages reliably and at full-fidelity using the AMQP 1.0 in Service Bus. Further information is provided in the Service Bus AMQP 1.0 Preview Developers Guide.


## Important notice

Support for the AMQP 1.0 protocol in the Windows Azure Service Bus (“AMQP Preview”) is provided as a Preview feature, and is governed by the Azure Preview terms of use. Specifically, note that:

* The Service Bus SLA does not apply to the AMQP Preview;
* Messages or other data that are placed into Service Bus using the AMQP protocol may not be preserved during the AMQP Preview or at the end of the AMQP Preview;
* We may make breaking changes to AMPQ related APIs or protocols during or at the end of the AMQP Preview.

## Further information

* AMQP 1.0 support in Azure Service Bus [link to article previously submitted] TODO
* How to use the Java Message Service (JMS) API with Service Bus & AMQP 1.0 [link to sister article] TODO
* Service Bus AMQP Preview Developers Guide[ included in the Service Bus AMQP Preview NuGet package] TODO
* [How to Use Service Bus Queues](https://www.windowsazure.com/en-us/develop/net/how-to-guides/service-bus-queues/)

