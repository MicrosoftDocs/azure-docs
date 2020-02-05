---
title: Configuring the model conversion
description: Description of all model conversion parameters
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
titleSuffix: Azure Remote Rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: conceptual
ms.service: azure-remote-rendering
---

# Configuring the model conversion

This chapter documents the user-facing options in the configuration file for the ingestion.

## Settings file

If a file called `ModelIngestionSettings.json` is found in the input container beside the input model, then it is used to provide additional configuration for the model conversion process.

The contents of the file should satisfy the following json schema:

```json
{
    "$schema" : "http://json-schema.org/schema#",
    "description" : "ARR ModelIngestionSettings Schema",
    "type" : "object",
    "properties" :
    {
        "ez" :
        {
            "type" : "object",
            "description" : "Settings specific for the ezFormat",
            "properties":
            {
                "scaling" : { "type" : "number", "exclusiveMinimum" : 0, "default" : 1.0 },
                "recenterToOrigin" : { "type" : "boolean", "default" : false },
                "opaqueMaterialDefaultSidedness" : { "type" : "string", "enum" : [ "SingleSided", "DoubleSided" ], "default" : "DoubleSided" },
                "material-override" : { "type" : "string", "default" : "" },
                "gammaToLinearMaterial" : { "type" : "boolean", "default" : false },
                "gammaToLinearVertex" : { "type" : "boolean", "default" : false },
                "sceneGraphMode": { "type" : "string", "enum" : [ "none", "static", "dynamic" ], "default" : "dynamic" },
                "generateCollisionMesh" : { "type" : "boolean", "default" : true },
                "unlitMaterials" : { "type" : "boolean", "default" : false },
                "axis" : {
                    "type" : "array",
                    "items" : {
                        "type" : "string",
                        "enum" : ["default", "+x", "-x", "+y", "-y", "+z", "-z"]
                    },
                    "minItems": 3,
                    "maxItems": 3
                }
            },
            "additionalProperties" : false
        }
    },
    "additionalProperties" : false
}
```

An example `ModelIngestionSettings.json` file might be:

```json
{
    "ez" :
    {
        "scaling" : 0.01,
        "recenterToOrigin" : true,
        "material-override" : "box_materials_override.json"
    }
}
```

### Geometry parameters

* `scaling` - This parameter scales a model.
It can be used to grow or shrink a model, for example to display a building model on a table top.
Since the rendering engine expects lengths to be specified in meters, another important use of this parameter arises when a model is defined in different units.
For example, if a model is defined in centimeters, then applying a scale of 0.01 should render the model at the correct size.

* `recenterToOrigin` - States that a model should be ingested so that its bounding box is centered at the origin.
Centering is important if the source model is displaced far from the origin, since in that case floating point precision issues may cause rendering artifacts.

* `opaqueMaterialDefaultSidedness` - The rendering engine assumes that opaque materials are double-sided.
If that is not the intended behavior, this parameter should be set to "SingleSided".

### Material overrides

* `material-override` - This parameter allows the processing of materials to be [customized during conversion](override-materials.md).

### Color space parameters

The rendering engine expects color values to be in linear space.
If a model is defined using gamma space, then these options should be set to true.

* `gammaToLinearMaterial` - Convert material colors from gamma space to linear space
* `gammaToLinearVertex` - Convert vertex colors from gamma space to linear space

> [!NOTE]
> If the input file is an fbx, these settings are true by default. Otherwise they are false by default.

### Scene parameters

* `sceneGraphMode` - Defines the mode that the scene graph is converted to and whether the scene graph can be accessed via the API. There are three distinct modes:
  * `dynamic` (default) : All objects in the graph are exposed in the API and can be transformed independently
  * `static` : All objects in the graph are exposed in the API but cannot be transformed independently.
  * `none` : The full scene graph is collapsed into one object

Naturally, each of the mode comes with specific runtime performance cost. The `dynamic` case implies significant runtime performance overhead, esp. for large amounts of scene graph objects. This mode should only be used when moving parts individually is mandatory for the application, for example for an 'explosion view' animation. This mode has a high baseline performance overhead, even when no part is moved.

The `static` mode exports the full scene graph, but parts inside this graph have a constant transform relative to its root part. The root node of the object however can still be moved, rotated or scaled at no significant performance cost. Furthermore, individual parts are returned through ray cast hits or can be modified individually through state overrides (hidden state, selected, color tint etc.). The runtime cost of this mode is negligible compared to the dynamic case. Accordingly, this mode is ideal for large scenes that still need per-object inspection but no per-object transform changes.

The `none` mode has the least runtime overhead and also slightly better loading times. Inspection or transform of single objects is not possible in this mode. Use cases for this mode could be photogrammetry models that do not have a meaningful scene graph in the first place.

### Physics parameters

* `generateCollisionMesh` - To provide support fast ray casts, ingestion creates a collision mesh.
If enabled, time is added to the ingestion process and implies a performance penalty at runtime.
This parameter can be set to false when ray-cast support is not required.

### Unlit materials

* `unlitMaterials` - To override all materials in the scene to work as a constantly shaded surface that is independent of lighting.

### Coordinate system overriding

* `axis` - To override coordinate system unit-vectors, default values are `["+x", "+y", "+z"]` where sign means direction of a vector. In theory, the FBX format has a header where those vectors are defined and we use that information to transform the scene, and the glTF format defines a fixed coordinate system with Y-axis up. In practice, some assets have wrong header or saved with wrong Up-axis and it could be overridden by this option. For example: `"axis" : ["+x", "+z", "-y"]` will exchange the Z-axis and the Y-axis and keep coordinate system handed-ness by inverting  the Y-axis to the opposite direction.

### Vertex format

This paragraph is for advanced use cases, where changing the vertex format is necessary to meet memory constraints. While there is some potential to save valuable GPU memory by tweaking the vertex format,there is a high risk to compromise the visual quality or even stability of the server when the format is not appropriate.

The config file allows for modifying the output vertex structure:
* specific input data streams can be explicitly included or excluded
* the accuracy of vertex components can be decreased to reduce the memory footprint



## Typical use cases

Finding good import settings for given use case can be a tedious and time consuming process. On the other hand, ingestion settings may have a significant impact on runtime performance of the converted mesh. Better runtime performance means either more detailed models can be rendered at a stable framerate or VMs with lower specs (and thus cheaper VMs) can be allocated.  
There are certain classes of use cases that qualify for specific optimizations. Exemplary use cases and some considerations on their settings are discussed here:

### Use case: Architectural visualization / large outdoor maps

* These types of scenes tend to be static as in they don't need movable/addressable parts. Accordingly, the `sceneGraphMode` can be set to `static`, which improves runtime performance. The scene's root node can still be moved, rotated and scaled, for example to dynamically switch between 1:1 scale (for first person view) and table top view.
* Using movable parts often come in pair with ray casting to identify parts. Accordingly, if ray casts are not needed, the generation of the physics representation can be turned off via the `generateCollisionMesh` flag. Turning off collisions has significant impact on ingestion times, runtime loading times and also runtime per-frame update costs.
* If the application does not use the [cut planes feature](../../overview/features/cut-planes.md), the `opaqueMaterialDefaultSidedness` flag should be turned off as well. The performance gain is typically 20%-30%. However, cut planes can still be used, but there won't be backfaces when looking into the inner parts of objects, which looks counter-intuitive.

### Use case: Photogrammetry models

Models that originate from photogrammetry data typically do not come with a dedicated scene graph. Accordingly, the `sceneGraphMode` can be set to `none`. The impact is insignificant though, since the scene graph is not complex in the first place.

Due to the nature of photogrammetry data, materials do not need to go through a dynamic lighting pipeline in the renderer since the lighting is already baked into the textures. This fact can be utilized to gain slightly better performance and also a better memory footprint:

* The `unlitMaterials` flag turns all materials into unlit materials at ingestion time
* The mesh data does not require normal-, tangent- or binormal vectors, which result in a more efficient vertex format and thus lower memory footprint

### Use case: Visualization of compact machines, etc

These types of use cases are typically characterized by much detail compacted to a small spatial extent. The renderer can handle compacted volumes quite well since significant detail can be automatically discarded without any visual difference (for example triangles occluded by others or triangles that are too small to contribute to visible pixels). However, most of the optimizations mentioned in the previous use case do not apply here:

* Individual parts should be selectable and movable, so the `sceneGraphMode` must be left to default `dynamic`. 
* Accurate ray casts are typically integral part of the application, so collision meshes must be generated
* Cutplanes look better with the `opaqueMaterialDefaultSidedness` flag enabled
