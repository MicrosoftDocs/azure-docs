---
title: Snapshot references in Azure App Configuration
description: Learn what snapshot references are and how they enable both immutable configuration sets and dynamic updates.
author: jimmyca15
ms.author: jimmyca
ms.service: azure-app-configuration
ms.topic: concept-article 
ms.date: 11/12/2025
---

# Snapshot references

Snapshot references are special key-values that point to a specific snapshot in an App Configuration store. They let you combine the safety of immutable configuration (snapshots) with the flexibility of dynamically changing which snapshot an application consumes at runtime.

With direct snapshot usage, an application selects a snapshot by name in code. Changing the targeted snapshot requires a new deployment or configuration change in the code path that builds configuration. Snapshot references remove that constraint: you load a reference key-value once, and if its target snapshot name changes later, configuration providers automatically reload configuration to the new immutable set.

## Why use snapshot references?

Snapshot references provide:

* **Easy updates**: Update the referenced snapshot without touching application code, even during runtime.
* **Immutable configuration sets**: Each snapshot remains unchanged, preserving auditability and rollback guarantees.

## How they work

A snapshot reference is stored as a key-value whose value contains the name of the snapshot to consume. When a configuration provider loads key-values, any snapshot references among the selected items are automatically resolved. The referenced snapshot's key-values are merged into the application's configuration. If the reference changes to point to a different snapshot, the configuration provider refresh causes the new snapshot contents to be loaded.

> [!NOTE]
> You don't have to call a specialized API to opt into snapshot references. If you select the key-value that is a snapshot reference, resolution is automatic.

## Creating a snapshot reference

1. Open your App Configuration store in the Azure portal.
2. Select **Configuration Explorer**.
3. Choose **Create**.
4. Select **Snapshot reference**.
5. Enter a key for the reference. Optionally set a label.
6. Choose the target snapshot name from the list (or enter it).
7. Select **Create**.

Once created, the snapshot reference appears alongside other key-values in Configuration Explorer.

## Consuming snapshot references

No new code is required to use a snapshot reference. If the key for a snapshot reference is part of the selected key-values when building configuration, the provider automatically resolves and loads the referenced snapshot's key-values. Compare this to direct snapshot usage where you explicitly call an API such as `SelectSnapshot("SnapshotName")`, fixing the snapshot choice at startup so switching later requires a code change or redeployment.

### Refresh behavior

When refresh is configured, changing the target snapshot name inside a snapshot reference seamlessly moves the application to use the new snapshot:

1. The application starts up.
1. The configuration provider fetches selected key-values including a snapshot reference.
1. The configuration provider resolves the reference to snapshot `Snapshot_A` and loads its key-values.
1. The snapshot reference is updated to point to `Snapshot_B` (still immutable).
1. The configuration provider detects the snapshot reference key-value has changed.
1. The configuration provider re-resolves. The key-values of `Snapshot_A` are unloaded. The configuration reload yields the key-values of `Snapshot_B`.

> [!NOTE]
> This sequence assumes you have configured refresh for your application. For details on how to configure refresh, see [dynamic configuration](./enable-dynamic-configuration-aspnet-core.md).

## Example snapshot reference

The following example demonstrates a snapshot reference

```json
{
    "key": "app1/snapshot-reference",
    "value": "{\"snapshot_name\":\"referenced-snapshot\"}",
    "content_type": "application/json; profile=\"https://azconfig.io/mime-profiles/snapshot-ref\"; charset=utf-8",
    "tags": {}
}
```

As mentioned, a snapshot reference is a normal key-value with some added constraints. Configuration providers identify snapshot references by their specific content type. The value of a snapshot reference is a json object with a name property that points to the target snapshot.

Snapshot reference content type: `application/json; profile="https://azconfig.io/mime-profiles/snapshot-ref"; charset=utf-8`

## Key conflict resolution

Referenced snapshots may contain keys that conflict with normal key-values (those outside of a snapshot). Configuration providers resolve these conflicts by using the value of the last seen key. In the case of snapshots, since they are resolved immediately upon being seen, the lexicographic ordering of the snapshot reference key is an important detail when considering the ultimate value of a given key when there are conflicts.

### Simplified example

Assume your store has these normal key-values:

```
key: message
value: hello-world

key: request-limit
value: 100
```

And a snapshot containing:

```
key: message
value: bye

key: request-limit
value: 8000
```

If a snapshot reference is added that points to the aforementioned snapshot, then the final effective configuration depends on the snapshot reference key's lexicographic position:

| Snapshot reference key | lexicographic position vs `message`, `request-limit` | Final `message` value | Final `request-limit` value | Why |
|------------------------|-------------------------------------------------------|-----------------|-----------------------|-----|
| `a-snapshot-reference` | Before both                                           | hello-world     | 100                   | The snapshot reference is resolved first; later normal keys override their duplicates. |
| `my-snapshot-reference`| After `message` but before `request-limit`            | bye             | 100                   | `message` is seen first. The snapshot reference is then resolved and overrides `message`. Finally the normal `request-limit` overrides the snapshot's `request-limit` value. |
| `some-snapshot-reference` | After both                                        | bye             | 8000                  | The snapshot reference is resolved last; its values override earlier duplicates. |

## Considerations and edge cases

* **Missing target snapshot**: If the reference points to a snapshot name that doesn't exist or is archived beyond retention, the provider ignores the reference.
* **No transitive resolution**: If a referenced snapshot contains a key-value that is itself a snapshot reference, that inner reference is not resolved.
* **Access control**: Reading a snapshot via a reference requires [snapshot read permissions](./concept-snapshots.md#read-and-list-snapshots), similarly to reading a snapshot directly.
* **Retention/archival**: Take care when referencing archived snapshots, as once the snapshot expires the app will no longer be able to access the contained configuration.

## Language availability

| Language    | Minimum version / status |
|-------------|---------------------------|
| .NET        | 8.4.0+                    |
| Java        | Work in progress          |
| JavaScript  | Work in progress          |
| Python      | Work in progress          |
| Go          | Work in progress          |

## Next steps

> [!div class="nextstepaction"]
> [Create and use snapshots](./howto-create-snapshots.md)

For deeper background, see the [Snapshots overview](./concept-snapshots.md).
