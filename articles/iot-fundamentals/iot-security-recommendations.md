---
title: Customer responsibilities for secure IoT deployment | Microsoft Docs
description: This article summarizes additional steps to ensure security in your Azure IoT Hub solution. 
author: dsk-2015
manager: philmea
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 06/25/2019
ms.author: dkshir
---

# Internet of Things (IoT) security summary

This article contains security recommendations for the Azure IoT services. Implementing these recommendations will help you fulfill your security obligations as described in the Shared Responsibility model and will improve the overall security for your IoT solutions. For more information on what Microsoft does to fulfill service provider responsibilities, please read [Azure infrastructure security](../security/azure-security-infrastructure.md).

## General

| Recommendation | Comments |
|-|----|
| Stay up-to-date | Use the latest versions of supported platforms, programming languages, protocols, and frameworks. |


## Identity and access management

| Recommendation | Comments |
|-|----|
| Access control for the hub | Define the [type of access](iot-security-deployment.md#securing-the-cloud) each component in your IoT Hub solution based on the functionality. The allowed permissions are *Registry Read*, *RegistryReadWrite*, *ServiceConnect*, and *DeviceConnect*. Default [shared access policies](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-security#access-control-and-permissions) can help define the permissions for each component in your solution based on its specific role. |
| Access control for backend services | Data ingested by your IoT Hub solution can be consumed by other Azure services such as [Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/), [Stream Analytics](https://docs.microsoft.com/azure/stream-analytics/), [App Service](https://docs.microsoft.com/azure/app-service/), [Logic Apps](https://docs.microsoft.com/azure/logic-apps/), and [Blob storage](https://docs.microsoft.com/azure/storage/blobs/storage-blobs-introduction). Make sure to understand and allow appropriate access permissions for these services. |


## Data protection

| Recommendation | Comments |
|-|-|
| Secure device authentication | Ensure secure communication between your devices and your IoT hub, by using either [a unique identity key or security token](iot-security-deployment.md#iot-hub-security-tokens), or [an on-device X.509 certificate](iot-security-deployment.md#x509-certificate-based-device-authentication) for each device. Use the appropriate method to [use security tokens based on the chosen protocol (MQTT, AMQP, or HTTPS)](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-security). |
| Secure device communication | IoT Hub secures the connection to the devices using Transport Layer Security (TLS) statndard, supporting versions 1.2, 1.2, and 1.0. Use TLS 1.2 to ensure maximum security. |
| Encrypt communication to Azure resources | When your app connects to Azure resources, such as [Azure Storage](/azure/storage/), encrypt all communication on the backend to protect sensitive information. |
| Secure application data | Don't store application secrets, such as database credentials, API tokens, or private keys in your code or configuration files. The commonly accepted approach is to access them as [environment variables](https://wikipedia.org/wiki/Environment_variable) using the standard pattern in your language of choice. In Azure App Service, you can define environment variables through [app settings](web-sites-configure.md) and [connection strings](web-sites-configure.md). App settings and connection strings are stored encrypted in Azure. The app settings are decrypted only before being injected into your app's process memory when the app starts. The encryption keys are rotated regularly. Alternatively, you can integrate your Azure App Service app with [Azure Key Vault](/azure/key-vault/) for advanced secrets management. By [accessing the Key Vault with a managed identity](../key-vault/tutorial-web-application-keyvault.md), your App Service app can securely access the secrets you need. |


## Networking

| Recommendation | Comments |
|-|-|
| Protect access to your devices | Keep hardware ports in your devices to a bare minimum to avoid unwanted access. Additionaly, build mechanisms to prevent or detect physical tampering of the device. You may also use your device operating system's logging feature to monitor any breaches. |
| Build secure hardware | Incorporate security features such as encrypted storage, or Trusted Platform Module (TPM), to keep devices and infrastructure more secure. Keep the device operating system and drivers upgraded to latest versions, and if space permits, install antivirus and antimalware capabilities. |



## Next steps

For more advanced scenarios, you may need additional security requirements. See [IoT security architecture](iot-security-architecture.md) for more details.

