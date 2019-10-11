---
title: 'How To: Fulfill Commands on the client with the Speech SDK (Preview)'
titleSuffix: Azure Cognitive Services
description: In this article, handle Custom Speech Commands activities on client with the Speech SDK
services: cognitive-services
author: donkim
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 10/09/2019
ms.author: sausin
---

# How To: Connect Speech Command application as a remote skill to an existing v4 bot (Preview)

In this How To, you will connect Speech Command application as a remote skill to an existing Bot Framework v4 based bot. A knowledge about Bot Framework, building and hosting a v4 based bot and remote skills is pre-requisite to this How To.

## Get the skill manifest for your Speech Commands app
Each Speech Command application by-default is enabled as a remote skill. Meaning for each of the authored applications, a skill manifest file is generated. This skill manifest file can be used to configure an existing Bot Framework's v4 bot to start calling in to speech command application remotely.

To obtain the skill manifest of the Speech Commands application, first publish your application and then click the button "Download Skill Manifest".

## Configure and register Speech Commands app as a skill dialog to v4 bot
Based on the downloaded skill manifest file, proceed with the steps of configuring and registering speech command skill as a skill dialog.

https://microsoft.github.io/botframework-solutions/howto/skills/addskillsupportforv4bot/
	
## Route utterances of the v4 bot to Speech Commands Remote Skill
Use dispatcher of the v4 bot to route utterances to speech command skills. The dispatcher logic should be built in a way that it's referring to the same LUIS application which is configured as part of the Speech Commands application. Luis application's configuration is present as part of the skill manifest file.