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

# Release Notes for Azure Data Manager for Agriculture Preview 

Azure Data Manager for Agriculture Preview is updated on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes
- Deprecated functionality
- Plans for changes

 We provide information on latest releases, bug fixes, & deprecated functionality for Azure Data Manager for Agriculture Preview monthly.

[!INCLUDE [public-preview-notice.md](includes/public-preview-notice.md)]

## March 2024

### Copilot Templates for Agriculture
Our copilot templates for agriculture enable seamless retrieval of data stored in our data manager and customers own data. Many customers have proprietary data outside of our data manager, for example Agronomy PDFs, market price data etc. Such customers can benefit from our orchestration framework that allows for plugins, embedded data structures, and sub processes to be selected as part of the query flow. While Data Manager for Agriculture isn't required to operationalize copilot templates for agriculture, the data manager enables customers to more easily integrate generative AI scenarios for their users. Learn more about this [here](concepts-llm-apis.md).

## November 2023

### LLM capability
Our LLM capability enables seamless selection of APIs mapped to farm operations today. This enables use cases that are based on tillage, planting, applications, and harvesting type of farm operations. In the time to come we'll add the capability to select APIs mapped to soil sensors, weather, and imagery type of data. The skills in our LLM capability allow for a combination of results, calculation of area, ranking, summarizing to help serve customer prompts. These capabilities enable others to build their own agriculture copilots that deliver insights to farmers. Learn more about this [here](concepts-llm-apis.md).

### Imagery enhancements
We improved our satellite ingestion service. The improvements include:
- Search caching.
- Pixel source control to a single tile by specifying the item ID.
- Improved the reprojection method to more accurately reflect on the ground dimensions across the globe.
- Adapted nomenclature to better converge with standards. 

These improvements might require changes in how you consume services to ensure continuity. More details on the satellite service and these changes found [here](concepts-ingest-satellite-imagery.md).

### Farm activity records
Listing of activities by party ID and by activity ID is consolidated into a more powerful common search endpoint. Read more about [here](how-to-ingest-and-egress-farm-operations-data.md).

## October 2023

### Azure portal experience enhancement
We released a new user friendly experience to install ISV solutions that are available for Azure Data Manager for Agriculture users. You can now go to your Azure Data Manager for Agriculture instance on the Azure portal, view, and install available solutions in a seamless user experience. Today the ISV solutions available are from Bayer AgPowered services, you can see the marketplace listing [here](https://azuremarketplace.microsoft.com/marketplace/apps?search=bayer&page=1). You can learn more about installing ISV solutions [here](how-to-set-up-isv-solution.md).

## July 2023

### Weather API update 
We deprecated the old weather APIs from API version 2023-07-01. The old weather APIs are replaced with new simple yet powerful provider agnostic weather APIs. Have a look at the API documentation [here](/rest/api/data-manager-for-agri/#weather). 

### New farm operations connector
We added support for Climate FieldView as a built-in data source. You can now auto sync planting, application, and harvest activity files from FieldView accounts directly into Azure Data Manager for Agriculture. Learn more about this [here](concepts-farm-operations-data.md).

### Common Data Model now with geo-spatial support
We updated our data model to improve flexibility. The boundary object is deprecated in favor of a geometry property that is now supported in nearly all data objects. This change brings consistency to how space is handled across hierarchy, activity, and observation themes. It allows for more flexible integration when ingesting data from a provider with strict hierarchy requirements. You can now sync data that might not perfectly align with an existing hierarchy definition and resolve the conflicts with spatial overlap queries. Learn more [here](concepts-hierarchy-model.md).

## June 2023

### Use your license keys via key vault
Azure Data Manager for Agriculture supports a range of data ingress connectors. These connections require customer keys in a Bring Your Own License (BYOL) model. You can use your license keys safely by storing your secrets in the Azure Key Vault, enabling system identity and providing read access to our Data Manager. Details are available [here](concepts-byol-and-credentials.md).

### Sensor integration as both partner and customer
Now you can start pushing data from your own sensors into Data Manager for Agriculture. It's useful in case your sensor provider doesn't want to take steps to onboard their sensors or if you don't have such support from your sensor provider. Details are available [here](how-to-set-up-sensor-as-customer-and-partner.md).

## May 2023

### Understanding throttling
Azure Data Manager for Agriculture implements API throttling to ensure consistent performance by limiting the number of requests within a specified time frame. Throttling prevents resource overuse and maintains optimal performance and reliability for all customers. Details are available [here](concepts-understanding-throttling.md).

## April 2023

### Audit logs
In Azure Data Manager for Agriculture Preview, you can monitor how and when your resources are accessed, and by whom. You can also debug reasons for failure for data-plane requests. [Audit Logs](how-to-set-up-audit-logs.md) are now available for your use.  

### Private links
You can connect to Azure Data Manager for Agriculture service from your virtual network via a private endpoint. You can then limit access to your Azure Data Manager for Agriculture Preview instance over these private IP addresses. [Private Links](how-to-set-up-private-links.md) are now available for your use.  

### BYOL for satellite imagery
To support scalable ingestion of geometry-clipped imagery, we partnered with Sentinel Hub by Sinergise to provide a seamless bring your own license (BYOL) experience. Read more about our satellite connector [here](concepts-ingest-satellite-imagery.md). 

## March 2023

### Key Announcement: Preview Release
Azure Data Manager for Agriculture is now available in preview. See our blog post [here](https://azure.microsoft.com/blog/announcing-microsoft-azure-data-manager-for-agriculture-accelerating-innovation-across-the-agriculture-value-chain/).

## Next steps
* See the Hierarchy Model and learn how to create and organize your agriculture data  [here](./concepts-hierarchy-model.md).
* Understand our APIs [here](/rest/api/data-manager-for-agri).