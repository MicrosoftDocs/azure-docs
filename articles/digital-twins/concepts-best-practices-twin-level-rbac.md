---
# Mandatory fields.
title: Creating twin-level RBAC with marker tags
titleSuffix: Azure Digital Twins
description: Understand how to create twin-level RBAC using marker tags.
author: jackiebecker
ms.author: jabecker # Microsoft employees only
ms.date: 5/12/2021
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Leveraging marker tags for twin-level RBAC

## Prerequisites

To proceed with creating Twin-level RBAC for your solution, you will need to have:
* Set up an Azure Digital Twins instance
* Familiarized yourself with the content in [Concepts: Security for Azure Digital Twins solutions](concepts-security.md). 
* Run through Tutorial: [Connect an end-to-end solution](tutorial-end-to-end.md), with special attention to "Configure permissions for the function app". 
Upon completion of the above, you will have a flow which includes Instance-level RBAC for a Function app user. 

## Walkthrough

While Azure Digital Twins currently only supports Instance-level role-based access control, there are a few ways to implement Twin-level RBAC in your solution. One method leverages [marker tags](how-to-use-tags.md). Marker tags are a flexible way of adding information at runtime when a twin is created. To accomplish this, a tag property of type Map is defined in the model. Then, each twin can define any key/value pair within the tag property. You can perform queries filtering by these tags.

In a sample scenario, let's say you have an Azure Twin Instance which contains assets from three tenants represented in its graph: Earth Group, Wind Group, and Fire Group. Earth and Fire each respectively have access to a subset of Twins, while Wind has access to all Twins in the graph.

:::image type="content" source="media/concepts-best-practices-twin-level-rbac/example-scenario.png" alt-text="Graphic of digital twins organized into groups. The Earth Group contains twins A, 1, and 2; Fire group contains twins B and 3; and Wind Group contains all twins in both Earth and Fire groups.":::

To ensure tenants cannot reach across these defined boundaries, we will need an additional layer of authentication on top of Instance-level RBAC. In Azure RBAC, you are able to define custom roles (Azure custom roles - Azure RBAC | Microsoft Docs)—following the linked tutorial, we can create custom roles "Fire" "Earth" and "Wind". If following the tutorial above, we have already associated an identity with our Function app, and can assign our custom roles to our Function app. An important consideration here is that for this specific pool logic, we say that tenants can be assigned multiple roles (for instance, a tenant could be a member of both Earth Group and Fire Group), but each Twin is only assigned one role. Therefore, a Water Group user would need to be assigned a role for all of its subset groups (Fire Group, Earth Group) in order to have access to all resources. You may design your logical separations differently than this. 

Having done this, the next step is to update our Twin graph so that our Twins all have a tag property. For our scenario, that addition may look like: 

```json
{
    "@type": "Property",
    "name": "tags",
    "schema": {
        "@type": "Map",
        "mapKey": {
            "name": "role",
            "schema": "string"
        }
    }
}
```

You can now "tag" Twins with the roles that are allows to access them. In the Connect E2E tutorial, we made use of our service principal – we will do this again with logic surrounding Twin access. Before accessing a resource, you fetch the roles associated with that tenant.

```C#
var roles = "['role1', 'role2'..'rolen']";

// in our case
var rolesExample = "['Fire', 'Earth', 'Wind']";
```

Now when querying the graph on behalf of that tenant, you can include the following clause to only return Twins that tenants with the specified roles have access to: 

```SQL
WHERE is_defined(tags.role) AND tags.role IN ['Fire', 'Earth', 'Wind'])
```

## Next steps

Read more about related concepts:
* [Concepts: Security for Azure Digital Twins solutions](concepts-security.md)
* [Azure RBAC](../role-based-access-control/overview.md)
* [How-to: Add tags to digital twins](how-to-use-tags.md)