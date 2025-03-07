---
title: Templates overview
description: Describes the benefits of using Azure Resource Manager templates (ARM templates) for deployment of resources.
ms.topic: overview
ms.custom: devx-track-arm-template
ms.date: 01/29/2025
---

# What are ARM templates?

With the move to the cloud, many teams adopted agile development methods. These teams iterate quickly. They need to repeatedly deploy their solutions to the cloud, and know their infrastructure is in a reliable state. As infrastructure became part of the iterative process, the division between operations and development disappeared. Teams need to manage infrastructure and application code through a unified process.

To meet these challenges, automate deployments and use the practice of infrastructure as code. In code, you define the infrastructure that needs to be deployed. The infrastructure code is part of your project. Just like application code, store the infrastructure code in a source repository and version it. Anyone on your team can run the code and deploy similar environments.

To implement infrastructure as code for your Azure solutions, use Azure Resource Manager templates (ARM templates). The template is a JavaScript Object Notation (JSON) file that defines the infrastructure and configuration for your project. The template uses declarative syntax, which lets you state what you intend to deploy without having to write the sequence of programming commands to create it. In the template, you specify the resources to deploy and the properties for those resources. You can also specify in which resource group those resources are deployed.

> [!TIP]
> We introduced a new language named [Bicep](../bicep/overview.md) that offers the same capabilities as ARM templates but with a syntax that's easier to use. Each Bicep file is automatically converted to an ARM template during deployment. If you're considering infrastructure as code options, we recommend looking at Bicep. For more information, see [What is Bicep?](../bicep/overview.md).

## Why choose ARM templates?

If you're trying to decide between using ARM templates and one of the other infrastructure as code services, consider the following advantages of using templates:

* **Declarative syntax**: ARM templates allow you to create and deploy an entire Azure infrastructure declaratively. For example, you can deploy not only virtual machines, but also the network infrastructure, storage systems, and any other resources you need.

* **Repeatable results**: Repeatedly deploy your infrastructure throughout the development lifecycle and have confidence your resources are deployed in a consistent manner. Templates are idempotent, which means you can deploy the same template many times and get the same resource types in the same state. You can develop one template that represents the desired state, rather than developing lots of separate templates to represent updates. For example, the following file creates a storage account. If you deploy this template and the storage account with the specified properties already exists, no changes are made.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    }
  },
  "resources": {
    "mystore": {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2023-04-01",
      "name": "mystorageaccount",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "StorageV2"
    }
  }
}
```

* **Orchestration**: You don't have to worry about the complexities of ordering operations. Resource Manager orchestrates the deployment of interdependent resources so they're created in the correct order. When possible, Resource Manager deploys resources in parallel, so your deployments finish faster than serial deployments. You deploy the template through one command, rather than through multiple imperative commands.

   :::image type="content" source="./media/overview/template-processing.png" alt-text="Diagram that shows the difference between imperative and declarative deployment.":::

* **Modular files**: You can break your templates into smaller, reusable components and link them together at deployment time. You can also nest one template inside another template.

* **Create any Azure resource**: You can immediately use new Azure services and features in templates. As soon as a resource provider introduces new resources, you can deploy those resources through templates. You don't have to wait for tools or modules to be updated before using the new services.

* **Extensibility**: With [deployment scripts](deployment-script-template.md), you can add PowerShell or Bash scripts to your templates. The deployment scripts extend your ability to set up resources during deployment. You can include a script in the template or store it in an external source and reference it in the template. With deployment scripts, you can  complete your end-to-end environment setup in a single ARM template.

* **Testing**: To ensure your template follows recommended guidelines, test it with the ARM template tool kit (arm-ttk). This test kit is a PowerShell script that you can download from [GitHub](https://github.com/Azure/arm-ttk). The tool kit makes it easier for you to develop expertise using the template language.

* **Preview changes**: Use the [what-if operation](./deploy-what-if.md) to preview changes before deploying the template. With what-if, you see which resources to create, update, or delete, and any resource properties to change. The what-if operation checks the current state of your environment and eliminates the need to manage state.

* **Built-in validation**: Your template is deployed only after passing validation. Resource Manager checks the template before starting the deployment to make sure it succeeds. Your deployment is less likely to stop in a half-finished state.

* **Tracked deployments**: In the Azure portal, you can review the deployment history and get information about the template deployment. You can see the template that was deployed, the parameter values passed in, and any output values. Other infrastructure as code services aren't tracked through the portal.

   :::image type="content" source="./media/overview/deployment-history.png" alt-text="Screenshot of the Azure portal showing deployment history.":::

* **Policy as code**: [Azure Policy](../../governance/policy/overview.md) is a policy as code framework to automate governance. If you're using Azure policies, policy remediation is done on noncompliant resources when deployed through templates.

* **Deployment Blueprints**: You can take advantage of [Blueprints](../../governance/blueprints/overview.md) provided by Microsoft to meet regulatory and compliance standards. These blueprints include prebuilt templates for various architectures.

* **CI/CD integration**: You can integrate templates into your continuous integration and continuous deployment (CI/CD) tools. This integration automates your release pipelines for fast and reliable application and infrastructure updates. By using Azure DevOps and Resource Manager template task, you can use Azure Pipelines to continuously build and deploy ARM template projects. To learn more, see [VS project with pipelines](add-template-to-azure-pipelines.md) and [Tutorial: Continuous integration of Azure Resource Manager templates with Azure Pipelines](./deployment-tutorial-pipeline.md).

* **Exportable code**: You can get a template for an existing resource group by either exporting the current state of the resource group or viewing the template used for a particular deployment. Viewing the [exported template](export-template-portal.md) is a helpful way to learn about the template syntax.

* **Authoring tools**: You can author templates with [Visual Studio Code](quickstart-create-templates-use-visual-studio-code.md) and the template tool extension. You get IntelliSense, syntax highlighting, in-line help, and many other language functions. In addition to Visual Studio Code, you can also use [Visual Studio](create-visual-studio-deployment-project.md).

## Template file

Within your template, you can write [template expressions](template-expressions.md) that extend the capabilities of JSON. These expressions use the [functions](template-functions.md) that Resource Manager provides.

The template has the following sections:

* [Parameters](./parameters.md) - Provide values during deployment that you customize for different environments when using the same template.

* [Variables](./variables.md) - Define values that you reuse in your templates. You can construct them from parameter values.

* [User-defined functions](./user-defined-functions.md) - Create customized functions that simplify your template.

* [Resources](resource-declaration.md) - Specify the resources to deploy.

* [Outputs](./outputs.md) - Return values from the deployed resources.

## Template deployment process

When you deploy a template, Resource Manager converts the template into REST API operations. For example, when Resource Manager receives a template with the following resource definition:

```json
"resources": [
  {
    "type": "Microsoft.Storage/storageAccounts",
    "apiVersion": "2022-09-01",
    "name": "mystorageaccount",
    "location": "centralus",
    "sku": {
      "name": "Standard_LRS"
    },
    "kind": "StorageV2"
  },
]
```

It converts the definition to the following REST API operation, which it sends to the Microsoft.Storage resource provider:

```HTTP
PUT
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/mystorageaccount?api-version=2022-09-01
REQUEST BODY
{
  "location": "centralus",
  "sku": {
    "name": "Standard_LRS"
  },
  "kind": "StorageV2",
  "properties": {}
}
```

Notice that the **apiVersion** you set in the template for the resource is used as the API version for the REST operation. You can repeatedly deploy the template and have confidence it continues to work. By using the same API version, you don't have to worry about breaking changes that might be introduced in later versions.

To deploy a template, use any of the following options:

* [Azure portal](deploy-portal.md)
* [Azure CLI](deploy-cli.md)
* [PowerShell](deploy-powershell.md)
* [REST API](deploy-rest.md)
* [Button in GitHub repository](deploy-to-azure-button.md)
* [Azure Cloud Shell](deploy-cloud-shell.md)

## Template design

Define templates and resource groups based on how you want to manage your solution. For example, you can deploy your three-tier application through a single template to a single resource group.

:::image type="content" source="./media/overview/3-tier-template.png" alt-text="Diagram that shows a three-tier application deployment using a single template.":::

You don't have to define your entire infrastructure in a single template. Often, it makes sense to divide your deployment requirements into a set of targeted, purpose-specific templates. You can easily reuse these templates for different solutions. To deploy a particular solution, create a main template that links all the required templates. The following image shows how to deploy a three-tier solution through a parent template that includes three nested templates.

:::image type="content" source="./media/overview/nested-tiers-template.png" alt-text="Diagram that shows a three-tier application deployment using nested templates.":::

If you envision your tiers having separate lifecycles, you can deploy your three tiers to separate resource groups. The resources can still be linked to resources in other resource groups.

:::image type="content" source="./media/overview/tier-templates.png" alt-text="Diagram that shows a three-tier application deployment with separate resource groups.":::

For information about nested templates, see [Using linked templates with Azure Resource Manager](linked-templates.md).

## Share templates

After creating your template, you might want to share it with other users in your organization. [Template specs](template-specs.md) enable you to store a template as a resource type. Use role-based access control to manage access to the template spec. Users with read access to the template spec can deploy it, but not change the template.

This approach means you can safely share templates that meet your organization's standards.

[!INCLUDE [Request ARM template support](../../../includes/template-support.md)]

## Next steps

* For a step-by-step tutorial that guides you through the process of creating a template, see [Tutorial: Create and deploy your first ARM template](template-tutorial-create-first-template.md).
* To learn about ARM templates through a guided set of Learn modules, see [Deploy and manage resources in Azure by using ARM templates](/training/paths/deploy-manage-resource-manager-templates/).
* For information about the properties in template files, see [Understand the structure and syntax of ARM templates](./syntax.md).
* To learn about exporting templates, see [Quickstart: Create and deploy ARM templates by using the Azure portal](quickstart-create-templates-use-the-portal.md).
* For answers to common questions, see [Frequently asked questions about ARM templates](./frequently-asked-questions.yml).
