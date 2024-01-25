---
title: Azure API Management workspaces - breaking changes (April 2024) | Microsoft Docs
description: Azure API Management is updating the workspaces (preview) with breaking changes. If your service uses workspaces, you may need to update workspace configurations.
services: api-management 
author: dlepow
ms.service: api-management
ms.topic: reference
ms.date: 01/24/2024
ms.author: danlep
---

# Workspaces - breaking changes (April 2024)

On 30 April 2024 as part of our development of [workspaces](../workspaces-overview.md) (preview) in Azure API Management, we're introducing several breaking changes. 

These changes will have no effect on the availability of your API Management service. However, you may have to take action to continue using full workspaces functionality beyond 30 April 2024.

## Is my service affected by these changes?

Your service may be affected by these changes if you configured workspaces (preview) in your API Management instance. This feature was introduced in the **Premium**, **Standard**, and **Developer** tiers.

## Breaking changes

Review the following breaking changes to determine if you need to take action:

### Change to supported service tiers

The following service tiers will no longer support workspaces: **Standard** and **Developer**. Workspaces will be available in the **Premium** tier.

### Changes to support for assigning service-level entities in workspaces

The following assignments of workspace entities to service-level entities will no longer be supported:

* Assign workspace APIs to service-level products
* Assign workspace APIs to service-level tags
* Assign workspace products to service-level tags


### Changes to support for referencing service-level resources from workspace-level policies

The following capabilities of workspace-level policies will no longer be supported:

* Reference service-level backends
* List service-level certificates with `context.Deployment.Certificates`. When used in a service-level policy, this method will return service-level certificates only.
* Reference named values, policy fragments, loggers, cache, schemas, and related policy resources from the service level

### Changes to supported context objects

The following `context` objects will no longer be supported in workspace policies or in the all-APIs policy on the service level:

* `context.Api.Workspace`
* `context.Product.Workspace`

The `context.Workspace` object can be used instead.


> [!NOTE]
> You can continue to reference users or subscriptions from the service level in the `context` object in workspace-level policies.

## What is the deadline for the change?

The breaking changes are effective 30 April 2024. We strongly recommend that you make all required changes to the configuration of workspaces before then.

## Help and support

If you have questions, get answers from community experts in [Microsoft Q&A](https://aka.ms/apim/azureqa/change/captcha-2022). If you have a support plan and you need technical help, create a [support request](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview).

## More information

* [Workspaces overview](../workspaces-overview.md)

## Related content

See all [upcoming breaking changes and feature retirements](overview.md).