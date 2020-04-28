---
title: Named entities for Personal information 
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 03/30/2020
ms.author: aahi
---

## Personal information categories (Preview):

The following entity categories are returned when [detecting personal information](../../how-tos/text-analytics-how-to-entity-linking.md#named-entity-recognition-versions-and-features) using NER. This feature is only available in the Text Analytics API v3.0 and v3.1 previews.

| Category   | Subcategory | Description                          | Examples                                                    | Starting model version |
|------------|-------------|--------------------------------------|-------------------------------------------------------------|--------------------------------------|
| Person     | N/A         | Names of people.                     | Bill Gates, Marie Curie                                     | 2019-10-01                         |
| PersonType | N/A         | Job types or roles held by a person. | civil engineer, salesperson, chef, librarian, nursing aide | 2020-02-01                         | 
|Organization  | N/A | Companies, political groups, musical bands, sport clubs, government bodies, and public organizations. Nationalities and religions are not included in this entity type. | Microsoft, NASA | 2019-10-01 | 
|Organization | Medical | Medical companies and groups | Contoso Pharmaceuticals | 2020-04-01 | 
|Organization | Stock exchange | Stock exchange groups. | Major stock exchange names and abbreviations. | 2020-04-01 |
| Organization | Sports | Sports-related organizations. | Popular leagues, clubs, and associations. | 2020-04-01 | 
| Phone Number | N/A | Phone numbers (US Phone numbers only) | (312) 555-0176 | 2019-10-01 | 
| Address | N/A | Full addresses. | 1234 Main St. Buffalo, NY 98052 | 2020-04-01 |
| Email | N/A | Email addresses. | `support@contoso.com` | 2019-10-01 | 
| URL | N/A | URLs to websites. | `https://www.bing.com` | 2019-10-01 |
| IP Address | N/A | Network addresses. | `10.0.0.101` | 2019-10-01 | 
| Quantity | N/A | Numbers and numeric quantities. | | 2019-10-01 | 
| Quantity | Age | Ages. | 90 day old, 30 years old | 2019-10-01 | 
| DateTime | N/A | Date and Time entities. | 6:30PM February 4 2012, 4/1/2011 2:45. | 2019-10-01 | 
| DateTime | Date | Dates in time. | May 2nd 2017, 05/02/2017 | 2019-10-01 |
| EU GPS Coordinates | N/A | GPS coordinates for locations within the European Union.  | | 2019-10-01 | 
| ICD-9-CM | N/A | Entities relating to the International Classification of Diseases, Ninth Revision  | | 2020-04-01 |
| ICD-10-CM | N/A | Entities relating to the International Classification of Diseases, Tenth Revision  | | 2020-04-01 |

## Azure information

This entity category includes identifiable Azure information including authentication information, and connection strings. Available starting with model version `2019-10-01`. Subcategories of this entity are listed below.

| Subcategory                           | Description                                                                 |
|---------------------------------------|-----------------------------------------------------------------------------|
| Azure DocumentDB Auth Key             | Authorization key for an Azure DocumentDB server.                           |
| Azure IAAS Database Connection String | Connection string for an Azure Infrastructure as a service (IaaS) database. |
| Azure SQL Connection String           | Connection string for an Azure SQL database.                                |
| Azure IoT Connection String           | Connection string for Azure Internet of things(IoT).                        |
| Azure Publish Setting Password        | Password for Azure Publish settings.                                        |
| Azure Redis Cache Connection String   | Connection string for an Azure Cache for Redis.                             |
| Azure SAS                             | Connection string for Azure Software as a Service(SAS).                     |
| Azure Service Bus Connection String   | Connection string for an Azure service bus.                                 |
| Azure Storage Account Key             | Account key for an Azure storage account.                                   |
| Azure Storage Account Key (Generic)   | Generic account key for an Azure storage account.                           |
| SQL Server Connection String          | Connection string for a SQL server.                                         |

## Identification

> [!NOTE]
> The following financial and country-specific entities are also returned when [using NER to detect personal health information](../../how-tos/text-analytics-how-to-entity-linking.md).

This entity category includes financial information and official forms of identification. Available starting with model version `2019-10-01`. Subtypes are listed below. 

[!INCLUDE [supported identification entities](./identification-entities.md)]