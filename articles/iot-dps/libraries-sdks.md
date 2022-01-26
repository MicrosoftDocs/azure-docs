---
title: IoT Hub Device Provisioning Service libraries and SDKs
description: Information about the device and service libraries available for developing solutions with Device Provisioning Service (CPS).
author: JimacoMS4
ms.author: v-jbrannian
ms.date: 01/26/2022
ms.topic: reference
ms.service: iot-dps
services: iot-dps
ms.custom: mvc
---

# Microsoft SDKs for IoT Hub Device Provisioning Service

The Device Provisioning Service (DPS) libraries and SDKs help developers build IoT solutions using various programming languages on multiple platforms. The following table includes links to samples and quickstarts to help you get started:

## Device SDKs

| Platform | Package | Code repository | Samples | Quickstart | Reference |
| -----|-----|-----|-----|-----|-----|
| .NET|[Nuget](https://www.nuget.org/packages/Microsoft.Azure.Devices.Provisioning.Client/) |[GitHub](https://github.com/Azure/azure-iot-sdk-csharp/)|[Samples](https://github.com/Azure-Samples/azure-iot-samples-csharp/tree/main/provisioning/Samples/device)|[Quickstart](/azure/iot-dps/quick-create-simulated-device-x509?tabs=windows&pivots=programming-language-csharp)| [Reference](/dotnet/api/microsoft.azure.devices.provisioning.client) |
| C|[apt-get, MBED, Arduino IDE or iOS](https://github.com/Azure/azure-iot-sdk-c/blob/master/readme.md#packages-and-libraries)|[GitHub](https://github.com/Azure/azure-iot-sdk-c/blob/master/provisioning\_client)|[Samples](https://github.com/Azure/azure-iot-sdk-c/tree/main/provisioning_client/samples)|[Quickstart](/azure/iot-dps/quick-create-simulated-device-x509?tabs=windows&pivots=programming-language-ansi-c)|[Reference](/azure/iot-hub/iot-c-sdk-ref/) |
| Java|[Maven](https://mvnrepository.com/artifact/com.microsoft.azure.sdk.iot.provisioning/provisioning-device-client)|[GitHub](https://github.com/Azure/azure-iot-sdk-java/blob/main/provisioning)|[Samples](https://github.com/Azure/azure-iot-sdk-java/tree/main/provisioning/provisioning-samples)|[Quickstart](/azure/iot-dps/quick-create-simulated-device-x509?tabs=windows&pivots=programming-language-java)|[Reference](/java/api/com.microsoft.azure.sdk.iot.provisioning.device) |
| Node.js|[npm](https://www.npmjs.com/package/azure-iot-provisioning-device) |[GitHub](https://github.com/Azure/azure-iot-sdk-node/tree/main/provisioning)|[Samples](https://github.com/Azure/azure-iot-sdk-node/tree/main/provisioning/device/samples)|[Quickstart](/azure/iot-dps/quick-create-simulated-device-x509?tabs=windows&pivots=programming-language-nodejs)|[Reference](/javascript/api/overview/azure/iothubdeviceprovisioning) |
| Python|[pip](https://pypi.org/project/azure-iot-device/) |[GitHub](https://github.com/Azure/azure-iot-sdk-python)|[Samples](https://github.com/Azure/azure-iot-sdk-python/tree/main/azure-iot-device/samples/async-hub-scenarios)|[Quickstart](/azure/iot-dps/quick-create-simulated-device-x509?tabs=windows&pivots=programming-language-python)|[Reference](/python/api/azure-iot-device/azure.iot.device.provisioningdeviceclient) |

Microsoft also provides embedded device SDKs to facilitate development on resource-constrained devices. To learn more, see the [IoT Device Development Documentation](../iot-develop/about-iot-sdks.md).

**IGNORE IGNORE IGNORE**

| Language | Package | Code Repository | Samples | Quickstart | Reference |
|---|---|---|---|---|---|
| C - Device | [vcpkg 1.3.9](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/setting_up_vcpkg.md) | [GitHub](https://github.com/Azure/azure-iot-sdk-c) | [Samples](https://github.com/Azure/azure-iot-sdk-c/tree/master/iothub_client/samples/pnp) | [Connect to IoT Hub](tutorial-connect-device.md) | [Reference](/azure/iot-hub/iot-c-sdk-ref/) |
| .NET - Device | [NuGet 1.31.0](https://www.nuget.org/packages/Microsoft.Azure.Devices.Client) | [GitHub](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/) | [Samples](https://github.com/Azure-Samples/azure-iot-samples-csharp/tree/main/iot-hub/Samples/device/PnpDeviceSamples) | [Connect to IoT Hub](tutorial-connect-device.md) | [Reference](/dotnet/api/microsoft.azure.devices.client) |
| Java - Device | [Maven 1.26.0](https://mvnrepository.com/artifact/com.microsoft.azure.sdk.iot/iot-device-client) | [GitHub](https://github.com/Azure/azure-iot-sdk-java/tree/main/) | [Samples](https://github.com/Azure/azure-iot-sdk-java/tree/main/device/iot-device-samples/pnp-device-sample) | [Connect to IoT Hub](tutorial-connect-device.md) | [Reference](/java/api/com.microsoft.azure.sdk.iot.device) |
| Python - Device | [pip 2.3.0](https://pypi.org/project/azure-iot-device/) | [GitHub](https://github.com/Azure/azure-iot-sdk-python) | [Samples](https://github.com/Azure/azure-iot-sdk-python/tree/main/azure-iot-device/samples/pnp) | [Connect to IoT Hub](tutorial-connect-device.md) | [Reference](/python/api/azure-iot-device/azure.iot.device) |
| Node - Device | [npm 1.17.2](https://www.npmjs.com/package/azure-iot-device)  | [GitHub](https://github.com/Azure/azure-iot-sdk-node) | [Samples](https://github.com/Azure/azure-iot-sdk-node/tree/main/device/samples/javascript/) | [Connect to IoT Hub](tutorial-connect-device.md) | [Reference](/javascript/api/azure-iot-device/) |
| Embedded C - Device | N/A | [GitHub](https://github.com/Azure/azure-sdk-for-c/)| [Samples](tutorial-connect-device.md?pivots=programming-language-embedded-c#samples) | [How to use Embedded C](tutorial-connect-device.md?pivots=programming-language-embedded-c) | N/A

## Service SDKs

| Platform | Package | Code repository | Reference |
| -----|-----|-----|-----|
| .NET|[Nuget](https://www.nuget.org/packages/Microsoft.Azure.Devices.Provisioning.Service/) |[GitHub](https://github.com/Azure/azure-iot-sdk-csharp/)|[Samples]()|[Quickstart](/azure/iot-dps/quick-enroll-device-tpm?tabs=symmetrickey&pivots=programming-language-csharp)|[Reference](/dotnet/api/microsoft.azure.devices.provisioning.service) |
| Java|[Maven](https://mvnrepository.com/artifact/com.microsoft.azure.sdk.iot.provisioning/provisioning-service-client)|[GitHub](https://github.com/Azure/azure-iot-sdk-java/blob/main/provisioning)|[Samples](https://github.com/Azure/azure-iot-sdk-java/tree/main/provisioning/provisioning-samples)|[Quickstart](/azure/iot-dps/quick-enroll-device-tpm?tabs=symmetrickey&pivots=programming-language-java)|[Reference](/java/api/com.microsoft.azure.sdk.iot.provisioning.service) |
| Node.js|[npm](https://www.npmjs.com/package/azure-iot-provisioning-service)|[GitHub](https://github.com/Azure/azure-iot-sdk-node/tree/main/provisioning)|[Samples](https://github.com/Azure/azure-iot-sdk-node/tree/main/provisioning/service/samples)|[Quickstart](/azure/iot-dps/quick-enroll-device-tpm?tabs=symmetrickey&pivots=programming-language-nodejs)|[Reference](/javascript/api/overview/azure/iothubdeviceprovisioning) |
| Python|[pip](https://pypi.org/project/azure-iothub-provisioningserviceclient/)|[GitHub](https://github.com/Azure/azure-iot-sdk-python)| See Quickstart|[Quickstart](/azure/iot-dps/quick-enroll-device-tpm?tabs=symmetrickey&pivots=programming-language-python)|[Reference](/python/api/azure-mgmt-iothubprovisioningservices) |

**IGNORE IGNORE IGNORE**

| Platform | Package | Code repository | Reference |
| -----|-----|-----|-----|
| .NET|[Device SDK](https://www.nuget.org/packages/Microsoft.Azure.Devices.Provisioning.Client/), [Service SDK](https://www.nuget.org/packages/Microsoft.Azure.Devices.Provisioning.Service/) |[GitHub](https://github.com/Azure/azure-iot-sdk-csharp/)|[Reference](/dotnet/api/microsoft.azure.devices.provisioning.client) |
| C|[apt-get, MBED, Arduino IDE or iOS](https://github.com/Azure/azure-iot-sdk-c/blob/master/readme.md#packages-and-libraries)|[GitHub](https://github.com/Azure/azure-iot-sdk-c/blob/master/provisioning\_client)|[Reference](/azure/iot-hub/iot-c-sdk-ref/) |
| Java|[Maven](https://github.com/Azure/azure-iot-sdk-java/blob/main/doc/java-devbox-setup.md#for-the-service-sdk)|[GitHub](https://github.com/Azure/azure-iot-sdk-java/blob/main/provisioning)|[Reference](/java/api/com.microsoft.azure.sdk.iot.provisioning.device) |
| Node.js|[Device SDK](https://badge.fury.io/js/azure-iot-provisioning-device), [Service SDK](https://badge.fury.io/js/azure-iot-provisioning-service) |[GitHub](https://github.com/Azure/azure-iot-sdk-node/tree/main/provisioning)|[Reference](/javascript/api/overview/azure/iothubdeviceprovisioning) |
| Python|[Device SDK](https://pypi.org/project/azure-iot-device/), [Service SDK](https://pypi.org/project/azure-iothub-provisioningserviceclient/)|[GitHub](https://github.com/Azure/azure-iot-sdk-python)|[Device Reference](/python/api/azure-iot-device/azure.iot.device.provisioningdeviceclient), [Service Reference](/python/api/azure-mgmt-iothubprovisioningservices) |

| Platform  | Package | Code Repository | Samples | Quickstart | Reference |
|---|---|---|---|---|---|
| .NET - IoT Hub service | [NuGet 1.27.1](https://www.nuget.org/packages/Microsoft.Azure.Devices ) | [GitHub](https://github.com/Azure/azure-iot-sdk-csharp) | [Samples](https://github.com/Azure-Samples/azure-iot-samples-csharp/tree/main/iot-hub/Samples/service/PnpServiceSamples) | N/A | [Reference](/dotnet/api/microsoft.azure.devices) |
| Java - IoT Hub service | [Maven 1.26.0](https://mvnrepository.com/artifact/com.microsoft.azure.sdk.iot/iot-service-client/1.26.0) | [GitHub](https://github.com/Azure/azure-iot-sdk-java) | [Samples](https://github.com/Azure/azure-iot-sdk-java/tree/main/service/iot-service-samples/pnp-service-sample) | N/A | [Reference](/java/api/com.microsoft.azure.sdk.iot.service) |
| Node - IoT Hub service | [npm 1.13.0](https://www.npmjs.com/package/azure-iothub) | [GitHub](https://github.com/Azure/azure-iot-sdk-node) | [Samples](https://github.com/Azure/azure-iot-sdk-node/tree/main/service/samples) | N/A | [Reference](/javascript/api/azure-iothub/) |
| Python - Digital Twins service | [pip 2.2.3](https://pypi.org/project/azure-iot-hub) | [GitHub](https://github.com/Azure/azure-iot-sdk-python) | [Samples](https://github.com/Azure/azure-iot-sdk-python/tree/main/azure-iot-hub/samples) | [Interact with IoT Hub Digital Twins API](tutorial-service.md) | N/A |
| Node - Digital Twins service | [npm 1.13.0](https://www.npmjs.com/package/azure-iot-digitaltwins-service) | [GitHub](https://github.com/Azure/azure-iot-sdk-node) | [Samples](https://github.com/Azure/azure-iot-sdk-node/tree/main/service/samples/javascript) | [Interact with IoT Hub Digital Twins API](tutorial-service.md) | N/A |

## Next steps

To try out the SDKs and libraries, see the  [Developer Guide](concepts-developer-guide-device.md) and the [device tutorials](tutorial-connect-device.md) and [service tutorials](tutorial-service.md).
