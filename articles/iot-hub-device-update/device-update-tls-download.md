---
# Required metadata
# For more information, see https://review.learn.microsoft.com/en-us/help/platform/learn-editor-add-metadata?branch=main
# For valid values of ms.service, ms.prod, and ms.topic, see https://review.learn.microsoft.com/en-us/help/platform/metadata-taxonomies?branch=main

title: Understand Device Update for Azure IoT Hub TLS download capabilities
description: Key concepts to understand for TLS download of update content from Device Update for IoT Hub.
author:      andrewbrownmsft # GitHub alias
ms.author: andbrown
ms.service: azure-iot-hub
ms.topic: how-to
ms.date:     06/07/2024
ms.subservice: device-update
---

# How to understand and use the Transport Layer Security (TLS) download feature in Device Update for IoT Hub (Preview)

When a device downloads an update from the Device Update service, the connection between the Device Update service and the device is HTTP-based. If a TLS connection (HTTPS) between the Device Update service and the device is preferred, this capability is currently under consideration.

> [!NOTE]
> The TLS download feature preview is currently closed. This page is being maintained for existing preview customers. The page will be updated if the preview is re-opened for additional customers.

## Additional considerations if using FreeRTOS

If you're using FreeRTOS, the [Azure IoT Middleware for FreeRTOS](https://github.com/Azure/azure-iot-middleware-freertos) and [FreeRTOS samples](https://github.com/Azure-Samples/iot-middleware-freertos-samples) available from Microsoft currently support HTTP URLs and need to be modified for TLS (HTTPS) URLs:

The Device Update for IoT Hub implementation in the Azure IoT Middleware for FreeRTOS SDK and samples use the below libraries for downloading the binaries:
[Azure_iot_http.h](https://github.com/Azure/azure-iot-middleware-freertos/blob/7759a42a1eab12818ea2a8f3f940847743968021/source/interface/azure_iot_http.h#L13), which depends on:

- [azure_iot_http_port.h](https://github.com/Azure/azure-iot-middleware-freertos/blob/7759a42a1eab12818ea2a8f3f940847743968021/ports/coreHTTP/azure_iot_http_port.h#L11)

- [azure_iot_transport_interface.h](https://github.com/Azure/azure-iot-middleware-freertos/blob/7759a42a1eab12818ea2a8f3f940847743968021/source/interface/azure_iot_transport_interface.h#L5)

The azure_iot_http_port.h can be modified to use the core http library for TLS - HTTPS support using the FreeRTOS example - [HTTP Demo (with TLS - Mutual Authentication) - FreeRTOS](https://www.freertos.org/http/http-demo-with-tls-mutual-authentication.html)

The Device Update for IoT Hub samples also have functions to parse the URL that need to be revised: [iot-middleware-freertos-samples/demos/sample_azure_iot_adu/sample_azure_iot_adu.c at main - Azure-Samples/iot-middleware-freertos-samples (github.com)](https://github.com/Azure-Samples/iot-middleware-freertos-samples/blob/main/demos/sample_azure_iot_adu/sample_azure_iot_adu.c#L396).

Finally, you may also need to make changes to your own implementation, such as changing the HTTPS header buffer to manage the update URL format that your device will receive from Device Update.

## Certificate information

The certificate used to enable the TLS connection is issued by: **Microsoft Azure RSA TLS Issuing CA 03**. Devices that download content over TLS from the Device Update service will need to be provisioned with one or more certificates that have Microsoft Azure RSA TLS Issuing CA 03 as their root.

RSA certificates are supported, but the client needs to specify cipher TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 on TLS1.2. If possible, using an ECC certificate backed by DigiCert Global Root G3 is recommended instead.

## Next steps

[Troubleshoot common issues](troubleshoot-device-update.md)

