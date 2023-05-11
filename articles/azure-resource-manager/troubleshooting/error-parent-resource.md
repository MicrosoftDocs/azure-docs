---
title: Parent resource errors
description: Describes how to resolve errors when you deploy a resource that's dependent on a parent resource in a Bicep file or Azure Resource Manager template (ARM template).
ms.topic: troubleshooting
ms.custom: devx-track-bicep, devx-track-arm-template
ms.date: 04/05/2023
---

# Resolve errors for parent resources

This article describes the `ParentResourceNotFound` error you might get when deploying a resource that's dependent on a parent resource. The error occurs when you deploy resources with a Bicep file or Azure Resource Manager template (ARM template).

## Symptom

When you deploy a resource that's a child to another resource, you might receive the following error:

```Output
Code=ParentResourceNotFound,
Message=Can not perform requested operation on nested resource. Parent resource 'exampleserver' not found."
```

## Cause

When one resource is a child to another resource, the parent resource must exist before the child resource is created. The name of the child resource defines the connection with the parent resource. The name of the child resource is in the format `<parent-resource-name>/<child-resource-name>`. For example, a SQL Database might be defined as:

# [Bicep](#tab/bicep)

```bicep
resource sqlDatabase 'Microsoft.Sql/servers/databases@2022-02-01-preview' = {
  name: '${sqlServerName}/${databaseName}'
  ...
}
```

For more information about Bicep parent and child resources, see [Set name and type for child resources in Bicep](../bicep/child-resource-name-type.md).

# [JSON](#tab/json)

```json
{
  "type": "Microsoft.Sql/servers/databases",
  "name": "[concat(variables('sqlServerName'), '/', parameters('databaseName'))]",
  ...
```

For more information about ARM template parent and child resources, see [Set name and type for child resources](../templates/child-resource-name-type.md).

---

If you deploy the server and the database in the same template, but don't specify a dependency on the server, the database deployment might start before the server has deployed. That causes the database deployment to fail with the `ParentResourceNotFound` error.

If the parent resource already exists and isn't deployed in the same template, you get the `ParentResourceNotFound` error when Resource Manager can't associate the child resource with a parent. This error might happen when the child resource isn't in the correct format. Or if the child resource is deployed to a resource group that's different than the resource group for parent resource.

## Solution 1: Deployed in same template

To resolve this error when parent and child resources are deployed in the same template, use a dependency.

# [Bicep](#tab/bicep)

This example uses a nested child resource within the parent resource and that creates the dependency. The child gets the resource type and API version from the parent resource.

```bicep
resource sqlServer 'Microsoft.Sql/servers@2022-02-01-preview' = {
  name: sqlServerName
  properties: {
    ...
  }
  resource sqlDatabase 'databases' = {
    name: databaseName
    ...
  }
}
```

For more information about dependencies, see [Resource declaration in Bicep](../bicep/resource-dependencies.md).

# [JSON](#tab/json)

In an ARM template, use `dependsOn` to create a dependency on another resource.

```json
"dependsOn": [
  "[variables('sqlServerName')]"
]
```

For more information about `dependsOn`, see [Define the order for deploying resources in ARM templates](../templates/resource-dependency.md#dependson).

---

## Solution 2: Deployed in different templates

To resolve this error when the parent resource was deployed in a different template, don't set a dependency. Instead, deploy the child to the same resource group and provide the name of the parent resource.

# [Bicep](#tab/bicep)

This example uses the [existing](../bicep/existing-resource.md) keyword to reference a parent that was deployed in a separate file. The child resource uses the `parent` element and the parent resource's symbolic name.

```bicep
param location string = resourceGroup().location
param sqlServerName string
param databaseName string

resource sqlServer 'Microsoft.Sql/servers@2022-02-01-preview' existing = {
  name: sqlServerName
}

resource sqlDatabase 'Microsoft.Sql/servers/databases@2022-02-01-preview' = {
  parent: sqlServer
  name: databaseName
  location: location
}
```

# [JSON](#tab/json)

The `name` element uses the names of the parent resource and child resources.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "sqlServerName": {
      "type": "string"
    },
    "databaseName": {
      "type": "string"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Sql/servers/databases",
      "apiVersion": "2022-02-01-preview",
      "name": "[concat(parameters('sqlServerName'), '/', parameters('databaseName'))]",
      "location": "[resourceGroup().location]",
      "properties": {
        "collation": "SQL_Latin1_General_CP1_CI_AS",
        "edition": "Basic"
      }
    }
  ],
  "outputs": {}
}
```

---
