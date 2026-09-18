---
title: Migrate Azure Blueprints to template specs
description: Step-by-step instructions to migrate Azure Blueprints definitions and artifacts to template specs, and deploy them with Azure Deployment Stacks before the Blueprints retirement.
author: mumian
ms.author: jgao
ms.service: azure-blueprints
ms.topic: how-to
ms.date: 06/26/2026
---

# Migrate Azure Blueprints to template specs

Azure Blueprints (Preview) is retired on **January 31, 2027**. This article shows how to migrate
your blueprint definitions and artifacts into **template specs**, and how to deploy them with
**Azure Deployment Stacks** so you keep versioning and deny-assignment protection. For the full
phased timeline, see [Azure Blueprints retirement](./blueprint-retirement.md).

A **template spec** is a resource type (`Microsoft.Resources/templateSpecs`) that stores an ARM
template or Bicep file in your Azure environment so it can be versioned and shared across your
organization. Template specs replace the *artifact storage and versioning* role that blueprint
definitions provided. Deployment stacks replace the *assignment, lifecycle, and locking* role that
blueprint assignments provided.

## Prerequisites

- Azure CLI or Azure PowerShell.
- Permission to read your existing blueprint definitions and to create template specs and
  deployment stacks at your target scope (subscription or management group).
- Owner or User Access Administrator on the target scope if you need to configure deny settings.

## Migration steps

1. **Export your blueprint definitions.** Export each blueprint definition (including its artifacts — Azure Policy assignments, role assignments, and ARM templates) to JSON. For more information, see [Export your blueprint definition](./how-to/import-export-ps.md#export-your-blueprint-definition).

   Export everything you want to keep **before January 31, 2027**. After retirement, unexported definitions, versions, and assignments are deleted.

1. **Convert the exported artifacts into a single template.** Convert the exported JSON into a single ARM template or Bicep file. Map each blueprint artifact to its equivalent ARM resource:

   | Blueprint artifact | ARM/Bicep equivalent |
   |--------------------|----------------------|
   | Policy assignment | [`Microsoft.Authorization/policyAssignments`](/azure/templates/microsoft.authorization/policyassignments?pivots=deployment-language-bicep) |
   | Role assignment | [`Microsoft.Authorization/roleAssignments`](/azure/templates/microsoft.authorization/roleassignments?pivots=deployment-language-bicep) |
   | ARM template | A [module](../../azure-resource-manager/bicep/modules.md), nested template, or linked template |
   | Resource group | [`Microsoft.Resources/resourceGroups`](/azure/templates/microsoft.resources/resourcegroups?pivots=deployment-language-bicep) |

   Set the appropriate `targetScope` (for example, `subscription`) in your Bicep file to match the scope your blueprint assigned to.

1. **Publish the template as a template spec.** Create a template spec from your converted template. The template spec stores the template and a version in Azure. For more information, see [Azure Resource Manager template specs](../../azure-resource-manager/bicep/template-specs.md).

   Using Azure CLI:

   ```azurecli
   az ts create \
     --name blueprint-migration \
     --version 1.0.0 \
     --resource-group myResourceGroup \
     --location westus2 \
     --template-file ./main.bicep
   ```

   Using Azure PowerShell:

   ```azurepowershell
   New-AzTemplateSpec `
     -Name blueprint-migration `
     -Version 1.0.0 `
     -ResourceGroupName myResourceGroup `
     -Location westus2 `
     -TemplateFile ./main.bicep
   ```

1. **Deploy the template spec with a deployment stack.** Deploy the template spec through a deployment stack so you get lifecycle management and deny-assignment protection equivalent to blueprint locks. Reference the template spec by its resource ID. The `--deny-settings-mode` (`DenySettingsMode`) setting reproduces the **blueprint lock** behavior (`denyDelete` is similar to "Do Not Delete"; `denyWriteAndDelete` is similar to "Read Only"). For more information, see [Protect managed resources against deletion](../../azure-resource-manager/bicep/deployment-stacks.md#protect-managed-resources).

   Using Azure CLI:

   ```azurecli
   az stack sub create \
     --name blueprint-migration-stack \
     --location westus2 \
     --template-spec "/subscriptions/<subscriptionId>/resourceGroups/myResourceGroup/providers/Microsoft.Resources/templateSpecs/blueprint-migration/versions/1.0.0" \
     --deny-settings-mode denyDelete \
     --action-on-unmanage deleteResources
   ```

   Using Azure PowerShell:

   ```azurepowershell
   New-AzSubscriptionDeploymentStack `
     -Name blueprint-migration-stack `
     -Location westus2 `
     -TemplateSpecId "/subscriptions/<subscriptionId>/resourceGroups/myResourceGroup/providers/Microsoft.Resources/templateSpecs/blueprint-migration/versions/1.0.0" `
     -DenySettingsMode DenyDelete `
     -ActionOnUnmanage DeleteResources
   ```

1. **Verify and decommission the blueprint.**

   1. Confirm the deployment stack created the expected resources and that deny settings are applied.
   1. Confirm policy and role assignments are in place at the target scope.
   1. After you verify, remove the original blueprint assignment and definition (export first if you haven't already).

## When to use a Git repository instead

If your priority is source control and pull-request review rather than storing templates in Azure,
you can keep your converted Bicep files in a **Git repository** and deploy them with deployment
stacks directly from your pipeline. Template specs and Git repositories both provide versioning —
choose template specs to share templates *within Azure* and Git to manage them *as code*.

## Next steps

- [Azure Blueprints retirement](./blueprint-retirement.md)
- [Azure Blueprints retirement FAQ](./blueprint-retirement-faq.md)
- [Migrate blueprints to deployment stacks](../../azure-resource-manager/bicep/migrate-blueprint.md)
