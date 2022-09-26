---
title: Entity categories recognized by Personally Identifiable Information (detection) in Azure Cognitive Service for Language
titleSuffix: Azure Cognitive Services
description: Learn about the entities the PII feature can recognize from unstructured text.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 11/15/2021
ms.author: aahi
ms.custom: language-service-pii, ignite-fall-2021
---

# Supported Personally Identifiable Information (PII) entity categories

Use this article to find the entity categories that can be returned by the [PII detection feature](../how-to-call.md). This feature runs a predictive model to identify, categorize, and redact sensitive information from an input document.

The PII feature includes the ability to detect personal (`PII`) and health (`PHI`) information.

## Entity categories

> [!NOTE]
> To detect protected health information (PHI), use the `domain=phi` parameter and model version `2020-04-01` or later.


The following entity categories are returned when you're sending API requests PII feature.

## Category: Person

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        Person

    :::column-end:::
    :::column span="2":::
        **Details**

        Names of people. Returned as both PII and PHI.

        To get this entity category, add `Person` to the `pii-categories` parameter. `Person` will be returned in the API response if detected.
      
    :::column-end:::
    
    :::column span="":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`   
      
   :::column-end:::
:::row-end:::

## Category: PersonType

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

## Category: PhoneNumber

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        PhoneNumber

    :::column-end:::
    :::column span="2":::
        **Details**

        Phone numbers (US and EU phone numbers only). Returned as both PII and PHI.

        To get this entity category, add `PhoneNumber` to the `pii-categories` parameter. `PhoneNumber` will be returned in the API response if detected.
      
    :::column-end:::

    :::column span="":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt` `pt-br`
      
   :::column-end:::

:::row-end:::


## Category: Organization

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        Organization

    :::column-end:::
    :::column span="2":::
        **Details**

        Companies, political groups, musical bands, sport clubs, government bodies, and public organizations. Nationalities and religions are not included in this entity type. Returned as both PII and PHI.

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


## Category: Address

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        Address

    :::column-end:::
    :::column span="2":::
        **Details**

        Full mailing address. Returned as both PII and PHI.

        To get this entity category, add `Address` to the `pii-categories` parameter. `Address` will be returned in the API response if detected.
      
    :::column-end:::

    :::column span="":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`
      
    :::column-end:::

:::row-end:::

## Category: Email

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        Email

    :::column-end:::
    :::column span="2":::
        **Details**

        Email addresses. Returned as both PII and PHI.
      
        To get this entity category, add `Email` to the `pii-categories` parameter. `Email` will be returned in the API response if detected.

    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`
      
    :::column-end:::
:::row-end:::


## Category: URL

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        URL

    :::column-end:::
    :::column span="2":::
        **Details**

        URLs to websites. Returned as both PII and PHI.

        To get this entity category, add `URL` to the `pii-categories` parameter. `URL` will be returned in the API response if detected.
      
    :::column-end:::

    :::column span="":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`
      
    :::column-end:::

:::row-end:::

## Category: IP

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        IP

    :::column-end:::
    :::column span="2":::
        **Details**

        Network IP addresses. Returned as both PII and PHI.

        To get this entity category, add `IP` to the `pii-categories` parameter. `IP` will be returned in the API response if detected.
      
    :::column-end:::

    :::column span="":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`
      
    :::column-end:::
:::row-end:::

## Category: DateTime

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

        Calender dates. Returned as both PII and PHI.

        To get this entity category, add `Date` to the `pii-categories` parameter. `Date` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**
      
      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`   
      
    :::column-end:::
:::row-end:::

## Category: Quantity

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

These entity categories include identifiable Azure information like authentication information and connection strings. Not returned as PHI.

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

[!INCLUDE [supported identification entities](../includes/identification-entities.md)]


## Next steps

* [NER overview](../overview.md)
