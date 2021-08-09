---
title: Named entities for Personal information 
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: include 
ms.date: 08/02/2021
ms.author: aahi
---

> [!NOTE]
> To detect protected health information (PHI), use the `domain=phi` parameter and model version `2020-04-01` or later.
>
> For example: `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.1/entities/recognition/pii?domain=phi&model-version=2021-01-15`
 
The following entity categories are returned when you're sending requests to the `/v3.1/entities/recognition/pii` endpoint.


| Category   |  Description                          |
|------------|-------------|
| [Person](#category-person)      |  Names of people.  |
| [PersonType](#category-persontype) | Job types or roles held by a person. |
| [Phone number](#category-phonenumber) |Phone numbers (US and EU phone numbers only). |
| [Organization](#category-organization) |  Companies, groups, government bodies, and other organizations.  |
| [Address](#category-address) | Full mailing addresses.  |
| [Email](#category-email) | Email addresses.   |
| [URL](#category-url) | URLs to websites.  |
| [IPAddress](#category-ipaddress) | Network IP addresses.  |
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

        To get this entity category, add `Person` to the `pii-categories` parameter. `Person` will be returned in the API response if detected.
      
    :::column-end:::
    
    :::column span="":::
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

        To get this entity category, add `PersonType` to the `pii-categories` parameter. `PersonType` will be returned in the API response if detected.
      
    :::column-end:::

    :::column span="":::
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

        To get this entity category, add `PhoneNumber` to the `pii-categories` parameter. `PhoneNumber` will be returned in the API response if detected.
      
    :::column-end:::

    :::column span="":::
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

        Companies, political groups, musical bands, sport clubs, government bodies, and public organizations. Nationalities and religions are not included in this entity type. Also returned with `domain=phi`.

        To get this entity category, add `Organization` to the `pii-categories` parameter. `Organization` will be returned in the API response if detected.
      
    :::column-end:::

    :::column span="":::
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

        To get this entity category, add `OrganizationMedical` to the `pii-categories` parameter. `OrganizationMedical` will be returned in the API response if detected.
      
    :::column-end:::

    :::column span="":::
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

        To get this entity category, add `OrganizationStockExchange` to the `pii-categories` parameter. `OrganizationStockExchange` will be returned in the API response if detected.
      
    :::column-end:::

    :::column span="":::

      `en`   
      
   :::column-end:::

:::row-end:::
:::row:::
    :::column span="":::

        Sports

    :::column-end:::
    :::column span="2":::

        Sports-related organizations.

        To get this entity category, add `OrganizationSports` to the `pii-categories` parameter. `OrganizationSports` will be returned in the API response if detected.
      
    :::column-end:::

    :::column span="":::

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

        Full mailing address. Also returned with `domain=phi`.

        To get this entity category, add `Address` to the `pii-categories` parameter. `Address` will be returned in the API response if detected.
      
    :::column-end:::

    :::column span="":::
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

        Email addresses. Also returned with `domain=phi`.
      
        To get this entity category, add `Email` to the `pii-categories` parameter. `Email` will be returned in the API response if detected.

    :::column-end:::
    :::column span="":::
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

        URLs to websites. Also returned with `domain=phi`.

        To get this entity category, add `URL` to the `pii-categories` parameter. `URL` will be returned in the API response if detected.
      
    :::column-end:::

    :::column span="":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`
      
    :::column-end:::

:::row-end:::

### Category: IPAddress

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        IPAddress

    :::column-end:::
    :::column span="2":::
        **Details**

        Network IP addresses. Also returned with `domain=phi`.

        To get this entity category, add `IPAddress` to the `pii-categories` parameter. `IPAddress` will be returned in the API response if detected.
      
    :::column-end:::

    :::column span="":::
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

        To get this entity category, add `DateTime` to the `pii-categories` parameter. `DateTime` will be returned in the API response if detected.
      
    :::column-end:::
:::column span="":::
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

        Calender dates. Also returned with `domain=phi`.

        To get this entity category, add `Date` to the `pii-categories` parameter. `Date` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**
      
      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`   
      
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

        To get this entity category, add `Quantity` to the `pii-categories` parameter. `Quantity` will be returned in the API response if detected.
      
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

        To get this entity category, add `Age` to the `pii-categories` parameter. `Age` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="2":::
        **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`  
      
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

        To get this entity category, add `AzureDocumentDBAuthKey` to the `pii-categories` parameter. `AzureDocumentDBAuthKey` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `en` 

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Azure IAAS Database Connection String and Azure SQL Connection String.
        

    :::column-end:::
    :::column span="2":::

        Connection string for an Azure infrastructure as a service (IaaS) database, and SQL connection string.

        To get this entity category, add `AzureIAASDatabaseConnectionAndSQLString` to the `pii-categories` parameter. `AzureIAASDatabaseConnectionAndSQLString` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `en` 

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Azure IoT Connection String  

    :::column-end:::
    :::column span="2":::

        Connection string for Azure IoT. 
      
        To get this entity category, add `AzureIoTConnectionString` to the `pii-categories` parameter. `AzureIoTConnectionString` will be returned in the API response if detected.

    :::column-end:::
    :::column span="":::

      `en` 

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Azure Publish Setting Password  

    :::column-end:::
    :::column span="2":::

        Password for Azure publish settings.

        To get this entity category, add `AzurePublishSettingPassword` to the `pii-categories` parameter. `AzurePublishSettingPassword` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `en` 

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Azure Redis Cache Connection String 

    :::column-end:::
    :::column span="2":::

        Connection string for a Redis cache.

        To get this entity category, add `AzureRedisCacheString` to the `pii-categories` parameter. `AzureRedisCacheString` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `en` 

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Azure SAS 

    :::column-end:::
    :::column span="2":::

        Connection string for Azure software as a service (SaaS).

        To get this entity category, add `AzureSAS` to the `pii-categories` parameter. `AzureSAS` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `en` 

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Azure Service Bus Connection String

    :::column-end:::
    :::column span="2":::

        Connection string for an Azure service bus.

        To get this entity category, add `AzureServiceBusString` to the `pii-categories` parameter. `AzureServiceBusString` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `en` 

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Azure Storage Account Key 

    :::column-end:::
    :::column span="2":::

        Account key for an Azure storage account. 

        To get this entity category, add `AzureStorageAccountKey` to the `pii-categories` parameter. `AzureStorageAccountKey` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `en` 

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Azure Storage Account Key (Generic)

    :::column-end:::
    :::column span="2":::

        Generic account key for an Azure storage account.

        To get this entity category, add `AzureStorageAccountGeneric` to the `pii-categories` parameter. `AzureStorageAccountGeneric` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `en` 

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        SQL Server Connection String 

    :::column-end:::
    :::column span="2":::

        Connection string for a computer running SQL Server.

        To get this entity category, add `SQLServerConnectionString` to the `pii-categories` parameter. `SQLServerConnectionString` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `en` 

    :::column-end:::
:::row-end:::

### Identification

[!INCLUDE [supported identification entities](./identification-entities.md)]
