---
# Required metadata
# For more information, see https://review.learn.microsoft.com/en-us/help/platform/learn-editor-add-metadata?branch=main
# For valid values of ms.service, ms.prod, and ms.topic, see https://review.learn.microsoft.com/en-us/help/platform/metadata-taxonomies?branch=main

title: Understand Device Update for Azure IoT Hub TLS download capabilities
description: Key concepts to understand for TLS download of update content from Device Update for IoT Hub.
author:      andrewbrownmsft # GitHub alias
ms.author: andbrown
ms.service: iot-hub-device-update
ms.topic: how-to
ms.date:     06/07/2024
---

# How to understand and use the Transport Layer Security (TLS) download feature in Device Update for IoT Hub (Preview)

When a device downloads an update from the Device Update service, the connection between the Device Update service and the device is HTTP-based. If a TLS connection (HTTPS) between the Device Update service and the device is preferred, this capability can be enabled upon request.

>[!NOTE]
>The TLS download feature is currently in [public preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## How to enable the TLS download feature

Obtain your Azure Subscription ID and your Device Update for IoT Hub *account*, *instance*, and *Azure region* information. Here's how to find that information:

- Azure Subscription ID:
  - See this article: [https://aka.ms/get-subscription-id](https://aka.ms/get-subscription-id)
    
- Device Update for IoT Hub information:
  - Go to the [Azure portal](https://portal.azure.com/).
  - Search for "Device Update for IoT Hubs" and select the **Device Update for IoT Hubs** option.
  - Select your Device Update account. The *account name* is at the top of the screen.
  - Select the **Overview** view from the left-hand navigation pane. Look for the "Location" field (such as "West US 2"). This field is your *Azure region*.
  - Under the **Instance Management** heading in the left-hand navigation bar, select **Instances**. You'll see your *instance name*.
  - Use [this link](https://nam.dcv.ms/dBgKOpqIL7) to submit the information. You'll receive a reply when your Device Update instance is enabled for the preview TLS download feature.
    
## Additional changes if using FreeRTOS

If you're using FreeRTOS, the [Azure IoT Middleware for FreeRTOS](https://github.com/Azure/azure-iot-middleware-freertos) and [FreeRTOS samples](https://github.com/Azure-Samples/iot-middleware-freertos-samples) available from Microsoft currently support HTTP URLs and need to be modified for TLS (HTTPS) URLs:

The Device Update for IoT Hub implementation in the Azure IoT Middleware for FreeRTOS SDK and samples use the below libraries for downloading the binaries:
[Azure_iot_http.h](https://github.com/Azure/azure-iot-middleware-freertos/blob/7759a42a1eab12818ea2a8f3f940847743968021/source/interface/azure_iot_http.h#L13), which depends on:

- [azure_iot_http_port.h](https://github.com/Azure/azure-iot-middleware-freertos/blob/7759a42a1eab12818ea2a8f3f940847743968021/ports/coreHTTP/azure_iot_http_port.h#L11)

- [azure_iot_transport_interface.h](https://github.com/Azure/azure-iot-middleware-freertos/blob/7759a42a1eab12818ea2a8f3f940847743968021/source/interface/azure_iot_transport_interface.h#L5)

The azure_iot_http_port.h can be modified to use the core http library for TLS - HTTPS support using the FreeRTOS example - [HTTP Demo (with TLS - Mutual Authentication) - FreeRTOS](https://www.freertos.org/http/http-demo-with-tls-mutual-authentication.html)

The Device Update for IoT Hub samples also have functions to parse the URL that need to be revised: [iot-middleware-freertos-samples/demos/sample_azure_iot_adu/sample_azure_iot_adu.c at main - Azure-Samples/iot-middleware-freertos-samples (github.com)](https://github.com/Azure-Samples/iot-middleware-freertos-samples/blob/main/demos/sample_azure_iot_adu/sample_azure_iot_adu.c#L396).

Finally, you may also need to make changes to your own implementation, such as changing the HTTPS header buffer to manage the update URL format that your device will receive from Device Update.

## Next steps

[Troubleshoot common issues](troubleshoot-device-update.md)

