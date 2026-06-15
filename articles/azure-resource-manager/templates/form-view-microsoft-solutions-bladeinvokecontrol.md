---
title: BladeInvokeControl UI element (Form view)
description: Describes the Microsoft.Solutions.BladeInvokeControl UI element for Form view authoring in Azure portal Create experiences.
ms.topic: reference
ms.date: 06/08/2026
---

# Microsoft.Solutions.BladeInvokeControl UI element

The `BladeInvokeControl` user-interface (UI) element opens an Azure portal blade from a Form view and stores the data returned by that blade. Use it when the form needs a richer picker or configuration experience that already exists as a portal blade.

`BladeInvokeControl` is supported in Form view for template spec portal forms. The target blade must be available in the Azure portal runtime and must support being invoked with the supplied parameters.

## UI sample

There's no UI for `BladeInvokeControl`. It opens the blade named in `bladeReference` when `openBladeStatus` evaluates to an active state.

## Schema

```json
{
  "name": "skuPicker",
  "type": "Microsoft.Solutions.BladeInvokeControl",
  "openBladeStatus": "[steps('specs').openSkuPicker]",
  "defaultValue": {
    "selectedSku": "Standard"
  },
  "transforms": {
    "sku": "selectedSku"
  },
  "bladeReference": {
    "name": "SkuPickerBlade",
    "extension": "Contoso_Azure_Service",
    "parameters": {
      "subscriptionId": "[steps('basics').resourceScope.subscription.subscriptionId]",
      "location": "[steps('basics').resourceScope.location.name]"
    }
  }
}
```

## Sample output

The control's output is the object returned by the invoked blade.

```json
{
  "selectedSku": "Standard"
}
```

With the `transforms` property in the schema example, the transformed value can be referenced with `[steps('specs').skuPicker.transformed.sku]`.

## Remarks

- The `openBladeStatus` property is an expression that controls when the blade opens.
- The `bladeReference` property can be a blade name string or an object. When it's an object, `name` is the portal blade to open, `extension` identifies the portal extension that owns the blade, and `parameters` is passed to the target blade.
- The shape of `bladeReference.parameters` is defined by the target blade, not by the Form view schema.
- The `defaultValue` property is optional. It initializes the control output before the blade returns data.
- The `transforms` property is optional. Each key creates a projected value from the returned blade data using a property path.
- The invoked blade must return data that the form can use. Reference returned values with expressions such as `[steps('specs').skuPicker.selectedSku]`.

## Next steps

- [Form view elements](form-view-elements.md)
- [Create portal forms for template specs](template-specs-create-portal-forms.md)
