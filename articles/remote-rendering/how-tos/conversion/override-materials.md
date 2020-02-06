---
title: Overriding materials during model conversion
description: Explains the material overriding workflow at conversion time
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
titleSuffix: Azure Remote Rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: conceptual
ms.service: azure-remote-rendering
---

# Overriding materials during model conversion

When a model is converted for use in Azure Remote Rendering, in addition to the converted asset, a *materials file* is also produced.
This file describes how the settings in the source model are used to define the **physically-based rendering** (**PBR**) materials used by the renderer.
For a source file `foo.fbx`, the material file will be named `foo_materials.json` and can be found after conversion beside the model output in the output container.

As an example, for a simple asset `box.fbx`, which uses one material, the following simple `box_materials.json` file was produced:

```json
[
    {
        "name": "Default",
        "reflectivity": 1.0,
        "transparent": "<generated>",
        "isDoubleSided": "<generated>",
        "emissiveColor": {
            "r": 0.0,
            "g": 0.0,
            "b": 0.0,
            "a": 1.0
        },
        "roughness": "<generated>",
        "albedoMap": "<generated>",
        "albedoColor": "<generated>",
        "metalness": "<generated>",
        "compatibility": {
            "opacity": 1.0,
            "shininessStrength": 0.0,
            "specularColor": {
                "r": 0.8999999761581421,
                "g": 0.8999999761581421,
                "b": 0.8999999761581421,
                "a": 1.0
            },
            "diffuseMap": "SourceAssets\\GridGrey.tga",
            "diffuseColor": {
                "r": 0.0,
                "g": 0.0,
                "b": 0.0,
                "a": 1.0
            },
            "shininess": 1.9999998807907105
        }
    }
]
```

Some parameters are set as **\<generated\>**, which means they are computed from other values in the compatibility section.
This kind of conversion is done when the input data does not match what we expect in our material model, but we have a way of computing the parameters from what we have.
Sometime, it's almost a 1:1 match (going from a specular/glossiness PBR workflow to a Roughness/Metalness one), sometime it's a best effort conversion (adapting a Phong material to a PBR material), sometime it's a parameter deduced from other ones (enabling transparency when the alpha component of the albedo is less than 1).

## The override file used during conversion

A file of exactly the same format can be provided during conversion to allow the material generation to be customized.

> [!NOTE]
> Editing the materials file and reusing it as an override file directly is likely to lead to confusion.
We recommend that material files be renamed before use as override files.
For example, `box_materials.json` could be renamed `box_materials_override.json`.
We assume that this has been done below.

Let's say that the box model should have a different albedo color and texture for use in ARR.
In this case, the file `box_materials_override.json` can be edited as follows.

```json
[
    {
        "name": "Default",
        "reflectivity": 1.0,
        "transparent": "<generated>",
        "isDoubleSided": "<generated>",
        "emissiveColor": {
            "r": 0.0,
            "g": 0.0,
            "b": 0.0,
            "a": 1.0
        },
        "roughness": "<generated>",
        "albedoMap": "Textures\\puzzleCube.tga",
        "albedoColor": {
            "r": 0.33,
            "g": 0.33,
            "b": 0.33,
            "a": 1.0
        },
        "metalness": "<generated>",
        "compatibility": {
            "opacity": 1.0,
            "shininessStrength": 0.0,
            "specularColor": {
                "r": 0.8999999761581421,
                "g": 0.8999999761581421,
                "b": 0.8999999761581421,
                "a": 1.0
            },
            "diffuseMap": "SourceAssets\\GridGrey.tga",
            "diffuseColor": {
                "r": 0.0,
                "g": 0.0,
                "b": 0.0,
                "a": 1.0
            },
            "shininess": 1.9999998807907105
        }
    }
]
```

\<generated\> parameters will be ignored when consuming the override file. They are provided in the output file to highlight the customization points that contribute to the appearance of the model.

The `box_materials_override.json` file is placed the input container, and add a `ConversionSettings.json` is added beside `box.fbx`, which tells conversion where to find the override file (see [Configuring the model conversion](configure-model-conversion.md)):

```json
{
    "material-override" : "box_materials_override.json"
}
```

When the model is reconverted, the new settings will apply.

### Unlit materials

The Unlit material model describes a constantly shaded surface that is independent of lighting,
useful for assets made by Photogrammetry algorithms, default is `false`:

```json
[
    {
        "name": "Photogrametry_mat1",
        "unlit" : true
    },
    {
        "name": "Photogrametry_mat2",
        "unlit" : true
    }
]
```

## JSON schema

The full JSON schema for materials files is as follows:

```json
{
    "definitions" :
    {
        "color":
        {
            "type" : "object",
            "description" : "Color as 3 or 4 components vector",
            "properties":
            {
                "r": {"type":"number"},
                "g": {"type":"number"},
                "b": {"type":"number"},
                "a": {"type":"number"}
            },
            "required": ["r", "g", "b"]
        },
        "vec2":
        {
            "type" : "object",
            "description" : "List of parameters to override",
            "properties":
            {
                "x": {"type":"number"},
                "y": {"type":"number"}
            },
            "required": ["x", "y"]
        },
        "colorOrGenerated":
        {
            "anyOf": [
                {"$ref": "#/definitions/color"} ,
                {
                    "type" : "string",
                    "enum" : ["<generated>"]
                }
            ]
        },
        "numberOrGenerated":
        {
            "anyOf": [
                {"type" : "number"} ,
                {
                    "type" : "string",
                    "enum" : ["<generated>"]
                }
            ]
        },
        "booleanOrGenerated":
        {
            "anyOf": [
                {"type" : "boolean"} ,
                {
                    "type" : "string",
                    "enum" : ["<generated>"]
                }
            ]
        }
    },

    "type" : "array",
    "description" : "List of materials to override",
    "items":
    {
        "type" : "object",
        "description" : "List of parameters to override",
        "properties":
        {
            "name": { "type" : "string"},
            "albedoColor": { "$ref": "#/definitions/colorOrGenerated" },
            "textureCoordinateScale": { "$ref": "#/definitions/vec2" },
            "textureCoordinateOffset": { "$ref": "#/definitions/vec2" },
            "alphaClipThreshold": { "type" : "number"},
            "fadeOut": { "type" : "number"},
            "alphaClipEnabled": { "type" : "boolean"},
            "isDoubleSided": { "$ref": "#/definitions/booleanOrGenerated" },
            "useFadeToBlack": { "type" : "boolean"},
            "useVertexColor": { "type" : "boolean"},
            "albedoMap": { "type" : "string"},

            "emissiveColor": { "$ref": "#/definitions/color" },
            "aoScale": { "type" : "number"},
            "groundingDiffuseStrength": { "type" : "number"},
            "groundingSpecularFadeOut": { "type" : "number"},
            "groundingSpecularStrength": { "type" : "number"},
            "metalness": { "$ref": "#/definitions/numberOrGenerated" },
            "reflectivity": { "type" : "number"},
            "roughness": { "$ref": "#/definitions/numberOrGenerated" },
            "translucencyScale": { "type" : "number"},
            "alwaysUseMetalnessRoughnessValues": { "type" : "boolean"},
            "applyGrounding": { "type" : "boolean"},
            "metalnessMapIsAllWhite": { "type" : "boolean"},
            "specularEnabled": { "type" : "boolean"},
            "transparent": { "$ref": "#/definitions/booleanOrGenerated"},
            "useReflectionMap": { "type" : "boolean"},
            "usePerPixelIrradiance": { "type" : "boolean"},
            "useTranslucency": { "type" : "boolean"},
            "lightingMode": { "type" : "string", "enum" : [ "Dynamic", "Precomputed", "PrecomputedDynamic" ]},
            "vertexAlphaMode": { "type" : "string", "enum" : [ "Occlusion", "LightMask", "Opacity" ]},
            "vertexColorMode": { "type" : "string", "enum" : [ "Albedo", "Emissive" ]},
            "emissiveMap": { "type" : "string"},
            "normalMap": { "type" : "string"},
            "occlusionMap": { "type" : "string"},
            "roughnessMap": { "type" : "string"},
            "metalnessMap": { "type" : "string"},
            "reflectivityMap": { "type" : "string"},
            "compatibility" :
            {
                "type" : "object",
                "description" : "List of parameters that have no direct correspondence to a PBR mesh material parameter, but that can be converted to them",
                "properties":
                {
                    "diffuseColor": { "$ref": "#/definitions/color" },
                    "opacity": { "type" : "number" },
                    "glossiness": { "type" : "number" },
                    "shininess": { "type" : "number" },
                    "shininessStrength": { "type" : "number" },
                    "specularColor": { "$ref": "#/definitions/color" },
                    "bumpMap": { "type" : "string"},
                    "opacityMap": { "type" : "string"},
                    "diffuseMap": { "type" : "string"},
                    "specularMap": { "type" : "string"},
                    "shininessMap": { "type" : "string"},
                    "metallicRoughnessMap": { "type" : "string"},
                    "specularGlossinessMap": { "type" : "string"}
                },
                "additionalProperties" : false
            }
        },
        "required": ["name"],
        "additionalProperties" : false
    }
}
```
