---
title: Access control and security for IoT Hub | Microsoft Docs
description: Overview on how to control access to IoT Hub, includes links to depth articles on AAD integration and SAS options.
author: wesmc7777

ms.author: wesmc
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 04/15/2021
ms.custom: [amqp, mqtt, 'Role: Cloud Development', 'Role: IoT Device', 'Role: Operations', devx-track-js, devx-track-csharp]
---

# Control access to IoT Hub

This article describes the options for securing your IoT hub. IoT Hub uses *permissions* to grant access to each IoT hub endpoint. Permissions limit the access to an IoT hub based on functionality.

There are three different ways for controlling access to IoT Hub:

- **Azure Active Directory (Azure AD) integration** for service APIs. Azure provides identity-based authentication with AAD and fine-grained authorization with Azure role-based access control (Azure RBAC). Azure AD and RBAC integration is supported for IoT hub service APIs only. To learn more, see [Control access to IoT Hub using Azure Active Directory](iot-hub-dev-guide-azure-ad-rbac.md).
- **Shared access signatures** lets you group permissions and grant them to applications using access keys and signed security tokens. To learn more, see [Control access to IoT Hub using shared access signature](iot-hub-dev-guide-sas.md). 
- **Per-device security credentials**. Each IoT Hub contains an [identity registry](iot-hub-devguide-identity-registry.md) For each device in this identity registry, you can configure security credentials that grant DeviceConnect permissions scoped to the that device's endpoints. To learn more, see [Authenticating a device to IoT Hub](iot-hub-dev-guide-sas.md#authenticating-a-device-to-iot-hub).

## Next steps

- [Control access to IoT Hub using Azure Active Directory](iot-hub-dev-guide-azure-ad-rbac.md)
- [Control access to IoT Hub using shared access signature](iot-hub-dev-guide-sas.md)
- [Authenticating a device to IoT Hub](iot-hub-dev-guide-sas.md#authenticating-a-device-to-iot-hub)
