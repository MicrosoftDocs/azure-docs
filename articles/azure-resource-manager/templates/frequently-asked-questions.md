---
title: ARM template frequently asked questions
description: Frequently asked questions (FAQ) about Azure Resource Manager templates.
ms.topic: conceptual
ms.date: 05/27/2020
---

# Frequently asked questions about ARM templates

## General

* **Why should I use ARM templates?**



* **Should I use ARM templates or Terraform to deploy to Azure?**

  You should use the option that you like the best. Both services assist you with automating deployments to Azure.
  
  We believe there are benefits to using ARM templates over other infrastructure-as-code services. To learn about those benefits, see [What are ARM templates?](overview.md)

## Build 2020

* **I missed your presentation at Microsoft Build 2020. Is the presentation available for viewing?**

  Yes, please [watch it anytime](https://mybuild.microsoft.com/sessions/82984db4-37a4-4ed3-bf8b-13298841ed18?source=sessions).

* **Where can I get more information about the new features you announced at Build?**

  For general information about features we're working, join our [Azure Advisors Deployments Yammer group](https://aka.ms/ARMMeet).

  To learn about the new template language, [sign up for notifications](https://aka.ms/armLangUpdates).

  For the preview of template specs, [join the wait list](https://aka.ms/templateSpecsWaitlist).

## Template language

* **I have heard you're working on a new template language. Where can I find out more about it?**

  To learn about the new template language, [sign up for notifications](https://aka.ms/armLangUpdates).

* **Is there a plan to support creating templates in YAML?**

  Currently, there is no plan to support YAML. We believe the new template language will offer a solution that is easier to use than YAML or JSON.

* **Will I still be able to write templates in JSON after the new template language has been released?**

  Yes, JSON will be supported.

* **Will you offer a tool to convert my JSON templates to the new template language?**

  Yes.

## Export template

* **I have set up my environment through the portal. Is there some way to get the template from an existing resource group?**

  Yes, you can [export the template](export-template-portal.md) from a resource group. When exporting the template, you can select which resources you want to include in the template. The exported template is a good starting point for learning about templates, but you'll probably need to revise it before using it in a production environment.

## Scripts in templates

* **Can I include a script in my template to do tasks that aren't possible in a template?**

  Yes, use [deployment scripts](deployment-script-template.md). You can include Azure PowerShell or Azure CLI scripts in your templates. The feature is currently in preview.

* **Can I still use custom script extensions and desired state configuration (DSC)?**

  Yes, those options are still available and haven't changed. However, deployment scripts have advantages, such as setting the timeout duration.

* **Are deployment scripts supported in Azure Government?**

  Yes, you can use deployment scripts in US Gov Arizona and US Gov Virginia.

## Preview changes before deployment

* **Can I preview the changes that will happen before deploying a template?**

  Yes, use the [what-if feature](template-deploy-what-if.md). It evaluates the current state of your environment and compares it to the state that will exist after deployment. You can examine the summarized changes to make sure the template doesn't have any unexpected results.

* **Can I use what-if with both incremental and complete modes?**

  Yes, both [deployment modes](deployment-modes.md) are supported. For an example of using incremental mode, see [Run what-if operation](template-deploy-what-if.md#run-what-if-operation). For an example of using complete mode, see [Confirm deletion](template-deploy-what-if.md#confirm-deletion).

* **Can I use what-if in an Azure Pipeline?**

  Yes, you can use what-if to verify that the Pipeline should continue.

* **I see a lot of noise when I run what-if. Is this noise expected?**

  What-if is in preview. We're working on reducing the noise. You help us improve by submitting issues in our GitHub repo here: https://aka.ms/WhatIfIssues


## Next steps


