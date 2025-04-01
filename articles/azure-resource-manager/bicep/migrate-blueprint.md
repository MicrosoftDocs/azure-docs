---
title: Migrate blueprints to deployment stacks
description: Learn how to migrate blueprints to deployment stacks.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 11/11/2024
---

# Migrate blueprints to deployment stacks

This article explains how to convert your Blueprint definitions and assignments into deployment stacks. Deployment stacks are new tools within the `Microsoft.Resources` namespace, bringing Azure Blueprint features into this area.

## Migration steps

1. Export the blueprint definitions into the blueprint definition JSON files which include the artifacts of Azure policies, Azure role assignments, and templates. For more information, see [Export your blueprint definition](../../governance/blueprints/how-to/import-export-ps.md#export-your-blueprint-definition).
2. Convert the blueprint definition JSON files into a single ARM template or Bicep file to be deployed via deployment stacks with the following considerations:

    - **Role assignments**: Convert any [role assignments](/azure/templates/microsoft.authorization/roleassignments).
    - **Policies**: Convert any [policy assignments](/azure/templates/microsoft.authorization/policyassignments) into the Bicep (or ARM JSON template) syntax, and then add them to your main template. You can also embed the [`policyDefinitions`](/azure/templates/microsoft.authorization/policydefinitions) into the JSON template.
    - **Templates**: Convert any templates into a main template for submission to a deployment stack. You can use [modules](./modules.md) in Bicep, embed templates as nested templates or template links, and optionally use [template specs](./template-specs.md) to store your templates in Azure. Template Specs aren't required to use deployment stacks.
    - **Locks**: Deployment stack [DenySettingsMode](./deployment-stacks.md#protect-managed-resources) gives you the ability to block unwanted changes via `DenySettingsMode` (similar to [Blueprint locks](../../governance/blueprints/concepts/resource-locking.md)). You can configure these via Azure CLI or Azure PowerShell. In order to do this, you need corresponding roles to be able to set deny settings. For more information, see [Deployment stacks](./deployment-stacks.md).

3. You can optionally create template specs for the converted ARM templates or Bicep files. Template specs allow you to store templates and their versions in your Azure environment, simplifying the sharing of the templates across your organization. Deployment stacks enable you to deploy template spec definitions, or ARM templates/Bicep files, to a specified target scope.

## Sample

The following Bicep file is a sample migration file.

```bicep
targetScope = 'subscription'

param roleAssignmentName string = 'myTestRoleAssignment'
param roleDefinitionId string = guid(roleAssignmentName)
param principalId string = guid('myTestId')

param policyAssignmentName string = 'myTestPolicyAssignment'
param policyDefinitionID string = '/providers/Microsoft.Authorization/policyDefinitions/06a78e20-9358-41c9-923c-fb736d382a4d'

param rgName string = 'myTestRg'
param rgLocation string = deployment().location
param templateSpecName string = 'myNetworkingTs'

// Step 1 - create role assignments
resource roleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(roleAssignmentName)
  properties: {
    principalId: principalId
    roleDefinitionId: roleDefinitionId
  }
}

// Step 2 - create policy assignments
resource policyAssignment 'Microsoft.Authorization/policyAssignments@2022-06-01' = {
    name: policyAssignmentName
    scope: subscriptionResourceId('Microsoft.Resources/resourceGroups', resourceGroup().name)
    properties: {
        policyDefinitionId: policyDefinitionID
    }
}

// Step 3 - create template artifacts via modules (or template specs)
resource rg1 'Microsoft.Resources/resourceGroups@2021-01-01' = {
  name: rgName
  location: rgLocation
}

module vnet 'templates/bicep/vnet.bicep' = if (rgName == 'myTestRg') {
  name: uniqueString(rgName)
  scope: rg1
  params: { location: rgLocation }
}
```
