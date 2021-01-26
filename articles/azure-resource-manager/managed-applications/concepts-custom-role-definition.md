---
title: Overview of custom role definitions
description: Describes the concept of creating custom role definitions for managed applications. 
ms.topic: conceptual
ms.author: jobreen
author: jjbfour
ms.date: 09/16/2019
---

# Custom role definition artifact in Azure Managed Applications

Custom role definition is an optional artifact in managed applications. It's used to determine what permissions the managed application needs to perform its functions.

This article provides an overview of the custom role definition artifact and its capabilities.

## Custom role definition artifact

You need to name the custom role definition artifact customRoleDefinition.json. Place it at the same level as createUiDefinition.json and mainTemplate.json in the .zip package that creates a managed application definition. To learn how to create the .zip package and publish a managed application definition, see [Publish a managed application definition.](publish-service-catalog-app.md)

## Custom role definition schema

The customRoleDefinition.json file has a top-level `roles` property that's an array of roles. These roles are the permissions that the managed application needs to function. Currently, only built-in roles are allowed, but you can specify multiple roles. A role can be referenced by the ID of the role definition or by the role name.

Sample JSON for custom role definition:

```json
{
    "contentVersion": "0.0.0.1",
    "roles": [
        {
            "properties": {
                "roleName": "Contributor"
            }
        },
        {
            "id": "acdd72a7-3385-48ef-bd42-f606fba81ae7"
        },
        {
            "id": "/providers/Microsoft.Authorization/roledefinitions/9980e02c-c2be-4d73-94e8-173b1dc7cf3c"
        }
    ]
}
```

## Roles

A role is composed of either a `$.properties.roleName` or an `id`:

```json
{
    "id": null,
    "properties": {
        "roleName": "Contributor"
    }
}
```

> [!NOTE]
> You can use either the `id` or `roleName` field. Only one is required. These fields are used to look up the role definition that should be applied. If both are supplied, the `id` field will be used.

|Property|Required?|Description|
|---------|---------|---------|
|id|Yes|The ID of the built-in role. You can use the full ID or just the GUID.|
|roleName|Yes|The name of the built-in role.|