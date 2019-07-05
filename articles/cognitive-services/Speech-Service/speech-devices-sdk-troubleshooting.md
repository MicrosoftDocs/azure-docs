---
title: Troubleshoot the Speech Devices SDK - Speech Services
titleSuffix: Azure Cognitive Services
description: This article provides information to help you solve issues you might encounter when you use the Speech Devices SDK.
services: cognitive-services
author: mswellsi
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 07/05/2019
ms.author: wellsi
---
# Troubleshoot the Speech Devices SDK

This article provides information to help you solve issues you might encounter when you use the Speech Devices SDK.

## Certificate failures

If you get certificate failures when using the Speech Services, make sure that your device has the correct date and time:

1. Go to **Settings**. Under **System**, select **Date & time**.

    ![Under Settings, select Date & time](media/speech-devices-sdk/qsg-12.png)

1. Keep the **Automatic date & time** option selected. Under **Select time zone**, select your current time zone.

    ![Select date and time zone options](media/speech-devices-sdk/qsg-13.png)

    When you see that the dev kit's time matches the time on your PC, the dev kit is connected to the internet.

## Next steps

* [Review the release notes](devices-sdk-release-notes.md)
