---
title: 'How To: Add Validations to Custom Speech Command parameters (Preview)'
titleSuffix: Azure Cognitive Services
description: In this article, add validations to Custom Speech Command parameters
services: cognitive-services
author: donkim
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 10/09/2019
ms.author: donkim
---

# How To: Add Validations to Custom Speech Command parameters (Preview)

Add a new command SetTemperature

Add a parameter Temperature
Number type
Add NumberInRange validation
Min 50, Max 90
Add prompt - "Temperature must be between 50 and 80 degrees"

Try it out
Select the "Test" panel

"Set the temperature to 65 degrees"
- "Ok, setting to 65 degrees"

"Set the temperature to 45 degrees"
- "Temperature must be between 50 and 80 degrees"