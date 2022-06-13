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

The Device Provisioning Service (DPS) libraries and SDKs help developers build IoT solutions using various programming languages on multiple platforms. The following tables include links to samples and quickstarts to help you get started.

## Device SDKs

| Platform | Package | Code repository | Samples | Quickstart | Reference |
| -----|-----|-----|-----|-----|-----|
| .NET|[NuGet](https://www.nuget.org/packages/Microsoft.Azure.Devices.Provisioning.Client/) |[GitHub](https://github.com/Azure/azure-iot-sdk-csharp/)|[Samples](https://github.com/Azure-Samples/azure-iot-samples-csharp/tree/main/provisioning/Samples/device)|[Quickstart](./quick-create-simulated-device-x509.md?pivots=programming-language-csharp&tabs=windows)| [Reference](/dotnet/api/microsoft.azure.devices.provisioning.client) |
| C|[apt-get, MBED, Arduino IDE or iOS](https://github.com/Azure/azure-iot-sdk-c/blob/master/readme.md#packages-and-libraries)|[GitHub](https://github.com/Azure/azure-iot-sdk-c/blob/master/provisioning\_client)|[Samples](https://github.com/Azure/azure-iot-sdk-c/tree/main/provisioning_client/samples)|[Quickstart](./quick-create-simulated-device-x509.md?pivots=programming-language-ansi-c&tabs=windows)|[Reference](/azure/iot-hub/iot-c-sdk-ref/) |
| Java|[Maven](https://mvnrepository.com/artifact/com.microsoft.azure.sdk.iot.provisioning/provisioning-device-client)|[GitHub](https://github.com/Azure/azure-iot-sdk-java/blob/main/provisioning)|[Samples](https://github.com/Azure/azure-iot-sdk-java/tree/main/provisioning/provisioning-samples)|[Quickstart](./quick-create-simulated-device-x509.md?pivots=programming-language-java&tabs=windows)|[Reference](/java/api/com.microsoft.azure.sdk.iot.provisioning.device) |
| Node.js|[npm](https://www.npmjs.com/package/azure-iot-provisioning-device) |[GitHub](https://github.com/Azure/azure-iot-sdk-node/tree/main/provisioning)|[Samples](https://github.com/Azure/azure-iot-sdk-node/tree/main/provisioning/device/samples)|[Quickstart](./quick-create-simulated-device-x509.md?pivots=programming-language-nodejs&tabs=windows)|[Reference](/javascript/api/overview/azure/iothubdeviceprovisioning) |
| Python|[pip](https://pypi.org/project/azure-iot-device/) |[GitHub](https://github.com/Azure/azure-iot-sdk-python)|[Samples](https://github.com/Azure/azure-iot-sdk-python/tree/main/azure-iot-device/samples/async-hub-scenarios)|[Quickstart](./quick-create-simulated-device-x509.md?pivots=programming-language-python&tabs=windows)|[Reference](/python/api/azure-iot-device/azure.iot.device.provisioningdeviceclient) |

Microsoft also provides embedded device SDKs to facilitate development on resource-constrained devices. To learn more, see the [IoT Device Development Documentation](../iot-develop/about-iot-sdks.md).

## Service SDKs

| Platform | Package | Code repository | Samples | Quickstart | Reference |
| -----|-----|-----|-----|-----|-----|
| .NET|[NuGet](https://www.nuget.org/packages/Microsoft.Azure.Devices.Provisioning.Service/) |[GitHub](https://github.com/Azure/azure-iot-sdk-csharp/)|[Samples](https://github.com/Azure-Samples/azure-iot-samples-csharp/tree/main/provisioning/Samples/service)|[Quickstart](./quick-enroll-device-tpm.md?pivots=programming-language-csharp&tabs=symmetrickey)|[Reference](/dotnet/api/microsoft.azure.devices.provisioning.service) |
| Java|[Maven](https://mvnrepository.com/artifact/com.microsoft.azure.sdk.iot.provisioning/provisioning-service-client)|[GitHub](https://github.com/Azure/azure-iot-sdk-java/blob/main/provisioning)|[Samples](https://github.com/Azure/azure-iot-sdk-java/tree/main/provisioning/provisioning-samples)|[Quickstart](./quick-enroll-device-tpm.md?pivots=programming-language-java&tabs=symmetrickey)|[Reference](/java/api/com.microsoft.azure.sdk.iot.provisioning.service) |
| Node.js|[npm](https://www.npmjs.com/package/azure-iot-provisioning-service)|[GitHub](https://github.com/Azure/azure-iot-sdk-node/tree/main/provisioning)|[Samples](https://github.com/Azure/azure-iot-sdk-node/tree/main/provisioning/service/samples)|[Quickstart](./quick-enroll-device-tpm.md?pivots=programming-language-nodejs&tabs=symmetrickey)|[Reference](/javascript/api/overview/azure/iothubdeviceprovisioning) |

## Management SDKs

| Platform | Package | Code repository | Reference |
| -----|-----|-----|-----|
| .NET|[NuGet](https://www.nuget.org/packages/Microsoft.Azure.Management.DeviceProvisioningServices) |[GitHub](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/deviceprovisioningservices/Microsoft.Azure.Management.DeviceProvisioningServices)| -- |
| Node.js|[npm](https://www.npmjs.com/package/@azure/arm-deviceprovisioningservices)|[GitHub](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/deviceprovisioningservices/arm-deviceprovisioningservices)|[Reference](/javascript/api/@azure/arm-deviceprovisioningservices) |
| Python|[pip](https://pypi.org/project/azure-mgmt-iothubprovisioningservices/) |[GitHub](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/iothub/azure-mgmt-iothubprovisioningservices)|[Reference](/python/api/azure-mgmt-iothubprovisioningservices) |

## Next steps

The Device Provisioning Service documentation also provides [tutorials](how-to-legacy-device-symm-key.md) and [additional samples](quick-create-simulated-device-tpm.md) that you can use to try out the SDKs and libraries.