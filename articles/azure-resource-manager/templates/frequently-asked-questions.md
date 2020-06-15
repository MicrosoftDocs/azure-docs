---
title: ARM template frequently asked questions
description: Frequently asked questions (FAQ) about Azure Resource Manager templates.
ms.topic: conceptual
ms.date: 05/30/2020
ms.author: tomfitz
author: tfitzmac
---

# Frequently asked questions about ARM templates

This article answers frequently asked questions about Azure Resource Manager (ARM) templates.

## Getting started

* **What are ARM templates, and why should I use them?**

  ARM templates are JSON files where you define what you want to deploy to Azure. Templates help you implement an infrastructure-as-code solution for Azure. Your organization can repeatedly and reliably deploy the required infrastructure to different environments.
  
  To learn more about how ARM templates help you manage your Azure infrastructure, see [What are ARM templates?](overview.md)

* **How do I get started with templates?**

  To simplify authoring ARM templates, you need the right tools. We recommend installing [Visual Studio Code](https://code.visualstudio.com/) and the [Azure Resource Manager tools extension](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools). For a quick introduction to these tools, see [Quickstart: Create Azure Resource Manager templates with Visual Studio Code](quickstart-create-templates-use-visual-studio-code.md).

  When you're ready to learn about creating ARM templates, start the [beginner tutorial series on ARM templates](template-tutorial-create-first-template.md). These tutorials take you step by step through the process of constructing an ARM template. You learn about the different sections of the template and how to they work together. This content is also available as a [Microsoft Learn module](/learn/modules/authoring-arm-templates/).

* **Should I use ARM templates or Terraform to deploy to Azure?**

  Use the option that you like the best. Both services assist you with automating deployments to Azure.
  
  We believe there are benefits to using ARM templates over other infrastructure-as-code services. To learn about those benefits, see [Why choose ARM templates?](overview.md#why-choose-arm-templates)

## Build 2020

* **I missed your presentation at Microsoft Build 2020. Is the presentation available for viewing?**

  Yes, please [watch it anytime](https://mybuild.microsoft.com/sessions/82984db4-37a4-4ed3-bf8b-13298841ed18?source=sessions).

* **Where can I get more information about the new features you announced at Build?**

  For general information about features we're working, join our [Azure Advisors Deployments Yammer group](https://aka.ms/ARMMeet).

  To learn about the new template language, [sign up for notifications](https://aka.ms/armLangUpdates).

  For the preview of template specs, [join the wait list](https://aka.ms/templateSpecsWaitlist).

## Creating and testing templates

* **Where can I learn about best practices for ARM templates?**

  For recommendations about how you implement your templates, see [ARM template best practices](template-best-practices.md). After creating a template, run the [ARM test toolkit](https://github.com/azure/arm-ttk). It checks whether your template matches recommended practices.

* **I have set up my environment through the portal. Is there some way to get the template from an existing resource group?**

  Yes, you can [export the template](export-template-portal.md) from a resource group. The exported template is a good starting point for learning about templates, but you'll probably want to revise it before using it in a production environment.
  
  When exporting the template, you can select which resources you want to include in the template.

* **Can I create a resource group in an ARM template and deploy resources to it?**

  Yes, you can create a resource group in a template when you deploy the template at the level of your Azure subscription. For an example of creating a resource group and deploying resources, see [Resource group and resources](deploy-to-subscription.md#resource-group-and-resources).

* **Can I create a subscription in an ARM template?**

  Not yet, but we're working on it.

* **How can I test my template before deploying it?**

  We recommend running the [ARM test toolkit](https://github.com/azure/arm-ttk) and the [what-if operation](template-deploy-what-if.md) on your templates before deploying them. The test toolkit checks whether your template uses best practices. It provides warnings when it identifies changes that could improve how you've implemented your template.

  The what-if operation shows the changes your template will make to your environment. You can see unintended changes before they're deployed. What-if also returns any errors it can detect during preflight validation. For example, if your template contains a syntactical error, it returns that error. It also returns any errors it can determine about the final state of the deployed resources. For example, if your template deploys a storage account with a name that is already in use, what-if returns that error.

* **Where can I find information about the properties that are available for each resource type?**

  VS Code provides intellisense for working with the resource properties. You can also view the [template reference](/azure/templates/) for properties and descriptions.

* **I need to create multiple instances of a resource type. How do I create an iterator in my template?**

  Use the copy element to specify more than one instance. You can use copy on [resources](copy-resources.md), [properties](copy-properties.md), [variables](copy-variables.md), and [outputs](copy-outputs.md).

## Template language

* **I've heard you're working on a new template language. Where can I find out more about it?**

  To learn about the new template language, [sign up for notifications](https://aka.ms/armLangUpdates).

* **Is there a plan to support creating templates in YAML?**

  Currently, there's no plan to support YAML. We believe the new template language will offer a solution that is easier to use than YAML or JSON.

* **Can I still write templates in JSON after the new template language has been released?**

  Yes, you can continue using JSON templates.

* **Will you offer a tool to convert my JSON templates to the new template language?**

  Yes.

## Template Specs

* **How can I get involved in the preview release of Template Specs?**

  [Join the wait list](https://aka.ms/templateSpecsWaitlist) for template specs.

* **How are template specs and Azure Blueprints related?**

  Azure Blueprints will use template specs in its implementation by replacing the `blueprint definition` resource with a `template spec` resource. We will provide a migration path to convert the blueprint definition into a template spec, but the blueprint definition APIs will still be supported. There are no changes to the `blueprint assignment` resource. Blueprints will remain a user-experience to compose a governed environment in Azure.

* **Do template specs replace linked templates?**

  No, but template specs are designed to work well with linked templates. You don't have to move the linked template to a publicly accessible endpoint before deploying the parent template. Instead, you package the parent template and its artifacts together when creating the template spec.

* **Can template specs be shared across subscriptions?**

  Yes, they can be used across subscriptions as long as the user has read access to the template spec. Template specs can't be used across tenants.

## Scripts in templates

* **Can I include a script in my template to do tasks that aren't possible in a template?**

  Yes, use [deployment scripts](deployment-script-template.md). You can include Azure PowerShell or Azure CLI scripts in your templates. The feature is in preview.

* **Can I still use custom script extensions and desired state configuration (DSC)?**

  Those options are still available and haven't changed. Deployment scripts are designed to perform actions that are not related to the VM guest. If you need to run a script on a host operating system in a VM, then the customer script extension and/or DSC would be a better choice. However, deployment scripts have advantages, such as setting the timeout duration.

* **Are deployment scripts supported in Azure Government?**

  Yes, you can use deployment scripts in US Gov Arizona and US Gov Virginia.

## Preview changes before deployment

* **Can I preview the changes that will happen before deploying a template?**

  Yes, use the [what-if feature](template-deploy-what-if.md). It evaluates the current state of your environment and compares it to the state that will exist after deployment. You can examine the summarized changes to make sure the template doesn't have any unexpected results.

* **Can I use what-if with both incremental and complete modes?**

  Yes, both [deployment modes](deployment-modes.md) are supported. For an example of using incremental mode, see [Run what-if operation](template-deploy-what-if.md#run-what-if-operation). For an example of using complete mode, see [Confirm deletion](template-deploy-what-if.md#confirm-deletion).

* **Does what-if work with linked templates?**

  Yes, what-if evaluates the state of the parent template and its linked templates.

* **Can I use what-if in an Azure Pipeline?**

  Yes, you can use what-if to verify that the Pipeline should continue.

* **When I use what-if, I see changes in properties that aren't in my template. Is this "noise" expected?**

  What-if is in preview. We're working on reducing the noise. You help us improve by submitting issues in our GitHub repo here: https://aka.ms/WhatIfIssues

## Template visualizer

* **Is there a way for me to visualize my ARM template and its resources?**

  We have a [community-contributed VS Code extension](https://aka.ms/ARMVisualizer) that does a great job of visualizing your ARM template. It shows the resources you're deploying and the relationships between them.

* **Can I use the template visualizer outside of VS Code?**

  The template visualizer is being previewed in the portal. For more information, watch this [short session from Build](https://mybuild.microsoft.com/sessions/0525094b-1fd2-4f69-bfd6-6d2fff6ffe5f?source=sessions).

## Deployment limits

* **How many resource groups can I deploy to in a single deployment operation?**

  In the past, this limit was five resource groups. It has recently been increased to 800 resource groups. For more information, see [Create resource groups and resources at the subscription level](deploy-to-subscription.md).

* **I got an error about being limited to 800 deployments in the deployment history. What should I do?**

  We're changing how the deployment history for a resource group is maintained. In the past, you had to manually delete deployments from this history to avoid this error. Starting in June 2020, we'll automatically delete deployments from the history as you get near the limit. For more information, see [Automatic deletions from deployment history](deployment-history-deletions.md).

  Deleting a deployment from the history doesn't affect the deployed resources.

## Templates and DevOps

* **Can I integrate ARM templates into Azure Pipelines?**

  Yes. For an explanation of how to use template and pipelines, see [Tutorial: Continuous integration of Azure Resource Manager templates with Azure Pipelines](deployment-tutorial-pipeline.md) and [Integrate ARM templates with Azure Pipelines](add-template-to-azure-pipelines.md).

* **Can I use GitHub actions to deploy a template?**

  Yes, see [Deploy Azure Resource Manager templates by using GitHub Actions](deploy-github-actions.md).

## Next steps

For an introduction to ARM templates, see [What are ARM templates?](overview.md).
