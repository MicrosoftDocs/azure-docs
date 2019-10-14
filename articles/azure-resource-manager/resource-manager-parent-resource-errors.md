---
title: Azure parent resource errors | Microsoft Docs
description: Describes how to resolve errors when working with a parent resource.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: troubleshooting
ms.date: 08/01/2018
ms.author: tomfitz

---
# Resolve errors for parent resources

This article describes the errors you may get when deploying a resource that is dependent on a parent resource.

## Symptom

When deploying a resource that is a child to another resource, you may receive the following error:

```
Code=ParentResourceNotFound;
Message=Can not perform requested operation on nested resource. Parent resource 'exampleserver' not found."
```

## Cause

When one resource is a child to another resource, the parent resource must exist before creating the child resource. The name of the child resource defines the connection with the parent resource. The name of the child resource is in the format `<parent-resource-name>/<child-resource-name>`. For example, a SQL Database might be defined as:

```json
{
  "type": "Microsoft.Sql/servers/databases",
  "name": "[concat(variables('databaseServerName'), '/', parameters('databaseName'))]",
  ...
```

If you deploy both the server and the database in the same template, but don't specify a dependency on the server, the database deployment might start before the server has deployed. 

If the parent resource already exists and isn't deployed in the same template, you get this error when Resource Manager can't associate the child resource with parent. This error might happen when the child resource isn't in the correct format, or the child resource is deployed to a resource group that is different than the resource group for parent resource.

## Solution

To resolve this error when parent and child resources are deployed in the same template, include a dependency.

```json
"dependsOn": [
    "[variables('databaseServerName')]"
]
```

To resolve this error when the parent resource was previously deployed in a different template, you don't set a dependency. Instead, deploy the child to the same resource group and provide the name of the parent resource.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
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
            "apiVersion": "2014-04-01",
            "type": "Microsoft.Sql/servers/databases",
            "location": "[resourceGroup().location]",
            "name": "[concat(parameters('sqlServerName'), '/', parameters('databaseName'))]",
            "properties": {
                "collation": "SQL_Latin1_General_CP1_CI_AS",
                "edition": "Basic"
            }
        }
    ],
    "outputs": {}
}
```

For more information, see [Define the order for deploying resources in Azure Resource Manager templates](resource-group-define-dependencies.md).