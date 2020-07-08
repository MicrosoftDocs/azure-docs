---
title: Install the Remote Rendering package for Unity
description: Explains how to install the Remote Rendering client DLLs for Unity
author: florianborn71
ms.author: flborn
ms.date: 02/26/2020
ms.topic: how-to
---

# Install the Remote Rendering package for Unity

Azure Remote Rendering uses a Unity package to encapsulate the integration into Unity.

## Manage the remote rendering packages in Unity

Unity packages are containers that can be managed via Unity's [Package Manager](https://docs.unity3d.com/Packages/com.unity.package-manager-ui@1.8/manual/index.html).
This package contains the entire C# API as well as all plugin binaries required to use Azure Remote Rendering with Unity.
Following Unity's naming scheme for packages, the package is called **com.microsoft.azure.remote-rendering**.

The package is not part of the [ARR samples repository](https://github.com/Azure/azure-remote-rendering), and it is not available from Unity's internal package registry. To add it to a project, you have to manually edit the project's `manifest.md` file to add the following:

```json
{
  "scopedRegistries": [
    {
      "name": "Azure Mixed Reality Services",
      "url": "https://api.bintray.com/npm/microsoft/AzureMixedReality-NPM/",
      "scopes": ["com.microsoft.azure"]
    }
   ],
  "dependencies": {
    "com.microsoft.azure.remote-rendering": "0.1.31",
    ...existing dependencies...
  }
}
```

Once this has been added, you can use the Unity Package Manager to ensure you have the latest version.
More comprehensive instructions are given in the [Tutorial: View Remote Models](../../tutorials/unity/view-remote-models/view-remote-models.md).

## Unity render pipelines

Remote Rendering works with both the **:::no-loc text="Universal render pipeline":::** and the **:::no-loc text="Standard render pipeline":::**. For performance reasons, the Universal render pipeline is recommended.

To use the **:::no-loc text="Universal render pipeline":::**, its package has to be installed in Unity. This can either be done in Unity's **Package Manager** UI (package name **Universal RP**, version 7.3.1 or newer), or through the `Packages/manifest.json` file, as described in the [Unity project setup tutorial](../../tutorials/unity/view-remote-models/view-remote-models.md#include-the-azure-remote-rendering-package).

## Next steps

* [Unity game objects and components](objects-components.md)
* [Tutorial: View Remote Models](../../tutorials/unity/view-remote-models/view-remote-models.md)
