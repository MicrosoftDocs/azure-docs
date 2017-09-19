---
title: Azure parent resource errors | Microsoft Docs
description: Describes how to resolve errors when working with a parent resource.
services: azure-resource-manager,azure-portal
documentationcenter: ''
author: tfitzmac
manager: timlt
editor: ''

ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: support-article
ms.date: 09/13/2017
ms.author: tomfitz

---
# Resolve errors for parent resources

This article describes the errors you may encounter when deploying a resource that is dependent on a parent resource.

## Symptom

When deploying a resource that is a child to another resource, you may receive the following error:

```
Code=ParentResourceNotFound;
Message=Can not perform requested operation on nested resource. Parent resource 'exampleserver' not found."
```

## Cause

When one resource is a child to another resource, the parent resource must exist before creating the child resource. The name of the child resource includes the parent name. For example, a SQL Database might be defined as:

```json
{
  "type": "Microsoft.Sql/servers/databases",
  "name": "[concat(variables('databaseServerName'), '/', parameters('databaseName'))]",
  ...
```

But, if you do not specify a dependency on the server, the database deployment might start before the server has deployed.

## Solution

To resolve this error, include a dependency.

```json
"dependsOn": [
    "[variables('databaseServerName')]"
]
```

For more information, see [Define the order for deploying resources in Azure Resource Manager templates](resource-group-define-dependencies.md).