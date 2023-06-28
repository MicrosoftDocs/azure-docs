---
title: Migrate Azure resources and JSON ARM templates to use Bicep
description: Describes the recommended workflow when migrating Azure resources and JSON ARM templates to use Bicep.
author: joshuawaddell
ms.author: jowaddel
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 03/03/2023
---
# Migrate to Bicep

There are many benefits to defining your Azure resources in Bicep including: simpler syntax, modularization, automatic dependency management, type validation and IntelliSense, and an improved authoring experience.

When migrating existing JSON Azure Resource Manager templates (ARM templates) to Bicep, we recommend following the five-phase workflow:

:::image type="content" source="./media/migrate/five-phases.png" alt-text="Diagram of the five phases for migrating Azure resources to Bicep: convert, migrate, refactor, test, and deploy." border="false":::

The first step in the process is to capture an initial representation of your Azure resources. If necessary, you then decompile the JSON file to an initial Bicep file, which you improve upon by refactoring. When you have a working file, you test and deploy using a process that minimizes the risk of breaking changes to your Azure environment.

:::image type="content" source="./media/migrate/migrate-bicep.png" alt-text="Diagram of the recommended workflow for migrating Azure resources to Bicep." border="false":::

In this article, we summarize this recommended workflow. For detailed guidance, see [Migrate Azure resources and JSON ARM templates to use Bicep](/training/modules/migrate-azure-resources-bicep/).

## Phase 1: Convert

In the _convert_ phase of migrating your resources to Bicep, the goal is to capture an initial representation of your Azure resources. The Bicep file you create in this phase isn't complete, and it's not ready to be used. However, the file gives you a starting point for your migration.

The convert phase consists of two steps, which you complete in sequence:

1. **Capture a representation of your Azure resources.** If you have an existing JSON template that you're converting to Bicep, the first step is easy - you already have your source template. If you're converting Azure resources that were deployed by using the portal or another tool, you need to capture the resource definitions. You can capture a JSON representation of your resources using the Azure portal, Azure CLI, or Azure PowerShell cmdlets to *export* single resources, multiple resources, and entire resource groups. You can use the **Insert Resource** command within Visual Studio Code to import a Bicep representation of your Azure resource.

1. **If required, convert the JSON representation to Bicep using the _decompile_ command.** [The Bicep tooling includes the `decompile` command to convert templates.](decompile.md) You can invoke the `decompile` command from [Visual Studio Code with the Bicep extension](./visual-studio-code.md#decompile-into-bicep), the [Azure CLI](./bicep-cli.md#decompile), or from the [Bicep CLI](./bicep-cli.md#decompile). The decompilation process is a best-effort process and doesn't guarantee a full mapping from JSON to Bicep. You may need to revise the generated Bicep file to meet your template best practices before using the file to deploy resources.

> [!NOTE]
> You can import a resource by opening the Visual Studio Code command palette. Use <kbd>Ctrl+Shift+P</kbd> on Windows and Linux and <kbd>⌘+Shift+P</kbd> on macOS.
>
> Visual Studio Code enables you to paste JSON as Bicep. For more information, see [Paste JSON as Bicep](./visual-studio-code.md#paste-as-bicep).

## Phase 2: Migrate

In the _migrate_ phase of migrating your resources to Bicep, the goal is to create the first draft of your deployable Bicep file, and to ensure it defines all of the Azure resources that are in scope for the migration.

The migrate phase consists of three steps, which you complete in sequence:

1. **Create a new empty Bicep file.** It's good practice to create a brand new Bicep file. The file you created in the _convert_ phase is a reference point for you to look at, but you shouldn't treat it as final or deploy it as-is.

1. **Copy each resource from your decompiled template.** Copy each resource individually from the converted Bicep file to the new Bicep file. This process helps you resolve any issues on a per-resource basis and to avoid any confusion as your template grows in size.

1. **Identify and recreate any missing resources.** Not all Azure resource types can be exported through the Azure portal, Azure CLI, or Azure PowerShell. For example, virtual machine extensions such as the DependencyAgentWindows and MMAExtension (Microsoft Monitoring Agent) aren't supported resource types for export. For any resource that wasn't exported, such as virtual machine extensions, you need to recreate those resources in your new Bicep file. You can recreate resources using various tools and approaches, including [Azure Resource Explorer](../templates/export-template-portal.md?azure-portal=true), the [Bicep and ARM template reference documentation](/azure/templates/?azure-portal=true), and the [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates?azure-portal=true) site.

## Phase 3: Refactor

In the _refactor_ phase of migrating your resourced to Bicep, the goal is to improve the quality of your Bicep code. These enhancements may include changes such as adding code comments that align the template with your template standards.

The deploy phase consists of eight steps, which you complete in any order:

1. **Review resource API versions.** When you export Azure resources, the exported template may not contain the most recent API version for a resource type. If there are specific properties that you need for future deployments, update the API to the appropriate version. It's good practice to review the API versions for each exported resource.

1. **Review the linter suggestions in your new Bicep file.** When you use the [Bicep extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep&azure-portal=true) to create Bicep files, the [Bicep linter](linter.md) runs automatically and highlights suggestions and errors in your code. Many of the suggestions and errors include an option to apply a quick fix of the issue. Review these recommendations and adjust your Bicep file.

1. **Revise parameters, variables, and symbolic names.** It's possible the names of parameters, variables, and symbolic names generated by the decompiler don't match your standard naming convention. Review the generated names and make adjustments as necessary.

1. **Simplify expressions.** The decompile process may not always take advantage of some of Bicep's features. Review any expressions generated in the conversion and simplify them. For example, the decompiled template may include a `concat()` or `format()` function that could be simplified by using [string interpolation](bicep-functions-string.md#concat). Review any suggestions from the linter and make adjustments as necessary.

1. **Review child and extension resources.** There are several ways to declare [child resources](child-resource-name-type.md) and [extension resources](scope-extension-resources.md) in Bicep, including concatenating the names of your resources, using the `parent` keyword, and using nested resources. Consider reviewing these resources after decompilation and make sure the structure meets your standards. For example, ensure that you don't use string concatenation to create child resource names - you should use the `parent` property or a nested resource. Similarly, subnets can either be referenced as properties of a virtual network, or as a separate resource.

1. **Modularize.** If you're converting a template that has many resources, consider breaking the individual resource types into [modules](modules.md) for simplicity. Bicep modules help to reduce the complexity of your deployments and increase the reusability of your Bicep code.

    > [!NOTE]
    > It's possible to use your JSON templates as modules in a Bicep deployment. Bicep has the ability to recognize JSON modules and reference them similarly to how you use Bicep modules.

1. **Add comments and descriptions.** Good Bicep code is _self-documenting_. Bicep allows you to add comments and `@description()` attributes to your code that help you document your infrastructure. Bicep supports both single-line comments using a `//` character sequence and multi-line comments that start with a `/*` and end with a `*/`. You can add comments to specific lines in your code and for sections of code.

1. **Follow Bicep best practices.** Make sure your Bicep file is following the standard recommendations. Review the [Bicep best practices](best-practices.md) reference document for anything you might have missed.

## Phase 4: Test

In the _test_ phase of migrating your resources to Bicep, the goal is to verify the integrity of your migrated templates and to perform a test deployment.

The test phase consists of two steps, which you complete in sequence:

1. **Run the ARM template deployment what-if operation.** To help you verify your converted templates before deployment, you can use the [Azure Resource Manager template deployment what-if operation](../templates/deploy-what-if.md). It compares the current state of your environment with the desired state that is defined in the template. The tool outputs the list of changes that will occur *without* applying the changes to your environment. You can use what-if with both incremental and complete mode deployments. Even if you plan to deploy your template using incremental mode, it's a good idea to run your what-if operation in complete mode.

1. **Perform a test deployment.** Before introducing your converted Bicep template to production, consider running multiple test deployments. If you have multiple environments (for example, development, test, and production), you may want to try deploying your template to one of your non-production environments first. After the deployment, compare the original resources with the new resource deployments for consistency.

## Phase 5: Deploy

In the _deploy_ phase of migrating your resources to Bicep, the goal is to deploy your final Bicep file to production.

The deploy phase consists of four steps, which you complete in sequence:

1. **Prepare a rollback plan.** The ability to recover from a failed deployment is crucial. Create a rollback strategy if any breaking changes are introduced into your environments. Take inventory of the types of resources that are deployed, such as virtual machines, web apps, and databases. Each resource's data plane should be considered as well. Do you have a way to recover a virtual machine and its data? Do you have a way to recover a database after deletion? A well-developed rollback plan helps to keep your downtime to a minimum if any issues arise from a deployment.

1. **Run the what-if operation against production.** Before deploying your final Bicep file to production, run the what-if operation against your production environment, making sure to use production parameter values, and consider documenting the results.

1. **Deploy manually.** If you're going to use the converted template in a pipeline, such as [Azure DevOps](add-template-to-azure-pipelines.md) or [GitHub Actions](deploy-github-actions.md), consider running the deployment from your local machine first. It's preferable to test the template's functionality before incorporating it into your production pipeline. That way, you can respond quickly if there's a problem.

1. **Run smoke tests.** After your deployment is complete, you should run a series of *smoke tests* to ensure that your application or workload is working properly. For example, test to see if your web app is accessible through normal access channels, such as the public Internet or across a corporate VPN. For databases, attempt to make a database connection and execute a series of queries. With virtual machines, sign in to the virtual machine and make sure that all services are up and running.

## Next steps

To learn more about the Bicep decompiler, see [Decompiling ARM template JSON to Bicep](decompile.md).
