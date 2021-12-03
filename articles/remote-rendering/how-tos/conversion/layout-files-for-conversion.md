---
title: Laying out files for conversion
description: Recommendations about how best to place files in the input container.
author: MalcolmTyrrell
ms.author: matyrr
ms.date: 09/03/2020
ms.topic: how-to
---

# Laying out files for conversion

In order to correctly process an asset, the conversion service needs to be able to find all the input files.
These consist of the main asset file being converted and usually some other files referenced by paths within the asset file.
The request to convert an asset is given two parameters which determine how the conversion service finds these files: The `settings.inputLocation.blobPrefix` (which is optional) and the `settings.inputLocation.relativeInputAssetPath`.
They are fully documented in the [Conversion REST API](conversion-rest-api.md) page.
For the purpose of laying out files, the important thing to note is that the `BlobPrefix` determines complete set of files which are available to the conversion service when processing the asset.

> [!Note]
> The service will download all files under the input.BlobPrefix. Ensure file names and paths do not exceed [Windows path length limits](/windows/win32/fileio/maximum-file-path-limitation) to avoid issues on the service. 

## Placing files so they can be found

When a source asset makes use of external files, paths to those files will be stored within the asset.
The conversion service has to interpret these paths in a file system that is different from the asset's original file system.
If the paths are stored as relative paths and the relative location between the source asset and the file it references is unchanged, then it's easy for the conversion service to find the referenced file.

> [!Note]
> We recommend that you place files in the input container so the relative locations of the files are the same as they were when the asset was created.

> [!Note]
> Prefer to create assets which carry relative paths.
> The tutorial on [setting up materials for 3ds Max](../../tutorials/modeling/3dsmax-material-setup.md) gives a 3ds Max example of how to ensure an asset uses relative paths.

## Finding textures

Due to the many ways assets can be generated, the conversion service has to be flexible.
In particular, it has to handle situations where the paths in the asset and the location of textures don't match precisely.
An example is when assets are generated containing absolute paths, since these paths will never match the filesystem used by the conversion service.
To handle this situation among others, we use a best effort approach to finding textures.

The algorithm for locating textures is as follows:
Given a path as stored in an asset, find the longest sub-path suffix which, when used as a relative path from the location of the source asset, targets a file that exists.
If no such sub-path (including the whole path) targets a file, the texture is regarded as missing.

Consider the following contrived filesystem: 
```
G:\CONVERSION
├───Assets
│   │   myAsset.fbx
│   │   myTexture.png            <- A
│   │
│   └───Textures
│       │   myTexture.png        <- B
│       │
│       └───MyAssetTextures
│               myTexture.png    <- C
│
└───Textures
    │   myTexture.png            <- D
    │
    └───MyAssetTextures
            myTexture.png        <- E
```
If myAsset.fbx references a texture with the relative path `..\Textures\MyAssetTextures\myTexture.png`, then the conversion service will use file E.
In fact, it can use any of the files A, C, and E if they exist, with file E being preferred since it is found with the longest suffix.
Files B and D will never be used, because `Textures\myTexture.png` is not part of any suffix of the stored path.
If the asset instead contained the paths `H:\Foo\Bar\Textures\MyAssetTextures\myTexture.png` or `..\..\..\Foo\Bar\Textures\MyAssetTextures\myTexture.png`, then the conversion service will be able to find the files A and C if they exist (preferring C over A). However, E cannot be found this way, and the file will have to be relocated.
This could be fixed by moving the Textures folder beside the asset.

> [!Note]
> If textures are not being found, a possible remedy is to ensure the asset is a sibling of some subtree containing the textures.

## Next steps

- [Model conversion](model-conversion.md)