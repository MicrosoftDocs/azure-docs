---
title: Release notes for Microsoft Azure Data Manager for Agriculture Preview
description: This article provides release notes for Azure Data Manager for Agriculture Preview releases, improvements, bug fixes, and known issues. 
author: gourdsay 
ms.author: angour 
ms.service: data-manager-for-agri 
ms.topic: conceptual 
ms.date: 11/16/2023 
ms.custom: template-concept 
---

# Release notes for Azure Data Manager for Agriculture Preview 

Azure Data Manager for Agriculture Preview is updated on an ongoing basis. To keep you informed about recent developments, this article provides information about:

- The latest releases
- Known issues
- Bug fixes
- Deprecated functionality
- Plans for changes

[!INCLUDE [public-preview-notice.md](includes/public-preview-notice.md)]

## March 2024

### Copilot templates for agriculture

Copilot templates for agriculture enable seamless retrieval of data stored in Azure Data Manager for Agriculture and customers' own data. Many customers have proprietary data outside Azure Data Manager for Agriculture; for example, agronomy PDFs or market price data. Such customers can benefit from an orchestration framework that allows for plugins, embedded data structures, and subprocesses to be selected as part of the query flow.

Although Azure Data Manager for Agriculture isn't required to operationalize copilot templates for agriculture, it enables customers to more easily integrate generative AI scenarios for their users. Learn more in [Generative AI in Azure Data Manager for Agriculture](concepts-llm-apis.md).

## November 2023

### Generative AI capability

The generative AI capability in Azure Data Manager for Agriculture enables seamless selection of APIs mapped to farm operations. This support enables use cases that are based on tillage, planting, applications, and harvesting types of farm operations.

Plugins in the generative AI capability allow for a combination of results, calculation of area, ranking, and summarizing to help serve customer prompts. These capabilities enable customers and partners to build their own agriculture copilots that deliver insights to farmers. Learn more in [Generative AI in Azure Data Manager for Agriculture](concepts-llm-apis.md).

### Imagery enhancements

We improved the satellite ingestion capability. The improvements include:

- Search caching.
- Pixel source control to a single tile by specifying the item ID.
- Improvements to the reprojection method to more accurately reflect on-the-ground dimensions across the globe.
- Nomenclature adaptations to better converge with standards.

These improvements might require changes in how you consume services to ensure continuity. You can find more details on the satellite service and these changes in [Ingest satellite imagery in Azure Data Manager for Agriculture](concepts-ingest-satellite-imagery.md).

### Farm activity records

Listing of activities by party ID and by activity ID is consolidated into a more powerful, common search endpoint. Read more in [Work with farm activities and activity data in Azure Data Manager for Agriculture](how-to-ingest-and-egress-farm-operations-data.md).

## October 2023

### Enhancement of the Azure portal experience

We released a new user-friendly experience to install independent software vendor (ISV) solutions that are available for Azure Data Manager for Agriculture. You can now go to your Azure Data Manager for Agriculture instance on the Azure portal, view available solutions, and install them in a seamless experience.

Currently, the available ISV solutions are from Bayer AgPowered Services. You can view the listing in [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps?search=bayer&page=1). You can learn more about installing ISV solutions in [Work with an ISV solution](how-to-set-up-isv-solution.md).

## July 2023

### Weather API update

We deprecated the old weather APIs from API version 2023-07-01. We replaced them with simple yet powerful provider-agnostic weather APIs. See the [API documentation](/rest/api/data-manager-for-agri/#weather).

### New farm operations connector

We added support for Climate FieldView as a built-in data source. You can now automatically sync planting, application, and harvest activity files from FieldView accounts directly into Azure Data Manager for Agriculture. Learn more about this capability in [Work with farm activities data in Azure Data Manager for Agriculture](concepts-farm-operations-data.md).

### Geospatial support in the data model

We updated our data model to improve flexibility. The boundary object is deprecated in favor of a geometry property that's now supported in nearly all data objects. This change brings consistency to how space is handled across hierarchy, activity, and observation themes. It allows for more flexible integration when you're ingesting data from a provider that has strict hierarchy requirements.

You can now sync data that might not perfectly align with an existing hierarchy definition and resolve the conflicts with spatial overlap queries. Learn more in [Hierarchy model in Azure Data Manager for Agriculture](concepts-hierarchy-model.md).

## June 2023

### Use your license keys via key vault

Azure Data Manager for Agriculture supports a range of data ingress connectors. These connections require customer keys in a bring your own license (BYOL) model. You can use your license keys safely by storing your secrets in a key vault, enabling system identity, and providing read access to Azure Data Manager for Agriculture. Details are available in [Store and use your own license keys in Azure Data Manager for Agriculture](concepts-byol-and-credentials.md).

### Sensor integration as both partner and customer

You can start pushing data from your own sensors into Azure Data Manager for Agriculture. This capability useful if your sensor provider doesn't want to take steps to onboard its sensors or if you don't have such support from your sensor provider. Details are available in [Sensor integration as both partner and customer in Azure Data Manager for Agriculture](how-to-set-up-sensor-as-customer-and-partner.md).

## May 2023

### API throttling

Azure Data Manager for Agriculture implements API throttling to help ensure consistent performance by limiting the number of requests within a specified time frame. Throttling prevents resource overuse and maintains optimal performance and reliability for all customers. Details are available in [API throttling guidance for Azure Data Manager for Agriculture](concepts-understanding-throttling.md).

## April 2023

### Audit logs

In Azure Data Manager for Agriculture Preview, you can monitor how and when your resources are accessed, and by whom. You can also debug reasons for failure of data-plane requests. [Audit logs](how-to-set-up-audit-logs.md) are now available for your use.  

### Private links

You can connect to Azure Data Manager for Agriculture Preview from your virtual network via a private endpoint. You can then limit access to your Azure Data Manager for Agriculture instance over these private IP addresses. [Private links](how-to-set-up-private-links.md) are now available for your use.  

### BYOL for satellite imagery

To support scalable ingestion of geometry-clipped imagery, we partnered with Sentinel Hub by Sinergise to provide a seamless BYOL experience. Read more about the satellite connector in [Ingest satellite imagery in Azure Data Manager for Agriculture](concepts-ingest-satellite-imagery.md).

## March 2023

### Key announcement: Preview release

Azure Data Manager for Agriculture is now available in preview. See the [blog post](https://azure.microsoft.com/blog/announcing-microsoft-azure-data-manager-for-agriculture-accelerating-innovation-across-the-agriculture-value-chain/).

## Next steps

- [Learn about the hierarchy model and how to create and organize your agriculture data](./concepts-hierarchy-model.md)
- [Test the Azure Data Manager for Agriculture REST APIs](/rest/api/data-manager-for-agri)
