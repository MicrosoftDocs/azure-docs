---
title: Materials
description: Rendering material description and material properties
author: FlorianBorn71
ms.author: flborn
ms.date: 02/11/2020
ms.topic: conceptual
ms.custom: devx-track-csharp
---

# Materials

Materials are [shared resources](../concepts/lifetime.md) that define how **triangular [meshes](meshes.md)** are rendered. **Point clouds** on the other hand don't expose materials whatsoever.

Materials are used to specify
* which [textures](textures.md) to apply,
* whether to make objects transparent,
* how lighting interacts with the surface.

Materials are automatically created during [model conversion](../how-tos/conversion/model-conversion.md) and are accessible at runtime. You can also create custom materials from code and replace existing ones. This scenario makes especially sense if you want to share the same material across many meshes. Since modifications of a material are visible on every mesh that references it, this method can be used to easily apply changes.

> [!NOTE]
> Some use cases, such as highlighting a picked object can be done by modifying materials, but are much easier achieved through the [HierarchicalStateOverrideComponent](../overview/features/override-hierarchical-state.md).

## Material types

Azure Remote Rendering has two distinct material types:

* [PBR materials](../overview/features/pbr-materials.md) are used for surfaces that should be rendered as physically correct, as possible. Realistic lighting is computed for these materials using *physically based rendering* (PBR). To get the most out of this material type, it's important to provide high-quality input data, such as roughness and normal maps.

* [Color materials](../overview/features/color-materials.md) are used for cases where no extra lighting is desired. These materials are always full bright and are easier to set up. Color materials are used for data that should either have no lighting at all, or already incorporates static lighting, such as models obtained through [photogrammetry](https://en.wikipedia.org/wiki/Photogrammetry).

## Mesh vs. MeshComponent material assignment

Triangular [Meshes](meshes.md) have one or more submeshes. Each submesh references one material. You can change the material to use either directly on the mesh, or you can override which material to use for a submesh on a [MeshComponent](meshes.md#meshcomponent).

When you modify a material directly on the mesh resource, this change affects all instances of that mesh. Changing it on the MeshComponent, however, only affects that one mesh instance. Which method is more appropriate depends on the desired behavior, but modifying a MeshComponent is the more common approach.

## Material de-duplication

During conversion multiple materials with the same properties and textures are automatically de-duplicated into a single material. You can disable this feature in the [conversion settings](../how-tos/conversion/configure-model-conversion.md), but we recommend leaving it on for best performance.

## Material classes

All materials provided by the API derive from the base class `Material`. Their type can be queried through `Material.MaterialSubType` or by casting them directly:

```cs
void SetMaterialColorToGreen(Material material)
{
    if (material.MaterialSubType == MaterialType.Color)
    {
        ColorMaterial colorMaterial = material as ColorMaterial;
        colorMaterial.AlbedoColor = new Color4(0, 1, 0, 1);
        return;
    }

    PbrMaterial pbrMat = material as PbrMaterial;
    if (pbrMat != null)
    {
        pbrMat.AlbedoColor = new Color4(0, 1, 0, 1);
        return;
    }
}
```

```cpp
void SetMaterialColorToGreen(ApiHandle<Material> material)
{
    if (material->GetMaterialSubType() == MaterialType::Color)
    {
        ApiHandle<ColorMaterial> colorMaterial = material.as<ColorMaterial>();
        colorMaterial->SetAlbedoColor({ 0, 1, 0, 1 });
        return;
    }

    if (material->GetMaterialSubType() == MaterialType::Pbr)
    {
        ApiHandle<PbrMaterial> pbrMat = material.as<PbrMaterial>();
        pbrMat->SetAlbedoColor({ 0, 1, 0, 1 });
        return;
    }
}
```

## API documentation

* [C# Material class](/dotnet/api/microsoft.azure.remoterendering.material)
* [C# ColorMaterial class](/dotnet/api/microsoft.azure.remoterendering.colormaterial)
* [C# PbrMaterial class](/dotnet/api/microsoft.azure.remoterendering.pbrmaterial)
* [C# RenderingConnection.CreateMaterial()](/dotnet/api/microsoft.azure.remoterendering.renderingconnection.creatematerial)
* [C++ Material class](/cpp/api/remote-rendering/material)
* [C++ ColorMaterial class](/cpp/api/remote-rendering/colormaterial)
* [C++ PbrMaterial class](/cpp/api/remote-rendering/pbrmaterial)
* [C++ RenderingConnection::CreateMaterial()](/cpp/api/remote-rendering/renderingconnection#creatematerial)

## Next steps

* [PBR materials](../overview/features/pbr-materials.md)
* [Color materials](../overview/features/color-materials.md)