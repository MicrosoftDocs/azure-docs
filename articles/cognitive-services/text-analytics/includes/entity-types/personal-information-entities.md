---
title: Named entities for Personal information 
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: include 
ms.date: 02/17/2021
ms.author: aahi
---

> [!NOTE]
> To detect protected health information (PHI), use the `domain=phi` parameter and model version `2020-04-01` or later.
>
> For example: `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.1-preview.3/entities/recognition/pii?domain=phi&model-version=2021-01-15`
 
The following entity categories are returned when you're sending requests to the `/v3.1-preview.3/entities/recognition/pii` endpoint.


| Category   |  Description                          |
|------------|-------------|
| [Person](#category-person)      |  Names of people.  |
| [PersonType](#category-persontype) | Job types or roles held by a person. |
| [Phone number](#category-phonenumber) |Phone numbers (US and EU phone numbers only). |
| [Organization](#category-organization) |  Companies, groups, government bodies, and other organizations.  |
| [Address](#category-address) | Full mailing addresses.  |
| [Email](#category-email) | Email addresses.   |
| [URL](#category-url) | URLs to websites.  |
| [IP](#category-ip) | Network IP addresses.  |
| [DateTime](#category-datetime) | Dates and times of day. | 
| [Quantity](#category-quantity) | Numbers and numeric quantities.  |
| [Azure information](#azure-information) | Identifiable Azure information, such as authentication information.  |
| [Identification](#identification) | Financial and country specific identification.  |

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
:::row-end:::
:::row:::
    :::column span="":::

        Stock exchange

    :::column-end:::
    :::column span="2":::

        Stock exchange groups. 
      
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Sports

    :::column-end:::
    :::column span="2":::

        Sports-related organizations.
      
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
:::row-end:::

### Azure information

These entity categories includes identifiable Azure information, including authentication information and connection strings. Not returned with the `domain=phi` parameter.

:::row:::
    :::column span="":::
        **Entity**

        Azure DocumentDB Auth Key 

    :::column-end:::
    :::column span="2":::
        **Details**

        Authorization key for an Azure Cosmos DB server.   
      
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Azure IAAS Database Connection String and Azure SQL Connection String

    :::column-end:::
    :::column span="2":::

        Connection string for an Azure infrastructure as a service (IaaS) database, and SQL connection string.
      
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Azure SQL Connection String

    :::column-end:::
    :::column span="2":::

        Connection string for a database in Azure SQL Database.
      
    :::column-end:::

:::row-end:::
:::row:::
    :::column span="":::

        Azure IoT Connection String  

    :::column-end:::
    :::column span="2":::

        Connection string for Azure IoT. 
      
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Azure Publish Setting Password  

    :::column-end:::
    :::column span="2":::

        Password for Azure publish settings.
      
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Azure Redis Cache Connection String 

    :::column-end:::
    :::column span="2":::

        Connection string for a Redis cache.
      
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Azure SAS 

    :::column-end:::
    :::column span="2":::

        Connection string for Azure software as a service (SaaS).
      
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Azure Service Bus Connection String

    :::column-end:::
    :::column span="2":::

        Connection string for an Azure service bus.
      
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Azure Storage Account Key 

    :::column-end:::
    :::column span="2":::

       Account key for an Azure storage account. 
      
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Azure Storage Account Key (Generic)

    :::column-end:::
    :::column span="2":::

       Generic account key for an Azure storage account.
      
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        SQL Server Connection String 

    :::column-end:::
    :::column span="2":::

       Connection string for a computer running SQL Server.
      
    :::column-end:::
:::row-end:::

### Identification

[!INCLUDE [supported identification entities](./identification-entities.md)]
