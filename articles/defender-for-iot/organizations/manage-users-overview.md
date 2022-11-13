---
title: User management for Microsoft Defender for IoT
description: Learn about the different options for user and user role management for Microsoft Defender for IoT.
ms.date: 11/13/2022
ms.topic: conceptual
---

# Microsoft Defender for IoT user management

Microsoft Defender for IoT provides tools both in the Azure portal and on-premises for managing user access across Defender for IoT resources.

## Azure users for Defender for IoT

In the Azure portal, user management is managed at the subscription level with [Azure Active Directory (AAD)](/azure/active-directory/) and [Azure role-based access control (RBAC)](/azure/role-based-access-control/overview). Azure subscription users can have one or more user roles, which determine the data and actions they can access from the Azure portal.

Use the [portal](/azure/role-based-access-control/quickstart-assign-role-user-portal) or [PowerShell](/azure/role-based-access-control/tutorial-role-assignments-group-powershell) to assign your AAD users with the specific roles they'll need to view data and take action, such as whether they'll be viewing alert or device data, or managing pricing plans and sensors.

For more information, see [Azure user roles for OT and Enterprise IoT monitoring](roles-azure.md)

## On-premises users for Defender for IoT

When working with OT networks, Defender for IoT services and data is available from both the Azure portal and from on-premises OT network sensors and the on-premises sensor management consoles.

In addition to Azure users, you'll need to define on-premises users on both your OT network sensors and the on-premises management console. Both the OT sensors and the on-premises management console are installed with a set of default, privileged users, which you can use to define additional administrators and other users.

Sign into the OT sensors to [define sensor users](manage-users-sensor.md), and sign into the on-premises management console to [define on-premises management console users](manage-users-on-premises-management-console.md).

For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

## Next steps

