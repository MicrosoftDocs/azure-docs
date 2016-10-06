<properties 
	pageTitle="Linking resources in Azure Resource Manager | Microsoft Azure" 
	description="Create a link between related resources in different resource groups in Azure Resource Manager." 
	services="azure-resource-manager" 
	documentationCenter="" 
	authors="tfitzmac" 
	manager="timlt" 
	editor="tysonn"/>

<tags 
	ms.service="azure-resource-manager" 
	ms.workload="multiple" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="08/01/2016" 
	ms.author="tomfitz"/>

# Linking resources in Azure Resource Manager

During deployment, you can mark a resource as dependent on another resource, but that lifecycle ends at deployment. After deployment, there is no identified relationship between dependent resources. Resource Manager provides a feature called resource linking to establish persistent relationships between resources.

With resource linking, you can document relationships that span resource groups. For example, it is common to have a database with its own lifecycle reside in one resource group, and an app with a different lifecycle reside in a different resource group. The app connects to the database so you want to mark a link between the app and the database. 

All linked resources must belong to the same subscription. Each resource can be linked to 50 other resources. The only way to query related resources is through the REST API. If any of the linked resources are deleted or moved, the link owner must clean up the remaining link. You are **not** warned when deleting a resource that is linked to other resources.

## Linking in templates

To define a link in a template, you include a resource type that combines the resource provider namespace and type of the source resource with **/providers/links**. The name must include the name of the source resource. You provide the resource id of the target resource. The following example establishes a link between a web site and a storage account.

    {
      "type": "Microsoft.Web/sites/providers/links",
      "apiVersion": "2015-01-01",
      "name": "[concat(variables('siteName'),'/Microsoft.Resources/SiteToStorage')]",
      "dependsOn": [ "[variables('siteName')]" ],
      "properties": {
        "targetId": "[resourceId('Microsoft.Storage/storageAccounts','storagecontoso')]",
        "notes": "This web site uses the storage account to store user information."
      }
    }


For a full description of the template format, see [Resource links - template schema](resource-manager-template-links.md).

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

You can query links in your subscription with:

    https://management.azure.com/subscriptions/{subscription-id}/providers/Microsoft.Resources/links?api-version={api-version}

For more examples, including how to retrieve information about links, see [Linked Resources](https://msdn.microsoft.com/library/azure/mt238499.aspx).

## Next steps

- You can also organize your resources with tags. To learn about tagging resources, see [Using tags to organize your resources](resource-group-using-tags.md).
- For a description of how to create templates and define the resources to be deployed, see [Authoring templates](resource-group-authoring-templates.md).
