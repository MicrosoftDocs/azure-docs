---
title: How to create a dataset using a GeoJson package
description: Learn how to create a dataset using a GeoJson package embedding the module's JavaScript libraries.
author: stevemunk
ms.author: v-munksteve
ms.date: 10/31/2021
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Create a Dataset using a GeoJson package (Preview)

Azure Maps Creator enables users to import their indoor map data in GeoJSON format with Facility-2.0 ontology, which can then be used to create a dataset.

## Prerequisites

- Basic understanding of [Creator for indoor maps](creator-indoor-maps.md)
- [Azure Maps account][Azure Maps account]
- [Azure Maps Creator resource][Creator resource]
- [Subscription key][Subscription key]
- Zip package containing all required GeoJSON files. If you don't have GeoJSON
  files, you can download the [Contoso building sample][Contoso building sample].

### Geojson Zip Package requirements

The zip package must contain all the GeoJSON files in the root directory. The name of each file should be {featureClassName}.geojson. For more information, see [Hierarchical spatial validations](#hierarchical-spatial-validations).

The GeoJSON files must follow the facility ontology 2.0, as defined in the [Facility Ontology][Facility Ontology] article.

>[!IMPORTANT]
>
> - This article uses the `us.atlas.microsoft.com` geographical URL. If your Creator service wasn't created in the United States, you must use a different geographical URL.  For more information, see [Access to Creator Services](how-to-manage-creator.md#access-to-creator-services).
> - In the URL examples in this article you will need to replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key.

## Create Dataset using the GeoJSON package

### Upload the GeoJSON package

Use the [Data Upload API](/rest/api/maps/data-v2/upload) to upload the Drawing package to Azure Maps Creator account.

The Data Upload API is a long running transaction that implements the pattern defined in [Creator Long-Running Operation API V2](creator-long-running-operation-v2.md).

To upload the GeoJSON package:

1. Execute the following HTTP POST request that uses the [Data Upload API](/rest/api/maps/data-v2/upload):

    ```http
    https://us.atlas.microsoft.com/mapData?api-version=2.0&dataFormat=zip&subscription-key={Your-Azure-Maps-Primary-Subscription-key}
    ```

    1. Set `Content-Type` in the **Header** to `application/zip`.

1. Copy the value of the `Operation-Location` key in the response header. The `Operation-Location` key is also known as the `status URL` and is required to check the status of the upload, which is explained in the next section.

### Check the GeoJSON package upload status

To check the status of the GeoJSON package and retrieve its unique identifier (`udid`):

1. Execute the following HTTP GET request that uses the status URL you copied as the last step in the previous section of this article. The request should look like the following URL:

```http
https://us.atlas.microsoft.com/mapData/operations/{operationId}?api-version=2.0&subscription-key={Your-Azure-Maps-Primary-Subscription-key}
```

1. Copy the value of the `Resource-Location` key in the response header, which is the `resource location URL`. The `resource location URL` contains the unique identifier (`udid`) of the GeoJSON package resource.

### Create a dataset

A dataset is a collection of map features, such as buildings, levels, and rooms. To create a dataset from your GeoJSON, use the new [Dataset Create API][Dataset Create 2022-09-01-preview]. The Dataset Create API takes the `udid` you got in the previous section and returns the `datasetId` of the new dataset. This is different from the [previous version][Dataset Create] in that it doesn't require a `conversionId` from a converted Drawing package.

To create a dataset:

1. Enter the following URL to the [Dataset service][Dataset Create 2022-09-01-preview]. The request should look like the following URL (replace {udid} with the `udid` obtained in [Check the GeoJSON package upload status](#check-the-geojson-package-upload-status) section):

    ```http
    https://us.atlas.microsoft.com/datasets?api-version=2022-09-01-preview&udid={udid}&subscription-key={Your-Azure-Maps-Primary-Subscription-key}
    ```

1. Copy the value of the `Operation-Location` key in the response header. The `Operation-Location` key is also known as the `status URL` and is required to check the status of the dataset creation process and to get the `datasetId`, which is required to create a tileset.

### Check the dataset creation status

To check the status of the dataset creation process and retrieve the `datasetId`:

1. Enter the status URL you copied in [Create a dataset](#create-a-dataset). The request should look like the following URL:

    ```http
    https://us.atlas.microsoft.com/datasets/operations/{operationId}?api-version=2022-09-01-preview&subscription-key={Your-Azure-Maps-Primary-Subscription-key}
    ```

1. In the Header of the HTTP response, copy the value of the unique identifier contained in the `Resource-Location` key.

    > https://us.atlas.microsoft.com/datasets/**c9c15957-646c-13f2-611a-1ea7adc75174**?api-version=2022-09-01-preview

### Create a tileset

A tileset is a set of vector tiles that render on the map. Tilesets are created from existing datasets. However, a tileset is independent from the dataset from which it was sourced. If the dataset is deleted, the tileset continues to exist.

To create a tileset:

1. Enter the following URL to the [Tileset][tileset] service. The request should look like the following URL (replace {datasetId} with the datasetId obtained in the [Check the dataset creation status](#check-the-dataset-creation-status) section above:

```http
https://us.atlas.microsoft.com/tilesets?api-version=2022-09-01-preview&datasetID={datasetId}&subscription-key={Your-Azure-Maps-Primary-Subscription-key}
```

## Add data to an existing dataset

Data can be added to an existing dataset by providing the `datasetId` parameter to the [dataset create API][Dataset Create 2022-09-01-preview] along with the unique identifier of the data you wish to add. This creates a new dataset consisting of the data from both the existing dataset and the new data being imported. Once the new dataset has been created successfully, the old dataset can be deleted.

1. In this append scenario, the ontology of the source dataset is taken to create the new dataset.  

2. The original dataset drives the way feature IDs are created. If the original dataset was created using a `udid`, it uses the IDs from the GeoJSON, and will continue to do so with all GeoJSON packages appended to that dataset in the future.  If the dataset was created using a `conversionId`, IDs will be internally generated, and will continue to be internally generated with all GeoJSON packages appended to that dataset in the future.

3. The new data source should be complete. Partial source data isn't supported.

## The GeoJSON zip package

The GeoJSON zip package consists of one or more [RFC 7946][RFC 7946] compliant GeoJSON files, one for each feature class, all in the root directory (subdirectories aren't supported), compressed with standard Zip compression and named using the `.ZIP` file extension. Each feature class file must match its definition in the [Facility ontology 2.0][Facility ontology] and each feature must have a globally unique identifier. Feature IDs can only contain alpha-numeric (a-z, A-Z, 0-9), hyphen (-), dot (.) and underscore (_) characters.

<!--
1. The contents of each feature class file must match its definition in the [Facility-2.0 ontology][Facility-2.0 ontology].
2. All files in the packages must be in the root directory. No sub-directories are not supported.
3. Every feature class should be represented by a separate file.
4. The package can’t have more files than the features classes in the ontology.
5. No other extension is supported.
6. The data should be RFC 7946: The GeoJSON Format (rfc-editor.org) complaint.
7. Feature IDs in these feature classes should be globally unique. Not just in a feature class.
8. Referential integrity of the features should be maintained.
9. Feature ID can only contain alpha-numeric (a-z, A-Z, 0-9), hyphen (-), dot (.) and underscore (_) characters)
10. <<Please take other validations we have in place from this doc : Facility2-DatasetValidations.docx>>
-->

### Facility ontology 2.0 validations in the Dataset

[Facility ontology][Facility ontology] defines how Azure Maps Creator internally stores facility data, divided into feature classes, in a Creator dataset. When importing a GeoJSON package, anytime a feature is added or modified, a series of validations run. This includes referential integrity checks, geometry validations & null checks. These validations are described in more detail below.

#### Facility Area Check

The facility area can be between 4 and 4,000 Sq Km.

#### Hierarchical spatial validations

- The top level element is [facility][facility], which defines each building in the file *facility.geojson*.
- Each facility has one or more levels, which are defined in the file *levels.goejson*.
  - Each level must be inside the facility.
- Each [level][level] contain [units][unit], [structures][structure], [verticalPenetrations][verticalPenetration] and [openings][opening]. All of the items defined in the level must be fully contained within the Level geometry.
  - `unit` can consist of an array of items such as hallways, offices and courtyards, which are defined by [area][areaElement], [line][lineElement] or [point][pointElement] elements. Units are defined in the file *unit.goejson*.
          - All `unit` elements must be fully contained within their level and intersect with their respective units.
  - `structure` defines physical, non-overlapping areas that can't be navigated through. Structures are defined in the file *structure.goejson*.
  - `verticalPenetration` represents a method of navigating vertically between levels, such as stairs and elevators and are defined in the file *verticalPenetration.geojson*.
    - verticalPenetrations can't intersect with other verticalPenetrations.
  - `openings` define traversable boundaries between two units, or a `unit` and `verticalPenetration` and are defined in the file *opening.geojson*.
    - Openings can't intersect with other openings.
    - Every `opening` must be associated with at least one `verticalPenetration` or `unit`.

## Next steps

To learn how to do some other cool stuff...

> [!div class="nextstepaction"]
> [cool stuff item #1](tutorial-creator-wfs.md)

> [!div class="nextstepaction"]
> *optional* [cool stuff item #2](how-to-create-custom-styles.md)

[unit]: creator-facility-ontology.md?pivots=facility-ontology-v2#unit
[structure]: creator-facility-ontology.md?pivots=facility-ontology-v2#structure
[level]: creator-facility-ontology.md?pivots=facility-ontology-v2#level
[facility]: creator-facility-ontology.md?pivots=facility-ontology-v2#facility
[verticalPenetration]: creator-facility-ontology.md?pivots=facility-ontology-v2#verticalPenetration
[opening]: creator-facility-ontology.md?pivots=facility-ontology-v2#opening

[areaElement]: creator-facility-ontology.md?pivots=facility-ontology-v2#area
[lineElement]: creator-facility-ontology.md?pivots=facility-ontology-v2#line
[pointElement]: creator-facility-ontology.md?pivots=facility-ontology-v2#point

[tileset]: /rest/api/maps/v2/tileset
[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Creator resource]: how-to-manage-creator.md
[Subscription key]: quick-demo-map-app.md#get-the-primary-key-for-your-account
[Facility Ontology]: creator-facility-ontology.md
[Facility ontology]: creator-facility-ontology.md?pivots=facility-ontology-v2

[RFC 7946]: https://www.rfc-editor.org/rfc/rfc7946.html
[Dataset Create 2022-09-01-preview]: https://review.learn.microsoft.com/en-us/rest/api/documentation-preview/dataset/create?view=azure-rest-preview&branch=result_openapiHub_production_acba443a6973&tabs=HTTP
[Dataset Create]: /rest/api/maps/v2/dataset/create

[Contoso building sample]: https://microsoft.sharepoint.com/teams/Azure-Maps/Shared%20Documents/Forms/AllItems.aspx?id=%2Fteams%2FAzure%2DMaps%2FShared%20Documents%2FAzure%20Maps%20Creator%2FAPI%2FDataset%2FSample%20Datasets%2FsampleContosoGeoJSON%2Ezip&parent=%2Fteams%2FAzure%2DMaps%2FShared%20Documents%2FAzure%20Maps%20Creator%2FAPI%2FDataset%2FSample%20Datasets&p=true&ga=1
