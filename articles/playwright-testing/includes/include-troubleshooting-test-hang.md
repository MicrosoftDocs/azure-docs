---
title: "Include file"
description: "Include file"
ms.custom: "include file"
ms.topic: "include"
ms.date: 09/27/2023
---

### Tests seem to hang

Your tests might hang due to a piece of code that's unintentionally paused the test execution. For example, you might have added pause statements while debugging your test.

Search for any instances of `pause()` statements in your code and comment them out.
