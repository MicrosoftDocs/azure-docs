---
title: Compose DSC configurations
description: This article tells how to compose configurations using composite resources in Azure Automation State Configuration.
keywords: powershell dsc, desired state configuration, powershell dsc azure, composite resources
services: automation
ms.subservice: desired-state-config
ms.date: 10/22/2024
ms.topic: how-to
ms.service: azure-automation
---
# Compose DSC configurations

[!INCLUDE [azure-automation-dsc-end-of-life](~/includes/dsc-automation/azure-automation-dsc-end-of-life.md)]

[!INCLUDE [automation-dsc-linux-retirement-announcement](./includes/automation-dsc-linux-retirement-announcement.md)]

When you need to manage resource with more than a single desired state configuration (DSC), the best
path is to use [composite resources][04]. A composite resource is a nested and parameterized
configuration being used as a DSC resource within another configuration. Use of composite resources
allows you to create complex configurations while allowing the underlying composite resources to be
individually managed and built.

Azure Automation enables the [import and compilation of composite resources][07]. After importing
composite resources into your Automation account, you can use Azure Automation State Configuration
through the **State Configuration (DSC)** feature in the Azure portal.

## Compose a configuration

Before you can assign a configuration made from composite resources in the Azure portal, you must
compose the configuration. Composition uses **Compose configuration** on the State Configuration
(DSC) page while on either the **Configurations** or the **Compiled configurations** tab.

1. Sign in to the [Azure portal][12].
1. On the left, select **All resources** and then the name of your Automation account.
1. On the Automation account page, select **State configuration (DSC)** under **Configuration
   Management**.
1. On the State configuration (DSC) page, select either the **Configurations** or the **Compiled
   configurations** tab, then select **Compose configuration** in the menu at the top of the page.
1. On the **Basics** step, provide the new configuration name (required) and select anywhere on the
   row of each composite resource that you want to include in your new configuration, then select
   **Next** or select the **Source code** step. For the following steps, we selected
   `PSExecutionPolicy` and `RenameAndDomainJoin` composite resources.
   ![Screenshot of the basics step of the compose configuration page][01]
1. The **Source code** step shows what the composed configuration of the selected composite
   resources looks like. You can see the merging of all parameters and how they're passed to the
   composite resource. When you're done reviewing the new source code, select **Next** or select the
   **Parameters** step. ![Screenshot of the source code step of the compose configuration page][03]
1. On the **Parameters** step, the parameter for each composite resource is exposed so that values
   can be provided. The description of the parameter is displayed next to the parameter field. If a
   parameter is a `[PSCredential]` type, the dropdown provides a list of **Credential** objects in
   the current Automation account. A **+ Add a credential** option is also available. Provide values
   for the required parameters then select **Save and compile**.
   ![Screenshot of the parameters step of the compose configuration page][02]

## Submit the configuration for compilation

Submit the new configuration for compilation. You can view the status of the compilation job like
you do with any imported configuration. For more information, see [View a compilation job][09].

The successfully completed configuration appears in the **Compiled configurations** tab. Then you
can assign the configuration to a managed node, using the steps in
[Reassigning a node to a different node configuration][08].

## Next steps

- To learn how to enable nodes, see [Enable Azure Automation State Configuration][10].
- To learn about compiling DSC configurations so that you can assign them to target nodes, see
  [Compile DSC configurations in Azure Automation State Configuration][07].
- To see an example of using Azure Automation State Configuration in a continuous deployment
  pipeline, see [Setup continuous deployment with Chocolatey][06].
- For pricing information, see [Azure Automation State Configuration pricing][11].
- For a PowerShell cmdlet reference, see [Az.Automation][05].

<!-- link references -->
[01]: ./media/compose-configurationwithcompositeresources/compose-configuration-basics.png
[02]: ./media/compose-configurationwithcompositeresources/compose-configuration-parameters.png
[03]: ./media/compose-configurationwithcompositeresources/compose-configuration-sourcecode.png
[04]: /powershell/dsc/resources/authoringresourcecomposite
[05]: /powershell/module/az.automation
[06]: automation-dsc-cd-chocolatey.md
[07]: automation-dsc-compile.md
[08]: automation-dsc-getting-started.md#reassign-a-node-to-a-different-node-configuration
[09]: automation-dsc-getting-started.md#view-a-compilation-job
[10]: automation-dsc-onboarding.md
[11]: https://azure.microsoft.com/pricing/details/automation/
[12]: https://portal.azure.com
