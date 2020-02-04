---
title: Materials
description: Rendering material description and material properties
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
titleSuffix: Azure Remote Rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: conceptual
ms.service: azure-remote-rendering
---
# Materials

## Preface

Materials are [shared resources](../concepts/sdk-concepts.md#resources-and-lifetime-management) that describe the rendering paradigm and properties of meshes. Each loaded mesh comes with a set of distinct materials that may differ by color, assigned texture, or any other visual property. These materials can either be modified by the user or the user can create and assign new instances of materials.
Materials can be shared between mesh parts, which means changing the property on a shared material will change the visual appearance of all these parts likewise.

> [!NOTE]
>Depending on the use case, changing the material settings might be an integral part of the application. For instance, changing the floor texture in architectural context. Assigning and managing materials introduces some bookkeeping overhead on the client code side. So for simple use cases, specifically color-tinting objects or switching objects to see-through mode, we introduced a much more lightweight workflow through the [HierarchicalStateOverrideComponent](../reference/features/override-hierarchical-state.md).

## Material types

There are two distinct material types, which represent different rendering paradigms. The first type, a PBR material, provides properties for physically-based rendering (PBR), that means lighting is applied through physically modeling the lighting conditions for properties such as roughness and metalness. Accordingly, PBR materials look realistic under different lighting conditions.

The second material type is a simple color material that is not affected by any lighting. The color material has no physical equivalent.

These two materials are now discussed in more detail:

### PBR material

The PBR material is a material that provides physically based rendering (PBR). It uses a Cook Torrance BRDF with GGX as normal distribution, which is the most common setup for physically based shading in the industry. For further reading, refer for instance to this external article about [Physically based Rendering - Cook Torrance](http://www.codinglabs.net/article_physically_based_rendering_cook_torrance.aspx).

Supported features:

* Albedo map with albedo modulation, or albedo color
* Normal map or vertex normals
* Roughness map with roughness scale, or single roughness value
* Metallic map with metallic scale, or single metallic value
* Specular reflections
* Ambient occlusion map with occlusion scale
* UV transform (offset/scale, applied to all textures)
* Alpha blending
* Alpha clip with alpha clip threshold
* Two-sided rendering (with two-sided lighting)
* Support for using vertex colors as albedo modulation

> [!NOTE]
> The importer from source assets (fbx) always converts source materials into PBR materials and tries to match the physical properties.

For information how to use these properties on the PBR material class, refer to the API documentation.

### Color material

A color material only provides a constant albedo color that may either originate from a constant color or from a texture. Since no lighting is applied, the color material appears full bright.

Supported features:

* Albedo map with albedo modulation, or albedo color
* UV transform (offset/scale)
* Alpha- and additive blending
* Alpha clip with alpha clip threshold
* Two-sided rendering (with two-sided lighting)
* Support for using vertex colors as albedo modulation

## Material classes

The API provides `PbrMaterial` and `ColorMaterial` that both derive off the base class  `Material`. Materials can have their type queried with `Material.MaterialSubType` or be directly cast.

``` cs
void SetMaterialColorToGreen(Material material)
{
    if (material.MaterialSubType == MaterialType.Color)
    {
        ColorMaterial colorMaterial = material as ColorMaterial;
        colorMaterial.AlbedoColor = new Color4(0, 1, 0, 1);
        return;
    }

    PbrMaterial pbrMat = material as PbrMaterial;
    if( pbrMat!= null )
    {
        PbrMaterial pbrMaterial = material.PbrMaterial.Value;
        pbrMaterial.AlbedoColor = new Color4(0, 1, 0, 1);
    }
}

```

## Mesh vs. MeshComponent materials

Materials can either be modified on the mesh or on the mesh component. Since the mesh represents the resource that comes from source data, changing a material on the mesh will affect all instances that reference the mesh. It is thus recommended to operate on the MeshComponent instead, which represents an instance of the mesh. That way the mesh resource remains unchanged and furthermore multiple instances may have distinct material assignments.

Materials are assigned and queried via a slot index [0 .. n-1] where n denotes the number of mesh parts in a mesh. Mesh resource and mesh component have the same number of material slots. The difference is that any slot on the mesh component starts as ```null``` which means the material used for rendering that part falls back to the mesh resource's slot.

So the material assignment workflow typically involves the following steps:

* Create a new material, copy relevant properties from the material in the respective mesh resource's slot
* Modify material properties, for example animate color over time
* To reset to original material, just assign ```null``` (C#) to the mesh component's slot
* Delete the material if not needed anymore

Here are code examples to create and assign a material

```csharp
void SetMeshComponentToRed(AzureSession session, MeshComponent meshComp)
{
    // create new Material instance
    var material = session.Actions.CreateMaterial(MaterialType.Color) as ColorMaterial;
    material.AlbedoColor = new Color4(0,1,0,1);

    // assign material to first slot (assuming mesh has only one part)
    meshComp.SetMaterial(0, material);
}

void SetMeshComponentToDefault(MeshComponent meshComp)
{
    // Reset to original material
    meshComp.SetMaterial(0, null);
}
```
