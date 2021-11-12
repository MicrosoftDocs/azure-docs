---
title: Invalid template errors
description: Describes how to resolve invalid template errors when deploying Azure Resource Manager templates.
ms.topic: troubleshooting
ms.date: 11/11/2021
---
# Resolve errors for resource name and type mismatch

This article describes how to resolve the error when the format of the resource name doesn't match the format of the resource type.

## Symptom

When deploying a template, you receive an error with the error code **InvalidTemplate**. The message indicates the resource type and name don't match. It suggests fixing the number of segments in the name.

## Cause

A resource name contains segments that are separated by the slash `/` character. Each segment represents a level in the resource hierarchy. The levels in the resource type must match the levels in the resource name.

If the resource type shows a two-level hierarchy but the name shows a three-level hierarchy, the resource can't be resolved and you get this error.

## Solution

Make sure you understand the level of the resource type. For example, the key vault resource has a fully qualified resource type of `Microsoft.KeyVault/vaults`. You can ignore the resource provider namespace (**Microsoft.KeyVault**) and focus on the type (**vaults**), which has one level.

The fully qualified resource type for a key vault secret is `Microsoft.KeyVault/vaults/secrets`. This resource type has two levels (**vaults/secrets**). The secret is a child resource of the vault.

To specify a name for the key vault, provide just one segment, like `examplevault123`. To specify a name for the secret, provide two segments, like `examplevault123/examplesecret`.

The following example shows a valid format for the resource name.

# [Bicep](#tab/bicep)

```bicep
resource kv 'Microsoft.KeyVault/vaults@2019-09-01' = {
  name: 'examplevault123'
```

# [Resource Manager Template](#tab/azure-resource-manager)

```json
{
  "type": "Microsoft.KeyVault/vaults",
  "apiVersion": "2019-09-01",
  "name": "examplevault123",
```

---

You would see an **error** if you provided a name with more than one segment.

# [Bicep](#tab/bicep)

```bicep
resource kv 'Microsoft.KeyVault/vaults@2019-09-01' = {
  name: 'contoso/examplevault123'
```

# [Resource Manager Template](#tab/azure-resource-manager)

```json
{
  "type": "Microsoft.KeyVault/vaults",
  "apiVersion": "2019-09-01",
  "name": "contoso/examplevault123",
```

---

When you nest a child resource within the parent resource, provide just the extra segment. The full resource type and name still contain the values from the parent resource but they're constructed for you.

# [Bicep](#tab/bicep)

```bicep
resource kv 'Microsoft.KeyVault/vaults@2019-09-01' = {
  name: 'examplevault123'
  resource secret 'secrets' = {
    name: 'examplesecret'
```

# [Resource Manager Template](#tab/azure-resource-manager)

```json
{
  "type": "Microsoft.KeyVault/vaults",
  "apiVersion": "2019-09-01",
  "name": "examplevault123",
  "resources": [
    {
      "type": "secrets",
      "apiVersion": "2019-09-01",
      "name": "examplesecret",
```

---

When you define the child resource outside of the parent, provide the full resource type. For Bicep, use the `parent` property and provide the name as a single segment. For JSON, provide the full resource name.

# [Bicep](#tab/bicep)

```bicep
resource secret 'Microsoft.KeyVault/vaults/secrets@2021-06-01-preview' = {
  name: 'examplesecret'
  parent: kv
  properties: {
     value: secretValue
  }
}

resource kv 'Microsoft.KeyVault/vaults@2019-09-01' = {
  name: 'examplevault123'
  ...
}
```

# [Resource Manager Template](#tab/azure-resource-manager)

```json
{
  "type": "Microsoft.KeyVault/vaults/secrets",
  "apiVersion": "2019-09-01",
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
  "apiVersion": "2019-09-01",
  "name": "examplevault123",
```

---

For more information, see [Set name and type for child resources in Bicep](../bicep/child-resource-name-type.md) or [Set name and type for child resources in ARM templates](../templates/child-resource-name-type.md).