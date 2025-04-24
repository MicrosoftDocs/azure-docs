---
title: Render configuration for Microsoft Planetary Computer Pro
description: Learn how to configure render settings for geospatial data visualization in the Microsoft Planetary Computer Pro data explorer.
author: MarcLichtman
ms.author: marclichtman
ms.service: azure
ms.topic: concept-article
ms.date: 04/24/2025
---

# Render configuration in Microsoft Planetary Computer Pro

For the Microsoft Planetary Computer Pro (MPC Pro) data explorer, and Tiler API to work together, a render configuration must be set up along with a definition of the **item assets** inside the collection JSON ([collection item assets](#collection-item_assets-field)). 

## Prerequisites

- You have a [STAC collection with MPC Pro GeoCatalog](./create-stac-collection.md)

## Render configuration overview

A render configuration describes how your geospatial data can be visualized. For example, if your data assigns classes like forest, or non-forest to positions in time and space, the render configuration assigns a specific color to each class. If your data indicates a continuous variable like elevation, the render configuration specifies a colormap spanning the possible values, for example, blue for 0m - red for 9000m. If your dataset has multiple datapoints - bands or variables for every position in time and space, a render configuration describes how those bands are combined into a visualization.

In MPC Pro, each STAC collection has one or more render configuration options. The list of these options can be set, accessed, updated and deleted through endpoints using the MPC Pro API or in the MPC Pro web interface. 

A render config with two options might look like:

```python
render_config = 
[
  {
    "id": "aboveground-biomass",
    "name": "Aboveground Biomass (tonnes)",
    "description": "Annual estimates of aboveground woody biomass",
    "type": "raster-tile",
    "options": 'assets=biomass_wm&colormap_name=chloris-biomass&rescale=1,750000',
    "minZoom": 13
  },
  {
    "id": "biomass-change",
    "name": "Biomass Change from prior year (tonnes)",
    "description": "Annual estimates of changes (gains and losses) in aboveground woody biomass.",
    "type": "raster-tile",
    "options": 'assets=biomass_change_wm&colormap_name=spectral&rescale=-5000,5000',
    "minZoom": 2
  }
]
```

A single render config is a JSON string (or Python dict if using the Python API) that specifies an id, name, description, type, minZoom, and "options".

## One-band vs three-band renders

Before diving into the render config options, it's important to identify whether you are rendering a single band of data or three bands of data. For each geospatial position, a three-band render combines three different datapoint values as the red, green, and blue pixel values of a natural image. In contrast, the datapoint values of a single band of data can be mapped onto corresponding colors through a colormap.

## Options: colormap_name and rescale

To demonstrate the `colormap_name` and `rescale` fields, consider the following example render configuration which maps the population density through the Midwest of the United States with a plasma colormap scaled from 0 through 1000:

```python
 {
    "id": "pop-density-plasma1k",
    "name": "Total Population Density (Plasma, 1000)",
    "description": "Total Estimated Population Density 30x30 meter grid",
    "type": "raster-tile",
    "options": "assets=total_pop_density&rescale=0,1000&colormap_name=plasma",
    "minZoom": 8
  }
```

The `id` field is used internally in MPC Pro. The `name` field is what appears in the Explore pulldown menu, and the `options` field contains the syntax used to generate the image. A transparent pixel indicates no people live there (or that no data was available), a deep indigo corresponds to less than 100 people, while a bright yellow means 1000 or more people within that pixel of the map, due to our `rescale=0,1000`.

![Screenshot of render configuration showing population density using a plasma colormap](media/pop_density_plasma.png)

Using a red-to-purple (colormap_name=rdpu), micropolitan areas, which are small islands of population density, are more easily visible, as shown below.

```python
 {
    "id": "pop-density-rdpu1k",
    "name": "Total Population Density (Rd-Prpl, 1000)",
    "description": "Total Estimated Population Density 30x30 meter grid",
    "type": "raster-tile",
    "options": "assets=total_pop_density&rescale=0,1000&colormap_name=rdpu",
    "minZoom": 8
  }
```
![Screenshot of render configuration showing population density using an Rd-Prpl colormap scaled to 1000](media/pop_density_rdpu1k.png)

A rescaled colormap (`rescale=0,300&colormap_name=rdpu`) better highlights areas of the map with even smaller populations. When scaled to 1000, a pixel would need at least 800 people within it to be visible as a deep pink/purple color. However, when rescaled to 0,300, pixel locations with only 240 people are easily visible. Any value below the min (or above the max) will be visualized with the colormap's min (max) color. For example, if rescale is set to `100,300`, a pixel with 305 or more people in it will be deepest purple and a pixel with 50 or less people would be the lightest pink in the rdpu colormap.

![Screenshot of render configuration showing population density using an Rd-Prpl colormap scaled to 300](media/pop_density_rdpu300.png)

```python
 {
    "id": "pop-density-rdpu300",
    "name": "Total Population Density (Rd-Prpl, 300)",
    "description": "Total Estimated Population Density 30x30 meter grid",
    "type": "raster-tile",
    "options": "assets=total_pop_density&rescale=0,300&colormap_name=rdpu",
    "minZoom": 8
  }
```

## Three-band renders, assets, asset_bidx

Three bands are treated as RGB by the renderer (R, G, and B respectively), while single-band renders require specifying a colormap so that the single channel of values can be mapped to RGB. If a single asset within the STAC item has multiple bands, those bands are referenced using `asset_bidx`.

Consider the National Agriculture Imagery Program (NAIP) dataset, where each item has a single asset, 'image', which has four bands, Red, Green, Blue, and NIR.

The following code shows the "item_assets" section from the collection JSON for the NAIP Data:
 
```python
{
"item_assets": {
    "image": {
      "type": "image/tiff; application=geotiff; profile=cloud-optimized",
      "roles": [
        "data"
      ],
      "title": "RGBIR COG tile",
      "eo:bands": [
        {
          "name": "Red",
          "common_name": "red"
        },
        {
          "name": "Green",
          "common_name": "green"
        },
        {
          "name": "Blue",
          "common_name": "blue"
        },
        {
          "name": "NIR",
          "common_name": "nir",
          "description": "near-infrared"
        }
      ]
    }
  }
}
```

In the render configuration setting, the NAIP collection's 'Natural Color' option below, the asset 'image' is specified, band 1 is assigned R, band 2 assigned G, and band 3 assigned B using the syntax `asset_bidx=image|1,2,3`.

```python
{
    "id": "natural-color",
    "name": "Natural color",
    "description": "RGB from visual assets",
    "type": "raster-tile",
    "options": "assets=image&asset_bidx=image|1,2,3",
    "minZoom": 11
  }
```

The same collection also has a 'Color infrared' option, which uses band 4 (NIR), band 1 (Red) and band 2 (Green) as the image's RGB values. The option below also has a color correcting `color_formula`.

```python
{
    "id": "color-infrared",
    "name": "Color infrared",
    "description": "Highlights healthy (red) and unhealthy (blue/gray) vegetation.",
    "type": "raster-tile",
    "options": "assets=image&asset_bidx=image|4,1,2&color_formula=Sigmoidal RGB 15 0.35",
    "minZoom": 12
  }
 ```

## Options: three different assets

It's also possible to specify assets as bands for a three-band render, as for the sentinel-2-l2a dataset, where rather than having 1 asset with 4 eo:bands, each band of the 13 bands of data is represented by its own asset name (AOT, B01, B02, B03, B04, B05, B06, B07, B08, B8A, B09, B11, B12). Each asset is specified using separate `assets=myassetname` with `&` in between each one.

```python
  {
    "id": "natural-color",
    "name": "Natural color",
    "description": "True color composite of visible bands (B04, B03, B02)",
    "type": "raster-tile",
    "options": "assets=B04&assets=B03&assets=B02&nodata=0&color_formula=Gamma RGB 3.2 Saturation 0.8 Sigmoidal RGB 25 0.35",
    "minZoom": 9
  }
```

## Options: expression, asset_as_band, nodata

Multiple assets can be combined into an expression, which can then be mapped onto a colormap, as in the following example from the sentinel-2-l2a dataset, which calculates a vegetative index from the B04 and B08 assets. When using only a single expression from multi-asset data, you must specify `asset_as_band=true` in the option. In this example, `nodata=0` makes transparent any pixel for which the expression matches the nodata value.

```python
{
    "id": "normalized-difference-veg-inde",
    "name": "Normalized Difference Veg. Index (NDVI)",
    "description": "Normalized Difference Vegetation Index (B08-B04)/(B08+B04), darker green indicates healthier vegetation.",
    "type": "raster-tile",
    "options": "nodata=0&expression=(B08-B04)/(B08+B04)&rescale=-1,1&colormap_name=rdylgn&asset_as_band=true",
    "minZoom": 9
  }
```

## All options parameters

The `options` contain most of the render settings/behavior, and is assembled from one or more key-value pairs specifying the following 16 different possible parameters:

| Parameter        | Type | Description |
| ---------------- | ---- | ----------- |
| assets           | str | Asset's names, multiple assets should be provided using the pattern `assets=data0&assets=data1&...`, assets must be specified either here or within `expression` |
| colormap_name    | str | Colormap name for single-band renders, reference [this graphic](media/colormaps_page.md) of named colormaps available in MPC Pro |
| colormap         | str | Use a custom colormap, instead of a `colormap_name`, for single-band renders |
| color_formula    | str | Color correction for three-band (i.e., RGB) renders, specified using a color formula comprising of gamma, sigmoidal, and saturation levels |
| exitwhenfull     | bool | Return as soon as the geometry is fully covered |
| skipcovered      | bool| Skip any items that would show up completely under the previous items |
| time_limit       | int | Return after N seconds to avoid long requests |
| rescale          | int, int | Set the min and max value used by the colormap (single-band) or RGB (three-band) |
| expression       | str | Math expression used to combine assets/bands either into one or three bands |
| algorithm        | str | More complex operations, meant to overcome the limitation of expression |
| algorithm_params | json | Parameters for the algorithm chosen |
| buffer           | float | Buffer on each side of the given tile, must be a multiple of 0.5, output tilesize will be expanded to tilesize + 2 * buffer |
| asset_as_band    | bool | Consider asset as a 1 band dataset, this is needed when you are doing an expression with multiple 1-band assets |
| asset_bidx       | array[str] | Per-asset band indexes, see the following examples |
| nodata           | str or int or float | Overwrite internal Nodata value with the provided value |
| unscale          | bool | Apply internal scale/offset |

## Setting your render configuration

Within the MPC Pro web interface, under the collection of interest, you can configure the render config by selecting the "Configuration" button and then selecting the "Render" tab.

![Screenshot of the render configuration web GUI displaying options for setting up render configurations](media/renderconfig_webgui.png)

If using the Python API, as demonstrated in [Create a STAC collection](./create-stac-collection.md), you can register a new render config using the following POST:

```python
render_config_endpoint = f"{geocatalog_url}/api/collections/{collection_id}/config/render-options"
response = requests.post(
    render_config_endpoint,
    json=render_config,
    headers=getBearerToken(),
    params={"api-version": "2024-01-31-preview"}
)
```

The remainder of this Quickstart focuses on the `options` field, as it contains the most flexibility, and thus, complexity.

## Formatting

The render config `options` field is always going to be a single string. Key-value pairs are separated within this string using `&`'s. Spaces are allowed, and they're used within the `color_formula` syntax. When one of the values is an array, such as `asset_bidx` which is an array of strings, the elements in the array are comma separated, but square brackets aren't used.

## Additional examples

Below we provide four different `options` values that show off a variety of render parameters:

* Example using asset_bidx: `assets=SWIR&asset_bidx=SWIR|1,3,5&nodata=0&skipcovered=False&exitwhenfull=False&time_limit=8&color_formula=gamma RGB 2.7, saturation 1.2, sigmoidal RGB 15 0.55`
  * Uses the asset named `SWIR`, and band indexes 1, 3, and 5/
  * Any missing data will be replaced with 0's.
  * Items that would show up completely under the previous items aren't skipped, and once the geometry of interest is fully covered, the rendered doesn't automatically exit.
  * After 8 seconds the renderer will finish, even if there are still assets left.
  * Apply color correct, see [Colormaps and Color Formula](#colormaps-and-color-formula) for details about how the formula is constructed.
* Example using algorithm and algorithm_params: `assets=data&colormap_name=gray&algorithm=hillshade&buffer=3&algorithm_params=%7B%22azimuth%22%3A%20315%2C%20%22angle_altitude%22%3A%2045%7D`.
  * This example shows how to use an algorithm, in this case the `hillshade` algorithm, which also requires setting a buffer size of at least 3, see [Algorithms](#algorithms) for details.
  * This example also uses a named colormap, `gray`, which goes from white to black.
* Example using an expression and color_formula: `expression=C02_2km_wm;0.45*C02_2km_wm+0.1*C03_2km_wm+0.45*C01_2km_wm;C01_2km_wm&nodata=-1&rescale=1,2000&color_formula=Gamma RGB 2.5 Saturation 1.4 Sigmoidal RGB 2 0.7&asset_as_band=true`.
  * This example of an expression shows three bands being combined to form RGB.
  * Note how assets don't have to be specified using `assets=myassetname` if you use an expression, which contains the asset names.
* An example of a custom colormap definition: `nodata=0&assets=lc&colormap={\"1\":[54,124,20,255],\"2\":[28,67,0,255],\"3\":[94, 91, 32, 255],\"4\":[234, 99, 32, 255],\"5\":[237, 232, 60, 255],\"6\":[236, 31, 175, 255],\"7\":[19, 0, 239, 255], \"8\":[209, 3, 0, 255]}.`

## Collection item_assets field

Separately from the render config, each STAC collection JSON must have an `item_assets` field that describes where the assets that need to be visualized are identified. At least two fields are required to be provided. All or a subset of the assets need to be specified by name within the render config `options` param, either using the `assets` key or using an `expression`, so the renderer knows which assets to use.

## Colormaps and color formula

When it comes to color, there are different options you must choose from depending on whether you are dealing with a single-band or three-band render. If you use an algorithm or expression that outputs three bands, consider it a three-band render for the sake of this section.

* Single-band render - Provide a `colormap_name`, **or** a custom `colormap`, providing neither may either error out or use a greyscale colormap by default. Optionally, you can add rescaling to either case to control how values are mapped to the colormap. Reference [this graphic](media/colormaps_page.md) for all named colormaps available in MPC Pro.
* Three-band render - A three-band render is already in RGB format so you do not need to provide anything, but you can optionally specify a `color_formula` to provide color correction. Specifying a colormap (`colormap` or `colormap_name`) is not supported and does not make sense when there are already three bands corresponding to RGB. Rescaling can still be used, to specify how the values get mapped to RGB (especially if your three bands are floating point values).

For other cases such as a two-band render, an expression or algorithm **must** be used to translate the two bands into either a single or three band-render.

### Using `colormap_name` and rescaling

During rendering of a single band, the colormap maps each value in your data (i.e., an int or float) to a specific color. A gradient colormap creates a continuous transition of color. For example red-to-blue, or white-to-gray-to-black, corresponding to the data's values. All you have to provide is the `colormap_name`. Cividis (blue-to-yellow), magma (black-purple-pink-yellow), and gray (white-gray-black) are common colormaps. The color may also indicate a classification, like green for forest, represented as a 1 in the data, and blue for water, represented as 4 in the data. This is why many of the colormaps have a small number of colors at specific values, and black elsewhere.

### Custom colormaps

If none of the named colormaps are suitable, a custom colormap can be defined using the `colormap` field in options. The format uses a dictionary of indices starting at 1, where each index has an RGBA value. For example: `colormap={\"1\":[54,124,20,255],\"2\":[28,67,0,255],\"3\":[94, 91, 32, 255],\"4\":[234, 99, 32, 255],\"5\":[237, 232, 60, 255],\"6\":[236, 31, 175, 255],\"7\":[19, 0, 239, 255], \"8\":[209, 3, 0, 255]}`. Note that double quotes must be escaped.

### Color correction using `color_formula`

For three-band renders, you can optionally perform a color correction step before rendering using the `color_formula` field. A color formula color-corrects an image using Gamma, Sigmoidal, and Saturation operations (the process can be thought of as RGB in, RGB out). Gamma brightens or darkens midtones, Sigmoidal alters overall brightness, and Saturation alters "colorfulness" between gray-like and vibrant hues. The formula is as follows and is encapsulated in a single string (with spaces), comprising of three parts: Gamma, Saturation, Sigmoidal: **Gamma BANDS VALUE Saturation PROPORTION Sigmoidal BANDS CONTRAST BIAS**.

Example `color_formula`: **Gamma RGB 2.5 Saturation 1.4 Sigmoidal RGB 2 0.7**.

**Gamma** adjusts RGB, essentially brightening or darkening the midtones. This can be useful for satellite imagery, for reducing blue and green atmospheric haze. It requires specifying the list of bands (R, G, and/or B), as well as the value for the gamma curve (a value greater than 1 brightens the image, less than 1 darkens it). For example, `Gamma RG 1.5`. 

**Saturation** represents how colorful the image is; highly saturation colors are intense and cartoon-like while low saturation is closer to black and white. It only has one parameter, which controls the level of saturation. A value of 0 will result in a greyscale image, a value of 1 won't change anything, and a value of 2 represents very high saturation. For example, `Saturation 1.4`.

**Sigmoidal** adjusts the contrast and brightness in a nonlinear way that matches human's visual perception. It can help to increase contrast without blowing out the shadows or already-bright regions of an image. It requires specifying the list of bands (R, G, and/or B), the contrast level, and the bias level. A contrast level of 0 is no change, 3 is typical, and 20 is a lot. A typical bias level is 0.5. For example, `Sigmoidal B 2 0.5`. 

## Expressions

A render expression combines bands in your data into one or more new values, for the purpose of visualization. For example, the sentinel-2-l2a dataset contains 13 spectral bands, including B8A at 0.86 micrometers, and B11 at 1.61 micrometers. The popular Normalized Difference Vegetation Index (NVDI), defined as (B8A-B11)/(B8A+B11), is sensitive to the abundance of chlorophyll and water in vegetation and indicates overall vegetation health, and we can represent this index as an expression in our render config using `expression=(B8A-B11)/(B8A+B11)` within our `options`. This takes two bands and outputs a single band, so we would need to use a colormap in this case.

The math expressions support operators `+-/*` combined with as many pairs of `()` as you need.

Multi-band expressions use semicolons `;` as a separator for each output, for example, consider `expression=C02;0.45*C02+0.1*C03+0.45*C01;C01` which will produce a three-band (RGB) output using three bands as input. If you are using a multi-band expression made up of multiple single-band assets, make sure to set `asset_as_band` to True.

Note that if you use an expression, you don't have to specify your assets also using `assets=myassetname`, they are instead provided as part of the expression.

## Algorithms

Algorithms were added to offer more complex operations than what expressions can handle. For example, the `hillshade` algorithm converts elevation data into new values that illustrate terrain with shadows and highlights. The currently supported algorithms are as follows:

* `hillshade`: Create hillshade from elevation dataset (single band input, single band output of type uint8). Example full config: `assets=data&colormap_name=gray&algorithm=hillshade&buffer=3&algorithm_params=%7B%22azimuth%22%3A%20315%2C%20%22angle_altitude%22%3A%2045%7D`
* `contours`: Create contours lines (raster) from elevation dataset (single band input, RGB output). Example full config: `assets=data&algorithm=contours&buffer=3&algorithm_params=%7B%22minz%22%3A-1000%2C%22maxz%22%3A4000%2C%22thickness%22%3A8%7D'`
* `terrarium`: Mapzen's format to encode elevation value in RGB values (single band input, RGB output), [source](https://github.com/tilezen/joerd/blob/master/docs/formats.md#terrarium)
* `terrainrgb`: Mapbox's format to encode elevation value in RGB values (single band input, RGB output), [source](https://docs.mapbox.com/data/tilesets/guides/access-elevation-data/)
* `normalizedIndex`: Normalized Difference Index, (two-band input, single band output of type float32)

The additional options key `algorithm_params` is used to provide parameters to the algorithm itself, and is optional. For example, you can simply use the default algorithm parameters by leaving it out. The value of `algorithm_params` must be a JSON string, that has been converted to replace special characters in string using the %xx escape, in order to be URL-safe. For example, %7B is a `{`, %22 is `"`, %3A is `:`, %20 is a space. A Python dictionary can be converted to this URL-safe JSON string as follows:

```python
from urllib.parse import quote
import json
algorithm_params = {"azimuth": 315, "angle_altitude": 45}
algorithm_params_json = json.dumps(algorithm_params)
print(algorithm_params_json)
print(quote(algorithm_params_json))
```

Which leads to the final string **algorithm_params=%7B%22azimuth%22%3A%20315%2C%20%22angle_altitude%22%3A%2045%7D**.

Specific `algorithm_params` can be referenced on [the Titiler GitHub](https://github.com/developmentseed/titiler/blob/725f857c735790e6c7783c4319f61804669b1980/src/titiler/core/titiler/core/algorithm/dem.py). Note that the hillshade algorithm requires that you also specify a buffer of at least 3, so that it has tiles adjacent to the edges to work with.