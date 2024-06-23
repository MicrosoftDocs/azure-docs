---
title:  Access control and security for Azure DPS
titleSuffix: Azure IoT Hub Device Provisioning Service
description: Overview on controlling access to Azure IoT Hub Device Provisioning Service, links to articles on Microsoft Entra integration and SAS options.
author: jesusbar

ms.author: jesusbar
ms.service: iot-dps
ms.topic: concept-article
ms.date: 04/20/2022
ms.custom: ['Role: Cloud Development', 'Role: Azure IoT Hub Device Provisioning Service (DPS)', 'Role: Operations', devx-track-csharp]
---

# Control access to Azure IoT Hub Device Provisioning Service (DPS)

This article describes the available options for securing your Azure IoT Hub Device Provisioning Service (DPS). The provisioning service uses *authentication* and *permissions* to grant access to each endpoint. Permissions allow the authentication process to limit access to a service instance based on functionality.

There are two different ways for controlling access to DPS:

- **Shared access signatures** lets you group permissions and grant them to applications using access keys and signed security tokens. To learn more, see [Control access to DPS with shared access signatures and security tokens](how-to-control-access.md).
- **Microsoft Entra integration (public preview)** for service APIs. Azure provides identity-based authentication with Microsoft Entra ID and fine-grained authorization with Azure role-based access control (Azure RBAC). Microsoft Entra ID and RBAC integration is supported for DPS service APIs only. To learn more, see [Control access to DPS with Microsoft Entra ID (Public Preview)](concepts-control-access-dps-azure-ad.md).

## Next steps

- [Control access to DPS with shared access signatures and security tokens](how-to-control-access.md)
- [Control access to DPS with Microsoft Entra ID (public preview)](concepts-control-access-dps-azure-ad.md)
