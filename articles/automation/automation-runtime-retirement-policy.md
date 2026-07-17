---
title: Language runtime support and retirement policy for Azure Automation
description: Describes the support lifecycle and retirement policy for PowerShell, Python, and other language runtimes in Azure Automation.
services: automation
ms.subservice: process-automation
ms.date: 06/24/2026
ms.topic: concept-article
ms.service: azure-automation
ms.author: v-rochak2
author: RochakSingh-blr
# customer intent: As an Azure Automation user, I want to understand the support lifecycle and retirement policy for language runtimes so that I can plan upgrades and keep my runbooks supported.
---

# Support and retirement policy for Azure Automation language stacks

This article explains the support and retirement policy for Azure Automation language stacks such as PowerShell and Python. It helps you understand how end-of-support is determined, the runtime retirement process, its phases, and how these changes affect existing runbooks.

## Overview

Azure Automation runtime workbooks include the host component and programming language-specific workers. Language runtime support for runbooks aligns with the end-of-support for a given language. To keep your runbooks up to date and supported, Azure Automation implements a phased reduction in support as language stack versions reach their end-of-support dates. Support ends on the date that occurs first from the following:

- The community end-of-support date for the language
- The end-of-support date for the underlying base operating system

## Runtime retirement process

Azure Automation uses a two-phase retirement model that provides advance notice before retired runtime versions move to reduced support.

### Notification phase

Azure Automation sends notification emails for language versions approaching retirement that affect your runbooks. These notifications provide advance notice of upcoming changes, including the retirement timeline and its potential impact on existing runbooks. This notice period helps you prepare to use supported runtime versions before end-of-support.

### Retirement phase

> [!IMPORTANT]
> If you use Azure Automation runbooks with an unsupported runtime or language version, you might encounter issues and performance impacts. Using supported runtime versions helps ensure reliability, performance, and ongoing support.

You can still create, deploy, and run runbooks and environments that use retired language versions on the platform. However, they operate in a reduced-support state. These runbooks aren't eligible for new features, security updates, or performance optimizations until they're updated to a supported language version. In certain cases, the platform might also limit the number of instances allocated to these runbooks, including restricting scaling to one instance only.

## Related content

- Learn about [Runtime environment in Azure Automation](runtime-environment-overview.md).
- Learn how to [Manage Runtime environment and associated runbooks](manage-runtime-environment.md).
- Learn how to [Manage runbooks in Azure Automation](manage-runbooks.md).
