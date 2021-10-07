---
title: Custom Language Understanding backwards compatibility 
titleSuffix: Azure Cognitive Services
description: Learn about backwards compatibility between LUIS and Custom Language Understanding 
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: overview
ms.date: 08/18/2021
ms.author: aahi
---

# Backwards compatibility with LUIS applications

You can reuse some of the content of your existing LUIS applications in Custom Language Understanding. When working with Custom Language Understanding projects, you can:
* Create projects from LUIS application JSON files.
* Create LUIS applications that can be connected by orchestration workflow projects.  
* Migrate LUIS applications to use a Language Services resource. 
  
## Import a LUIS application JSON file into Custom Language Understanding

To import a LUIS application JSON file, click on the icon next to **Create a new project** and select **Import**. Then select the LUIS file. When you import a new project into Custom Language Understanding, you can select an exported LUIS application JSON file, and the service will automatically create a project with the currently available features.

> [!TIP]
> you can also import the JSON file for a Custom Language Understanding project.

:::image type="content" source="../media/import.png" alt-text="A screenshot showing the import button for conversation projects." lightbox="../media/import.png":::

## Create or import a LUIS application that can be used in Custom Language Understanding

You can only to connect to LUIS applications that are owned by the same resource that you use for Custom Language Understanding. Follow these steps to create a LUIS application you can use in your Custom Language Understanding projects. 

1. Sign in to the [LUIS Portal](https://www.luis.ai/).
2. Select the subscription that you use for Custom Language Understanding.
3. A screen will appear that will let you select your Language Service resource. Select your resource in the drop-down menu. The only resources that will show up are resources in West Europe.

    :::image type="content" source="../media/luis-resource.png" alt-text="A screenshot showing the resource creation screen in the LUIS portal." lightbox="../media/luis-resource.png":::

4. You will now be able to import or create applications using this resource. You must train and publish LUIS applications for them to appear in Custom Language Understanding when you want to connect them to orchestration projects.

## Migrate an application from a LUIS authoring resource to a Language Services resource 

If you want to migrate an application from a LUIS authoring resource to a Language Service resource: 
1. Sign in to the [LUIS Portal](https://www.luis.ai/).
2. Select an application using a LUIS authoring resource. 

    > [!CAUTION]
    > You can only connect LUIS applications that use a resource in **West Europe** to Custom Language Understanding. 

4. Navigate to the **Manage** page and go to **Azure Resources**.
5. Click on the **Authoring resource** tab.
6. Click on the **Change authoring resource** button.
7. Select a Language Services Standard (**S**) resource available in West Europe under your subscription.

## Supported Features

When importing the LUIS application into Custom Language Understanding, it will create a conversation project with the following features:

|Feature|Notes|
|---|---|
|Intents|All of your LUIS intents will be transferred as Custom Language Understanding intents|
|Machine learning (ML) entities|All of your ML entities will be transferred as Custom Language Understanding entities. Structured ML entities will only be transferred as one top-level entity, and the individual sub-entities will be ignored|
|Utterances|All of your LUIS utterances will be transferred as Custom Language Understanding utterances with their intent and entity labels. Structured ML entity labels will only keep the top-level entity labels, and the individual sub-entity labels will be ignored.|
|Culture|The primary language of the conversations project will be the LUIS app culture. If the culture is not supported, you will get an error.|

## Unsupported Features

When importing the LUIS JSON application into Custom Language Understanding, certain features will be ignored, but won't block you from importing the application. The following features will be ignored:

|**Feature**|Notes|
|---|---|
|List Entities| |
|Prebuilt Entities| |
|Regex Entities| |
|Required Features|  |
|Roles| |
|Application Settings|  |
|Features| |
|Patterns| |
|`Pattern.Any` Entities| |
|Structured ML Entities| |

## Next steps

[Custom Language Understanding overview](../overview.md)