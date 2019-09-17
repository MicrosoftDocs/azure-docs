---
title: Overview of custom role definitions in Azure Managed Applications | Microsoft Docs
description: Describes the concept of creating custom role definitions for managed applications. 
services: managed-applications
ms.service: managed-applications
ms.topic: conceptual
ms.author: jobreen
author: jjbfour
ms.date: 09/16/2019
---

# Custom role definition artifact in Azure Managed Applications

Custom role definition is an optional artifact in managed applications. It is used to determine what permissions the managed application needs to perform its functions.

This article provides an overview of custom role definition artifact and its capabilities.

## Custom role definition artifact

The custom role definition artifact must be named **customRoleDefinition.json** and placed at the same level as **createUiDefinition.json** and **mainTemplate.json** in the .zip package that creates a managed application definition. To learn how to create the .zip package and publish a managed application definition, see [Publish an managed application definition](publish-managed-app-definition-quickstart.md)

## Custom role definition schema

The **customRoleDefinition.json** file has only one top level `roles` property, which is an array of roles. Each of these roles are the permissions that the managed application needs to function. Currently, only built-in roles are allowed, but multiple roles can be specified. The role can be referenced by the ID of the role definition or by the role name.

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

## Role

A role is composed of either a `$.properties.roleName` or `id`.

```json
{
    "id": null,
    "properties": {
        "roleName": "Contributor"
    }
}
```

> [!Note]
> Only one of either the `id` or `roleName` field is required. These fields are used to look up the role definition to apply.

|Property|Required|Description|
|---------|---------|---------|
|ID|Yes*|The ID of the built-in role. This property can be the full ID or just the GUID.|
|roleName|Yes*|The name of the built-in role.|