---
title: Authorization overview
titleSuffix: Azure IoT Hub
description: Understand the authorization options available to Azure IoT Hub. 
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.author: kgremban
ms.topic: overview
ms.date: 05/01/2023
ms.custom: ['Role: Cloud Development', 'Role: IoT Device', 'Role: System Architecture']
---

# Authorization overview

This article defines authorization and provides an overview of available options you can use for authorization in IoT Hub. 

## What is authorization?

*Authorization* is the process of confirming permissions for an authenticated user or device on IoT Hub. It specifies what resources and commands you're allowed to access, and what you can do with those resources and commands. Authorization is sometimes shortened to *AuthZ*. Authorization is separate from *authentication*, which is the process of proving that you are who you say you are. For more information about authentication, see [Authentication overview](authenticate-overview.md).

## Authorization options

There are two different ways for handling authorization in IoT Hub:

- **Azure Active Directory (Azure AD) integration** for service APIs. Azure provides identity-based authentication with AAD and fine-grained authorization with Azure role-based access control (Azure RBAC). Azure AD and RBAC integration is supported for IoT hub service APIs only. To learn more, see [Authorize access with Azure Active Directory](authorize-azure-ad.md).
- **Shared access signatures** lets you group permissions and grant them to applications using access keys and signed security tokens. To learn more, see [Authorize access with shared access signatures](authorize-sas.md). 

> [!TIP]
> You can enable a lock on your IoT resources to prevent them being accidentally or maliciously deleted. To learn more about Azure Resource locks, please visit, [Lock your resources to protect your infrastructure](../azure-resource-manager/management/lock-resources.md?tabs=json)

## Next steps

Read more about [authentication options available to IoT Hub](authenticate-overview.md)

Use the Device Provisioning Service to [Provision multiple X.509 devices using enrollment groups](../iot-dps/tutorial-custom-hsm-enrollment-group-x509.md).