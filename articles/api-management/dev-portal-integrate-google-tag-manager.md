---
title: Integrate Google Tag Manager
titleSuffix: Azure API Management
description: Learn how to plug Google Tag Manager into your managed or self-hosted developer portal.
author: erikadoyle
ms.author: apimpm
ms.date: 11/30/2020
ms.service: api-management
ms.topic: how-to
---

# Integrate Google Tag Manager

Google Tag Manager is a tag management system created by Google to manage JavaScript and HTML tags used for tracking and analytics on websites. For example, you can use Google Tag Manager to integrate Google Analytics, heatmaps, or chatbots (such as LiveChat).

Follow the steps below to plug Google Tag Manager into your managed or self-hosted developer portal.

## 1. Add Google Tag Manager package

**This step is not required for managed portals.**

Install *npm* package:
```sh
npm install @paperbits/gtm --save
```

Import and register GTM module in `stratup.publish.ts`:
```ts
import { GoogleTagManagerPublishModule } from "@paperbits/gtm/gtm.publish.module";
...
injector.bindModule(new GoogleTagManagerPublishModule());
```

## 2. Fetch site configuration

Retrieve the portal's configuration.

`GET /contentTypes/document/contentItems/configuration`

```json
{
    "nodes": [
        {
            "site": {
                "title": "Microsoft Azure API Management - developer portal",
                "description": "Discover APIs, learn how to use them, try them out interactively, and sign up to acquire keys.",
                "keywords": "Azure, API Management, API, developer",
                "faviconSourceId": null,
                "author": "Microsoft Azure API Management"
            }
        }
    ]
}
```

## 3. Extend site configuration

Extended the configuration from the previous step with Google Tag Manager configuration.

`PUT /contentTypes/document/contentItems/configuration`

```json
{
    "nodes": [
        {
            "site": { ... },
            "integration": {
                "googleTagManager": {
                    "containerId": "GTM-..."
                }
            }
        }
    ]
}
```

## Next steps

- [Move from managed to self-hosted](dev-portal-move-managed-self-hosted.md)