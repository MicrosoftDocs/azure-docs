<properties
   pageTitle="Dependencies in Resource Manager templates | Microsoft Azure"
   description="Describes how to set one resource as dependent on another resource during deployment to ensure resources are deployed in the correct order."
   services="azure-resource-manager"
   documentationCenter="na"
   authors="tfitzmac"
   manager="timlt"
   editor=""/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="06/23/2016"
   ms.author="tomfitz"/>

# Defining dependencies in Azure Resource Manager templates

For a given resource, there can be other resources that must exist before the resource is deployed. For example, a SQL server must exist before attempting to deploy a SQL database. You define this relationship by marking one resource as dependent on the other resource. Typically, you define a dependency with the **dependsOn** element, but you can also define it through the **reference** function. 

Resource Manager evaluates the dependencies between resources, and deploys them in their dependent order. When resources are not dependent on each other, Resource Manager deploys them in parallel.

## dependsOn

Within your template, the dependsOn element provides the ability to define one resource as a dependent on one or more resources. It's value can be a comma separated list of resource names. 

The following example shows a virtual machine scale set that is dependent on a load balancer, virtual network, and a loop that creates multiple storage accounts. These other resources are not shown below, but they would need to exist elsewhere in the template.

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

If you need to define a dependency between a resource and resources that are created through a copy loop (as shown above), you can set the dependsOn element to name of the loop. For an example, see [Create multiple instances of resources in Azure Resource Manager](resource-group-create-multiple.md).

While you may be inclined to use dependsOn to map dependencies between your resources, it's important to understand why you're doing it because it can impact the performance of your deployment. 
For example, if you're doing this because you want to document how resources are interconnected, dependsOn is not the right approach. The lifecycle of dependsOn is just for deployment and is 
not available post-deployment. Once deployed there is no way to query these dependencies. By using dependsOn you run the risk of impacting performance where you may inadvertently distract the 
deployment engine from using parallelism where it might have otherwise. To document and provide query capabililty over the relationships between resources, you should instead use [resource linking](resource-group-link-resources.md).

## Child resources

The resources property allows you to specify child resources that are related to the resource being defined. Child resources can only be defined 5 levels deep. It is important to note that an implicit dependency is not created between a child resource and the parent resource. If you need the child resource to be deployed after the parent resource, you must explicitly state that dependency with the dependsOn property. 

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

The reference function enables an expression to derive its value from other JSON name and value pairs or runtime resources. Reference expressions implicitly declare that one resource depends on another. 
The property represented by **propertyPath** below is optional, if it is not specified, the reference is to the resource.

    reference('resourceName').propertyPath

You can use either this element or the dependsOn element to specify dependencies, but you do not need to use both for the same dependent resource. The guidance is to use the implicit reference to avoid the 
risk of inadvertently having an unnecessary dependsOn element stop the deployment engine from doing aspects of the deployment in parallel.

To learn more, see [reference function](resource-group-template-functions.md#reference).

## Next steps

- To learn about creating Azure Resource Manager templates, see [Authoring templates](resource-group-authoring-templates.md). 
- For a list of the available functions in a template, see [Template functions](resource-group-template-functions.md).

