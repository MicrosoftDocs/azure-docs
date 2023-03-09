---
title: Query field extraction - Form Recognizer
titleSuffix: Azure Applied AI Services
description: Use Form Recognizer to extract query field data.
author: nhaiby
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 03/07/2023
ms.author: lajanuar
monikerRange: 'form-recog-3.0.0'
recommendations: false
---
<!-- markdownlint-disable MD033 -->

# Azure Form Recognizer query field extraction

**This article applies to:** ![Form Recognizer v3.0 checkmark](media/yes-icon.png) **Form Recognizer v3.0**.

With query field extraction, you can easily extract any fields from your documents without the need for training. Simply specify the fields you want to extract and Form Recognizer will analyze the document accordingly. For instance, if you're dealing with a contract, you could pass a list of labels like "Party1, Party2, TermsOfUse, PaymentTerms, PaymentDate, TermEndDate" to Form Recognizer as part of the analyze document request. Form Recognizer will leverage the capabilities of both Azure Open AI and Form Recognizer to extract the information in the document and return the values in a structured JSON output. In addition to the query fields, the response will include text, tables, selection marks, general document key-value pairs, and other relevant data. 

To get access to this new capability request access [here](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUQTRDQUdHMTBWUDRBQ01QUVNWNlNYMVFDViQlQCN0PWcu) 

<<Image 1>>

<<Image 2>>

