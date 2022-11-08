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
|  **Onboard OT or Enterprise IoT sensors** <br>Apply per subscription only<!--check w idan that we added this, check with geffen about EIoT sensors, could be we need an update in the tutorial too. need to check with geffen that security readers can onboard eiot sensors.--> | -       |  ✔       |   ✔      | ✔ |
|  **Download OT sensor and on-premises management console software** <br>Apply per subscription only| ✔      |  ✔       |   ✔      | ✔ |
|  **Download sensor activation files** <br>Apply per subscription only|   -     |   ✔      | ✔ | ✔ |
|  **View values on the Pricing page**  <br>Apply per subscription only| ✔      |   ✔     | ✔ | ✔ |
|  **Modify values on the Pricing page**  <br>Apply per subscription only| -       |   ✔     | ✔ | ✔ |
|  **View values on the Sites and sensors page**   <br>Apply per subscription only|   ✔   |   ✔    | ✔ | ✔|
|  **Modify values on the Sites and sensors page**   <br>Apply per subscription only|   -    |   ✔    | ✔ | ✔|
|  **Recover on-premises management console passwords**   <br>Apply per subscription only| -      |   ✔     | ✔ | ✔ |
|  **Download OT threat intelligence packages** <br>Apply per subscription only| ✔      |  ✔       |   ✔      | ✔ |
|  **Push OT threat intelligence updates** <br>Apply per subscription only | -     |   ✔     | ✔ | ✔ |
| **Onboard an Enterprise IoT plan from Microsoft 365 Defender** [*](#enterprise-iot-security) <br>Apply per subscription only| - | ✔ | - | - |
| **View alerts** <br>Apply per subscription only| ✔ | ✔ |✔ | ✔|
| **Modify alerts (write access)** <br>Apply per subscription only|  - | ✔ |✔ | ✔ |
| **View device inventory** <br>Apply per subscription or site  |  ✔ | ✔ |✔ | ✔|
| **Manage device inventory (write access)** <br>Apply per subscription or site  | - | ✔ |✔ | ✔ |
| **View workbooks** <br>Apply per subscription or site<!--check with idan and yair about this--> | - | ✔ |✔ | ✔ |
| **Manage workbooks (write access)** <br>Apply per subscription or site<!--check with idan and yair about this--> |  - | ✔ |✔ | ✔ |

## Enterprise IoT security

Add, edit, or cancel an Enterprise IoT plan with Defender for Endpoint from Microsoft 365 Defender. To add an Enterprise IoT plan, you'll need an E5 license and specific permissions in your Microsoft 365 Defender tenant. Alerts, vulnerabilities, and recommendations are also only available from Microsoft 365 Defender.

To view Enterprise IoT devices in your Defender for IoT device inventory, you'll need an Enterprise IoT network sensor installed.

For more information, see [Tutorial: Get started with Enterprise IoT monitoring](tutorial-getting-started-eiot-sensor.md). <!--update xref-->

## Next steps

For more information, see:

- [Manage OT monitoring users on the Azure portal](manage-users-portal.md)
- [On-premises user roles for OT monitoring with Defender for IoT](roles-on-premises.md)
