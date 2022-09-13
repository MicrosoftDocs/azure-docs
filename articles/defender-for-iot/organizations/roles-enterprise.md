---
title: Defender for IoT users roles for Enterprise IoT networks
description: Learn about the Azure user roles available for Enterprise IoT monitoring with Microsoft Defender for IoT on the Azure portal.
ms.date: 09/13/2022
ms.topic: conceptual
---

# Azure user roles for Enterprise IoT networks

Microsoft Defender for IoT uses Azure role-based access control (RBAC) to provide access to Enterprise IoT monitoring services and data on the Azure portal.

This article provides a reference of the actions available for each role. For more information, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles).

## Permissions for management functionalities

The following table lists the permissions available per role. Roles are applied to users across an entire Azure subscription.

| Action |[Security Reader](../role-based-access-control/built-in-roles.md#security-reader)  |[Security Admin](../role-based-access-control/built-in-roles.md#security-admin)  |[Contributor](../role-based-access-control/built-in-roles.md#contributor) | [Owner](../role-based-access-control/built-in-roles.md#owner) |
|---------|---------|---------|---------|---------|
| **Onboard sensors** (Public preview) | -    |   ✔    | ✔ | ✔|
|  **Download activation files**|   -     |   ✔      | ✔ | ✔ |
|  **Remove plans from the Pricing page**  | -       |   ✔     | ✔ | ✔ |
|  **Modify values on the Sites and sensors page**   |   -    |   ✔    | ✔ | ✔|

## Permissions for security monitoring functionalities

The following table lists the permissions available per role. Roles are applied to users across an entire Azure subscription.

| Action |[Security Reader](../role-based-access-control/built-in-roles.md#security-reader)  |[Security Admin](../role-based-access-control/built-in-roles.md#security-admin)  |[Contributor](../role-based-access-control/built-in-roles.md#contributor) | [Owner](../role-based-access-control/built-in-roles.md#owner) |
|---------|---------|---------|---------|---------|
| **Alerts page** | Read-only | Read-write |Read-write | Read-write |
| **Device inventory**  | Read-only | Read-write |Read-write | Read-write |

> [!NOTE]
> Alerts for Enterprise IoT devices in the Azure portal require an Enterprise IoT network sensor. For alerts related to MDE devices, see the MDE Alerts page. For more information, see - [Alerts in Defender for Endpoint](/microsoft-365/security/defender-endpoint/alerts-queue).

## Next steps

For more information, see [Tutorial: Get started with Enterprise IoT monitoring](tutorial-getting-started-eiot-sensor.md).