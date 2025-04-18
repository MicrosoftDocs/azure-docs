---
title: References - How to collect Windows audio event log
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to collect Windows audio event log.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 02/24/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# How to collect Windows audio event logs
The Windows audio event log provides information on the audio device state around the time when the issue we're investigating occurred.

To collect the audio event log:
* open Windows Event Viewer
* browse the logs in *Application and Services Logs > Microsoft > Windows > Audio > Operational*
* you can either
    * select logs within time range, right click and choose *Save Selected Events*.
    * right click on Operational, and choose *Save All Events As*.

:::image type="content" source="./media/windows-audio-event-log.png" alt-text="Screenshot of Windows Audio Event Log.":::
