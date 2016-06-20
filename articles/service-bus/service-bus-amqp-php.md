<properties 
    pageTitle="Service Bus and PHP with AMQP 1.0 | Microsoft Azure"
    description="Using Service Bus from PHP with AMQP."
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

# Using Service Bus from PHP with AMQP 1.0

[AZURE.INCLUDE [service-bus-selector-amqp](../../includes/service-bus-selector-amqp.md)]

Proton-PHP is a PHP language binding to Proton-C; that is, Proton-PHP is implemented as a wrapper around an engine implemented in C.

## Downloading the Proton client library

You can download Proton-C and its associated bindings (including PHP) from [http://qpid.apache.org/download.html](http://qpid.apache.org/download.html). The download is in source code form. To build the code, follow the instructions contained in the downloaded package.

> [AZURE.IMPORTANT] At the time of this writing, the SSL support in Proton-C is only available for Linux operating systems. Because Azure Service Bus requires the use of SSL, Proton-C (and the language bindings) can only be used to access Service Bus from Linux at this time. Work to enable Proton-C with SSL on Windows is underway, so check back frequently for updates.

## Working with Service Bus queues, topics, and subscriptions from PHP

The following code shows how to send and receive messages from a Service Bus messaging entity.

### Sending messages using Proton-PHP

The following code shows how to send a message to a Service Bus messaging entity.

```
$messenger = new Messenger();
$message = new Message();
$message->address = "amqps://[username]:[password]@[namespace].servicebus.windows.net/[entity]";

$message->body = "This is a text string";
$messenger->put($message);
$messenger->send();
```

### Receiving messages using Proton-PHP

The following code shows how to receive a message from a Service Bus messaging entity.

```
$messenger = new Messenger();
$address = "amqps://[username]:[password]@[namespace].servicebus.windows.net/[entity]";
$messenger->subscribe($address);

$messenger->start();
$messenger->recv(1);

if($messenger->incoming())
{
   $message = new Message();
   $messenger->get($message);      
}

$messenger->stop();
```

## Messaging between .NET and Proton-PHP

### Application properties

#### ProtonPHP to Service Bus .NET APIs

Proton-PHP messages support application properties of the following types: **integer**, **double**, **Boolean**, **string**, and **object**. The following PHP code shows how to set properties on a message by using each of these property types.

```
$message->properties["TestInt"] = 1;    
$message->properties["TestDouble"] = 1.5;      
$message->properties["TestBoolean"] = False;
$message->properties["TestString"] = "Service Bus";    
$message->properties["TestObject"] = new UUID("1234123412341234");   
```

In the Service Bus .NET APIs, message application properties are carried in the **Properties** collection of [BrokeredMessage][]. The following code shows how to read the application properties of a message received from a PHP client.

```
if (message.Properties.Keys.Count > 0)
{
  foreach (string name in message.Properties.Keys)
  {
    Object value = message.Properties[name];
    Console.WriteLine(name + ": " + value + " (" + value.GetType() + ")" );
  }
  Console.WriteLine();
}if (message.Properties.Keys.Count > 0)
{
foreach (string name in message.Properties.Keys)
{
  Object value = message.Properties[name];
  Console.WriteLine(name + ": " + value + " (" + value.GetType() + ")" );
}
Console.WriteLine();
}
```

The following table maps the PHP property types to the .NET property types.

| PHP Property Type | .NET Property Type |
|-------------------|--------------------|
| integer           | int                |
| double            | double             |
| boolean           | bool               |
| string            | string             |
| object            | Object             |

#### Service Bus .NET APIs to PHP

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

The following PHP code shows how to read the application properties of a message received from a Service Bus .NET client.

```
if ($message->properties != null)
{
  foreach($message->properties as $key => $value)
  {
    printf("-- %s : %s (%s) \n", $key, $value, gettype($value));                       
  }         
}
```

The following table maps the .NET property types to the PHP property types.

| .NET Property Type | PHP Property Type | Notes                                                                                                                                                               |
|--------------------|-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| byte               | integer           | -                                                                                                                                                                     |
| sbyte              | integer           | -                                                                                                                                                                     |
| char               | Char              | Proton-PHP class                                                                                                                                                    |
| short              | integer           | -                                                                                                                                                                     |
| ushort             | integer           | -                                                                                                                                                                     |
| int                | integer           | -                                                                                                                                                                     |
| uint               | Integer           | -                                                                                                                                                                     |
| long               | integer           | -                                                                                                                                                                     |
| ulong              | integer           | -                                                                                                                                                                     |
| float              | double            | -                                                                                                                                                                     |
| double             | double            | -                                                                                                                                                                     |
| decimal            | string            | Decimal is not currently supported with Proton.                                                                                                                     |
| bool               | boolean           | -                                                                                                                                                                     |
| Guid               | UUID              | Proton-PHP class                                                                                                                                                    |
| string             | string            | -                                                                                                                                                                     |
| DateTime           | integer           | -                                                                                                                                                                     |
| DateTimeOffset     | DescribedType     | DateTimeOffset.UtcTicks mapped to AMQP type:<type name="datetime-offset" class=restricted source="long"> <descriptor name="com.microsoft:datetime-offset" /></type> |
| TimeSpan           | DescribedType     | Timespan.Ticks mapped to AMQP type:<type name="timespan" class=restricted source="long"> <descriptor name="com.microsoft:timespan" /></type>                        |
| Uri                | DescribedType     | Uri.AbsoluteUri mapped to AMQP type:<type name="uri" class=restricted source="string"> <descriptor name="com.microsoft:uri" /></type>                               |

### Standard properties

The following tables show the mapping between the Proton-PHP standard message properties and the [BrokeredMessage][] standard message properties.

| Proton-PHP           | Service Bus .NET         | Notes                                                    |
|----------------------|--------------------------|----------------------------------------------------------|
| Durable              | n/a                      | Service Bus only supports durable messages.          |
| Priority             | n/a                      | Service Bus only supports a single message priority. |
| Ttl                  | Message.TimeToLive       | Conversion, Proton-PHP TTL is defined in milliseconds.   |
| first\_acquirer      | -                          | -                                                          |
| delivery\_count      | -                          | -                                                          |
| Id                   | Message.Id               | -                                                          |
| user\_id             | -                          | -                                                          |
| Address              | Message.To               | -                                                          |
| Subject              | Message.Label            | -                                                          |
| reply\_to            | Message.ReplyTo          | -                                                          |
| correlation\_id      | Message.CorrelationId    | -                                                          |
| content\_type        | Message.ContentType      | -                                                          |
| content\_encoding    | n/a                      | -                                                          |
| expiry\_time         | Message.ExpiresAtUTC     | -                                                          |
| creation\_time       | n/a                      | -                                                          |
| group\_id            | Message.SessionId        | -                                                          |
| group\_sequence      | -                          | -                                                          |
| reply\_to\_group\_id | Message.ReplyToSessionId | -                                                          |
| Format               | n/a                      | -

#### Service Bus .NET APIs to Proton-PHP

| Service Bus .NET        | Proton-PHP                                             | Notes                                                  |
|-------------------------|--------------------------------------------------------|--------------------------------------------------------|
| ContentType             | Message-\>content\_type                                | -                                                        |
| CorrelationId           | Message-\>correlation\_id                              | -                                                        |
| EnqueuedTimeUtc         | Message-\>annotations[x-opt-enqueued-time]             | -                                                        |
| Label                   | Message-\>subject                                      | -                                                        |
| MessageId               | Message-\>id                                           | -                                                        |
| ReplyTo                 | Message-\>reply\_to                                    | -                                                        |
| ReplyToSessionId        | Message-\>reply\_to\_group\_id                         | -                                                        |
| ScheduledEnqueueTimeUtc | Message-\>annotations ["x-opt-scheduled-enqueue-time"] | -                                                        |
| SessionId               | Message-\>group\_id                                    | -                                                        |
| TimeToLive              | Message-\>ttl                                          | Conversion, Proton-PHP TTL is defined in milliseconds. |
| To                      | Message-\>address                                      | -                                                        |

## Next steps

Ready to learn more? Visit the following links:

- [Service Bus AMQP overview]
- [AMQP in Service Bus for Windows Server]


[BrokeredMessage]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.aspx
[AMQP in Service Bus for Windows Server]: https://msdn.microsoft.com/library/dn574799.aspx
[Service Bus AMQP overview]: service-bus-amqp-overview.md
