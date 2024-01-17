---
title: "What is a workspace and project? - Custom Translator"
titleSuffix: Azure AI services
description: This article will explain the differences between a workspace and a project as well as project categories and labels for the Custom Translator service.
#services: cognitive-services
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.date: 07/18/2023
ms.author: lajanuar
ms.topic: conceptual
ms.custom: cogserv-non-critical-translator
#Customer intent: As a Custom Translator user, I want to concept of a project, so that I can use it efficiently.
---
# What is a Custom Translator workspace?

A workspace is a work area for composing and building your custom translation system. A workspace can contain multiple projects, models, and documents. All the work you do in Custom Translator is inside a specific workspace.

Workspace is private to you and the people you invite into your workspace. Uninvited people don't have access to the content of your workspace. You can invite as many people as you like into your workspace and modify or remove their access anytime. You can also create a new workspace. By default a workspace won't contain any projects or documents that are within your other workspaces.

## What is a Custom Translator project?

A project is a wrapper for a model, documents, and tests. Each project
automatically includes all documents that are uploaded into that workspace that
have the correct language pair. For example, if you have both an English to
Spanish project and a Spanish to English project, the same documents will be
included in both projects. Each project has a CategoryID associated with it
that is used when querying the [V3 API](../../reference/v3-0-translate.md?tabs=curl) for translations. CategoryID is parameter used to get translations from a customized system built with Custom Translator.

## Project categories

The category identifies the domain – the area of terminology and style you want to use – for your project. Choose the category most relevant to your documents. In some cases, your choice of the category directly influences the behavior of the Custom Translator.

We have two sets of baseline models. They're General and Technology. If the category **Technology** is selected, the Technology baseline models will be used. For any other category selection, the General baseline models are used. The Technology baseline model does well in technology domain, but it shows lower quality, if the sentences used for translation don't fall within the technology domain. We suggest customers select category Technology only if sentences fall strictly within the technology domain.

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
advantageous because it allows you to switch between languages when using the  Translator API without worrying about a CategoryID that is unique to each project.

For example, if I wanted to enable translations in the Technology domain from
English to French and from French to English, I would create two
projects: one for English -\> French, and one for French -\> English. I would
specify the same category (Technology) for both and leave the project label
blank. The CategoryID for both projects would match, so I could query the API
for both English and French translations without having to modify my CategoryID.

If you're a language service provider and want to serve
multiple customers with different models that retain the same category and
language pair, use a project label to differentiate between customers.

## Next steps

> [!div class="nextstepaction"]
> [Learn about model training](model-training.md)
