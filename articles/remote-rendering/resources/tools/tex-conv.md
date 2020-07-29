---
title: TexConv - Texture conversion tool
description: User manual for the TexConv command-line tool
author: jakrams
ms.author: jakras
ms.date: 02/11/2020
ms.topic: article
---

# TexConv - Texture conversion tool

TexConv is a command-line tool to process textures from typical input formats like PNG, TGA, JPEG and DDS into optimized formats for runtime consumption.
While the most common scenario is to convert a single input file `A.xxx` into an optimized format `B.yyy`, the tool has many additional options for advanced uses.

## Command-line help

Running TexConv.exe with the `--help` parameter will list all available options. Additionally, TexConv prints the used options when it is executed, to help understand what it is doing. Consult this output for details.

## General usage

TexConv always produces **exactly one output** file. It may use **multiple input** files to assemble the output from. For the assembly, it also needs a **channel mapping**, which tells it which channel (*Red, Green, Blue* or *Alpha*) to take from which input file and move it into which channel of the output image.

The most straight forward command line is this:

```cmd
TexConv.exe -out D:/result.dds -in0 D:/img.jpg -rgba in0
```

- `-out` specifies the output file and format
- `-in0` specifies the first input image
- `-rgba` tells it that the output image should use all four channels and that they should be taken 1:1 from the input image

## Multiple input files

To assemble the output from multiple input files, specify each input file using the `-in` option with an increasing number:

```cmd
-in0 D:/img0.jpg -in1 D:/img1.jpg -in2 D:/img2.jpg ...
```

When assembling a cubemap from 2D textures, one can also use `-right`, `-left`, `-top`, `-bottom`, `-front`, `-back` or `-px`, `-nx`, `-py`, `-ny`, `-pz`, `-nz`.

To map these inputs to the output file, a proper channel mapping is needed.

## Channel mappings

The channel-mapping options specify from which input to fill the given output channels. You can specify the input for each channel individually like this:

```cmd
-r in0.b -g in0.g -b in0.r -a in1.r
```

Here the RGB channels of the output would be filled using the first input image but red and blue will get swapped. The alpha channel of the output would be filled with the values from the red channel of the second input image.

Specifying the mapping for each channel separately gives the greatest flexibility. For convenience the same can be written using "swizzling" operators:

```cmd
-rgb in0.bgr -a in1.r
```

### Output channels

The following channel-mapping options are available:

- `-r`, `-g`, `-b`, `-a` : These specify single channel assignments
- `-rg` : Specify the red and green channel assignments.
- `-rgb` : Specify the red, green and blue channel assignments.
- `-rgba` : Specifies all four channel assignments.

Mentioning only the R, RG or RGB channel, instructs TexConv to create an output file with only 1, 2 or 3 channels respectively.

### Input swizzling

When stating which input texture should fill which output channel, one can swizzle the input:

- `-rgba in0` is equivalent to `-rgba in0.rgba`
- `-rgba in0.bgra` will swizzle the input channels
- `-rgb in0.rrr` will duplicate the red channel into all channels

One may also fill channels with either black or white:

- `-rgb in0 -a white` will create a 4 channel output texture but set alpha to fully opaque
- `-rg black -b white` will create an entirely blue texture

## Common options

The most interesting options are listed below. More options are listed by `TexConv --help`.

### Output type

- `-type 2D` : The output will be a regular 2D image.
- `-type Cubemap` : The output will be a cubemap image. Only supported for DDS output files. When this is specified, one can assemble the cubemap from 6 regular 2D input images.

### Image compression

- `-compression none` : The output image will be uncompressed.
- `-compression medium` : If supported, the output image will use compression without sacrificing too much quality.
- `-compression high` : If supported, the output image will use compression and sacrifice quality in favor of a smaller file.

### Mipmaps

By default, TexConv generates mipmaps when the output format supports it.

- `-mipmaps none` : Mipmaps will not be generated.
- `-mipmaps Linear` : If supported, mipmaps will be generated using a box filter.

### Usage (sRGB / gamma correction)

The `-usage` option specifies the purpose of the output and thus tells TexConv whether to apply gamma correction to the input and output files. The usage only affects the RGB channels. The alpha channel is always considered to contain 'linear' values. If usage is not specified, the 'auto' mode will try to detect the usage from the format and file-name of the first input image. For instance, single and dual channel output formats are always linear. Check the output to see what decision TexConv made.

- `-usage Linear` : The output image contains values that do not represent colors. This is typically the case for metallic and roughness textures, as well as all kinds of masks.

- `-usage Color` : The output image represents color, such as diffuse/albedo maps. The sRGB flag will be set in the output DDS header.

- `-usage HDR` : The output file should use more than 8 bits per pixel for encoding. Consequently all values are stored in linear space. For HDR textures it does not matter whether the data represents color or other data.

- `-usage NormalMap` : The output image represents a tangent-space normal map. Values will be normalized and mipmap computation will be optimized slightly.

- `-usage NormalMap_Inverted` : The output is a tangent-space normal map with Y pointing in the opposite direction than the input.

### Image rescaling

- `-minRes 64` : Specifies the minimum resolution of the output. If the input image is smaller, it will get upscaled.
- `-maxRes 1024` : Specifies the maximum resolution of the output. If the input image is larger, it will get downscaled.
- `-downscale 1` : If this is larger than 0, the input images will be halved in resolution N times. Use this to apply an overall quality reduction.

## Examples

### Convert a color texture

```cmd
TexConv.exe -out D:/diffuse.dds -in0 D:/diffuse.jpg -rgba in0 -usage color
```

### Convert a normal map

```cmd
TexConv.exe -out D:/normalmap.dds -in0 D:/normalmap.png -rgb in0 -usage normalmap
```

### Create an HDR cubemap

```cmd
TexConv.exe -out "D:/skybox.dds" -in0 "D:/skymap.hdr" -rgba in0 -type cubemap -usage hdr
```

A great source for HDR cubemaps is [hdrihaven.com](https://hdrihaven.com/hdris/).

### Bake multiple images into one

```cmd
TexConv.exe -out "D:/Baked.dds" -in0 "D:/metal.tga" -in1 "D:/roughness.png" -in2 "D:/DiffuseAlpha.dds" -r in1.r -g in0.r -b black -a in2.a -usage linear
```

### Extract a single channel

```cmd
TexConv.exe -out D:/alpha-mask-only.dds -in0 D:/DiffuseAlpha.dds -r in0.a
```
