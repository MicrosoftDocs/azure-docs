---
title: Local Emualtor Overview
titleSuffix: Azure App Configuration
description: Overview of Azure App Configuration emulator.
services: azure-app-configuration
author: zhiyuanliang-ms
ms.author: zhiyuanliang
ms.service: azure-app-configuration
ms.topic: overview
ms.date: 08/12/2025
#Customer intent: I want to learn about how to Azure App Configuration emulator for local development.
---

# Local Emulaotr Overview

The Azure App Configuration emulator is a local development tool that provides a lightweight implementation of the Azure App Configuration service. This emulator allows developers to test and develop applications locally without requiring an active Azure subscription or connection to the cloud service.

The Azure App Configuration emulator is open source. For more information, visit the [GitHub repo](https://github.com/Azure/AppConfiguration-Emulator).

## Feature Overview

The following table lists the features supported by the latest Azure App Configuration emulator.

Feature | Status |
------- | ------ |
**User Interface** | |
Web UI | ✅ |
**Authentication** | |
Anonymous Authentication | ✅ |
HMAC Authentication | ✅ |
Entra Id Authentication | WIP |
**REST API Endpoints** | |
`/keys` | ✅ |
`/kv` | ✅ |
`/labels` | ✅ |
`/locks` | ✅ |
`/revisions` | ✅ |
`/snapshots` | WIP |
**Integration** | |
.NET Aspire Integration | WIP |



