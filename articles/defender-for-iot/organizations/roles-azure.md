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

## Roles and permissions reference

Roles for management actions are applied to user roles across an entire Azure subscription.

| Action and scope|[Security Reader](../../role-based-access-control/built-in-roles.md#security-reader)  |[Security Admin](../../role-based-access-control/built-in-roles.md#security-admin)  |[Contributor](../../role-based-access-control/built-in-roles.md#contributor) | [Owner](../../role-based-access-control/built-in-roles.md#owner) |
|---------|---------|---------|---------|---------|
| **Grant permissions to others** | -       |  -       |   -      | ✔ |
|  **Onboard OT or Enterprise IoT sensors**  | -       |  ✔       |   ✔      | ✔ |
|  **Download OT sensor and on-premises management console software** | ✔      |  ✔       |   ✔      | ✔ |
|  **Download sensor activation files** |   -     |   ✔      | ✔ | ✔ |
|  **View values on the Pricing page**  | ✔      |   ✔     | ✔ | ✔ |
|  **Modify values on the Pricing page**  | -       |   ✔     | ✔ | ✔ |
|  **View values on the Sites and sensors page**   |   ✔   |   ✔    | ✔ | ✔|
|  **Modify values on the Sites and sensors page**   |   -    |   ✔    | ✔ | ✔|
|  **Recover on-premises management console passwords**   | -      |   ✔     | ✔ | ✔ |
|  **Download OT threat intelligence packages** | ✔      |  ✔       |   ✔      | ✔ |
|  **Push OT threat intelligence updates**  | -     |   ✔     | ✔ | ✔ |
| **Onboard an Enterprise IoT plan from Microsoft 365 Defender** [*](#enterprise-iot-security) | - | ✔ | - | - |
| **View alerts** | ✔ | ✔ |✔ | ✔|
| **Modify alerts (write access)** |  - | ✔ |✔ | ✔ |
| **View device inventory**   |  ✔ | ✔ |✔ | ✔|
| **Manage device inventory (write access)**   | - | ✔ |✔ | ✔ |
| **View workbooks**  | ✔ | ✔ |✔ | ✔ |
| **Manage workbooks (write access)**  <!--check w yair--> |  - | ✔ |✔ | ✔ |

## Enterprise IoT security

Add, edit, or cancel an Enterprise IoT plan with Defender for Endpoint from Microsoft 365 Defender. To add an Enterprise IoT plan, you'll need an E5 license and specific permissions in your Microsoft 365 Defender tenant. Alerts, vulnerabilities, and recommendations are also only available from Microsoft 365 Defender.

To view Enterprise IoT devices in your Defender for IoT device inventory, you'll need an Enterprise IoT network sensor installed.

For more information, see [Tutorial: Get started with Enterprise IoT monitoring](tutorial-getting-started-eiot-sensor.md).

## Next steps

For more information, see:

- [Manage OT monitoring users on the Azure portal](manage-users-portal.md)
- [On-premises user roles for OT monitoring with Defender for IoT](roles-on-premises.md)
