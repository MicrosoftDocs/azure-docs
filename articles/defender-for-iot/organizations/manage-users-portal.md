---
title: Manage Azure users for OT network security - Microsoft Defender for IoT
description: Learn how to manage user permissions in the Azure portal for the OT monitoring sensors or on-premises management consoles.
ms.date: 09/04/2022
ms.topic: how-to
---

# Manage OT monitoring users on the Azure portal

Microsoft Defender for IoT provides tools both in the Azure portal and on-premises for managing user access across Defender for IoT resources.

In the Azure portal, user management is managed at the *subscription* level, where you can define permissions for configuring Defender for IoT, adding and updating pricing plans, and accessing data about your sites and sensors in the Azure portal. For more information, see [What is Azure role-based access control (Azure RBAC)?](/azure/role-based-access-control/overview)

For OT network monitoring specifically, administrators can also grant access at the *OT site* level, directly from Defender for IoT. Grant access at the site level when you want to manage access to specific Defender for IoT data in the Azure portal, such as device inventory or alerts.

## Define Azure access control per OT site

1. In the Azure portal, go to the **Defender for IoT** > **Sites and sensors** page, and select the site where you want to assign permissions.

    Site-based access control is not relevant or supported for default sites or for Enterprise IoT networks.

1. In the **Edit site** pane that appears on the right, select **Manage site access control (Preview)**. For example:

    :::image type="content" source="media/release-notes/site-based-access.png" alt-text="Screenshot of the site-based access option from the Sites and sensors page.":::

    An **Access control** page opens in Defender for IoT for your site. This **Access control** page is the same interface as is available directly from the **Access control** tab on any Azure resource.

For example, use the **Access control** page in Defender for IoT to do any of the following for the selected site:

- Check your own access to the site
- Check access to the site for other users, groups, service principals, or managed identities
- Grant access to the site for others
- View current role assignments on the site
- View role assignments that have been denied specific actions for the site
- View a full list of roles available for the site

For more information, see [Tutorial: Grant a user access to Azure resources using the Azure portal](/azure/role-based-access-control/quickstart-assign-role-user-portal).

## Next steps

For more information, see:

- [Azure user roles for OT and Enterprise IoT monitoring with Defender for IoT](roles-azure.md)
- [Create and manage on-premises users for OT monitoring](how-to-create-and-manage-users.md)
- [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md)