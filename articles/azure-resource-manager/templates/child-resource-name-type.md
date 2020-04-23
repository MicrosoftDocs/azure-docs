---
title: Child resources in templates
description: Describes how to set the name and type for child resources in an Azure Resource Manager template.
ms.topic: conceptual
ms.date: 08/26/2019
---
# Set name and type for child resources

Child resources are resources that exist only within the context of another resource. For example, a [virtual machine extension](/azure/templates/microsoft.compute/2019-03-01/virtualmachines/extensions) can't exist without a [virtual machine](/azure/templates/microsoft.compute/2019-03-01/virtualmachines). The extension resource is a child of the virtual machine.

In a Resource Manager template, you can specify the child resource either within the parent resource or outside of the parent resource. The following example shows the child resource included within the resources property of the parent resource.

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

The next example shows the child resource outside of the parent resource. You might use this approach if the parent resource isn't deployed in the same template, or if want to use [copy](copy-resources.md) to create more than one child resource.

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

The values you provide for the resource name and type vary based on whether the child resource is defined inside or outside of the parent resource.

## Within parent resource

When defined within the parent resource type, you format the type and name values as a single word without slashes.

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
        "location": "[parameters('location')]",
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

The full resource type is still **Microsoft.Network/virtualNetworks/subnets**. You don't provide **Microsoft.Network/virtualNetworks/** because it's assumed from the parent resource type.

The child resource name is set to **Subnet1** but the full name includes the parent name. You don't provide **VNet1** because it's assumed from the parent resource.

## Outside parent resource

When defined outside of the parent resource, you format the type and  with slashes to include the parent type and name.

```json
"type": "{resource-provider-namespace}/{parent-resource-type}/{child-resource-type}",
"name": "{parent-resource-name}/{child-resource-name}",
```

The following example shows a virtual network and subnet that are both defined at the root level. Notice that the subnet isn't included within the resources array for the virtual network. The name is set to **VNet1/Subnet1** and the type is set to **Microsoft.Network/virtualNetworks/subnets**. The child resource is marked as dependent on the parent resource because the parent resource must exist before the child resource can be deployed.

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
    "location": "[parameters('location')]",
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

## Next steps

* To learn about creating Azure Resource Manager templates, see [Authoring templates](template-syntax.md).

* To learn about the format of the resource name when referencing the resource, see the [reference function](template-functions-resource.md#reference).
