---
title: IoT Hub Device Provisioning Service libraries and SDKs
description: Information about the device and service libraries available for developing solutions with Device Provisioning Service (CPS).
author: kgremban
ms.author: kgremban
ms.date: 08/03/2022
ms.topic: reference
ms.service: iot-dps
services: iot-dps
ms.custom: mvc
---

# Microsoft SDKs for IoT Hub Device Provisioning Service

The Azure IoT Hub Device Provisioning Service (DPS) is a helper service for IoT Hub. The DPS package provides SDKs to help you build backend and device applications that leverage DPS to provide zero-touch, just-in-time provisioning to one or more IoT hubs. The SDKs are published in a variety of popular languages and handle the underlying transport and security protocols between your devices or backend apps and DPS, freeing developers to focus on application development. Additionally, using the SDKs provides you with support for future updates to DPS, including security updates.

There are three categories of software development kits (SDKs) for working with DPS:

- [DPS device SDKs](#device-sdks) provide data plane operations for devices. You use the device SDK to provision a device through DPS.

- [DPS service SDKs](#service-sdks) provide data plane operations for backend apps. You can use the service SDKs to create and manage individual enrollments and enrollment groups, and to query and manage device registration records.

- [DPS management SDKs](#management-sdks) provide control plane operations for backend apps. You can use the management SDKs to create and manage DPS instances and metadata. For example, to create and manage DPS instances in your subscription, to upload and verify certificates with a DPS instance, or to create and manage authorization policies or allocation policies in a DPS instance.

The DPS SDKs help to provision devices to your IoT hubs. Microsoft also provides a set of SDKs to help you build device apps and backend apps that communicate directly with Azure IoT Hub. For example, to help your provisioned devices send telemetry to your IoT hub, and, optionally, to receive messages and job, method, or twin updates from your IoT hub. To learn more, see [Azure IoT Hub SDKs](../iot-hub/iot-hub-devguide-sdks.md).

## Device SDKs

The DPS device SDKs provide implementations of the [Register](/rest/api/iot-dps/device/runtime-registration/register-device) API and others that devices call to provision through DPS. The device SDKs can run on general MPU-based computing devices such as a PC, tablet, smartphone, or Raspberry Pi. The SDKs support development in C and in modern managed languages including in C#, Node.JS, Python, and Java.

| Platform | Package | Code repository | Samples | Quickstart | Reference |
| -----|-----|-----|-----|-----|-----|
| .NET|[NuGet](https://www.nuget.org/packages/Microsoft.Azure.Devices.Provisioning.Client/) |[GitHub](https://github.com/Azure/azure-iot-sdk-csharp/)|[Samples](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/provisioning/device/samples)|[Quickstart](./quick-create-simulated-device-x509.md?pivots=programming-language-csharp&tabs=windows)| [Reference](/dotnet/api/microsoft.azure.devices.provisioning.client) |
| C|[apt-get, MBED, Arduino IDE or iOS](https://github.com/Azure/azure-iot-sdk-c/blob/master/readme.md#packages-and-libraries)|[GitHub](https://github.com/Azure/azure-iot-sdk-c/blob/master/provisioning\_client)|[Samples](https://github.com/Azure/azure-iot-sdk-c/tree/main/provisioning_client/samples)|[Quickstart](./quick-create-simulated-device-x509.md?pivots=programming-language-ansi-c&tabs=windows)|[Reference](https://github.com/Azure/azure-iot-sdk-c/) |
| Java|[Maven](https://mvnrepository.com/artifact/com.microsoft.azure.sdk.iot.provisioning/provisioning-device-client)|[GitHub](https://github.com/Azure/azure-iot-sdk-java/blob/main/provisioning)|[Samples](https://github.com/Azure/azure-iot-sdk-java/tree/main/provisioning/provisioning-samples)|[Quickstart](./quick-create-simulated-device-x509.md?pivots=programming-language-java&tabs=windows)|[Reference](/java/api/com.microsoft.azure.sdk.iot.provisioning.device) |
| Node.js|[npm](https://www.npmjs.com/package/azure-iot-provisioning-device) |[GitHub](https://github.com/Azure/azure-iot-sdk-node/tree/main/provisioning)|[Samples](https://github.com/Azure/azure-iot-sdk-node/tree/main/provisioning/device/samples)|[Quickstart](./quick-create-simulated-device-x509.md?pivots=programming-language-nodejs&tabs=windows)|[Reference](/javascript/api/azure-iot-provisioning-device) |
| Python|[pip](https://pypi.org/project/azure-iot-device/) |[GitHub](https://github.com/Azure/azure-iot-sdk-python)|[Samples](https://github.com/Azure/azure-iot-sdk-python/tree/main/samples)|[Quickstart](./quick-create-simulated-device-x509.md?pivots=programming-language-python&tabs=windows)|[Reference](/python/api/azure-iot-device/azure.iot.device.provisioningdeviceclient) |

> [!WARNING]
> The **C SDK** listed above is **not** suitable for embedded applications due to its memory management and threading model. For embedded devices, refer to the [Embedded device SDKs](#embedded-device-sdks).

### Embedded device SDKs

These SDKs were designed and created to run on devices with limited compute and memory resources and are implemented using the C language.

| RTOS | SDK | Source | Samples | Reference |
| :-- | :-- | :-- | :-- | :-- | 
| **Azure RTOS** | Azure RTOS Middleware | [GitHub](https://github.com/azure-rtos/netxduo) | [Quickstarts](../iot-develop/quickstart-devkit-mxchip-az3166.md) | [Reference](https://github.com/azure-rtos/netxduo/tree/master/addons/azure_iot) | 
| **FreeRTOS** | FreeRTOS Middleware | [GitHub](https://github.com/Azure/azure-iot-middleware-freertos) | [Samples](https://github.com/Azure-Samples/iot-middleware-freertos-samples) | [Reference](https://azure.github.io/azure-iot-middleware-freertos) |
| **Bare Metal** | Azure SDK for Embedded C | [GitHub](https://github.com/Azure/azure-sdk-for-c/tree/master/sdk/docs/iot) | [Samples](https://github.com/Azure/azure-sdk-for-c/blob/master/sdk/samples/iot/README.md) | [Reference](https://azure.github.io/azure-sdk-for-c) |

Learn more about the device and embedded device SDKs in the [IoT Device Development documentation](../iot-develop/about-iot-sdks.md).

## Service SDKs

The DPS service SDKs help you build backend applications to manage enrollments and registration records in DPS instances.

| Platform | Package | Code repository | Samples | Quickstart | Reference |
| -----|-----|-----|-----|-----|-----|
| .NET|[NuGet](https://www.nuget.org/packages/Microsoft.Azure.Devices.Provisioning.Service/) |[GitHub](https://github.com/Azure/azure-iot-sdk-csharp/)|[Samples](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/provisioning/service/samples)|[Quickstart](./quick-enroll-device-tpm.md?pivots=programming-language-csharp&tabs=symmetrickey)|[Reference](/dotnet/api/microsoft.azure.devices.provisioning.service) |
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
