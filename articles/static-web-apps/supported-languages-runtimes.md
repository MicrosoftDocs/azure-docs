---
title: Supported languages and runtimes in Azure Static Web Apps
description: Supported languages and runtimes in Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: conceptual
ms.date: 07/27/2022
ms.author: cshoe
---

# Supported languages and runtimes in Azure Static Web Apps

Azure Static Web Apps features two different places where runtime and language versions are important, on the front end and for the API.

| Runtime type | Description |
|--|--|
| **Front end** | The node.js version responsible for running the website's build steps that build the front end application. |
| **API** | The version and runtime of Azure Functions used in your web application. |

## Front end

You can specify the runtime version that builds the front end of your static web app in the [application configuration file](configuration.md).

```json
TODO: add config example here
```

## API

The APIs in Azure Static Web Apps are supported by Azure Functions. Refer to the [Azure Functions supported languages and runtimes](/azure/azure-functions/supported-languages) for details.
