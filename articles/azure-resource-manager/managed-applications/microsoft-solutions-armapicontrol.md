---
title: ArmApiControl UI element
description: Describes the Microsoft.Solutions.ArmApiControl UI element for Azure portal. Used for calling API operations.
author: davidsmatlak
ms.author: davidsmatlak
ms.topic: conceptual
ms.date: 08/23/2022
---

# Microsoft.Solutions.ArmApiControl UI element

ArmApiControl lets you get results from an Azure Resource Manager API operation. Use the results to populate dynamic content in other controls.

## UI sample

There's no UI for this control.

## Schema

The following example shows the schema for this control:

```json
{
  "name": "testApi",
  "type": "Microsoft.Solutions.ArmApiControl",
  "request": {
    "method": "{HTTP-method}",
    "path": "{path-for-the-URL}",
    "body": {
      "key1": "val1",
      "key2": "val2"
    }
  }
}
```

## Sample output

The control's output is not displayed to the user. Instead, the result of the operation is used in other controls.

## Remarks

- The `request.method` property specifies the HTTP method. Only `GET` or `POST` are allowed.
- The `request.path` property specifies a URL that must be a relative path to an ARM endpoint. It can be a static path or can be constructed dynamically by referring output values of the other controls.

  For example, an ARM call into `Microsoft.Network/expressRouteCircuits` resource provider:

  ```json
  "path": "subscriptions/<subid>/resourceGroup/<resourceGroupName>/providers/Microsoft.Network/expressRouteCircuits/<routecircuitName>/?api-version=2020-05-01"
  ```

- The `request.body` property is optional. Use it to specify a JSON body that is sent with the request. The body can be static content or constructed dynamically by referring to output values from other controls.

## Example

In the following example, the `providersApi` element calls an API to get an array of provider objects.

The `allowedValues` property of the `providersDropDown` element is configured to get the names of the providers. It displays them in the dropdown list.

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

For an example of using the `ArmApiControl` to check the availability of a resource name, see [Microsoft.Common.TextBox](microsoft-common-textbox.md).

## Next steps

- For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](create-uidefinition-overview.md).
- For a description of common properties in UI elements, see [CreateUiDefinition elements](create-uidefinition-elements.md).
