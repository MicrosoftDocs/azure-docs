---
title: Overview of the delegatedManagedIdentityResourceId property
description: Describes the concept of the delegatedManagedIdentityResourceId property for Azure Managed Applications.
ms.topic: overview
ms.date: 02/10/2025
---

# What is the delegatedManagedIdentityResourceId property?

In Azure, the `delegatedManagedIdentityResourceId` property is used to properly assign roles to managed identities across different tenants. This assignment is useful when dealing with managed applications published in Azure Marketplace where the publisher and the customer exist in separate tenants.

## Why do we need it?

When a customer deploys a managed application from the marketplace, the publisher is responsible for managing resources within the managed resource group (MRG). However, any role assignments performed as part of the deployment template occur in the publisher's tenant. These assignments create a challenge when the managed identity is created in the customer's tenant, because role assignment fails if it tries to locate the identity in the wrong tenant.

The `delegatedManagedIdentityResourceId` property resolves this issue by explicitly specifying where the managed identity exists, ensuring that the role assignment process can correctly locate and assign permissions.

## How it works

### Managed identity creation

When you deploy a managed application, the managed identity is created in the customer's tenant.

### Role assignment

Role assignment deployment occurs under the publisher's tenant, role assignments naturally look for identities within that tenant.

### Using delegatedManagedIdentityResourceId

By specifying the correct resource ID:

- **For System Assigned Identities**: Use the resource ID of the resource that holds the identity. For example, a Function App or Logic App.
- **For User Assigned Identities**: Use the resource ID of the identity itself.

## How to apply delegatedManagedIdentityResourceId

To set up role assignment correctly, add the `delegatedManagedIdentityResourceId` property in the role assignment section of your Azure Resource Manager template (ARM template). Example:

```json
{
  "type": "Microsoft.Authorization/roleAssignments",
  "apiVersion": "2022-04-01",
  "properties": {
    "roleDefinitionId": "<role-definition-id>",
    "principalId": "<principal-id>",
    "delegatedManagedIdentityResourceId": "<resource-id-of-identity>"
  }
}
```

## Common errors and troubleshooting

### Role assignment failure due to missing identity

- Ensure that the correct resource ID is provided in `delegatedManagedIdentityResourceId`.
- Verify that the managed identity exists in the customer's tenant.

### Deny assignment prevents access

- The deny assignment prevents customers access to the MRG.
- Ensure the publisher's identity managing the MRG is correctly referenced in the customer's tenant.

### Misconfigured deployment context

- AMA deployments with published managed apps and publisher access enabled occur in the publisher's tenant.
- Ensure `delegatedManagedIdentityResourceId` is properly set to reference the customer's tenant identity.

### Role assignment PUT request only supported in a cross tenant

A role assignment PUT request with the `delegatedManagedIdentityResourceId` is only supported in cross-tenant scenarios and doesn't support deployments within the same tenant. To use it within the same tenant during testing, add a parameter to include the property as follows:

```json
{
  "comments": "Using cross-tenant delegatedManagedIdentityResourceId property",
  "type": "Microsoft.Authorization/roleAssignments",
  "apiVersion": "2021-04-01-preview",
  "name": "[guid(resourceGroup().id, variables('<identityName>'), variables('<roleDefinitionId>'))]",
  "dependsOn": [
    "[variables('<identityName>')]"
  ],
  "properties": {
    "roleDefinitionId": "[resourceId('Microsoft.Authorization/roleDefinitions',variables('<roleDefinitionId>'))]",
    "principalId": "[reference(variables('<identityName>')).principalId]",
    "principalType": "<PrincipalType>",
    "scope": "[resourceGroup().id]",
    "delegatedManagedIdentityResourceId": "[if(parameters('crossTenant'), resourceId('Microsoft.ManagedIdentity/userAssignedIdentities',variables('<identityName>')), json('null'))]"
  }
}
```

### Next steps

> [!div class="nextstepaction"]
> [Azure Managed Application with managed identity](publish-managed-identity.md)
