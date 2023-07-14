---
title: Working with farm operations data in Azure Data Manager for Agriculture
description: Learn how to integrate with farm operations data providers and ingest data into ADMA 
author: lbpudi
ms.author: lbethapudi
ms.service: data-manager-for-agri
ms.topic: conceptual
ms.date: 07/14/2023
ms.custom: template-concept
---
# Working with farm operations data in Azure Data Manager for Agriculture
Farm operations data is one of the most important ground truth datasets in Agronomy. Users can choose to push this data into Azure Data Manager for Agriculture using APIs OR choose to fetch them from farm equipment manufacturers like Climate FieldView. 
[!INCLUDE [public-preview-notice.md](includes/public-preview-notice.md)]
## Azure Data Manager for Agriculture supports the following types of farm Operations data:
* **Planting Data** - Refer [this] (/rest/api/data-manager-for-agri/dataplane-version2023-07-01-preview/planting-data/create-or-update) API to know more on adding/creating planting data.
* **Application Data** - Refer [this](/rest/api/data-manager-for-agri/dataplane-version2023-07-01-preview/application-data/create-or-update) API to know more on adding/creating application data.
* **Harvest Data** - Refer [this](/rest/api/data-manager-for-agri/dataplane-version2023-07-01-preview/harvest-data/create-or-update) API to know more on adding/creating harvest data.

### Supported farm management data

As part of farm operations data ingestion job created to pull data from farm equipment providers, Azure Data Manager for Agriculture may also be ingesting farm management data associated with the end user (party) on farm equipment provider's side.

## Integration with farm equipment manufacturers
Azure Data Manager for Agriculture provides first class integration with farm equipment providers like Climate FieldView. Users can fetch farm operations data from farm equipment provider to Azure Data Manager for Agriculture directly. Look [here](./how-to-integrate-with-farm-ops-data-provider.md) for more details.

## Data Ingestion Job
Azure Data Manager for Agriculture fetches the farm hierarchy & associated farm operations data (planting, application, tillage & harvest) from the data provider (Ex: Climate FieldView) by creating a farm operations data ingestion job. Look [here](./how-to-ingest-and-egress-farm%20operations%20data.md) for more details.
