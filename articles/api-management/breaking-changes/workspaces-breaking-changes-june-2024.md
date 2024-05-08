---
title: Azure API Management workspaces - breaking changes (June 2024) | Microsoft Docs
description: Azure API Management is updating the workspaces (preview) with breaking changes. If your service uses workspaces, you may need to update workspace configurations.
services: api-management 
author: dlepow
ms.service: api-management
ms.topic: reference
ms.date: 04/24/2024
ms.author: danlep
---

# Workspaces - breaking changes (June 2024)

[!INCLUDE [api-management-availability-premium-dev-standard](../../../includes/api-management-availability-premium-dev-standard.md)]

On 14 June 2024, as part of our development of [workspaces](../workspaces-overview.md) (preview) in Azure API Management, we're introducing several breaking changes. 

Your workspaces and APIs managed in them may stop working beyond 14 June 2024 if they still rely on the capabilities set to change. APIs and resources managed outside workspaces aren't affected by this change.

## Is my service affected by these changes?

Your service may be affected by these changes if you configured workspaces (preview) in your API Management instance. This feature was introduced in the **Premium**, **Standard**, and **Developer** tiers.

## Breaking changes

Review the following breaking changes to determine if you need to take action:

### Change to supported service tiers

The following service tiers will no longer support workspaces: **Standard** and **Developer**. Workspaces will be available in the **Premium** tier. 

For availability in the v2 tiers, see [Azure API Management v2 tiers](../v2-service-tiers-overview.md).

### Changes to support for assigning service-level entities in workspaces

The following assignments of workspace entities to service-level entities will no longer be supported:

* Assign workspace APIs to service-level products
* Assign workspace APIs to service-level tags
* Assign workspace products to service-level tags
* Assign service-level groups to workspace products for visibility controls

    > [!NOTE]
    > The built-in Guests and Developer groups will continue to be available in workspaces.

### Changes to supported context objects

The following `context` objects will no longer be supported in workspace policies or in the all-APIs policy on the service level:

* `context.Api.Workspace`
* `context.Product.Workspace`

The `context.Workspace` object can be used instead.


> [!NOTE]
> You can continue to reference users from the service level in the `context` object in workspace-level policies.

## What is the deadline for the change?

The breaking changes are effective 14 June 2024. We strongly recommend that you make all required changes to the configuration of workspaces before then.

## Help and support

If you have questions, get answers from community experts in [Microsoft Q&A](https://aka.ms/apim/azureqa/change/captcha-2022). If you have a support plan and you need technical help, create a [support request](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview).

## More information

* [Workspaces overview](../workspaces-overview.md)

## Related content

See all [upcoming breaking changes and feature retirements](overview.md).
