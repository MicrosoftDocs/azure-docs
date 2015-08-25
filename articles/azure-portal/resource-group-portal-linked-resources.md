<properties 
	pageTitle="Related and linked resources in the tile gallery" 
	description="Learn about related and linked resources that are displayed in the tile gallery of the Azure preview portal." 
	services="azure-portal" 
	documentationCenter="" 
	authors="adamabdelhamed" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="azure-portal" 
	ms.workload="multiple" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/16/2015" 
	ms.author="adamab"/>

# Related and linked resources in the tile gallery

The tile gallery enables you to find tiles for a particular resource and drag them onto your current blade. 
Using the tile gallery, you can create management views that span resources. 
For any specified resource, the related resources include all of the resources that share the same 
resource group as the resource, and any resources that link to or from the resource.

## Linked resources in Azure Resource Manager

Linking is a feature of the Azure Resource Manager.  It enables you to declare relationships between 
resources even if they do not reside in the same resource group. Linking has no impact on the runtime 
of your resources, no impact on billing, and no impact on role-based access.  It's simply a mechanism you can 
use to represent relationships so that tools like the tile gallery can provide a rich management 
experience.  Your tools can inspect the links using the links API and provide custom relationship 
management experiences as well. 

## How do I link my resources?

When you create resources through the portal or by deploying a template through Azure PowerShell or Azure CLI, links are 
automatically created for some dependent resources. You can also programmatically link resources by using the 
[Linked Resources REST API](https://msdn.microsoft.com/library/azure/mt238499.aspx) or by declaring the relationships in the template. 
For a complete discussion of working with linked resources, see [Linking resources in Azure Resource Manager](../resource-group-link-resources.md).

## Next steps

- If you need an introduction to writing Azure Resource Manager templates, see [Authoring templates](../resource-group-authoring-templates.md).
- To dive into greater detail about creating links between resources, see [Linking resources in Azure Resource Manager](../resource-group-link-resources.md).
- To understand more about working with resource groups through the preview portal, see [Using the Azure Preview Portal to manage your Azure resources](resource-group-portal.md).
