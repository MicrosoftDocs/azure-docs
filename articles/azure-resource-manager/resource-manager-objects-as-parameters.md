---
title: Azure Resource Manager Templates - Objects as Parameters | Microsoft Docs
description: Describes how to extend the functionality of Azure Resource Manager templates to use objects as parameters
services: azure-resource-manager, guidance
documentationcenter: na
author: petertay
manager: christb
editor: 

ms.service: guidance
ms.topic: article
ms.date: 05/01/2017
ms.author: mspnp

---

# Patterns for extending the functionality of Azure Resource Manager templates - objects as parameters

Azure Resource Manager templates support parameters to specify values to customize a resource deployment. While this feature is useful and allows you to create complex deployments, a single template is limited to 255 parameters. If you use a parameter for each property in a resource and you have a large deployment, you might run out of parameters.

## Create object as parameter

One way to solve this problem is to use an object as a parameter. The pattern is to specify a parameter as an object in your template, then provide the object as a value or an array of values. You refer to its subproperties using the `parameter()` function and dot operator. For example:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
      "VNetSettings":{"type":"object"}
  },
  "variables": {},
  "resources": [
    {
      "apiVersion": "2015-06-15",
      "type": "Microsoft.Network/virtualNetworks",
      "name": "[parameters('VNetSettings').name]",
      "location":"[resourceGroup().location]",
      "properties": {
          "addressSpace":{
              "addressPrefixes": [
                  "[parameters('VNetSettings').addressPrefixes[0].addressPrefix]"
              ]
          },
          "subnets":[
              {
                  "name":"[parameters('VNetSettings').subnets[0].name]",
                  "properties": {
                      "addressPrefix": "[parameters('VNetSettings').subnets[0].addressPrefix]"
                  }
              },
              {
                  "name":"[parameters('VNetSettings').subnets[1].name]",
                  "properties": {
                      "addressPrefix": "[parameters('VNetSettings').subnets[1].addressPrefix]"
                  }
              }
          ]
        }
    }
  ],          
  "outputs": {}
}

```

The corresponding parameter file looks like:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters":{ 
      "VNetSettings":{
          "value":{
              "name":"VNet1",
              "addressPrefixes": [
                  { 
                      "name": "firstPrefix",
                      "addressPrefix": "10.0.0.0/22"
                  }
              ],
              "subnets":[
                  {
                      "name": "firstSubnet",
                      "addressPrefix": "10.0.0.0/24"
                  },
                  {
                      "name":"secondSubnet",
                      "addressPrefix":"10.0.1.0/24"
                  }
              ]
          }
      }
  }
}
```

In this example all the values specified for the VNet come from a single parameter, `VNetSettings`. This pattern is useful for property value management because you to keep all the values for a particular resource in single object. And while this example uses an object as a parameter, you can also use an array of objects as a parameter. You refer to the objects using an index into the array.

## Use object instead of multiple arrays

You may have used a similar pattern to create multiple instances of a resource by creating multiple arrays of property values and iterating through each array to select the value. This pattern works well when creating multiple resources of the same type, but it can be troublesome when used to create child resources. 

There's two reasons for this issue. First, Resource Manager attempts to deploy child resources in parallel, but your deployment fails when two child resources update the parent simultaneously. 

Second, each property value array is iterated in parallel and if the shape of each array is not the same shape an error occurs. For example, consider the following property arrays:

```json
"variables": {
    "firstProperty": [
        {
            "name": "A",
            "type": "typeA"
        },
        {
            "name": "B",
            "type": "typeB"
        },
        {
            "name": "C",
            "type": "typeC"
        }
    ],
    "secondProperty": [
        "one","two"
    ]
}
```

The typical pattern to assign these values to properties inside a copy loop is to access the property using the `variables()` function and use `copyIndex()` as an index into the array. For example:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    ...
    "copy": {
        "name": "copyLoop1",
        "count": "[length(variables('firstProperty'))]"
    },
    ...
    "properties": {
        "name": { "value": "[variables('firstProperty')[copyIndex()].name]" },
        "type": { "value": "[variables('firstProperty')[copyIndex()].type]" },
        "number": { "value": "[variables('secondProperty')[copyIndex()]]" }
    }
}
```
Notice that the `count` of the copy loop is based on the number of properties in the `firstProperty` array. However, there is not the same number of properties in the `secondProperty` array. Validation fails for this template because the length of the `secondProperty` array is not the same length.

However, if you include all the properties a single object, it is much easier to see when a value is missing. For example:

```json
"variables": {
    "propertyObject": [
        {
            "name": "A",
            "type": "typeA",
            "number": "one"
        },
        {
            "name": "B",
            "type": "typeB",
            "number": "two"
        },
        {
            "name": "C",
            "type": "typeC"
        }
    ]
}
```

## Use with sequential copy

This pattern becomes even more useful when combined with the [sequential copy pattern](resource-manager-sequential-loop.md), particularly for deploying child resources. The following example template deploys a network security group (NSG) with two security rules. The first resource named `NSG1` deploys the NSG. The second resource group named `loop-0` performs two functions: first, it `dependsOn` the NSG so its deployment doesn't begin until `NSG1` is completed, and it is the first iteration of the sequential loop. The third resource is a nested template that deploys the security rules using an object for its parameter values as in the last example.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
      "networkSecurityGroupsSettings": {"type":"object"}
  },
  "variables": {},
  "resources": [
    {
      "apiVersion": "2015-06-15",
      "type": "Microsoft.Network/networkSecurityGroups",
      "name": "NSG1",
      "location":"[resourceGroup().location]",
      "properties": {
          "securityRules":[]
      }
    },
    {
        "apiVersion": "2015-01-01",
        "type": "Microsoft.Resources/deployments",
        "name": "loop-0",
        "dependsOn": [
            "NSG1"
        ],
        "properties": {
            "mode":"Incremental",
            "parameters":{},
            "template": {
                "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
                "contentVersion": "1.0.0.0",
                "parameters": {},
                "variables": {},
                "resources": [],
                "outputs": {}
            }
        }       
    },
    {
        "apiVersion": "2015-01-01",
        "type": "Microsoft.Resources/deployments",
        "name": "[concat('loop-', copyIndex(1))]",
        "dependsOn": [
          "[concat('loop-', copyIndex())]"
        ],
        "copy": {
          "name": "iterator",
          "count": "[length(parameters('networkSecurityGroupsSettings').securityRules)]"
        },
        "properties": {
          "mode": "Incremental",
          "template": {
            "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
            "contentVersion": "1.0.0.0",
           "parameters": {},
            "variables": {},
            "resources": [
                {
                    "name": "[concat('NSG1/' , parameters('networkSecurityGroupsSettings').securityRules[copyIndex()].name)]",
                    "type": "Microsoft.Network/networkSecurityGroups/securityRules",
                    "apiVersion": "2016-09-01",
                    "location":"[resourceGroup().location]",
                    "properties":{
                        "description": "[parameters('networkSecurityGroupsSettings').securityRules[copyIndex()].description]",
                        "priority":"[parameters('networkSecurityGroupsSettings').securityRules[copyIndex()].priority]",
                        "protocol":"[parameters('networkSecurityGroupsSettings').securityRules[copyIndex()].protocol]",
                        "sourcePortRange": "[parameters('networkSecurityGroupsSettings').securityRules[copyIndex()].sourcePortRange]",
                        "destinationPortRange": "[parameters('networkSecurityGroupsSettings').securityRules[copyIndex()].destinationPortRange]",
                        "sourceAddressPrefix": "[parameters('networkSecurityGroupsSettings').securityRules[copyIndex()].sourceAddressPrefix]",
                        "destinationAddressPrefix": "[parameters('networkSecurityGroupsSettings').securityRules[copyIndex()].destinationAddressPrefix]",
                        "access":"[parameters('networkSecurityGroupsSettings').securityRules[copyIndex()].access]",
                        "direction":"[parameters('networkSecurityGroupsSettings').securityRules[copyIndex()].direction]"
                        }
                  }
            ],
            "outputs": {}
          }
        }
    }
  ],          
  "outputs": {}
}

```

The corresponding parameter file looks like:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters":{ 
      "networkSecurityGroupsSettings": {
      "value": {
          "securityRules": [
            {
              "name": "RDPAllow",
              "description": "allow RDP connections",
              "direction": "Inbound",
              "priority": 100,
              "sourceAddressPrefix": "*",
              "destinationAddressPrefix": "10.0.0.0/24",
              "sourcePortRange": "*",
              "destinationPortRange": "3389",
              "access": "Allow",
              "protocol": "Tcp"
            },
            {
              "name": "HTTPAllow",
              "description": "allow HTTP connections",
              "direction": "Inbound",
              "priority": 200,
              "sourceAddressPrefix": "*",
              "destinationAddressPrefix": "10.0.1.0/24",
              "sourcePortRange": "*",
              "destinationPortRange": "80",
              "access": "Allow",
              "protocol": "Tcp"
            }
          ]
        }
      }
    }
  }
```

## Try the template

If you would like to experiment with these templates, follow these steps:

1.	Go to the Azure portal, select the "+" icon, and search for the "template deployment" resource type. When you find it in the search results, select it.
2.	When you get to the "template deployment" page, select the **create** button. This button opens the "custom deployment" blade.
3.	Select the **edit template** button.
4.	Delete the empty template in the right-hand pane.
5.	Copy and paste the sample template into the right-hand pane.
6.	Select the **save** button.
7.	When you are returned to the "custom deployment" pane, select the **edit parameters** button.
8.  On the "edit parameters" blade, delete the existing template.
9.  Copy and paste the sample parameter template from above.
10. Select the **save** button, which returns you to the "custom deployment" blade.
11. On the "custom deployment" blade, select your subscription, either create new or use existing resource group, and select a location. Review the terms and conditions, and select the "I agree" checkbox.
12.	Select the **purchase** button.

## Next steps

If you require more than the maximum 255 parameters allowed per deployment, use this pattern to specify fewer parameters in your template. You can also use this pattern to manage the properties for your resources more easily, then deploy them without conflicts using the sequential loop pattern.

* For an introduction to the `parameter()` function and using arrays, see [Azure Resource Manager template functions](resource-group-template-functions.md).
* This pattern is also implemented in the [template building blocks project](https://github.com/mspnp/template-building-blocks) and the [Azure reference architectures](/azure/architecture/reference-architectures/).