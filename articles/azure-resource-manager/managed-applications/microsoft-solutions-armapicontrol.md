---
title: ArmApiControl UI element
description: Describes the Microsoft.Solutions.ArmApiControl UI element for Azure portal that's used to call API operations.
ms.topic: conceptual
ms.date: 08/23/2022
---

# Microsoft.Solutions.ArmApiControl UI element

The `ArmApiControl` gets results from an Azure Resource Manager API operation using GET or POST. You can use the results to populate dynamic content in other controls.

## UI sample

There's no UI for `ArmApiControl`.

## Schema

The following example shows the control's schema.

```json
{
  "name": "testApi",
  "type": "Microsoft.Solutions.ArmApiControl",
  "request": {
    "method": "{HTTP-method}",
    "path": "{path-for-the-URL}",
    "body": {
      "key1": "value1",
      "key2": "value2"
    }
  }
}
```

## Sample output

The control's output isn't displayed to the user. Instead, the operation's results are used in other controls.

## Remarks

- The `request.method` property specifies the HTTP method. Only GET or POST are allowed.
- The `request.path` property specifies a URL that must be a relative path to an Azure Resource Manager endpoint. It can be a static path or can be constructed dynamically by referring output values of the other controls.

  For example, an Azure Resource Manager call into the `Microsoft.Network/expressRouteCircuits` resource provider.

  ```json
  "path": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/expressRouteCircuits/{circuitName}?api-version=2022-01-01"
  ```

- The `request.body` property is optional. Use it to specify a JSON body that is sent with the request. The body can be static content or constructed dynamically by referring to output values from other controls.

## Example

In the following example, the `providersApi` element uses the `ArmApiControl` and calls an API to get an array of provider objects.

The `providersDropDown` element's `allowedValues` property is configured to use the array and get the provider names. The provider names are displayed in the dropdown list.

The `output` property `providerName` shows the provider name that was selected from the dropdown list. The output can be used to pass the value to a parameter in an Azure Resource Manager template.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
  "handler": "Microsoft.Azure.CreateUIDef",
  "version": "0.1.2-preview",
  "parameters": {
    "basics": [
      {
        "name": "providersApi",
        "type": "Microsoft.Solutions.ArmApiControl",
        "request": {
          "method": "GET",
          "path": "[concat(subscription().id, '/providers/Microsoft.Network/expressRouteServiceProviders?api-version=2022-01-01')]"
        }
      },
      {
        "name": "providerDropDown",
        "type": "Microsoft.Common.DropDown",
        "label": "Provider",
        "toolTip": "The provider that offers the express route connection.",
        "constraints": {
          "allowedValues": "[map(basics('providersApi').value, (item) => parse(concat('{\"label\":\"', item.name, '\",\"value\":\"', item.name, '\"}')))]",
          "required": true
        },
        "visible": true
      }
    ],
    "steps": [],
    "outputs": {
      "providerName": "[basics('providerDropDown')]"
    }
  }
}
```

For an example of the `ArmApiControl` that uses the `request.body` property, see the [Microsoft.Common.TextBox](microsoft-common-textbox.md#single-line) single-line example. That example checks the availability of a storage account name and returns a message if the name is unavailable.

## Next steps

- For an introduction to creating UI definitions, see [CreateUiDefinition.json for Azure managed application's create experience](create-uidefinition-overview.md).
- For a description of common properties in UI elements, see [CreateUiDefinition elements](create-uidefinition-elements.md).
- To learn more about functions like `map`, `basics`, and `parse`, see [CreateUiDefinition functions](create-uidefinition-functions.md).
