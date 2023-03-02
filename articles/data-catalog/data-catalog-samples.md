---
title: Azure Data Catalog developer samples
description: This article provides an overview of the available developer samples for the Data Catalog REST API.
ms.service: data-catalog
ms.topic: conceptual
ms.date: 12/14/2022
---
# Azure Data Catalog developer samples

[!INCLUDE [Microsoft Purview redirect](includes/catalog-to-purview-migration-flag.md)]

Get started developing Azure Data Catalog apps using the Data Catalog REST API. The Data Catalog REST API is a REST-based API that provides programmatic access to Data Catalog resources to register, annotate, and search data assets programmatically.

## Samples available on GitHub.com

* [Get started with Azure Data Catalog](https://github.com/Azure-Samples/data-catalog-dotnet-get-started/)
  
   The get started sample shows you how to authenticate with Azure AD to Register, Search, and Delete a data asset using the Data Catalog REST API.

* [Get started with Azure Data Catalog using Service Principal](https://github.com/Azure-Samples/data-catalog-dotnet-service-principal-get-started/)

   This sample shows you how to register, search, and delete a data asset using the Data Catalog REST API. This sample uses the Service Principal authentication.

* [Import/Export tool for Azure Data Catalog](https://github.com/Azure-Samples/data-catalog-dotnet-import-export/)

   This sample that shows how to use the Data Catalog REST API to fetch assets from the Azure Data Catalog and serialize them into a file. It also demonstrates how to take a set of assets serialized as JSON and push them into the catalog. It supports exporting a subset of the catalog using a search query.

* [Bulk register and annotate in Azure Data Catalog](https://github.com/Azure-Samples/data-catalog-dotnet-excel-register-data-assets/)
  
   This sample that shows you how to bulk register data assets from an Excel workbook using Data Catalog REST API and Open XML.
  
* [Bulk import glossary terms into Azure Data Catalog](https://github.com/Azure-Samples/data-catalog-bulk-import-glossary/)

   This sample shows you how to import glossary terms from CSV files to ADC glossary.

* [Bulk import relationships into Azure Data Catalog](https://github.com/Azure-Samples/data-catalog-bulk-import-relationship/)

   This sample shows you how to programmatically import relationship information from a CSV file into a data catalog.

* [Publish relationships into Azure Data Catalog](https://github.com/Azure-Samples/data-catalog-dotnet-publish-relationships/)

   This sample shows you how can programmatically publish relationship information to a data catalog.

## Next steps

[Azure Data Catalog REST API reference](/rest/api/datacatalog/)
