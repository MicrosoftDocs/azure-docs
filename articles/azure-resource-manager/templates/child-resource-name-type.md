---
title: Child resources in templates
description: Describes how to set the name and type for child resources in an Azure Resource Manager template (ARM template).
ms.topic: conceptual
ms.date: 04/23/2021
---

# Set name and type for child resources

Child resources are resources that exist only within the context of another resource. For example, a [virtual machine extension](/azure/templates/microsoft.compute/virtualmachines/extensions) can't exist without a [virtual machine](/azure/templates/microsoft.compute/virtualmachines). The extension resource is a child of the virtual machine.

Each parent resource accepts only certain resource types as child resources. The resource type for the child resource includes the resource type for the parent resource. For example, `Microsoft.Web/sites/config` and `Microsoft.Web/sites/extensions` are both child resources of the `Microsoft.Web/sites`. The accepted resource types are specified in the [template schema](https://github.com/Azure/azure-resource-manager-schemas) of the parent resource.

[!INCLUDE [Bicep preview](../../../includes/resource-manager-bicep-preview.md)]

In an Azure Resource Manager template (ARM template), you can specify the child resource either within the parent resource or outside of the parent resource. The values you provide for the resource name and resource type vary based on whether the child resource is defined inside or outside of the parent resource.

## Within parent resource

The following example shows the child resource included within the resources property of the parent resource.

# [JSON](#tab/json)

```json
"resources": [
  {
    <parent-resource>
    "resources": [
      <child-resource>
    ]
  }
]
```

Child resources can only be defined five levels deep.

When defined within the parent resource type, you format the type and name values as a single segment without slashes.

```json
"type": "{child-resource-type}",
"name": "{child-resource-name}",
```

The following example shows a virtual network and with a subnet. Notice that the subnet is included within the resources array for the virtual network. The name is set to **Subnet1** and the type is set to **subnets**. The child resource is marked as dependent on the parent resource because the parent resource must exist before the child resource can be deployed.

```json
"resources": [
  {
    "type": "Microsoft.Network/virtualNetworks",
    "apiVersion": "2018-10-01",
    "name": "VNet1",
    "location": "[parameters('location')]",
    "properties": {
      "addressSpace": {
        "addressPrefixes": [
          "10.0.0.0/16"
        ]
      }
    },
    "resources": [
      {
        "type": "subnets",
        "apiVersion": "2018-10-01",
        "name": "Subnet1",
        "dependsOn": [
          "VNet1"
        ],
        "properties": {
          "addressPrefix": "10.0.0.0/24"
        }
      }
    ]
  }
]
```

The full resource type is still `Microsoft.Network/virtualNetworks/subnets`. You don't provide `Microsoft.Network/virtualNetworks/` because it's assumed from the parent resource type.

The child resource name is set to **Subnet1** but the full name includes the parent name. You don't provide **VNet1** because it's assumed from the parent resource.

# [Bicep](#tab/bicep)

```bicep
resource <parent-resource-symbolic-name> '<resource-type>@<api-version>' = {
  <parent-resource-properties>

  resource <child-resource-symbolic-name> '<child-resource-type>' = {
    <child-resource-properties>
  }
}
```

A nested resource declaration must appear at the top level of syntax of the parent resource. Declarations may be nested arbitrarily deep, as long as each level is a child type of its parent resource.

When defined within the parent resource type, you format the type and name values as a single segment without slashes. The following example shows a virtual network and with a subnet. Notice that the subnet is included within the resources array for the virtual network. The name is set to **Subnet1** and the type is set to **subnets**.

```bicep
param location string

resource VNet1 'Microsoft.Network/virtualNetworks@2018-10-01' = {
  name: 'VNet1'
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [
        '10.0.0.0/16'
      ]
    }
  }

  resource VNet1_Subnet1 'subnets' = {
    name: 'Subnet1'
    properties: {
      addressPrefix: '10.0.0.0/24'
    }
  }
}
```

The full resource type is still `Microsoft.Network/virtualNetworks/subnets`. You don't provide `Microsoft.Network/virtualNetworks/` because it's assumed from the parent resource type and version. The nested resource may optionally declare an API version using the syntax `<segment>@<version>`. If the nested resource omits the API version, the API version of the parent resource is used. If the nested resource specifies an API version, the API version specified is used.

The child resource name is set to **Subnet1** but the full name includes the parent name. You don't provide VNet1 because it's assumed from the parent resource.

To access the child resource symbolic name, you need to use the `::` operator. For example, to output a property from a child resource:

```bicep
output childAddressPrefix string = VNet1::VNet1_Subnet1.properties.addressPrefix
```

A nested resource can access properties of its parent resource. Other resources declared inside the body of the same parent resource can reference each other and the typical rules about cyclic-dependencies apply. A parent resource may not access properties of the resources it contains, this would cause a cyclic-dependency.

---

## Outside parent resource

The following example shows the child resource outside of the parent resource. You might use this approach if the parent resource isn't deployed in the same template, or if want to use [copy](copy-resources.md) to create more than one child resource.

# [JSON](#tab/json)

```json
"resources": [
  {
    <parent-resource>
  },
  {
    <child-resource>
  }
]
```

When defined outside of the parent resource, you format the type and with slashes to include the parent type and name.

```json
"type": "{resource-provider-namespace}/{parent-resource-type}/{child-resource-type}",
"name": "{parent-resource-name}/{child-resource-name}",
```

The following example shows a virtual network and subnet that are both defined at the root level. Notice that the subnet isn't included within the resources array for the virtual network. The name is set to **VNet1/Subnet1** and the type is set to `Microsoft.Network/virtualNetworks/subnets`. The child resource is marked as dependent on the parent resource because the parent resource must exist before the child resource can be deployed.

```json
"resources": [
  {
    "type": "Microsoft.Network/virtualNetworks",
    "apiVersion": "2018-10-01",
    "name": "VNet1",
    "location": "[parameters('location')]",
    "properties": {
      "addressSpace": {
        "addressPrefixes": [
          "10.0.0.0/16"
        ]
      }
    }
  },
  {
    "type": "Microsoft.Network/virtualNetworks/subnets",
    "apiVersion": "2018-10-01",
    "name": "VNet1/Subnet1",
    "dependsOn": [
      "VNet1"
    ],
    "properties": {
      "addressPrefix": "10.0.0.0/24"
    }
  }
]
```

# [Bicep](#tab/bicep)

```bicep
resource <parent-resource-symbolic-name> '<resource-type>@<api-version>' = {
  <parent-resource-properties>
}

resource <child-resource-symbolic-name> '<child-resource-type>@<api-version>' = {
  <child-resource-properties>
}
```

When defined outside of the parent resource, you format the type and with slashes to include the parent type and name.

The following example shows a virtual network and subnet that are both defined at the root level. Notice that the subnet isn't included within the resources array for the virtual network. The name is set to **VNet1/Subnet1** and the type is set to `Microsoft.Network/virtualNetworks/subnets`. The child resource is marked as dependent on the parent resource because the parent resource must exist before the child resource can be deployed.

```bicep
param location string

resource VNet1 'Microsoft.Network/virtualNetworks@2018-10-01' = {
  name: 'VNet1'
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [
        '10.0.0.0/16'
      ]
    }
  }
}

resource VNet1_Subnet1 'Microsoft.Network/virtualNetworks/subnets@2018-10-01' = {
  name: '${VNet1.name}/Subnet1'
  properties: {
    addressPrefix: '10.0.0.0/24'
  }
}
```

---

## Next steps

* To learn about creating ARM templates, see [Understand the structure and syntax of ARM templates](template-syntax.md).
* To learn about the format of the resource name when referencing the resource, see the [reference function](template-functions-resource.md#reference).
