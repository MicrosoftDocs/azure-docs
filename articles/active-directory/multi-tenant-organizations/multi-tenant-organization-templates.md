---
title: Multi-tenant organization templates (Preview)
description: Learn about multi-tenant organization templates in Azure Active Directory.
services: active-directory
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: multi-tenant-organizations
ms.topic: conceptual
ms.date: 06/30/2023
ms.author: rolyon
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to
---

# Multi-tenant organization templates (Preview)

> [!IMPORTANT]
> Multi-tenant organization is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Admins staying in control of their resources is a guiding principle for multi-tenant organization collaboration. Cross-tenant access settings are required for each tenant-to-tenant relationship. Tenant admins will explicitly configure cross-tenant access partner configurations and identity synchronization settings for partner tenants inside the multi-tenant organization.

To ease the setup of homogenous cross-tenant access settings applied to partner tenants in the multi-tenant organization, the administrator of each tenant can configure optional cross-tenant access settings templates dedicated to the multi-tenant organization, which can be used to pre-configure cross-tenant access settings that will be applied to any partner tenant newly joining the multi-tenant organization.

## Auto-generation of cross-tenant access settings

Within a multi-tenant organization, each pair of tenants must have bi-directional [cross-tenant access settings](../external-identities/cross-tenant-access-settings-b2b-collaboration.md), for both, partner configuration and identity synchronization. These settings provide the underlying policy framework for enabling trust and for sharing users and applications.

When your tenant joins a new multi-tenant organization, or when a partner tenant joins your existing multi-tenant organization, cross-tenant access settings to such other partner tenants in the enlarged multi-tenant organization will, if they do not already exist, be automatically generated in an unconfigured state. In an unconfigured state, these cross-tenant access settings will simply pass through the [default settings](../external-identities/cross-tenant-access-settings-b2b-collaboration.md#configure-default-settings).

Default cross-tenant access settings apply to all external tenants for which you haven't created organization-specific customized settings. Typically, these settings are configured to be non-trusting. For example, cross-tenant trusts for multi-factor authentication and compliant device claims might be disabled and user and group sharing in B2B direct connect or B2B collaboration might be disallowed.

In multi-tenant organizations, on the other hand, cross-tenant access settings are typically expected to be trusting. For example, cross-tenant trusts for multi-factor authentication and compliant device claims might be enabled and user and group sharing in B2B direct connect or B2B collaboration might be allowed.

While the auto-generation of cross-tenant access settings for multi-tenant organization partner tenants in and of itself does not change any authentication or authorization policy behavior, it allows your organization to easily customize the cross-tenant access settings for partner tenants in the multi-tenant organization on a per-tenant basis.

## Policy templates at multi-tenant org formation

As explained above, in multi-tenant organizations, cross-tenant access settings are typically expected to be trusting. For example, cross-tenant trusts for multi-factor authentication and compliant device claims might be desired to be enabled and user and group sharing in B2B direct connect or B2B collaboration might be desired to be allowed.

While auto-generation of cross-tenant access settings, per previous section, guarantees the existance of cross-tenant access settings for every multi-tenant organization partner tenant, further maintenance of the cross-tenant access settings for multi-tenant organization partner tenants is conducted individually, on a per-tenant basis.

To reduce the workload for admins at the time of multi-tenant organization formation, we introduce the optional use of policy templates for pre-emptive configuration of cross-tenant access settings. These template settings may be applied at the time of your tenant joining a multi-tenant organization to all external multi-tenant organization partner tenants as well as at the time of any partner tenant joining your existing multi-tenant organization to such new partner tenant.

[Enablement or configuration of the optional policy templates](multi-tenant-organization-configure-templates.md) will, at the time of a partner tenant joining a multi-tenant organization, pre-emptively amend the corresponding [cross-tenant access settings](../external-identities/cross-tenant-access-settings-b2b-collaboration.md), for both, partner configuration and identity synchronization.

As an example, let us illustrate the actions of the admins for an anticipated multi-tenant organization of three tenants, A, B, and C:

- The admins of all three tenants enable and configure their respective optional policy templates to enable cross-tenant trusts for multi-factor authentication and compliant device claims and to allow user and group sharing in B2B direct connect and B2B collaboration.
- Admin A creates the multi-tenant organization and adds tenants B and C as pending tenants to the multi-tenant organization.
- Admin B joins the multi-tenant organization. Cross-tenant access settings in tenant A for partner tenant B are amended, according to tenant A’s policy template settings. Vice versa, cross-tenant access settings in tenant B for partner tenant A are amended, according to tenant B’s policy template settings.
- Admin C joins the multi-tenant organization. Cross-tenant access settings in tenants A (and B) for partner tenant C are amended, according to tenant A’s (and B’s) policy template settings. Similarly, cross-tenant access settings in tenant C for partner tenants A and B are amended, according to tenant C’s policy template settings.
- Following the formation of this multi-tenant organization of three tenants, the cross-tenant access settings of all tenant pairs in the multi-tenant organization have pre-emptively been configured.

In summary, enablement or configuration of the optional policy templates will allow you to homogeneously initialize cross-tenant access settings across your multi-tenant organization, while maintaining maximum flexibility to customize your cross-tenant access settings as needed on a per-tenant basis.

To stop using the policy templates, they may be reset to their default state. For more details, see [Configure multi-tenant organization templates](multi-tenant-organization-configure-templates.md).

## Policy template scoping and additional properties

To provide admins with further configurability as to when cross-tenant access settings are to be amended according to the policy templates, you can choose to apply the policy templates, at the time of joining of a multi-tenant organization, to the cross-tenant access settings of

- only new partner tenants, those tenants whose cross-tenant access settings are auto-generated,
- only existing partner tenants, those tenants who already have cross-tenant access settings,
- all partner tenants, that is both, new partner tenants and existing partner tenants, and 
- no partners, that is the policy templates are effectively disabled.

In this context, "new" partners refer to tenants for which you have not yet configured cross-tenant access settings, while "existing" partners refer to tenants for which you have already configured cross-tenant access settings. This scoping is handled by the &lt;templateApplicationLevel&gt; property on the cross-tenant access [partner configuration template](/graph/api/resources/multitenantorganizationpartnerconfigurationtemplate?branch=pr-en-us-21123) and the &lt;templateApplicationLevel&gt; property on the cross-tenant access [identity synchronization template](/graph/api/resources/multitenantorganizationidentitysyncpolicytemplate?branch=pr-en-us-21123).

Finally, in terms of interpretation of template property values, any template property value of &lt;null&gt; will have no effect on the corresponding property value in the targeted cross-tenant access settings, while a defined template property value will cause the corresponding property value in the targeted cross-tenant access settings to be amended in accordance with the template. The following table illustrates how template property values are being applied to corresponding cross-tenant access setting values.

| Template Value | Initial Partner Settings Value<br/>(pre-joining of multi-tenant org) | Final Partner Settings Value<br/>(post-joining of multi-tenant org) |
| --- | --- | --- |
| &lt;Null&gt; | &lt;Partner Settings Value&gt; | &lt;Partner Settings Value&gt; |
| &lt;Template Value&gt; | &lt;any value&gt; | &lt;Template Value&gt; |

## Policy templates used by Microsoft 365 admin center

When a multi-tenant organization is formed in Microsoft 365 admin center, see [Join or leave a multi-tenant organization in Microsoft 365](/microsoft-365/enterprise/join-leave-multi-tenant-org?branch=mikeplum-mto), an admin agrees to the following:

- The multi-tenant organization template for identity synchronization is set to allow users to sync into this tenant.
- The multi-tenant org template for cross-tenant access will be set to automatically redeem user invitations, inbound as well as outbound.

This is achieved by setting the corresponding three template property values

- &lt;automaticUserConsentSettings.inboundAllowe&gt;,
- &lt;automaticUserConsentSettings.outboundAllowed&gt;, and
- &lt;userSyncInbound&gt;

to &lt;true&gt;.

## Cross-tenant access settings at time of multi-tenant org disassembly

Currently, there is no equivalent policy template feature supporting the disassembly of a multi-tenant organization. When a partner tenant leaves the multi-tenant organization, each tenant admin shall re-examine and amend accordingly the cross-tenant access settings for the partner tenant that left the multi-tenant organization.

The partner tenant that left the multi-tenant organization shall re-examine and amend accordingly the cross-tenant access settings for all former multi-tenant organization partner tenants as well as consider resetting the two policy templates for cross-tenant access settings.

## Next steps

- [Configure multi-tenant organization templates using the Microsoft Graph API (Preview)](./multi-tenant-organization-configure-templates.md)
