---
title: Parse Protobuf
description: This article describes how to use Azure Stream Analytics with Protobuf as data input.
ms.service: stream-analytics
author: enkrumah
ms.author: ebnkruma
ms.topic: conceptual
ms.date: 11/13/2023
ms.custom:
---
# Parse Protobuf in Azure Stream Analytics

Azure Stream Analytics supports processing events in Protocol Buffer (Protobuf) data formats. You can use the built-in Protobuf deserializer when configuring your inputs. To use the built-in deserializer, specify the Protobuf definition file, message type, and prefix style.

## Steps to configure a Stream Analytics job

To configure your Stream Analytics job to deserialize events in Protobuf:

1. After you create your Stream Analytics job, select **Inputs**.
1. Select **Add input**, and then select what input you want to configure to open the pane for input configuration.
1. Select **Event serialization format** to show a dropdown list, and then select **Protobuf (preview)**.

   :::image type="content" source="./media/protobuf/protobuf-input-config.png" alt-text=" Screenshot that shows selections for configuring Protobuf for an Azure Stream Analytics job." lightbox="./media/protobuf/protobuf-input-config.png" :::

1. Complete the configuration by using the following guidance:

   | Property name                | Description                                                                                                             |
   |------------------------------|-------------------------------------------------------------------------------------------------------------------------|
   | **Protobuf definition file**            | A file that specifies the structure and data types of your Protobuf events         |
   | **Message type**   | The message type that you want to deserialize    |
   | **Prefix style**                 | Setting that determines how long a message is to deserialize Protobuf events correctly |

   :::image type="content" source="./media/protobuf/protobuf.png" alt-text=" Screenshot that shows the input boxes on the configuration pane for an Azure Stream Analytics job, after you select Protobuf as the event serialization format." lightbox="./media/protobuf/protobuf.png" :::

To learn more about Protobuf data types, see the [official Protocol Buffers documentation](https://protobuf.dev/reference/protobuf/google.protobuf/).

## Limitations

- The Protobuf deserializer takes only one Protobuf definition file at a time. Imports to custom-made Protobuf definition files aren't supported. For example:

    :::image type="content" source="./media/protobuf/one-proto-example.png" alt-text=" Screenshot that shows an example of a custom-made Protobuf definition file." lightbox="./media/protobuf/one-proto-example.png" :::

    This Protobuf definition file refers to another Protobuf definition file in its imports. Because the Protobuf deserializer would have only the current Protobuf definition file and not know what *carseat.proto* is, it would be unable to deserialize correctly.

- Enumerations aren't supported. If the Protobuf definition file contains enumerations, the `enum` field is empty when the Protobuf events deserialize. This condition leads to data loss.

- Maps in Protobuf aren't supported. Maps in Protobuf result in an error about missing a string key.

- When a Protobuf definition file contains a namespace or package, the message type must include it. For example:

    :::image type="content" source="./media/protobuf/proto-namespace-example.png" alt-text=" Screenshot that shows an example of a Protobuf definition file with a namespace." lightbox="./media/protobuf/proto-namespace-example.png" :::

    In the Protobuf deserializer in the portal, the message type must be `namespacetest.Volunteer` instead of the usual `Volunteer`.

- When you're sending messages that were serialized via `google.protobuf`, the prefix type should be set to `base128` because that's the most cross-compatible type.

- Service messages aren't supported in the Protobuf deserializers. Your job throws an exception if you try to use a service message. For example:

    :::image type="content" source="./media/protobuf/service-message-proto.png" alt-text=" Screenshot that shows an example of a service message." lightbox="./media/protobuf/service-message-proto.png" :::

- These data types aren't supported:

  - `Any`
  - `One of` (related to enumerations)
  - `Durations`
  - `Struct`
  - `Field Mask` (not supported by protobuf-net)
  - `List Value`
  - `Value`
  - `Null Value`
  - `Empty`

> [!NOTE]
> For direct help with using the Protobuf deserializer, send email to [askasa@microsoft.com](mailto:askasa@microsoft.com).

## See also

[Data types in Azure Stream Analytics](/stream-analytics-query/data-types-azure-stream-analytics)
