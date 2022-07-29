---
title: IoT Hub Device Provisioning Service libraries and SDKs
description: Information about the device and service libraries available for developing solutions with Device Provisioning Service (CPS).
author: JimacoMS4
ms.author: v-jbrannian
ms.date: 06/30/2022
ms.topic: reference
ms.service: iot-dps
services: iot-dps
ms.custom: mvc
---

# Microsoft SDKs for IoT Hub Device Provisioning Service

Azure IoT Hub Device Provisioning Service (DPS) SDKs help you build backend and device applications that leverage DPS to provide zero-touch, just-in-time provisioning to one or more IoT hubs. The SDKs are published in a variety of popular languages and handle the underlying transport and security protocols between your devices or backend apps and DPS, freeing developers to focus on application development. Additionally, using the SDKs provides you with support for future updates to DPS, including security updates.

There are three categories of software development kits (SDKs) for working with DPS:

- [DPS service SDKs](#service-sdks) provide data plane operations for backend apps. You can use the service SDKs to create and manage individual enrollments and enrollment groups, and to query and manage device registration records.

- [DPS management SDKs](#management-sdks) provide control plane operations for backend apps. You can use the management SDKs to create and manage DPS instances and metadata. For example, to create and manage DPS instances in your subscription, to upload and verify certificates with a DPS instance, or to create and manage authorization policies or allocation policies in a DPS instance.

- [DPS device SDKs](#device-sdks) provide data plane operations for devices. You use the device SDK to provision a device through DPS.

Azure IoT SDKs are also available for the following services:

- [IoT Hub SDKs](../iot-hub/iot-hub-devguide-sdks.md): To help you build devices and backend apps that communicate with Azure IoT Hub.

- [Device Update for IoT Hub SDKs](../iot-hub-device-update/understand-device-update.md): To help you deploy over-the-air (OTA) updates for IoT devices.

- [IoT Plug and Play SDKs](../iot-develop/libraries-sdks.md): To help you build IoT Plug and Play solutions.

## Device SDKs

The DPS device SDKs provide code that runs on your IoT devices and simplifies provisioning with DPS.

| Platform | Package | Code repository | Samples | Quickstart | Reference |
| -----|-----|-----|-----|-----|-----|
| .NET|[NuGet](https://www.nuget.org/packages/Microsoft.Azure.Devices.Provisioning.Client/) |[GitHub](https://github.com/Azure/azure-iot-sdk-csharp/)|[Samples](https://github.com/Azure-Samples/azure-iot-samples-csharp/tree/main/provisioning/Samples/device)|[Quickstart](./quick-create-simulated-device-x509.md?pivots=programming-language-csharp&tabs=windows)| [Reference](/dotnet/api/microsoft.azure.devices.provisioning.client) |
| C|[apt-get, MBED, Arduino IDE or iOS](https://github.com/Azure/azure-iot-sdk-c/blob/master/readme.md#packages-and-libraries)|[GitHub](https://github.com/Azure/azure-iot-sdk-c/blob/master/provisioning\_client)|[Samples](https://github.com/Azure/azure-iot-sdk-c/tree/main/provisioning_client/samples)|[Quickstart](./quick-create-simulated-device-x509.md?pivots=programming-language-ansi-c&tabs=windows)|[Reference](/azure/iot-hub/iot-c-sdk-ref/) |
| Java|[Maven](https://mvnrepository.com/artifact/com.microsoft.azure.sdk.iot.provisioning/provisioning-device-client)|[GitHub](https://github.com/Azure/azure-iot-sdk-java/blob/main/provisioning)|[Samples](https://github.com/Azure/azure-iot-sdk-java/tree/main/provisioning/provisioning-samples)|[Quickstart](./quick-create-simulated-device-x509.md?pivots=programming-language-java&tabs=windows)|[Reference](/java/api/com.microsoft.azure.sdk.iot.provisioning.device) |
| Node.js|[npm](https://www.npmjs.com/package/azure-iot-provisioning-device) |[GitHub](https://github.com/Azure/azure-iot-sdk-node/tree/main/provisioning)|[Samples](https://github.com/Azure/azure-iot-sdk-node/tree/main/provisioning/device/samples)|[Quickstart](./quick-create-simulated-device-x509.md?pivots=programming-language-nodejs&tabs=windows)|[Reference](/javascript/api/azure-iot-provisioning-device) |
| Python|[pip](https://pypi.org/project/azure-iot-device/) |[GitHub](https://github.com/Azure/azure-iot-sdk-python)|[Samples](https://github.com/Azure/azure-iot-sdk-python/tree/main/azure-iot-device/samples/async-hub-scenarios)|[Quickstart](./quick-create-simulated-device-x509.md?pivots=programming-language-python&tabs=windows)|[Reference](/python/api/azure-iot-device/azure.iot.device.provisioningdeviceclient) |

Microsoft also provides embedded device SDKs to facilitate development on resource-constrained devices. To learn more, see the [IoT Device Development Documentation](../iot-develop/about-iot-sdks.md).

## Service SDKs

The DPS service SDKs help you build backend applications to manage enrollments and registration records in DPS instances.

| Platform | Package | Code repository | Samples | Quickstart | Reference |
| -----|-----|-----|-----|-----|-----|
| .NET|[NuGet](https://www.nuget.org/packages/Microsoft.Azure.Devices.Provisioning.Service/) |[GitHub](https://github.com/Azure/azure-iot-sdk-csharp/)|[Samples](https://github.com/Azure-Samples/azure-iot-samples-csharp/tree/main/provisioning/Samples/service)|[Quickstart](./quick-enroll-device-tpm.md?pivots=programming-language-csharp&tabs=symmetrickey)|[Reference](/dotnet/api/microsoft.azure.devices.provisioning.service) |
| Java|[Maven](https://mvnrepository.com/artifact/com.microsoft.azure.sdk.iot.provisioning/provisioning-service-client)|[GitHub](https://github.com/Azure/azure-iot-sdk-java/blob/main/provisioning)|[Samples](https://github.com/Azure/azure-iot-sdk-java/tree/main/provisioning/provisioning-samples)|[Quickstart](./quick-enroll-device-tpm.md?pivots=programming-language-java&tabs=symmetrickey)|[Reference](/java/api/com.microsoft.azure.sdk.iot.provisioning.service) |
| Node.js|[npm](https://www.npmjs.com/package/azure-iot-provisioning-service)|[GitHub](https://github.com/Azure/azure-iot-sdk-node/tree/main/provisioning)|[Samples](https://github.com/Azure/azure-iot-sdk-node/tree/main/provisioning/service/samples)|[Quickstart](./quick-enroll-device-tpm.md?pivots=programming-language-nodejs&tabs=symmetrickey)|[Reference](/javascript/api/azure-iot-provisioning-service) |

## Management SDKs

The DPS management SDKs help you build backend applications that manage the DPS instances and their metadata in your Azure subscription.

| Platform | Package | Code repository | Reference |
| -----|-----|-----|-----|
| .NET|[NuGet](https://www.nuget.org/packages/Microsoft.Azure.Management.DeviceProvisioningServices) |[GitHub](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/deviceprovisioningservices/Microsoft.Azure.Management.DeviceProvisioningServices)| [Reference](/dotnet/api/overview/azure/deviceprovisioningservice/management) |
| Java|[Maven](https://mvnrepository.com/artifact/com.azure.resourcemanager/azure-resourcemanager-deviceprovisioningservices) |[GitHub](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/deviceprovisioningservices/azure-resourcemanager-deviceprovisioningservices)| [Reference](/java/api/com.azure.resourcemanager.deviceprovisioningservices) |
| Node.js|[npm](https://www.npmjs.com/package/@azure/arm-deviceprovisioningservices)|[GitHub](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/deviceprovisioningservices/arm-deviceprovisioningservices)|[Reference](/javascript/api/overview/azure/arm-deviceprovisioningservices-readme) |
| Python|[pip](https://pypi.org/project/azure-mgmt-iothubprovisioningservices/) |[GitHub](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/iothub/azure-mgmt-iothubprovisioningservices)|[Reference](/python/api/azure-mgmt-iothubprovisioningservices) |

## Next steps

The Device Provisioning Service documentation provides [tutorials](how-to-legacy-device-symm-key.md) and [additional samples](quick-create-simulated-device-tpm.md) that you can use to try out the SDKs and libraries.
