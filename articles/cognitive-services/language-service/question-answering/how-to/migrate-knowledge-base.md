---
title: Move projects and knowledge bases - custom question answering
description: Moving a custom question answering project requires exporting a project from one resource, and then importing into another.
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 11/02/2021
ms.custom: language-service-question-answering, ignite-fall-2021
---
# Move projects and question answer sources

> [!NOTE]
> This article deals with the process to move projects and knowledge bases from one Language resource to another.

You may want to create a copy of your project for several reasons:

* To implement a backup and restore process
* Integrate with your CI/CD pipeline
* When you wish to move your data to different regions

## Prerequisites

* If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/cognitive-services/) before you begin.
* A [language resource](https://aka.ms/create-language-resource) with the custom question answering feature enabled in the Azure portal. Remember your Azure Active Directory ID, Subscription, and language resource name you selected when you created the resource.

## Export a project

Exporting a project allows you to move or back up all the sources question answer sources that are contained within a single project.

1. Sign in to the [Language Studio](https://language.azure.com/).
1. Select the language resource you want to move a project from.
1. On the **Projects** page, you have the options to export in two formats, Excel or TSV. This will determine the contents of the file. The file itself will be exported as a .zip containing all of your knowledge bases.

## Import a project  

1. Select the language resource, which will be the destination for your previously exported project.
1. On the **Projects** page, select **Import** and choose the format used when you selected export. Then browse to the local .zip file containing your exported project. Enter a name for your newly imported project and select **Done**.

## Export question and answers

1. Select the language resource you want to move an individual question answer source from.
1. Select the project that contains the question and answer source you wish to export.
1. On the Edit knowledge base page, select the ellipsis (`...`) icon to the right of **Enable rich text** in the toolbar. You have the option to export in either Excel or TSV.

## Import question and answers

1. Select the language resource, which will be the destination for your previously exported question and answer source.
1. Select the project where you want to import a question and answer source.
1. On the Edit knowledge base page, select the ellipsis (`...`) icon to the right of **Enable rich text** in the toolbar. You have the option to import either an Excel or TSV file.
1. Browse to the local location of the file with the **Choose File** option and select **Done**.

<!-- TODO: Replace Link-->
### Test

**Test** the question answer source by selecting the **Test** option from the toolbar in the **Edit knowledge base** page which will launch the test panel. Learn how to [test your knowledge base](../../../qnamaker/How-To/test-knowledge-base.md).

### Deploy

<!-- TODO: Replace Link-->
**Deploy** the knowledge base and create a chat bot. Learn how to [deploy your knowledge base](../../../qnamaker/Quickstarts/create-publish-knowledge-base.md#publish-the-knowledge-base).

## Chat logs

There is no way to move chat logs with projects or knowledge bases. If diagnostic logs are enabled, chat logs are stored in the associated Azure Monitor resource.

## Next steps

<!-- TODO: Replace Link-->
> [!div class="nextstepaction"]
> [Edit a knowledge base](../../../qnamaker/How-To/edit-knowledge-base.md)
