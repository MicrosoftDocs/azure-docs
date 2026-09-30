---
title: SubscriptionSelector UI element (Form view)
description: Describes the Microsoft.Common.SubscriptionSelector UI element for Form view authoring in Azure portal Create experiences.
ms.topic: reference
ms.date: 05/29/2026
---

# Microsoft.Common.SubscriptionSelector UI element

The `SubscriptionSelector` user-interface (UI) element lets users select an Azure subscription. It's the standalone subscription picker used when a form doesn't use the composite [`Microsoft.Common.ResourceScope`](form-view-microsoft-common-resourcescope.md) element.

## UI sample

The `SubscriptionSelector` element renders a subscription dropdown.

:::image type="content" source="./media/form-view-elements/microsoft-common-subscriptionselector.png" alt-text="Screenshot of the Microsoft.Common.SubscriptionSelector UI element.":::

## Schema

```json
{
  "name": "subscription",
  "type": "Microsoft.Common.SubscriptionSelector",
  "resourceProviders": [
    "Microsoft.Storage",
    "Microsoft.Network"
  ],
  "constraints": {
    "validations": [
      {
        "isValid": "[not(empty(steps('basics').subscription.subscriptionId))]",
        "message": "Select a subscription."
      }
    ]
  },
  "visible": true
}
```

## Sample output

```json
{
  "displayName": "Contoso subscription",
  "subscriptionId": "00000000-0000-0000-0000-000000000000",
  "tenantId": "11111111-1111-1111-1111-111111111111"
}
```

## Remarks

- `resourceProviders` filters selectable subscriptions to subscriptions where the listed providers are available.
- `constraints.validations` adds custom validation rules.
- Reference the subscription ID with `[steps('basics').subscription.subscriptionId]`.
- Standalone [`Microsoft.Common.ResourceGroupSelector`](form-view-microsoft-common-resourcegroupselector.md), [`Microsoft.Common.LocationSelector`](form-view-microsoft-common-locationselector.md), and scope-aware resource controls should reference the selected subscription through their `scope.subscriptionId` property.

## Next steps

- [Form view elements](form-view-elements.md)
- [Create portal forms for template specs](template-specs-create-portal-forms.md)
