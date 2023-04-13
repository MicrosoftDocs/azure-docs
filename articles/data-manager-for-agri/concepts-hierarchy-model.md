---
title: Hierarchy model in Azure Data Manager for Agriculture 
description: Provides information on the data model to organize your agriculture data. 
author: gourdsay
ms.author: angour
ms.service: data-manager-for-agri
ms.topic: conceptual
ms.date: 02/14/2023
ms.custom: template-concept
---

# Hierarchy model to organize agriculture related data

> [!NOTE]
> Microsoft Azure Data Manager for Agriculture is currently in preview. For legal terms that apply to features that are in beta, in preview, or otherwise not yet released into general availability, see the [**Supplemental Terms of Use for Microsoft Azure Previews**](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
> Microsoft Azure Data Manager for Agriculture requires registration and is available to only approved customers and partners during the preview period. To request access to Microsoft Data Manager for Agriculture during the preview period, use this [**form**](https://aka.ms/agridatamanager).

To generate actionable insights data related to growers, farms, and fields should be organized in a well defined manner. Firms operating in the agriculture industry often perform longitudinal studies and need high quality data to generate insights. Data Manager for Agriculture  organizes agronomic data in the below manner.

:::image type="content" source="./media/data-model.png" alt-text="Screenshot showing farm hierarchy model.":::

## Understanding farm hierarchy

### Party  
* Party is the owner and custodian of any data related to their farm. You could imagine Party to be the legal entity that is running the business.  
* The onus of defining the Party entity is with the customer setting up Data Manager for Agriculture. 

### Farm
* Farms are logical entities. A farm is a collection of fields. 
* Farms don't have any geometry associated with them. Farm entity helps you organize your growing operations. For example Contoso Inc is the Party that has farms in Oregon and Idaho.

### Field
* Fields denote a stable boundary that is in general agnostic to seasons and other temporal constructs. For example, field could be the boundary denoted in government records.
* Fields are multi-polygon. For example, a road might divide the farm in two or more parts.
* Fields are multi-boundary.

### Seasonal field
* This is the most important construct in the farming world. A seasonal fields definition includes the following things
     * Boundary
     * Season 
     * Crop
* A seasonal field is associated with a field or a farm
* In Data Manager for Agriculture, seasonal fields are mono crop entities. In cases where farmers are cultivating different crops simultaneously, they have to create one seasonal field per crop.
* A seasonal field is associated with one season. If a farmer cultivates across multiple seasons, they have to create one seasonal field per season.
* It's multi-polygon. Same crop can be planted in different areas within the farm.


### Boundary
* Boundary represents the geometry of a field or a seasonal field.
* It's represented as a multi-polygon GeoJSON consisting of vertices (lat/long).

### Season
* Season represents the temporal aspect of farming. It is a function of local agronomic practices, procedures and weather.

### Crop
* Crop entity provides the phenotypic details of the planted crop.

### Crop product
* Crop Product entity refers to the commercial variety (brand, product) of the planted seeds. A seasonal field can contain information about various varieties of seeds planted (belonging to the same crop).

## Next steps

* Test our APIs [here](/rest/api/data-manager-for-agri).