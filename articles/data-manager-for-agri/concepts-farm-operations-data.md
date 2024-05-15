---
title: Work with farm activities data in Azure Data Manager for Agriculture
description: Learn how to integrate with data providers for farm activities and ingest data into Azure Data Manager for Agriculture. 
author: lbpudi
ms.author: lbethapudi
ms.service: data-manager-for-agri
ms.topic: conceptual
ms.date: 08/14/2023
ms.custom: template-concept
---
# Work with farm activities data in Azure Data Manager for Agriculture

Data about farm activities is one of the most important ground-truth datasets in precision agriculture. These machine-generated reports preserve the record of exactly what happened and when. That record can help improve in-field practice and the downstream value-chain analytics.

Azure Data Manager for Agriculture supports both:

* **Summary data**: Entered as properties directly in the operation data item.
* **Precision data**: Uploaded as an attachment file (for example, .shp, .dat, or .isoxml) and reference linked to the operation data item.

New operation data can be pushed into the service via the APIs for operation and attachment creation. Or, if the desired source is in the supported list of original equipment manufacturer (OEM) connectors, data can be synced automatically from providers like Climate FieldView with an ingestion job for farm operations.

[!INCLUDE [public-preview-notice.md](includes/public-preview-notice.md)]

Azure Data Manager for Agriculture supports a range of data about farm activities. For more information, see [What is Azure Data Manager for Agriculture?](/rest/api/data-manager-for-agri).

## Integration with manufacturers of farm equipment

Azure Data Manager for Agriculture fetches the associated data about farm activities (planting, application, tillage, and harvest) from the data provider (for example, Climate FieldView) by creating a data ingestion job for farm activities. For more information, see [Working with farm activities and activity data in Azure Data Manager for Agriculture](./how-to-ingest-and-egress-farm-operations-data.md).

## Next steps

* [Test the Azure Data Manager for Agriculture REST APIs](/rest/api/data-manager-for-agri)
