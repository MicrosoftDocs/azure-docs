---
title: ResourceScope UI element (Form view)
description: Describes the Microsoft.Common.ResourceScope UI element for Form view authoring in Azure portal Create experiences.
ms.topic: reference
ms.date: 06/02/2026
---

# Microsoft.Common.ResourceScope UI element

The `ResourceScope` user-interface (UI) element lets users select the subscription, resource group, and location for a deployment. Use it for the common resource-group deployment flow in a Form view.

`ResourceScope` is specific to Form view. In _createUiDefinition.json_, subscription, resource group, and location are provided by the implicit Basics step instead.

## UI sample

The `ResourceScope` element renders the project details fields for the deployment scope, including subscription, resource group, and region.

## Schema

```json
{
  "name": "resourceScope",
  "type": "Microsoft.Common.ResourceScope",
  "subscription": {
    "resourceProviders": [
      "Microsoft.KeyVault"
    ]
  },
  "resourceGroup": {
    "allowExisting": true
  },
  "resourceName": {
    "label": "Key vault name",
    "toolTip": "Enter a globally unique key vault name.",
    "constraints": {
      "validations": [
        {
          "regex": "^[a-zA-Z0-9-]{3,24}$",
          "message": "The name must be 3-24 characters long and contain only letters, numbers, and hyphens."
        }
      ]
    }
  },
  "location": {
    "label": "Region",
    "toolTip": "Select the Azure region for the resource.",
    "resourceTypes": [
      "Microsoft.KeyVault/vaults"
    ]
  }
}
```

## Sample output

```json
{
  "subscription": {
    "displayName": "Contoso subscription",
    "subscriptionId": "00000000-0000-0000-0000-000000000000",
    "tenantId": "11111111-1111-1111-1111-111111111111"
  },
  "resourceGroup": {
    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/example-rg",
    "name": "example-rg",
    "location": "westus2"
  },
  "location": {
    "name": "westus2",
    "displayName": "West US 2"
  },
  "resourceName": "example-vault"
}
```

## Remarks

- `subscription.resourceProviders` filters selectable subscriptions to subscriptions where the listed providers are available.
- `resourceGroup.allowExisting` controls whether users can select an existing resource group.
- `resourceName` adds a resource-name field to the scope picker. Use `resourceName.constraints.validations` to validate the name.
- `location.resourceTypes` filters regions to locations that support the listed resource types.
- Reference the selected resource group ID with `[steps('basics').resourceScope.resourceGroup.id]`.
- Reference the selected location name with `[steps('basics').resourceScope.location.name]`.
- Reference the resource name with `[steps('basics').resourceScope.resourceName]`.

For resource-group deployments, use the selected scope in `view.outputs`:

```json
"outputs": {
  "kind": "ResourceGroup",
  "resourceGroupId": "[steps('basics').resourceScope.resourceGroup.id]",
  "location": "[steps('basics').resourceScope.location.name]",
  "parameters": {
    "name": "[steps('basics').resourceScope.resourceName]",
    "location": "[steps('basics').resourceScope.location.name]"
  }
}
```

## Next steps

- [Form view elements](form-view-elements.md)
- [Create portal forms for template specs](template-specs-create-portal-forms.md)
