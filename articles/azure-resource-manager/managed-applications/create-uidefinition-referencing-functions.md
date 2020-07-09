---
title: Create UI definition functions
description: Describes the functions to use when constructing UI definitions for Azure portal.
author: tfitzmac

ms.topic: conceptual
ms.date: 07/09/2020
ms.author: tomfitz

---
# CreateUiDefinition referencing functions

These functions can be used to reference outputs from the properties or context of a CreateUiDefinition.

## basics

Returns the output values of an element that is defined in the Basics step.

The following example returns the output of the element named `clusterName` in the Basics step:

```json
"[basics('clusterName')]"
```

## location

Returns the location selected in the Basics step or the current context.

The following example could return `"westus"`:

```json
"[location()]"
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

 

## steps

Returns the output values of an element that is defined in the specified step. To get the output values of elements in the Basics step, use `basics()` instead.

The following example returns the output of the element named `adminUsername` in the step named `vmParameters`:

```json
"[steps('vmParameters').adminUsername]"
```

## Next steps

* For an introduction to developing the portal interface, see [CreateUiDefinition.json for Azure managed application's create experience](create-uidefinition-overview.md).

