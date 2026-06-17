---
title: Form view overview (uiFormDefinition)
description: Describes the Form view JSON authoring model used by Azure portal Create experiences and template spec portal forms.
ms.topic: conceptual
ms.date: 05/29/2026
---

# Overview of Form view (uiFormDefinition)

A *Form view* is a JSON description of an Azure portal Create experience. The Azure portal renders the form at runtime from the JSON; there's no client code to write. Form views use the _uiFormDefinition.json_ format and are used by [template spec portal forms](template-specs-create-portal-forms.md). Azure Managed Applications use the separate [_createUiDefinition.json_](../managed-applications/create-uidefinition-overview.md) format.

The minimum file looks like this:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2021-09-09/uiFormDefinition.schema.json#",
  "view": {
    "kind": "Form",
    "properties": {
      "title": "Create my resource",
      "steps": []
    },
    "outputs": {
      "kind": "ResourceGroup",
      "resourceGroupId": "",
      "location": "",
      "parameters": {}
    }
  }
}
```

A Form view always has:

| Field | Required | Description |
| --- | --- | --- |
| `$schema` | Recommended | Pin the `2021-09-09/uiFormDefinition.schema.json` schema for IntelliSense. |
| `view.kind` | Yes | Must be `"Form"`. |
| `view.properties.title` | Yes | The page title shown above the form. |
| `view.properties.steps` | Yes | One or more steps (tabs). See [Steps](#steps). |
| `view.outputs` | Yes (when deploying) | The *deployment context* — which subscription, resource group, management group, or tenant the deployment targets, and the Azure Resource Manager template parameter values. See [Outputs](#outputs-the-deployment-context). |

## Steps

`steps` is an ordered array. Each step renders as a tab. The user moves between steps with **Next** and **Previous**.

```json
"steps": [
  {
    "name": "basics",
    "label": "Basics",
    "description": "Provide the basic settings for the resource.",
    "elements": [
      {
        "name": "name",
        "type": "Microsoft.Common.TextBox",
        "label": "Resource name",
        "toolTip": "Provide a unique name.",
        "constraints": {
          "required": true,
          "regex": "^[a-z0-9]{3,24}$",
          "validationMessage": "3-24 lowercase letters or digits."
        }
      }
    ]
  }
]
```

Each step has:

| Field | Required | Description |
| --- | --- | --- |
| `name` | Yes | Step ID. Reference it from expressions as `steps('<name>')`. |
| `label` | Yes | Tab title. |
| `description` | No | Optional description rendered under the tab title. |
| `elements` | Yes | Array of form controls. See [Form view elements](form-view-elements.md). |

Group related fields with `Microsoft.Common.Section` rather than overloading a step. Sections can't be nested.

## Outputs (the deployment context)

When a Form view is used to deploy an Azure Resource Manager template (the common case), `view.outputs` is the *deployment context*. The portal uses it to figure out **where** to deploy and **what** parameter values to pass to the template. Four `kind` values are supported:

| `kind` | Required fields | Used when |
| --- | --- | --- |
| `ResourceGroup` | `resourceGroupId`, `location`, `parameters` | Most resources. Deploys to a resource group. |
| `Subscription` | `subscriptionId`, `location`, `parameters` | The template's `$schema` is `subscriptionDeploymentTemplate.json`. |
| `ManagementGroup` | `managementGroupId`, `location`, `parameters` | The template's `$schema` is `managementGroupDeploymentTemplate.json`. |
| `Tenant` | `location`, `parameters` | The template's `$schema` is `tenantDeploymentTemplate.json`. |

`parameters` keys map 1:1 to ARM template parameters. Values are usually expressions that read step output.

For resource-group deployments, the public schema supports [`Microsoft.Common.ResourceScope`](form-view-microsoft-common-resourcescope.md), and the [Create portal forms for template specs](template-specs-create-portal-forms.md) tutorial uses it for the common subscription, resource group, and location selection flow. The example below assumes the `basics` step contains a `Microsoft.Common.ResourceScope` element named `resourceScope`. This is also the safest default when the form includes controls (such as `Microsoft.Compute.SizeSelector`) that infer their subscription and location from the deployment scope.

```json
"outputs": {
  "kind": "ResourceGroup",
  "resourceGroupId": "[steps('basics').resourceScope.resourceGroup.id]",
  "location":        "[steps('basics').resourceScope.location.name]",
  "parameters": {
    "keyVaultName": "[steps('basics').name]",
    "location":     "[steps('basics').resourceScope.location.name]",
    "sku":          "[steps('keyvault').sku]"
  }
}
```

If a form uses standalone `Microsoft.Common.SubscriptionSelector`, `Microsoft.Common.ResourceGroupSelector`, and `Microsoft.Common.LocationSelector` elements instead of `Microsoft.Common.ResourceScope`, make sure scope-aware controls are explicitly bound to the selected subscription and location through their `scope` property.

## Expressions

Strings of the form `"[ ... ]"` are evaluated as expressions. The functions are the same set documented for [CreateUiDefinition functions](../managed-applications/create-uidefinition-functions.md):

| Function | Returns |
| --- | --- |
| `steps('<stepName>')` | Object holding every control output in the named step. |
| `basics('<elementName>')` | Output of an element in the legacy *Basics* step (CreateUiDefinition only). |
| `equals`, `not`, `and`, `or`, `if`, `coalesce`, `empty` | Logical helpers. |
| `concat`, `split`, `substring`, `indexOf`, `toLower`, `toUpper`, `last`, `first` | String and array helpers. |
| `length`, `min`, `max`, `add`, `sub`, `mul`, `div` | Numeric helpers. |
| `subscription()`, `resourceGroup()`, `location()` | Selected scope. |

Inside a control, `visible`, `defaultValue`, and most `constraints.*` fields accept either a literal or an expression.

## Localization

User-facing strings can be inlined as literals (as in the examples above).

## Authoring tools

- The **[Form view sandbox](https://aka.ms/form/sandbox)** can generate a default form from an ARM template and preview the result. See [Create portal forms for template specs](template-specs-create-portal-forms.md) for an end-to-end walkthrough.
- The schema is published at `https://schema.management.azure.com/schemas/2021-09-09/uiFormDefinition.schema.json`. To enable IntelliSense in Visual Studio Code, add the schema URL as the top-level `$schema` value in the form file:

  ```json
  {
    "$schema": "https://schema.management.azure.com/schemas/2021-09-09/uiFormDefinition.schema.json#",
    "view": {
      "kind": "Form"
    }
  }
  ```

  If Visual Studio Code prompts you to trust the schema domain, choose **Configure Trusted Domains** and add `https://schema.management.azure.com`. You can also add it later from the Command Palette with **Preferences: Configure Trusted Domains**.

## Next steps

- [Form view elements](form-view-elements.md)
- [Create portal forms for template specs](template-specs-create-portal-forms.md)
- [CreateUiDefinition functions](../managed-applications/create-uidefinition-functions.md) — the same functions apply to Form view expressions.
