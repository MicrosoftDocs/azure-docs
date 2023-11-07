---
title: Parsing Protobuf
description: This article describes how use Azure Stream Analytics with protobuf as a data input
ms.service: stream-analytics
author: enkrumah
ms.author: ebnkruma
ms.topic: conceptual
ms.date: 11/06/2023
ms.custom:
---
# Parse Protobuf in Azure Stream Analytics

Azure Stream Analytics supports processing events in protocol buffer data formats. You can use the built-in protobuf deserializer when configuring your inputs. To use the built-in deserializer, you will need to specify the protobuf definition file, message type and prefix style.

To configure your stream analytics job to deserialize events in protobuf, use the folowing guidance:

1. After creating your stream analytics job, click on **Inputs** 
1. Click on **Add input**  and select what input you want to configure to open the input configuration blade
1. Select **Event serialization format** to show a dropdown and select **Protobuf**

:::image type="content" source="./media/protobuf/protobuf-input-config.png" alt-text="Screenshot showing how to configure protobuf for an ASA job." lightbox="./media/protobuf/protobuf-input-config.png" :::

Complete the configuration using the following as guidance:

| Property name                | Description                                                                                                             |
|------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| Protobuf definition file            | A file that specifies the structure and datatypes of your protobuf events         |
| Message type   | The message type that you want to deserialize    |
| Prefix style                 | naming convention used for fields and elements within the .proto file. |

:::image type="content" source="./media/protobuf/protobuf.png" alt-text="Screenshot showing how protobuf dropdown in the input configuration blade of an ASA job." lightbox="./media/protobuf/protobuf.png" :::


### Limitations

1. Protobuf Deserializer takes only 1 .proto file at a time. Imports to custom made .proto files is not supported.
    For example:
    :::image type="content" source="./media/protobuf/one-proto-example.png" alt-text="Screenshot showing how protobuf dropdown in the input configuration blade of an ASA job." lightbox="./media/protobuf/one-proto-example.png" :::

    This proto file refers to another .proto file in its imports. Because the protobuf deserializers would have only the current .proto file and not know what carseat.proto is it would be unable to deserialize properly.

2. Enums are not supported. If a .proto file contains enums, then proto events will deserialize but the enum field will be empty leading to data loss.

3. Maps in protobuf are currently not supported. a map in protobuf will result in an error about missing a string key.

4. When a .proto file contains a namespace or pack. Then the message type must include it.
    For example:
    :::image type="content" source="./media/protobuf/proto-namespace-example.png" alt-text="Screenshot showing how protobuf dropdown in the input configuration blade of an ASA job." lightbox="./media/protobuf/proto.namepace.example.png" :::

    In the Protobuf Deserializer in portal, the message type must be **namespacetest.Volunteer** instead of the usual **Volunteer**.

5.	When sending messages that were serialized using Google.Protobuf, the pre-fix type should be set to base128 since that is the most cross compatible type.

6. Service Messages are not supported in the protobuf deserializers. Your job will throw an exception if attempt to use a service message.

7. Current datatypes not supported: 
    * Any
    * One of (related to enums)
    * Durations
    * Struct
    * Field Mask (Not supported by protobuf-net)
    * List Value
    * Value
    * Null Value
    * Empty

## See Also
[Data Types in Azure Stream Analytics](/stream-analytics-query/data-types-azure-stream-analytics)
