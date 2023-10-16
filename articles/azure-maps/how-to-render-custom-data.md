---
title: Render custom data on a raster map in Microsoft Azure Maps
description: Learn how to add pushpins, labels, and geometric shapes to a raster map. See how to use the static image service in Azure Maps for this purpose.
author: eriklindeman
ms.author: eriklind
ms.date: 10/28/2021
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
ms.custom: mvc
---

# Render custom data on a raster map

This article describes how to use the [Get Map Static Image] command with image composition functionality. Image composition functionality supports the retrieval of static raster tiles that contain custom data.

The following are examples of custom data:

- Custom pushpins
- Labels
- Geometry overlays

> [!TIP]
> To show a simple map on a web page, it's often more cost effective to use the Azure Maps Web SDK, rather than to use the static image service. The web SDK uses map tiles; and unless the user pans and zooms the map, they will often generate only a fraction of a transaction per map load. The Azure Maps Web SDK has options for disabling panning and zooming. Also, the Azure Maps Web SDK provides a richer set of data visualization options than a static map web service does.  

## Prerequisites

- [Azure Maps account]
- [Subscription key]

This article uses the [Postman] application, but you may use a different API development environment.

>[!IMPORTANT]
> In the URL examples, replace `{Your-Azure-Maps-Subscription-key}` with your Azure Maps subscription key.

## Render pushpins with labels and a custom image

> [!NOTE]
> The procedure in this section requires an Azure Maps account in the Gen1 or Gen2 pricing tier.
The Azure Maps account Gen1 S0 pricing tier only supports a single instance of the [pins] parameter. It allows you to render up to five pushpins, specified in the URL request, with a custom image.
>
> **Azure Maps Gen1 pricing tier retirement**
>
> Gen1 pricing tier is now deprecated and will be retired on 9/15/26. Gen2 pricing tier replaces Gen1 (both S0 and S1) pricing tier. If your Azure Maps account has Gen1 pricing tier selected, you can switch to Gen2 pricing before it’s retired, otherwise it will automatically be updated. For more information, see [Manage the pricing tier of your Azure Maps account].

### Get static image with custom pins and labels

To get a static image with custom pins and labels:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *Get Map Static Image*.

4. Select the **GET** HTTP method.

5. Enter the following URL:

    ```HTTP
    https://atlas.microsoft.com/map/static/png?subscription-key={Your-Azure-Maps-Subscription-key}&api-version=2022-08-01&layer=basic&style=main&zoom=12&center=-73.98,%2040.77&pins=custom%7Cla15+50%7Cls12%7Clc003b61%7C%7C%27CentralPark%27-73.9657974+40.781971%7C%7Chttps%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2FAzureMapsCodeSamples%2Fmain%2FStatic%2Fimages%2Ficons%2Fylw-pushpin.png
    ```

6. Select **Send**.

7. The service returns the following image:

    :::image type="content" source="./media/how-to-render-custom-data/render-pins.png" alt-text="A custom pushpin with a label.":::

## Render a polygon with color and opacity

> [!NOTE]
> The procedure in this section requires an Azure Maps account Gen1 (S1) or Gen2 pricing tier.

You can modify the appearance of a polygon by using style modifiers with the [path] parameter.

To render a polygon with color and opacity:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *GET Polygon*.

4. Select the **GET** HTTP method.

5. Enter the following URL to the [Render] service:
  
    ```HTTP
    https://atlas.microsoft.com/map/static/png?api-version=2022-08-01&style=main&layer=basic&sku=S1&zoom=14&height=500&Width=500&center=-74.040701, 40.698666&path=lc0000FF|fc0000FF|lw3|la0.80|fa0.50||-74.03995513916016 40.70090237454063|-74.04082417488098 40.70028420372218|-74.04113531112671 40.70049568385827|-74.04298067092896 40.69899904076542|-74.04271245002747 40.69879568992435|-74.04367804527283 40.6980961582905|-74.04364585876465 40.698055487620714|-74.04368877410889 40.698022951066996|-74.04168248176573 40.696444909137|-74.03901100158691 40.69837271818651|-74.03824925422668 40.69837271818651|-74.03809905052185 40.69903971085914|-74.03771281242369 40.699340668780984|-74.03940796852112 40.70058515602143|-74.03948307037354 40.70052821920425|-74.03995513916016 40.70090237454063
    &subscription-key={Your-Azure-Maps-Subscription-key}
    ```

6. The service returns the following image:

    :::image type="content" source="./media/how-to-render-custom-data/opaque-polygon.png" alt-text="Render an opaque polygon.":::

## Render a circle and pushpins with custom labels

> [!NOTE]
> The procedure in this section requires an Azure Maps account Gen1 (S1) or Gen2 pricing tier.

You can modify the appearance of the pins by adding style modifiers. For example, to make pushpins and their labels larger or smaller, use the `sc` "scale style" modifier. This modifier takes a value that's greater than zero. A value of 1 is the standard scale. Values larger than 1 makes the pins larger, and values smaller than 1 makes them smaller. For more information about style modifiers, see the [Path] parameter of the [Get Map Static Image] command.

To render a circle and pushpins with custom labels:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *GET Polygon*.

4. Select the **GET** HTTP method.

5. Enter the following URL to the [Render] service:

    ```HTTP
    https://atlas.microsoft.com/map/static/png?api-version=2022-08-01&style=main&layer=basic&zoom=14&height=700&Width=700&center=-122.13230609893799,47.64599069048016&path=lcFF0000|lw2|la0.60|ra1000||-122.13230609893799 47.64599069048016&pins=default|la15+50|al0.66|lc003C62|co002D62||'Microsoft Corporate Headquarters'-122.14131832122801  47.64690503939462|'Microsoft Visitor Center'-122.136828 47.642224|'Microsoft Conference Center'-122.12552547454833 47.642940335653996|'Microsoft The Commons'-122.13687658309935  47.64452336193245&subscription-key={Your-Azure-Maps-Subscription-key}
    ```

6. Select **Send**.

7. The service returns the following image:

    :::image type="content" source="./media/how-to-render-custom-data/circle-custom-pins.png" alt-text="Render a circle with custom pushpins.":::

8. Next, change the color of the pushpins by modifying the `co` style modifier. If you look at the value of the `pins` parameter (`pins=default|la15+50|al0.66|lc003C62|co002D62|`), notice that the current color is `#002D62`. To change  the color to `#41d42a`, replace `#002D62` with `#41d42a`.  Now the `pins` parameter is `pins=default|la15+50|al0.66|lc003C62|co41D42A|`. The request  looks like the following URL:

    ```HTTP
    https://atlas.microsoft.com/map/static/png?api-version=2022-08-01&style=main&layer=basic&zoom=14&height=700&Width=700&center=-122.13230609893799,47.64599069048016&path=lcFF0000|lw2|la0.60|ra1000||-122.13230609893799 47.64599069048016&pins=default|la15+50|al0.66|lc003C62|co41D42A||'Microsoft Corporate Headquarters'-122.14131832122801  47.64690503939462|'Microsoft Visitor Center'-122.136828 47.642224|'Microsoft Conference Center'-122.12552547454833 47.642940335653996|'Microsoft The Commons'-122.13687658309935  47.64452336193245&subscription-key={Your-Azure-Maps-Subscription-key}
    ```

9. Select **Send**.

10. The service returns the following image:

    :::image type="content" source="./media/how-to-render-custom-data/circle-updated-pins.png" alt-text="Render a circle with updated pushpins.":::

Similarly, you can change, add, and remove other style modifiers.

## Next steps

> [!div class="nextstepaction"]
> [Render - Get Map Static Image]

[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Postman]: https://www.postman.com/
[Subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account

[Get Map Static Image]: /rest/api/maps/render-v2/get-map-static-image
[Manage the pricing tier of your Azure Maps account]: how-to-manage-pricing-tier.md
[path]: /rest/api/maps/render-v2/get-map-static-image#uri-parameters
[pins]: /rest/api/maps/render-v2/get-map-static-image#uri-parameters
[Render]: /rest/api/maps/render-v2/get-map-static-image
[Render - Get Map Static Image]: /rest/api/maps/render-v2/get-map-static-image
