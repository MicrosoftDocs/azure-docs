---
 title: Turn on preview mode for Azure IoT Hub
 description: Learn how to turn on preview mode for IoT Hub, why you would want to, and some warnings
 services: iot-hub
 author: kgremban
 ms.service: iot-hub
 ms.topic: conceptual
 ms.date: 11/24/2020
 ms.author: kgremban
---

# Turn on preview mode for IoT Hub to try select new features

<!-- 
- We are working hard to bring you new features
- Some of these features require a brand new iot hub with preview mode on
- some features may not work at all or have unexpected behavior
- "Normal preview features" do NOT require preview mode 
- Support opt-in at creation time only
- Customer cannot opt back out post creation
- If customer wants to evaluate, they must use new hub dedicated for the preview
- Banners, documentations and all materials indicate preview quality: no GA guarantee at all
-->

New features are in public preview for IoT Hub, including:

- MQTT 5
- ECC server certificate
- TLS fragment length negotiation
- X509 CA chain support for HTTPS/WebSocket

These features are improvements at the IoT Hub protocol and authentication layers, so they're only available for **new** IoT hub for now. They're *not* available for existing IoT hubs yet. To preview these features, the IoT hub must be created with preview mode turned on.

## Turn on preview mode for a new IoT hub

1. Sign in to the [Azure portal](https://portal.azure.com).

1. From the Azure homepage, select the **+ Create a resource** button, and then enter *IoT Hub* in the **Search the Marketplace** field.

1. Select **IoT Hub** from the search results, and then select **Create**.

1. On the **Basics** tab, complete the fields [as you normally would](iot-hub-create-through-portal.md) except for **Region**. Select one of these regions:
    
    - Central US
    - West Europe
    - South East Asia

1. Select **Management** tab, then expand the **Advanced settings** section.

1. Next to **Preview mode**, select **On**. Review the warning text carefully.

    :::image type="content" source="media/iot-hub-preview-mode/turn-on-preview-mode-at-create.png" alt-text="Image showing where to select the preview mode option when creating a new IoT hub":::

1. Select **Next: Review + create**, then **Create**.

Once created, an IoT hub in preview mode always shows this banner, letting you know to use this IoT hub for preview purposes only: 

:::image type="content" source="media/iot-hub-preview-mode/banner.png" alt-text="Image showing banner for preview mode IoT hub":::

## Using an IoT hub in preview mode

Do *not* use an IoT hub in preview mode for production. Preview mode is intended *only* to preview the select features listed at top of this page. Some other limitations to IoT Hub preview mode are

- Some existing IoT Hub features such as IP filter, private link, managed identity, device streams, and failover may work unexpectedly or not at all.
- An IoT hub in preview mode can't be changed or upgraded to a normal IoT hub.
- We can't guarantee the normal [IoT Hub SLA](https://azure.microsoft.com/support/legal/sla/iot-hub/v1_2/) - do not use for production.

> [!TIP]
> Preview mode isn't required for [device streams](iot-hub-device-streams-overview.md) and [distributed tracing](iot-hub-distributed-tracing.md). To use these older preview features, follow the their documentation as normal. 

## Next steps

- To preview the MQTT 5 support, see [IoT Hub MQTT 5 support overview (preview)](../iot/iot-mqtt-5-preview.md)
- To preview the ECC server certificate, see [Elliptic Curve Cryptography (ECC) server TLS certificate (preview)](iot-hub-tls-support.md#elliptic-curve-cryptography-ecc-server-tls-certificate-preview)
- To preview TLS fragment size negotiation, see [TLS maximum fragment length negotiation (preview)](iot-hub-tls-support.md#tls-maximum-fragment-length-negotiation-preview)