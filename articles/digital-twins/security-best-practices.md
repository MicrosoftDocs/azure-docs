---
title: Understanding Azure Digital Twins security best practices | Microsoft Docs
description: Azure Digital Twins security best practices
author: adamgerard
manager: alinast
ms.service: azure-digital-twins
services: azure-digital-twins
ms.topic: conceptual
ms.date: 09/21/2018
ms.author: adgera
---

# Security best practices

Azure Digital Twins leverages all security features present on Azure IoT.

For that reason, configuring your Digital Twins app involves using many of the same [Azure IoT security practices](https://docs.microsoft.com/azure/iot-fundamentals/iot-security-best-practices?context=azure/iot-hub/) currently recommended.

## Role-Based Access Control best practices

The **principle of least privilege** grants an identity only the amount of access needed to perform its job.

>[!NOTE]
> **Always follow the principle of least privilege**.

Permissions and roles in Role-Based Access Control are inherited from parent roles.

Two other important practices to follow:

* Periodically audit role assignments.
* Roles and assignments should be cleaned-up as individuals change roles or assignments.

## Next steps

Learn more about Azure IoT best practices:

> [!div class="nextstepaction"]
> [IoT security best practices](https://docs.microsoft.com/azure/iot-fundamentals/iot-security-best-practices?context=azure/iot-hub/)

Read more about Role-Based Access Control:

> [!div class="nextstepaction"]
> [Role-Based Access Control] (./security-role-based-access-control.md)

> [!div class="nextstepaction"]
> [Create and manage roles] (./security-create-manage-role-assignments.md)