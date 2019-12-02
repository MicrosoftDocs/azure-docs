---
title: "Quickstart: Test knowledge base with batch questions"
titleSuffix: Azure Cognitive Services
description:
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: quickstart
ms.date: 11/22/2019
ms.author: diberry
---

# Quickstart: Test knowledge base with batch questions and expected answers

Use the QnA Maker batch testing tool to test your knowledge base for expected answers, confidence scores, and multi-turn prompts.

## Prerequisites

* Download the [multi-turn sample `.docx` file](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/multi-turn.docx)
* Download the [batch testing tool](https://aka.ms/qnamakerbatchtestingtool), extract the file from the `.zip` file.
* Either [create a QnA Maker service](create-publish-knowledge-base.md#create-a-new-qna-maker-knowledge-base) or use an existing service.

## Create a new knowledge base from the multi-turn .docx file

1. [Sign in](https://www.qnamaker.ai/) to the QnA Maker portal.
1. Select **Create a knowledge base** from the tool bar.
1. Skip **Step 1**, moving on to **Step 2** to select your existing service.
1. Enter the name `Multi-turn batch test quickstart` as the name of your knowledge base.
1. In **Step 4**, check **Enable multi-turn extraction from URLs, .pdf or .docx files**.
1. Enter the **Default answer text** of `Quickstart - can't find answer`.
1. Still in **Step 4**, select **+ Add file** then select the downloaded `.docx` file listing in the prerequisites.
1. In **Step 5**, select **Create your KB**.

    When the creation process finishes, the portal displays the editable knowledge base.

## Save, train, and publish knowledge base

1. Select **Save and train** from the toolbar to save the knowledge base.
1. Select **Publish** from the toolbar then select **Publish** again to publish the knowledge so that you can query the knowledge base from a public URL endpoint. Once the publish is completed, save the host URL and endpoint key information shown on the publish page.

    |Required data| Example|
    |--|--|
    |Published Host|`https://YOUR-RESOURCE-NAME.azurewebsites.net`|
    |Published Key|`XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` (32 character string shown after `Endpoint` )|
    |App ID|`e906af8d-YYYY-YYYY-YYYY-2c0ea7b1376e` (36 character string shown as part of `POST`) |

## Create batch test file with question IDs

In order to use the batch test tool, create a file named `batch-test-data-1.tsv` with a text editor. The file needs to have the following columns

|TSV input file fields|Notes|Example|
|--|--|--|
|KBID|Your KB ID found on the Publish page.|`e906af8d-YYYY-YYYY-YYYY-2c0ea7b1376e` (36 character string shown as part of `POST`) |
|Question|The question text a user would enter.|`How do I sign out?`|
|Metadata tags|optional||
|Top parameter|optional|`25`|
|Expected answer ID|optional|`13`|

For the multi-turn knowledge base, add 3 rows to the file. The first column is your knowledge base ID and the second column should be the following list of questions:

|Column 2 - questions|
|--|
|`Use Windows Hello to sign in`|
|`Sign out`|
|`Get to know Windows 10`|

These questions are the exact wording from the knowledge base and should return 100 as the confidence score. Next, add a few questions, similar to these questions but not exactly the same:

|Column 2 - questions|
|--|
|`What is Windows Hello?`|
|`How do I sign out?`|
|`What features are in Windows 10?`|

> [!CAUTION]
> Make sure that each column is separate by a tab delimiter only. Leading or trailing spaces are added to column data and will cause the program to throw exceptions when the type or size is incorrect.

## Run the test against the batch file

Run the batch testing using the following format at the command line with your published host and key, found on the **Settings** page.

The published host includes your resource name. The published key **is not** the same as your QnA Maker resource key.

```console
batchtesting.exe batch-test-data-1 https://YOUR-RESOURCE-NAME.azurewebsites.net ENDPOINT-KEY out.tsv
```

The test completes and generates the `out.tsv` file:

> [!div class="mx-imgBorder"]
> ![Output .tsv file from batch test](../media/batch-test/output-tsv-format-batch-test.png)


## Export app to get question IDs

From the **Settings** page, export the knowledge base. This file provides information you will need to create the batch test input file.

## Next steps