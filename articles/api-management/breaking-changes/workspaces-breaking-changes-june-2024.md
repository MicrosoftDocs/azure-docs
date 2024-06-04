---
title: Azure API Management workspaces - breaking changes (June 2024) | Microsoft Docs
description: Azure API Management is updating the workspaces (preview) with breaking changes. If your service uses workspaces, you may need to update workspace configurations.
services: api-management 
author: dlepow
ms.service: api-management
ms.topic: reference
ms.date: 05/08/2024
ms.author: danlep
---

# Workspaces - breaking changes (June 2024)

[!INCLUDE [api-management-availability-premium-dev-standard](../../../includes/api-management-availability-premium-dev-standard.md)]

After 14 June 2024, as part of our development of [workspaces](../workspaces-overview.md) (preview) in Azure API Management, we're introducing several breaking changes. 

After 14 June 2024, your workspaces and APIs managed in them may stop working if they still rely on the capabilities set to change. APIs and resources managed outside workspaces aren't affected by this change.

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

The breaking changes will be introduced after 14 June 2024. We strongly recommend that you make all required changes to the configuration of workspaces before that date.

## What do I need to do?

If your workspaces are affected by these changes, you need to update your workspace configurations to align with the new capabilities.

### Standard tier customers 

If you're using workspaces in the **Standard** tier, [upgrade](../upgrade-and-scale.md) to the **Premium** tier to continue using workspaces.

### Developer tier customers

The Developer tier was designed for single-user or single-team use cases. It's unable to facilitate multi-team collaboration with workspaces because of the limited computing resources, lack of SLA, and no infrastructure redundancy. If you're using workspaces preview in the **Developer** tier, you can choose one of the following options:

* **Aggregate in a Premium tier instance**

    While upgrading each Developer tier instance to Premium tier is an option, consider aggregating multiple nonproduction environments in a single Premium tier instance. Use workspaces in the Premium tier to isolate the different environments.

* **Use Developer tier instances for development, migrate to workspaces in Premium tier for production**

    You might use Developer tier instances for development environments. For higher environments, you can migrate the configuration of each Developer-tier service into a workspace of a Premium tier service, for example, using CI/CD pipelines. With this approach you may run into issues or conflicts when managing the configurations across environments. 

    If you're currently using workspaces in a Developer tier instance, you can migrate the workspace configurations to a Developer tier instance without workspaces:

    1. Export a Resource Manager template from your API Management instance. You can export the template from the [Azure portal](../../azure-resource-manager/templates/export-template-portal.md) or by using other tools.
    1. Remove the following substring of the resource ID values: `/workspaces/[^/]+`
    1. Deploy the template. For more information, see [Quickstart: Create and deploy ARM templates by using the Azure portal](../../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md).

    Depending on your use case, you may need to perform other configuration changes in your API Management instance.

### Assignment of workspace-level entities

If you assigned workspace-level entities to service-level entities in the workspaces preview, see the following table for migration guidance.

|Assignment no longer supported  |Recommended migration step  |
|---------|---------|
|Assign workspace APIs to service-level products    | Use workspace-level products        |
|Assign workspace APIs or products to service-level tags     | Use workspace-level tags        |

## Help and support

If you have questions, get answers from community experts in [Microsoft Q&A](https://aka.ms/apim/azureqa/change/captcha-2022). If you have a support plan and you need technical help, create a [support request](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview).

## More information

* [Workspaces overview](../workspaces-overview.md)

## Related content

See all [upcoming breaking changes and feature retirements](overview.md).
