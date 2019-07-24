---
title: Microsoft Azure Security Code Analysis Documentation
description: This article is about installing Security Code Analysis Extension
author: vharindra
manager: sukhans
ms.author: terrylan
ms.date: 07/18/2019
ms.topic: article
ms.service: security
services: azure

ms.assetid: 521180dc-2cc9-43f1-ae87-2701de7ca6b8
ms.devlang: na
ms.tgt_pltfrm: na
ms.workload: na
---

# How to install Microsoft Security Code Analysis on your account

Requirements to install Microsoft Security Code Analysis on your account

The following criteria are required for integration
  -	An Azure DevOps Organization
  -	Permissions to install extensions to the Azure DevOps Organization
  - Source code that can be synced to a cloud-hosted Azure DevOps pipeline


>[!NOTE]
> Even if you do not have access, continue with the install steps and you will be able to request access from your account administrator during the process.
>

## Onboarding Microsoft Security Analysis tools extension

1. Navigate to your Azure DevOps Organization page (e.g. http://dev.azure.com/contoso)
2. Click on the shopping bag icon in the upper right corner next to your name, then click Manage extensions 
3. If you do not see the Microsoft Security Code Analysis Extension listed under the Installed or Shared with this account sections, please follow the How do I get the Microsoft Security Code Analysis Extension shared with my account? section below
4. Click the Microsoft Security Code Analysis extension
5. On the subsequent page, Click Get it free 
6. Choose the Azure DevOps Organization to install the extension on from the dropdown
7. Click Install. Once it completes, you can Proceed to the account

Once the extension is installed, the secure development build tasks will be visible and available to add to your Azure Pipelines.

## Adding specific build tasks to your DevOps pipeline

1. Open your team project from your Azure DevOps Organization.
2. Navigate to the **Build** tab under **Build and Release** 
3. Select the Build Definition into which you wish to add the BinSkim build task. 
   - New - Click **New** and follow the steps detailed to create a new Build Definition.
   - Edit - Select the Build Definition. On the subsequent page, click **Edit** to begin editing the Build Definition.
4. Click + to navigate to the **Add Tasks** pane.
5. Find the build task you want to add either from the list or using the search box and then click **Add**. 
6. Use the 'Basic' input type to have the command line generated for you. Accept the defaults or modify them (some tools require input that does not have a default). Or,
6. Use the 'Command-Line' input type, and specify exact command-line arguments, if you are familiar with the tool and its command-line parameters
  >[!NOTE]
  > File or directory paths are relative to the root of your source repository and parameters specifying the output folder/files will be replaced with the common location that we have defined on the build agent.
  >
8. Queue a new build.
> [!TIP]
>  - To run analysis after your build, place the Microsoft Security Code Analysis build tasks after the Publish Build Artifacts step of your build. That way, your build can finish and post results before running static analysis tools.
>  - Always check the 'Continue on Error' option of secure development build tasks. Even if one of tool fails, the others can run. There are no interdependencies.
>  - Microsoft Security Code Analysis build tasks will fail ONLY if the tool fails to run successfully, but they will NOT fail if and when the tool identifies issues in the code. You can configure your build to break when a tool identifies issues in the code, using the **Post-Analysis** build task.
>  - Some Azure DevOps build tasks are NOT supported when run via a “Release” Pipeline. This is a limitation of Azure DevOps. They do not support tasks that publish artifacts from within a Release pipeline.
>  - For a list of predefined variables in Azure DevOps Team Build, that you can specify as parameters, see [Azure DevOps Build Variables](https://docs.microsoft.com/azure/devops/pipelines/build/variables?tabs=batch&view=vsts)


