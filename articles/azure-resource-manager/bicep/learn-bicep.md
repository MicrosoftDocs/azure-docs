---
title: Discover Bicep on Microsoft Learn
description: Provides an overview of the units that are available on Microsoft Learn for Bicep.
ms.topic: conceptual
ms.date: 08/08/2021
---
# Bicep on Microsoft Learn

For step-by-step guidance on using Bicep to deploy your infrastructure to Azure, Microsoft Learn offers several learning modules.

## Introductory path

The [Deploy and manage resources in Azure by using Bicep](/learn/paths/bicep-deploy/) learning path is the best place to start. It introduces you to the concept of infrastructure as code. The path takes you through the steps of building increasingly complex Bicep files.

This path contains the following modules.

| Learn module | Description |
| ------------ | ----------- |
| [Introduction to infrastructure as code using Bicep](/learn/modules/introduction-to-infrastructure-as-code-using-bicep/) | This module describes the benefits of using infrastructure as code, Azure Resource Manager, and Bicep to quickly and confidently scale your cloud deployments. It helps you determine the types of deployments for which Bicep is a good deployment tool. |
| [Build your first Bicep template](/learn/modules/build-first-bicep-template/) | In this module, you define Azure resources within a Bicep template. You improve the consistency and reliability of your deployments, reduce the manual effort required, and scale your deployments across environments. Your template will be flexible and reusable by using parameters, variables, expressions, and modules. |
| [Build reusable Bicep templates by using parameters](/learn/modules/build-reusable-bicep-templates-parameters/) | This module describes how you can use Bicep parameters to provide information for your template during each deployment. You'll learn about parameter decorators, which make your parameters easy to understand and work with. You'll also learn about the different ways that you can provide parameter values and protect them when you're working with secure information. |
| [Build flexible Bicep templates by using conditions and loops](/learn/modules/build-flexible-bicep-templates-conditions-loops/) | Learn how to use conditions to deploy resources only when specific constraints are in place. Also learn how to use loops to deploy multiple resources that have similar properties. |
| [Deploy child and extension resources by using Bicep](/learn/modules/child-extension-bicep-templates/) | This module shows how to deploy various Azure resources in your Bicep code. Learn about child and extension resources, and how they can be defined and used within Bicep. Use Bicep to work with resources that you created outside a Bicep template or module. |
| [Deploy resources to subscriptions, management groups, and tenants by using Bicep](/learn/modules/deploy-resources-scopes-bicep/) | Deploy Azure resources at the subscription, management group, and tenant scope. Learn what these resources are, why you would use them, and how you create Bicep code to deploy them. Also learn how to create a single set of Bicep files that you can deploy across multiple scopes in one operation. |
| [Extend templates by using deployment scripts](/learn/modules/extend-resource-manager-template-deployment-scripts/) | Learn how to add custom steps to your Bicep file or Azure Resource Manager template (ARM template) by using deployment scripts. |

## Other modules

In addition to the preceding path, the following modules contain Bicep content.

| Learn module | Description |
| ------------ | ----------- |
| [Manage changes to your Bicep code by using Git](/learn/modules/manage-changes-bicep-code-git/) | Learn how to use Git to support your Bicep development workflow by keeping track of the changes you make as you work. You'll find out how to commit files, view the history of the files you've changed, and how to use branches to develop multiple versions of your code at the same time. You'll also learn how to use GitHub or Azure Repos to publish a repository so that you can collaborate with team members. |
| [Publish libraries of reusable infrastructure code by using template specs](/learn/modules/arm-template-specs/) | Template specs enable you to reuse and share your ARM templates across your organization. Learn how to create and publish template specs, and how to deploy them. You'll also learn how to manage template specs, including how to control access and how to safely update them by using versions. |
| [Preview Azure deployment changes by using what-if](/learn/modules/arm-template-whatif/) | This module teaches you how to preview your changes with the what-if operation. By using what-if, you can make sure your Bicep file only makes changes that you expect. |
| [Structure your Bicep code for collaboration](/learn/modules/structure-bicep-code-collaboration/) | Build Bicep files that support collaborative development and follow best practices. Plan your parameters to make your templates easy to deploy. Use a consistent style, clear structure, and comments to make your Bicep code easy to understand, use, and modify. |
| [Authenticate your Azure deployment pipeline by using service principals](/learn/modules/authenticate-azure-deployment-pipeline-service-principals/) | Service principals enable your deployment pipelines to authenticate securely with Azure. In this module, you'll learn what service principals are, how they work, and how to create them. You'll also learn how to grant them permission to your Azure resources so that your pipelines can deploy your Bicep files. |
| [Build your first Bicep deployment pipeline by using Azure Pipelines](/learn/modules/build-first-bicep-deployment-pipeline-using-azure-pipelines/) | Build a basic deployment pipeline for Bicep code. Use a service connection to securely identify your pipeline to Azure. Configure when the pipeline runs by using triggers. |

## Next steps

* For a short introduction to Bicep, see [Bicep quickstart](quickstart-create-bicep-use-visual-studio-code.md).
* For suggestions about how to improve your Bicep files, see [Best practices for Bicep](best-practices.md).
