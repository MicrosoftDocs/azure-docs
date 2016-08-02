<properties 
    pageTitle="Service Bus and Java with AMQP 1.0 | Microsoft Azure"
    description="Using Service Bus from Java with AMQP"
    services="service-bus"
    documentationCenter="na"
    authors="sethmanheim"
    manager="timlt"
    editor="" /> 
<tags 
    ms.service="service-bus"
    ms.devlang="na"
    ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="na"
    ms.date="05/06/2016"
    ms.author="sethm" />

# Use Service Bus from Java with AMQP 1.0

[AZURE.INCLUDE [service-bus-selector-amqp](../../includes/service-bus-selector-amqp.md)]

The Java Message Service (JMS) is a standard API for working with message-oriented middleware on the Java platform. Microsoft Azure Service Bus has been tested with the AMQP 1.0 based JMS client library developed by the Apache Qpid project. This library supports the full JMS 1.1 API and can be used with any AMQP 1.0 compliant messaging service. This scenario is also supported in [Service Bus for Windows Server](https://msdn.microsoft.com/library/dn282144.aspx) (on-premises Service Bus). For more information, see [AMQP in Service Bus for Windows Server][].

## Download the Apache Qpid AMQP 1.0 JMS client library

For information about downloading the latest version of the Apache Qpid JMS AMQP 1.0 client library, visit [http://people.apache.org/~rgodfrey/qpid-java-amqp-1-0-client-jms.html](http://people.apache.org/~rgodfrey/qpid-java-amqp-1-0-client-jms.html).

You must add the following four JAR files from the Apache Qpid JMS AMQP 1.0 distribution archive to the Java CLASSPATH when building and running JMS applications with Service Bus:

-   geronimo-jms\_1.1\_spec-[version].jar

-   qpid-amqp-1-0-client-[version].jar

-   qpid-amqp-1-0-client-jms-[version].jar

-   qpid-amqp-1-0-common-[version].jar

## Work with Service Bus queues, topics, and subscriptions from JMS

### Java Naming and Directory Interface (JNDI)

JMS uses the Java Naming and Directory Interface (JNDI) to create a separation between logical names and physical names. Two types of JMS objects are resolved using JNDI: **ConnectionFactory** and **Destination**. JNDI uses a provider model into which you can plug different directory services to handle name resolution duties. The Apache Qpid JMS AMQP 1.0 library comes with a simple properties file-based JNDI Provider that is configured using a text file.

The Qpid Properties File JNDI Provider is configured using a properties file of the following format:

```
# servicebus.properties – sample JNDI configuration

# Register a ConnectionFactory in JNDI using the form:
# connectionfactory.[jndi_name] = [ConnectionURL]
connectionfactory.SBCONNECTIONFACTORY = amqps://[username]:[password]@[namespace].servicebus.windows.net

# Register some queues in JNDI using the form
# queue.[jndi_name] = [physical_name]
# topic.[jndi_name] = [physical_name]
topic.TOPIC = topic1
queue.QUEUE = queue1
```

#### Configure the connection factory

The entry used to define a **ConnectionFactory** in the Qpid Properties File JNDI Provider is of the following format:

```
connectionfactory.[jndi_name] = [ConnectionURL]
```

Where `[jndi\_name]` and `[ConnectionURL]` have the following meanings:

| Name            | Meaning                                                                                                                                    |   |   |   |   |
|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------|---|---|---|---|
| `[jndi\_name]`    | The logical name of the connection factory. This name is resolved in the Java application by using the JNDI `IntialContext.lookup()` method. |   |   |   |   |
| `[ConnectionURL]` | A URL that provides the JMS library with the information required to the AMQP broker.                                                      |   |   |   |   |

The format of the connection URL is as follows:

```
amqps://[username]:[password]@[namespace].servicebus.windows.net
```

Where `[namespace]`, `[username]`, and `[password]` have the following meanings:

| Name          | Meaning                                                                        |   |   |   |   |
|---------------|--------------------------------------------------------------------------------|---|---|---|---|
| `[namespace]` | The Service Bus namespace obtained from the [Azure classic portal][].                      |   |   |   |   |
| `[username]`  | The Service Bus issuer name obtained from the [Azure classic portal][].                    |   |   |   |   |
| `[password]`  | URL-encoded form of the Service Bus issuer key obtained from the [Azure classic portal][]. |   |   |   |   |

> [AZURE.NOTE] You must URL-encode the password manually. A useful URL encoding utility is available at [http://www.w3schools.com/tags/ref_urlencode.asp](http://www.w3schools.com/tags/ref_urlencode.asp).

For example, if the information obtained from the portal is as follows:

| Namespace:   | test.servicebus.windows.net                  |
|--------------|----------------------------------------------|
| Issuer name: | owner                                        |
| Issuer key:  | abcdefg |

Then in order to define a **ConnectionFactory** object named `SBCONNECTIONFACTORY`, the configuration string would be as follows:

```
connectionfactory.SBCONNECTIONFACTORY = amqps://owner:abcdefg@test.servicebus.windows.net
```

#### Configure destinations

The entry that defines a destination in the Qpid Properties File JNDI Provider is of the following format:

```
queue.[jndi_name] = [physical_name]
topic.[jndi_name] = [physical_name]
```

Where `[jndi\_name]` and `[physical\_name]` have the following meanings:

| Name              | Meaning                                                                                                                                  |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| `[jndi\_name]`    | The logical name of the destination. This is name is resolved in the Java application by using the JNDI `IntialContext.lookup()` method. |
| `[physical\name]` | The name of the Service Bus entity to which the application sends or receives messages.                                                  |

Note the following:

- The `[physical\name]` value can be a Service Bus queue or topic.
- When receiving from a Service Bus topic subscription, the physical name specified in JNDI should be the name of the topic. The subscription name is provided when the durable subscription is created in the JMS application code.
- It is also possible to treat a Service Bus topic subscription as a JMS Queue. There are several advantages to this approach: the same receiver code can be used for queues and topic subscriptions, and all the address information (the topic and subscription names) is externalized in the properties file.
- To treat a Service Bus topic subscription as a JMS Queue, the entry in properties file should be of the form: `queue.[jndi\_name] = [topic\_name]/Subscriptions/[subscription\_name]`.|

To define a logical JMS destination named "TOPIC" that maps to a Service Bus topic named "topic1," the entry in the properties file would be as follows:

```
topic.TOPIC = topic1
```

### Send messages using JMS

The following code shows how to send a message to a Service Bus topic. It is assumed that `SBCONNECTIONFACTORY` and `TOPIC` are defined in a **servicebus.properties** configuration file as described in the previous section.

```
Hashtable<String, String> env = new Hashtable<String, String>(); 
env.put(Context.INITIAL_CONTEXT_FACTORY, 
        "org.apache.qpid.amqp_1_0.jms.jndi.PropertiesFileInitialContextFactory"); 
env.put(Context.PROVIDER_URL, "servicebus.properties"); 
 
InitialContext context = new InitialContext(env); 
 
ConnectionFactory cf = (ConnectionFactory) context.lookup("SBCONNECTIONFACTORY");
Topic topic = (Topic) context.lookup("TOPIC");
Connection connection = cf.createConnection();
Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
MessageProducer producer = session.createProducer(topic);
TextMessage message = session.createTextMessage("This is a text string"); 
producer.send(message);
```

### Receive messages using JMS

The following code shows `how` to receive a message from a Service Bus topic subscription. It is assumed that `SBCONNECTIONFACTORY` and TOPIC are defined in a **servicebus.properties** configuration file as described in the previous section. It is also assumed that the subscription name is `subscription1`.

```
Hashtable<String, String> env = new Hashtable<String, String>(); 
env.put(Context.INITIAL_CONTEXT_FACTORY, 
        "org.apache.qpid.amqp_1_0.jms.jndi.PropertiesFileInitialContextFactory"); 
env.put(Context.PROVIDER_URL, "servicebus.properties"); 
 
InitialContext context = new InitialContext(env);

ConnectionFactory cf = (ConnectionFactory) context.lookup("SBCONNECTIONFACTORY");
Topic topic = (Topic) context.lookup("TOPIC");
Connection connection = cf.createConnection();
Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
TopicSubscriber subscriber = session.createDurableSubscriber(topic, "subscription1");
connection.start();
Message message = messageConsumer.receive();
```

### Guidelines for building robust applications

The JMS specification defines how the exception contract of the API methods and application code should be written to handle such exceptions. Here are some other points to consider regarding exception handling:

-   Register an **ExceptionListener** with the JMS connection using **connection.setExceptionListener**. This enables a client to be notified of a problem asynchronously. This notification is particularly important for connections that only consume messages, as they would have no other way to learn that their connection has failed. The **ExceptionListener** is called if there is a problem with the underlying AMQP connection, session, or link. In this situation, the application program should recreate the **JMS Connection**, **Session**, **MessageProducer** and **MessageConsumer** objects from scratch.

-   To verify that a message has been successfully sent from a **MessageProducer** to a Service Bus entity, ensure that the application has been configured with the **qpid.sync\_publish** system property set. You can do this by starting the program with the **-Dqpid.sync\_publish=true** Java VM option set on the command line when starting the application. Setting this option configures the library to not return from the send call until confirmation has been received that the message has been accepted by Service Bus. If a problem occurs during the send operation, a **JMSException** is raised. There are two possible causes: 
	1. If the problem is due to Service Bus rejecting the particular message being sent, then a **MessageRejectedException** exception will be raised. This error is either transitory, or due to some problem with the message. The recommended course of action is to make several attempts to retry the operation with some back-off logic. If the problem persists, then the message should be abandoned with an error logged locally. There is no need to recreate the **JMS Connection**, **Session**, or **MessageProducer** objects in this situation. 
	2. If the problem is due to Service Bus closing the AMQP Link, then an **InvalidDestinationException** exception will be raised. This can be due to a transient problem, or due to the message entity being deleted. In either case, the **JMS Connection**, **Session**, and **MessageProducer** objects should be recreated. If the error condition was transient, then this operation will eventually be successful. If the entity has been deleted, the failure will be permanent.

## Messaging between .NET and JMS

### Message bodies

JMS defines five different message types: **BytesMessage**, **MapMessage**, **ObjectMessage**, **StreamMessage**, and **TextMessage**. The Service Bus .NET API has a single message type, [BrokeredMessage][].

#### JMS to Service Bus .NET API

The following sections show how to consume messages of each of the JMS message types from .NET. An **ObjectMessage** example has not been included, as the body of an **ObjectMessage** contains a serializable object in the Java programming language, which is not interpretable by a .NET application.

##### BytesMessage

The following code shows how to consume the body of a **BytesMessage** object by using the Service Bus .NET APIs.

```
Stream stream = message.GetBody<Stream>();
int streamLength = (int)stream.Length;

byte[] byteArray = new byte[streamLength];
stream.Read(byteArray, 0, streamLength);

Console.WriteLine("Length = " + streamLength);
for (int i = 0; i < stream.Length; i++)
{
  Console.Write("[" + (sbyte) byteArray[i] + "]");
}
```

##### MapMessage

The following code shows how to consume the body of a **MapMessage** object by using the Service Bus .NET APIs. This code iterates through the elements of the map, displaying the name and value of each element.

```
Dictionary<String, Object> dictionary = message.GetBody<Dictionary<String, Object>>();

foreach (String mapItemName in dictionary.Keys)
{
  Object mapItemValue = null;
  if (dictionary.TryGetValue(mapItemName, out mapItemValue))
  {
    Console.WriteLine(mapItemName + ":" + mapItemValue);
  }
}
```

##### StreamMessage

The following code shows how to consume the body of a **StreamMessage** object by using the Service Bus .NET APIs. This code lists each of the items from the stream, together with their types.

```
List<Object> list = message.GetBody<List<Object>>();

foreach (Object item in list)
{
  Console.WriteLine(item + " (" + item.GetType() + ")");
}
```

##### TextMessage

The following code shows how to consume the body of a **TextMessage** object by using the Service Bus .NET APIs. This code displays the text string contained in the body of the message.

```
Console.WriteLine("Text: " + message.GetBody<String>());
```

#### Service Bus .NET APIs to JMS

The following sections show how a .NET application can create a message that is received in JMS in each of the different JMS message types. An **ObjectMessage** example has not been included, as the body of an **ObjectMessage** contains a serializable object in the Java programming language, which is not interpretable by a .NET application.

##### BytesMessage

The following code shows how to create a [BrokeredMessage][] object in .NET that is received by a JMS client as a **BytesMessage**.

```
byte[] bytes = { 33, 12, 45, 33, 12, 45, 33, 12, 45, 33, 12, 45 };
message = new BrokeredMessage(bytes);
```

##### StreamMessage

The following code shows how to create a [BrokeredMessage][] object in .NET that is received by a JMS client as a **StreamMessage**.

```
List<Object> list = new List<Object>();
list.Add("String 1");
list.Add("String 2");
list.Add("String 3");
list.Add((double)3.14159);
message = new BrokeredMessage(list);
```

##### TextMessage

The following code shows how to consume the body of a **TextMessage** using the Service Bus .NET API. This code displays the text string contained in the body of the message.

```
message = new BrokeredMessage("this is a text string");
```

### Application properties

####JMS to Service Bus .NET APIs

JMS messages support application properties of the following types: **boolean**, **byte**, **short**, **int**, **long**, **float**, **double**, and **String**. The following Java code shows how to set properties on a message by using each of these property types.

```
message.setBooleanProperty("TestBoolean", true); 
message.setByteProperty("TestByte", (byte) 33); 
message.setDoubleProperty("TestDouble", 3.14159D); 
message.setFloatProperty("TestFloat", 3.13159F); 
message.setIntProperty("TestInt", 100); 
message.setStringProperty("TestString", "Service Bus");
```

In the Service Bus .NET APIs, message application properties are carried in the **Properties** collection of [BrokeredMessage][]. The following code shows how to read the application properties of a message received from a JMS client.

```
if (message.Properties.Keys.Count > 0)
{
  foreach (string name in message.Properties.Keys)
  {
    Object value = message.Properties[name];
    Console.WriteLine(name + ": " + value + " (" + value.GetType() + ")" );
  }
  Console.WriteLine();
}
```

The following table shows how the JMS property types map to the .NET property types.

| JMS Property Type | .NET Property Type |
|-------------------|--------------------|
| Byte              | sbyte              |
| Integer           | int                |
| Float             | float              |
| Double            | double             |
| Boolean           | bool               |
| String            | string             |

The [BrokeredMessage][] type supports application properties of the following types: **byte**, **sbyte**, **char**, **short**, **ushort**, **int**, **uint**, **long**, **ulong**, **float**, **double**, **decimal**, **bool**, **Guid**, **string**, **Uri**, **DateTime**, **DateTimeOffset**, and **TimeSpan**. The following .NET code shows how to set properties on a [BrokeredMessage][] object using each of these property types.

```
message.Properties["TestByte"] = (byte)128;
message.Properties["TestSbyte"] = (sbyte)-22;
message.Properties["TestChar"] = (char) 'X';
message.Properties["TestShort"] = (short)-12345;
message.Properties["TestUshort"] = (ushort)12345;
message.Properties["TestInt"] = (int)-100;
message.Properties["TestUint"] = (uint)100;
message.Properties["TestLong"] = (long)-12345;
message.Properties["TestUlong"] = (ulong)12345;
message.Properties["TestFloat"] = (float)3.14159;
message.Properties["TestDouble"] = (double)3.14159;
message.Properties["TestDecimal"] = (decimal)3.14159;
message.Properties["TestBoolean"] = true;
message.Properties["TestGuid"] = Guid.NewGuid();
message.Properties["TestString"] = "Service Bus";
message.Properties["TestUri"] = new Uri("http://www.bing.com");
message.Properties["TestDateTime"] = DateTime.Now;
message.Properties["TestDateTimeOffSet"] = DateTimeOffset.Now;
message.Properties["TestTimeSpan"] = TimeSpan.FromMinutes(60);
```

The following Java code shows how to read the application properties of a message received from a Service Bus .NET client.

```
Enumeration propertyNames = message.getPropertyNames(); 
while (propertyNames.hasMoreElements()) 
{ 
  String name = (String) propertyNames.nextElement(); 
  Object value = message.getObjectProperty(name); 
  System.out.println(name + ": " + value + " (" + value.getClass() + ")"); 
}
```

The following table shows how the .NET property types map to the JMS property types.

| .NET Property Type | JMS Property Type | Notes                                                                                                                                                               |
|--------------------|-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| byte               | UnsignedByte      | -                                                                                                                                                                      |
| sbyte              | Byte              | -                                                                                                                                                                     |
| char               | Character         | -                                                                                                                                                                     |
| short              | Short             | -                                                                                                                                                                     |
| ushort             | UnsignedShort     | -                                                                                                                                                                     |
| int                | Integer           | -                                                                                                                                                                     |
| uint               | UnsignedInteger   | -                                                                                                                                                                     |
| long               | Long              | -                                                                                                                                                                     |
| ulong              | UnsignedLong      | -                                                                                                                                                                     |
| float              | Float             | -                                                                                                                                                                     |
| double             | Double            | -                                                                                                                                                                     |
| decimal            | BigDecimal        | -                                                                                                                                                                     |
| bool               | Boolean           | -                                                                                                                                                                     |
| Guid               | UUID              | -                                                                                                                                                                     |
| string             | String            | -                                                                                                                                                                     |
| DateTime           | Date              | -                                                                                                                                                                     |
| DateTimeOffset     | DescribedType     | DateTimeOffset.UtcTicks mapped to AMQP type:<type name=”datetime-offset” class=restricted source=”long”> <descriptor name=”com.microsoft:datetime-offset” /></type> |
| TimeSpan           | DescribedType     | Timespan.Ticks mapped to AMQP type:<type name=”timespan” class=restricted source=”long”> <descriptor name=”com.microsoft:timespan” /></type>                        |
| Uri                | DescribedType     | Uri.AbsoluteUri mapped to AMQP type:<type name=”uri” class=restricted source=”string”> <descriptor name=”com.microsoft:uri” /></type>                               |

### Standard headers

The following tables show how the JMS Standard Headers and the [BrokeredMessage][] standard properties are mapped using AMQP 1.0.

#### JMS to Service Bus .NET APIs

| JMS              | Service Bus .NET               | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|------------------|--------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| JMSCorrelationID | Message.CorrelationID          | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| JMSDeliveryMode  | Not currently available        | Service Bus only supports durable messages; for example, DeliveryMode.PERSISTENT, regardless of what is specified.                                                                                                                                                                                                                                                                                                                                                         |
| JMSDestination   | Message.To                     | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| JMSExpiration    | Message. TimeToLive            | Conversion                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| JMSMessageID     | Message.MessageID              | By default, JMSMessageID is encoded in binary form in the AMQP message. On receipt of binary message-id, the .NET client library converts to a string representation based on the unicode values of the bytes. To switch the JMS library to use string message ids, append the “binary-messageid=false” string to the query parameters of the JNDI ConnectionURL. For example: “amqps://[username]:[password]@[namespace].servicebus.windows.net? binary-messageid=false”. |
| JMSPriority      | Not currently available        | Service Bus does not support message priority.                                                                                                                                                                                                                                                                                                                                                                                                                             |
| JMSRedelivered   | Not currently available        | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| JMSReplyTo       | Message. ReplyTo               | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| JMSTimestamp     | Message.EnqueuedTimeUtc        | Conversion                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| JMSType          | Message.Properties[“jms-type”] | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

#### Service Bus .NET APIs to JMS

| Service Bus .NET        | JMS              | Notes                   |
|-------------------------|------------------|-------------------------|
| ContentType             | -                  | Not currently available |
| CorrelationId           | JMSCorrelationID | -                         |
| EnqueuedTimeUtc         | JMSTimestamp     | Conversion              |
| Label                   | n/a              | Not currently available |
| MessageId               | JMSMessageID     | -                         |
| ReplyTo                 | JMSReplyTo       | -                         |
| ReplyToSessionId        | n/a              | Not currently available |
| ScheduledEnqueueTimeUtc | n/a              | Not currently available |
| SessionId               | n/a              | Not currently available |
| TimeToLive              | JMSExpiration    | Conversion              |
| To                      | JMSDestination   | -                         |

## Unsupported features and restrictions

The following restrictions exist when using JMS over AMQP 1.0 with Service Bus:

-   Only one **MessageProducer** or **MessageConsumer** is allowed per session. If you want to create multiple **MessageProducer** or **MessageConsumer** objects in an application, create dedicated sessions for each of them.

-   Volatile topic subscriptions are not currently supported.

-   **MessageSelector** objects are not supported.

-   Temporary destinations; for example, **TemporaryQueue** or **TemporaryTopic**, are not supported, along with the **QueueRequestor** and **TopicRequestor** APIs that use them.

-   Transacted sessions are not supported.

-   Distributed transactions are not supported.

## Next steps

Ready to learn more? Visit the following links:

- [Service Bus AMQP overview]
- [AMQP in Service Bus for Windows Server]

[AMQP in Service Bus for Windows Server]: https://msdn.microsoft.com/library/dn574799.aspx
[BrokeredMessage]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.aspx

[Service Bus AMQP overview]: service-bus-amqp-overview.md
[Azure classic portal]: http://manage.windowsazure.com
