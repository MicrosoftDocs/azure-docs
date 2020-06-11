---
title: Get information about a converted model
description: Description of all model conversion parameters
author: malcolmtyrrell
ms.author: matyrr
ms.date: 03/05/2020
ms.topic: how-to
---

# Get information about a converted model

The arrAsset file produced by the conversion service is solely intended for consumption by the rendering service. There may be times, however, when you want to access information about a model without starting a rendering session. Therefore, the conversion service places a JSON file beside the arrAsset file in the output container. For example, if a file `buggy.gltf` is converted, the output container will contain a file called `buggy.info.json` beside the converted asset `buggy.arrAsset`. It contains information about the source model, the converted model, and about the conversion itself.

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

### The *inputStatistics* section

This section provides information about the source scene. There will often be discrepancies between the values in this section and the equivalent values in the tool that created the source model. Such differences are expected, because the model gets modified during the export and conversion steps.

* `numMeshes`: The number of mesh parts, where each part can reference a single material.
* `numFaces`: The total number of _triangles_ in the whole model. Note that the mesh is triangulated during conversion.
* `numVertices`: The total number of vertices in the whole model.
* `numMaterial`: The total number of materials in the whole model.
* `numFacesSmallestMesh`: The number of triangles in the smallest mesh of the model.
* `numFacesBiggestMesh`: The number of triangles in the biggest mesh of the model.
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

## Next steps

* [Model conversion](model-conversion.md)
* [Configure the model conversion](configure-model-conversion.md)
