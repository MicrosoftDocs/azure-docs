---
title: Create custom styles for indoor maps
titleSuffix: Azure Maps Creator
description: Learn how to use Maputnik with Azure Maps Creator to create custom styles for your indoor maps.
author: stevemunk
ms.author: v-munksteve
ms.date: 8/31/2022
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Create custom styles for indoor maps

When you create an indoor map using Azure Maps Creator, default styles are applied. This article discusses how to customize these styling elements.

## Prerequisites

1. [Make an Azure Maps account](quick-demo-map-app.md#create-an-azure-maps-account).
2. [Obtain a primary subscription key](quick-demo-map-app.md#get-the-primary-key-for-your-account), also known as the primary key or the subscription key.
3. [Create a Creator resource](how-to-manage-creator.md).
4. Download the [Sample Drawing package](https://github.com/Azure-Samples/am-creator-indoor-data-examples/blob/master/Sample%20-%20Contoso%20Drawing%20Package.zip).
5. An Azure Maps Creator [tileset](/rest/api/maps/v2/tileset). If you have never used Azure Maps Creator to create an indoor map, you might find the [Use Creator to create indoor maps](tutorial-creator-indoor-maps.md) tutorial helpful.

## Create custom styles using Creators Maputnik based visual editor

While is it possible to modify your indoor maps styles using [Creators Rest API](/rest/api/maps-creator/), Creator also offers a visual editor that you can use to create custom styles that don't require any coding. This article will focus exclusively on creating custom styles using this visual style editor.

### Open style

When an indoor is created in your Azure Maps Creator service, default styles are automatically created for you. In order to customize the styling elements of your indoor map, you'll need to open that default style.

Open the [Azure Maps Style Editor](https://azure.github.io/Azure-Maps-Style-Editor) and select the **Open** toolbar button.

:::image type="content" source="./media/creator-indoor-maps/style-editor/open-menu.png" alt-text="A screenshot of the open dialog box in the visual style editor.":::

The **Open Style** dialog box opens.

Enter your primary [subscription key](quick-demo-map-app#get-the-primary-key-for-your-account) in the **Enter your Azure Maps subscription key** field.

Next, select domain associated with your subscription key in the drop-down list.

:::image type="content" source="./media/creator-indoor-maps/style-editor/open-style.png" alt-text="A screenshot of the open dialog box in the visual style editor.":::

Select the **Get map configuration list** button to get a list of every configuration associated with the active Creator resource.

:::image type="content" source="./media/creator-indoor-maps/style-editor/select-the-map-configuration.png" alt-text="A screenshot of the open dialog box in the visual style editor.":::

Once the map configuration drop-down list is populated, select the desired map configuration, and the drop-down list of style + tileset tuples will appear. Once you've selected the desired style, select the **Load selected style** button.

### Modify style

Once your style is open in the visual editor, you can begin to modify the various elements of your indoor map such as changing the background colors of conference rooms, offices, restrooms. You can also change the font size for labels such as office numbers and define what appears at different zoom levels.

#### Change background color

To change the background color for all specified units, put your mouse pointer over the unit and select it using the left mouse button. you'll be presented with a popup menu showing the units. Once you select the unit that you wish to update the style properties on, you'll see that unit ready to be updated in the left pane.

:::image type="content" source="./media/creator-indoor-maps/style-editor/visual-editor-select-layer.png" alt-text="A screenshot of the open dialog box in the visual style editor." lightbox="./media/creator-indoor-maps/style-editor/visual-editor-select-layer.png":::

Open the color palette and select the color you wish to change the selected unit to.

:::image type="content" source="./media/creator-indoor-maps/style-editor/visual-editor-select-color-palate.png" alt-text="A screenshot of the open dialog box in the visual style editor." lightbox="./media/creator-indoor-maps/style-editor/visual-editor-select-color-palate.png":::

#### Save custom styles

Once you have made all of the desired changes to your styles, save the changes to your Creator resource. You can overwrite your style with the changes, or create a new style.

To save your changes, select the **Save** button on the toolbar.

:::image type="content" source="./media/creator-indoor-maps/style-editor/save-menu.png" alt-text="A screenshot of the save menu in the visual style editor.":::

The will bring up the **Upload style & map configuration** dialog box:

:::image type="content" source="./media/creator-indoor-maps/style-editor/upload-style-map-config.png" alt-text="A screenshot of the open dialog box in the visual style editor.":::

The following table describes the four fields you are presented with.

| Property                      | Description                                                                                           |
|-------------------------------|-------------------------------------------------------------------------------------------------------|
| Style description             | A user-defined description for this style.                                                            |
| Style alias                   | An alias that can be used to reference this style.<BR>When referencing programmatically, the style will need to be referenced by the style ID if no alias is provided. |
| Map configuration description | A user-defined description for this map configuration.                                                |
| Map configuration alias       | An alias used to reference this map configuration.<BR>When referencing programmatically, the map configuration will need to be referenced by the map configuration ID if no alias is provided. |

Some important things to know about aliases:

1. Can be named using alphanumeric characters (0-9, a-z, A-Z), hyphens (-) and underscores (_).
1. Can be used to reference the underlying object, whether a style or map configuration, in place of that object's ID. This is especially important since neither the style or map configuration can be updated, meaning every time any changes are saved, a new ID is generated, but the alias can remain the same, making referencing it less error prone after it has been modified multiple times.

> [!WARNING]
> Duplicate aliases are not allowed. If the alias of an existing style or map configuration is used, that style or map configuration will be overwritten.

Once you have entered values into each required field, select the **Upload map configuration" button to save your style and map configuration data to your Creator resource.

### Custom category names

Azure Maps Creator has defined a [list of categories](https://atlas.microsoft.com/sdk/javascript/indoor/0.1/categories.json). When you create your [manifest](drawing-requirements#manifest-file-requirements), you associate each unit in your facility to one of these categories in the [unitProperties](drawing-requirements#unitproperties) object.

There may be times when you want to create a new category name. For example, you may want the ability to apply different styling attributes to all rooms with special accommodations for people with disabilities like a phone room with phones that have screens showing what the caller is saying for those with hearing impairments.

To do this, enter the desired value in the `categoryName` for the desired `unitName` in the manifest JSON before uploading your drawing package.

:::image type="content" source="./media/creator-indoor-maps/style-editor/category-name.png" alt-text="A screenshot of the base maps drop-down list in the visual editor toolbar.":::

Once opened in the visual editor, you'll notice that this category name isn't associated with any layer and has no default styling. In order to apply styling to it, you'll need to create a new layer and add the new category to it.

:::image type="content" source="./media/creator-indoor-maps/style-editor/category-name-changed.png" alt-text="A screenshot of the base maps drop-down list in the visual editor toolbar.":::

To create a new layer, select the duplicate button on an existing layer. This creates a copy of the selected layer that you can modify as needed. Next, rename the layer by typing a new name into the **ID** field. For this example we entered *indoor_unit_room_accessible*.

:::image type="content" source="./media/creator-indoor-maps/style-editor/duplicate.png" alt-text="A screenshot of the base maps drop-down list in the visual editor toolbar.":::

Once you've created a new layer, you need to associate your new category name with it. This is done by editing the copied layer to remove the existing categories add the new one.

For example, the JSON might look something like this:

```json
{
  "id": "indoor_unit_room_accessible",
  "type": "fill",
  "filter": [
    "all",
    ["has", "floor0"],
    [
      "any",
      ["==", "category_name", "room"],
      [
        "==",
        "categoryName",
        "room.accessible.phone"
      ]
    ]
  ],
  "layout": {"visibility": "visible"},
  "metadata": {
    "microsoft.maps:layerGroup": "unit"
  },
  "minzoom": 16,
  "paint": {
    "fill-antialias": true,
    "fill-color": [
      "string",
      ["feature-state", "color"],
      "rgba(230, 230, 230, 1)"
    ],
    "fill-opacity": 1,
    "fill-outline-color": "rgba(120, 120, 120, 1)"
  },
  "source-layer": "Indoor unit",
  "source": "2a101ca0-98ad-6f90-90f0-79cdd14c73b5"
}
```

Now when you select that unit in the map, the pop-up menu will have the new layer ID, which if following this example would be `indoor_unit_room_accessible`. Once selected you can make style edits.

### Base map

The base map drop-down list on the visual editor toolbar presents a list of base map styles that affect the style attributes of the base map that your indoor map is part of. It will not impact the style elements of your indoor map, but will enable you to see how your indoor map will look with the various base maps.

:::image type="content" source="./media/creator-indoor-maps/style-editor/base-map-menu.png" alt-text="A screenshot of the base maps drop-down list in the visual editor toolbar.":::

## Next steps


> [!div class="nextstepaction"]
> [View usage metrics](how-to-view-api-usage.md)

Explore samples that show how to integrate Azure AD with Azure Maps:

> [!div class="nextstepaction"]
> [Azure AD authentication samples](https://github.com/Azure-Samples/Azure-Maps-AzureAD-Samples)

