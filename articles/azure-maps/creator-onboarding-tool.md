---
title: Create indoor map with onboarding tool
titleSuffix: Azure Maps Creator
description: This article describes how to create an indoor map using the onboarding tool
author: brendansco
ms.author: Brendanc
ms.date: 08/15/2023
ms.topic: how-to
ms.service: azure-maps
services: azure-maps

---

# Create indoor map with the onboarding tool

This article demonstrates how to create an indoor map using the Azure Maps Creator onboarding tool.

## Prerequisites

- A basic understanding of Creator. For an overview, see [What is Azure Maps Creator?]
- A drawing package. For more information, see [Drawing package requirements].

> [!NOTE]
> The drawing package used in this article is the [Sample - Contoso Drawing Package].

## Get started

The following steps demonstrate how to create an indoor map in your Azure Maps account using the [Azure Maps Creator onboarding tool]. The `MapConfigurationId` property is created during the onboarding process and is used to reference the map in your application. For more information, see [The Map Configuration ID].

1. Import the drawing package into your Azure Maps account using the [Azure Maps Creator onboarding tool].

    :::image type="content" source="./media/creator-indoor-maps/onboarding-tool/create-manifest.png" alt-text="Screenshot showing the process file screen of the Azure Maps Creator onboarding tool.":::

    > [!TIP]
    > If your drawing package doesn't contain a manifest, [The Drawing Package Guide] describes how to create one.

1. Once your drawing package has been processed, select the **Create + Download** button to begin creating the indoor map.

    :::image type="content" source="./media/creator-indoor-maps/onboarding-tool/select-review-create.png" alt-text="Screenshot showing the Review + Create screen of the Azure Maps Creator onboarding tool, with the Create + Download button highlighted.":::

1. The first step in this process uploads the package into the Azure Maps account.

    :::image type="content" source="./media/creator-indoor-maps/onboarding-tool/package-upload.png" alt-text="Screenshot showing the package upload screen of the Azure Maps Creator onboarding tool.":::

1. Once the package is uploaded, the onboarding tool uses the [Conversion service] to validate the data then convert the geometry and data from the drawing package into a digital indoor map. For more information about the conversion process, see [Convert a drawing package] in the Creator concepts article.

    :::image type="content" source="./media/creator-indoor-maps/onboarding-tool/package-conversion.png" alt-text="Screenshot showing the package conversion screen of the Azure Maps Creator onboarding tool, including the Conversion ID value.":::

1. The next step in the process is to create the [dataset]. Datasets contain a collection of [features] within the facility.

    :::image type="content" source="./media/creator-indoor-maps/onboarding-tool/dataset-creation.png" alt-text="Screenshot showing the dataset-creation screen of the Azure Maps Creator onboarding tool, including the dataset ID value.":::

1. The dataset is used to create a [tileset]. Tilesets are a lightweight storage format used by Azure Maps when rendering map data.

    :::image type="content" source="./media/creator-indoor-maps/onboarding-tool/tileset-creation.png" alt-text="Screenshot showing the tileset creation screen of the Azure Maps Creator onboarding tool, including the Map Configuration ID value.":::

    > [!IMPORTANT]
    > The `MapConfigurationId` is created as a part of the tileset creation process and is required to reference the indoor map in your applications. Make sure to make a copy of it for future reference.

1. The indoor map is created and displayed as a preview.

     :::image type="content" source="./media/creator-indoor-maps/onboarding-tool/map.png" alt-text="Screenshot showing the map screen of the Azure Maps Creator onboarding tool.":::

Your indoor map is created and stored in your Azure Maps account and is now ready to be used in your applications.

### The Map Configuration ID

 The `MapConfigurationId` property created as a part of the tileset creation process in step 6. This property is required to reference the indoor map in your application code. Make sure to make a copy of it for future reference.

## Next steps

Integrate the indoor map into your applications using the Web SDK.

> [!div class="nextstepaction"]
> [Use the Azure Maps Indoor Maps module]

[Azure Maps Creator onboarding tool]: https://azure.github.io/azure-maps-creator-onboarding-tool
[Conversion service]: /rest/api/maps/v2/conversion
[Convert a drawing package]: creator-indoor-maps.md#convert-a-drawing-package
[dataset]: creator-indoor-maps.md#datasets
[Drawing package requirements]: drawing-requirements.md?pivots=drawing-package-v2
[features]: glossary.md#feature
[Sample - Contoso Drawing Package]: https://github.com/Azure-Samples/am-creator-indoor-data-examples/blob/master/Drawing%20Package%202.0/Sample%20-%20Contoso%20Drawing%20Package.zip
[The Drawing Package Guide]: drawing-package-guide.md?pivots=drawing-package-v2#the-azure-maps-creator-onboarding-tool
[The Map Configuration ID]: #the-map-configuration-id
[tileset]: creator-indoor-maps.md#tilesets
[Use the Azure Maps Indoor Maps module]: how-to-use-indoor-module.md
[What is Azure Maps Creator?]: about-creator.md
