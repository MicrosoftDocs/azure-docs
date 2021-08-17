---
title: Child resources in Bicep
description: Describes how to set the name and type for child resources in Bicep.
author: mumian
ms.author: jgao
ms.topic: conceptual
ms.date: 06/01/2021
---

# Set name and type for child resources in Bicep

Child resources are resources that exist only within the context of another resource. For example, a [virtual machine extension](/azure/templates/microsoft.compute/virtualmachines/extensions) can't exist without a [virtual machine](/azure/templates/microsoft.compute/virtualmachines). The extension resource is a child of the virtual machine.

Each parent resource accepts only certain resource types as child resources. The resource type for the child resource includes the resource type for the parent resource. For example, `Microsoft.Web/sites/config` and `Microsoft.Web/sites/extensions` are both child resources of the `Microsoft.Web/sites`. The accepted resource types are specified in the [template schema](https://github.com/Azure/azure-resource-manager-schemas) of the parent resource.

In Bicep, you can specify the child resource either within the parent resource or outside of the parent resource. The values you provide for the resource name and resource type vary based on whether the child resource is defined inside or outside of the parent resource.

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

When defined within the parent resource type, you format the type and name values as a single segment without slashes. The following example shows a storage account with a file service and file share. The file service's name is set to **default** and its type is set to **fileServices**. The file share's name is set **exampleshare** and its type is set to **shares**.

```bicep
resource storage 'Microsoft.Storage/storageAccounts@2021-02-01' = {
  name: 'examplestorage'
  location: resourceGroup().location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }

  resource service 'fileServices' = {
    name: 'default'

    resource share 'shares' = {
      name: 'exampleshare'
    }
  }
}
```

The full resource types are still `Microsoft.Storage/storageAccounts/fileServices` and `Microsoft.Storage/storageAccounts/fileServices/shares`. You don't provide `Microsoft.Storage/storageAccounts/` because it's assumed from the parent resource type and version. The nested resource may optionally declare an API version using the syntax `<segment>@<version>`. If the nested resource omits the API version, the API version of the parent resource is used. If the nested resource specifies an API version, the API version specified is used.

The child resource names are set to **default** and **exampleshare** but the full names include the parent names. You don't provide **examplestorage** or **default** because they're assumed from the parent resource.

A nested resource can access properties of its parent resource. Other resources declared inside the body of the same parent resource can reference each other by using the symbolic names. A parent resource may not access properties of the resources it contains, this attempt would cause a cyclic-dependency.

To reference a nested resource outside the parent resource, it must be qualified with the containing resource name and the `::` operator. For example, to output a property from a child resource:

```bicep
output childAddressPrefix string = VNet1::VNet1_Subnet1.properties.addressPrefix
```

## Outside parent resource

The following example shows the child resource outside of the parent resource. You might use this approach if the parent resource isn't deployed in the same template, or if want to use [a loop](loop-resources.md) to create more than one child resource. Specify the parent property on the child with the value set to the symbolic name of the parent. With this syntax you still need to declare the full resource type, but the name of the child resource is only the name of the child.

```bicep
resource <parent-resource-symbolic-name> '<resource-type>@<api-version>' = {
  name: 'myParent'
  <parent-resource-properties>
}

resource <child-resource-symbolic-name> '<child-resource-type>@<api-version>' = {
  parent: 'myParent'
  name: 'myChild'
  <child-resource-properties>
}
```

When defined outside of the parent resource, you format the type and with slashes to include the parent type and name.

The following example shows a storage account, file service, and file share that are all defined at the root level.

```bicep
resource storage 'Microsoft.Storage/storageAccounts@2021-02-01' = {
  name: 'examplestorage'
  location: resourceGroup().location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}

resource service 'Microsoft.Storage/storageAccounts/fileServices@2021-02-01' = {
  name: 'default'
  parent: storage
}

resource share 'Microsoft.Storage/storageAccounts/fileServices/shares@2021-02-01' = {
  name: 'exampleshare'
  parent: service
}
```

Referencing the child resource symbolic name works the same as referencing the parent.

## Next steps

* To learn about creating Bicep files, see [Understand the structure and syntax of Bicep files](./file.md).
* To learn about the format of the resource name when referencing the resource, see the [reference function](./bicep-functions-resource.md#reference).
