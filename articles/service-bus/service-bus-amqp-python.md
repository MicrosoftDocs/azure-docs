<properties 
    pageTitle="Service Bus and Python with AMQP 1.0 | Microsoft Azure"
    description="Using Service Bus from Python with AMQP."
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
    ms.date="05/10/2016"
    ms.author="sethm" />

# Using Service Bus from Python with AMQP 1.0

[AZURE.INCLUDE [service-bus-selector-amqp](../../includes/service-bus-selector-amqp.md)]

Proton-Python is a Python language binding to Proton-C; that is, Proton-Python is implemented as a wrapper around an engine implemented in C.

## Download the Proton client library

You can download Proton-C and its associated bindings (including Python) from [http://qpid.apache.org/download.html](http://qpid.apache.org/download.html). The download is in source code form. To build the code, follow the instructions contained within the downloaded package.

Note that at the time of this writing, the SSL support in Proton-C is only available for Linux operating systems. Because Azure Service Bus requires the use of SSL, Proton-C (and the language bindings) can only be used to access Service Bus from Linux at this time. Work to enable Proton-C with SSL on Windows is underway so check back frequently for updates.

## Working with Service Bus queues, topics, and subscriptions from Python

The following code shows how to send and receive messages from a Service Bus messaging entity.

### Send messages using Proton-Python

The following code shows how to send a message to a Service Bus messaging entity.

```
messenger = Messenger()
message = Message()
message.address = "amqps://[username]:[password]@[namespace].servicebus.windows.net/[entity]"

message.body = u"This is a text string"
messenger.put(message)
messenger.send()
```

### Receive messages using Proton-Python

The following code shows how to receive a message from a Service Bus messaging entity.

```
messenger = Messenger()
address = "amqps://[username]:[password]@[namespace].servicebus.windows.net/[entity]"
messenger.subscribe(address)

messenger.start()
messenger.recv(1)
message = Message()
if messenger.incoming:
      messenger.get(message)
messenger.stop()
```

## Messaging between .NET and Proton-Python

### Application properties

#### Proton-Python to Service Bus .NET APIs

Proton-Python messages support application properties of the following types: **int**, **long**, **float**, **uuid**, **bool**, **string**. The following Python code shows how to set properties on a message by using each of these property types.

```
message.properties[u"TestString"] = u"This is a string"    
message.properties[u"TestInt"] = 1
message.properties[u"TestLong"] = 1000L
message.properties[u"TestFloat"] = 1.5    
message.properties[u"TestGuid"] = uuid.uuid1()    
```

In the Service Bus .NET API, message application properties are carried in the **Properties** collection of [BrokeredMessage][]. The following code shows how to read the application properties of a message received from a Python client.

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

The following table maps the Python property types to the .NET property types.

| Python Property Type | .NET Property Type |
|----------------------|--------------------|
| int                  | int                |
| float                | double             |
| long                 | int64              |
| uuid                 | guid               |
| bool                 | bool               |
| string               | string             |

#### Service Bus .NET APIs to Proton-Python

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
message.Properties["TestTimeSpan"] = TimeSpan.FromMinutes(60);
```

The following Python code shows how to read the application properties of a message received from a Service Bus .NET client.

```
if message.properties != None:
   for k,v in message.properties.items():         
         print "--   %s : %s (%s)" % (k, str(v), type(v))         
```

The following table maps the .NET property types to the Python property types.

| .NET Property Type | Python Property Type | Notes                                                                                                                                                               |
|--------------------|----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| byte               | int                  | -                                                                                                                                                                     |
| sbyte              | int                  | -                                                                                                                                                                     |
| char               | char                 | Proton-Python class                                                                                                                                                 |
| short              | int                  | -                                                                                                                                                                     |
| ushort             | int                  | -                                                                                                                                                                     |
| int                | int                  | -                                                                                                                                                                     |
| uint               | int                  | -                                                                                                                                                                     |
| long               | int                  | -                                                                                                                                                                     |
| ulong              | long                 | Proton-Python class                                                                                                                                                 |
| float              | float                | -                                                                                                                                                                     |
| double             | float                | -                                                                                                                                                                     |
| decimal            | String               | Decimal is not currently supported with Proton.                                                                                                                     |
| bool               | bool                 | -                                                                                                                                                                     |
| Guid               | uuid                 | Proton-Python class                                                                                                                                                 |
| string             | string               | -                                                                                                                                                                     |
| DateTime           | timestamp            | Proton-Python class                                                                                                                                                 |
| DateTimeOffset     | DescribedType        | DateTimeOffset.UtcTicks mapped to AMQP type:<type name=”datetime-offset” class=restricted source=”long”> <descriptor name=”com.microsoft:datetime-offset” /></type> |
| TimeSpan           | DescribedType        | Timespan.Ticks mapped to AMQP type:<type name=”timespan” class=restricted source=”long”> <descriptor name=”com.microsoft:timespan” /></type>                        |
| Uri                | DescribedType        | Uri.AbsoluteUri mapped to AMQP type:<type name=”uri” class=restricted source=”string”> <descriptor name=”com.microsoft:uri” /></type>                               |

### Standard properties

The following tables show the mapping between the Proton-Python standard message properties and the [BrokeredMessage][] standard message properties.

#### Proton-Python to Service Bus .NET APIs

| Proton-Python        | Service Bus .NET         | Notes                                                     |
|----------------------|--------------------------|-----------------------------------------------------------|
| durable              | n/a                      | Service Bus only supports durable messages.               |
| priority             | n/a                      | Service Bus only supports a single message priority.      |
| Ttl                  | Message.TimeToLive       | Conversion, Proton-Python TTL is defined in milliseconds. |
| first\_acquirer      | n/a                      | -                                                           |
| delivery\_count      | n/a                      | -                                                           |
| Id                   | Message.MessageID        | -                                                           |
| user\_id             | n/a                      | -                                                           |
| address              | Message.To               | -                                                           |
| subject              | Message.Label            | -                                                           |
| reply\_to            | Message.ReplyTo          | -                                                           |
| correlation\_id      | Message.CorrelationID    | -                                                           |
| content\_type        | Message.ContentType      | -                                                           |
| content\_encoding    | n/a                      | -                                                           |
| expiry\_time         | n/a                      | -                                                           |
| creation\_time       | n/a                      | -                                                           |
| group\_id            | Message.SessionId        | -                                                           |
| group\_sequence      | n/a                      | -                                                           |
| reply\_to\_group\_id | Message.ReplyToSessionId | -                                                           |
| format               | n/a                      | -                                                           |

| Service Bus .NET        | Proton                       | Notes                                                     |
|-------------------------|------------------------------|-----------------------------------------------------------|
| ContentType             | Message.content\_type        | -                                                           |
| CorrelationId           | Message.correlation\_id      | -                                                           |
| EnqueuedTimeUtc         | n/a                          | -                                                           |
| Label                   | Message.subject              | -                                                           |
| MessageId               | Message.id                   | -                                                           |
| ReplyTo                 | Message.reply\_to            | -                                                           |
| ReplyToSessionId        | Message.reply\_to\_group\_id | -                                                           |
| ScheduledEnqueueTimeUtc | n/a                          | -                                                           |
| SessionId               | Message.group\_id            | -                                                           |
| TimeToLive              | Message.ttl                  | Conversion, Proton-Python TTL is defined in milliseconds. |
| To                      | Message.address              | -                                                           |

## Next steps

Ready to learn more? Visit the following links:

- [Service Bus AMQP overview]
- [AMQP in Service Bus for Windows Server]

[BrokeredMessage]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.aspx
[AMQP in Service Bus for Windows Server]: https://msdn.microsoft.com/library/dn574799.aspx

[Service Bus AMQP overview]: service-bus-amqp-overview.md
