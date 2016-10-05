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
   ms.date="10/04/2016"
   ms.author="tomfitz"/>

# Azure Resource Manager overview

The infrastructure for your application is typically made up of many components – maybe a virtual machine, storage account, and virtual network, or a web app, database, database server, and 3rd party services. You do not see these components as separate entities, instead you see them as related and interdependent parts of a single entity. You want to deploy, manage, and monitor them as a group. Azure Resource Manager enables you to work with the resources in your solution as a group. You can deploy, update, or delete all the resources for your solution in a single, coordinated operation. You use a template for deployment and that template can work for different environments such as testing, staging, and production. Resource Manager provides security, auditing, and tagging features to help you manage your resources after deployment. 

## Terminology

If you are new to Azure Resource Manager, there are some terms you might not be familiar with.

- **resource** - A manageable item that is available through Azure. Some common resources are a virtual machine, storage account, web app, database, and virtual network, but there are many more.
- **resource group** - A container that holds related resources for an Azure solution. The resource group can include all the resources for the solution, or only those resources that you want to manage as a group. You decide how you want to allocate resources to resource groups based on what makes the most sense for your organization. See [Resource groups](#resource-groups).
- **resource provider** - A service that supplies the resources you can deploy and manage through Resource Manager. Each resource provider offers operations for working with the resources that are deployed. Some common resource providers are Microsoft.Compute, which supplies the virtual machine resource, Microsoft.Storage, which supplies the storage account resource, and Microsoft.Web, which supplies resources related to web apps. See [Resource providers](#resource-providers).
- **Resource Manager template** - A JavaScript Object Notation (JSON) file that defines one or more resources to deploy to a resource group. It also defines the dependencies between the deployed resources. The template can be used to deploy the resources consistently and repeatedly. See [Template deployment](#template-deployment).
- **declarative syntax** - Syntax that lets you state "Here is what I intend to create" without having to write the sequence of programming commands to create it. The Resource Manager template is an example of declarative syntax. In the file, you define the properties for the infrastructure to deploy to Azure. 

## The benefits of using Resource Manager

Resource Manager provides several benefits:

- You can deploy, manage, and monitor all the resources for your solution as a group, rather than handling these resources individually.
- You can repeatedly deploy your solution throughout the development lifecycle and have confidence your resources are deployed in a consistent state.
- You can manage your infrastructure through declarative templates rather than scripts.
- You can define the dependencies between resources so they are deployed in the correct order.
- You can apply access control to all services in your resource group because Role-Based Access Control (RBAC) is natively integrated into the management platform.
- You can apply tags to resources to logically organize all the resources in your subscription.
- You can clarify your organization's billing by viewing costs for a group of resources sharing the same tag.  

Resource Manager provides a new way to deploy and manage your solutions. If you used the earlier deployment model and want to learn about the changes, see [Understanding Resource Manager deployment and classic deployment](resource-manager-deployment-model.md).

## Guidance

The following suggestions help you take full advantage of Resource Manager when working with your solutions.

1. Define and deploy your infrastructure through the declarative syntax in Resource Manager templates, rather than through imperative commands.
2. Define all deployment and configuration steps in the template. You should have no manual steps for setting up your solution.
3. Run imperative commands to manage your resources, such as to start or stop an app or machine.
4. Arrange resources with the same lifecycle in a resource group. Use tags for all other organizing of resources.

For more recommendations, see [Best practices for creating Azure Resource Manager templates](resource-manager-template-best-practices.md).

## Resource groups

There are some important factors to consider when defining your resource group:

1. All the resources in your group should share the same lifecycle. You deploy, update, and delete them together. If one resource, such as a database server, needs to exist on a different deployment cycle it should be in another resource group.
2. Each resource can only exist in one resource group.
3. You can add or remove a resource to a resource group at any time.
4. You can move a resource from one resource group to another group. For more information, see [Move resources to new resource group or subscription](resource-group-move-resources.md).
4. A resource group can contain resources that reside in different regions.
5. A resource group can be used to scope access control for administrative actions.
6. A resource can interact with resources in other resource groups. This interaction is common when the two resources are related but do not share the same lifecycle (for example, web apps connecting to a database).

When creating a resource group, you need to provide a location for that resource group. You may be wondering, "Why does a resource group need a location? And, if the resources can have different locations than the resource group, why does the resource group location matter at all?" The resource group stores metadata about the resources. Therefore, when you specify a location for the resource group, you are specifying where that metadata is stored. For compliance reasons, you may need to ensure that your data is stored in a particular region.

## Resource providers

Each resource provider offers a set of resources and operations for working with an Azure service. For example, if you want to store keys and secrets, you work with the **Microsoft.KeyVault** resource provider. This resource provider offers a resource type called **vaults** for creating the key vault, and a resource type called **vaults/secrets** for creating a secret in the key vault. 

Before getting started with deploying your resources, you should gain an understanding of the available resource providers. Knowing the names of resource providers and resources helps you define resources you want to deploy to Azure.

You retrieve all resource providers with the following PowerShell cmdlet:

    Get-AzureRmResourceProvider -ListAvailable

Or, with Azure CLI, you retrieve all resource providers with the following command:

    azure provider list

You can look through the returned list for the resource providers that you need to use.

To get details about a resource provider, add the provider namespace to your command. The command returns the supported resource types for the resource provider, and the supported locations and API versions for each resource type. The following PowerShell cmdlet gets details about Microsoft.Compute:

    (Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Compute).ResourceTypes

Or, with Azure CLI, retrieve the supported resource types, locations, and API versions for Microsoft.Compute, with the following command:

    azure provider show Microsoft.Compute --json > c:\Azure\compute.json

For more information, see [Resource Manager providers, regions, API versions, and schemas](resource-manager-supported-services.md).

## Template deployment

With Resource Manager, you can create a template (in JSON format) that defines the infrastructure and configuration of your Azure solution. By using a template, you can repeatedly deploy your solution throughout its lifecycle and have confidence your resources are deployed in a consistent state. When you create a solution from the portal, the solution automatically includes a deployment template. You do not have to create your template from scratch because you can start with the template for your solution and customize it to meet your specific needs. You can retrieve a template for an existing resource group by either exporting the current state of the resource group, or viewing the template used for a particular deployment. Viewing the [exported template](resource-manager-export-template.md) is a helpful way to learn about the template syntax.

In its simplest form, a template contains the following elements:

    {
      "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
      "contentVersion": "",
      "parameters": {  },
      "variables": {  },
      "resources": [  ],
      "outputs": {  }
    }

In the **parameters** element, you specify values that enable customization and flexibility in deployment. For example, you can pass parameter values that tailor deployment for your test environment. By specifying the parameters, you can use the same template to deploy your solution to different environments.

In the **variables** element, you specify values that are reused throughout the template, or values that are constructed from other values (like parameters).

In the **resources** element, you specify the components of your infrastructure. You define as many resources as your solution needs.

In the **outputs** element, you specify any values that are returned from the deployment (such as URIs from deployed resources).

To learn more about the format of the template and how you construct it, see [Authoring Azure Resource Manager Templates](resource-group-authoring-templates.md) and [Resource Manager Template Walkthrough](resource-manager-template-walkthrough.md).

Azure Resource Manager analyzes dependencies to ensure resources are created in the correct order. If one resource relies on a value from another resource (such as a virtual machine needing a storage account for disks), you set a dependency. For more information, see [Defining dependencies in Azure Resource Manager templates](resource-group-define-dependencies.md).

You do not have to define your entire infrastructure in a single template. Often, it makes sense to divide your deployment requirements into a set of targeted, purpose-specific templates. You can easily reuse these templates for different solutions. To deploy a particular solution, you create a master template that links all the required templates.

You can also use the template for updates to the infrastructure. For example, you can add a resource to your solution and add configuration rules for the resources that are already deployed. If the template specifies creating a resource but that resource already exists, Azure Resource Manager performs an update instead of creating a new asset. Azure Resource Manager updates the existing asset to the same state as it would be as new.  

Resource Manager provides extensions for scenarios when you need additional operations such as installing particular software that is not included in the setup. If you are already using a configuration management service, like DSC, Chef or Puppet, you can continue working with that service by using extensions. For information about virtual machine extensions, see [About virtual machine extensions and features](./virtual-machines/virtual-machines-windows-extensions-features.md). 

Finally, the template becomes part of the source code for your app. You can check it in to your source code repository and update it as your app evolves. You can edit the template through Visual Studio.

After defining your template, you are ready to deploy the resources to Azure. For the commands to deploy the resources, see:

- [Deploy resources with Resource Manager templates and Azure PowerShell](resource-group-template-deploy.md)
- [Deploy resources with Resource Manager templates and Azure CLI](resource-group-template-deploy-cli.md)
- [Deploy resources with Resource Manager templates and Azure portal](resource-group-template-deploy-portal.md)
- [Deploy resources with Resource Manager templates and Resource Manager REST API](resource-group-template-deploy-rest.md)

## Tags

Resource Manager provides a tagging feature that enables you to categorize resources according to your requirements for managing or billing. Use tags when you have a complex collection of resource groups and resources, and need to visualize those assets in the way that makes the most sense to you. For example, you could tag resources that serve a similar role in your organization or belong to the same department. Without tags, users in your organization can create multiple resources that may be difficult to later identify and manage. For example, you may wish to delete all the resources for a particular project. If those resources are not tagged for the project, you have to manually find them. Tagging can be an important way for you to reduce unnecessary costs in your subscription. 

Resources do not need to reside in the same resource group to share a tag. You can create your own tag taxonomy to ensure that all users in your organization use common tags rather than users inadvertently applying slightly different tags (such as "dept" instead of "department").

The following example shows a tag applied to a virtual machine.

    "resources": [    
      {
        "type": "Microsoft.Compute/virtualMachines",
        "apiVersion": "2015-06-15",
        "name": "SimpleWindowsVM",
        "location": "[resourceGroup().location]",
        "tags": {
            "costCenter": "Finance"
        },
        ...
      }
    ]

To retrieve all of the resources with a tag value, use the following PowerShell cmdlet:

    Find-AzureRmResource -TagName costCenter -TagValue Finance

Or, the following Azure CLI command:

    azure resource list -t costCenter=Finance --json

You can also view tagged resources through the Azure portal.

The [usage report](billing-understand-your-bill.md) for your subscription includes tag names and values, which enables you to break out costs by tags. For more information about tags, see [Using tags to organize your Azure resources](resource-group-using-tags.md).

## Access control

Resource Manager enables you to control who has access to specific actions for your organization. It natively integrates role-based access control (RBAC) into the management platform and applies that access control to all services in your resource group. You can add users to pre-defined platform and resource-specific roles and apply those roles to a subscription, resource group, or resource to limit access. For example, you can take advantage of the pre-defined role called Reader that permits users to view resources but not change them. You add users in your organization that need this type of access to the Reader role and apply the role to the subscription, resource group or resource.

Azure provides the following four platform roles:

1.	Owner - can manage everything, including access
2.	Contributor - can manage everything except access
3.	Reader - can view everything, but can't make changes
4.	User Access Administrator - can manage user access to Azure resources

Azure also provides several resource-specific roles. Some common ones are:

1.	Virtual Machine Contributor - can manage virtual machines but not grant access to them, and cannot manage the virtual network or storage account to which they are connected
2.	Network Contributor - can manage all network resources, but not grant access to them
3.	Storage Account Contributor - Can manage storage accounts, but not grant access to them
4. SQL Server Contributor - Can manage SQL servers and databases, but not their security-related policies
5. Website Contributor - Can manage websites, but not the web plans to which they are connected

For the full list of roles and permitted actions, see [RBAC: Built in Roles](./active-directory/role-based-access-built-in-roles.md). For more information about role-based access control, see [Azure Role-based Access Control](./active-directory/role-based-access-control-configure.md). 

In some cases, you want to run code or script that accesses resources, but you do not want to run it under a user’s credentials. Instead, you want to create an identity called a service principal for the application and assign the appropriate role for the service principal. Resource Manager enables you to create credentials for the application and programmatically authenticate the application. To learn about creating service principals, see one of following topics:

- [Use Azure PowerShell to create a service principal to access resources](resource-group-authenticate-service-principal.md)
- [Use Azure CLI to create a service principal to access resources](resource-group-authenticate-service-principal-cli.md)
- [Use portal to create Active Directory application and service principal that can access resources](resource-group-create-service-principal-portal.md)

You can also explicitly lock critical resources to prevent users from deleting or modifying them. For more information, see [Lock resources with Azure Resource Manager](resource-group-lock-resources.md).

## Activity logs

Resource Manager logs all operations that create, modify, or delete a resource. You can use the activity logs to find an error when troubleshooting or to monitor how a user in your organization modified a resource. To see the logs, select **Activity logs** in the **Settings** blade for a resource group. You can filter the logs by many different values including which user initiated the operation. For information about working with the activity logs, see [Audit operations with Resource Manager](resource-group-audit.md).

## Customized policies

Resource Manager enables you to create customized policies for managing your resources. The types of policies you create can include diverse scenarios. You can enforce a naming convention on resources, limit which types and instances of resources can be deployed, or limit which regions can host a type of resource. You can require a tag value on resources to organize billing by departments. You create policies to help reduce costs and maintain consistency in your subscription. 

You define policies with JSON and then apply those policies either across your subscription or within a resource group. Policies are different than role-based access control because they are applied to resource types.

The following example shows a policy that ensures tag consistency by specifying that all resources include a costCenter tag.

    {
      "if": {
        "not" : {
          "field" : "tags",
          "containsKey" : "costCenter"
        }
      },
      "then" : {
        "effect" : "deny"
      }
    }

To prevent someone from deploying an unnecessarily expensive resource (such as in a test environment), you can restrict the permitted sizes. The following example shows how to restrict the virtual machines sku.

    {
      "if": {
        "allOf": [
          {
            "field": "type",
            "equals": "Microsoft.Compute/virtualMachines"
          },
          {
            "not": {
              "allof": [
                {
                  "field": "Microsoft.Compute/virtualMachines/sku.name",
                  "in": ["Standard_DS1_V2", "Standard_DS2_V2"]
                }
              ]
            }
          }
        ]
      },
      "then": {
        "effect": "deny"
      }
    }

The previous examples show actions that are denied if the request is not valid; however, you can instead choose to create an alert or append a value to the request. For more information, see [Use Policy to manage resources and control access](resource-manager-policy.md).

## Consistent management layer

Resource Manager provides compatible operations through Azure PowerShell, Azure CLI for Mac, Linux, and Windows, the Azure portal, or REST API. You can use the interface that works best for you, and move quickly between the interfaces without confusion.

For information about PowerShell, see [Using Azure PowerShell with Resource Manager](powershell-azure-resource-manager.md) and [Azure Resource Manager Cmdlets][powershellref].

For information about Azure CLI, see [Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Management](xplat-cli-azure-resource-manager.md).

For information about the REST API, see [Resource Manager REST APIs](resource-manager-rest-api.md).

For information about using the portal, see [Manage Azure resources through portal](./azure-portal/resource-group-portal.md).

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

- [Manage Azure resources and resource groups](https://azure.microsoft.com/documentation/samples/resource-manager-dotnet-resources-and-groups/)
- [Deploy an SSH enabled VM with a template](https://azure.microsoft.com/documentation/samples/resource-manager-dotnet-template-deployment/)

### Java

- [Manage Azure resources](https://azure.microsoft.com/documentation/samples/resources-java-manage-resource/)
- [Manage Azure resource groups](https://azure.microsoft.com/documentation/samples/resources-java-manage-resource-group/)
- [Deploy an SSH enabled VM with a template](https://azure.microsoft.com/documentation/samples/resources-java-deploy-using-arm-template/)

### Node.js

- [Manage Azure resources and resource groups](https://azure.microsoft.com/documentation/samples/resource-manager-node-resources-and-groups/)
- [Deploy an SSH enabled VM with a template](https://azure.microsoft.com/documentation/samples/resource-manager-node-template-deployment/)

### Python

- [Manage Azure resources and resource groups](https://azure.microsoft.com/documentation/samples/resource-manager-python-resources-and-groups/)
- [Deploy an SSH enabled VM with a template](https://azure.microsoft.com/documentation/samples/resource-manager-python-template-deployment/)

### Ruby

- [Manage Azure resources and resource groups](https://azure.microsoft.com/documentation/samples/resource-manager-ruby-resources-and-groups/)
- [Deploy an SSH enabled VM with a template](https://azure.microsoft.com/documentation/samples/resource-manager-ruby-template-deployment/)


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

[powershellref]: https://msdn.microsoft.com/library/azure/dn757692(v=azure.200).aspx
