---
title: Point cloud rendering
description: Highlevel overview of point cloud rendering and the API to change global point cloud settings
author: florianborn71
ms.author: flborn
ms.date: 06/02/2022
ms.topic: article
ms.custom: devx-track-csharp
---

# Point cloud rendering

> [!NOTE]
> The ARR point cloud rendering feature is currently in public preview.

ARR supports rendering of point clouds as an alternative to triangular meshes. This enables use cases where converting point clouds to triangular meshes as a preprocessing step is either impractical (turnaround times, complexity) or if the conversion process drops important detail.

Point cloud conversion does not decimate the input data.

## Point cloud conversion

Conversion of point cloud assets works fully analogue to converting triangular meshes: A single point cloud input file is converted to an `.arrAsset` file which in turn can be consumed by the runtime API for loading.

The list of supported point cloud file formats can be found in the [model conversion](../../how-tos/conversion/model-conversion.md#point-clouds) section.

The dedicated conversion settings for point cloud files are explained in the [conversion settings](../../how-tos/conversion/configure-model-conversion.md#settings-for-point-clouds) paragraph.

## Size limitations

For maximum number of allowable points, there is the same kind of distinction between a `standard` and `premium` rendering session, as described in paragraph about [server size limits](../../reference/limits.md#overall-number-of-primitives).

## Global rendering properties

There is a single API to access global rendering settings for point clouds. The `_Experimental` suffix is to indicate that the API is currently in public preview and might be subject to change.

```cs
void ChangeGlobalPointCloudSettings(RenderingSession session)
{
    PointCloudSettings settings = session.Connection.PointCloudSettings_Experimental;

    // scale all point sizes so point clouds appear denser
    settings.PointSizeScale = 1.5f;
}
```

```cpp
void ChangeGlobalPointCloudSettings(ApiHandle<RenderingSession> session)
{
    ApiHandle<PointCloudSettings> settings = session->Connection()->PointCloudSettings_Experimental();

    // scale all point sizes so point clouds appear denser
    settings->SetPointSizeScale(1.5f);
}
```

## API documentation

* [C# RenderingConnection.PointCloudSettings_Experimental property](/dotnet/api/microsoft.azure.remoterendering.renderingconnection.pointcloudsettings_experimental)
* [C++ RenderingConnection::PointCloudSettings()](/cpp/api/remote-rendering/renderingconnection#pointcloudsettings_experimental)

## Next steps

* [Configuring the model conversion](../../how-tos/conversion/configure-model-conversion.md)
* [Using the Azure Remote Rendering Toolkit (ARRT)](../../samples/azure-remote-rendering-asset-tool.md)