---
title: Entity categories recognized by Conversational Personally Identifiable Information (detection) in Azure AI Language
titleSuffix: Azure AI services
description: Learn about the entities the Conversational PII feature (preview) can recognize from conversation inputs.
#services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 12/19/2023
ms.author: jboback
ms.custom: language-service-pii
---

# Supported customer content (PII) entity categories in conversations

Use this article to find the entity categories that can be returned by the [conversational PII detection feature](../how-to-call-for-conversations.md). This feature runs a predictive model to identify, categorize, and redact sensitive information from an input conversation.

The PII preview feature includes the ability to detect personal (`PII`) information from conversations.

## Entity categories

The following entity categories are returned when you're sending API requests PII feature.

## Category: Name

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        Name

    :::column-end:::
    :::column span="2":::
        **Details**

        All first, middle, last or full name is considered PII regardless of whether it is the speaker’s name, the agent’s name, someone else’s name or a different version of the speaker’s full name (Chris vs. Christopher). 

        To get this entity category, add `Name` to the `pii-categories` parameter. `Name` will be returned in the API response if detected.
      
    :::column-end:::
    
    :::column span="":::
      **Supported document languages**

      `en`  
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

        All telephone numbers (including toll-free numbers or numbers that may be easily found or considered public knowledge) are considered PII

        To get this entity category, add `PhoneNumber` to the `pii-categories` parameter. `PhoneNumber` will be returned in the API response if detected.
      
    :::column-end:::

    :::column span="":::
      **Supported document languages**

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

        Complete or partial addresses are considered PII. All addresses regardless of what residence or institution the address belongs to (such as: personal residence, business, medical center, government agency, etc.) are covered under this category.        
        Note:  
            * If information is limited to City & State only, it will not be considered PII.  
            * If information contains street, zip code or house number, all information is considered as Address PII , including the city and state

        To get this entity category, add `Address` to the `pii-categories` parameter. `Address` will be returned in the API response if detected.

    :::column-end:::

    :::column span="":::
      **Supported document languages**

      `en`
      
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

        All email addresses are considered PII.
      
        To get this entity category, add `Email` to the `pii-categories` parameter. `Email` will be returned in the API response if detected.

    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `en`
      
    :::column-end:::
:::row-end:::

## Category: NumericIdentifier

This category contains the following entities:

:::row:::
    :::column span="":::
        **Entity**

        NumericIdentifier 

    :::column-end:::
    :::column span="2":::
        **Details**

        Any numeric or alphanumeric identifier that could contain any PII information. 
        Examples:   
            * Case Number 
            * Member Number 
            * Ticket number 
            * Bank account number 
            * Installation ID 
            * IP Addresses 
            * Product Keys 
            * Serial Numbers (1:1 relationship with a specific item/product) 
            * Shipping tracking numbers, etc.

        To get this entity category, add `NumericIdentifier` to the `pii-categories` parameter. `NumericIdentifier` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`
      
    :::column-end:::
:::row-end:::

## Category: Credit card

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        Credit card

    :::column-end:::
    :::column span="2":::
        **Details**

        Any credit card number, any security code on the back, or the expiration date is considered as PII.

        To get this entity category, add `CreditCard` to the `pii-categories` parameter. `CreditCard` will be returned in the API response if detected.

    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`
      
   :::column-end:::
:::row-end:::

## Next steps

[How to detect PII in conversations](../how-to-call-for-conversations.md)
