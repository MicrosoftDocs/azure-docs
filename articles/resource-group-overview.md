<properties
   pageTitle="Azure Resource Manager Overview | Microsoft Azure"
   description="Describes how to use Azure Resource Manager for deployment, management, and access control of resources on Azure."
   services="azure-resource-manager"
   documentationCenter="na"
   authors="tfitzmac"
   manager="timlt"
   editor="tysonn"/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="08/18/2016"
   ms.author="tomfitz"/>

# Azure Resource Manager overview

The infrastructure for your application is typically made up of many components – maybe a virtual machine, storage account, and virtual network, or a web app, database, database server, and 3rd party services. You do not see these components as separate entities, instead you see them as related and interdependent parts of a single entity. You want to deploy, manage, and monitor them as a group. Azure Resource Manager enables you to work with the resources in your solution as a group. You can deploy, update or delete all of the resources for your solution in a single, coordinated operation. You use a template for deployment and that template can work for different environments such as testing, staging and production. Resource Manager provides security, auditing, and tagging features to help you manage your resources after deployment. 

## Terminology

If you are new to Azure Resource Manager, there are some terms you might not be familiar with.

- **resource** - A manageable item that is available through Azure. Some common resources are a virtual machine, storage account, web app, database, and virtual network, but there are many more.
- **resource group** - A container that holds related resources for an application. The resource group can include all of the resources for an application, or only those resources that you group together. You can decide how you want to allocate resources to resource groups based on what makes the most sense for your organization. See [Resource groups](#resource-groups).
- **resource provider** - A service that supplies the resources you can deploy and manage through Resource Manager. Each resource provider offers operations for working with the resources that are deployed. Some common resource providers are Microsoft.Compute which supplies the virtual machine resource, Microsoft.Storage which supplies the storage account resource, and Microsoft.Web which supplies resources related to web apps. See [Resource providers](#resource-providers).
- **Resource Manager template** - A JavaScript Object Notation (JSON) file that defines one or more resources to deploy to a resource group. It also defines the dependencies between the deployed resources. The template can be used to deploy the resources consistently and repeatedly. See [Template deployment](#template-deployment).
- **declarative syntax** - A syntax that lets you state "Here is what I intend to create" without having to write the sequence of programming commands to create it. The Resource Manager template is an example of declarative syntax. In the file, you define the properties for the infrastructure to deploy to Azure. 

## The benefits of using Resource Manager

Resource Manager provides several benefits:

- You can deploy, manage, and monitor all of the resources for your solution as a group, rather than handling these resources individually.
- You can repeatedly deploy your solution throughout the development lifecycle and have confidence your resources are deployed in a consistent state.
- You can manage your infrastructure through declarative templates rather than scripts.
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

For more recommendations, see [Best practices for creating Azure Resource Manager templates](resource-manager-template-best-practices.md).

## Resource groups

There are some important factors to consider when defining your resource group:

1. All of the resources in your group should share the same lifecycle. You will deploy, update and delete them together. If one resource, such as a database server, needs to exist on a different deployment cycle it should be in another resource group.
2. Each resource can only exist in one resource group.
3. You can add or remove a resource to a resource group at any time.
4. You can move a resource from one resource group to another group. For more information, see [Move resources to new resource group or subscription](resource-group-move-resources.md).
4. A resource group can contain resources that reside in different regions.
5. A resource group can be used to scope access control for administrative actions.
6. A resource can interact with a resource in another resource groups when the two resources are related but they do not share the same lifecycle (for example, a web apps connecting to a database).

## Resource providers

Each resource provider offers a set of resources and operations for working with technical area. For example, if you want to store keys and secrets, you will work with the **Microsoft.KeyVault** resource provider. This resource provider offers a resource type called **vaults** for creating the key vault, and a resource type called **vaults/secrets** for creating a secret in the key vault. It also provides operations through [Key Vault REST API operations](https://msdn.microsoft.com/library/azure/dn903609.aspx). You can call the REST API directly or you can use [Key Vault PowerShell cmdlets](https://msdn.microsoft.com/library/dn868052.aspx) and [Key Vault Azure CLI](./key-vault/key-vault-manage-with-cli.md) to manage the key vault. You can also use a number of programming languages to work with most resources. For more information, see [SDKs and samples](#sdks-and-samples). 

To deploy and manage your infrastructure, you will need to know details about the resource providers; such as, what resource types it offers, the version numbers of the REST API operations, the operations it supports, and the schema to use when setting the values of the resource type to create. To learn about the supported resource providers, see [Resource Manager providers, regions, API versions and schemas](resource-manager-supported-services.md).

## Template deployment

With Resource Manager, you can create a simple template (in JSON format) that defines deployment and configuration of your application. By using a template, you can repeatedly deploy your application throughout the app lifecycle and have confidence your resources are deployed in a consistent state. Azure Resource Manager analyzes dependencies to ensure resources are created in the correct order. For more information, see [Defining dependencies in Azure Resource Manager templates](resource-group-define-dependencies.md).

When you create a solution from the portal, the solution automatically includes a deployment template. You do not have to create your template from scratch because you can start with the template for your solution and customize it to meet your specific needs. You can retrieve a template for an existing resource group by either exporting the current state of the resource group to a template, or viewing the template that was used for a particular deployment. Viewing the exported template is a helpful way to learn about the template syntax. To learn more about working with exported templates, see [Export an Azure Resource Manager template from existing resources](resource-manager-export-template.md).

You do not have to define your entire infrastructure in a single template. Often, it makes sense to divide your deployment requirements into a set of targeted, purpose-specific templates. You can easily re-use these templates for different solutions. To deploy a particular solution, you create a master template that links all of the required templates. For more information, see [Using linked templates with Azure Resource Manager](resource-group-linked-templates.md).

You can also use the template for updates to the infrastructure. For example, you can add a new resource to your app and add configuration rules for the resources that are already deployed. If the template specifies creating a new resource but that resource already exists, Azure Resource Manager performs an update instead of creating a new asset. Azure Resource Manager updates the existing asset to the same state as it would be as new. Or, you can specify that Resource Manager delete any resources that are not specified in the template. To understand the differences options when deploying, see [Deploy an application with Azure Resource Manager template](resource-group-template-deploy.md). 

You can specify parameters in your template to allow for customization and flexibility in deployment. For example, you can pass parameter values that tailor deployment for your test environment. By specifying the parameters, you can use the same template for deployment to all of your app’s environments.

Resource Manager provides extensions for scenarios when you need additional operations such as installing particular software that is not included in the setup. If you are already using a configuration management service, like DSC, Chef or Puppet, you can continue working with that service by using extensions.

Finally, the template becomes part of the source code for your app. You can check it in to your source code repository and update it as your app evolves. You can edit the template through Visual Studio.

For more information about defining the template, see [Authoring Azure Resource Manager Templates](resource-group-authoring-templates.md).

For step-by-step instructions on creating a template, see [Resource Manager Template Walkthrough](resource-manager-template-walkthrough.md).

For guidance on deploying your solution to different environments, see [Development and test environments in Microsoft Azure](solution-dev-test-environments.md). 

## Tags

Resource Manager provides a tagging feature that enables you to categorize resources according to your requirements for managing or billing. You might want to use tags when you have a complex collection of resource groups and resources, and need to visualize those assets in the way that makes the most sense to you. For example, you could tag resources that serve a similar role in your organization or belong to the same department. Without tags, users in your organization can create multiple resources that may be very difficult to later identify and manage. For example, you may wish to delete all of the resources for a particular project, but if those resources were not tagged for the project, you will have to manually find them. Tagging can be an important way for you to reduce unnecessary costs in your subscription. 

Resources do not need to reside in the same resource group to share a tag. You can create your own tag taxonomy to ensure that all users in your organization use common tags rather than users inadvertently applying slightly different tags (such as "dept" instead of "department").

For more information about tags, see [Using tags to organize your Azure resources](resource-group-using-tags.md). You can create a [customized policy](#manage-resources-with-customized-policies) that requires adding tags to resources during deployment.

## Access control

Resource Manager enables you to control who has access to specific actions for your organization. It natively integrates OAuth and Role-Based Access Control (RBAC) into the management platform and applies that access control to all services in your resource group. You can add users to pre-defined platform and resource-specific roles and apply those roles to a subscription, resource group or resource to limit access. For example, you can take advantage of the pre-defined role called SQL DB Contributor that permits users to manage databases, but not database servers or security policies. You add users in your organization that need this type of access to the SQL DB Contributor role and apply the role to the subscription, resource group or resource.

Resource Manager automatically logs user actions for auditing. For information about working with the audit logs, see [Audit operations with Resource Manager](resource-group-audit.md).

For more information about role-based access control, see [Azure Role-based Access Control](./active-directory/role-based-access-control-configure.md). The [RBAC: Built in Roles](./active-directory/role-based-access-built-in-roles.md) topic contains a list of the built-in roles and the permitted actions. The built-in roles include general roles such as Owner, Reader, and Contributor; as well as, service-specific roles such as Virtual Machine Contributor, Virtual Network Contributor, and SQL Security Manager (to name just a few of the available roles).

You can also explicitly lock critical resources to prevent users from deleting or modifying them. For more information, see [Lock resources with Azure Resource Manager](resource-group-lock-resources.md).

For best practices, see [Security considerations for Azure Resource Manager](best-practices-resource-manager-security.md)

## Manage resources with customized policies

Resource Manager enables you to create customized policies for managing your resources. The types of policies you create can include scenarios as diverse as enforcing a naming convention on resources, limiting which types and instances of resources can be deployed,  limiting which regions can host a type of resource, or requiring a tag value on resources to organize billing by departments. You create policies to help reduce costs and maintain consistency in your subscription. For more information, see [Use Policy to manage resources and control access](resource-manager-policy.md).

## Consistent management layer

Resource Manager provides completely compatible operations through Azure PowerShell, Azure CLI for Mac, Linux, and Windows, the Azure portal, or REST API. You can use the interface that works best for you, and move quickly between the interfaces without confusion. The portal even displays notification for actions taken outside of the portal.

For information about PowerShell, see [Using Azure PowerShell with Resource Manager](powershell-azure-resource-manager.md) and [Azure Resource Manager Cmdlets](https://msdn.microsoft.com/library/azure/dn757692.aspx).

For information about Azure CLI, see [Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Management](xplat-cli-azure-resource-manager.md).

For information about the REST API, see [Azure Resource Manager REST API Reference](https://msdn.microsoft.com/library/azure/dn790568.aspx). To view REST operations for your deployed resources, see [Use Azure Resource Explorer to view and modify resources](resource-manager-resource-explorer.md).

For information about using the portal, see [Deploy resources with Resource Manager templates and Azure portal](resource-group-template-deploy-portal.md).

Azure Resource Manager supports cross-origin resource sharing (CORS). With CORS, you can call the Resource Manager REST API or an Azure service REST API from a web application that resides in a different domain. Without CORS support, the web browser would prevent an app in one domain from accessing resources in another domain. Resource Manager enables CORS for all requests with valid authentication credentials.

## SDKs

Azure SDKs are available for multiple languages and platforms.
Each of these language implementations is available through its ecosystem package manager and GitHub.

The code in each of these SDKs is generated from Azure RESTful API specifications.
These specifications are open source and based on the Swagger 2.0 specification.
The SDK code is generated via an open-source project called AutoRest.
AutoRest transforms these RESTful API specifications into client libraries in multiple languages.
If you want to improve any aspects of the generated code in the SDKs,
the entire set of tools to create the SDKs are open, freely available, and based on a widely adopted API specification format.

Here are our Open Source SDK repositories. We welcome feedback, issues, and pull requests.

[.NET](https://github.com/Azure/azure-sdk-for-net) | [Java](https://github.com/Azure/azure-sdk-for-java) | [Node.js](https://github.com/Azure/azure-sdk-for-node) | [PHP](https://github.com/Azure/azure-sdk-for-php) | [Python](https://github.com/Azure/azure-sdk-for-python) | [Ruby](https://github.com/Azure/azure-sdk-ruby)

> [AZURE.NOTE] If the SDK doesn't provide the required functionality,
> you can also call to the [Azure REST API](https://msdn.microsoft.com/library/azure/dn790568.aspx) directly.

## Samples

### .NET

- [Manage Azure resources and resource groups](azure-resource-manager-dotnet-manage.md)
- [Deploy an SSH enabled VM with a template](azure-resource-manager-dotnet-deploy.md)

### Java

- [Manage Azure resources](azure-resource-manager-java-manage-resources.md)
- [Manage Azure resource groups](azure-resource-manager-java-manage-resource-groups.md)
- [Deploy an SSH enabled VM with a template](azure-resource-manager-dotnet-deploy.md)

### Node.js

- [Manage Azure resources and resource groups](azure-resource-manager-node-manage.md)
- [Deploy an SSH enabled VM with a template](azure-resource-manager-node-deploy.md)

### Python

- [Manage Azure resources and resource groups](azure-resource-manager-python-manage.md)
- [Deploy an SSH enabled VM with a template](azure-resource-manager-python-deploy.md)

### Ruby

- [Manage Azure resources and resource groups](azure-resource-manager-ruby-manage.md)
- [Deploy an SSH enabled VM with a template](azure-resource-manager-ruby-deploy.md)


In addition to these samples, you can search through the gallery samples.

[.NET](https://azure.microsoft.com/documentation/samples/?service=azure-resource-manager&platform=dotnet) | [Java](https://azure.microsoft.com/documentation/samples/?service=azure-resource-manager&platform=java) | [Node.js](https://azure.microsoft.com/documentation/samples/?service=azure-resource-manager&platform=nodejs) | [Python](https://azure.microsoft.com/documentation/samples/?service=azure-resource-manager&platform=python) | [Ruby](https://azure.microsoft.com/documentation/samples/?service=azure-resource-manager&platform=ruby)

## Next steps

- For a simple introduction to working with templates, see [Export an Azure Resource Manager template from existing resources](resource-manager-export-template.md).
- For a more thorough walkthrough of creating a template, see [Resource Manager Template Walkthrough](resource-manager-template-walkthrough.md).
- To understand the functions you can use in a template, see [Template functions](resource-group-template-functions.md)
- For information about using Visual Studio with Resource Manager, see [Creating and deploying Azure resource groups through Visual Studio](vs-azure-tools-resource-groups-deployment-projects-create-deploy.md).
- For information about using VS Code with Resource Manager, see [Working with Azure Resource Manager Templates in Visual Studio Code](resource-manager-vs-code.md).

Here's a video demonstration of this overview:

[AZURE.VIDEO azure-resource-manager-overview]
