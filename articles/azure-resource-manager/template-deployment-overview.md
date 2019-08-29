---
title: Azure Resource Manager templates
description: Describes how to use Azure Resource Manager templates for deployment of resources.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 08/28/2019
ms.author: tomfitz

---
# Azure Resource Manager templates

With Azure Resource Manager, you can create templates that define what you want to deploy to Azure. The template is a JavaScript Object Notation (JSON) file that contains the infrastructure and configuration of your Azure solution. By using a template, you can repeatedly deploy your solution throughout its lifecycle and have confidence your resources are deployed in a consistent state.

The template uses declarative syntax, which lets you state what you intend to deploy without having to write the sequence of programming commands to create it. In the template, you specify the resources to deploy and the properties for those resources.

## The benefits of using Resource Manager

Resource Manager provides several benefits:

* You can deploy, manage, and monitor all the resources for your solution as a group, rather than handling these resources individually.
* You can repeatedly deploy your solution throughout the development lifecycle and have confidence your resources are deployed in a consistent state.
* You can manage your infrastructure through declarative templates rather than scripts.
* You can define the dependencies between resources so they're deployed in the correct order.

## Guidance

The following suggestions help you take full advantage of Resource Manager when working with your solutions.

* Define and deploy your infrastructure through the declarative syntax in Resource Manager templates, rather than through imperative commands.
* Define all deployment and configuration steps in the template. You should have no manual steps for setting up your solution.
* Run imperative commands to manage your resources, such as to start or stop an app or machine.
* Arrange resources with the same lifecycle in a resource group. Use tags for all other organizing of resources.

For recommendations on creating Resource Manager templates, see [Azure Resource Manager template best practices](template-best-practices.md).

To learn about the format of the template and how you construct it, see [Understand the structure and syntax of Azure Resource Manager Templates](resource-group-authoring-templates.md). To view the JSON syntax for resources types, see [Define resources in Azure Resource Manager templates](/azure/templates/).

## Template deployment process

When you deploy a template, Resource Manager parses the template and converts its syntax into REST API operations. It sends those operations to the appropriate resource providers. For example, when Resource Manager receives a template with the following resource definition:

```json
"resources": [
  {
    "apiVersion": "2016-01-01",
    "type": "Microsoft.Storage/storageAccounts",
    "name": "mystorageaccount",
    "location": "westus",
    "sku": {
      "name": "Standard_LRS"
    },
    "kind": "Storage",
    "properties": {
    }
  }
]
```

It converts the definition to the following REST API operation, which is sent to the Microsoft.Storage resource provider:

```HTTP
PUT
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/mystorageaccount?api-version=2016-01-01
REQUEST BODY
{
  "location": "westus",
  "properties": {
  }
  "sku": {
    "name": "Standard_LRS"
  },
  "kind": "Storage"
}
```

## Template structure

How you define templates and resource groups is entirely up to you and how you want to manage your solution. For example, you can deploy your three tier application through a single template to a single resource group.

![three tier template](./media/resource-group-overview/3-tier-template.png)

But, you don't have to define your entire infrastructure in a single template. Often, it makes sense to divide your deployment requirements into a set of targeted, purpose-specific templates. You can easily reuse these templates for different solutions. To deploy a particular solution, you create a master template that links all the required templates. The following image shows how to deploy a three tier solution through a parent template that includes three nested templates.

![nested tier template](./media/resource-group-overview/nested-tiers-template.png)

If you envision your tiers having separate lifecycles, you can deploy your three tiers to separate resource groups. Notice the resources can still be linked to resources in other resource groups.

![tier template](./media/resource-group-overview/tier-templates.png)

For information about nested templates, see [Using linked templates with Azure Resource Manager](resource-group-linked-templates.md).

Azure Resource Manager analyzes dependencies to ensure resources are created in the correct order. If one resource relies on a value from another resource (such as a virtual machine needing a storage account for disks), you set a dependency. For more information, see [Defining dependencies in Azure Resource Manager templates](resource-group-define-dependencies.md).

You can also use the template for updates to the infrastructure. For example, you can add a resource to your solution and add configuration rules for the resources that are already deployed. If the template defines a resource that already exists, Resource Manager updates the existing resource instead of creating a new one.

Resource Manager provides extensions for scenarios when you need additional operations such as installing particular software that isn't included in the setup. If you're already using a configuration management service, like DSC, Chef or Puppet, you can continue working with that service by using extensions. For information about virtual machine extensions, see [About virtual machine extensions and features](../virtual-machines/windows/extensions-features.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

When you create a solution from the portal, the solution automatically includes a deployment template. You don't have to create your template from scratch because you can start with the template for your solution and customize it to meet your specific needs. For a sample, see [Quickstart: Create and deploy Azure Resource Manager templates by using the Azure portal](./resource-manager-quickstart-create-templates-use-the-portal.md). You can also retrieve a template for an existing resource group by either exporting the current state of the resource group, or viewing the template used for a particular deployment. Viewing the [exported template](./manage-resource-groups-portal.md#export-resource-groups-to-templates) is a helpful way to learn about the template syntax.

Finally, the template becomes part of the source code for your app. You can check it in to your source code repository and update it as your app evolves. You can edit the template through Visual Studio.

After defining your template, you're ready to deploy the resources to Azure. To deploy the resources, see:

* [Deploy resources with Resource Manager templates and Azure PowerShell](resource-group-template-deploy.md)
* [Deploy resources with Resource Manager templates and Azure CLI](resource-group-template-deploy-cli.md)
* [Deploy resources with Resource Manager templates and Azure portal](resource-group-template-deploy-portal.md)
* [Deploy resources with Resource Manager templates and Resource Manager REST API](resource-group-template-deploy-rest.md)

## Next steps

In this article, you learned how to use Azure Resource Manager for deployment, management, and access control of resources on Azure. Proceed to the next article to learn how to create your first Azure Resource Manager template.

> [!div class="nextstepaction"]
> [Quickstart: Create and deploy Azure Resource Manager templates by using the Azure portal](./resource-manager-quickstart-create-templates-use-the-portal.md)
