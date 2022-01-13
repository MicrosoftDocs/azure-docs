---
title: What is a project? - Custom Translator
titleSuffix: Azure Cognitive Services
description: This article will explain the project categories and labels for the Custom Translator service.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.date: 08/17/2020
ms.author: lajanuar
ms.topic: conceptual
#Customer intent: As a Custom Translator user, I want to concept of a project, so that I can use it efficiently.
---
# What is a Custom Translator project?

A project is a wrapper for a model, documents, and tests. Each project
automatically includes all documents that are uploaded into that workspace that
have the correct language pair. For example, if you have both an English to
Spanish project and a Spanish to English project, the same documents will be
included in both projects. Each project has a CategoryID associated with it
that is used when querying the [V3 API](../reference/v3-0-translate.md?tabs=curl) for translations. CategoryID is parameter used to get translations from a customized system built with Custom Translator.

## Project categories

The category identifies the domain – the area of terminology and style you want to use – for your project. Choose the category most relevant to the contents of your documents. 

In the same workspace, you may create projects for the same language pair in
different categories. Custom Translator prevents creation of a duplicate project
with the same language pair and category. Applying a label to your project
allows you to avoid this restriction. Don't use labels unless you're building translation systems for multiple clients, because adding a
unique label to your project will be reflected in your projects Category ID.

## Project labels

Custom Translator allows you to assign a project label to your project. The
project label distinguishes between multiple projects with the same language
pair and category. As best practices, avoid using project labels unless
necessary.

The project label is used as part of the Category ID. If the project label is
left unset or is set identically across projects, then projects with the same
category and *different* language pairs will share the same Category ID. This approach is
advantageous because it allows you or your customer to switch between
languages when using the Text Translator API without worrying about which Category ID to use.

For example, if you want to enable translations in the Technology domain from
English to French and from French to English, you create two
projects: one for English -\> French, and one for French -\> English. You
specify the same category (Technology) for both and leave the project label
blank. The Category ID for both projects is the same. When you call the Text API to translate from both models, you only change the from and to languages.
for both English and French translations without having to modify my CategoryID.

## Next steps

- Learn [How to manage projects](how-to-manage-projects.md) to know, how to efficiently build a translation model.