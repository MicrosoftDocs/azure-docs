---
title: Child resources in Bicep
description: Describes how to set the name and type for child resources in Bicep.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 06/23/2023
---

# Set name and type for child resources in Bicep

Child resources are resources that exist only within the context of another resource. For example, a [virtual machine extension](/azure/templates/microsoft.compute/virtualmachines/extensions) can't exist without a [virtual machine](/azure/templates/microsoft.compute/virtualmachines). The extension resource is a child of the virtual machine.

Each parent resource accepts only certain resource types as child resources. The hierarchy of resource types is available in the [Bicep resource reference](/azure/templates/).

This article show different ways you can declare a child resource.

### Training resources

If you would rather learn about child resources through step-by-step guidance, see [Deploy child and extension resources by using Bicep](/training/modules/child-extension-bicep-templates).

## Name and type pattern

In Bicep, you can specify the child resource either within the parent resource or outside of the parent resource. The values you provide for the resource name and resource type vary based on how you declare the child resource. However, the full name and type always resolve to the same pattern.

The **full name** of the child resource uses the pattern:

```bicep
{parent-resource-name}/{child-resource-name}
```

If you have more than two levels in the hierarchy, keep repeating parent names:

```bicep
{parent-resource-name}/{child-level1-resource-name}/{child-level2-resource-name}
```

The **full type** of the child resource uses the pattern:

```bicep
{resource-provider-namespace}/{parent-resource-type}/{child-resource-type}
```

If you have more than two levels in the hierarchy, keep repeating parent resource types:

```bicep
{resource-provider-namespace}/{parent-resource-type}/{child-level1-resource-type}/{child-level2-resource-type}
```

If you count the segments between `/` characters, the number of segments in the type is always one more than the number of segments in the name.

## Within parent resource

The following example shows the child resource included within the resources property of the parent resource.

```bicep
resource <parent-resource-symbolic-name> '<resource-type>@<api-version>' = {
  <parent-resource-properties>

  resource <child-resource-symbolic-name> '<child-resource-type>' = {
    <child-resource-properties>
  }
}
```

A nested resource declaration must appear at the top level of syntax of the parent resource. Declarations may be nested arbitrarily deep, as long as each level is a child type of its parent resource.

When defined within the parent resource type, you format the type and name values as a single segment without slashes. The following example shows a storage account with a child resource for the file service, and the file service has a child resource for the file share. The file service's name is set to `default` and its type is set to `fileServices`. The file share's name is set `exampleshare` and its type is set to `shares`.

:::code language="bicep" source="~/azure-docs-bicep-samples/syntax-samples/child-resource-name-type/insidedeclaration.bicep" highlight="9,12":::

The full resource types are still `Microsoft.Storage/storageAccounts/fileServices` and `Microsoft.Storage/storageAccounts/fileServices/shares`. You don't provide `Microsoft.Storage/storageAccounts/` because it's assumed from the parent resource type and version. The nested resource may optionally declare an API version using the syntax `<segment>@<version>`. If the nested resource omits the API version, the API version of the parent resource is used. If the nested resource specifies an API version, the API version specified is used.

The child resource names are set to `default` and `exampleshare` but the full names include the parent names. You don't provide `examplestorage` or `default` because they're assumed from the parent resource.

A nested resource can access properties of its parent resource. Other resources declared inside the body of the same parent resource can reference each other by using the symbolic names. A parent resource may not access properties of the resources it contains, this attempt would cause a cyclic-dependency.

To reference a nested resource outside the parent resource, it must be qualified with the containing resource name and the `::` operator. For example, to output a property from a child resource:

```bicep
output childAddressPrefix string = VNet1::VNet1_Subnet1.properties.addressPrefix
```

## Outside parent resource

The following example shows the child resource outside of the parent resource. You might use this approach if the parent resource isn't deployed in the same template, or if you want to use [a loop](loops.md) to create more than one child resource. Specify the parent property on the child with the value set to the symbolic name of the parent. With this syntax you still need to declare the full resource type, but the name of the child resource is only the name of the child.

```bicep
resource <parent-resource-symbolic-name> '<resource-type>@<api-version>' = {
  name: 'myParent'
  <parent-resource-properties>
}

resource <child-resource-symbolic-name> '<child-resource-type>@<api-version>' = {
  parent: <parent-resource-symbolic-name>
  name: 'myChild'
  <child-resource-properties>
}
```

When defined outside of the parent resource, you format the type and with slashes to include the parent type and name.

The following example shows a storage account, file service, and file share that are all defined at the root level.

:::code language="bicep" source="~/azure-docs-bicep-samples/syntax-samples/child-resource-name-type/outsidedeclaration.bicep" highlight="10,12,15,17":::

Referencing the child resource symbolic name works the same as referencing the parent.

## Full resource name outside parent

You can also use the full resource name and type when declaring the child resource outside the parent. You don't set the parent property on the child resource. Because the dependency can't be inferred, you must set it explicitly.

:::code language="bicep" source="~/azure-docs-bicep-samples/syntax-samples/child-resource-name-type/fullnamedeclaration.bicep" highlight="10,11,17,18":::

> [!IMPORTANT]
> Setting the full resource name and type isn't the recommended approach. It's not as type safe as using one of the other approaches. For more information, see [Linter rule: use parent property](./linter-rule-use-parent-property.md).

## Next steps

* To learn about creating Bicep files, see [Understand the structure and syntax of Bicep files](./file.md).
* To learn about the format of the resource name when referencing the resource, see the [reference function](./bicep-functions-resource.md#reference).
