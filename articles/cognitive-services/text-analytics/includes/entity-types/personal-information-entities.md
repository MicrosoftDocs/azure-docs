---
title: Named entities for Personal information 
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: include 
ms.date: 07/16/2020
ms.author: aahi
---

> [!NOTE]
> To detect protected health information (PHI), use the `domain=phi` parameter and model version `2020-04-01` or later.
>
> For example: `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.1-preview.2/entities/recognition/pii?domain=phi&model-version=2020-07-01`
 
The following entity categories are returned when you're sending requests to the `/v3.1-preview.2/entities/recognition/pii` endpoint.


| Category   |  Description                          | Starting model version | Notes |
|------------|-------------|--------------------------------------|------------------------|---|
| [Person](#category-person)      |  Names of people.  | `2019-10-01`  | Also returned with `domain=phi`. |
| [PersonType](#category-persontype) | N/A         | Job types or roles held by a person. | `2020-02-01` | |
| [Phone number](#category-phonenumber) | N/A | Phone numbers (US and EU phone numbers only). | `2019-10-01` | Also returned with `domain=phi`. |
| [Organization](#category-organization)  | N/A | Companies, political groups, musical bands, sport clubs, government bodies, and public organizations. This category includes sub-categories of entities, such as *Stock*, and *Medical*.  | `2019-10-01` | Nationalities and religions are not included in this entity type.  |
| [Address](#category-address)  | N/A | Full mailing addresses.  | `2020-04-01` | Also returned with `domain=phi`. |
| EU GPS Coordinates | N/A | GPS coordinates for locations within the European Union.  | `2019-10-01` |  |
| [Email](#category-email) | N/A | Email addresses. | `2019-10-01` | Also returned with `domain=phi`.   |
| [URL](#category-url) | N/A | URLs to websites. | `2019-10-01` | Also returned with `domain=phi`. |
| [IP](#category-ip) | N/A | Network IP addresses. | `2019-10-01` | Also returned with `domain=phi`. |
| [DateTime](#category-datetime) | N/A | Dates and times of day. This category includes sub-categories of entities, such as *Date*. | `2019-10-01` | *Date* also returned with `domain=phi`. | 
| [Quantity](#category-quantity) | N/A | Numbers and numeric quantities.  This category includes sub-categories of entities, such as *age*. | `2019-10-01` | *Age* also returned with `domain=phi`. |


### Category: Person

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        Person

    :::column-end:::
    :::column span="2":::
        **Details**

        Names of people. Also returned with `domain=phi`.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`     
      
   :::column-end:::
:::row-end:::

### Category: PersonType

This category contains the following entity:


:::row:::
    :::column span="":::
        **Entity**

        PersonType

    :::column-end:::
    :::column span="2":::
        **Details**

        Job types or roles held by a person.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`  
      
   :::column-end:::
:::row-end:::

### Category: PhoneNumber

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        PhoneNumber

    :::column-end:::
    :::column span="2":::
        **Details**

        Phone numbers (US and EU phone numbers only). Also returned with `domain=phi`.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt` `pt-br`
      
   :::column-end:::
:::row-end:::


### Category: Organization

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        Organization

    :::column-end:::
    :::column span="2":::
        **Details**

        Companies, political groups, musical bands, sport clubs, government bodies, and public organizations. Nationalities and religions are not included in this entity type.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`     
      
   :::column-end:::
:::row-end:::

#### Subcategories

The entity in this category can have the following subcategories.

:::row:::
    :::column span="":::
        **Entity subcategory**

        Medical

    :::column-end:::
    :::column span="2":::
        **Details**

        Medical companies and groups.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`   
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Stock exchange

    :::column-end:::
    :::column span="2":::

        Stock exchange groups. 
      
    :::column-end:::
    :::column span="2":::

      `en`   
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Sports

    :::column-end:::
    :::column span="2":::

        Sports-related organizations.
      
    :::column-end:::
    :::column span="2":::

      `en`   
      
   :::column-end:::
:::row-end:::


### Category: Address

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        Address

    :::column-end:::
    :::column span="2":::
        **Details**

        Full mailing address.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`
      
   :::column-end:::
:::row-end:::

### Category: Email

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        Email

    :::column-end:::
    :::column span="2":::
        **Details**

        Email addresses.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`
      
   :::column-end:::
:::row-end:::

### Category: URL

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        URL

    :::column-end:::
    :::column span="2":::
        **Details**

        URLs to websites. 
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`
      
   :::column-end:::
:::row-end:::

### Category: IP

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        IP

    :::column-end:::
    :::column span="2":::
        **Details**

        network IP addresses. 
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`
      
   :::column-end:::
:::row-end:::

### Category: DateTime

This category contains the following entities:

:::row:::
    :::column span="":::
        **Entity**

        DateTime

    :::column-end:::
    :::column span="2":::
        **Details**

        Dates and times of day. 
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`
      
   :::column-end:::
:::row-end:::

#### Subcategories

The entity in this category can have the following subcategories.

:::row:::
    :::column span="":::
        **Entity subcategory**

        Date

    :::column-end:::
    :::column span="2":::
        **Details**

        Calender dates.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br`   
      
   :::column-end:::
:::row-end:::

### Category: Quantity

This category contains the following entities:

:::row:::
    :::column span="":::
        **Entity**

        Quantity

    :::column-end:::
    :::column span="2":::
        **Details**

        Numbers and numeric quantities.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`
      
   :::column-end:::
:::row-end:::

#### Subcategories

The entity in this category can have the following subcategories.

:::row:::
    :::column span="":::
        **Entity subcategory**

        Age

    :::column-end:::
    :::column span="2":::
        **Details**

        Ages.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br`   
      
   :::column-end:::
:::row-end:::

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
