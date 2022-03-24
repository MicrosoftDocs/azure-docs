---
title: Delegated administration in Azure Active Directory
description: The relationship between older delegated admin permissions and new granular delegated admin permissions in Azure Active Directory
keywords:
author: curtand
manager: karenhoran
ms.author: curtand
ms.reviewer: yuank
ms.date: 03/24/2022
ms.topic: overview
ms.service: active-directory
ms.subservice: enterprise-users
ms.workload: identity
services: active-directory
ms.custom: "it-pro"

#Customer intent: As a new Azure AD identity administrator, access management requires me to understand the permissions of partners who have access to our resources. 
ms.collection: M365-identity-device-management
---
# What is delegated administration?

This article introduces the Azure AD administrator to the relationship between top [identity management](../fundamentals/active-directory-whatis.md?context=azure%2factive-directory%2fusers-groups-roles%2fcontext%2fugr-context) tasks for users in terms of their groups, licenses, deployed enterprise apps, and administrator roles. As your organization grows, you can use Azure AD groups and administrator roles to:
Managing permissions for external partners is a key part of your security posture. We’re adding capabilities to the Azure Active Directory (Azure AD) admin portal experience that an administrator can use to see the relationships that their Azure AD tenant has with Microsoft Cloud Service Providers (CSP) who can manage their tenant. This permissions model is called delegated administration.

## Delegated administration relationships

Delegated administration relationships enable technicians at a Microsoft Cloud Service Provider (CSP) to administer Microsoft services such as Microsoft 365, Dynamics, 365, and Azure on behalf of your organization. CSP technicians administer these services for you using the same roles and permissions as administrators in your organization. These roles are assigned to security groups in the CSP’s Azure AD tenant, so that CSP technicians don’t need user accounts in your tenant in order to administer services for you.

There are two types of delegated administration relationships that are visible in the Azure AD admin portal experience. The newer type of delegated admin relationship is defined by Granular Delegated Admin Permissions (GDAP). The older type is based on Delegated Admin Permissions (DAP). You can see both types of relationship if you sign in to the Azure AD admin portal and select **Delegated administration**.

## Granular Delegated Admin Permission (‘GDAP’)

A GDAP relationship is created in your tenant when a global administrator approves a GDAP relationship request that was created for your tenant by a Microsoft CSP. The GDAP relationship request specifies the CSP partner (tenant), the roles that the partner needs to delegate to their technicians, and the expiration date. 
If you have any GDAP relationships in your tenant, you will see a notification banner on the Delegated Administration page in the Azure AD admin portal. Click the notification banner to see and manage GDAP relationships in the ‘Partners’ page in Microsoft Admin Center.

## Delegated Admin Permission (‘DAP’)

A GDAP relationship is created in your tenant when a global administrator approves a DAP relationship request that was created for your tenant by a Microsoft CSP. All DAP relationships enable the CSP to delegate Global administrator and Helpdesk administrator roles to their technicians. Unlike a GDAP relationship, a DAP relationship persists until they are revoked either by you or by your CSP.
If you have any DAP relationships in your tenant, you will see them in the list on the Delegated Administration page in the Azure AD admin portal. To remove a DAP relationship for a CSP, follow the link to the Partners page in the Microsoft Admin Center.

## Next steps

If you're a beginning Azure AD administrator, get the basics down in [Azure Active Directory Fundamentals](../fundamentals/index.yml).

Or you can start [creating groups](../fundamentals/active-directory-groups-create-azure-portal.md?context=azure%2factive-directory%2fusers-groups-roles%2fcontext%2fugr-context), [assigning licenses](../fundamentals/license-users-groups.md?context=azure%2factive-directory%2fusers-groups-roles%2fcontext%2fugr-context), [assigning app access](../manage-apps/assign-user-or-group-access-portal.md?context=azure%2factive-directory%2fusers-groups-roles%2fcontext%2fugr-context) or [assigning administrator roles](../roles/permissions-reference.md).
