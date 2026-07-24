---
title: ResourceGroupSelector UI element (Form view)
description: Describes the Microsoft.Common.ResourceGroupSelector UI element for Form view authoring in Azure portal Create experiences.
ms.topic: reference
ms.date: 05/29/2026
---

# Microsoft.Common.ResourceGroupSelector UI element

The `ResourceGroupSelector` user-interface (UI) element lets users select an existing resource group or create a new one. It's the standalone resource-group picker used when a form doesn't use the composite [`Microsoft.Common.ResourceScope`](form-view-microsoft-common-resourcescope.md) element.

## UI sample

The `ResourceGroupSelector` element renders a resource-group dropdown with existing and new resource-group modes.

:::image type="content" source="./media/form-view-elements/microsoft-common-resourcegroupselector.png" alt-text="Screenshot of the Microsoft.Common.ResourceGroupSelector UI element.":::

## Schema

```json
{
  "name": "resourceGroup",
  "type": "Microsoft.Common.ResourceGroupSelector",
  "allowedMode": "Both",
  "scope": {
    "subscriptionId": "[steps('basics').subscription.subscriptionId]"
  },
  "constraints": {
    "validations": [
      {
        "isValid": "[not(empty(steps('basics').resourceGroup.value.name))]",
        "message": "Select or create a resource group."
      }
    ]
  },
  "visible": true
}
```

## Sample output

```json
{
  "mode": "New",
  "value": {
    "name": "example-rg",
    "location": "westus2",
    "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/example-rg"
  }
}
```

## Remarks

- `scope.subscriptionId` is required and should reference the selected subscription.
- `allowedMode` controls whether users can create a resource group, use an existing resource group, or both. Valid values are `Both`, `CreateNew`, and `UseExisting`.
- Reference the resource group ID with `[steps('basics').resourceGroup.value.resourceId]`.
- Reference the resource group name with `[steps('basics').resourceGroup.value.name]`.
- Reference the selection mode with `[steps('basics').resourceGroup.mode]`.
- If the resource group can be new, pair this element with [`Microsoft.Common.LocationSelector`](form-view-microsoft-common-locationselector.md) and use that location when `mode` is `New`.

## Next steps

- [Form view elements](form-view-elements.md)
- [Create portal forms for template specs](template-specs-create-portal-forms.md)
