---
title: What is a project? - Custom Translator
titleSuffix: Azure Cognitive Services
description: This article will explain the project categories and labels for the Custom Translator service.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.date: 01/20/2022
ms.author: lajanuar
ms.topic: conceptual
#Customer intent: As a Custom Translator user, I want to concept of a project, so that I can use it efficiently.
---
# What is a Custom Translator project?

A project contains translation models for one language pair. Each project
initially includes all documents that are uploaded to a workspace with the correct language pair. For example, if you have both an English-to-Spanish project and a Spanish-to-English project, the same documents will be included in both projects. Each project has an associated `CategoryID` that is used when querying the [V3 API](../../reference/v3-0-translate.md?tabs=curl) for translations. The `CategoryID` is parameter used to get translations from a customized system built with Custom Translator.

## Project category

The project `Category ID` identifies the domain—the area of terminology and style you want to use for your project. Choose the category most relevant to the contents of your documents.

In the same workspace, you may create projects for the same language pair in
different categories. Custom Translator prevents creation of a duplicate project
with the same language pair and category. Applying a label to your project
allows you to avoid this restriction. Don't use labels unless you're building translation systems for multiple clients, because adding a unique label to your project will be reflected in your projects `Category ID`.

## Project label

Custom Translator allows you to assign a project label to your project. The
project label distinguishes between multiple projects with the same language
pair and category. As a best practice, avoid using project labels unless
necessary.

The project label is used as part of the `Category ID`. If the project label is
left unset or is set identically across projects, then, projects with the same
category and *different* language pairs will share the same `Category ID`. This approach is advantageous because it allows you or your customer to switch between
languages when using the Text Translator API without worrying about which `Category ID` to use.

For example, if you want to enable translations in the technology domain from
English-to-French and French-to-English, create two projects: one for English → French, and one for French → English. Specify the same category (technology) for both and leave the project label blank. The `Category ID` for both projects will be the same. When you call the Text API to translate from both models, only change the _from_ and _to_ languages without modifying  the CategoryID.

## Next steps

> [!div class="nextstepaction"]
> [Learn how to manage projects](how-to/create-manage-project.md)
