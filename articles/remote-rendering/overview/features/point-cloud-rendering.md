---
title: Point cloud rendering
description: High-level overview of point cloud rendering and the API to change global point cloud settings
author: florianborn71
ms.author: flborn
ms.date: 06/02/2022
ms.topic: article
ms.custom: devx-track-csharp
---

# Point cloud rendering

> [!NOTE]
> **The ARR point cloud rendering feature is currently in public preview.**
>
> This feature is being actively developed, and may not be complete. It's made available on a “Preview” basis. You can test and use this feature in your scenarios, and [provide feedback](../../resources/support.md).
>
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

ARR supports rendering of point clouds as an alternative to triangular meshes. Point cloud rendering enables new use cases where converting point clouds to triangular meshes as a preprocessing step is either impractical (turnaround times, complexity) or if the conversion process drops important detail.

Similar to triangular mesh conversion, point cloud conversion doesn't decimate the input data.

## Point cloud conversion

Conversion of point cloud assets works fully analogously to converting triangular meshes: A single point cloud input file is converted to an `.arrAsset` file, which in turn can be consumed by the runtime API for loading.

The list of supported point cloud file formats can be found in the [model conversion](../../how-tos/conversion/model-conversion.md#point-clouds) section.

Conversion settings specifically for point cloud files are explained in the [conversion settings](../../how-tos/conversion/configure-model-conversion.md#settings-for-point-clouds) paragraph.

## Size limitations

Point cloud asset conversion has a hard limit of 12.5 billion points per converted asset.
For the overall maximum number of allowed points loaded and rendered by ARR, the same kind of distinctions between a `standard` and `premium` rendering session applies, as described in paragraph about [server size limits](../../reference/limits.md#overall-number-of-primitives).

## Global rendering properties

There's a single API to access global rendering settings for point clouds. The `_Experimental` suffix has been added to indicate that the API is currently in public preview and might be subject to change.

```cs
void ChangeGlobalPointCloudSettings(RenderingSession session)
{
    PointCloudSettings settings = session.Connection.PointCloudSettings_Experimental;

    // Make all points bigger (default = 1.0)
    settings.PointSizeScale = 1.25f;
}
```

```cpp
void ChangeGlobalPointCloudSettings(ApiHandle<RenderingSession> session)
{
    ApiHandle<PointCloudSettings> settings = session->Connection()->PointCloudSettings_Experimental();

    // Make all points bigger (default = 1.0)
    settings->SetPointSizeScale(1.25f);
}
```

## Point cloud data streaming

Point cloud asset files are automatically configured for dynamic data streaming during conversion. That means that unlike triangular mesh assets or smaller point cloud asset files, these converted assets aren't fully downloaded to the rendering VM, but rather partially loaded from storage as needed. The size threshold for full download versus partial on-demand-loading is currently set to 2 GB (arrAsset file size), but this threshold may change during the public preview.

Regardless of the point cloud file size, the great benefit of the data streaming approach is that the renderer can start early with presenting the data. The decision of the renderer which data to prioritize, is based on camera view and proximity. No custom interaction through the API is necessary. Furthermore, data streaming imposes an implicit budget on the amount of data that is in memory at the same time, so there's no memory limit whatsoever on the amount of rendered point cloud data.

## API documentation

* [C# RenderingConnection.PointCloudSettings_Experimental property](/dotnet/api/microsoft.azure.remoterendering.renderingconnection.pointcloudsettings_experimental)
* [C++ RenderingConnection::PointCloudSettings()](/cpp/api/remote-rendering/renderingconnection#pointcloudsettings_experimental)

## Next steps

* [Configuring the model conversion](../../how-tos/conversion/configure-model-conversion.md)
* [Using the Azure Remote Rendering Toolkit (ARRT)](../../samples/azure-remote-rendering-asset-tool.md)