<properties
   pageTitle="Defining dependencies in Azure Resource Manager templates"
   description="Describes how to set one resource as dependent on another resource during deployment."
   services="azure-resource-manager"
   documentationCenter="na"
   authors="mmercuri"
   manager="wpickett"
   editor=""/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="10/20/2015"
   ms.author="mmercuri"/>

# Defining dependencies in Azure Resource Manager templates

For a given resource, there can be multiple upstream and child dependencies that are critical to the success of your topology. You can define dependencies on other resources using **dependsOn** and 
**resources** property of a resource. A dependency can also be specified using the **reference** function.

    {
        "name": "<name-of-the-resource>",
        "type": "<resource-provider-namespace/resource-type-name>",
        "apiVersion": "<supported-api-version-of-resource>",
        "location": "<location-of-resource>",
        "tags": { <name-value-pairs-for-resource-tagging> },
        "dependsOn": [ <array-of-related-resource-names> ],
        "properties": { <settings-for-the-resource> },
        "resources": { <dependent-resources> }
    }

 There are also resource links which can define relationships between resources, and support defining these relationships across resource groups.

## dependsOn

For a given virtual machine, you may be dependent on having a database resource successfully provisioned. In another case, you may be dependent for multiple nodes in your cluster to be installed 
before deploying a virtual machine with the cluster management tool.

Within your template, the dependsOn property provides the ability to define this dependency for a resource. It's value can be a comma separated list of resource names. The dependencies between 
resources are evaluated and resources are deployed in their dependent order. When resources are not dependent on each other, they are attempted to be deployed in parallel. 

While you may be inclined to use dependsOn to map dependencies between your resources, it's important to understand why you're doing it because it can impact the performance of your deployment. 
For example, if you're doing this because you want to document how resources are interconnected, dependsOn is not the right approach. The lifecycle of dependsOn is just for deployment and is 
not available post-deployment. Once deployed there is no way to query these dependencies. By using dependsOn you run the risk of impacting performance where you may inadvertently distract the 
deployment engine from using parallelism where it might have otherwise. To document and provide query capabililty over the relationships between resources, you should instead use [resource linking](resource-group-link-resources.md).

This element is not needed if the reference function is used to get a representation of a resource because a reference object implies a dependency on the resource. In fact, if there is an 
option to use a reference vs. dependsOn, the guidance is to use the reference function and have implicit references. The rationale here again is performance.  References define implicit dependencies 
that are known to be required as they're referenced within the template. By their presence, they are relevant, avoiding again optimizing for performance and to avoid the potential risk of 
distracting the deployment engine from avoiding parallelism unnecessarily.

If you need to define a dependency between a resource and resources that are created through a copy loop, you can set the dependsOn element to name of the loop. For an example, see [Create multiple instances of resources in Azure Resource Manager](resource-group-create-multiple.md).

## resources

The resources property allows you to specify child resources that are related to the resource being defined. Child resources can only be defined 5 levels deep. It is important to note that an implicit dependency is not created between a child resource and the parent resource. If you need the child resource to be deployed after the parent resource, you must explicitly state that dependency with the dependsOn property. 

## reference function

The reference function enables an expression to derive its value from other JSON name and value pairs or runtime resources. Reference expressions implicitly declare that one resource depends on another. 
The property represented by **propertyPath** below is optional, if it is not specified, the reference is to the resource.

    reference('resourceName').propertyPath

You can use either this element or the dependsOn element to specify dependencies, but you do not need to use both for the same dependent resource. The guidance is to use the implicit reference to avoid the 
risk of inadvertently having an unnecessary dependsOn element stop the deployment engine from doing aspects of the deployment in parallel.

To learn more, see [reference function](../resource-group-template-functions/#reference).

## Next steps

- To learn about creating Azure Resource Manager templates, see [Authoring templates](resource-group-authoring-templates.md). 
- For a list of the available functions in a template, see [Template functions](resource-group-template-functions.md).

