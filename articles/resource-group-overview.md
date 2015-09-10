<properties
   pageTitle="Azure Resource Manager Overview | Microsoft Azure"
   description="Describes how to use Azure Resource Manager for deployment, management, and access control of resources on Azure."
   services="azure-resource-manager"
   documentationCenter="na"
   authors="tfitzmac"
   manager="wpickett"
   editor=""/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="09/09/2015"
   ms.author="tomfitz"/>

# Azure Resource Manager overview

The infrastructure for your application is typically made up of many components – maybe a virtual machine, storage account, and virtual network, or a web app, database, database server, and 3rd party services. You do not see these components as separate entities, instead you see them as related and interdependent parts of a single entity. You want to deploy, manage, and monitor them as a group. Azure Resource Manager enables you to work with the resources in your solution as a group. You can deploy, update or delete all of the resources for your solution in a single, coordinated operation. You use a template for deployment and that template can work for different environments such as testing, staging and production. Resource Manager provides security, auditing, and tagging features to help you manage your resources after deployment. 

## The benefits of using Resource Manager

Resource Manager provides several benefits:

- You can deploy, manage, and monitor all of the resources for your solution as a group, rather than handling these resources individually.
- You can repeatedly deploy your solution throughout the development lifecycle and have confidence your resources are deployed in a consistent state.
- You can use declarative templates to define your deployment.
- You can define the dependencies between resources so they are deployed in the correct order.
- You can apply access control to all services in your resource group because Role-Based Access Control (RBAC) is natively integrated into the management platform.
- You can apply tags to resources to logically organize all of the resources in your subscription.
- You can clarify billing for your organization by viewing the rolled-up costs for the entire group or for a group of resources sharing the same tag.  

Resource Manager provides a new way to deploy and manage your solutions. If you used the earlier deployment model and want to learn about the changes, see [Understanding Resource Manager deployment and classic deployment](resource-manager-deployment-model.md).

## Guidance

The following suggestions will help you take full advantage of Resource Manager when working with your solutions.

1. Define and deploy your infrastructure through the declarative syntax in Resource Manager templates, rather than through imperative commands.
2. Define all deployment and configuration steps in the template. You should have no manual steps for setting up your solution.
3. Run imperative commands to manage your resources, such as to start or stop an app or machine.
4. Arrange resources with the same lifecycle in a resource group. Use tags for all other organizing of resources.

## Resource groups

A resource group is a container that holds related resources for an application. The resource group could include all of the resources for an application, or only those resources that are logically grouped together. You can decide how you want to allocate resources to resource groups based on what makes the most sense for your organization.

There are some important factors to consider when defining your resource group:

1. All of the resources in your group must share the same lifecycle. You will deploy, update and delete them together. If one resource, such as a database server, needs to exist on a different deployment cycle it should be in another resource group.
2. Each resource can only exist in one resource group.
3. You can add or remove a resource to a resource group at any time.
4. You can move a resource from one resource group to another group. For more information, see [Move resources to new resource group or subscription](resource-group-move-resources.md).
4. A resource group can contain resources that reside in different regions.
5. A resource group can be used to scope access control for administrative actions.
6. A resource can be linked to a resource in another resource group when the two resources must interact with each other but they do not share the same lifecycle (for example, multiple apps connecting to a database). For more information, see [Linking resources in Azure Resource Manager](resource-group-link-resources.md).

## Template deployment

With Resource Manager, you can create a simple template (in JSON format) that defines deployment and configuration of your application. This template is known as a Resource Manager template and provides a declarative way to define deployment. By using a template, you can repeatedly deploy your application throughout the app lifecycle and have confidence your resources are deployed in a consistent state.

Within the template, you define the infrastructure for your app, how to configure that infrastructure, and how to publish your app code to that infrastructure. You do not need to worry about the order for deployment because Azure Resource Manager analyzes dependencies to ensure resources are created in the correct order. For more information, see [Defining dependencies in Azure Resource Manager templates](resource-group-define-dependencies.md).

You do not have to define your entire infrastructure in a single template. Often, it makes sense to divide your deployment requirements into a set of targeted, purpose-specific templates. You can easily re-use these templates for different solutions. To deploy a particular solution, you create a master template that links all of the required templates. For more information, see [Using linked templates with Azure Resource Manager](resource-group-linked-templates.md).

You can also use the template for updates to the infrastructure. For example, you can add a new resource to your app and add configuration rules for the resources that are already deployed. If the template specifies creating a new resource but that resource already exists, Azure Resource Manager performs an update instead of creating a new asset. Azure Resource Manager updates the existing asset to the same state as it would be as new.

You can specify parameters in your template to allow for customization and flexibility in deployment. For example, you can pass parameter values that tailor deployment for your test environment. By specifying the parameters, you can use the same template for deployment to all of your app’s environments.

Resource Manager provides extensions for scenarios when you need additional operations such as installing particular software that is not included in the setup. If you are already using a configuration management service, like DSC, Chef or Puppet, you can continue working with that service by using extensions.

When you create a solution from the Marketplace, the solution automatically includes a deployment template. You do not have to create your template from scratch because you can start with the template for your solution and customize it to meet your specific needs.

Finally, the template becomes part of the source code for your app. You can check it in to your source code repository and update it as your app evolves. You can edit the template through Visual Studio.

For more information about defining the template, see [Authoring Azure Resource Manager Templates](./resource-group-authoring-templates.md).

For template schemas, see [Azure Resource Manager Schemas](https://github.com/Azure/azure-resource-manager-schemas).

For information about using a template for deployment, see [Deploy an application with Azure Resource Manager template](azure-portal/resource-group-template-deploy.md).

For guidance about how to structure your templates, see [Best practices for designing Azure Resource Manager templates](best-practices-resource-manager-design-templates.md).

## Tags

Resource Manager provides a tagging feature that enables you to categorize resources according to your requirements for managing or billing. You might want to use tags when you have a complex collection of resource groups and resources, and need to visualize those assets in the way that makes the most sense to you. For example, you could tag resources that serve a similar role in your organization or belong to the same department.

Resources do not need to reside in the same resource group to share a tag. You can create your own tag taxonomy to ensure that all users in your organization use common tags rather than users inadvertently applying slightly different tags (such as "dept" instead of "department").

For more information about tags, see [Using tags to organize your Azure resources](./resource-group-using-tags.md).

## Access control

Resource Manager enables you to control who has access to specific actions for your organization. It natively integrates OAuth and Role-Based Access Control (RBAC) into the management platform and applies that access control to all services in your resource group. You can add users to pre-defined platform and resource-specific roles and apply those roles to a subscription, resource group or resource to limit access. For example, you can take advantage of the pre-defined role called SQL DB Contributor that permits users to manage databases, but not database servers or security policies. You add users in your organization that need this type of access to the SQL DB Contributor role and apply the role to the subscription, resource group or resource.

Resource Manager automatically logs user actions for auditing.

For more information about role-based access control, see [Role-based access control in the Microsoft Azure preview portal](role-based-access-control-configure.md). This topic contains a list of the built-in roles and the permitted actions. The built-in roles include general roles such as Owner, Reader, and Contributor; as well as, service-specific roles such as Virtual Machine Contributor, Virtual Network Contributor, and SQL Security Manager (to name just a few of the available roles).

For examples of setting access policies, see [Managing and Auditing Access to Resources](azure-portal/resource-group-rbac.md).

You can also explicitly lock critical resources to prevent users from deleting or modifying them. For more information, see [Lock resources with Azure Resource Manager](resource-group-lock-resources.md).

For best practices, see [Security considerations for Azure Resource Manager](best-practices-resource-manager-security.md)

## Consistent management layer

Resource Manager provides completely compatible operations through Azure PowerShell, Azure CLI for Mac, Linux, and Windows, the Azure preview portal, or REST API. You can use the interface that works best for you, and move quickly between the interfaces without confusion. The portal even displays notification for actions taken outside of the portal.

For information about PowerShell, see [Using Azure PowerShell with Resource Manager](./powershell-azure-resource-manager.md) and [Azure Resource Manager Cmdlets](https://msdn.microsoft.com/library/azure/dn757692.aspx).

For information about Azure CLI, see [Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Management](./virtual-machines/xplat-cli-azure-resource-manager.md).

For information about the REST API, see [Azure Resource Manager REST API Reference](https://msdn.microsoft.com/library/azure/dn790568.aspx).

For information about using the preview portal, see [Using the Azure Preview Portal to manage your Azure resources](azure-portal/resource-group-portal.md).


## Next steps

- To learn about creating templates, see [Authoring templates](./resource-group-authoring-templates.md)
- To deploy the template you created, see [Deploying templates](azure-portal/resource-group-template-deploy.md)
- To understand the functions you can use in a template, see [Template functions](./resource-group-template-functions.md)
- For guidance on designing your templates, see [Best practices for designing Azure Resource Manager templates](best-practices-resource-manager-design-templates.md)

Here's a video demonstration of this overview:

[AZURE.VIDEO azure-resource-manager-overview]
