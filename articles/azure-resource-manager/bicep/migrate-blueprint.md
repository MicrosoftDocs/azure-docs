---
title: Migrate blueprint to deployment stack
description: Learn how to migrate blueprint to deployment stack
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 10/24/2024
---

# Migrate blueprint to deployment stack

This document outlines the steps to re-author your Blueprint definitions and assignments as deployment stacks. Deplomyment stacks are new platform primitives within the `Microsoft.Resources` namespace, bringing Azure Blueprint capabilities into this space. Deployment stacks enable you to deploy ARM templates/Bicep files to a specified target scope.

## Migration steps

1. Export the blueprint definitions into the blueprint definition JSON files which include the artifacts of Azure policies, Azure role assignments, and templates. For more information see [Export your blueprint defintion](../../governance/blueprints/how-to/import-export-ps.md#export-your-blueprint-definition).
2. Convert the blueprint definitio JSON files into a single ARM template or Bicep file to be deployed via deployment stacks with the following considerations:

    - **Role assingments**: Convert any [role assignments](/azure/templates/microsoft.authorization/policyassignments).
    - **Policies**: Convert any [policy assignments](/azure/templates/microsoft.authorization/policyassignments) into the Bicep (or ARM JSON template) syntax, and then add them to your main template. You can also embedd the [`policyDefinitions`](/azure/templates/microsoft.authorization/policydefinitions) into the JSON template.
    - **Templates**: Convert any templates into a main template for submission to a deployment stack. You can use [modules](./modules.md) in Bicep, embed templates as nested templates or template links, and optionally use [template specs](./template-specs.md) to store your templates in Azure. Template Specs are not required to leverage deployment stacks.
    - **Locks**: Deployment stack [DenySettingsMode](./deployment-stacks.md#protect-managed-resources) gives you the ability to block unwanted changes via `DenySettingsMode` (similar to [Blueprint locks](../../governance/blueprints/concepts/resource-locking.md)). You can configure these via Azure CLI or Azure PowerShell. In order to leverage this, you need to corresponding roles to be able to set deny settings. For more information, see [Deployment stacks](./deployment-stacks.md).

## Sample

The folloing Bicep files is a sample migration file.

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
