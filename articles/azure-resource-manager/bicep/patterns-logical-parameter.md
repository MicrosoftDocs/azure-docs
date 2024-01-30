---
title: Logical parameter pattern
description: Describes the logical parameter pattern.
author: johndowns
ms.author: jodowns
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 06/23/2023
---
# Logical parameter pattern

Use parameters to specify the logical definition of a resource, or even of multiple resources. The Bicep file converts the logical parameter to deployable resource definitions. By following this pattern, you can separate *what's* deployed from *how* it's deployed.

## Context and problem

In complex deployments, array parameters and loops are used to create a set of resources or resource properties. If you create a parameter that defines the details of a resource, you create parameters that are difficult to understand and work with.

## Solution

Define parameters that accept simplified values, or values that are business domain-specific instead of Azure resource-specific. Build logic into your Bicep file to convert the simplified values to Azure resource definitions.

Often, you'll use a [loop](loops.md) to translate the logical values defined in parameters to the property values expected by the resource definition.

When you use this pattern, you can easily apply default values for properties that don't need to change between resources. You can also use [variables](variables.md) and [functions](bicep-functions.md) to determine the values of resource properties automatically based on your own business rules.

By using the Logical parameter pattern, you can deploy complex sets of resources while keeping your template's parameters simple and easy to work with.

## Example 1: Virtual network subnets

This example illustrates how you can use the pattern to simplify the definition of new subnets, and to add business logic that determines the resource's configuration.

In this example, you define a parameter that specifies the list of subnets that should be created in a virtual network. Each subnet's definition also includes a property called `allowRdp`. This property indicates whether the subnet should be associated with a network security group that allows inbound remote desktop traffic:

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/patterns-logical-parameter/virtual-network.bicep" range="4-15" :::

The Bicep file then defines a variable to convert each of the logical subnet definitions to the subnet definition required by Azure. The network security group is assigned to the subnet when the `allowRdp` property is set to `true`.

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/patterns-logical-parameter/virtual-network.bicep" range="17-25" :::

Finally, the Bicep file defines the virtual network and uses the variable to configure the subnets:

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/patterns-logical-parameter/virtual-network.bicep" range="51-62" highlight="10" :::

[Refer to the complete example.](https://github.com/Azure/azure-docs-bicep-samples/blob/main/samples/patterns-logical-parameter/virtual-network.bicep?azure-portal=true)

## Example 2: Service Bus queue

This example demonstrates how you can use the pattern to apply a consistent set of configuration across multiple resources that are defined based on a parameter.

In this example, you define a parameter with a list of queue names for an Azure Service Bus queue:

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/patterns-logical-parameter/service-bus.bicep" range="5-8" :::

You then define the queue resources by using a loop, and configure every queue to automatically forward dead-lettered messages to another centralized queue:

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/patterns-logical-parameter/service-bus.bicep" range="30-32, 36-39" :::

[Refer to the complete example.](https://github.com/Azure/azure-docs-bicep-samples/blob/main/samples/patterns-logical-parameter/service-bus.bicep?azure-portal=true)

## Example 3: Resources for a multitenant solution

This example illustrates how you might use the pattern when building a multitenant solution. The Bicep deployment creates complex sets of resources based on a logical list of tenants, and uses modules to simplify the creation of shared and tenant-specific resources. Every tenant gets their own database in Azure SQL, and their own custom domain configured in Azure Front Door.

In this example, you define a parameter that specifies the list of tenants. The definition of a tenant is simply the tenant identifier and their custom domain name:

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/patterns-logical-parameter/resources.bicep" range="15-24" :::

The main Bicep file defines the shared resources, and then uses a module to loop through the tenants:

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/patterns-logical-parameter/all-tenant-resources.bicep" range="8-16" :::

Within the module, the tenant-specific resources are deployed.

[Refer to the complete example.](https://github.com/Azure/azure-docs-bicep-samples/blob/main/samples/patterns-logical-parameter/all-tenant-resources.bicep?azure-portal=true)

## Considerations

- When you're developing or debugging your Bicep file, consider creating the mapping variable without defining a resource. Then, define an [output](outputs.md) with the variable's value so that you can see the result of the mapping.
- You can use [conditions](conditional-resource-deployment.md) to selectively deploy resources based on logical parameter values.
- When creating resource names dynamically, ensure the names meet the [requirements for the resource that you're deploying](../management/resource-name-rules.md). You might need to [generate a name](patterns-name-generation.md) for some resources rather than accepting names directly through parameters.

## Next steps

[Learn about the shared variable file pattern.](patterns-shared-variable-file.md)
