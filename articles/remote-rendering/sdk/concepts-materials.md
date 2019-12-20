---
title: Materials
description: Rendering material description and material properties
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: conceptual
ms.service: azure-remote-rendering
---
# Materials

## Preface

Materials are [shared resources](../concepts/sdk-concepts.md#resources) that describe the rendering paradigm and properties of meshes. Each loaded mesh comes with a set of distinct materials that may differ by color, assigned texture, or any other visual property. These materials can either be modified by the user or the user can create and assign new instances of materials.
Materials can be shared between mesh parts, which means changing the property on a shared material will change the visual appearance of all these parts likewise.

> [!NOTE]
>Depending on the use case, changing the material settings might be an integral part of the application. For instance, changing the floor texture in architectural context. Assigning and managing materials introduces some bookkeeping overhead on the client code side. So for simple use cases, specifically color-tinting objects or switching objects to see-through mode, we introduced a much more lightweight workflow through component [HierarchicalStateOverrideComponent](../sdk/features-override-hierarchical-state.md).

## Material types

There are two distinct material types, which represent different rendering paradigms. The first type, a Pbr material, provides properties for physically-based rendering (Pbr), that means lighting is applied through physically modeling the lighting conditions for properties such as roughness and metalness. Accordingly, Pbr materials look realistic under different lighting conditions.

The second material type is a simple Color material that is not affected by any lighting and thus has no physical equivalent.

These two materials are now discussed in more detail:

### Pbr material

The Pbr material is a material that provides physically based rendering (Pbr). It uses a Cook Torrance BRDF with GGX as normal distribution, which is the most common setup for physically based shading in the industry. For further reading, refer for instance to this external article about [Physically based Rendering - Cook Torrance](http://www.codinglabs.net/article_physically_based_rendering_cook_torrance.aspx).

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

> [!INFO]
The importer from source assets (fbx) always converts source materials into Pbr materials and tries to match the physical properties.

For information how to use these properties on the Pbr material class, refer to the API documentation.

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

The API provides a generic class Material. This class is material type agnostic and only provides generic information such as material name. It houses specific material implementations of type ColorMaterial or PbrMaterial, which can be queried in the following manner:

C++ 
 ``` cpp
void SetMaterialColorToGreen(MaterialHandle material)
{
    // query the color material implemtation  
    if (ColorMaterial* colorMaterial = material->AccessMaterialAs<ColorMaterial>())
    {
        colorMaterial->SetAlbedoColor({ 0, 1, 0, 1 });
    }
    else if (PbrMaterial* pbrMaterial = material->AccessMaterialAs<PbrMaterial>())
    {
        pbrMaterial->SetAlbedoColor({0, 1, 0, 1});
    }
}
```
C#
``` cs
void SetMaterialColorToGreen(Material material)
{
    if (material.MaterialSubType == MaterialType.Color)
    {
        ColorMaterial colorMaterial = material.ColorMaterial.Value;
        colorMaterial.AlbedoColor = new Color4(0, 1, 0, 1);
    }
    else if (material.MaterialSubType == MaterialType.Pbr)
    {
        PbrMaterial pbrMaterial = material.PbrMaterial.Value;
        pbrMaterial.AlbedoColor = new Color4(0, 1, 0, 1);
    }
}

```

## Mesh vs. MeshComponent materials

Materials can either be modified on the mesh or on the mesh component. Since the mesh represents the resource that comes from source data, changing a material on the mesh will affect all instances that reference the mesh. It is thus recommended to operate on the MeshComponent instead, which represents an instance of the mesh. That way the mesh resource remains unchanged and furthermore multiple instances may have distinct material assignments.

Materials are assigned and queried via a slot index [0 .. n-1] where n denotes the number of mesh parts in a mesh. Mesh resource and mesh component have the same number of material slots. The difference is that any slot on the mesh component starts as invalid ```MaterialHandle``` (or ```null``` in C#) which means the material used for rendering that part falls back to the mesh resource's slot. 

So the material assignment workflow typically involves the following steps:
 * Create a new material, copy relevant properties from the material in the respective mesh resource's slot
 * Modify material properties, for example animate color over time
 * To reset to original material, just assign  ```MaterialHandle()``` (C++) or  ```null``` (C#) to the mesh component's slot
 * Delete the material if not needed anymore

Here are code examples to create and assign a material

C++
 ``` cpp
void SetMeshComponentToRed(RemoteRenderingClient& client, MeshComponent& meshComp)
{
    // create new Material instance
    auto material = Material::Create(client.AccessObjectDatabase(), MaterialType::Color);

    // query the color material implementation  
    ColorMaterial* colorMaterial = material->AccessMaterialAs<ColorMaterial>();
    colorMaterial->SetAlbedoColor({0, 1, 0, 1});

    // assign material to first slot (assuming mesh has only one part)
    meshComp.SetMaterial(0, material);
}

void SetMeshComponentToDefault(RemoteRenderingClient& client, MeshComponent& meshComp)
{
    // Reset to original material
    meshComp.SetMaterial(0, MaterialHandle());
}

```
C#
``` cs
void SetMeshComponentToRed(MeshComponent meshComp)
{
    // create new Material instance
    var material = RemoteManager.CreateMaterial(MaterialType.Color);
   
    // query the color material implementation  
    var colorMaterial = material.ColorMaterial.Value;
    colorMaterial.AlbedoColor = new Color4(0,1,0,1);

    // assign material to first slot (assuming mesh has only one part)
    meshComp.SetMaterial(0, material);
}

void SetMeshComponentToDefault(MeshComponent meshComp)
{
    // Reset to original material
    meshComp.SetMaterial(0, null);
}
```
