---
title: Azure user roles and permissions for Microsoft Defender for IoT
description: Learn about the Azure user roles and permissions available for OT and Enterprise IoT monitoring with Microsoft Defender for IoT on the Azure portal.
ms.date: 10/22/2023
ms.topic: concept-article
ms.custom: enterprise-iot
ms.collection:
  -       zerotrust-extra
---

# Azure user roles and permissions for Defender for IoT

Microsoft Defender for IoT uses [Azure Role-Based Access Control (RBAC)](../../role-based-access-control/index.yml) to provide access to Defender for IoT monitoring services and data on the Azure portal.

The built-in Azure [Security Reader](../../role-based-access-control/built-in-roles.md#security-reader), [Security Admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), and [Owner](../../role-based-access-control/built-in-roles.md#owner) roles are relevant for use in Defender for IoT.

This article provides a reference of Defender for IoT actions available for each role in the Azure portal. For more information, see [Azure built-in roles](../../role-based-access-control/built-in-roles.md).

## Roles and permissions reference

Permissions are applied to user roles across an entire Azure subscription, or in some cases, across individual Defender for IoT sites. For more information, see [Zero Trust and your OT networks](concept-zero-trust.md) and [Manage site-based access control (Public preview)](manage-users-portal.md#manage-site-based-access-control-public-preview).

|Action and scope |[Security Reader](../../role-based-access-control/built-in-roles.md#security-reader)  |[Security Admin](../../role-based-access-control/built-in-roles.md#security-admin)  |[Contributor](../../role-based-access-control/built-in-roles.md#contributor) |[Owner](../../role-based-access-control/built-in-roles.md#owner) |
|---------|---------|---------|---------|---------|
| **[Grant permissions to others](manage-users-portal.md)**<br>Apply per subscription or site | -       |  -       |   -      | ✔ |
|  **Onboard [OT](onboard-sensors.md) or [Enterprise IoT sensors](eiot-sensor.md)**  <br>Apply per subscription only | -       |  ✔       |   ✔      | ✔ |
|  **[Download OT sensor software](update-ot-software.md#download-the-update-package-from-the-azure-portal)**<br>Apply per subscription only | ✔      |  ✔       |   ✔      | ✔ |
| **[Download sensor endpoint details](how-to-manage-sensors-on-the-cloud.md#endpoint)** <br>Apply per subscription only |  ✔    |  ✔       |   ✔      | ✔ |
|  **[Download sensor activation files](how-to-manage-sensors-on-the-cloud.md#reactivate-an-ot-sensor)** <br>Apply per subscription only|   -     |   ✔      | ✔ | ✔ |
|  **[View values on the Plans and pricing page](how-to-manage-subscriptions.md)**  <br>Apply per subscription only| ✔      |   ✔     | ✔ | ✔ |
|  **[Modify values on the Plans and pricing page](how-to-manage-subscriptions.md)**  <br>Apply per subscription only| -       |   ✔     | ✔ | ✔ |
|  **[View values on the Sites and sensors page](how-to-manage-sensors-on-the-cloud.md)** <br>Apply per subscription only  |   ✔   |   ✔    | ✔ | ✔|
|  **[Modify values on the Sites and sensors page](how-to-manage-sensors-on-the-cloud.md#sensor-management-options-from-the-azure-portal)** , including remote OT sensor updates<br>Apply per subscription only  |   -    |   ✔    | ✔ | ✔|
|  **[Recover OT sensor passwords](how-to-manage-sensors-on-the-cloud.md#sensor-deployment-and-access)** <br>Apply per subscription only  | -      |   ✔     | ✔ | ✔ |
|  **[Download OT threat intelligence packages](how-to-work-with-threat-intelligence-packages.md#manually-update-locally-managed-sensors)** <br>Apply per subscription only | ✔      |  ✔       |   ✔      | ✔ |
|  **[Push OT threat intelligence updates](how-to-work-with-threat-intelligence-packages.md#manually-push-updates-to-cloud-connected-sensors)** <br>Apply per subscription only | -     |   ✔     | ✔ | ✔ |
| **[View Azure alerts](how-to-manage-cloud-alerts.md)** <br>Apply per subscription or site | ✔ | ✔ |✔ | ✔|
| **[Modify Azure alerts](how-to-manage-cloud-alerts.md) (write access - change status, learn, download PCAP, suppression rules)** <br>Apply per subscription or site|  - | ✔ |✔ | ✔ |
| **[View Azure device inventory](how-to-manage-device-inventory-for-organizations.md)**  <br>Apply per subscription or site  |  ✔ | ✔ |✔ | ✔|
| **[Manage Azure device inventory](how-to-manage-device-inventory-for-organizations.md) (write access)**   <br>Apply per subscription or site | - | ✔ |✔ | ✔ |
| **[View Azure workbooks](workbooks.md)**<br>Apply per subscription or site   | ✔ | ✔ |✔ | ✔ |
| **[Manage Azure workbooks](workbooks.md) (write access)**  <br>Apply per subscription or site |  - | ✔ |✔ | ✔ |
| **[View Defender for IoT settings](configure-sensor-settings-portal.md)** <br>Apply per subscription | ✔ | ✔ |✔ | ✔ |
| **[Configure Defender for IoT settings](configure-sensor-settings-portal.md)** <br>Apply per subscription | - | ✔ |✔ | ✔ |

For an overview on creating new Azure custom roles, see [Azure custom roles](/azure/role-based-access-control/custom-roles). To set up a role, you need to add permissions from the actions listed in the [Internet of Things security permissions table](/azure/role-based-access-control/permissions/internet-of-things#microsoftiotsecurity).

>[!Important]
>
> After adding a new subscription to Defender for IoT, the initial login for that subscription must be performed using either the Owner or Contributor roles. For all subsequent logins the Security Admin role is sufficient.
>

## Next steps

For more information, see:

- [Microsoft Defender for IoT user management](manage-users-overview.md)
- [Manage OT monitoring users on the Azure portal](manage-users-portal.md)
- [On-premises user roles for OT monitoring with Defender for IoT](roles-on-premises.md)
- [Create and manage users on an OT network sensor](manage-users-sensor.md)
