---
title: ARM template frequently asked questions
description: Frequently asked questions (FAQ) about Azure Resource Manager templates.
ms.topic: conceptual
ms.date: 05/28/2020
---

# Frequently asked questions about ARM templates

## General

* **How do I get started with templates?**

  First, we suggest you get an [overview of ARM templates](overview.md) and how they help you manage your Azure infrastructure.

  Then, install [Visual Studio Code](https://code.visualstudio.com/) and the [Azure Resource Manager tools extension](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools). These tools greatly simplify the experience of developing ARM templates. For a quick introduction, see [Quickstart: Create Azure Resource Manager templates with Visual Studio Code](quickstart-create-templates-use-visual-studio-code.md).

  Now, you're ready to learn about creating ARM templates. View the [beginner tutorial series on ARM templates](template-tutorial-create-first-template.md). This tutorial series takes you step by step through the process of constructing an ARM template. You learn about the different sections of the template and how to they work together. This content is also available as a [Microsoft Learn module](/learn/modules/authoring-arm-templates/).

* **Should I use ARM templates or Terraform to deploy to Azure?**

  Use the option that you like the best. Both services assist you with automating deployments to Azure.
  
  We believe there are benefits to using ARM templates over other infrastructure-as-code services. To learn about those benefits, see [What are ARM templates?](overview.md#why-choose-arm-templates)

## Build 2020

* **I missed your presentation at Microsoft Build 2020. Is the presentation available for viewing?**

  Yes, please [watch it anytime](https://mybuild.microsoft.com/sessions/82984db4-37a4-4ed3-bf8b-13298841ed18?source=sessions).

* **Where can I get more information about the new features you announced at Build?**

  For general information about features we're working, join our [Azure Advisors Deployments Yammer group](https://aka.ms/ARMMeet).

  To learn about the new template language, [sign up for notifications](https://aka.ms/armLangUpdates).

  For the preview of template specs, [join the wait list](https://aka.ms/templateSpecsWaitlist).

## Template language

* **I've heard you're working on a new template language. Where can I find out more about it?**

  To learn about the new template language, [sign up for notifications](https://aka.ms/armLangUpdates).

* **Is there a plan to support creating templates in YAML?**

  Currently, there's no plan to support YAML. We believe the new template language will offer a solution that is easier to use than YAML or JSON.

* **Can I still write templates in JSON after the new template language has been released?**

  Yes, you can continue using JSON templates.

* **Will you offer a tool to convert my JSON templates to the new template language?**

  Yes.

## Export template

* **I have set up my environment through the portal. Is there some way to get the template from an existing resource group?**

  Yes, you can [export the template](export-template-portal.md) from a resource group. The exported template is a good starting point for learning about templates, but you'll probably need to revise it before using it in a production environment.
  
  When exporting the template, you can select which resources you want to include in the template.

## Scripts in templates

* **Can I include a script in my template to do tasks that aren't possible in a template?**

  Yes, use [deployment scripts](deployment-script-template.md). You can include Azure PowerShell or Azure CLI scripts in your templates. The feature is in preview.

* **Can I still use custom script extensions and desired state configuration (DSC)?**

  Those options are still available and haven't changed. However, deployment scripts have advantages, such as setting the timeout duration.

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

* **When use what-if, I see lots changes in properties that aren't in my template. Is this "noise" expected?**

  What-if is in preview. We're working on reducing the noise. You help us improve by submitting issues in our GitHub repo here: https://aka.ms/WhatIfIssues

## Template visualizer

* **Is there a way for me to visualize my ARM template and its resources?**

  We have a [community-contributed VS Code extension](https://aka.ms/ARMVisualizer) that does a great job of visualizing your ARM template. It shows the resources you're deploying and the relationship between them.

* **Can I use the template visualizer outside of VS Code?**

  The template visualizer is being previewed in the portal. For more information, watch this [short session from Build](https://mybuild.microsoft.com/sessions/0525094b-1fd2-4f69-bfd6-6d2fff6ffe5f?source=sessions).

## Testing templates

* **How can I test my template before deploying it?**

  We recommend running the [ARM test toolkit](https://github.com/azure/arm-ttk) on your templates. The toolkit is primarily focused on checking whether you use best practices in your template. It also checks for syntactical errors. It provides warnings when it identifies changes that improve the implementation of your template.

  We recommend running the [what-if operation](template-deploy-what-if.md) on your template before deploying it. It previews changes your template will make to your environment. You can see unintended changes before they're deployed.
  
  What-if also returns any errors it can detect during preflight validation. For example, if your template contains a syntactical error, it returns that error. It also returns any errors it can determine about the final state of the deployed resources. For example, if your template deploys a storage account with a name that is already in use, what-if returns that error.



## Next steps


