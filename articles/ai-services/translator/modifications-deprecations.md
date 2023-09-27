---
title: Modifications to Translator Service
description: Translator Service changes, modifications, and deprecations
services: cognitive-services
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: reference
ms.date: 07/18/2023
ms.author: lajanuar
---

# Modifications to Translator Service

Learn about Translator service changes, modification, and deprecations.

> [!NOTE]
> Looking for updates and preview announcements? Visit our [What's new](whats-new.md) page to stay up to date with release notes, feature enhancements, and our newest documentation.

## November 2022

### Changes to Translator `Usage` metrics

> [!IMPORTANT]
> **`Characters Translated`** and **`Characters Trained`** metrics are deprecated and have been removed from the Azure portal.

|Deprecated metric| Current metric(s) | Description|
|---|---|---|
|Characters Translated (Deprecated)</br></br></br></br>|**&bullet; Text Characters Translated**</br></br>**&bullet;Text Custom Characters Translated**| &bullet; Number of characters in incoming **text** translation request.</br></br> &bullet; Number of characters in incoming **custom** translation request.  |
|Characters Trained (Deprecated) | **&bullet; Text Trained Characters** | &bullet; Number of characters **trained** using text translation service.|

* In 2021, two new metrics, **Text Characters Translated** and **Text Custom Characters Translated**, were added to help with granular metrics data service usage. These metrics replaced **Characters Translated** which provided combined usage data for the general and custom text translation service.

* Similarly, the **Text Trained Characters** metric was added to replace the  **Characters Trained** metric.

* **Characters Trained** and **Characters Translated** metrics have had continued support in the Azure portal with the deprecated flag to allow migration to the current metrics. As of October 2022, Characters Trained and Characters Translated are no longer available in the Azure portal.

---
