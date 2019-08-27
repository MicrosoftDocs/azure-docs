---
title: Microsoft Azure Security Code Analysis onboarding guide
description: This article is about installing Security Code Analysis Extension
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

# How To: Onboarding and Installing

Pre-requisites to get started with the Microsoft Security Code Analysis
  - Eligible Microsoft Unified Support Services offering (details below)
  - An Azure DevOps Organization
  - Permissions to install extensions to the Azure DevOps Organization
  - Source code that can be synced to a cloud-hosted Azure DevOps pipeline


## Onboarding Microsoft Security Code Analysis extension

- If you already have one of the following support offerings, simply contact your Technical Account Manager and purchase\swap existing hours to get access to the extension.
   - Unified support – Advanced and Performance tier, Premier Support for Developers, Premier Support for Partners, or Premier Support for Enterprise.
- If you have one of the following support services or don’t have any support plan with Microsoft, you will need to upgrade to an eligible Support offering:
   - Azure Support for Partners, Azure Basic, Azure Developer, Azure Standard, Azure Professional Direct, or Unified support – Core tier
- To purchase an eligible support offering, please visit our [support services home page](https://www.microsoft.com/enterprise/services/support)
- Once a support contract is in place, contact your Technical Account Manager who can help get you started, and collect all the required details.
 
>[!NOTE]
> Only registered partners in the Microsoft Partners Network are eligible for purchasing Premier Support for Partners, otherwise please purchase one of the eligible support offerings mentioned previously

## Installing Microsoft Security Code Analysis extension

1. Once the extension is shared with your Azure DevOps Organization, navigate to your Azure DevOps Organization page (For example http://dev.azure.com/contoso)
2. Click on the shopping bag icon in the upper right corner next to your name, then click Manage extensions 
3. Click the Microsoft Security Code Analysis extension, and launch the Azure DevOps UI wizard to start installation.
4. Choose the Azure DevOps Organization to install the extension on from the dropdown
5. Click Install. Once it completes, you can Proceed to using the extension

>[!NOTE]
> Even if you do not have access, continue with the install steps and you will be able to request access from your Azure DevOps Organization administrator during the process.
>
Once the extension is installed, the secure development build tasks will be visible and available to add to your Azure Pipelines.

## Adding specific build tasks to your DevOps pipeline

1. Open your team project from your Azure DevOps Organization.
2. Navigate to the **Builds** tab under **Pipelines** 
3. Select the Pipeline into which you wish to add the extension build tasks. 
   - New - Click **New** and follow the steps detailed to create a new Pipeline.
   - Edit - Select the Pipeline and click **Edit** to begin editing an existing Pipeline.
4. Click + to navigate to the **Add Tasks** pane.
5. Find the build task you want to add either from the list or using the search box and then click **Add**. 
6. You can now continue to specify the parameters needed for the task.
>[!NOTE]
>File or directory paths are relative to the root of your source repository and parameters specifying the output folder/files will be replaced with the common location that we have defined on the build agent.

7. Queue a new build.
> [!TIP]
>  - To run analysis after your build, place the Microsoft Security Code Analysis build tasks after the Publish Build Artifacts step of your build. That way, your build can finish and post results before running static analysis tools.
>  - Always check the **'Continue on Error'** option of secure development build tasks. Even if one of tool fails, the others can run. There are no interdependencies.
>  - Microsoft Security Code Analysis build tasks will fail ONLY if the tool fails to run successfully, but they will NOT fail if and when the tool identifies issues in the code. You can configure your build to break when a tool identifies issues in the code, using the **Post-Analysis** build task.
>  - Some Azure DevOps build tasks are NOT supported when run via a “Release” Pipeline. This is a limitation of Azure DevOps. They do not support tasks that publish artifacts from within a Release pipeline.
>  - For a list of predefined variables in Azure DevOps Team Build, that you can specify as parameters, see [Azure DevOps Build Variables](https://docs.microsoft.com/azure/devops/pipelines/build/variables?tabs=batch&view=vsts)

## Next steps

For more information about configuring the build tasks, see our [Configuration guide](security-code-analysis-customize.md)

If you have further questions about the extension and the tools offered, [check our FAQs page.](security-code-analysis-faq.md)


