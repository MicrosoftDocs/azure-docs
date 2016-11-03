---
title: Dependencies in Resource Manager templates | Microsoft Docs
description: Describes how to set one resource as dependent on another resource during deployment to ensure resources are deployed in the correct order.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
manager: timlt
editor: ''

ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/12/2016
ms.author: tomfitz

---
# Defining dependencies in Azure Resource Manager templates
For a given resource, there can be other resources that must exist before the resource is deployed. For example, a SQL server must exist before attempting to deploy a SQL database. You define this relationship by marking one resource as dependent on the other resource. Typically, you define a dependency with the **dependsOn** element, but you can also define it through the **reference** function. 

Resource Manager evaluates the dependencies between resources, and deploys them in their dependent order. When resources are not dependent on each other, Resource Manager deploys them in parallel.

## dependsOn
Within your template, the dependsOn element enables you to define one resource as a dependent on one or more resources. Its value can be a comma-separated list of resource names. 

The following example shows a virtual machine scale set that depends on a load balancer, virtual network, and a loop that creates multiple storage accounts. These other resources are not shown in the following example, but they would need to exist elsewhere in the template.

    {
      "type": "Microsoft.Compute/virtualMachineScaleSets",
      "name": "[variables('namingInfix')]",
      "location": "[variables('location')]",
      "apiVersion": "2016-03-30",
      "tags": {
        "displayName": "VMScaleSet"
      },
      "dependsOn": [
        "storageLoop",
        "[concat('Microsoft.Network/loadBalancers/', variables('loadBalancerName'))]",
        "[concat('Microsoft.Network/virtualNetworks/', variables('virtualNetworkName'))]"
      ],
      ...
    }

To define a dependency between a resource and resources that are created through a copy loop, set the dependsOn element to name of the loop. For an example, see [Create multiple instances of resources in Azure Resource Manager](resource-group-create-multiple.md).

While you may be inclined to use dependsOn to map relationships between your resources, it's important to understand why you're doing it because it can impact the performance of your deployment. For example, to document how resources are interconnected, dependsOn is not the right approach. You cannot query which resources were defined in the dependsOn element after deployment. By using dependsOn, you potentially impact deployment time because Resource Manager does not deploy in parallel two resources that have a dependency. To document relationships between resources, instead use [resource linking](resource-group-link-resources.md).

## Child resources
The resources property allows you to specify child resources that are related to the resource being defined. Child resources can only be defined five levels deep. It is important to note that an implicit dependency is not created between a child resource and the parent resource. If you need the child resource to be deployed after the parent resource, you must explicitly state that dependency with the dependsOn property. 

Each parent resource accepts only certain resource types as child resources. The accepted resource types are specified in the [template schema](https://github.com/Azure/azure-resource-manager-schemas) of the parent resource. The name of child resource type includes the name of the parent resource type, such as **Microsoft.Web/sites/config** and **Microsoft.Web/sites/extensions** are both child resources of the **Microsoft.Web/sites**.

The following example shows a SQL server and SQL database. Notice that an explicit dependency is defined between the SQL database and SQL server, even though the database is a child of the server.

    "resources": [
      {
        "name": "[variables('sqlserverName')]",
        "type": "Microsoft.Sql/servers",
        "location": "[resourceGroup().location]",
        "tags": {
          "displayName": "SqlServer"
        },
        "apiVersion": "2014-04-01-preview",
        "properties": {
          "administratorLogin": "[parameters('administratorLogin')]",
          "administratorLoginPassword": "[parameters('administratorLoginPassword')]"
        },
        "resources": [
          {
            "name": "[parameters('databaseName')]",
            "type": "databases",
            "location": "[resourceGroup().location]",
            "tags": {
              "displayName": "Database"
            },
            "apiVersion": "2014-04-01-preview",
            "dependsOn": [
              "[variables('sqlserverName')]"
            ],
            "properties": {
              "edition": "[parameters('edition')]",
              "collation": "[parameters('collation')]",
              "maxSizeBytes": "[parameters('maxSizeBytes')]",
              "requestedServiceObjectiveName": "[parameters('requestedServiceObjectiveName')]"
            }
          }
        ]
      }
    ]


## reference function
The [reference function](resource-group-template-functions.md#reference) enables an expression to derive its value from other JSON name and value pairs or runtime resources. Reference expressions implicitly declare that one resource depends on another. 

    reference('resourceName').propertyPath

You can use either this element or the dependsOn element to specify dependencies, but you do not need to use both for the same dependent resource. Whenever possible, use an implicit reference to avoid inadvertently adding an unnecessary dependency.

To learn more, see [reference function](resource-group-template-functions.md#reference).

## Next steps
* To learn about creating Azure Resource Manager templates, see [Authoring templates](resource-group-authoring-templates.md). 
* For a list of the available functions in a template, see [Template functions](resource-group-template-functions.md).

