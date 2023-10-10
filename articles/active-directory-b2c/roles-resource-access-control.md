---
title: Roles and resource access control
titleSuffix: Azure AD B2C
description: Learn how to use roles to control resource access.
services: active-directory-b2c
author: garrodonnell
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 02/24/2023
ms.author: godonnell
ms.subservice: B2C
---
# Roles and resource access control

When planning your access control strategy, it's best to assign users the least privileged role required to access resources. The following table describes the primary resources in your Azure AD B2C tenant and the most suitable administrative roles for the users who manage them.

|Resource  |Description  |Role  |
|---------|---------|---------|
|[Application registrations](tutorial-register-applications.md) | Create and manage all aspects of your web, mobile, and native application registrations within Azure AD B2C.|[Application Administrator](../active-directory/roles/permissions-reference.md#application-administrator)|
|Tenant Creator| Create new Microsoft Entra ID or Azure AD B2C tenants.| [Tenant Creator](../active-directory/roles/permissions-reference.md#tenant-creator)|
|[Identity providers](add-identity-provider.md)| Configure the [local identity provider](identity-provider-local.md) and external social or enterprise identity providers. | [External Identity Provider Administrator](../active-directory/roles/permissions-reference.md#external-identity-provider-administrator)|
|[API connectors](add-api-connector.md)| Integrate your user flows with web APIs to customize the user experience and integrate with external systems.|[External ID User Flow Administrator](../active-directory/roles/permissions-reference.md#external-id-user-flow-administrator)|
|[Company branding](customize-ui.md#configure-company-branding)| Customize your user flow pages.| [Global Administrator](../active-directory/roles/permissions-reference.md#global-administrator)|
|[User attributes](user-flow-custom-attributes.md)| Add or delete custom attributes available to all user flows.| [External ID User Flow Attribute Administrator](../active-directory/roles/permissions-reference.md#external-id-user-flow-attribute-administrator)|
|Manage users| Manage [consumer accounts](manage-users-portal.md) and administrative accounts as described in this article.| [User Administrator](../active-directory/roles/permissions-reference.md#user-administrator)|
|Roles and administrators| Manage role assignments in Azure AD B2C directory. Create and manage groups that can be assigned to Azure AD B2C roles. |[Global Administrator](../active-directory/roles/permissions-reference.md#global-administrator), [Privileged Role Administrator](../active-directory/roles/permissions-reference.md#privileged-role-administrator)|
|[User flows](user-flow-overview.md)|For quick configuration and enablement of common identity tasks, like sign-up, sign-in, and profile editing.| [External ID User Flow Administrator](../active-directory/roles/permissions-reference.md#external-id-user-flow-administrator)|
|[Custom policies](user-flow-overview.md)| Create, read, update, and delete all custom policies in Azure AD B2C.| [B2C IEF Policy Administrator](../active-directory/roles/permissions-reference.md#b2c-ief-policy-administrator)|
|[Policy keys](policy-keys-overview.md)|Add and manage encryption keys for signing and validating tokens, client secrets, certificates, and passwords used in custom policies.|[B2C IEF Keyset Administrator](../active-directory/roles/permissions-reference.md#b2c-ief-keyset-administrator)|
