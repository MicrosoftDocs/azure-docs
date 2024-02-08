---
title: Working with Farm Activities data in Azure Data Manager for Agriculture
description: Learn how to integrate with Farm Activities data providers and ingest data into ADMA 
author: lbpudi
ms.author: lbethapudi
ms.service: data-manager-for-agri
ms.topic: conceptual
ms.date: 08/14/2023
ms.custom: template-concept
---
# Working with Farm Activities data in Azure Data Manager for Agriculture
Farm Activities data is one of the most important ground truth datasets in precision agriculture. It's these machine-generated reports that preserve the record of what exactly happened where and when that is used to both improve in-field practice and the downstream values chain analytics cases

The Data Manager for Agriculture supports both
* summary data - entered as properties in the operation data item directly
* precision data - (for example, a .shp, .dat, .isoxml) uploaded as an attachment file and reference linked to the operation data item. 

New operation data can be pushed into the service via the APIs for operation and attachment creation. Or, if the desired source is in the supported list of OEM connectors, data can be synced automatically from providers like Climate FieldView with a farm operation ingestion job.
[!INCLUDE [public-preview-notice.md](includes/public-preview-notice.md)]
* Azure Data Manager for Agriculture supports a range of Farm Activities data that can be found [here](/rest/api/data-manager-for-agri/#farm-activities)

## Integration with farm equipment manufacturers
Azure Data Manager for Agriculture fetches the associated Farm Activities data (planting, application, tillage & harvest) from the data provider (Ex: Climate FieldView) by creating a Farm Activities data ingestion job. Look [here](./how-to-ingest-and-egress-farm-operations-data.md) for more details.

## Next steps

* Test our APIs [here](/rest/api/data-manager-for-agri).