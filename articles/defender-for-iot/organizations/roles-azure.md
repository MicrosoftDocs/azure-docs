---
title: Azure user roles for Defender for IoT - Microsoft Defender for IoT
description: Learn about the Azure user roles available for OT and Enterprise IoT monitoring with Microsoft Defender for IoT on the Azure portal.
ms.date: 09/19/2022
ms.topic: conceptual
---

## Azure user roles for OT and Enterprise IoT monitoring with Defender for IoT

Microsoft Defender for IoT uses Azure role-based access control (RBAC) to provide access to Enterprise IoT monitoring services and data on the Azure portal.

The built-in Azure [Security Reader](../../role-based-access-control/built-in-roles.md#security-reader), [Security Admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), and [Owner](../../role-based-access-control/built-in-roles.md#owner) roles are relevant for use in Defender for IoT.

This article provides a reference of Defender for IoT actions available for each role, for OT and Enterprise IoT networks respectively.

For more information, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles).

## Azure user roles for OT networks

The following tables list the Defender for IoT monitoring actions for OT networks that are available to each Azure user role.

### OT networks: Permissions for management actions

Roles for management actions are applied to user roles across an entire Azure subscription.

| Action |[Security Reader](../../role-based-access-control/built-in-roles.md#security-reader)  |[Security Admin](../../role-based-access-control/built-in-roles.md#security-admin)  |[Contributor](../../role-based-access-control/built-in-roles.md#contributor) | [Owner](../../role-based-access-control/built-in-roles.md#owner) |
|---------|---------|---------|---------|---------|
|  **Onboard sensors** <!--check w idan that we added this--> | ✔      |  ✔       |   ✔      | ✔ |
|  **Download sensor and on-premises management console software and threat intelligence packages** | ✔      |  ✔       |   ✔      | ✔ |
|  **Download activation files**|   -     |   ✔      | ✔ | ✔ |
|  **Modify values on the Pricing page, update committed devices**  | -       |   ✔     | ✔ | ✔ |
|  **Recover on-premises passwords**  | -      |   ✔     | ✔ | ✔ |
|  **Push threat intelligence updates**  | -     |   ✔     | ✔ | ✔ |
|  **Modify values on the Sites and sensors page**   |   -    |   ✔    | ✔ | ✔|

### Permissions for security monitoring actions

Roles for security monitoring actions can be applied across an entire Azure subscription, or for a specific OT site only. For more information, see [Define Azure access control per OT site](manage-users-portal.md#define-azure-access-control-per-ot-site).

| Action |[Security Reader](../../role-based-access-control/built-in-roles.md#security-reader)  |[Security Admin](../../role-based-access-control/built-in-roles.md#security-admin)  |[Contributor](../../role-based-access-control/built-in-roles.md#contributor) | [Owner](../../role-based-access-control/built-in-roles.md#owner) |
|---------|---------|---------|---------|---------|
| **Alerts page** | Read-only | Read-write |Read-write | Read-write |
| **Device inventory**  | Read-only | Read-write |Read-write | Read-write |


# Azure user roles for Enterprise IoT networks

The following tables list the Defender for IoT monitoring actions for Enterprise IoT networks that are available to each Azure user role.

## Permissions for management actions

Roles for management actions are applied to user roles across an entire Azure subscription.

| Action |[Security Reader](../../role-based-access-control/built-in-roles.md#security-reader)  |[Security Admin](../../role-based-access-control/built-in-roles.md#security-admin)  |[Contributor](../../role-based-access-control/built-in-roles.md#contributor) | [Owner](../../role-based-access-control/built-in-roles.md#owner) |
|---------|---------|---------|---------|---------|
| **Onboard sensors** (Public preview) | -    |   ✔    | ✔ | ✔|
|  **Download activation files**|   -     |   ✔      | ✔ | ✔ |
|  **Remove plans from the Pricing page**  | -       |   ✔     | ✔ | ✔ |
|  **Modify values on the Sites and sensors page**   |   -    |   ✔    | ✔ | ✔|

## Permissions for security monitoring actions

Roles for security monitoring actions are applied to user roles across an entire Azure subscription.

| Action |[Security Reader](../../role-based-access-control/built-in-roles.md#security-reader)  |[Security Admin](../../role-based-access-control/built-in-roles.md#security-admin)  |[Contributor](../../role-based-access-control/built-in-roles.md#contributor) | [Owner](../../role-based-access-control/built-in-roles.md#owner) |
|---------|---------|---------|---------|---------|
| **Alerts page** | Read-only | Read-write |Read-write | Read-write |
| **Device inventory**  | Read-only | Read-write |Read-write | Read-write |

> [!NOTE]
> To view alerts for Enterprise IoT devices in Defender for IoT, you must have an Enterprise IoT network sensor installed. To view alerts for devices detected by Microsoft Defender for Endpoint, use the [**Alerts** page in Defender Endpoint](/microsoft-365/security/defender-endpoint/alerts-queue) and [Tutorial: Get started with Enterprise IoT monitoring](tutorial-getting-started-eiot-sensor.md).

## Next steps

For more information, see:

- [Manage OT monitoring users on the Azure portal](manage-users-portal.md)
- [On-premises user roles for OT monitoring with Defender for IoT](roles-on-premises.md)
