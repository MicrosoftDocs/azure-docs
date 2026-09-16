---
title: Azure classic administrator roles retirement
description: Learn about the retirement of Azure classic administrator roles and the transition to Azure role-based access control (RBAC) roles.
author: Nicholak-MS
ms.reviewer: mijeffer
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 05/06/2026
ms.author: mijeffer
ms.custom: sfi-ga-nochange
service.tree.id: b69a7832-2929-4f60-bf9d-c6784a865ed8
---

# Azure classic administrator roles retirement

[!INCLUDE [classic-administrators-retirement-note](../../role-based-access-control/includes/classic-administrators-retirement-note.md)]

[Azure Service Manager and all Azure classic resources](https://azure.microsoft.com/updates/cloud-services-retirement-announcement/) also retired on August 31, 2024.

## What changed

After August 31, 2024:

- When you create an Azure subscription, the classic Service Administrator role isn't assigned to the subscription. Instead, the user creating the subscription is assigned the Azure RBAC [Owner](../../role-based-access-control/built-in-roles.md#owner) role.
- During the [Azure subscription Change Directory operation](/entra/fundamentals/how-subscriptions-associated-directory#associate-a-subscription-to-a-directory), the user isn't assigned the Service Administrator role. Instead, the user completing the Change Directory action is assigned the Azure RBAC [Owner](../../role-based-access-control/built-in-roles.md#owner) role.
- Classic administrator role assignments were automatically converted to Azure RBAC Owner role assignments. For more information, see [Azure classic subscription administrators](../../role-based-access-control/classic-administrators.md).

## Help and support

If you have questions, you can ask community experts in [Microsoft Q & A](/answers/tags/189/azure-rbac). If you have a support plan and you need technical help, you can [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) in the Azure portal.

## Related content

- [Azure classic subscription administrators](../../role-based-access-control/classic-administrators.md)
- [Cloud Services (classic) deployment model retirement](https://azure.microsoft.com/updates/cloud-services-retirement-announcement/)
- [Azure built-in roles](../../role-based-access-control/built-in-roles.md)
