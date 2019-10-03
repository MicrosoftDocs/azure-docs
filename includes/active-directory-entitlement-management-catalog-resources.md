---
title: include file
description: include file
services: active-directory
author: ajburnle
ms.service: active-directory
ms.topic: include
ms.date: 10/02/2019
ms.author: msaburnley
ms.custom: include file
---

To include resources in an access package, the resources must exist in a catalog. The types of resources you can add are groups, applications, and SharePoint Online sites. The groups can be cloud-created Office 365 groups or cloud-created Azure AD security groups. The applications can be Azure AD enterprise applications, including both SaaS applications and your own applications federated to Azure AD. The sites can be SharePoint Online sites or SharePoint Online site collections.

**Prerequisite role:** See [Required roles to add resources to a catalog](../articles/active-directory/governance/entitlement-management-roles.md#required-roles-to-add-resources-to-a-catalog)

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Catalogs** and then open the catalog you want to add resources to.

1. In the left menu, click **Resources**.

1. Click **Add resources**.

1. Click a resource type: **Groups**, **Applications**, or **SharePoint sites**.

    If you don't see a resource that you want to add or you are unable to add a resource, make sure you have the required Azure AD directory role and entitlement management role. You might need to have someone with the required roles add the resource to your catalog. For more information, see [Required roles to add resources to a catalog](../articles/active-directory/governance/entitlement-management-roles.md#required-roles-to-add-resources-to-a-catalog).

1. Select one or more resources of the type that you would like to add to the catalog.

1. When finished, click **Add**.

    These resources can now be included in access packages within the catalog.
