---
title: ManagementGroupSelector UI element (Form view)
description: Describes the Microsoft.Common.ManagementGroupSelector UI element for Form view authoring in Azure portal Create experiences.
ms.topic: reference
ms.date: 05/29/2026
---

# Microsoft.Common.ManagementGroupSelector UI element

The `ManagementGroupSelector` user-interface (UI) element lets users select a management group. Use it for management-group-scope deployments.

## UI sample

The `ManagementGroupSelector` element renders a management-group picker.

:::image type="content" source="./media/form-view-elements/microsoft-common-managementgroupselector.png" alt-text="Screenshot of the Microsoft.Common.ManagementGroupSelector UI element.":::

## Schema

```json
{
  "name": "managementGroup",
  "type": "Microsoft.Common.ManagementGroupSelector",
  "constraints": [
    {
      "isValid": "[not(empty(steps('basics').managementGroup.managementGroupId))]",
      "message": "Select a management group."
    }
  ],
  "visible": true
}
```

## Sample output

```json
{
  "displayName": "Contoso management group",
  "managementGroupId": "contoso-mg"
}
```

## Remarks

- The selected value includes `displayName` and `managementGroupId`.
- For a management-group-scope deployment, set `view.outputs.kind` to `ManagementGroup` and reference the selected management group with `[steps('basics').managementGroup.managementGroupId]`.
- `constraints` is an optional array of custom validation rules. Each rule has an `isValid` expression and a `message`.

## Next steps

- [Form view elements](form-view-elements.md)
- [Create portal forms for template specs](template-specs-create-portal-forms.md)
