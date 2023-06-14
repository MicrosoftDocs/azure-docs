---
title: Create UI definition referencing functions
description: Describes the functions to use when constructing UI definitions for Azure portal that reference other objects.
ms.topic: conceptual
ms.date: 07/13/2020
---

# CreateUiDefinition referencing functions

The functions to use when referencing outputs from the properties or context of a CreateUiDefinition file.

## basics

Returns the output values of an element that is defined in the [Basics](create-uidefinition-overview.md#basics) step. Pass in the name of the element as a parameter to this function.

To get the output values of elements in other steps, use the [steps()](#steps) function.

The following example returns the output of the element named `clusterName` in the Basics step:

```json
"[basics('clusterName')]"
```

The returned values vary based on the type of element that is retrieved.

## location

Returns the location selected in the Basics step or the current context.

The following example returns a value like `"westus"`:

```json
"[location()]"
```

## resourceGroup

Returns details about the resourceGroup selected in the Basics step or the current context.

The following example:

```json
"[resourceGroup()]"
```

Returns the following properties:

```json
{
    "mode": "New" or "Existing",
    "name": "{resourceGroupName}",
    "location": "{resourceGroupLocation}"
}
```

You can get any particular value with dot notation.

```json
"[resourceGroup().name]"
```

## steps

Returns the elements on a specified step. Pass in the name of the step as a parameter to this function. From the returned elements, you can get particular property values.

To get the output values of elements in the Basics step, use the [basics()](#basics) function.

The following example returns the step named `vmParameters`. On that step is an element named `adminUsername`.

```json
"[steps('vmParameters').adminUsername]"
```

## subscription

Returns properties for the subscription selected in the Basics step or the current context.

The following example:

```json
"[subscription()]"
```

Returns the following properties:

```json
{
    "id": "/subscriptions/{subscription-id}",
    "subscriptionId": "{subscription-id}",
    "tenantId": "{tenant-id}",
    "displayName": "{name-of-subscription}"
}
```

## Next steps

* For an introduction to developing the portal interface, see [CreateUiDefinition.json for Azure managed application's create experience](create-uidefinition-overview.md).
