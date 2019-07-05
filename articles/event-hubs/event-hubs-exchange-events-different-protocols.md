---
title: Exchange events between apps that use different protocols - Azure Event Hubs| Microsoft Docs
description: This article shows how consumers and producers that use different protocols (AMQP, Apache Kafka, and HTTPS) can exchange events when using Azure Event Hubs. 
services: event-hubs
documentationcenter: ''
author: basilhariri
manager: 

ms.service: event-hubs
ms.devlang: na
ms.topic: article
ms.custom: seodec18
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/06/2018
ms.author: bahariri

---

# Exchange events between consumers and producers that use different protocols: AMQP, Kafka, and HTTPS
Azure Event Hubs supports three protocols for consumers and producers: AMQP, Kafka, and HTTPS. Each one of these protocols has its own way of representing a message, so naturally the following question arises: if an application sends events to an Event Hub with one protocol and consumes them with a different protocol, what do the various parts and values of the event look like when they arrive at the consumer? This article discusses best practices for both producer and consumer to ensure that the values within an event are correctly interpreted by the consuming application.

The advice in this article specifically covers these clients, with the listed versions used in developing the code snippets:

* Kafka Java client (version 1.1.1 from https://www.mvnrepository.com/artifact/org.apache.kafka/kafka-clients)
* Microsoft Azure Event Hubs Client for Java (version 1.1.0 from https://github.com/Azure/azure-event-hubs-java)
* Microsoft Azure Event Hubs Client for .NET (version 2.1.0 from https://github.com/Azure/azure-event-hubs-dotnet)
* Microsoft Azure Service Bus (version 5.0.0 from https://www.nuget.org/packages/WindowsAzure.ServiceBus)
* HTTPS (supports producers only)

Other AMQP clients may behave slightly differently. AMQP has a well-defined type system, but the specifics of serializing language-specific types to and from that type system depends on the client, as does how the client provides access to the parts of an AMQP message.

## Event Body
All of the Microsoft AMQP clients represent the event body as an uninterpreted bag of bytes. A producing application passes a sequence of bytes to the client, and a consuming application receives that same sequence from the client. The interpretation of byte sequence happens within the application code.

When sending an event via HTTPS, the event body is the POSTed content, which is also treated as uninterpreted bytes. It is easy to achieve the same state in a Kafka producer or consumer by using the provided ByteArraySerializer and ByteArrayDeserializer as shown in the following code:

### Kafka byte[] producer

```java
final Properties properties = new Properties();
// add other properties
properties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, ByteArraySerializer.class.getName());

final KafkaProducer<Long, byte[]> producer = new KafkaProducer<Long, byte[]>(properties);

final byte[] eventBody = new byte[] { 0x01, 0x02, 0x03, 0x04 };
ProducerRecord<Long, byte[]> pr =
    new ProducerRecord<Long, byte[]>(myTopic, myPartitionId, myTimeStamp, eventBody);
```

### Kafka byte[] consumer
```java
final Properties properties = new Properties();
// add other properties
properties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, ByteArrayDeserializer.class.getName());

final KafkaConsumer<Long, byte[]> consumer = new KafkaConsumer<Long, byte[]>(properties);

ConsumerRecord<Long, byte[]> cr = /* receive event */
// cr.value() is a byte[] with values { 0x01, 0x02, 0x03, 0x04 }
```

This code creates a transparent byte pipeline between the two halves of the application and allows the application developer to manually serialize and deserialize in any way desired, including making deserialization decisions at runtime, for example based on type or sender information in user-set properties on the event.

Applications that have a single, fixed event body type may be able to use other Kafka serializers, and deserializers to transparently convert data. For example, consider an application, which uses JSON. The construction and interpretation of the JSON string happens at the application level. At the Event Hubs level, the event body is always a string, a sequence of bytes representing characters in the UTF-8 encoding. In this case, the Kafka producer or consumer can take advantage of the provided
StringSerializer or StringDeserializer as shown in the following code:

### Kafka UTF-8 string producer
```java
final Properties properties = new Properties();
// add other properties
properties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());

final KafkaProducer<Long, String> producer = new KafkaProducer<Long, String>(properties);

final String exampleJson = "{\"name\":\"John\", \"number\":9001}";
ProducerRecord<Long, String> pr =
    new ProducerRecord<Long, String>(myTopic, myPartitionId, myTimeStamp, exampleJson);
```

### Kafka UTF-8 string consumer
```java
final Properties properties = new Properties();
// add other properties
properties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());

final KafkaConsumer<Long, String> consumer = new KafkaConsumer<Long, String>(properties);

ConsumerRecord<Long, Bytes> cr = /* receive event */
final String receivedJson = cr.value();
```

For the AMQP side, both Java and .NET provide built-in ways to convert strings to and from UTF-8 byte sequences. The Microsoft AMQP clients represent events as a class named EventData. The following examples show you how to serialize a UTF-8 string into an EventData event body in an AMQP producer, and how to deserialize an EventData event body into a UTF-8 string in an AMQP consumer.

### Java AMQP UTF-8 string producer
```java
final String exampleJson = "{\"name\":\"John\", \"number\":9001}";
final EventData ed = EventData.create(exampleJson.getBytes(StandardCharsets.UTF_8));
```

### Java AMQP UTF-8 string consumer
```java
EventData ed = /* receive event */
String receivedJson = new String(ed.getBytes(), StandardCharsets.UTF_8);
```

### C# .NET UTF-8 string producer
```csharp
string exampleJson = "{\"name\":\"John\", \"number\":9001}";
EventData working = new EventData(Encoding.UTF8.GetBytes(exampleJson));
```

### C# .NET UTF-8 string consumer
```csharp
EventData ed = /* receive event */

// getting the event body bytes depends on which .NET client is used
byte[] bodyBytes = ed.Body.Array;  // Microsoft Azure Event Hubs Client for .NET
// byte[] bodyBytes = ed.GetBytes(); // Microsoft Azure Service Bus

string receivedJson = Encoding.UTF8.GetString(bodyBytes);
```

Because Kafka is open-source, the application developer can inspect the implementation of any serializer or deserializer and implement code, which produces or consumes a compatible sequence of bytes on the AMQP side.

## Event User Properties

User-set properties can be set and retrieved from both AMQP clients (in the Microsoft AMQP clients they are called properties) and Kafka (where they are called headers). HTTPS senders can set user properties on an event by supplying them as HTTP headers in the POST operation. However, Kafka treats both event bodies and event header values as byte sequences. Whereas in AMQP clients, property values have types, which are communicated by encoding the property values according to the AMQP type system.

HTTPS is a special case. At the point of sending, all property values are UTF-8 text. The Event Hubs service does a limited amount of interpretation to convert appropriate property values to AMQP-encoded 32-bit and 64-bit signed integers, 64-bit floating point numbers, and booleans. Any property value, which does not fit one of those types is treated as a string.

Mixing these approaches to property typing means that a Kafka consumer sees the raw AMQP-encoded byte sequence, including the AMQP type information. Whereas an AMQP consumer sees the untyped byte sequence sent by the Kafka producer, which the application must interpret.

For Kafka consumers that receive properties from AMQP or HTTPS producers, use the AmqpDeserializer class, which is modeled after the other deserializers in the Kafka ecosystem. It interprets the type information in the AMQP-encoded byte sequences to deserialize the data bytes into a Java type.

As a best practice, we recommend that you include a property in messages sent via AMQP or HTTPS. The Kafka consumer can use it to determine whether header values need AMQP deserialization. The value of the property is not important. It just needs a well-known name that the Kafka consumer can find in the list of headers and
adjust its behavior accordingly.

### AMQP to Kafka part 1: create and send an event in C# (.NET) with properties
```csharp
// Create an event with properties "MyStringProperty" and "MyIntegerProperty"
EventData working = new EventData(Encoding.UTF8.GetBytes("an event body"));
working.Properties.Add("MyStringProperty", "hello");
working.Properties.Add("MyIntegerProperty", 1234);

// BEST PRACTICE: include a property which indicates that properties will need AMQP deserialization
working.Properties.Add("AMQPheaders", 0);
```

### AMQP to Kafka part 2: use AmqpDeserializer to deserialize those properties in a Kafka consumer
```java
final AmqpDeserializer amqpDeser = new AmqpDeserializer();

ConsumerRecord<Long, Bytes> cr = /* receive event */
final Header[] headers = cr.headers().toArray();

final Header headerNamedMyStringProperty = /* find header with key "MyStringProperty" */
final Header headerNamedMyIntegerProperty = /* find header with key "MyIntegerProperty" */
final Header headerNamedAMQPheaders = /* find header with key "AMQPheaders", or null if not found */

// BEST PRACTICE: detect whether AMQP deserialization is needed
if (headerNamedAMQPheaders != null) {
    // The deserialize() method requires no prior knowledge of a property's type.
    // It returns Object and the application can check the type and perform a cast later.
    Object propertyOfUnknownType = amqpDeser.deserialize("topicname", headerNamedMyStringProperty.value());
    if (propertyOfUnknownType instanceof String) {
        final String propertyString = (String)propertyOfUnknownType;
        // do work here
    }
    propertyOfUnknownType = amqpDeser.deserialize("topicname", headerNamedMyIntegerProperty.value());
    if (propertyOfUnknownType instanceof Integer) {
        final Integer propertyInt = (Integer)propertyOfUnknownType;
        // do work here
    }
} else {
    /* event sent via Kafka, interpret header values the Kafka way */
}
```

If the application knows the expected type for a property, there are deserialization methods that do not require a cast afterwards, but they throw an error if the property is not of the expected type.

### AMQP to Kafka part 3: a different way of using AmqpDeserializer in a Kafka consumer
```java
// BEST PRACTICE: detect whether AMQP deserialization is needed
if (headerNamedAMQPheaders != null) {
    // Property "MyStringProperty" is expected to be of type string.
    try {
        final String propertyString = amqpDeser.deserializeString(headerNamedMyStringProperty.value());
        // do work here
    }
    catch (IllegalArgumentException e) {
        // property was not a string
    }

    // Property "MyIntegerProperty" is expected to be a signed integer type.
    // The method returns long because long can represent the value range of all AMQP signed integer types.
    try {
        final long propertyLong = amqpDeser.deserializeSignedInteger(headerNamedMyIntegerProperty.value());
        // do work here
    }
    catch (IllegalArgumentException e) {
        // property was not a signed integer
    }
} else {
    /* event sent via Kafka, interpret header values the Kafka way */
}
```

Going the other direction is more involved, because headers set by a Kafka producer are always seen by an AMQP consumer as raw bytes (type org.apache.qpid.proton.amqp.Binary for the Microsoft Azure Event Hubs Client for Java, or `System.Byte[]` for Microsoft's .NET AMQP clients). The easiest path is to use one of the Kafka-supplied serializers to generate the bytes for the header values on the Kafka producer side, and then write a compatible deserialization code on the AMQP consumer side.

As with AMQP-to-Kafka, the best practice that we recommend is to include a property in messages sent via Kafka. The AMQP consumer can use the property to determine whether header values need deserialization. The value of the property is not important. It just needs a well-known name that the AMQP consumer can find in the list of headers and adjust its behavior accordingly. If the Kafka producer cannot be changed, it is also possible for the consuming application to check whether the property value is of a binary or byte type and attempt deserialization based on the type.

### Kafka to AMQP part 1: create and send an event from Kafka with properties
```java
final String topicName = /* topic name */
final ProducerRecord<Long, String> pr = new ProducerRecord<Long, String>(topicName, /* other arguments */);
final Headers h = pr.headers();

// Set headers using Kafka serializers
IntegerSerializer intSer = new IntegerSerializer();
h.add("MyIntegerProperty", intSer.serialize(topicName, 1234));

LongSerializer longSer = new LongSerializer();
h.add("MyLongProperty", longSer.serialize(topicName, 5555555555L));

ShortSerializer shortSer = new ShortSerializer();
h.add("MyShortProperty", shortSer.serialize(topicName, (short)22222));

FloatSerializer floatSer = new FloatSerializer();
h.add("MyFloatProperty", floatSer.serialize(topicName, 1.125F));

DoubleSerializer doubleSer = new DoubleSerializer();
h.add("MyDoubleProperty", doubleSer.serialize(topicName, Double.MAX_VALUE));

StringSerializer stringSer = new StringSerializer();
h.add("MyStringProperty", stringSer.serialize(topicName, "hello world"));

// BEST PRACTICE: include a property which indicates that properties will need deserialization
h.add("RawHeaders", intSer.serialize(0));
```

### Kafka to AMQP part 2: manually deserialize those properties in C# (.NET)
```csharp
EventData ed = /* receive event */

// BEST PRACTICE: detect whether manual deserialization is needed
if (ed.Properties.ContainsKey("RawHeaders"))
{
    // Kafka serializers send bytes in big-endian order, whereas .NET on x86/x64 is little-endian.
    // Therefore it is frequently necessary to reverse the bytes before further deserialization.

    byte[] rawbytes = ed.Properties["MyIntegerProperty"] as System.Byte[];
    if (BitConverter.IsLittleEndian)
    {
            Array.Reverse(rawbytes);
    }
    int myIntegerProperty = BitConverter.ToInt32(rawbytes, 0);

    rawbytes = ed.Properties["MyLongProperty"] as System.Byte[];
    if (BitConverter.IsLittleEndian)
    {
            Array.Reverse(rawbytes);
    }
    long myLongProperty = BitConverter.ToInt64(rawbytes, 0);

    rawbytes = ed.Properties["MyShortProperty"] as System.Byte[];
    if (BitConverter.IsLittleEndian)
    {
            Array.Reverse(rawbytes);
    }
    short myShortProperty = BitConverter.ToInt16(rawbytes, 0);

    rawbytes = ed.Properties["MyFloatProperty"] as System.Byte[];
    if (BitConverter.IsLittleEndian)
    {
            Array.Reverse(rawbytes);
    }
    float myFloatProperty = BitConverter.ToSingle(rawbytes, 0);

    rawbytes = ed.Properties["MyDoubleProperty"] as System.Byte[];
    if (BitConverter.IsLittleEndian)
    {
            Array.Reverse(rawbytes);
    }
    double myDoubleProperty = BitConverter.ToDouble(rawbytes, 0);

    rawbytes = ed.Properties["MyStringProperty"] as System.Byte[];
string myStringProperty = Encoding.UTF8.GetString(rawbytes);
}
```

### Kafka to AMQP part 3: manually deserialize those properties in Java
```java
final EventData ed = /* receive event */

// BEST PRACTICE: detect whether manual deserialization is needed
if (ed.getProperties().containsKey("RawHeaders")) {
    byte[] rawbytes =
        ((org.apache.qpid.proton.amqp.Binary)ed.getProperties().get("MyIntegerProperty")).getArray();
    int myIntegerProperty = 0;
    for (byte b : rawbytes) {
        myIntegerProperty <<= 8;
        myIntegerProperty |= ((int)b & 0x00FF);
    }

    rawbytes = ((org.apache.qpid.proton.amqp.Binary)ed.getProperties().get("MyLongProperty")).getArray();
    long myLongProperty = 0;
    for (byte b : rawbytes) {
        myLongProperty <<= 8;
        myLongProperty |= ((long)b & 0x00FF);
    }

    rawbytes = ((org.apache.qpid.proton.amqp.Binary)ed.getProperties().get("MyShortProperty")).getArray();
    short myShortProperty = (short)rawbytes[0];
    myShortProperty <<= 8;
    myShortProperty |= ((short)rawbytes[1] & 0x00FF);

    rawbytes = ((org.apache.qpid.proton.amqp.Binary)ed.getProperties().get("MyFloatProperty")).getArray();
    int intbits = 0;
    for (byte b : rawbytes) {
        intbits <<= 8;
        intbits |= ((int)b & 0x00FF);
    }
    float myFloatProperty = Float.intBitsToFloat(intbits);

    rawbytes = ((org.apache.qpid.proton.amqp.Binary)ed.getProperties().get("MyDoubleProperty")).getArray();
    long longbits = 0;
    for (byte b : rawbytes) {
        longbits <<= 8;
        longbits |= ((long)b & 0x00FF);
    }
    double myDoubleProperty = Double.longBitsToDouble(longbits);

    rawbytes = ((org.apache.qpid.proton.amqp.Binary)ed.getProperties().get("MyStringProperty")).getArray();
String myStringProperty = new String(rawbytes, StandardCharsets.UTF_8);
}
```

## Next steps
In this article, you learned how to stream into Kafka-enabled Event Hubs without changing your protocol clients or running your own clusters. To learn more about Event Hubs and Event Hubs for Kafka, see the following articles:  

* [Learn about Event Hubs](event-hubs-what-is-event-hubs.md)
* [Learn about Event Hubs for Kafka](event-hubs-for-kafka-ecosystem-overview.md)
* [Explore more samples on the Event Hubs for Kafka GitHub](https://github.com/Azure/azure-event-hubs-for-kafka)
* Use [MirrorMaker](https://cwiki.apache.org/confluence/pages/viewpage.action?pageId=27846330) to [stream events from Kafka on premises to Kafka enabled Event Hubs on cloud.](event-hubs-kafka-mirror-maker-tutorial.md)
* Learn how to stream into Kafka enabled Event Hubs using [native Kafka applications](event-hubs-quickstart-kafka-enabled-event-hubs.md), [Apache Flink](event-hubs-kafka-flink-tutorial.md), or [Akka Streams](event-hubs-kafka-akka-streams-tutorial.md)
