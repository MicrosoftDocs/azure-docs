---
title: Project in Custom Translator
titlesuffix: Azure Cognitive Services
description: What is project in Custom Translator.
services: cognitive-services
author: rajdeep-in
manager: christw
ms.service: cognitive-services
ms.component: custom-translator
ms.date: 10/15/2018
ms.author: v-rada
ms.topic: project concept
Customer intent: As a custom translator user, I want to concept of a project, so that I can use it efficiently.
---

# Project

A project is a wrapper for a model, documents, and tests. Each project
automatically includes all documents that are uploaded into that workspace that
have the correct language pair. For example, if you have both an English to
Spanish project and a Spanish to English project, the same documents will be
included in both projects. Each project has a CategoryID associated with it
that is used when querying the V3 API for translations.

## Categories

The category identifies the domain – the area of terminology and style you want
to use – for your project. Choose a category that is most appropriate and
relevant to your type of documents. In some cases, your choice of the category
directly influences the behavior of the Custom Translator.

We do not have custom models for categories yet except a general
baseline system. But we still recommend users to select the category most
applicable to their domain so that it can be used as an identifier in the
CategoryID. For projects in the technology domain, selecting the
“Technology” category will ensure that if a baseline model does become available
then your project can take advantage of it.

In the same workspace, you may create projects for the same language pair in
different categories. Custom Translator prevents creation of a duplicate project
with the same language pair and category. Applying a label to your project
allows you to avoid this restriction. It is recommended *not* to use the label,
unless you are building translation systems for multiple clients, as adding a
unique label to your project will be reflected in your projects CategoryID.

## Project label

Custom Translator allows you to assign a project label to your project. The
project label distinguishes between multiple projects with the same language
pair and category. As a best practice, avoid using project labels unless
necessary.

The project label is used as part of the CategoryID. If the project label is
left unset or is set identically across projects, then projects with the same
category and *different* language pairs will share the same CategoryID. This approach is
advantageous because it allows you or your customer to switch between
languages when using the Text Translator API without worrying about a CategoryID that is unique to each project.

For example, if I wanted to enable translations in the Technology domain from
English to French and from French to English, I would create two
projects: one for English -\> French, and one for French -\> English. I would
specify the same category (Technology) for both and leave the project label
blank. The CategoryID for both projects would match, so I could query the API
for both English and French translations without having to modify my CategoryID.

If you are a language service provider and want to serve
multiple customers with different models that retain the same category and
language pair, then using a project label to differentiate between customers
would be a wise decision.

## Next steps

- Read about [training and model](concept-training-model.md).