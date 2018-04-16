---
title: General Data Protection Regulation (GDPR) reference | Microsoft Docs
description: Reference for General Data Protection Regulation from Language Understanding Intelligent Services (LUIS).
services: cognitive-services
author: v-geberr
manager: kaiqb 

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 05/07/2018
ms.author: v-geberr;
---

# General Data Protection Regulation (GDPR) reference

In May 2018, a European privacy law, the [General Data Protection Regulation (GDPR)](http://ec.europa.eu/justice/data-protection/reform/index_en.htm), is due to take effect. The GDPR imposes new rules on companies, government agencies, non-profits, and other organizations that offer goods and services to people in the European Union (EU), or that collect and analyze data tied to EU residents. The GDPR applies no matter where you are located.

Microsoft products and services are available today to help you meet the GDPR requirements. Read more about Microsoft Privacy policy at [Trust Center](https://www.microsoft.com/trustcenter).

Language Understanding service, LUIS, keeps customer content to operate the service but the developer/LUIS user has full control over viewing, exporting & deleting his/her data either through the [Azure portal](https://docs.microsoft.com/azure/cognitive-services/luis/luis-reference-regions) or the [authoring APIs](https://aka.ms/luis-authoring-apis).

The following customer content is encrypted and stored in Microsoft regional Azure storage:
-  User account content collected at registration. 
-  Training data required to build the models (i.e. intent & entities).
-  End-user queries logged at runtime to help improve the user models.
    -  Users can turn off query logging by appending `&log=false` to the request, details [here](luis-resources-faq.md#how-can-i-disable-the-logging-of-utterances).

> [!Note]
> All the data remains within the boundaries of the region select except for the following:
> -  Azure active directory data, beyond our control boundaries as a service.
> -  Data sent to any Bing service through enabling spell check and/or speech interface in LUIS.

## Data Deletion Control
LUIS users have full control to delete any user content:

||User account|Application|Utterances(s)|End-user queries|
|--|--|--|--|--|
|Portal|[✔](luis-how-to-account-settings.md)|[✔](create-new-app.md#delete-app)|[✔](create-new-app.md#delete-app)|[✔](create-new-app.md#delete-app)|
|APIs||[✔](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c0b)|[✔](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c0b)|[✔](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/58b6f32139e2bb139ce823c9)|

> [!Note]
> Logging is done at the application level and not the user level, which limits our ability to trace users in case of accidental deletion.

## Data Export Control
LUIS users have full control to view the data on the portal and export it through the APIs:

||User account|Application|Utterances(s)|End-user queries|
|--|--|--|--|--|
|Portal||[✔](create-new-app.md#export-app)|[✔](create-new-app.md#export-app)|[✔](create-new-app.md#export-endpoint-logs)|
|APIs|[✔](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c48)|[✔](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c40)|[✔](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c0a)|[✔](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c36)|