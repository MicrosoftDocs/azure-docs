---
title: "Legacy: How to search, edit, and delete project - Custom Translator"
titleSuffix: Azure Cognitive Services
description: Custom Translator provides various ways to manage your projects in efficient manner. You can create multiple projects, search based on your criteria, edit your projects. Deleting a project is also possible in Custom Translator.  
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.date: 12/06/2021
ms.author: lajanuar
ms.topic: how-to
ms.custom: cogserv-non-critical-translator
---
# Search, edit, and delete projects

Custom Translator provides multiple ways to manage your projects in efficient manner. You can create many projects, search based on your criteria, and edit your projects. Deleting a project is also possible in Custom Translator.  

## Search and filter projects

The filter tool allows you to search projects by different filter conditions. It filters like project name, status, source and target language, and category of the project.

1. Select the **filter button**.



2. You can filter by any (or all) of the following fields: project name, source language, target language, category, and project availability.

3. Select **apply**.



4. Clear the filter to view all your projects by tapping "Clear".

## Edit a project

Custom Translator gives you the ability to edit the name and description of a project. Other project metadata like the category, source language, and target language aren't available for edit. The steps below describe how to edit a project.

1. Select the **pencil icon** that appears when you hover over a project.



2. In the dialog, you can modify the project name, the description of the project, the category description, and the project label if no model is deployed. You can't modify the category or language pair once the project is created.



3. Select the **Save** button.

## Delete a project

You can delete a project when you no longer need it. Make sure the project doesn't have models in an active state such as deployed, training submitted, data processing, or deploying, otherwise, the delete operation will fail. The following steps describe how to delete a project.
1. Hover on any project record and select on the **trash bin** icon.



2. Confirm deletion. Deleting a project will delete all models that were created within that project. Deleting project won't affect your  documents.



## Next steps

- [Upload documents](how-to-upload-document.md) to start building your custom translation model.
