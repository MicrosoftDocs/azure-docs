---
title: Read input in any format using .NET custom deserializers in Azure Stream Analytics
description: This article explains the serialization format and the interfaces that define custom .NET deserializers for Azure Stream Analytics cloud and edge jobs.
author: ahartoon
ms.author: anboisve
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 6/16/2021
ms.custom: devx-track-csharp, devx-track-dotnet
---

# Read input in any format using .NET custom deserializers (Preview)

.NET custom deserializers allow your Azure Stream Analytics job to read data from formats outside of the three [built-in data formats](stream-analytics-parsing-json.md). This article explains the serialization format and the interfaces that define .NET custom deserializers for Azure Stream Analytics cloud and edge jobs. There are also example deserializers for Protocol Buffer and CSV format.

## .NET custom deserializer

Following code samples are the interfaces that define the custom deserializer and implement `StreamDeserializer<T>`.

`UserDefinedOperator` is the base class for all custom streaming operators. It initializes `StreamingContext`, which provides context, which includes mechanism for publishing diagnostics for which you'll need to debug any issues with your deserializer.

```csharp
    public abstract class UserDefinedOperator
    {
        public abstract void Initialize(StreamingContext streamingContext);
    }
```

The following code snippet is the deserialization for streaming data. 

Skippable errors should be emitted using `IStreamingDiagnostics` passed through `UserDefinedOperator`'s Initialize method. All exceptions will be treated as errors and the deserializer will be recreated. After some errors, the job will go to a failed status.

`StreamDeserializer<T>` deserializes a stream into object of type `T`. The following conditions must be met:

1. T is a class or a struct.
1. All public fields in T are either
    1. One of [sbyte, byte, short, ushort, int, uint, long, DateTime, string, float, double] or their nullable equivalents.
    1. Another struct or class following the same rules.
    1. Array of type `T2` that follows the same rules.
    1. `IListT2` where T2 follows the same rules.
    1. Doesn't have any recursive types.

The parameter `stream` is the stream containing the serialized object. `Deserialize` returns a collection of `T` instances.

```csharp
    public abstract class StreamDeserializer<T> : UserDefinedOperator
    {
        public abstract IEnumerable<T> Deserialize(Stream stream);
    }
```

`StreamingContext` provides context, which includes mechanism for publishing diagnostics for user operator.

```csharp
    public abstract class StreamingContext
    {
        public abstract StreamingDiagnostics Diagnostics { get; }
    }
```

`StreamingDiagnostics` is the diagnostics for user defined operators including serializer, deserializer, and user defined functions.

`WriteError` writes an error message to resource logs and sends the error to diagnostics.

`briefMessage` is a brief error message. This message shows up in diagnostics and is used by the product team for debugging purposes. Don't include sensitive information, and keep the message fewer than 200 characters

`detailedMessage` is a detailed error message that is only added to your resource logs in your storage. This message should be less than 2000 characters.

```csharp
    public abstract class StreamingDiagnostics
    {
        public abstract void WriteError(string briefMessage, string detailedMessage);
    }
```

## Deserializer examples

This section shows you how to write custom deserializers for Protobuf and CSV. For more examples, such as AVRO format for Event Hubs Capture, visit [Azure Stream Analytics on GitHub](https://github.com/Azure/azure-stream-analytics/tree/master/CustomDeserializers).

### Protocol buffer (Protobuf) format

This is an example using protocol buffer format.

Assume the following protocol buffer definition.

```proto
syntax = "proto3";
// protoc.exe from nuget "Google.Protobuf.Tools" is used to generate .cs file from this schema definition.
// Run below command to generate the csharp class
// protoc.exe --csharp_out=. MessageBodyProto.proto

package SimulatedTemperatureSensor;
message MessageBodyProto {
    message Ambient {
      double temperature = 1;
      int64 humidity = 2;
    }

    message Machine {
      double temperature = 1;
      double pressure = 2;
    }

    Machine machine = 1;
    Ambient ambient = 2;
    string timeCreated = 3;
}
```

Running `protoc.exe` from the **Google.Protobuf.Tools** NuGet generates a .cs file with the definition. The generated file isn't shown here. You must ensure that the version of Protobuf NuGet you use in your Stream Analytics project matches the Protobuf version that was used to generate the input. 

The following code snippet is the deserializer implementation assuming the generated file is included in the project. This implementation is just a thin wrapper over the generated file.

```csharp
    public class MessageBodyDeserializer : StreamDeserializer<SimulatedTemperatureSensor.MessageBodyProto>
    {
        public override IEnumerable<SimulatedTemperatureSensor.MessageBodyProto> Deserialize(Stream stream)
        {
            while (stream.Position < stream.Length)
            {
                yield return SimulatedTemperatureSensor.MessageBodyProto.Parser.ParseDelimitedFrom(stream);
            }
        }

        public override void Initialize(StreamingContext streamingContext)
        {
        }
    }
```

### CSV

The following code snippet is a simple CSV deserializer that also demonstrates propagating errors.

```csharp
using System.Collections.Generic;
using System.IO;

using Microsoft.Azure.StreamAnalytics;
using Microsoft.Azure.StreamAnalytics.Serialization;

namespace ExampleCustomCode.Serialization
{
    public class CustomCsvDeserializer : StreamDeserializer<CustomEvent>
    {
        private StreamingDiagnostics streamingDiagnostics;

        public override IEnumerable<CustomEvent> Deserialize(Stream stream)
        {
            using (var sr = new StreamReader(stream))
            {
                string line = sr.ReadLine();
                while (line != null)
                {
                    if (line.Length > 0 && !string.IsNullOrWhiteSpace(line))
                    {
                        string[] parts = line.Split(',');
                        if (parts.Length != 3)
                        {
                            streamingDiagnostics.WriteError("Did not get expected number of columns", $"Invalid line: {line}");
                        }
                        else
                        {
                            yield return new CustomEvent()
                            {
                                Column1 = parts[0],
                                Column2 = parts[1],
                                Column3 = parts[2]
                            };
                        }
                    }

                    line = sr.ReadLine();
                }
            }
        }

        public override void Initialize(StreamingContext streamingContext)
        {
            this.streamingDiagnostics = streamingContext.Diagnostics;
        }
    }

    public class CustomEvent
    {
        public string Column1 { get; set; }

        public string Column2 { get; set; }

        public string Column3 { get; set; }
    }
}

```

## Serialization format for REST APIs

Every Stream Analytics input has a **serialization format**. For more information on input options, see the [Input REST API](/rest/api/streamanalytics/2020-03-01/inputs) documentation.

The following JavaScript code is an example of the .NET deserializer serialization format when using the REST API:

```javascript
{    
   "properties":{    
      "type":"stream",  
      "serialization":{    
         "type":"CustomCLR",  
         "properties":{    
            "serializationDllPath":"<path to the dll inside UserCustomCode\CLR\ folder>", 
            "serializationClassName":"<Full name of the deserializer class name>" 
         }  
      }
   }  
}  
```

`serializationClassName` should be a class that implements `StreamDeserializer<T>`. This is described in the following section.

## Region support

This feature is available in the following regions when using Standard SKU:

* West Central US
* North Europe
* East US
* West US
* East US 2
* West Europe

You can [request support](https://aka.ms/ccodereqregion) for more regions. However, there's no such region restriction when using [Stream Analytics clusters](./cluster-overview.md).

## Frequently asked questions

### When will this feature be available in all Azure regions?

This feature is available in [6 regions](#region-support). If you're interested in using this functionality in another region, you can [submit a request](https://aka.ms/ccodereqregion). Support for all Azure regions is on the roadmap.

### Can I access MetadataPropertyValue from my inputs similar to GetMetadataPropertyValue function?

This functionality isn't supported. If you need this capability, you can vote for this request on [UserVoice](https://feedback.azure.com/d365community/idea/b4517302-b925-ec11-b6e6-000d3a4f0f1c).

### Can I share my deserializer implementation with the community so that others can benefit?

Once you've implemented your deserializer, you can help others by sharing it with the community. Submit your code to the [Azure Stream Analytics GitHub repo](https://github.com/Azure/azure-stream-analytics/tree/master/CustomDeserializers).

### What are the other limitations of using custom deserializers in Stream Analytics?

If your input is of Protobuf format with a schema containing `MapField` type, you won't be able to implement a custom deserializer. Also, custom deserializers don't support sample data or preview data. 

## Next Steps

* [.NET custom deserializers for Azure Stream Analytics cloud jobs](custom-deserializer.md)
