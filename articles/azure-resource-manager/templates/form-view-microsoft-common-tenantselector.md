---
title: TenantSelector UI element (Form view)
description: Describes the Microsoft.Common.TenantSelector UI element for Form view authoring in Azure portal Create experiences.
ms.topic: reference
ms.date: 05/29/2026
---

# Microsoft.Common.TenantSelector UI element

The `TenantSelector` user-interface (UI) element displays the current Microsoft Entra tenant. Use it for tenant-scope deployments or when the form needs to show the tenant that will be used.

## UI sample

The `TenantSelector` element renders read-only tenant information.

:::image type="content" source="./media/form-view-elements/microsoft-common-tenantselector.png" alt-text="Screenshot of the Microsoft.Common.TenantSelector UI element.":::

## Schema

```json
{
  "name": "tenant",
  "type": "Microsoft.Common.TenantSelector",
  "constraints": [
    {
      "isValid": "[not(empty(steps('basics').tenant.tenantId))]",
      "message": "A tenant is required."
    }
  ],
  "visible": true
}
```

## Sample output

```json
{
  "tenantId": "11111111-1111-1111-1111-111111111111",
  "directoryName": "contoso.onmicrosoft.com"
}
```

## Remarks

- The selected value includes `tenantId` and `directoryName`.
- The control is read-only and reflects the tenant for the signed-in user.
- For a tenant-scope deployment, set `view.outputs.kind` to `Tenant`.
- `constraints` is an optional array of custom validation rules. Each rule has an `isValid` expression and a `message`.

## Next steps

- [Form view elements](form-view-elements.md)
- [Create portal forms for template specs](template-specs-create-portal-forms.md)
