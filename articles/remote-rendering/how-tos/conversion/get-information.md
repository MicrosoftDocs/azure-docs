---
title: Get information about conversions
description: Get information about conversions
author: malcolmtyrrell
ms.author: matyrr
ms.date: 03/05/2020
ms.topic: how-to
---

# Get information about conversions

## Information about a conversion: The result file

When the conversion service converts an asset, it writes a summary of any issues into a "result file". 
For example, if a file `buggy.gltf` is converted, the output container will contain a file called `buggy.result.json`.

The result file lists any errors and warnings that occurred during the conversion and gives a result summary, which is one of `succeeded`, `failed` or `succeeded with warnings`.
The result file is structured as a JSON array of objects, each of which has a string property that is one of `warning`, `error`, `internal warning`, `internal error`, and `result`. 
There will be at most one error (either `error` or `internal error`) and there will always be one `result`.

## Example *result* file

The following example describes a conversion that successfully generated an arrAsset.
However, since there was a missing texture, the resulting arrAsset may not be as intended.

```JSON
[
  {"conversionId":"XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"},
  {"warning":"4004","title":"Missing texture","details":{"texture":"buggy_baseColor.png","material":"buggy_col"}},
  {"result":"succeeded with warnings"}
]
```

> [!NOTE]
> The `conversionId` is an internal Id that does not correlate with the Id that was used to create the conversion.

## Information about a converted model: The info file

The arrAsset file produced by the conversion service is solely intended for consumption by the rendering service. There may be times, however, when you want to access information about a model without starting a rendering session. To support this workflow, the conversion service places a JSON file beside the arrAsset file in the output container. For example, if a file `buggy.gltf` is converted, the output container will contain a file called `buggy.info.json` beside the converted asset `buggy.arrAsset`. It contains information about the source model, the converted model, and about the conversion itself.

## Example *info* file

Here's an example *info* file produced by converting a file called `buggy.gltf`:

```JSON
{
    "files": {
        "input": "Buggy.gltf"
    },
    "conversionSettings": {
        "recenterToOrigin": true
    },
    "inputInfo": {
        "sourceAssetExtension": ".gltf",
        "sourceAssetFormat": "glTF2 Importer",
        "sourceAssetFormatVersion": "2.0",
        "sourceAssetGenerator": "COLLADA2GLTF"
    },
    "inputStatistics": {
        "numMeshes": 148,
        "numFaces": 308306,
        "numVertices": 245673,
        "numMaterial": 149,
        "numFacesSmallestMesh": 2,
        "numFacesBiggestMesh": 8764,
        "numNodes": 206,
        "numMeshUsagesInScene": 236,
        "maxNodeDepth": 3
    },
    "materialOverrides": {
        "numOverrides": 4,
        "numOverriddenMaterials": 4
    },
    "outputInfo": {
        "conversionToolVersion": "3b28d840de9916f9d628342f474d38c3ab949590",
        "conversionHash": "CCDB1F7A4C09F565"
    },
    "outputStatistics": {
        "numMeshPartsCreated": 236,
        "numMeshPartsInstanced": 88,
        "recenteringOffset": [
            -24.1,
            -50.9,
            -16.5974
        ],
        "boundingBox": {
            "min": [
                -43.52,
                -61.775,
                -79.6416
            ],
            "max": [
                43.52,
                61.775,
                79.6416
            ]
        }
    }
}
```

## Information in the info file

### The *files* section

This section contains the provided filenames.

* `input`: The name of the source file.
* `output`: The name of the output file, when the user has specified a non-default name.

### The *conversionSettings* section

This section holds a copy of the [ConversionSettings](configure-model-conversion.md#settings-file) specified when the model was converted.

### The *inputInfo* section

This section records information about the source file format.

* `sourceAssetExtension`: The file extension of the source file.
* `sourceAssetFormat`: A description of the source file format.
* `sourceAssetFormatVersion`: The version of the source file format.
* `sourceAssetGenerator`: The name of the tool that generated the source file, if available.

### The *materialOverrides* section

This section gives information about [material overriding](override-materials.md) when a material override file was provided to the conversion service.
It contains the following information:
* `numOverrides`: The number of override entries read from the material override file.
* `numOverriddenMaterials`: The number of materials that were overridden.

### The *inputStatistics* section

This section provides information about the source scene. There will often be discrepancies between the values in this section and the equivalent values in the tool that created the source model. Such differences are expected, because the model gets modified during the export and conversion steps.

* `numMeshes`: The number of mesh parts, where each part can reference a single material.
* `numFaces`: The total number of triangles/points in the whole model. This number contributes to the primitive limit in the [standard rendering server size](../../reference/vm-sizes.md#how-the-renderer-evaluates-the-number-of-primitives).
* `numVertices`: The total number of vertices in the whole model.
* `numMaterial`: The total number of materials in the whole model.
* `numFacesSmallestMesh`: The number of triangles/points in the smallest mesh of the model.
* `numFacesBiggestMesh`: The number of triangles/points in the biggest mesh of the model.
* `numNodes`: The number of nodes in the model's scene graph.
* `numMeshUsagesInScene`: The number of times nodes reference meshes. More than one node may reference the same mesh.
* `maxNodeDepth`: The maximum depth of the nodes within the scene graph.

### The *outputInfo* section

This section records general information about the generated output.

* `conversionToolVersion`: Version of the model converter.
* `conversionHash`: A hash of the data within the arrAsset that can contribute to rendering. Can be used to understand whether the conversion service has produced a different result when rerun on the same file.

### The *outputStatistics* section

This section records information calculated from the converted asset.

* `numMeshPartsCreated`: The number of meshes in the arrAsset. It can differ from `numMeshes` in the `inputStatistics` section, because instancing is affected by the conversion process.
* `numMeshPartsInstanced`: The number of meshes that are reused in the arrAsset.
* `recenteringOffset`: When the `recenterToOrigin` option in the [ConversionSettings](configure-model-conversion.md) is enabled, this value is the translation that would move the converted model back to its original position.
* `boundingBox`: The bounds of the model.

## Deprecated features

The conversion service writes the files `stdout.txt` and `stderr.txt` to the output container, and these files had been the only source of warnings and errors.
These files are now deprecated. Instead, use
[result files](#information-about-a-conversion-the-result-file) for this purpose.

## Next steps

* [Model conversion](model-conversion.md)
* [Configure the model conversion](configure-model-conversion.md)
