---
title: Change Analysis event properties (Preview)
description: Properties spec for Change Analysis in Azure Resource Graph.
ms.date: 03/11/2024
ms.topic: conceptual
---

# Change Analysis event properties (Preview)

When a resource is created, updated, or deleted, a new change resource (Microsoft.Resources/changes) is created to extend the modified resource and represent the changed properties. Change records should be available in less than five minutes.

Example change resource property bag:

```json
{
  "targetResourceId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myResourceGroup/providers/microsoft.compute/virtualmachines/myVM",
  "targetResourceType": "microsoft.compute/virtualmachines",
  "changeType": "Update",
  "changeAttributes": {
    "changesCount": 2,
    "correlationId": "88420d5d-8d0e-471f-9115-10d34750c617",
    "timestamp": "2021-12-07T09:25:41.756Z",
    "previousResourceSnapshotId": "ed90e35a-1661-42cc-a44c-e27f508005be",
    "newResourceSnapshotId": "6eac9d0f-63b4-4e7f-97a5-740c73757efb"
  },
  "changes": {
    "properties.provisioningState": {
      "newValue": "Succeeded",
      "previousValue": "Updating",
      "changeCategory": "System",
      "propertyChangeType": "Update"
      "isTruncated":"true"
    },
    "tags.key1": {
      "newValue": "NewTagValue",
      "previousValue": "null",
      "changeCategory": "User",
      "propertyChangeType": "Insert"
    }
  }
}
```

Each change resource has the following properties:

| Property | Description |
|:--------:|:-----------:|
| `targetResourceId` | The resourceID of the resource on which the change occurred. |
|---|---|
| `targetResourceType` | The resource type of the resource on which the change occurred. |
| `changeType` | Describes the type of change detected for the entire change record. Values are: Create, Update, and Delete. The **changes** property dictionary is only included when `changeType` is _Update_. For the delete case, the change resource is maintained as an extension of the deleted resource for 14 days, even if the entire resource group was deleted. The change resource doesn't block deletions or affect any existing delete behavior. |
| `changes` | Dictionary of the resource properties (with property name as the key) that were updated as part of the change: |
| `propertyChangeType` | This property is deprecated and can be derived as follows `previousValue` being empty indicates Insert, empty `newValue` indicates Remove, when both are present, it's Update.|
| `previousValue` | The value of the resource property in the previous snapshot. Value is empty when `changeType` is _Insert_. |
| `newValue` | The value of the resource property in the new snapshot. This property is empty (absent) when `changeType` is _Remove_. |
| `changeCategory` | This property was optional and has been deprecated, this field is no longer available. |
| `changeAttributes` | Array of metadata related to the change: |
| `changesCount` | The number of properties changed as part of this change record. |
| `correlationId` | Contains the ID for tracking related events. Each deployment has a correlation ID, and all actions in a single template share the same correlation ID. |
| `timestamp` | The datetime of when the change was detected. |
| `previousResourceSnapshotId` | Contains the ID of the resource snapshot that was used as the previous state of the resource. |
| `newResourceSnapshotId` | Contains the ID of the resource snapshot that was used as the new state of the resource. |
| `isTruncated` | When the number of property changes reaches beyond a certain number, they're truncated and this property becomes present. |

## Next steps

> [!div class="nextstepaction"]
> [Get resource changes](../how-to/get-resource-changes.md)
