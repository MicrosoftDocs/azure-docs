---
title: Name generation pattern
description: Describes the name generation pattern.
author: johndowns
ms.author: jodowns
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 06/23/2023
---
# Name generation pattern

Within your Bicep files, use string interpolation and Bicep functions to create resource names that are unique, deterministic, meaningful, and different for each environment that you deploy to.

## Context and problem

In Azure, the name you give a resource is important. Names help you and your team to identify the resource. For many services, the resource name forms part of the DNS name you use to access the resource. Names can't easily be changed after the resource is created.

When planning a resource's name, you need to ensure it is:

- **Unique:** Azure resource names need to be unique, but the scope of uniqueness depends on the resource.
- **Deterministic:** It's important that your Bicep file can be repeatedly deployed without recreating existing resources. When you redeploy your Bicep file with the same parameters, resources should maintain the same names.
- **Meaningful:** Names give you and your team important information about the purpose of the resource. Where possible, use names that provide some indication of the purpose of the resource.
- **Distinct for each environment:** It's common to deploy to multiple environments, such as test, staging, and production, as part of your rollout process.
- **Valid for the specific resource:** [Each Azure resource has a set of guidelines you must follow when creating a valid resource name.](../management/resource-name-rules.md) These include maximum lengths, allowed characters, and whether the resource name must start with a letter.

> [!NOTE]
> Your organization may also have its own naming convention that you need to follow. The [Azure Cloud Adoption Framework provide guidance](/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming) about how to create a naming strategy for your organization. If you have a strict naming convention to follow and the names it generates are distinctive and unique, you might not need to follow this pattern.

## Solution

Use Bicep's [string interpolation](bicep-functions-string.md#concat) to generate resource names as [variables](variables.md). If the resource requires a globally unique name, use the [uniqueString()](bicep-functions-string.md#uniquestring) function to generate part of the resource name. Prepend or append meaningful information to ensure your resources are easily identifiable.

> [!NOTE]
> Some Azure resources, such as Azure RBAC role definitions and role assignments, need to have globally unique identifiers (GUIDs) as their names. Use the [guid() function](bicep-functions-string.md#guid) to generate names for these resources.

If you're creating reusable Bicep code, you should consider defining names as [parameters](parameters.md). Use a [default parameter value](parameters.md#default-value) to define a default name that can be overridden. Default values help to make your Bicep files more reusable, ensuring that users of the file can define their own names if they need to follow a different naming convention.

## Example 1: Organizational naming convention

The following example generates the names for an App Service app and plan. It follows an organizational convention that includes a resource type code (`app` or `plan`), the application or workload name (`contoso`), the environment name (specified by a parameter), and a string that ensures uniqueness by using the `uniqueString()` function with a seed value of the resource group's ID.

Although App Service plans don't require globally unique names, the plan name is constructed using the same format to ensure compliance with the organization's policy.

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/patterns-name-generation/app-service.bicep" range="1-8, 13-17, 23" highlight="3-4" :::

## Example 2

The following example generates the names for two storage accounts for a different organization without a naming convention. This example again uses the `uniqueString()` function with the resource group's ID. A short string is prepended to the generated names to ensure that each of the two storage accounts has a distinct name. This also helps to ensure that the names begin with a letter, which is a requirement for storage accounts.

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/patterns-name-generation/storage.bicep" range="3-8, 14-18, 24" highlight="1-2" :::

## Considerations

- Ensure you verify the scope of the uniqueness of your resource names. Use appropriate seed values for the [uniqueString() function](bicep-functions-string.md#uniquestring) to ensure that you can reuse the Bicep file across Azure resource groups and subscriptions.
  > [!TIP]
  > In most situations, the fully qualified resource group ID is a good option for the seed value for the `uniqueString` function:
  >
  > ```bicep
  > var uniqueNameComponent = uniqueString(resourceGroup().id)
  > ```
  >
  > The name of the resource group (`resourceGroup().name`) may not be sufficiently unique to enable you to reuse the file across subscriptions.
- Avoid changing the seed values for the `uniqueString()` function after resources have been deployed. Changing the seed value results in new names, and might affect your production resources.

## Next steps

[Learn about the shared variable file pattern.](patterns-shared-variable-file.md)
