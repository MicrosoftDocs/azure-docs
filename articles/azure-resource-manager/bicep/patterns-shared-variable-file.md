---
title: Shared variable file pattern
description: Describes the shared variable file pattern.
author: johndowns
ms.author: jodowns
ms.topic: conceptual
ms.date: 08/08/2021
---
# Shared variable file pattern

Create shared array variables by putting them in a JSON file. Load the shared JSON file within your Bicep file. Concatenate the shared values with resource-specific values.

## Context and problem

When you define some resources, you frequently use a set of similar array values, along with values that are specific to the resource you're deploying.

You might consider duplicating the values each time you declare the resource, such as by copying and pasting the values. However, this is error-prone, and when you need to make changes you need to update each resource definition to keep it in sync with the others. Additionally, by mixing the shared variables with the resource-specific variables, it's harder for someone to understand the distinction between the two categories of variables.

<!-- TODO Can't just use a simple module because you need to combine multiple lists or variables together -->

## Solution

Create a JSON file that includes the variables you need to share. Use the `json()` and `loadTextContent()` Bicep functions to load the file and access the variables, and use the `concat()` function to combine the shared values with any custom values for the specific resource.

## Example

Suppose you have have multiple Bicep file that define network security groups (NSG). You have a common set of security rules that must be applied to each NSG, and then you have application-specific rules that must be added.

Define a JSON file that includes the common security rules:

::: code language="json" source="code/patterns-shared-variable-file/shared-rules.json" :::

In your Bicep file, declare a variable that imports the shared security rules:

::: code language="bicep" source="code/patterns-shared-variable-file/main.bicep" range="5" :::

Create a variable array that represents the custom rules for this specific NSG:

::: code language="bicep" source="code/patterns-shared-variable-file/main.bicep" range="6-21" :::

Define the NSG resource, and use the `concat()` function to combine the two arrays together:

::: code language="bicep" source="code/patterns-shared-variable-file/main.bicep" range="23-29" highlight="5" :::

## Next steps

[Return to the list of patterns for Bicep code.](patterns-overview.md)
