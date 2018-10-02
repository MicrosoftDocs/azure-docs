---
title: Understanding Azure Digital Twins security best practices | Microsoft Docs
description: Azure Digital Twins security best practices
author: kingdomofends
manager: alinast
ms.service: azure-digital-twins
services: azure-digital-twins
ms.topic: conceptual
ms.date: 09/29/2018
ms.author: adgera
---

# Security best practices

Azure Digital Twins security enables precise access to specific resources and actions in your IoT graph. It does so through granular role and permission management called Digital Twins Role-Based Access Control.

Azure Digital Twins also leverages other security features present on Azure IoT including Azure Active Directory. For that reason, configuring your Digital Twins app involves using many of the same [Azure IoT security practices](https://docs.microsoft.com/azure/iot-fundamentals/iot-security-best-practices?context=azure/iot-hub/) currently recommended.

This article summarizes key best practices to follow.

> [!IMPORTANT]
> Review additional security resources (including your device vendors) to ensure maximal security for your IoT space.

## IoT Security best practices

Some key practices to safely secure your IoT devices include:

> [!div class="checklist"]
> * Secure each device that's connected to your IoT space in a tamper-proof way.
> * Limit the role of each device, sensor, and person within your IoT space. If compromised, the impact is minimized.
> * Potential use of device IP address filtering.
> * Limit I/O and device bandwidth to improve performance. Rate-limiting can improve security by preventing denial-of-service attacks.

Some key practices to safely secure an IoT space include:

> [!div class="checklist"]
> * Encrypt saved, stored, or persistent data.
> * Require passwords or keys to be periodically changed or refreshed.
> * Carefully restrict access and permissions by role (see Role-Based Access Control best practices below).
> * Use powerful encryption. That means requiring long passwords, using secure protocols, and two-factor authentication.

Monitoring IoT resources to watch for outliers, threats, or resource parameters that fall outside the range of usual operation is managed through Azure Analytics.

> [!NOTE]
> For more on event processing and monitoring, see our article on [event > routing](./concepts-events-routing.md).

## Azure Active Directory best practices

Azure Digital Twins enforces an [OAuth 2.0 On-Behalf-Of](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow) security flow through Azure Active Directory to authenticate to downstream APIs. Familiar best practices for securely interacting with APIs through OAuth 2.0 apply here as well. A few key practices to secure your IoT space for Azure Active Directory include:

> [!div class="checklist"]
> * Limiting OAuth 2.0 scope of access for a token.
> * Verifying the length of time a token is valid and whether a token remains valid.
> * Setting appropriate lengths of time that tokens are valid for.
> * Refreshing expired tokens.

## Role-Based Access Control best practices

[!INCLUDE [digital-twins-rbac-best-practices](../../includes/digital-twins-rbac-best-practices.md)]

## Next steps

Learn more about Azure IoT best practices:

> [!div class="nextstepaction"]
> [IoT security best practices](https://docs.microsoft.com/azure/iot-fundamentals/iot-security-best-practices?context=azure/iot-hub/)

Read more about Role-Based Access Control:

> [!div class="nextstepaction"]
> [Role-Based Access Control](./security-role-based-access-control.md)

Read more about authenticating to APIs:

> [!div class="nextstepaction"]
> [Authenticating with APIs](./security-authenticating-apis.md)
