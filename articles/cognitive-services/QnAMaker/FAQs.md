---
title: QnA Maker FAQs | Microsoft Docs
description: Get answers to the most commonly asked questions about the QnA Maker tool.
services: cognitive-services
author: pchoudhari
manager: rsrikan

ms.service: cognitive-services
ms.technology: qnamaker
ms.topic: article
ms.date: 01/04/2017
ms.author: pchoudh
---

# QnA Maker FAQs
### Who is the target audience for the QnA Maker tool?
QnA Maker provides an FAQ data source that you can query from your bot or application. Although developers will find this useful, content owners will especially benefit from this tool. QnA Maker is a completely no-code way of managing the content that powers your bot or application.

### How do I sign in to the QnA Maker portal?
You can sign in with your [Microsoft account](https://www.microsoft.com/account/).

### Is the QnA Maker Service free?
Yes, currently the QnA Maker tool is free to use. However, usage is metered for each account. For more information, see [Authentication and subscription keys](subscriptionkeys.md).

### My URLs have valid FAQ content, but the tool cannot extract them. Why not?
It’s possible that the tool can't auto-extract some question-and-answer (QnA) content from valid FAQ URLs. In such cases, you can paste the QnA content in a .txt file and see if the tool can ingest it. Alternately, you can editorially add content to your knowledge base.

### What format does the tool expect for the file content?
The tool supports the following file formats for ingestion:

- .tsv: QnA contained in the format *Question(tab)Answer*.
- .txt, .docx, .pdf: QnA contained as regular FAQ content--that is, a sequence of questions and answers.


### Do I need to use Bot Framework in order to use QnA Maker?
No, you don’t. However, QnA Maker is offered as one of several templates in [Azure Bot Service](https://azure.microsoft.com/services/bot-service/). Bot Service enables rapid intelligent bot development through Microsoft Bot Framework, and it runs in a serverless environment. 

Bots scale based on demand. You pay for only the resources that you consume.

### How do I embed the QnA Maker service in my website?
Follow these steps to embed the QnA Maker service as a web-chat control in your website:
1. Create your knowledge base from the [QnA Maker webpage](https://qnamaker.ai).
2. Create your bot as shown in [Create a bot with the Azure Bot Service](https://docs.botframework.com/en-us/azure-bots/build/first-bot/#navtitle). 
3. Look for the Question and Answer bot template. Select the knowledge base ID that you created in step 1.
4. Enable the bot on the Web Chat channel. Get the embed keys.
5. Embed the web chat as shown in [Connect a bot to Web Chat](https://docs.botframework.com/en-us/support/embed-chat-control2/#navtitle).

### What is the roadmap of QnA Maker?
Currently, the QnA Maker tool handles semi-structured FAQ content and certain types of product manuals. Eventually, the vision is to be able to answer questions from unstructured content as well.

### How large a knowledge base can I create?
Currently, the limit is a 20-MB knowledge base.

### The updates that I made to my knowledge base are not reflected on publish. Why not?
Every edit operation, whether in a table update, test, or settings, needs to be saved before it can be published. Be sure to select the **Save and retrain** button after every edit operation.

### Why can’t I replace my knowledge base with the upload feature?
The upload feature expects the file to be formatted as tab-separated columns of question, answer, and source.

### When should I refresh my subscription keys?
You should refresh your subscription keys if you suspect that they have been compromised. Any requests with your subscription key will count toward your quota.

### How safe is the data in my knowledge base?
The QnA Maker tool stores all knowledge base content in Azure Storage. You need a combination of knowledge base ID and subscription key to access the knowledge base. The tool doesn't use knowledge base content for any other purpose.

### Does the knowledge base support rich data or multimedia?
The knowledge base supports Markdown. However, the auto-extraction from URLs has limited HTML-to-Markdown conversion capability. If you want to use full-fledged Markdown, you can modify your content directly in the table, or upload a knowledge base with the rich content.

Multimedia, such as images and videos, is not supported at this time.

### Does QnA Maker support non-English languages?
The QnA Maker tool ingests and matches data in UTF-16 encoding. Any language should work as is. But, we have extensively tested the relevance of the service for English only.

If you have content from multiple languages, be sure to create a separate service for each language.

### What is the format of the downloaded chat logs?
The chat logs are tab-separated files, with the query and the frequency as the columns. Frequency is the number of times that the same query was seen. The file is sorted in descending order of frequency. Select questions from the downloaded file that you want to test, and then upload it to see what responses the system returned for them.

### Where is the test web-chat URL from the old portal? How do I share my knowledge base with others now?
The new service doesn't include the test URL. The reason is that all calls are metered, as part of Cognitive Services. Because the test URL exposed the subscription key and the knowledge base ID, it was a security risk. 

However, it's still easy to share your knowledge base and use it in chats. Check out the Azure Bot Service template for the [Question and Answer bot](https://blog.botframework.com/2016/12/13/More-Ways-to-Make-Smart-Bots/). You can create the Question and Answer bot in Skype in a few clicks, and then share it with anyone.

### How can I increase the transaction limits?
Current transaction limits are 10 calls per minute and 1,000 calls per month. If you require higher limits, a free premium tier is available with limits of 1,000 calls per minute and 500,000 calls per month. To sign up for this option, fill in the [request form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR_yh9o_uvdhPnJy8sn_XBGRUMktKRFNYME1VUkVRRVkwV0hDWUNWMVVNRC4u). Note that these tiers are subject to change when the tool goes to general availability.

### How can I change the default message when no good match is found?
If QnA Maker doesn't match any of the questions, it shows a default "Sorry, no match found" message. You can change this default message in the code-behind by using the `QnAMakerDialog` object. For more information, see [Create a bot using the Question and Answer template](https://docs.botframework.com/en-us/azure-bot-service/templates/qnamaker/#navtitle).

### Why is my SharePoint link not getting extracted?
The tool parses only public URLs and does not support authenticated data sources at this time. Alternately, you can download the file and use the file-upload option to extract questions and answers.

### How can I integrate LUIS with QnA Maker?
There is no direct integration of LUIS with QnA Maker. But, in your bot code, you can use LUIS and QnA Maker together. 
[View a sample bot](https://github.com/Microsoft/BotBuilder-CognitiveServices/blob/master/Node/samples/QnAWithLUIS/).