---
title: Security overview
description: Security information about Azure resource bridge.
ms.topic: conceptual
ms.date: 10/15/2021
---

<<<<<<< HEAD
# Azure Arc resource bridge security overview
=======
# Azure Arc-enabled servers security overview
>>>>>>> 0d213e99a396549b2bc91d9361303cb7644e5570

This article describes the security configuration and considerations you should evaluate before deploying Azure Arc resource bridge in your enterprise.

## Identity and access control

Azure Arc resource bridge has a managed identity as part of a resource group inside an Azure subscription. That identity represents the resource bridge running in your on-premises environment. Access to this resource is controlled by standard [Azure role-based access control](../../role-based-access-control/overview.md). From the [**Access Control (IAM)**](../../role-based-access-control/role-assignments-portal.md) page in the Azure portal, you can verify who has access to your Azure Arc-enabled server.

Users and applications granted [contributor](../../role-based-access-control/built-in-roles.md#contributor) or administrator role access to the resource can make changes to the resource, including deploying or deleting cluster extensions.

## Using a managed identity

By default, the Azure Active Directory system assigned identity used by Arc can only be used to update the status of the Azure Arc resource bridge in Azure. For example, the *last seen* heartbeat status.

## Using disk encryption


## Next steps


