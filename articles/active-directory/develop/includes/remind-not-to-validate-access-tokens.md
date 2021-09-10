---
title: Don't validate access tokens for Microsoft Graph
description: Include file warning that access tokens for Microsoft Graph should be considered opaque and should never be validated by customer code. Only Microsoft Graph validates Microsoft Graph access tokens.
services: active-directory
author: hpsin
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: include
ms.date: 06/25/2021
ms.author: hirsin
ms.reviewer: hirsin
ms.custom: aaddev
---

> [!WARNING]
> Don't attempt to validate or read tokens for any API you don't own, including the tokens in this example, in your code.  Tokens for Microsoft services can use a special format that will not validate as a JWT, and may also encrypted for consumer (Microsoft account) users. While reading tokens is a useful debugging and learning tool, do not take dependencies on this in your code or assume specifics about tokens that aren't for an API you control.
