---
title: Best practices for Azure RBAC
description: Best practices for using Azure role-based access control (Azure RBAC).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
ms.service: role-based-access-control
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/17/2020
ms.author: rolyon
ms.reviewer: bagovind

#Customer intent: As a dev, devops, or it admin, I want to learn how to best use Azure RBAC.
---

# Best practices for Azure RBAC

This article describes some best practices for using Azure role-based access control (Azure RBAC). These best practices are derived from our experience with Azure RBAC and the experiences of customers like yourself.

## Only grant the access users need

Using Azure RBAC, you can segregate duties within your team and grant only the amount of access to users that they need to perform their jobs. Instead of giving everybody unrestricted permissions in your Azure subscription or resources, you can allow only certain actions at a particular scope.

When planning your access control strategy, it's a best practice to grant users the least privilege to get their work done. The following diagram shows a suggested pattern for using RBAC.

![RBAC and least privilege](./media/overview/rbac-least-privilege.png)

## Next steps
