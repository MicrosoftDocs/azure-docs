---
title: Dependencies in Resource Manager templates | Microsoft Docs
description: Describes how to set one resource as dependent on another resource during deployment to ensure resources are deployed in the correct order.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
manager: timlt
editor: ''

ms.assetid: 34ebaf1e-480c-4b4d-9bf6-251bd3f8f2cf
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/29/2016
ms.author: tomfitz

---
# Defining dependencies in Azure Resource Manager templates
For a given resource, there can be other resources that must exist before the resource is deployed. For example, a SQL server must exist before attempting to deploy a SQL database. You define this relationship by marking one resource as dependent on the other resource. Typically, you define a dependency with the **dependsOn** element, but you can also define it through the **reference** function. 

Resource Manager evaluates the dependencies between resources, and deploys them in their dependent order. When resources are not dependent on each other, Resource Manager deploys them in parallel. You only need to define dependencies for resources that are deployed in the same template. 

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
        "[variables('loadBalancerName')]",
        "[variables('virtualNetworkName')]"
      ],
      ...
    }

In the preceding example, a dependency is included on the resources that are created through a copy loop named **storageLoop**. For an example, see [Create multiple instances of resources in Azure Resource Manager](resource-group-create-multiple.md).

When defining dependencies, you can include the resource provider namespace and resource type to avoid ambiguity. For example, to clarify a load balancer and virtual network that may have the same names as other resources, use the following format:

    "dependsOn": [
      "[concat('Microsoft.Network/loadBalancers/', variables('loadBalancerName'))]",
      "[concat('Microsoft.Network/virtualNetworks/', variables('virtualNetworkName'))]"
    ] 

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

## Recommendations for setting dependencies

When deciding what dependencies to set, use the following guidelines:

* Set as few dependencies as possible.
* Set dependencies between child resources and parent resources.
* Use the **reference** function to set implicit dependencies between resources that need to share a property.
* Do not add a **dependsOn** property, if you have already defined the dependency through the **reference** function.
* Set a dependency when a resource cannot be created without functionality from another resource (such as a virtual machine needing a storage account and virtual network interface).
* Let dependencies cascade without setting them explicitly. For example, set your virtual machine as dependent on a virtual network interface, and set the virtual network interface as dependent on a virtual network and public IP addresses. So, the virtual machine is deployed after all three resources, but do not explicitly set a dependency on all three resources.
* Do not set a dependency when the value shared between resources can be evaluated from a predeployment state. For example, you can use the name of a resource without setting a dependency.

Resource Manager identifies circular dependencies during template validation. If you receive an error stating that a circular dependency exists, evaluate your template to see if any dependencies are not needed and can be removed. If removing dependencies does not work, you can avoid circular dependencies by moving some deployment operations into child resources that are deployed after the resource that have the circular dependency. For example, suppose you are deploying two virtual machines but you must set properties on each one that refer to the other. You can deploy them in the following order:

1. vm1
2. vm2
3. Extension on vm1 is dependent on vm1 and vm2. The extension sets values on vm1 that it gets from vm2.
4. Extension on vm2 is dependent on vm1 and vm2. The extension sets values on vm2 that it gets from vm1.

## Next steps
* To learn about troubleshooting dependencies during deployment, see [Troubleshoot common Azure deployment errors with Azure Resource Manager](resource-manager-common-deployment-errors.md).
* To learn about creating Azure Resource Manager templates, see [Authoring templates](resource-group-authoring-templates.md). 
* For a list of the available functions in a template, see [Template functions](resource-group-template-functions.md).

