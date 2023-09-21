---
title: "Include file"
description: "Include file"
ms.custom: "include file"
ms.topic: "include"
ms.date: 09/27/2023
---

### The time displayed in the browser is different from my local time

Web applications often display the time based on the user's location. When you run tests with Microsoft Playwright Testing, the client machine and the service browsers may be in different regions.

You can mitigate the issue by [specifying the time zone in the Playwright configuration file](https://playwright.dev/docs/emulation#locale--timezone).
