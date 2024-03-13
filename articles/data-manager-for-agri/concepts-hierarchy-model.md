---
title: Hierarchy model in Azure Data Manager for Agriculture 
description: Provides information on the data model to organize your agriculture data. 
author: gourdsay
ms.author: angour
ms.service: data-manager-for-agri
ms.topic: conceptual
ms.date: 08/22/2023
ms.custom: template-concept
---

# Hierarchy model to organize agriculture related data

[!INCLUDE [public-preview-notice.md](includes/public-preview-notice.md)]

To generate actionable insights data related to growers, farms, and fields should be organized in a well defined manner. Firms operating in the agriculture industry often perform longitudinal studies and need high quality data to generate insights. Data Manager for Agriculture  organizes agronomic data in the below manner.

:::image type="content" source="./media/data-model-v-2.png" alt-text="Screenshot showing farm hierarchy model.":::
:::image type="content" source="./media/management-zones.png" alt-text="Screenshot showing management zones.":::

## Understanding farm hierarchy

### Party  
* Party is the owner and custodian of any data related to their farm. You could imagine Party to be the legal entity that is running the business.  
* The onus of defining the Party entity is with the customer setting up Data Manager for Agriculture. 

### Farm
* Farms are logical entities. A farm is a collection of fields. 
* Farms don't have any geometry associated with them. Farm entity helps you organize your growing operations. For example, Contoso Inc is the Party that has farms in Oregon and Idaho.

### Field
* Fields denote a stable geometry that is in general agnostic to seasons and other temporal constructs. For example, field could be the geometry denoted in government records.
* Fields are multi-polygon. For example, a road might divide the farm in two or more parts.

### Seasonal field
* Seasonal field is the most important construct in the farming world. A seasonal fields definition includes the following things
     * geometry
     * Season 
     * Crop
* A seasonal field is associated with a field or a farm
* In Data Manager for Agriculture, seasonal fields are mono crop entities. In cases where farmers are cultivating different crops simultaneously, they have to create one seasonal field per crop.
* A seasonal field is associated with one season. If a farmer cultivates across multiple seasons, they have to create one seasonal field per season.
* It's multi-polygon. Same crop can be planted in different areas within the farm.

### Season
* Season represents the temporal aspect of farming. It's a function of local agronomic practices, procedures and weather.

### Crop
* Crop entity provides the phenotypic details of the planted crop.

### Crop product
* Crop Product entity refers to the commercial variety (brand, product) of the planted seeds. A seasonal field can contain information about various varieties of seeds planted (belonging to the same crop).

## Next steps

* Test our APIs [here](/rest/api/data-manager-for-agri).