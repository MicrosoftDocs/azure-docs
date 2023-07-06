---
title: Visual Studio caches for your dev box image
titleSuffix: Microsoft Dev Box
description: Learn how to generate Visual Studio caches for your customized Dev Box image.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 07/12/2023
ms.topic: how-to
---

# Visual Studio optimizations for your dev box

With Visual Studio 17.7 Preview 2, you can try pre-caching of Visual Studio solutions for Microsoft Dev Box. You can now prepare and save the data Visual Studio needs to generate during startup, as part of your customized dev box image. This means that when you create a dev box from a custom image including Visual Studio caches, you can log onto a Microsoft Dev Box and start working on your project immediately.

You can create a customized dev box image that includes your Visual Studio solution and other customizations. You can then use this image to create dev boxes for your team. 

Advantages of pre-caching your solution for dev box include:
- You can reduce the time it takes to load your solution for the first time. 
- You can quickly use key features like Find In Files and IntelliSense in Visual Studio.
- You can improve the Git performance on large repositories (available with Visual Studio 17.7 Preview 3 and later).

Performance gains in startup time from pre-caching of your Visual Studio solution will vary depending on the complexity of your solution.

To learn more about how to create a custom image and use it to create a dev box, see:

- [Create a custom image by using Azure VM Image Builder](how-to-customize-devbox-azure-image-builder.md)
- [Create a dev box by using a custom image](quickstart-configure-dev-box-service.md#3-create-a-dev-box-definition)

## Prerequisites

- A dev center. If you don't have one available, follow the steps in [Create a dev center](quickstart-configure-dev-box-service.md).

## Enable caches in Dev Box images

You can generate caches for your Visual Studio solution as part of an automated pipeline that builds custom Dev Box images. To do so, you must meet the following requirements:

* You're using [Microsoft Dev Box](overview-what-is-microsoft-dev-box.md) as your development workstation.
* The source code for your project is saved in a non-user specific location to be included in the image.
* You can [create a custom Dev Box image](how-to-customize-devbox-azure-image-builder.md) that includes the source code for your project.
* You're using [Visual Studio 17.7 Preview 2 or higher](https://visualstudio.microsoft.com/vs/preview/).

To generate the caches, execute the following `devenv` command as part of your image build process: 

```shell
# Add a command line flag to the Visual Studio devenv 
Open your solution, execute a build and generate the caches for the specified solution
devenv SolutionName /PopulateSolutionCache /LocalCache /Build [SolnConfigName [/Project ProjName [/ProjectConfig ProjConfigName]] [/Out OutputFilename]]
```
For more information on the `build` command, see [Build command-line reference](/visualstudio/ide/reference/build-devenv-exe). 

This command will open your solution, execute a build, and generate the caches for the specified solution. The generated caches will then be included in the [custom image](how-to-customize-devbox-azure-image-builder.md) and available to Dev Box users once [posted to a connected Azure Compute Gallery](../virtual-machines/shared-image-galleries.md). 

When a Dev Box user opens the solution on a dev box based off the customized image, Visual Studio will read the already generated caches and skip the cache generation altogether. 

## Enable Git Commit-Graph optimizations

You can also enable [Commit-Graph optimizations](https://devblogs.microsoft.com/visualstudio/supercharge-your-git-experience-in-vs/) as part of an automated pipeline that generates custom Dev Box images. To do so, you must meet the following requirements:

* You're using [Microsoft Dev Box](overview-what-is-microsoft-dev-box.md) as your development workstation.
* The source code for your project is saved in a non-user specific location to be included in the image.
* You can [create a custom Dev Box image](how-to-customize-devbox-azure-image-builder.md) that includes the Git source code repository for your project.
* You're using [Visual Studio 17.7 Preview 3 or higher](https://visualstudio.microsoft.com/vs/preview/).
 
To enable this optimization, execute the following `git` commands from your Git repository’s location as part of your image build process: 

```bash
# Enables the Git repo to use the commit-graph file, if the file is present 
git config --local core.commitGraph true

# Update the Git repository’s commit-graph file to contain all reachable commits
git config --local core.commitGraph true
```

The generated caches will then be included in the [custom image](how-to-customize-devbox-azure-image-builder.md) and available to Dev Box users once [posted to a connected Azure Compute Gallery](../virtual-machines/shared-image-galleries.md). 

## Get started with Visual Studio pre-caching in Microsoft Dev Box

[Download and install Visual Studio 17.7 Preview 2 or later](https://visualstudio.microsoft.com/vs/preview/) to get started. 

We’d love to hear your feedback, input, and suggestions on Visual Studio pre-caching in Dev Box via the [Developer Community](https://visualstudio.microsoft.com/vs/preview/). 

## Next steps

- [Manage a dev box definition](how-to-manage-dev-box-definitions.md)
