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

- A drawing package. For more information, see [Drawing package requirements].

> [!NOTE]
> The drawing package used in this article is the [Sample - Contoso Drawing Package].

## Get started

The following steps demonstrate how to create an indoor map in your Azure Maps account using the [Azure Maps Creator onboarding tool] that can be referenced in your applications using its `MapConfigurationId` property. The `MapConfigurationId` property is created during this onboarding process.

1. Import the drawing package into your Azure Maps account using the [Azure Maps Creator onboarding tool].

    :::image type="content" source="./media/creator-indoor-maps/onboarding-tool/create-manifest.png" alt-text="Screenshot showing the process file screen of the Azure Maps Creator onboarding tool.":::

    > [!IMPORTANT]
    > If your drawing package doesn't contain a manifest, use the [Azure Maps Creator onboarding tool] to create one. For more information, see [The Azure Maps Creator onboarding tool] instructions.

1. Once your drawing package has been processed, select the **Review + Create** tab, then the **Create + Download** button. Selecting the **Create + Download** button begins the process of creating the indoor maps.

    :::image type="content" source="./media/creator-indoor-maps/onboarding-tool/select-review-create.png" alt-text="Screenshot showing the package upload screen of the Azure Maps Creator onboarding tool.":::

1. The first step in this process uploads the package into the Azure Maps account.

    :::image type="content" source="./media/creator-indoor-maps/onboarding-tool/package-upload.png" alt-text="Screenshot showing the package upload screen of the Azure Maps Creator onboarding tool.":::

1. Once the package is uploaded, the onboarding tool converts the geometry and data from drawing package into a digital indoor map.

    :::image type="content" source="./media/creator-indoor-maps/onboarding-tool/package-conversion.png" alt-text="Screenshot showing the package upload screen of the Azure Maps Creator onboarding tool.":::

1. The next step in the process is to create the dataset. Datasets contain a collection of [features] contained in the facility.

    :::image type="content" source="./media/creator-indoor-maps/onboarding-tool/dataset-creation.png" alt-text="Screenshot showing the dataset-creation screen of the Azure Maps Creator onboarding tool.":::

1. The dataset is used to create a tileset. tilesets are a lightwieght storage format used by Azure Maps when rendering map data.

    :::image type="content" source="./media/creator-indoor-maps/onboarding-tool/tileset-creation.png" alt-text="Screenshot showing the tileset creation screen of the Azure Maps Creator onboarding tool.":::

    > [!IMPORTANT]
    > The `MapConfigurationId` is created as a part of the tileset creation process and is required to reference the indoor map in your applications. Make sure to make a copy of it for future reference.

1. The indoor map is created and displayed in the onbording tool as a preview of how it will appear in ther application.

     :::image type="content" source="./media/creator-indoor-maps/onboarding-tool/map.png" alt-text="Screenshot showing the map screen of the Azure Maps Creator onboarding tool.":::

Your indoor map is created and stored in your Azure Maps account and is now ready to be used in your applications. You will reference this indoor map using the `MapConfigurationId` created as a part of the tileset creation process in step 6.

## Next steps

Intigrate the indoor map into your applications using the Web SDK.

> [!div class="nextstepaction"]
> [Use the Azure Maps Indoor Maps module]

[Azure Maps Creator onboarding tool]: https://azure.github.io/azure-maps-creator-onboarding-tool
[Drawing package requirements]: drawing-requirements.md?pivots=drawing-package-v2
[features]: glossary.md#feature
[Sample - Contoso Drawing Package]: https://github.com/Azure-Samples/am-creator-indoor-data-examples/blob/master/Drawing%20Package%202.0/Sample%20-%20Contoso%20Drawing%20Package.zip
[The Azure Maps Creator onboarding tool]: drawing-package-guide.md?pivots=drawing-package-v2#the-azure-maps-creator-onboarding-tool
[Use the Azure Maps Indoor Maps module]: how-to-use-indoor-module.md
