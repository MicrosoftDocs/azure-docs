---
 title: include file
 description: include file
 services: iot-dps
 author: SoniaLopezBravo
 ms.service: azure-iot-hub
 ms.topic: include
 ms.date: 04/14/2023
 ms.author: sonialopez
 ms.custom: include file
 ms.subservice: azure-iot-hub-dps
---

The DPS device SDKs provide implementations of the [Register](/rest/api/iot-dps/device/runtime-registration/register-device) API and others that devices call to provision through DPS. The device SDKs can run on general MPU-based computing devices such as a PC, tablet, smartphone, or Raspberry Pi. The SDKs support development in C and in modern managed languages including in C#, Node.js, Python, and Java.

| Platform | Package | Code repository | Samples | Quickstart | Reference |
| -----|-----|-----|-----|-----|-----|
| .NET|[NuGet](https://www.nuget.org/packages/Microsoft.Azure.Devices.Provisioning.Client/) |[GitHub](https://github.com/Azure/azure-iot-sdk-csharp/)|[Samples](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/provisioning/device/samples)|[Quickstart](/azure/iot-dps/quick-create-simulated-device-x509?pivots=programming-language-csharp&tabs=windows)| [Reference](/dotnet/api/microsoft.azure.devices.provisioning.client) |
| C|[apt-get, MBED, Arduino IDE or iOS](https://github.com/Azure/azure-iot-sdk-c/blob/master/readme.md#packages-and-libraries)|[GitHub](https://github.com/Azure/azure-iot-sdk-c/blob/master/provisioning\_client)|[Samples](https://github.com/Azure/azure-iot-sdk-c/tree/main/provisioning_client/samples)|[Quickstart](/azure/iot-dps/quick-create-simulated-device-x509?pivots=programming-language-ansi-c&tabs=windows)|[Reference](https://github.com/Azure/azure-iot-sdk-c/) |
| Java|[Maven](https://mvnrepository.com/artifact/com.microsoft.azure.sdk.iot.provisioning/provisioning-device-client)|[GitHub](https://github.com/Azure/azure-iot-sdk-java/blob/main/provisioning)|[Samples](https://github.com/Azure/azure-iot-sdk-java/tree/main/provisioning/provisioning-device-client-samples)|[Quickstart](/azure/iot-dps/quick-create-simulated-device-x509?pivots=programming-language-java&tabs=windows)|[Reference](/java/api/com.microsoft.azure.sdk.iot.provisioning.device) |
| Node.js|[npm](https://www.npmjs.com/package/azure-iot-provisioning-device) |[GitHub](https://github.com/Azure/azure-iot-sdk-node/tree/main/provisioning)|[Samples](https://github.com/Azure/azure-iot-sdk-node/tree/main/provisioning/device/samples)|[Quickstart](/azure/iot-dps/quick-create-simulated-device-x509?pivots=programming-language-nodejs&tabs=windows)|[Reference](/javascript/api/azure-iot-provisioning-device) |
| Python|[pip](https://pypi.org/project/azure-iot-device/) |[GitHub](https://github.com/Azure/azure-iot-sdk-python)|[Samples](https://github.com/Azure/azure-iot-sdk-python/tree/main/samples)|[Quickstart](/azure/iot-dps/quick-create-simulated-device-x509?pivots=programming-language-python&tabs=windows)|[Reference](/python/api/azure-iot-device/azure.iot.device.provisioningdeviceclient) |

> [!WARNING]
> The **C SDK** listed above is **not** suitable for embedded applications due to its memory management and threading model. For embedded devices, refer to the [Embedded device SDKs](#embedded-device-sdks).
