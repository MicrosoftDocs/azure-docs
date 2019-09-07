---
title: Azure Resource Manager templates
description: Describes how to use Azure Resource Manager templates for deployment of resources.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 09/06/2019
ms.author: tomfitz

---
# Azure Resource Manager templates

With the move to the cloud, many teams have adopted agile development methods. These teams iterate quickly. They need to repeatedly and reliably deploy their solutions to the cloud. The division between operations and development has disappeared as teams need to manage infrastructure and source code in a single process.

One solution to these challenges is to automate deployment and use the practice of infrastructure as code. In code, you define what needs to be deployed, and manage that code through the same process as your application code. You store the infrastructure code in a source repository and version it.

Azure Resource Manager templates enable you to implement infrastructure as code for your Azure solutions. The template is a JavaScript Object Notation (JSON) file that contains the infrastructure and configuration for your project. The template uses declarative syntax, which lets you state what you intend to deploy without having to write the sequence of programming commands to create it. In the template, you specify the resources to deploy and the properties for those resources.

## Benefits of Resource Manager templates

Resource Manager templates are the recommended way to automate deployments to Azure. Templates provide several benefits. You can:

* Deploy, manage, and monitor all the resources for your solution as a group, rather than handling these resources individually.

* Repeatedly deploy your solution throughout the development lifecycle and have confidence your resources are deployed in a consistent state.

* Manage your infrastructure through declarative templates rather than scripts.

When comparing Resource Manager templates to other infrastructure as code services, consider the following advantages templates have over those services:

* New Azure services and features are immediately available through templates. As soon as a resource provider introduces new resources, you can deploy those resources through templates. With other infrastructure as code services, you need to wait for third parties to implement interfaces for the new resources.

* Template deployments are handled through a single submission of the template, rather than through multiple imperative commands. Resource Manager orchestrates the deployment of interdependent resources so they're created in the correct order. It parses the template and determines the correct order for deployment based on references between resources. You focus on setting the property values for each resource.

   ![Template deployment comparison](./media/template-deployment-overview/template-processing.png)

* Template deployments are tracked in the Azure portal. You can review the deployment history and get information about the template deployment. You can see the template that was deployed, the parameter values passed in, and any output values. Other infrastructure as code services aren't tracked through the portal.

   ![Deployment history](./media/template-deployment-overview/deployment-history.png)

* Template deployments undergo pre-flight validation. Resource Manager checks the template before starting the deployment to make sure the deployment will succeed. Your deployment is less likely to stop in a half-finished state.

* If you're using [Azure policies](../governance/policy/overview.md), policy remediation is done on non-compliant resources when deployed through templates.

* Microsoft provides deployment [Blueprints](../governance/blueprints/overview.md) to meet regulatory and compliance standards. These blueprints include pre-built templates for various architectures.

## Template file

Within your template, you can write [template expressions](template-expressions.md) that extend the capabilities of JSON. These expressions make use of the [functions](resource-group-template-functions.md) provided by Resource Manager.

The template has the following sections:

* [Parameters](template-parameters.md) - Provide values during deployment that allow the same template to be used with different environments.

* [Variables](template-variables.md) - Define values that used in your templates.

* [User-defined functions](template-user-defined-functions.md) - Create customized functions that simplify your template.

* [Resources](resource-group-authoring-templates.md#resources) - Specify the resources to deploy.

* [Outputs](template-outputs.md) - Return values from the deployed resources.

## Template features

Resource Manager analyzes dependencies to ensure resources are created in the correct order. Most dependencies are determined implicitly. However, you can explicitly set a dependency to make sure one resource is deployed before another resource. For more information, see [Defining dependencies in Azure Resource Manager templates](resource-group-define-dependencies.md).

You can add a resource to your template and optionally deploy it. Typically, you pass in a parameter value that indicates whether the resource needs to be deployed. For more information, see [Conditional deployment in Resource Manager templates](conditional-resource-deployment.md).

Rather than repeating blocks of JSON many times in your template, you can use a copy element to specify more than one instance of a variable, property, or resource. For more information, see [Resource, property, or variable iteration in Azure Resource Manager templates](resource-group-create-multiple.md).

## Export templates

You can get a template for an existing resource group by either exporting the current state of the resource group, or viewing the template used for a particular deployment. Viewing the [exported template](export-template-portal.md) is a helpful way to learn about the template syntax.

When you create a solution from the portal, the solution automatically includes a deployment template. You don't have to create your template from scratch because you can start with the template for your solution and customize it to meet your specific needs. For a sample, see [Quickstart: Create and deploy Azure Resource Manager templates by using the Azure portal](./resource-manager-quickstart-create-templates-use-the-portal.md).

## Template deployment process

When you deploy a template, Resource Manager converts the template into REST API operations. For example, when Resource Manager receives a template with the following resource definition:

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

If the resource already exists in the resource group and the request contains no updates to the properties, no action is taken. If the resource exists but properties have changed, the existing resource is updated. If the resource doesn't exist, the new resource is created. This approach makes it safe for you to redeploy a template and know that the resources remain in a consistent state.

## Template design

How you define templates and resource groups is entirely up to you and how you want to manage your solution. For example, you can deploy your three tier application through a single template to a single resource group.

![three tier template](./media/template-deployment-overview/3-tier-template.png)

But, you don't have to define your entire infrastructure in a single template. Often, it makes sense to divide your deployment requirements into a set of targeted, purpose-specific templates. You can easily reuse these templates for different solutions. To deploy a particular solution, you create a master template that links all the required templates. The following image shows how to deploy a three tier solution through a parent template that includes three nested templates.

![nested tier template](./media/template-deployment-overview/nested-tiers-template.png)

If you envision your tiers having separate lifecycles, you can deploy your three tiers to separate resource groups. Notice the resources can still be linked to resources in other resource groups.

![tier template](./media/template-deployment-overview/tier-templates.png)

For information about nested templates, see [Using linked templates with Azure Resource Manager](resource-group-linked-templates.md).

## Next steps

* For information about the properties in template files, see [Understand the structure and syntax of Azure Resource Manager templates](resource-group-authoring-templates.md).
* To get started developing template, see [Use Visual Studio Code to create Azure Resource Manager templates](resource-manager-tools-vs-code.md).


