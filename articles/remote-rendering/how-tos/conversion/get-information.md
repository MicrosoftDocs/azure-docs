---
title: Get information about a converted model
description: Description of all model conversion parameters
author: MalcolmTyrrell
manager: jlyons
services: azure-remote-rendering
titleSuffix: Azure Remote Rendering
ms.author: matyrr
ms.date: 05/03/2020
ms.topic: conceptual
ms.service: azure-remote-rendering
---

# Get information about a converted model

## The "info" file

When the conversion service converts a model, a file recording information about the conversion is placed beside the arrAsset file in the output container. 
For example, if a file `buggy.gltf` is converted, the output container will contain the converted asset `buggy.arrAsset` as well as a file called `buggy.info.json`.

Here's an example "info" file:

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

### The "files" section

This records information about the filenames provided.
* "input": The name of the source file
* "output": The name of the output file, when the user has specified a non-default name.

### The "conversionSettings" section

This holds a copy of the ConversionSettings specified when the model was converted. See the section on [Configuring conversion](configure-model-conversion.md).

### The "inputInfo" section

This records information about the source file format.
* "sourceAssetExtension": The file extension of the source file.
* "sourceAssetFormat": A description of the source file format.
* "sourceAssetFormatVersion": The version of the source file format.
* "sourceAssetGenerator": The name of the tool which generated the source file, if the source file carries that information.

### The "inputStatistics" section

This carries information about the source scene.
Note that there will usually be some discrepancies between the values in this section and those equivalent values which exist in the tool which created the source model. 
This is expected, because the model will have undergone structural modification during export to the source format and import to the conversion service.
* "numMeshes": The number of parts of the mesh, where each part can reference a single material.
* "numFaces": The total number of _triangles_ in the whole model (note that the mesh is triangulated during conversion)
* "numVertices": The total number of vertices in the whole model
* "numMaterial": The total number of materials in the whole model
* "numFacesSmallestMesh": The number of triangles in the smallest mesh in the model
* "numFacesBiggestMesh": The number of triangles in the biggest mesh in the model
* "numNodes": The number of nodes in the model's scene graph
* "numMeshUsagesInScene": The number of times nodes reference meshes (note that more than one node may reference the same mesh)
* "maxNodeDepth": The maximum depth of the nodes within the scene graph.

### The "outputInfo" section

This section records general information about the generated output.
* "conversionToolVersion": This is an internal value corresponding to the version of the software which converted the model. 
This value should be treated as opaque, and will not appear in any other context.
However, it may be useful in understanding the relationship between arrAsset files converted at different times.
* "conversionHash": This is a hash of the data within the arrAsset file that can contribute to rendering.
This value can be used to understand whether the whether conversion has produced different results when run on the same file, independent of other factors (such as the conversionToolVersion).

### The "outputStatistics" section

This records information calculated from the converted asset.
* "numMeshPartsCreated": The number of meshes in the arrAsset. This can differ from the "numMeshes" value in the "inputStatistics" section, because instancing is affected by the conversion process.
* "numMeshPartsInstanced": The number of meshes which are reused in the arrAsset.
* "recenteringOffset": This is a non-zero vector when the "recenterToOrigin" option in the [ConversionSettings](configure-model-conversion.md) is set to true.
This is a vector in the coordinate system of the arrAsset, and carries the offset at which the converted model would need to be placed, to move it back to its original position.
* "boundingBox": This records the bounds of the model, in the coordinate system of the arrAsset.

## Next steps

* [Configuring conversion](configure-model-conversion.md)
