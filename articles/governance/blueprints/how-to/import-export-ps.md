---
title: Import and export blueprints with PowerShell
description: Learn how to work with your blueprint definitions as code. Share, source control, and manage them using the export and import commands.
ms.date: 05/06/2020
ms.topic: how-to
---
# Import and export blueprint definitions with PowerShell

Azure Blueprints can be fully managed through Azure portal. As organizations advance in their use of
Azure Blueprints, they should start thinking of blueprint definitions as managed code. This concept
is often referred to as Infrastructure as Code (IaC). Treating your blueprint definitions as code
offers additional advantages beyond what Azure portal offers. These benefits include:

- Sharing blueprint definitions
- Backing up your blueprint definitions
- Reusing blueprint definitions in different tenants or subscriptions
- Placing the blueprint definitions in source control
  - Automated testing of blueprint definitions in test environments
  - Support of continuous integration and continuous deployment (CI/CD) pipelines

Whatever your reasons, managing your blueprint definitions as code has benefits. This article shows
how to use the `Import-AzBlueprintWithArtifact` and `Export-AzBlueprintWithArtifact` commands in the
[Az.Blueprint](https://powershellgallery.com/packages/Az.Blueprint/) module.

## Prerequisites

This article assumes a moderate working knowledge of Azure Blueprints. If you haven't done so yet,
work through the following articles:

- [Create a blueprint in the portal](../create-blueprint-portal.md)
- Read about [deployment stages](../concepts/deployment-stages.md) and
  [the blueprint lifecycle](../concepts/lifecycle.md)
- [Creating](../create-blueprint-powershell.md) and [managing](./manage-assignments-ps.md) blueprint
  definitions and assignments with PowerShell

If it isn't already installed, follow the instructions in
[Add the Az.Blueprint module](./manage-assignments-ps.md#add-the-azblueprint-module) to install and
validate the **Az.Blueprint** module from the PowerShell Gallery.

## Folder structure of a blueprint definition

Before looking at exporting and importing blueprints, let's look at how the files that make up the
blueprint definition are structured. A blueprint definition should be stored in its own folder.

> [!IMPORTANT]
> If no value is passed to the **Name** parameter of the `Import-AzBlueprintWithArtifact` cmdlet,
> the name of the folder the blueprint definition is stored in is used.

Along with the blueprint definition, which must be named `blueprint.json`, are the artifacts that
the blueprint definition is composed of. Each artifact must be in the subfolder named `artifacts`.
Put together, the structure of your blueprint definition as JSON files in folders should look as
follows:

```text
.
|
|- MyBlueprint/  _______________ # Root folder name becomes default name of blueprint definition
|  |- blueprint.json  __________ # The blueprint definition. Fixed name.
|
|  |- artifacts/  ______________ # Subfolder for all blueprint artifacts. Fixed name.
|     |- artifact.json  ________ # Blueprint artifact as JSON file. Artifact named from file.
|     |- ...
|     |- more-artifacts.json

```

## Export your blueprint definition

The steps to exporting your blueprint definition are straightforward. Exporting the blueprint
definition can be useful for sharing, backup, or placing into source control.

- **Blueprint** [required]
  - Specifies the blueprint definition
  - Use `Get-AzBlueprint` to get the reference object
- **OutputPath** [required]
  - Specifies the path to save the blueprint definition JSON files to
  - The output files are in a subfolder with the name of the blueprint definition
- **Version** (optional)
  - Specifies the version to output if the **Blueprint** reference object contains references to
    more than one version.

1. Get a reference to the blueprint definition to export from the subscription represented as
   `{subId}`:

   ```azurepowershell-interactive
   # Login first with Connect-AzAccount if not using Cloud Shell

   # Get version '1.1' of the blueprint definition in the specified subscription
   $bpDefinition = Get-AzBlueprint -SubscriptionId '{subId}' -Name 'MyBlueprint' -Version '1.1'
   ```

1. Use the `Export-AzBlueprintWithArtifact` cmdlet to export the specified blueprint definition:

   ```azurepowershell-interactive
   Export-AzBlueprintWithArtifact -Blueprint $bpDefinition -OutputPath 'C:\Blueprints'
   ```

## Import your blueprint definition

Once you have either an [exported blueprint definition](#export-your-blueprint-definition) or have a
manually created blueprint definition in the
[required folder structure](#folder-structure-of-a-blueprint-definition), you can import that
blueprint definition to a different management group or subscription.

For examples of built-in blueprint definitions, see the
[Azure Blueprint GitHub repo](https://github.com/Azure/azure-blueprints/tree/master/samples/001-builtins).

- **Name** [required]
  - Specifies the name for the new blueprint definition
- **InputPath** [required]
  - Specifies the path to create the blueprint definition from
  - Must match the [required folder structure](#folder-structure-of-a-blueprint-definition)
- **ManagementGroupId** (optional)
  - The management group ID to save the blueprint definition to if not the current context default
  - Either **ManagementGroupId** or **SubscriptionId** must be specified
- **SubscriptionId** (optional)
  - The subscription ID to save the blueprint definition to if not the current context default
  - Either **ManagementGroupId** or **SubscriptionId** must be specified

1. Use the `Import-AzBlueprintWithArtifact` cmdlet to import the specified blueprint definition:

   ```azurepowershell-interactive
   # Login first with Connect-AzAccount if not using Cloud Shell

   Import-AzBlueprintWithArtifact -Name 'MyBlueprint' -ManagementGroupId 'DevMG' -InputPath 'C:\Blueprints\MyBlueprint'
   ```

Once the blueprint definition is imported,
[assign it with PowerShell](./manage-assignments-ps.md#create-blueprint-assignments).

For information about creating advanced blueprint definitions, see the following articles:

- Use [static and dynamic parameters](../concepts/parameters.md).
- Customize the [blueprint sequencing order](../concepts/sequencing-order.md).
- Protect deployments with [blueprint resource locking](../concepts/resource-locking.md).
- [Manage Blueprints as Code](https://github.com/Azure/azure-blueprints/blob/master/README.md).

## Next steps

- Learn about the [blueprint lifecycle](../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../concepts/resource-locking.md).
- Resolve issues during the assignment of a blueprint with [general troubleshooting](../troubleshoot/general.md).