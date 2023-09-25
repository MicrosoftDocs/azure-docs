---
title: Authenticate with Azure Active Directory
titleSuffix: Azure IoT Hub
description: Understand how Azure IoT Hub uses Azure Active Directory to authenticate IoT hubs and devices. 
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.author: kgremban
ms.topic: conceptual
ms.date: 05/01/2023
ms.custom: ['Role: Cloud Development', 'Role: IoT Device', 'Role: System Architecture']
---

# Authenticate with Azure Active Directory

## Authentication in IoT Hub

*Authentication* is the process of proving that you are who you say you are. This is achieved by verification of the identity of a user or device to IoT Hub. It's sometimes shortened to *AuthN*. Authentication is separate from *authorization*, which is the process of confirming permissions for an authenticated user or device on IoT Hub.

This article describes authentication that uses **Azure Active Directory (Azure AD) integration** for service APIs. Azure provides identity-based authentication with AAD and fine-grained authorization with Azure role-based access control (Azure RBAC). Azure AD and RBAC integration is supported for IoT hub service APIs only.

## Azure Active Directory authentication


## Next steps

Use the Device Provisioning Service to [Provision multiple X.509 devices using enrollment groups](../iot-dps/tutorial-custom-hsm-enrollment-group-x509.md).