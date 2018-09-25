---
title: Understanding Azure Digital Twins security best practices | Microsoft Docs
description: Azure Digital Twins security best practices
author: adamgerard
manager: alinast
ms.service: azure-digital-twins
services: azure-digital-twins
ms.topic: conceptual
ms.date: 09/25/2018
ms.author: adgera
---

# Security best practices

Digital Twins security enables precise access to specific resources and actions in your IoT topology. It does so through granular role and permission management called Digital Twins Role-Based Access Control.

Azure Digital Twins also leverages other security features present on Azure IoT. For that reason, configuring your Digital Twins app involves using many of the same [Azure IoT security practices](https://docs.microsoft.com/azure/iot-fundamentals/iot-security-best-practices?context=azure/iot-hub/) currently recommended.

This article will summarize key best practices to follow.

## Role-Based Access Control best practices

[!INCLUDE [digital-twins-permissions](../../includes/digital-twins-rbac-best-practices.md)]

## Next steps

Learn more about Azure IoT best practices:

> [!div class="nextstepaction"]
> [IoT security best practices](https://docs.microsoft.com/azure/iot-fundamentals/iot-security-best-practices?context=azure/iot-hub/)

Read more about Role-Based Access Control:

> [!div class="nextstepaction"]
> [Role-Based Access Control] (./security-role-based-access-control.md)

> [!div class="nextstepaction"]
> [Create and manage roles] (./security-create-manage-role-assignments.md)