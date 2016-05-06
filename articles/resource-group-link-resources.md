<properties 
	pageTitle="Linking resources in Azure Resource Manager" 
	description="Create a link between resources in different resource groups in Azure Resource Manager." 
	services="azure-resource-manager" 
	documentationCenter="" 
	authors="tfitzmac" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="azure-resource-manager" 
	ms.workload="multiple" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="01/26/2016" 
	ms.author="tomfitz"/>

# Linking resources in Azure Resource Manager

Post-deployment, you may wish to query the relationships or links between resources. Dependencies inform deployment, but that 
lifecycle ends at deployment. Once deployment is complete, there is no identified relationship between dependent resources.

Instead, Azure Resource Manager provides a new feature called resource linking to establish and query relationships 
between resources. You can determine which resources are linked to a resource or which resources are linked from a resource. 

The scope for a resource link can be a subscription, resource group or a specific resource. This means that resource links can document 
relationships that span across resource groups. As you begin to decompose your solution into multiple templates and multiple resource groups, 
having a mechanism to identify these resource links proves to be useful. For example, it is common to have a database with its own lifecycle 
reside in one resource group, and an app with a different lifecycle reside in a different resource group. The app connects to the database so 
there is a link between the resources in different resource groups. 

All linked resources must belong to the same subscription. Each resource can be linked to 50 other resources. If any of the linked resources are 
deleted or moved, the link owner must clean up the remaining link.

## Linking in templates

To define a link between resources in a template, see [Resource links - template schema](resource-manager-template-links.md).

## Linking with REST API

To define a link between deployed resources, run:

    PUT https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/{provider-namespace}/{resource-type}/{resource-name}/providers/Microsoft.Resources/links/{link-name}?api-version={api-version}

Replace {subscription-id} with your subscription id. Replace {resource-group}, {provider-namespace, {resource-type}, and {resource-name} with the values that 
identify the first resource in the link. Replace {link-name} with the name of the link to create. Use 2015-01-01 for the api-version.

In the request, include an object that defines the second resource in the link:

    {
        "name": "{new-link-name}",
        "properties": {
            "targetId": "subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/{provider-namespace}/{resource-type}/{resource-name}/",
            "notes": "{link-description}",
        }
    }

The properties element contains the identifier for the second resource.

For more examples, including how to retrieve information about links, see [Linked Resources](https://msdn.microsoft.com/library/azure/mt238499.aspx).

## Next steps

- You can also organize your resources with tags. To learn about tagging resources, see [Using tags to organize your resources](resource-group-using-tags.md).
- For a description of how to create templates and define the resources to be deployed, see [Authoring templates](resource-group-authoring-templates.md).
