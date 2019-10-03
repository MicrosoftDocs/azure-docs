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

A catalog is a container of resources and access packages. You create a catalog when you want to group related resources and access packages. Whoever creates the catalog becomes the first catalog owner. A catalog owner can add additional catalog owners.

**Prerequisite role:** Global administrator, User administrator, or Catalog creator

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Catalogs**.

    ![Entitlement management catalogs in the Azure portal](./media/active-directory-entitlement-management-catalog-create/catalogs.png)

1. Click **New catalog**.

1. Enter a unique name for the catalog and provide a description.

    Users will see this information in an access package's details.

1. If you want the access packages in this catalog to be available for users to request as soon as they are created, set **Enabled** to **Yes**.

1. If you want to allow users in selected external directories to be able to request access packages in this catalog, set **Enabled for external users** to **Yes**.

    ![New catalog pane](./media/active-directory-entitlement-management-catalog-create/new-catalog.png)

1. Click **Create** to create the catalog.
