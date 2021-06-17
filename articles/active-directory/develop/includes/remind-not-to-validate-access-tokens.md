---
title: Don't validate MS Graph tokens | Azure
description: Include file warning that MS Graph tokens don't validate.
services: active-directory
author: hpsin
manager: mmacy

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: include
ms.date: 06/17/2021
ms.author: hirsin
ms.reviewer: hirsin
ms.custom: aaddev
---

> [!NOTE]
> Don't attempt to validate tokens for APIs you don't own, including the tokens in this example.  Microsoft Graph tokens use a special format that will not validate as a JWT.