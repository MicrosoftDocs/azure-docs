---
title: Install the Remote Rendering package for Unity
description: Explains how to install the Remote Rendering client DLLs for Unity
author: FlorianBorn71
ms.author: flborn
ms.date: 02/26/2020
ms.topic: how-to
---

# Install the Remote Rendering package for Unity

Azure Remote Rendering uses a Unity package to encapsulate the integration into Unity.

## Manage the remote rendering packages in Unity

Unity packages are containers that can be managed via Unity's [Package Manager](https://docs.unity3d.com/Packages/com.unity.package-manager-ui@1.8/manual/index.html).
This package contains the entire C# API as well as all plugin binaries required to use Azure Remote Rendering with Unity.
Following Unity's naming scheme for packages, the package is called **com.microsoft.azure.remote_rendering**.

The package is not part of the [arrClient](https://dev.azure.com/arrClient/arrClient/_git/arrClient) repository, and currently it is not available from Unity's internal package registry. For now, it has to be obtained and added to projects manually.

Ensure you have the [NuGet command-line interface](https://docs.microsoft.com/nuget/tools/nuget-exe-cli-reference) and [authentication to access Azure DevOps feeds](https://docs.microsoft.com/azure/devops/artifacts/nuget/nuget-exe?view=azure-devops).
Then call the following command to pull the latest version of the package into the current directory:

```cmd
nuget install com.microsoft.azure.remote_rendering -ExcludeVersion
```

Adding `-ExcludeVersion` creates a folder with no version extension, which is what is expected by the sample project.

To add the package to a Unity project, use *Add package from disk...*. For further instructions on its usage, follow the [Tutorial: Setting up a Unity project from scratch](../../tutorials/unity/project-setup.md).

## Unity render pipelines

Remote Rendering works with both the **Universal render pipeline** and the **Standard render pipeline**. For performance reasons, the Universal render pipeline is recommended.

> [!IMPORTANT]
> In both cases, the **Universal render pipeline** package has to be installed in Unity. This can either be done in Unity's **Package Manager** UI (package name **Universal RP**, version 7.2.1 or newer), or through the `Packages/manifest.json` file, as described in the [Unity project setup tutorial](../../tutorials/unity/project-setup.md#configure-the-projects-manifest).

## Next steps

* [Unity game objects and components](unity-objects-and-components.md)
* [Tutorial: Setting up a Unity project from scratch](../../tutorials/unity/project-setup.md)
