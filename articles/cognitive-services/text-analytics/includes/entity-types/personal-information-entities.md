---
title: Named entities for Personal information 
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 07/16/2020
ms.author: aahi
---

> [!NOTE]
> To detect protected health information (PHI), use the `domain=phi` parameter and model version `2020-04-01` or later.
>
> For example: `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.1-preview.1/entities/recognition/pii?domain=phi&model-version=2020-04-01`
 
The following entity categories are returned when you're sending requests to the `/v3.1-preview.1/entities/recognition/pii` endpoint.

| Category   | Subcategory | Description                          | Starting model version | Notes |
|------------|-------------|--------------------------------------|------------------------|---|
| Person     | N/A         | Names of people.  | `2019-10-01`  | Also returned with `domain=phi`. |
| PersonType | N/A         | Job types or roles held by a person. | `2020-02-01` | |
| PhoneNumber | N/A | Phone numbers (US and EU phone numbers only). | `2019-10-01` | Also returned with `domain=phi`. |
|Organization  | N/A | Companies, political groups, musical bands, sport clubs, government bodies, and public organizations.  | `2019-10-01` | Nationalities and religions are not included in this entity type.  |
|Organization | Medical | Medical companies and groups. | `2020-04-01` |  |
|Organization | Stock exchange | Stock exchange groups. | `2020-04-01` |  |
| Organization | Sports | Sports-related organizations. | `2020-04-01` |  |
| Address | N/A | Full mailing addresses.  | `2020-04-01` | Also returned with `domain=phi`. |
| EU GPS Coordinates | N/A | GPS coordinates for locations within the European Union.  | `2019-10-01` |  |
| Email | N/A | Email addresses. | `2019-10-01` | Also returned with `domain=phi`.   |
| URL | N/A | URLs to websites. | `2019-10-01` | Also returned with `domain=phi`. |
| IP | N/A | Network IP addresses. | `2019-10-01` | Also returned with `domain=phi`. |
| DateTime | N/A | Dates and times of day. | `2019-10-01` |  | 
| DateTime | Date | Calender dates. | `2019-10-01` | Also returned with `domain=phi`. |
| Quantity | N/A | Numbers and numeric quantities. | `2019-10-01` |  |
| Quantity | Age | Ages. | `2019-10-01` | | |

## Azure information

This entity category includes identifiable Azure information, including authentication information and connection strings. Available starting with model version `2019-10-01`. Not returned with the `domain=phi` parameter.

| Subcategory                           | Description                                                                 |
|---------------------------------------|-----------------------------------------------------------------------------|
| Azure DocumentDB Auth Key             | Authorization key for an Azure Cosmos DB server.                           |
| Azure IAAS Database Connection String and Azure SQL Connection String | Connection string for an Azure infrastructure as a service (IaaS) database, and SQL connection string. |
| Azure SQL Connection String           | Connection string for a database in Azure SQL Database.                                |
| Azure IoT Connection String           | Connection string for Azure IoT.                        |
| Azure Publish Setting Password        | Password for Azure publish settings.                                        |
| Azure Redis Cache Connection String   | Connection string for a Redis cache.                             |
| Azure SAS                             | Connection string for Azure software as a service (SaaS).                     |
| Azure Service Bus Connection String   | Connection string for an Azure service bus.                                 |
| Azure Storage Account Key             | Account key for an Azure storage account.                                   |
| Azure Storage Account Key (Generic)   | Generic account key for an Azure storage account.                           |
| SQL Server Connection String          | Connection string for a computer running SQL Server.                                         |

## Identification

[!INCLUDE [supported identification entities](./identification-entities.md)]
