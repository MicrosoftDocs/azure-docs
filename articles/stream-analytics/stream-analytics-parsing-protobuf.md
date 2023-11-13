---
title: Parsing Protobuf
description: This article describes how to use Azure Stream Analytics with protobuf as a data input
ms.service: stream-analytics
author: enkrumah
ms.author: ebnkruma
ms.topic: conceptual
ms.date: 11/13/2023
ms.custom:
---
# Parse Protobuf in Azure Stream Analytics

Azure Stream Analytics supports processing events in protocol buffer data formats. You can use the built-in protobuf deserializer when configuring your inputs. To use the built-in deserializer, specify the protobuf definition file, message type, and prefix style.

To configure your stream analytics job to deserialize events in protobuf, use the following guidance:

1. After creating your stream analytics job, click on **Inputs** 
1. Click on **Add input**  and select what input you want to configure to open the input configuration blade
1. Select **Event serialization format** to show a dropdown and select **Protobuf**

:::image type="content" source="./media/protobuf/protobuf-input-config.png" alt-text=" Screenshot showing how to configure protobuf for an ASA job." lightbox="./media/protobuf/protobuf-input-config.png" :::

Complete the configuration using the following guidance:

| Property name                | Description                                                                                                             |
|------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| Protobuf definition file            | A file that specifies the structure and datatypes of your protobuf events         |
| Message type   | The message type that you want to deserialize    |
| Prefix style                 | It is used to determine how long a message is to deserialize protobuf events correctly |

:::image type="content" source="./media/protobuf/protobuf.png" alt-text=" Screenshot showing how protobuf dropdown in the input configuration blade of an ASA job." lightbox="./media/protobuf/protobuf.png" :::

> [!NOTE]
> To learn more about Protobuf datatypes, visit the [Official Protocol Buffers Documentation](https://protobuf.dev/reference/protobuf/google.protobuf/) .
>

### Limitations

1. Protobuf Deserializer takes only one (1) protobuf definition file at a time. Imports to custom-made protobuf definition files aren't supported.
    For example:
    :::image type="content" source="./media/protobuf/one-proto-example.png" alt-text=" Screenshot showing how an example of a custom-made protobuf definition file." lightbox="./media/protobuf/one-proto-example.png" :::

    This protobuf definition file refers to another protobuf definition file in its imports. Because the protobuf deserializer would have only the current protobuf definition file and not know what carseat.proto is, it would be unable to deserialize correctly.

2. Enums aren't supported. If the protobuf definition file contains enums, then protobuf events deserialize, but the enum field is empty, leading to data loss.

3. Maps in protobuf are currently not supported. Maps in protobuf result in an error about missing a string key.

4. When a protobuf definition file contains a namespace or package, the message type must include it.
    For example:
    :::image type="content" source="./media/protobuf/proto-namespace-example.png" alt-text=" Screenshot showing an example of a protobuf definition file with a namespace." lightbox="./media/protobuf/proto-namespace-example.png" :::

    In the Protobuf Deserializer in portal, the message type must be **namespacetest.Volunteer** instead of the usual **Volunteer**.

5.	When sending messages that were serialized using Google.Protobuf, the prefix type should be set to base128 since that is the most cross-compatible type.

6. Service Messages aren't supported in the protobuf deserializers. Your job throws an exception if you attempt to use a service message.
    For example:
    :::image type="content" source="./media/protobuf/service-message-proto.png" alt-text=" Screenshot showing an example of a service message." lightbox="./media/protobuf/service-message-proto.png" :::
   
8. Current datatypes not supported: 
    * Any
    * One of (related to enums)
    * Durations
    * Struct
    * Field Mask (Not supported by protobuf-net)
    * List Value
    * Value
    * Null Value
    * Empty

> [!NOTE]
> For direct help with using the protobuf deserializer, please reach out to [askasa@microsoft.com](mailto:askasa@microsoft.com).
>

## See Also
[Data Types in Azure Stream Analytics](/stream-analytics-query/data-types-azure-stream-analytics)
