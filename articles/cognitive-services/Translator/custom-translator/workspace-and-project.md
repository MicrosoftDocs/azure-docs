---
title: What is a workspace and project? - Custom Translator
titleSuffix: Azure Cognitive Services
description: A workspace is a work area for composing and building your custom translation system. A workspace can contain multiple projects, models, and documents. A project is a wrapper for a model, documents, and tests. Each project automatically includes all documents that are uploaded into that workspace that have the correct language pair.
services: cognitive-services
author: swmachan
manager: christw
ms.service: cognitive-services
ms.subservice: translator-text
ms.date: 02/21/2019
ms.author: swmachan
ms.topic: conceptual
#Customer intent: As a Custom Translator user, I want to concept of a project, so that I can use it efficiently.
---
# What is a Custom Translator workspace?

A workspace is a work area for composing and building your custom translation system. A workspace can contain multiple projects, models, and documents. All the work you do in Custom Translator is inside a specific workspace.

Workspace is private to you and the people you invite into your workspace. Uninvited people do not have access to the content of your workspace. You can invite as many people as you like into your workspace and modify or remove their access anytime. You can also create a new workspace. By default a workspace will not contain any projects or documents that are within your other workspaces.

## What is a Custom Translator project?

A project is a wrapper for a model, documents, and tests. Each project
automatically includes all documents that are uploaded into that workspace that
have the correct language pair. For example, if you have both an English to
Spanish project and a Spanish to English project, the same documents will be
included in both projects. Each project has a CategoryID associated with it
that is used when querying the [V3 API](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-translate?tabs=curl) for translations. CategoryID is parameter used to get translations from a customized system built with Custom Translator.

## Project categories

The category identifies the domain – the area of terminology and style you want to use – for your project. Choose the category most relevant to your documents. In some cases, your choice of the category directly influences the behavior of the Custom Translator.

We have two sets of baseline models. They are General and Technology. If the category **Technology** is selected, the Technology baseline models will be used. For any other category selection, the General baseline models are used. The Technology baseline model does well in technology domain, but it shows lower quality, if the sentences used for translation don't fall within the technology domain. We suggest customers to select category Technology only if sentences fall strictly within the technology domain.

In the same workspace, you may create projects for the same language pair in
different categories. Custom Translator prevents creation of a duplicate project
with the same language pair and category. Applying a label to your project
allows you to avoid this restriction. Don't use labels unless you're building translation systems for multiple clients, as adding a
unique label to your project will be reflected in your projects CategoryID.

## Project labels

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

- Read about [Training and model](training-and-model.md) to know, how to efficiently build a translation model.
