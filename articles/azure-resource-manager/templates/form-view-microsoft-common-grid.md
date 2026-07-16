---
title: Grid UI element (Form view)
description: Describes the Microsoft.Common.Grid UI element for Form view authoring in Azure portal Create experiences.
ms.topic: reference
ms.date: 05/29/2026
---

# Microsoft.Common.Grid UI element

The `Grid` user-interface (UI) element displays a tabular collection of rows. Rows can be added or edited by opening blades that return row data.

## UI sample

The `Grid` element renders a table with command buttons for adding, editing, and deleting rows.

:::image type="content" source="./media/form-view-elements/microsoft-common-grid.png" alt-text="Screenshot of the Microsoft.Common.Grid UI element.":::

## Schema

```json
{
  "name": "subnets",
  "type": "Microsoft.Common.Grid",
  "label": {
    "summary": "Subnets",
    "addition": "Add subnet",
    "delete": "Delete subnet",
    "ariaLabel": "Subnets"
  },
  "defaultValue": [
    {
      "name": "default",
      "addressPrefix": "10.0.0.0/24"
    }
  ],
  "addBlade": {
    "name": "SubnetBlade",
    "extension": "Microsoft_Azure_Network",
    "parameters": {},
    "outputItem": "subnet",
    "inContextPane": true
  },
  "editBlade": {
    "name": "SubnetBlade",
    "extension": "Microsoft_Azure_Network",
    "parameters": {
      "subnet": "[$item]"
    },
    "outputItem": "subnet",
    "inContextPane": true
  },
  "constraints": {
    "rows": {
      "count": {
        "min": 1,
        "max": 5
      }
    },
    "canEditRows": true,
    "columns": [
      {
        "id": "name",
        "header": "Name",
        "cellType": "readonly",
        "text": "[$item.name]"
      },
      {
        "id": "addressPrefix",
        "header": "Address prefix",
        "cellType": "readonly",
        "text": "[$item.addressPrefix]"
      }
    ],
    "width": "Full"
  },
  "visible": true
}
```

## Sample output

```json
[
  {
    "name": "default",
    "addressPrefix": "10.0.0.0/24"
  }
]
```

## Remarks

- `label.summary` is used in summaries and accessibility text.
- `label.addition` and `label.delete` provide command labels.
- `defaultValue` is an array of row objects, or an expression that evaluates to an array.
- `addBlade` defines the blade opened to create a row. `name`, `parameters`, and `outputItem` are required.
- `editBlade` defines the blade opened to edit an existing row. It is required when `constraints.canEditRows` is `true`.
- `constraints.rows.count.min` and `constraints.rows.count.max` set row-count limits.
- `constraints.columns` defines the table columns. A `readonly` column uses `text`; an `input` column uses `element`.
- `constraints.width` can be `Small`, `Medium`, or `Full`.
- For public template-spec forms, use [`Microsoft.Common.EditableGrid`](../managed-applications/microsoft-common-editablegrid.md) unless your host supports the add and edit blades referenced by `Microsoft.Common.Grid`.

## Next steps

- [Form view elements](form-view-elements.md)
- [CreateUiDefinition functions](../managed-applications/create-uidefinition-functions.md)
