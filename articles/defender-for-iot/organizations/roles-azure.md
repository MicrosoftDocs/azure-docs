---
title: Azure user roles and permissions for Microsoft Defender for IoT
description: Learn about the Azure user roles and permissions available for OT and Enterprise IoT monitoring with Microsoft Defender for IoT on the Azure portal.
ms.date: 09/19/2022
ms.topic: conceptual
---

# Azure user roles and permissions for Defender for IoT

Microsoft Defender for IoT uses Azure role-based access control (RBAC) to provide access to Enterprise IoT monitoring services and data on the Azure portal.

The built-in Azure [Security Reader](../../role-based-access-control/built-in-roles.md#security-reader), [Security Admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), and [Owner](../../role-based-access-control/built-in-roles.md#owner) roles are relevant for use in Defender for IoT.

This article provides a reference of Defender for IoT actions available for each role in the Azure portal. For more information, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles).

## Permissions for management actions

Roles for management actions are applied to user roles across an entire Azure subscription.

| Action |[Security Reader](../../role-based-access-control/built-in-roles.md#security-reader)  |[Security Admin](../../role-based-access-control/built-in-roles.md#security-admin)  |[Contributor](../../role-based-access-control/built-in-roles.md#contributor) | [Owner](../../role-based-access-control/built-in-roles.md#owner) |
|---------|---------|---------|---------|---------|
|  **Onboard sensors** <!--check w idan that we added this, check with geffen about EIoT sensors, could be we need an update in the tutorial too--> | ✔      |  ✔       |   ✔      | ✔ |
| **Onboard Enterprise IoT in Microsoft 365 Defender for Endpoint** | - | - |✔ | - |
|  **Download OT sensor and on-premises management console software** | ✔      |  ✔       |   ✔      | ✔ |
|  **Download sensor activation files**|   -     |   ✔      | ✔ | ✔ |
|  **Modify values on the Pricing page**  | -       |   ✔     | ✔ | ✔ |
|  **Modify values on the Sites and sensors page**   |   -    |   ✔    | ✔ | ✔|
|  **Recover on-premises management console passwords**  | -      |   ✔     | ✔ | ✔ |
|  **Download threat intelligence packages** | ✔      |  ✔       |   ✔      | ✔ |
|  **Push threat intelligence updates**  | -     |   ✔     | ✔ | ✔ |

> [!NOTE]
> To modify settings for Enterprise IoT support, remove your current plan and onboard again from Defender for Endpoint. For more information, see [Onboard with Microsoft Defender for IoT](/microsoft-365/security/defender-endpoint/enable-microsoft-defender-for-iot-integration?view=o365-worldwide).

## Permissions for security monitoring actions

Roles for security monitoring actions can be applied across an entire Azure subscription, or for a specific OT site only. For more information, see [Define Azure access control per OT site](manage-users-portal.md#define-azure-access-control-per-ot-site).

| Action |[Security Reader](../../role-based-access-control/built-in-roles.md#security-reader)  |[Security Admin](../../role-based-access-control/built-in-roles.md#security-admin)  |[Contributor](../../role-based-access-control/built-in-roles.md#contributor) | [Owner](../../role-based-access-control/built-in-roles.md#owner) |
|---------|---------|---------|---------|---------|
| **Alerts page** | Read-only | Read-write |Read-write | Read-write |
| **Device inventory page**  | Read-only | Read-write |Read-write | Read-write |
| **Workbooks page** <!--check with idan and yair about this--> | Read-only | Read-write |Read-write | Read-write |

> [!NOTE]
> To view alerts for Enterprise IoT devices in Defender for IoT, you must have an Enterprise IoT network sensor installed (Public Preview). To view alerts for devices detected by Microsoft Defender for Endpoint, use the [**Alerts** page in Defender Endpoint](/microsoft-365/security/defender-endpoint/alerts-queue) and [Tutorial: Get started with Enterprise IoT monitoring](tutorial-getting-started-eiot-sensor.md).

## Next steps

For more information, see:

- [Manage OT monitoring users on the Azure portal](manage-users-portal.md)
- [On-premises user roles for OT monitoring with Defender for IoT](roles-on-premises.md)
