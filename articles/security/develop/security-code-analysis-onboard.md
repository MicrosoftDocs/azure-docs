---
title: Microsoft Security Code Analysis onboarding guide
description: This article describes installing the Microsoft Security Code Analysis extension
author: vharindra
manager: sukhans
ms.author: terrylan
ms.date: 07/31/2019
ms.topic: article
ms.service: security
services: azure

ms.assetid: 521180dc-2cc9-43f1-ae87-2701de7ca6b8
ms.devlang: na
ms.tgt_pltfrm: na
ms.workload: na
---

# How to: Onboarding and installing

Prerequisites to getting started with Microsoft Security Code Analysis:

- An eligible Microsoft Unified Support offering, as detailed in the following section.
- An Azure DevOps organization.
- Permissions to install extensions to the Azure DevOps organization.
- Source code that can be synced to a cloud-hosted Azure DevOps pipeline.


## Onboarding the Microsoft Security Code Analysis extension

- If you already have one of the following support offerings, contact your Technical Account Manager to purchase or swap existing hours to get access to the extension.
   - Unified Support Advanced tier
   - Unified Support Performance tier
   - Premier Support for Developers
   - Premier Support for Partners
   - Premier Support for Enterprise
- If you have one of the following support services or have no Microsoft support plan, you must upgrade to an eligible support offering.
   - Azure Support for Partners
   - Azure Basic Support
   - Azure Developer Support
   - Azure Standard Support
   - Azure Professional Direct
   - Unified Support Core tier
- To purchase an eligible support offering, go to our [support services home page](https://www.microsoft.com/enterprise/services/support)
- After a support contract is in place, contact your Technical Account Manager to help get you started and to collect all the required details.

>[!NOTE]
> Only partners registered in the Microsoft Partners Network are eligible to purchase Premier Support for Partners. If you are not a registered partner, purchase one of the eligible support offerings mentioned previously.

## Installing the Microsoft Security Code Analysis extension

1. After the extension is shared with your Azure DevOps organization, go to your Azure DevOps organization page. An example URL for such a page is http://dev.azure.com/contoso.
1. Select the shopping bag icon in the upper-right corner next to your name, then select **Manage extensions**. 
1. Select the Microsoft Security Code Analysis extension, and launch the Azure DevOps UI wizard to start installation.
1. From the drop-down, choose the Azure DevOps organization to install the extension on.
1. Select **Install**. After installation is complete, you can start using the extension

>[!NOTE]
> Even if you do not have access, continue with the installation steps. You can request access from your Azure DevOps organization admin during the process.

After you install the extension, the secure development build tasks are visible and available to add to your Azure pipelines.

## Adding specific build tasks to your Azure DevOps pipeline

1. From your Azure DevOps organization, open your team project.
1. Select the **Builds** tab under **Pipelines**.
1. Select the pipeline into which you want to add the extension build tasks.
   - New pipeline: Select **New** and follow the steps detailed to create a new pipeline.
   - Edit pipeline: Select an existing pipeline and then select **Edit** to begin editing the pipeline.
1. Select **+** to navigate to the **Add Tasks** pane.
1. From either the list or by using the search box, find the build task you want to add. Select **Add**.
1. You can now continue to specify the parameters needed for the task.
   >[!NOTE]
   >File and folder paths are relative to the root of your source repository. If you specify the output files and folders as parameters, they will be replaced with the common location that we have defined on the build agent.
1. Queue a new build.

> [!TIP]
>
> - To run analysis after your build, place the Microsoft Security Code Analysis build tasks after the Publish Build Artifacts step of your build. That way, your build can finish and post results before it runs static analysis tools.
> - Always select the **'Continue on Error'** option of secure development build tasks. Even if one of tool fails, the others can run. There are no interdependencies between tools.
> - Microsoft Security Code Analysis build tasks will fail only if the tool fails to run successfully. But they will succeed if the tool identifies issues in the code. By using the **Post-Analysis** build task, you can configure your build to fail when a tool identifies issues in the code.
> - Some Azure DevOps build tasks are not supported when run via a release pipeline. More specifically, Azure DevOps doesn't support tasks that publish artifacts from within a release pipeline.
> - For a list of predefined variables in Azure DevOps Team Build that you can specify as parameters, see [Azure DevOps Build Variables](https://docs.microsoft.com/azure/devops/pipelines/build/variables?tabs=batch&view=vsts)

## Next steps

For more information about configuring the build tasks, see our [Configuration guide](security-code-analysis-customize.md).

If you have further questions about the extension and the tools offered, check out our [FAQ page.](security-code-analysis-faq.md).
