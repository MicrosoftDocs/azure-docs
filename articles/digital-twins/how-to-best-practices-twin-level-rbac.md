---
# Mandatory fields.
title: Create twin-level RBAC with marker tags
titleSuffix: Azure Digital Twins
description: Understand how to create twin-level RBAC using marker tags.
author: jackiebecker
ms.author: jabecker # Microsoft employees only
ms.date: 5/12/2021
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Use marker tags for twin-level RBAC

While [Azure Digital Twins security](concepts-security.md) currently only supports instance-level role-based access control (RBAC), there are a few ways to implement twin-level RBAC in your solution. One method leverages **marker tags**, which are a flexible way of adding information at runtime when a twin is created. You can read more about marker tags in [How-to: Add tags to digital twins](how-to-use-tags.md). 

This article describes the marker tag strategy for implementing twin-level RBAC in your solution.

## Prerequisites

Before proceeding with creating twin-level RBAC for your solution, you should complete the following steps:
1. Set up an **Azure Digital Twins instance** and the required permissions for using it. If you don't have this already set up, follow the instructions in [How-to: Set up an instance and authentication](how-to-set-up-instance-portal.md). The instructions contain information to help you verify that you've completed each step successfully.
2. Review and familiarize yourself with the security details for Azure Digital Twins in [Concepts: Security for Azure Digital Twins solutions](concepts-security.md).
3. (Recommended) Complete the Azure Digital Twins tutorial, [Connect an end-to-end solution](tutorial-end-to-end.md). Having an end-to-end solution will allow you to concretely implement and test out twin-level RBAC. This tutorial includes setting up and [configuring permissions for](tutorial-end-to-end.md#configure-permissions-for-the-function-app) an Azure Functions app, which is a great way to test out the twin-level RBAC described in this article.

After completing these steps, you will have an Azure Digital Twins flow which includes instance-level RBAC for a function app user. Next, you can set up marker tags to control access to individual twins.

## Sample scenario

This article uses a sample scenario to explain the marker tag strategy. 

Imagine that you have an Azure Digital Twins instance which contains assets from three tenants represented in its graph: Earth Group, Fire Group, and Wind Group. The Earth and Fire groups should each respectively have access to a subset of twins, while the Wind group should have access to all twins in the graph.

:::image type="content" source="media/concepts-best-practices-twin-level-rbac/example-scenario.png" alt-text="Graphic of digital twins organized into groups. The Earth Group contains twins A, 1, and 2; Fire group contains twins B and 3; and Wind Group contains all twins in both Earth and Fire groups.":::

An important consideration here is that for this specific pool logic, we say that tenants can be assigned multiple roles (for instance, a tenant could be a member of both Earth Group and Fire Group), but each twin is only assigned one role. Therefore, a Wind Group user would need to be assigned a role for all of its subset groups (Fire Group, Earth Group) in order to have access to all resources. You may design your logical separations differently than this. 

Next, you'll read about how to implement marker tags to support the different permissions needed by the groups in this example.

## Create custom Azure RBAC roles 

To ensure tenants cannot reach across these defined boundaries, you'll add an additional layer of authentication on top of instance-level RBAC. In Azure RBAC, you are able to define custom roles. This process is explained in [Azure custom roles - Azure RBAC](../role-based-access-control/custom-roles.md).

For the sample scenario described [earlier](#sample-scenario), you can create custom roles for each group: **Fire**, **Earth**, and **Wind**. 

Then, use the identity associated with the function app from the [Prerequisites](#prerequisites) section to assign the custom roles to the function app. You can test that the twin-level RBAC is working for your app by assigning different role configurations to the function (such as all the roles, no roles, or only **Fire**) and verifying that access is working as expected for each situation.

## Add tags

Next, you'll re-create or update the models in your Azure Digital Twins instance to allow all twins to have a tag property.

To accomplish this, a tag property of type Map is defined in the model for each twin. Then, each twin can define any key/value pair within the tag property. Later, you can perform queries filtering by these tags.

Based on the sample scenario for this article, the addition to a twin model may look like this: 

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

For instructions on how to update an existing model in your instance, see [How-to: Mange models](how-to-manage-model.md#update-models).

Once twins contain the Map property, you can now "tag" twins with the roles that are allowed to access them. For instructions on updating twin property values, see [How-to: Manage digital twins](how-to-manage-twin.md#update-a-digital-twin).

## Query

Before accessing a resource, use the following code to fetch the roles associated with that tenant:

```C#
var roles = "['role1', 'role2'..'rolen']";
// in our case
var rolesExample = "['Fire', 'Earth', 'Wind']";
```

Now, when querying the graph on behalf of that tenant, you can include the following clause to only return twins that tenants with the specified roles have access to: 

```SQL
WHERE is_defined(tags.role) AND tags.role IN ['Fire', 'Earth', 'Wind'])
```

You should find that the query results are now scoped to the specified roles.

## Next steps

Read more about the concepts discussed in this article:
* [Azure RBAC](../role-based-access-control/overview.md)
* [Concepts: Security for Azure Digital Twins solutions](concepts-security.md)
* [How-to: Add tags to digital twins](how-to-use-tags.md)