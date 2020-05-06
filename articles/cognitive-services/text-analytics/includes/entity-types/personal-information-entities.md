---
title: Named entities for Personal information 
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 04/30/2020
ms.author: aahi
---

> [!NOTE]
> To detect `PHI`, use the `domain=phi` parameter and model version `2020-04-01` or later.
>
> For example: `<resource-url>/entities/recognition/pii?domain=phi&model-version=2020-04-01`
 
The following entity categories are returned when sending requests to the `/entities/recognition/pii` endpoint, available in the v3.1 preview of the API.

| Category   | Subcategory | Description                          | Starting model version | Notes |
|------------|-------------|--------------------------------------|------------------------|---|
| Person     | N/A         | Names of people.  | `2019-10-01`  | Also returned with `domain=phi`. |
| PersonType | N/A         | Job types or roles held by a person. | `2020-02-01` | |
| PhoneNumber | N/A | Phone numbers (US and EU phone numbers only). | `2019-10-01` | Also returned with `domain=phi` |
|Organization  | N/A | Companies, political groups, musical bands, sport clubs, government bodies, and public organizations.  | `2019-10-01` | Nationalities and religions are not included in this entity type.  |
|Organization | Medical | Medical companies and groups. | `2020-04-01` | Also returned with `domain=phi`. |
|Organization | Stock exchange | Stock exchange groups. | `2020-04-01` | Also returned with `domain=phi`. |
| Organization | Sports | Sports-related organizations. | `2020-04-01` | Also returned with `domain=phi`. |
| Address | N/A | Full mailing addresses.  | `2020-04-01` | Also returned with `domain=phi`. |
| EU GPS Coordinates | N/A | GPS coordinates for locations within the European Union.  | `2019-10-01` |  |
| Email | N/A | Email addresses. | `2019-10-01` | Also returned with `domain=phi`.   |
| URL | N/A | URLs to websites. | `2019-10-01` | Also returned with `domain=phi`. |
| IP | N/A | Network IP addresses. | `2019-10-01` | |
| DateTime | N/A | Dates and times of day. | `2019-10-01` |  | 
| DateTime | Date | Calender dates. | `2019-10-01` | Also returned with `domain=phi`. |
| Quantity | N/A | Numbers and numeric quantities. | `2019-10-01` |  |
| Quantity | Age | Ages. | `2019-10-01` | | |
| International Classification of Diseases (ICD-10-CM) | N/A | Entities relating to the International Classification of Diseases, Ninth Revision.   | `2020-04-01` | Also returned with `domain=phi`. |
| International Classification of Diseases (ICD-10-CM) | N/A | Entities relating to the International Classification of Diseases, Tenth Revision.    | `2020-04-01` | Also returned with `domain=phi`. |

## Azure information

This entity category includes identifiable Azure information including authentication information, and connection strings. Available starting with model version `2019-10-01`. Not returned with the `domain=phi` parameter.

| Subcategory                           | Description                                                                 |
|---------------------------------------|-----------------------------------------------------------------------------|
| Azure DocumentDB Auth Key             | Authorization key for an Azure DocumentDB server.                           |
| Azure IAAS Database Connection String and Azure SQL Connection String | Connection string for an Azure Infrastructure as a service (IaaS) database, and SQL connection string. |
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
> The following financial and country-specific entities are not returned with the `domain=phi` parameter:
> * Passport numbers
> * Tax IDs

This entity category includes financial information and official forms of identification. Available starting with model version `2019-10-01`. Subtypes are listed below. 

[!INCLUDE [supported identification entities](./identification-entities.md)]