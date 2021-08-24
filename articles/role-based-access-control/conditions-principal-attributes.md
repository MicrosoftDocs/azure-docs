---
title: Use Azure role assignment conditions and principal attributes to manage access (Preview) - Azure ABAC
description: Use Azure role assignment conditions and principal custom security attributes to manage access for Azure attribute-based access control (Azure ABAC).
services: active-directory
author: rolyon
ms.service: role-based-access-control
ms.subservice: conditions
ms.topic: conceptual
ms.workload: identity
ms.date: 09/15/2021
ms.author: rolyon

#Customer intent: As a dev, devops, or it admin, I want to 
---

# Use Azure role assignment conditions and principal attributes to manage access (Preview)

> [!IMPORTANT]
> Custom security attributes are currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Azure role-based access control (Azure RBAC) currently supports 2000 role assignments in a subscription. If you need to create role assignments for hundreds or even thousands of storage account containers, you can potentially encounter this limit. The following diagram shows an example this scenario:

![Diagram showing thousands for role assignments.](./media/conditions-principal-attributes/role-assignments-multiple.png)

An alternative approach is to create a smaller number of role assignments at a higher scope and then use Azure attribute-based access control (Azure ABAC) conditions to control access to the containers. The following diagram shows an example:

![Diagram showing one role assignment and a condition.](./media/conditions-principal-attributes/role-assignment-condition.png)

## Next steps