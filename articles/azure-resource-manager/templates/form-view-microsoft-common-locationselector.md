---
title: LocationSelector UI element (Form view)
description: Describes the Microsoft.Common.LocationSelector UI element for Form view authoring in Azure portal Create experiences.
ms.topic: reference
ms.date: 05/29/2026
---

# Microsoft.Common.LocationSelector UI element

The `LocationSelector` user-interface (UI) element lets users select an Azure region for a subscription. It's the standalone region picker used when a form doesn't use the composite [`Microsoft.Common.ResourceScope`](form-view-microsoft-common-resourcescope.md) element.

## UI sample

The `LocationSelector` element renders a region dropdown.

:::image type="content" source="./media/form-view-elements/microsoft-common-locationselector.png" alt-text="Screenshot of the Microsoft.Common.LocationSelector UI element.":::

## Schema

```json
{
  "name": "location",
  "type": "Microsoft.Common.LocationSelector",
  "label": "Region",
  "toolTip": "Select the Azure region for the resources.",
  "resourceTypes": [
    "Microsoft.Storage/storageAccounts"
  ],
  "allowedValues": [
    "eastus",
    "westus2"
  ],
  "scope": {
    "subscriptionId": "[steps('basics').subscription.subscriptionId]"
  },
  "visible": true
}
```

## Sample output

```json
{
  "name": "westus2",
  "displayName": "West US 2"
}
```

## Remarks

- `scope.subscriptionId` is required and should reference the selected subscription.
- `resourceTypes` filters regions to locations that support the listed resource types.
- `allowedValues` optionally limits the regions to an explicit list of location names. It can be an array or an expression that evaluates to an array.
- Reference the selected location name with an expression such as `[steps('basics').location.name]`.
- For a resource-group deployment, use the selected location in `view.outputs.location` when the resource group is new or when the template needs an explicit deployment location.

## Next steps

- [Form view elements](form-view-elements.md)
- [Create portal forms for template specs](template-specs-create-portal-forms.md)
