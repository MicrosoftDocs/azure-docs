---
title: Invalid resource name and type segments
description: Describes how to resolve an error when the resource name and type don't have the same number of segments.
ms.topic: troubleshooting
ms.date: 04/05/2023
---

# Resolve errors for resource name and type mismatch

This article describes how to resolve the error when the format of the resource name doesn't match the format of the resource type.

## Symptom

When deploying a template, you receive an error with the error code `InvalidTemplate`. The message indicates the resource type and name don't match. It suggests fixing the number of segments in the name.

## Cause

A resource type contains the resource provider namespace and one or more segments for types. Each segment represents a level in the resource hierarchy and is separated by a slash.

```
{resource-provider-namespace}/{type-segment-1}/{type-segment-2}
```

The resource name contains one or more segments separated by slashes. The number of segments must match the number in the resource type.

```
{name-segment-1}/{name-segment-2}
```

If the resource type and name contain a different number of segments, you get this error.

## Solution

Make sure you understand the level of the resource type. For example, a key vault resource has a fully qualified resource type of `Microsoft.KeyVault/vaults`. You can ignore the resource provider namespace (**Microsoft.KeyVault**) and focus on the type (**vaults**). It has one segment.

A key vault secret is a child resource of the vault. It has a fully qualified resource type of `Microsoft.KeyVault/vaults/secrets`. This resource type has two segments (**vaults/secrets**).

To specify a name for the key vault, provide just one segment, like `examplevault123`. To specify a name for the secret, provide two segments, like `examplevault123/examplesecret`. The first segment indicates the key vault where this secret is stored.

The following example shows a valid format for the resource name.

# [Bicep](#tab/bicep)

```bicep
resource kv 'Microsoft.KeyVault/vaults@2022-07-01' = {
  name: 'examplevault123'
  ...
}
```

# [JSON](#tab/json)

```json
{
  "type": "Microsoft.KeyVault/vaults",
  "apiVersion": "2022-07-01",
  "name": "examplevault123",
  ...
}
```

---

You would see an **error** if you provided a name with more than one segment.

# [Bicep](#tab/bicep)

```bicep
resource kv 'Microsoft.KeyVault/vaults@2022-07-01' = {
  name: 'contoso/examplevault123'
  ...
}
```

# [JSON](#tab/json)

```json
{
  "type": "Microsoft.KeyVault/vaults",
  "apiVersion": "2022-07-01",
  "name": "contoso/examplevault123",
  ...
}
```

---

When you nest a child resource within the parent resource, provide just the extra segment. The full resource type and name still contain the values from the parent resource but they're constructed for you. In the following example, the type is `secrets` and the name is `examplesecret`.

# [Bicep](#tab/bicep)

```bicep
resource kv 'Microsoft.KeyVault/vaults@2022-07-01' = {
  name: 'examplevault123'
  ...
  resource kvsecret 'secrets' = {
    name: 'examplesecret'
    properties: {
     value: secretValue
    }
  }
}
```

# [JSON](#tab/json)

```json
{
  "type": "Microsoft.KeyVault/vaults",
  "apiVersion": "2022-07-01",
  "name": "examplevault123",
  ...
  "resources": [
    {
      "type": "secrets",
      "apiVersion": "2022-07-01",
      "name": "examplesecret",
      "properties": {
        "value": "[parameters('secretValue')]"
      },
      "dependsOn": [
        "[resourceId('Microsoft.KeyVault/vaults', 'examplevault123')]"
      ]
    }
  ]
}
```

---

When you define the child resource outside of the parent, provide the full resource type. For JSON, provide the full resource name.

For Bicep, use the `parent` property and provide the symbolic name of the parent resource. When you use the parent property, the full name is constructed for you, so you provide the child resource name as a single segment.

# [Bicep](#tab/bicep)

```bicep
resource kvsecret 'Microsoft.KeyVault/vaults/secrets@2022-07-01' = {
  name: 'examplesecret'
  parent: kv
  properties: {
     value: secretValue
  }
}

resource kv 'Microsoft.KeyVault/vaults@2022-07-01' = {
  name: 'examplevault123'
  ...
}
```

# [JSON](#tab/json)

```json
{
  "type": "Microsoft.KeyVault/vaults/secrets",
  "apiVersion": "2022-07-01",
  "name": "examplevault123/examplesecret",
  "properties": {
    "value": "[parameters('secretValue')]"
  },
  "dependsOn": [
    "[resourceId('Microsoft.KeyVault/vaults', 'examplevault123')]"
  ]
},
{
  "type": "Microsoft.KeyVault/vaults",
  "apiVersion": "2022-07-01",
  "name": "examplevault123",
```

---

For more information, see [Set name and type for child resources in Bicep](../bicep/child-resource-name-type.md) or [Set name and type for child resources in ARM templates](../templates/child-resource-name-type.md).
