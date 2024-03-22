---
title: Manage Azure users for Microsoft Defender for IoT
description: Learn how to manage user permissions in the Azure portal for Microsoft Defender for IoT services.
ms.date: 09/04/2022
ms.topic: how-to
ms.collection:
  -       zerotrust-extra
---

# Manage users on the Azure portal

Microsoft Defender for IoT provides tools both in the Azure portal and on-premises for managing user access across Defender for IoT resources.

In the Azure portal, user management is managed at the *subscription* level with [Microsoft Entra ID](../../active-directory/index.yml) and [Azure role-based access control (RBAC)](../../role-based-access-control/overview.md). Assign Microsoft Entra users with Azure roles at the subscription level so that they can add or update Defender for IoT pricing plans and access device data, manage sensors, and access device data across Defender for IoT.

For OT network monitoring, Defender for IoT has the extra *site* level, which you can use to add granularity to your user management. For example, assign roles at the site level to apply different permissions for the same users across different sites.

> [!NOTE]
> Site-based access control is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Define Azure users for Defender for IoT per subscription

Manage user access for Defender for IoT using Azure RBAC, applying the roles to users or user groups as needed to access required functionality.

- [Grant a user access to Azure resources using the Azure portal](../../role-based-access-control/quickstart-assign-role-user-portal.md)
- [Grant a group access to Azure resources using Azure PowerShell](../../role-based-access-control/tutorial-role-assignments-group-powershell.md)
- [Azure user roles for OT and Enterprise IoT monitoring](roles-azure.md)

## Manage site-based access control (Public preview)

Define [specified permissions](roles-azure.md#roles-and-permissions-reference) per Defender for IoT site as part of a [Zero Trust security strategy](concept-zero-trust.md) to add a level of granularity to your Azure access policies. Defender for IoT sites generally reflect many devices grouped in a specific geographical location, such as the devices in an office building at a specific address.

Site-based access control activities also allow you to check the following details:

- Check your own access to the site, or check access to the site for other users, groups, service principals, or managed identities
- View current role assignments on the site, including role assignments that have been denied specific actions on the site
- View a full list of roles available for the site

> [!NOTE]
> Sites and site-based access control is relevant only for OT monitoring sites, and isn't supported for default sites or Enterprise IoT monitoring.
>

**To manage site-based access control**:

1. In the Azure portal, go to the **Defender for IoT** > **Sites and sensors** page, and select the OT site where you want to assign permissions.

1. In the **Edit site** pane that appears on the right, select **Manage site access control (Preview)**. For example:

    :::image type="content" source="media/release-notes/site-based-access.png" alt-text="Screenshot of the site-based access option from the Sites and sensors page." lightbox="media/release-notes/site-based-access.png":::

    An **Access control** page opens in Defender for IoT for your site. This **Access control** page is the same interface as is available directly from the **Access control** tab on any Azure resource.

    For example:

    :::image type="content" source="media/manage-users-portal/access-control-site.png" alt-text="Screenshot of the Access Control page for site-based access control." lightbox="media/manage-users-portal/access-control-site.png":::

For more information, see:

- [Azure user roles and permissions for Defender for IoT](roles-azure.md)
- [Grant a user access to Azure resources using the Azure portal](../../role-based-access-control/quickstart-assign-role-user-portal.md)
- [List Azure role assignments using the Azure portal](../../role-based-access-control/role-assignments-list-portal.md)
- [Check access for a user to Azure resources](../../role-based-access-control/check-access.md)

## Next steps

For more information, see:

- [Azure user roles for OT and Enterprise IoT monitoring with Defender for IoT](roles-azure.md)
- [Create and manage on-premises users for OT monitoring](how-to-create-and-manage-users.md)
- [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md)
