---
title: Linter rule - use resource symbol reference
description: Linter rule - use resource symbol reference
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 10/14/2024
---

# Linter rule - use resource symbol reference

This rule detects suboptimal uses of the [`reference`](./bicep-functions-resource.md#reference) and [`list`](./bicep-functions-resource.md#list) functions. Instead of invoking these functions, using a resource reference simplifies the syntax and allows Bicep to better understand your deployment dependency graph.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`use-resource-symbol-reference`

## Solution

The following example fails this test because of the uses of `reference` and `listKey`:

```bicep
@description('The name of the HDInsight cluster to create.')
param clusterName string

@description('These credentials can be used to submit jobs to the cluster and to log into cluster dashboards.')
param clusterLoginUserName string

@description('The password must be at least 10 characters in length and must contain at least one digit, one uppercase letter, one lowercase letter, and one non-alphanumeric character (except single-quote, double-quote, backslash, right-bracket, or full-stop characters). Also, the password must not contain three consecutive characters from the cluster username or SSH username.')
@minLength(10)
@secure()
param clusterLoginPassword string

@description('Location for all resources.')
param location string = resourceGroup().location

param storageAccountName string = uniqueString(resourceGroup().id)

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' existing = {
  name: storageAccountName
}

resource cluster 'Microsoft.HDInsight/clusters@2024-08-01-preview' = {
  name: clusterName
  location: location
  properties: {
    clusterVersion: '4.0'
    osType: 'Linux'
    clusterDefinition: {
      kind: 'hbase'
      configurations: {
        gateway: {
          'restAuthCredential.isEnabled': true
          'restAuthCredential.username': clusterLoginUserName
          'restAuthCredential.password': clusterLoginPassword
        }
      }
    }
    storageProfile: {
      storageaccounts: [
        {
          name: replace(replace(reference(storageAccount.id, '2023-05-01').primaryEndpoints.blob, 'https://', ''), '/', '')
          isDefault: true
          container: clusterName
          key: listKeys(storageAccount.id, '2023-05-01').keys[0].value
        }
      ]
    }
  }
}
```

You can fix the problem by using resource reference:

```bicep
@description('The name of the HDInsight cluster to create.')
param clusterName string

@description('These credentials can be used to submit jobs to the cluster and to log into cluster dashboards.')
param clusterLoginUserName string

@description('The password must be at least 10 characters in length and must contain at least one digit, one uppercase letter, one lowercase letter, and one non-alphanumeric character (except single-quote, double-quote, backslash, right-bracket, or full-stop characters). Also, the password must not contain three consecutive characters from the cluster username or SSH username.')
@minLength(10)
@secure()
param clusterLoginPassword string

@description('Location for all resources.')
param location string = resourceGroup().location

param storageAccountName string = uniqueString(resourceGroup().id)

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' existing = {
  name: storageAccountName
}

resource cluster 'Microsoft.HDInsight/clusters@2024-08-01-preview' = {
  name: clusterName
  location: location
  properties: {
    clusterVersion: '4.0'
    osType: 'Linux'
    clusterDefinition: {
      kind: 'hbase'
      configurations: {
        gateway: {
          'restAuthCredential.isEnabled': true
          'restAuthCredential.username': clusterLoginUserName
          'restAuthCredential.password': clusterLoginPassword
        }
      }
    }
    storageProfile: {
      storageaccounts: [
        {
          name: replace(replace(storageAccount.properties.primaryEndpoints.blob, 'https://', ''), '/', '')
          isDefault: true
          container: clusterName
          key: storageAccount.listKeys().keys[0].value
        }
      ]
    }
  }
}
```

Use **Quick Fix** to simplify the syntax:

:::image type="content" source="./media/linter-rule-use-resource-symbol-reference/bicep-linter-rule-use-resource-symbol-reference-quick-fix.png" alt-text="A screenshot of using Quick fix for the use-resource-symbol-reference linter rule." lightbox="./media/linter-rule-use-resource-symbol-reference/bicep-linter-rule-use-resource-symbol-reference-quick-fix.png":::

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
