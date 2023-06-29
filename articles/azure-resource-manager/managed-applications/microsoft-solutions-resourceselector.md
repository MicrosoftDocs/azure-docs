---
title: ResourceSelector UI element
description: Describes the Microsoft.Solutions.ResourceSelector UI element for Azure portal. Used for getting a list of existing resources.
ms.topic: conceptual
ms.date: 08/16/2022
---

# Microsoft.Solutions.ResourceSelector UI element

The `ResourceSelector` user-interface (UI) element lets users select an existing Azure resource from a subscription. You specify the resource provider namespace and resource type, like `Microsoft.Storage/storageAccounts` in the element's JSON. You can use the element to filter the list by subscription or location. From the element's UI, to search within the list's contents, you can type a filter like resource group name, resource name, or a partial name.

## UI sample

In this example, the element's location is set to `all`. The list shows all storage accounts in the subscription. You can use the filter box to search within the list.

:::image type="content" source="./media/managed-application-elements/microsoft-solutions-resourceselector-list.png" alt-text="Screenshot of the resource selector list of all storage accounts in a subscription.":::


In this example, the element's location is set to `onBasics`. The list shows storage accounts that exist in the location that was selected on the **Basics** tab. You can use the filter box to search within the list.

:::image type="content" source="./media/managed-application-elements/microsoft-solutions-resourceselector-filter.png" alt-text="Screenshot of the resource selector list that filters by resource group name.":::

When you use the element to restrict the subscription to `onBasics` the UI doesn't show the subscription name in the list. You can use the filter box to search within the list.

:::image type="content" source="./media/managed-application-elements/microsoft-solutions-resourceselector-subcription.png" alt-text="Screenshot of the resource list that doesn't show subscription because element set subscription to onBasics.":::

## Schema

```json
{
  "name": "storageSelector",
  "type": "Microsoft.Solutions.ResourceSelector",
  "label": "Select storage accounts",
  "resourceType": "Microsoft.Storage/storageAccounts",
  "options": {
    "filter": {
      "subscription": "onBasics",
      "location": "onBasics"
    }
  }
}
```

## Sample output

```json
"id": "/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/{resource-provider-namespace}/{resource-type}/{resource-name}",
"location": "{deployed-location}",
"name": "{resource-name}"
```

## Remarks

- In the `resourceType` property, provide the resource provider namespace and resource type name for the resource you wish to show in the list. For more information, see the [resource providers](/azure/templates/) reference documentation.
- The `filter` property restricts the available options for the resources. You can restrict the results by location or subscription.
  - `all`: Shows all resources and is the default value.
  - `onBasics`: Shows only resources that match the selection on the **Basics** tab.
  - If you omit the `filter` property from the _createUiDefinition.json_ file, all resources for the specified resource type are shown in the list.

## Next steps

- For an introduction to creating UI definitions, see [CreateUiDefinition.json for Azure managed application's create experience](create-uidefinition-overview.md).
- For a description of common properties in UI elements, see [CreateUiDefinition elements](create-uidefinition-elements.md).
