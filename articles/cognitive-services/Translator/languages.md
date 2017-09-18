---
title: Supported languages in the Microsoft Translator API | Microsoft Docs
description: Use the languages API method to return a list of supported languages for each of the three Microsoft Translator API language groups.
services: cognitive-services
author: chriswendt1
manager: arulm

ms.service: cognitive-services
ms.technology: translator
ms.topic: article
ms.date: 10/26/2016
ms.author: christw
---

# Supported languages

There are three groups of supported languages in the Microsoft Translator API. Text, Speech, and Text-to-speech (TTS). 
The languages API method returns the list of supported languages for each of the three groups. The languages method 
does not require an access token for authentication.

In the 'Scope' parameter of the method, add one or all three of the groups. After you have entered the scope parameters, 
select the **Try it out!** button. The service returns the supported languages in JSON format. The response is visible
in the 'Response Body' section.

[Visit the API reference to try out the languages method.](http://docs.microsofttranslator.com/languages.html)

[See the list of languages on our web site.](https://www.microsoft.com/translator/languages.aspx)
