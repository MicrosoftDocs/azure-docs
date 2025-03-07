---
title: Prepare for Azure classic administrator roles retirement
description: Learn about the retirement of Azure classic administrator roles and how to transition them to Azure role-based access control (RBAC) roles.
author: bandersmsft
ms.reviewer: presharm
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 01/22/2025
ms.author: banders
---

# Prepare for Azure classic administrator roles retirement

Azure classic administrator roles retired on August 31, 2024.

If your organization has any active Co-Administrator or Service Administrator roles, you need to transition them to Azure role-based access control (RBAC) roles by then. [Azure Service manager and all Azure classic resources](https://azure.microsoft.com/updates/cloud-services-retirement-announcement/) also retire on that date.

## Required action

To avoid potential disruptions in service, transition any classic administrator roles that still need access to your subscription to Azure RBAC roles. For more information, see [Prepare for Co-Administrators retirement](https://aka.ms/ClassicAdmins).

After August 31, 2024:

- When you create an Azure subscription, the classic Service Administrator role isn't assigned to the subscription. Instead, the user creating the subscription is assigned the Azure RBAC [Owner](../../role-based-access-control/built-in-roles.md#owner) role.
- During the [Azure subscription Change Directory operation](/entra/fundamentals/how-subscriptions-associated-directory#associate-a-subscription-to-a-directory), the user isn't assigned the Service Administrator role. Instead, the user completing the Change Directory action is assigned the Azure RBAC [Owner](../../role-based-access-control/built-in-roles.md#owner) role.
- For situations that require changing or removing Service Administrators, ensure that the subscription has Azure RBAC owners assigned on it. If you're a subscription Azure RBAC owner, you can remove the current Service administrator using the information at [Service Administrator retirement](../../role-based-access-control/classic-administrators.md#service-administrator-retirement). If you aren't a subscription RBAC owner, ask your subscription Azure RBAC owner or a global administrator to update or remove the intended service administrator on the subscription. Or, you can ask them to give you an Azure RBAC role so that you can update or remove the Service Administrator.

## Help and support

If you have questions, you can ask community experts in [Microsoft Q & A](/answers/tags/189/azure-rbac). If you have a support plan and you need technical help, you can [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) in the Azure portal.

## Related content

- [Azure classic subscription administrators](../../role-based-access-control/classic-administrators.md)
- [Cloud Services (classic) deployment model retirement](https://azure.microsoft.com/updates/cloud-services-retirement-announcement/)
- [Azure built-in roles](../../role-based-access-control/built-in-roles.md)