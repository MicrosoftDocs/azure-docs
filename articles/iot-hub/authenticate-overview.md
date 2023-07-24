---
title: Authentication overview
titleSuffix: Azure IoT Hub
description: Understand the authentication options available to Azure IoT Hub. 
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.author: kgremban
ms.topic: overview
ms.date: 05/01/2023
ms.custom: ['Role: Cloud Development', 'Role: IoT Device', 'Role: System Architecture']
---

# Authentication overview

This article defines authentication and provides an overview of available options you can use for authentication in IoT Hub. 

## What is authentication?

*Authentication* is the process of proving that you are who you say you are. This is achieved by verification of the identity of a user or device to IoT Hub. It's sometimes shortened to *AuthN*. Authentication is separate from *authorization*, which is the process of confirming permissions for an authenticated user or device on IoT Hub. For more information about authorization, see [Authorization overview](authorize-overview.md).

## Authentication options

There are three different ways for handling authentication in IoT Hub:

- **Azure Active Directory (Azure AD) integration** for service APIs. Azure provides identity-based authentication with AAD and fine-grained authorization with Azure role-based access control (Azure RBAC). Azure AD and RBAC integration is supported for IoT hub service APIs only. To learn more, see [Authenticate with Azure Active Directory](authenticate-azure-ad.md).
- **Shared access signatures** lets you group permissions and grant them to applications using access keys and signed security tokens. To learn more, see [Authenticate with shared access signatures](authenticate-sas.md). 
- **X.509 certificates**. Each IoT Hub contains an [identity registry](iot-hub-devguide-identity-registry.md) For each device in this identity registry, you can configure security credentials that grant DeviceConnect permissions scoped to the that device's endpoints. To learn more, see [Authenticate with X.509 certificates](authenticate-x509.md).

## Next steps

Read more about [authorization options available to IoT Hub](authorize-overview.md)

Use the Device Provisioning Service to [Provision multiple X.509 devices using enrollment groups](../iot-dps/tutorial-custom-hsm-enrollment-group-x509.md).