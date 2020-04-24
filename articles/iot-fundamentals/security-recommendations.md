---
title:  Security recommendations for Azure IoT | Microsoft Docs
description: This article summarizes additional steps to ensure security in your Azure IoT Hub solution. 
author: dsk-2015
manager: philmea
ms.service: iot-hub
services: iot-hub
ms.topic: article
ms.date: 11/13/2019
ms.author: dkshir
ms.custom: [security-recommendations, amqp, mqtt]
---

# Security recommendations for Azure Internet of Things (IoT) deployment

This article contains security recommendations for IoT. Implementing these recommendations will help you fulfill your security obligations as described in our shared responsibility model. For more information on what Microsoft does to fulfill service provider responsibilities, read [Shared responsibilities for cloud computing](https://gallery.technet.microsoft.com/Shared-Responsibilities-81d0ff91).

Some of the recommendations included in this article can be automatically monitored by Azure Security Center. Azure Security Center is the first line of defense in protecting your resources in Azure. It periodically analyzes the security state of your Azure resources to identify potential security vulnerabilities. It then provides you with recommendations on how to address them.

- For more information on Azure Security Center recommendations, see [Security recommendations in Azure Security Center](../security-center/security-center-recommendations.md).
- For information on Azure Security Center see the [What is Azure Security Center?](../security-center/security-center-intro.md)

## General

| Recommendation | Comments | Supported by ASC |
|-|----|--|
| Stay up-to-date | Use the latest versions of supported platforms, programming languages, protocols, and frameworks. | - |
| Keep authentication keys safe | Keep the device IDs and their authentication keys physically safe after deployment. This will avoid a malicious device masquerade as a registered device. | - |
| Use device SDKs when possible | Device SDKs implement a variety of security features, such as, encryption, authentication, and so on, to assist you in developing a robust and secure device application. See [Understand and use Azure IoT Hub SDKs](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-sdks) for more information. | - |

## Identity and access management 

| Recommendation | Comments | Supported by ASC |
|-|----|--|
| Define access control for the hub | [Understand and define the type of access](iot-security-deployment.md#securing-the-cloud) each component will have in your IoT Hub solution, based on the functionality. The allowed permissions are *Registry Read*, *RegistryReadWrite*, *ServiceConnect*, and *DeviceConnect*. Default [shared access policies in your IoT hub](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-security#access-control-and-permissions) can also help define the permissions for each component based on its role. | - |
| Define access control for backend services | Data ingested by your IoT Hub solution can be consumed by other Azure services such as [Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/), [Stream Analytics](https://docs.microsoft.com/azure/stream-analytics/), [App Service](https://docs.microsoft.com/azure/app-service/), [Logic Apps](https://docs.microsoft.com/azure/logic-apps/), and [Blob storage](https://docs.microsoft.com/azure/storage/blobs/storage-blobs-introduction). Make sure to understand and allow appropriate access permissions as documented for these services. | - |

## Data protection

| Recommendation | Comments | Supported by ASC |
|-|----|--|
| Secure device authentication | Ensure secure communication between your devices and your IoT hub, by using either [a unique identity key or security token](iot-security-deployment.md#iot-hub-security-tokens), or [an on-device X.509 certificate](iot-security-deployment.md#x509-certificate-based-device-authentication) for each device. Use the appropriate method to [use security tokens based on the chosen protocol (MQTT, AMQP, or HTTPS)](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-security). | - |
| Secure device communication | IoT Hub secures the connection to the devices using Transport Layer Security (TLS) standard, supporting versions 1.2 and 1.0. Use [TLS 1.2](https://tools.ietf.org/html/rfc5246) to ensure maximum security. | - |
| Secure service communication | IoT Hub provides endpoints to connect to backend services such as [Azure Storage](/azure/storage/) or [Event Hubs](/azure/event-hubs) using only the TLS protocol, and no endpoint is exposed on an unencrypted channel. Once this data reaches these backend services for storage or analysis, make sure to employ appropriate security and encryption methods for that service, and protect sensitive information at the backend. | - |

## Networking

| Recommendation | Comments | Supported by ASC |
|-|----|--|
| Protect access to your devices | Keep hardware ports in your devices to a bare minimum to avoid unwanted access. Additionally, build mechanisms to prevent or detect physical tampering of the device. Read [IoT security best practices](iot-security-best-practices.md) for details. | - |
| Build secure hardware | Incorporate security features such as encrypted storage, or Trusted Platform Module (TPM), to keep devices and infrastructure more secure. Keep the device operating system and drivers upgraded to latest versions, and if space permits, install antivirus and antimalware capabilities. Read [IoT security architecture](iot-security-architecture.md) to understand how this can help mitigate several security threats. | - |

## Monitoring

| Recommendation | Comments | Supported by ASC |
|-|----|--|
| Monitor unauthorized access to your devices |  Use your device operating system's logging feature to monitor any security breaches or physical tampering of the device or its ports. | - |
| Monitor your IoT solution from the cloud | Monitor the overall health of your IoT Hub solution using the [metrics in Azure Monitor](https://docs.microsoft.com/azure/iot-hub/iot-hub-metrics). | - |
| Set up diagnostics | Closely watch your operations by logging events in your solution, and then sending the diagnostic logs to Azure Monitor to get visibility into the performance. Read [Monitor and diagnose problems in your IoT hub](https://docs.microsoft.com/azure/iot-hub/iot-hub-monitor-resource-health) for more information. | - |

## Next steps

For advanced scenarios involving Azure IoT, you may need to consider additional security requirements. See [IoT security architecture](iot-security-architecture.md) for more guidance.

