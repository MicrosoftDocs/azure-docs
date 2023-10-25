---
title: User management for Microsoft Defender for IoT
description: Learn about the different options for user and user role management for Microsoft Defender for IoT.
ms.date: 11/13/2022
ms.topic: overview
---

# Microsoft Defender for IoT user management

Microsoft Defender for IoT provides tools both in the Azure portal and on-premises for managing user access across Defender for IoT resources.

## Azure users for Defender for IoT

In the Azure portal, users are managed at the subscription level with [Microsoft Entra ID](../../active-directory/index.yml) and [Azure role-based access control (RBAC)](../../role-based-access-control/overview.md). Azure subscription users can have one or more user roles, which determine the data and actions they can access from the Azure portal, including in Defender for IoT.

Use the [portal](../../role-based-access-control/quickstart-assign-role-user-portal.md) or [PowerShell](../../role-based-access-control/tutorial-role-assignments-group-powershell.md) to assign your Azure subscription users with the specific roles they'll need to view data and take action, such as whether they'll be viewing alert or device data, or managing pricing plans and sensors.

For more information, see [Manage users on the Azure portal](manage-users-portal.md) and [Azure user roles for OT and Enterprise IoT monitoring](roles-azure.md)

## On-premises users for Defender for IoT

When working with OT networks, Defender for IoT services and data is available also from on-premises OT network sensors and the on-premises sensor management console, in addition to the Azure portal.

You'll need to define on-premises users on both your OT network sensors and the on-premises management console, in addition to Azure. Both the OT sensors and the on-premises management console are installed with a set of default, privileged users, which you can use to define other administrators and users.

Sign into the OT sensors to [define sensor users](manage-users-sensor.md), and sign into the on-premises management console to [define on-premises management console users](manage-users-on-premises-management-console.md).

For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

### Active Directory support on sensors and on-premises management consoles

You might want to configure an integration between your sensor and Active Directory to allow Active Directory users to sign in to your sensor, or to use Active Directory groups, with collective permissions assigned to all users in the group.

For example, use Active Directory when you have a large number of users that you want to assign **Read Only** access to, and you want to manage those permissions at the group level.

Defender for IoT's integration with Active Directory supports LDAP v3 and the following types of LDAP-based authentication:

- **Full authentication**: User details are retrieved from the LDAP server. Examples are the first name, last name, email, and user permissions.

- **Trusted user**: Only the user password is retrieved. Other user details that are retrieved are based on users defined in the sensor.

For more information, see:

- [Configure an Active Directory connection](manage-users-sensor.md#configure-an-active-directory-connection)
- [Integrate on-premises management console users with Active Directory](manage-users-on-premises-management-console.md#integrate-users-with-active-directory)
- [Other firewall rules for external services (optional)](networking-requirements.md#other-firewall-rules-for-external-services-optional).

### On-premises global access groups

Large organizations often have a complex user permissions model based on global organizational structures. To manage your on-premises Defender for IoT users, use a global business topology that's based on business units, regions, and sites, and then define user access permissions around those entities.

Create user access groups to establish global access control across Defender for IoT on-premises resources. Each access group includes rules about the users that can access specific entities in your business topology, including business units, regions, and sites.

For example, the following diagram shows how you can allow security analysts from an Active Directory group to access all West European automotive and glass production lines, along with a plastics line in one region:

:::image type="content" source="media/how-to-define-global-user-access-control/sa-diagram.png" alt-text="Diagram of the Security Analyst Active Directory group." lightbox="media/how-to-define-global-user-access-control/sa-diagram.png" border="false":::

For more information, see [Define global access permission for on-premises users](manage-users-on-premises-management-console.md#define-global-access-permission-for-on-premises-users).

> [!TIP]
> Access groups and rules help to implement Zero Trust strategies by controlling where users manage and analyze devices on Defender for IoT sensors and the on-premises management console. For more information, see [Zero Trust and your OT/IoT networks](concept-zero-trust.md).
>

## Next steps

- [Manage Azure subscription users](../../role-based-access-control/quickstart-assign-role-user-portal.md)
- [Create and manage users on an OT network sensor](manage-users-sensor.md)
- [Create and manage users on an on-premises management console](manage-users-on-premises-management-console.md)

For more information, see:

- [Azure user roles and permissions for Defender for IoT](roles-azure.md)
- [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md)
