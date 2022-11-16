---
title: Modifications to Translator Service
description: Translator Service changes, modifications, and deprecations
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.topic: reference
ms.subservice: translator-text
ms.date: 11/15/2022
ms.author: lajanuar
---

# Modifications to Translator Service

Learn about Translator service changes, modification, and deprecations.

> [!NOTE]
> Looking for updates and preview announcements? Visit our [What's new](whats-new.md) page to stay up to date with release notes, feature enhancements, and newest documentation.

## November 2022

### Changes to Translator `Usage` metrics

---
 **Characters Translated** and **Characters Trained** are deprecated and have been removed from the Azure portal.

---

|Deprecated metric| Current metric(s) | Description|
|---|---|---|
|Characters Translated (Deprecated)|**&bullet; Text Characters Translated**</br></br>**&bullet;Text Custom Characters Translated**| &bullet; Number of characters in incoming **text** translation request.</br></br> &bullet; Number of characters in incoming **custom** translation request.  |
|Characters Trained (Deprecated) | **&bullet; Text Trained Characters** | &bullet; Number of characters **trained** using text translation service.|

## October 2022

### Deprecated metric

---
**Characters Translated** and **Characters Trained** are deprecated and will be removed from the Azure portal in October 2022.

---

* In 2021, two new metrics **Text Characters Translated** and **Text Custom Characters Translated** were added to help the customers with granular metrics data service usage. These metrics replaced **Characters Translated** which provided combined usage data of the general and custom text translation service.

* Similarly, the **Text Trained Characters** metric was added to replace the  **Characters Trained** metric.

* **Characters Trained** and **Characters Translated** metrics have had continued support in the Azure portal with the deprecated flag in the Azure portal to allow customers to migrate to current metrics. These metrics are now scheduled for removal from the Azure portal.
