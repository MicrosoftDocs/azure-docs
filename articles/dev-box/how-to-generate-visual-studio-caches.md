---
title: Configure Visual Studio caches for your dev box image
titleSuffix: Microsoft Dev Box
description: Learn how to generate Visual Studio caches for your customized Dev Box image.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 07/17/2023
ms.topic: how-to
---

# Optimize the Visual Studio experience on Microsoft Dev Box

> [!IMPORTANT]
> Visual Studio precaching for Microsoft Dev Box is currently in public preview. This information relates to a feature that may be substantially modified before it's released. Microsoft makes no warranties, expressed or implied, with respect to the information provided here.

With [Visual Studio 17.7 Preview 3](https://visualstudio.microsoft.com/vs/preview/), you can try precaching of Visual Studio solutions for Microsoft Dev Box. When loading projects, Visual Studio indexes files and generates metadata to enable the full suite of [IDE](/visualstudio/get-started/visual-studio-ide) capabilities. As a result, Visual Studio can sometimes take a considerable amount of time when loading large projects for the first time. With Visual Studio caches on dev box, you can now pregenerate this startup data and make it available to Visual Studio as part of your customized dev box image. This means that when you create a dev box from a custom image including Visual Studio caches, you can log onto a Microsoft Dev Box and start working on your project immediately.

Benefits of precaching your Visual Studio solution on a dev box image include:
- You can reduce the time it takes to load your solution for the first time. 
- You can quickly access and use key IDE features like [**Find In Files**](/visualstudio/ide/find-in-files) and [**Intellisense**](/visualstudio/ide/using-intellisense) in Visual Studio.
- You can improve the Git performance on large repositories.

> [!NOTE]
> Performance gains in startup time from precaching of your Visual Studio solution will vary depending on the complexity of your solution.

## Prerequisites

To leverage precaching of your source code and Visual Studio IDE customizations on Microsoft Dev Box, you need to meet the following requirements:

- Create a dev center and configure the Microsoft Dev Box service. If you don't have one available, follow the steps in [Quickstart: Configure Microsoft Dev Box](quickstart-configure-dev-box-service.md) to create a dev center and configure a dev box.
- [Create a custom VM image for dev box](how-to-customize-devbox-azure-image-builder.md) that includes your source code and pregenerated caches. 

  This article guides you through the creation of an Azure Resource Manager template. In the following sections, you'll modify that template to include processes to [generate the Visual Studio solution cache](#enable-visual-studio-caches-in-dev-box-images) and further improve Visual Studio performance by [preparing the git commit graph](#enable-git-commit-graph-optimizations-in-dev-box-images) for your project. 
  You can then use the resulting image to [create new dev boxes](quickstart-configure-dev-box-service.md#3-create-a-dev-box-definition) for your team.

## Enable Visual Studio caches in dev box images

You can generate caches for your Visual Studio solution as part of an automated pipeline that builds custom dev box images. To enable Visual Studio caches in your dev box image:

* Within the [Azure Resource Manager template](../azure-resource-manager/templates/overview.md), add a customized step to clone the source repository of your project into a nonuser specific location on the VM.
* With the project source located on disk you can now run the `PopulateSolutionCache` feature to generate the project caches. To do this, add the following PowerShell command to your template's customized steps:

    ```shell
    # Add a command line flag to the Visual Studio devenv
    devenv SolutionName /PopulateSolutionCache /LocalCache /Build [SolnConfigName [/Project ProjName [/ProjectConfig ProjConfigName]] [/Out OutputFilename]]
    ```
    
    This command will open your solution, execute a build, and generate the caches for the specified solution. The generated caches will then be included in the [custom image](how-to-customize-devbox-azure-image-builder.md) and available to dev box users once [posted to a connected Azure Compute Gallery](../virtual-machines/shared-image-galleries.md). You can then [create a new dev box](quickstart-configure-dev-box-service.md#3-create-a-dev-box-definition) based off this image.
    
    The `/Build` flag is optional, but without it some caches that require a build to have completed won't be available. For more information on the `build` command, see [Build command-line reference](/visualstudio/ide/reference/build-devenv-exe). 

When a dev box user opens the solution on a dev box based off the customized image, Visual Studio will read the already generated caches and skip the cache generation altogether. 

## Enable Git commit-graph optimizations in dev box images

Beyond the [standalone commit-graph feature that was made available with Visual Studio 17.2 Preview 3](https://aka.ms/devblogs-commit-graph), you can also enable commit-graph optimizations as part of an automated pipeline that generates custom dev box images. 

You can enable Git commit-graph optimizations in your dev box image if you meet the following requirements:
* You're using a [Microsoft Dev Box](overview-what-is-microsoft-dev-box.md) as your development workstation.
* The source code for your project is saved in a non-user specific location to be included in the image.
* You can [create a custom dev box image](how-to-customize-devbox-azure-image-builder.md) that includes the Git source code repository for your project.
* You're using [Visual Studio 17.7 Preview 3 or higher](https://visualstudio.microsoft.com/vs/preview/).
 
To enable the commit-graph optimization, execute the following `git` commands from your Git repository’s location as part of your custom image build process: 

```bash
# Enables the Git repo to use the commit-graph file, if the file is present 
git config --local core.commitGraph true

# Update the Git repository’s commit-graph file to contain all reachable commits
git commit-graph write --reachable
```

The generated caches will then be included in the [custom image](how-to-customize-devbox-azure-image-builder.md) and available to dev box users once [posted to a connected Azure Compute Gallery](../virtual-machines/shared-image-galleries.md). 

## Next steps

Get started with Visual Studio precaching in Microsoft Dev Box:

- [Download and install Visual Studio 17.7 Preview 3 or later](https://visualstudio.microsoft.com/vs/preview/).

We’d love to hear your feedback, input, and suggestions on Visual Studio precaching in Microsoft Dev Box via the [Developer Community](https://visualstudio.microsoft.com/vs/preview/).