---
title: EditableGrid UI element
description: Describes the Microsoft.Common.EditableGrid UI element for Azure portal. Enables users to gather tabular input.
ms.topic: conceptual
ms.date: 08/24/2020
---

# Microsoft.Common.EditableGrid UI element

A control for gathering tabular input. All fields within the grid are editable and the number of rows may vary.

## UI sample

:::image type="content" source="./media/managed-application-elements/microsoft-common-editablegrid.png" alt-text="Screenshot of Microsoft.Common.EditableGrid UI element with editable fields and varying rows.":::

## Schema

```json
{
  "name": "people",
  "type": "Microsoft.Common.EditableGrid",
  "ariaLabel": "Enter information per person",
  "label": "People",
  "constraints": {
    "width": "Full",
    "rows": {
      "count": {
        "min": 1,
        "max": 10
      }
    },
    "columns": [
      {
        "id": "colName",
        "header": "Name",
        "width": "1fr",
        "element": {
          "type": "Microsoft.Common.TextBox",
          "placeholder": "Full name",
          "constraints": {
            "required": true,
            "validations": [
              {
                "isValid": "[startsWith(last(take(steps('grid').people, $rowIndex)).colName, 'contoso')]",
                "message": "Must start with 'contoso'."
              },
              {
                "regex": "^[a-z0-9A-Z]{1,30}$",
                "message": "Only alphanumeric characters are allowed, and the value must be 1-30 characters long."
              }
            ]
          }
        }
      },
      {
        "id": "colGender",
        "header": "Gender",
        "width": "1fr",
        "element": {
          "name": "dropDown1",
          "type": "Microsoft.Common.DropDown",
          "placeholder": "Select a gender...",
          "constraints": {
            "allowedValues": [
              {
                "label": "Female",
                "value": "female"
              },
              {
                "label": "Male",
                "value": "male"
              },
              {
                "label": "Other",
                "value": "other"
              }
            ],
            "required": true
          }
        }
      },
      {
        "id": "colContactPreference",
        "header": "Contact preference",
        "width": "1fr",
        "element": {
          "type": "Microsoft.Common.OptionsGroup",
          "constraints": {
            "allowedValues": [
              {
                "label": "Email",
                "value": "email"
              },
              {
                "label": "Text",
                "value": "text"
              }
            ],
            "required": true
          }
        }
      }
    ]
  }
}
```

## Sample output

```json
{
  "colName": "contoso",
  "colGender": "female",
  "colContactPreference": "email"
}
```

## Remarks

- The only valid controls within the columns array are the [TextBox](microsoft-common-textbox.md), [OptionsGroup](microsoft-common-optionsgroup.md), and [DropDown](microsoft-common-dropdown.md).
- The `$rowIndex` variable is only valid in expressions contained within children of the grid's columns. It's an integer that represents the element's relative row index and the count begins at one and increments by one. As shown in the schema's `"columns":` section, the `$rowIndex` is used for validation.
- When validations are performed using the `$rowIndex` variable, it's possible to get the current row's value by combining the `last()` and `take()` commands.

  For example:

  `last(take(<reference_to_grid>, $rowIndex))`

- The `label` property doesn't appear as part of the control but is displayed on the final tab summary.
- The `ariaLabel` property is the accessibility label for the grid. Specify helpful text for users who use screen readers.
- The `constraints.width` property is used to set the overall width of the grid. The options are _Full_, _Medium_, _Small_. The default is _Full_.
- The `width` property on children of columns determines the column width. Widths are specified using fractional units such as _3fr_, with total space being allotted to columns proportional to their units. If no column width is specified, the default is _1fr_.

## Next steps

- For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](create-uidefinition-overview.md).
- For a description of common properties in UI elements, see [CreateUiDefinition elements](create-uidefinition-elements.md).
