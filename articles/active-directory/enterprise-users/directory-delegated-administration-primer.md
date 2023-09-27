---
title: Delegated administration in Microsoft Entra ID
description: The relationship between older delegated admin permissions and new granular delegated admin permissions in Microsoft Entra ID
keywords:
author: barclayn
manager: amycolannino
ms.author: barclayn
ms.reviewer: yuank
ms.date: 03/13/2023
ms.topic: overview
ms.service: active-directory
ms.subservice: enterprise-users
ms.workload: identity
services: active-directory
ms.custom: "it-pro"

#Customer intent: As a new Microsoft Entra identity administrator, access management requires me to understand the permissions of partners who have access to our resources. 
ms.collection: M365-identity-device-management
---
# What is delegated administration?

Managing permissions for external partners is a key part of your security posture. We’ve added capabilities to the administrator portal experience in Microsoft Entra ID, part of Microsoft Entra, so that an administrator can see the relationships that their Microsoft Entra tenant has with Microsoft Cloud Service Providers (CSP) who can manage the tenant. This permissions model is called delegated administration. This article introduces the Microsoft Entra administrator to the relationship between the old Delegated Admin Permissions (DAP) permission model and the new Granular Delegated Admin Permissions (GDAP) permission model.

## Delegated administration relationships

Delegated administration relationships enable technicians at a Microsoft CSP to administer Microsoft services such as Microsoft 365, Dynamics 365, and Azure on behalf of your organization. These technicians administer these services for you using the same roles and permissions as your organization's own administrators. These roles are assigned to security groups in the CSP’s Microsoft Entra tenant, which is why CSP technicians don’t need user accounts in your tenant in order to administer services for you.

There are two types of delegated administration relationships that are visible in the Azure portal experience. The newer type of delegated admin relationship is known as Granular Delegated Admin Permission. The older type of relationship is known as Delegated Admin Permission. You can see both types of relationship if you sign in to the Azure portal and then select **Delegated administration**.

## Granular delegated admin permission

When a Microsoft CSP creates a GDAP relationship request for your tenant a global administrator needs to approve the request. The GDAP relationship request specifies:

* The CSP partner tenant
* The roles that the partner needs to delegate to their technicians
* The expiration date

If you have GDAP relationships in your tenant, you will see a notification banner on the **Delegated Administration** page in the Microsoft Entra admin portal. Select the notification banner to see and manage GDAP relationships in the **Partners** page in Microsoft Admin Center.

## Delegated admin permission

All DAP relationships enable the CSP to delegate Global administrator and Helpdesk administrator roles to their technicians. Unlike a GDAP relationship, a DAP relationship persists until they are revoked either by you or by your CSP.

If you have any DAP relationships in your tenant, you will see them in the list on the Delegated Administration page in the Azure portal. To remove a DAP relationship for a CSP, follow the link to the Partners page in the Microsoft Admin Center.

## Next steps

If you're a beginning Microsoft Entra administrator, get the basics down in [Microsoft Entra Fundamentals](../fundamentals/index.yml).

- [Delegated administration privileges (DAP) FAQ](/partner-center/dap-faq)
- [Granular delegated admin privileges (GDAP) introduction](/partner-center/gdap-introduction)
