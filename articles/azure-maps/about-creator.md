---
title: Overview for Microsoft Azure Maps Creator
titleSuffix: Microsoft Azure Maps Creator
description: Learn about services and capabilities in Microsoft Azure Maps Creator and how to use them in your applications.
author: brendansco
ms.author: Brendanc
ms.date: 07/21/2023
ms.topic: overview
ms.service: azure-maps
services: azure-maps
---

# What is Azure Maps Creator?

Azure Maps Creator is a geospatial platform that enables you to create
and render maps, based on indoor map data, on top of the outdoor map in
your web and mobile applications. Being an Azure service provides the
core infrastructure that enables you to focus on developing your
application rather than worrying about data storage, security, and
scaling.

## Services in Azure Maps Creator

Creator is the Azure Maps tool for managing your geospatial data and
designing custom map styles for indoor maps. Use Creator to build and
design indoor maps to your exact specifications by uploading and editing
your own data, utilizing tilesets and creating custom styles. You can
also provide directions within your indoor map using wayfinding and even
monitor the state of any IoT enabled equipment within your facility.

### Conversion

An [onboarding tool] is provided to prepare your facility's DWGs by
identifying the data to use and positioning your building on the map.
The conversion service will then convert the geometry and data from
your DWG files into a digital indoor map.

The first step in creating your indoor map is to upload a drawing
package into your Azure Maps account. A drawing package contains one or
more CAD (computer-aided design) drawings of your facility along with a
manifest describing the drawings. The drawings define the elements of
the facility while the manifest tells the Azure Maps [Conversion service]
how to read the facility drawing files and metadata. For more
information about manifest properties, see [Manifest file requirements]
and for more information on creating and uploading a drawing package,
see the [Drawing package guide].

### Dataset

A collection of the indoor map [features] of a facility. Update your facility dataset
through a visual editor and query for features real time using the [Feature State]
service. For more information, see [Work with datasets using the QGIS plugin].

> [!TIP]
> You can search for features in a dataset using the [Features API].

### Rendering

[Tilesets],created from your data, are used to render maps on mobile devices
or in the browser.

### Styling

Customize the visual appearance of a map using [custom styling].
A style is a JSON document that defines the visual appearance of a map.
When you define how your data should be styled in the [visual style editor], this
information is stored in a JSON document that conforms to the [Mapbox Style Specification].

### Wayfinding

[Wayfinding] provides your customers with the shortest path between two points within
a facility using the [Wayfinding service].

### SDK

Use the Azure Maps Web SDK to develop applications that provide a
customized indoor map experience.

## The indoor maps workflow

This section provides a high-level overview of the indoor map creation
workflow.

1. **Create**. You first must create a drawing package containing one or more CAD
    (computer-aided design) drawings of your facility along with a [manifest]
    describing the drawings. You can use the [Azure Maps Creator onboarding tool] to
    create new and edit existing [manifest files].

1. **Upload**. Upload your drawing packages into your Azure Maps
    account. Upload drawing packages using the [Data Upload API].

1. **Convert**. Once the drawing package is uploaded into your Azure Maps account,
    use the [Conversion service] to validate the data in the uploaded drawing
    package and convert it into map data.

1. **Dataset**. Create a [dataset] from the map data. A dataset is collection
    of indoor map [features] that are stored in your Azure Maps account.
    For more information, see [Work with datasets using the QGIS plugin].

1. **Tileset**. Converting your data into a [tileset] allows
    you to add it to an Azure Maps map and apply custom styling.

1. **Styles**. Styles drive the visual appearance of spatial features on the map.
    When creating a tileset, default styles are automatically associated with the
    features it contains. These default styles can be modified to suit your needs
    using the [visual style editor]. For more information, see
    [Create custom styles for indoor maps].

1. **Dynamic styling**. Apply styles that are based on dynamic indoor map properties.
    For example, you can render facility meeting rooms with different colors, depending
    on occupancy status. For more information, see [Feature statesets].

1. **Wayfinding**. Provide your customers with the shortest path between two points
    within a facility. For more information, see [Wayfinding].

## Azure Maps Creator documentation

### ![](./media/creator-indoor-maps/about-creator/Concepts.png) Concepts

- [Indoor map concepts]

### ![](./media/creator-indoor-maps/about-creator/tutorials.png) Tutorials

- [Use Azure Maps Creator to create indoor maps]

### ![](./media/creator-indoor-maps/about-creator/how-to-guides.png) How-to guides

- [Manage Creator]
- [Implement Dynamic styling for indoor maps]
- [Query datasets with WFS API]
- [Custom styling for indoor maps]
- [Indoor maps wayfinding service]
- [Edit indoor maps using the QGIS plugin]
- [Create dataset using GeoJson package]
- [Create a feature stateset]

### ![](./media/creator-indoor-maps/about-creator/reference.png) Reference

- [Drawing package requirements]
- [Facility Ontology]
- [Dynamic maps StylesObject]
- [Drawing error visualizer]
- [Azure Maps Creator REST API]

[Azure Maps Creator onboarding tool]: https://azure.github.io/azure-maps-creator-onboarding-tool
[Azure Maps Creator REST API]: /rest/api/maps-creator
[Conversion service]: /rest/api/maps/v2/conversion
[Create a feature stateset]: how-to-creator-feature-stateset.md
[Create custom styles for indoor maps]: how-to-create-custom-styles.md
[Create dataset using GeoJson package]: how-to-dataset-geojson.md
[Custom styling for indoor maps]: how-to-create-custom-styles.md
[custom styling]: creator-indoor-maps#custom-styling-preview
[Data Upload API]: /rest/api/maps/data-v2/upload
[dataset]: creator-indoor-maps.md#datasets
[Drawing error visualizer]: drawing-error-visualizer.md
[Drawing package guide]: drawing-package-guide.md?pivots=drawing-package-v2
[Drawing package requirements]: drawing-requirements.md
[Dynamic maps StylesObject]: schema-stateset-stylesobject.md
[Edit indoor maps using the QGIS plugin]: creator-qgis-plugin.md
[Facility Ontology]: creator-facility-ontology.md
[Feature State]: /rest/api/maps/v2/feature-state
[Feature statesets]: creator-indoor-maps.md#feature-statesets
[Features API]: /rest/api/maps/2023-03-01-preview/features
[features]: glossary.md#feature
[Implement Dynamic styling for indoor maps]: indoor-map-dynamic-styling.md
[Indoor map concepts]: creator-indoor-maps.md
[Indoor maps wayfinding service]: how-to-creator-wayfinding.md
[Manage Creator]: how-to-manage-creator.md
[Manifest file requirements]: drawing-requirements.md#manifest-file-requirements-1
[manifest files]: drawing-requirements.md#manifest-file-1
[manifest]: drawing-requirements.md#manifest-file-requirements
[Mapbox Style Specification]: https://docs.mapbox.com/mapbox-gl-js/style-spec
[onboarding tool]: https://azure.github.io/azure-maps-creator-onboarding-tool
[Query datasets with WFS API]: how-to-creator-wfs.md
[tileset]: creator-indoor-maps.md#tilesets
[Tilesets]: creator-indoor-maps.md#tilesets
[Use Azure Maps Creator to create indoor maps]: tutorial-creator-indoor-maps.md
[visual style editor]: https://azure.github.io/Azure-Maps-Style-Editor
[Wayfinding service]: /rest/api/maps/2023-03-01-preview/wayfinding
[Wayfinding]: creator-indoor-maps.md#wayfinding-preview
[Work with datasets using the QGIS plugin]: creator-qgis-plugin.md