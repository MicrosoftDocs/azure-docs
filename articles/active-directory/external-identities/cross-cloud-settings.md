---
title: Configure B2B collaboration cross-cloud settings - Azure AD
description: Use cross-cloud settings to enable B2B collaboration between sovereign (national) Microsoft Azure clouds.
services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 03/21/2022

ms.author: mimart
author: msmimart
manager: celestedg
ms.custom: "it-pro"
ms.collection: M365-identity-device-management
---

# Configure cross-cloud settings for B2B collaboration (Preview)

> [!NOTE]
> Cross-cloud settings are preview features of Azure Active Directory. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

When Azure AD organizations in separate Microsoft Azure clouds need to collaborate, they can enable cross-cloud Azure AD B2B collaboration. B2B collaboration is available between the following global and sovereign Microsoft Azure clouds:

- Microsoft Azure global cloud
- Microsoft Azure Government
- Microsoft Azure China 21Vianet

To set up B2B collaboration between partner organizations in different Microsoft Azure clouds, each partner mutually agrees to configure B2B collaboration with each other. An admin in each organization needs to complete the following steps:

1. Configure your cross-cloud settings to enable collaboration with the partner's cloud.

1. Add the partner's organization to your organizational settings. You'll add the organization using their tenant ID.

1. Control inbound and outbound collaboration with the partner organization. You can allow your default cross-tenant settings to take effect, or you can configure organizational settings that apply only to the partner organization.

After each organization has completed these steps, their users can collaborate using Azure AD B2B collaboration.

## Before you begin

- **Obtain the partner's tenant ID.** To enable B2B collaboration with a partner's Azure AD organization in another Microsoft Azure cloud, you'll need the partner's tenant ID. Using an organization's domain name for lookup isn't available in cross-cloud scenarios.
- **Decide on inbound and outbound access settings for the partner.** In cross-cloud scenarios, default settings only take effect for partner tenants that you add to your Organizational settings. When you enable an external cloud in your cross-cloud settings, all B2B collaboration with Azure AD organizations in that cloud is blocked. When you first enable another cloud, B2B collaboration is blocked for all tenants in that cloud. You need to add the tenant you want to collaborate with to your Organizational settings, and at that point your default settings go into effect for that tenant only. You can allow the default settings to remain in effect, or you can modify the organizational settings for the tenant.
- **Obtain any required object IDs or app IDs.** If you want to apply access settings to specific users, groups, or applications in the partner organization, you'll need to contact the organization for information before configuring your settings. Obtain their user object IDs, group object IDs, or application IDs (*client app IDs* or *resource app IDs*) so you can target your settings correctly.

## Enable the cloud in your cross-cloud settings

In your cross-cloud settings, enable the Microsoft Azure cloud you want to collaborate with.

1. Sign in to the [Azure portal](https://portal.azure.com) using a Global administrator or Security administrator account. Then open the **Azure Active Directory** service.
1. Select **External Identities**, and then select **Cross-tenant access settings (preview)**.
1. Select **Cross cloud settings**.
1. Select the checkboxes next to the external Microsoft Azure clouds you want to collaborate with.

   ![Screenshot showing cross-cloud settings.](media/cross-cloud-settings/cross-cloud-settings.png)

## Add the tenant to your organizational settings

Follow these steps to add the tenant you want to collaborate with to your Organizational settings.

1. Sign in to the [Azure portal](https://portal.azure.com) using a Global administrator or Security administrator account. Then open the **Azure Active Directory** service.
1. Select **External Identities**, and then select **Cross-tenant access settings (preview)**.
1. Select **Organizational settings**.
1. Select **Add organization**.
1. On the **Add organization** pane, type the full domain name (or tenant ID) for the organization.

   ![Screenshot showing adding an organization](media/cross-tenant-access-settings-b2b-collaboration/cross-tenant-add-organization.png)

1. Select the organization in the search results, and then select **Add**.
1. The organization appears in the **Organizational settings** list. At this point, all access settings for this organization are inherited from your default settings. To change the settings for this organization, select the **Inherited from default** link under the **Inbound access** or **Outbound access** column.

   ![Screenshot showing an organization added with default settings](media/cross-tenant-access-settings-b2b-collaboration/org-specific-settings-inherited.png)


1. Allow the default B2B collaboration settings to remain in effect for this tenant, or modify the organization's settings by following the detailed steps in these sections:

   - [Modify inbound access settings](cross-tenant-access-settings-b2b-collaboration.md#modify-inbound-access-settings)
   - [Modify outbound access settings](cross-tenant-access-settings-b2b-collaboration.md#modify-outbound-access-settings)

## Next steps

See [Configure external collaboration settings](external-collaboration-settings-configure.md) for B2B collaboration with non-Azure AD identities, social identities, and non-IT managed external accounts.
