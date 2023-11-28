---
title: Troubleshooting - question answering
description: The curated list of the most frequently asked questions regarding question answering will help you adopt the feature faster and with better results.
ms.service: azure-ai-language
author: jboback
ms.author: jboback
ms.topic: troubleshooting
ms.date: 11/02/2021
---

# Troubleshooting for question answering

The curated list of the most frequently asked questions regarding question answering will help you adopt the feature faster and with better results.

## Manage predictions

<details>
<summary><b>How can I improve the throughput performance for query predictions?</b></summary>

**Answer**:
Throughput performance issues indicate you need to scale up your Azure AI Search. Consider adding a replica to your Azure AI Search to improve performance.

Learn more about [pricing tiers](../Concepts/azure-resources.md).
</details>

## Manage your project

<details>
<summary><b>Why is my URL(s)/file(s) not extracting question-answer pairs?</b></summary>

**Answer**:
It's possible that question answering can't auto-extract some question-and-answer (QnA) content from valid FAQ URLs. In such cases, you can paste the QnA content in a .txt file and see if the tool can ingest it. Alternately, you can editorially add content to your project through the [Language Studio portal](https://language.azure.com).

</details>

<details>
<summary><b>How large a project can I create?</b></summary>

**Answer**:
The size of the project depends on the SKU of Azure search you choose when creating the QnA Maker service. Read [here](../concepts/azure-resources.md) for more details.

</details>

<details>
<summary><b>How do I share a project with others?</b></summary>

**Answer**:
Sharing works at the level of the language resource, that is, all projects associated a language resource can be shared.
</details>

<details>
<summary><b>Can you share a project with a contributor that is not in the same Microsoft Entra tenant, to modify a project?</b></summary>

**Answer**:
Sharing is based on Azure role-based access control (Azure Role-base access control). If you can share _any_ resource in Azure with another user, you can also share question answering.

</details>

<details>
<summary><b>Can you assign read/write rights to 5 different users so each of them can access only 1 question answering project?</b></summary>

**Answer**:
You can share an entire language resource, not individual projects.

</details>

<details>
<summary><b>The updates that I made to my project are not reflected in production. Why not?</b></summary>

**Answer**:
Every edit operation, whether in a table update, test, or setting, needs to be saved before it can be deployed. Be sure to select **Save** after making changes and then re-deploy your project for those changes to be reflected in production.

</details>

<details>
<summary><b>Does the project support rich data or multimedia?</b></summary>

**Answer**:

#### Multimedia auto-extraction for files and URLs

* URLS - limited HTML-to-Markdown conversion capability.
* Files - not supported

#### Answer text in markdown

Once QnA pairs are in the project, you can edit an answer's markdown text to include links to media available from public URLs.

</details>

<details>
<summary><b>Does question answering support non-English languages?</b></summary>

**Answer**:
See more details about [supported languages](../language-support.md).

If you have content from multiple languages, be sure to create a separate project for each language.

</details>

## Manage service

<details>
<summary><b>I deleted my existing Search service. How can I fix this?</b></summary>

**Answer**:
If you delete an Azure AI Search index, the operation is final and the index cannot be recovered.

</details>

<details>
<summary><b>I deleted my `testkbv2` index in my Search service. How can I fix this?</b></summary>

**Answer**:
In case you deleted the `testkbv2` index in your Search service, you can restore the data from the last published KB. Use the recovery tool [RestoreTestKBIndex](https://github.com/pchoudhari/QnAMakerBackupRestore/tree/master/RestoreTestKBFromProd) available on GitHub.

</details>

<details>
<summary><b>Can I use the same Azure AI Search resource for projects using multiple languages?</b></summary>

**Answer**:
To use multiple language and multiple projects, the user has to create a project for each language and the first project created for the language resource has to select the option **I want to select the language when I create a project in this resource**. This will create a separate Azure search service per language.

</details>

## Integrate with other services including Bots

<details>
<summary><b>Do I need to use Bot Framework in order to use question answering?</b></summary>

**Answer**:
No, you do not need to use the [Bot Framework](https://github.com/Microsoft/botbuilder-dotnet) with question answering. However, Question answering is offered as one of several templates in [Azure AI Bot Service](/azure/bot-service/). Bot Service enables rapid intelligent bot development through Microsoft Bot Framework, and it runs in a server-less environment.

</details>

<details>
<summary><b>How can I create a new bot with question answering?</b></summary>

**Answer**:
Follow the instructions in [this](../tutorials/bot-service.md) documentation to create your Bot with Azure AI Bot Service.

</details>

<details>
<summary><b>How do I use a different project with an existing Azure AI Bot Service?</b></summary>

**Answer**:
You need to have the following information about your project:

* Project ID.
* Project's published endpoint custom subdomain name, known as `host`, found on **Settings** page after you publish.
* Project's published endpoint key - found on **Settings** page after you publish.

With this information, go to your bot's app service in the Azure portal. Under **Settings -> Configuration -> Application settings**, change those values.

The project's endpoint key is labeled `QnAAuthkey` in the ABS service.

</details>

<details>
<summary><b>Can two or more client applications share a project?</b></summary>

**Answer**:
Yes, the project can be queried from any number of clients.

</details>

<details>
<summary><b>How do I embed question answering in my website?</b></summary>

**Answer**:
Follow these steps to embed the question answering service as a web-chat control in your website:

1. Create your FAQ bot by following the instructions [here](../tutorials/bot-service.md).
2. Enable the web chat by following the steps [here](../tutorials/bot-service.md#integrate-the-bot-with-channels)

## Data storage

<details>
<summary><b>What data is stored and where is it stored?</b></summary>

**Answer**:

When you create your language resource for question answering, you selected an Azure region. Your projects and log files are stored in this region.

</details>
