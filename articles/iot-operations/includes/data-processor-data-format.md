---
 title: include file
 description: include file
 author: dominicbetts
 ms.topic: include
 ms.date: 10/23/2023
 ms.author: dobett
ms.custom:
  - include file
  - ignite-2023
---

In a Data Processor pipeline, the [format](../process-data/concept-supported-formats.md) field in the source stage specifies how to deserialize the incoming data. By default, the Data Processor pipeline uses the `raw` format that means it doesn't convert the incoming data. To use many Data Processor features such as `Filter` or `Enrich` stages in a pipeline, you must deserialize your data in the input stage. You can choose to deserialize your incoming data from `JSON`, `jsonStream`, `MessagePack`, `CBOR`, `CSV`, or `Protobuf` formats into a Data Processor readable message in order to use the full Data Processor functionality.

The following tables describe the different deserialization configuration options:

| Field | Description | Required | Default | Value |
|---|---|---|---|---|
| Data Format | The type of the data format. | Yes | `Raw` | `Raw` `JSON` `jsonStream` `MessagePack` `CBOR` `CSV` `Protobuf` |

The `Data Format` field is mandatory and its value determines the other required fields.

To deserialize CSV messages, you also need to specify the following fields:

| Field | Description | Required | Value | Example |
|----|---|---|---|---|
| Header | Whether the CSV data includes a header line. | Yes | `Yes` `No` | `No` |
| Name | Name of the column in CSV | Yes | - | `temp`, `asset` |
| Path | The [jq path](../process-data/concept-jq-path.md) in the message where the column information is added. | No | - | The default jq path is the column name |
| Data Type | The data type of the data in the column and how it's represented inside the Data Processor pipeline. | No | `String`, `Float`, `Integer`, `Boolean`, `Bytes` | Default: `String` |

To deserialize Protobuf messages, you also need to specify the following fields:

| Field | Description | Required | Value | Example |
|---|---|---|---|---|
| Descriptor | The base64-encoded descriptor for the protobuf definition. | Yes | - | `Zhf...` |
| Message | The name of the message type that's used to format the data. | Yes | - | `pipeline` |
| Package | The name of the package in the descriptor where the type is defined. | Yes | - | `schedulerv1` |

> [!NOTE]
> Data Processor supports only one message type in each **.proto** file.
