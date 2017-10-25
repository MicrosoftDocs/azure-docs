---
title: Create your knowledge base for QnA content | Microsoft Docs
description: Use QnA Maker to auto-extract question and answer pairs from most FAQ URLs and documents.
services: cognitive-services
author: pchoudhari
manager: rsrikan

ms.service: cognitive-services
ms.technology: qnamaker
ms.topic: article
ms.date: 12/08/2016
ms.author: pchoudh
---

# Create your knowledge base
Creating your knowledge base is as simple as pointing the tool to the existing content, and ingesting the QnA content.

Currently the tool can auto-extract question and answer pairs from two types of input:

**FAQ pages** - We support extraction from following types of FAQ URLs:
- Plain FAQ pages: Questions are immediately followed by answers. See an [example](https://support.microsoft.com/help/17133/windows-8-bitlocker-recovery-keys-frequently-asked-questions)
- FAQ pages with section links: Questions are aggregated together and linked to answers on the same page. See an [example](http://support.xbox.com/my-account/microsoft-account/manage-your-microsoft-account-faq#0a16820105c847acb050fc1ba7dd2ad3)
- FAQ pages with linked answers: Questions are aggregated together and linked to answers on a different page. See an [example](https://www.copyright.gov/help/faq/index.html) 

We also support extraction from offline doc types (.docx, .doc, .pdf, .xlsx and .tsv). Auto-extraction works best on FAQ pages with clear Q-A structure and semantics such as question ending with "?" and question contains interrogative words such as "why", "what", "how" etc.

**Product manuals** - We support extraction of Q-As from PDF format product manuals. Manuals are typically guidance material that accompanies a product and helps the user setup, use, maintain, and troubleshoot it.  QnAMaker extracts the headings and sub-headings as questions and the proceeding content as the answer, thus creating a knowledge base from these large documents. Auto-extraction works best on manuals with a table of contents and/or an index page, and clear structure with hierarchical headings. Note that multi-media extraction is not supported at this time.

If QA pairs are not auto-extracted, there is an option to editorially add QnA pairs later. 

Follow the below steps to create a new KB.
## Step 1 - Click on Create new service

![Top navigation](../Images/myKbService.png)

## Step 2 - Add sources for your KB

![Create Kb Service](../Images/createKbService.png)

## Step 3 - Click on Create

![Create button](../Images/createKbService2.png)

That’s it, your knowledge base has been created. Now you can choose to test, update or publish.