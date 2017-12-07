---
title: Define child resource in Azure template | Microsoft Docs
description: Shows how to set the resource type and name for child resource in an Azure Resource Manager template
services: azure-resource-manager
documentationcenter: ''
author: tfitzmac
manager: timlt
editor: tysonn

ms.assetid: 
ms.service: azure-resource-manager
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/01/2017
ms.author: tomfitz

---
# Set name and type for child resource in Resource Manager template
When creating a template, you frequently need to include a child resource that is related to a parent resource. For example, your template may include a SQL server and a database. The SQL server is the parent resource, and the database is the child resource. 

The format of the child resource type is: `{resource-provider-namespace}/{parent-resource-type}/{child-resource-type}`

The format of the child resource name is: `{parent-resource-name}/{child-resource-name}`

However, you specify the type and name in a template differently based on whether it is nested within the parent resource, or on its own at the top level. This topic shows how to handle both approaches.

When constructing a fully qualified reference to a resource, the order to combine segments from the type and name  is not simply a concatenation of the two.  Instead, after the namespace, use a sequence of *type/name* pairs from least specific to most specific:

```json
{resource-provider-namespace}/{parent-resource-type}/{parent-resource-name}[/{child-resource-type}/{child-resource-name}]*
```

For example:

`Microsoft.Compute/virtualMachines/myVM/extensions/myExt` is correct
`Microsoft.Compute/virtualMachines/extensions/myVM/myExt` is not correct

## Nested child resource
The easiest way to define a child resource is to nest it within the parent resource. The following example shows a SQL database nested within in a SQL Server.

```json
{
  "name": "exampleserver",
  "type": "Microsoft.Sql/servers",
  "apiVersion": "2014-04-01",
  ...
  "resources": [
    {
      "name": "exampledatabase",
      "type": "databases",
      "apiVersion": "2014-04-01",
      ...
    }
  ]
}
```

For the child resource, the type is set to `databases` but its full resource type is `Microsoft.Sql/servers/databases`. You do not provide `Microsoft.Sql/servers/` because it is assumed from the parent resource type. The child resource name is set to `exampledatabase` but the full name includes the parent name. You do not provide `exampleserver` because it is assumed from the parent resource.

## Top-level child resource
You can define the child resource at the top level. You might use this approach if the parent resource is not deployed in the same template, or if want to use `copy` to create multiple child resources. With this approach, you must provide the full resource type, and include the parent resource name in the child resource name.

```json
{
  "name": "exampleserver",
  "type": "Microsoft.Sql/servers",
  "apiVersion": "2014-04-01",
  "resources": [ 
  ],
  ...
},
{
  "name": "exampleserver/exampledatabase",
  "type": "Microsoft.Sql/servers/databases",
  "apiVersion": "2014-04-01",
  ...
}
```

The database is a child resource to the server even though they are defined on the same level in the template.

## Next steps
* For recommendations about how to create templates, see [Best practices for creating Azure Resource Manager templates](resource-manager-template-best-practices.md).
* For an example of creating multiple child resources, see [Deploy multiple instances of resources in Azure Resource Manager templates](resource-group-create-multiple.md).
