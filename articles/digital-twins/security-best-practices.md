---
title: Understanding Azure Digital Twins security best practices | Microsoft Docs
description: Azure Digital Twins security best practices
author: adamgerard
manager: alinast
ms.service: azure-digital-twins
services: azure-digital-twins
ms.topic: conceptual
ms.date: 09/27/2018
ms.author: adgera
---

# Security best practices

Digital Twins security enables precise access to specific resources and actions in your IoT topology. It does so through granular role and permission management called Digital Twins Role-Based Access Control.

Azure Digital Twins also leverages other security features present on Azure IoT. For that reason, configuring your Digital Twins app involves using many of the same [Azure IoT security practices](https://docs.microsoft.com/azure/iot-fundamentals/iot-security-best-practices?context=azure/iot-hub/) currently recommended.

This article will summarize key best practices to follow. It's advised to review additional security resources (including device vendors) to ensure maximal security for your IoT space.

## IoT Security best practices

Some key practices to safely secure your network include:

* Secure each device connected to your IoT network in a tamper-proof way.
* Use powerful encryption wherever possible. That means requiring long passwords, using secure protocols, and two-factor authentication.
* Encrypt persistent data.
* Limit I/O and device bandwidth to improve performance. Rate-limiting and throttling can improve security by preventing denial-of-service attacks.
* Limit the role of each device, sensor, and person within your IoT space. If compromised, the impact is minimized.
* Carefully restrict access and permissions by role (see Role-Based Access Control best practices below).

## Role-Based Access Control best practices

[!INCLUDE [digital-twins-rbac-best-practices](../../includes/digital-twins-rbac-best-practices.md)]

## Next steps

Learn more about Azure IoT best practices:

> [!div class="nextstepaction"]
> [IoT security best practices](https://docs.microsoft.com/azure/iot-fundamentals/iot-security-best-practices?context=azure/iot-hub/)

Read more about Role-Based Access Control:

> [!div class="nextstepaction"]
> [Role-Based Access Control] (./security-role-based-access-control.md)

> [!div class="nextstepaction"]
> [Create and manage roles] (./security-create-manage-role-assignments.md)